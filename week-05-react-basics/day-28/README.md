# Day 28 — useState Deep Dive + Events + Lists

**Status:** 📋 READY TO START
**Week:** 5 | **Theme:** React Basics

---

## What You'll Learn Today

Yesterday you glimpsed `useState`. Today you understand it fully.

State is what makes React components interactive. Without state, your component renders once and sits there. With state, clicking a button can change what's on screen — and React re-renders only what changed.

The traps that catch every beginner:
1. **State updates are not instant** — you won't see the new value on the same line as `setState`
2. **Never mutate state directly** — `state.push(item)` breaks React; use spread instead
3. **Functional updates** — when new state depends on old state, use `prev => prev + 1`

By end of day you'll understand all three and have built three real components.

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/react/02-useState.md` — re-read in full this morning
3. `week-05-react-basics/day-27/my-react-app/src/` — add today's components here

---

## Morning (8:00 – 11:00 AM) — Three Core Components

### Re-read the useState cheatsheet

Open `cheatsheets/react/02-useState.md` and read it again carefully. Pay extra attention to:
- **State is a snapshot** — each render has its own copy of state
- **Functional updates** — `setCount(prev => prev + 1)` vs `setCount(count + 1)`
- **Never mutate state directly** — always create new arrays/objects

---

### Build 1 — Counter Component

Create `src/Counter.jsx`:

```jsx
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(prev => prev + 1); // functional update — always safe
  }

  function decrement() {
    setCount(prev => prev - 1);
  }

  function reset() {
    setCount(0);
  }

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "200px" }}>
      <h2 style={{ margin: "0 0 16px" }}>Counter</h2>
      <p style={{ fontSize: "48px", textAlign: "center", margin: "0 0 16px" }}>{count}</p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={decrement} style={{ flex: 1, padding: "8px" }}>−</button>
        <button onClick={reset} style={{ flex: 1, padding: "8px" }}>Reset</button>
        <button onClick={increment} style={{ flex: 1, padding: "8px" }}>+</button>
      </div>
    </div>
  );
}
```

**Why `prev => prev + 1` instead of `count + 1`?**

If you call `setCount` multiple times in a row, `count` is still the OLD value in that render. Using `prev => prev + 1` always refers to the LATEST state. It's a good habit even when not strictly required.

---

### Build 2 — TodoList Component

Lists in React are rendered with `.map()` and MUST have a `key` prop. This is not optional.

Create `src/TodoList.jsx`:

```jsx
import { useState } from 'react'

export default function TodoList() {
  const [items, setItems] = useState([
    { id: 1, text: "Learn React" },
    { id: 2, text: "Build a project" },
  ]);
  const [inputValue, setInputValue] = useState("");

  function addItem() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // NEVER push directly to the array — create a new array
    setItems(prev => [
      ...prev,
      { id: Date.now(), text: trimmed }
    ]);
    setInputValue(""); // clear input after adding
  }

  function deleteItem(id) {
    // filter creates a new array — correct!
    setItems(prev => prev.filter(item => item.id !== id));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") addItem();
  }

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "400px" }}>
      <h2 style={{ margin: "0 0 16px" }}>Todo List ({items.length})</h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          style={{ flex: 1, padding: "8px", fontSize: "14px" }}
        />
        <button onClick={addItem} style={{ padding: "8px 16px" }}>Add</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map(item => (
          <li key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <span>{item.text}</span>
            <button onClick={() => deleteItem(item.id)} style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer" }}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Key points here:**
- `value={inputValue}` + `onChange={e => setInputValue(e.target.value)}` = controlled input. React owns the value.
- `key={item.id}` — React uses this to track which item is which. Never use array index as key if items can be deleted or reordered.
- `...prev` spread — creates a new array. Never `prev.push(...)` directly.

---

### Build 3 — ColorPicker Component

Create `src/ColorPicker.jsx`:

```jsx
import { useState } from 'react'

const COLORS = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Emerald", value: "#10b981" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Sky", value: "#0ea5e9" },
];

export default function ColorPicker() {
  const [selected, setSelected] = useState(COLORS[0]);

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "300px" }}>
      <h2 style={{ margin: "0 0 16px" }}>Color Picker</h2>

      <div style={{
        height: "80px",
        borderRadius: "8px",
        background: selected.value,
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold"
      }}>
        {selected.name}
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {COLORS.map(color => (
          <button
            key={color.value}
            onClick={() => setSelected(color)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: color.value,
              border: selected.value === color.value ? "3px solid #000" : "3px solid transparent",
              cursor: "pointer"
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

---

### Wire them all up in App.jsx

```jsx
import Counter from './Counter.jsx'
import TodoList from './TodoList.jsx'
import ColorPicker from './ColorPicker.jsx'

export default function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <Counter />
      <TodoList />
      <ColorPicker />
    </div>
  );
}
```

Confirm all three work independently. Each component manages its own state.

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:00 PM) — Shopping List App

Build a complete Shopping List app in `src/ShoppingList.jsx`. This is more complex than the TodoList — it has quantity tracking, editing, and totaling.

### Features to build:

1. **Add item** — input for name + quantity (number input), submit with button or Enter
2. **Display list** — item name, quantity badge
3. **Edit quantity** — click a `+` / `−` button to change quantity
4. **Remove item** — delete button with confirmation (`window.confirm`)
5. **Total count** — "X items in your list" at the top
6. **Clear all** — button that empties the list (with confirmation)

### Starter structure:

```jsx
import { useState } from 'react'

function createItem(name, quantity) {
  return { id: Date.now(), name, quantity: Number(quantity) };
}

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [qtyInput, setQtyInput] = useState(1);

  function addItem() {
    if (!nameInput.trim()) return;
    setItems(prev => [...prev, createItem(nameInput.trim(), qtyInput)]);
    setNameInput("");
    setQtyInput(1);
  }

  function removeItem(id) {
    if (!window.confirm("Remove this item?")) return;
    setItems(prev => prev.filter(item => item.id !== id));
  }

  function changeQty(id, delta) {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  }

  function clearAll() {
    if (!window.confirm("Clear all items?")) return;
    setItems([]);
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "500px" }}>
      <h1>Shopping List</h1>
      <p>{items.length} products · {totalItems} total items</p>

      {/* YOUR TURN: build the add form and list rendering here */}
    </div>
  );
}
```

Complete the UI yourself — add form inputs, the list rendering with `.map()`, the `+`/`−` quantity buttons, and the remove button. Use the patterns from the TodoList.

---

## Lunch (1:00 – 2:00 PM)

---

## Afternoon (2:00 – 4:00 PM) — DSA + Code Review

Open `dsa-bank/02-arrays-medium.md`. Solve **problems 4, 5, and 6**.

Create `day-28-dsa.js` in the `day-28/` folder (not inside the React project).

Also: open your `src/App.jsx` from this morning. Can you explain every single line? If not, re-read it until you can. This is important — never move forward with code you don't understand.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- What is the difference between `setCount(count + 1)` and `setCount(prev => prev + 1)`?
- Why can't you do `items.push(newItem)` in React?
- What does the `key` prop do and why does it matter?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 28: useState mastery - counter, todo, shopping list + 3 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Re-read `cheatsheets/react/02-useState.md`
- [ ] Built `Counter.jsx` — increment, decrement, reset all work
- [ ] Using functional update `prev => prev + 1` (not `count + 1`)
- [ ] Built `TodoList.jsx` — add with input, render with `.map()`, delete with `.filter()`
- [ ] Controlled input: `value={inputValue}` + `onChange` wired correctly
- [ ] `key` prop on every list item (using `item.id`, not array index)
- [ ] Built `ColorPicker.jsx` — clicking a swatch updates the preview
- [ ] Built `ShoppingList.jsx` — add, quantity edit, remove, total, clear all working
- [ ] Solved 3 array medium DSA problems in `day-28-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference — useState Patterns

```jsx
// Basic
const [value, setValue] = useState(initialValue);

// Functional update (preferred when new state depends on old)
setValue(prev => prev + 1);

// Update object in state — always spread!
setValue(prev => ({ ...prev, name: "new name" }));

// Add to array — always create new array!
setValue(prev => [...prev, newItem]);

// Remove from array
setValue(prev => prev.filter(item => item.id !== targetId));

// Update one item in array
setValue(prev => prev.map(item =>
  item.id === targetId ? { ...item, quantity: item.quantity + 1 } : item
));

// Controlled input
const [text, setText] = useState("");
<input value={text} onChange={e => setText(e.target.value)} />
```

---

*State is the heart of React. Master these patterns — spreading, filtering, mapping — and you can build almost anything.*
