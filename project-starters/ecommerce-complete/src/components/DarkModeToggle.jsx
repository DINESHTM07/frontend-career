import { useState, useEffect } from 'react'

/*
  WHY this component manages its own state (not global state):
  Dark mode is a UI concern — it affects CSS classes on the <html> element.
  It doesn't need to be in the cart store (Zustand) or a Context.
  We read from localStorage directly to stay in sync with the <script>
  in index.html that applies the initial theme before React renders.

  HOW dark mode works end-to-end:
  1. index.html <script>: Reads localStorage, adds 'dark' class to <html> immediately
     → Prevents flash of wrong theme on page load
  2. This component: Reads the same localStorage value to show the correct icon
  3. On toggle: Adds/removes 'dark' class on document.documentElement + saves to localStorage
  4. Tailwind: dark:* classes activate when 'dark' class is on <html>

  WHY not a global context for dark mode:
  Only ONE component (DarkModeToggle) writes the theme.
  Many components READ it — but they read it via Tailwind's dark: prefix, not React state.
  There's no reason to put it in React state at all, except to show the correct icon.
*/
export default function DarkModeToggle() {
  // Initialize from localStorage/DOM — stays in sync with index.html script
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  )

  function toggleTheme() {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    // Apply to DOM — Tailwind reads 'dark' class on <html>
    document.documentElement.classList.toggle('dark', newIsDark)

    // Persist so the index.html script can read it on next page load
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl text-gray-600 dark:text-gray-400
                 hover:text-gray-900 dark:hover:text-white
                 hover:bg-gray-100 dark:hover:bg-gray-800
                 transition-all duration-200"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? (
        /* Sun icon for dark mode (click to go light) */
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        /* Moon icon for light mode (click to go dark) */
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  )
}
