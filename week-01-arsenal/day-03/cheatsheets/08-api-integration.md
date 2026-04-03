# API Integration in Frontend Development

---

## CONCEPT

Frontend applications almost always talk to a backend API — fetching data to display, sending form submissions, authenticating users. The browser provides the `fetch` API (built-in, no install) for making HTTP requests. You send a request with a method (GET, POST, etc.), optional headers, and optional body; you receive a response with a status code and body.

**Key mental model:** Every API call has three possible states — **loading**, **success (data)**, and **error**. Always handle all three.

---

## WHY IT MATTERS

- Real applications are data-driven. Being able to integrate any REST API quickly is a core skill.
- Proper error handling separates production-grade code from tutorial code.
- API security (env variables, CORS, authentication headers) is expected knowledge.
- Public APIs are the foundation of portfolio projects that impress employers.

---

## EXAMPLES

### 1. Basic GET request with async/await

```tsx
// The simplest possible fetch
async function getUser(id: number) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
  const data = await response.json()
  return data
}

// Call it
const user = await getUser(1)
console.log(user.name)
```

### 2. Proper error handling — network vs HTTP errors

```tsx
// WRONG — no error handling
const res = await fetch('/api/users')
const data = await res.json()  // ❌ Silently fails on 404, 500, network error

// RIGHT — handle both failure types
async function fetchUser(id: number): Promise<User> {
  let response: Response

  try {
    response = await fetch(`/api/users/${id}`)
  } catch (err) {
    // Network error: no internet, DNS failure, server unreachable
    throw new Error('Network error: could not reach server')
  }

  // HTTP errors (4xx, 5xx) don't throw — fetch only throws on network failure
  if (!response.ok) {
    // response.status: 400, 401, 403, 404, 500, etc.
    if (response.status === 404) throw new Error('User not found')
    if (response.status === 401) throw new Error('Unauthorized — please log in')
    if (response.status === 403) throw new Error('Forbidden')
    throw new Error(`HTTP error: ${response.status}`)
  }

  const data: User = await response.json()
  return data
}
```

### 3. POST request with JSON body and headers

```tsx
interface CreatePostBody {
  title: string
  body: string
  userId: number
}

async function createPost(payload: CreatePostBody) {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',   // REQUIRED for JSON body
      'Authorization': `Bearer ${token}`,    // Auth header
    },
    body: JSON.stringify(payload),           // Must stringify the object
  })

  if (!response.ok) {
    const errorBody = await response.json()  // API often sends error details
    throw new Error(errorBody.message || 'Failed to create post')
  }

  return response.json()   // Returns the created resource (status 201)
}

// Usage
const newPost = await createPost({
  title: 'Hello World',
  body: 'My first post',
  userId: 1,
})
```

### 4. PUT, PATCH, DELETE

```tsx
// PUT — full replacement of a resource
async function updateUser(id: number, data: User) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Update failed')
  return res.json()
}

// PATCH — partial update
async function patchUser(id: number, changes: Partial<User>) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),   // Only send changed fields
  })
  if (!res.ok) throw new Error('Patch failed')
  return res.json()
}

// DELETE — remove resource
async function deleteUser(id: number) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Delete failed')
  // 204 No Content — no body to parse
  if (res.status === 204) return
  return res.json()
}
```

### 5. Loading / error / data state pattern

```tsx
// The canonical React pattern for async data
interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

function UserProfile({ userId }: { userId: number }) {
  const [state, setState] = useState<AsyncState<User>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      setState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const user = await fetchUser(userId)
        if (!cancelled) setState({ data: user, loading: false, error: null })
      } catch (err) {
        if (!cancelled) setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }

    load()
    return () => { cancelled = true }  // Cleanup on unmount
  }, [userId])

  if (state.loading) return <Skeleton />
  if (state.error) return <p className="text-red-500">{state.error}</p>
  if (!state.data) return null

  return <div>{state.data.name}</div>
}
```

### 6. AbortController — cancel in-flight requests

```tsx
// Use this to cancel fetch when component unmounts or dependency changes
useEffect(() => {
  const controller = new AbortController()

  async function load() {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        signal: controller.signal,  // Pass the signal to fetch
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setUser(data)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return  // Fetch was cancelled — not an error, ignore it
      }
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  load()

  return () => controller.abort()  // Cancel on cleanup
}, [userId])

// Also useful for search with debounce:
// Cancel previous request when user types a new character
```

### 7. axios vs fetch comparison

```tsx
// fetch — built in, verbose error handling
const res = await fetch('/api/users')
if (!res.ok) throw new Error(`${res.status}`)    // Must check manually
const data = await res.json()                     // Must call .json()

// axios — installed package, terser, auto-throws on HTTP errors
import axios from 'axios'
const { data } = await axios.get('/api/users')    // Throws on 4xx/5xx automatically
                                                  // data is already parsed

// axios POST — no manual JSON.stringify or Content-Type header
const { data } = await axios.post('/api/posts', { title: 'Hello' })

// axios instance — useful for setting base URL and auth headers once
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  timeout: 10000,
})

const { data } = await api.get('/users/1')

// axios interceptors — run code before/after every request
api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${getToken()}`
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) redirect('/login')
    return Promise.reject(error)
  }
)

// When to use which:
// fetch: no dependencies, simple requests, Next.js Server Components (it's extended)
// axios: complex apps, need interceptors, want auto error throwing, legacy browser support
```

### 8. API keys — .env files and security

```bash
# .env.local (never commit this file)
# In Next.js, .env.local is automatically gitignored

# Server-side only (secret keys)
STRIPE_SECRET_KEY=sk_live_abc123
DATABASE_URL=postgresql://user:pass@host/db
OPENAI_API_KEY=sk-proj-abc123

# Client-side (public, non-secret)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_abc123
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaSyAbc123
```

```tsx
// Using env vars in Next.js
// Server Component / API Route (safe — never exposed to client)
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  },
})

// Client Component (only NEXT_PUBLIC_ vars available)
const apiUrl = process.env.NEXT_PUBLIC_API_URL  // ✅
const secret = process.env.DATABASE_URL         // ❌ undefined in browser

// Best practice: never call third-party APIs with secret keys from the browser
// Instead: browser → your Next.js API route → third-party API
```

### 9. CORS — what it is and how to handle it

```
What is CORS?
  Cross-Origin Resource Sharing — a browser security feature.
  If your frontend (https://myapp.com) calls a different origin (https://api.other.com),
  the browser blocks it unless the server explicitly allows it.

  Same origin = same protocol + domain + port
  http://localhost:3000 → http://localhost:3000/api   ✅ same origin
  http://localhost:3000 → http://localhost:4000/api   ❌ different port = CORS

How to fix CORS errors:
  OPTION 1 (best): Add CORS headers on the server you control
    Access-Control-Allow-Origin: https://myapp.com
    Access-Control-Allow-Methods: GET, POST, PUT, DELETE
    Access-Control-Allow-Headers: Content-Type, Authorization

  OPTION 2: Use Next.js API routes as a proxy (server doesn't have CORS)
    Browser → your /api/proxy → external API   ← server-to-server, no CORS

  OPTION 3: Third-party APIs often require calling from backend, not browser
    Never expose secret API keys in frontend — use a proxy route instead
```

```tsx
// Next.js API route as proxy — solves CORS AND hides API key
// app/api/weather/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`
  )
  const data = await res.json()
  return Response.json(data)
}

// Frontend calls YOUR route (same origin, no CORS)
const res = await fetch(`/api/weather?city=London`)
```

### 10. Common public APIs for practice projects

```
JSONPlaceholder — fake REST API, no auth needed
  https://jsonplaceholder.typicode.com
  /posts, /users, /comments, /todos, /albums
  Perfect for: CRUD UI practice

PokéAPI — Pokémon data, free, no auth
  https://pokeapi.co/api/v2/pokemon/pikachu
  Perfect for: cards UI, search, infinite scroll

OMDB API — Movie data (free tier: 1000 req/day)
  http://www.omdbapi.com/?t=inception&apikey=YOUR_KEY
  Get key: omdbapi.com/#apikey
  Perfect for: movie app, search with images

OpenWeather API — Current + forecast weather (free tier)
  https://openweathermap.org/api
  /weather?q=London&appid=KEY
  Perfect for: dashboard widgets, location features

TMDB (The Movie Database) — Rich movie/TV data, free
  https://www.themoviedb.org/documentation/api
  Excellent images, trailers, cast data
  Perfect for: Netflix-clone style projects

GitHub API — Public repo/user data, no auth for basic use
  https://api.github.com/users/octocat
  https://api.github.com/repos/vercel/next.js
  Perfect for: developer portfolio projects

REST Countries — Country data, no auth
  https://restcountries.com/v3.1/all
  Perfect for: search + filter practice

Open Library — Books, no auth
  https://openlibrary.org/search.json?q=javascript
  Perfect for: reading lists, library apps
```

---

## COMMON MISTAKES

1. **Not checking `response.ok`** — `fetch` only throws on network errors. A 404 or 500 is returned as a successful Promise. Always check `if (!response.ok)`.

2. **Forgetting `Content-Type: application/json`** — Without this header, many servers reject POST requests or don't parse the JSON body.

3. **Forgetting `JSON.stringify()` on the body** — `body: payload` sends `[object Object]`. Must be `body: JSON.stringify(payload)`.

4. **Making API calls with secret keys from the browser** — Anyone can open DevTools and steal your key. Route sensitive API calls through a backend/API route.

5. **Not handling the loading and error states** — Showing stale data or a blank screen while loading is bad UX. Always show a skeleton/spinner and an error message.

6. **Not using AbortController on cleanup** — Without cleanup, a component that unmounts before fetch completes will try to set state on an unmounted component (React warning) or use stale data.

7. **Calling `response.json()` twice** — The response body stream can only be read once. Call `.json()` once and store the result.

---

## INTERVIEW TIP

> "How do you handle API errors in React?"

**Answer framework:**
- "I distinguish between two error types: network errors (fetch throws — no connection, DNS failure) and HTTP errors (fetch resolves but `response.ok` is false — 404, 500, etc.). I handle both."
- "I always maintain three state values: `data`, `loading`, and `error`, and show appropriate UI for each."
- "I use AbortController to cancel in-flight requests when a component unmounts, preventing state updates on unmounted components."
- "For API keys, I never expose them client-side. Secret keys live in environment variables and are used only in server-side code or API routes."
- Bonus: Mention the proxy pattern for third-party APIs — shows you understand security, not just fetching data.
