import { useTheme } from '../../context/ThemeContext'

/*
  DarkModeToggle — Sun/moon button that reads and writes ThemeContext.

  TODO (Day 6): Improve this stub into a polished toggle.

  What to build:
    - Button that calls toggleTheme() on click
    - Shows sun icon ☀️ when in dark mode (clicking → light)
    - Shows moon icon 🌙 when in light mode (clicking → dark)
    - aria-label: "Switch to light mode" / "Switch to dark mode"
    - aria-pressed={isDark} for screen readers

  WHY read from Context (not localStorage directly):
  Context is the React source of truth. If you read localStorage directly
  in the component, the icon could be stale after a toggle because
  localStorage reads don't trigger re-renders.
*/

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme()

  // TODO: replace with proper sun/moon SVG icons
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100
                 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800
                 transition-colors duration-200"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      title="DarkModeToggle — improve me! (Day 6)"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
