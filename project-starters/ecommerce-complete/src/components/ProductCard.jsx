import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { formatCurrency, truncate, getRatingStars, getCategoryColor } from '../utils/helpers'

/*
  WHY ProductCard is a "smart" component that connects to the cart store:
  ProductCard needs to know if the product is in the cart (to show the quantity
  badge and disable the "Add" button). We have two choices:
  1. Pass isInCart and onAdd as props from the parent → parent needs store access
  2. ProductCard directly reads from store → card is self-contained

  We chose option 2. WHY: The parent (HomePage) would have to pass the same
  isInCart/addItem props to every card in the grid. With 20 products and more
  filters coming, that's a lot of prop-drilling for the parent to manage.
  Zustand's subscription model means each card ONLY re-renders when ITS product's
  cart status changes (due to the selector: state => state.isInCart(product.id)).

  Props:
  - product: Product object from FakeStoreAPI
  - isFavorite: boolean (controlled by parent via localStorage)
  - onToggleFavorite: (productId) => void
*/
export default function ProductCard({ product, isFavorite, onToggleFavorite }) {
  // Subscribe to ONLY the relevant cart slice for this product.
  // WHY selective subscription: If we subscribed to the entire cart, every
  // ProductCard would re-render whenever anyone's cart changes.
  const isInCart = useCartStore(state => state.isInCart(product.id))
  const itemQuantity = useCartStore(state => state.getItemQuantity(product.id))
  const addItem = useCartStore(state => state.addItem)

  const stars = getRatingStars(product.rating.rate)
  const categoryColor = getCategoryColor(product.category)

  function handleAddToCart(e) {
    // WHY stopPropagation: The whole card is wrapped in a <Link>.
    // Without stopping propagation, clicking "Add to Cart" would navigate
    // to the product detail page AND add to cart. We only want the latter.
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  function handleToggleFavorite(e) {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite(product.id)
  }

  return (
    /*
      WHY Link wrapping the whole card: The entire card is clickable for navigation.
      Individual buttons inside use stopPropagation to override this.
      We use 'group' to enable Tailwind's group-hover: prefix on children.
    */
    <Link
      to={`/product/${product.id}`}
      className="card flex flex-col h-full group animate-fadeIn"
      aria-label={`View ${product.title}`}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl bg-gray-50 dark:bg-gray-700/50 p-4 h-52 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain
                     group-hover:scale-105 transition-transform duration-300"
          /*
            WHY object-contain (not object-cover): Product images from FakeStoreAPI
            have varied aspect ratios. object-cover would crop them.
            object-contain shows the full product, which is better for e-commerce.
          */
        />

        {/* Favorite button — top-right corner */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-1.5 rounded-full
                      backdrop-blur-sm transition-all duration-200
                      ${isFavorite
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-red-500'
                      }`}
          aria-label={isFavorite ? `Remove ${product.title} from favorites` : `Add ${product.title} to favorites`}
          aria-pressed={isFavorite}
        >
          <svg className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Cart quantity badge — shows when item is in cart */}
        {isInCart && (
          <div className="absolute top-3 left-3 bg-brand-600 text-white text-xs
                          font-bold w-5 h-5 rounded-full flex items-center justify-center
                          shadow-md">
            {itemQuantity}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category badge */}
        <span className={`badge ${categoryColor} mb-2 self-start`}>
          {product.category}
        </span>

        {/* Product title */}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white
                       mb-2 flex-1 leading-snug line-clamp-2"
            title={product.title}>
          {product.title}
        </h3>

        {/* Star rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex" aria-label={`Rating: ${product.rating.rate} out of 5`}>
            {stars.map((type, i) => (
              <StarIcon key={i} type={type} />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {product.rating.rate} ({product.rating.count})
          </span>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5
                        rounded-lg transition-all duration-200 active:scale-95
                        ${isInCart
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'btn-primary'
                        }`}
            aria-label={isInCart ? `Add another ${product.title} to cart` : `Add ${product.title} to cart`}
          >
            {isInCart ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                In Cart
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}

/*
  WHY inline StarIcon component:
  It's small, only used here, and co-locating it with ProductCard avoids
  creating a one-use file. If it were needed elsewhere, we'd extract it.
*/
function StarIcon({ type }) {
  const baseClass = "w-3.5 h-3.5"

  if (type === 'full') {
    return (
      <svg className={`${baseClass} text-amber-400`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )
  }

  if (type === 'half') {
    return (
      <svg className={`${baseClass} text-amber-400`} fill="currentColor" viewBox="0 0 20 20">
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="currentColor"/>
            <stop offset="50%" stopColor="transparent"/>
          </linearGradient>
        </defs>
        <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )
  }

  return (
    <svg className={`${baseClass} text-gray-300 dark:text-gray-600`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}
