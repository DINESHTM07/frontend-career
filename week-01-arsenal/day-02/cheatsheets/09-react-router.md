# React Router v6 Cheatsheet

## CONCEPT
React Router v6 is a client-side routing library. It maps URL paths to React components so the browser can navigate between "pages" without a full page reload.

```bash
npm install react-router-dom
```

Core idea: wrap your app in a `<BrowserRouter>`, define `<Routes>` with `<Route>` elements, and use `<Link>` instead of `<a>` tags.

---

## WHY IT MATTERS
SPAs (Single Page Applications) have one HTML file but many views. React Router handles URL matching, nested layouts, dynamic segments, query strings, navigation guards, and programmatic navigation — all without reloading the page.

---

## EXAMPLES

### 1. Basic Setup — BrowserRouter, Routes, Route

```jsx
// main.jsx (or index.jsx)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* wrap once at the top */}
      <App />
    </BrowserRouter>
  </StrictMode>
);

// App.jsx
import { Routes, Route } from 'react-router-dom';
import Home    from './pages/Home';
import About   from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/"        element={<Home />} />
      <Route path="/about"   element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*"        element={<NotFound />} />  {/* 404 catch-all */}
    </Routes>
  );
}
```

### 2. Link and NavLink

```jsx
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      {/* Link: basic navigation, no page reload */}
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>

      {/* NavLink: same as Link but knows if it's "active" */}
      {/* className receives { isActive, isPending } */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? 'nav-link nav-link--active' : 'nav-link'
        }
      >
        Dashboard
      </NavLink>

      {/* NavLink with inline style */}
      <NavLink
        to="/settings"
        style={({ isActive }) => ({
          fontWeight: isActive ? 'bold' : 'normal',
          color: isActive ? 'blue' : 'black',
        })}
      >
        Settings
      </NavLink>
    </nav>
  );
}
```

### 3. useParams — Dynamic Route Segments

```jsx
import { Routes, Route } from 'react-router-dom';
import { useParams } from 'react-router-dom';

// Define dynamic segment with ":"
function AppRoutes() {
  return (
    <Routes>
      <Route path="/users"          element={<UserList />} />
      <Route path="/users/:userId"  element={<UserDetail />} />
      <Route path="/posts/:postId/comments/:commentId" element={<Comment />} />
    </Routes>
  );
}

function UserDetail() {
  // useParams returns an object with all named segments
  const { userId } = useParams();

  const { data: user, loading } = useFetch(`/api/users/${userId}`);

  if (loading) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}

function Comment() {
  const { postId, commentId } = useParams(); // both segments available
  return <p>Post {postId}, Comment {commentId}</p>;
}
```

### 4. useSearchParams — Query Strings

```jsx
import { useSearchParams } from 'react-router-dom';

// URL: /products?category=shoes&sort=price&page=2

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read query params
  const category = searchParams.get('category') ?? 'all';
  const sort      = searchParams.get('sort') ?? 'name';
  const page      = Number(searchParams.get('page') ?? 1);

  function handleCategoryChange(newCategory) {
    // setSearchParams preserves other params by default when merging
    setSearchParams(prev => {
      prev.set('category', newCategory);
      prev.set('page', '1'); // reset page when filter changes
      return prev;
    });
  }

  function nextPage() {
    setSearchParams(prev => {
      prev.set('page', String(page + 1));
      return prev;
    });
  }

  return (
    <div>
      <select value={category} onChange={e => handleCategoryChange(e.target.value)}>
        <option value="all">All</option>
        <option value="shoes">Shoes</option>
        <option value="bags">Bags</option>
      </select>
      <p>Page {page}</p>
      <button onClick={nextPage}>Next page</button>
    </div>
  );
}
```

### 5. useNavigate — Programmatic Navigation

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await login(formData);

    if (success) {
      navigate('/dashboard');         // go to new route
      // navigate('/dashboard', { replace: true }); // replace history entry (no back button)
    }
  }

  return <form onSubmit={handleSubmit}>...</form>;
}

function ProductPage() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(-1)}>Go back</button>  {/* like browser back */}
      <button onClick={() => navigate(1)}>Go forward</button>

      {/* Pass state through navigation (available in destination via useLocation) */}
      <button onClick={() => navigate('/checkout', { state: { fromProduct: true } })}>
        Buy now
      </button>
    </div>
  );
}
```

### 6. Nested Routes with Outlet

```jsx
import { Routes, Route, Outlet, Link } from 'react-router-dom';

// Layout component: renders shared UI + child routes via <Outlet>
function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside>
        <Link to="/dashboard">Overview</Link>
        <Link to="/dashboard/analytics">Analytics</Link>
        <Link to="/dashboard/settings">Settings</Link>
      </aside>
      <main>
        <Outlet />  {/* child route renders here */}
      </main>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* index route: renders at /dashboard exactly */}
        <Route index element={<DashboardOverview />} />
        <Route path="analytics" element={<Analytics />} />    {/* /dashboard/analytics */}
        <Route path="settings"  element={<Settings />} />     {/* /dashboard/settings */}
      </Route>
    </Routes>
  );
}
// Note: child paths are RELATIVE — no leading slash ("analytics" not "/analytics")
```

### 7. Layout Routes — Shared UI Without Path Prefix

```jsx
// A layout route with no "path" wraps routes in shared UI
// without affecting the URL structure.

function AppRoutes() {
  return (
    <Routes>
      {/* Routes that share the main layout */}
      <Route element={<MainLayout />}>
        <Route path="/"        element={<Home />} />
        <Route path="/about"   element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Routes with a different layout (e.g., full-screen auth pages) */}
      <Route element={<AuthLayout />}>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}

function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
```

### 8. Protected Routes Pattern

```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Guard component: redirects unauthenticated users
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth(); // your auth context/hook
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the location they were trying to reach so we can redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // children OR outlet depending on usage pattern
  return children ?? <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* All routes inside RequireAuth are protected */}
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile"   element={<Profile />} />
      </Route>
    </Routes>
  );
}

// In Login.jsx: redirect back to the original destination after login
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/dashboard';

  async function handleLogin() {
    await signIn(credentials);
    navigate(from, { replace: true }); // go where they came from
  }
}
```

### 9. 404 Catch-All Route

```jsx
import { Link } from 'react-router-dom';

// path="*" matches any URL not matched by earlier routes
function NotFound() {
  return (
    <div>
      <h1>404 — Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Back to home</Link>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"      element={<Home />} />
      <Route path="/about" element={<About />} />
      {/* Must be last — matches everything else */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

### 10. useLocation — Reading Current URL Info

```jsx
import { useLocation } from 'react-router-dom';

function PageTracker() {
  const location = useLocation();

  // location object: { pathname, search, hash, state, key }
  // pathname: "/dashboard/analytics"
  // search:   "?tab=overview"
  // hash:     "#section-2"
  // state:    whatever was passed via navigate() or Link state prop

  useEffect(() => {
    // Track page views
    analytics.page(location.pathname);
  }, [location.pathname]);

  return null; // renders nothing, just a side-effect component
}

// Accessing navigation state (passed from previous page)
function CheckoutPage() {
  const location = useLocation();
  const { fromProduct } = location.state ?? {};

  return (
    <div>
      {fromProduct && <p>You came from a product page!</p>}
    </div>
  );
}
```

---

## QUICK REFERENCE

| Hook/Component | Purpose |
|----------------|---------|
| `<BrowserRouter>` | Provides router context (wrap once at root) |
| `<Routes>` / `<Route>` | Map paths to components |
| `<Link to="">` | Navigate without page reload |
| `<NavLink>` | Link that knows if it's active |
| `<Outlet>` | Renders matched child route in a layout |
| `<Navigate to="">` | Declarative redirect |
| `useParams()` | Read `:dynamic` URL segments |
| `useSearchParams()` | Read/write `?query=string` params |
| `useNavigate()` | Programmatic navigation |
| `useLocation()` | Current URL info + navigation state |

**v6 differences from v5:**
- `<Switch>` → `<Routes>` (smarter matching, no need for `exact`)
- `useHistory` → `useNavigate`
- `<Redirect>` → `<Navigate>`
- Nested routes defined inline, not in children components
- Child paths are relative (no leading `/`)
