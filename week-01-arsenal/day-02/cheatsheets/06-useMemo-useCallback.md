# useMemo & useCallback Cheatsheet

## CONCEPT
`useMemo` memoizes a **computed value** — it caches the result of an expensive calculation and only recomputes when dependencies change.

`useCallback` memoizes a **function reference** — it returns the same function instance between renders unless dependencies change.

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedFn   = useCallback(() => doSomething(a, b), [a, b]);
```

Both are performance optimizations. Neither changes *what* your code does — only *how often* it recalculates.

---

## WHY IT MATTERS
Every render creates new values and new function references. This matters when:
- A child wrapped in `React.memo` receives a callback — a new reference breaks memoization
- An expensive calculation runs on every render unnecessarily
- A value is used as a dependency in `useEffect` and causes infinite loops

The catch: memoization itself has a cost (memory + comparison). Used carelessly it makes things *worse*.

---

## EXAMPLES

### 1. When They Actually Help vs. When They Don't

```
useMemo HELPS when:
  ✓ Calculation is genuinely expensive (sorting large lists, heavy math)
  ✓ Result is passed to a memoized child (React.memo)
  ✓ Value is used as a useEffect dependency

useMemo WASTES MEMORY when:
  ✗ Calculation is cheap (string concat, simple arithmetic)
  ✗ The component re-renders rarely anyway
  ✗ Dependencies change every render (the cache is never hit)
  ✗ You're just avoiding "unnecessary re-renders" without profiling

useCallback HELPS when:
  ✓ Passing callbacks to React.memo children
  ✓ Function is a useEffect/useMemo dependency

useCallback WASTES MEMORY when:
  ✗ The child doesn't use React.memo
  ✗ The callback is only used inline (event handlers in JSX)
  ✗ It wraps a trivially cheap function
```

### 2. useMemo — Expensive Calculation

```jsx
import { useMemo, useState } from 'react';

// Simulates an expensive operation
function computeFilteredList(items, query) {
  console.log('Running expensive filter...');
  return items
    .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name)); // sort is O(n log n)
}

function ProductList({ items }) {
  const [query, setQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false); // unrelated state

  // Without useMemo: computeFilteredList runs on EVERY render,
  // including when only darkMode changes.
  // With useMemo: only reruns when items or query changes.
  const filteredItems = useMemo(
    () => computeFilteredList(items, query),
    [items, query] // darkMode NOT in deps — won't recompute for it
  );

  return (
    <div style={{ background: darkMode ? '#333' : '#fff' }}>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={() => setDarkMode(d => !d)}>Toggle theme</button>
      {filteredItems.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
}
```

### 3. React.memo — Memoizing a Component

```jsx
import { memo, useState } from 'react';

// React.memo wraps a component so it only re-renders when props change.
// Uses shallow comparison by default.
const ExpensiveChild = memo(function ExpensiveChild({ label, count }) {
  console.log('ExpensiveChild rendered');
  return <div>{label}: {count}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // Without React.memo: ExpensiveChild re-renders every time text changes.
  // With React.memo: ExpensiveChild only re-renders when count changes.
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <ExpensiveChild label="Count" count={count} />
    </div>
  );
}
```

### 4. useCallback + React.memo — Preventing Broken Memoization

```jsx
import { memo, useState, useCallback } from 'react';

const Button = memo(function Button({ onClick, children }) {
  console.log('Button rendered:', children);
  return <button onClick={onClick}>{children}</button>;
});

function App() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  // BAD: without useCallback, a new function is created every render.
  // React.memo sees a new prop reference → re-renders Button anyway.
  // const handleClick = () => setCount(c => c + 1);

  // GOOD: useCallback preserves the same reference across renders.
  // React.memo's shallow comparison sees no change → skips re-render.
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // no deps: setCount is stable from React

  return (
    <div>
      <Button onClick={handleClick}>Increment</Button>
      <button onClick={() => setOther(o => o + 1)}>Other: {other}</button>
      <p>Count: {count}</p>
    </div>
  );
}
```

### 5. Dependency Arrays — The Rules

```jsx
// Same rules as useEffect: list every reactive value you use inside.

const result = useMemo(() => {
  return items.filter(i => i.active && i.score > threshold);
  //            ↑ prop         ↑ prop
}, [items, threshold]); // both must be listed

// COMMON MISTAKE: missing dependency
// eslint-disable-next-line react-hooks/exhaustive-deps ← suppressing this is a red flag
const broken = useMemo(() => items.filter(i => i.score > threshold), [items]);
// If threshold changes, result is stale — uses old threshold silently.

// TRICK: If a value never changes (module-level constant), you don't need to list it
const LIMIT = 100;
const capped = useMemo(() => items.slice(0, LIMIT), [items]); // LIMIT is fine to omit
```

### 6. Referential Stability — useMemo for Objects/Arrays

```jsx
// Problem: every render creates a new object reference.
// If passed to useEffect deps or memoized child, it triggers every time.

function Component({ userId }) {
  // BAD: new object every render, breaks React.memo and useEffect
  // const config = { userId, mode: 'read' };

  // GOOD: same reference as long as userId doesn't change
  const config = useMemo(() => ({ userId, mode: 'read' }), [userId]);

  useEffect(() => {
    fetchData(config); // only re-fetches when userId changes
  }, [config]);

  return <DataDisplay config={config} />;
}
```

### 7. Common Mistake — Premature Optimization

```jsx
// This is pointless — the calculation is trivial, wrapping adds overhead
const fullName = useMemo(
  () => `${firstName} ${lastName}`, // ← this is NOT expensive
  [firstName, lastName]
);
// Just write: const fullName = `${firstName} ${lastName}`;

// This callback doesn't need memoization
// The child isn't memoized, so useCallback buys nothing
const handleChange = useCallback((e) => {
  setValue(e.target.value);
}, []); // wasted effort if <input> is a plain DOM element

// RULE: Profile first. React DevTools Profiler shows actual render costs.
// Only optimize after you've measured a real problem.
```

### 8. useMemo vs. useEffect for Derived State

```jsx
// Don't use useEffect + useState to compute derived values.
// It causes an extra render cycle.

// BAD: needless extra render
function Bad({ items }) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(items.reduce((sum, i) => sum + i.price, 0));
  }, [items]);
  return <div>Total: {total}</div>;
}

// GOOD: derive inline (if cheap) or with useMemo (if expensive)
function Good({ items }) {
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0),
    [items]
  );
  return <div>Total: {total}</div>;
}
```

---

## QUICK REFERENCE

| Hook | Memoizes | Use when |
|------|----------|----------|
| `useMemo` | A value | Expensive calculation, stable object/array reference |
| `useCallback` | A function | Passing to `React.memo` child, function as `useEffect` dep |
| `React.memo` | A component | Child re-renders due to parent renders, not prop changes |

**Decision flow:**
1. Does the component feel slow? → Profile with React DevTools first.
2. Is there a genuinely expensive calculation? → `useMemo`.
3. Is a memoized child getting new function props each render? → `useCallback`.
4. Does a child re-render when parent does but props didn't change? → `React.memo`.
5. None of the above? → Don't add memoization.
