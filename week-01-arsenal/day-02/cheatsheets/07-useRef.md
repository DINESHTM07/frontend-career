# useRef Cheatsheet

## CONCEPT
`useRef` returns a mutable object `{ current: initialValue }` that persists for the full lifetime of the component. Changing `.current` does **not** trigger a re-render.

```jsx
const ref = useRef(initialValue);
// ref.current = initialValue (mutable, persists across renders)
```

Two distinct use cases:
1. **DOM refs** — direct access to a DOM node (focus, scroll, measurements)
2. **Instance variables** — store any mutable value without causing a re-render

---

## WHY IT MATTERS
Sometimes you need to interact directly with the DOM (focus an input, measure an element, animate). Other times you need to track values across renders — like interval IDs, previous prop values, or "has this mounted?" flags — without those values being part of the render cycle. `useRef` handles both cases cleanly.

---

## EXAMPLES

### 1. DOM Ref — Focus an Input

```jsx
import { useRef } from 'react';

function SearchBar() {
  const inputRef = useRef(null); // null is the typical initial value for DOM refs

  function handleClick() {
    // After mount, inputRef.current IS the <input> DOM node
    inputRef.current.focus();
  }

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Search..." />
      <button onClick={handleClick}>Focus input</button>
    </div>
  );
}
```

### 2. DOM Ref — Scroll to Element

```jsx
import { useRef } from 'react';

function ArticlePage() {
  const commentsRef = useRef(null);

  function scrollToComments() {
    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <article>
      <button onClick={scrollToComments}>Jump to comments</button>

      <section>
        {/* lots of content */}
        <p>Article body...</p>
      </section>

      <section ref={commentsRef}>
        <h2>Comments</h2>
        {/* comments list */}
      </section>
    </article>
  );
}
```

### 3. Storing Previous Values

```jsx
import { useRef, useEffect, useState } from 'react';

// Custom hook: returns the value from the PREVIOUS render
function usePrevious(value) {
  const prevRef = useRef();

  useEffect(() => {
    // After render, store the current value for next time
    prevRef.current = value;
  }); // no dependency array: runs after every render

  return prevRef.current; // returns value from before this render
}

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count} | Previous: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

### 4. Storing Mutable Values Without Re-render — Interval ID

```jsx
import { useRef, useState, useEffect } from 'react';

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null); // stores interval ID — not display data

  function start() {
    // Guard: don't start a second interval if already running
    if (intervalRef.current !== null) return;
    intervalRef.current = setInterval(() => {
      setElapsed(e => e + 1);
    }, 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div>
      <p>{elapsed}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
// WHY useRef instead of useState for intervalRef?
// The interval ID is implementation detail — it never needs to be displayed.
// If we stored it in state, every setInterval call would trigger a re-render.
```

### 5. useRef vs. useState — Choosing the Right Tool

```jsx
import { useRef, useState } from 'react';

function FormExample() {
  // useState: value is displayed → changes SHOULD trigger re-render
  const [name, setName] = useState('');

  // useRef: value is internal tracking → re-render NOT needed
  const renderCount = useRef(0);
  const hasFocused = useRef(false);

  renderCount.current += 1; // safe: doesn't cause another render

  function handleFocus() {
    if (!hasFocused.current) {
      console.log('First focus!');
      hasFocused.current = true; // just tracking, no UI update needed
    }
  }

  return (
    <div>
      <p>Renders: {renderCount.current}</p>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        onFocus={handleFocus}
      />
    </div>
  );
}

/*
RULE OF THUMB:
  Does the UI need to show the value?    → useState
  Is the value just internal tracking?   → useRef
  Do you need the previous render value? → useRef
  Is it a DOM node?                      → useRef
*/
```

### 6. Forwarding Refs to Child Components

```jsx
import { useRef, forwardRef } from 'react';

// forwardRef lets a parent reach into a child's DOM node.
// The child must opt in by wrapping with forwardRef.
const FancyInput = forwardRef(function FancyInput({ label, ...props }, ref) {
  return (
    <label>
      {label}
      <input
        ref={ref} // forwards the parent's ref to this DOM node
        className="fancy-input"
        {...props}
      />
    </label>
  );
});

function LoginForm() {
  const emailRef = useRef(null);

  function focusEmail() {
    emailRef.current.focus(); // directly focuses the <input> inside FancyInput
  }

  return (
    <form>
      <FancyInput ref={emailRef} label="Email" type="email" />
      <button type="button" onClick={focusEmail}>
        Go to email
      </button>
    </form>
  );
}
```

### 7. Callback Refs — When You Need to React to DOM Attachment

```jsx
import { useState, useCallback } from 'react';

// A callback ref is a function instead of a ref object.
// React calls it with the DOM node when it mounts, and null when it unmounts.
// Useful when you need to run code the moment a node appears in the DOM.

function MeasuredBox() {
  const [height, setHeight] = useState(0);

  // useCallback ensures we don't create a new function each render
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      // node is the actual DOM element
      setHeight(node.getBoundingClientRect().height);
    }
  }, []); // empty: function never changes

  return (
    <div>
      <div ref={measuredRef} style={{ padding: '20px' }}>
        This box is {Math.round(height)}px tall
      </div>
    </div>
  );
}

// When to use callback ref vs. useRef:
//   useRef: you just need access to the DOM node whenever
//   callback ref: you need to run code exactly when the DOM node attaches/detaches
```

---

## QUICK REFERENCE

| Use case | Tool |
|----------|------|
| Access DOM node (focus, scroll, measure) | `useRef` |
| Store interval/timeout ID | `useRef` |
| Track previous render value | `useRef` in `useEffect` |
| Value that displays in UI | `useState` |
| Let parent access child DOM | `forwardRef` |
| Run code when node attaches/detaches | callback ref |

**Key rules:**
- `.current` is mutable — assign directly, no setter needed
- Changing `.current` does NOT re-render the component
- Don't read or write `.current` during render (except initialization) — do it in event handlers or effects
- Initial value is only used on the first render; `useRef(x)` ignores `x` on subsequent renders
