/*
  Sidebar — Left navigation panel.

  TODO (Day 1): Build the full sidebar.

  Props:
    isOpen:      boolean       — mobile: whether the overlay is visible
    activeNav:   string        — which nav item is currently selected
    onNavChange: (id) => void  — called when a nav item is clicked
    onClose:     () => void    — called when the mobile backdrop is clicked

  What to build:
    - Brand logo/name at the top
    - Navigation items: Dashboard, Analytics, Orders, Users, Products, Settings
      Each item: icon (SVG) + label, highlighted when id === activeNav
    - Mobile overlay pattern:
        • A semi-transparent backdrop (bg-black/50) behind the sidebar
        • Clicking the backdrop calls onClose
        • Sidebar translates in/out: `-translate-x-full` when closed, `translate-x-0` when open
    - User profile at the bottom (avatar + name + role)
    - Always visible on lg+ (lg:static lg:translate-x-0)

  Key decisions to understand before implementing:
    WHY translate (not display:none) for open/close:
    Translate animates smoothly with CSS transitions.
    display:none would just flash — no animation possible.

    WHY `aria-current="page"` on the active item:
    Screen readers use this attribute to announce which page is current.
    Without it, keyboard users can't tell which nav item is selected.
*/

interface SidebarProps {
  isOpen: boolean
  activeNav: string
  onNavChange: (id: string) => void
  onClose: () => void
}

export default function Sidebar({ isOpen, activeNav, onNavChange, onClose }: SidebarProps) {
  // TODO: implement full sidebar
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          flex flex-col
          transition-transform duration-250
          lg:static lg:translate-x-0 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo placeholder */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            D
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">DataPulse</span>
        </div>

        {/* Nav placeholder */}
        <nav className="flex-1 px-3 py-4">
          <p className="px-3 mb-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Menu
          </p>
          {['dashboard', 'analytics', 'orders', 'users', 'products', 'settings'].map(id => (
            <button
              key={id}
              onClick={() => { onNavChange(id); onClose() }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150 text-left capitalize mb-0.5
                ${activeNav === id
                  ? 'bg-brand-50 dark:bg-brand-600/10 text-brand-600 dark:text-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}
              `}
              aria-current={activeNav === id ? 'page' : undefined}
            >
              <span className="w-5 h-5 text-center opacity-60">·</span>
              {id}
              {activeNav === id && (
                <span className="ml-auto text-xs text-gray-400 italic">build me! (Day 1)</span>
              )}
            </button>
          ))}
        </nav>

        {/* User profile placeholder */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600
                            flex items-center justify-center text-white text-xs font-bold">
              DK
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Dinesh Kumar</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
