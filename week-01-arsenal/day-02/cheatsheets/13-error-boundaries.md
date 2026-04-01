# 13 — Error Boundaries

---

## WHAT ERROR BOUNDARIES CATCH (AND DON'T CATCH)

### CONCEPT
An error boundary is a React component that catches JavaScript errors in its child component tree, logs them, and renders a fallback UI instead of crashing the entire app.

### WHY IT MATTERS
Without error boundaries, a single unhandled render error unmounts the entire React tree — the whole page goes blank. Error boundaries contain the blast radius to a subtree.

### EXAMPLES

**Example 1 — What they catch vs don't catch**
```
CAUGHT by error boundaries:
  ✓ Errors during rendering (JSX evaluation)
  ✓ Errors in lifecycle methods (componentDidMount, etc.)
  ✓ Errors in constructors of child components
  ✓ Errors in React.lazy / Suspense loading

NOT caught (must handle separately):
  ✗ Errors in event handlers         → use try/catch inside the handler
  ✗ Errors in async code             → fetch().catch(), async/await try/catch
  ✗ Errors in server-side rendering  → SSR errors need server-side handling
  ✗ Errors in the boundary itself    → caught by the nearest parent boundary
  ✗ Errors outside React tree        → global window.onerror
```

**Example 2 — Event handler error (must handle manually)**
```jsx
function DangerousButton() {
  // Error boundaries do NOT catch this
  const handleClick = () => {
    throw new Error('Something went wrong in the handler');
  };

  // CORRECT: handle it yourself
  const handleClickSafe = () => {
    try {
      riskyOperation();
    } catch (err) {
      setError(err.message);   // surface it via state
      logError(err);
    }
  };

  return <button onClick={handleClickSafe}>Do thing</button>;
}
```

### COMMON MISTAKES
- Assuming error boundaries catch async errors — they don't
- Putting one boundary at the top and calling it done — errors in any subtree blow up the whole UI
- Not logging caught errors — silent failures are worse than visible ones

### INTERVIEW TIP
"Error boundaries are class-component-only in vanilla React (for now) because `getDerivedStateFromError` and `componentDidCatch` have no hook equivalent yet. The `react-error-boundary` library provides a hook-friendly API that wraps the class internally."

---

## CLASS COMPONENT IMPLEMENTATION

### CONCEPT
Error boundaries must be class components. They implement two lifecycle methods: `getDerivedStateFromError` (to update state and render fallback) and `componentDidCatch` (to log the error).

### WHY IT MATTERS
Understanding the class implementation shows you know *why* hooks can't replace this yet — it relies on lifecycle methods that have no direct hook equivalent.

### EXAMPLES

**Example 3 — Full class-based error boundary**
```jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Phase 1: render phase — update state so next render shows the fallback
  // Must be static — no access to `this`
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Phase 2: commit phase — side effects (logging, reporting)
  // Has access to `this`, componentStack shows where in the tree it happened
  componentDidCatch(error, errorInfo) {
    console.error('Caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);

    // Send to your error monitoring service
    logErrorToService(error, { componentStack: errorInfo.componentStack });
  }

  render() {
    if (this.state.hasError) {
      // Render any custom fallback UI
      return this.props.fallback || (
        <div role="alert">
          <h2>Something went wrong.</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary fallback={<p>Failed to load widget.</p>}>
      <UnreliableWidget />
    </ErrorBoundary>
  );
}
```

**Example 4 — Reusable boundary with render prop for fallback**
```jsx
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    logErrorToService(error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      // renderFallback receives error and reset function
      return this.props.renderFallback({
        error: this.state.error,
        reset: this.reset,
      });
    }
    return this.props.children;
  }
}

// Flexible — caller decides the fallback UI
<ErrorBoundary
  renderFallback={({ error, reset }) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )}
>
  <Dashboard />
</ErrorBoundary>
```

### COMMON MISTAKES
- Confusing `getDerivedStateFromError` (render phase, static, updates state) with `componentDidCatch` (commit phase, for side effects)
- Throwing in `componentDidCatch` — it will cause an infinite error loop
- Not providing a `reset` mechanism — users are stuck on the error screen

### INTERVIEW TIP
"The two lifecycle methods have different jobs: `getDerivedStateFromError` is synchronous and pure — it only updates state to trigger a fallback render. `componentDidCatch` is where you do side effects like logging. Never log in `getDerivedStateFromError` and never set state in `componentDidCatch`."

---

## REACT-ERROR-BOUNDARY LIBRARY

### CONCEPT
`react-error-boundary` is a thin wrapper that gives you a hook-friendly, declarative API over the class-based implementation — handling reset, retry, and fallback rendering out of the box.

### WHY IT MATTERS
Eliminates the need to write and maintain your own class component. The library handles edge cases like resetting on prop changes and provides `useErrorBoundary` for triggering boundaries from async code.

### EXAMPLES

**Example 5 — Basic usage with react-error-boundary**
```bash
npm install react-error-boundary
```

```jsx
import { ErrorBoundary } from 'react-error-boundary';

// Fallback component receives error and resetErrorBoundary
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => logErrorToService(error, info)}
      onReset={() => {
        // optional: reset app state before retrying
        clearCache();
      }}
    >
      <Dashboard />
    </ErrorBoundary>
  );
}
```

**Example 6 — useErrorBoundary — catch async errors in the boundary**
```jsx
import { useErrorBoundary } from 'react-error-boundary';

function DataLoader({ id }) {
  const { showBoundary } = useErrorBoundary();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(id)
      .then(setData)
      .catch(err => {
        // Route the async error INTO the nearest ErrorBoundary
        // so it renders the fallback UI instead of silently failing
        showBoundary(err);
      });
  }, [id]);

  if (!data) return <Spinner />;
  return <DataView data={data} />;
}

// Now async errors appear in the boundary, not as silent failures
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <DataLoader id={42} />
</ErrorBoundary>
```

### COMMON MISTAKES
- Confusing `resetErrorBoundary` (provided by library) with a custom reset handler — they're the same call
- Not passing `onReset` when you have app state that needs clearing before retry
- Using `useErrorBoundary` to handle errors that should have their own local UI (form validation, empty states)

### INTERVIEW TIP
"`useErrorBoundary` is the missing link between error boundaries and async code. Without it, a failed fetch silently fails or needs its own local error state. With it, you can funnel async errors into the boundary's fallback UI — consistent error handling across both sync and async."

---

## FALLBACK UI PATTERNS

### CONCEPT
A fallback UI replaces the crashed component. The pattern you choose depends on how critical the crashed component is and what the user needs to recover.

### WHY IT MATTERS
A good fallback tells the user what happened and gives them a way forward. A bad fallback (blank space, cryptic technical message) destroys trust.

### EXAMPLES

**Example 7 — Fallback pattern catalog**
```jsx
// Pattern 1: Inline message (for widgets, cards)
function InlineFallback({ error }) {
  return (
    <div className="error-card" role="alert">
      <p>This section failed to load.</p>
    </div>
  );
}

// Pattern 2: Full page error (for route-level boundaries)
function PageFallback({ error, resetErrorBoundary }) {
  return (
    <main className="error-page">
      <h1>Something went wrong</h1>
      <p>We've been notified and are working on a fix.</p>
      <button onClick={resetErrorBoundary}>Refresh this page</button>
      <a href="/">Go home</a>
    </main>
  );
}

// Pattern 3: Skeleton / graceful degradation (hide broken section)
function SilentFallback() {
  return null;  // render nothing — appropriate for non-critical widgets
}

// Pattern 4: Error with details for development
function DevFallback({ error }) {
  if (process.env.NODE_ENV === 'production') {
    return <InlineFallback />;
  }
  return (
    <div style={{ background: '#fee', padding: 16 }}>
      <strong>{error.name}:</strong> {error.message}
      <pre style={{ fontSize: 12 }}>{error.stack}</pre>
    </div>
  );
}
```

### COMMON MISTAKES
- Showing stack traces in production — leaks implementation details and confuses users
- No reset/retry option — traps the user on the error screen
- Using `alert()` in `componentDidCatch` — blocks the thread and is terrible UX

### INTERVIEW TIP
"A good error UI has three things: a human-readable message, a clear action (retry, go home, contact support), and no technical details in production. I use a `DevFallback` locally for stack traces and swap it for a clean `UserFallback` in production."

---

## PLACEMENT STRATEGY

### CONCEPT
Where you place error boundaries determines how much of the UI is affected when an error occurs. Strategic placement contains errors to the smallest reasonable subtree.

### WHY IT MATTERS
One top-level boundary protects against a blank page but makes every crash catastrophic for the user. Granular boundaries preserve the working parts of the UI.

### EXAMPLES

**Example 8 — Layered boundary strategy**
```jsx
function App() {
  return (
    // Layer 1: App-level — last resort, catches everything that slips through
    <ErrorBoundary FallbackComponent={AppCrashFallback}>
      <Router>
        {/* Layer 2: Route-level — each page is isolated */}
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ErrorBoundary FallbackComponent={PageFallback}>
                <Dashboard />
              </ErrorBoundary>
            }
          />
        </Routes>

        {/* Layer 3: Widget-level — sidebar failure doesn't kill the page */}
        <ErrorBoundary FallbackComponent={SidebarFallback}>
          <Sidebar>
            {/* Layer 4: Micro-boundary — non-critical widgets silently fail */}
            <ErrorBoundary FallbackComponent={() => null}>
              <RecommendationsWidget />
            </ErrorBoundary>
          </Sidebar>
        </ErrorBoundary>
      </Router>
    </ErrorBoundary>
  );
}

// Rule of thumb:
// Critical path (nav, main content) → InlineFallback with retry
// Non-critical (ads, recommendations) → silent fallback (null)
// Pages → PageFallback with navigation option
// Whole app → AppCrashFallback with support contact
```

### COMMON MISTAKES
- Single top-level boundary only — any crash kills the whole UI
- Wrapping every single component — performance overhead and fallback UI everywhere
- Not co-locating boundaries with the component that's likely to fail (third-party widgets, data-heavy sections)

### INTERVIEW TIP
"I think of error boundaries like circuit breakers in electrical systems — you don't put one at the main panel and call it done. You put them at each zone so one blown fuse doesn't kill the whole house."

---

## RETRY PATTERN AND ERROR LOGGING

### CONCEPT
The retry pattern resets the error boundary state so the child component re-renders and attempts the operation again. Logging sends error details to an external service for monitoring.

### WHY IT MATTERS
- Retry is essential for transient errors (network blips, race conditions)
- Without logging, you're blind to production errors your users are silently hitting

### EXAMPLES

**Example 9 — Retry with resetKeys (react-error-boundary)**
```jsx
import { ErrorBoundary } from 'react-error-boundary';

function UserProfile({ userId }) {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <div>
          <p>Failed to load profile.</p>
          <button onClick={resetErrorBoundary}>Retry</button>
        </div>
      )}
      // resetKeys: boundary auto-resets when any key changes
      // Useful when the parent changes props after an error
      resetKeys={[userId]}
      onReset={() => setRetryKey(k => k + 1)}
    >
      {/* key prop forces a full remount on retry */}
      <ProfileCard key={retryKey} userId={userId} />
    </ErrorBoundary>
  );
}
```

**Example 10 — Error logging to a monitoring service**
```jsx
// errorLogger.js
export function logErrorToService(error, errorInfo) {
  // Works with Sentry, Datadog, LogRocket, Bugsnag, etc.
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.withScope(scope => {
      scope.setExtra('componentStack', errorInfo.componentStack);
      scope.setTag('boundary', 'react-error-boundary');
      window.Sentry.captureException(error);
    });
  }

  // Also log locally in development
  if (process.env.NODE_ENV !== 'production') {
    console.group('Error Boundary caught:');
    console.error(error);
    console.error('Component stack:', errorInfo?.componentStack);
    console.groupEnd();
  }
}

// Usage in your boundary
<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onError={logErrorToService}   // called in componentDidCatch
>
  <App />
</ErrorBoundary>
```

### COMMON MISTAKES
- Retrying infinitely without a limit — broken components will error-loop
- Not distinguishing transient errors (retry makes sense) from data errors (retry won't help)
- Logging in `getDerivedStateFromError` (render phase) — causes side effects during rendering

### INTERVIEW TIP
"For retry, I use `resetKeys` tied to the relevant prop so the boundary auto-recovers when the parent navigates or changes the data. For logging, I integrate with Sentry via `onError` — every caught error gets a stack trace and component tree attached. Production errors should never be silent."

---

## QUICK REFERENCE

```
getDerivedStateFromError(error)
  → static, render phase, returns new state, triggers fallback render

componentDidCatch(error, errorInfo)
  → commit phase, for logging/side effects, has access to componentStack

react-error-boundary
  → FallbackComponent   prop   — fallback UI component
  → onError             prop   — logging callback
  → onReset             prop   — state cleanup before retry
  → resetKeys           prop   — auto-reset when values change
  → useErrorBoundary()  hook   — showBoundary(err) for async errors

Placement strategy:
  App level   → last resort fallback
  Route level → page-scoped crash containment
  Widget level → non-critical UI isolation

What boundaries catch:   render errors, lifecycle errors, lazy load errors
What they don't catch:  event handlers, async code, SSR, self-thrown errors
```
