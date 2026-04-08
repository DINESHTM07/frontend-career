# Day 38 — Zustand + React Query (State Management)

**Status:** 📋 READY TO START
**Week:** 6 | **Theme:** React Intermediate

---

## What You'll Learn Today

Today you learn two libraries that have replaced Redux in most new React projects:

**Zustand** — global state management without boilerplate. Like `useState` but the state lives outside components so any component can access it. No Provider, no dispatch, no action types.

**React Query (TanStack Query)** — server state management. Handles all fetch logic, caching, loading states, refetching, and background updates automatically. Your `useFetch` hook was good — React Query is what production apps use instead.

By end of day you'll understand:
- When to use Zustand (client state: cart, user prefs, UI state shared across many pages)
- When to use React Query (server state: data from an API)
- How these two libraries work together (Zustand for UI, React Query for data)

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/react/11-state-management.md` — read before coding
3. Your React project

---

## Morning (8:00 – 11:00 AM) — Zustand Global Store

### Step 1 — Install Zustand

```bash
cd week-05-react-basics/day-27/my-react-app
npm install zustand
```

### Step 2 — Read the state management cheatsheet

Open `cheatsheets/react/11-state-management.md` and read the Zustand section.

---

### Step 3 — Understand why you need Zustand

Right now, `favorites` state lives in `App.jsx` and gets drilled down as props. It works, but:
- Every component between `App` and the one that needs `favorites` must pass it through
- If 10 components across different pages need favorites, you'd need Context or massive prop drilling

Zustand fixes this elegantly:

```js
// Without Zustand — state in App, passed down as props
App → Navbar → FavCount → needs favorites
App → MoviesPage → MovieCard → toggleFavorite

// With Zustand — any component reads directly from the store
const favorites = useFavoritesStore(state => state.favorites);
const toggle = useFavoritesStore(state => state.toggleFavorite);
```

No props. No Context. Just import the store hook and use it anywhere.

---

### Step 4 — Create the Favorites Store

Create `src/stores/favoritesStore.js`:

```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      // State
      favorites: [],

      // Actions
      addFavorite(movie) {
        set(state => ({
          favorites: [...state.favorites, movie]
        }));
      },

      removeFavorite(imdbID) {
        set(state => ({
          favorites: state.favorites.filter(m => m.imdbID !== imdbID)
        }));
      },

      toggleFavorite(movie) {
        const isSaved = get().isFavorite(movie.imdbID);
        if (isSaved) {
          get().removeFavorite(movie.imdbID);
        } else {
          get().addFavorite(movie);
        }
      },

      // Derived (computed) — a function in the store
      isFavorite(imdbID) {
        return get().favorites.some(m => m.imdbID === imdbID);
      },
    }),
    {
      name: "movie-favorites", // localStorage key — persistence is automatic!
    }
  )
);
```

The `persist` middleware automatically saves the store to `localStorage` and loads it on startup. No `useEffect` required.

---

### Step 5 — Use the store in your components

Update `MovieCard` to use the store directly — no more prop drilling:

```jsx
import { useFavoritesStore } from '../stores/favoritesStore.js'

function MovieCard({ movie, onSelect }) {
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);
  const isFavorite     = useFavoritesStore(state => state.isFavorite(movie.imdbID));

  return (
    <div onClick={onSelect} style={{ cursor: "pointer", border: "1px solid #eee", borderRadius: "8px", overflow: "hidden" }}>
      {/* ... poster, title, year ... */}
      <button
        onClick={e => { e.stopPropagation(); toggleFavorite(movie); }}
      >
        {isFavorite ? "★ Saved" : "☆ Save"}
      </button>
    </div>
  );
}
```

Update `FavoritesPage` to read from the store:

```jsx
import { useFavoritesStore } from '../stores/favoritesStore.js'

export default function FavoritesPage() {
  const favorites = useFavoritesStore(state => state.favorites);
  // No props needed — the store is the source of truth
}
```

Remove `favorites` and `onToggleFavorite` props from everywhere — they're no longer needed.

---

### Step 6 — Create a Cart Store too

Create `src/stores/cartStore.js` — move your cart reducer logic from Day 36 into a Zustand store:

```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem(product) {
        const existing = get().items.find(i => i.id === product.id);
        if (existing) {
          set(state => ({
            items: state.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i),
            total: state.total + product.price
          }));
        } else {
          set(state => ({
            items: [...state.items, { ...product, quantity: 1 }],
            total: state.total + product.price
          }));
        }
      },

      removeItem(id) {
        const item = get().items.find(i => i.id === id);
        set(state => ({
          items: state.items.filter(i => i.id !== id),
          total: state.total - item.price * item.quantity
        }));
      },

      clearCart() {
        set({ items: [], total: 0 });
      },
    }),
    { name: "shopping-cart" }
  )
);
```

Update `CartPage.jsx` to use `useCartStore` instead of `useReducer`.

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:00 PM) — React Query

### Install React Query

```bash
npm install @tanstack/react-query
```

### Wrap app in QueryClientProvider

In `src/main.jsx`:
```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
```

### Refactor JokeFetcher to use useQuery

**Before (manual fetch):**
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch(url).then(r => r.json()).then(setData).catch(e => setError(e.message)).finally(() => setLoading(false));
}, [url]);
```

**After (React Query):**
```jsx
import { useQuery } from '@tanstack/react-query'

const { data, isLoading, isError, error, refetch } = useQuery({
  queryKey: ["joke"],                // cache key — same key = same cache entry
  queryFn: () => fetch("https://official-joke-api.appspot.com/random_joke").then(r => r.json()),
  staleTime: 1000 * 60,             // data stays "fresh" for 1 minute (no refetch)
});
```

**What you get for free:**
- Automatic loading state
- Automatic error state
- **Caching** — if you navigate away and come back, data is instant (no re-fetch) until `staleTime` expires
- Background refetching when window regains focus
- `refetch()` function to manually trigger a new fetch

### Build a Pokémon page with useQuery

Create `src/pages/PokemonPage.jsx`:

```jsx
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

async function fetchPokemon(page) {
  const offset = page * 20;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon");
  return res.json();
}

export default function PokemonPage() {
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["pokemon", page],     // key changes with page → refetches
    queryFn: () => fetchPokemon(page),
    placeholderData: previousData => previousData, // keep previous data while loading next page
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError)   return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Pokémon {isFetching && <small style={{ color: "#888" }}>(updating...)</small>}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        {data.results.map(p => (
          <div key={p.name} style={{ border: "1px solid #eee", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
            <p style={{ margin: 0, textTransform: "capitalize", fontWeight: "600" }}>{p.name}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{ padding: "8px 16px" }}>
          Previous
        </button>
        <span style={{ alignSelf: "center" }}>Page {page + 1}</span>
        <button onClick={() => setPage(p => p + 1)} style={{ padding: "8px 16px" }}>
          Next
        </button>
      </div>
    </div>
  );
}
```

Add route `/pokemon` in `App.jsx`. Navigate between pages — notice: going back to a previous page loads instantly from cache. No second network request.

---

## Afternoon (2:00 – 4:00 PM) — DSA

Open `dsa-bank/trees.md` (or `linked-lists.md`). Solve **3 problems**.

Create `day-38-dsa.js` in the `week-06-react-intermediate/day-38/` folder.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- What is the difference between client state (Zustand) and server state (React Query)?
- How does React Query caching work — what is `staleTime`?
- How did the Zustand `persist` middleware replace your manual localStorage code?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 38: Zustand store + React Query + 3 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Installed `zustand`
- [ ] Created `src/stores/favoritesStore.js` with `persist` middleware
- [ ] `MovieCard` reads from store directly — no favorites prop needed
- [ ] `FavoritesPage` reads from store directly — no favorites prop needed
- [ ] Favorites persist across page refreshes (localStorage via persist)
- [ ] Created `src/stores/cartStore.js` — cart logic moved from useReducer
- [ ] `CartPage.jsx` updated to use `useCartStore`
- [ ] Installed `@tanstack/react-query`
- [ ] Added `QueryClientProvider` in `main.jsx`
- [ ] `JokeFetcher` or similar refactored to use `useQuery`
- [ ] Built `PokemonPage.jsx` with paginated `useQuery`
- [ ] Navigating back to a cached page is instant (no loading spinner)
- [ ] Solved 3 DSA problems in `day-38-dsa.js`
- [ ] Committed and pushed

---

## Quick Reference

```js
// Zustand store
import { create } from 'zustand'
const useStore = create((set, get) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  double:    () => get().count * 2,  // derived value using get()
}));

// In component
const count     = useStore(state => state.count);
const increment = useStore(state => state.increment);

// React Query
import { useQuery } from '@tanstack/react-query'
const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ["todos", userId],        // unique cache key
  queryFn:  () => fetchTodos(userId), // async function
  staleTime: 1000 * 60 * 5,          // 5 minutes before re-fetch
});
```

---

*Zustand + React Query is the modern alternative to Redux. Most new React job listings now mention these two. You know them now.*
