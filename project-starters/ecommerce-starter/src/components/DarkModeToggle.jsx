// DarkModeToggle
// TODO (Day 6): Build the dark/light mode toggle button.
//
// What to build:
//   - A button that toggles dark mode on/off
//   - Show a sun icon in dark mode (clicking → light mode)
//   - Show a moon icon in light mode (clicking → dark mode)
//   - Persist the user's choice to localStorage under the key 'theme'
//
// How dark mode works in this app:
//   - tailwind.config.js uses darkMode: 'class'
//   - The 'dark' class on <html> activates dark mode
//   - index.html has an inline script that reads localStorage on page load
//     to prevent flash of wrong theme
//
// Implementation:
//   1. Read initial state from document.documentElement.classList.has('dark')
//   2. On toggle: add/remove 'dark' class from document.documentElement
//   3. Save 'dark' or 'light' to localStorage.setItem('theme', ...)

export default function DarkModeToggle() {
  // TODO: implement DarkModeToggle
  return (
    <button
      className="btn-ghost p-2 text-lg"
      aria-label="Toggle dark mode"
      title="DarkModeToggle — build me! (Day 6)"
    >
      🌙
    </button>
  )
}
