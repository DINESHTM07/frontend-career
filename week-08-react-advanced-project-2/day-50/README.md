# Day 50 — Error Boundaries + React Patterns

**Status:** 📋 READY TO START
**Week:** 8 | **Theme:** React Advanced + Dashboard Project

---

## Today's Goal

Learn two professional React patterns you'll use in every serious project: Error Boundaries (catch component crashes gracefully) and Compound Components (build flexible, composable UI like every design system does).

By end of today:
- You have a working `ErrorBoundary` class component you can drop anywhere
- You understand the Compound Components pattern — how and why it's used
- You've built a `Tabs` component using that pattern
- You're ready to use both on the Dashboard next week

---

## What to Open

1. `cheatsheets/react/14-react-patterns.md`

(You already read `13-error-boundaries.md` yesterday. Today you use it.)

---

## Morning (8:00 – 11:00 AM) — Read + Build ErrorBoundary

### Step 1 — Read the Cheatsheet

Open `cheatsheets/react/14-react-patterns.md`. Focus on:
- Compound Components pattern
- The render props vs compound components trade-off
- When each pattern applies

### Step 2 — Build ErrorBoundary

ErrorBoundary is the one React pattern that **must** be a class component. React hasn't added hook support for `componentDidCatch` yet. Don't fight it — just memorize the shape and move on.

Create `ErrorBoundary.jsx`:

```jsx
import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // Called when a child throws — return new state
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  // Called after the UI updates — good for logging
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
    // In production: send to Sentry, Datadog, etc.
  }

  render() {
    if (this.state.hasError) {
      // Render the fallback — either a prop or a default
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div style={{ padding: '2rem', border: '2px solid red', borderRadius: '8px' }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

### Step 3 — Test It

Build a component that intentionally crashes:

```jsx
function BrokenWidget({ shouldCrash }) {
  if (shouldCrash) {
    throw new Error('Widget crashed on purpose!')
  }
  return <div>Widget is working fine</div>
}
```

Wrap it with your ErrorBoundary:

```jsx
<ErrorBoundary fallback={<p>Widget failed to load.</p>}>
  <BrokenWidget shouldCrash={true} />
</ErrorBoundary>
```

Confirm the fallback renders instead of crashing the whole app. Try the "Try again" button — it should reset.

**Key insight:** ErrorBoundary only catches errors in the *render phase* and *lifecycle methods*. It does NOT catch errors in:
- Event handlers (use try/catch in those)
- Async code (use try/catch in fetch/async functions)
- The ErrorBoundary itself

---

## Midday (11:20 AM – 1:30 PM) — Build Tabs with Compound Components

### Why Compound Components?

The naive approach to a Tabs component is one component with many props:
```jsx
<Tabs
  tabs={['Overview', 'Settings', 'Analytics']}
  panels={[<Overview />, <Settings />, <Analytics />]}
  defaultTab={0}
  onChange={handleTabChange}
/>
```

This works, but it's rigid. You can't customize the tab labels, add icons, conditionally show tabs, or control layout. Every new requirement adds a new prop.

The Compound Components pattern instead gives the consumer control:

```jsx
<Tabs defaultIndex={0}>
  <TabList>
    <Tab>Overview</Tab>
    <Tab>Settings</Tab>
    <Tab>Analytics</Tab>
  </TabList>
  <TabPanels>
    <TabPanel><Overview /></TabPanel>
    <TabPanel><Settings /></TabPanel>
    <TabPanel><Analytics /></TabPanel>
  </TabPanels>
</Tabs>
```

Each sub-component communicates through shared context, not props. The parent `Tabs` owns the state; children read from it via `useContext`.

### Build It

```jsx
// Tabs.jsx
import { createContext, useContext, useState } from 'react'

const TabsContext = createContext(null)

// Parent — owns state, provides context
export function Tabs({ children, defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

// Tab — reads context, updates active index
export function Tab({ children, index }) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext)
  const isActive = activeIndex === index

  return (
    <button
      onClick={() => setActiveIndex(index)}
      style={{
        fontWeight: isActive ? 'bold' : 'normal',
        borderBottom: isActive ? '2px solid blue' : '2px solid transparent',
        padding: '0.5rem 1rem',
        background: 'none',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

// TabList — renders tabs in a row, injects index into each Tab
export function TabList({ children }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, { index })
      )}
    </div>
  )
}

// TabPanel — only renders when its index matches active
export function TabPanel({ children, index }) {
  const { activeIndex } = useContext(TabsContext)
  return activeIndex === index ? <div className="tab-panel">{children}</div> : null
}

// TabPanels — injects index into each TabPanel
export function TabPanels({ children }) {
  return (
    <div>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, { index })
      )}
    </div>
  )
}
```

Use it in App.jsx:

```jsx
import { Tabs, TabList, Tab, TabPanels, TabPanel } from './Tabs'

function App() {
  return (
    <Tabs defaultIndex={0}>
      <TabList>
        <Tab>Overview</Tab>
        <Tab>Settings</Tab>
        <Tab>Analytics</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <h2>Overview</h2>
          <p>Main dashboard content goes here.</p>
        </TabPanel>
        <TabPanel>
          <h2>Settings</h2>
          <p>Configuration options.</p>
        </TabPanel>
        <TabPanel>
          <h2>Analytics</h2>
          <p>Charts and data.</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
```

Click through the tabs. The active tab should highlight and its panel should show.

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-50-dsa.js` in this folder.

---

## End of Day Checklist

- [ ] Read `cheatsheets/react/14-react-patterns.md` fully
- [ ] Built `ErrorBoundary` class component
- [ ] Tested ErrorBoundary with a component that intentionally crashes — fallback renders
- [ ] "Try again" button resets the error state
- [ ] Can explain: why does ErrorBoundary have to be a class component?
- [ ] Built `Tabs` compound component (Tabs, TabList, Tab, TabPanels, TabPanel)
- [ ] Tab switching works — active tab highlighted, correct panel visible
- [ ] Can explain: where does the active state live, and how do children access it?
- [ ] Completed 3 DSA problems in `day-50-dsa.js`

---

*Compound Components is one of the most common interview questions for senior roles: "How would you build a flexible Tabs component?" You now have the answer.*
