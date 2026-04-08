# Day 37 — Custom Hooks: Your Superpower

**Status:** 📋 READY TO START
**Week:** 6 | **Theme:** React Intermediate

---

## What You'll Learn Today

Custom hooks are the most powerful tool in React that most beginners don't know about.

The idea is simple: if you find yourself copying the same `useState` + `useEffect` logic into multiple components, extract it into a function that starts with `use`. That function is a custom hook. It can use all the built-in hooks. It returns whatever the components need.

Without custom hooks — you duplicate logic:
```jsx
// ComponentA.jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
useEffect(() => { /* fetch logic */ }, [url]);

// ComponentB.jsx (same 8 lines again)
const [data, setData] = useState(null);
// ... exact same thing
```

With a custom hook:
```jsx
// useFetch.js — write once
export function useFetch(url) { /* all that logic */ }

// ComponentA.jsx — 1 line
const { data, loading, error } = useFetch(url);

// ComponentB.jsx — same 1 line
const { data, loading, error } = useFetch(url);
```

The five hooks you'll build today (`useLocalStorage`, `useFetch`, `useDebounce`, `useMediaQuery`, `useClickOutside`) are used in virtually every serious React project. Build them once, use them forever.

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/react/08-custom-hooks.md` — read before coding
3. `exercises/react-basics/26-hook-factory.jsx` — midday
4. Your React project

---

## Morning (8:00 – 11:00 AM) — Warmup + Build the Hook Library

### Step 1 — Read the cheatsheet

Open `cheatsheets/react/08-custom-hooks.md`. Focus on:
- The naming rule: must start with `use` (React enforces this)
- Hooks can call other hooks
- Hooks return whatever the component needs (object, array, value, function)
- Hooks cannot be called conditionally

### Step 2 — Warmup: useToggle

Create `src/hooks/useToggle.js`:

```js
import { useState, useCallback } from 'react'

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  // useCallback prevents new function reference on every render
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  const setOn  = useCallback(() => setValue(true),  []);
  const setOff = useCallback(() => setValue(false), []);

  return [value, toggle, setOn, setOff];
}
```

**Test it:**
```jsx
// In any component
const [isOpen, toggle, open, close] = useToggle(false);
<button onClick={toggle}>{isOpen ? "Close" : "Open"}</button>
{isOpen && <div>Content</div>}
```

---

### Step 3 — useLocalStorage

Create `src/hooks/useLocalStorage.js`:

```js
import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    // Lazy initializer — reads from localStorage only on first render
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  function setValue(value) {
    try {
      // Allow value to be a function (like setState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("useLocalStorage write error:", error);
    }
  }

  return [storedValue, setValue];
}
```

**Test it:**
```jsx
const [name, setName] = useLocalStorage("username", "");
// Changes persist across page refreshes automatically!
```

---

### Step 4 — useFetch

Create `src/hooks/useFetch.js`:

```js
import { useState, useEffect } from 'react'

export function useFetch(url) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!url) return;

    let cancelled = false; // prevent setting state on unmounted component

    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; }; // cleanup on url change or unmount
  }, [url]);

  return { data, loading, error };
}
```

**Test it:**
```jsx
const { data, loading, error } = useFetch("https://official-joke-api.appspot.com/random_joke");
if (loading) return <p>Loading...</p>;
if (error)   return <p>Error: {error}</p>;
return <p>{data?.setup}</p>;
```

No `useState` or `useEffect` in your component. All the fetch logic lives in the hook.

---

### Step 5 — useDebounce

Create `src/hooks/useDebounce.js`:

```js
import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // cleanup on value change
  }, [value, delay]);

  return debouncedValue;
}
```

**Test it — replaces the manual debounce in Movie Search:**
```jsx
const [query, setQuery] = useState("");
const debouncedQuery = useDebounce(query, 500);

useEffect(() => {
  if (debouncedQuery) searchMovies(debouncedQuery);
}, [debouncedQuery]); // only fires when debouncedQuery changes (i.e., after 500ms)
```

---

### Step 6 — useMediaQuery

Create `src/hooks/useMediaQuery.js`:

```js
import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
```

**Test it:**
```jsx
const isMobile  = useMediaQuery("(max-width: 768px)");
const isDark    = useMediaQuery("(prefers-color-scheme: dark)");

return <p>You are on a {isMobile ? "mobile" : "desktop"} screen.</p>
```

---

### Step 7 — useClickOutside

Create `src/hooks/useClickOutside.js`:

```js
import { useEffect, useRef } from 'react'

export function useClickOutside(callback) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [callback]);

  return ref;
}
```

**Test it:**
```jsx
const [isOpen, setIsOpen] = useState(false);
const dropdownRef = useClickOutside(() => setIsOpen(false));

return (
  <div ref={dropdownRef} style={{ position: "relative" }}>
    <button onClick={() => setIsOpen(v => !v)}>Menu</button>
    {isOpen && <div style={{ position: "absolute", top: "100%", background: "white", border: "1px solid #ddd", padding: "8px" }}>
      <p>Item 1</p>
      <p>Item 2</p>
    </div>}
  </div>
);
// Clicking anywhere outside the div closes the dropdown — automatic!
```

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:00 PM) — Hook Factory Exercise

Open `exercises/react-basics/26-hook-factory.jsx`.

Work through the exercise — it will ask you to build variations and extend the hooks you created this morning. Work through INTRO → GUIDED → YOUR TURN.

---

## Afternoon (2:00 – 4:00 PM) — Refactor Movie Search + DSA

### Refactor Movie Search to use your custom hooks

Open `src/pages/MoviesPage.jsx`. Replace:
- Manual `useEffect` + `useState` for fetching → use `useDebounce` + `useFetch`
- Manual `localStorage` handling (if any) → use `useLocalStorage`

The component should end up significantly shorter. That's the point.

### DSA

Open `dsa-bank/strings.md`. Solve **problems 7, 8, and 9**.

Create `day-37-dsa.js` in the `week-06-react-intermediate/day-37/` folder.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- What makes a function a "custom hook"? (Just the `use` prefix? Or something more?)
- Why did `useFetch` use a `cancelled` flag instead of just `return () => {}`?
- How does `useClickOutside` work — what is `ref.current.contains(e.target)` checking?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 37: 5 custom hooks from scratch + refactored app + 3 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Read `cheatsheets/react/08-custom-hooks.md`
- [ ] Created `src/hooks/` folder
- [ ] `useToggle` — returns `[value, toggle, setOn, setOff]`, tested in a component
- [ ] `useLocalStorage` — persists to localStorage, survives page refresh
- [ ] `useFetch` — handles loading/error/data, uses cancelled flag for cleanup
- [ ] `useDebounce` — delays value update, cleanup cancels timer
- [ ] `useMediaQuery` — reactive to browser resize, cleans up listener
- [ ] `useClickOutside` — closes dropdown when clicking outside the ref element
- [ ] Completed `26-hook-factory.jsx` exercise
- [ ] `MoviesPage.jsx` refactored to use `useDebounce` (search input)
- [ ] Solved 3 DSA problems in `day-37-dsa.js`
- [ ] Committed and pushed

---

## Quick Reference — Custom Hook Pattern

```js
// Always starts with "use"
// Can use any other hooks inside
// Returns what the consumer needs

function useMyHook(param) {
  const [value, setValue] = useState(null);

  useEffect(() => {
    // setup
    return () => { /* cleanup */ };
  }, [param]);

  return { value, setValue };
}

// Usage in component — looks like magic, works like React
const { value, setValue } = useMyHook("something");
```

---

*The best React developers write fewer lines in their components because they've moved logic into hooks. Your `src/hooks/` folder is now a library you'll use in every future project.*
