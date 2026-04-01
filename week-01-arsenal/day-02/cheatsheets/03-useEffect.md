# useEffect Cheatsheet

## CONCEPT
`useEffect` lets you synchronize a component with an external system — an API, a browser event, a timer, a third-party library. It runs after the render is committed to the DOM.

```jsx
useEffect(() => {
  // setup code
  return () => {
    // cleanup code (optional)
  };
}, [dependencies]);
```

---

## WHY IT MATTERS
Almost every real-world component needs side effects: data fetching, subscriptions, DOM manipulation. Misusing `useEffect` is the #1 source of React bugs — infinite loops, stale data, memory leaks.

---

## WHAT IT REPLACES FROM CLASS LIFECYCLE

| Class lifecycle | useEffect equivalent |
|---|---|
| `componentDidMount` | `useEffect(() => { ... }, [])` |
| `componentDidUpdate` | `useEffect(() => { ... }, [dep])` |
| `componentWillUnmount` | `return () => { cleanup }` inside effect |
| `componentDidMount` + `componentDidUpdate` | `useEffect(() => { ... })` (no array) |

---

## EXAMPLES

### 1. Empty Dependency Array — Run Once on Mount
```jsx
function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Runs once after initial render — like componentDidMount
    fetchData().then(result => setData(result));
  }, []); // [] means: no dependencies, never re-run

  return <div>{data}</div>;
}
```

### 2. With Dependencies — Run When Deps Change
```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Re-runs whenever userId changes
    fetchUser(userId).then(setUser);
  }, [userId]); // userId is the dependency

  return <div>{user?.name}</div>;
}

// Multiple dependencies: runs when ANY of them change
useEffect(() => {
  fetchFilteredData(search, page, sortBy);
}, [search, page, sortBy]);
```

### 3. No Dependency Array — Run After Every Render
```jsx
useEffect(() => {
  // Runs after EVERY render — rarely what you want
  document.title = `Count: ${count}`;
}); // No array at all

// Usually better with the specific dep:
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]); // Only when count changes
```

### 4. Cleanup — Event Listeners
```jsx
function WindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup: remove the listener when component unmounts or deps change
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // only register once

  return <p>{size.width} x {size.height}</p>;
}
```

### 5. Cleanup — Timers
```jsx
function Countdown({ seconds }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft === 0) return; // no timer needed

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    // Clear interval when component unmounts or timeLeft hits 0
    return () => clearInterval(timerId);
  }, [timeLeft]);

  return <p>Time left: {timeLeft}s</p>;
}
```

### 6. AbortController for Fetch Cleanup (the right way)
```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/search?q=${query}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
          setLoading(false);
        }
        // AbortError is expected — don't handle it
      });

    // Cleanup: abort the in-flight request when query changes or component unmounts
    return () => controller.abort();
  }, [query]);

  return loading ? <Spinner /> : <List items={results} />;
}
```

### 7. Third-Party Library Integration
```jsx
function Map({ center, zoom }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    // Initialize library on mount
    instanceRef.current = new MapLibrary(mapRef.current, { center, zoom });

    return () => {
      // Destroy on unmount to prevent memory leaks
      instanceRef.current.destroy();
    };
  }, []); // only initialize once

  useEffect(() => {
    // Update when props change, separate from initialization
    instanceRef.current?.setCenter(center);
    instanceRef.current?.setZoom(zoom);
  }, [center, zoom]);

  return <div ref={mapRef} />;
}
```

### 8. Syncing State to localStorage
```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return JSON.parse(localStorage.getItem(key)) ?? initialValue;
  });

  useEffect(() => {
    // Keep localStorage in sync whenever value changes
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  return <button onClick={() => setTheme('dark')}>Dark</button>;
}
```

### 9. useEffect vs useLayoutEffect
```jsx
// useEffect: runs AFTER paint — async, non-blocking (99% of cases)
useEffect(() => {
  // Fine for data fetching, subscriptions, logging
}, []);

// useLayoutEffect: runs BEFORE paint — synchronous
// Use when you need to measure DOM and update before user sees it
useLayoutEffect(() => {
  // Reading DOM dimensions to position a tooltip
  const rect = tooltipRef.current.getBoundingClientRect();
  setTooltipPosition({ top: rect.bottom, left: rect.left });
}, []);
// Without useLayoutEffect here, user would see tooltip flicker to wrong position
```

### 10. Common Pattern: Skip Effect on First Render
```jsx
function TrackChanges({ value }) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // skip first run
    }
    // Only runs on subsequent changes, not on mount
    console.log('Value changed to:', value);
  }, [value]);
}
```

---

## COMMON MISTAKES

```jsx
// MISTAKE 1: Infinite loop — setting state without proper deps
function Bad() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData().then(result => setData(result));
  }); // NO ARRAY — runs after every render, setting state triggers render...

  // Fix: add []
}

// MISTAKE 2: Object or function in deps (new reference every render)
function Bad({ config }) {
  useEffect(() => {
    setup(config);
  }, [config]); // If config is an object prop, this re-runs every render!
  // Fix: destructure primitives or use useMemo/useCallback
}

// MISTAKE 3: Missing dependency
function Bad() {
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    fetchUser(userId); // userId used but not in deps!
  }, []); // Stale! userId changes won't trigger a re-fetch

  // Fix: add userId to deps array
}

// MISTAKE 4: Async function directly in useEffect
useEffect(async () => {  // WRONG — returns a Promise, not cleanup fn
  const data = await fetchData();
}, []);

// Fix: define async inside
useEffect(() => {
  async function load() {
    const data = await fetchData();
    setData(data);
  }
  load();
}, []);

// MISTAKE 5: Not cleaning up subscriptions → memory leak
useEffect(() => {
  const sub = store.subscribe(update);
  // No return! sub never unsubscribed
}, []);
// Fix:
useEffect(() => {
  const sub = store.subscribe(update);
  return () => sub.unsubscribe();
}, []);
```

---

## INTERVIEW TIP

> **"When does the cleanup function run?"**

The cleanup runs in two cases: (1) before the effect re-runs due to dependency changes, and (2) when the component unmounts. This means every effect run is cleaned up before the next one starts — preventing stale listeners, duplicate subscriptions, and race conditions.

> **"What's the difference between `[]`, `[dep]`, and no array?"**

- `[]`: run once after mount, never again
- `[dep]`: run after mount AND whenever `dep` changes
- No array: run after every render

> **"How do you handle race conditions in data fetching?"**

Use an `AbortController` and abort the fetch in the cleanup function. Or use a boolean flag (`let cancelled = true`) and check it before updating state. This prevents old, slower responses from overwriting newer ones.
