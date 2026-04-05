import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Theme } from '../types'

/*
  ThemeContext — Context API implementation for dark/light mode.

  WHY Context API (not Zustand) for theme:
  Theme is a single global boolean with no complex actions. Context is the
  React-idiomatic solution for simple cross-cutting values like theme, locale,
  and auth status. Adding Zustand for this one value would be overkill.

  COMPARISON with ecommerce-complete's approach:
  That app toggles the 'dark' class directly in DarkModeToggle.
  Here we use Context so ANY component can read the theme and render
  theme-aware colors (e.g., Recharts needs the theme to pick axis label colors).
  If theme were just a class toggle, chart components couldn't react to it.

  WHY `() => {...}` initializer for useState (lazy init):
  The initializer function runs ONCE on mount. Without it, localStorage
  would be read on every render. Lazy init avoids that repeated work.
*/

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
}

// WHY null default: Forces correct usage — if a component calls useTheme()
// outside ThemeProvider, it gets a clear error, not silent undefined behavior.
const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Read stored preference first, then fall back to OS preference
    const stored = localStorage.getItem('dashboard-theme') as Theme | null
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    /*
      WHY manipulate document.documentElement (not document.body):
      Tailwind's darkMode: 'class' checks for the 'dark' class on <html>.
      Adding it to <body> would not trigger Tailwind dark variants.
    */
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('dashboard-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Custom hook to consume ThemeContext.
 * Throws a clear error if used outside ThemeProvider — much better DX than
 * a silent null crash three components deep.
 */
export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme() must be used inside <ThemeProvider>')
  return ctx
}
