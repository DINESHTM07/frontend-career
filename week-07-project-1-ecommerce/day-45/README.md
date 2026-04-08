# Day 45 — Project 1 Day 5: Cart with Zustand

**Status:** 📋 READY TO START
**Week:** 7 | **Theme:** E-Commerce Project

---

## Today's Goal

The "Add to Cart" buttons have been sitting there as placeholders since Day 42. Today you wire them up for real.

By end of today:
- `cartStore.js` — Zustand store with `persist` middleware managing cart state
- "Add to Cart" on both `ProductCard` and `ProductDetailPage` adds to the store
- `CartPage` shows all cart items with product image, name, price, quantity controls
- Quantity +/− buttons update in real time
- Remove button (✕) removes a single item
- Cart total and item count always correct
- Cart badge in Navbar shows live count
- Cart persists across page refreshes (Zustand persist → localStorage)

---

## Daily Rule: Study → Close → Build

Before building, read these in the complete version:
- `src/stores/cartStore.js` — full store shape and all actions
- `src/pages/CartPage.jsx` — how items are mapped, how total is displayed
- `src/components/CartItem.jsx` (if it exists) — single item row
- `src/components/Navbar.jsx` — how the cart badge reads from the store

Take notes on the store shape. Close. Build.

---

## Morning (8:00 – 11:00 AM) — Build the Cart Store

### Build: cartStore

Create `src/stores/cartStore.js`:

```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],  // { id, title, price, image, category, quantity }

      // Add product — increment quantity if already in cart
      addItem(product) {
        const existing = get().items.find(item => item.id === product.id);
        if (existing) {
          set(state => ({
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          }));
        } else {
          set(state => ({
            items: [
              ...state.items,
              {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: 1,
              }
            ]
          }));
        }
      },

      // Remove item entirely
      removeItem(productId) {
        set(state => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },

      // Update quantity — remove if reaches 0
      updateQuantity(productId, delta) {
        set(state => {
          const item = state.items.find(i => i.id === productId);
          if (!item) return state;
          const newQty = item.quantity + delta;
          if (newQty <= 0) {
            return { items: state.items.filter(i => i.id !== productId) };
          }
          return {
            items: state.items.map(i =>
              i.id === productId ? { ...i, quantity: newQty } : i
            )
          };
        });
      },

      // Clear entire cart
      clearCart() {
        set({ items: [] });
      },

      // Derived values — computed, not stored
      get totalItems() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      get totalPrice() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: "ecommerce-cart",  // localStorage key
    }
  )
);
```

**Note:** Zustand's `get()` inside actions reads current state. Using `get().items.find(...)` is how you access state inside an action — safer than relying on `state` from the set callback for reads.

---

### Wire Add to Cart in ProductCard

Open `src/components/ProductCard.jsx`:

```jsx
import { useCartStore } from '../stores/cartStore.js'

export default function ProductCard({ product }) {
  const addItem = useCartStore(state => state.addItem);

  // In the button:
  <button
    onClick={e => {
      e.stopPropagation();
      addItem(product);
    }}
    className="..."
  >
    Add to Cart
  </button>
}
```

---

### Wire Add to Cart in ProductDetailPage

Open `src/pages/ProductDetailPage.jsx`:

```jsx
import { useCartStore } from '../stores/cartStore.js'

// Inside the component:
const addItem = useCartStore(state => state.addItem);

// On the button:
onClick={() => addItem(product)}
```

---

### Update Navbar with live cart count

Open `src/components/Navbar.jsx`:

```jsx
import { useCartStore } from '../stores/cartStore.js'

export default function Navbar() {
  const totalItems = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <nav ...>
      {/* ... other nav ... */}
      <Link to="/cart" className="relative">
        🛒
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </Link>
    </nav>
  );
}
```

---

## Midday (11:20 AM – 1:00 PM) — Build CartPage

Create `src/pages/CartPage.jsx`:

```jsx
import { Link } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore.js'

export default function CartPage() {
  const items        = useCartStore(state => state.items);
  const removeItem   = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clearCart    = useCartStore(state => state.clearCart);

  const totalPrice   = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems   = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some products to get started.</p>
        <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Cart <span className="text-gray-400 font-normal">({totalItems} items)</span>
        </h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700">
          Clear all
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {items.map(item => (
          <CartItemRow
            key={item.id}
            item={item}
            onRemove={() => removeItem(item.id)}
            onIncrement={() => updateQuantity(item.id, +1)}
            onDecrement={() => updateQuantity(item.id, -1)}
          />
        ))}
      </div>

      {/* Order summary */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Subtotal ({totalItems} items)</span>
          <span className="font-semibold">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-6 text-lg font-bold">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

function CartItemRow({ item, onRemove, onIncrement, onDecrement }) {
  return (
    <div className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4">
      <img src={item.image} alt={item.title} className="w-20 h-20 object-contain rounded-lg bg-gray-50 p-2" />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{item.title}</h3>
        <p className="text-sm text-gray-500 capitalize mb-3">{item.category}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onDecrement} className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 text-sm">−</button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button onClick={onIncrement} className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 text-sm">+</button>
          </div>
          <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
      <button onClick={onRemove} className="text-gray-300 hover:text-red-500 transition-colors self-start">✕</button>
    </div>
  );
}
```

**Test the full cart flow:**
1. Go to home page → add 3 different products to cart
2. Cart badge in Navbar shows count
3. Navigate to `/cart` → see all 3 items
4. Click + on one → quantity goes up, total updates
5. Click − until quantity hits 0 → item disappears
6. Click ✕ → item removed immediately
7. Refresh the page → cart still has items (Zustand persist)
8. Click "Clear all" → cart empties

---

## Afternoon (2:00 – 4:00 PM) — DSA

Open `dsa-bank/stacks.md`. Solve **3 problems** (your choice, medium difficulty).

Create `day-45-dsa.js` in the `week-07-project-1-ecommerce/day-45/` folder.

---

## Wrap Up

Write in `journal.md`:
- Why does `addItem` check if the product already exists before adding?
- Why did you store only `{ id, title, price, image, category, quantity }` in the cart — not the whole product object?
- What does `persist` middleware do to make the cart survive a page refresh?

```bash
git add .
git commit -m "Day 45: Cart with Zustand (add, remove, quantity, totals)"
git push origin main
```

---

## End of Day Checklist

- [ ] Studied: `cartStore`, `CartPage`, `CartItem`, `Navbar` cart badge in complete version
- [ ] Built `src/stores/cartStore.js` — `addItem`, `removeItem`, `updateQuantity`, `clearCart`
- [ ] `addItem` increments quantity if product already in cart
- [ ] `updateQuantity(-1)` removes item when quantity reaches 0
- [ ] `persist` middleware with `name: "ecommerce-cart"`
- [ ] `ProductCard` Add to Cart button wired to `addItem` + `e.stopPropagation()`
- [ ] `ProductDetailPage` Add to Cart button wired to `addItem`
- [ ] Navbar cart badge shows live count from store — only visible when count > 0
- [ ] `CartPage` empty state with "Browse Products" link
- [ ] `CartPage` renders all items with image, name, category, price × qty
- [ ] +/− quantity buttons working
- [ ] ✕ remove button working
- [ ] Total price updates correctly
- [ ] "Clear all" empties cart
- [ ] Cart persists after page refresh
- [ ] Solved 3 DSA problems in `day-45-dsa.js`
- [ ] Committed and pushed
