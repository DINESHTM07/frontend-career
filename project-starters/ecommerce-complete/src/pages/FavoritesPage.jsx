import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { useLocalStorage } from '../hooks/useLocalStorage'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/ProductCardSkeleton'

/*
  FavoritesPage: Shows products the user has marked as favorites.

  WHY useFetch all products (not individual fetches per favorite):
  If the user has 10 favorites, we'd need 10 API calls. FakeStoreAPI doesn't
  support a "fetch by IDs" endpoint. So we fetch all products (already cached
  from the homepage visit) and filter to just the favorited ones.
  The useFetch cache makes this instant if the user visited the homepage first.
*/
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

  // Filter all products to only the favorited ones
  const favoriteProducts = useMemo(() => {
    if (!allProducts) return []
    return allProducts.filter(p => favorites.includes(p.id))
  }, [allProducts, favorites])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Favorites
            </h1>
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
              className="text-sm text-red-500 hover:text-red-600 dark:text-red-400
                         hover:underline transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && <ProductGridSkeleton count={4} />}

        {/* Error */}
        {error && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            Failed to load products: {error.message}
          </div>
        )}

        {/* Empty favorites state */}
        {!loading && !error && favorites.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full
                            flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm max-w-sm mx-auto">
              Click the heart icon on any product to save it here for later.
            </p>
            <Link to="/" className="btn-primary">
              Browse Products
            </Link>
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
