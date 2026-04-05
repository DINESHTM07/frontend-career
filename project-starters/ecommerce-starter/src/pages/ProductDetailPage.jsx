import { useParams, Link, useNavigate } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useCartStore } from '../store/cartStore'
import { formatCurrency, getCategoryColor, titleCase } from '../utils/helpers'

// ProductDetailPage — route: /product/:id
// TODO (Day 4): Build the full product detail view.
//
// Data to fetch:
//   - useFetch(`https://fakestoreapi.com/products/${id}`) — this product
//   - useFetch('https://fakestoreapi.com/products') — for related products
//
// What to build:
//   1. Loading state: skeleton placeholders (animate-pulse divs)
//   2. Error state: "Product not found" message + "Back to products" button
//   3. Breadcrumb nav: Products / Category / Product title
//   4. Two-column layout (stacks on mobile):
//      Left:  product image in a card
//      Right: category badge, title, star rating, price, description,
//             Add to Cart button, favorite button, trust badges
//   5. Related products section (same category, exclude current, max 4)
//   6. Back button (navigate(-1))
//
// Hints:
//   - const { id } = useParams()
//   - const addItem = useCartStore(state => state.addItem)
//   - const isInCart = useCartStore(state => state.isInCart(parseInt(id)))
//   - Related products: allProducts?.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4)

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: product, loading, error } =
    useFetch(`https://fakestoreapi.com/products/${id}`)

  const { data: allProducts } =
    useFetch('https://fakestoreapi.com/products')

  const addItem = useCartStore(state => state.addItem)
  const isInCart = useCartStore(state => state.isInCart(parseInt(id)))

  const [favorites, setFavorites] = useLocalStorage('shopexplorer-favorites', [])
  const productId = parseInt(id)
  const isFavorite = favorites.includes(productId)

  function toggleFavorite() {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(fid => fid !== productId)
        : [...prev, productId]
    )
  }

  const relatedProducts = allProducts
    ?.filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4) || []

  // TODO (Day 7): replace with proper skeleton loading UI
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="skeleton h-4 w-48 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="skeleton h-96 rounded-2xl" />
            <div className="space-y-4">
              <div className="skeleton h-6 w-32 rounded" />
              <div className="skeleton h-8 w-full rounded" />
              <div className="skeleton h-10 w-32 rounded" />
              <div className="skeleton h-12 flex-1 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Product not found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error.message}</p>
        <button onClick={() => navigate('/')} className="btn-primary">Back to products</button>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TODO (Day 4): build breadcrumb navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-brand-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900 dark:text-white truncate max-w-xs">{product.title}</span>
        </nav>

        {/* TODO (Day 4): build the two-column product layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="card p-8 flex items-center justify-center min-h-[380px]">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-80 max-w-full object-contain"
            />
          </div>

          <div className="flex flex-col gap-4">
            <span className={`badge ${getCategoryColor(product.category)} self-start`}>
              {titleCase(product.category)}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.title}</h1>

            {/* TODO (Day 4): add star rating row */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              ⭐ {product.rating.rate} ({product.rating.count} reviews)
              <span className="ml-2 text-xs italic text-gray-400">— build star rating (Day 4)</span>
            </div>

            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(product.price)}
            </p>

            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* TODO (Day 5): wire up Add to Cart button */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => addItem(product)}
                className="btn-primary flex-1 py-3"
              >
                {isInCart ? 'Add Another' : 'Add to Cart'}
              </button>
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-lg border-2 transition-all
                  ${isFavorite
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500'
                    : 'border-gray-200 dark:border-gray-700 text-gray-400'}`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        </div>

        {/* TODO (Day 4): build related products section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              More in {titleCase(product.category)}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map(related => (
                <Link key={related.id} to={`/product/${related.id}`} className="card p-4 group">
                  <div className="h-32 flex items-center justify-center mb-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2">
                    <img
                      src={related.image}
                      alt={related.title}
                      className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">{related.title}</p>
                  <p className="text-sm font-bold text-brand-600 dark:text-brand-400">{formatCurrency(related.price)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12">
          <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-2">
            ← Back
          </button>
        </div>
      </div>
    </div>
  )
}
