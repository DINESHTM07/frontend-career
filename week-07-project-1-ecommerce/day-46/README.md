# Day 46 — Project 1 Day 6: Favorites + Dark Mode + Loading Skeletons

**Status:** 📋 READY TO START
**Week:** 7 | **Theme:** E-Commerce Project

---

## Today's Goal

The app is functional. Today you add the features that make it feel polished:
- Favorites: save/unsave products, view saved products on `/favorites`
- Dark mode: full app-wide theme toggle, persisted in localStorage
- Loading skeletons already exist — wire them wherever there's loading
- Error boundary: catch unexpected React errors gracefully

By end of today, the app should feel like a real product, not a student project.

---

## Daily Rule: Study → Close → Build

Before building, read in the complete version:
- `src/stores/favoritesStore.js`
- `src/stores/themeStore.js`
- `src/pages/FavoritesPage.jsx`
- `src/components/Navbar.jsx` — how dark mode toggle is wired
- Any error boundary component

Take notes. Close. Build.

---

## Morning (8:00 – 11:00 AM) — Favorites Store + FavoritesPage

### Build: favoritesStore

Create `src/stores/favoritesStore.js`:

```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],  // array of product objects

      toggleFavorite(product) {
        const isSaved = get().isFavorite(product.id);
        if (isSaved) {
          set(state => ({
            favorites: state.favorites.filter(p => p.id !== product.id)
          }));
        } else {
          set(state => ({
            favorites: [...state.favorites, product]
          }));
        }
      },

      isFavorite(productId) {
        return get().favorites.some(p => p.id === productId);
      },

      clearFavorites() {
        set({ favorites: [] });
      },
    }),
    { name: "ecommerce-favorites" }
  )
);
```

---

### Wire favorites into ProductCard

Open `src/components/ProductCard.jsx`:

```jsx
import { useFavoritesStore } from '../stores/favoritesStore.js'

export default function ProductCard({ product }) {
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);
  const isFavorite     = useFavoritesStore(state => state.isFavorite(product.id));

  // In the favorite button:
  <button
    onClick={e => {
      e.stopPropagation();
      toggleFavorite(product);
    }}
    className={`text-xl transition-colors ${isFavorite ? "text-red-500" : "text-gray-300 hover:text-red-400"}`}
    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
  >
    {isFavorite ? "♥" : "♡"}
  </button>
}
```

Also wire the favorite button on `ProductDetailPage.jsx`.

---

### Build: FavoritesPage

Create `src/pages/FavoritesPage.jsx`:

```jsx
import { useFavoritesStore } from '../stores/favoritesStore.js'
import ProductGrid from '../components/ProductGrid.jsx'

export default function FavoritesPage() {
  const favorites      = useFavoritesStore(state => state.favorites);
  const clearFavorites = useFavoritesStore(state => state.clearFavorites);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Favorites
          <span className="text-gray-400 font-normal text-lg ml-2">({favorites.length})</span>
        </h1>
        {favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Clear all
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">♡</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
          <p className="text-gray-500">Click the heart on any product to save it here.</p>
        </div>
      ) : (
        <ProductGrid products={favorites} />
      )}
    </div>
  );
}
```

Add a favorites count badge in the Navbar (similar to the cart badge).

---

## Midday (11:20 AM – 1:00 PM) — Dark Mode

### Build: themeStore

Create `src/stores/themeStore.js`:

```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set(state => ({ isDark: !state.isDark })),
    }),
    { name: "ecommerce-theme" }
  )
);
```

### Apply dark mode with Tailwind

Tailwind's dark mode works with the `dark` class on the `<html>` element. In `src/main.jsx` or `App.jsx`, subscribe to the store and toggle the class:

```jsx
import { useEffect } from 'react'
import { useThemeStore } from './stores/themeStore.js'

function ThemeWatcher() {
  const isDark = useThemeStore(state => state.isDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return null; // renders nothing — just watches
}

// Add <ThemeWatcher /> inside App.jsx return, alongside Routes
```

Enable Tailwind dark mode in your CSS (Tailwind v4 uses media by default, we need class-based):

In `src/index.css` or `tailwind.config.js` (depending on Tailwind version):
```css
/* For Tailwind v4 — add to index.css */
@import "tailwindcss";

@layer base {
  :root {
    color-scheme: light dark;
  }
}
```

Or in `vite.config.js`/`tailwind.config.js` for v3: `darkMode: 'class'`

### Add dark variants to key components

Update your main layout and key components with `dark:` variants:

```jsx
// MainLayout or App wrapper div
<div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">

// Navbar
<nav className="bg-gray-900 dark:bg-gray-950 border-b border-gray-800">

// ProductCard
<div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">

// Inputs
<input className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
```

### Dark mode toggle button in Navbar

```jsx
const { isDark, toggleTheme } = useThemeStore();

<button onClick={toggleTheme} className="text-gray-400 hover:text-white transition-colors" aria-label="Toggle dark mode">
  {isDark ? "☀️" : "🌙"}
</button>
```

---

## Afternoon (2:00 – 4:00 PM) — Error Boundary + DSA

### Add a basic Error Boundary

Create `src/components/ErrorBoundary.jsx`:

```jsx
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-4xl mb-4">⚠️</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-500 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Wrap your app in `main.jsx`:
```jsx
<ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    ...
  </QueryClientProvider>
</ErrorBoundary>
```

Error boundaries must be class components — this is the one place in React where you still need them.

### DSA

Open `dsa-bank/recursion.md`. Solve **3 problems**.

Create `day-46-dsa.js` in the `week-07-project-1-ecommerce/day-46/` folder.

---

## Wrap Up

Write in `journal.md`:
- How does Tailwind `dark:` class work — what needs to be on the `<html>` element?
- Why is an Error Boundary a class component and not a function component?
- What does `toggleFavorite` need to check before deciding whether to add or remove?

```bash
git add .
git commit -m "Day 46: Favorites + localStorage + dark mode + loading skeletons"
git push origin main
```

---

## End of Day Checklist

- [ ] Studied: `favoritesStore`, `themeStore`, `FavoritesPage`, Navbar dark toggle in complete version
- [ ] Built `src/stores/favoritesStore.js` — `toggleFavorite`, `isFavorite`, `clearFavorites` with persist
- [ ] `ProductCard` heart button: filled red when favorite, hollow when not
- [ ] `ProductDetailPage` heart button wired to `toggleFavorite`
- [ ] Favorites badge in Navbar (count badge, only shows when > 0)
- [ ] `FavoritesPage` — empty state + grid of favorites + "Clear all"
- [ ] Built `src/stores/themeStore.js` — `isDark` + `toggleTheme` with persist
- [ ] `ThemeWatcher` component toggles `dark` class on `<html>` element
- [ ] Dark mode toggle button in Navbar (sun/moon icon)
- [ ] Key components have `dark:` variants — backgrounds, text, borders look correct in dark mode
- [ ] Dark mode preference persists after page refresh
- [ ] Built `ErrorBoundary` class component — wraps app in `main.jsx`
- [ ] Solved 3 DSA problems in `day-46-dsa.js`
- [ ] Committed and pushed
