import { Link, useLocation } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import DarkModeToggle from './DarkModeToggle'

/*
  Navbar: Fixed top navigation with branding, nav links, dark mode, and cart button.

  WHY sticky top-0 z-30: The navbar must stay visible while scrolling so
  users always have access to the cart and navigation.
  z-30 ensures it sits above the FilterBar (z-20) and content, but below
  the CartDrawer overlay (z-40).

  Props:
  - onCartOpen: () => void — called when cart icon is clicked
*/
export default function Navbar({ onCartOpen }) {
  // Only subscribe to cart count — not the full cart state.
  // WHY: Subscribing to the full items array would re-render Navbar every time
  // any item's quantity changes. We only need the count for the badge.
  const totalItems = useCartStore(state => state.getTotalItems())

  const location = useLocation()

  function isActive(path) {
    return location.pathname === path
  }

  return (
    <nav className="sticky top-0 z-30 bg-white dark:bg-gray-900
                    border-b border-gray-200 dark:border-gray-700
                    backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full
                      flex items-center justify-between gap-4">

        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 flex-shrink-0 group"
          aria-label="ShopExplorer home"
        >
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center
                          group-hover:bg-brand-700 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">
            ShopExplorer
          </span>
        </Link>

        {/* Navigation links (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" active={isActive('/')}>Products</NavLink>
          <NavLink to="/favorites" active={isActive('/favorites')}>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Favorites
            </span>
          </NavLink>
        </div>

        {/* Right side: dark mode + cart */}
        <div className="flex items-center gap-1 sm:gap-2">
          <DarkModeToggle />

          {/* Cart button with badge */}
          <button
            onClick={onCartOpen}
            className="relative p-2 rounded-xl text-gray-600 dark:text-gray-400
                       hover:text-gray-900 dark:hover:text-white
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       transition-all duration-200"
            aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            {/* Cart badge — only shown when cart has items */}
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5
                               w-4 h-4 bg-brand-600 text-white text-[10px] font-bold
                               rounded-full flex items-center justify-center
                               ring-2 ring-white dark:ring-gray-900">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          {/* Mobile favorites link */}
          <Link
            to="/favorites"
            className="p-2 rounded-xl text-gray-600 dark:text-gray-400
                       hover:text-gray-900 dark:hover:text-white
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       transition-all duration-200 md:hidden"
            aria-label="Favorites"
          >
            <svg className="w-5 h-5" fill={isActive('/favorites') ? 'currentColor' : 'none'}
                 stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* Inline sub-component for nav links — too small to deserve its own file */
function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${active
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
    >
      {children}
    </Link>
  )
}
