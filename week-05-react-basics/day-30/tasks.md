# Day 30 Tasks — Conditional Rendering + Error/Loading States + Movie Search

## Pre-start (get OMDB key before coding)
- [ ] Go to omdbapi.com → API Key → free tier → enter email → get key from inbox
- [ ] Paste your API key somewhere safe — you'll put it directly in the component for now

## Morning Block (8:00 – 11:30 AM)
- [ ] Create `src/MovieSearch.jsx` in your React project
- [ ] Set up all 6 state variables: `query`, `movies`, `isLoading`, `error`, `selected`, `favorites`
- [ ] Write `searchMovies(searchTerm)` async function with try/catch/finally
- [ ] Handle OMDB's `data.Response === "False"` case — it's an error in the body, not HTTP error
- [ ] Add `useEffect` with `[query]` dep — fires whenever query changes
- [ ] Add debounce inside useEffect: `setTimeout(500)` + cleanup `return () => clearTimeout(timer)`
- [ ] Confirm: typing fast fires only 1 search (at the end of typing pause)
- [ ] Render loading: `{isLoading && <p>Searching...</p>}`
- [ ] Render error: `{error && !isLoading && <p>{error}</p>}`
- [ ] Render empty state (searched but no results): condition for `movies.length === 0 && query.length >= 2`
- [ ] Render no-query prompt: `{query.length < 2 && <p>Type 2+ chars to search</p>}`
- [ ] Render results grid with `.map()` — `key={movie.imdbID}` on every card
- [ ] Build `MovieCard` component (can be in same file): poster img, title, year, save button
- [ ] Fallback poster if `movie.Poster === "N/A"` — use a placeholder image
- [ ] Build `MovieDetail` modal: fixed overlay, title, year, IMDB ID, close button
- [ ] Clicking a card sets `selected` — modal opens
- [ ] Close button sets `selected(null)` — modal closes
- [ ] Write `toggleFavorite(movie)`: `.some()` to check, spread to add, `.filter()` to remove
- [ ] Favorite button uses `e.stopPropagation()` — prevents card click from also firing
- [ ] Button label: "☆ Save" vs "★ Saved" based on whether it's in favorites
- [ ] Test all 5 states manually: loading, error, empty, no-query, results

## Midday Block (11:30 AM – 1:00 PM)
- [ ] Add `showFavorites` boolean state
- [ ] Add toggle button: shows "Favorites (N)" or "Search Results"
- [ ] When `showFavorites` true: render favorites grid using same `MovieCard`
- [ ] When favorites empty: show "No favorites yet — save movies to see them here"
- [ ] Test: save 2 movies, switch to favorites, unsave one, count updates

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Open `exercises/react-basics/22-effect-escape.jsx` — fix ALL remaining bugs with comments
- [ ] Create `day-30-dsa.js` in `week-05-react-basics/day-30/` (not in React project)
- [ ] Open `dsa-bank/02-arrays-medium.md`
- [ ] Solve Problem 10 — pattern + complexity
- [ ] Solve Problem 11 — pattern + complexity
- [ ] Solve Problem 12 — pattern + complexity

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — name all 5 conditional states, explain stopPropagation, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 30: Movie Search App with loading/error states + 3 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Fetch full movie details from OMDB on card click (`?apikey=KEY&i=IMDBID`) — show plot in modal
- [ ] Persist favorites to localStorage — survive page refresh
- [ ] Add clear search X button inside the search input
