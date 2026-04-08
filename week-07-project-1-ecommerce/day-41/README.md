# Day 41 — Project 1 Day 1: Study Complete Version + Start Building

**Status:** 📋 READY TO START
**Week:** 7 | **Theme:** E-Commerce Project

---

## How This Week Works — Read This First

This week is different from every other week. You are not following exercises. You are building a **real portfolio project** from scratch.

The method:

1. **Morning: Study the complete version** — open `project-starters/ecommerce-complete/`, run it, use it, read every file. Understand the architecture before touching the starter.
2. **Close the complete version.**
3. **Rest of day: Build in the starter** — open `project-starters/ecommerce-starter/`, follow `TASKS.md` for today's tasks.
4. **When stuck: peek at the complete version for HINTS only** — find the relevant section, understand the approach, close it, then type it yourself.
5. **Do NOT copy entire files.** The point is to build the understanding, not the file.

This method is called "study-then-build." It is how senior developers learn new codebases. By the end of this week you will have a deployed project you fully understand and can explain in an interview.

---

## The Project: E-Commerce Product Explorer

**What it does:**
- Fetches real products from the FakeStore API (`fakestoreapi.com/products`)
- Displays them in a responsive grid with product cards
- Search with debounce, filter by category, sort by price/rating
- Click a product → detail page with full info and "Add to Cart"
- Cart with Zustand: add, remove, change quantity, persistent totals
- Favorites: save/unsave products, persisted in localStorage
- Dark mode toggle
- Loading skeletons while fetching
- React Router with dynamic routes

**Tech stack:** React + Vite, React Router, Zustand, React Query, Tailwind CSS, React Hook Form

---

## Files to Open Today

1. **This README** — read first
2. `project-starters/ecommerce-complete/` — study in morning
3. `project-starters/ecommerce-starter/` — build in afternoon
4. `project-starters/ecommerce-starter/TASKS.md` — your daily task list

---

## Morning (8:00 – 11:00 AM) — Study the Complete Version

### Step 1 — Run the complete version

Open the terminal:
```bash
cd project-starters/ecommerce-complete
npm install
npm run dev
```

Open `http://localhost:5173`. Click through everything:
- Browse the product grid
- Search for "shirt"
- Filter by electronics
- Sort by price (low → high)
- Click a product card → open detail page
- Add to cart → go to cart page → change quantity → see total update
- Save a favorite → go to favorites
- Toggle dark mode

Spend 15 minutes using the app as a user would. Notice what's smooth, what's instant, what shows loading states.

---

### Step 2 — Read every file in the complete version

Work through the folder structure systematically. For each file, ask:
- What does this file do?
- What does it import?
- What does it export?
- How does data flow in and out?

**Suggested reading order:**

```
1. package.json          — what libraries are installed?
2. vite.config.js        — any custom Vite config?
3. src/main.jsx          — what providers wrap the app?
4. src/App.jsx           — what routes exist?
5. src/layouts/          — how is the page shell structured?
6. src/stores/           — what Zustand stores exist? what state do they hold?
7. src/hooks/            — what custom hooks? what do they abstract?
8. src/pages/            — read each page top to bottom
9. src/components/       — read each component, understand the props
```

**While reading, write notes.** Open a scratch file or your journal and answer:
- How many Zustand stores are there? What state does each hold?
- What custom hooks exist? What do they return?
- How does the search + filter logic work — where does the filtering happen?
- How does the cart total update when quantity changes?
- What is the structure of a product object from the API?

Take the full 3 hours on this. Speed here costs you more time later.

---

### The Architecture (read this AFTER you've explored the complete version)

The complete version follows this structure:

```
src/
  main.jsx              ← QueryClientProvider + BrowserRouter + ThemeProvider + App
  App.jsx               ← Routes only
  layouts/
    MainLayout.jsx      ← Navbar + <Outlet /> (all pages render inside Outlet)
  pages/
    HomePage.jsx        ← product grid + search + filters (main page)
    ProductDetailPage.jsx ← single product + add to cart
    CartPage.jsx        ← cart items + quantities + total
    FavoritesPage.jsx   ← saved products
    NotFoundPage.jsx    ← 404
  components/
    Navbar.jsx          ← links, cart count badge, favorites count, dark mode toggle
    ProductCard.jsx     ← single card: image, title, price, rating, add to cart, favorite
    ProductGrid.jsx     ← maps over products array, renders ProductCards
    FilterBar.jsx       ← category buttons + sort dropdown
    SearchBar.jsx       ← controlled input wired to search state
    CartItem.jsx        ← single cart row with +/− quantity buttons
    LoadingSkeleton.jsx ← animated placeholder cards
    ErrorMessage.jsx    ← reusable error display with retry button
  stores/
    cartStore.js        ← Zustand: items, addItem, removeItem, updateQty, clearCart, total
    favoritesStore.js   ← Zustand: favorites, toggleFavorite, isFavorite
    themeStore.js       ← Zustand: isDark, toggleTheme (persisted)
  hooks/
    useProducts.js      ← useQuery wrapper for fetching all products
    useProduct.js       ← useQuery wrapper for fetching single product by id
    useDebounce.js      ← delays search value by 400ms
  utils/
    filterProducts.js   ← pure function: takes products + filters, returns filtered array
```

---

## Midday (11:20 AM – 1:00 PM) — Start the Starter

### Step 1 — Run the starter

```bash
cd project-starters/ecommerce-starter
npm install
npm run dev
```

The starter will have a blank or minimal UI. That is normal. Your job is to fill it in.

### Step 2 — Read TASKS.md in the starter

Open `project-starters/ecommerce-starter/TASKS.md`. It lists exactly what to build each day.

**Today's tasks from TASKS.md — Day 1:**
- Understand the folder structure (it mirrors the complete version's structure but empty)
- Install any missing packages listed in TASKS.md
- Build `Navbar.jsx` — logo, nav links (Home, Cart, Favorites), cart count badge
- Build `MainLayout.jsx` — Navbar on top, `<Outlet />` below
- Wire up `App.jsx` with `BrowserRouter`, `Routes`, and `MainLayout` as the parent route
- Add placeholder pages: `HomePage`, `CartPage`, `FavoritesPage`, `NotFoundPage`
- Confirm navigation works — clicking links changes the page

### Step 3 — Work the problem

Build the Navbar. Do not look at the complete version immediately — try first.

When you get stuck on something specific:
1. Close everything
2. Think for 5 minutes
3. Look at the complete version — find ONLY that section
4. Understand the approach
5. Close the complete version
6. Type your own version from understanding

---

## Afternoon (2:00 – 4:00 PM) — DSA + Architecture Journal

### DSA

Open `dsa-bank/trees.md`. Solve **problems 1, 2, and 3**.

Create `day-41-dsa.js` in the `week-07-project-1-ecommerce/day-41/` folder.

### Architecture Journal

Write in `journal.md` — **"Day 41: Architecture Decisions"**:

1. What does `<Outlet />` do in React Router — why is it used in `MainLayout`?
2. Why are there 3 separate Zustand stores (cart, favorites, theme) instead of one big store?
3. Why is filtering done in `filterProducts.js` (a pure function) instead of inside the component?
4. What is the FakeStore API returning — what does a product object look like?

These are the kinds of questions an interviewer would ask about your project. Know the answers.

---

## Wrap Up (4:15 – 5:30 PM)

```bash
git add .
git commit -m "Day 41: Project 1 started - Navbar + layout"
git push origin main
```

---

## End of Day Checklist

- [ ] Ran the complete version — used the app as a user for 15+ minutes
- [ ] Read every file in the complete version systematically
- [ ] Wrote architecture notes (how many stores, what hooks exist, how filtering works)
- [ ] Ran the starter version successfully
- [ ] Read TASKS.md in the starter
- [ ] Built `Navbar.jsx` — logo + links + cart count badge
- [ ] Built `MainLayout.jsx` — Navbar + Outlet
- [ ] Wired `App.jsx` with routes and MainLayout as parent
- [ ] All 4 placeholder pages exist and nav links work
- [ ] Solved 3 DSA problems in `day-41-dsa.js`
- [ ] Wrote architecture journal entry
- [ ] Committed and pushed

---

## Quick Reference — React Router Nested Layout Pattern

```jsx
// App.jsx
<Routes>
  <Route element={<MainLayout />}>          {/* parent — renders Navbar + Outlet */}
    <Route path="/"          element={<HomePage />} />
    <Route path="/cart"      element={<CartPage />} />
    <Route path="/favorites" element={<FavoritesPage />} />
    <Route path="/product/:id" element={<ProductDetailPage />} />
    <Route path="*"          element={<NotFoundPage />} />
  </Route>
</Routes>

// MainLayout.jsx
import { Outlet } from 'react-router-dom'
export default function MainLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />  {/* child route renders here */}
      </main>
    </div>
  );
}
```

---

*This week you stop practicing and start building. The gap between a junior who "learned React" and one who "shipped a real project" is what you're closing right now.*
