# Day 45 Tasks — Cart with Zustand

## Study Block (8:00 – 8:30 AM)
- [ ] Read `ecommerce-complete/src/stores/cartStore.js` — note all actions and the store shape
- [ ] Read `ecommerce-complete/src/pages/CartPage.jsx` — how is total calculated?
- [ ] Read `ecommerce-complete/src/components/Navbar.jsx` — how does badge read from store?
- [ ] CLOSE the complete version

## Morning Build Block (8:30 – 11:00 AM)
- [ ] Create `src/stores/cartStore.js`
- [ ] `create` with `persist` middleware: `name: "ecommerce-cart"`
- [ ] State: `items: []` — each item has `{ id, title, price, image, category, quantity }`
- [ ] `addItem(product)`: if id exists in items → increment quantity; else → push with quantity: 1
- [ ] `removeItem(productId)`: filter out by id
- [ ] `updateQuantity(productId, delta)`: add delta to quantity, remove if result ≤ 0
- [ ] `clearCart()`: set items to []
- [ ] Open `src/components/ProductCard.jsx`
- [ ] Import `useCartStore`
- [ ] Wire Add to Cart button: `onClick={e => { e.stopPropagation(); addItem(product); }}`
- [ ] Open `src/pages/ProductDetailPage.jsx`
- [ ] Import `useCartStore`
- [ ] Wire Add to Cart button: `onClick={() => addItem(product)}`
- [ ] Open `src/components/Navbar.jsx`
- [ ] Import `useCartStore`
- [ ] Compute `totalItems` from `state.items.reduce((sum, item) => sum + item.quantity, 0)`
- [ ] Show badge on cart icon only when `totalItems > 0`
- [ ] Badge: `absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full`
- [ ] Test: add products from home page → Navbar badge updates immediately
- [ ] Open `project-starters/ecommerce-starter/TASKS.md` — check Day 5 requirements

## Midday Build Block (11:20 AM – 1:00 PM)
- [ ] Build `src/pages/CartPage.jsx`
- [ ] Read `items`, `removeItem`, `updateQuantity`, `clearCart` from `useCartStore`
- [ ] Compute `totalPrice` and `totalItems` with reduce in the component
- [ ] Empty state: emoji + message + "Browse Products" link to "/"
- [ ] Cart header: "Cart (N items)" + "Clear all" button
- [ ] Map over `items` → render `CartItemRow` component per item
- [ ] `CartItemRow`: image, title (line-clamp-2), category, quantity controls, line total, ✕ button
- [ ] +/− buttons call `updateQuantity(item.id, +1)` and `updateQuantity(item.id, -1)`
- [ ] ✕ button calls `removeItem(item.id)`
- [ ] Order summary box at bottom: subtotal, total, "Proceed to Checkout" button (placeholder)

## Full Cart Test
- [ ] Home page → add 3 different products → badge shows "3"
- [ ] Navigate to /cart → all 3 items show with correct prices
- [ ] Click + → quantity increases, line total updates, overall total updates
- [ ] Click − until 0 → item disappears
- [ ] Click ✕ → item removed
- [ ] Refresh page → cart still full (persist works)
- [ ] Click "Clear all" → empty state appears

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-45-dsa.js` in `week-07-project-1-ecommerce/day-45/`
- [ ] Open `dsa-bank/stacks.md` — pick 3 medium problems
- [ ] Solve Problem 1 — pattern + complexity
- [ ] Solve Problem 2 — pattern + complexity
- [ ] Solve Problem 3 — pattern + complexity

## Wrap Up
- [ ] Write in `journal.md` — why check existing before add, why not store whole product, what persist does
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 45: Cart with Zustand (add, remove, quantity, totals)"`
- [ ] Run: `git push origin main`
