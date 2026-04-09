# Day 48 — React.memo + useMemo + useCallback: Performance

**Status:** 📋 READY TO START
**Week:** 8 | **Theme:** React Advanced + Dashboard Project

---

## Today's Goal

Learn when — and more importantly, when NOT — to optimize React rendering. Build a demo that makes the problem visible so you understand the fix, not just the API.

By end of today:
- You understand why React re-renders and when it's a problem
- You've seen a parent re-render cascade into child re-renders in the console
- You've stopped that cascade with React.memo, useMemo, and useCallback
- You've read the Error Boundaries cheatsheet (needed for Day 50)

---

## What to Open

1. `cheatsheets/react/06-useMemo-useCallback.md`
2. `cheatsheets/react/12-performance.md`

---

## Morning (8:00 – 11:00 AM) — Read Both Cheatsheets

### The One Insight That Matters

> React re-renders are usually fine. Only optimize when you MEASURE a problem.

Re-rendering is cheap. The DOM diff is cheap. The network and business logic are expensive. A component that re-renders 10 times in a millisecond is not a performance problem — it's invisible to the user.

Premature optimization is when you add `useMemo` and `React.memo` before measuring. You slow down your development velocity for zero user benefit.

**When to actually optimize:**
1. You notice a real lag (user can feel it)
2. You open DevTools → Profiler and confirm the component is the bottleneck
3. You apply the fix

**Never optimize first. Measure first.**

### What You're Reading For

**In `06-useMemo-useCallback.md`:**
- `useMemo` — caches the result of a computation. Re-runs only when dependencies change.
- `useCallback` — caches a function reference. Re-creates only when dependencies change.
- The dependency array works exactly like `useEffect` — you list what it watches.

**In `12-performance.md`:**
- `React.memo` — wraps a component. Only re-renders when its props change (shallow compare).
- The three tools work together: `React.memo` on the child, `useCallback` on the function prop, `useMemo` on the data prop.
- Without all three, `React.memo` alone often doesn't help (because functions re-create on every parent render, so props appear "changed" even when logically unchanged).

---

## Midday (11:20 AM – 1:30 PM) — Build the Demo

Build this in a new Vite app or a single `index.html` with React CDN. The goal is to SEE the problem.

### Part 1 — The Problem: Without Optimization

```jsx
// ParentComponent.jsx
import { useState } from 'react'
import ChildComponent from './ChildComponent'

export default function ParentComponent() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  // This function re-creates on EVERY render
  const handleChildAction = () => {
    console.log('child action called')
  }

  // This array re-creates on EVERY render
  const expensiveList = [1, 2, 3, 4, 5].map(n => n * 2)

  return (
    <div>
      <h2>Parent renders: {count}</h2>
      <button onClick={() => setCount(c => c + 1)}>Re-render Parent</button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type here to re-render parent"
      />
      <ChildComponent list={expensiveList} onAction={handleChildAction} />
    </div>
  )
}
```

```jsx
// ChildComponent.jsx
export default function ChildComponent({ list, onAction }) {
  console.log('🔴 ChildComponent rendered') // Watch this in console!

  return (
    <div style={{ border: '2px solid red', padding: '1rem', margin: '1rem 0' }}>
      <h3>Child Component</h3>
      <p>List: {list.join(', ')}</p>
      <button onClick={onAction}>Child Action</button>
    </div>
  )
}
```

Open the console. Click "Re-render Parent" or type in the input. Watch the child re-render log appear every single time, even though the child's props didn't meaningfully change.

### Part 2 — The Fix: With Optimization

```jsx
// ChildComponent.jsx — wrap with React.memo
import { memo } from 'react'

const ChildComponent = memo(function ChildComponent({ list, onAction }) {
  console.log('🟢 ChildComponent rendered') // Now only renders when props actually change

  return (
    <div style={{ border: '2px solid green', padding: '1rem', margin: '1rem 0' }}>
      <h3>Child Component (memoized)</h3>
      <p>List: {list.join(', ')}</p>
      <button onClick={onAction}>Child Action</button>
    </div>
  )
})

export default ChildComponent
```

```jsx
// ParentComponent.jsx — stabilize props
import { useState, useCallback, useMemo } from 'react'
import ChildComponent from './ChildComponent'

export default function ParentComponent() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  // useCallback: same function reference between renders (unless deps change)
  const handleChildAction = useCallback(() => {
    console.log('child action called')
  }, []) // empty array = never re-creates

  // useMemo: same array reference between renders (unless deps change)
  const expensiveList = useMemo(() => {
    return [1, 2, 3, 4, 5].map(n => n * 2)
  }, []) // empty array = computed once

  return (
    <div>
      <h2>Parent renders: {count}</h2>
      <button onClick={() => setCount(c => c + 1)}>Re-render Parent</button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type here to re-render parent"
      />
      <ChildComponent list={expensiveList} onAction={handleChildAction} />
    </div>
  )
}
```

Now type in the input or click the button. The child log should NOT appear. It only re-renders when `list` or `onAction` actually changes — which they don't here.

### Part 3 — Add a Real Slow Computation

Add this to prove `useMemo` isn't just for references — it also caches expensive work:

```jsx
// Add this to ParentComponent
const [multiplier, setMultiplier] = useState(1)

// Without useMemo: runs on every render including unrelated state changes
const expensiveSum = useMemo(() => {
  console.log('⚡ Computing expensive sum...')
  let sum = 0
  for (let i = 0; i < 1_000_000; i++) {
    sum += i * multiplier
  }
  return sum
}, [multiplier]) // Only recomputes when multiplier changes

// In JSX:
// <p>Sum: {expensiveSum}</p>
// <button onClick={() => setMultiplier(m => m + 1)}>Change Multiplier</button>
```

Type in the text input — the expensive sum does NOT recompute. Click "Change Multiplier" — it does. That's `useMemo` doing its job.

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-48-dsa.js` in this folder.

Suggested focus: Arrays or Strings (foundational for interviews).

---

## Read for Tomorrow

Before you finish today, read `cheatsheets/react/13-error-boundaries.md`.
Day 50 requires building an ErrorBoundary — reading it today means you'll sleep on it and it'll click faster tomorrow.

---

## End of Day Checklist

- [ ] Read `06-useMemo-useCallback.md` fully
- [ ] Read `12-performance.md` fully
- [ ] Built the demo — console shows red renders without optimization
- [ ] Applied React.memo + useCallback + useMemo — console shows green (child not re-rendering)
- [ ] Added slow loop example — confirmed useMemo skips recompute on unrelated state change
- [ ] Completed 3 DSA problems in `day-48-dsa.js`
- [ ] Read `13-error-boundaries.md` (for Day 50)
- [ ] Journal entry: one sentence about when you WOULD and would NOT use these tools

---

*Measure first. Optimize second. The tools are simple — the judgment is the skill.*
