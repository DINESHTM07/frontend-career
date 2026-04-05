// ============================================
// INTRO: useEffect — Observer Pattern for Side Effects
// ============================================
// useEffect lets a component "observe" the outside world and synchronize
// with it. It runs AFTER render and can optionally clean up after itself.
//
// A "side effect" is anything that reaches outside the component:
//   - Fetching data from an API
//   - Setting up a timer (setTimeout, setInterval)
//   - Adding event listeners (addEventListener)
//   - Subscriptions (WebSocket, EventEmitter)
//   - Directly manipulating the DOM
//   - Reading/writing localStorage
//
// The MOST COMMON bugs in React come from misusing useEffect:
//   1. Missing dependency — stale closure captures old value
//   2. Missing cleanup — memory leaks, duplicate event listeners
//   3. Infinite loop — setState inside effect with that state as dep
//   4. Running at wrong time — empty [] when deps needed
//   5. async directly — "can't use async function as useEffect"
//
// WHY it matters: React's rendering model is PURE — a given props+state
// should always produce the same UI. Side effects break this purity.
// useEffect is the official "escape hatch" for doing impure things while
// keeping them isolated and controllable.
// ============================================

// ============================================
// MENTAL MODEL: How to think about useEffect
// ============================================
// useEffect is a subscription manager for your component:
//
//   "After every render where [deps] changed:
//    1. Run the cleanup from last time (if any)
//    2. Run the new effect"
//
// The dependency array answers: "what does this effect READ from React?"
//   useEffect(fn, [])        → run once on mount (read nothing from React)
//   useEffect(fn, [id])      → run when id changes (reads 'id' from React)
//   useEffect(fn)            → run after EVERY render (reads everything — usually wrong)
//
// The cleanup function answers: "what do I need to undo when I'm done?"
//   clearTimeout / clearInterval → for timers
//   controller.abort()           → for fetch requests
//   removeEventListener          → for DOM listeners
//   socket.disconnect()          → for subscriptions
//
// RULE: "If you set something up in an effect, clean it up in the return."
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react'

// ============================================
// PUZZLE SECTION: 5 broken useEffect patterns to understand and fix
// Each puzzle shows the broken code, explains the bug, and shows the fix.
// Run each one in isolation and observe the behavior.
// ============================================

// ============================================
// PUZZLE 1: The Stale Closure
// BUG: counter increments by 1 forever — never by the current value
// ============================================
export function StaleClosure_BROKEN() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // BUG: this effect only runs once ([] dependency)
    // It captures count = 0 at mount. This value NEVER updates inside the effect.
    // So the interval always runs: setCount(0 + 1) = 1, forever.
    const timer = setInterval(() => {
      setCount(count + 1)  // ← STALE: count is always 0 here
    }, 1000)
    return () => clearInterval(timer)
  }, [])  // ← BUG: count is used inside but not listed as dependency

  return <div>Count (broken): {count}</div>
}

export function StaleClosure_FIXED() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // FIX 1: Use functional update form — no need to read count at all
    // setCount(prev => prev + 1) always uses the CURRENT value, not a closure snapshot
    const timer = setInterval(() => {
      setCount(prev => prev + 1)  // ← always gets current count, no stale closure
    }, 1000)
    return () => clearInterval(timer)
  }, [])  // ← [] is correct now — effect doesn't read any React state

  // FIX 2 (alternative): add count to deps — but this recreates interval every second
  // Not preferred here because it causes a noticeable flicker

  return <div>Count (fixed): {count}</div>
}

// ============================================
// PUZZLE 2: Missing Cleanup — Memory Leak
// BUG: event listener accumulates on every re-render
// ============================================
export function MemoryLeak_BROKEN() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    // BUG: adds a new listener on every render but NEVER removes them
    // After 10 renders: 10 listeners fire on every resize
    function handleResize() {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    // ← MISSING: return () => window.removeEventListener('resize', handleResize)
  }) // ← no deps: runs on EVERY render — 10 renders = 10 listeners!

  return <div>Width (broken): {windowWidth}px</div>
}

export function MemoryLeak_FIXED() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)

    // FIX: cleanup removes the listener when component unmounts or effect re-runs
    return () => window.removeEventListener('resize', handleResize)
  }, [])  // FIX: [] — only set up once on mount, clean up on unmount

  return <div>Width (fixed): {windowWidth}px</div>
}

// ============================================
// PUZZLE 3: The Infinite Loop
// BUG: effect runs → setState → re-render → effect runs → setState → ...
// ============================================
export function InfiniteLoop_BROKEN() {
  const [data, setData] = useState([])

  // BUG: no dependency array = runs after EVERY render
  // setData causes a re-render → effect runs again → setData → re-render → ...
  useEffect(() => {
    // This simulates "fetch data". In production this would be a real fetch.
    setData([{ id: 1 }, { id: 2 }, { id: 3 }])
    // ← NEVER do setState unconditionally in an effect with no [] or wrong deps
  }) // ← MISSING []

  return <div>Items (broken — would infinite loop): {data.length}</div>
}

export function InfiniteLoop_FIXED() {
  const [data, setData] = useState([])
  const [userId, setUserId] = useState(1)

  // FIX: add [] to run once, or [userId] to re-run only when userId changes
  useEffect(() => {
    // Simulated async fetch
    async function fetchData() {
      // In real code: const res = await fetch(`/api/user/${userId}/posts`)
      setData([{ id: 1, userId }, { id: 2, userId }])
    }
    fetchData()
  }, [userId])  // FIX: only re-run when userId changes

  return (
    <div>
      Items (fixed): {data.length}
      <button onClick={() => setUserId(id => id + 1)} style={{ marginLeft: '8px' }}>
        Next user
      </button>
    </div>
  )
}

// ============================================
// PUZZLE 4: Async useEffect — the wrong way
// BUG: can't make the effect callback async directly
// ============================================
export function AsyncEffect_BROKEN() {
  const [user, setUser] = useState(null)

  // BUG: making the effect itself async is technically allowed by JS but
  // returns a Promise, which React interprets as the cleanup function.
  // React logs a warning and the cleanup doesn't work as expected.
  useEffect(async () => {  // ← async here is problematic
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1')
    const data = await res.json()
    setUser(data)
    // The return value here is a Promise, not a cleanup function
    // React can't call promise.then(...) as if it were a cleanup
  }, [])

  return <div>User (broken pattern): {user?.name ?? 'Loading...'}</div>
}

export function AsyncEffect_FIXED() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // FIX: define the async function INSIDE the effect, then call it
  useEffect(() => {
    let cancelled = false  // guard against setting state after unmount

    async function fetchUser() {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users/1')
        const data = await res.json()
        if (!cancelled) {  // only update state if still mounted
          setUser(data)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) setLoading(false)
      }
    }

    fetchUser()

    return () => { cancelled = true }  // cleanup: prevent state update after unmount
  }, [])

  if (loading) return <div>Loading user...</div>
  return <div>User (fixed): {user?.name ?? 'Unknown'}</div>
}

// ============================================
// PUZZLE 5: Object/array dependency — always "changed"
// BUG: effect re-runs every render even though the logical value is the same
// ============================================
export function ObjectDep_BROKEN() {
  const [count, setCount] = useState(0)

  // BUG: 'options' is created inside the component — new object reference every render
  // Even though { delay: 1000 } looks the same, it's a NEW object each render
  // React compares by reference (===), not by value
  const options = { delay: 1000 }  // ← NEW reference each render

  useEffect(() => {
    console.log('[BROKEN] Effect ran — sees new options reference every render')
    // This runs on EVERY render because options is always a new reference
  }, [options])  // ← 'options' is new every render → infinite re-run

  return (
    <div>
      Count: {count}
      <button onClick={() => setCount(c => c + 1)}>Increment (triggers broken effect)</button>
    </div>
  )
}

export function ObjectDep_FIXED() {
  const [count, setCount] = useState(0)

  // FIX 1: move the object outside the component (if it's static)
  // FIX 2: useMemo to stabilize the reference
  // FIX 3: depend on primitive values instead of the object
  const delay = 1000  // ← primitive, stable reference

  useEffect(() => {
    console.log('[FIXED] Effect ran — only when delay changes')
  }, [delay])  // ← primitive: only re-runs if delay actually changes to a different number

  return (
    <div>
      Count: {count}
      <button onClick={() => setCount(c => c + 1)}>Increment (no extra effect)</button>
    </div>
  )
}

// ============================================
// GUIDED PROJECT: Real-time Clock + Stopwatch
// ============================================

// ---- Component 1: Live Clock ----
// Demonstrates: setInterval in useEffect with cleanup
export function LiveClock() {
  const [time, setTime] = useState(new Date())
  const [is24h, setIs24h] = useState(false)

  useEffect(() => {
    // Start ticking
    const timerId = setInterval(() => {
      setTime(new Date())  // functional update not needed — Date.now() is external
    }, 1000)

    // Cleanup: stop ticking when component unmounts
    return () => clearInterval(timerId)
  }, [])  // [] — only set up once

  const formatted = time.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: !is24h,
  })

  const dateStr = time.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div style={{ textAlign: 'center', padding: '20px', background: '#111827', borderRadius: '16px', color: '#fff', maxWidth: '280px' }}>
      <div style={{ fontSize: '2.5rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '2px', marginBottom: '4px' }}>
        {formatted}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '12px' }}>{dateStr}</div>
      <button
        onClick={() => setIs24h(v => !v)}
        style={{ padding: '4px 12px', background: '#374151', border: 'none', borderRadius: '6px', color: '#9ca3af', cursor: 'pointer', fontSize: '0.75rem' }}
      >
        {is24h ? '12h' : '24h'}
      </button>
    </div>
  )
}

// ---- Component 2: Stopwatch ----
// Demonstrates: complex timer management with useRef + useEffect
export function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)            // ms elapsed
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const startTimeRef = useRef(null)   // useRef: mutable value that doesn't trigger re-render
  const rafRef = useRef(null)         // requestAnimationFrame id

  // Use rAF for high-precision timing (better than setInterval for stopwatch)
  useEffect(() => {
    if (!running) {
      // Stop: cancel the animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }

    // Start: record start time, begin rAF loop
    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now() - elapsed
    }

    function tick() {
      setElapsed(performance.now() - startTimeRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    // Cleanup: cancel when running changes or component unmounts
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [running])  // re-run effect when running state changes

  function handleStartStop() {
    if (!running) {
      startTimeRef.current = performance.now() - elapsed
    }
    setRunning(r => !r)
  }

  function handleReset() {
    setRunning(false)
    setElapsed(0)
    setLaps([])
    startTimeRef.current = null
  }

  function handleLap() {
    if (!running) return
    setLaps(prev => [...prev, elapsed])
  }

  function formatMs(ms) {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const cs = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
  }

  return (
    <div style={{ textAlign: 'center', padding: '24px', background: '#111827', borderRadius: '16px', color: '#fff', maxWidth: '300px' }}>
      <div style={{ fontSize: '2.8rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '2px', marginBottom: '20px', color: running ? '#34d399' : '#fff' }}>
        {formatMs(elapsed)}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' }}>
        <button
          onClick={handleStartStop}
          style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', background: running ? '#ef4444' : '#22c55e', color: '#fff' }}
        >
          {running ? 'Stop' : elapsed > 0 ? 'Resume' : 'Start'}
        </button>
        {running && (
          <button onClick={handleLap} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: '#9ca3af', cursor: 'pointer', fontSize: '0.85rem' }}>
            Lap
          </button>
        )}
        {!running && elapsed > 0 && (
          <button onClick={handleReset} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: '#9ca3af', cursor: 'pointer', fontSize: '0.85rem' }}>
            Reset
          </button>
        )}
      </div>
      {laps.length > 0 && (
        <div style={{ maxHeight: '160px', overflowY: 'auto', textAlign: 'left' }}>
          {[...laps].reverse().map((lapTime, i) => {
            const lapNumber = laps.length - i
            const prev = lapNumber > 1 ? laps[lapNumber - 2] : 0
            const lapDiff = lapTime - prev
            const isBest = lapDiff === Math.min(...laps.map((t, j) => t - (j > 0 ? laps[j - 1] : 0)))
            return (
              <div key={lapNumber} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #1f2937', fontSize: '0.8rem' }}>
                <span style={{ color: '#6b7280' }}>Lap {lapNumber}</span>
                <span style={{ color: isBest ? '#fbbf24' : '#9ca3af' }}>{formatMs(lapDiff)}</span>
                <span style={{ color: '#6b7280' }}>{formatMs(lapTime)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ---- Putting it all together ----
export default function EffectEscape() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>Effect Escape 🧩</h1>
      <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '32px' }}>Study the 5 puzzles, then use the working components below.</p>

      <h2 style={{ fontSize: '1rem', marginBottom: '16px' }}>Working Components:</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <LiveClock />
        <Stopwatch />
      </div>

      <div style={{ marginTop: '32px', padding: '16px', background: '#f9fafb', borderRadius: '12px', fontSize: '0.8rem', color: '#6b7280' }}>
        <strong style={{ color: '#374151' }}>Puzzles above (study in the code):</strong>
        <ol style={{ marginTop: '8px', paddingLeft: '20px', lineHeight: '2' }}>
          <li>StaleClosure — setCount(count + 1) vs setCount(prev =&gt; prev + 1)</li>
          <li>MemoryLeak — missing removeEventListener cleanup</li>
          <li>InfiniteLoop — setState in effect with no/wrong deps</li>
          <li>AsyncEffect — async in useEffect callback directly</li>
          <li>ObjectDep — new object reference as dependency each render</li>
        </ol>
      </div>
    </div>
  )
}

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. What is the difference between useRef and useState?
//    Answer: Both persist values across renders. useState triggers a
//    re-render when updated. useRef does NOT trigger re-render — it's
//    a mutable container for values you need to read/write without
//    causing renders (timers, previous values, DOM elements, RAF ids).
//
// 2. Why use requestAnimationFrame instead of setInterval for the stopwatch?
//    Answer: setInterval(fn, 10) tries to fire every 10ms but can drift
//    due to main thread blocking. rAF fires before each screen paint at
//    the display's refresh rate. For time display, we compute
//    elapsed = performance.now() - startTime each frame — no drift.
//
// 3. Why capture startTimeRef outside the effect instead of inside?
//    Answer: If startTimeRef were inside the effect, it would be re-created
//    every time the effect re-runs (when 'running' changes). Using useRef
//    means the value persists across re-runs of the effect without causing
//    a re-render.
//
// 4. What does the 'cancelled' variable prevent in AsyncEffect_FIXED?
//    Answer: "Can't perform a React state update on an unmounted component."
//    If the component unmounts before fetch completes, setUser/setLoading
//    would throw (in older React) or silently fail (React 18+). The
//    cancelled flag is a guard: "only update state if still mounted."
// ============================================

// ============================================
// YOUR TURN: Build Real-time Clock + Stopwatch Extensions
// ============================================
// Extend the components above with these features:
//
// LiveClock extensions:
//   1. Timezone selector — show the same time in 3 different timezones
//      const ZONES = ['Asia/Kolkata', 'America/New_York', 'Europe/London']
//      Use Intl.DateTimeFormat with timeZone option
//   2. Alarm: let user set a time. When clock matches, play a beep:
//      const ctx = new AudioContext()
//      const osc = ctx.createOscillator()
//      osc.connect(ctx.destination); osc.start(); setTimeout(() => osc.stop(), 300)
//   3. World clock: show multiple cities in a scrollable list
//
// Stopwatch extensions:
//   1. Best/worst lap highlighting — gold for fastest, red for slowest
//   2. Countdown timer mode: user sets target time, counts DOWN to zero
//      When it hits 0, flash the display and play a sound
//   3. Split times: like a race — show time between each lap AND total time
//
// New component: useCountdown(targetDate)
//   Custom hook that returns { days, hours, minutes, seconds, isExpired }
//   Updates every second using setInterval in useEffect
//   Usage: const { days, hours } = useCountdown(new Date('2025-01-01'))

export function useCountdown(targetDate) {
  // YOUR CODE HERE
  // Returns: { days, hours, minutes, seconds, isExpired }
}

export function CountdownTimer({ targetDate, label }) {
  // YOUR CODE HERE using useCountdown
}

// ============================================
// BOSS CHALLENGE: Build a useWebSocket hook
// ============================================
// Build useWebSocket(url) that:
//   - Connects to a WebSocket in useEffect
//   - Returns { messages, sendMessage, connectionStatus, reconnect }
//   - Automatically reconnects on disconnect (exponential backoff)
//   - Closes the connection on unmount (cleanup)
//   - connectionStatus: 'connecting' | 'open' | 'closed' | 'reconnecting'
//   - messages: array of received messages
//   - sendMessage(data): sends a message if connection is open
//
// Test with: wss://echo.websocket.org (echoes back everything you send)
//
// RECONNECT ALGORITHM:
//   attempt 1: wait 1s
//   attempt 2: wait 2s
//   attempt 3: wait 4s
//   attempt 4: wait 8s
//   maxDelay: 30s
//   stop after 10 attempts

export function useWebSocket(url) {
  // YOUR CODE HERE
}

// ============================================
// PATTERN LEARNED: Observer (Side Effects)
// ============================================
// PATTERN NAME: useEffect as Observer / Subscriber
// WHEN YOU SEE: Anything that involves the outside world —
//               timers, events, subscriptions, DOM, APIs
// THE THREE QUESTIONS to ask before every useEffect:
//   1. WHAT am I setting up? (effect body)
//   2. WHAT should trigger re-setup? (dependency array)
//   3. WHAT should I clean up? (return function)
//
//   useEffect(() => {
//     // 1. SET UP: subscribe, connect, start timer
//     const subscription = someExternalSystem.subscribe(callback)
//
//     // 3. CLEAN UP: reverse what you set up
//     return () => subscription.unsubscribe()
//   }, [deps])  // 2. DEPS: what React values does the effect READ?
//
// DEPS RULES (from React docs):
//   Every reactive value used in the effect must be in the deps array.
//   Reactive values: props, state, context, anything derived from them.
//   Non-reactive: refs (ref.current), stable functions (from outside component),
//                 constants defined outside component.
//
// ESCAPE HATCHES from useEffect:
//   Event handlers: use onClick/onChange instead of addEventListener
//   Derived state: compute in render, don't sync in effect
//   useMemo/useCallback: memoize values instead of syncing them
//   External stores: use useSyncExternalStore instead of manual subscription
//
// REACT CONNECTION:
//   React 18 Strict Mode runs effects twice on mount to catch missing cleanup
//   React Query handles fetch lifecycle (no useEffect needed for data fetching)
//   useLayoutEffect: like useEffect but fires synchronously after DOM mutations
//   useInsertionEffect: for CSS-in-JS injection only
// ============================================
