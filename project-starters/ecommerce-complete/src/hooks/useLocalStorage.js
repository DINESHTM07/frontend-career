import { useState, useEffect } from 'react'

/*
  WHY useLocalStorage:
  localStorage is a synchronous, persistent key-value store in the browser.
  Raw localStorage usage in components is messy:
    - localStorage.setItem(key, JSON.stringify(value)) on every write
    - JSON.parse(localStorage.getItem(key)) on every read
    - Try/catch for JSON parse errors and storage quota errors
    - No re-rendering when the value changes

  This hook wraps all of that into a clean [value, setValue] API that:
  1. Reads from localStorage on first render (hydration)
  2. Writes to localStorage automatically when value changes
  3. Handles JSON serialization/deserialization
  4. Falls back to `initialValue` if localStorage is empty or errors

  WHY useState + useEffect (not a storage event listener):
  For our app, we only need persistence within one tab. Cross-tab sync would
  require a storage event listener — that's added complexity we don't need here.
  If you need cross-tab sync, add: window.addEventListener('storage', handler)

  @param {string} key - localStorage key
  @param {any} initialValue - Value to use if nothing is stored yet
  @returns {[any, Function]} [storedValue, setValue]
*/
export function useLocalStorage(key, initialValue) {
  /*
    WHY lazy initializer (function form of useState):
    If we wrote useState(JSON.parse(localStorage.getItem(key))), that
    expression would run on EVERY render — repeatedly reading from localStorage,
    which is synchronous I/O and can be slow.

    By passing a function to useState, React only calls it ONCE on mount.
    This is React's "lazy initial state" optimization.
  */
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      // WHY null check: localStorage.getItem returns null (not undefined)
      // when the key doesn't exist. JSON.parse(null) returns null, which
      // is probably not what we want for arrays/objects.
      return item !== null ? JSON.parse(item) : initialValue
    } catch (error) {
      // localStorage can throw in:
      // - Private browsing with storage disabled
      // - JSON.parse failing on corrupted data
      // Fallback gracefully to initialValue rather than crashing the app
      console.warn(`useLocalStorage: failed to read key "${key}"`, error)
      return initialValue
    }
  })

  // Sync to localStorage whenever storedValue changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      // Can fail if storage quota is exceeded (rare but possible)
      console.warn(`useLocalStorage: failed to write key "${key}"`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
