import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// cartStore
// TODO (Day 5): Implement the Zustand cart store.
//
// Why Zustand (not Context + useReducer)?
//   Context re-renders EVERY subscriber when ANY state changes.
//   Zustand's subscription model means each component only re-renders
//   when the specific slice it subscribed to changes.
//
// Store shape:
// {
//   items: CartItem[],  // [{ id, title, price, image, category, quantity }]
//   addItem(product):   void  — add to cart or increment quantity if already present
//   removeItem(id):     void  — remove entirely
//   updateQuantity(id, qty): void  — set exact quantity (removes if qty <= 0, cap at 99)
//   clearCart():        void  — empty the cart
//   getTotalItems():    number — sum of all quantities
//   getTotalPrice():    number — sum of (price × quantity) for all items
//   isInCart(id):       boolean — true if product is in cart
//   getItemQuantity(id): number — quantity for a product (0 if not in cart)
// }
//
// The `persist` middleware automatically saves `items` to localStorage
// under the key 'shopexplorer-cart' and rehydrates on page load.
//
// TODO: replace all empty action bodies with real implementations

export const useCartStore = create(
  persist(
    (set, get) => ({
      // ─── State ──────────────────────────────────────────────────────────
      items: [],

      // ─── Actions ────────────────────────────────────────────────────────

      addItem: (product) => {
        // TODO: if product.id already in items, increment its quantity
        // TODO: otherwise, append { id, title, price, image, category, quantity: 1 }
        // Hint: set((state) => ({ items: ... }))
      },

      removeItem: (productId) => {
        // TODO: filter out the item with matching id
        // set((state) => ({ items: state.items.filter(...) }))
      },

      updateQuantity: (productId, quantity) => {
        // TODO: if quantity <= 0, call get().removeItem(productId) and return
        // TODO: clamp quantity to max 99
        // TODO: update the matching item's quantity
      },

      clearCart: () => {
        // TODO: set items to []
      },

      // ─── Computed (read from get(), not stored as state) ─────────────────

      getTotalItems: () => {
        // TODO: return sum of item.quantity for all items
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        // TODO: return sum of (item.price * item.quantity) for all items
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      isInCart: (productId) => {
        // TODO: return true if any item has id === productId
        return get().items.some(item => item.id === productId)
      },

      getItemQuantity: (productId) => {
        // TODO: return the quantity for the item with id === productId, or 0
        const item = get().items.find(item => item.id === productId)
        return item ? item.quantity : 0
      },
    }),
    {
      name: 'shopexplorer-cart',
      // Only persist 'items', not the action functions
      partialize: (state) => ({ items: state.items }),
    }
  )
)
