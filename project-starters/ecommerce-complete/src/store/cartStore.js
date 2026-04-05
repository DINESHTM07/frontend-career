import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/*
  WHY Zustand instead of Context + useReducer for the cart:

  Context + useReducer would work, but has a significant drawback:
  EVERY consumer of the cart context re-renders when ANY cart state changes.
  So if the cart has 10 items and you update the quantity of item #1,
  all 10 <CartItem> components re-render, plus the Navbar (cart count),
  plus any page that consumes CartContext.

  Zustand uses a subscription model: components subscribe to specific slices.
  const cartCount = useCartStore(state => state.getTotalItems())
  This component ONLY re-renders when cartCount changes — not on every cart action.

  WHY persist middleware:
  Zustand's persist middleware automatically saves the store to localStorage
  and rehydrates it on page load. Without it, the cart clears on every refresh.
  It handles JSON serialization/deserialization automatically.

  STORE SHAPE:
  {
    items: CartItem[],       // [{ id, title, price, image, quantity }]
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    // Computed values (these are functions, not state)
    getTotalItems,
    getTotalPrice,
    isInCart,
  }
*/

export const useCartStore = create(
  /*
    WHY persist wrapper: It intercepts state changes, serializes the store to
    localStorage, and rehydrates on page load. The 'name' option is the
    localStorage key.
  */
  persist(
    (set, get) => ({
      // ─── State ──────────────────────────────────────────────────────────
      items: [],

      // ─── Actions ────────────────────────────────────────────────────────

      /*
        addItem: Add a product to the cart, or increment quantity if it exists.

        WHY check for existing item: FakeStoreAPI products have fixed IDs.
        If the user adds the same product twice, we increment quantity rather
        than adding a duplicate entry. This matches real-world cart behavior.
      */
      addItem: (product) => {
        set((state) => {
          const existing = state.items.find(item => item.id === product.id)

          if (existing) {
            // Item already in cart — increment quantity
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }

          // New item — add with quantity 1
          // WHY only store what we need: We don't store the full product object.
          // We only store the fields needed for the cart UI. This keeps
          // localStorage small and avoids stale data if the product changes.
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: 1,
              },
            ],
          }
        })
      },

      /*
        removeItem: Remove a product entirely from the cart by ID.
      */
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId),
        }))
      },

      /*
        updateQuantity: Set the exact quantity for a cart item.
        If quantity drops to 0 or below, remove the item entirely.

        WHY allow 0 to remove: This lets the UI use a single input for quantity
        without a separate "remove" call when the user types 0.
      */
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        // WHY cap at 99: Prevents unrealistic quantities. A real e-commerce
        // site would check inventory here.
        const clampedQty = Math.min(quantity, 99)

        set((state) => ({
          items: state.items.map(item =>
            item.id === productId
              ? { ...item, quantity: clampedQty }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      // ─── Computed values ─────────────────────────────────────────────────
      // WHY functions (not state): Derived values should be computed from state,
      // not stored separately. If stored separately, they could go out of sync.
      // Zustand functions are fine for this — they read from get() each call.

      /** Total number of individual items (sum of quantities) */
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      /** Total price of all items (price × quantity for each) */
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      /** Check if a product ID is currently in the cart */
      isInCart: (productId) => {
        return get().items.some(item => item.id === productId)
      },

      /** Get quantity of a specific item (0 if not in cart) */
      getItemQuantity: (productId) => {
        const item = get().items.find(item => item.id === productId)
        return item ? item.quantity : 0
      },
    }),
    {
      name: 'shopexplorer-cart', // localStorage key
      // WHY partial persistence: We only persist 'items', not the functions.
      // Functions are recreated by Zustand — persisting them would fail (can't JSON.stringify functions).
      partialize: (state) => ({ items: state.items }),
    }
  )
)
