import SearchBar from './SearchBar'

/*
  WHY FilterBar is a separate component from the page:
  The filtering logic (categories, sort options) is complex enough to warrant
  its own component. The HomePage becomes much cleaner when it just renders
  <FilterBar> and passes callback props. If we need to add more filters (price
  range, rating threshold), we only touch FilterBar.

  Props:
  - searchQuery: controlled value for the search input
  - onSearchChange: called when search input changes (raw value, not debounced)
  - category: selected category ('all' or a category name)
  - onCategoryChange: called when category dropdown changes
  - sortKey: current sort selection
  - onSortChange: called when sort dropdown changes
  - categories: string[] of category names from the API
  - resultCount: number of products after filtering (for the results label)
*/
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
  const sortOptions = [
    { value: 'default',      label: 'Default' },
    { value: 'price-asc',    label: 'Price: Low to High' },
    { value: 'price-desc',   label: 'Price: High to Low' },
    { value: 'rating-desc',  label: 'Top Rated' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-20">
      {/*
        WHY sticky top-16: The Navbar is 64px (h-16) tall. This bar sticks
        just below the navbar so filters are always accessible while scrolling.
        z-20 keeps it above product cards but below the cart drawer (z-30).
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

        {/* Main filter row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

          {/* Search — takes up remaining space on larger screens */}
          <div className="w-full sm:flex-1 sm:max-w-xs">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
            />
          </div>

          {/* Category filter */}
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="input-field w-full sm:w-auto sm:min-w-[180px]"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {/* Capitalize for display */}
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value)}
            className="input-field w-full sm:w-auto sm:min-w-[200px]"
            aria-label="Sort products"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Results count — shown below filters */}
        {resultCount !== undefined && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {resultCount === 0
              ? 'No products found'
              : `${resultCount} product${resultCount === 1 ? '' : 's'} found`}
          </p>
        )}
      </div>
    </div>
  )
}
