// ============================================
// INTRO: useReducer — State Machine for Complex State
// ============================================
// useState is great for simple, independent values.
// useReducer shines when:
//   1. State has multiple sub-values that change together
//   2. Next state depends on the previous state in complex ways
//   3. State transitions follow defined rules (a state machine)
//   4. The same logic is needed in multiple places
//
// useReducer SEPARATES:
//   - WHAT happened (action: { type, payload })  → dispatched from components
//   - HOW state changes (reducer function)        → pure function, easy to test
//
// Budget tracker is a perfect useReducer case:
//   - Adding income affects: transactions[], balance, totalIncome
//   - Adding expense affects: transactions[], balance, totalExpense
//   - Deleting a transaction affects all three
//   - These must ALL update together atomically
//
// WHY it matters:
//   Redux (the industry-standard state manager) is useReducer + Context.
//   Understanding this pattern is REQUIRED for mid-level React roles.
//   Interview question: "When would you use useReducer over useState?"
//   Answer: complex state with interdependent values and clear action types.
// ============================================

// ============================================
// MENTAL MODEL: How to think about useReducer
// ============================================
// Think of a bank account:
//   state   = the bank ledger (all transactions, current balance)
//   action  = a bank instruction ("DEPOSIT $500 into checking")
//   reducer = the banker who processes instructions and updates the ledger
//   dispatch = handing the banker a new instruction
//
// The banker (reducer) is a PURE FUNCTION:
//   - Same instruction + same ledger → same result (predictable)
//   - Never modifies the original ledger (returns a new one)
//   - Only valid instructions are processed (handles known action types)
//
// const [state, dispatch] = useReducer(reducer, initialState)
// dispatch({ type: 'ADD_INCOME', payload: { amount: 500, category: 'salary' } })
// → reducer sees the current state and the action
// → returns a new state with the income added and balance updated
// → React re-renders with the new state
// ============================================

import { useReducer, useState, useMemo, useCallback } from 'react'

// ============================================
// STATE DESIGN
// ============================================
const initialState = {
  transactions: [],          // Array of { id, type, amount, category, note, date }
  balance: 0,                // Sum: income - expenses
  totalIncome: 0,
  totalExpense: 0,
}

// ============================================
// CONSTANTS
// ============================================
const INCOME_CATEGORIES  = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Housing', 'Health', 'Shopping', 'Entertainment', 'Bills', 'Other']

const CATEGORY_ICONS = {
  Salary: '💼', Freelance: '💻', Investment: '📈', Gift: '🎁',
  Food: '🍜', Transport: '🚌', Housing: '🏠', Health: '💊',
  Shopping: '🛍️', Entertainment: '🎬', Bills: '📄', Other: '📦',
}

// ============================================
// REDUCER: Pure function that handles state transitions
// This is the heart of the pattern — all state logic lives here.
// ============================================
function budgetReducer(state, action) {
  switch (action.type) {

    case 'ADD_TRANSACTION': {
      const { transaction } = action.payload
      const isIncome = transaction.type === 'income'
      const amount = Math.abs(transaction.amount)

      // All three values update atomically (no sync issues possible)
      return {
        ...state,
        transactions: [transaction, ...state.transactions],
        balance:      state.balance + (isIncome ? amount : -amount),
        totalIncome:  state.totalIncome  + (isIncome ? amount : 0),
        totalExpense: state.totalExpense + (isIncome ? 0 : amount),
      }
    }

    case 'DELETE_TRANSACTION': {
      const tx = state.transactions.find(t => t.id === action.payload.id)
      if (!tx) return state  // guard: unknown id, return unchanged state

      const isIncome = tx.type === 'income'
      const amount = Math.abs(tx.amount)

      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== tx.id),
        balance:      state.balance - (isIncome ? amount : -amount),
        totalIncome:  state.totalIncome  - (isIncome ? amount : 0),
        totalExpense: state.totalExpense - (isIncome ? 0 : amount),
      }
    }

    case 'EDIT_TRANSACTION': {
      // More complex: remove old values, add new values
      const { id, updates } = action.payload
      const oldTx = state.transactions.find(t => t.id === id)
      if (!oldTx) return state

      const updatedTx = { ...oldTx, ...updates }

      // Recalculate totals by processing the full transaction list
      // This is the "recompute from scratch" approach — safer than delta math
      const newTxList = state.transactions.map(t => t.id === id ? updatedTx : t)
      const { balance, totalIncome, totalExpense } = newTxList.reduce(
        (acc, t) => {
          const amt = Math.abs(t.amount)
          return t.type === 'income'
            ? { ...acc, balance: acc.balance + amt, totalIncome: acc.totalIncome + amt }
            : { ...acc, balance: acc.balance - amt, totalExpense: acc.totalExpense + amt }
        },
        { balance: 0, totalIncome: 0, totalExpense: 0 }
      )

      return { ...state, transactions: newTxList, balance, totalIncome, totalExpense }
    }

    case 'CLEAR_ALL':
      return initialState

    case 'LOAD_DEMO':
      // Load sample data to demonstrate the UI
      return action.payload.demoState

    default:
      // Unknown action type — return state unchanged (don't throw in production)
      console.warn(`Unknown action type: ${action.type}`)
      return state
  }
}

// ============================================
// DEMO DATA
// ============================================
function createDemoState() {
  const txns = [
    { id: 1, type: 'income',  amount: 75000, category: 'Salary',        note: 'November salary', date: '2024-11-01' },
    { id: 2, type: 'income',  amount: 12000, category: 'Freelance',      note: 'React project',   date: '2024-11-05' },
    { id: 3, type: 'expense', amount: 18000, category: 'Housing',        note: 'Rent',             date: '2024-11-02' },
    { id: 4, type: 'expense', amount: 4500,  category: 'Food',           note: 'Groceries + dining', date: '2024-11-10' },
    { id: 5, type: 'expense', amount: 2200,  category: 'Transport',      note: 'Petrol + Uber',    date: '2024-11-12' },
    { id: 6, type: 'expense', amount: 3500,  category: 'Entertainment',  note: 'Movies + weekend', date: '2024-11-15' },
    { id: 7, type: 'income',  amount: 5000,  category: 'Investment',     note: 'Stock dividend',   date: '2024-11-20' },
    { id: 8, type: 'expense', amount: 8000,  category: 'Shopping',       note: 'New shoes + clothes', date: '2024-11-22' },
  ]
  const { balance, totalIncome, totalExpense } = txns.reduce(
    (acc, t) => {
      const amt = Math.abs(t.amount)
      return t.type === 'income'
        ? { ...acc, balance: acc.balance + amt, totalIncome: acc.totalIncome + amt }
        : { ...acc, balance: acc.balance - amt, totalExpense: acc.totalExpense + amt }
    },
    { balance: 0, totalIncome: 0, totalExpense: 0 }
  )
  return { transactions: txns, balance, totalIncome, totalExpense }
}

// ============================================
// SUB-COMPONENTS
// ============================================

function SummaryCard({ label, amount, color, icon }) {
  const formatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.abs(amount))
  return (
    <div style={{ padding: '16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', flex: 1, minWidth: '140px' }}>
      <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: 700, color }}>{formatted}</div>
    </div>
  )
}

function TransactionItem({ tx, onDelete }) {
  const isIncome = tx.type === 'income'
  const formatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(tx.amount)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 14px', background: '#fff',
      border: '1px solid #f3f4f6', borderRadius: '10px',
      borderLeft: `3px solid ${isIncome ? '#22c55e' : '#ef4444'}`,
    }}>
      <span style={{ fontSize: '1.3rem' }}>{CATEGORY_ICONS[tx.category] ?? '📦'}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{tx.category}</div>
        {tx.note && <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{tx.note}</div>}
        <div style={{ fontSize: '0.68rem', color: '#d1d5db' }}>{tx.date}</div>
      </div>
      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isIncome ? '#22c55e' : '#ef4444' }}>
        {isIncome ? '+' : '-'}{formatted}
      </div>
      <button
        onClick={() => onDelete(tx.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: '1.1rem', padding: '2px 6px' }}
        aria-label="Delete transaction"
      >×</button>
    </div>
  )
}

// Category breakdown donut-style bar
function CategoryBreakdown({ transactions, type }) {
  const totals = useMemo(() => {
    const filtered = transactions.filter(t => t.type === type)
    const map = filtered.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
      return acc
    }, {})
    const total = Object.values(map).reduce((a, b) => a + b, 0)
    return Object.entries(map)
      .map(([cat, amt]) => ({ cat, amt, pct: Math.round(amt / total * 100) }))
      .sort((a, b) => b.amt - a.amt)
  }, [transactions, type])

  if (totals.length === 0) return <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>No {type} transactions yet.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {totals.map(({ cat, amt, pct }) => (
        <div key={cat}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
            <span>{CATEGORY_ICONS[cat]} {cat}</span>
            <span style={{ color: '#6b7280' }}>₹{amt.toLocaleString('en-IN')} ({pct}%)</span>
          </div>
          <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${pct}%`, height: '100%', borderRadius: '3px',
              background: type === 'income' ? '#22c55e' : '#ef4444',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// ADD TRANSACTION FORM
// ============================================
function AddTransactionForm({ onAdd }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function handleSubmit(e) {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) { setError('Enter a valid amount'); return }
    if (!category) { setError('Select a category'); return }

    // Dispatch is called from here, but the logic lives in the reducer
    onAdd({
      id: Date.now(),
      type,
      amount: amt,
      category,
      note: note.trim(),
      date,
    })

    // Reset form
    setAmount('')
    setNote('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Type toggle */}
      <div style={{ display: 'flex', gap: '0' }}>
        {['income', 'expense'].map(t => (
          <button key={t} type="button" onClick={() => { setType(t); setCategory('') }}
            style={{
              flex: 1, padding: '8px', border: '1px solid #e5e7eb', cursor: 'pointer',
              background: type === t ? (t === 'income' ? '#dcfce7' : '#fee2e2') : '#f9fafb',
              color: type === t ? (t === 'income' ? '#16a34a' : '#dc2626') : '#9ca3af',
              fontWeight: type === t ? 700 : 400,
              borderRadius: t === 'income' ? '8px 0 0 8px' : '0 8px 8px 0',
              fontSize: '0.85rem',
            }}>
            {t === 'income' ? '↑ Income' : '↓ Expense'}
          </button>
        ))}
      </div>

      <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
        placeholder="Amount (₹)" min="1" step="0.01" required
        style={{ padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
      />

      <select value={category} onChange={e => setCategory(e.target.value)} required
        style={{ padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem', background: '#fff', outline: 'none' }}>
        <option value="">Select category</option>
        {categories.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
      </select>

      <input type="text" value={note} onChange={e => setNote(e.target.value)}
        placeholder="Note (optional)" maxLength={80}
        style={{ padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
      />

      <input type="date" value={date} onChange={e => setDate(e.target.value)}
        style={{ padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
      />

      {error && <p style={{ color: '#dc2626', fontSize: '0.75rem', margin: 0 }}>{error}</p>}

      <button type="submit" style={{
        padding: '10px', background: type === 'income' ? '#22c55e' : '#ef4444',
        color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700,
        cursor: 'pointer', fontSize: '0.9rem',
      }}>
        Add {type === 'income' ? 'Income' : 'Expense'}
      </button>
    </form>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function BudgetTracker() {
  // useReducer: single state object + dispatch function
  const [state, dispatch] = useReducer(budgetReducer, initialState)
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('transactions') // 'transactions' | 'breakdown'

  // Action creators — functions that create and dispatch actions
  // Keeping action creation in the component (not a separate file for simplicity)
  const addTransaction = useCallback((tx) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: { transaction: tx } })
  }, [])

  const deleteTransaction = useCallback((id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: { id } })
  }, [])

  const loadDemo = useCallback(() => {
    dispatch({ type: 'LOAD_DEMO', payload: { demoState: createDemoState() } })
  }, [])

  // Derived: filtered transactions
  const filteredTransactions = useMemo(() => {
    return state.transactions.filter(tx => {
      if (filterType !== 'all' && tx.type !== filterType) return false
      if (filterCategory !== 'all' && tx.category !== filterCategory) return false
      return true
    })
  }, [state.transactions, filterType, filterCategory])

  const savingsRate = state.totalIncome > 0
    ? Math.round((state.balance / state.totalIncome) * 100)
    : 0

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.abs(n))

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '24px 16px', background: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ fontSize: '1.3rem' }}>💰 Budget Tracker</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {state.transactions.length === 0 && (
            <button onClick={loadDemo}
              style={{ padding: '7px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.8rem', color: '#6b7280' }}>
              Load demo data
            </button>
          )}
          {state.transactions.length > 0 && (
            <button onClick={() => dispatch({ type: 'CLEAR_ALL' })}
              style={{ padding: '7px 14px', border: '1px solid #fecaca', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.8rem', color: '#dc2626' }}>
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <SummaryCard label="Balance"  amount={state.balance}      color={state.balance >= 0 ? '#22c55e' : '#ef4444'} icon="💳" />
        <SummaryCard label="Income"   amount={state.totalIncome}  color="#22c55e" icon="📈" />
        <SummaryCard label="Expenses" amount={state.totalExpense} color="#ef4444" icon="📉" />
        <div style={{ padding: '16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', flex: 1, minWidth: '140px' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🏦</div>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Savings rate</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: savingsRate >= 20 ? '#22c55e' : savingsRate >= 10 ? '#f59e0b' : '#ef4444' }}>
            {savingsRate}%
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '20px', alignItems: 'start' }}>
        {/* Left: transactions */}
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '16px', background: '#f3f4f6', borderRadius: '10px', padding: '3px' }}>
            {['transactions', 'breakdown'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '7px', border: 'none', cursor: 'pointer', borderRadius: '8px', fontSize: '0.8rem',
                  background: activeTab === tab ? '#fff' : 'transparent',
                  color: activeTab === tab ? '#111827' : '#9ca3af',
                  fontWeight: activeTab === tab ? 600 : 400,
                  boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}>
                {tab === 'transactions' ? '📋 Transactions' : '📊 Breakdown'}
              </button>
            ))}
          </div>

          {activeTab === 'transactions' && (
            <>
              {/* Filters */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {['all', 'income', 'expense'].map(t => (
                  <button key={t} onClick={() => setFilterType(t)}
                    style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid #e5e7eb', cursor: 'pointer',
                      background: filterType === t ? '#111827' : '#fff', color: filterType === t ? '#fff' : '#6b7280',
                    }}>{t === 'all' ? 'All' : t === 'income' ? '↑ Income' : '↓ Expense'}</button>
                ))}
              </div>

              {/* Transaction list */}
              {filteredTransactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', background: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                  {state.transactions.length === 0 ? 'Add your first transaction →' : 'No transactions match filters'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredTransactions.map(tx => (
                    <TransactionItem key={tx.id} tx={tx} onDelete={deleteTransaction} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'breakdown' && (
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase' }}>Income by category</h3>
                <CategoryBreakdown transactions={state.transactions} type="income" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase' }}>Expenses by category</h3>
                <CategoryBreakdown transactions={state.transactions} type="expense" />
              </div>
            </div>
          )}
        </div>

        {/* Right: add form */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', position: 'sticky', top: '20px' }}>
          <h2 style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Add Transaction
          </h2>
          <AddTransactionForm onAdd={addTransaction} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. When should you use useReducer instead of useState?
//    Answer: When: (a) state has multiple fields that update together,
//    (b) next state depends on previous state in complex ways,
//    (c) you want to extract and test state logic independently,
//    (d) multiple components need to dispatch the same types of actions.
//    For a single boolean or string, useState is simpler.
//
// 2. Why is the reducer a pure function? What does "pure" mean here?
//    Answer: Pure = same inputs always produce same output, no side effects.
//    The reducer must: (a) not mutate the state argument,
//    (b) not call APIs or access external data,
//    (c) return the same new state for the same (state, action) pair.
//    This makes it trivially testable and debuggable (time-travel debugging).
//
// 3. Why return 'state' unchanged for unknown action types instead of throwing?
//    Answer: Reducers handle hot module replacement (HMR) where new action
//    types can appear. Throwing would crash. Returning unchanged state is
//    the graceful degradation strategy. console.warn helps debugging.
//
// 4. What is the difference between dispatch and setState?
//    Answer: setState directly sets a new value. dispatch sends a
//    description of WHAT HAPPENED (an action object) and the reducer
//    decides HOW state changes. This indirection allows: logging all
//    state changes, replay/undo, and testing state logic in isolation.
// ============================================

// ============================================
// YOUR TURN: Todo App with Priorities using useReducer
// ============================================
// Build a todo app that uses useReducer for ALL state management.
//
// STATE SHAPE:
//   {
//     todos: [{ id, text, priority, done, createdAt, doneAt }],
//     filter: 'all' | 'active' | 'done',
//     sortBy: 'priority' | 'date' | 'alpha',
//     stats: { total, done, active, highPriority }  ← DERIVE this, don't store
//   }
//
// ACTIONS to implement:
//   ADD_TODO    { text, priority: 'high' | 'medium' | 'low' }
//   TOGGLE_TODO { id }
//   DELETE_TODO { id }
//   EDIT_TODO   { id, text }
//   SET_PRIORITY { id, priority }
//   SET_FILTER  { filter }
//   SET_SORT    { sortBy }
//   CLEAR_DONE  (no payload)
//   REORDER     { fromIndex, toIndex }  ← drag-and-drop reorder
//
// COMPONENTS:
//   TodoItem({ todo, onToggle, onDelete, onEdit, onPriority })
//   → Priority dot indicator (🔴 high, 🟡 medium, 🟢 low)
//   → Double-click to enter edit mode (inline input)
//   → Strikethrough when done
//
//   FilterBar({ filter, sortBy, stats, dispatch })
//   → Filter buttons: All (N) | Active (N) | Done (N)
//   → Sort select: Priority | Date | Alphabetical
//   → "Clear done" button (shows count of completed)
//
//   PriorityInput({ value, onChange })
//   → Radio buttons styled as colored badges
//
// BONUS: Drag-and-drop reorder using HTML5 Drag and Drop API
//   onDragStart: record dragged item id
//   onDragOver: e.preventDefault() to allow drop
//   onDrop: dispatch REORDER action

export function TodoApp() {
  // YOUR CODE HERE using useReducer
}

// ============================================
// BOSS CHALLENGE: Redux-style Store + DevTools
// ============================================
// Replicate Redux's core with:
//
//   createStore(reducer, initialState, enhancer?)
//   → Returns: { getState, dispatch, subscribe }
//
//   applyMiddleware(...middlewares)
//   → Enhancer that wraps dispatch
//   → Each middleware: store => next => action => { log; next(action); }
//
// Build the logger middleware:
//   prevState → [ACTION TYPE] → nextState (in console.group)
//
// Build the thunk middleware:
//   Allows dispatching functions (async action creators):
//   dispatch(async (dispatch, getState) => {
//     const data = await fetchSomething()
//     dispatch({ type: 'SET_DATA', payload: data })
//   })
//
// Use this as a React context + useReducer store:
//   const store = createStore(budgetReducer, initialState, applyMiddleware(logger, thunk))
//   <StoreContext.Provider value={store}>...</StoreContext.Provider>

// ============================================
// PATTERN LEARNED: State Machine (useReducer)
// ============================================
// PATTERN NAME: Reducer-based State Machine
// WHEN YOU SEE: Multiple related state values, complex transitions,
//               state that changes "atomically" (all-or-nothing)
// USE THIS:
//
//   STATE: one object with all related fields
//   ACTIONS: { type: 'VERB_NOUN', payload: { ... } }
//   REDUCER: switch(action.type) { case 'VERB_NOUN': return { ...state, ... } }
//   DISPATCH: dispatch({ type: 'VERB_NOUN', payload: { ... } })
//
//   ACTION CREATOR PATTERN (avoid magic strings):
//     const addTodo = (text) => ({ type: 'ADD_TODO', payload: { text } })
//     dispatch(addTodo('Buy milk'))
//
//   TESTING THE REDUCER (pure function = easy to test):
//     const state1 = budgetReducer(initialState, { type: 'ADD_TRANSACTION', payload: ... })
//     expect(state1.balance).toBe(75000)
//
//   WHEN TO EXTRACT TO CONTEXT:
//     dispatch and state can be put in Context so child components can
//     dispatch actions without prop-drilling the dispatch function down.
//     This is Redux's core pattern replicated with built-in React tools.
//
// REACT CONNECTION:
//   Redux: createSlice + configureStore (useReducer + global Context)
//   Zustand: useStore with actions (simpler API, same concept)
//   useImmerReducer: write "mutable" reducer code (Immer converts to immutable)
// ============================================
