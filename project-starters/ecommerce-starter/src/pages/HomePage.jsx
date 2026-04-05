import { useState, useMemo } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import { useLocalStorage } from '../hooks/useLocalStorage'
import ProductCard from '../components/ProductCard'
import FilterBar from '../components/FilterBar'
import { ProductGridSkeleton } from '../components/ProductCardSkeleton'
import { sortProducts, filterBySearch } from '../utils/helpers'

// HomePage — route: /
// TODO (Day 2): Display a grid of products from the API.
// TODO (Day 3): Add search, category filter, and sort controls.
//
// State to manage:
//   searchQuery    — raw input (updates every keystroke)
//   debouncedSearch — 300ms debounced version (used for actual filtering)
//   category       — 'all' or a specific category name
//   sortKey        — 'default' | 'price-asc' | 'price-desc' | 'rating-desc'
//   favorites      — array of favorited product IDs (via useLocalStorage)
//
// Data to fetch:
//   products   — useFetch('https://fakestoreapi.com/products')
//   categories — useFetch('https://fakestoreapi.com/products/categories')
//
// Derived state (useMemo):
//   displayedProducts — products filtered by category + search, then sorted
//
// What to render:
//   1. <FilterBar> with all filter props
//   2. Loading: <ProductGridSkeleton count={12} />
//   3. Error: error message + "Try again" button (calls refetch)
//   4. Empty results: "No products found" + "Clear filters" button
//   5. Grid: <ProductCard> for each displayed product

export default function HomePage() {
  const { data: products, loading: loadingProducts, error: productsError, refetch } =
    useFetch('https://fakestoreapi.com/products')

  const { data: categories } =
    useFetch('https://fakestoreapi.com/products/categories')

  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sortKey, setSortKey] = useState('default')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const [favorites, setFavorites] = useLocalStorage('shopexplorer-favorites', [])

  function toggleFavorite(productId) {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // TODO (Day 3): build the filter pipeline inside useMemo
  const displayedProducts = useMemo(() => {
    if (!products) return []
    let result = [...products]
    if (category !== 'all') result = result.filter(p => p.category === category)
    result = filterBySearch(result, debouncedSearch)
    result = sortProducts(result, sortKey)
    return result
  }, [products, category, debouncedSearch, sortKey])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
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
        {/* TODO (Day 2): add error state */}
        {productsError && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 mb-4">{productsError.message}</p>
            <button onClick={refetch} className="btn-primary">Try again</button>
          </div>
        )}

        {/* TODO (Day 7): replace with skeleton loading */}
        {loadingProducts && !productsError && (
          <ProductGridSkeleton count={12} />
        )}

        {/* TODO (Day 3): add empty-filter state */}
        {!loadingProducts && !productsError && displayedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No products found.</p>
            <button
              onClick={() => { setSearchQuery(''); setCategory('all') }}
              className="btn-primary"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Product grid — TODO (Day 2): build ProductCard */}
        {!loadingProducts && !productsError && displayedProducts.length > 0 && (
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
