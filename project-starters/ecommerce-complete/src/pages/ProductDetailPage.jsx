import { useParams, Link, useNavigate } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useCartStore } from '../store/cartStore'
import { formatCurrency, getRatingStars, getCategoryColor, titleCase } from '../utils/helpers'

/*
  ProductDetailPage: Full product view at /product/:id

  WHY React Router's useParams:
  The URL is the source of truth for which product to show.
  useParams reads the dynamic :id segment from the URL.
  This means the page is shareable (copy/paste URL → correct product),
  bookmarkable, and navigable with browser back/forward.

  WHY fetch on this page instead of using router state:
  We could pass the product via router state (navigate('/product/1', { state: product })).
  But then refreshing the page would lose the state. Fetching by ID ensures
  the page works correctly whether you arrived via navigation or direct URL.
*/
export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Fetch just this one product
  const { data: product, loading, error } =
    useFetch(`https://fakestoreapi.com/products/${id}`)

  // Fetch all products to show "More in this category"
  const { data: allProducts } =
    useFetch('https://fakestoreapi.com/products')

  // Cart
  const isInCart = useCartStore(state => state.isInCart(parseInt(id)))
  const itemQuantity = useCartStore(state => state.getItemQuantity(parseInt(id)))
  const addItem = useCartStore(state => state.addItem)

  // Favorites (shared localStorage key with HomePage)
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

  // Related products: same category, excluding current, max 4
  const relatedProducts = allProducts
    ?.filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4) || []

  const stars = product ? getRatingStars(product.rating.rate) : []
  const categoryColor = product ? getCategoryColor(product.category) : ''

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="skeleton h-4 w-48 mb-8 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="skeleton h-96 rounded-2xl" />
            <div className="space-y-4">
              <div className="skeleton h-5 w-32 rounded" />
              <div className="skeleton h-8 w-full rounded" />
              <div className="skeleton h-8 w-3/4 rounded" />
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-10 w-32 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-2/3 rounded" />
              <div className="flex gap-3 mt-6">
                <div className="skeleton h-12 flex-1 rounded-xl" />
                <div className="skeleton h-12 w-12 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Product not found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error.message}</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to products
        </button>
      </div>
    )
  }

  if (!product) return null

  // ─── Main Render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/?category=${encodeURIComponent(product.category)}`}
            className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white truncate max-w-xs">
            {product.title}
          </span>
        </nav>

        {/* Product layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* Left: Product Image */}
          <div className="card p-8 flex items-center justify-center min-h-[380px]">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-80 max-w-full object-contain"
              loading="eager" // WHY eager: This is the hero image — load it immediately
            />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            {/* Category badge */}
            <span className={`badge ${categoryColor} self-start mb-3`}>
              {titleCase(product.category)}
            </span>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">
              {product.title}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex" aria-label={`Rating: ${product.rating.rate} out of 5`}>
                {stars.map((type, i) => (
                  <StarIconDetail key={i} type={type} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {product.rating.rate}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.rating.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-5">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              {/* Show a fake original price (15% more) for visual appeal */}
              <span className="ml-3 text-lg text-gray-400 line-through">
                {formatCurrency(product.price * 1.15)}
              </span>
              <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                Save 15%
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Add to Cart + Quantity display */}
            {isInCart && (
              <div className="flex items-center gap-2 mb-3 text-sm text-green-600 dark:text-green-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {itemQuantity} in your cart
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => addItem(product)}
                className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                aria-label={isInCart ? `Add another ${product.title} to cart` : `Add ${product.title} to cart`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {isInCart ? 'Add Another' : 'Add to Cart'}
              </button>

              {/* Favorite button */}
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-lg border-2 transition-all duration-200
                            ${isFavorite
                              ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500'
                              : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-red-300 hover:text-red-400'
                            }`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={isFavorite}
              >
                <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'}
                     stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700
                            grid grid-cols-3 gap-3 text-center">
              {[
                { icon: '🚚', text: 'Free Shipping' },
                { icon: '↩️', text: 'Free Returns' },
                { icon: '🔒', text: 'Secure Pay' },
              ].map(badge => (
                <div key={badge.text} className="text-xs text-gray-500 dark:text-gray-400">
                  <div className="text-xl mb-1">{badge.icon}</div>
                  {badge.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              More in {titleCase(product.category)}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map(related => (
                <Link
                  key={related.id}
                  to={`/product/${related.id}`}
                  className="card p-4 group"
                >
                  <div className="h-32 flex items-center justify-center mb-3
                                  bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2">
                    <img
                      src={related.image}
                      alt={related.title}
                      className="h-full w-full object-contain
                                 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white
                                line-clamp-2 mb-2 leading-snug">
                    {related.title}
                  </p>
                  <p className="text-sm font-bold text-brand-600 dark:text-brand-400">
                    {formatCurrency(related.price)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back button */}
        <div className="mt-12">
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

      </div>
    </div>
  )
}

/* Larger star for the detail page */
function StarIconDetail({ type }) {
  const cls = "w-5 h-5"
  if (type === 'full') return (
    <svg className={`${cls} text-amber-400`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
  if (type === 'half') return (
    <svg className={`${cls} text-amber-400`} fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
  return (
    <svg className={`${cls} text-gray-300 dark:text-gray-600`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}
