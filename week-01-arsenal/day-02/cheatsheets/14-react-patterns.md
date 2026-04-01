# 14 — React Patterns

---

## COMPOUND COMPONENTS

### CONCEPT
A set of components that share implicit state through Context, designed to work together. The parent manages state; the children are composable pieces that consume it. Think of `<select>` and `<option>` — they're meaningless apart but powerful together.

### WHY IT MATTERS
- Gives consumers flexible control over layout without exposing internals
- Avoids deeply nested prop drilling ("configuration props") to sub-components
- API feels natural and HTML-like
- Used heavily in UI libraries (Radix UI, Headless UI, Reach UI)

### EXAMPLES

**Example 1 — Accordion as compound components**
```jsx
import { createContext, useContext, useState } from 'react';

// Shared state lives in Context — hidden from consumers
const AccordionContext = createContext(null);

function Accordion({ children, defaultOpen = null }) {
  const [openId, setOpenId] = useState(defaultOpen);
  const toggle = (id) => setOpenId(prev => (prev === id ? null : id));
  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ id, children }) {
  return <div className="accordion-item">{children}</div>;
}

function AccordionTrigger({ id, children }) {
  const { openId, toggle } = useContext(AccordionContext);
  return (
    <button
      aria-expanded={openId === id}
      onClick={() => toggle(id)}
    >
      {children}
    </button>
  );
}

function AccordionPanel({ id, children }) {
  const { openId } = useContext(AccordionContext);
  if (openId !== id) return null;
  return <div role="region">{children}</div>;
}

// Attach sub-components as static properties (common convention)
Accordion.Item    = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Panel   = AccordionPanel;

// Consumer has full layout control — no config props needed
function FAQ() {
  return (
    <Accordion defaultOpen="q1">
      <Accordion.Item id="q1">
        <Accordion.Trigger id="q1">What is React?</Accordion.Trigger>
        <Accordion.Panel id="q1">A UI library.</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item id="q2">
        <Accordion.Trigger id="q2">What are hooks?</Accordion.Trigger>
        <Accordion.Panel id="q2">Functions for state and effects.</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
```

### COMMON MISTAKES
- Exposing the Context directly — consumers can bypass the intended API. Export only the sub-components
- Not validating that sub-components are used inside the parent — add a guard in the custom hook
- Over-engineering simple components into compound components — only use this when layout flexibility is genuinely needed

### INTERVIEW TIP
"Compound components solve the 'configuration props explosion' problem. Instead of `<Tabs activeTab={x} tabs={[{label, content}]} onTabChange={fn} renderTab={fn} />`, you get a composable API where the consumer owns the structure. It's the difference between configuration and composition."

---

## RENDER PROPS

### CONCEPT
A component accepts a prop that is a function. The component calls that function with data or behavior it controls, and the function returns JSX. The parent decides what to render; the component provides the data.

### WHY IT MATTERS
- Enables sharing stateful logic without extracting a custom hook (useful pre-hooks, still seen in codebases)
- Gives the consumer full control over rendering
- Still used in some libraries (React Router's `<Route render>`, Formik's `<Field render>`)

### EXAMPLES

**Example 2 — Mouse position tracker via render prop**
```jsx
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => setPos({ x: e.clientX, y: e.clientY });

  return (
    <div style={{ height: '100vh' }} onMouseMove={handleMouseMove}>
      {render(pos)}  {/* consumer decides what to do with the position */}
    </div>
  );
}

// Consumer 1: show coordinates
<MouseTracker render={({ x, y }) => (
  <p>Mouse: {x}, {y}</p>
)} />

// Consumer 2: move a custom cursor
<MouseTracker render={({ x, y }) => (
  <img
    src="/cursor.png"
    style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none' }}
  />
)} />
```

**Example 3 — children as a function (same pattern, different prop)**
```jsx
// `children` can be a function — same concept, less prop-name ceremony
function DataProvider({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url).then(r => r.json()).then(d => {
      setData(d);
      setLoading(false);
    });
  }, [url]);

  return children({ data, loading });  // call children as a function
}

// Usage
<DataProvider url="/api/users">
  {({ data, loading }) =>
    loading ? <Spinner /> : <UserList users={data} />
  }
</DataProvider>
```

### COMMON MISTAKES
- Using render props when a custom hook is cleaner — hooks are usually the right modern choice
- Creating a new function in JSX for the render prop every render — causes children to re-render; memoize the function
- Nesting multiple render props — creates "callback hell" in JSX

### INTERVIEW TIP
"Render props solved the code-reuse problem before hooks. Today, a custom hook usually replaces a render prop cleanly. I still reach for render props when I need to inject *rendering* logic (not just data), or when working with class components that can't use hooks."

---

## HIGHER-ORDER COMPONENTS (HOC)

### CONCEPT
A HOC is a function that takes a component and returns a new, enhanced component. It wraps the input component and injects additional props, behavior, or rendering logic.

### WHY IT MATTERS
- Still widely used for cross-cutting concerns: authentication guards, analytics, feature flags, theming
- Powers many libraries: `connect()` in Redux, `withRouter` in React Router v4, `withStyles` in Material UI
- Understanding HOCs is essential for reading older codebases

### EXAMPLES

**Example 4 — withAuth HOC (route guard)**
```jsx
function withAuth(WrappedComponent) {
  // Returned component has access to all of WrappedComponent's props
  function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();

    if (loading) return <Spinner />;
    if (!user)   return <Navigate to="/login" replace />;

    // Pass all original props through
    return <WrappedComponent {...props} user={user} />;
  }

  // Preserve the display name for React DevTools
  AuthenticatedComponent.displayName =
    `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
}

// Usage — wraps any component that needs auth
const ProtectedDashboard = withAuth(Dashboard);
const ProtectedSettings  = withAuth(Settings);

// Route usage
<Route path="/dashboard" element={<ProtectedDashboard />} />
```

**Example 5 — withLogger HOC (analytics/debugging)**
```jsx
function withLogger(WrappedComponent, eventName) {
  return function LoggedComponent(props) {
    useEffect(() => {
      analytics.track(`${eventName}_mounted`);
      return () => analytics.track(`${eventName}_unmounted`);
    }, []);

    const handleClick = useCallback((e) => {
      analytics.track(`${eventName}_clicked`);
      props.onClick?.(e);
    }, [props.onClick]);

    return <WrappedComponent {...props} onClick={handleClick} />;
  };
}

const TrackedButton = withLogger(Button, 'checkout_cta');
```

### COMMON MISTAKES
- Forgetting to forward `displayName` — components appear as `Unknown` in DevTools
- Not spreading props through: `<WrappedComponent {...props} />` is mandatory
- Mutating the input component instead of wrapping it — breaks the original component
- HOC inside render: `render() { const Enhanced = withX(Component); return <Enhanced /> }` — creates a new component type every render

### INTERVIEW TIP
"The golden rule for HOCs: enhance, don't mutate. Always spread the original props, forward refs with `React.forwardRef`, and set `displayName`. Today I'd reach for a custom hook first and only use a HOC when the enhancement must be applied at the component type level — like for route guards or feature flags."

---

## CUSTOM HOOK vs HOC vs RENDER PROPS COMPARISON

### CONCEPT
All three patterns solve the same problem: sharing stateful logic or behavior across components. Each has different ergonomics, composability, and legibility trade-offs.

### WHY IT MATTERS
Choosing the wrong abstraction creates unnecessary complexity. Understanding the trade-offs helps you pick the right tool and explain your choice in interviews.

### EXAMPLES

**Example 6 — Same feature in all three patterns**
```jsx
// SHARED GOAL: track window width and expose it to any component

// ─────────────────────────────────────────────
// OPTION 1: Custom Hook (modern default choice)
// ─────────────────────────────────────────────
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

function MyComponent() {
  const width = useWindowWidth();   // clean, direct, composable
  return <p>Width: {width}px</p>;
}

// ─────────────────────────────────────────────
// OPTION 2: Render Prop
// ─────────────────────────────────────────────
function WindowWidth({ children }) {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => { /* same handler */ }, []);
  return children(width);
}

function MyComponent() {
  return (
    <WindowWidth>
      {(width) => <p>Width: {width}px</p>}
    </WindowWidth>
  );
}

// ─────────────────────────────────────────────
// OPTION 3: HOC
// ─────────────────────────────────────────────
function withWindowWidth(WrappedComponent) {
  return function(props) {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => { /* same handler */ }, []);
    return <WrappedComponent {...props} windowWidth={width} />;
  };
}

const MyComponent = withWindowWidth(function({ windowWidth }) {
  return <p>Width: {windowWidth}px</p>;
});
```

**Comparison table**
```
                  Custom Hook        Render Prop       HOC
─────────────────────────────────────────────────────────────
Composition       Excellent          Good              Moderate
JSX nesting       None               Adds nesting      None
Class support     No (hooks only)    Yes               Yes
Multiple uses     compose easily     Callback hell     HOC hell
DevTools          function call      Wrapper component Wrapper component
Prop conflicts    None               None              Possible
Modern default?   YES                Rarely            For guards/flags
```

### COMMON MISTAKES
- Defaulting to HOCs in 2024 — custom hooks are almost always cleaner
- Nesting 3+ render props — creates deeply indented JSX that's hard to read
- Using a HOC when a hook composable via `useMyHook()` is sufficient

### INTERVIEW TIP
"My default is always a custom hook — it's the most composable and has no JSX overhead. I reach for render props when I need to inject rendering decision-making from outside. I use HOCs for wrapping component types (route guards, feature flags) because they work at the import/declaration level, not the call-site level."

---

## CONTAINER / PRESENTATIONAL PATTERN

### CONCEPT
Split components into two categories: **Containers** handle data fetching, state, and business logic. **Presentational** components receive data via props and only concern themselves with rendering.

### WHY IT MATTERS
- Presentational components are pure and trivially testable — just render props
- Container logic can be reused with different presentational components
- Clear separation of concerns; designers can work on presentational components without touching logic
- Note: Hooks blurred this line — today "smart" hooks often replace container components

### EXAMPLES

**Example 7 — Container + Presentational split**
```jsx
// ─── PRESENTATIONAL (dumb) — no state, no fetching, just UI ───
function UserList({ users, isLoading, error, onRefresh }) {
  if (isLoading) return <Spinner />;
  if (error)     return <ErrorMessage message={error} onRetry={onRefresh} />;
  if (!users.length) return <EmptyState />;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <UserCard user={user} />
        </li>
      ))}
    </ul>
  );
}

// ─── CONTAINER (smart) — handles data, passes to presentational ───
function UserListContainer() {
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn:  () => fetch('/api/users').then(r => r.json()),
  });

  return (
    <UserList
      users={users ?? []}
      isLoading={isLoading}
      error={error?.message}
      onRefresh={refetch}
    />
  );
}

// ─── Modern equivalent using a custom hook ───
// Skip the container component entirely — hook IS the container
function useUserList() {
  const { data: users, isLoading, error, refetch } = useQuery({ /*...*/ });
  return { users: users ?? [], isLoading, error: error?.message, refetch };
}

function UserListPage() {
  const props = useUserList();   // logic extracted into hook
  return <UserList {...props} />;
}
```

### COMMON MISTAKES
- Over-splitting — not every component needs a container/presentational split
- Putting UI-specific state (hover, open/close) in the container — it belongs in the presentational layer
- Ignoring hooks — in 2024, the "container" is usually just a custom hook

### INTERVIEW TIP
"The container/presentational pattern is still relevant as a *thinking tool*, but the implementation has evolved. Hooks replaced container components — now the 'smart' logic lives in `useXxx` hooks, and the component file is almost entirely presentational. The separation remains, just the file structure changed."

---

## COMPOSITION VS INHERITANCE

### CONCEPT
React strongly favors **composition** (building components from other components, passing behavior as props/children) over **inheritance** (extending component classes to share behavior).

### WHY IT MATTERS
Inheritance creates tight coupling and brittle hierarchies. Composition is more flexible, testable, and idiomatic in React. The React team explicitly recommends composition over inheritance.

### EXAMPLES

**Example 8 — Inheritance anti-pattern vs composition**
```jsx
// BAD: inheritance approach
class BaseButton extends React.Component {
  getBaseStyles() { return { padding: 8, borderRadius: 4 }; }
  render() { return <button style={this.getBaseStyles()}>{this.props.children}</button>; }
}
class PrimaryButton extends BaseButton {
  getBaseStyles() { return { ...super.getBaseStyles(), background: 'blue', color: 'white' }; }
}
class DangerButton extends BaseButton {
  getBaseStyles() { return { ...super.getBaseStyles(), background: 'red', color: 'white' }; }
}
// Problems: tight coupling, hard to test, hard to mix behaviors

// GOOD: composition via props
function Button({ variant = 'default', size = 'md', children, ...rest }) {
  const styles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-600 text-white',
    danger:  'bg-red-600 text-white',
  };
  const sizes = { sm: 'px-2 py-1 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' };

  return (
    <button className={`${styles[variant]} ${sizes[size]} rounded`} {...rest}>
      {children}
    </button>
  );
}

// Mix behaviors freely via props — no inheritance needed
<Button variant="primary" size="lg">Submit</Button>
<Button variant="danger" onClick={handleDelete}>Delete</Button>
```

**Specialization via composition**
```jsx
// If you need a "specialized" version of a component:
// DON'T inherit — compose using a wrapper
function IconButton({ icon, children, ...buttonProps }) {
  return (
    <Button {...buttonProps}>
      <span className="icon">{icon}</span>
      {children}
    </Button>
  );
}

function DeleteButton({ onDelete, label = 'Delete' }) {
  return (
    <IconButton icon="🗑" variant="danger" onClick={onDelete}>
      {label}
    </IconButton>
  );
}
```

### COMMON MISTAKES
- Reaching for class inheritance to share non-UI logic — extract to a utility function or custom hook instead
- Deep component wrapping chains (A wraps B wraps C) — can use `children` or Context to flatten
- Conflating "component inheritance" with "TypeScript interface inheritance" — TS types can extend freely; React components should compose

### INTERVIEW TIP
"React's component model is built around composition. `children`, render props, and Context are all tools for composition. The team explicitly says there are no use cases where they'd recommend component inheritance. When I need to share logic, I use custom hooks; when I need to share UI, I use component composition."

---

## QUICK REFERENCE

```
Compound Components
  → co-located components sharing Context
  → use when: flexible layout control, sub-component APIs

Render Props
  → function prop returns JSX, receives data from parent
  → use when: injecting rendering logic; class-component compatibility

HOC (Higher-Order Component)
  → function(Component) → EnhancedComponent
  → use when: wrapping at type level (auth guards, feature flags, analytics)
  → always: spread props, set displayName, don't mutate

Custom Hook
  → extracts stateful logic, returns data/actions
  → modern default for sharing logic (replaces HOC + render props in most cases)

Container / Presentational
  → Container: data + logic | Presentational: pure UI
  → modern form: custom hook (container) + component (presentational)

Composition > Inheritance
  → share UI → component wrapping + children
  → share logic → custom hooks
  → share behavior → composition props (variant, size, onClick)
```
