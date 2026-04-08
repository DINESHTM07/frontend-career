# Day 36 — useReducer + Complex State

**Status:** 📋 READY TO START
**Week:** 6 | **Theme:** React Intermediate

---

## What You'll Learn Today

`useState` is great for simple, independent values. But some state is complex — multiple related fields that change together, or update logic that belongs in one place, not scattered across handlers.

`useReducer` is the answer. It takes your state updates out of your components and puts them in a pure function called a **reducer**. Every change is an **action** — a plain object describing what happened. The reducer decides how the state changes in response.

The pattern looks like this:
```
dispatch({ type: "ADD_ITEM", payload: item })
         ↓
reducer(currentState, action) → newState
         ↓
Component re-renders with newState
```

**When to use `useReducer` instead of `useState`:**
- State has 3+ related values that change together
- Multiple actions that produce the same state shape
- You want to test state logic independently of the component
- The update logic is complex enough that it deserves its own function

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/react/05-useReducer.md` — read before coding
3. `exercises/react-basics/23-budget-tracker.jsx` — midday
4. Your existing `TodoList.jsx` — afternoon refactor

---

## Morning (8:00 – 11:00 AM) — useReducer from Scratch

### Step 1 — Read the cheatsheet

Open `cheatsheets/react/05-useReducer.md`. Read the whole thing.

Key things to understand:
- Reducers must be **pure functions** — same input, always same output, no side effects
- **Actions** are plain objects with a `type` and optional `payload`
- `dispatch` sends an action to the reducer
- The reducer `switch` pattern — one case per action type

---

### Step 2 — See the pattern clearly

Compare `useState` vs `useReducer` for the same logic:

```jsx
// === WITH useState (gets messy fast) ===
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);

function addItem(item) {
  setItems(prev => [...prev, item]);
  setTotal(prev => prev + item.price);
}

function removeItem(id) {
  const item = items.find(i => i.id === id);
  setItems(prev => prev.filter(i => i.id !== id));
  setTotal(prev => prev - item.price);       // bug-prone: state might be stale
}

// === WITH useReducer (clean, explicit, testable) ===
const initialState = { items: [], total: 0 };

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        items: [...state.items, action.payload],
        total: state.total + action.payload.price
      };
    case "REMOVE_ITEM": {
      const item = state.items.find(i => i.id === action.payload);
      return {
        items: state.items.filter(i => i.id !== action.payload),
        total: state.total - item.price
      };
    }
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

// In component:
const [state, dispatch] = useReducer(cartReducer, initialState);

dispatch({ type: "ADD_ITEM", payload: { id: 1, name: "Book", price: 299 } });
dispatch({ type: "REMOVE_ITEM", payload: 1 });
dispatch({ type: "CLEAR" });
```

The reducer is a plain function — you can test it without React at all:
```js
const newState = cartReducer(initialState, { type: "ADD_ITEM", payload: { id: 1, price: 299 } });
console.log(newState.total); // 299 — testable without mounting a component!
```

---

### Step 3 — Build a Shopping Cart with useReducer

Create `src/pages/CartPage.jsx`:

```jsx
import { useReducer } from 'react'

const PRODUCTS = [
  { id: 1, name: "React Book", price: 599 },
  { id: 2, name: "CSS Masterclass", price: 399 },
  { id: 3, name: "Node.js Guide", price: 499 },
  { id: 4, name: "Tailwind Course", price: 299 },
];

const initialState = {
  items: [],    // { id, name, price, quantity }
  total: 0
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        // Already in cart — increment quantity
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
          total: state.total + action.payload.price
        };
      }
      // New item
      return {
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price
      };
    }
    case "REMOVE_FROM_CART": {
      const item = state.items.find(i => i.id === action.payload);
      return {
        items: state.items.filter(i => i.id !== action.payload),
        total: state.total - (item.price * item.quantity)
      };
    }
    case "INCREMENT": {
      const item = state.items.find(i => i.id === action.payload);
      return {
        items: state.items.map(i =>
          i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
        total: state.total + item.price
      };
    }
    case "DECREMENT": {
      const item = state.items.find(i => i.id === action.payload);
      if (item.quantity === 1) {
        // Remove entirely when quantity reaches 0
        return {
          items: state.items.filter(i => i.id !== action.payload),
          total: state.total - item.price
        };
      }
      return {
        items: state.items.map(i =>
          i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
        ),
        total: state.total - item.price
      };
    }
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

export default function CartPage() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

      {/* Product list */}
      <div>
        <h2>Products</h2>
        {PRODUCTS.map(product => (
          <div key={product.id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontWeight: "600" }}>{product.name}</p>
              <p style={{ margin: "4px 0 0", color: "#6b7280" }}>₹{product.price}</p>
            </div>
            <button
              onClick={() => dispatch({ type: "ADD_TO_CART", payload: product })}
              style={{ padding: "8px 16px", background: "#4f46e5", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div>
        <h2>Cart ({state.items.length} items)</h2>
        {state.items.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>Cart is empty</p>
        ) : (
          <>
            {state.items.map(item => (
              <div key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "12px", marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontWeight: "600" }}>{item.name}</span>
                  <button
                    onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "16px" }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button onClick={() => dispatch({ type: "DECREMENT", payload: item.id })} style={{ width: "28px", height: "28px", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch({ type: "INCREMENT", payload: item.id })} style={{ width: "28px", height: "28px", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }}>+</button>
                  <span style={{ marginLeft: "auto", color: "#6b7280" }}>₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
            <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "16px", marginTop: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "18px", marginBottom: "12px" }}>
                <span>Total</span>
                <span>₹{state.total}</span>
              </div>
              <button
                onClick={() => dispatch({ type: "CLEAR_CART" })}
                style={{ width: "100%", padding: "10px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
```

Add to `App.jsx`:
```jsx
<Route path="/cart" element={<CartPage />} />
```

Test: add items, increment/decrement quantities, remove, clear. The total updates correctly because the reducer always computes it from the action — no stale state bugs.

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:00 PM) — Budget Tracker Exercise

### `exercises/react-basics/23-budget-tracker.jsx`

**Pattern: State Machine**

This builds a budget tracker with income and expenses. Actions:
- `ADD_INCOME` — add an income entry with amount and description
- `ADD_EXPENSE` — add an expense entry
- `DELETE_ENTRY` — remove by id
- `SET_CATEGORY_FILTER` — filter entries by category

Create `src/pages/BudgetTracker.jsx` and work through the exercise here.

The reducer should maintain:
```js
{
  entries: [],       // { id, type: "income"|"expense", amount, description, category, date }
  balance: 0,        // total income - total expenses
  filter: "all"      // "all" | "income" | "expense"
}
```

Work through INTRO → GUIDED → YOUR TURN.

---

## Afternoon (2:00 – 4:00 PM) — Refactor TodoList + DSA

### Convert TodoList from useState to useReducer

Open your existing `src/TodoList.jsx`. Rewrite it using `useReducer`:

```jsx
const initialState = { todos: [], filter: "all" };

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD":    return { ...state, todos: [...state.todos, { id: Date.now(), text: action.payload, completed: false }] };
    case "TOGGLE": return { ...state, todos: state.todos.map(t => t.id === action.payload ? { ...t, completed: !t.completed } : t) };
    case "DELETE": return { ...state, todos: state.todos.filter(t => t.id !== action.payload) };
    case "SET_FILTER": return { ...state, filter: action.payload };
    default: return state;
  }
}
```

Notice how much cleaner each action is compared to separate `setItems`, `setFilter` etc. calls.

### DSA

Open `dsa-bank/recursion.md`. Solve **problems 9, 10, and 11**.

Create `day-36-dsa.js` in the `week-06-react-intermediate/day-36/` folder.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- What is the shape of an action object? What are `type` and `payload`?
- Why must reducers be pure functions?
- Give a concrete example of a situation where `useReducer` is better than `useState`
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 36: useReducer + budget tracker + 3 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Read `cheatsheets/react/05-useReducer.md` in full
- [ ] Understood: `dispatch(action)` → `reducer(state, action)` → `newState` → re-render
- [ ] Built `CartPage.jsx` with 5 action types (ADD, REMOVE, INCREMENT, DECREMENT, CLEAR)
- [ ] Cart total recalculates correctly on every action
- [ ] Adding a product already in cart increments quantity (not duplicates)
- [ ] Decrementing to 0 removes the item entirely
- [ ] Completed `23-budget-tracker.jsx` — income/expense/balance tracking
- [ ] Refactored `TodoList.jsx` from `useState` to `useReducer`
- [ ] Solved 3 DSA problems in `day-36-dsa.js`
- [ ] Committed and pushed

---

## Quick Reference — useReducer

```jsx
// 1. Define initial state
const initialState = { items: [], total: 0 };

// 2. Write the reducer (pure function)
function reducer(state, action) {
  switch (action.type) {
    case "ADD":    return { ...state, items: [...state.items, action.payload] };
    case "REMOVE": return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case "RESET":  return initialState;
    default:       return state;
  }
}

// 3. Use it in your component
const [state, dispatch] = useReducer(reducer, initialState);

// 4. Dispatch actions
dispatch({ type: "ADD",    payload: { id: 1, name: "Book" } });
dispatch({ type: "REMOVE", payload: 1 });
dispatch({ type: "RESET" });

// Access state
state.items   // the array
state.total   // the total
```

---

*Redux — the state management library used in most large React apps — is just useReducer + Context + some conventions. You just built the core of it from scratch.*
