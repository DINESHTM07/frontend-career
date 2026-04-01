# Custom Hooks Cheatsheet

## CONCEPT
A custom hook is a JavaScript function whose name starts with `use` and that calls other hooks. It lets you extract and reuse stateful logic across components without changing component hierarchy.

```jsx
// Pattern: extract hook logic into a function named useXxx
function useMyHook(param) {
  // can call useState, useEffect, useRef, other hooks
  return { value, handler };
}
```

---

## WHY IT MATTERS
When two components share the same stateful logic (fetching data, form handling, subscriptions), copy-pasting that logic is fragile. Custom hooks let you share the *behavior* without sharing the *state* — each component that calls the hook gets its own independent state instance.

---

## RULES OF HOOKS (applies to custom hooks too)

```
1. Only call hooks at the TOP LEVEL of a function — never inside loops, conditions,
   or nested functions. React relies on call order to associate state with hooks.

2. Only call hooks from REACT FUNCTIONS — function components or other custom hooks.
   Never from regular JS functions, class methods, or event handlers.

3. Name custom hooks starting with "use" — this lets linters enforce the rules above.

// BAD
function getUser() {  // doesn't start with "use"
  const [user, setUser] = useState(null); // ← hooks rule violation
}

// BAD
function Component() {
  if (loggedIn) {
    const [data, setData] = useState(null); // ← inside a condition
  }
}

// GOOD
function useUser(userId) {
  const [user, setUser] = useState(null);
  // ...
  return user;
}
```

---

## EXAMPLES

### 1. useToggle — Simplest Possible Custom Hook

```jsx
import { useState, useCallback } from 'react';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle   = useCallback(() => setValue(v => !v), []);
  const setTrue  = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, { setTrue, setFalse }];
}

// Usage
function Modal() {
  const [isOpen, toggleOpen, { setFalse: close }] = useToggle(false);

  return (
    <div>
      <button onClick={toggleOpen}>Toggle modal</button>
      {isOpen && (
        <div className="modal">
          <p>Modal content</p>
          <button onClick={close}>Close</button>
        </div>
      )}
    </div>
  );
}
```

### 2. useLocalStorage — Persistent State

```jsx
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Initialize from localStorage (or fallback to initialValue)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue; // localStorage unavailable (SSR, private mode)
    }
  });

  // Sync to localStorage whenever value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // ignore write errors
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// Usage — identical API to useState, but persists across page reloads
function ThemePicker() {
  const [theme, setTheme] = useLocalStorage('app-theme', 'light');

  return (
    <select value={theme} onChange={e => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}
```

### 3. useFetch — Data Fetching with Loading / Error / Data

```jsx
import { useState, useEffect, useRef } from 'react';

function useFetch(url) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    setLoading(true);
    setError(null);

    // Abort previous request if url changes before response arrives
    abortRef.current = new AbortController();

    fetch(url, { signal: abortRef.current.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return; // ignore cancelled requests
        setError(err.message);
        setLoading(false);
      });

    return () => abortRef.current.abort(); // cleanup: abort on unmount or url change
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;
  return <h1>{user.name}</h1>;
}
```

### 4. useDebounce — Delay Fast-Changing Values

```jsx
import { useState, useEffect } from 'react';

// Returns a debounced version of value — only updates after `delay` ms of silence
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // cancel if value changes before delay
  }, [value, delay]);

  return debouncedValue;
}

// Usage — search input that only fires API call after user stops typing
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  // Only runs when user stops typing for 400ms
  const { data } = useFetch(debouncedQuery ? `/api/search?q=${debouncedQuery}` : null);

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {data?.results.map(r => <div key={r.id}>{r.title}</div>)}
    </div>
  );
}
```

### 5. useMediaQuery — Responsive Logic in Components

```jsx
import { useState, useEffect } from 'react';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches // initialize synchronously
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    // Modern API
    mediaQueryList.addEventListener('change', handler);
    return () => mediaQueryList.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Usage
function Layout() {
  const isMobile  = useMediaQuery('(max-width: 768px)');
  const isDark    = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <div>
      {isMobile ? <MobileNav /> : <DesktopNav />}
      <main style={{ color: isDark ? '#fff' : '#000' }}>
        Content
      </main>
    </div>
  );
}
```

### 6. useClickOutside — Dismiss Dropdowns / Modals

```jsx
import { useEffect } from 'react';

// Calls handler when a click occurs outside the referenced element
function useClickOutside(ref, handler) {
  useEffect(() => {
    function handleClick(event) {
      // If ref has no element, or click was inside the element, do nothing
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick); // mobile support
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [ref, handler]); // handler should be stable (useCallback in parent)
}

// Usage
function Dropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setOpen(o => !o)}>Menu</button>
      {open && (
        <ul>
          <li>Option A</li>
          <li>Option B</li>
        </ul>
      )}
    </div>
  );
}
```

### 7. Composing Custom Hooks Together

```jsx
// Custom hooks compose cleanly — hook calling another custom hook

function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery    = useDebounce(query, 300); // ← using custom hook
  const { data, loading, error } = useFetch(           // ← using another custom hook
    debouncedQuery ? `/api/search?q=${encodeURIComponent(debouncedQuery)}` : null
  );

  return {
    query,
    setQuery,
    results: data?.results ?? [],
    loading,
    error,
  };
}

function SearchPage() {
  const { query, setQuery, results, loading } = useSearch();

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {loading && <p>Searching...</p>}
      {results.map(r => <div key={r.id}>{r.title}</div>)}
    </div>
  );
}
```

### 8. Testing Custom Hooks

```jsx
// Use @testing-library/react's renderHook to test hooks directly
// Install: npm install --save-dev @testing-library/react

import { renderHook, act } from '@testing-library/react';
import { useToggle } from './useToggle';
import { useDebounce } from './useDebounce';

// Testing useToggle
test('useToggle initializes to false by default', () => {
  const { result } = renderHook(() => useToggle());
  expect(result.current[0]).toBe(false);
});

test('toggle flips value', () => {
  const { result } = renderHook(() => useToggle());
  act(() => result.current[1]()); // call toggle
  expect(result.current[0]).toBe(true);
});

// Testing useDebounce with fake timers
test('useDebounce delays update', async () => {
  jest.useFakeTimers();
  const { result, rerender } = renderHook(
    ({ value }) => useDebounce(value, 300),
    { initialProps: { value: 'hello' } }
  );

  rerender({ value: 'world' });
  expect(result.current).toBe('hello'); // hasn't updated yet

  act(() => jest.advanceTimersByTime(300));
  expect(result.current).toBe('world'); // now updated
  jest.useRealTimers();
});
```

---

## QUICK REFERENCE

| Hook | What it encapsulates | Returns |
|------|---------------------|---------|
| `useToggle` | Boolean flip logic | `[value, toggle, { setTrue, setFalse }]` |
| `useLocalStorage` | localStorage sync | `[value, setter]` like `useState` |
| `useFetch` | Data fetching lifecycle | `{ data, loading, error }` |
| `useDebounce` | Delay on fast changes | debounced value |
| `useMediaQuery` | CSS media query state | boolean |
| `useClickOutside` | Outside-click detection | void (side effect) |

**When to extract a custom hook:**
- Same stateful logic used in 2+ components
- Logic is complex enough that it clutters the component
- You want to test the logic in isolation
- The logic is reusable across projects (put it in a `hooks/` folder)
