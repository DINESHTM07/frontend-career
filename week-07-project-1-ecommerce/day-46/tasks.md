# Day 46 Tasks — Favorites + Dark Mode + Error Boundary

## Study Block (8:00 – 8:30 AM)
- [ ] Read `ecommerce-complete/src/stores/favoritesStore.js`
- [ ] Read `ecommerce-complete/src/stores/themeStore.js`
- [ ] Read `ecommerce-complete/src/pages/FavoritesPage.jsx`
- [ ] Read `ecommerce-complete/src/components/Navbar.jsx` — how dark toggle and favorites badge work
- [ ] Read any ErrorBoundary component in the complete version
- [ ] CLOSE the complete version

## Morning Build Block (8:30 – 11:00 AM) — Favorites
- [ ] Create `src/stores/favoritesStore.js` with `persist` middleware
- [ ] State: `favorites: []` — array of product objects
- [ ] `toggleFavorite(product)`: check `isFavorite(product.id)` → remove if true, add if false
- [ ] `isFavorite(productId)`: `get().favorites.some(p => p.id === productId)`
- [ ] `clearFavorites()`: set favorites to []
- [ ] Open `src/components/ProductCard.jsx`
- [ ] Import `useFavoritesStore`
- [ ] Read `toggleFavorite` and `isFavorite(product.id)` from store
- [ ] Heart button: `♥` (red) when favorite, `♡` (gray) when not
- [ ] `e.stopPropagation()` on the heart button
- [ ] Open `src/pages/ProductDetailPage.jsx`
- [ ] Wire heart button to `toggleFavorite(product)`
- [ ] Heart shows `♥` when `isFavorite(product.id)` is true
- [ ] Open `src/components/Navbar.jsx`
- [ ] Add favorites count badge (same pattern as cart badge)
- [ ] Build `src/pages/FavoritesPage.jsx`
- [ ] Read `favorites` and `clearFavorites` from store
- [ ] Empty state: heart emoji + "No favorites yet" message
- [ ] Non-empty: header with count + "Clear all" button + `<ProductGrid products={favorites} />`
- [ ] Test: favorite 3 products → navigate to /favorites → all 3 appear
- [ ] Test: unfavorite one on the home page → favorites page count decreases
- [ ] Test: refresh page → favorites still saved

## Midday Build Block (11:20 AM – 1:00 PM) — Dark Mode
- [ ] Create `src/stores/themeStore.js`
- [ ] State: `isDark: false`, `toggleTheme` action
- [ ] `persist` with `name: "ecommerce-theme"`
- [ ] Create `ThemeWatcher` component (or inline in App.jsx)
- [ ] `useEffect` watches `isDark` → adds/removes `"dark"` class on `document.documentElement`
- [ ] Add `<ThemeWatcher />` to `App.jsx`
- [ ] Check Tailwind dark mode is configured for class-based (not media query) — see README
- [ ] Add dark mode toggle button to Navbar: ☀️/🌙 icon, calls `toggleTheme`
- [ ] Add `dark:` variants to the app wrapper div: `dark:bg-gray-950 dark:text-gray-100`
- [ ] Add `dark:` variants to Navbar: `dark:bg-gray-950`
- [ ] Add `dark:` variants to ProductCard: `dark:bg-gray-800 dark:border-gray-700`
- [ ] Add `dark:` variants to search input
- [ ] Add `dark:` variants to filter pills and sort select
- [ ] Test: click moon icon → UI goes dark; click sun → back to light
- [ ] Test: refresh in dark mode → still dark (persist works)
- [ ] Check TASKS.md in starter for any additional Day 6 requirements

## Afternoon Block (2:00 – 4:00 PM) — Error Boundary + DSA
- [ ] Create `src/components/ErrorBoundary.jsx` — class component with `getDerivedStateFromError`
- [ ] Error UI: emoji + message + "Reload page" button
- [ ] Wrap app in `main.jsx` with `<ErrorBoundary>`
- [ ] Create `day-46-dsa.js` in `week-07-project-1-ecommerce/day-46/`
- [ ] Open `dsa-bank/recursion.md` — solve 3 problems
- [ ] Solve Problem 1 — pattern + complexity
- [ ] Solve Problem 2 — pattern + complexity
- [ ] Solve Problem 3 — pattern + complexity

## Wrap Up
- [ ] Write in `journal.md` — how dark: works in Tailwind, why ErrorBoundary is a class, what toggleFavorite checks
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 46: Favorites + localStorage + dark mode + loading skeletons"`
- [ ] Run: `git push origin main`
