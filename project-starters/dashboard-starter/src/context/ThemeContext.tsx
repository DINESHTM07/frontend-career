import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Theme } from '../types'

/*
  ThemeContext — Context API for dark/light mode.

  TODO (Day 6): This is a minimal working stub so the app renders.
  Implement the full version:
    1. Read initial theme from localStorage ('dashboard-theme' key)
       AND fall back to OS preference (window.matchMedia)
    2. useEffect: add/remove 'dark' class on document.documentElement
    3. useEffect: save preference to localStorage on change
    4. Make toggleTheme() flip between 'light' and 'dark'

  WHY Context API (not Zustand):
  Theme is a single boolean — no complex derived state or multi-step actions.
  Context is the React-idiomatic solution for cross-cutting values like theme,
  locale, and auth status.

  WHY isDark matters for Recharts:
  Recharts renders SVG — Tailwind dark: variants don't work on SVG elements.
  Chart components read isDark from this context and pass hex colors to SVG
  props (stroke, fill, tick.fill) directly. Without Context, there'd be no
  way for charts to react to theme changes.
*/

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // TODO: initialize from localStorage + OS preference (lazy init function)
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // TODO: add/remove 'dark' class on document.documentElement
    // TODO: save to localStorage.setItem('dashboard-theme', theme)
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  function toggleTheme() {
    // TODO: implement — flip between 'light' and 'dark'
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme() must be used inside <ThemeProvider>')
  return ctx
}
