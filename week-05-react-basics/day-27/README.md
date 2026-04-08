# Day 27 — React Setup + JSX + Your First Component

**Status:** 📋 READY TO START
**Week:** 5 | **Theme:** React Basics

---

## What You'll Learn Today

This is the first day of React. Do not rush it.

Before touching any React code, clear up the most common misconception: **React is not magic**. It's JavaScript. JSX is not HTML — it compiles to regular function calls. Components are regular functions. Props are regular function arguments.

Once that mental model is solid, everything else in the next 7 weeks follows naturally.

By end of day you'll have:
- A working React app running locally (built with Vite — the modern way)
- Written your first components from scratch
- Understood what JSX actually is under the hood
- Passed props between components and understood why it works

---

## FIRST: Set Up Your React Project

**Do this before reading anything else.**

### Step 1 — Create the project

Open the terminal in Cursor (**Ctrl + `** to toggle). Navigate to your day-27 folder:

```bash
cd week-05-react-basics/day-27
```

Then run:
```bash
npm create vite@latest my-react-app -- --template react
```

When it finishes, you'll see instructions to run 3 commands. Run them:

```bash
cd my-react-app
npm install
npm run dev
```

You'll see:
```
  VITE v5.x.x  ready in ~300ms
  ➜  Local:   http://localhost:5173/
```

### Step 2 — Open in browser

Go to **http://localhost:5173** — you should see the Vite + React welcome page with a spinning logo. That means it works.

### Step 3 — Clean the starter files

The default Vite starter has boilerplate you don't need. Delete these (right-click → delete in the Cursor file explorer):

- `src/App.css`
- `src/index.css`
- `src/assets/` folder
- `src/App.jsx` — delete this, you'll write your own

**Keep:**
- `src/main.jsx`
- `index.html`
- `package.json`
- `vite.config.js`

### Step 4 — Fix main.jsx

Open `src/main.jsx`. Remove the CSS import line. It should look like:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Step 5 — Create a blank App.jsx

Create `src/App.jsx` with just:

```jsx
export default function App() {
  return <h1>Hello React!</h1>
}
```

Save. The browser should auto-refresh and show "Hello React!" — that means your setup is working.

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/react/01-react-basics.md` — read before writing code
3. `cheatsheets/react/02-useState.md` — read before midday
4. `exercises/react-basics/20-mood-tracker.jsx` — midday
5. `week-05-react-basics/day-27/my-react-app/src/` — where you'll code

---

## Morning (8:00 – 11:00 AM) — JSX + Components + Props

### Step 1 — Read the cheatsheet first

Open `cheatsheets/react/01-react-basics.md`. Read the entire thing before writing any code. It covers what JSX is, how components work, and how props flow.

Come back here after reading.

---

### Step 2 — Understand JSX before you write it

JSX looks like HTML but it isn't. Under the hood this:

```jsx
function Greeting() {
  return <h1 className="title">Hello!</h1>
}
```

Is actually this:
```js
function Greeting() {
  return React.createElement("h1", { className: "title" }, "Hello!")
}
```

You write JSX because it's readable. React turns it into regular function calls. That's all.

**JSX rules you must memorize:**

| HTML | JSX equivalent |
|------|---------------|
| `class="..."` | `className="..."` |
| `for="..."` | `htmlFor="..."` |
| `<img>` | `<img />` (must close) |
| `onclick="..."` | `onClick={fn}` (camelCase, no quotes) |

And these JSX-specific rules:
- Return ONE root element (use `<div>` or `<>...</>` fragment wrapper)
- Put JavaScript expressions in `{}`: `<p>{name}</p>`, `<p>{2 + 2}</p>`
- No `if` inside JSX — use ternary `{x ? "a" : "b"}` or short-circuit `{x && <Comp />}`
- Inline style is a double-curly: `style={{ color: "red" }}` (outer `{}` = JS expression, inner `{}` = object)

---

### Step 3 — Build a GreetingCard in App.jsx

Replace `src/App.jsx` with:

```jsx
export default function App() {
  const name = "Dinesh";
  const role = "Frontend Developer";
  const about = "Building real apps, learning React from scratch.";

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>My React App</h1>
      <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", maxWidth: "400px" }}>
        <h2>{name}</h2>
        <p style={{ color: "#666" }}>{role}</p>
        <p>{about}</p>
      </div>
    </div>
  );
}
```

Save and confirm it renders in the browser with your name.

---

### Step 4 — Extract it into a ProfileCard component

Components exist so you can reuse UI with different data. Extract the card.

Create `src/ProfileCard.jsx`:

```jsx
export default function ProfileCard({ name, role, about, isNew }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      maxWidth: "400px",
      marginBottom: "16px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <h2 style={{ margin: 0 }}>{name}</h2>
        {isNew && (
          <span style={{ background: "#10b981", color: "white", fontSize: "12px", padding: "2px 8px", borderRadius: "12px" }}>
            NEW
          </span>
        )}
      </div>
      <p style={{ color: "#666", margin: "4px 0 12px" }}>{role}</p>
      <p style={{ margin: 0 }}>{about}</p>
    </div>
  );
}
```

Update `src/App.jsx` to import and render 3 cards:

```jsx
import ProfileCard from './ProfileCard.jsx'

export default function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Team</h1>
      <ProfileCard
        name="Dinesh"
        isNew
        role="Frontend Developer"
        about="Building real apps, learning React from scratch."
      />
      <ProfileCard
        name="Priya"
        role="UI Designer"
        about="Creating interfaces that actually make sense."
      />
      <ProfileCard
        name="Arjun"
        role="Backend Developer"
        about="APIs, databases, and server-side logic."
      />
    </div>
  );
}
```

**Confirm: three distinct cards appear in the browser.**

---

### Step 5 — Understand what props actually are

When you write `<ProfileCard name="Dinesh" isNew role="..." />`, React calls:
```js
ProfileCard({ name: "Dinesh", isNew: true, role: "...", about: "..." })
```

Props are a plain JavaScript object passed as the first argument. You destructure them in the function signature. `isNew` without a value is shorthand for `isNew={true}`.

That's it. Components are functions. Props are arguments. JSX is syntax sugar for function calls.

---

## Mid-Morning Break (11:00 – 11:20 AM)

Three cards on screen. First React components done. Step away.

---

## Midday (11:20 AM – 1:00 PM) — Mood Tracker Exercise

### Before starting: read useState cheatsheet

Open `cheatsheets/react/02-useState.md` and read it fully. You need to understand state before doing this exercise.

**The core idea:** In vanilla JS you mutate variables directly. In React you NEVER mutate state — you call a setter function and React re-renders:

```jsx
// WRONG — React won't re-render
let count = 0;
count++;

// CORRECT — React sees the change and re-renders
const [count, setCount] = useState(0);
setCount(count + 1);
```

### Open the exercise

Open `exercises/react-basics/20-mood-tracker.jsx`.

**Pattern: State Machine + Accumulation**

The tracker: click a mood (happy / neutral / sad), save the selection, accumulate a history of past entries.

**How to add exercise code to your React project:**

Create `src/MoodTracker.jsx`. Copy the exercise content into it (or work through it here), then import it in `App.jsx`:

```jsx
// App.jsx
import ProfileCard from './ProfileCard.jsx'
import MoodTracker from './MoodTracker.jsx'

export default function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Day 27 Components</h1>
      <MoodTracker />
      <hr />
      <h2>Team</h2>
      <ProfileCard name="Dinesh" isNew role="Frontend Developer" about="Building things." />
    </div>
  );
}
```

Work through INTRO → GUIDED → YOUR TURN in the exercise file.

---

## Lunch (1:00 – 2:00 PM)

---

## Afternoon (2:00 – 4:00 PM) — DSA (keep the habit going)

Open `dsa-bank/02-arrays-medium.md`. Solve **problems 1, 2, and 3**.

Create `day-27-dsa.js` in the `day-27/` folder (NOT inside the React project).

Pattern comment on every problem:
```js
// Problem: [name]
// Pattern: [pattern name + why this pattern fits]
// Time: O(?) | Space: O(?)
```

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- Explain JSX in one sentence as if talking to someone who has never coded
- What is the difference between a prop and a regular variable inside a component?
- React confidence today: 1-5

Then commit:
```bash
git add .
git commit -m "Day 27: First React app + ProfileCard + mood tracker + 3 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Created React project with Vite — running on localhost:5173
- [ ] Cleaned up default starter files
- [ ] Built `App.jsx` with greeting card using JSX variables
- [ ] Created `ProfileCard.jsx` as a separate component file
- [ ] Passed `name`, `role`, `about`, `isNew` as props — 3 cards display
- [ ] `isNew` badge renders conditionally with `&&` pattern
- [ ] Read `cheatsheets/react/02-useState.md`
- [ ] Completed `20-mood-tracker.jsx` exercise in `src/MoodTracker.jsx`
- [ ] Solved 3 array medium DSA problems in `day-27-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference — First Day Essentials

```jsx
// Component = function that returns JSX
export default function MyComponent({ name, count }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Count: {count}</p>
    </div>
  );
}

// Use it with props (like HTML attributes)
<MyComponent name="Dinesh" count={42} />

// Conditional render
{isAdmin && <AdminPanel />}
{error ? <ErrorMsg /> : <Content />}

// List render (always add key!)
{items.map(item => <li key={item.id}>{item.name}</li>)}

// Inline style (double braces)
<div style={{ color: "red", fontSize: "16px" }}>...</div>
```

---

*Today you rewired how you think about UI. It is no longer HTML — it is a JavaScript function that returns a description of what should appear on screen. Everything in React builds on that foundation.*
