import { useCartStore } from '../store/cartStore'
import { formatCurrency } from '../utils/helpers'

/*
  CartItem: A single row inside the cart drawer.
  Each item shows: image, title, price, quantity controls, line total, remove button.

  WHY this is a standalone component:
  The quantity controls have their own logic (increment, decrement, input validation).
  Keeping this out of CartDrawer makes CartDrawer easier to read.
*/
export default function CartItem({ item }) {
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const removeItem = useCartStore(state => state.removeItem)

  function handleQuantityChange(e) {
    const val = parseInt(e.target.value, 10)
    // NaN check: if user types non-numeric, parseInt returns NaN.
    // We ignore the input in that case rather than setting qty to 0/NaN.
    if (!isNaN(val)) {
      updateQuantity(item.id, val)
    }
  }

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0 animate-fadeIn">
      {/* Product image */}
      <div className="w-16 h-16 rounded-lg bg-gray-50 dark:bg-gray-700 flex-shrink-0
                      flex items-center justify-center overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-contain p-1"
        />
      </div>

      {/* Item details */}
      <div className="flex-1 min-w-0">
        {/* WHY min-w-0: flex children default to min-width: auto, which
            prevents text-ellipsis from working. min-w-0 allows the text
            to be narrower than its content, enabling truncation. */}
        <p className="text-sm font-medium text-gray-900 dark:text-white
                      truncate mb-1" title={item.title}>
          {item.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {formatCurrency(item.price)} each
        </p>

        {/* Quantity controls + line total */}
        <div className="flex items-center justify-between">
          {/* Quantity stepper */}
          <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center
                         text-gray-600 dark:text-gray-400
                         hover:bg-gray-100 dark:hover:bg-gray-700
                         transition-colors text-lg leading-none"
              aria-label="Decrease quantity"
            >
              −
            </button>

            <input
              type="number"
              value={item.quantity}
              onChange={handleQuantityChange}
              min="1"
              max="99"
              className="w-8 text-center text-sm font-medium
                         bg-transparent text-gray-900 dark:text-white
                         border-x border-gray-200 dark:border-gray-600
                         focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
              aria-label={`Quantity of ${item.title}`}
            />

            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center
                         text-gray-600 dark:text-gray-400
                         hover:bg-gray-100 dark:hover:bg-gray-700
                         transition-colors text-lg leading-none"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Line total */}
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={() => removeItem(item.id)}
        className="flex-shrink-0 self-start mt-0.5 p-1
                   text-gray-400 hover:text-red-500
                   dark:text-gray-500 dark:hover:text-red-400
                   transition-colors rounded"
        aria-label={`Remove ${item.title} from cart`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
