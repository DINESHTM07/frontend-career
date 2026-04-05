/*
  Header.tsx — Top bar showing page context, notifications, and user controls.

  RESPONSIBILITIES:
  - Hamburger menu toggle (mobile only — hidden on lg+)
  - Current page title
  - Today's date display
  - Notification bell (visual only, badge count)
  - Dark mode toggle
  - User avatar + name

  WHY pass `title` as a prop (not derive from router):
  No React Router in this app — activeNav in Dashboard drives the title.
  If routing were added, replace the prop with `useLocation()` + a title map.
*/

import DarkModeToggle from '../ui/DarkModeToggle'

interface HeaderProps {
  title: string
  onMenuClick: () => void
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between
                       px-4 sm:px-6 py-4
                       bg-white dark:bg-gray-900
                       border-b border-gray-200 dark:border-gray-800">

      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-4">
        {/*
          WHY lg:hidden: On large screens the sidebar is always visible,
          so the hamburger is unnecessary. On mobile it's needed to open the
          sidebar overlay.
        */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100
                     dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800
                     transition-colors lg:hidden"
          aria-label="Open navigation menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
            {title}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            {today}
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications bell */}
        <button
          className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100
                     dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800
                     transition-colors"
          aria-label="Notifications (3 unread)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {/* Badge */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
        </button>

        <DarkModeToggle />

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600
                          flex items-center justify-center text-white text-xs font-bold">
            DK
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
            Dinesh
          </span>
        </div>
      </div>
    </header>
  )
}
