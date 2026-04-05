import { useState, useEffect } from 'react'

// useDebounce
// TODO (Day 3): Implement the debounce hook.
//
// Purpose: Delay updating the returned value until the input has been
// stable for `delay` milliseconds. This prevents expensive re-renders
// (like re-filtering 1000 products) on every single keystroke.
//
// How it works:
//   1. Keep a local `debouncedValue` state (starts equal to `value`)
//   2. On every change to `value`, schedule a setTimeout for `delay` ms
//   3. The useEffect cleanup cancels the previous timer before setting a new one
//   4. Only when `value` is unchanged for `delay` ms does `debouncedValue` update
//
// @param {any} value - The value to debounce (usually a string from an input)
// @param {number} delay - Milliseconds to wait (default: 300)
// @returns {any} The debounced value

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // TODO: set a timer to update debouncedValue after `delay` ms
    // TODO: return a cleanup function that cancels the timer

    // Temporary pass-through so the app renders without error:
    setDebouncedValue(value)
  }, [value, delay])

  return debouncedValue
}
