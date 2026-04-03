# TypeScript for React Developers Cheatsheet

---

## CONCEPT

TypeScript adds static types to JavaScript, catching bugs at compile time instead of runtime. In React, this means typed props, typed state, typed event handlers, and typed API responses — all checked before your code runs. You're not fighting the compiler; you're letting it find mistakes before users do.

**Key mental model:** Types describe the _shape_ of data. Write types for what flows into and out of your components.

---

## WHY IT MATTERS

- Catches bugs before runtime (null checks, wrong prop types, misspelled keys).
- IDE autocomplete and IntelliSense become dramatically better.
- Self-documenting code — reading a type tells you exactly what a function expects.
- Required at most mid-to-senior level frontend roles.
- TypeScript is the default in Next.js, Vite, and CRA setups.

---

## EXAMPLES

### 1. Typing props with interface

```tsx
// Prefer interface for component props (extensible, clear error messages)
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean         // Optional prop
  variant?: 'primary' | 'secondary' | 'danger'
}

export function Button({ label, onClick, disabled = false, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={`btn-${variant}`}>
      {label}
    </button>
  )
}
```

### 2. interface vs type

```tsx
// interface — for object shapes, component props, extendable
interface User {
  id: number
  name: string
  email: string
}

interface AdminUser extends User {  // Extend with 'extends'
  role: 'admin'
}

// type — for unions, intersections, primitives, computed types
type Status = 'loading' | 'success' | 'error'  // Union — use type
type ID = string | number                        // Union — use type

type UserWithStatus = User & { status: Status } // Intersection

// Rule of thumb: interface for object shapes, type for everything else
```

### 3. Typing useState

```tsx
import { useState } from 'react'

// TypeScript infers from initial value when possible
const [count, setCount] = useState(0)          // number inferred
const [name, setName] = useState('')           // string inferred
const [active, setActive] = useState(false)   // boolean inferred

// Explicit generic when initial value is null/undefined or a union
const [user, setUser] = useState<User | null>(null)
const [posts, setPosts] = useState<Post[]>([])

// Complex state with interface
interface FormState {
  username: string
  email: string
  loading: boolean
}

const [form, setForm] = useState<FormState>({
  username: '',
  email: '',
  loading: false,
})
```

### 4. Typing event handlers

```tsx
// onClick — MouseEvent
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault()
  console.log(e.currentTarget.id)
}

// onChange for input — ChangeEvent
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setValue(e.target.value)
}

// onChange for select
function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
  setOption(e.target.value)
}

// onSubmit — FormEvent
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  // ...
}

// Inline (type is inferred from the element)
<input onChange={(e) => setValue(e.target.value)} />
<form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
```

### 5. Typing API responses

```tsx
interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

async function fetchPost(id: number): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json() as Promise<Post>
}

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('/api/posts')
  return res.json()
}

// In a component
const [post, setPost] = useState<Post | null>(null)
useEffect(() => {
  fetchPost(1).then(setPost)
}, [])
```

### 6. Typing custom hooks return values

```tsx
// Explicit return type keeps the hook's contract clear
interface UseFetchReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

function useFetch<T>(url: string): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch(url)
      const json: T = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [url])

  return { data, loading, error, refetch: fetchData }
}

// Usage
const { data: posts, loading } = useFetch<Post[]>('/api/posts')
```

### 7. Generic components

```tsx
// A List component that works with any item type
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string | number
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}

// Usage — T is inferred
<List
  items={posts}
  renderItem={(post) => <span>{post.title}</span>}
  keyExtractor={(post) => post.id}
/>
```

### 8. Utility types

```tsx
interface User {
  id: number
  name: string
  email: string
  password: string
  createdAt: Date
}

// Partial — all fields optional (good for update payloads)
type UserUpdate = Partial<User>
// { id?: number; name?: string; email?: string; ... }

// Pick — select specific fields
type UserPreview = Pick<User, 'id' | 'name'>
// { id: number; name: string }

// Omit — exclude specific fields
type PublicUser = Omit<User, 'password'>
// { id: number; name: string; email: string; createdAt: Date }

// Record — typed object/dictionary
type RolePermissions = Record<'admin' | 'user' | 'guest', string[]>
const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read'],
}

// Required — makes all optional fields required
type StrictUser = Required<Partial<User>>

// ReturnType — extracts the return type of a function
function getUser() { return { id: 1, name: 'Alice' } }
type UserReturn = ReturnType<typeof getUser> // { id: number; name: string }
```

### 9. Typing the children prop

```tsx
// Most flexible — ReactNode accepts anything renderable
interface CardProps {
  children: React.ReactNode
}

// Restrict to a single element
interface WrapperProps {
  children: React.ReactElement
}

// With additional props
interface LayoutProps {
  children: React.ReactNode
  title: string
  sidebar?: React.ReactNode
}

// PropsWithChildren utility type
import type { PropsWithChildren } from 'react'
type CardProps = PropsWithChildren<{ title: string }>
// Equivalent to: { children?: ReactNode; title: string }
```

### 10. Discriminated unions for component variants

```tsx
// Use discriminated unions to enforce prop combinations
type AlertProps =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string; onRetry: () => void }  // error requires onRetry
  | { type: 'loading'; progress?: number }                   // loading has no message

function Alert(props: AlertProps) {
  if (props.type === 'loading') {
    return <div>Loading... {props.progress}%</div>
  }

  if (props.type === 'error') {
    return (
      <div>
        {props.message}
        <button onClick={props.onRetry}>Retry</button>  {/* TypeScript knows onRetry exists */}
      </div>
    )
  }

  return <div className="text-green-500">{props.message}</div>
}

// TypeScript enforces the correct props at each usage
<Alert type="error" message="Failed" onRetry={handleRetry} />  // ✅
<Alert type="error" message="Failed" />                        // ❌ missing onRetry
<Alert type="success" onRetry={handleRetry} />                 // ❌ success doesn't have onRetry
```

---

## COMMON MISTAKES

1. **Using `any` to silence errors** — `any` disables type checking. Use `unknown` for truly unknown values and narrow it.

2. **Not typing async function return values** — TypeScript can infer many types, but explicit return types on async functions prevent accidental `Promise<any>`.

3. **Using `e: any` for event handlers** — The correct types are `React.MouseEvent`, `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`.

4. **Typing children as `string`** — Children can be strings, numbers, elements, arrays, or `null`. Use `React.ReactNode`.

5. **Forgetting to handle `null` from `useState<T | null>`** — TypeScript will error if you access properties on a potentially null value. Check first: `if (user) { user.name }`.

6. **`interface` vs `type` for unions** — Interfaces can't express unions directly. `type Status = 'a' | 'b'` — always use `type` for this.

7. **Using `React.FC` for components** — `React.FC` is discouraged (adds optional `children` implicitly, hides return type). Just type props directly.

---

## INTERVIEW TIP

> "What's the difference between `interface` and `type` in TypeScript?"

**Answer framework:**
- Both can describe object shapes and are mostly interchangeable.
- **`interface`**: Declaration merging (two `interface User {}` blocks merge), `extends` keyword, slightly better error messages for objects. Use for component props and class contracts.
- **`type`**: Can express unions (`A | B`), intersections (`A & B`), mapped types, conditional types. More powerful and flexible.
- **Practical rule**: `interface` for objects/props you might extend; `type` for unions, aliases, and computed types.

Bonus: mention discriminated unions as a pattern for component variants — shows you understand advanced TypeScript beyond just slapping types on variables.
