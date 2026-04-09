# Day 77 — React Interview Questions: Practice Out Loud

**Status:** 📋 READY TO START
**Week:** 12 | **Theme:** Interview Preparation

---

## Today's Goal

Work through 50 React interview questions using the same method as yesterday: read the question, close the file, explain out loud, compare. React is where most frontend interviews are won or lost — hooks, rendering behavior, performance, and component patterns.

By end of today:
- 50 React questions practiced out loud
- Weak areas marked for review
- 3 DSA problems solved

---

## What to Open

1. `interview-vault/02-react-interview.md`

---

## The Method (same as yesterday — no shortcuts)

1. Read the question
2. **Close the file** — minimize, turn away, cover the screen
3. Explain your answer out loud for at least 30 seconds
4. Open the file — compare your answer
5. Mark: ✅ (nailed it) / ⚠️ (partial) / ❌ (missed it)
6. For ❌: read the correct answer out loud twice, then close and say it again

---

## Morning (8:00 – 11:00 AM) — Questions 1-18: Hooks

### useState, useEffect, useRef, useMemo, useCallback

These appear in almost every React interview. Know them cold.

**"What is the difference between `useState` and `useRef`?"**
> Both persist values across renders. `useState` triggers a re-render when updated — it's for values that affect the UI. `useRef` does NOT trigger a re-render — it's for values you want to track without affecting the UI (previous value, DOM node, timer IDs, any mutable value that doesn't drive rendering).

**"What does the dependency array in `useEffect` control?"**
> It controls when the effect runs. Empty array `[]` = run once on mount. With dependencies = run whenever those values change. No array = run after every render. The cleanup function returned from `useEffect` runs before the next effect and on unmount — use it to cancel subscriptions, clear timers, abort fetch requests.

**"When should you use `useMemo`?"**
> When you have a computationally expensive calculation that you don't want to rerun on every render. The function only reruns when its dependencies change. Overusing it adds overhead — don't memoize cheap operations. Common use: filtering/sorting large arrays, computing derived data from props.

**"When should you use `useCallback`?"**
> When you pass a function as a prop to a memoized child component (`React.memo`). Without `useCallback`, the function reference changes every render, causing the child to re-render even when nothing relevant changed. `useCallback` returns the same function reference as long as its dependencies don't change.

**"What is `useReducer` and when do you prefer it over `useState`?"**
> `useReducer` is `useState` for complex state transitions. You define a reducer function `(state, action) => newState` and dispatch actions. Prefer it when: state has multiple sub-values that update together, the next state depends on the previous state in complex ways, or you want to extract state logic into a testable pure function.

**Custom Hook Questions (14-18)**

**"What is a custom hook?"**
> A function that starts with `use` and calls other hooks. It lets you extract and reuse stateful logic across multiple components without changing the component tree. Examples: `useFetch` for data fetching, `useLocalStorage` for persisted state, `useDebounce` for debouncing input. The logic is shared — the state is not (each component gets its own instance).

---

## Midday (11:20 AM – 1:30 PM) — Questions 19-36: Rendering + Performance + Patterns

### Rendering Behavior (19-25)

**"When does a React component re-render?"**
> 1. Its own state changes
> 2. Its parent re-renders (by default, all children re-render with the parent)
> 3. A context it consumes changes
> 4. Its props change (only matters if re-renders are prevented via `React.memo`)

**"What is `React.memo`?"**
> A higher-order component that wraps a functional component and prevents re-renders if props haven't changed (shallow comparison). Use it for pure components that render the same output for the same props. It only helps when the parent re-renders frequently and the child's render is expensive.

**"What is reconciliation?"**
> The process by which React updates the DOM. When state changes, React creates a new virtual DOM tree and diffs it against the previous one. It only updates the real DOM nodes that actually changed. The `key` prop helps React identify which list items changed, were added, or were removed.

**"What is `key` and why does it matter in lists?"**
> `key` is a special prop React uses to track list items across renders. Using array index as key breaks if the list order changes — React can't tell that an item moved, it thinks the old item changed. Use a stable unique ID. Bad key = wrong component state attached to wrong item after reorder.

### Patterns (26-36)

**"What is lifting state up?"**
> When two sibling components need to share state, you move that state to their common ancestor and pass it down as props with a callback to update it. The ancestor becomes the single source of truth.

**"Controlled vs uncontrolled components?"**
> Controlled: the component's value is driven by React state. Every keystroke updates state, React owns the value. `<input value={val} onChange={setVal} />`. Uncontrolled: the DOM manages the value — you access it via `useRef` when needed. Controlled is preferred: state is predictable and you can validate on every change.

**"What is Context?"**
> A way to pass data through the component tree without prop-drilling. Create with `createContext`, wrap with `Provider`, consume with `useContext`. Not a replacement for a state manager — Context re-renders ALL consumers when the value changes. Fine for infrequently-changing values (theme, locale, auth).

---

## Afternoon (1:30 – 3:30 PM) — Questions 37-50: Router + Testing + Misc + DSA

**"What is the difference between `useNavigate` and `<Link>`?"**
> `<Link>` is declarative — for navigation in JSX. `useNavigate` is imperative — for navigation triggered by code (e.g., after form submission, after login). Both use the client-side router without a page reload.

**"What is `React.lazy` and `Suspense`?"**
> `React.lazy` dynamically imports a component — the bundle is only loaded when the component is first rendered. `Suspense` wraps lazy components and shows a fallback UI while loading. Together they implement code splitting: your initial bundle is smaller, pages load only when visited.

**"What do you test in a React component?"**
> Behavior, not implementation. Test what the user sees and does: text rendered on screen, what happens when buttons are clicked, what's displayed after an async operation. Avoid testing: internal state, CSS class names, implementation details that could change without breaking behavior.

### DSA (3 Problems)

Create `day-77-dsa.js`. Pick 3 problems from your ❌ list from yesterday.

---

## End of Day Checklist

- [ ] Opened `interview-vault/02-react-interview.md`
- [ ] Questions 1-18: read, closed, explained out loud, marked — Hooks
- [ ] Questions 19-36: read, closed, explained out loud, marked — Rendering, Performance, Patterns
- [ ] Questions 37-50: read, closed, explained out loud, marked — Router, Testing, Misc
- [ ] All ❌ questions: re-read and said out loud again
- [ ] ❌ count recorded: ___
- [ ] 3 DSA problems solved in `day-77-dsa.js`

---

*If you can't explain a hook without looking, you can't use it in an interview. Say it out loud. Every time.*
