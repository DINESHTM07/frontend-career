// CartDrawer
// TODO (Day 5): Build the slide-in cart panel.
//
// Props:
//   isOpen:  boolean   — controls visibility
//   onClose: () => void — closes the drawer
//
// What to build:
//   - Backdrop overlay (semi-transparent, clicking it calls onClose)
//   - Slide-in panel from the right (use animate-slideIn from tailwind config)
//   - Header: "Your Cart" title + close button
//   - Body: list of CartItem components (one per item in the cart)
//   - Empty state: message + "Continue Shopping" link when cart is empty
//   - Footer: subtotal display + "Checkout" button (can be a placeholder)
//   - Trap focus when open (accessibility)
//
// Hints:
//   - Read items: const items = useCartStore(state => state.items)
//   - Read total: const total = useCartStore(state => state.getTotalPrice())
//   - Use role="dialog" and aria-modal="true" for accessibility
//   - Use formatCurrency() from utils/helpers for the total

export default function CartDrawer({ isOpen, onClose }) {
  // TODO: implement CartDrawer
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 h-full flex flex-col shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Cart</h2>
          <button onClick={onClose} className="btn-ghost p-1">✕</button>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400 italic text-sm">
          CartDrawer — build me! (Day 5)
        </div>
      </div>
    </div>
  )
}
