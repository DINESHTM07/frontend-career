# Day 49 — TypeScript Basics for React

**Status:** 📋 READY TO START
**Week:** 8 | **Theme:** React Advanced + Dashboard Project

---

## Today's Goal

Learn TypeScript by converting real components — not by reading theory. By end of today you can type props, state, events, and function signatures in a React project.

By end of today:
- You have a working `react-ts` Vite project
- You understand: `interface` for props, typed `useState`, typed event handlers
- You've converted 5 JS components to TypeScript (exercise 30)
- You know what TypeScript errors look like and how to fix them

---

## What to Open

1. `cheatsheets/advanced/02-typescript-react.md`
2. `exercises/30-ts-translator.tsx`

---

## Morning (8:00 – 11:00 AM) — Read Cheatsheet + Set Up Project

### Step 1 — Read the Cheatsheet

Open `cheatsheets/advanced/02-typescript-react.md` and read it fully before touching code.

Focus on understanding these four patterns — they cover 90% of React TypeScript:

**Pattern 1 — Typing props with an interface:**
```tsx
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean  // ? means optional
}

function Button({ label, onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>
}
```

**Pattern 2 — Typing useState:**
```tsx
const [count, setCount] = useState<number>(0)
const [user, setUser] = useState<User | null>(null)
const [items, setItems] = useState<string[]>([])
```

TypeScript usually infers the type from the initial value — `useState(0)` is already typed as `number`. You only need the generic `<Type>` when the initial value is ambiguous (like `null` or `[]`).

**Pattern 3 — Typing event handlers:**
```tsx
// Input change
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value)
}

// Button click
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
}

// Form submit
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
}
```

**Pattern 4 — Typing children:**
```tsx
interface CardProps {
  children: React.ReactNode  // anything that can render
  title: string
}

function Card({ children, title }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

### Step 2 — Set Up a TypeScript React Project

```bash
npm create vite@latest ts-react -- --template react-ts
cd ts-react
npm install
npm run dev
```

Open the project. Notice the file extensions: `.tsx` for components (TSX = TypeScript + JSX), `.ts` for plain TypeScript files (no JSX).

Open `src/App.tsx`. Try adding a wrong prop type somewhere and watch the red underline appear immediately. That instant feedback is the entire point.

### Step 3 — Learn to Read TypeScript Errors

TypeScript errors look scary. They're verbose but they're always telling you one of:
- "This value might be `null` — handle that case"
- "You're passing the wrong type here"
- "This property doesn't exist on this type"
- "You forgot a required prop"

When you see a red underline: hover over it → read the first sentence of the error → ignore the rest if it's too long. The first sentence is almost always enough.

---

## Midday (11:20 AM – 1:30 PM) — Exercise 30: TS Translator

Open `exercises/30-ts-translator.tsx`. This exercise has 5 JavaScript components. Convert each to TypeScript.

### What "converting to TypeScript" means:

1. Rename the file from `.jsx` to `.tsx`
2. Add an `interface` for the component's props
3. Add types to `useState` calls where TypeScript can't infer them
4. Add types to event handlers
5. Fix any type errors TypeScript flags

### Example conversion:

```tsx
// BEFORE (JavaScript)
function ProductCard({ name, price, inStock, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)
  const handleClick = (e) => { onAddToCart(quantity) }
}

// AFTER (TypeScript)
interface ProductCardProps {
  name: string
  price: number
  inStock: boolean
  onAddToCart: (quantity: number) => void
}

function ProductCard({ name, price, inStock, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState<number>(1)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onAddToCart(quantity)
  }
}
```

Work through all 5 components. If you hit an error you can't solve:
1. Read the error (hover → first sentence)
2. Search: "TypeScript [the exact error]"
3. Check the cheatsheet
4. Last resort: `// @ts-ignore` with a comment explaining why

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-49-dsa.js` in this folder.

---

## TypeScript Patterns to Memorize

| What | TypeScript |
|------|-----------|
| Optional prop | `name?: string` |
| Union type | `status: 'loading' \| 'success' \| 'error'` |
| Array of strings | `tags: string[]` |
| Function prop, no return | `onClick: () => void` |
| Function prop with arg | `onChange: (value: string) => void` |
| Nullable state | `useState<User \| null>(null)` |
| Any renderable JSX | `children: React.ReactNode` |
| Input change event | `React.ChangeEvent<HTMLInputElement>` |
| Form submit event | `React.FormEvent<HTMLFormElement>` |

---

## End of Day Checklist

- [ ] Read `cheatsheets/advanced/02-typescript-react.md` fully
- [ ] Created `ts-react` Vite project with `--template react-ts`
- [ ] Intentionally introduced a type error — saw the red underline appear
- [ ] Completed all 5 components in exercise `30-ts-translator.tsx`
- [ ] Can type props, useState, and events without looking at the cheatsheet
- [ ] Completed 3 DSA problems in `day-49-dsa.js`

---

*TypeScript slows you down for the first two hours. Then it speeds you up forever — the editor tells you every mistake before you run anything.*
