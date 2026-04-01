# useContext Cheatsheet

## CONCEPT
`useContext` lets a component read and subscribe to a context — data that can be accessed by any component in a tree without passing props through every level. Context is React's solution to prop drilling.

```jsx
// 1. Create
const MyContext = createContext(defaultValue);

// 2. Provide
<MyContext.Provider value={...}>
  <Children />
</MyContext.Provider>

// 3. Consume
const value = useContext(MyContext);
```

---

## WHY IT MATTERS
When a value needs to reach deeply nested components (theme, locale, auth user, toast notifications), threading props through 4+ layers becomes unmaintainable. Context solves this but has a performance cost — every consumer re-renders when the value changes.

---

## EXAMPLES

### 1. Basic createContext and Provider
```jsx
// theme-context.js — define context in its own file
import { createContext } from 'react';

// defaultValue is used when a component has no matching Provider above it
// Useful for testing components in isolation
const ThemeContext = createContext('light');

export default ThemeContext;
```

### 2. Wrapping a Tree with Provider
```jsx
import ThemeContext from './theme-context';

function App() {
  return (
    // All children can access 'dark' via useContext(ThemeContext)
    <ThemeContext.Provider value="dark">
      <Layout />
    </ThemeContext.Provider>
  );
}

// Layout → Sidebar → Button — Button can read theme without props
function Button() {
  const theme = useContext(ThemeContext);
  return <button className={`btn-${theme}`}>Click</button>;
}
```

### 3. Context with State (the most common pattern)
```jsx
// auth-context.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Wrap Provider + state in a custom component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    setUser(data.user);
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — better than calling useContext directly everywhere
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Usage in any component
function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav>
      {user ? <button onClick={logout}>Logout {user.name}</button> : <LoginLink />}
    </nav>
  );
}
```

### 4. Context vs Props — When to Use Each

```jsx
// USE PROPS when:
// - 1-2 levels deep — it's simple and explicit
// - Data is specific to a parent-child relationship
function Parent() {
  return <Child name="Alice" onClick={handleClick} />;
}

// USE CONTEXT when:
// - Data is truly global: theme, locale, auth, feature flags
// - Passing through 3+ levels of components that don't use the value
// - "Prop drilling" — intermediate components pass it just to forward it

// PROP DRILLING (bad, context solves this)
function Page({ user }) {
  return <Sidebar user={user} />;       // Sidebar doesn't use user
}
function Sidebar({ user }) {
  return <Avatar user={user} />;        // Avatar doesn't use user either
}
function Avatar({ user }) {
  return <img src={user.avatar} />;     // Only Avatar actually needs it
}

// With context: Page doesn't need to pass user at all
function Avatar() {
  const { user } = useAuth(); // gets it directly
  return <img src={user.avatar} />;
}
```

### 5. Multiple Contexts
```jsx
// Multiple providers can be stacked
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LocaleProvider>
          <Router />
        </LocaleProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Each component reads only what it needs
function Header() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { locale } = useLocale();
  // ...
}
```

### 6. Context for Notifications / Toast System
```jsx
// notification-context.jsx
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 3000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {/* Toast container lives here, beside children */}
      <ToastContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);

// Usage anywhere in the app
function SaveButton() {
  const { addNotification } = useNotification();

  const handleSave = async () => {
    await save();
    addNotification('Saved!', 'success');
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### 7. Performance Concern — Unnecessary Re-renders
```jsx
// PROBLEM: everything re-renders when ANY context value changes
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  // Both user AND theme in one context — changing theme re-renders all user consumers
  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

// SOLUTION: split contexts by how often they change
function App() {
  return (
    <AuthProvider>       {/* changes rarely */}
      <ThemeProvider>    {/* changes on user action */}
        <Children />
      </ThemeProvider>
    </AuthProvider>
  );
}

// Or: split value and updater into separate contexts
const ThemeValueContext = createContext('light');
const ThemeUpdateContext = createContext(null);

// Components that only set theme don't re-render on theme change
function ThemeToggle() {
  const setTheme = useContext(ThemeUpdateContext); // stable reference
  return <button onClick={() => setTheme('dark')}>Toggle</button>;
}
```

---

## COMMON MISTAKES

```jsx
// MISTAKE 1: Consuming context outside its Provider tree
function App() {
  return (
    <div>
      <NavBar />          {/* Uses useAuth */}
      <AuthProvider>      {/* Provider is BELOW NavBar! */}
        <Main />
      </AuthProvider>
    </div>
  );
}
// NavBar will get the default context value (often null/undefined) → crash

// MISTAKE 2: Recreating context value on every render
function Provider({ children }) {
  const [user, setUser] = useState(null);

  // WRONG: new object every render → all consumers re-render
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
// Fix: useMemo for the value (when performance matters)
const value = useMemo(() => ({ user, setUser }), [user]);

// MISTAKE 3: Using context for everything
// Context is not a replacement for all props. If a value is only
// relevant to one subtree or one parent-child pair, use props.
```

---

## INTERVIEW TIP

> **"When would you use context vs a state management library like Redux or Zustand?"**

Context works well for low-frequency updates (theme, auth, locale) shared across many components. For high-frequency updates (every keystroke, animation frames, real-time data) or complex state with many independent slices, a dedicated state manager is better — they're optimized for selective subscriptions so components only re-render when their specific slice changes. Context re-renders ALL consumers whenever the value changes.

> **"How do you avoid performance issues with context?"**

Split contexts by update frequency so unrelated consumers don't re-render. Separate the value and the updater into different contexts — components that only call setters don't need to re-render when the value changes. Use `useMemo` on the context value to stabilize its reference.
