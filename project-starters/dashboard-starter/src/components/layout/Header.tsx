import DarkModeToggle from '../ui/DarkModeToggle'

/*
  Header — Top bar: page title, notifications, dark mode toggle, user info.

  TODO (Day 1): Build the full header.

  Props:
    title:       string        — current page name ("Dashboard", "Orders", etc.)
    onMenuClick: () => void    — opens the mobile sidebar overlay

  What to build:
    Left side:
      - Hamburger button (lg:hidden — only on mobile): calls onMenuClick
      - Page title (h1) + today's date subtitle (hidden on mobile)
    Right side:
      - Notification bell button (with a small red dot badge for unread count)
      - <DarkModeToggle /> component
      - User avatar + name (avatar only on mobile, name + avatar on sm+)
      - Divider between theme toggle and user avatar

  Styling hints:
    - `sticky top-0 z-10` keeps the header visible while main content scrolls
    - `bg-white dark:bg-gray-900` + border-b for visual separation
    - Use `new Date().toLocaleDateString('en-US', { weekday: 'long', ... })` for the date
*/

interface HeaderProps {
  title: string
  onMenuClick: () => void
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  // TODO: implement full header
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between
                       px-4 sm:px-6 py-4
                       bg-white dark:bg-gray-900
                       border-b border-gray-200 dark:border-gray-800">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100
                     dark:text-gray-400 dark:hover:bg-gray-800 transition-colors lg:hidden"
          aria-label="Open navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{title}</h1>
          <p className="text-xs text-gray-400 italic hidden sm:block">Header — build me! (Day 1)</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <DarkModeToggle />
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600
                        flex items-center justify-center text-white text-xs font-bold ml-2">
          DK
        </div>
      </div>
    </header>
  )
}
