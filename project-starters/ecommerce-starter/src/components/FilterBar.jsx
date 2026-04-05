// FilterBar
// TODO (Day 3): Build the search + filter + sort toolbar.
//
// Props:
//   searchQuery:      string         — current raw search input value
//   onSearchChange:   (val) => void  — called on every keystroke
//   category:         string         — selected category ('all' or a name)
//   onCategoryChange: (val) => void  — called when category changes
//   sortKey:          string         — current sort ('default' | 'price-asc' | 'price-desc' | 'rating-desc')
//   onSortChange:     (val) => void  — called when sort changes
//   categories:       string[]       — list of category names from the API
//   resultCount:      number|undefined — shown as "X products" (undefined = loading)
//
// What to build:
//   - A sticky bar just below the Navbar
//   - SearchBar component (left side)
//   - Category dropdown <select> (middle) — "All Categories" + one option per category
//   - Sort dropdown <select> (right) — default, price low→high, price high→low, top rated
//   - Result count display: "20 products" or "3 of 20" after filtering
//
// Hints:
//   - Use the .input-field CSS class for the select elements
//   - titleCase() from utils/helpers capitalizes category names

export default function FilterBar({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  sortKey,
  onSortChange,
  categories,
  resultCount,
}) {
  // TODO: implement FilterBar
  return (
    <div className="sticky top-[57px] z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search products…"
          className="input-field max-w-xs"
        />
        <span className="text-sm text-gray-400 italic">
          FilterBar — add category + sort dropdowns (Day 3)
        </span>
        {resultCount !== undefined && (
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {resultCount} products
          </span>
        )}
      </div>
    </div>
  )
}
