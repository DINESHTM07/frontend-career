import { useTheme } from '../../context/ThemeContext'

/*
  DarkModeToggle.tsx — Sun/moon button that reads/writes ThemeContext.

  WHY this component reads from Context (not direct localStorage):
  Context is the React source of truth. Reading localStorage directly
  in a component would bypass React's re-render cycle — the button icon
  would be stale after a toggle. Context ensures the icon always matches
  the actual theme state.

  WHY a toggle button instead of a checkbox:
  Toggle buttons have a single clear action. Checkboxes need a label
  that clearly states the state being toggled, which is awkward for icons.
  We use aria-pressed to communicate the current state to screen readers.
*/

export default function DarkModeToggle() {
  const { isDark, toggleTheme, theme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg
                 text-gray-500 hover:text-gray-700 hover:bg-gray-100
                 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800
                 transition-all duration-200"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      title={`Currently ${theme} mode — click to toggle`}
    >
      {isDark ? (
        // Sun icon — shown in dark mode (clicking switches to light)
        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.772 17.303a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 5.106a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591z" />
        </svg>
      ) : (
        // Moon icon — shown in light mode (clicking switches to dark)
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  )
}
