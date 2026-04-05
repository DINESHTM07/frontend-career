/*
  WHY a dedicated services/ folder:
  API calls are NOT component logic. If FakeStoreAPI changes their URL or
  response format tomorrow, we update ONE file — not every component.
  This is the "separation of concerns" principle: components handle UI,
  services handle data fetching.

  WHY not axios: The native fetch API is sufficient here and saves a dependency.
  For production apps with interceptors, auth headers, and retries, axios or
  a query library (React Query, SWR) would be better choices.
*/

// Single source of truth for the API base URL.
// If this ever changes (e.g. to a real API), we change it once here.
const BASE_URL = 'https://fakestoreapi.com'

/*
  WHY this helper: Centralizes error handling for all API calls.
  Without it, every fetch call would need its own res.ok check.
  A single helper means consistent error messages across the app.
*/
async function apiFetch(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`)

  // fetch() does NOT throw on HTTP errors (404, 500, etc.) — it only throws
  // on network failures. We must manually check res.ok for HTTP error codes.
  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// ─── Product Endpoints ──────────────────────────────────────────────────────

/*
  WHY no caching here: Caching is handled by our useFetch hook (via a module-level
  cache Map). Keeping the service functions pure (no side effects) makes them
  easier to test and reason about.
*/

/** Fetch all products. Returns Promise<Product[]> */
export const fetchAllProducts = () => apiFetch('/products')

/** Fetch a single product by ID. Returns Promise<Product> */
export const fetchProductById = (id) => apiFetch(`/products/${id}`)

/** Fetch all available category names. Returns Promise<string[]> */
export const fetchCategories = () => apiFetch('/products/categories')

/** Fetch products filtered by category. Returns Promise<Product[]> */
export const fetchProductsByCategory = (category) =>
  apiFetch(`/products/category/${encodeURIComponent(category)}`)

/*
  WHY encodeURIComponent: Category names from FakeStoreAPI include spaces
  (e.g. "men's clothing"). Without encoding, the URL would be malformed.
  encodeURIComponent converts "men's clothing" → "men's%20clothing".
*/
