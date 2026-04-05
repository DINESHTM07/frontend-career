// Navbar
// TODO (Day 1): Build the top navigation bar.
//
// Props:
//   onCartOpen: () => void  — called when the cart icon is clicked
//
// What to build:
//   - Fixed/sticky bar at the top of the page
//   - Left side: Logo (🛍️ ShopExplorer) linking to "/"
//   - Right side:
//       • Link to "/favorites" (heart icon + label)
//       • Cart icon button that calls onCartOpen
//       • Cart item count badge (read from useCartStore)
//       • DarkModeToggle component
//   - Responsive: hide text labels on mobile, show on sm+
//
// Hints:
//   - Use <Link> from react-router-dom for navigation
//   - Read cart count: const count = useCartStore(state => state.getTotalItems())
//   - The count badge should only show when count > 0

export default function Navbar({ onCartOpen }) {
  // TODO: implement Navbar
  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
      <span className="font-bold text-lg text-brand-600">🛍️ ShopExplorer</span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400 italic">Navbar — build me! (Day 1)</span>
        <button
          onClick={onCartOpen}
          className="btn-ghost p-2"
          aria-label="Open cart"
        >
          🛒
        </button>
      </div>
    </nav>
  )
}
