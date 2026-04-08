# Day 34 — React Router: Multi-Page Apps

**Status:** 📋 READY TO START
**Week:** 6 | **Theme:** React Intermediate

---

## What You'll Learn Today

Up to now, your React apps live on one URL. Click a button — the content changes, but the address bar stays the same. That's fine for small widgets, but real apps need real URLs:
- `/` → home page
- `/movies` → search page
- `/movies/tt1234567` → individual movie
- `/favorites` → saved movies

React Router gives you that. It lets you declare which component renders for which URL — and the browser's back button, bookmarks, and sharing all work correctly.

By end of day you'll have:
- Working multi-page navigation with React Router
- Dynamic routes using `useParams` (e.g., `/movie/:id`)
- `NavLink` with active styling
- Your Movie Search App split into separate Search and Favorites pages

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/react/09-react-router.md` — read before coding
3. `exercises/react-basics/25-netflix-router.jsx` — midday
4. Your existing React project (`week-05-react-basics/day-27/my-react-app/`) — you'll add routing here

---

## Morning (8:00 – 11:00 AM) — Install + Basic Routing

### Step 1 — Install React Router

Open the terminal in your React project folder:
```bash
cd week-05-react-basics/day-27/my-react-app
npm install react-router-dom
```

### Step 2 — Read the cheatsheet

Open `cheatsheets/react/09-react-router.md` and read it fully. Focus on:
- `BrowserRouter` — the provider that gives your app routing capability
- `Routes` + `Route` — declare which component renders at which path
- `Link` and `NavLink` — navigate without full page reload
- `useParams` — read dynamic URL segments (`:id`)
- `useNavigate` — navigate programmatically

---

### Step 3 — Wrap your app in BrowserRouter

Open `src/main.jsx`. Add the import and wrapper:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
```

`BrowserRouter` must be the outermost wrapper (or at least wrap everything that needs routing). Everything inside it can use hooks like `useNavigate` and `useParams`.

---

### Step 4 — Create page components

Create a `src/pages/` folder. Page components are just regular components — the convention is to put them in `pages/` to distinguish them from reusable UI components.

**`src/pages/Home.jsx`:**
```jsx
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Welcome</h1>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        This is a multi-page React app using React Router.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <Link to="/movies" style={{ padding: "10px 20px", background: "#4f46e5", color: "white", borderRadius: "8px", textDecoration: "none" }}>
          Browse Movies
        </Link>
        <Link to="/about" style={{ padding: "10px 20px", border: "1px solid #ddd", borderRadius: "8px", textDecoration: "none", color: "#374151" }}>
          About
        </Link>
      </div>
    </div>
  );
}
```

**`src/pages/About.jsx`:**
```jsx
export default function About() {
  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>About</h1>
      <p>This app was built in Week 6 of the frontend career course.</p>
      <p>Technologies used: React, React Router, React Hook Form.</p>
    </div>
  );
}
```

**`src/pages/Contact.jsx`:**
```jsx
import { useState } from 'react'

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Contact</h1>
      {sent ? (
        <p style={{ color: "#10b981" }}>Message sent! (not really — this is a demo)</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input placeholder="Your name" style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }} />
          <input placeholder="Your email" style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }} />
          <textarea placeholder="Message" rows={4} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }} />
          <button onClick={() => setSent(true)} style={{ padding: "10px 20px", background: "#4f46e5", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Send Message
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### Step 5 — Build the navigation bar

Create `src/components/Navbar.jsx`:

```jsx
import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: "/",        label: "Home"    },
  { to: "/movies",  label: "Movies"  },
  { to: "/favorites", label: "Favorites" },
  { to: "/about",   label: "About"   },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <nav style={{
      background: "#1f2937",
      padding: "0 24px",
      display: "flex",
      gap: "4px",
      alignItems: "center"
    }}>
      <span style={{ color: "white", fontWeight: "bold", marginRight: "16px", padding: "16px 0" }}>
        🎬 MovieApp
      </span>
      {navLinks.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/"}   // "end" prevents "/" matching all routes
          style={({ isActive }) => ({
            color: isActive ? "#818cf8" : "#9ca3af",
            textDecoration: "none",
            padding: "16px 12px",
            fontWeight: isActive ? "600" : "400",
            borderBottom: isActive ? "2px solid #818cf8" : "2px solid transparent",
            transition: "color 0.15s"
          })}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
```

**Why `NavLink` not `Link`?** `NavLink` receives `{ isActive }` in its `style` and `className` callbacks — so you can style the current page's link differently. `Link` is just a link with no active awareness.

**Why `end` on the home link?** Without `end`, the `/` route would match EVERY path (since every path starts with `/`). The `end` prop means "only mark active when the path exactly matches `/`".

---

### Step 6 — Wire up Routes in App.jsx

Replace `src/App.jsx`:

```jsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/about"   element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*"        element={<NotFound />} />
      </Routes>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: "60px", textAlign: "center" }}>
      <h1>404 — Page Not Found</h1>
      <p>That URL doesn't exist.</p>
    </div>
  );
}
```

Click through the nav links. Watch the URL change. Watch the active link highlight. The browser back button works. This is full client-side routing.

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:00 PM) — Netflix Router Exercise

### `exercises/react-basics/25-netflix-router.jsx`

**Pattern: Factory / Route Components**

Build a mini Netflix UI:
- `/` → browse grid of movies
- `/movie/:id` → individual movie detail page using `useParams`

Create `src/pages/NetflixHome.jsx` and `src/pages/MovieDetail.jsx`.

The key hook is **`useParams`**:

```jsx
// Route definition:
<Route path="/movie/:id" element={<MovieDetail />} />

// Inside MovieDetail.jsx:
import { useParams } from 'react-router-dom'

export default function MovieDetail() {
  const { id } = useParams();  // reads the :id from the URL
  // fetch movie by id, display it
}
```

**Also use `useNavigate` for programmatic navigation:**

```jsx
import { useNavigate } from 'react-router-dom'

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/movie/${movie.imdbID}`)}>
      {/* card content */}
    </div>
  );
}
```

Add routes to your `App.jsx`:
```jsx
<Route path="/movie/:id" element={<MovieDetail />} />
```

Work through INTRO → GUIDED → YOUR TURN in the exercise.

---

## Afternoon (2:00 – 4:00 PM) — Add Routing to Movie Search App + DSA

### Split your Movie Search into routed pages

Move your existing Movie Search into the routing structure:

Create `src/pages/MoviesPage.jsx` — contains the search interface
Create `src/pages/FavoritesPage.jsx` — contains the saved movies

```jsx
// App.jsx — add these routes
<Route path="/movies"    element={<MoviesPage />} />
<Route path="/favorites" element={<FavoritesPage />} />
```

**Problem:** favorites state is in `MovieSearch.jsx` — but now it needs to be shared between two pages. How?

**Solution:** Lift the state up or use Context. For now, lift it into `App.jsx`:

```jsx
// App.jsx
import { useState } from 'react'

export default function App() {
  const [favorites, setFavorites] = useState([]);

  function toggleFavorite(movie) {
    setFavorites(prev => {
      const exists = prev.some(f => f.imdbID === movie.imdbID);
      return exists ? prev.filter(f => f.imdbID !== movie.imdbID) : [...prev, movie];
    });
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/movies"   element={<MoviesPage favorites={favorites} onToggleFavorite={toggleFavorite} />} />
        <Route path="/favorites" element={<FavoritesPage favorites={favorites} onToggleFavorite={toggleFavorite} />} />
        {/* ... other routes */}
      </Routes>
    </div>
  );
}
```

### DSA

Open `dsa-bank/strings.md`. Solve **problems 4, 5, and 6**.

Create `day-34-dsa.js` in the `week-06-react-intermediate/day-34/` folder.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- What is the difference between `Link` and `NavLink`?
- What does the `end` prop do on a `NavLink`?
- How does `useParams` know which part of the URL to read?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 34: React Router + Netflix router + 3 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Installed `react-router-dom`
- [ ] Wrapped app in `BrowserRouter` in `main.jsx`
- [ ] Created `src/pages/` folder with `Home.jsx`, `About.jsx`, `Contact.jsx`
- [ ] Built `Navbar.jsx` with `NavLink` — active link styles correctly
- [ ] `end` prop on home link — "/" doesn't match all routes
- [ ] `Routes` + `Route` wired in `App.jsx`
- [ ] 404 `*` route catches unknown paths
- [ ] Completed `25-netflix-router.jsx` exercise
- [ ] `useParams` reads `:id` from URL in movie detail page
- [ ] `useNavigate` used for programmatic navigation
- [ ] Movie Search split into `MoviesPage` and `FavoritesPage`
- [ ] Favorites state lifted to `App.jsx` and passed as props
- [ ] Solved 3 DSA problems in `day-34-dsa.js`
- [ ] Committed and pushed

---

## Quick Reference — React Router

```jsx
// Setup in main.jsx
import { BrowserRouter } from 'react-router-dom'
<BrowserRouter><App /></BrowserRouter>

// Routes in App.jsx
import { Routes, Route } from 'react-router-dom'
<Routes>
  <Route path="/"         element={<Home />} />
  <Route path="/movies"   element={<Movies />} />
  <Route path="/movie/:id" element={<MovieDetail />} />  // dynamic
  <Route path="*"         element={<NotFound />} />      // 404
</Routes>

// Navigation links
import { Link, NavLink } from 'react-router-dom'
<Link to="/movies">Movies</Link>
<NavLink to="/movies" style={({ isActive }) => isActive ? { color: "blue" } : {}}>
  Movies
</NavLink>

// Read URL params
import { useParams } from 'react-router-dom'
const { id } = useParams();  // from path="/movie/:id"

// Programmatic navigation
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate();
navigate("/movies");
navigate(-1);  // go back
```

---

*URLs are the universal interface. Users bookmark them, share them, and expect the back button to work. React Router gives your app that contract.*
