// api.js — Service layer for FakeStore API
//
// Why a dedicated services/ file?
//   API calls are NOT component logic. If the API URL or response format
//   changes, we update ONE file — not every component that fetches data.
//
// API base URL — single source of truth
const BASE_URL = 'https://fakestoreapi.com'

// apiFetch — shared helper for all API calls
// TODO (Day 2): Implement apiFetch.
//   - fetch(`${BASE_URL}${endpoint}`)
//   - Check response.ok — fetch() does NOT throw on HTTP errors (404, 500)
//   - If not ok: throw new Error(`API error ${response.status}: ${response.statusText}`)
//   - Return response.json()
async function apiFetch(endpoint) {
  // TODO: implement
  throw new Error(`apiFetch not implemented yet — tried to call: ${endpoint}`)
}

// ─── Exported API functions ──────────────────────────────────────────────────
// Each wraps apiFetch with the correct endpoint.
// These are used in pages/hooks instead of raw fetch() calls.

/** Fetch all products. Returns Promise<Product[]> */
export const fetchAllProducts = () =>
  // TODO: call apiFetch with the correct endpoint
  apiFetch('/products')

/** Fetch a single product by ID. Returns Promise<Product> */
export const fetchProductById = (id) =>
  // TODO: call apiFetch with the correct endpoint
  apiFetch(`/products/${id}`)

/** Fetch all category names. Returns Promise<string[]> */
export const fetchCategories = () =>
  // TODO: call apiFetch with the correct endpoint
  apiFetch('/products/categories')

/** Fetch products in a specific category. Returns Promise<Product[]> */
export const fetchProductsByCategory = (category) =>
  // TODO: call apiFetch with the correct endpoint
  // HINT: use encodeURIComponent(category) — category names have spaces
  apiFetch(`/products/category/${encodeURIComponent(category)}`)
