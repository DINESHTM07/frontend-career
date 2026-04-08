# Day 41 Tasks — Project 1 Day 1: Study + Navbar + Layout

## Morning Block (8:00 – 11:00 AM) — STUDY the complete version
- [ ] Open terminal: `cd project-starters/ecommerce-complete && npm install && npm run dev`
- [ ] Open http://localhost:5173 — use the app for 15 minutes as a real user
- [ ] Search for a product, filter by category, sort, open a detail page, add to cart, change quantity
- [ ] Read `package.json` — list all installed libraries
- [ ] Read `src/main.jsx` — what providers wrap the app?
- [ ] Read `src/App.jsx` — what routes exist?
- [ ] Read `src/layouts/MainLayout.jsx` — how is `<Outlet />` used?
- [ ] Read all files in `src/stores/` — what state does each store hold?
- [ ] Read all files in `src/hooks/` — what does each hook return?
- [ ] Read `src/pages/HomePage.jsx` — where is search/filter logic?
- [ ] Read `src/pages/ProductDetailPage.jsx` — how does it get the product id?
- [ ] Read `src/pages/CartPage.jsx` — how are items rendered?
- [ ] Read `src/components/ProductCard.jsx` — what props does it accept?
- [ ] Read `src/components/LoadingSkeleton.jsx` — how is the animation done?
- [ ] Read `src/utils/filterProducts.js` — understand the pure filter function
- [ ] Write in scratch notes: what does a product object from FakeStore API look like?
- [ ] Write: why are there 3 separate stores instead of 1?
- [ ] Write: how does the cart total recalculate when quantity changes?
- [ ] CLOSE the complete version — do not keep it open while building

## Midday Block (11:20 AM – 1:00 PM) — START the starter
- [ ] Open terminal: `cd project-starters/ecommerce-starter && npm install && npm run dev`
- [ ] Open `project-starters/ecommerce-starter/TASKS.md` — read Day 1 tasks
- [ ] Install any packages listed in TASKS.md that are missing
- [ ] Create `src/layouts/MainLayout.jsx` — imports Navbar, renders `<Outlet />`
- [ ] Create `src/components/Navbar.jsx`
- [ ] Navbar has: logo/brand text on left, nav links (Home, Cart, Favorites) on right
- [ ] Cart link shows a count badge (use hardcoded "0" for now — real count in Day 45)
- [ ] Navbar uses Tailwind: `bg-gray-900 text-white px-6 py-4 flex items-center justify-between`
- [ ] NavLinks use `NavLink` from react-router-dom with active styling
- [ ] Create placeholder `src/pages/HomePage.jsx` — just `<h1>Products</h1>` for now
- [ ] Create placeholder `src/pages/CartPage.jsx` — just `<h1>Cart</h1>`
- [ ] Create placeholder `src/pages/FavoritesPage.jsx` — just `<h1>Favorites</h1>`
- [ ] Create placeholder `src/pages/NotFoundPage.jsx` — "404 Not Found" message
- [ ] Open `src/App.jsx` — set up `<Routes>` with `MainLayout` as parent route
- [ ] Add child routes for all 4 pages inside `MainLayout` route
- [ ] Open browser: click Home → Cart → Favorites — confirm each page renders
- [ ] Click browser back button — confirm it works

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-41-dsa.js` in `week-07-project-1-ecommerce/day-41/`
- [ ] Open `dsa-bank/trees.md`
- [ ] Solve Problem 1 — pattern + complexity
- [ ] Solve Problem 2 — pattern + complexity
- [ ] Solve Problem 3 — pattern + complexity
- [ ] Write in `journal.md`: what `<Outlet />` does, why 3 stores, why pure filterProducts, what a product object looks like

## Wrap Up
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 41: Project 1 started - Navbar + layout"`
- [ ] Run: `git push origin main`

## Reminder: Study-Then-Build Rules
- NEVER copy entire files from the complete version
- If stuck → look at ONLY the relevant section → understand → close → type from memory
- The goal is understanding, not the file
