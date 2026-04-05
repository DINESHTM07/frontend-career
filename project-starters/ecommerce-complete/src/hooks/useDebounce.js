import { useState, useEffect } from 'react'

/*
  WHY useDebounce:
  Without debounce, every keystroke in the search bar triggers a re-filter
  of all products. With 200 products this is fine, but with 10,000+ products
  (or API calls per keystroke) it becomes a performance problem.

  Debounce says: "Wait until the user STOPS typing (for `delay` ms), THEN update."
  This reduces filter operations from O(keystrokes) to O(pause points).

  WHY a custom hook instead of inline setTimeout:
  If we wrote the setTimeout in the SearchBar component directly, we'd have
  two responsibilities in one component: UI rendering + timing logic.
  A hook extracts the timing logic cleanly. The component just calls
  useDebounce(value, 300) and gets back a debounced value.

  HOW it works:
  1. We keep a local `debouncedValue` state, initialized to `value`.
  2. On every change to `value`, we set a timer to update debouncedValue after `delay` ms.
  3. The cleanup function cancels the previous timer before setting a new one.
  4. So if `value` changes rapidly (typing), the cleanup cancels each timer before
     it fires. Only when `value` is stable for `delay` ms does debouncedValue update.

  @param {any} value - The value to debounce (usually a string from an input)
  @param {number} delay - Milliseconds to wait after last change (default: 300)
  @returns {any} The debounced value
*/
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set a timer to update the debounced value after `delay` ms
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // WHY cleanup: This runs BEFORE the next effect and when the component unmounts.
    // Without it, if the user types quickly, multiple timers accumulate and all
    // fire eventually — causing multiple unnecessary re-renders (or API calls).
    return () => clearTimeout(timer)
  }, [value, delay]) // Re-run when value OR delay changes

  return debouncedValue
}
