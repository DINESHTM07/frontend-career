import { useState, useEffect, useRef, useCallback } from 'react'

/*
  WHY useFetch:
  Fetching data in React has three states: loading, success, error.
  Without a custom hook, every component that fetches data would need:
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => { fetch...  }, [url])

  That's 10+ lines of boilerplate per component. useFetch encapsulates this
  pattern so components can just write: const { data, loading, error } = useFetch(url)

  FEATURES:
  - Cancels in-flight requests when the component unmounts (prevents memory leaks)
  - Caches results so identical URLs don't re-fetch (improves UX on navigation)
  - Exposes a refetch() function to manually trigger a new request
  - Returns structured { data, loading, error } state

  WHY module-level cache (not useState or useRef):
  Module-level variables persist for the entire page session. useState resets on
  unmount. useRef resets when the component remounts (e.g. navigating away and back).
  A module-level Map means: fetch /products once, navigate away, come back —
  the data is still cached and shows instantly.
*/

// Module-level cache: persists across component mounts/unmounts for the session
const cache = new Map()

/*
  @param {string | null} url - The URL to fetch. Pass null to skip fetching.
  @param {object} options
  @param {boolean} options.useCache - Whether to use the module-level cache (default: true)
  @returns {{ data: any, loading: boolean, error: Error | null, refetch: Function }}
*/
export function useFetch(url, { useCache = true } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(!!url) // if url is null, don't start loading
  const [error, setError] = useState(null)

  /*
    WHY useRef for abortController: We need the AbortController instance to be
    stable across renders (not recreated). useRef gives us a mutable container
    that persists without triggering re-renders when it changes.
    WHY NOT useState: Changing state triggers a re-render, which would recreate
    the AbortController, which would cancel the request we just started.
  */
  const abortControllerRef = useRef(null)

  // Increment to force a re-fetch when refetch() is called
  // WHY a counter: calling setRefetchCount(n+1) changes state → triggers useEffect
  const [refetchCount, setRefetchCount] = useState(0)

  const refetch = useCallback(() => {
    // Clear cache for this URL so we get fresh data
    if (url) cache.delete(url)
    setRefetchCount(c => c + 1)
  }, [url])

  useEffect(() => {
    // WHY null check: Some callers pass null when they don't have the URL yet
    // (e.g. product detail page before the ID is available). We skip fetching.
    if (!url) {
      setLoading(false)
      return
    }

    // Check cache before making a network request
    if (useCache && cache.has(url)) {
      setData(cache.get(url))
      setLoading(false)
      setError(null)
      return
    }

    // Cancel any previous in-flight request for this URL.
    // This happens when url changes quickly (e.g. navigating between product pages).
    // Without this, a slow response from the PREVIOUS url could overwrite the data
    // for the CURRENT url — a classic race condition.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
      .then(json => {
        if (useCache) cache.set(url, json)
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        // AbortError is expected when we cancel a request — don't treat it as an error
        if (err.name === 'AbortError') return
        setError(err)
        setLoading(false)
      })

    // Cleanup: cancel the request if the component unmounts or url changes
    return () => {
      controller.abort()
    }
  }, [url, useCache, refetchCount]) // re-run when url changes or refetch() is called

  return { data, loading, error, refetch }
}
