import { useState, useMemo } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import { useLocalStorage } from '../hooks/useLocalStorage'
import ProductCard from '../components/ProductCard'
import FilterBar from '../components/FilterBar'
import { ProductGridSkeleton } from '../components/ProductCardSkeleton'
import { sortProducts, filterBySearch } from '../utils/helpers'

/*
  HomePage: The main product listing page.

  STATE ARCHITECTURE:
  This page manages several interdependent state values:
  - searchQuery:  raw input value (updates on every keystroke)
  - debouncedSearch: 300ms debounced version (used for actual filtering)
  - category: selected category filter ('all' or a category name)
  - sortKey: current sort selection
  - favorites: array of favorited product IDs, persisted to localStorage

  WHY manage favorites here (not in Zustand):
  Favorites don't affect the cart or other app sections. They're a local
  UI preference. Keeping them in a component + useLocalStorage is simpler
  than adding another Zustand store.

  WHY useMemo for filtered/sorted products:
  Without useMemo, the filter+sort runs on EVERY render (keystroke, state change).
  With useMemo, it only runs when products/search/category/sort actually change.
  For 20 products it's negligible, but this is the correct practice for lists.
*/
export default function HomePage() {
  // ─── Data Fetching ────────────────────────────────────────────────────────
  const { data: products, loading: loadingProducts, error: productsError, refetch } =
    useFetch('https://fakestoreapi.com/products')

  const { data: categories, loading: loadingCategories } =
    useFetch('https://fakestoreapi.com/products/categories')

  // ─── Filter State ─────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sortKey, setSortKey] = useState('default')

  // WHY debounce the search: We don't want to re-filter on every keystroke.
  // 300ms is the standard — fast enough to feel responsive, slow enough to batch keystrokes.
  const debouncedSearch = useDebounce(searchQuery, 300)

  // ─── Favorites ───────────────────────────────────────────────────────────
  const [favorites, setFavorites] = useLocalStorage('shopexplorer-favorites', [])

  function toggleFavorite(productId) {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // ─── Computed / Derived State ─────────────────────────────────────────────
  /*
    WHY useMemo with all three dependencies:
    The filter pipeline is: all products → filter by category → search filter → sort.
    We re-run this when ANY of the inputs change. This ensures the displayed
    products are always in sync with the current filters without extra fetches.
  */
  const displayedProducts = useMemo(() => {
    if (!products) return []

    let result = [...products]

    // Step 1: Filter by category
    if (category !== 'all') {
      result = result.filter(p => p.category === category)
    }

    // Step 2: Filter by search query (uses the debounced value)
    result = filterBySearch(result, debouncedSearch)

    // Step 3: Sort
    result = sortProducts(result, sortKey)

    return result
  }, [products, category, debouncedSearch, sortKey])

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Filter bar — sticky below navbar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
        sortKey={sortKey}
        onSortChange={setSortKey}
        categories={categories || []}
        resultCount={loadingProducts ? undefined : displayedProducts.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Error state */}
        {productsError && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full
                            flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load products
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
              {productsError.message}
            </p>
            <button onClick={refetch} className="btn-primary">
              Try again
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loadingProducts && !productsError && (
          <ProductGridSkeleton count={12} />
        )}

        {/* Empty search/filter result */}
        {!loadingProducts && !productsError && displayedProducts.length === 0 && products?.length > 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setCategory('all') }}
              className="btn-primary"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Product grid */}
        {!loadingProducts && !productsError && displayedProducts.length > 0 && (
          /*
            WHY this specific grid: 4 columns on xl+, 3 on lg, 2 on sm, 1 on mobile.
            This is the e-commerce standard. Products are narrow enough for 4 across
            on large screens but need breathing room on small screens.
          */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
