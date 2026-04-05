// ============================================
// INTRO: State Machine + Accumulation and WHY it matters
// ============================================
// In React, every interactive UI is fundamentally a state machine.
// The current "mood" is a STATE. Clicking a button is an EVENT that
// causes a STATE TRANSITION. The history is ACCUMULATED STATE — every
// past event appended to an array.
//
// ACCUMULATION means: instead of replacing state, you BUILD on it.
// const newHistory = [...prev.history, newEntry]
// This is how undo/redo, chat apps, activity feeds, and audit logs work.
//
// WHY it matters:
// - State machines make impossible UI states impossible
//   (can't be "loading" AND "showing results" at the same time)
// - Accumulation is the foundation of every time-series UI
// - React re-renders on state change — understanding WHICH state
//   drives WHICH UI is the core skill of a React developer
//
// React concepts in this exercise:
//   useState — local state management
//   Derived state — computed from existing state, not stored separately
//   Conditional rendering — show different UI based on state
//   List rendering — map array to JSX elements
//   Event handlers — update state in response to user actions
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// Think of a mood tracker as a vending machine:
//   - It's ALWAYS in one state: idle, dispensing, out-of-stock
//   - Pressing a button = event that triggers a transition
//   - The receipt (accumulated history) grows with each purchase
//
// React state works the same way:
//   const [state, setState] = useState(initialState)
//   state  → what the machine currently shows
//   setState → the button you press to trigger a transition
//   Component re-renders → machine display updates
//
// DERIVED STATE: don't store what you can compute.
//   If you have history[], you DON'T need a separate totalCount state.
//   const totalCount = history.length  ← computed fresh each render
//   This avoids state synchronization bugs.
// ============================================

// ============================================
// SETUP: To run this file, you need a React project.
//
// Option 1 — StackBlitz (instant, no install):
//   Go to stackblitz.com/edit/react → paste this code
//
// Option 2 — Local (Vite):
//   npm create vite@latest mood-tracker -- --template react
//   cd mood-tracker && npm install && npm run dev
//   Replace src/App.jsx with this file's content
//
// Option 3 — CodeSandbox:
//   codesandbox.io/s/new → select React template → paste content
// ============================================

import { useState, useMemo } from 'react'

// ============================================
// GUIDED CODE: Read every comment — it explains the patterns
// ============================================

// ---- DATA: Mood definitions ----
// Keeping data outside the component avoids re-creating it on every render

const MOODS = [
  { id: 'amazing',  emoji: '🤩', label: 'Amazing',  color: '#f1c40f', bg: '#fef9e7' },
  { id: 'good',     emoji: '😊', label: 'Good',     color: '#2ecc71', bg: '#eafaf1' },
  { id: 'neutral',  emoji: '😐', label: 'Neutral',  color: '#95a5a6', bg: '#f2f3f4' },
  { id: 'bad',      emoji: '😔', label: 'Bad',      color: '#e67e22', bg: '#fef5ec' },
  { id: 'terrible', emoji: '😤', label: 'Terrible', color: '#e74c3c', bg: '#fdedec' },
]

// ---- HELPER: Get mood object by id ----
const getMood = (id) => MOODS.find(m => m.id === id)

// ---- HELPER: Format timestamp ----
function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// ============================================
// COMPONENT 1: MoodButton
// A single mood selection button.
// Pure component — receives data and callbacks via props, no internal state.
// ============================================
function MoodButton({ mood, isSelected, onClick }) {
  // Note: 'isSelected' is DERIVED — the parent computes it by comparing
  // the active mood id to this button's mood id. This button doesn't
  // need to know about other buttons.
  return (
    <button
      onClick={() => onClick(mood.id)}
      title={mood.label}
      style={{
        background: isSelected ? mood.bg : 'transparent',
        border: `2px solid ${isSelected ? mood.color : '#e5e7eb'}`,
        borderRadius: '16px',
        padding: '12px 20px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        transition: 'all 0.15s',
        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
        minWidth: '80px',
      }}
      aria-pressed={isSelected}
      aria-label={`Select mood: ${mood.label}`}
    >
      <span style={{ fontSize: '2rem' }}>{mood.emoji}</span>
      <span style={{ fontSize: '0.7rem', color: isSelected ? mood.color : '#9ca3af', fontWeight: isSelected ? 600 : 400 }}>
        {mood.label}
      </span>
    </button>
  )
}

// ============================================
// COMPONENT 2: MoodHistoryItem
// Displays a single entry from the accumulated history.
// ============================================
function MoodHistoryItem({ entry, onDelete }) {
  const mood = getMood(entry.moodId)
  if (!mood) return null

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 14px',
      background: '#f9fafb',
      borderRadius: '10px',
      border: '1px solid #f3f4f6',
    }}>
      <span style={{ fontSize: '1.4rem' }}>{mood.emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: mood.color }}>
          {mood.label}
        </div>
        {entry.note && (
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
            "{entry.note}"
          </div>
        )}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{formatTime(entry.timestamp)}</div>
        <div style={{ fontSize: '0.65rem', color: '#d1d5db' }}>{formatDate(entry.timestamp)}</div>
      </div>
      <button
        onClick={() => onDelete(entry.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#d1d5db',
          fontSize: '1rem',
          padding: '2px 6px',
          borderRadius: '4px',
        }}
        aria-label="Delete this entry"
      >
        ×
      </button>
    </div>
  )
}

// ============================================
// COMPONENT 3: MoodStats
// Displays derived statistics computed from the history array.
// KEY CONCEPT: This data is NOT stored in state — it's COMPUTED from history.
// ============================================
function MoodStats({ history }) {
  // useMemo: recompute only when history changes (optimization)
  // For a small history, this is optional — but it's the correct pattern.
  const stats = useMemo(() => {
    if (history.length === 0) return null

    // Count occurrences of each mood
    const counts = history.reduce((acc, entry) => {
      acc[entry.moodId] = (acc[entry.moodId] || 0) + 1
      return acc
    }, {})

    // Find the mood with the highest count
    const topMoodId = Object.entries(counts).sort(([, a], [, b]) => b - a)[0][0]

    // Calculate mood "score": amazing=5, good=4, neutral=3, bad=2, terrible=1
    const scores = { amazing: 5, good: 4, neutral: 3, bad: 2, terrible: 1 }
    const avgScore = history.reduce((sum, e) => sum + (scores[e.moodId] || 3), 0) / history.length
    const avgLabel = avgScore >= 4.5 ? 'Amazing' : avgScore >= 3.5 ? 'Good' : avgScore >= 2.5 ? 'Neutral' : avgScore >= 1.5 ? 'Bad' : 'Terrible'

    return { counts, topMoodId, avgScore: avgScore.toFixed(1), avgLabel }
  }, [history])

  if (!stats) return (
    <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px', fontSize: '0.85rem' }}>
      Log your first mood to see stats 📊
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Most common mood */}
      <div style={{
        padding: '14px',
        background: getMood(stats.topMoodId)?.bg,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ fontSize: '1.8rem' }}>{getMood(stats.topMoodId)?.emoji}</span>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Most common</div>
          <div style={{ fontWeight: 700, color: getMood(stats.topMoodId)?.color }}>
            {getMood(stats.topMoodId)?.label}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{stats.counts[stats.topMoodId]}×</div>
          <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>times</div>
        </div>
      </div>

      {/* Mood distribution */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {MOODS.map(mood => {
          const count = stats.counts[mood.id] || 0
          const pct = Math.round(count / history.length * 100)
          return (
            <div key={mood.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem', width: '24px' }}>{mood.emoji}</span>
              <div style={{ flex: 1, height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: mood.color,
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <span style={{ fontSize: '0.7rem', color: '#6b7280', width: '30px', textAlign: 'right' }}>
                {pct}%
              </span>
            </div>
          )
        })}
      </div>

      {/* Average score */}
      <div style={{ textAlign: 'center', padding: '8px', background: '#f9fafb', borderRadius: '8px' }}>
        <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Average mood: </span>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{stats.avgLabel} ({stats.avgScore}/5)</span>
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT: MoodTracker
// Holds all state. Child components receive data and callbacks via props.
// This is the "lifting state up" pattern — state lives at the lowest
// common ancestor of all components that need it.
// ============================================
export default function MoodTracker() {
  // ---- STATE ----
  // Rule: store the MINIMUM state needed. Derive everything else.
  const [selectedMood, setSelectedMood] = useState(null)    // currently selected (before logging)
  const [note, setNote] = useState('')                        // optional note text
  const [history, setHistory] = useState([])                  // accumulated log entries
  const [filter, setFilter] = useState('all')                 // history filter

  // ---- DERIVED STATE (not stored, computed each render) ----
  const filteredHistory = filter === 'all'
    ? history
    : history.filter(e => e.moodId === filter)

  const canLog = selectedMood !== null

  // ---- EVENT HANDLERS ----

  // Log the currently selected mood
  function handleLog() {
    if (!selectedMood) return

    // ACCUMULATION: prepend new entry (newest first)
    setHistory(prev => [
      {
        id: Date.now(),              // unique id for key prop and deletion
        moodId: selectedMood,
        note: note.trim(),
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ])

    // Reset selection after logging
    setSelectedMood(null)
    setNote('')
  }

  function handleDelete(entryId) {
    // Immutable removal — filter returns a NEW array
    setHistory(prev => prev.filter(e => e.id !== entryId))
  }

  function handleClear() {
    if (window.confirm('Clear all mood history?')) {
      setHistory([])
    }
  }

  // ---- RENDER ----
  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      padding: '24px 16px',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.3rem', marginBottom: '4px' }}>
        Mood Tracker 🎭
      </h1>
      <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem', marginBottom: '24px' }}>
        How are you feeling right now?
      </p>

      {/* Mood selection */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {MOODS.map(mood => (
          <MoodButton
            key={mood.id}
            mood={mood}
            isSelected={selectedMood === mood.id}
            onClick={setSelectedMood}
          />
        ))}
      </div>

      {/* Note input — only show when a mood is selected */}
      {/* CONDITIONAL RENDERING: show/hide based on state */}
      {selectedMood && (
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLog()}
            placeholder={`What's making you feel ${getMood(selectedMood)?.label.toLowerCase()}?`}
            maxLength={100}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '0.85rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            autoFocus
          />
        </div>
      )}

      {/* Log button */}
      <button
        onClick={handleLog}
        disabled={!canLog}
        style={{
          width: '100%',
          padding: '12px',
          background: canLog ? '#3b82f6' : '#e5e7eb',
          color: canLog ? '#fff' : '#9ca3af',
          border: 'none',
          borderRadius: '10px',
          fontSize: '0.95rem',
          fontWeight: 600,
          cursor: canLog ? 'pointer' : 'not-allowed',
          marginBottom: '24px',
          transition: 'all 0.15s',
        }}
      >
        {selectedMood
          ? `Log mood: ${getMood(selectedMood)?.emoji} ${getMood(selectedMood)?.label}`
          : 'Select a mood to log'
        }
      </button>

      {/* Stats section */}
      {history.length > 0 && (
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <h2 style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Stats ({history.length} entries)
          </h2>
          <MoodStats history={history} />
        </div>
      )}

      {/* History section */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            History
          </h2>
          {history.length > 0 && (
            <button onClick={handleClear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.75rem' }}>
              Clear all
            </button>
          )}
        </div>

        {/* Filter pills */}
        {history.length > 1 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', border: 'none', cursor: 'pointer',
                background: filter === 'all' ? '#3b82f6' : '#f3f4f6',
                color: filter === 'all' ? '#fff' : '#6b7280',
              }}
            >All</button>
            {MOODS.filter(m => history.some(e => e.moodId === m.id)).map(mood => (
              <button
                key={mood.id}
                onClick={() => setFilter(mood.id)}
                style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', border: 'none', cursor: 'pointer',
                  background: filter === mood.id ? mood.color : '#f3f4f6',
                  color: filter === mood.id ? '#fff' : '#6b7280',
                }}
              >
                {mood.emoji} {mood.label}
              </button>
            ))}
          </div>
        )}

        {/* History list */}
        {filteredHistory.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
            {history.length === 0 ? 'No moods logged yet.' : 'No entries match this filter.'}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredHistory.map(entry => (
              <MoodHistoryItem key={entry.id} entry={entry} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. Why is 'filteredHistory' derived state instead of stored in useState?
//    Answer: It's computed directly from 'history' and 'filter' — both of
//    which are already in state. If we stored filteredHistory in a third state,
//    we'd need to keep three states synchronized. Derived state eliminates
//    this entire class of bug.
//
// 2. Why do we pass setSelectedMood directly as a prop to MoodButton?
//    Answer: setState functions are stable references — React guarantees
//    they don't change between renders. Passing them directly is safe and
//    avoids creating wrapper functions. The child just calls the setter.
//
// 3. What does the 'key' prop on MoodHistoryItem do? Why use Date.now()?
//    Answer: React uses 'key' to identify which list items changed, were
//    added, or removed. Without unique keys, React may reuse the wrong DOM
//    nodes. Date.now() gives a unique numeric id at creation time.
//    In production: use a UUID or database-generated id.
//
// 4. Why does handleDelete use setHistory(prev => ...) instead of
//    setHistory(history.filter(...))?
//    Answer: When the new state depends on the previous state, always use
//    the functional updater form. This ensures you're working with the
//    most recent state even if multiple setState calls batch together.
// ============================================

// ============================================
// YOUR TURN: Daily Habit Tracker with Streaks
// ============================================
// Build a habit tracker that lets you log daily habits and tracks streaks.
//
// HABITS to track (user can add custom ones too):
//   🏃 Exercise | 💧 Water (8 glasses) | 📚 Read | 🧘 Meditate | 😴 Sleep 8hrs
//
// STATE DESIGN (think before coding):
//   habits: [{ id, emoji, label, color }]
//   logs: { "2024-01-15": ["exercise", "water", "read"], "2024-01-16": [...] }
//   Note: storing by date makes streak calculation easy
//
// COMPONENTS to build:
//
//   HabitButton({ habit, isCompletedToday, onToggle })
//   → Toggle button showing habit emoji + label
//   → Green checkmark when completed, gray when not
//
//   StreakBadge({ habit, logs })
//   → Shows current streak: "🔥 7 days"
//   → Calculates by looking at consecutive past days in logs
//   → Turns gold when streak ≥ 7
//
//   HabitGrid({ habit, logs })
//   → Last 30 days as a grid of squares (like GitHub contribution graph)
//   → Green = completed, gray = missed, today = highlighted border
//
//   WeekView({ logs, habits })
//   → Shows this week's completion rate per day (Mon-Sun)
//   → "Mon: 3/5 habits" etc.
//
// FEATURES:
//   - Toggle today's habit completion (can un-toggle before midnight)
//   - Calculate current streak for each habit
//   - Show overall completion rate (today: X/Y habits done)
//   - Motivational message when all habits complete
//   - Store in localStorage so progress persists on refresh
//
// STREAK ALGORITHM:
//   function calculateStreak(habitId, logs) {
//     let streak = 0
//     let date = new Date()  // start from today
//     while (true) {
//       const key = date.toISOString().split('T')[0]  // "2024-01-15"
//       if (!logs[key]?.includes(habitId)) break
//       streak++
//       date.setDate(date.getDate() - 1)  // go back one day
//     }
//     return streak
//   }

// YOUR CODE HERE:
export function HabitTracker() {
  // YOUR CODE HERE
}

// ============================================
// BOSS CHALLENGE: Mood Journal with Predictions
// ============================================
// Extend MoodTracker into a full mood journal:
//
// 1. Persistence: save history to localStorage on every update
//    useEffect(() => { localStorage.setItem('moods', JSON.stringify(history)) }, [history])
//    On mount: const saved = JSON.parse(localStorage.getItem('moods') || '[]')
//
// 2. Insights panel:
//    - Best day of week (which weekday most often has good/amazing moods)
//    - Best time of day (morning/afternoon/evening patterns)
//    - Longest "good streak" (consecutive entries ≥ good)
//
// 3. Weekly summary view:
//    - Calendar-style grid showing each day's dominant mood
//    - Click a day to see all entries for that day
//
// 4. Export: download as JSON or CSV
//    function exportCSV(history) { ... }
//    → "Timestamp,Mood,Note\n2024-01-15 09:30,Good,Had a great meeting"

// ============================================
// PATTERN LEARNED: State Machine + Accumulation
// ============================================
// PATTERN NAME: Accumulating State Machine
// WHEN YOU SEE: UI with a growing log, history, feed, or list that
//               updates based on user actions
// USE THIS:
//
//   State: { currentSelection, accumulatedLog }
//   Event: user action → setState(prev => [...prev, newEntry])
//   Derived: counts, stats, filtered views — computed from log, not stored
//
//   ACCUMULATION TEMPLATE:
//     const [log, setLog] = useState([])
//     const addEntry = (data) => setLog(prev => [
//       { id: Date.now(), ...data, timestamp: new Date().toISOString() },
//       ...prev  // prepend (newest first) or append (oldest first)
//     ])
//     const removeEntry = (id) => setLog(prev => prev.filter(e => e.id !== id))
//
//   DERIVED STATE RULE: if you can compute it from existing state, DO NOT store it.
//   const count = log.length          ← not state
//   const filtered = log.filter(...)  ← not state
//   const stats = computeStats(log)   ← not state (wrap in useMemo if expensive)
//
// REACT CONNECTION:
//   Chat apps: messages[] is accumulated state
//   Undo/redo: history[] is accumulated state (current = history[pointer])
//   Shopping cart: items[] accumulated, total is derived
//   Notification feed: notifications[] accumulated, unread count is derived
// ============================================
