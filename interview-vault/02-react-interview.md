# React Interview Questions — 50 Questions with Detailed Answers

> **How to use this guide:**
> - `🟢 EASY` `🟡 MEDIUM` `🔴 HARD` — calibrate your depth of answer
> - `🔥 VERY COMMON` `📌 COMMON` `💡 RARE` — prioritize your prep time
> - Read the **Interview Tip** on every question — these are the differentiators
> - Work through the code examples by hand before your interview

---

## Table of Contents

1. [Hooks](#1-hooks) — 12 questions
2. [State Management](#2-state-management) — 8 questions
3. [Component Patterns](#3-component-patterns) — 6 questions
4. [Performance](#4-performance) — 6 questions
5. [Router](#5-router) — 4 questions
6. [Forms](#6-forms) — 4 questions
7. [Testing](#7-testing) — 3 questions
8. [Error Handling](#8-error-handling) — 3 questions
9. [Server-Side Rendering](#9-server-side-rendering) — 4 questions

---

## 1. Hooks

---

### Q1. What are React Hooks and why were they introduced?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

Hooks are functions that let you "hook into" React state and lifecycle features from **function components**. Introduced in React 16.8, they solve several long-standing problems:

1. **Reusing stateful logic** — Before hooks, you needed render props or HOCs to share stateful logic. Hooks let you extract and reuse it without changing component hierarchy.
2. **Complex components** — Lifecycle methods like `componentDidMount` often mixed unrelated concerns. Hooks let you split one component into smaller functions based on what pieces are related.
3. **Classes are confusing** — `this` binding, event handler patterns, and HOC nesting made class components hard to learn and use.

#### Rules of Hooks
- Only call hooks at the **top level** (not inside loops, conditions, or nested functions)
- Only call hooks from **React function components** or custom hooks

```jsx
// Before hooks — logic tangled in lifecycle methods
class Timer extends React.Component {
  state = { count: 0 };

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(s => ({ count: s.count + 1 }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}

// After hooks — clean, reusable, co-located
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(interval); // cleanup
  }, []);

  return <div>{count}</div>;
}
```

> **Interview Tip:** Don't just say "they replace class components." Explain the three problems above. Interviewers want to know you understand the *motivation*, not just the syntax.

---

### Q2. Explain useState — what does it return and how does state update work?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

`useState(initialValue)` returns a tuple `[state, setState]`:
- **state** — the current value
- **setState** — a function to schedule a re-render with a new value

State updates are **asynchronous** — they don't happen immediately. React batches multiple state updates in event handlers (and in React 18, everywhere) for performance.

```jsx
const [count, setCount] = useState(0);

// Direct update — problematic when new state depends on old state
setCount(count + 1);
setCount(count + 1); // Both calls read the same stale `count`
// Result: count becomes 1, not 2

// Functional update — always reads latest state
setCount(prev => prev + 1);
setCount(prev => prev + 1);
// Result: count becomes 2 ✓
```

#### Lazy initialization
If the initial value is expensive to compute, pass a function — it only runs on the first render:

```jsx
// Bad — expensive() runs on every render
const [data, setData] = useState(expensive());

// Good — expensive() runs only once
const [data, setData] = useState(() => expensive());
```

#### Object state
React doesn't merge object state — you must spread manually:

```jsx
const [form, setForm] = useState({ name: '', email: '' });

// Wrong — erases email
setForm({ name: 'Alice' });

// Correct — merge manually
setForm(prev => ({ ...prev, name: 'Alice' }));
```

> **Interview Tip:** The functional update form (`setState(prev => ...)`) is a must-know. Mention React 18 automatic batching as a bonus — it batch-updates even in `setTimeout` and async functions now.

---

### Q3. How does useEffect work? Explain the dependency array.

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

`useEffect(callback, deps)` runs a side effect **after** the browser has painted. It synchronizes your component with an external system (APIs, subscriptions, timers, DOM manipulation).

| Dependency array | When effect runs |
|---|---|
| Omitted | After every render |
| `[]` | Once after mount |
| `[a, b]` | After mount, and when `a` or `b` changes |

The callback can **return a cleanup function** — React calls it before re-running the effect and on unmount.

```jsx
function Search({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Effect runs when `query` changes
    let cancelled = false;

    fetch(`/api/search?q=${query}`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) setResults(data); // prevent stale update
      });

    return () => {
      cancelled = true; // cleanup: ignore old requests
    };
  }, [query]); // re-run when query changes

  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>;
}
```

#### Common mistakes
```jsx
// Bug — missing dependency means stale closure
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1); // `count` is stale after first render
  }, 1000);
  return () => clearInterval(id);
}, []); // ← count is missing from deps

// Fix — use functional update to avoid capturing count
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1); // reads fresh count
  }, 1000);
  return () => clearInterval(id);
}, []);
```

> **Interview Tip:** React 18 runs effects twice in StrictMode (dev only) to help you find missing cleanup. If an interviewer asks about the "double invocation" behavior, this is why.

---

### Q4. What is useRef and what are its two main use cases?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

`useRef(initialValue)` returns a mutable ref object `{ current: initialValue }`. It persists for the full lifetime of the component and **does not cause a re-render when mutated**.

**Use case 1 — Accessing DOM nodes:**
```jsx
function FocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // direct DOM access
  }, []);

  return <input ref={inputRef} />;
}
```

**Use case 2 — Persisting mutable values without re-renders:**
```jsx
function StopWatch() {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null); // persists between renders

  const start = () => {
    intervalRef.current = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current); // read ref without re-render
  };

  return (
    <div>
      <p>{time}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

> **Interview Tip:** Contrast with `useState` — both persist values across renders, but `useRef` doesn't trigger a re-render. Great for storing timer IDs, previous values, or scroll positions.

---

### Q5. Explain useMemo and useCallback — when should you use each?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

Both are performance optimizations that memoize values between renders.

**useMemo** — memoizes the **result** of a computation:
```jsx
const sortedList = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]); // only re-sorts when `items` changes
```

**useCallback** — memoizes a **function reference** (essentially `useMemo` for functions):
```jsx
const handleSubmit = useCallback((e) => {
  e.preventDefault();
  onSubmit(formData);
}, [formData, onSubmit]); // new function only when deps change
```

#### When to use each

| Hook | Use when |
|---|---|
| `useMemo` | Expensive computation; passing derived data as prop to memoized child |
| `useCallback` | Passing callbacks to `React.memo` children or as `useEffect` deps |

#### When NOT to use them
```jsx
// Pointless — cost of memoization > cost of computation
const double = useMemo(() => x * 2, [x]);

// Only useful if Child is wrapped in React.memo
const handleClick = useCallback(() => doSomething(), []);
```

> **Interview Tip:** The real answer is "use them when profiling shows a problem." Premature memoization adds complexity. Pair with `React.memo` for child optimization — `useCallback` alone doesn't prevent re-renders unless the child is memoized.

---

### Q6. What is the useReducer hook and when should you prefer it over useState?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

`useReducer(reducer, initialState)` returns `[state, dispatch]`. The reducer is a pure function `(state, action) => newState`.

```jsx
const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    case 'reset':
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count} (step: {state.step})</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <input
        type="number"
        value={state.step}
        onChange={e => dispatch({ type: 'setStep', payload: +e.target.value })}
      />
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

#### Prefer useReducer when:
- Next state depends on multiple sub-values
- State has complex transitions with multiple actions
- Logic needs to be testable in isolation (pure reducer)
- You want co-located state logic

> **Interview Tip:** `useReducer` is essentially Redux in miniature. Mention that the reducer is a pure function — easy to unit-test without rendering. Pair with `useContext` to avoid prop drilling (the "poor man's Redux" pattern).

---

### Q7. How does useContext work and what problem does it solve?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

`useContext` reads the value of a React context, allowing components to consume shared state without prop drilling.

```jsx
// 1. Create the context
const ThemeContext = createContext('light');

// 2. Provide a value high in the tree
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}

// 3. Consume anywhere in the subtree — no props passed down
function Button() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      className={theme === 'dark' ? 'btn-dark' : 'btn-light'}
      onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
    >
      Toggle
    </button>
  );
}
```

#### Performance caveat
Every component that calls `useContext(ThemeContext)` **re-renders when the context value changes** — even if it doesn't use the changed part.

```jsx
// Split contexts to minimize re-renders
const ThemeContext = createContext();     // changes rarely
const UserContext = createContext();      // changes rarely
const CartContext = createContext();      // changes often
```

> **Interview Tip:** Context is not a full state management solution. It doesn't have selectors, so every consumer re-renders on any change. For frequent updates (e.g., cursor position), use Zustand/Jotai instead.

---

### Q8. What is the useLayoutEffect hook and how does it differ from useEffect?

**🟡 MEDIUM** | **💡 RARE**

#### Concept

Both have the same signature, but they fire at different times:

| Hook | When it fires | Blocks paint? |
|---|---|---|
| `useEffect` | After browser paint (async) | No |
| `useLayoutEffect` | After DOM mutations, before paint (sync) | Yes |

```jsx
function Tooltip({ target }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    // Must measure DOM before browser paints to avoid flicker
    const rect = target.getBoundingClientRect();
    ref.current.style.top = `${rect.bottom + 8}px`;
    ref.current.style.left = `${rect.left}px`;
  }, [target]);

  return <div ref={ref} className="tooltip">Tooltip content</div>;
}
```

Use `useLayoutEffect` when:
- You read DOM layout (positions, sizes) and need to mutate before the user sees the paint
- Avoiding visible flicker from synchronous DOM measurements

> **Interview Tip:** Always default to `useEffect`. Switch to `useLayoutEffect` only when you see a flicker. It's a niche hook that signals you know the React render pipeline deeply.

---

### Q9. What are custom hooks and how do you build one?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

A custom hook is any function starting with `use` that calls other hooks. They extract stateful logic to be reused across components.

```jsx
// Custom hook — extracts fetch logic
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
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

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Usage — clean component with zero fetch boilerplate
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(`/api/users/${userId}`);

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  return <div>{data.name}</div>;
}
```

> **Interview Tip:** Custom hooks are the primary way to share logic in React. They replace render props and HOCs for stateful logic reuse. The `use` prefix is a convention that tells React (and linters) to apply hook rules.

---

### Q10. Explain the rules of hooks and why they exist.

**🟢 EASY** | **📌 COMMON**

#### The two rules

1. **Only call hooks at the top level** — never in loops, conditions, or nested functions
2. **Only call hooks from React functions** — function components or custom hooks

#### Why these rules exist

React relies on **call order** to map hook calls to internal state. React doesn't track hooks by name — it tracks them by their position in the call sequence.

```jsx
// Broken — hook is inside a condition
function Form({ isLoggedIn }) {
  if (isLoggedIn) {
    const [name, setName] = useState(''); // Hook #1 — only sometimes!
  }
  const [email, setEmail] = useState(''); // Hook #2 on first render, #1 on second!
  // React gets confused — wrong state returned
}

// Correct — conditions inside the hook body
function Form({ isLoggedIn }) {
  const [name, setName] = useState('');   // Always hook #1
  const [email, setEmail] = useState(''); // Always hook #2

  if (!isLoggedIn) return null;
  // ...
}
```

> **Interview Tip:** Explain *why* the rules exist — it's about call order stability, not arbitrary restriction. The ESLint plugin `eslint-plugin-react-hooks` enforces both rules automatically.

---

### Q11. What is useId and when would you use it?

**🟢 EASY** | **💡 RARE**

#### Concept

`useId()` generates a stable, unique ID that is consistent between server and client renders — critical for SSR hydration.

```jsx
function FormField({ label }) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  );
}

// Multiple fields in same component — suffix the base ID
function LoginForm() {
  const id = useId();

  return (
    <form>
      <label htmlFor={`${id}-email`}>Email</label>
      <input id={`${id}-email`} type="email" />

      <label htmlFor={`${id}-password`}>Password</label>
      <input id={`${id}-password`} type="password" />
    </form>
  );
}
```

**Do not use for list keys** — keys must come from your data, not generated IDs.

> **Interview Tip:** The key selling point is SSR safety — `Math.random()` generates different IDs on server vs client, causing hydration mismatches. `useId` is deterministic based on component tree position.

---

### Q12. What is the difference between useEffect cleanup and component unmount?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

The cleanup function returned from `useEffect` runs in **two situations**, not just unmount:

1. **Before re-running the effect** (when deps change)
2. **When the component unmounts**

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const socket = new WebSocket(`wss://chat.example.com/${roomId}`);
    socket.onmessage = (e) => console.log(e.data);

    return () => {
      // Called when roomId changes (cleanup old socket) AND on unmount
      socket.close();
      console.log(`Disconnected from ${roomId}`);
    };
  }, [roomId]);
}

// Timeline when roomId changes from 'general' to 'react':
// 1. Render with roomId='react'
// 2. Cleanup: close socket for 'general'
// 3. Effect: open socket for 'react'
```

> **Interview Tip:** Many developers only think of cleanup as "unmount cleanup." Correcting this shows you understand the full effect lifecycle. In React 18 StrictMode, the cleanup runs on mount too (mount → cleanup → mount) to surface missing cleanups.

---

## 2. State Management

---

### Q13. What is prop drilling and how do you solve it?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

Prop drilling is passing data through multiple intermediate components that don't need it, just to reach a deeply nested component.

```jsx
// Problem — UserAvatar only needs `user`, but App, Layout, Header all pass it
function App() {
  const [user, setUser] = useState({ name: 'Alice', avatar: '...' });
  return <Layout user={user} />;
}
function Layout({ user }) {
  return <Header user={user} />;
}
function Header({ user }) {
  return <nav><UserAvatar user={user} /></nav>;
}
function UserAvatar({ user }) {
  return <img src={user.avatar} alt={user.name} />;
}
```

#### Solutions

1. **Context** — for infrequently changing global data (theme, auth, locale)
2. **State management library** — Zustand, Redux Toolkit for complex/frequent updates
3. **Component composition** — pass components, not data (often overlooked)

```jsx
// Composition — App "slots" the avatar in, no drilling
function App() {
  const [user] = useState({ name: 'Alice', avatar: '...' });
  return (
    <Layout header={<Header avatar={<UserAvatar user={user} />} />} />
  );
}
function Layout({ header }) { return <div>{header}</div>; }
function Header({ avatar }) { return <nav>{avatar}</nav>; }
```

> **Interview Tip:** Mention component composition first — it's often the cleanest solution and shows senior-level thinking. Context is the second tool, libraries third.

---

### Q14. Compare Redux Toolkit, Zustand, and Context API for state management.

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

| Dimension | Context API | Zustand | Redux Toolkit |
|---|---|---|---|
| Boilerplate | Low | Very low | Medium |
| Re-renders | All consumers | Selective (subscriptions) | Selective (selectors) |
| DevTools | No | Yes (middleware) | Yes (first-class) |
| Async | Manual (useEffect) | Simple (actions) | RTK Query built-in |
| Best for | Infrequent global state | Simple–medium apps | Large, complex apps |

```jsx
// Zustand — minimal boilerplate
import { create } from 'zustand';

const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set(state => ({ items: [...state.items, item] })),
  removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),
  total: 0,
}));

function Cart() {
  const { items, removeItem } = useCartStore(); // only re-renders when items/removeItem change
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
```

> **Interview Tip:** Know which to reach for: Context for theme/auth, Zustand for most app state, Redux Toolkit for large teams needing strict patterns and time-travel debugging.

---

### Q15. What is Redux Toolkit and how does it improve classic Redux?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Redux Toolkit (RTK) is the official, opinionated way to write Redux. It eliminates the classic complaints:

| Classic Redux | Redux Toolkit |
|---|---|
| Verbose action types + creators | `createSlice` generates them |
| Spread operators everywhere | Immer lets you write mutating code |
| Async requires thunk boilerplate | `createAsyncThunk` wraps it |
| API state (loading/error) manual | RTK Query handles it |

```jsx
// createSlice — replaces action types, action creators, and reducer
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk('user/fetch', async (id) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, status: 'idle', error: null },
  reducers: {
    clearUser: (state) => { state.data = null; }, // Immer — direct mutation ok
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
```

> **Interview Tip:** Highlight Immer integration — it looks like mutation but produces immutable updates. RTK Query is a bonus mention: it auto-generates hooks, handles caching, and deduplicate requests.

---

### Q16. What is the Context + useReducer pattern and when is it appropriate?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Combining `useContext` with `useReducer` gives you a Redux-like pattern without a library. A common structure:

```jsx
// 1. Create contexts (separate state from dispatch to prevent re-renders)
const StateContext = createContext();
const DispatchContext = createContext();

// 2. Reducer
function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.payload };
    case 'LOGOUT':   return { ...state, user: null, token: null };
    default: throw new Error(`Unknown: ${action.type}`);
  }
}

// 3. Provider component
function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { user: null, token: null });

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// 4. Custom hooks for consumption
const useAppState = () => useContext(StateContext);
const useAppDispatch = () => useContext(DispatchContext);

// 5. Usage
function Profile() {
  const { user } = useAppState();           // re-renders when state changes
  const dispatch = useAppDispatch();         // stable — dispatch never changes

  return <button onClick={() => dispatch({ type: 'LOGOUT' })}>Logout</button>;
}
```

**Use when:** Medium-complexity apps that want centralized state without adding a library.

> **Interview Tip:** Separating state and dispatch contexts is a key optimization — components that only dispatch don't re-render when state changes, since `dispatch` is stable.

---

### Q17. What is Jotai / Recoil's atom-based model and why is it different?

**🟡 MEDIUM** | **💡 RARE**

#### Concept

Atom-based state managers (Jotai, Recoil) store state in individual atoms — small, independent pieces of state. Components subscribe to only the atoms they need.

```jsx
// Jotai
import { atom, useAtom } from 'jotai';

const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2); // derived atom

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

function Double() {
  const [double] = useAtom(doubleAtom); // re-renders only when countAtom changes
  return <p>Double: {double}</p>;
}
```

**Key advantage over Context:** Fine-grained subscriptions — each component only re-renders when its specific atoms change.

> **Interview Tip:** Contrast atoms with Redux's single store — atoms are more granular and colocated, but can be harder to track in large apps. Jotai is simpler than Recoil (no `RecoilRoot` needed).

---

### Q18. How does React Query / TanStack Query manage server state?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

Server state (remote data from APIs) has different characteristics than UI state: it's async, can be stale, can be shared across components, and needs cache invalidation. TanStack Query manages this automatically.

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetching — automatic caching, background refetch, loading/error states
function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],          // cache key
    queryFn: () => fetch('/api/users').then(r => r.json()),
    staleTime: 5 * 60 * 1000,    // consider fresh for 5 minutes
  });

  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Mutation — optimistic updates + cache invalidation
function AddUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (user) => fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
    }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] }); // refetch list
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: 'Bob' })}>
      {mutation.isPending ? 'Adding...' : 'Add User'}
    </button>
  );
}
```

> **Interview Tip:** Frame it as: "React Query separates server state from client state." Many apps use both — TanStack Query for async data, Zustand/Context for UI state (modal open, selected tab, etc.).

---

### Q19. What is state colocation and why does it matter?

**🟢 EASY** | **📌 COMMON**

#### Concept

State colocation means keeping state as close as possible to where it's used. This is Dan Abramov's "state should live as close to its consumers as possible" principle.

```jsx
// Bad — global state for something local
function App() {
  const [isOpen, setIsOpen] = useState(false); // only used by Modal!

  return (
    <>
      <Header />
      <Main />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <button onClick={() => setIsOpen(true)}>Open</button>
    </>
  );
}

// Good — colocated
function ModalTrigger() {
  const [isOpen, setIsOpen] = useState(false); // lives where it's used

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

**Benefits:**
- Fewer re-renders (state changes only affect the local subtree)
- Easier to understand and delete
- Components are more self-contained

> **Interview Tip:** "Lift state up only when needed, push it down as far as possible." This is the counterpoint to the common mistake of putting everything in global state.

---

### Q20. What is the difference between controlled and uncontrolled components?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

| | Controlled | Uncontrolled |
|---|---|---|
| Source of truth | React state | DOM |
| Read value via | `state` | `ref.current.value` |
| Validation | On every keystroke | On submit |
| Integration | Easy with React | Closer to plain HTML |

```jsx
// Controlled — React owns the value
function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}                         // React controls what's displayed
      onChange={e => setValue(e.target.value)} // update state on every keystroke
    />
  );
}

// Uncontrolled — DOM owns the value
function UncontrolledInput() {
  const ref = useRef(null);

  const handleSubmit = () => {
    console.log(ref.current.value); // read only when needed
  };

  return (
    <>
      <input ref={ref} defaultValue="" />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```

> **Interview Tip:** Libraries like React Hook Form use uncontrolled inputs by default for performance (no re-render on keystroke). Controlled is the React-idiomatic approach for most cases.

---

## 3. Component Patterns

---

### Q21. What is the compound component pattern?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Compound components are a group of components that share implicit state and work together to form a complete UI. The parent manages state; children are slotted in via JSX.

```jsx
// Implementation using Context
const TabsContext = createContext();

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabList({ children }) {
  return <div role="tablist">{children}</div>;
};

Tabs.Tab = function Tab({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={activeTab === value}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === value ? <div role="tabpanel">{children}</div> : null;
};

// Usage — clean, readable, no prop passing
function App() {
  return (
    <Tabs defaultTab="react">
      <Tabs.List>
        <Tabs.Tab value="react">React</Tabs.Tab>
        <Tabs.Tab value="vue">Vue</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="react"><ReactDocs /></Tabs.Panel>
      <Tabs.Panel value="vue"><VueDocs /></Tabs.Panel>
    </Tabs>
  );
}
```

> **Interview Tip:** Libraries like Radix UI and Headless UI are built on this pattern. The key insight: the parent provides state, children consume it via context — no explicit prop passing.

---

### Q22. What is the render props pattern?

**🟡 MEDIUM** | **💡 RARE**

#### Concept

A render prop is a function prop that a component uses to know what to render. It shares code between components without HOCs.

```jsx
// MouseTracker exposes position via render prop
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}
      style={{ height: '100vh' }}
    >
      {render(pos)} {/* consumer controls what's rendered */}
    </div>
  );
}

// Usage
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <p>Mouse: {x}, {y}</p>
      )}
    />
  );
}
```

**Modern equivalent — custom hook:**
```jsx
function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  // attach listener ...
  return pos;
}
```

> **Interview Tip:** Render props are largely superseded by custom hooks for logic sharing. But you'll encounter them in older codebases and in some component APIs (like React Router's `<Route render={...}>` in v5). Worth knowing the pattern.

---

### Q23. What is a Higher-Order Component (HOC)?

**🟡 MEDIUM** | **💡 RARE**

#### Concept

A HOC is a function that takes a component and returns a new enhanced component. Pattern: `withX(Component)`.

```jsx
// HOC that adds loading/error state for any component
function withAsync(WrappedComponent) {
  return function WithAsync({ isLoading, error, ...props }) {
    if (isLoading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    return <WrappedComponent {...props} />;
  };
}

// Usage
const UserListWithAsync = withAsync(UserList);

function App() {
  const { data, isLoading, error } = useFetch('/api/users');
  return <UserListWithAsync users={data} isLoading={isLoading} error={error} />;
}
```

#### HOC problems
- **Prop collision** — HOC and wrapped component may use same prop names
- **DevTools noise** — extra wrapper components in tree
- **Static composition** — can't change HOC behavior at runtime

> **Interview Tip:** HOCs are largely replaced by hooks and custom hooks. But they're still used in libraries like `connect()` (Redux), `withRouter` (React Router v5), and for cross-cutting concerns like auth guards.

---

### Q24. What is the Provider pattern and how does it relate to dependency injection?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

The Provider pattern uses Context to inject dependencies (services, config, callbacks) into a component tree — avoiding tight coupling to global singletons.

```jsx
// Define an interface (via context)
const ApiContext = createContext(null);

// Provide real implementation in production
function App() {
  const api = useMemo(() => new ApiClient({ baseUrl: '/api' }), []);
  return (
    <ApiContext.Provider value={api}>
      <Router />
    </ApiContext.Provider>
  );
}

// Provide mock in tests
function renderWithMocks(ui) {
  const mockApi = { getUser: jest.fn().mockResolvedValue({ id: 1 }) };
  return render(
    <ApiContext.Provider value={mockApi}>{ui}</ApiContext.Provider>
  );
}

// Consumer — doesn't know or care about the implementation
function UserProfile({ id }) {
  const api = useContext(ApiContext);
  const { data } = useFetch(() => api.getUser(id), [id]);
  return <div>{data?.name}</div>;
}
```

> **Interview Tip:** This pattern makes components testable without module mocking. It's the React equivalent of constructor injection in OOP. Production uses real services; tests swap in mocks via context.

---

### Q25. What is React.memo and when should you use it?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

`React.memo` is a higher-order component that memoizes a component's render output. The component only re-renders if its props change (shallow comparison by default).

```jsx
// Without memo — re-renders whenever Parent re-renders
function ExpensiveChild({ items }) {
  console.log('Rendered!');
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}

// With memo — skips re-render if items reference is same
const ExpensiveChild = React.memo(function ExpensiveChild({ items }) {
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
});

// Custom comparison for complex objects
const PriceDisplay = React.memo(
  function PriceDisplay({ product }) {
    return <span>{product.price}</span>;
  },
  (prev, next) => prev.product.price === next.product.price // custom comparator
);
```

**Memo is only effective when:**
1. The component renders frequently
2. It re-renders with the same props often
3. Props comparison is cheaper than re-rendering

> **Interview Tip:** `React.memo` checks props shallowly — if you pass a new object or function on each render, memo won't help. Pair with `useMemo`/`useCallback` to stabilize props being passed to memoized children.

---

### Q26. What is the container/presentational pattern?

**🟢 EASY** | **📌 COMMON**

#### Concept

Split components into:
- **Container** (smart) — handles data fetching, state, and business logic
- **Presentational** (dumb) — renders UI based purely on props, no side effects

```jsx
// Presentational — pure UI, easily testable and reusable
function UserCard({ user, onFollow, isFollowing }) {
  return (
    <div className="card">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <button onClick={onFollow}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}

// Container — handles data and logic
function UserCardContainer({ userId }) {
  const { data: user } = useQuery(['user', userId], () => fetchUser(userId));
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    await followUser(userId);
    setIsFollowing(true);
  };

  if (!user) return <Skeleton />;
  return <UserCard user={user} onFollow={handleFollow} isFollowing={isFollowing} />;
}
```

> **Interview Tip:** With hooks, this pattern is less strict — custom hooks can extract the "container" logic. But the separation of concerns is still valuable for testing (presentational components are pure functions of props).

---

## 4. Performance

---

### Q27. How does React's reconciliation and diffing algorithm work?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

When state/props change, React creates a new virtual DOM tree and **diffs** it against the previous one to compute the minimal set of DOM updates.

**React's diffing heuristics (O(n) instead of O(n³)):**

1. **Different element types** → tear down old tree, build new one
2. **Same element type** → update attributes, recurse on children
3. **Lists with keys** → match nodes by key, not position

```jsx
// Without keys — React diffs by position
// [A, B, C] → [X, A, B, C]: React updates A→X, B→A, C→B, inserts C — 3 updates!
<ul>
  {items.map(item => <li>{item.name}</li>)}
</ul>

// With stable keys — React matches by identity
// [A, B, C] → [X, A, B, C]: React inserts X, moves others — 1 insert!
<ul>
  {items.map(item => <li key={item.id}>{item.name}</li>)}
</ul>
```

**Why index as key causes bugs:**
```jsx
// Filtered list — index shifts cause wrong components to reuse state
items.filter(Boolean).map((item, index) => (
  <Input key={index} defaultValue={item.value} />
  // After filtering, index 0 may point to a different item
  // but Input reuses the old state from position 0
))
```

> **Interview Tip:** React Fiber (introduced in React 16) reimplemented reconciliation to be interruptible. Concurrent Mode (React 18) uses this to pause, resume, and prioritize renders.

---

### Q28. What is React.lazy and Suspense? How do they enable code splitting?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

`React.lazy` dynamically imports a component, and `Suspense` renders a fallback until the import resolves. Together they enable **route-level code splitting** — users only download code for the current page.

```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Component is loaded only when route is visited
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

**Named exports require a wrapper:**
```jsx
// Named export — lazy expects default export
const { UserDashboard } = await import('./Dashboard');

// Wrap it
const UserDashboard = lazy(() =>
  import('./Dashboard').then(m => ({ default: m.UserDashboard }))
);
```

> **Interview Tip:** Mention that Suspense is expanding beyond lazy loading — React 18 uses it for data fetching too (via `use` hook and TanStack Query's experimental Suspense mode).

---

### Q29. What is the React Profiler and how do you use it to find performance issues?

**🟡 MEDIUM** | **💡 RARE**

#### Concept

React DevTools Profiler records render information for each component — what rendered, why, and how long it took.

**Programmatic Profiler component:**
```jsx
function onRenderCallback(
  id,           // component name
  phase,        // 'mount' or 'update'
  actualDuration, // time spent rendering
  baseDuration,   // estimated time without memoization
  startTime,
  commitTime
) {
  if (actualDuration > 16) { // > 1 frame at 60fps
    console.warn(`Slow render: ${id} took ${actualDuration}ms`);
  }
}

function App() {
  return (
    <Profiler id="Dashboard" onRender={onRenderCallback}>
      <Dashboard />
    </Profiler>
  );
}
```

**Common findings and fixes:**

| Finding | Fix |
|---|---|
| Component renders on every parent render | `React.memo` + stable props |
| Large list re-renders all items | `React.memo` on list item + `useCallback` for handlers |
| Expensive computation on every render | `useMemo` |
| Context causes too many re-renders | Split context; use Zustand |

> **Interview Tip:** Mention the "why did this render?" feature in React DevTools — it shows which prop or state change triggered each render. This is faster than adding console.logs.

---

### Q30. What is virtualization and when do you need it?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Virtualization (windowing) renders only the visible items in a long list — not all items in the DOM. It's essential for lists with hundreds or thousands of items.

```jsx
// Without virtualization — 10,000 DOM nodes
function SlowList({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}

// With TanStack Virtual
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // estimated row height in px
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: virtualRow.start,
              height: virtualRow.size,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

> **Interview Tip:** Rule of thumb — virtualize when rendering more than 100–200 items. Libraries: `react-window` (smaller, simpler), `react-virtual` / `@tanstack/react-virtual` (more features, variable heights).

---

### Q31. What is concurrent rendering in React 18?

**🔴 HARD** | **📌 COMMON**

#### Concept

Concurrent rendering lets React **interrupt, pause, resume, and abandon renders** — unlike the old synchronous model where React had to finish a render completely before updating the DOM.

**Key APIs:**

```jsx
import { startTransition, useTransition, useDeferredValue } from 'react';

// useTransition — mark state update as non-urgent
function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e) {
    setQuery(e.target.value); // urgent: update input immediately

    startTransition(() => {
      setResults(filterResults(e.target.value)); // non-urgent: can be interrupted
    });
  }

  return (
    <>
      <input value={query} onChange={handleSearch} />
      {isPending ? <Spinner /> : <ResultsList results={results} />}
    </>
  );
}

// useDeferredValue — defer expensive derived value
function App({ query }) {
  const deferredQuery = useDeferredValue(query); // lags behind if busy
  return <SlowList query={deferredQuery} />;
}
```

> **Interview Tip:** The key insight: concurrent mode doesn't make React faster — it makes it more **responsive** by ensuring urgent updates (input, clicks) are never blocked by slow renders. It's about prioritization, not parallelism.

---

### Q32. Explain the key prop — when should and shouldn't you use the array index as key?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

React uses `key` to match elements across renders. A stable, unique key lets React reuse DOM nodes and component state correctly.

**Use index as key only when:**
- The list never reorders, filters, or has items added/removed in the middle
- Items have no stateful UI (inputs, checkboxes)
- You have no stable ID

```jsx
// Safe — static, no reorder, no stateful items
const TABS = ['React', 'Vue', 'Angular'];
<ul>{TABS.map((t, i) => <li key={i}>{t}</li>)}</ul>

// Dangerous — list can reorder AND items have state
function TodoList({ todos }) {
  return todos.map((todo, index) => (
    <li key={index}>
      <input defaultValue={todo.text} /> {/* BUG: state stays at index 0 */}
    </li>
  ));
}

// Correct — stable ID from data
function TodoList({ todos }) {
  return todos.map(todo => (
    <li key={todo.id}>
      <input defaultValue={todo.text} />
    </li>
  ));
}
```

> **Interview Tip:** The canonical bug: delete the first item from a list keyed by index. Each remaining item shifts up by one index, but React reuses the component instances — including their local state. State is now attached to the wrong item.

---

## 5. Router

---

### Q33. How does React Router v6 work? Explain the key components.

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

React Router v6 is declarative — routes are expressed as JSX inside a `<Routes>` component. Route matching uses the best-match algorithm (not first-match).

```jsx
import { BrowserRouter, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Nested routes — Layout renders <Outlet /> */}
        <Route path="/users" element={<UsersLayout />}>
          <Route index element={<UserList />} />             {/* /users */}
          <Route path=":id" element={<UserDetail />} />      {/* /users/123 */}
          <Route path=":id/edit" element={<UserEdit />} />   {/* /users/123/edit */}
        </Route>

        {/* Protected route */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminPanel /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Layout component uses Outlet to render child routes
function UsersLayout() {
  return (
    <div>
      <UsersSidebar />
      <main><Outlet /></main> {/* child route renders here */}
    </div>
  );
}
```

> **Interview Tip:** Key v6 changes from v5: `<Switch>` → `<Routes>`, `component=` → `element=`, relative paths by default, and nested routes via `<Outlet>`. Know `useNavigate`, `useParams`, `useSearchParams`, and `useLocation` hooks.

---

### Q34. How do you handle protected routes in React Router?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Create a `ProtectedRoute` wrapper that redirects unauthenticated users.

```jsx
import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ children }) {
  const { user } = useAuth(); // your auth context
  const location = useLocation();

  if (!user) {
    // Redirect to login but remember where they were going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Layout-based protection (more elegant with nested routes)
function AuthLayout() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}

// Route config
<Routes>
  <Route path="/login" element={<Login />} />

  {/* All routes inside are protected */}
  <Route element={<AuthLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/settings" element={<Settings />} />
  </Route>
</Routes>

// Login page — redirect back to original destination
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (credentials) => {
    await authService.login(credentials);
    navigate(from, { replace: true }); // go back to original page
  };
}
```

> **Interview Tip:** Using the layout route pattern (element with `<Outlet>`) is cleaner than wrapping each individual route. Mention `replace` on Navigate to avoid polluting browser history.

---

### Q35. What is the difference between BrowserRouter and HashRouter?

**🟢 EASY** | **📌 COMMON**

#### Concept

| | BrowserRouter | HashRouter |
|---|---|---|
| URL format | `/users/123` | `/#/users/123` |
| Server setup | Needs server config | No server config needed |
| SEO | Crawlable by default | Poor (hash not crawled) |
| Bookmark support | Full | Full |
| Use case | Modern apps with server control | Static file hosting (GitHub Pages, S3) |

```jsx
// BrowserRouter — requires server to return index.html for all paths
// nginx: try_files $uri $uri/ /index.html;
import { BrowserRouter } from 'react-router-dom';

// HashRouter — works with any static file server
import { HashRouter } from 'react-router-dom';
```

**MemoryRouter** — stores history in memory (no URL bar), used in React Native and testing:
```jsx
import { MemoryRouter } from 'react-router-dom';
// Testing
render(<MemoryRouter initialEntries={['/profile']}><App /></MemoryRouter>);
```

> **Interview Tip:** For a production SPA on a CDN, you need either HashRouter or a rewrite rule. Interviewers ask this to test if you understand the server-side implication of client-side routing.

---

### Q36. How do you implement code-split routing with React Router?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Combine `React.lazy` with route-level `Suspense` for route-based code splitting. Each page becomes its own JS chunk.

```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Each import() creates a separate chunk
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

// Optionally — named chunks for better debugging
const Settings = lazy(() =>
  import(/* webpackChunkName: "settings" */ './pages/Settings')
);

function App() {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/settings/*" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

**Preloading on hover:**
```jsx
// Improve perceived performance — start loading chunk before click
function NavLink({ to, page, children }) {
  const handleMouseEnter = () => {
    // Trigger import before user clicks
    import(`./pages/${page}`);
  };

  return <Link to={to} onMouseEnter={handleMouseEnter}>{children}</Link>;
}
```

> **Interview Tip:** Route-level splitting is the single highest-impact optimization for most SPAs. Mention that `vite` and `webpack` both handle `import()` automatically. In Next.js, pages are split by default.

---

## 6. Forms

---

### Q37. What is React Hook Form and why is it preferred over Formik?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

React Hook Form (RHF) uses **uncontrolled inputs** — it reads values from the DOM directly instead of storing them in state. This means **zero re-renders on keystroke** by default.

```jsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    await authService.login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register('password')} type="password" />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

| | Formik | React Hook Form |
|---|---|---|
| Re-renders on keystroke | Yes | No (uncontrolled) |
| Bundle size | ~15KB | ~9KB |
| Validation | Yup/Zod | Zod/Yup/any |
| Performance | Good | Better |

> **Interview Tip:** The key selling point is performance. In a form with 20 fields, Formik re-renders the entire form on every keystroke. RHF renders only the field and its error message.

---

### Q38. How do you handle form validation in React?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Three main approaches:

**1. HTML5 native validation** — simplest, limited:
```jsx
<input required minLength={8} type="email" />
```

**2. Manual validation** — full control, verbose:
```jsx
const [errors, setErrors] = useState({});

function validate(values) {
  const errs = {};
  if (!values.email) errs.email = 'Required';
  else if (!/\S+@\S+\.\S+/.test(values.email)) errs.email = 'Invalid email';
  if (!values.password) errs.password = 'Required';
  else if (values.password.length < 8) errs.password = 'Min 8 chars';
  return errs;
}
```

**3. Schema validation with Zod (recommended):**
```jsx
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18, 'Must be 18+'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Parse — throws on invalid
const result = schema.safeParse(formData);
if (!result.success) {
  console.log(result.error.flatten().fieldErrors);
  // { email: ['Invalid email'], age: ['Must be 18+'] }
}
```

> **Interview Tip:** Zod is TypeScript-first and shares schemas between frontend validation and backend API validation (with tRPC or Zod-validated Express routes) — write once, validate everywhere.

---

### Q39. How do you handle dynamic form fields (add/remove rows)?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Use React Hook Form's `useFieldArray` for dynamic field arrays with proper key management.

```jsx
import { useForm, useFieldArray } from 'react-hook-form';

function InvoiceForm() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      lineItems: [{ description: '', quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'lineItems',
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      {fields.map((field, index) => (
        <div key={field.id}> {/* field.id is stable — don't use index as key */}
          <input
            {...register(`lineItems.${index}.description`)}
            placeholder="Description"
          />
          <input
            {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
            type="number"
          />
          <input
            {...register(`lineItems.${index}.price`, { valueAsNumber: true })}
            type="number"
          />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}

      <button type="button" onClick={() => append({ description: '', quantity: 1, price: 0 })}>
        Add Line Item
      </button>
      <button type="submit">Submit Invoice</button>
    </form>
  );
}
```

> **Interview Tip:** `useFieldArray` provides a stable `field.id` for each item — always use this as the `key`, never the array index. The id persists even when you reorder or remove items.

---

### Q40. How do you integrate a custom UI component (e.g., a date picker) with React Hook Form?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Use `Controller` to wrap components that don't expose a standard `ref` / `onChange` API.

```jsx
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';

function EventForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="eventDate"
        control={control}
        rules={{ required: 'Date is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <DatePicker
              selected={value}
              onChange={onChange} // RHF's onChange
              dateFormat="yyyy-MM-dd"
            />
            {error && <p>{error.message}</p>}
          </>
        )}
      />
      <button type="submit">Create Event</button>
    </form>
  );
}
```

`Controller` bridges the gap between RHF's ref-based approach and controlled components that use `value`/`onChange` props.

> **Interview Tip:** Most third-party inputs (Select, DatePicker, Slider, rich text editors) need `Controller`. The `register` approach works for native HTML inputs that expose a `ref`.

---

## 7. Testing

---

### Q41. How do you test React components with React Testing Library?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

React Testing Library (RTL) tests components from the **user's perspective** — querying by accessible roles, labels, and text rather than CSS classes or component internals.

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('submits with valid credentials', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    // Query by label — accessible queries
    await user.type(screen.getByLabelText('Email'), 'alice@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'alice@example.com',
        password: 'password123',
      });
    });
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

**Query priority (RTL recommends):**
1. `getByRole` — most accessible, reflects what screen readers see
2. `getByLabelText` — great for form inputs
3. `getByPlaceholderText` — use sparingly
4. `getByText` — for non-interactive elements
5. `getByTestId` — last resort (doesn't reflect user experience)

> **Interview Tip:** The RTL philosophy is "test behavior, not implementation." If your test breaks when you rename a CSS class but the UI still works, the test was wrong. If it breaks when the button disappears, that's a good test.

---

### Q42. How do you mock API calls in tests?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Two main approaches: `jest.fn()` for unit mocking, and MSW (Mock Service Worker) for integration-level mocking.

```jsx
// Approach 1 — Mock the module
jest.mock('../api/users', () => ({
  fetchUsers: jest.fn().mockResolvedValue([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]),
}));

// Approach 2 — MSW (preferred for integration tests)
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([{ id: 1, name: 'Alice' }]);
  }),
  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 2, ...body }, { status: 201 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders user list from API', async () => {
  render(<UserList />);
  expect(await screen.findByText('Alice')).toBeInTheDocument();
});

test('handles API error', async () => {
  server.use(
    http.get('/api/users', () => HttpResponse.error())
  );

  render(<UserList />);
  expect(await screen.findByText(/error loading users/i)).toBeInTheDocument();
});
```

> **Interview Tip:** MSW intercepts at the network level — your component uses the real `fetch`, which is closer to production behavior than mocking modules. It works in both Node (tests) and browser (development).

---

### Q43. How do you test custom hooks?

**🟡 MEDIUM** | **💡 RARE**

#### Concept

Use `@testing-library/react`'s `renderHook` utility to test hooks in isolation.

```jsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('starts with the initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('increments the count', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => { result.current.increment(); });
    act(() => { result.current.reset(); });

    expect(result.current.count).toBe(5);
  });
});

// Testing hooks that need providers
const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

const { result } = renderHook(() => useUsers(), { wrapper });
```

> **Interview Tip:** `act()` is required for state updates in tests — it flushes React's state queue. If you get "not wrapped in act(...)" warnings, wrap your state-changing calls.

---

## 8. Error Handling

---

### Q44. What are Error Boundaries and how do you implement them?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

Error Boundaries catch JavaScript errors in child components during render, in lifecycle methods, and in constructors. They must be **class components** (hooks can't catch render errors).

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI on next render
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error monitoring service
    errorService.report(error, {
      componentStack: errorInfo.componentStack,
      userId: this.props.userId,
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div>
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage — granular boundaries for partial failure
function App() {
  return (
    <ErrorBoundary fallback={<p>App crashed</p>}>
      <Header />
      <ErrorBoundary fallback={<p>Feed failed to load</p>}>
        <NewsFeed />
      </ErrorBoundary>
      <ErrorBoundary fallback={<p>Sidebar failed</p>}>
        <Sidebar />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}
```

**What error boundaries do NOT catch:**
- Async errors (event handlers, `setTimeout`)
- Server-side errors
- Errors in the boundary itself

> **Interview Tip:** Use the `react-error-boundary` library for a functional wrapper with reset callbacks. Mention that granular boundaries prevent a single component failure from taking down the whole page.

---

### Q45. How do you handle async errors in React?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Error boundaries only catch render-phase errors. Async errors need to be caught and stored in state.

```jsx
function UserProfile({ id }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const data = await fetchUser(id);
        if (!cancelled) setUser(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadUser();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => setError(null)} />;
  return <ProfileCard user={user} />;
}

// With TanStack Query — much cleaner
function UserProfile({ id }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;
  return <ProfileCard user={data} />;
}
```

> **Interview Tip:** TanStack Query makes async error handling declarative. For event handlers, wrap async operations in try/catch and store errors in state or surface them via toast notifications.

---

### Q46. How do you handle errors globally in a React app?

**🔴 HARD** | **💡 RARE**

#### Concept

A multi-layer error handling strategy:

```jsx
// Layer 1 — Error boundary for render errors
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Layer 2 — Global unhandled promise rejection
window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  errorService.report(event.reason);
  showToast('An unexpected error occurred');
});

// Layer 3 — Global JS error
window.addEventListener('error', (event) => {
  errorService.report(event.error);
});

// Layer 4 — API error interceptor (axios example)
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authStore.logout();
      navigate('/login');
    } else if (error.response?.status >= 500) {
      showToast('Server error — please try again');
      errorService.report(error);
    }
    return Promise.reject(error);
  }
);

// Layer 5 — React Query global error handler
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        if (error.status !== 404) {
          showToast(error.message);
        }
      },
    },
  },
});
```

> **Interview Tip:** Mention Sentry or similar for error monitoring. The key architectural point: don't let unhandled errors silently fail — every layer should either handle, log, or surface the error to the user.

---

## 9. Server-Side Rendering

---

### Q47. What is the difference between SSR, SSG, and CSR?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

| | CSR | SSR | SSG |
|---|---|---|---|
| HTML generated | Client (browser) | Server (on request) | Build time |
| First meaningful paint | Slow | Fast | Fastest |
| Dynamic data | Yes | Yes (fresh) | Partial (ISR) |
| SEO | Poor by default | Excellent | Excellent |
| Server cost | Low | Higher | Very low |
| Use case | Dashboards, apps | News, e-commerce | Blogs, docs |

```
CSR Flow:
Browser → blank HTML + JS bundle → React renders → User sees content
         ↑ TTFB fast, FCP slow

SSR Flow:
Browser → Server runs React → sends filled HTML → React hydrates
         ↑ TTFB slower, FCP fast, interactive after hydration

SSG Flow:
Browser → CDN serves pre-rendered HTML → React hydrates
         ↑ TTFB fastest, FCP fastest
```

> **Interview Tip:** Explain the hydration step — after SSR/SSG sends HTML, React must "hydrate" it by attaching event listeners. Until hydration completes, the page looks interactive but clicks may not respond.

---

### Q48. What is hydration and what problems can cause hydration errors?

**🔴 HARD** | **📌 COMMON**

#### Concept

Hydration is the process where React takes server-rendered HTML and attaches React's event system to it, making it interactive. React expects the client-rendered output to **exactly match** the server HTML.

```jsx
// Hydration mismatch examples:

// 1. Date/time — different on server vs client
function Timestamp() {
  return <span>{new Date().toLocaleTimeString()}</span>; // mismatch!
}
// Fix: useEffect for client-only rendering
function Timestamp() {
  const [time, setTime] = useState('');
  useEffect(() => { setTime(new Date().toLocaleTimeString()); }, []);
  return <span>{time}</span>;
}

// 2. Random IDs — Math.random() differs between server and client
const id = Math.random(); // mismatch!
// Fix: useId() — deterministic, SSR-safe

// 3. Browser-only APIs
function WindowSize() {
  const width = typeof window !== 'undefined' ? window.innerWidth : 0;
  return <p>{width}</p>; // 0 on server, actual value on client → mismatch!
}
// Fix: read window only in useEffect

// 4. Suppress for intentional mismatches (use sparingly)
<time suppressHydrationWarning dateTime={serverDate}>
  {clientFormattedDate}
</time>
```

> **Interview Tip:** Hydration errors are surfaced in React 18 with clear messages. The root cause is always code that produces different output on server vs client — usually browser APIs, random values, or timezone-dependent formatting.

---

### Q49. How does Next.js handle SSR and what are its rendering strategies?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

Next.js (App Router) provides multiple rendering strategies per page:

```tsx
// 1. Server Component (default) — renders on server, zero JS to client
// app/users/page.tsx
async function UsersPage() {
  const users = await fetchUsers(); // server-side fetch, no useEffect needed
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// 2. Client Component — opt-in for interactivity
'use client';
function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(l => !l)}>{liked ? '❤️' : '🤍'}</button>;
}

// 3. Static generation — generateStaticParams for dynamic routes
export async function generateStaticParams() {
  const posts = await fetchAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// 4. ISR — revalidate cached pages after N seconds
export const revalidate = 60; // revalidate every 60 seconds

// 5. Dynamic rendering — no-store opts out of caching
async function LiveDashboard() {
  const data = await fetch('/api/live', { cache: 'no-store' }); // fresh every request
  return <Dashboard data={await data.json()} />;
}
```

> **Interview Tip:** The App Router's key mental model: Server Components are the default, Client Components are the exception. Push interactivity to the leaves — fetch data high in the tree as a Server Component, pass it down to small Client Components for interactions.

---

### Q50. What is the difference between React Server Components and traditional SSR?

**🔴 HARD** | **📌 COMMON**

#### Concept

| | Traditional SSR | React Server Components |
|---|---|---|
| Rendered where | Server per request | Server, never sent to client |
| JS shipped to browser | Full component JS | Zero JS for server components |
| Re-renders | Client-side after hydration | Server only (on navigation) |
| Access to server resources | Via API routes | Direct (DB, filesystem) |
| State/hooks | After hydration | Not supported |

```tsx
// Server Component — runs only on server
// Can directly access DB, no client JS shipped
async function UserProfile({ id }) {
  const user = await db.users.findById(id); // direct DB access!
  const posts = await db.posts.findByUserId(id);

  return (
    <div>
      <h1>{user.name}</h1>
      <PostList posts={posts} /> {/* also a server component */}
      <FollowButton userId={id} /> {/* client component — needs onClick */}
    </div>
  );
}

// Client Component — interactive island
'use client';
function FollowButton({ userId }) {
  const [following, setFollowing] = useState(false);

  return (
    <button onClick={async () => {
      await followUser(userId);
      setFollowing(true);
    }}>
      {following ? 'Following' : 'Follow'}
    </button>
  );
}
```

**The key difference:** Traditional SSR renders to HTML on the server but ships the full component code to the client for hydration. RSC never ships server component code to the client at all — only the rendered output is sent, drastically reducing JS bundle size.

> **Interview Tip:** RSC is the biggest architectural shift in React since hooks. The mental model: server components are like PHP/Rails templates that can compose with client components for interactivity. It's not replacing SSR — it's a new layer that works alongside it.

---

*End of React Interview Guide — 50 Questions*
