# ShopExplorer — 7-Day Build Guide

Build this e-commerce app from scratch, one day at a time.
Each day has a clear goal, the files to edit, and what "done" looks like.

The app already runs (`npm install && npm run dev`) — you'll see placeholder UIs.
Replace each stub with real code, day by day.

Compare your work against `project-starters/ecommerce-complete/` at any time.

---

## Day 1 — Project Setup + Navbar + Basic Layout

**Goal:** Get familiar with the codebase and build the persistent navigation bar.

**Read first (understand before coding):**
- `src/App.jsx` — routing structure, why `isCartOpen` lives here
- `src/main.jsx` — why BrowserRouter wraps App
- `src/index.css` — the CSS classes you'll use: `.btn-primary`, `.btn-ghost`, `.card`
- `tailwind.config.js` — custom colors (`brand-*`), custom animations

**Files to edit:**
- `src/components/Navbar.jsx` — build the full navigation bar

**Navbar checklist:**
- [ ] Logo: `🛍️ ShopExplorer` on the left, wrapped in `<Link to="/">`
- [ ] Right side: Favorites link, cart icon button, DarkModeToggle
- [ ] Cart icon shows a count badge when `getTotalItems() > 0`
- [ ] `onCartOpen` prop is called when the cart button is clicked
- [ ] Sticky (`sticky top-0 z-40`) so it stays visible on scroll
- [ ] Responsive: hide text labels on mobile (`hidden sm:inline`)

**Key concept:** Why does Navbar render outside `<Routes>`?
Because it should appear on every page. If it were inside a route, it would unmount on navigation.

**Done when:** The navbar shows logo + cart button on every page, and clicking the cart button opens the drawer placeholder.

---

## Day 2 — ProductCard + useFetch + Display Products

**Goal:** Fetch products from the API and display them in a grid.

**Files to edit:**
- `src/hooks/useFetch.js` — implement the data-fetching hook
- `src/components/ProductCard.jsx` — build the product grid card
- `src/utils/helpers.js` — implement `formatCurrency`, `truncate`, `titleCase`, `getRatingStars`, `getCategoryColor`

**useFetch checklist:**
- [ ] Returns `{ data, loading, error, refetch }`
- [ ] Sets `loading: true` while fetching
- [ ] Calls `fetch(url)`, checks `response.ok`, parses JSON
- [ ] Sets `error` on failure (network error or HTTP error status)
- [ ] Module-level `cache` Map: returns cached data instantly on re-calls
- [ ] `active` flag prevents state updates on unmounted components

**ProductCard checklist:**
- [ ] Entire card links to `/product/:id` via `<Link>`
- [ ] Product image: `h-44`, `object-contain`, `lazy` loading
- [ ] Category badge using `getCategoryColor()` + `.badge` CSS class
- [ ] Title truncated to ~60 chars via `truncate()`
- [ ] 5-star rating row using `getRatingStars()`
- [ ] Price with `formatCurrency()`
- [ ] "Add to Cart" button: calls `addItem` from `useCartStore`
- [ ] Heart button: calls `onToggleFavorite(product.id)`, filled when `isFavorite`
- [ ] Clicking Add to Cart / heart does NOT navigate (use `e.stopPropagation()`)

**Key concept:** Why `useFetch` has a module-level cache (not `useState`)?
`useState` resets when the component unmounts. A module-level `Map` persists
for the entire browser session — navigate away and back, data is instant.

**Done when:** The home page shows a grid of real product cards with images, titles, prices, and ratings.

---

## Day 3 — Search + Category Filter + Sort

**Goal:** Let users find products by searching, filtering by category, and sorting.

**Files to edit:**
- `src/hooks/useDebounce.js` — implement the debounce hook
- `src/components/FilterBar.jsx` — add category dropdown and sort dropdown
- `src/components/SearchBar.jsx` — add search icon and clear button
- `src/utils/helpers.js` — implement `sortProducts` and `filterBySearch`
- `src/pages/HomePage.jsx` — wire up the filter pipeline in `useMemo`

**useDebounce checklist:**
- [ ] Uses `useEffect` with a `setTimeout` for `delay` ms
- [ ] Returns the cleanup function (`clearTimeout`) from the effect
- [ ] The debounced value only updates when the input has been stable for `delay` ms
- [ ] Default delay is 300ms

**FilterBar checklist:**
- [ ] Category `<select>` with "All Categories" + one `<option>` per category
- [ ] Sort `<select>` with options: Default, Price: Low → High, Price: High → Low, Top Rated
- [ ] Result count display: "20 products" or "3 of 20" when filtered
- [ ] Sticky below the Navbar (`sticky top-[57px]`)

**HomePage filter pipeline (in `useMemo`):**
```
all products
  → filter by category (if not 'all')
  → filterBySearch(result, debouncedSearch)
  → sortProducts(result, sortKey)
```

**Key concept:** Why `debouncedSearch` instead of `searchQuery` in useMemo?
`searchQuery` updates on every keystroke. If filtering 1000 products per keystroke
is slow, the UI freezes. `debouncedSearch` only updates after the user pauses (300ms).

**Done when:** Typing in search instantly narrows the grid; category and sort dropdowns work.

---

## Day 4 — Product Detail Page + Dynamic Routing

**Goal:** Build the full product detail view at `/product/:id`.

**Files to edit:**
- `src/pages/ProductDetailPage.jsx` — build the complete detail page

**ProductDetailPage checklist:**
- [ ] `const { id } = useParams()` reads the product ID from the URL
- [ ] Fetches product: `useFetch(\`https://fakestoreapi.com/products/${id}\`)`
- [ ] Loading state: skeleton placeholders (`animate-pulse` divs)
- [ ] Error state: "Product not found" + "Back to products" button
- [ ] Breadcrumb nav: `Products / Category / Product title`
- [ ] Two-column layout (stacked on mobile): image left, info right
- [ ] Star rating row using `getRatingStars()` + star SVG icons
- [ ] Fake "15% off" original price for visual polish
- [ ] "Add to Cart" / "Add Another" button (check `isInCart`)
- [ ] Favorite heart button (reads + writes `useLocalStorage`)
- [ ] Related products section: same category, max 4, excludes current
- [ ] "Back" button using `navigate(-1)`

**Key concept:** Why fetch by ID in the page instead of passing via router state?
If you pass product via `navigate('/product/1', { state: product })`, refreshing
the page loses the state. Fetching by ID makes the page shareable and refreshable.

**Done when:** Clicking any product card navigates to a detailed view with all info and a related products section.

---

## Day 5 — Cart with Zustand (Add, Remove, Quantity, Totals)

**Goal:** Implement the full shopping cart — store, drawer, and item controls.

**Files to edit:**
- `src/store/cartStore.js` — implement all cart actions
- `src/components/CartDrawer.jsx` — build the slide-in cart panel
- `src/components/CartItem.jsx` — build the cart row with quantity controls

**cartStore checklist:**
- [ ] `addItem(product)`: if already in cart → increment quantity; else → append with `quantity: 1`
- [ ] `removeItem(productId)`: filter it out
- [ ] `updateQuantity(productId, qty)`: remove if qty ≤ 0; clamp to max 99
- [ ] `clearCart()`: set `items: []`
- [ ] `getTotalItems()`: sum of all quantities
- [ ] `getTotalPrice()`: sum of `price × quantity`
- [ ] `isInCart(productId)`: boolean check
- [ ] `getItemQuantity(productId)`: returns 0 if not in cart
- [ ] Cart persists through page refresh (via `persist` middleware)

**CartDrawer checklist:**
- [ ] Slide in from the right using `animate-slideIn`
- [ ] Semi-transparent backdrop; clicking it calls `onClose`
- [ ] List of `<CartItem>` components
- [ ] Empty state: "Your cart is empty" + "Continue Shopping" link
- [ ] Footer: subtotal + "Checkout" button
- [ ] `role="dialog"` and `aria-modal="true"` for accessibility

**CartItem checklist:**
- [ ] Product image + title (truncated) + price per unit
- [ ] `−` button: `updateQuantity(item.id, item.quantity - 1)`
- [ ] `+` button: `updateQuantity(item.id, item.quantity + 1)`
- [ ] `🗑` button: `removeItem(item.id)`
- [ ] Line total: `formatCurrency(item.price * item.quantity)`

**Key concept:** Why does the Navbar only re-render when `getTotalItems()` changes?
Because it subscribes to a derived value: `useCartStore(state => state.getTotalItems())`.
Zustand only notifies this component when the return value of that selector changes.

**Done when:** Adding products to cart works, quantity controls update the total, and the cart persists on refresh.

---

## Day 6 — Favorites + localStorage Persistence + Dark Mode

**Goal:** Complete the favorites feature and implement the dark mode toggle.

**Files to edit:**
- `src/hooks/useLocalStorage.js` — implement the hook (if not done in Day 5)
- `src/components/DarkModeToggle.jsx` — build the sun/moon toggle
- `src/pages/FavoritesPage.jsx` — wire up the favorites grid

**useLocalStorage checklist:**
- [ ] Reads initial value from `localStorage.getItem(key)` (JSON.parse)
- [ ] Falls back to `initialValue` if nothing is stored
- [ ] Setter writes to both React state AND localStorage (JSON.stringify)
- [ ] Handles functional updates: `setValue(prev => [...prev, id])`
- [ ] Wraps in try/catch (localStorage throws in private browsing)

**DarkModeToggle checklist:**
- [ ] Reads current mode from `document.documentElement.classList.has('dark')`
- [ ] On click: toggle the `dark` class on `document.documentElement`
- [ ] Save `'dark'` or `'light'` to `localStorage.setItem('theme', ...)`
- [ ] Show 🌙 in light mode, ☀️ in dark mode
- [ ] Accessible: `aria-label="Toggle dark mode"`

**FavoritesPage checklist:**
- [ ] Uses `useLocalStorage('shopexplorer-favorites', [])` for favorites list
- [ ] Fetches all products and filters to favorites (use `useMemo`)
- [ ] Empty state: heart icon + "No favorites yet" + link to home
- [ ] "Clear all" button with `window.confirm` prompt
- [ ] Grid of `<ProductCard>` with `isFavorite={true}` and `onToggleFavorite`
- [ ] Favorites survive page refresh

**Key concept:** Why is dark mode init in `index.html` (not in a useEffect)?
A `useEffect` runs AFTER the first paint. Without the inline script, the page
flashes in the wrong theme for ~16ms before React hydrates. The inline script
runs synchronously before any HTML renders — no flash.

**Done when:** Favoriting products persists on refresh; dark mode toggles instantly with no flash; the Favorites page shows saved items.

---

## Day 7 — Polish: Skeletons, Error Boundary, Animations + Deploy

**Goal:** Refine the UX and deploy the finished app.

**Files to edit:**
- `src/components/ProductCardSkeleton.jsx` — build pixel-accurate skeleton cards
- `src/components/ErrorBoundary.jsx` — review and enhance (already mostly done)
- Various components — add micro-animations

**ProductCardSkeleton checklist:**
- [ ] Matches real `ProductCard` dimensions exactly (same heights for each section)
- [ ] Uses `.skeleton` CSS class for the shimmer animation
- [ ] `ProductGridSkeleton` renders `count` skeletons in the same grid as HomePage
- [ ] No layout shift when real cards replace skeletons

**Animations to add (optional but impressive):**
- [ ] Product grid: `animate-fadeIn` when cards appear
- [ ] CartDrawer: `animate-slideIn` from the right
- [ ] ProductCard: `hover:scale-[1.02]` on the card container
- [ ] Add to Cart button: brief `scale-95` on click (already in `.btn-primary`)

**Deploy to Vercel:**
```bash
# Option 1: Vercel CLI
npm install -g vercel
vercel

# Option 2: GitHub
# Push to GitHub → import in vercel.com → deploy
# Vercel auto-detects Vite and sets build command + output dir
```

**Final checklist:**
- [ ] `npm run build` completes without errors
- [ ] All placeholder "build me!" labels are gone
- [ ] Cart persists on page refresh
- [ ] Favorites persist on page refresh
- [ ] Dark mode has no flash on load
- [ ] Works on mobile (resize browser to 375px width)
- [ ] No console errors in production build

**Done when:** The app is deployed and live at a Vercel URL.

---

## Quick Reference

### Folder map
```
src/
├── components/   UI building blocks (reused across pages)
├── pages/        Route components (one per URL)
├── hooks/        Custom React hooks (reusable stateful logic)
├── store/        Zustand global stores
├── services/     API functions (fetch wrappers)
└── utils/        Pure helper functions (no React)
```

### Key data flows
```
API → useFetch → page → component → user interaction
user interaction → useCartStore → CartDrawer/Navbar re-render
user interaction → useLocalStorage → favorites persist
```

### CSS classes to know
| Class | Where defined | Use for |
|-------|--------------|---------|
| `.btn-primary` | index.css | Primary action buttons |
| `.btn-ghost` | index.css | Secondary/icon buttons |
| `.card` | index.css | Product cards, panels |
| `.input-field` | index.css | Search, select inputs |
| `.skeleton` | index.css | Loading shimmer blocks |
| `.badge` | index.css | Category labels |
| `brand-*` | tailwind.config | Brand accent color (indigo) |
