/**
 * Exercise 26 — Hooks Gym
 * ─────────────────────────────────────────────────────────────
 * Practice every core React hook in one file.
 * Each section is self-contained — complete them in order.
 *
 * Run: paste into a Vite React app and import into App.jsx
 */

import { useState, useEffect, useRef, useMemo, useCallback, useReducer } from 'react'

// ─── PART 1: useState ───────────────────────────────────────────────────────
// TODO: Build a counter with increment, decrement, and reset buttons.
// Constraint: the counter cannot go below 0 or above 10.

function Counter() {
  const [count, setCount] = useState(0)

  // TODO: implement increment — max 10
  // TODO: implement decrement — min 0
  // TODO: implement reset

  return (
    <div>
      <h2>Counter: {count}</h2>
      {/* TODO: add buttons */}
    </div>
  )
}


// ─── PART 2: useEffect ──────────────────────────────────────────────────────
// TODO: Build a component that:
// 1. Displays a document title that updates as the count changes ("Count: X")
// 2. Starts an interval that auto-increments count every 2 seconds
// 3. Cleans up the interval on unmount
// Hint: return a cleanup function from useEffect

function AutoCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // TODO: update document.title
    // TODO: set up interval
    // TODO: return cleanup
  }, [count])

  return <h2>Auto Count: {count}</h2>
}


// ─── PART 3: useRef ─────────────────────────────────────────────────────────
// TODO: Build a stopwatch using useRef for the interval ID.
// It should have Start, Stop, and Reset buttons.
// Display elapsed time in seconds.
// Why useRef? Because storing the interval ID in state would cause re-renders.

function Stopwatch() {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef(null)

  // TODO: start — begin interval, store in intervalRef.current
  // TODO: stop — clear intervalRef.current
  // TODO: reset — stop + set seconds to 0

  return (
    <div>
      <h2>Time: {seconds}s</h2>
      {/* TODO: Start / Stop / Reset buttons */}
    </div>
  )
}


// ─── PART 4: useMemo ────────────────────────────────────────────────────────
// TODO: Given an array of 10,000 numbers, compute the sum only when the array
// changes, not on every render. Display the sum and a "re-render count" that
// proves it's not recalculating on unrelated state changes.

function ExpensiveSum() {
  const [numbers] = useState(() => Array.from({ length: 10000 }, (_, i) => i + 1))
  const [unrelated, setUnrelated] = useState(0)

  // TODO: memoize the sum
  const sum = useMemo(() => {
    console.log('Computing sum...')
    return numbers.reduce((a, b) => a + b, 0)
  }, [numbers])

  return (
    <div>
      <p>Sum: {sum}</p>
      <p>Unrelated state: {unrelated}</p>
      {/* TODO: button that changes unrelated state — prove sum doesn't recompute */}
      <button onClick={() => setUnrelated(n => n + 1)}>Trigger re-render</button>
    </div>
  )
}


// ─── PART 5: useCallback ────────────────────────────────────────────────────
// TODO: A parent with a child list. The parent has a counter.
// Each list item has a "Remove" button that calls a callback from the parent.
// Without useCallback: the callback reference changes every render → every
// child re-renders even when nothing about them changed.
// With useCallback: only the necessary children re-render.
// Use React.memo on the list item to observe the difference.

const ListItem = ({ item, onRemove }) => {
  console.log(`Rendering: ${item}`)
  return (
    <li>
      {item} <button onClick={() => onRemove(item)}>Remove</button>
    </li>
  )
}

function CallbackList() {
  const [items, setItems] = useState(['Apple', 'Banana', 'Cherry'])
  const [count, setCount] = useState(0)

  // TODO: wrap handleRemove in useCallback
  const handleRemove = (item) => {
    setItems(prev => prev.filter(i => i !== item))
  }

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Re-render parent ({count})</button>
      <ul>
        {items.map(item => (
          <ListItem key={item} item={item} onRemove={handleRemove} />
        ))}
      </ul>
    </div>
  )
}


// ─── PART 6: useReducer ─────────────────────────────────────────────────────
// TODO: Build a todo list using useReducer.
// Actions: ADD_TODO, TOGGLE_TODO, DELETE_TODO, CLEAR_COMPLETED
// State shape: { todos: [{ id, text, done }] }

const initialState = { todos: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      // TODO
      return state
    case 'TOGGLE_TODO':
      // TODO
      return state
    case 'DELETE_TODO':
      // TODO
      return state
    case 'CLEAR_COMPLETED':
      // TODO
      return state
    default:
      return state
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (!input.trim()) return
    dispatch({ type: 'ADD_TODO', payload: input.trim() })
    setInput('')
  }

  return (
    <div>
      <h2>Todo App (useReducer)</h2>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="New todo" />
      <button onClick={addTodo}>Add</button>
      <button onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}>Clear completed</button>
      <ul>
        {state.todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
            <span onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}>
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>×</button>
          </li>
        ))}
      </ul>
    </div>
  )
}


// ─── EXPORT ALL ─────────────────────────────────────────────────────────────
export default function HooksGym() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Hooks Gym — Exercise 26</h1>
      <hr />
      <Counter />
      <hr />
      <AutoCounter />
      <hr />
      <Stopwatch />
      <hr />
      <ExpensiveSum />
      <hr />
      <CallbackList />
      <hr />
      <TodoApp />
    </div>
  )
}

/*
 * SOLUTIONS CHECKLIST
 * ───────────────────
 * Part 1 useState:    [ ] counter bounded 0–10
 * Part 2 useEffect:   [ ] title update + interval + cleanup
 * Part 3 useRef:      [ ] stopwatch with start/stop/reset
 * Part 4 useMemo:     [ ] sum only recomputes when numbers changes
 * Part 5 useCallback: [ ] handleRemove stable across parent re-renders
 * Part 6 useReducer:  [ ] all 4 actions implemented
 */
