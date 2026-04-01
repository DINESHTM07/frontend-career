# 11 — State Management

---

## PROP DRILLING PROBLEM

### CONCEPT
Prop drilling occurs when data must be passed through multiple intermediate components that don't use it — just to reach a deeply nested child.

### WHY IT MATTERS
- Every intermediate component becomes coupled to data it doesn't own
- Refactoring one component forces changes across the entire tree
- Components lose reusability because they carry props they never use
- 3+ levels of drilling is a strong signal to reach for a state solution

### EXAMPLES

**Example 1 — Classic drilling chain**
```jsx
// BAD: user passed through 3 layers that don't care about it
function App() {
  const [user, setUser] = useState({ name: 'Alice', role: 'admin' });
  return <Dashboard user={user} />;
}
function Dashboard({ user }) {          // doesn't use user
  return <Sidebar user={user} />;
}
function Sidebar({ user }) {            // doesn't use user
  return <UserAvatar user={user} />;
}
function UserAvatar({ user }) {         // finally uses it
  return <img src={user.avatar} alt={user.name} />;
}

// Problem: rename the prop → edit 4 files.
// Add another field → edit 4 files.
```

**Example 2 — Component composition as an alternative**
```jsx
// Sometimes you can avoid drilling without any state library.
// Pass the consuming component as children instead of its data.
function App() {
  const [user, setUser] = useState({ name: 'Alice', avatar: '/a.png' });
  return (
    <Dashboard>
      <Sidebar>
        <UserAvatar user={user} />   {/* user passed directly to its owner */}
      </Sidebar>
    </Dashboard>
  );
}
function Dashboard({ children }) { return <div>{children}</div>; }
function Sidebar({ children })   { return <aside>{children}</aside>; }
```

### COMMON MISTAKES
- Using Context to fix drilling for *frequently changing* state (causes re-renders everywhere)
- Passing entire objects when only one field is needed (`user` vs `user.name`)

### INTERVIEW TIP
"Prop drilling isn't always wrong — for 1-2 levels it's fine and explicit. Context and global state add indirection. I reach for them only when drilling spans 3+ layers or the data is truly global."

---

## CONTEXT API — GLOBAL STATE

### CONCEPT
React's built-in way to share values across the component tree without passing props. Best for low-frequency updates: theme, locale, authenticated user.

### WHY IT MATTERS
- Zero dependencies — built into React
- Eliminates prop drilling for truly global data
- Poor fit for high-frequency state: **every consumer re-renders when the value changes**, with no selector optimization

### EXAMPLES

**Example 3 — Creating and providing context (full pattern)**
```jsx
// ThemeContext.jsx
import { createContext, useContext, useState, useMemo } from 'react';

const ThemeContext = createContext(null); // null = no default; forces explicit provider

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  // Memoize value object — without this, a new object is created every render,
  // triggering re-renders in all consumers even when nothing changed.
  const value = useMemo(() => ({ theme, toggle }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook — encapsulates context access + guards against missing provider
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
```

**Example 4 — Consuming context anywhere in the tree**
```jsx
function Header() {
  const { theme, toggle } = useTheme();  // no props needed, no drilling
  return (
    <header className={theme}>
      <button onClick={toggle}>Toggle theme</button>
    </header>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
    </ThemeProvider>
  );
}
```

**Example 5 — Splitting contexts to prevent unnecessary re-renders**
```jsx
// BAD: one context — changing `theme` re-renders all users of `user` too
const AppContext = createContext({ user: null, theme: 'light' });

// GOOD: separate contexts — components subscribe only to what they need
const UserContext  = createContext(null);
const ThemeContext = createContext(null);

// A nav bar that only uses theme won't re-render when user logs out.
```

### COMMON MISTAKES
- Storing rapidly changing state (mouse position, scroll, timers) in Context
- Forgetting to memoize the value object — causes all consumers to re-render every parent render
- Exposing raw `useContext(SomeContext)` in components — leaks implementation details; use a custom hook

### INTERVIEW TIP
"Context isn't a state manager — it's a dependency injection mechanism. It has no selectors, so every consumer re-renders when any part of the value changes. For complex or high-frequency state I use Zustand."

---

## ZUSTAND — LIGHTWEIGHT GLOBAL STORE

### CONCEPT
A minimal, hook-based state management library (~1 KB). Store lives outside React; subscriptions are selector-based, so components only re-render when the slice they care about changes.

### WHY IT MATTERS
- No Provider boilerplate
- Selector-based subscriptions prevent unnecessary re-renders
- Supports async actions, middleware, devtools, and persistence out of the box
- Far less boilerplate than Redux with equivalent power for most apps

### EXAMPLES

**Example 6 — Store creation: state + actions + selectors**
```js
// store/useCartStore.js
import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  // STATE
  items:  [],
  coupon: null,

  // ACTIONS — defined alongside state, no separate action files
  addItem: (product) =>
    set(state => ({
      items: [...state.items, { ...product, qty: 1 }],
    })),

  removeItem: (id) =>
    set(state => ({ items: state.items.filter(i => i.id !== id) })),

  updateQty: (id, qty) =>
    set(state => ({
      items: state.items.map(i => (i.id === id ? { ...i, qty } : i)),
    })),

  clearCart: () => set({ items: [], coupon: null }),

  // DERIVED — use get() to read current state inside an action
  getTotal: () =>
    get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}));

export default useCartStore;
```

**Example 7 — Selector-based subscriptions (granular re-renders)**
```jsx
function CartBadge() {
  // Only re-renders when items.length changes — not on qty or price updates
  const count = useCartStore(state => state.items.length);
  return <span>Cart ({count})</span>;
}

function CartTotal() {
  // Only re-renders when items array changes
  const getTotal = useCartStore(state => state.getTotal);
  return <strong>${getTotal().toFixed(2)}</strong>;
}

function CartItem({ id }) {
  // Subscribes only to the specific item
  const item       = useCartStore(state => state.items.find(i => i.id === id));
  const removeItem = useCartStore(state => state.removeItem);
  const updateQty  = useCartStore(state => state.updateQty);

  return (
    <div>
      <span>{item.name}</span>
      <input
        type="number"
        value={item.qty}
        onChange={e => updateQty(id, Number(e.target.value))}
      />
      <button onClick={() => removeItem(id)}>Remove</button>
    </div>
  );
}
```

**Example 8 — Async action in Zustand**
```js
const useUserStore = create((set) => ({
  user:    null,
  loading: false,
  error:   null,

  fetchUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const res  = await fetch(`/api/users/${id}`);
      const user = await res.json();
      set({ user, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

// Usage — no thunks or sagas needed
function Profile({ id }) {
  const { user, loading, fetchUser } = useUserStore(state => ({
    user:      state.user,
    loading:   state.loading,
    fetchUser: state.fetchUser,
  }));
  useEffect(() => { fetchUser(id); }, [id]);
  if (loading) return <Spinner />;
  return <h1>{user?.name}</h1>;
}
```

### COMMON MISTAKES
- Subscribing to the entire store: `const store = useStore()` — defeats selector optimization, re-renders on every change
- Mutating state directly instead of using `set` — breaks reactivity
- Storing derived/computed values in the store instead of computing in selectors or with `get()`

### INTERVIEW TIP
"Zustand's key insight: the store lives outside React, so you can call actions from anywhere — event listeners, WebSocket handlers, utility functions — without hooks. That's something neither Context nor Redux makes as easy."

---

## REACT QUERY — SERVER STATE

### CONCEPT
A data-fetching and caching library that treats server data as a separate concern from client state. Manages loading, error, stale, background-refetch, and pagination states automatically.

### WHY IT MATTERS
- Server state is async, can be stale, needs caching and invalidation — React Query handles all of this
- Eliminates manual `useEffect` + `useState` fetch patterns
- Built-in request deduplication: same query called in 3 components → 1 network request
- Automatic background refetching, retry on failure, pagination, infinite scroll helpers

### EXAMPLES

**Example 9 — Basic query**
```jsx
import { useQuery } from '@tanstack/react-query';

const fetchUser = (id) => fetch(`/api/users/${id}`).then(r => r.json());

function UserProfile({ userId }) {
  const {
    data: user,
    isLoading,
    isError,
    error,
    isFetching,   // true during background refetch (data already exists)
  } = useQuery({
    queryKey: ['user', userId],           // cache key — userId change triggers refetch
    queryFn:  () => fetchUser(userId),
    staleTime: 5 * 60 * 1000,            // treat as fresh for 5 min
    enabled:   !!userId,                  // skip if userId is undefined/null
  });

  if (isLoading) return <Spinner />;
  if (isError)   return <p>Error: {error.message}</p>;
  return (
    <div>
      {isFetching && <small>Refreshing…</small>}
      <h1>{user.name}</h1>
    </div>
  );
}
```

**Example 10 — Mutation with optimistic update**
```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function ToggleLike({ postId, liked }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      fetch(`/api/posts/${postId}/like`, { method: 'POST' }).then(r => r.json()),

    // Optimistic update: change UI instantly, roll back on failure
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      const previous = queryClient.getQueryData(['post', postId]);
      queryClient.setQueryData(['post', postId], old => ({
        ...old,
        liked:     !old.liked,
        likeCount: old.liked ? old.likeCount - 1 : old.likeCount + 1,
      }));
      return { previous };
    },
    onError: (err, vars, context) => {
      // Roll back on failure
      queryClient.setQueryData(['post', postId], context.previous);
    },
    onSettled: () => {
      // Sync with server regardless of outcome
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  return (
    <button onClick={() => mutation.mutate()}>
      {liked ? 'Unlike' : 'Like'}
    </button>
  );
}
```

**Example 11 — Parameterized query + dependent query**
```jsx
function UserPosts({ userId }) {
  // Query 1: fetch user
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn:  () => fetch(`/api/users/${userId}`).then(r => r.json()),
  });

  // Query 2: only runs after user is loaded (dependent query)
  const { data: posts } = useQuery({
    queryKey: ['posts', user?.teamId],
    queryFn:  () => fetch(`/api/teams/${user.teamId}/posts`).then(r => r.json()),
    enabled:  !!user?.teamId,       // waits for user to load first
  });

  return posts?.map(p => <PostCard key={p.id} post={p} />);
}
```

### COMMON MISTAKES
- Storing server data in Zustand/Context and manually syncing — React Query eliminates this need entirely
- Using `queryKey: ['users']` for queries that depend on a variable — should be `['users', userId]`
- Forgetting `staleTime` — without it, every window focus and component mount triggers a refetch
- Using `isLoading` when you mean `isFetching` — `isLoading` is only true on the very first load

### INTERVIEW TIP
"React Query separates server state from UI state. I keep server data in React Query and client-only UI state (open modals, selected tabs, form drafts) in Zustand or local `useState`. They compose perfectly — no overlap."

---

## WHEN TO USE WHICH — DECISION TREE

### CONCEPT
Choosing the right state tool based on scope, update frequency, and origin of the data.

### WHY IT MATTERS
Over-engineering adds complexity. Under-engineering causes prop drilling and stale data bugs. The right tool eliminates entire categories of problems.

### EXAMPLES

**Example 12 — Decision flow**
```
Is the state fetched from a server/API?
  YES → React Query (handles loading, caching, invalidation, retry)

Is the state used only within one component?
  YES → useState / useReducer

Is the state shared between 2-3 nearby components?
  YES → Lift state to their closest common parent

Is the state truly global and changes infrequently?
  YES (theme, auth, locale) → Context API

Is the state complex, updated frequently, or needs actions?
  YES → Zustand

Large team needing strict conventions and time-travel debugging?
  YES → Redux Toolkit
```

**Example 13 — Real-world state audit**
```
App state split in a typical e-commerce app:

Client state (Zustand):
  - Shopping cart (items, quantities, coupon)
  - UI state: sidebar open, active tab, modal stack

Server state (React Query):
  - Product catalog, product detail
  - User orders and order history
  - Search results

Global UI state (Context):
  - Theme (light/dark)
  - Authenticated user object (changes rarely)
  - i18n locale

Local state (useState):
  - Form field values
  - Accordion open/close
  - Hover/focus states
```

### COMMON MISTAKES
- Defaulting to Redux for every project regardless of complexity
- Mixing server state and client state in the same Zustand store
- Putting frequently changing state (scroll position, timers) in Context

### INTERVIEW TIP
"The #1 mistake is treating all state the same. Server state and client state have fundamentally different characteristics. React Query handles async lifecycle; Zustand handles synchronous interactions. Using both gives you the best of both worlds."

---

## REDUX vs ZUSTAND COMPARISON

### CONCEPT
Both are global client state managers, but with very different philosophies and boilerplate levels. Redux Toolkit dominates enterprise; Zustand is winning for new projects.

### WHY IT MATTERS
Knowing the trade-offs is a common interview topic — especially when joining teams with existing Redux codebases.

### EXAMPLES

**Example 14 — Same feature in both libraries**
```js
// --- ZUSTAND ---
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set(s => ({ count: s.count + 1 })),
  decrement: () => set(s => ({ count: s.count - 1 })),
  reset:     () => set({ count: 0 }),
}));

// Usage
const count     = useCounterStore(s => s.count);
const increment = useCounterStore(s => s.increment);


// --- REDUX TOOLKIT ---
// counterSlice.js
import { createSlice } from '@reduxjs/toolkit';
const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: state => { state.count += 1; },
    decrement: state => { state.count -= 1; },
    reset:     state => { state.count  = 0; },
  },
});
export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;

// store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
export const store = configureStore({ reducer: { counter: counterReducer } });

// Usage (with Provider wrapping the app)
const count = useSelector(s => s.counter.count);
const dispatch = useDispatch();
dispatch(increment());
```

**Example 15 — Side-by-side comparison table**
```
Feature            Zustand                    Redux Toolkit
--------------------------------------------------------------
Boilerplate        Single create() call        Slice + store + selectors
Bundle size        ~1 KB                       ~13 KB
Provider needed    No                          Yes (Provider + store)
DevTools           Via middleware              Excellent (time-travel)
Async              Direct async functions      createAsyncThunk / RTK Query
TypeScript         Excellent (inference)       Good (explicit types)
Learning curve     Minimal                     Steeper
Team scalability   Flexible (can be chaotic)   Strong conventions enforced
Best for           Small-medium, rapid dev     Large teams, complex apps
```

### COMMON MISTAKES
- Choosing Redux solely because it's "the standard" — adds overhead for small/medium apps
- Choosing Zustand for a 15-dev team with no discipline — can become messy without conventions

### INTERVIEW TIP
"I default to Zustand for new projects and recommend Redux Toolkit when the team is large, has strict code review requirements, or is already invested in Redux infrastructure. The cost of Redux is setup time; the benefit is enforced structure at scale."

---

## QUICK REFERENCE

```
useState        → local, synchronous, simple
useReducer      → local, complex state transitions / multiple sub-values
Context API     → global, low-frequency (theme, auth, i18n)
Zustand         → global, high-frequency or complex client state
React Query     → server/async state: fetching, caching, mutations
Redux Toolkit   → large teams needing enforced conventions + time-travel debug

Golden rule: Don't put server state in Zustand or Context.
React Query owns async data — it handles loading, caching,
background sync, and error retries so you don't have to.
```
