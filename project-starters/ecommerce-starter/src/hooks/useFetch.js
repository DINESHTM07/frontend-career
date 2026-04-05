import { useState, useEffect, useCallback } from 'react'

// useFetch
// TODO (Day 2): Implement the data-fetching hook.
//
// Purpose: A reusable hook that wraps fetch() and manages loading/error states.
// Every component that needs API data calls this hook instead of writing
// fetch() + useEffect directly — keeping components clean.
//
// Features to implement:
//   1. loading state: true while fetch is in progress
//   2. error state: set when fetch throws or response is not ok
//   3. data state: the parsed JSON response
//   4. refetch(): a function to re-run the request on demand (e.g. "Try again" button)
//   5. In-memory cache: a module-level Map so repeated calls to the same URL
//      return instantly without hitting the network again
//
// @param {string} url — The URL to fetch
// @returns {{ data: any, loading: boolean, error: Error|null, refetch: () => void }}
//
// Important:
//   - Check response.ok — fetch() does NOT throw on 4xx/5xx errors
//   - Skip setting state if the component unmounted (use an `active` flag)
//   - The cache key is the URL string

// Module-level cache — persists for the entire browser session
const cache = new Map()

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!url) return
    let active = true

    // TODO: check cache first — if cache.has(url), set data from cache, set loading false, return
    // TODO: set loading true, error null
    // TODO: fetch(url), check response.ok, parse JSON, cache the result
    // TODO: catch errors and set error state
    // TODO: always set loading false in a finally block
    // TODO: use `if (active)` before calling setData/setError/setLoading
    // TODO: return () => { active = false } as cleanup

    // Temporary stub so the app compiles — replace with real implementation:
    try {
      if (cache.has(url)) {
        setData(cache.get(url))
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
      const json = await res.json()
      cache.set(url, json)
      if (active) {
        setData(json)
        setError(null)
      }
    } catch (err) {
      if (active) setError(err)
    } finally {
      if (active) setLoading(false)
    }

    return () => { active = false }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
