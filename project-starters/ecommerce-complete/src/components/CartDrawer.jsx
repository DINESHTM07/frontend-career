import { useEffect } from 'react'
import { useCartStore } from '../store/cartStore'
import { formatCurrency } from '../utils/helpers'
import CartItem from './CartItem'

/*
  CartDrawer: A slide-in panel from the right showing cart contents.

  WHY a drawer (not a page):
  Cart operations are quick — users add items and return to browsing.
  A full page navigation breaks that flow. A drawer overlay lets users
  see the cart without losing their place in the product grid.

  WHY not a modal:
  Modals are for confirmations and focused tasks. A cart drawer is more
  accessible because it doesn't trap focus as aggressively and doesn't
  obscure the whole page — users can see what they were browsing.

  Props:
  - isOpen: boolean
  - onClose: () => void
*/
export default function CartDrawer({ isOpen, onClose }) {
  const items = useCartStore(state => state.items)
  const getTotalItems = useCartStore(state => state.getTotalItems)
  const getTotalPrice = useCartStore(state => state.getTotalPrice)
  const clearCart = useCartStore(state => state.clearCart)

  // WHY: Lock body scroll when drawer is open so the user can scroll
  // the cart contents without the page scrolling behind it.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    // Cleanup: always restore scroll on unmount
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close drawer on Escape key — important for keyboard/accessibility
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <>
      {/*
        Backdrop overlay — clicking it closes the drawer.
        WHY separate from the drawer panel: The backdrop needs to cover
        the full viewport. Nesting it inside the drawer panel would make
        positioning complex.
      */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30
                    transition-opacity duration-300
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/*
        Drawer panel — slides in from the right.
        WHY transform: translateX instead of display:none → visibility:visible:
        CSS transforms are GPU-accelerated. Toggling display breaks transitions.
        Using translate allows smooth animation in BOTH directions.
      */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[420px] z-40
                    bg-white dark:bg-gray-900
                    shadow-2xl flex flex-col
                    transform transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4
                        border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Cart
            </h2>
            {getTotalItems() > 0 && (
              <span className="bg-brand-600 text-white text-xs font-bold
                               px-2 py-0.5 rounded-full">
                {getTotalItems()}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700
                       dark:text-gray-400 dark:hover:text-gray-200
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items — scrollable */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full
                              flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-900 dark:text-white font-medium mb-1">Your cart is empty</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add some products to get started!
              </p>
            </div>
          ) : (
            <div>
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}

              {/* Clear all button */}
              <button
                onClick={() => {
                  if (window.confirm('Remove all items from cart?')) clearCart()
                }}
                className="w-full mt-4 mb-2 text-sm text-red-500 hover:text-red-600
                           dark:text-red-400 dark:hover:text-red-300
                           py-2 border border-red-200 dark:border-red-800 rounded-lg
                           hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Clear all items
              </button>
            </div>
          )}
        </div>

        {/* Footer — total + checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4 space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Subtotal ({getTotalItems()} items)</span>
              <span>{formatCurrency(getTotalPrice())}</span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Shipping</span>
              <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
            </div>

            {/* Total */}
            <div className="flex justify-between text-base font-bold
                            text-gray-900 dark:text-white pt-2
                            border-t border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span>{formatCurrency(getTotalPrice())}</span>
            </div>

            {/* Checkout button */}
            <button
              className="btn-primary w-full py-3 text-base"
              onClick={() => alert('Checkout coming soon! (This is a demo app)')}
            >
              Checkout — {formatCurrency(getTotalPrice())}
            </button>

            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Secure checkout · Free returns · 30-day guarantee
            </p>
          </div>
        )}
      </div>
    </>
  )
}
