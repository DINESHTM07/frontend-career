import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { useLocalStorage } from '../hooks/useLocalStorage'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/ProductCardSkeleton'

// FavoritesPage — route: /favorites
// TODO (Day 6): Build the favorites/wishlist page.
//
// Why fetch ALL products (not individual fetches per favorite):
//   FakeStoreAPI doesn't have a "fetch by IDs" endpoint. Fetching all products
//   is cached by useFetch from the homepage visit, so it's instant on revisit.
//
// What to build:
//   1. Page header: "Your Favorites" + item count + "Clear all" button
//   2. Loading state: <ProductGridSkeleton count={4} />
//   3. Error state: error message
//   4. Empty state: heart icon + "No favorites yet" + link to browse
//   5. Favorites grid: <ProductCard> for each favorited product
//
// Hints:
//   - const [favorites, setFavorites] = useLocalStorage('shopexplorer-favorites', [])
//   - Filter allProducts to only those whose id is in favorites
//   - Use useMemo for the filter so it doesn't recompute on every render

export default function FavoritesPage() {
  const { data: allProducts, loading, error } =
    useFetch('https://fakestoreapi.com/products')

  const [favorites, setFavorites] = useLocalStorage('shopexplorer-favorites', [])

  function toggleFavorite(productId) {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // TODO (Day 6): filter allProducts to only those in favorites
  const favoriteProducts = useMemo(() => {
    if (!allProducts) return []
    return allProducts.filter(p => favorites.includes(p.id))
  }, [allProducts, favorites])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TODO (Day 6): build page header with item count and "Clear all" */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Favorites</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {favorites.length > 0
                ? `${favorites.length} saved item${favorites.length === 1 ? '' : 's'}`
                : 'Nothing saved yet'}
            </p>
          </div>
          {favorites.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all favorites?')) setFavorites([])
              }}
              className="text-sm text-red-500 hover:text-red-600 hover:underline transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {loading && <ProductGridSkeleton count={4} />}

        {error && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            Failed to load products: {error.message}
          </div>
        )}

        {/* TODO (Day 6): build the empty state UI */}
        {!loading && !error && favorites.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🤍</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No favorites yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm max-w-sm mx-auto">
              Click the heart icon on any product to save it here.
            </p>
            <Link to="/" className="btn-primary">Browse Products</Link>
          </div>
        )}

        {/* Favorites grid */}
        {!loading && !error && favoriteProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favoriteProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
