# useState Cheatsheet

## CONCEPT
`useState` is a hook that adds reactive state to a functional component. When state changes, React re-renders the component with the new value. The hook returns a tuple: the current state value and a setter function.

```jsx
const [value, setValue] = useState(initialValue);
```

---

## WHY IT MATTERS
State is what makes a UI dynamic. Without it, components are just static templates. `useState` is the most-used hook — mastering its patterns and pitfalls separates juniors from seniors.

---

## EXAMPLES

### 1. Primitive State (number, string, boolean)
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <Modal />}
    </div>
  );
}
```

### 2. Object State
```jsx
function ProfileForm() {
  const [user, setUser] = useState({ name: '', email: '', age: 0 });

  // MUST spread — never mutate state directly
  const updateName = (e) => {
    setUser({ ...user, name: e.target.value });
  };

  // Generic field updater
  const handleChange = (field) => (e) => {
    setUser(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <form>
      <input value={user.name} onChange={handleChange('name')} />
      <input value={user.email} onChange={handleChange('email')} />
    </form>
  );
}
```

### 3. Array State — Add, Remove, Update
```jsx
function TodoApp() {
  const [todos, setTodos] = useState([]);

  // Add: spread existing, append new
  const addTodo = (text) => {
    setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
  };

  // Remove: filter out
  const removeTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Update: map and replace
  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
          {todo.text}
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

### 4. Functional Updates — `prev => prev + 1`
```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // WRONG: uses count from closure, can be stale
  const handleWrong = () => {
    setCount(count + 1);
    setCount(count + 1); // still uses same count!
    // result: +1, not +2
  };

  // CORRECT: always gets latest state
  const handleCorrect = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); // gets updated prev
    // result: +2
  };

  // Use functional update when new state depends on old state
  return <button onClick={handleCorrect}>Count: {count}</button>;
}
```

### 5. State Batching (React 18+)
```jsx
function Example() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const handleClick = () => {
    // React 18: ALL of these are batched → only ONE re-render
    setA(1);
    setB(2);
    // Before React 18: event handlers were batched, but not async callbacks

    // React 18 also batches inside setTimeout, fetch, etc.
    setTimeout(() => {
      setA(prev => prev + 1); // batched in React 18
      setB(prev => prev + 1); // batched in React 18
    }, 1000);
  };

  return <button onClick={handleClick}>Trigger</button>;
}
```

### 6. Lazy Initialization — Expensive Initial Value
```jsx
// WRONG: getExpensiveValue() runs on EVERY render
const [data, setData] = useState(getExpensiveValue());

// CORRECT: pass a function — only called once on mount
const [data, setData] = useState(() => getExpensiveValue());

// Real example: reading from localStorage
function Settings() {
  const [theme, setTheme] = useState(() => {
    // localStorage read only happens once
    return localStorage.getItem('theme') ?? 'light';
  });

  return <button onClick={() => setTheme('dark')}>Dark Mode</button>;
}
```

### 7. Derived State — Don't Duplicate
```jsx
// WRONG: duplicating state that can be derived
function CartSummary() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0); // redundant!

  // CORRECT: derive from existing state during render
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const itemCount = items.length;
  const isEmpty = items.length === 0;

  return <div>Total: ${total} ({itemCount} items)</div>;
}
```

### 8. Multiple State Variables vs One Object
```jsx
// Prefer MULTIPLE state variables for unrelated data
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // These don't need to be grouped — they change independently
}

// Use ONE object when state ALWAYS changes together
function Position() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPos({ x: e.clientX, y: e.clientY }); // always both change
  };
}
```

### 9. useState vs useRef for Values
```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0); // re-render on change → display
  const intervalRef = useRef(null);           // no re-render → internal tracking

  const start = () => {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const stop = () => clearInterval(intervalRef.current);

  // Rules:
  // useState: value needs to be displayed or affect render
  // useRef: value is purely internal (timer IDs, DOM refs, previous values)
}
```

### 10. Lifting State Up
```jsx
// When two siblings need to share state, lift it to their parent

// WRONG: each has own state, can't sync
function TemperatureInput({ label }) {
  const [temp, setTemp] = useState(0); // isolated
}

// CORRECT: parent owns state, passes down
function TemperatureConverter() {
  const [celsius, setCelsius] = useState(0);
  const fahrenheit = (celsius * 9/5) + 32;

  return (
    <>
      <input value={celsius} onChange={e => setCelsius(Number(e.target.value))} />
      <input value={fahrenheit} readOnly />
    </>
  );
}
```

---

## COMMON MISTAKES

```jsx
// MISTAKE 1: Mutating state directly
const [items, setItems] = useState([]);
items.push(newItem);        // WRONG — React won't re-render
setItems([...items, newItem]); // CORRECT

// MISTAKE 2: Mutating nested object
const [user, setUser] = useState({ address: { city: 'NY' } });
user.address.city = 'LA';   // WRONG — same reference, no re-render
setUser({ ...user, address: { ...user.address, city: 'LA' } }); // CORRECT

// MISTAKE 3: Stale state in closures (async)
function BadCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // WRONG: count is stale — always 0 + 1
    }, 1000);
    return () => clearInterval(id);
  }, []); // empty deps means count never updates in closure
}

function GoodCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(prev => prev + 1); // CORRECT: functional update
    }, 1000);
    return () => clearInterval(id);
  }, []);
}

// MISTAKE 4: Setting state during render
function Bad() {
  const [x, setX] = useState(0);
  setX(1); // WRONG — infinite render loop
}
```

---

## INTERVIEW TIP

> **"What's the difference between `setCount(count + 1)` and `setCount(prev => prev + 1)`?"**

The direct form uses the `count` value captured in the current closure — which may be stale if multiple updates happen in the same event, or if the update is inside a `setTimeout` or `useEffect`. The functional form always receives the latest state as `prev`, so it's safe for any scenario where new state depends on old state. As a rule: if you're using the previous value, always use the functional form.

> **"When does React re-render?"**

When `setState` is called with a value that is not reference-equal to the current state (`Object.is` comparison). For objects and arrays, this is why you must always create a new reference — spreading, mapping, filtering — never mutating in place.
