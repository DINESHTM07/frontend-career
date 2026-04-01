# 12 — React Performance

---

## COMMON CAUSES OF UNNECESSARY RE-RENDERS

### CONCEPT
React re-renders a component when its state or props change. But many re-renders are *unnecessary* — caused by reference instability, poor component boundaries, or context misuse.

### WHY IT MATTERS
Unnecessary re-renders waste CPU cycles and can cause visible UI jank. Understanding the root causes lets you fix problems precisely instead of blindly adding memoization.

### EXAMPLES

**Example 1 — The 5 most common causes**
```jsx
// CAUSE 1: New object/array reference every render
function Parent() {
  // BAD: new object on every render → Child always re-renders
  return <Child config={{ timeout: 1000 }} />;
  // FIX: move config outside, or useMemo
}

// CAUSE 2: New function reference every render
function Parent() {
  // BAD: new function on every render → Child always re-renders
  const handleClick = () => console.log('clicked');
  return <Child onClick={handleClick} />;
  // FIX: useCallback
}

// CAUSE 3: Context value is a new object every render
const Ctx = createContext();
function Provider({ children }) {
  const [user, setUser] = useState(null);
  // BAD: { user, setUser } is a new object every render
  return <Ctx.Provider value={{ user, setUser }}>{children}</Ctx.Provider>;
  // FIX: wrap value in useMemo
}

// CAUSE 4: Entire parent re-renders, cascading to all children
// Components that render all their children on every state change
// FIX: lift state down, or use React.memo on stable children

// CAUSE 5: useState with the same value still triggers a render
// React bails out AFTER rendering, not before (for class components it's different)
// For function components, React does bail out with Object.is comparison —
// but the check happens after the function runs, not before.
```

### COMMON MISTAKES
- Adding `React.memo` everywhere as a "fix" without profiling first
- Optimizing before measuring — use React DevTools Profiler first

### INTERVIEW TIP
"My first step is always the React DevTools Profiler, not memoization. Profiler shows exactly which component re-rendered and why. Adding memo without profiling often moves the problem without solving it."

---

## REACT.MEMO

### CONCEPT
`React.memo` is a higher-order component that wraps a component and skips re-rendering if props haven't changed (shallow comparison by default).

### WHY IT MATTERS
Prevents expensive child components from re-rendering just because a parent re-rendered, when their own props didn't change.

### EXAMPLES

**Example 2 — Basic React.memo**
```jsx
// Without memo: re-renders every time Parent renders, even if `name` didn't change
function UserCard({ name, role }) {
  console.log('UserCard rendered');
  return <div>{name} — {role}</div>;
}

// With memo: skips render if name and role are the same reference/value
const UserCard = React.memo(function UserCard({ name, role }) {
  console.log('UserCard rendered');
  return <div>{name} — {role}</div>;
});

// Parent
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <UserCard name="Alice" role="admin" />  {/* skipped on count change */}
    </div>
  );
}
```

**Example 3 — Custom comparison function**
```jsx
// Default is shallow: { id: 1 } !== { id: 1 } (different reference)
// Custom comparator lets you define what "equal" means
const UserCard = React.memo(
  function UserCard({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
  //                         ^ return true = skip re-render
  //                           return false = do re-render
);
```

### COMMON MISTAKES
- Wrapping everything in `React.memo` — the memo check itself has a cost
- Memo on a component whose parent passes a new function/object every render — memo is bypassed. Fix the prop first with `useCallback`/`useMemo`
- Using memo for cheap components (simple divs/spans) — overhead > benefit

### INTERVIEW TIP
"`React.memo` is only effective when combined with stable props. If the parent passes `onClick={() => doThing()}` inline, memo does nothing — you need `useCallback` on that function first."

---

## USEMEMO

### CONCEPT
`useMemo` caches the result of an expensive calculation between renders. Recomputes only when dependencies change.

### WHY IT MATTERS
Prevents expensive computations (sorting, filtering large arrays, complex math) from running on every render.

### EXAMPLES

**Example 4 — Filtering a large list**
```jsx
function ProductList({ products, filterText, sortBy }) {
  // BAD: filters and sorts on every render, even for unrelated state changes
  const visible = products
    .filter(p => p.name.includes(filterText))
    .sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1);

  // GOOD: only recomputes when products, filterText, or sortBy change
  const visible = useMemo(() =>
    products
      .filter(p => p.name.includes(filterText))
      .sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1),
    [products, filterText, sortBy]
  );

  return visible.map(p => <ProductCard key={p.id} product={p} />);
}
```

**Example 5 — Stabilizing an object reference for a memoized child**
```jsx
function Dashboard({ userId, theme }) {
  // Without useMemo: new object every render → React.memo on ChartConfig is bypassed
  const chartConfig = useMemo(() => ({
    userId,
    colorScheme: theme === 'dark' ? ['#333', '#666'] : ['#fff', '#ccc'],
    gridLines: true,
  }), [userId, theme]);

  return <Chart config={chartConfig} />;  // Chart is React.memo wrapped
}
```

### COMMON MISTAKES
- Using `useMemo` for trivial calculations (adding two numbers) — adds overhead, no benefit
- Missing a dependency → stale cached value (React's exhaustive-deps lint rule catches this)
- Treating `useMemo` as a guaranteed cache — React may discard it for memory pressure

### INTERVIEW TIP
"`useMemo` solves two problems: expensive computation and reference stability. If you're not doing expensive work AND you don't need a stable reference, skip it. The linter's exhaustive-deps rule is your safety net for stale closures."

---

## USECALLBACK

### CONCEPT
`useCallback` caches a function reference between renders. Returns the same function instance as long as dependencies don't change.

### WHY IT MATTERS
Functions created inline are new references every render. If passed to `React.memo` children or used as `useEffect` dependencies, they break memoization and cause re-renders or effect loops.

### EXAMPLES

**Example 6 — Stable callback for a memoized child**
```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  // BAD: new function every render → TodoItem (memo'd) always re-renders
  const handleDelete = (id) => setTodos(t => t.filter(i => i.id !== id));

  // GOOD: same function reference as long as setTodos is stable
  const handleDelete = useCallback(
    (id) => setTodos(t => t.filter(i => i.id !== id)),
    []  // setTodos is stable (from useState), so no deps needed
  );

  return todos.map(todo => (
    <TodoItem key={todo.id} todo={todo} onDelete={handleDelete} />
  ));
}

const TodoItem = React.memo(function TodoItem({ todo, onDelete }) {
  return (
    <li>
      {todo.text}
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});
```

**Example 7 — Callback as a useEffect dependency**
```jsx
function DataFetcher({ userId, onDataLoaded }) {
  // BAD: if onDataLoaded is defined inline in the parent,
  // it's a new ref every render → this effect runs on every render
  useEffect(() => {
    fetchData(userId).then(onDataLoaded);
  }, [userId, onDataLoaded]);
}

// Parent — fix by stabilizing the callback
function Parent() {
  const handleData = useCallback((data) => {
    console.log('loaded', data);
  }, []); // empty deps = stable forever

  return <DataFetcher userId={42} onDataLoaded={handleData} />;
}
```

### COMMON MISTAKES
- Using `useCallback` for every function — memoizing cheap functions adds overhead
- Leaving out dependencies — stale closure (use the exhaustive-deps lint rule)
- `useCallback` without `React.memo` on the child — pointless, the child re-renders anyway

### INTERVIEW TIP
"`useCallback` is useless without `React.memo` on the receiving component (or without the function being a `useEffect` dependency). They're a package deal — stabilizing a function only matters if something is watching for reference changes."

---

## LAZY LOADING WITH REACT.LAZY AND SUSPENSE

### CONCEPT
`React.lazy` dynamically imports a component only when it's first rendered. `Suspense` renders a fallback while the import is in flight.

### WHY IT MATTERS
Reduces initial bundle size — components are only downloaded when needed. Critical for large apps where not every user visits every route.

### EXAMPLES

**Example 8 — Basic lazy import**
```jsx
import { lazy, Suspense } from 'react';

// The import() is only executed when AdminPanel first renders
const AdminPanel = lazy(() => import('./AdminPanel'));

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div>
      <button onClick={() => setShowAdmin(true)}>Open Admin</button>
      {showAdmin && (
        <Suspense fallback={<div>Loading admin panel…</div>}>
          <AdminPanel />
        </Suspense>
      )}
    </div>
  );
}
```

**Example 9 — Code splitting by route (most common pattern)**
```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Each route is a separate chunk — only downloaded when the user navigates there
const Home      = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings  = lazy(() => import('./pages/Settings'));
const AdminPage = lazy(() => import('./pages/Admin'));   // large, rarely visited

function AppRouter() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings"  element={<Settings />} />
        <Route path="/admin"     element={<AdminPage />} />
      </Routes>
    </Suspense>
  );
}

// Before lazy: one 500KB bundle downloaded upfront
// After lazy:  150KB initial + 100KB per route on demand
```

### COMMON MISTAKES
- Lazy-loading tiny components — the async overhead outweighs the savings
- Forgetting `Suspense` — React throws an error if a lazy component renders without one
- Not handling load failures — wrap in an ErrorBoundary for production

### INTERVIEW TIP
"Route-based code splitting is the highest-ROI lazy loading pattern. It requires zero component changes and immediately reduces the initial bundle. I use it by default in any app with 3+ routes."

---

## VIRTUALIZATION FOR LONG LISTS

### CONCEPT
Instead of rendering all items in a long list, virtualization renders only the items currently visible in the viewport. Items outside the viewport are unmounted or recycled.

### WHY IT MATTERS
Rendering 10,000 list items creates 10,000 DOM nodes — slow initial paint and high memory usage. Virtualization keeps the DOM node count constant (~20-50) regardless of list length.

### EXAMPLES

**Example 10 — Without vs with virtualization**
```jsx
// BAD: renders all 10,000 items — slow paint, high memory
function BadList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>  // 10,000 DOM nodes
      ))}
    </ul>
  );
}

// GOOD: with react-window (only ~15 DOM nodes in viewport at any time)
import { FixedSizeList } from 'react-window';

function GoodList({ items }) {
  const Row = ({ index, style }) => (
    // style provides absolute positioning — required for react-window
    <div style={style}>{items[index].name}</div>
  );

  return (
    <FixedSizeList
      height={600}        // visible container height (px)
      itemCount={items.length}
      itemSize={50}       // each row height (px)
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

**Example 11 — Variable height list with react-window**
```jsx
import { VariableSizeList } from 'react-window';

function FeedList({ posts }) {
  // Function to compute each item's height
  const getItemSize = (index) => {
    const post = posts[index];
    return post.hasImage ? 300 : 100;
  };

  return (
    <VariableSizeList
      height={window.innerHeight}
      itemCount={posts.length}
      itemSize={getItemSize}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <PostCard post={posts[index]} />
        </div>
      )}
    </VariableSizeList>
  );
}
```

### COMMON MISTAKES
- Using virtualization for lists under ~100 items — adds complexity without real benefit
- Forgetting to apply the `style` prop from react-window — breaks item positioning
- Trying to virtualize a grid without using `react-window`'s `FixedSizeGrid`

### INTERVIEW TIP
"Virtualization is the right tool when list length is user-driven and potentially unbounded — social feeds, search results, data tables. For a fixed 50-item list, React.memo on the item component is usually enough."

---

## USETRANSITION — DEFERRING NON-URGENT UPDATES

### CONCEPT
`useTransition` marks a state update as non-urgent. React can interrupt and deprioritize it to keep the UI responsive during expensive renders.

### WHY IT MATTERS
Without `useTransition`, a slow render (e.g., filtering 5000 items) blocks the UI — the input feels laggy. `useTransition` lets React prioritize the input update and handle the expensive render when it can.

### EXAMPLES

**Example 12 — Filtering a large list without blocking input**
```jsx
import { useState, useTransition } from 'react';

function SearchPage({ allItems }) {
  const [query, setQuery]   = useState('');
  const [results, setResults] = useState(allItems);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);   // urgent: update input immediately

    // non-urgent: expensive filter can be deferred
    startTransition(() => {
      const filtered = allItems.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Search…" />
      {isPending && <span>Updating results…</span>}
      <ul>
        {results.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  );
}

// Without useTransition: typing feels sluggish — each keystroke waits for the filter
// With useTransition: input updates immediately, list catches up asynchronously
```

### COMMON MISTAKES
- Using `useTransition` for network requests — it's for CPU-bound renders, not async I/O (use React Query for that)
- Forgetting that the transition state update must be inside `startTransition`
- Using it for every state update — adds complexity, only useful for genuinely slow renders

### INTERVIEW TIP
"`useTransition` is React's answer to 'how do I keep typing feel instant while an expensive list re-renders?' It relies on React's concurrent rendering — the expensive work is time-sliced and can be interrupted. Available in React 18+."

---

## QUICK REFERENCE

```
React.memo          → skip re-render if props didn't change (shallow check)
useMemo             → cache expensive computed value
useCallback         → cache function reference (use with React.memo)
React.lazy          → defer component download until first render
Suspense            → show fallback while lazy component loads
Code splitting      → split bundle by route (lazy + Suspense)
Virtualization      → render only visible items in long lists (react-window)
useTransition       → mark expensive state updates as non-urgent (React 18)

Optimization order:
1. Profile first (React DevTools Profiler)
2. Fix the root cause (unstable references, bad component boundaries)
3. Apply targeted memoization (memo, useMemo, useCallback)
4. Apply structural solutions (lazy loading, virtualization)

Never optimize blind — measure, then fix.
```
