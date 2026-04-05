// ============================================
// INTRO: React Router — Factory Pattern for Route Components
// ============================================
// React Router turns a single-page application into an app that feels
// like it has multiple pages. The URL is the state — when it changes,
// React renders the matching component tree.
//
// The FACTORY pattern here: Route components are produced by configuration.
// <Route path="/movie/:id" element={<MovieDetail />} /> is a factory
// instruction: "for any URL matching /movie/:id, produce a MovieDetail."
// The :id parameter is captured and injected into the component.
//
// Core React Router v6 concepts:
//   <BrowserRouter>     — provides routing context to the whole app
//   <Routes>            — renders the first matching <Route>
//   <Route path element>— maps a URL pattern to a component
//   <Link to>           — renders an <a> tag that updates the URL
//   <NavLink>           — like Link but adds 'active' class when matched
//   <Outlet>            — renders matched child routes (nested routing)
//   useNavigate()       — programmatic navigation (after form submit, etc.)
//   useParams()         — reads URL parameters (:id → { id: "123" })
//   useSearchParams()   — reads query string (?q=react → { q: "react" })
//   useLocation()       — reads the current URL location object
//
// WHY it matters:
//   Every multi-page React app uses a router. React Router is the standard.
//   Nested routes, protected routes, and dynamic segments appear in every
//   production codebase and every senior React interview.
// ============================================

// ============================================
// MENTAL MODEL: How to think about routing
// ============================================
// The URL is the single source of truth for "which page you're on."
// React Router watches the URL and renders the matching component.
//
// Think of Routes like a switch statement for URLs:
//   switch (currentURL) {
//     case '/':           return <Home />
//     case '/movies':     return <Movies />
//     case '/movies/:id': return <MovieDetail id={id} />
//     default:            return <NotFound />
//   }
//
// Nested routes: a parent route renders <Outlet> where child routes appear.
// This lets you have persistent layout (sidebar, header) while only the
// content area changes when you navigate between child routes.
// ============================================

// ============================================
// SETUP: Install React Router v6
//   npm install react-router-dom
//
// In main.jsx (or index.jsx), wrap your app:
//   import { BrowserRouter } from 'react-router-dom'
//   <BrowserRouter><App /></BrowserRouter>
//
// Then paste THIS file as App.jsx (or import the default export)
// ============================================

import {
  Routes, Route, Link, NavLink, Outlet,
  useNavigate, useParams, useSearchParams, useLocation
} from 'react-router-dom'
import { useState, useEffect, useMemo, createContext, useContext } from 'react'

// ============================================
// MOCK DATA (replaces real API for this exercise)
// ============================================

const MOVIES = [
  { id: 1,  title: 'Inception',         year: 2010, rating: 8.8, genre: ['Sci-Fi', 'Thriller'], director: 'Christopher Nolan',   poster: '🌀', description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.', runtime: 148, cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'] },
  { id: 2,  title: 'The Dark Knight',   year: 2008, rating: 9.0, genre: ['Action', 'Crime'],    director: 'Christopher Nolan',   poster: '🦇', description: 'The Joker wreaks havoc on Gotham City, leading Batman on one of his greatest tests.', runtime: 152, cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'] },
  { id: 3,  title: 'Interstellar',      year: 2014, rating: 8.6, genre: ['Sci-Fi', 'Drama'],    director: 'Christopher Nolan',   poster: '🪐', description: "A team of explorers travel through a wormhole in space to ensure humanity's survival.", runtime: 169, cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'] },
  { id: 4,  title: 'Parasite',          year: 2019, rating: 8.6, genre: ['Thriller', 'Drama'],  director: 'Bong Joon-ho',        poster: '🪳', description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', runtime: 132, cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'] },
  { id: 5,  title: 'Oppenheimer',       year: 2023, rating: 8.5, genre: ['Drama', 'History'],   director: 'Christopher Nolan',   poster: '☢️', description: "The story of J. Robert Oppenheimer and the development of the atomic bomb.", runtime: 180, cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon'] },
  { id: 6,  title: '3 Idiots',          year: 2009, rating: 8.4, genre: ['Comedy', 'Drama'],    director: 'Rajkumar Hirani',     poster: '🎓', description: 'Two friends search for their long-lost companion, flashing back to their college days.', runtime: 170, cast: ['Aamir Khan', 'R. Madhavan', 'Sharman Joshi'] },
  { id: 7,  title: 'RRR',               year: 2022, rating: 8.0, genre: ['Action', 'Drama'],    director: 'S. S. Rajamouli',     poster: '🔥', description: 'A fictional story about two legendary revolutionaries and their journey away from home.', runtime: 187, cast: ['N. T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt'] },
  { id: 8,  title: 'The Godfather',     year: 1972, rating: 9.2, genre: ['Crime', 'Drama'],     director: 'Francis Ford Coppola', poster: '🤵', description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', runtime: 175, cast: ['Marlon Brando', 'Al Pacino', 'James Caan'] },
  { id: 9,  title: 'Dune',              year: 2021, rating: 8.0, genre: ['Sci-Fi', 'Adventure'], director: 'Denis Villeneuve',   poster: '🏜️', description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset.", runtime: 155, cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac'] },
  { id: 10, title: 'Kalki 2898-AD',     year: 2024, rating: 7.8, genre: ['Sci-Fi', 'Action'],   director: 'Nag Ashwin',         poster: '⚡', description: 'A sci-fi epic set in a dystopian future combining Indian mythology with futuristic elements.', runtime: 181, cast: ['Prabhas', 'Deepika Padukone', 'Amitabh Bachchan'] },
]

const ALL_GENRES = [...new Set(MOVIES.flatMap(m => m.genre))].sort()

// ============================================
// FAVORITES CONTEXT
// ============================================
const FavoritesContext = createContext(null)

function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(new Set())
  const toggle = (id) => setFavorites(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  return (
    <FavoritesContext.Provider value={{ favorites, toggle }}>
      {children}
    </FavoritesContext.Provider>
  )
}

const useFavorites = () => useContext(FavoritesContext)

// ============================================
// SHARED COMPONENTS
// ============================================

function MovieCard({ movie, compact = false }) {
  const { favorites, toggle } = useFavorites()
  const isFav = favorites.has(movie.id)
  return (
    <div style={{
      background: '#1f2937', borderRadius: '12px', overflow: 'hidden',
      border: '1px solid #374151', transition: 'transform 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
        <div style={{ height: compact ? '80px' : '120px', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: compact ? '2.5rem' : '3.5rem' }}>
          {movie.poster}
        </div>
      </Link>
      <div style={{ padding: compact ? '10px' : '14px' }}>
        <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
          <div style={{ fontWeight: 700, color: '#f9fafb', fontSize: compact ? '0.8rem' : '0.95rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {movie.title}
          </div>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{movie.year} · ⭐ {movie.rating}</div>
            {!compact && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                {movie.genre.map(g => (
                  <span key={g} style={{ padding: '2px 7px', background: '#374151', borderRadius: '4px', fontSize: '0.65rem', color: '#9ca3af' }}>{g}</span>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => toggle(movie.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}>
            {isFav ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// LAYOUT COMPONENT (with Outlet)
// ============================================
function AppLayout() {
  const location = useLocation()

  const navStyle = (path) => ({
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    color: location.pathname === path || (path !== '/' && location.pathname.startsWith(path)) ? '#fff' : '#9ca3af',
    background: location.pathname === path || (path !== '/' && location.pathname.startsWith(path)) ? '#374151' : 'transparent',
    fontWeight: location.pathname.startsWith(path) && path !== '/' ? 600 : 400,
  })

  return (
    <div style={{ minHeight: '100vh', background: '#111827', color: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ padding: '0 24px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', height: '56px', gap: '4px', position: 'sticky', top: 0, background: '#111827', zIndex: 100 }}>
        <Link to="/" style={{ fontWeight: 900, fontSize: '1.1rem', color: '#ef4444', textDecoration: 'none', marginRight: '16px', letterSpacing: '-0.5px' }}>
          NETFIX
        </Link>
        <Link to="/"           style={navStyle('/')}>Home</Link>
        <Link to="/movies"     style={navStyle('/movies')}>Movies</Link>
        <Link to="/search"     style={navStyle('/search')}>🔍 Search</Link>
        <Link to="/favorites"  style={{ ...navStyle('/favorites'), marginLeft: 'auto' }}>❤️ Favorites</Link>
      </nav>

      {/* Route content renders here */}
      <Outlet />
    </div>
  )
}

// ============================================
// PAGE COMPONENTS (route factories produce these)
// ============================================

// ---- Home ----
function Home() {
  const { favorites } = useFavorites()
  const topRated = [...MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 5)
  const featured = MOVIES[Math.floor(MOVIES.length / 2)]

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', borderRadius: '16px', padding: '40px', marginBottom: '32px', display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ fontSize: '5rem' }}>{featured.poster}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Featured</div>
          <h1 style={{ fontSize: '1.8rem', margin: '0 0 8px', color: '#f9fafb' }}>{featured.title}</h1>
          <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '16px', lineHeight: '1.6', maxWidth: '500px' }}>
            {featured.description}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to={`/movies/${featured.id}`}
              style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
              ▶ Watch
            </Link>
            <Link to="/movies"
              style={{ padding: '10px 20px', background: '#374151', color: '#f9fafb', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem' }}>
              Browse All
            </Link>
          </div>
        </div>
      </div>

      {/* Top Rated */}
      <h2 style={{ fontSize: '1rem', marginBottom: '14px', color: '#f9fafb' }}>⭐ Top Rated</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
        {topRated.map(m => <MovieCard key={m.id} movie={m} />)}
      </div>
    </div>
  )
}

// ---- Movies (list with filter) ----
function Movies() {
  const [searchParams, setSearchParams] = useSearchParams()
  const genreFilter = searchParams.get('genre') || 'all'
  const sortBy = searchParams.get('sort') || 'rating'

  const filtered = useMemo(() => {
    let result = genreFilter === 'all' ? MOVIES : MOVIES.filter(m => m.genre.includes(genreFilter))
    return [...result].sort((a, b) => sortBy === 'year' ? b.year - a.year : b.rating - a.rating)
  }, [genreFilter, sortBy])

  function setFilter(key, value) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set(key, value)
      return next
    })
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>🎬 Movies</h1>

      {/* Filters — stored in URL as query params */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', ...ALL_GENRES].map(g => (
            <button key={g} onClick={() => setFilter('genre', g)}
              style={{
                padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', border: 'none', cursor: 'pointer',
                background: genreFilter === g ? '#ef4444' : '#374151',
                color: genreFilter === g ? '#fff' : '#9ca3af', fontWeight: genreFilter === g ? 700 : 400,
              }}>{g === 'all' ? 'All' : g}</button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setFilter('sort', e.target.value)}
          style={{ padding: '5px 10px', border: '1px solid #374151', borderRadius: '6px', background: '#1f2937', color: '#9ca3af', fontSize: '0.8rem', marginLeft: 'auto' }}>
          <option value="rating">Sort: Rating</option>
          <option value="year">Sort: Year</option>
        </select>
      </div>

      <div style={{ marginBottom: '12px', fontSize: '0.8rem', color: '#6b7280' }}>{filtered.length} movies</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
        {filtered.map(m => <MovieCard key={m.id} movie={m} />)}
      </div>
    </div>
  )
}

// ---- Movie Detail (dynamic :id route) ----
function MovieDetail() {
  const { id } = useParams()           // reads :id from URL
  const navigate = useNavigate()        // programmatic navigation
  const { favorites, toggle } = useFavorites()

  const movie = MOVIES.find(m => m.id === parseInt(id))
  const isFav = favorites.has(movie?.id)

  // Related movies (same genre, not this one)
  const related = movie
    ? MOVIES.filter(m => m.id !== movie.id && m.genre.some(g => movie.genre.includes(g))).slice(0, 4)
    : []

  if (!movie) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>😕</div>
      <div style={{ color: '#9ca3af', marginBottom: '16px' }}>Movie not found</div>
      <button onClick={() => navigate('/movies')} style={{ padding: '8px 16px', background: '#374151', border: 'none', borderRadius: '8px', color: '#f9fafb', cursor: 'pointer' }}>
        ← Back to Movies
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: '#1f2937', borderRadius: '12px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
          {movie.poster}
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ fontSize: '1.8rem', margin: '0 0 8px', color: '#f9fafb' }}>{movie.title}</h1>
            <button onClick={() => toggle(movie.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
              {isFav ? '❤️' : '🤍'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>⭐ {movie.rating}</span>
            <span style={{ color: '#9ca3af' }}>{movie.year}</span>
            <span style={{ color: '#9ca3af' }}>{movie.runtime} min</span>
            {movie.genre.map(g => (
              <span key={g} style={{ padding: '2px 8px', background: '#374151', borderRadius: '4px', fontSize: '0.75rem', color: '#9ca3af' }}>{g}</span>
            ))}
          </div>
          <p style={{ color: '#d1d5db', lineHeight: '1.7', marginBottom: '16px', fontSize: '0.9rem' }}>{movie.description}</p>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '6px' }}>
            <strong style={{ color: '#f9fafb' }}>Director: </strong>{movie.director}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
            <strong style={{ color: '#f9fafb' }}>Cast: </strong>{movie.cast.join(', ')}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <>
          <h2 style={{ fontSize: '1rem', marginBottom: '14px' }}>Similar Movies</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
            {related.map(m => <MovieCard key={m.id} movie={m} compact />)}
          </div>
        </>
      )}
    </div>
  )
}

// ---- Search ----
function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const results = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()
    return MOVIES.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.director.toLowerCase().includes(q) ||
      m.genre.some(g => g.toLowerCase().includes(q)) ||
      m.cast.some(c => c.toLowerCase().includes(q))
    )
  }, [query])

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>🔍 Search</h1>
      <input
        type="text"
        value={query}
        onChange={e => setSearchParams(e.target.value ? { q: e.target.value } : {})}
        placeholder="Search movies, directors, actors, genres..."
        autoFocus
        style={{
          width: '100%', padding: '14px 18px', background: '#1f2937', border: '2px solid #374151',
          borderRadius: '12px', color: '#f9fafb', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', marginBottom: '20px',
        }}
      />
      {query && (
        <div style={{ marginBottom: '12px', fontSize: '0.8rem', color: '#6b7280' }}>
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </div>
      )}
      {!query && <div style={{ color: '#6b7280', fontSize: '0.85rem', textAlign: 'center', padding: '40px' }}>Start typing to search...</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
        {results.map(m => <MovieCard key={m.id} movie={m} />)}
      </div>
      {query && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>😶</div>
          No results found for "{query}"
        </div>
      )}
    </div>
  )
}

// ---- Favorites ----
function Favorites() {
  const { favorites } = useFavorites()
  const navigate = useNavigate()
  const favMovies = MOVIES.filter(m => favorites.has(m.id))

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>❤️ Favorites ({favorites.size})</h1>
      {favMovies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🤍</div>
          <div style={{ marginBottom: '16px' }}>No favorites yet.</div>
          <button onClick={() => navigate('/movies')}
            style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
            Browse Movies
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
          {favMovies.map(m => <MovieCard key={m.id} movie={m} />)}
        </div>
      )}
    </div>
  )
}

// ---- 404 Not Found ----
function NotFound() {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>404</div>
      <div style={{ color: '#9ca3af', marginBottom: '8px', fontSize: '1.1rem' }}>Page not found</div>
      <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '24px' }}>
        "{location.pathname}" doesn't exist
      </div>
      <button onClick={() => navigate('/')}
        style={{ padding: '10px 24px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
        Go Home
      </button>
    </div>
  )
}

// ============================================
// ROOT COMPONENT — Route Configuration (the Factory)
// ============================================
export default function NetflixRouter() {
  return (
    <FavoritesProvider>
      <Routes>
        {/* Nested routes: AppLayout renders Outlet where children appear */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />            {/* index = default child */}
          <Route path="movies" element={<Movies />} />
          <Route path="movies/:id" element={<MovieDetail />} />   {/* :id = dynamic */}
          <Route path="search" element={<Search />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />    {/* * = catch-all */}
        </Route>
      </Routes>
    </FavoritesProvider>
  )
}

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. What is the difference between <Link to="/movies"> and useNavigate()?
//    Answer: <Link> renders an <a> tag for user-clicked navigation.
//    useNavigate() returns a function for programmatic navigation —
//    use it after a form submission, on a timer, or based on a condition.
//    navigate(-1) = browser back button, navigate('/movies') = go to /movies.
//
// 2. What does <Outlet /> do? Why is it in AppLayout?
//    Answer: Outlet is a placeholder where matched child routes render.
//    AppLayout is the parent route (path="/"). Its children (Movies, Home, etc.)
//    render inside the Outlet. This gives persistent layout (nav + footer) while
//    only the Outlet content changes on navigation.
//
// 3. Why store filter state in URL (useSearchParams) instead of useState?
//    Answer: URL-based state is shareable and bookmarkable. If you filter by
//    genre=Sci-Fi, the URL reflects it: /movies?genre=Sci-Fi. Copy-pasting
//    the URL gives the same filtered view. useState would lose the filter on
//    refresh or when sharing. This is a best practice for filter/sort state.
//
// 4. What does the path="*" route catch?
//    Answer: The wildcard (*) matches ANY path not matched by previous routes.
//    Route ordering matters: React Router tries routes in order and renders
//    the first match. Put the catch-all last so specific routes take priority.
// ============================================

// ============================================
// YOUR TURN: Add TV Shows Section with Nested Routes
// ============================================
// Add a complete TV Shows section with nested routing:
//
// ROUTES to add:
//   /shows                    → ShowsList (same layout as Movies)
//   /shows/:id                → ShowDetail (seasons list)
//   /shows/:id/season/:season → SeasonDetail (episodes list)
//   /shows/:id/season/:season/episode/:episode → EpisodeDetail
//
// MOCK DATA shape:
//   { id, title, poster, rating, year, seasons: [
//     { number: 1, episodes: [
//       { number: 1, title, duration, synopsis }
//     ]}
//   ]}
//
// COMPONENTS:
//   ShowsList({ shows }) — same card grid as Movies
//   ShowDetail({ id }) — show header + season selector tabs + <Outlet />
//   SeasonDetail({ id, season }) — episode list
//   EpisodeDetail({ id, season, episode }) — episode viewer
//
// ShowDetail should use NESTED nested routes:
//   <Route path="/shows/:id" element={<ShowDetail />}>
//     <Route path="season/:season" element={<SeasonDetail />}>
//       <Route path="episode/:episode" element={<EpisodeDetail />} />
//     </Route>
//   </Route>
//
// This creates 3 levels of Outlet nesting — the most powerful React Router pattern.
// ShowDetail renders a season <Outlet>, SeasonDetail renders an episode <Outlet>.

// ============================================
// BOSS CHALLENGE: Protected Routes
// ============================================
// Some routes should only be accessible to logged-in users.
// Build a ProtectedRoute component:
//
//   function ProtectedRoute({ children, redirectTo = '/login' }) {
//     const { isAuthenticated } = useAuth()
//     if (!isAuthenticated) return <Navigate to={redirectTo} replace />
//     return children
//   }
//
// Usage:
//   <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
//
// Also build useRouteMatch() — returns the current route name for analytics:
//   useEffect(() => {
//     analytics.track('page_view', { path: location.pathname })
//   }, [location])
//
// And a breadcrumb component that reads the current route hierarchy:
//   Home > Movies > Inception
//   Each part is a <Link> to that route.

// ============================================
// PATTERN LEARNED: Factory (Route Components)
// ============================================
// PATTERN NAME: Route Component Factory
// WHEN YOU SEE: Multi-page SPA, URL-based navigation, deep linking
// USE THIS:
//
//   BASIC SETUP:
//     <BrowserRouter><App /></BrowserRouter>
//
//   ROUTE CONFIGURATION (the factory):
//     <Routes>
//       <Route path="/" element={<Layout />}>
//         <Route index element={<Home />} />
//         <Route path="users/:id" element={<UserDetail />} />
//         <Route path="*" element={<NotFound />} />
//       </Route>
//     </Routes>
//
//   HOOKS:
//     const { id } = useParams()                 → URL params
//     const [p, setP] = useSearchParams()        → query string
//     const navigate = useNavigate()             → programmatic nav
//     const { pathname } = useLocation()         → current URL
//
//   PATTERNS:
//     URL state (filters): useSearchParams — bookmarkable, shareable
//     Programmatic nav: navigate('/login') after form submit
//     Back button: navigate(-1)
//     Protected route: check auth → Navigate to /login if not authenticated
//     Lazy routes: React.lazy + Suspense for code splitting per route
//
// REACT CONNECTION:
//   Next.js: file-based routing (no Router config needed, files = routes)
//   React Router: declarative config-based routing for SPAs
//   TanStack Router: type-safe routing with built-in data loading
// ============================================
