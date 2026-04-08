# Day 34 Tasks — React Router: Multi-Page Apps

## Morning Block (8:00 – 11:00 AM)
- [ ] Open terminal in your React project: `cd week-05-react-basics/day-27/my-react-app`
- [ ] Run: `npm install react-router-dom`
- [ ] Read `cheatsheets/react/09-react-router.md` fully
- [ ] Open `src/main.jsx` — import `BrowserRouter` and wrap `<App />` with it
- [ ] Create `src/pages/` folder
- [ ] Create `src/pages/Home.jsx` — welcome message + two Link buttons
- [ ] Create `src/pages/About.jsx` — brief about paragraph
- [ ] Create `src/pages/Contact.jsx` — simple form with sent confirmation state
- [ ] Create `src/components/Navbar.jsx` using `NavLink` for all links
- [ ] Add `end` prop to the "/" NavLink — confirm "/" doesn't match /movies as active
- [ ] Use `style={({ isActive }) => ...}` on NavLinks — active link gets distinct color + border
- [ ] Open `src/App.jsx` — import `Routes` and `Route`, replace content with route declarations
- [ ] Add route for "/" → Home, "/about" → About, "/contact" → Contact
- [ ] Add catch-all route `path="*"` → NotFound component
- [ ] Click each nav link — confirm URL changes + correct page renders
- [ ] Click browser back button — confirm it navigates correctly
- [ ] Type a non-existent URL directly — confirm 404 page appears

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Open `exercises/react-basics/25-netflix-router.jsx`
- [ ] Create `src/pages/NetflixHome.jsx` — movie grid, each card navigates on click
- [ ] Create `src/pages/MovieDetail.jsx` — reads `:id` from URL with `useParams`
- [ ] Import and use `useParams` in MovieDetail — log the id to confirm it reads correctly
- [ ] Import and use `useNavigate` in movie cards — `navigate('/movie/' + movie.id)` on click
- [ ] Add routes: `path="/netflix"` → NetflixHome, `path="/movie/:id"` → MovieDetail
- [ ] Add "Netflix" link to Navbar
- [ ] Test: click a movie card → URL changes to `/movie/abc123` → detail page shows correct id
- [ ] Test: browser back button returns to the grid
- [ ] Complete YOUR TURN section of the exercise

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `src/pages/MoviesPage.jsx` — move movie search UI here (accepts props from App)
- [ ] Create `src/pages/FavoritesPage.jsx` — shows saved movies (accepts favorites + toggle prop)
- [ ] Lift `favorites` state and `toggleFavorite` function up to `App.jsx`
- [ ] Pass `favorites` and `onToggleFavorite` props down to both pages via Route element
- [ ] Add `path="/movies"` → MoviesPage and `path="/favorites"` → FavoritesPage in App.jsx
- [ ] Update Navbar to include Movies and Favorites links
- [ ] Test: save a movie on /movies, navigate to /favorites — it appears there
- [ ] Create `day-34-dsa.js` in `week-06-react-intermediate/day-34/`
- [ ] Open `dsa-bank/strings.md`
- [ ] Solve Problem 4 — pattern + complexity
- [ ] Solve Problem 5 — pattern + complexity
- [ ] Solve Problem 6 — pattern + complexity

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — Link vs NavLink, `end` prop, how useParams works, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 34: React Router + Netflix router + 3 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Add a `useSearchParams` hook to persist the search query in the URL (`/movies?q=batman`)
- [ ] Add nested routes (e.g., `/movies/popular` and `/movies/search` as children of `/movies`)
- [ ] Add a loading state when navigating between pages using `useNavigation` (v6.4+)
- [ ] Research: what is the difference between `BrowserRouter` and `HashRouter`?
