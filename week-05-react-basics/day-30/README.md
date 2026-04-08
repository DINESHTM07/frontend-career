# Day 30 — Conditional Rendering + Error/Loading States + Movie Search

**Status:** 📋 READY TO START
**Week:** 5 | **Theme:** React Basics

---

## What You'll Learn Today

Today everything from the last three days comes together into one real, complete project: a Movie Search App.

You'll use:
- `useState` for search input, results, favorites, selected movie, loading, error
- `useEffect` to trigger searches when the query changes
- Conditional rendering for loading spinner, error state, empty state, results
- List rendering with `.map()` and stable keys
- Click handlers to navigate between views (list → detail)

This is the most complete React app you've built so far.

---

## Files to Open Today

1. **This README** — read first
2. `week-05-react-basics/day-27/my-react-app/src/` — add the Movie app here
3. `exercises/react-basics/22-effect-escape.jsx` — afternoon (remaining bugs)

**Before you start: Get a free OMDB API key**

1. Go to **omdbapi.com**
2. Click "API Key" → free tier → enter your email
3. You'll get an email with your API key (looks like `abc12345`)
4. API calls look like: `http://www.omdbapi.com/?apikey=YOUR_KEY&s=batman`

---

## Morning (8:00 – 11:00 AM) — Build the Movie Search App

Create `src/MovieSearch.jsx`. Build it step by step.

### Step 1 — State setup

```jsx
import { useState, useEffect } from 'react'

const API_KEY = "YOUR_KEY_HERE"; // paste your key

export default function MovieSearch() {
  const [query, setQuery]       = useState("");
  const [movies, setMovies]     = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState(null);
  const [selected, setSelected] = useState(null);  // currently viewed movie
  const [favorites, setFavorites] = useState([]);  // saved movies

  // ... rest of component
}
```

---

### Step 2 — Fetch function

```jsx
async function searchMovies(searchTerm) {
  if (!searchTerm.trim()) {
    setMovies([]);
    return;
  }

  setIsLoading(true);
  setError(null);

  try {
    const res = await fetch(
      `http://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.Response === "False") {
      setError(data.Error); // OMDB returns error in the response body
      setMovies([]);
    } else {
      setMovies(data.Search);
    }
  } catch (err) {
    setError(err.message);
    setMovies([]);
  } finally {
    setIsLoading(false);
  }
}
```

---

### Step 3 — Trigger search when query changes (debounced)

```jsx
useEffect(() => {
  // Don't search for very short queries
  if (query.length < 2) {
    setMovies([]);
    setError(null);
    return;
  }

  // Debounce: wait 500ms after last keystroke before searching
  const timer = setTimeout(() => {
    searchMovies(query);
  }, 500);

  // Cleanup: cancel the timer if query changes again before 500ms
  return () => clearTimeout(timer);
}, [query]);  // re-runs whenever query changes
```

This is a real-world debounce inside `useEffect`. The cleanup function (`return () => clearTimeout(timer)`) cancels the previous timer when the query changes — so you don't fire 10 API calls for "batman".

---

### Step 4 — The render with ALL conditional states

```jsx
return (
  <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "800px" }}>
    <h1>Movie Search</h1>
    <p>{favorites.length} favorites</p>

    {/* Search input */}
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search for movies..."
      style={{ width: "100%", padding: "12px", fontSize: "16px", marginBottom: "16px", boxSizing: "border-box" }}
    />

    {/* Loading state */}
    {isLoading && <p style={{ color: "#888" }}>🔍 Searching...</p>}

    {/* Error state */}
    {error && !isLoading && (
      <p style={{ color: "#ef4444" }}>⚠️ {error}</p>
    )}

    {/* Empty results (searched but nothing found) */}
    {!isLoading && !error && query.length >= 2 && movies.length === 0 && (
      <p style={{ color: "#888" }}>No movies found for "{query}"</p>
    )}

    {/* Initial state (no query yet) */}
    {query.length < 2 && !isLoading && (
      <p style={{ color: "#aaa" }}>Type at least 2 characters to search</p>
    )}

    {/* Results grid */}
    {!isLoading && movies.length > 0 && (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
        {movies.map(movie => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavorite={favorites.some(f => f.imdbID === movie.imdbID)}
            onSelect={() => setSelected(movie)}
            onToggleFavorite={() => toggleFavorite(movie)}
          />
        ))}
      </div>
    )}

    {/* Detail panel — shown when a movie is selected */}
    {selected && (
      <MovieDetail
        movie={selected}
        onClose={() => setSelected(null)}
      />
    )}
  </div>
);
```

---

### Step 5 — MovieCard and MovieDetail components

Create these as separate files or as sub-components at the bottom of `MovieSearch.jsx`:

```jsx
function MovieCard({ movie, isFavorite, onSelect, onToggleFavorite }) {
  return (
    <div
      onClick={onSelect}
      style={{ cursor: "pointer", border: "1px solid #eee", borderRadius: "8px", overflow: "hidden" }}
    >
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/160x240?text=No+Poster"}
        alt={movie.Title}
        style={{ width: "100%", height: "240px", objectFit: "cover", display: "block" }}
      />
      <div style={{ padding: "8px" }}>
        <p style={{ margin: "0 0 4px", fontWeight: "bold", fontSize: "14px" }}>{movie.Title}</p>
        <p style={{ margin: 0, color: "#888", fontSize: "12px" }}>{movie.Year}</p>
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(); }}
          style={{ marginTop: "8px", fontSize: "12px", background: "none", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer", padding: "4px 8px" }}
        >
          {isFavorite ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    </div>
  );
}

function MovieDetail({ movie, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{ background: "white", borderRadius: "12px", padding: "24px", maxWidth: "400px", width: "90%" }}>
        <h2 style={{ margin: "0 0 8px" }}>{movie.Title}</h2>
        <p style={{ color: "#888", margin: "0 0 16px" }}>{movie.Year} · {movie.Type}</p>
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/160x240?text=No+Poster"}
          alt={movie.Title}
          style={{ width: "120px", float: "left", marginRight: "16px", borderRadius: "8px" }}
        />
        <p style={{ fontSize: "14px", lineHeight: "1.5" }}>IMDB ID: {movie.imdbID}</p>
        <div style={{ clear: "both", paddingTop: "16px" }}>
          <button onClick={onClose} style={{ padding: "8px 20px", cursor: "pointer" }}>Close</button>
        </div>
      </div>
    </div>
  );
}
```

---

### Step 6 — Favorites toggle

Add the `toggleFavorite` function inside `MovieSearch`:

```jsx
function toggleFavorite(movie) {
  setFavorites(prev => {
    const exists = prev.some(f => f.imdbID === movie.imdbID);
    return exists
      ? prev.filter(f => f.imdbID !== movie.imdbID)  // remove
      : [...prev, movie];                              // add
  });
}
```

---

## Mid-Morning Break (11:30 AM)

Test every state: loading (appears briefly), error (type gibberish), empty (type "xyzxyz"), results, click to view detail, save favorites.

---

## Midday (11:30 AM – 1:00 PM) — Add Favorites View

Add a "Show Favorites" toggle to your Movie Search app.

```jsx
const [showFavorites, setShowFavorites] = useState(false);

// In the render, add a toggle button:
<button onClick={() => setShowFavorites(prev => !prev)}>
  {showFavorites ? "Search Results" : `Favorites (${favorites.length})`}
</button>

// Then conditionally show favorites or results:
{showFavorites ? (
  <div>
    <h2>Your Favorites</h2>
    {favorites.length === 0
      ? <p>No favorites yet — search and click ☆ to save</p>
      : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
          {favorites.map(movie => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              isFavorite
              onSelect={() => setSelected(movie)}
              onToggleFavorite={() => toggleFavorite(movie)}
            />
          ))}
        </div>
    }
  </div>
) : (
  /* ... the search results section ... */
)}
```

---

## Lunch (1:00 – 2:00 PM)

---

## Afternoon (2:00 – 4:00 PM) — Effect Escape Room + DSA

### Fix remaining useEffect bugs

Open `exercises/react-basics/22-effect-escape.jsx`. Fix **all remaining bugs** (you did 2 yesterday — finish the rest today).

### DSA

Open `dsa-bank/02-arrays-medium.md`. Solve **problems 10, 11, and 12**.

Create `day-30-dsa.js` in the `day-30/` folder.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- List the 5 conditional states you handled in Movie Search (loading, error, empty, no query, results)
- What does `e.stopPropagation()` do in the favorite button — and why did you need it?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 30: Movie Search App with loading/error states + 3 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Got OMDB API key (free, from omdbapi.com)
- [ ] Built `MovieSearch.jsx` with all state variables
- [ ] Search debounces correctly — only fires after 500ms of inactivity
- [ ] Cleanup function (`return () => clearTimeout(timer)`) cancels stale timers
- [ ] All 5 states render correctly: loading / error / empty / no-query / results
- [ ] `MovieCard` component renders poster, title, year, favorite button
- [ ] Clicking a card opens `MovieDetail` modal overlay
- [ ] `e.stopPropagation()` prevents card click when clicking the favorite button
- [ ] `toggleFavorite` adds and removes from favorites array (spread + filter)
- [ ] Favorites view toggles between search results and saved movies
- [ ] Fixed all `22-effect-escape.jsx` bugs with comments
- [ ] Solved 3 DSA problems in `day-30-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference — Conditional Rendering Patterns

```jsx
// Pattern 1: && (short circuit)
{isLoading && <Spinner />}

// Pattern 2: ternary
{isLoading ? <Spinner /> : <Content />}

// Pattern 3: early return (useful for top-level conditions)
if (isLoading) return <Spinner />;
if (error) return <ErrorPage />;
return <Content />;

// Pattern 4: multiple states (what Movie Search uses)
{isLoading && <p>Loading...</p>}
{error && !isLoading && <p>{error}</p>}
{!isLoading && !error && results.length === 0 && <p>No results</p>}
{!isLoading && results.length > 0 && <ResultsList />}
```

---

*Building this app is a milestone. You combined useState + useEffect + conditional rendering + event handling + API calls into one working product. That is the core of React development.*
