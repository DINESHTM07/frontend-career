# ShopExplorer 🛍️

A fully-featured e-commerce product explorer built with Vite + React + Tailwind CSS.
Powered by the [FakeStore API](https://fakestoreapi.com).

---

## Screenshots

| Home Page (Light) | Home Page (Dark) |
|---|---|
| *(Add screenshot here)* | *(Add screenshot here)* |

| Product Detail | Cart Drawer |
|---|---|
| *(Add screenshot here)* | *(Add screenshot here)* |

---

## Tech Stack

| Tool | Version | Why |
|------|---------|-----|
| **Vite** | 5.x | Near-instant dev server, fast HMR, optimized builds |
| **React** | 18.x | Component-based UI, concurrent rendering |
| **React Router** | 6.x | Client-side routing, dynamic segments |
| **Tailwind CSS** | 3.x | Utility-first styling, dark mode, responsive |
| **Zustand** | 4.x | Minimal global state for cart, persist middleware |

---

## Features

- **Product grid** — responsive 1/2/3/4 column layout with product cards
- **Search** — real-time search with 300ms debounce across title, category, description
- **Category filter** — dropdown populated dynamically from the API
- **Sort** — by price (low/high) and rating
- **Product detail page** — full view at `/product/:id`, related products section
- **Shopping cart** — add/remove/update quantity, total calculation, localStorage persistence
- **Favorites/wishlist** — heart toggle on every card, dedicated `/favorites` page, localStorage persistence
- **Skeleton loading** — pixel-accurate placeholders that match card dimensions
- **Error boundary** — catches render errors per-route with "Try again" fallback
- **Dark mode** — toggle with no flash on page load, persists across sessions
- **Responsive** — mobile (1 col), tablet (2 col), desktop (3-4 col), all screen sizes
- **Accessibility** — aria-label, aria-pressed, role="dialog", keyboard navigation

---

## Project Structure

```
src/
├── components/
│   ├── CartDrawer.jsx          # Slide-in cart panel (right side)
│   ├── CartItem.jsx            # Single row in the cart with qty controls
│   ├── DarkModeToggle.jsx      # Sun/moon toggle button
│   ├── ErrorBoundary.jsx       # Class component, catches render errors
│   ├── FilterBar.jsx           # Search + category dropdown + sort
│   ├── Navbar.jsx              # Fixed top bar with logo, links, cart icon
│   ├── ProductCard.jsx         # Product grid card with favorite + add to cart
│   └── ProductCardSkeleton.jsx # Loading placeholder matching card dimensions
│
├── pages/
│   ├── HomePage.jsx            # / — product grid with filters
│   ├── ProductDetailPage.jsx   # /product/:id — full product view
│   └── FavoritesPage.jsx       # /favorites — saved items
│
├── hooks/
│   ├── useDebounce.js          # Delays value updates (prevents rapid re-renders)
│   ├── useFetch.js             # Data fetching with loading/error states + cache
│   └── useLocalStorage.js      # useState that syncs to localStorage
│
├── store/
│   └── cartStore.js            # Zustand cart store with persist middleware
│
├── services/
│   └── api.js                  # API endpoint functions (fetchAllProducts, etc.)
│
└── utils/
    └── helpers.js              # Pure utility functions (format, sort, filter, etc.)
```

---

## Setup

```bash
# 1. Navigate to the project
cd project-starters/ecommerce-complete

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Architecture Decisions

### Why Zustand for cart (not Context + useReducer)?
Context causes every subscriber to re-render when any state changes. With Zustand's
subscription model, each component subscribes to only the slice it needs:
- Navbar subscribes to `getTotalItems()` — only re-renders when count changes
- CartDrawer subscribes to `items` — only re-renders when items change
- ProductCard subscribes to `isInCart(id)` — only re-renders for its own product

### Why useFetch with a module-level cache?
The module-level `Map` persists for the entire browser session. Components that unmount
and remount (navigating away and back) get instant cached responses instead of
re-fetching. The cache is bypassed when `refetch()` is explicitly called.

### Why skeleton components instead of a spinner?
Skeletons eliminate layout shift and set user expectations about what's loading.
The product grid never "jumps" when real data loads — it fades in at exactly the same positions.

### Why dark mode via class toggle (not CSS media query)?
`darkMode: 'class'` gives the user control. Their system might prefer dark, but they
want light for this site. `prefers-color-scheme` media query can't be overridden by
user choice. The class approach reads from localStorage, which the user sets.

### Why localStorage for favorites (not Zustand)?
Favorites are a UI preference that doesn't interact with other state (cart, filters).
The `useLocalStorage` hook handles persistence cleanly without adding a Zustand store.

---

## API Reference

All data from [FakeStore API](https://fakestoreapi.com):

| Endpoint | Used for |
|----------|----------|
| `GET /products` | All products (home page + favorites) |
| `GET /products/:id` | Single product (detail page) |
| `GET /products/categories` | Category filter dropdown |
| `GET /products/category/:name` | (available but unused — filtered client-side) |

---

## Extending This App

**Add a real backend:**
Replace `src/services/api.js` with calls to your own API. The useFetch hook
and component logic don't need to change.

**Add authentication:**
Add a `useAuth` hook and a `ProtectedRoute` component that redirects unauthenticated
users to a login page.

**Add React Query:**
Replace `useFetch` with `useQuery` from `@tanstack/react-query` for automatic
background refetching, retry logic, and better devtools.

**Add animations:**
Add `framer-motion` and wrap the product grid with `AnimatePresence` for
smooth add/remove transitions.
