import { useState } from 'react'

// useLocalStorage
// TODO (Day 6): Implement the localStorage-synced state hook.
//
// Purpose: Works exactly like useState, but the value is persisted to
// localStorage and restored on page reload. Used for favorites and
// the dark mode preference.
//
// @param {string} key          — The localStorage key to read/write
// @param {any}    initialValue — Fallback value if nothing is in localStorage yet
// @returns {[any, Function]}   — [storedValue, setValue] — same shape as useState
//
// How it works:
//   1. Initialize state by reading from localStorage (JSON.parse)
//   2. If nothing is stored yet, use initialValue
//   3. The setter writes to both React state AND localStorage (JSON.stringify)
//   4. Wrap everything in try/catch — localStorage can throw (private browsing, quota exceeded)

export function useLocalStorage(key, initialValue) {
  // TODO: read initial value from localStorage, fall back to initialValue
  // TODO: create setter that updates both state and localStorage

  // Temporary stub — replace with real implementation:
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    // TODO: handle functional updates (value can be a function like useState's setter)
    // TODO: write to localStorage
    // TODO: update React state
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (err) {
      console.error('useLocalStorage write failed:', err)
    }
  }

  return [storedValue, setValue]
}
