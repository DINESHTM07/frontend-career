# Day 31 — Component Composition + Props Patterns + Children

**Status:** 📋 READY TO START
**Week:** 5 | **Theme:** React Basics

---

## What You'll Learn Today

Today you learn how professional React apps are structured.

Real production apps don't have one giant component that does everything. They have a **component library** — a set of small, reusable UI building blocks (Button, Card, Modal, Badge) that you assemble into pages.

The key concept is **composition**: you pass content into a component using the `children` prop, just like HTML elements can contain other elements.

By end of day you'll have:
- A reusable component library with Button, Card, Modal, and Badge
- Your Movie Search app refactored to use these components
- A clear mental model of when to extract a component and when not to

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/react/01-react-basics.md` — re-read the composition section
3. `week-05-react-basics/day-27/my-react-app/src/` — build the component library here

---

## Morning (8:00 – 11:00 AM) — Build a Reusable Component Library

Create a `src/components/` folder. Each component gets its own file.

---

### Component 1 — Button

Create `src/components/Button.jsx`:

```jsx
export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
}) {
  const variantStyles = {
    primary:   { background: "#4f46e5", color: "white",  border: "none" },
    secondary: { background: "white",   color: "#4f46e5", border: "2px solid #4f46e5" },
    danger:    { background: "#ef4444", color: "white",  border: "none" },
    ghost:     { background: "transparent", color: "#374151", border: "1px solid #d1d5db" },
  };

  const sizeStyles = {
    sm: { padding: "4px 12px",  fontSize: "13px" },
    md: { padding: "8px 20px",  fontSize: "14px" },
    lg: { padding: "12px 28px", fontSize: "16px" },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: "6px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        fontWeight: "500",
        transition: "opacity 0.15s",
      }}
    >
      {children}
    </button>
  );
}
```

**Test it:**
```jsx
import Button from './components/Button.jsx'

// In App.jsx temporarily:
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger" size="sm">Delete</Button>
<Button disabled>Disabled</Button>
```

`children` is the content between the opening and closing tags. It can be text, JSX, or other components.

---

### Component 2 — Card (with composition)

Create `src/components/Card.jsx`:

```jsx
export function Card({ children, style }) {
  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      overflow: "hidden",
      ...style
    }}>
      {children}
    </div>
  );
}

export function CardHeader({ children, style }) {
  return (
    <div style={{
      padding: "16px 20px",
      borderBottom: "1px solid #e5e7eb",
      fontWeight: "600",
      ...style
    }}>
      {children}
    </div>
  );
}

export function CardBody({ children, style }) {
  return (
    <div style={{ padding: "20px", ...style }}>
      {children}
    </div>
  );
}

export function CardFooter({ children, style }) {
  return (
    <div style={{
      padding: "12px 20px",
      borderTop: "1px solid #e5e7eb",
      background: "#f9fafb",
      ...style
    }}>
      {children}
    </div>
  );
}
```

Note: multiple named exports from one file. Import like:
```jsx
import { Card, CardHeader, CardBody, CardFooter } from './components/Card.jsx'
```

**Test it:**
```jsx
<Card>
  <CardHeader>User Profile</CardHeader>
  <CardBody>
    <p>Name: Dinesh</p>
    <p>Role: Frontend Developer</p>
  </CardBody>
  <CardFooter>
    <Button size="sm">Edit</Button>
  </CardFooter>
</Card>
```

This is composition: `Card` doesn't care what goes inside it — it just renders `{children}`.

---

### Component 3 — Modal

Create `src/components/Modal.jsx`:

```jsx
import { useEffect } from 'react'
import Button from './Button.jsx'

export default function Modal({ isOpen, onClose, title, children }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white", borderRadius: "12px",
          padding: "24px", maxWidth: "500px", width: "90%",
          maxHeight: "80vh", overflowY: "auto"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#666" }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

**Test it:**
```jsx
const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Open Modal</Button>
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Hello Modal">
  <p>This modal accepts children. Put anything here.</p>
  <Button variant="danger" onClick={() => setIsOpen(false)}>Close</Button>
</Modal>
```

**Things to note:**
- `if (!isOpen) return null` — renders nothing when closed (not invisible, truly not in the DOM)
- `e.stopPropagation()` on the inner div — prevents clicks inside the modal from closing it
- Escape key handler in `useEffect` — cleaned up when modal closes

---

### Component 4 — Badge

Create `src/components/Badge.jsx`:

```jsx
export default function Badge({ children, color = "gray" }) {
  const colors = {
    gray:    { background: "#f3f4f6", color: "#374151" },
    green:   { background: "#d1fae5", color: "#065f46" },
    red:     { background: "#fee2e2", color: "#991b1b" },
    yellow:  { background: "#fef3c7", color: "#92400e" },
    blue:    { background: "#dbeafe", color: "#1e40af" },
    purple:  { background: "#ede9fe", color: "#5b21b6" },
  };

  return (
    <span style={{
      ...colors[color],
      padding: "2px 10px",
      borderRadius: "9999px",
      fontSize: "12px",
      fontWeight: "500",
      display: "inline-block",
    }}>
      {children}
    </span>
  );
}
```

---

## Mid-Morning Break (11:00 – 11:20 AM)

You now have a real component library. Step away for a few minutes.

---

## Midday (11:20 AM – 1:00 PM) — Refactor Movie Search with Your Components

Open `src/MovieSearch.jsx`. Refactor it to use your new components.

Replace:
- Raw `<button>` tags → `<Button>` from your library
- The inline card divs → `<Card>`, `<CardBody>`, etc.
- The modal overlay code → `<Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.Title}>`
- Priority/type indicators → `<Badge>`

**Before:**
```jsx
<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", ... }}>
  <div style={{ background: "white", borderRadius: "12px", ... }}>
    <h2>{movie.Title}</h2>
    {children}
    <button onClick={onClose}>✕</button>
  </div>
</div>
```

**After:**
```jsx
<Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.Title}>
  <p>{selected?.Year} · {selected?.Type}</p>
  <Badge color="blue">{selected?.Type}</Badge>
</Modal>
```

The movie detail is now inside the Modal — `Modal` handles overlay, keyboard dismiss, click-outside, and the header. Your code just provides the content.

**This is why component libraries exist.** You write the close logic once, in one place, and reuse it everywhere.

---

## Afternoon (2:00 – 4:00 PM) — DSA

Open `dsa-bank/strings.md` (or continue `02-arrays-medium.md`). Solve **3 problems**.

Create `day-31-dsa.js` in the `day-31/` folder.

Also: review all your React code from this week so far. Can you explain every file, every hook call, every prop?

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- What is the `children` prop — when do you use it?
- Why would you build a `Button` component instead of just using `<button>`?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 31: Component library + refactored Movie App + 3 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Created `src/components/` folder
- [ ] Built `Button.jsx` — 4 variants (primary, secondary, danger, ghost) + 3 sizes
- [ ] Built `Card.jsx` — named exports: `Card`, `CardHeader`, `CardBody`, `CardFooter`
- [ ] Built `Modal.jsx` — accepts children, closes on Escape key, closes on overlay click
- [ ] Built `Badge.jsx` — 6 color variants
- [ ] All 4 components tested in `App.jsx` independently
- [ ] Refactored `MovieSearch.jsx` to use `Button`, `Modal`, `Badge`
- [ ] `MovieDetail` modal now uses the reusable `<Modal>` component
- [ ] Solved 3 DSA problems in `day-31-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference — Composition Patterns

```jsx
// Children prop — pass content between tags
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>

// Component receives children as a prop
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// Default props with =
function Button({ variant = "primary", size = "md", children }) { ... }

// Spreading styles/props
function Card({ children, style }) {
  return <div style={{ border: "1px solid #eee", ...style }}>{children}</div>;
}
// Usage: <Card style={{ maxWidth: "400px" }}>...</Card>

// Named exports for compound components
export function Card({ children }) { ... }
export function CardHeader({ children }) { ... }
// import { Card, CardHeader } from './components/Card'
```

---

*A component library is not extra work — it is the work that pays off on every future day of development.*
