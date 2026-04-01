# React Basics Cheatsheet

## CONCEPT
React is a UI library for building component-based interfaces. Components are functions that accept props and return JSX — a syntax extension that looks like HTML but compiles to `React.createElement()` calls.

---

## WHY IT MATTERS
Understanding JSX compilation, props flow, and rendering patterns is the foundation of everything in React. Every bug, every performance issue, every pattern builds on these primitives.

---

## EXAMPLES

### 1. JSX and What It Compiles To
```jsx
// What you write
const element = <h1 className="title">Hello, {name}</h1>;

// What Babel compiles it to
const element = React.createElement(
  'h1',
  { className: 'title' },
  'Hello, ',
  name
);

// Key rules:
// - className instead of class
// - htmlFor instead of for
// - camelCase event handlers: onClick, onChange
// - Expressions in {}, not statements
// - Must return a single root element (or Fragment)
```

### 2. Functional Component — Basic
```jsx
function Greeting() {
  return <h1>Hello, World!</h1>;
}

// Arrow function syntax (same thing)
const Greeting = () => <h1>Hello, World!</h1>;

// Usage
<Greeting />
```

### 3. Props — Passing and Receiving
```jsx
// Parent passes props
function App() {
  return <UserCard name="Alice" age={30} isAdmin={true} />;
}

// Child receives via parameter object
function UserCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Age: {props.age}</p>
      {props.isAdmin && <span>Admin</span>}
    </div>
  );
}
```

### 4. Props Destructuring (preferred pattern)
```jsx
// Destructure directly in the parameter
function UserCard({ name, age, isAdmin, role = 'user' }) {
  // role has a default value
  return (
    <div>
      <h2>{name}</h2>
      <p>{age} — {role}</p>
    </div>
  );
}

// Destructure with rename
function Button({ onClick: handleClick, label: text }) {
  return <button onClick={handleClick}>{text}</button>;
}
```

### 5. The Children Prop
```jsx
// children is whatever is between the opening and closing tags
function Card({ children, title }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage — anything inside becomes children
function App() {
  return (
    <Card title="Profile">
      <img src="avatar.png" alt="avatar" />
      <p>Bio text here</p>
    </Card>
  );
}
```

### 6. Component Composition
```jsx
// Build complex UIs from small, focused components
function Avatar({ src, alt }) {
  return <img src={src} alt={alt} className="avatar" />;
}

function UserInfo({ name, title }) {
  return (
    <div>
      <strong>{name}</strong>
      <span>{title}</span>
    </div>
  );
}

function UserCard({ user }) {
  return (
    <div className="user-card">
      <Avatar src={user.avatar} alt={user.name} />
      <UserInfo name={user.name} title={user.title} />
    </div>
  );
}

// Real-world: layout composition
function PageLayout({ sidebar, main, header }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{main}</main>
    </div>
  );
}
```

### 7. Conditional Rendering Patterns
```jsx
function StatusBadge({ status, userRole, count }) {
  // Pattern 1: Ternary — for binary conditions
  const label = status === 'active' ? 'Online' : 'Offline';

  // Pattern 2: && — render or nothing
  // WARNING: use !! or explicit boolean to avoid rendering "0"
  const hasItems = count > 0; // boolean, safe
  const wrongWay = count && <Badge />; // renders "0" when count is 0!
  const rightWay = count > 0 && <Badge />;

  // Pattern 3: Early return — for complex conditions
  if (!userRole) return null;
  if (userRole === 'banned') return <BannedMessage />;

  return (
    <div>
      <span>{label}</span>
      {hasItems && <span>{count} items</span>}
    </div>
  );
}

// Pattern 4: Variable assignment
function Notification({ type }) {
  let icon;
  if (type === 'error') icon = <ErrorIcon />;
  else if (type === 'success') icon = <CheckIcon />;
  else icon = <InfoIcon />;

  return <div>{icon} Notification</div>;
}
```

### 8. Rendering Lists with .map() and key
```jsx
const todos = [
  { id: 1, text: 'Learn React', done: true },
  { id: 2, text: 'Build projects', done: false },
];

function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        // key must be unique and stable — use database id, not index
        <li key={todo.id} style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// Nested lists — each level needs its own key
function CategoryList({ categories }) {
  return (
    <div>
      {categories.map(cat => (
        <div key={cat.id}>
          <h3>{cat.name}</h3>
          <ul>
            {cat.items.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

### 9. Fragments — Avoiding Unnecessary Wrappers
```jsx
// Problem: extra <div> breaks table structure
function TableRows() {
  return (
    <div> {/* WRONG — invalid inside <tbody> */}
      <tr><td>Row 1</td></tr>
      <tr><td>Row 2</td></tr>
    </div>
  );
}

// Solution 1: Fragment shorthand (no key support)
function TableRows() {
  return (
    <>
      <tr><td>Row 1</td></tr>
      <tr><td>Row 2</td></tr>
    </>
  );
}

// Solution 2: Fragment with key (required in .map())
function TableRows({ rows }) {
  return rows.map(row => (
    <React.Fragment key={row.id}>
      <tr><td>{row.name}</td></tr>
      <tr><td>{row.detail}</td></tr>
    </React.Fragment>
  ));
}
```

---

## COMMON MISTAKES

```jsx
// MISTAKE 1: Using index as key
items.map((item, index) => <li key={index}>{item}</li>)
// Why bad: if list reorders or items are added/removed, React gets confused
// Fix: use item.id or a stable unique value

// MISTAKE 2: Returning multiple elements without a wrapper
function Bad() {
  return (          // SyntaxError
    <h1>Title</h1>
    <p>Text</p>
  );
}
function Good() {
  return (
    <>
      <h1>Title</h1>
      <p>Text</p>
    </>
  );
}

// MISTAKE 3: Calling a component as a function instead of JSX
const result = MyComponent(); // WRONG — bypasses React's lifecycle
const result = <MyComponent />; // CORRECT

// MISTAKE 4: Forgetting that 0 is falsy but renders
{items.length && <List />} // Renders "0" when empty!
{items.length > 0 && <List />} // Correct
```

---

## INTERVIEW TIP

> **"What is JSX and why does React use it?"**

JSX is syntactic sugar over `React.createElement()`. It lets you write UI structure in a familiar HTML-like syntax, but it's just JavaScript — so you get full JS power (expressions, variables, functions) inside your markup. React doesn't require JSX, but it's the standard because it makes component trees far more readable than nested `createElement` calls.

> **"Why can't you return multiple elements from a component?"**

A function can only return one value. JSX compiles to a single `React.createElement()` call. Fragments solve this without adding real DOM nodes — they're a React-only concept that disappears in the final HTML.

> **"Why does `key` matter in lists?"**

React uses keys to identify which items changed, were added, or removed during reconciliation. Without stable keys, React may re-render or re-mount the wrong components — causing bugs with controlled inputs, animations, or component state.
