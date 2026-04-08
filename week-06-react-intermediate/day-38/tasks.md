# Day 38 Tasks — Zustand + React Query

## Morning Block (8:00 – 11:00 AM)
- [ ] Read `cheatsheets/react/11-state-management.md` fully
- [ ] Run: `npm install zustand` in your React project
- [ ] Create `src/stores/` folder
- [ ] Create `src/stores/favoritesStore.js`
- [ ] Use `create` from zustand with `persist` middleware
- [ ] State: `favorites` array
- [ ] Actions: `addFavorite(movie)`, `removeFavorite(imdbID)`, `toggleFavorite(movie)`
- [ ] Computed: `isFavorite(imdbID)` using `get().favorites.some(...)`
- [ ] `persist` options: `{ name: "movie-favorites" }` — auto saves to localStorage
- [ ] Update `MovieCard` component: import `useFavoritesStore`, remove `isFavorite` and `onToggleFavorite` props
- [ ] Update `FavoritesPage`: import `useFavoritesStore`, remove `favorites` prop
- [ ] Remove `favorites` state and `toggleFavorite` function from `App.jsx`
- [ ] Remove favorites props from all Route elements in App.jsx
- [ ] Test: save a movie, refresh page — favorite is still saved (persist works)
- [ ] Create `src/stores/cartStore.js` using Zustand + persist
- [ ] Actions: `addItem`, `removeItem`, `increment`, `decrement`, `clearCart`
- [ ] Update `CartPage.jsx` to use `useCartStore` instead of `useReducer`
- [ ] Test cart — same functionality, now persists across page refreshes

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Run: `npm install @tanstack/react-query`
- [ ] Open `src/main.jsx` — import `QueryClient` and `QueryClientProvider`
- [ ] Create `new QueryClient()` and wrap app: `<QueryClientProvider client={queryClient}>`
- [ ] Open `src/JokeFetcher.jsx` (or similar component)
- [ ] Replace useState + useEffect with `useQuery({ queryKey: [...], queryFn: ... })`
- [ ] Destructure: `data`, `isLoading`, `isError`, `error`, `refetch`
- [ ] "New Joke" button calls `refetch()` instead of the manual fetch function
- [ ] Create `src/pages/PokemonPage.jsx`
- [ ] State: `page` number (starts at 0)
- [ ] `useQuery({ queryKey: ["pokemon", page], queryFn: () => fetchPokemon(page), placeholderData: keepPreviousData })`
- [ ] Render Pokémon names in a grid
- [ ] Previous / Next page buttons update `page` state
- [ ] Add route `/pokemon` in App.jsx
- [ ] Navigate: go to page 2, then go back to page 1 — no loading spinner (instant from cache)

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-38-dsa.js` in `week-06-react-intermediate/day-38/`
- [ ] Open `dsa-bank/trees.md` or `dsa-bank/linked-lists.md`
- [ ] Solve Problem 1 — pattern + complexity
- [ ] Solve Problem 2 — pattern + complexity
- [ ] Solve Problem 3 — pattern + complexity

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — client vs server state, how staleTime works, how persist replaced localStorage code, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 38: Zustand store + React Query + 3 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Install React Query Devtools: `npm install @tanstack/react-query-devtools` — see the cache visually
- [ ] Add `useMutation` from React Query for a POST request (e.g., creating a todo)
- [ ] Add `keepPreviousData` so old Pokémon show while next page loads
- [ ] Research: what is the difference between Zustand and Redux Toolkit?
