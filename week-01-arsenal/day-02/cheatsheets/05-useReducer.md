# useReducer Cheatsheet

## CONCEPT
`useReducer` is an alternative to `useState` for managing state that involves multiple sub-values or complex update logic. It separates *what happened* (an action) from *how state changes* (a reducer function).

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

The reducer is a pure function: `(state, action) => newState`

---

## WHY IT MATTERS
When state logic gets complex — many related pieces, many ways to update, state that depends on other state — `useState` leads to scattered update logic and prop-drilling of setters. `useReducer` centralizes all updates in one predictable function, making state changes easier to trace, test, and reason about.

---

## EXAMPLES

### 1. When to Use Instead of useState

```
USE useState when:
  ✓ Simple, independent values (boolean, string, number)
  ✓ 1-2 update operations
  ✓ Next state doesn't depend on previous in complex ways

USE useReducer when:
  ✓ 3+ related state values that change together
  ✓ Multiple ways to update the same state (add, remove, update, reset)
  ✓ Next state depends on the CURRENT state in complex logic
  ✓ Update logic needs to be tested independently of components
  ✓ Sharing update logic between components
```

### 2. Basic Reducer — Counter
```jsx
// Action types as constants prevent typos
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
const RESET = 'RESET';

// Reducer: pure function, no side effects
function counterReducer(state, action) {
  switch (action.type) {
    case INCREMENT:
      return { count: state.count + (action.amount ?? 1) };
    case DECREMENT:
      return { count: state.count - (action.amount ?? 1) };
    case RESET:
      return { count: 0 };
    default:
      throw new Error(`Unknown action: ${action.type}`);
      // Throw on unknown actions to catch typos early
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: INCREMENT })}>+1</button>
      <button onClick={() => dispatch({ type: INCREMENT, amount: 5 })}>+5</button>
      <button onClick={() => dispatch({ type: DECREMENT })}>-1</button>
      <button onClick={() => dispatch({ type: RESET })}>Reset</button>
    </div>
  );
}
```

### 3. Real-World Example — Form State
```jsx
const initialFormState = {
  values: { name: '', email: '', message: '' },
  errors: {},
  isSubmitting: false,
  isSuccess: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: '' }, // clear field error on change
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, errors: {} };
    case 'SUBMIT_SUCCESS':
      return { ...initialFormState, isSuccess: true };
    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, errors: action.errors };
    case 'RESET':
      return initialFormState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function ContactForm() {
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  const handleChange = (e) => {
    dispatch({ type: 'SET_FIELD', field: e.target.name, value: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_START' });
    try {
      await submitForm(state.values);
      dispatch({ type: 'SUBMIT_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'SUBMIT_ERROR', errors: err.fieldErrors });
    }
  };

  if (state.isSuccess) return <p>Thanks! We'll be in touch.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={state.values.name} onChange={handleChange} />
      {state.errors.name && <span>{state.errors.name}</span>}
      <button disabled={state.isSubmitting}>
        {state.isSubmitting ? 'Sending...' : 'Submit'}
      </button>
    </form>
  );
}
```

### 4. Action Types Pattern — Avoid Typos
```jsx
// Option A: constants (traditional)
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
};

// Option B: TypeScript discriminated union (if using TS)
type Action =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'CLEAR_CART' };
// TypeScript will error on unknown action types — no magic strings

// Both give autocomplete + catch typos
dispatch({ type: ACTIONS.ADD_ITEM, item: newItem });
```

### 5. Shopping Cart — Complex State
```jsx
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, qty: action.qty } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

function Cart() {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });
  const total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  // dispatch is stable — won't cause re-renders when passed down
}
```

### 6. useReducer + useContext — Global State Pattern
```jsx
// store.jsx — combines reducer with context for Redux-like global state
const StoreContext = createContext(null);

const initialState = {
  user: null,
  cart: { items: [] },
  theme: 'light',
};

function rootReducer(state, action) {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.user };
    case 'ADD_TO_CART': return { ...state, cart: cartReducer(state.cart, action) };
    case 'SET_THEME': return { ...state, theme: action.theme };
    default: throw new Error(`Unknown action: ${action.type}`);
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);

// Usage: any component can read and dispatch
function AddToCartButton({ product }) {
  const { dispatch } = useStore();
  return (
    <button onClick={() => dispatch({ type: 'ADD_TO_CART', item: product })}>
      Add to Cart
    </button>
  );
}
```

### 7. useState vs useReducer Decision Tree
```
Q: Is state a single primitive (boolean, number, string)?
  → useState

Q: Are there 2+ update operations that all need the SAME state pieces?
  → useReducer

Q: Does setting one thing require reading/updating another?
  → useReducer

Q: Do you need to test state logic separately from UI?
  → useReducer (pure function, easy to unit test)

Q: Is state being passed as multiple setters to deep children?
  → useReducer + useContext (dispatch is one stable reference)

Q: Is state simple, local, and only has 1-2 updates?
  → useState (don't over-engineer)
```

---

## COMMON MISTAKES

```jsx
// MISTAKE 1: Mutating state in the reducer
function badReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      state.items.push(action.item); // MUTATION — React won't re-render!
      return state;                  // Same reference
  }
}
// Fix: always return a NEW object
function goodReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, items: [...state.items, action.item] };
  }
}

// MISTAKE 2: Putting async logic in the reducer
// Reducers must be PURE — no API calls, no side effects
function badReducer(state, action) {
  case 'FETCH':
    fetch('/api/data').then(...); // WRONG
    return state;
}
// Fix: do async work before dispatching
async function handleFetch() {
  const data = await fetch('/api/data').then(r => r.json());
  dispatch({ type: 'SET_DATA', data }); // dispatch the result
}

// MISTAKE 3: Dispatching inside render
function Bad() {
  const [state, dispatch] = useReducer(reducer, initial);
  dispatch({ type: 'SOMETHING' }); // WRONG — infinite loop
  return <div />;
}
// Dispatch belongs in event handlers and effects, not render

// MISTAKE 4: No default case / silent failure
function reducer(state, action) {
  switch (action.type) {
    case 'INC': return { count: state.count + 1 };
    // Missing default: unknown actions silently return undefined!
  }
}
// Fix: always include default that throws
default: throw new Error(`Unhandled action: ${action.type}`);
```

---

## INTERVIEW TIP

> **"When would you choose useReducer over useState?"**

When state has multiple sub-values that change together, when there are multiple ways to update state (add, remove, update, reset), or when the next state depends on complex logic involving current state. `useReducer` centralizes update logic in one pure function — making it testable in isolation, predictable, and easy to debug by logging actions. It's also better when passing update logic deep into a tree, since a single `dispatch` function is more ergonomic than multiple setters.

> **"What makes a good reducer?"**

A reducer should be a pure function — no API calls, no side effects, no mutations. Given the same state and action, it must always return the same new state. This makes it easy to test, replay, and reason about. All async work (fetching, timers) happens outside the reducer; only the result is dispatched.

> **"How is this similar to Redux?"**

The pattern is identical — `(state, action) => newState`, action objects with a `type`, `dispatch` to trigger updates. The difference is scope: `useReducer` is local to a component subtree, while Redux is a global singleton with middleware, dev tools, and a strict single-store architecture.
