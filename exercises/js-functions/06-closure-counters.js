// ============================================
// INTRO: What is Encapsulation + Factory Pattern and WHY it matters
// ============================================
// A factory function is a regular function that returns a new object/closure
// each time it's called — like a factory that produces items on demand.
// Combined with closures, each produced item has its own private state.
//
// WHY it matters: Factories are simpler than classes for many use cases.
// They avoid `this` bugs, don't need `new`, and naturally encapsulate state.
// Counter patterns specifically teach you how state management works —
// the same principle behind Redux reducers, React's useState, and game loops.
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// Imagine a vending machine factory:
// - The factory produces vending machines (createCounter())
// - Each machine has its own private inventory (private count variable)
// - Customers interact through the buttons (returned functions)
// - No customer can reach inside and change the inventory directly
// - Two machines are completely independent of each other
//
// The FACTORY is just a function that BUILDS and RETURNS the machine.
// The CLOSURE is the "memory" inside each machine, not shared with others.
// ============================================

// ============================================
// GUIDED EXERCISE: 5 Counter Types
// ============================================

console.log("=== CLOSURE COUNTERS ===\n");

// ---- Counter Type 1: Basic Counter ----
function createCounter(start = 0) {
  let count = start; // private

  return {
    increment() { count++; return count; },
    decrement() { count--; return count; },
    reset()     { count = start; return count; },
    value()     { return count; },
  };
}

const counter1 = createCounter(0);
const counter2 = createCounter(10); // Different start — different private state

console.log("--- Counter 1 (starts at 0) ---");
console.log(counter1.increment()); // 1
console.log(counter1.increment()); // 2
console.log(counter1.increment()); // 3
console.log(counter1.decrement()); // 2
console.log(counter1.value());     // 2
console.log(counter1.reset());     // 0

console.log("\n--- Counter 2 (starts at 10) ---");
console.log(counter2.increment()); // 11
console.log(counter2.value());     // 11 — completely independent of counter1
console.log(counter1.value());     // Still 0 — different closure!

// ---- Counter Type 2: Stepped Counter ----
function createSteppedCounter(step = 1, start = 0) {
  let count = start;

  return {
    next()   { count += step; return count; },
    prev()   { count -= step; return count; },
    reset()  { count = start; return count; },
    value()  { return count; },
  };
}

console.log("\n--- Stepped Counter (step=5) ---");
const byFive = createSteppedCounter(5, 0);
console.log(byFive.next()); // 5
console.log(byFive.next()); // 10
console.log(byFive.next()); // 15
console.log(byFive.prev()); // 10

// ---- Counter Type 3: Bounded Counter (won't exceed min/max) ----
function createBoundedCounter(min = 0, max = 10, start = 0) {
  let count = Math.max(min, Math.min(max, start)); // clamp initial value

  return {
    increment() {
      if (count < max) count++;
      else console.log(`Already at max (${max})`);
      return count;
    },
    decrement() {
      if (count > min) count--;
      else console.log(`Already at min (${min})`);
      return count;
    },
    value()   { return count; },
    isAtMax() { return count === max; },
    isAtMin() { return count === min; },
  };
}

console.log("\n--- Bounded Counter (0-3) ---");
const bounded = createBoundedCounter(0, 3);
console.log(bounded.increment()); // 1
console.log(bounded.increment()); // 2
console.log(bounded.increment()); // 3
console.log(bounded.increment()); // "Already at max (3)", returns 3
console.log(bounded.isAtMax());   // true
console.log(bounded.decrement()); // 2

// ---- Counter Type 4: History Counter (tracks all changes) ----
function createHistoryCounter(start = 0) {
  let count = start;
  const history = [{ action: "init", value: start }]; // private history log

  return {
    increment(label = "") {
      count++;
      history.push({ action: `increment${label ? ` (${label})` : ""}`, value: count });
      return count;
    },
    decrement(label = "") {
      count--;
      history.push({ action: `decrement${label ? ` (${label})` : ""}`, value: count });
      return count;
    },
    reset() {
      count = start;
      history.push({ action: "reset", value: count });
      return count;
    },
    value()   { return count; },
    getHistory() {
      return history.map((h, i) => `  ${i}. [${h.action}] → ${h.value}`).join("\n");
    },
    undo() {
      if (history.length <= 1) return "Nothing to undo.";
      history.pop(); // Remove last
      count = history[history.length - 1].value; // Restore previous value
      return count;
    },
  };
}

console.log("\n--- History Counter ---");
const hCounter = createHistoryCounter(0);
hCounter.increment("click 1");
hCounter.increment("click 2");
hCounter.decrement("undo click");
hCounter.increment("click 3");
console.log("Value:", hCounter.value());
console.log("History:\n" + hCounter.getHistory());
console.log("Undo:", hCounter.undo());
console.log("After undo:\n" + hCounter.getHistory());

// ---- Counter Type 5: Rate-Limited Counter ----
function createRateLimitedCounter(limit = 1000) {
  let count = 0;
  let lastAction = 0;

  return {
    increment() {
      const now = Date.now();
      if (now - lastAction < limit) {
        const wait = limit - (now - lastAction);
        return `Too fast! Wait ${wait}ms.`;
      }
      count++;
      lastAction = now;
      return count;
    },
    value() { return count; },
  };
}

console.log("\n--- Rate-Limited Counter (1 action per 100ms) ---");
const rateCounter = createRateLimitedCounter(100);
console.log(rateCounter.increment()); // 1
console.log(rateCounter.increment()); // "Too fast! Wait Xms."
console.log(rateCounter.value());     // 1

// ============================================
// CLASSIC BUG: The for-loop closure problem
// ============================================
console.log("\n=== THE CLASSIC FOR-LOOP CLOSURE BUG ===\n");

// BUG: var in a for-loop — all closures share the same `i`
console.log("--- BUG: var in for loop with setTimeout ---");
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    process.stdout.write(i + " "); // All print 5! Not 0,1,2,3,4
  }, 0);
}
setTimeout(() => console.log("\n^ All printed 5 (the bug)"), 10);

// FIX 1: Use `let` (creates a new `i` binding per iteration)
console.log("--- FIX 1: let in for loop ---");
for (let j = 0; j < 5; j++) {
  setTimeout(() => {
    process.stdout.write(j + " "); // Correctly prints 0,1,2,3,4
  }, 0);
}
setTimeout(() => console.log("\n^ Correctly prints 0 1 2 3 4"), 20);

// FIX 2: IIFE (Immediately Invoked Function Expression) — captures `i` as a parameter
console.log("--- FIX 2: IIFE to capture i ---");
for (var k = 0; k < 5; k++) {
  (function (captured) {
    setTimeout(() => {
      process.stdout.write(captured + " "); // Correctly prints 0,1,2,3,4
    }, 0);
  })(k); // Pass k to the IIFE — captured is a new variable each iteration
}
setTimeout(() => console.log("\n^ IIFE fix: 0 1 2 3 4"), 30);

// FIX 3: Factory function (most readable in practice)
console.log("--- FIX 3: Factory function ---");
function makeLogger(num) {
  return () => process.stdout.write(num + " "); // num is captured per call
}
for (var m = 0; m < 5; m++) {
  setTimeout(makeLogger(m), 0);
}
setTimeout(() => console.log("\n^ Factory fix: 0 1 2 3 4"), 40);

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. Why do all var-loop closures print the same final value?
//    Answer: var is function-scoped (or global). All 5 callbacks close over
//    the SAME variable `i`. By the time they run (after the loop), i = 5.
//
// 2. Why does `let` fix this?
//    Answer: let is block-scoped. Each loop iteration creates a NEW binding
//    of `j`. Each closure closes over a DIFFERENT `j`.
//
// 3. What is an IIFE and why does it work as a fix?
//    Answer: An IIFE (Immediately Invoked Function Expression) creates a new
//    scope immediately and captures `i` as a parameter. Parameters create
//    new bindings, so each iteration gets a fresh copy of the value.
//
// 4. What's the difference between a closure and a factory?
//    Answer: A closure is any function that captures variables from outer scope.
//    A factory is a closure that RETURNS a new object/function each call —
//    the pattern of using closures to produce independent instances.
// ============================================

// ============================================
// YOUR TURN: Build a timer manager using closures
// ============================================
// Build a createTimerManager() factory that manages multiple independent timers.
// Each timer has its own private state (elapsed time, running status).
//
// createTimerManager() should return:
//
//   createTimer(name)
//     → Creates a new named timer with private start time
//     → Returns a timer object with: start(), pause(), resume(), reset(), getElapsed()
//     → getElapsed() returns milliseconds since start (minus paused time)
//
//   listTimers()
//     → Shows all timers with their names and current status (running/paused)
//
//   stopAll()
//     → Pauses all running timers
//
// REQUIREMENTS:
//   - Each timer must be INDEPENDENT (separate closure)
//   - getElapsed() must correctly handle pause/resume (don't count paused time)
//   - Timer names must be unique (throw error if duplicate name)
//
// HINT for pause/resume:
//   Track: startTime, totalPausedMs, pauseStartTime, isRunning
//   On pause: record pauseStartTime
//   On resume: totalPausedMs += Date.now() - pauseStartTime
//   Elapsed: (Date.now() - startTime) - totalPausedMs

function createTimerManager() {
  // YOUR CODE HERE
}

// Test your timer manager:
console.log("\n=== YOUR TURN: Timer Manager ===\n");
const manager = createTimerManager();

const timer1 = manager.createTimer("API call");
const timer2 = manager.createTimer("Database query");

timer1.start();
setTimeout(() => {
  timer1.pause();
  console.log("Timer 1 elapsed after pause:", timer1.getElapsed(), "ms");
  timer2.start();
  setTimeout(() => {
    timer1.resume();
    console.log("Timer 2 elapsed:", timer2.getElapsed(), "ms");
    manager.listTimers();
    manager.stopAll();
    console.log("After stopAll:");
    manager.listTimers();
  }, 50);
}, 100);

// ============================================
// BOSS CHALLENGE: Compose counters with middleware
// ============================================
// Build withMiddleware(counter, middlewares) — a function that wraps a counter
// and runs middleware before/after each operation.
//
// Each middleware is an object: { before(action, value), after(action, result) }
//
// Middlewares to build:
//   loggingMiddleware  → logs every action and result
//   validationMiddleware → blocks increment if count > 100, decrement if count < 0
//   analyticsMiddleware → tracks how many times each action was called
//
// Usage:
//   const base = createCounter(0);
//   const enhanced = withMiddleware(base, [loggingMiddleware, validationMiddleware]);
//   enhanced.increment(); // middleware runs before and after
//   enhanced.decrement();
//
// HINT: Wrap each method: before calling original, run all before hooks.
//       After original, run all after hooks. Return the result.

const loggingMiddleware = {
  before(action, args) { console.log(`[LOG] Before ${action}(${args})`); },
  after(action, result) { console.log(`[LOG] After ${action} → ${result}`); },
};

const analyticsMiddleware = (() => {
  const counts = {};
  return {
    before(action) {
      counts[action] = (counts[action] || 0) + 1;
    },
    after() {},
    getReport() {
      return Object.entries(counts)
        .map(([k, v]) => `  ${k}: called ${v} times`)
        .join("\n");
    },
  };
})();

function withMiddleware(counter, middlewares) {
  // YOUR CODE HERE
  // Wrap each method of `counter` to call before/after on each middleware
}

console.log("\n=== BOSS CHALLENGE: Counter with Middleware ===\n");
const baseCounter = createCounter(0);
const enhanced = withMiddleware(baseCounter, [loggingMiddleware, analyticsMiddleware]);
enhanced.increment();
enhanced.increment();
enhanced.decrement();
enhanced.value();
console.log("Analytics:\n" + analyticsMiddleware.getReport());

// ============================================
// PATTERN LEARNED: Encapsulation + Factory
// ============================================
// PATTERN NAME: Factory + Closure for Private State
// WHEN YOU SEE: Multiple instances that each need independent private state
// USE THIS: A factory function (not a class) that returns an object of methods
//
// TEMPLATE:
//   function createThing(config) {
//     let privateState = config;    // private
//
//     return {
//       methodA() { /* modifies privateState */ },
//       methodB() { /* reads privateState */ },
//     };
//   }
//   const thing1 = createThing(1); // own private state
//   const thing2 = createThing(2); // completely separate private state
//
// THE for-loop CLOSURE BUG — three fixes:
//   1. Replace var with let (best)
//   2. IIFE: (function(copy) { ... })(i)
//   3. Factory: setTimeout(makeCallback(i), 0)
//
// REAL-WORLD USES:
//   - Counters for UI interactions (click tracking, pagination)
//   - Rate limiters (API call throttling)
//   - Undo/redo stacks
//   - Animation frame counters
// ============================================
