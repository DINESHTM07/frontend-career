# JavaScript Interview Questions — 60 Questions with Detailed Answers

> **How to use this guide:**
> - `🟢 EASY` `🟡 MEDIUM` `🔴 HARD` — calibrate your depth of answer
> - `🔥 VERY COMMON` `📌 COMMON` `💡 RARE` — prioritize your prep time
> - Read the **Interview Tip** on every question — these are the differentiators
> - Work through the code examples by hand before your interview

---

## Table of Contents

1. [Event Loop & Async](#1-event-loop--async) — 10 questions
2. [Closures & Scope](#2-closures--scope) — 8 questions
3. [this & Prototypes](#3-this--prototypes) — 8 questions
4. [Hoisting & TDZ](#4-hoisting--tdz) — 5 questions
5. [Promises & Async/Await](#5-promises--asyncawait) — 8 questions
6. [ES6+ Features](#6-es6-features) — 6 questions
7. [DOM & Events](#7-dom--events) — 5 questions
8. [Error Handling](#8-error-handling) — 3 questions
9. [Type Coercion & Equality](#9-type-coercion--equality) — 4 questions
10. [Miscellaneous](#10-miscellaneous) — 3 questions

---

## 1. Event Loop & Async

---

### Q1. What is the JavaScript event loop and how does it work?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

JavaScript is **single-threaded** — it has one call stack and can only execute one piece of code at a time. The event loop is the mechanism that allows JS to perform non-blocking async operations despite this limitation.

The runtime has five key components:

1. **Call Stack** — LIFO structure where function calls are pushed/popped. When empty, the event loop checks the queues.
2. **Web APIs** (browser) / **Node APIs** — Handle async work outside the JS engine: `setTimeout`, `fetch`, DOM events, `fs.readFile`, etc.
3. **Macrotask Queue** (Task Queue) — Holds callbacks from: `setTimeout`, `setInterval`, `setImmediate` (Node), I/O, UI events.
4. **Microtask Queue** — Holds callbacks from: `Promise.then/catch/finally`, `queueMicrotask()`, `MutationObserver`. **Processed entirely before the next macrotask.**
5. **Event Loop** — Continuously checks: if the call stack is empty, drain the entire microtask queue, then pick ONE macrotask, run it, drain microtasks again, repeat.

**Priority order (highest to lowest):**
1. Synchronous code (call stack)
2. Microtasks (`Promise` callbacks)
3. Macrotasks (`setTimeout` callbacks)

```js
console.log('1 — sync');

setTimeout(() => console.log('2 — macrotask'), 0);

Promise.resolve()
  .then(() => console.log('3 — microtask'))
  .then(() => console.log('4 — microtask chained'));

console.log('5 — sync');

// Output:
// 1 — sync
// 5 — sync
// 3 — microtask        ← microtask queue drained before macrotask
// 4 — microtask chained
// 2 — macrotask

// Walk-through:
// Call stack runs 1, queues setTimeout callback, queues promise microtask, runs 5.
// Stack empty → drain microtasks: 3, then its .then chains 4.
// Microtask queue empty → pick one macrotask: 2.
```

**A trickier example:**

```js
console.log('start');

setTimeout(() => {
  console.log('timeout 1');
  Promise.resolve().then(() => console.log('promise inside timeout'));
}, 0);

setTimeout(() => console.log('timeout 2'), 0);

Promise.resolve().then(() => console.log('promise 1'));

console.log('end');

// Output:
// start
// end
// promise 1           ← microtask queue
// timeout 1           ← first macrotask
// promise inside timeout  ← microtasks from inside the macrotask are drained BEFORE next macrotask
// timeout 2           ← second macrotask
```

#### Common Follow-up Questions
- "What's the difference between microtask and macrotask queues?"
- "Can infinite microtask chains starve the macrotask queue?" (Yes — `while(true) Promise.resolve().then(...)` starves it)
- "Where does `queueMicrotask()` fit?"
- "What about `requestAnimationFrame` — macrotask or special?" (Special — runs before paint, after macrotask, before microtasks of the next frame)

#### Interview Tip
Draw the diagram on a whiteboard or describe it step-by-step: "First sync runs, stack empties, microtasks drain completely, then one macrotask runs, then microtasks drain again..." Interviewers want to see you *trace execution*, not just recite the definition. Always walk through a live example.

---

### Q2. What is the difference between `setTimeout(fn, 0)` and `Promise.resolve().then(fn)`?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

Both schedule code to run asynchronously (after current synchronous code), but they go into different queues with different priorities:

- `setTimeout(fn, 0)` → **macrotask queue** — runs after ALL microtasks are processed
- `Promise.resolve().then(fn)` → **microtask queue** — runs before any macrotask, as soon as the call stack empties

The `0` in `setTimeout` doesn't mean "run immediately" — it means "run no sooner than 0ms". The actual delay is usually 1–4ms minimum in browsers, and you still wait for microtasks.

```js
// Which runs first?
setTimeout(() => console.log('A — timeout'), 0);
Promise.resolve().then(() => console.log('B — promise'));

// Output:
// B — promise   ← microtask runs first
// A — timeout   ← macrotask runs second

// ─── Practical implication ───────────────────────────────────────────
// Use Promise microtasks when you need something to run after the current
// operation but before the browser can render or process other events.

// Use setTimeout when you intentionally want to defer work past the
// current rendering cycle (e.g., avoid blocking the UI).
```

#### Common Follow-up Questions
- "Can you use `queueMicrotask()` instead of `Promise.resolve().then()`?" (Yes, and it's clearer in intent)
- "What happens if you have 10,000 chained `.then()` calls?" (Microtask queue fills up — synchronous-feeling but deferred)

#### Interview Tip
The interviewer is testing whether you know the microtask/macrotask distinction. Don't just say "Promise is faster" — explain *why*: different queues, different processing order in the event loop.

---

### Q3. What is a callback hell and how do you avoid it?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

**Callback hell** (also called the "pyramid of doom") occurs when multiple async operations are nested inside each other using callbacks, creating deeply indented, hard-to-read, hard-to-maintain code.

Problems with callback hell:
1. **Readability** — logic flows right instead of down
2. **Error handling** — must handle errors at every level
3. **Inversion of control** — you hand control to a third-party function
4. **No return values** — can't use the result directly

```js
// ─── Callback Hell ───────────────────────────────────────────────────
getUser(userId, (err, user) => {
  if (err) return handleError(err);

  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);

    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);

      getShipping(details.shippingId, (err, shipping) => {
        if (err) return handleError(err);
        // Deeply nested — the "pyramid of doom"
        render({ user, orders, details, shipping });
      });
    });
  });
});

// ─── Solution 1: Named functions (flatten the pyramid) ───────────────
function handleShipping(err, shipping) {
  if (err) return handleError(err);
  render({ shipping });
}
function handleDetails(err, details) {
  if (err) return handleError(err);
  getShipping(details.shippingId, handleShipping);
}
// ... still awkward, still callback-based

// ─── Solution 2: Promises (best for sequential async) ────────────────
getUser(userId)
  .then(user => getOrders(user.id))
  .then(orders => getOrderDetails(orders[0].id))
  .then(details => getShipping(details.shippingId))
  .then(shipping => render(shipping))
  .catch(handleError); // ONE error handler for the whole chain

// ─── Solution 3: Async/Await (most readable) ─────────────────────────
async function loadOrderData(userId) {
  try {
    const user     = await getUser(userId);
    const orders   = await getOrders(user.id);
    const details  = await getOrderDetails(orders[0].id);
    const shipping = await getShipping(details.shippingId);
    render({ user, orders, details, shipping });
  } catch (err) {
    handleError(err);
  }
}
```

#### Common Follow-up Questions
- "What are the trade-offs between Promises and async/await?"
- "How do you run multiple async operations in parallel?" (`Promise.all`)
- "What is `util.promisify` in Node.js?" (Converts callback-style functions to Promises)

#### Interview Tip
Show you know *why* it's a problem, not just that it looks ugly. Mention error handling and inversion of control — that's what separates a surface-level answer from a senior-level one.

---

### Q4. What is the difference between concurrency and parallelism in JavaScript?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

- **Concurrency** — multiple tasks make progress over time by interleaving. JavaScript achieves this through the event loop. Only one piece of code runs at a time, but async I/O allows other operations to "happen" while JS is doing something else.
- **Parallelism** — multiple tasks run at the *exact same time* on multiple CPU cores. JS itself doesn't support this in the main thread, but Web Workers / Worker Threads in Node.js enable true parallelism.

```js
// ─── Concurrency (JS default — interleaved, not simultaneous) ────────
async function fetchConcurrently() {
  // These are concurrent — both requests are in-flight at the same time
  // but JS processes their callbacks one at a time
  const [users, posts] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
  ]);
  console.log({ users, posts });
}

// Compare: Sequential (NOT concurrent — each waits for the previous)
async function fetchSequentially() {
  const users = await fetch('/api/users').then(r => r.json()); // waits
  const posts = await fetch('/api/posts').then(r => r.json()); // waits
  console.log({ users, posts });
  // Total time: time(users) + time(posts)
  // Concurrent time: max(time(users), time(posts))
}

// ─── Parallelism via Web Workers ─────────────────────────────────────
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: hugeArray });
worker.onmessage = (e) => console.log('Result:', e.data);
// worker.js runs on a separate thread — true parallelism
// Use for CPU-intensive tasks: image processing, compression, crypto

// ─── Node.js parallel with worker_threads ────────────────────────────
const { Worker } = require('worker_threads');
const worker = new Worker('./compute.js', { workerData: { n: 40 } });
worker.on('message', result => console.log('Fibonacci:', result));
```

#### Common Follow-up Questions
- "When would you use a Web Worker?"
- "Does `Promise.all` create parallelism?" (No — concurrent, not parallel. The requests fire at the same time but JS processes callbacks single-threaded.)

#### Interview Tip
Many candidates confuse `Promise.all` with parallelism. Be explicit: `Promise.all` is *concurrent* — it starts all async operations immediately, but JavaScript is still single-threaded. True parallelism requires Web Workers.

---

### Q5. What is `requestAnimationFrame` and how does it relate to the event loop?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

`requestAnimationFrame(callback)` schedules a callback to run before the browser's next repaint — roughly every 16.7ms at 60fps. It's optimized for animations because:

1. It runs in sync with the display refresh rate
2. It pauses when the tab is hidden (saves battery/CPU)
3. Multiple `rAF` calls in one frame are batched

In the event loop, `rAF` callbacks run **after the current macrotask and its microtasks, but before the browser renders**. The order is roughly:

1. Macrotask (e.g., `setTimeout`)
2. Microtasks (Promises)
3. `requestAnimationFrame` callbacks
4. Browser renders / paints

```js
// ─── Correct animation pattern ───────────────────────────────────────
function animate(timestamp) {
  // timestamp is a high-resolution time from the browser
  const progress = timestamp - startTime;
  element.style.transform = `translateX(${Math.min(progress / 10, 200)}px)`;

  if (progress < 2000) {
    requestAnimationFrame(animate); // schedule next frame
  }
}
let startTime;
requestAnimationFrame((timestamp) => {
  startTime = timestamp;
  animate(timestamp);
});

// ─── Why NOT setTimeout for animation ────────────────────────────────
// Bad: fires every 16ms regardless of actual display refresh
// Causes tearing, wasted frames, runs even when tab is hidden
setInterval(() => {
  element.style.left = `${pos++}px`; // ❌ not synced to display
}, 16);

// ─── Cancelling rAF ──────────────────────────────────────────────────
const frameId = requestAnimationFrame(animate);
// Later:
cancelAnimationFrame(frameId);

// ─── Batching DOM reads/writes for performance ────────────────────────
// Read phase (avoid layout thrashing)
const heights = elements.map(el => el.offsetHeight); // force layout once

// Write phase
requestAnimationFrame(() => {
  elements.forEach((el, i) => {
    el.style.height = `${heights[i] * 2}px`; // write in next frame
  });
});
```

#### Common Follow-up Questions
- "What is layout thrashing and how does `rAF` help prevent it?"
- "How would you implement a smooth scroll animation?"
- "What's the difference between `rAF` and `setInterval` for animations?"

#### Interview Tip
Mention that `rAF` is the *browser's* animation primitive — it aligns with the display's vsync. For React devs, note that React's concurrent mode uses a similar concept for scheduling renders.

---

### Q6. Explain `setImmediate`, `process.nextTick`, and their differences from `setTimeout` in Node.js.

**🔴 HARD** | **📌 COMMON**

#### Concept

These are Node.js-specific scheduling APIs that sit at different points in Node's event loop (which has additional phases compared to the browser):

- **`process.nextTick(fn)`** — runs at the end of the CURRENT operation, before the event loop continues to the next phase. It has its own queue that's processed before Promise microtasks. This makes it the highest-priority async callback in Node.
- **`setImmediate(fn)`** — runs in the **check phase** of Node's event loop — after I/O callbacks, before `setTimeout`/`setInterval` when called from I/O.
- **`setTimeout(fn, 0)`** — runs in the **timers phase** — after the check phase completes.

**Node event loop phases (simplified):**
```
timers → I/O → poll → check (setImmediate) → close callbacks
```
Between each phase: process `nextTick` queue, then Promise microtasks.

```js
// ─── Basic ordering ──────────────────────────────────────────────────
console.log('sync 1');

process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('Promise'));
setImmediate(() => console.log('setImmediate'));
setTimeout(() => console.log('setTimeout 0'), 0);

console.log('sync 2');

// Output:
// sync 1
// sync 2
// nextTick       ← nextTick queue (before Promise microtasks)
// Promise        ← Promise microtask queue
// setTimeout 0   ← timers phase (or setImmediate first — it varies outside I/O)
// setImmediate   ← check phase

// ─── Inside I/O callback: setImmediate always before setTimeout ───────
const fs = require('fs');
fs.readFile('./file.txt', () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  // Inside I/O: immediate ALWAYS fires before timeout
  // Output:
  // immediate
  // timeout
});

// ─── nextTick use case: ensure async behavior ─────────────────────────
class EventEmitter {
  constructor() {
    this.callbacks = [];
  }
  on(event, cb) {
    this.callbacks.push(cb);
    return this;
  }
  emit(event) {
    // Without nextTick, emit() is synchronous
    // With nextTick, listeners fire after the current stack clears
    process.nextTick(() => this.callbacks.forEach(cb => cb()));
  }
}
// Allows code after .on() to run before the listener fires
emitter.on('data', () => console.log('got data'));
emitter.emit('data'); // listener fires on next tick, after this stack frame

// ─── WARNING: nextTick can starve the event loop ──────────────────────
function recursiveNextTick() {
  process.nextTick(recursiveNextTick); // ❌ NEVER do this — starves I/O
}
```

#### Common Follow-up Questions
- "When would you use `process.nextTick` vs a Promise?"
- "Why can `process.nextTick` be dangerous?"
- "What is the poll phase of Node's event loop?"

#### Interview Tip
This is a Node.js-specific question. If the role is Node-focused, know this cold. Key differentiator: `process.nextTick` runs *before* Promise microtasks (despite being "next tick" — it's actually the highest-priority deferred callback in Node).

---

### Q7. What is a Web Worker and when would you use one?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

A **Web Worker** runs a script in a background thread, separate from the main thread. It enables true multi-threading in the browser. Workers:

- Have NO access to the DOM
- Communicate with the main thread via `postMessage` / `onmessage` (structured cloning or Transferables)
- Are great for CPU-intensive tasks that would block the UI

```js
// ─── main.js ─────────────────────────────────────────────────────────
const worker = new Worker('worker.js');

// Send data to worker (structured clone — creates a copy)
worker.postMessage({ type: 'COMPUTE', data: largeArray });

// Receive result
worker.onmessage = (event) => {
  console.log('Result from worker:', event.data);
  worker.terminate(); // clean up
};

worker.onerror = (error) => {
  console.error('Worker error:', error.message);
};

// ─── worker.js (runs in background thread) ───────────────────────────
self.onmessage = function(event) {
  const { type, data } = event.data;

  if (type === 'COMPUTE') {
    // This can block without freezing the UI
    const result = expensiveComputation(data); // e.g., sorting 1M items
    self.postMessage(result);
  }
};

function expensiveComputation(data) {
  return data.sort((a, b) => a - b).slice(0, 100);
}

// ─── Transferable objects (zero-copy, faster than cloning) ───────────
const buffer = new ArrayBuffer(1024 * 1024); // 1MB
// Transfer ownership (buffer is unusable in main thread after this)
worker.postMessage({ buffer }, [buffer]); // second arg = transferables

// ─── SharedArrayBuffer (shared memory between threads) ────────────────
const sharedBuffer = new SharedArrayBuffer(4);
const sharedArray = new Int32Array(sharedBuffer);
// Both main thread and worker can read/write this buffer directly
// Use Atomics for synchronization: Atomics.add(), Atomics.wait()
worker.postMessage({ sharedBuffer });

// ─── Good use cases for Web Workers ──────────────────────────────────
// ✅ Image/video processing and filtering
// ✅ Large dataset sorting or filtering
// ✅ Encryption / hashing
// ✅ Real-time audio processing (AudioWorklet)
// ✅ Complex physics simulations
// ✅ Parsing large JSON or CSV files
// ❌ DOM manipulation (not allowed)
// ❌ Accessing window, document, localStorage
```

#### Common Follow-up Questions
- "What's a `SharedArrayBuffer` and what's `Atomics`?"
- "What's the difference between a Web Worker and a Service Worker?"
- "How do you share state between a worker and the main thread efficiently?"

#### Interview Tip
Most candidates know workers exist but can't speak to *how* the communication works. Mentioning structured cloning vs Transferables shows senior-level knowledge. Bonus: mention Service Workers are a different concept — they proxy network requests.

---

### Q8. What happens when you `await` inside a `forEach` loop?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

`await` inside `forEach` **does NOT work as expected**. `forEach` doesn't know about Promises — it ignores the returned Promise from the async callback, so all iterations kick off in parallel (not sequentially) and `forEach` itself returns before any of them complete.

```js
const urls = ['/api/1', '/api/2', '/api/3'];

// ─── ❌ WRONG: await inside forEach ──────────────────────────────────
async function fetchAll_WRONG() {
  urls.forEach(async (url) => {
    const data = await fetch(url).then(r => r.json()); // await is IGNORED by forEach
    console.log(data); // runs, but unpredictably
  });
  // fetchAll_WRONG resolves HERE, before any fetches complete!
  console.log('done'); // prints BEFORE any fetch completes
}

// ─── ✅ Option 1: for...of loop (sequential) ──────────────────────────
async function fetchSequential() {
  for (const url of urls) {
    const data = await fetch(url).then(r => r.json()); // awaits each one
    console.log(data);
  }
  console.log('done'); // prints AFTER all fetches complete
}
// Total time: sum of all request times

// ─── ✅ Option 2: Promise.all (concurrent — usually preferred) ────────
async function fetchConcurrent() {
  const results = await Promise.all(
    urls.map(url => fetch(url).then(r => r.json()))
  );
  console.log(results); // all data available at once
  console.log('done'); // prints after ALL fetches complete
}
// Total time: longest single request

// ─── ✅ Option 3: Promise.allSettled (concurrent, handles failures) ───
async function fetchAllSettled() {
  const results = await Promise.allSettled(
    urls.map(url => fetch(url).then(r => r.json()))
  );
  results.forEach(result => {
    if (result.status === 'fulfilled') console.log(result.value);
    else console.error(result.reason);
  });
}

// ─── ✅ Option 4: for...of with concurrency limit (rate limiting) ─────
async function fetchWithLimit(urls, limit = 3) {
  const results = [];
  for (let i = 0; i < urls.length; i += limit) {
    const batch = urls.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map(fetch));
    results.push(...batchResults);
  }
  return results;
}
```

#### Common Follow-up Questions
- "What about `for...in` with async?" (Same problem — don't use)
- "What does `Promise.allSettled` do that `Promise.all` doesn't?"
- "How would you process items with a concurrency limit?"

#### Interview Tip
This is a very common gotcha question. The key insight: `forEach` calls each callback and ignores its return value. Since async functions return Promises, those Promises are silently discarded. Always use `for...of` (sequential) or `Promise.all(arr.map(...))` (concurrent).

---

### Q9. What is a memory leak in JavaScript and how do you detect one?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

A **memory leak** occurs when memory that is no longer needed cannot be garbage collected — because the garbage collector (GC) can still find a reference to it. JavaScript uses mark-and-sweep GC: anything reachable from a "root" (like `window`) is kept alive.

Common causes:

```js
// ─── 1. Forgotten event listeners ────────────────────────────────────
function setupListener() {
  const button = document.getElementById('btn');
  const data = new Array(10000).fill('memory'); // large data

  button.addEventListener('click', () => {
    console.log(data); // closure keeps `data` alive as long as listener exists
  });
  // ❌ If button is removed from DOM but listener not removed, data leaks
}

// ✅ Fix: remove listener when done
const handler = () => console.log('clicked');
button.addEventListener('click', handler);
// Later:
button.removeEventListener('click', handler);
// Or: use AbortController
const controller = new AbortController();
button.addEventListener('click', handler, { signal: controller.signal });
controller.abort(); // removes all listeners added with this signal

// ─── 2. Closures holding references ──────────────────────────────────
function outer() {
  const hugeThing = new Array(1_000_000).fill('data'); // 1M items

  return function inner() {
    console.log('I exist'); // hugeThing is in scope even if not used!
  };
}
const fn = outer();
// fn holds hugeThing in memory even though it never references it
// ✅ Fix: explicitly null out large objects when done
// hugeThing = null; inside outer before returning

// ─── 3. Global variables ─────────────────────────────────────────────
function accidentalGlobal() {
  leaked = 'oops'; // ❌ no var/let/const — becomes window.leaked
}
// 'use strict' prevents this

// ─── 4. Timers not cleared ────────────────────────────────────────────
let cache = {};
const interval = setInterval(() => {
  cache[Date.now()] = new Array(1000).fill('data'); // grows forever
}, 100);
// ❌ interval runs forever, cache grows unbounded
// ✅ Fix:
clearInterval(interval);
// Or use WeakMap for caches

// ─── 5. Detached DOM nodes ───────────────────────────────────────────
let detachedList;
function createList() {
  const ul = document.createElement('ul');
  li.appendChild(ul);
  detachedList = ul; // ❌ JS reference keeps DOM subtree in memory
}
ul.remove(); // removed from DOM but still referenced via detachedList

// ─── Detecting leaks with Chrome DevTools ─────────────────────────────
// 1. Memory tab → Take Heap Snapshot before and after suspected leak
// 2. Compare snapshots — look for objects that grew unexpectedly
// 3. Performance tab → Record → check memory timeline for "sawtooth" vs
//    upward trend (upward = leak)
// 4. console.memory — basic heap size info

// ─── WeakMap / WeakRef for cache that doesn't prevent GC ─────────────
const cache2 = new WeakMap(); // keys are GC'd when the object is no longer used
function process(obj) {
  if (cache2.has(obj)) return cache2.get(obj);
  const result = expensiveOp(obj);
  cache2.set(obj, result); // won't prevent obj from being GC'd
  return result;
}
```

#### Common Follow-up Questions
- "How does JavaScript's garbage collector work?"
- "What's a WeakMap and how does it differ from a regular Map?"
- "How do you use Chrome DevTools to find memory leaks?"

#### Interview Tip
Mention 3–4 concrete causes with solutions, not just "you forgot to clean up." The WeakMap/WeakRef answer shows you understand GC mechanics — that's a strong signal of senior-level thinking.

---

### Q10. What is debouncing and throttling? When do you use each?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

Both limit how often a function runs. The distinction is *when* the function runs:

- **Debounce** — waits until there's a pause in calls. The function runs **after** N ms of silence. Use for: search input, window resize, form validation.
- **Throttle** — ensures the function runs **at most once** every N ms, regardless of how many times it's called. Use for: scroll handlers, mousemove, game loops, button spam prevention.

```js
// ─── Debounce implementation ──────────────────────────────────────────
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId); // reset the timer on every call
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Usage: search box — only fires API call 300ms after user stops typing
const searchInput = document.getElementById('search');
const handleSearch = debounce(async (e) => {
  const results = await fetchSearchResults(e.target.value);
  renderResults(results);
}, 300);
searchInput.addEventListener('input', handleSearch);

// ─── Throttle implementation ───────────────────────────────────────────
function throttle(fn, interval) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// Usage: scroll handler — fires at most every 100ms
const handleScroll = throttle(() => {
  updateProgressBar(window.scrollY);
}, 100);
window.addEventListener('scroll', handleScroll);

// ─── Debounce with leading edge (fires on FIRST call, then waits) ─────
function debounceLeading(fn, delay) {
  let timeoutId;
  return function (...args) {
    if (!timeoutId) fn.apply(this, args); // fire immediately on first call
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null; // reset — allow next call to fire immediately
    }, delay);
  };
}

// ─── Visual comparison ────────────────────────────────────────────────
// Calls:     ─ A A A A _ _ B B _ _ _ _ C C C _
//
// Debounce:  ─ . . . . . . A . . . . B . . . . C
//            (fires after each burst ends)
//
// Throttle:  ─ A . . A . . B . . B . . C . . C .
//            (fires at regular intervals throughout burst)

// ─── When to use which ────────────────────────────────────────────────
// Debounce:  search-as-you-type, resize handler (final size), autocomplete
// Throttle:  scroll position, mouse tracking, button rate-limiting, game tick
```

#### Common Follow-up Questions
- "Can you implement debounce without `setTimeout`?"
- "What's the difference between leading and trailing edge debounce?"
- "How does Lodash's `_.debounce` differ from your implementation?" (cancellable, flush method, both leading/trailing options)

#### Interview Tip
Implement both from scratch — interviewers frequently ask you to code these live. The key differentiator is explaining *which problems each solves*: debounce = "wait for calm", throttle = "pace the rate". Drawing the timeline diagram above is very effective in a whiteboard interview.

---

## 2. Closures & Scope

---

### Q11. What is a closure? Give a practical example.

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

A **closure** is a function that has access to variables from its outer (enclosing) scope, even after that outer function has returned. In JavaScript, every function creates a closure — it "closes over" the variables it references.

When a function is created, it captures a reference to its surrounding lexical scope, not a copy of the values. This means it can read AND write those outer variables.

```js
// ─── Basic closure ───────────────────────────────────────────────────
function makeCounter() {
  let count = 0; // count lives in makeCounter's scope

  return {
    increment() { count++; },
    decrement() { count--; },
    getCount()  { return count; },
  };
}

const counter = makeCounter();
counter.increment();
counter.increment();
counter.increment();
counter.decrement();
console.log(counter.getCount()); // 2
// `count` is private — can only be accessed via the returned methods

// ─── Each closure gets its OWN scope instance ─────────────────────────
const counterA = makeCounter();
const counterB = makeCounter();
counterA.increment();
counterA.increment();
counterB.increment();
console.log(counterA.getCount()); // 2
console.log(counterB.getCount()); // 1 — independent!

// ─── Practical use: memoization ──────────────────────────────────────
function memoize(fn) {
  const cache = {}; // this cache persists via closure

  return function (...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      console.log('Cache hit!');
      return cache[key];
    }
    cache[key] = fn(...args);
    return cache[key];
  };
}

const expensiveFn = memoize((n) => {
  console.log('Computing...');
  return n * n;
});
expensiveFn(5); // "Computing..." → 25
expensiveFn(5); // "Cache hit!" → 25 (no computation)

// ─── Practical use: partial application ──────────────────────────────
function multiply(x) {
  return (y) => x * y; // y closes over x
}
const double = multiply(2);
const triple = multiply(3);
console.log(double(5));  // 10
console.log(triple(5));  // 15

// ─── Practical use: private state (module pattern) ────────────────────
const bankAccount = (() => {
  let balance = 1000; // private

  return {
    deposit(amount)  { balance += amount; },
    withdraw(amount) {
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
    },
    getBalance() { return balance; },
  };
})(); // IIFE — runs immediately, returns the object

bankAccount.deposit(500);
bankAccount.withdraw(200);
console.log(bankAccount.getBalance()); // 1300
console.log(bankAccount.balance);      // undefined — private!
```

#### Common Follow-up Questions
- "What is the classic `var` in a loop closure bug?" (Q12 below)
- "What are the memory implications of closures?"
- "How do closures relate to the module pattern?"
- "What's the difference between a closure and a class with private fields?"

#### Interview Tip
After explaining the concept, give a practical example — counter, memoize, or partial application. Interviewers want to see that you use closures as a design tool, not just that you can define the word. Mention the memory implication: a closure keeps its outer scope alive, which can cause leaks if you're not careful.

---

### Q12. Explain the classic `var` in a loop bug and three ways to fix it.

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

This is one of the most famous JavaScript gotchas. When using `var` in a `for` loop, all iterations share the **same** `i` variable (because `var` is function-scoped, not block-scoped). By the time the async callbacks run, the loop has already finished and `i` equals the final value.

```js
// ─── The Bug ─────────────────────────────────────────────────────────
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // expects 0, 1, 2 — actually prints 3, 3, 3
  }, 1000);
}
// Why? var i is shared across all closures.
// By the time setTimeout fires, the loop has ended and i === 3.
// All three callbacks close over the SAME i.

// ─── Fix 1: let (block scope) — SIMPLEST, most modern ────────────────
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // 0, 1, 2 ✅
  }, 1000);
}
// `let` creates a NEW binding of i for each loop iteration
// Each callback closes over its own i

// ─── Fix 2: IIFE (immediately invoked function expression) ───────────
for (var i = 0; i < 3; i++) {
  ((j) => {               // IIFE creates a new scope, capturing i as j
    setTimeout(() => {
      console.log(j);     // 0, 1, 2 ✅
    }, 1000);
  })(i);                  // pass current i as argument
}

// ─── Fix 3: bind or closure factory ──────────────────────────────────
function createCallback(i) {
  return () => console.log(i); // i is a new parameter — separate binding
}
for (var i = 0; i < 3; i++) {
  setTimeout(createCallback(i), 1000); // 0, 1, 2 ✅
}

// ─── Also broken in object methods ───────────────────────────────────
var fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i); // all functions close over the same i
}
console.log(fns[0]()); // 3 ❌ (not 0)
console.log(fns[1]()); // 3 ❌
console.log(fns[2]()); // 3 ❌

// Fixed with let:
var fns2 = [];
for (let i = 0; i < 3; i++) {
  fns2.push(() => i);
}
console.log(fns2[0]()); // 0 ✅
console.log(fns2[1]()); // 1 ✅
console.log(fns2[2]()); // 2 ✅
```

#### Common Follow-up Questions
- "Why does `let` fix this?" (Creates a new binding per iteration)
- "Does this bug apply to `for...of` with `var`?" (Yes — same issue)
- "What if you want to delay by `i * 100` ms?" (Works fine — the timing argument uses i correctly, it's the callback closure that's the problem)

#### Interview Tip
Interviewers love this question because it tests closures, `var` scoping, and async simultaneously. The `let` fix is correct but make sure you can also explain *why* it works — "let creates a new binding per iteration, so each closure captures a different variable."

---

### Q13. What is the difference between lexical scope and dynamic scope?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

**Lexical scope** (static scope) — variable lookup is determined by where the function is **defined** in the source code, not where it's called from. JavaScript uses lexical scope.

**Dynamic scope** — variable lookup is determined by the **call stack** — where the function is called from. Some languages (Bash, early Lisp, Perl) use this. JavaScript does NOT use dynamic scope (except `this`, which behaves somewhat dynamically).

```js
// ─── Lexical scope in action ─────────────────────────────────────────
const x = 'global';

function outer() {
  const x = 'outer';

  function inner() {
    console.log(x); // 'outer' — looks up scope chain where DEFINED
  }

  return inner;
}

const fn = outer();
fn(); // 'outer' — not 'global', even though called from global scope

// If JS used dynamic scope, fn() would print 'global' because it's called
// from global scope. It doesn't — it prints 'outer' because that's
// where inner() was DEFINED.

// ─── Scope chain ─────────────────────────────────────────────────────
const a = 1;

function level1() {
  const b = 2;

  function level2() {
    const c = 3;

    function level3() {
      // Has access to c, b, a via the scope chain
      console.log(a, b, c); // 1, 2, 3
    }
    level3();
  }
  level2();
}
level1();

// ─── Lexical scope with arrow functions vs regular functions ─────────
// Arrow functions capture `this` lexically
// Regular functions have `this` determined dynamically (by call site)
const obj = {
  value: 42,
  getValueArrow: () => this.value,    // lexical this — captures outer this (undefined/window)
  getValueRegular() { return this.value; }, // dynamic this — determined by how it's called
};
console.log(obj.getValueArrow());   // undefined (or window.value) — NOT 42
console.log(obj.getValueRegular()); // 42 — `this` is obj because of dot notation call
```

#### Common Follow-up Questions
- "Why is `this` not lexically scoped in regular functions?"
- "How does the scope chain work in JavaScript?"
- "What is the difference between scope and context?"

#### Interview Tip
The `this` keyword is where JavaScript breaks the purely lexical model — it's determined by the call site (dynamic), not the definition site. Arrow functions restore lexical behavior for `this`, which is why they're preferred in callbacks. This connects scope, `this`, and arrow functions in one coherent answer.

---

### Q14. What is an IIFE and what problems does it solve?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

An **IIFE** (Immediately Invoked Function Expression) is a function that runs immediately after it's defined. It creates a new scope, which was the primary way to create private scope before ES6 modules and block-scoped variables.

```js
// ─── Syntax variants ─────────────────────────────────────────────────
(function() { /* ... */ })();     // wrapped function expression, then called
(function() { /* ... */ }());     // Crockford style
(() => { /* ... */ })();          // arrow function IIFE
!function() { /* ... */ }();      // unary operator variant (less common)

// ─── Problem 1: Avoid polluting the global scope ──────────────────────
// Before ES6 modules, all script files shared one global scope.
// Each <script> tag's variables leaked into window.

// Bad (var is global):
var utils = { helper: function() {} };   // window.utils — conflicts possible

// Good (IIFE keeps it private):
(function() {
  var privateState = 'hidden';
  window.myLib = { // intentionally expose only what's needed
    doSomething() { console.log(privateState); }
  };
})();
console.log(typeof privateState); // "undefined" — not leaked

// ─── Problem 2: Capture mutable values in loops (pre-ES6) ────────────
// (The var-in-loop bug from Q12 — IIFE was the pre-let fix)
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 1000); // 0, 1, 2
  })(i);
}

// ─── Problem 3: Initialize modules with private state ────────────────
const counter = (function() {
  let count = 0;         // private — not accessible outside
  return {
    increment() { return ++count; },
    getCount()  { return count; },
  };
})();
counter.increment(); // 1
counter.increment(); // 2
console.log(counter.count); // undefined — private!

// ─── Modern equivalent: ES6 modules ──────────────────────────────────
// In ES6+, every module file has its own scope by default.
// No IIFE needed — just use `export` what you want to expose.

// module.js
let privateState = 'hidden'; // not exported — stays private
export function doSomething() { console.log(privateState); }

// ─── Still useful for async top-level (pre-top-level-await) ──────────
(async function() {
  const data = await fetch('/api').then(r => r.json());
  console.log(data);
  // This was needed before top-level await was supported
})();
```

#### Common Follow-up Questions
- "Is IIFE still relevant with ES6 modules?"
- "What's the Revealing Module Pattern?"
- "What's the difference between a function declaration and a function expression?"

#### Interview Tip
Acknowledge that IIFEs are less common now with ES6 modules, but they still appear in transpiled code (Babel/TypeScript output) and in environments without module support. Understanding them shows you know JavaScript's history — which matters for debugging legacy codebases.

---

### Q15. What is the difference between `var`, `let`, and `const`?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

Three dimensions matter: **scope**, **hoisting**, and **re-assignment/re-declaration**.

```js
// ─── Scope ───────────────────────────────────────────────────────────
function scopeDemo() {
  var funcScoped = 'visible throughout function';

  if (true) {
    var also = 'also function-scoped';        // leaks out of if block
    let block = 'block-scoped';               // stays in the if block
    const blockConst = 'also block-scoped';   // stays in the if block
  }

  console.log(also);        // 'also function-scoped' ✅ (var leaked)
  // console.log(block);    // ReferenceError — block is not defined
}

// ─── Hoisting ────────────────────────────────────────────────────────
console.log(x); // undefined (var hoisted, initialized to undefined)
var x = 5;

// console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;       // y is in TDZ until this line

// ─── Re-declaration ──────────────────────────────────────────────────
var a = 1;
var a = 2; // ✅ OK — var can be re-declared

let b = 1;
// let b = 2; // ❌ SyntaxError: Identifier 'b' has already been declared

const c = 1;
// const c = 2; // ❌ SyntaxError: same

// ─── Re-assignment ────────────────────────────────────────────────────
var v = 1; v = 2;   // ✅
let l = 1; l = 2;   // ✅
const k = 1;
// k = 2;           // ❌ TypeError: Assignment to constant variable

// ─── const is NOT immutable — only the binding is constant ───────────
const obj = { name: 'Alice' };
obj.name = 'Bob';   // ✅ — mutating the object is fine
// obj = {};        // ❌ — reassigning the variable is not fine

const arr = [1, 2, 3];
arr.push(4);        // ✅ — mutating the array is fine
// arr = [];        // ❌ — reassigning is not fine

// Use Object.freeze() for true immutability:
const frozen = Object.freeze({ x: 1, y: 2 });
frozen.x = 99;      // silently fails (or throws in strict mode)
console.log(frozen.x); // still 1

// ─── Global behavior ─────────────────────────────────────────────────
var globalVar = 'on window';
console.log(window.globalVar); // 'on window' — var adds to global object

let globalLet = 'not on window';
console.log(window.globalLet); // undefined — let does NOT add to global

// ─── Summary table ───────────────────────────────────────────────────
//              var         let         const
// Scope:       function    block       block
// Hoisted:     yes (undef) yes (TDZ)   yes (TDZ)
// Re-declare:  yes         no          no
// Re-assign:   yes         yes         no
// Global prop: yes         no          no
```

#### Common Follow-up Questions
- "When should you use `const` vs `let`?" (Default to `const`, use `let` when you need to reassign)
- "Is `const` immutable?" (No — the binding is constant, not the value)
- "What is the temporal dead zone?" (See Q21)

#### Interview Tip
Always lead with the three dimensions: scope, hoisting, and mutability. The `const` immutability nuance is a reliable follow-up — many candidates say "const is immutable" which is only half-true.

---

### Q16. What is variable shadowing?

**🟢 EASY** | **📌 COMMON**

#### Concept

Variable **shadowing** occurs when a variable in an inner scope has the same name as a variable in an outer scope. The inner variable "shadows" the outer one — the outer one is inaccessible (but not destroyed) within that inner scope.

```js
// ─── Basic shadowing ─────────────────────────────────────────────────
const x = 'outer';

function shadow() {
  const x = 'inner'; // shadows the outer x
  console.log(x);    // 'inner' — outer x is hidden here
}

shadow();
console.log(x); // 'outer' — outer x is unchanged

// ─── Block-level shadowing ────────────────────────────────────────────
let count = 0;

function processItems(items) {
  for (const item of items) {
    let count = 0; // shadows outer count — each loop has its own count
    item.values.forEach(v => count += v);
    console.log(`Item total: ${count}`);
  }
  console.log(`Outer count: ${count}`); // still 0 — untouched
}

// ─── Common source of bugs ────────────────────────────────────────────
function processUser(user) {
  const name = user.name; // 'Alice'

  if (user.hasAlias) {
    const name = user.alias; // ❌ accidentally shadows — outer name lost
    // You can't access user.name as `name` here anymore
    console.log(name); // alias, not original name
  }

  console.log(name); // original name — but developer might expect alias
}

// ─── var shadowing is trickier ────────────────────────────────────────
var value = 'global';
function outer() {
  console.log(value); // undefined! (var hoisted, not yet assigned)
  var value = 'local'; // hoisting means: var value is declared at top of function
  console.log(value); // 'local'
}
outer();

// ─── Parameter shadowing ──────────────────────────────────────────────
const message = 'global message';
function greet(message) { // parameter shadows global
  console.log(message);   // uses the parameter, not global
}
greet('hello'); // 'hello'
```

#### Common Follow-up Questions
- "Is shadowing a bug or a feature?"
- "How do ESLint rules handle shadowing?" (`no-shadow` rule flags it)
- "How can you access the outer variable when it's been shadowed?"

#### Interview Tip
Show you know shadowing can be intentional (loop variable `i`) or accidental (a common bug). Mention that linters like ESLint have a `no-shadow` rule to catch accidental shadowing. In React, it's common to shadow `error` in catch blocks — perfectly intentional.

---

### Q17. What is a pure function and how does it relate to closures?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

A **pure function** is a function that:
1. Given the same inputs, always returns the same output
2. Has no side effects (doesn't modify external state, doesn't do I/O)

Closures can either support or break purity:
- A closure that **reads** outer state might not be pure (output depends on mutable external state)
- A closure that **creates** private state (counter, memoize) is useful but impure by definition

```js
// ─── Pure functions ───────────────────────────────────────────────────
const add = (a, b) => a + b;          // ✅ pure — same input → same output
const double = (arr) => arr.map(x => x * 2); // ✅ pure — doesn't mutate arr

// ─── Impure functions ─────────────────────────────────────────────────
let total = 0;
const addToTotal = (n) => { total += n; return total; }; // ❌ mutates external state
const getTime = () => Date.now();      // ❌ different output each call
const saveUser = (user) => db.save(user); // ❌ side effect (I/O)

// ─── How closures relate ──────────────────────────────────────────────
// Impure closure (captures mutable outer state):
let multiplier = 2;
const impureMultiply = (n) => n * multiplier; // ❌ if multiplier changes, output changes
multiplier = 3;
impureMultiply(5); // 15 now, not 10

// Pure closure (all state is internal and constant):
function createMultiplier(multiplier) {
  return (n) => n * multiplier; // ✅ multiplier is captured once, immutable
}
const double2 = createMultiplier(2);
double2(5); // always 10

// ─── Why purity matters ───────────────────────────────────────────────
// ✅ Testable — no need to mock external state
// ✅ Cacheable / memoizable — same input → same output
// ✅ Parallelizable — no shared state to protect
// ✅ Predictable — easier to reason about

// ─── React: pure components and purity ───────────────────────────────
// React's render functions should be pure:
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>; // ✅ same props → same output
}

// Side effects belong in useEffect, not during render:
function UserProfile({ userId }) {
  useEffect(() => {
    fetchUser(userId); // ✅ side effect isolated
  }, [userId]);
  // render is pure
}
```

#### Common Follow-up Questions
- "Can you memoize an impure function?"
- "What is referential transparency?"
- "How does Redux enforce pure reducers?"

#### Interview Tip
Connect pure functions to React (render functions should be pure), Redux (reducers must be pure), and functional programming. This shows breadth. Also: "pure functions are safe to memoize, safe to test, safe to run in parallel — that's why functional programming values them."

---

### Q18. What is currying and how is it implemented in JavaScript?

**🔴 HARD** | **📌 COMMON**

#### Concept

**Currying** transforms a function that takes multiple arguments into a sequence of functions each taking a single argument. Named after mathematician Haskell Curry.

`f(a, b, c)` becomes `f(a)(b)(c)`

Benefits: partial application, reusable specialized functions, function composition.

```js
// ─── Manual currying ─────────────────────────────────────────────────
// Before:
const add = (a, b) => a + b;
add(1, 2); // 3

// Curried:
const curriedAdd = (a) => (b) => a + b;
curriedAdd(1)(2); // 3

const add5 = curriedAdd(5); // partial application — fixes `a` to 5
add5(3);  // 8
add5(10); // 15

// ─── Generic curry function ───────────────────────────────────────────
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      // Enough args provided — call the original function
      return fn.apply(this, args);
    }
    // Not enough args — return a function that collects more
    return function (...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

const multiply = curry((a, b, c) => a * b * c);
multiply(2)(3)(4);   // 24
multiply(2, 3)(4);   // 24 — can also pass multiple at once
multiply(2)(3, 4);   // 24
multiply(2, 3, 4);   // 24

// ─── Practical examples ───────────────────────────────────────────────
// Curried logger
const log = curry((level, message) => console[level](message));
const info  = log('log');
const warn  = log('warn');
const error = log('error');
info('Server started');   // console.log('Server started')
warn('Disk space low');   // console.warn(...)
error('DB connection failed'); // console.error(...)

// Curried filter
const filter = curry((predicate, array) => array.filter(predicate));
const getEven = filter(n => n % 2 === 0);
const getPositive = filter(n => n > 0);
getEven([1, 2, 3, 4, 5]);      // [2, 4]
getPositive([-2, -1, 0, 1, 2]); // [1, 2]

// ─── Currying vs Partial Application ─────────────────────────────────
// Currying: always ONE argument at a time: f(a)(b)(c)
// Partial Application: fix SOME arguments, get a function for the rest
const partialAdd = (a) => (b, c) => a + b + c; // partial — not fully curried
partialAdd(1)(2, 3); // 6

// Function.prototype.bind is partial application:
function greet(greeting, name) { return `${greeting}, ${name}!`; }
const hello = greet.bind(null, 'Hello'); // fixes `greeting` to 'Hello'
hello('Alice'); // 'Hello, Alice!'
hello('Bob');   // 'Hello, Bob!'
```

#### Common Follow-up Questions
- "What's the difference between currying and partial application?"
- "How does Ramda or Lodash handle currying?"
- "When would you actually use currying in production?"

#### Interview Tip
Implement `curry` from scratch — it comes up in coding challenges. The key is the `args.length >= fn.length` check: `fn.length` is the number of declared parameters. Mention the limitation: it doesn't work with variadic functions (`...args` has `length === 0`).

---

## 3. `this` & Prototypes

---

### Q19. How does `this` work in JavaScript? What are the four rules?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

`this` is determined **at call time** (dynamic binding), not at definition time (except arrow functions). There are four binding rules, applied in this priority order:

1. **`new` binding** — `this` is the newly created object
2. **Explicit binding** — `call`, `apply`, `bind` — `this` is whatever you pass
3. **Implicit binding** — dot notation — `this` is the object before the dot
4. **Default binding** — standalone function call — `this` is `undefined` (strict) or `window`/`global` (sloppy)

```js
// ─── Rule 4: Default binding (lowest priority) ────────────────────────
function showThis() {
  console.log(this);
}
showThis(); // window (sloppy) / undefined (strict mode)

// ─── Rule 3: Implicit binding ─────────────────────────────────────────
const user = {
  name: 'Alice',
  greet() { console.log(`Hi, I'm ${this.name}`); }
};
user.greet(); // "Hi, I'm Alice" — this = user (dot notation)

// ⚠️ Implicit binding LOST when method is extracted:
const greetFn = user.greet;
greetFn(); // "Hi, I'm undefined" — lost! Now a standalone call (default binding)

const btn = document.querySelector('button');
btn.addEventListener('click', user.greet); // ❌ this = btn, not user

// ─── Rule 2: Explicit binding ─────────────────────────────────────────
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}
const alice = { name: 'Alice' };
const bob   = { name: 'Bob' };

greet.call(alice, 'Hello', '!');  // "Hello, Alice!" — this = alice
greet.apply(bob, ['Hey', '?']);   // "Hey, Bob?"     — this = bob

// bind: returns a new function with this permanently bound
const aliceGreet = greet.bind(alice, 'Hi');
aliceGreet('.');   // "Hi, Alice."
aliceGreet('!');   // "Hi, Alice!"

// ─── Rule 1: new binding (highest priority) ───────────────────────────
function Person(name) {
  // `this` is the new object created by `new`
  this.name = name;
  this.greet = function() { console.log(`I'm ${this.name}`); };
}
const p = new Person('Bob');
p.greet(); // "I'm Bob"

// ─── Arrow functions: NO `this` of their own ─────────────────────────
const timer = {
  seconds: 0,
  start() {
    // Arrow function inherits `this` from start() — the timer object
    setInterval(() => {
      this.seconds++; // ✅ this = timer
      console.log(this.seconds);
    }, 1000);
  },
  startBroken() {
    setInterval(function() {
      this.seconds++; // ❌ this = window — regular function, default binding
    }, 1000);
  }
};

// ─── Explicit always beats implicit ──────────────────────────────────
const obj = {
  name: 'obj',
  greet() { return this.name; }
};
const override = { name: 'override' };
obj.greet.call(override); // 'override' — explicit wins
```

#### Common Follow-up Questions
- "What does `this` equal inside an arrow function?"
- "How do you permanently bind `this`?" (`bind`)
- "What happens to `this` in a callback?" (Usually lost — use arrow or bind)
- "What is the order of priority for `this` binding rules?"

#### Interview Tip
The four rules + priority order is the gold standard answer. Always mention the "this is lost" problem with extracted methods — it's a very common real-world bug. Arrow functions solve this by capturing `this` lexically.

---

### Q20. What is prototypal inheritance and how does it differ from classical inheritance?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

**Classical inheritance** (Java, C++) — classes are blueprints; objects are instances of classes; inheritance creates is-a hierarchies via class extension.

**Prototypal inheritance** (JavaScript) — objects inherit directly from other objects via a prototype chain. There are no classes (in the traditional sense — ES6 `class` is syntactic sugar over prototypes). Every object has a hidden `[[Prototype]]` link to another object.

When you access a property, JS looks up the prototype chain until it finds the property or hits `null`.

```js
// ─── Prototype chain basics ───────────────────────────────────────────
const animal = {
  breathe() { console.log('breathing...'); }
};

const dog = Object.create(animal); // dog's prototype is animal
dog.bark = function() { console.log('woof!'); };

dog.bark();    // own property — found immediately
dog.breathe(); // not on dog → found on animal (prototype) ✅
console.log(dog.hasOwnProperty('bark'));    // true
console.log(dog.hasOwnProperty('breathe')); // false

// ─── The prototype chain ──────────────────────────────────────────────
// dog → animal → Object.prototype → null
console.log(Object.getPrototypeOf(dog) === animal); // true

// ─── Constructor functions (pre-ES6 pattern) ──────────────────────────
function Animal(name) {
  this.name = name; // own property
}
Animal.prototype.speak = function() { // shared method on prototype
  console.log(`${this.name} makes a sound`);
};

function Dog(name, breed) {
  Animal.call(this, name); // "inherit" own properties
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype); // set up prototype chain
Dog.prototype.constructor = Dog;                  // restore constructor ref
Dog.prototype.bark = function() { console.log('Woof!'); };

const rex = new Dog('Rex', 'Labrador');
rex.bark();   // own prototype method
rex.speak();  // inherited from Animal.prototype

// ─── ES6 class syntax (same prototype mechanics under the hood) ────────
class AnimalES6 {
  constructor(name) { this.name = name; }
  speak() { console.log(`${this.name} makes a sound`); } // on prototype
}

class DogES6 extends AnimalES6 {
  constructor(name, breed) {
    super(name); // calls AnimalES6 constructor
    this.breed = breed;
  }
  bark() { console.log('Woof!'); }
}

const buddy = new DogES6('Buddy', 'Poodle');
buddy.bark();
buddy.speak();

// Verify it's still prototypal under the hood:
console.log(Object.getPrototypeOf(DogES6.prototype) === AnimalES6.prototype); // true
console.log(typeof DogES6); // 'function' — class is just a function!

// ─── Key differences from classical inheritance ───────────────────────
// Classical:    copies methods from parent class to child class (compile-time)
// Prototypal:   links objects at runtime — shared methods live on prototype
//               objects can inherit from any object, not just classes

// ─── Object.create for pure prototypal style ──────────────────────────
const vehicleProto = {
  refuel() { console.log('Refueling...'); }
};
const car = Object.create(vehicleProto);
car.drive = function() { console.log('Driving...'); };
// car → vehicleProto → Object.prototype → null
```

#### Common Follow-up Questions
- "What is `__proto__` vs `prototype`?"
- "What's the difference between `Object.create(proto)` and `new Constructor()`?"
- "How does `hasOwnProperty` work?"

#### Interview Tip
Key distinction: `prototype` is a property on **functions**. `__proto__` (or `[[Prototype]]`) is on **objects**. When you call `new Dog()`, the created object's `[[Prototype]]` is set to `Dog.prototype`. If you can explain this, you're in the top 20% of candidates.

---

### Q21. What is the difference between `__proto__`, `prototype`, and `Object.getPrototypeOf()`?

**🔴 HARD** | **📌 COMMON**

#### Concept

Three different things that all relate to the prototype chain:

- **`prototype`** — A property that exists on **functions**. When a function is used as a constructor with `new`, the created object's `[[Prototype]]` is set to `Constructor.prototype`.
- **`__proto__`** — A (deprecated) accessor property on **objects** that exposes their `[[Prototype]]`. Avoid using it directly.
- **`Object.getPrototypeOf(obj)`** — The modern, standard way to get an object's prototype. Equivalent to `obj.__proto__` but not deprecated.

```js
// ─── prototype: a property on FUNCTIONS ──────────────────────────────
function Dog(name) { this.name = name; }
Dog.prototype.bark = function() { console.log('woof'); };

console.log(typeof Dog.prototype);          // 'object'
console.log(Dog.prototype.constructor === Dog); // true — circular reference

// ─── __proto__: a property on OBJECTS (deprecated, avoid) ────────────
const rex = new Dog('Rex');
console.log(rex.__proto__ === Dog.prototype); // true
// __proto__ is an accessor on Object.prototype — supported everywhere but
// deprecated in favor of getPrototypeOf

// ─── Object.getPrototypeOf: the standard way ──────────────────────────
console.log(Object.getPrototypeOf(rex) === Dog.prototype); // true
console.log(Object.getPrototypeOf(Dog.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null — end of chain

// ─── The full chain ───────────────────────────────────────────────────
// rex → Dog.prototype → Object.prototype → null

// ─── What `new` does internally ───────────────────────────────────────
function newKeyword(Constructor, ...args) {
  // 1. Create a new empty object
  const obj = Object.create(Constructor.prototype); // [[Prototype]] = Constructor.prototype
  // 2. Call the constructor with `this` = new object
  const result = Constructor.apply(obj, args);
  // 3. Return the new object (or constructor's return value if it's an object)
  return result instanceof Object ? result : obj;
}

const fido = newKeyword(Dog, 'Fido');
fido.bark(); // 'woof' ✅

// ─── Object.setPrototypeOf (avoid — slow) ────────────────────────────
// You can change an object's prototype dynamically:
const protoA = { greet() { return 'Hello from A'; } };
const protoB = { greet() { return 'Hello from B'; } };
const obj = Object.create(protoA);
obj.greet(); // 'Hello from A'
Object.setPrototypeOf(obj, protoB); // changes [[Prototype]] at runtime
obj.greet(); // 'Hello from B'
// ⚠️ This is a performance killer — JS engines optimize based on stable shapes

// ─── Quick reference ──────────────────────────────────────────────────
// Function.prototype    → shared methods for instances (bark, speak, etc.)
// obj.__proto__         → deprecated accessor for obj's [[Prototype]]
// Object.getPrototypeOf → standard way to read [[Prototype]]
// Object.create(proto)  → create object with specific [[Prototype]]
```

#### Common Follow-up Questions
- "What does `instanceof` actually check?" (Walks the prototype chain looking for `Constructor.prototype`)
- "Can you change an object's prototype after creation?" (Yes, but don't)
- "What is `Object.create(null)`?" (Creates an object with NO prototype — useful for pure dictionaries)

#### Interview Tip
The key insight to communicate: `prototype` is on **functions**, `__proto__` / `Object.getPrototypeOf` are on **instances**. The confusion arises because function objects also have `__proto__` (pointing to `Function.prototype`). Drawing the diagram helps immensely.

---

### Q22. What does `Object.create(null)` do and why would you use it?

**🔴 HARD** | **💡 RARE**

#### Concept

`Object.create(null)` creates an object with **no prototype** — its `[[Prototype]]` is `null`, not `Object.prototype`. This means it has no inherited methods at all: no `toString`, no `hasOwnProperty`, no `valueOf`, etc.

This is useful when you want a truly clean dictionary object with no inherited properties that could conflict with your keys.

```js
// ─── Normal object has inherited properties ───────────────────────────
const normalObj = {};
console.log(normalObj.toString);       // [Function: toString] (inherited)
console.log(normalObj.hasOwnProperty); // [Function: hasOwnProperty]
console.log('toString' in normalObj);  // true (inherited)

// ─── null prototype object ────────────────────────────────────────────
const pureDict = Object.create(null);
console.log(pureDict.toString);       // undefined — no prototype!
console.log(pureDict.hasOwnProperty); // undefined
console.log(Object.getPrototypeOf(pureDict)); // null

// ─── Why use it: safe dictionary ─────────────────────────────────────
// If users can set arbitrary keys, 'constructor', 'toString', '__proto__'
// keys could shadow inherited properties or cause weird bugs.

const safeCache = Object.create(null);
safeCache['constructor'] = 'user-provided'; // ✅ no conflict
safeCache['__proto__'] = 'user-provided';   // ✅ just a key, not special

const unsafeCache = {};
unsafeCache['__proto__'] = { evil: true }; // ⚠️ prototype pollution risk

// ─── Prototype pollution attack (why null prototype helps) ────────────
// Attacker sends: { "__proto__": { "isAdmin": true } }
const mergeUnsafe = (target, source) => Object.assign(target, source);
const userInput = JSON.parse('{"__proto__": {"isAdmin": true}}');
// mergeUnsafe({}, userInput) could pollute Object.prototype in old code

// Safe lookup maps
const allowedActions = Object.create(null);
allowedActions.read  = true;
allowedActions.write = false;

if (allowedActions['read']) { /* safe — no prototype chain to traverse */ }

// ─── The trade-off ────────────────────────────────────────────────────
// Can't use Object.prototype methods directly:
const d = Object.create(null);
d.key = 'value';
// d.hasOwnProperty('key'); ❌ — no such method
Object.prototype.hasOwnProperty.call(d, 'key'); // ✅ workaround
Object.hasOwn(d, 'key'); // ✅ ES2022 static method — works on any object
```

#### Common Follow-up Questions
- "What is prototype pollution and how do you prevent it?"
- "What's the difference between `Object.hasOwn` and `hasOwnProperty`?"
- "When would you use a `Map` instead?" (Map is better for programmatic key-value storage)

#### Interview Tip
This is an advanced question. Mentioning prototype pollution turns it into a security discussion — impressive for senior roles. Connecting it to `Map` (which has no prototype collision issues) shows you know the full tool set.

---

### Q23. How do `call`, `apply`, and `bind` differ?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

All three explicitly set `this`. The difference is in invocation and argument passing:

- **`call(thisArg, arg1, arg2, ...)`** — invokes immediately, arguments listed individually
- **`apply(thisArg, [arg1, arg2, ...])`** — invokes immediately, arguments as an array
- **`bind(thisArg, arg1, ...)`** — returns a NEW function with `this` permanently bound (and optionally partial arguments)

```js
function introduce(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}
const alice = { name: 'Alice' };
const bob   = { name: 'Bob' };

// call — invoke immediately, args listed
introduce.call(alice, 'Hello', '!');  // "Hello, I'm Alice!"
introduce.call(bob,   'Hi',   '?');   // "Hi, I'm Bob?"

// apply — invoke immediately, args as array
introduce.apply(alice, ['Hey', '.']); // "Hey, I'm Alice."
// Useful when you have args as an array:
const args = ['Howdy', '~'];
introduce.apply(bob, args); // "Howdy, I'm Bob~"

// bind — returns new function, does NOT invoke
const aliceIntro = introduce.bind(alice);
aliceIntro('Greetings', '!'); // "Greetings, I'm Alice!" (invoked later)

// bind with partial application (pre-fill arguments)
const aliceHello = introduce.bind(alice, 'Hello');
aliceHello('!');  // "Hello, I'm Alice!"
aliceHello('...'); // "Hello, I'm Alice..."

// ─── Practical uses ───────────────────────────────────────────────────
// 1. Borrowing methods
const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
const arr = Array.prototype.slice.call(arrayLike); // ['a', 'b', 'c']
// Modern equivalent:
const arr2 = Array.from(arrayLike);

// 2. apply for spread (pre-ES6)
const numbers = [5, 2, 8, 1, 9];
const max = Math.max.apply(null, numbers); // 9
// Modern equivalent:
const max2 = Math.max(...numbers);

// 3. bind for callbacks
class Button {
  constructor(label) { this.label = label; }
  handleClick() { console.log(`${this.label} clicked`); }
  attachListener() {
    document.querySelector('#btn')
      .addEventListener('click', this.handleClick.bind(this)); // ✅
  }
}

// 4. bind for React (before arrow functions were common)
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this); // bind in constructor
  }
  handleClick() { this.setState(s => ({ count: s.count + 1 })); }
}
```

#### Common Follow-up Questions
- "Can you bind an arrow function?" (No — arrow functions ignore explicit binding)
- "What does `bind` return if the function is already bound?" (A new function — the first bind wins for `this`)
- "What's the performance difference between `call` and `apply`?"

#### Interview Tip
The mnemonic: **C**all = **C**omma-separated args, **A**pply = **A**rray of args, **B**ind = **B**ound (returns new function). The most important practical use: `bind` in class constructors or passing methods as callbacks. In modern React with hooks and arrow functions, explicit `bind` is less common but still appears in class components and library code.

---

### Q24. What is the `new` keyword doing under the hood?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

`new Constructor(args)` does four things:
1. Creates a new empty object
2. Sets that object's `[[Prototype]]` to `Constructor.prototype`
3. Calls `Constructor` with `this` set to the new object
4. Returns the new object (unless the constructor explicitly returns a non-null object)

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}, ${this.age} years old`;
};

// What `new Person('Alice', 30)` does step by step:
function simulateNew(Constructor, ...args) {
  // Step 1: Create new empty object
  const obj = {};

  // Step 2: Set prototype
  Object.setPrototypeOf(obj, Constructor.prototype);
  // Equivalent: obj.__proto__ = Constructor.prototype;

  // Step 3: Call constructor with obj as `this`
  const result = Constructor.apply(obj, args);

  // Step 4: Return obj, unless constructor returned a non-null object
  return result !== null && typeof result === 'object' ? result : obj;
}

const alice = simulateNew(Person, 'Alice', 30);
alice.greet(); // "Hi, I'm Alice, 30 years old"
alice instanceof Person; // true

// ─── The return value override ────────────────────────────────────────
function Weird() {
  this.x = 1;
  return { x: 99, y: 99 }; // explicit object return — overrides `new`
}
const w = new Weird();
console.log(w.x); // 99 (the returned object)
console.log(w.y); // 99

function Weird2() {
  this.x = 1;
  return 42; // primitive return — ignored, `new` returns `this`
}
const w2 = new Weird2();
console.log(w2.x); // 1 (42 was ignored)

// ─── ES6 class under the hood ─────────────────────────────────────────
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
}
// Equivalent to:
function AnimalFn(name) { this.name = name; }
AnimalFn.prototype.speak = function() { return `${this.name} makes a sound`; };

// Both create the same prototype chain when used with `new`
const a1 = new Animal('Cat');
const a2 = new AnimalFn('Dog');
Object.getPrototypeOf(a1) === Animal.prototype;   // true
Object.getPrototypeOf(a2) === AnimalFn.prototype; // true
```

#### Common Follow-up Questions
- "What happens if you call a constructor without `new`?" (In non-strict mode, `this` = window and you pollute globals. In strict mode, `this` = undefined → TypeError. ES6 classes always throw if called without `new`.)
- "What is `new.target`?" (Inside a constructor, `new.target` is the constructor if called with `new`, else `undefined`)

#### Interview Tip
Implement `new` from scratch — it's a common coding interview question. The step that most candidates miss is step 4 (the return value check). Mentioning that ES6 classes prevent calling without `new` (they throw a TypeError) shows awareness of the safety improvement.

---

### Q25. What is `Object.defineProperty` and how does it work?

**🔴 HARD** | **📌 COMMON**

#### Concept

`Object.defineProperty(obj, prop, descriptor)` gives you fine-grained control over property behavior via a **property descriptor**. Two types: **data descriptors** (value + writable) and **accessor descriptors** (get + set).

Descriptor attributes:
- `value` — the property's value
- `writable` — can the value be changed?
- `enumerable` — does it show up in `for...in` / `Object.keys()`?
- `configurable` — can the property be deleted or redefined?
- `get` / `set` — getter/setter functions (accessor descriptor)

```js
const obj = {};

// ─── Data descriptor ──────────────────────────────────────────────────
Object.defineProperty(obj, 'name', {
  value: 'Alice',
  writable: false,     // can't change
  enumerable: true,    // shows in Object.keys()
  configurable: false, // can't delete or redefine
});

obj.name = 'Bob'; // silently fails (throws in strict mode)
console.log(obj.name); // 'Alice' — unchanged
delete obj.name;        // silently fails

// ─── Accessor descriptor (getter/setter) ──────────────────────────────
const user = { _age: 25 };
Object.defineProperty(user, 'age', {
  get() { return this._age; },
  set(value) {
    if (value < 0 || value > 150) throw new RangeError('Invalid age');
    this._age = value;
  },
  enumerable: true,
  configurable: true,
});

user.age = 30;  // calls setter ✅
user.age = -1;  // ❌ throws RangeError
console.log(user.age); // calls getter → 30

// ─── Modern equivalent: class getters/setters ─────────────────────────
class Person {
  #age; // private field (ES2022)
  constructor(age) { this.#age = age; }
  get age() { return this.#age; }
  set age(value) {
    if (value < 0) throw new RangeError('Invalid age');
    this.#age = value;
  }
}

// ─── Object.defineProperties (multiple at once) ───────────────────────
Object.defineProperties(obj, {
  x: { value: 1, writable: true,  enumerable: true, configurable: true },
  y: { value: 2, writable: false, enumerable: true, configurable: false },
});

// ─── How Vue 2 used this for reactivity ──────────────────────────────
function observe(obj) {
  Object.keys(obj).forEach(key => {
    let value = obj[key];
    Object.defineProperty(obj, key, {
      get() {
        // Track dependencies here
        console.log(`Getting ${key}`);
        return value;
      },
      set(newValue) {
        // Trigger re-renders here
        console.log(`Setting ${key} to ${newValue}`);
        value = newValue;
      },
    });
  });
}
// Vue 3 switched to Proxy for better coverage (array mutations, new properties)

// ─── Object.getOwnPropertyDescriptor ─────────────────────────────────
const descriptor = Object.getOwnPropertyDescriptor(obj, 'name');
console.log(descriptor);
// { value: 'Alice', writable: false, enumerable: true, configurable: false }
```

#### Common Follow-up Questions
- "How does Vue 2's reactivity system work?" (Uses `defineProperty` to intercept gets/sets)
- "Why did Vue 3 switch to Proxy?" (`defineProperty` can't detect new properties or array mutations)
- "What's the difference between `Object.freeze` and setting `writable: false`?"

#### Interview Tip
This question often leads to a discussion of how major frameworks implement reactivity. Vue 2's `defineProperty` approach and its limitations (can't detect new properties, can't detect `arr[i] = val`) naturally lead to Proxy — which is what Vue 3 and modern reactive systems use.

---

### Q26. What is `Proxy` and `Reflect`?

**🔴 HARD** | **💡 RARE**

#### Concept

`Proxy` wraps an object and intercepts fundamental operations on it (get, set, has, delete, call, construct, etc.) via **traps**. `Reflect` provides a standard way to invoke those same operations — it's usually used inside Proxy traps to "forward" to the original behavior.

```js
// ─── Basic Proxy ──────────────────────────────────────────────────────
const handler = {
  get(target, prop) {
    console.log(`Getting: ${prop}`);
    return Reflect.get(target, prop); // forward to target
  },
  set(target, prop, value) {
    console.log(`Setting: ${prop} = ${value}`);
    return Reflect.set(target, prop, value); // forward to target
  },
};

const obj = new Proxy({ x: 1 }, handler);
obj.x;      // "Getting: x" → 1
obj.y = 2;  // "Setting: y = 2"

// ─── Validation proxy ─────────────────────────────────────────────────
function createValidatedObject(schema) {
  return new Proxy({}, {
    set(target, prop, value) {
      const validator = schema[prop];
      if (validator && !validator(value)) {
        throw new TypeError(`Invalid value for ${prop}: ${value}`);
      }
      return Reflect.set(target, prop, value);
    },
  });
}

const user = createValidatedObject({
  age: (v) => Number.isInteger(v) && v >= 0 && v <= 150,
  name: (v) => typeof v === 'string' && v.length > 0,
});
user.name = 'Alice'; // ✅
user.age  = 30;      // ✅
user.age  = -1;      // ❌ TypeError: Invalid value for age: -1

// ─── Vue 3 reactivity (simplified) ───────────────────────────────────
function reactive(obj) {
  return new Proxy(obj, {
    get(target, prop) {
      track(target, prop);      // record dependency
      const value = Reflect.get(target, prop);
      // Recursively make nested objects reactive
      return typeof value === 'object' ? reactive(value) : value;
    },
    set(target, prop, value) {
      const result = Reflect.set(target, prop, value);
      trigger(target, prop);    // notify watchers to re-render
      return result;
    },
  });
}

// ─── Reflect: consistent operations on any object ────────────────────
const obj2 = { greet(name) { return `Hello, ${name}`; } };

// Reflect mirrors the Proxy trap names:
Reflect.get(obj2, 'greet');           // function
Reflect.set(obj2, 'x', 42);          // true
Reflect.has(obj2, 'greet');           // true (like `in` operator)
Reflect.deleteProperty(obj2, 'x');   // true (like `delete`)
Reflect.apply(obj2.greet, obj2, ['World']); // "Hello, World"
Reflect.ownKeys(obj2);               // ['greet', 'x']

// ─── Logging / debugging proxy ────────────────────────────────────────
const logHandler = {
  get: (t, p) => (Reflect.has(t, p) ? Reflect.get(t, p) : undefined),
  set: (t, p, v) => { console.log(`${p} changed to ${v}`); return Reflect.set(t, p, v); },
  deleteProperty: (t, p) => { console.log(`${p} deleted`); return Reflect.deleteProperty(t, p); },
};
```

#### Common Follow-up Questions
- "How does Vue 3's reactivity use Proxy?"
- "What Proxy traps exist?" (get, set, has, deleteProperty, apply, construct, ownKeys, etc.)
- "Why use `Reflect` inside a Proxy trap instead of directly operating on the target?"

#### Interview Tip
Proxy is a senior/lead-level topic. The practical connection to Vue 3 or implementing an observable pattern is the key use case to demonstrate. The `Reflect` API exists precisely to pair with Proxy — its methods have the same names as Proxy traps, so you can always forward using `Reflect[trap](target, ...)`.

---

## 4. Hoisting & TDZ

---

### Q27. What is hoisting in JavaScript?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

**Hoisting** is JavaScript's behavior of moving **declarations** (not initializations) to the top of their scope during the compilation phase. The variable exists in memory before the line of code is executed, but its value may be `undefined` (for `var`) or inaccessible (for `let`/`const`/`class`).

Three things are hoisted differently:
1. **`var` declarations** — hoisted and initialized to `undefined`
2. **`function` declarations** — hoisted completely (name + body)
3. **`let`, `const`, `class`** — hoisted but NOT initialized (Temporal Dead Zone)

```js
// ─── var hoisting ─────────────────────────────────────────────────────
console.log(x); // undefined (not ReferenceError — var is hoisted)
var x = 5;
console.log(x); // 5

// What the JS engine sees:
// var x;           ← declaration hoisted
// console.log(x);  → undefined
// x = 5;           ← assignment stays in place
// console.log(x);  → 5

// ─── Function declaration hoisting (complete hoisting) ────────────────
greet('Alice'); // "Hello, Alice" ✅ — works before the function definition

function greet(name) {
  console.log(`Hello, ${name}`);
}

// ─── Function expression is NOT hoisted (only the var is) ────────────
say('hi'); // TypeError: say is not a function

var say = function(msg) { console.log(msg); };
// What engine sees:
// var say;          ← hoisted as undefined
// say('hi');        ← undefined is not a function ❌
// say = function... ← too late

// ─── let/const: hoisted but in TDZ ───────────────────────────────────
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

// ─── Class hoisting ───────────────────────────────────────────────────
const instance = new MyClass(); // ReferenceError — class is in TDZ
class MyClass { constructor() { this.x = 1; } }

// ─── Hoisting in functions ────────────────────────────────────────────
function outer() {
  console.log(local); // undefined — var hoisted to top of outer()
  if (true) {
    var local = 'inside if'; // var is function-scoped, not block-scoped
  }
  console.log(local); // 'inside if'
}
```

#### Common Follow-up Questions
- "Is `let` hoisted?" (Yes — but in the TDZ, so you can't access it)
- "Why does function declaration hoisting exist?" (Enables mutual recursion — functions calling each other)
- "What is hoisting the order for multiple `var` declarations?"

#### Interview Tip
Many candidates say "let is not hoisted" — that's technically wrong. The correct answer: "let is hoisted but placed in the Temporal Dead Zone — you can't access it until the declaration is evaluated." This nuance shows you understand the spec, not just the surface behavior.

---

### Q28. What is the Temporal Dead Zone (TDZ)?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

The **Temporal Dead Zone** is the period between entering a scope where a `let`, `const`, or `class` is declared and the point where that declaration is evaluated/initialized. Accessing the variable in the TDZ throws a `ReferenceError`.

"Temporal" = it's about **time** (the period before initialization), not position in code.

```js
// ─── TDZ demonstration ────────────────────────────────────────────────
{
  // TDZ for `x` starts here ───────────────────────┐
  console.log(x); // ReferenceError                 │ TDZ
  //                                                 │
  // TDZ ends when declaration is evaluated:         │
  let x = 5; // ← x is initialized here ────────────┘
  console.log(x); // 5 ✅
}

// ─── TDZ is about TIME, not position ──────────────────────────────────
// This is valid — the function is defined before x, but called after:
function readX() {
  return x; // ✅ Not in TDZ when this runs — x is initialized by then
}
let x = 10;
readX(); // 10

// This is invalid — function is CALLED before x is initialized:
function readY() {
  return y; // TDZ — y is not yet initialized
}
readY(); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

// ─── TDZ in function parameters ──────────────────────────────────────
// Parameters can reference earlier parameters:
function foo(a = 1, b = a * 2) { // ✅ b can reference a
  return [a, b];
}
foo(); // [1, 2]

function bar(a = b, b = 1) { // ❌ b is in TDZ when a's default is evaluated
  return [a, b];
}
bar(); // ReferenceError

// ─── typeof is NOT safe in TDZ (unlike undeclared vars) ──────────────
console.log(typeof undeclared); // 'undefined' — safe, no error
console.log(typeof tdz);        // ReferenceError ← in TDZ!
let tdz;

// ─── Why TDZ exists ───────────────────────────────────────────────────
// It catches mistakes. With var, accessing before assignment silently
// returns undefined — a common source of bugs.
// With let/const, you get an immediate, clear error.

// ─── const TDZ ────────────────────────────────────────────────────────
console.log(PI); // ReferenceError — in TDZ
const PI = 3.14159;
```

#### Common Follow-up Questions
- "Is `typeof` safe to use on TDZ variables?" (No — unlike truly undeclared variables, typeof on a TDZ variable throws)
- "Why did ES6 introduce TDZ instead of just initializing to undefined like var?"
- "Can a function access a TDZ variable?" (Yes — if called after initialization)

#### Interview Tip
The `typeof` gotcha is gold — most candidates don't know this. "Unlike undeclared variables where `typeof` returns `'undefined'`, `typeof` on a TDZ variable throws a ReferenceError." This one fact alone elevates your answer significantly.

---

### Q29. What is the difference between function declarations and function expressions in terms of hoisting?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

- **Function declaration** — `function name() {}` — completely hoisted (name + body). Can be called before its definition.
- **Function expression** — `const name = function() {}` or `const name = () => {}` — the variable is hoisted (with `undefined` for `var`, TDZ for `let`/`const`), but the function is not. Cannot be called before the assignment.

```js
// ─── Function declaration: fully hoisted ─────────────────────────────
doSomething(); // ✅ works — entire function hoisted

function doSomething() {
  console.log('done');
}

doSomething(); // ✅ also works — still in scope

// ─── Function expression with var: only var hoisted ───────────────────
doAnother(); // ❌ TypeError: doAnother is not a function
             //   (var is hoisted as undefined, calling undefined throws)

var doAnother = function() {
  console.log('another');
};

doAnother(); // ✅ now it works

// ─── Arrow function expression with const: TDZ ────────────────────────
doArrow(); // ❌ ReferenceError: Cannot access 'doArrow' before initialization

const doArrow = () => {
  console.log('arrow');
};

doArrow(); // ✅

// ─── Practical implication: mutual recursion needs declarations ────────
// Functions calling each other BEFORE both are defined:
function isEven(n) {
  if (n === 0) return true;
  return isOdd(n - 1); // ✅ isOdd is hoisted — works fine
}
function isOdd(n) {
  if (n === 0) return false;
  return isEven(n - 1);
}
isEven(4); // true

// With const expressions, order matters:
const isEvenExpr = (n) => n === 0 ? true  : isOddExpr(n - 1);
const isOddExpr  = (n) => n === 0 ? false : isEvenExpr(n - 1);
// ✅ This works too — isOddExpr is initialized before isEvenExpr is CALLED
isEvenExpr(4); // true ✅

// ─── Named function expressions ───────────────────────────────────────
const factorial = function fact(n) { // `fact` only exists inside the function
  if (n <= 1) return 1;
  return n * fact(n - 1); // ✅ can self-reference by name
};
factorial(5); // 120
// fact(5);   // ❌ ReferenceError — `fact` is not in outer scope
```

#### Common Follow-up Questions
- "When would you prefer a declaration over an expression?"
- "What is a named function expression and why use it?"
- "Can function declarations be inside an if block?" (Yes, but behavior is non-standard across engines — avoid it)

#### Interview Tip
Mention the practical use case for full hoisting: mutual recursion and the ability to structure code so that helper functions appear below the main logic (top-level code at top, implementation details at bottom). Many style guides prefer this for readability.

---

### Q30. Explain `arguments` object vs rest parameters.

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

`arguments` is an old, array-like object available in **non-arrow** functions. Rest parameters (`...args`) are a modern ES6 replacement that gives you a **real array**.

```js
// ─── arguments object (legacy) ────────────────────────────────────────
function sum() {
  console.log(arguments);         // Arguments [1, 2, 3, callee: ...]
  console.log(Array.isArray(arguments)); // false — array-LIKE, not array

  // Must convert to array first:
  const arr = Array.from(arguments);    // or [...arguments]
  return arr.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3); // 6

// ❌ Arrow functions have NO `arguments`:
const add = () => {
  console.log(arguments); // ReferenceError (or outer function's arguments)
};

// ─── Rest parameters (modern) ─────────────────────────────────────────
function sumRest(...numbers) {
  console.log(Array.isArray(numbers)); // true — real array!
  return numbers.reduce((a, b) => a + b, 0);
}
sumRest(1, 2, 3); // 6

// ─── Rest can be combined with named params ───────────────────────────
function log(level, ...messages) {
  messages.forEach(msg => console[level](msg));
}
log('info', 'Server started', 'Port: 3000');
// Separate named and rest:
// level = 'info'
// messages = ['Server started', 'Port: 3000']

// ─── Arrow functions CAN use rest parameters ──────────────────────────
const multiply = (multiplier, ...nums) =>
  nums.map(n => n * multiplier);
multiply(3, 1, 2, 4); // [3, 6, 12]

// ─── arguments quirk: aliasing (non-strict mode) ─────────────────────
function quirky(a, b) {
  arguments[0] = 99;
  console.log(a); // 99 — in sloppy mode, arguments aliases params!
}
quirky(1, 2);
// In strict mode: a remains 1 — no aliasing
```

#### Common Follow-up Questions
- "Can you use rest parameters in arrow functions?" (Yes)
- "What is the `arguments.callee` property?" (Reference to the current function — deprecated in strict mode)

#### Interview Tip
Lead with the key difference: `arguments` is array-like (not a real array), doesn't work in arrow functions, and is deprecated. Rest parameters are real arrays, work everywhere, and should always be preferred. ESLint's `prefer-rest-params` rule enforces this.

---

### Q31. What is the difference between a function declaration inside a block and a function declaration at the top level?

**🔴 HARD** | **💡 RARE**

#### Concept

Block-scoped function declarations behave inconsistently across engines and spec versions. In strict mode or ES6 modules, they're block-scoped. In sloppy mode, behavior varies — this is a known source of bugs.

```js
// ─── Top-level: straightforward ──────────────────────────────────────
function hello() { return 'top-level'; }

// ─── Block-level function declarations: AVOID ─────────────────────────
// In strict mode (and ES6 modules — always strict):
'use strict';
{
  function block() { return 'inside block'; }
  console.log(block()); // 'inside block' ✅
}
// console.log(block()); // ❌ ReferenceError — block-scoped in strict mode

// In sloppy mode, browsers diverge:
// Some hoist the function name to the outer scope but treat it as var-like
// This is "web legacy" behavior — don't rely on it

// ─── The safe pattern: function expression inside a block ────────────
let greet;
if (condition) {
  greet = function() { return 'condition true'; };
} else {
  greet = function() { return 'condition false'; };
}
// Or with arrow:
const handler = condition
  ? () => 'condition true'
  : () => 'condition false';
```

#### Interview Tip
The honest answer here is "avoid block-level function declarations — behavior is implementation-dependent and confusing. Use function expressions assigned to variables instead." The question tests whether you know this is a problem, not whether you've memorized the spec.

---

## 5. Promises & Async/Await

---

### Q32. What is a Promise and what are its three states?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

A **Promise** is an object representing the eventual completion or failure of an async operation. It has three mutually exclusive states:

1. **Pending** — initial state, neither fulfilled nor rejected
2. **Fulfilled** — operation succeeded, has a result value
3. **Rejected** — operation failed, has a reason (error)

Once settled (fulfilled or rejected), a Promise is **immutable** — its state never changes.

```js
// ─── Creating a Promise ───────────────────────────────────────────────
const fetchData = new Promise((resolve, reject) => {
  // The executor function runs SYNCHRONOUSLY (immediately)
  setTimeout(() => {
    const success = Math.random() > 0.5;
    if (success) {
      resolve({ data: 'user data' }); // fulfilled
    } else {
      reject(new Error('Network error')); // rejected
    }
  }, 1000);
});

// ─── Consuming a Promise ──────────────────────────────────────────────
fetchData
  .then(data => {
    console.log('Success:', data); // called on fulfill
    return data.data.toUpperCase(); // return value becomes next .then's input
  })
  .then(upper => console.log('Uppercased:', upper)) // chaining
  .catch(error => {
    console.error('Error:', error.message); // called on reject
  })
  .finally(() => {
    console.log('Always runs — cleanup here'); // runs regardless
  });

// ─── Promise states visualization ─────────────────────────────────────
// Promise: [ pending ] ─── resolve() ──→ [ fulfilled ] ──→ .then(onFulfill)
//          [         ] ─── reject()  ──→ [ rejected  ] ──→ .catch(onReject)
//
// Once settled, state CANNOT change:
let resolveRef;
const p = new Promise(resolve => { resolveRef = resolve; });
resolveRef(42);       // fulfilled with 42
resolveRef('hello');  // IGNORED — already settled

// ─── Promise.resolve and Promise.reject shortcuts ─────────────────────
const resolved = Promise.resolve(42);         // already-fulfilled promise
const rejected = Promise.reject(new Error()); // already-rejected promise

// ─── The executor runs synchronously ──────────────────────────────────
let initialized = false;
const p2 = new Promise((resolve) => {
  initialized = true; // runs NOW (synchronous)
  resolve('done');
});
console.log(initialized); // true — executor already ran

// ─── .then always returns a new Promise ──────────────────────────────
const p3 = Promise.resolve(1)
  .then(n => n + 1)     // returns Promise<2>
  .then(n => n * 10)    // returns Promise<20>
  .then(n => console.log(n)); // 20
```

#### Common Follow-up Questions
- "What happens if you throw inside a Promise executor?" (The promise is rejected with the thrown error)
- "What's the difference between `.then(null, onReject)` and `.catch(onReject)`?" (Functionally identical — `.catch` is shorthand)
- "Can a Promise be cancelled?" (No natively — AbortController can cancel the underlying operation, but the promise itself cannot be cancelled)

#### Interview Tip
The three states + immutability is the core. Add: Promise chaining works because `.then()` always returns a new Promise, and returning a value from `.then()` wraps it in a resolved Promise. This is why you can chain indefinitely.

---

### Q33. What is the difference between `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any`?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

Four combinators for running multiple promises:

| Method | Resolves when | Rejects when | Returns |
|---|---|---|---|
| `Promise.all` | ALL resolve | ANY rejects | array of results (or first error) |
| `Promise.allSettled` | ALL settle (any state) | Never | array of {status, value/reason} |
| `Promise.race` | FIRST settles | FIRST rejects | first result or error |
| `Promise.any` | FIRST resolves | ALL reject | first resolved value (or AggregateError) |

```js
const p1 = fetch('/api/users').then(r => r.json());
const p2 = fetch('/api/posts').then(r => r.json());
const p3 = Promise.reject(new Error('oops'));

// ─── Promise.all: all must succeed ────────────────────────────────────
try {
  const [users, posts] = await Promise.all([p1, p2]);
  // ✅ both resolved
} catch (error) {
  // ❌ if ANY fails, catch fires with FIRST rejection
  // Other promises are NOT cancelled — they still run to completion
}

// ─── Promise.allSettled: get ALL results regardless ───────────────────
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log('Success:', result.value);
  } else {
    console.error('Failed:', result.reason);
  }
});
// Always resolves — never rejects
// Great for: running multiple operations, showing partial results

// ─── Promise.race: first to settle wins ──────────────────────────────
// Timeout pattern:
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

try {
  const data = await withTimeout(fetchData(), 5000); // fails if > 5s
} catch (e) {
  console.error(e.message); // "Timed out after 5000ms" or network error
}

// ─── Promise.any: first SUCCESS (ignores rejections) ─────────────────
// Fallback pattern — try multiple sources, use whichever responds first:
try {
  const data = await Promise.any([
    fetch('https://primary-api.com/data'),
    fetch('https://backup-api.com/data'),
    fetch('https://cdn.com/data'),
  ]);
  // First successful response wins
} catch (e) {
  // AggregateError — ALL promises rejected
  console.log(e instanceof AggregateError); // true
  console.log(e.errors); // array of all rejection reasons
}

// ─── Choosing the right combinator ────────────────────────────────────
// Need ALL data to render page?           → Promise.all
// Show partial results if some fail?      → Promise.allSettled
// Implement a timeout or race condition?  → Promise.race
// Try multiple endpoints, use fastest?   → Promise.any
```

#### Common Follow-up Questions
- "Does `Promise.all` cancel other promises if one fails?" (No — they all keep running, only the result is discarded)
- "What is `AggregateError`?" (Thrown by `Promise.any` when all promises reject — contains an `errors` array)
- "When would you use `Promise.race` vs `Promise.any`?" (race = first to settle, any = first to SUCCEED)

#### Interview Tip
The real-world scenarios seal this answer. `Promise.allSettled` is the "safer" version of `Promise.all` — great for dashboard pages where partial data is better than none. `Promise.any` with fallback APIs is a real pattern used in CDN fallback and resilient service design.

---

### Q34. How does async/await work under the hood?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

`async/await` is **syntactic sugar** over Promises and generators. An `async` function always returns a Promise. `await` pauses execution of the async function (not the whole thread) until the Promise resolves, then resumes with the resolved value.

Under the hood, the engine suspends the function's execution context and stores it. When the awaited Promise settles, the microtask queue is used to resume execution.

```js
// ─── async/await is Promise syntax sugar ─────────────────────────────
// These are equivalent:

// With Promises:
function fetchUser(id) {
  return fetch(`/api/users/${id}`)
    .then(res => {
      if (!res.ok) throw new Error('HTTP error ' + res.status);
      return res.json();
    })
    .then(user => {
      return fetch(`/api/posts?userId=${user.id}`)
        .then(res => res.json())
        .then(posts => ({ user, posts }));
    });
}

// With async/await (same runtime behavior):
async function fetchUserAsync(id) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error('HTTP error ' + res.status); // throw rejects the Promise
  const user = await res.json();

  const postsRes = await fetch(`/api/posts?userId=${user.id}`);
  const posts = await postsRes.json();

  return { user, posts }; // automatically wrapped in Promise.resolve()
}

// ─── async always returns a Promise ───────────────────────────────────
async function getValue() { return 42; }
getValue(); // Promise<42> — not 42!
const v = await getValue(); // 42

// ─── await suspends the FUNCTION, not the thread ──────────────────────
console.log('A');
async function main() {
  console.log('B');
  const result = await Promise.resolve('C');
  console.log(result); // 'C'
  console.log('D');
}
main();
console.log('E');
// Output: A, B, E, C, D
// B: synchronous start of main()
// E: main() paused at await, control returned to caller
// C, D: resumed after Promise resolves (microtask)

// ─── Error handling with async/await ──────────────────────────────────
// Option 1: try/catch (like synchronous code)
async function withTryCatch() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error('Failed:', error);
    return null;
  }
}

// Option 2: .catch() on the returned Promise
const result = fetchUserAsync(1).catch(err => {
  console.error(err);
  return null;
});

// Option 3: Utility wrapper (Go-style error handling)
async function to(promise) {
  try {
    const data = await promise;
    return [null, data];
  } catch (err) {
    return [err, null];
  }
}

const [err, user] = await to(fetchUserAsync(1));
if (err) { handleError(err); return; }
// use `user` safely here

// ─── Common async/await mistakes ─────────────────────────────────────
// ❌ Forget to await (returns Promise, not value)
async function bad() {
  const data = fetchData(); // missing await — data is a Promise object!
  console.log(data.title); // undefined
}

// ❌ Sequential when should be concurrent
async function slow() {
  const a = await fetchA(); // waits for A before starting B
  const b = await fetchB(); // sequential — total time = A + B
}

// ✅ Concurrent
async function fast() {
  const [a, b] = await Promise.all([fetchA(), fetchB()]); // parallel
}
```

#### Common Follow-up Questions
- "What does `await` do to a non-Promise value?" (Wraps it in `Promise.resolve()` — so `await 42` works, returns 42)
- "Can you use `await` at the top level?" (Yes — in ES2022 modules with top-level await)
- "What happens if you `await` inside a forEach?" (Covered in Q8 — doesn't work as expected)

#### Interview Tip
The execution order question (A, B, E, C, D) is a common interview test. Trace through it: "B is synchronous inside main(), then await yields, E runs, then the microtask resumes with C and D." This proves you understand the event loop integration.

---

### Q35. What is Promise chaining and what are its rules?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Promise chaining is the ability to call `.then()` on the Promise returned by a previous `.then()`. Every `.then()` returns a new Promise, enabling a flat sequence of async operations.

Rules:
1. Return a value → next `.then` receives it wrapped in a resolved Promise
2. Return a Promise → next `.then` waits for that Promise to settle
3. Throw an error → the chain jumps to the next `.catch`
4. `.catch` also returns a Promise — the chain can continue after it

```js
// ─── Basic chaining ───────────────────────────────────────────────────
fetch('/api/user/1')
  .then(res => res.json())          // Rule 1: return value → passes to next
  .then(user => user.name)          // Rule 1: return string
  .then(name => name.toUpperCase()) // Rule 1: return uppercased string
  .then(name => console.log(name))  // 'ALICE'
  .catch(err => console.error(err));

// ─── Returning a Promise flattens the chain ───────────────────────────
fetch('/api/user/1')
  .then(res => res.json())           // returns Promise<user>
  .then(user => fetch(`/api/posts?userId=${user.id}`)) // returns a NEW fetch Promise
  .then(res => res.json())           // waits for that fetch — NOT Promise<Promise>!
  .then(posts => console.log(posts));

// ─── Error propagation through the chain ─────────────────────────────
Promise.resolve(1)
  .then(n => { throw new Error('oops'); }) // chain jumps to .catch
  .then(n => console.log('never runs'))    // skipped
  .catch(err => {
    console.error(err.message); // 'oops'
    return 'recovered';          // returning from .catch resumes the chain!
  })
  .then(val => console.log(val)); // 'recovered'

// ─── Common mistake: forgetting to return ────────────────────────────
// ❌ Not returning the Promise — chain doesn't wait
fetch('/api/a')
  .then(res => {
    fetch('/api/b'); // ❌ not returned — chain doesn't wait for /api/b
  })
  .then(() => console.log('done')); // fires immediately, not after /api/b

// ✅ Return it:
fetch('/api/a')
  .then(res => fetch('/api/b'))  // ✅ returned — chain waits
  .then(() => console.log('done after /api/b'));

// ─── Promise chain error handling patterns ────────────────────────────
// Catch-all at end:
doA().then(doB).then(doC).catch(handleAllErrors);

// Per-step recovery:
doA()
  .catch(() => defaultA()) // recover from A's failure, continue chain
  .then(doB)
  .catch(() => defaultB()) // recover from B's failure
  .then(doC);
```

#### Common Follow-up Questions
- "What's the difference between `.then(onFulfill, onReject)` and `.then(onFulfill).catch(onReject)`?"
- "Can you catch an error after a `.then` that follows a `.catch`?"

#### Interview Tip
The "return or forget" mistake is the #1 Promise bug in real codebases. If you forget to `return` inside a `.then`, the chain doesn't wait for your async operation. This is a great concrete example to give — it shows you've debugged real Promise issues.

---

### Q36. What is `async` generator and what problem does it solve?

**🔴 HARD** | **💡 RARE**

#### Concept

An **async generator** is a function that is both `async` and a generator (`function*`). It can `yield` values asynchronously, enabling lazy, pull-based processing of async data streams. Used with `for await...of`.

```js
// ─── Basic async generator ────────────────────────────────────────────
async function* range(start, end, delay = 0) {
  for (let i = start; i <= end; i++) {
    await new Promise(r => setTimeout(r, delay)); // async operation per yield
    yield i; // produces value asynchronously
  }
}

// Consume with for await...of:
(async () => {
  for await (const num of range(1, 5, 100)) {
    console.log(num); // 1, 2, 3, 4, 5 — with 100ms delay each
  }
})();

// ─── Practical use: paginated API fetching ────────────────────────────
async function* fetchPages(baseUrl) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res  = await fetch(`${baseUrl}?page=${page}`);
    const data = await res.json();

    yield data.items; // yield one page's items at a time

    hasMore = data.hasNextPage;
    page++;
  }
}

// Only fetches the next page when the consumer asks for it (lazy!)
for await (const items of fetchPages('/api/products')) {
  items.forEach(item => displayItem(item));
  if (shouldStop()) break; // can stop early without fetching remaining pages
}

// ─── Async generator for real-time data streams ───────────────────────
async function* readStream(readable) {
  for await (const chunk of readable) {
    yield chunk.toString('utf8');
  }
}

// Parse Server-Sent Events stream:
async function* parseSSE(url) {
  const res = await fetch(url);
  for await (const line of readStream(res.body)) {
    if (line.startsWith('data: ')) {
      yield JSON.parse(line.slice(6));
    }
  }
}

for await (const event of parseSSE('/api/live-updates')) {
  updateUI(event);
}
```

#### Common Follow-up Questions
- "What's the difference between a generator and an async generator?"
- "How do async generators relate to Node.js streams?"
- "What is the async iteration protocol?"

#### Interview Tip
Position this as "the right tool for processing large datasets without loading everything into memory at once." Paginated API fetching and SSE processing are real, compelling use cases. This shows you understand streaming/lazy evaluation — a senior-level concept.

---

### Q37. How do you handle errors in Promise chains vs async/await?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

Error handling is where Promise chains and async/await diverge significantly in readability and behavior.

```js
// ─── Promise chain error handling ────────────────────────────────────
// Option 1: .catch at the end (catches all previous errors)
fetchUser(id)
  .then(user => fetchOrders(user.id))
  .then(orders => processOrders(orders))
  .catch(error => {
    // Catches errors from fetchUser, fetchOrders, OR processOrders
    // But you don't know which step failed!
    console.error(error);
  });

// Option 2: Per-step error handling
fetchUser(id)
  .then(user => fetchOrders(user.id).catch(() => [])) // default to empty array
  .then(orders => processOrders(orders))
  .catch(error => {
    // Only catches fetchUser or processOrders errors now
  });

// ─── async/await error handling ───────────────────────────────────────
async function loadDashboard(userId) {
  // Option 1: Single try/catch (simple but coarse)
  try {
    const user   = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    return { user, orders };
  } catch (error) {
    // Which step failed? Need to check error.message or type
    console.error(error);
    return null;
  }
}

// Option 2: Per-step try/catch (granular)
async function loadDashboardGranular(userId) {
  let user;
  try {
    user = await fetchUser(userId);
  } catch (error) {
    console.error('Failed to load user:', error);
    return null;
  }

  let orders;
  try {
    orders = await fetchOrders(user.id);
  } catch (error) {
    console.warn('Failed to load orders, using empty:', error);
    orders = []; // graceful degradation
  }

  return { user, orders };
}

// Option 3: "Go-style" [error, result] pattern (cleanest for multiple steps)
const to = (p) => p.then(data => [null, data]).catch(err => [err, null]);

async function loadDashboardGo(userId) {
  const [userErr, user] = await to(fetchUser(userId));
  if (userErr) return { error: 'User not found' };

  const [ordersErr, orders] = await to(fetchOrders(user.id));
  // ordersErr handled individually, or gracefully degraded:
  return { user, orders: ordersErr ? [] : orders };
}

// Option 4: Error types for specific handling
class NetworkError extends Error { constructor(msg) { super(msg); this.name = 'NetworkError'; } }
class NotFoundError extends Error { constructor(msg) { super(msg); this.name = 'NotFoundError'; } }

async function loadUser(id) {
  try {
    return await fetchUser(id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null; // expected — handle gracefully
    }
    throw error; // unexpected — re-throw for outer handler
  }
}
```

#### Common Follow-up Questions
- "What happens to an unhandled Promise rejection?"
- "How do you globally catch unhandled rejections?" (`window.addEventListener('unhandledrejection', ...)` / `process.on('unhandledRejection', ...)`)
- "What does rethrowing an error do in async functions?"

#### Interview Tip
The key insight that separates good answers: "Both catch synchronous throws from awaited Promises AND sync errors in the same try block — async/await makes async and sync error handling look the same." Also mention `window.addEventListener('unhandledrejection')` for global handling.

---

### Q38. What is `Promise.resolve()` and when would you use it?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

`Promise.resolve(value)` creates an already-fulfilled Promise. If `value` is already a Promise (or thenable), it returns that same Promise (or follows the thenable). It's useful for normalizing mixed sync/async return values and for testing.

```js
// ─── Basic usage ──────────────────────────────────────────────────────
const p1 = Promise.resolve(42);
p1.then(v => console.log(v)); // 42

// Equivalent to:
const p2 = new Promise(resolve => resolve(42));

// ─── Normalizing sync/async functions ────────────────────────────────
function getData(useCache) {
  if (useCache) {
    return Promise.resolve(cachedData); // sync result wrapped as Promise
  }
  return fetch('/api/data').then(r => r.json()); // actual async
}

// Caller always uses .then() — doesn't matter if result is cached or not:
getData(true).then(data => render(data));
getData(false).then(data => render(data));

// ─── Promise.resolve with Promises (identity) ─────────────────────────
const existing = new Promise(r => setTimeout(() => r('hello'), 1000));
const wrapped = Promise.resolve(existing);
console.log(wrapped === existing); // true — same object returned!

// ─── Promise.resolve with thenables ──────────────────────────────────
const thenable = {
  then(resolve, reject) {
    resolve('from thenable');
  }
};
Promise.resolve(thenable).then(v => console.log(v)); // 'from thenable'
// Useful for duck-typed Promises from older libraries

// ─── Testing utilities ────────────────────────────────────────────────
// Mock a service that returns resolved data:
const mockFetch = (data) => Promise.resolve(data);

// Unit test:
it('processes user data', async () => {
  const mockUser = { id: 1, name: 'Alice' };
  jest.spyOn(api, 'fetchUser').mockReturnValue(Promise.resolve(mockUser));
  // or:
  jest.spyOn(api, 'fetchUser').mockResolvedValue(mockUser); // Jest shorthand
  const result = await processUser(1);
  expect(result.name).toBe('ALICE');
});
```

#### Common Follow-up Questions
- "What's `Promise.reject()`?" (Creates already-rejected Promise — used in testing and error-first flows)
- "What's the difference between `Promise.resolve(promise)` and `new Promise(resolve => resolve(promise))`?"

#### Interview Tip
The normalization pattern is the most practical use case — when a function might return sync or async values, always return a Promise to give callers a consistent interface. This is the "always async" principle.

---

### Q39. What is top-level `await` and what are its limitations?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

**Top-level `await`** (ES2022) allows `await` to be used at the module's top level without wrapping in an `async function`. A module using top-level `await` blocks other modules that import it until its awaited expressions resolve.

```js
// ─── Before top-level await (needed IIFE) ─────────────────────────────
(async () => {
  const config = await fetchConfig();
  init(config);
})();

// ─── With top-level await (ESM modules only) ──────────────────────────
// config.js
const config = await fetch('/config.json').then(r => r.json());
export { config }; // config is fully resolved when this module is imported

// main.js
import { config } from './config.js';
// config is guaranteed to be loaded — top-level await in config.js
// caused main.js to wait before executing
console.log(config.apiUrl); // ✅ always available

// ─── Practical use cases ──────────────────────────────────────────────
// 1. Dynamic imports
const { default: module } = await import('./heavy-module.js');

// 2. Database connection
import { createPool } from 'pg';
const db = await createPool({ connectionString: process.env.DB_URL });
export { db }; // db is connected before other modules use it

// 3. Feature detection
const canUseWebGPU = await navigator.gpu?.requestAdapter() !== null;
export { canUseWebGPU };

// ─── Limitations ──────────────────────────────────────────────────────
// 1. Only works in ES MODULES (type="module" or .mjs)
//    ❌ Does not work in CommonJS (require/module.exports)
//    ❌ Does not work in regular <script> tags without type="module"

// 2. Blocks dependent modules — misuse can slow startup
//    If top-level await takes 5s, EVERY importing module waits 5s

// 3. Circular dependencies become more complex with top-level await

// ─── Next.js caveat ───────────────────────────────────────────────────
// Next.js Server Components support top-level await in async components:
// app/page.tsx
const data = await fetchData(); // works in Next.js server components
// But this is component-level, not module-level top-level await
```

#### Common Follow-up Questions
- "What happens to modules that import a module with top-level await that rejects?"
- "Can you use top-level await in Node.js?" (Yes — in `.mjs` files or with `"type": "module"` in package.json)

#### Interview Tip
The key trade-off: top-level await is powerful for initialization, but it serializes module loading — a slow awaited operation delays every module that depends on it. Always mention the ES Modules only limitation, as it trips up developers coming from CommonJS Node.js.

---

## 6. ES6+ Features

---

### Q40. What are JavaScript generators and iterators?

**🔴 HARD** | **📌 COMMON**

#### Concept

The **iterator protocol** defines a standard way to produce a sequence of values. An **iterable** is an object with a `[Symbol.iterator]()` method that returns an iterator. An **iterator** has a `next()` method that returns `{ value, done }`.

A **generator function** (`function*`) automatically implements the iterator protocol. It can pause execution with `yield` and resume when `next()` is called.

```js
// ─── Iterator protocol manually ───────────────────────────────────────
function range(start, end) {
  let current = start;
  return {
    // Iterator: has next()
    next() {
      if (current <= end) {
        return { value: current++, done: false };
      }
      return { value: undefined, done: true };
    },
    // Make it iterable too (Symbol.iterator returns `this`)
    [Symbol.iterator]() { return this; }
  };
}

const r = range(1, 3);
console.log(r.next()); // { value: 1, done: false }
console.log(r.next()); // { value: 2, done: false }
console.log(r.next()); // { value: 3, done: false }
console.log(r.next()); // { value: undefined, done: true }

// Can use for...of since it implements [Symbol.iterator]:
for (const n of range(1, 5)) console.log(n); // 1 2 3 4 5

// ─── Generator function (easier way to create iterators) ──────────────
function* rangeGen(start, end) {
  for (let i = start; i <= end; i++) {
    yield i; // pauses here, resumes on next next() call
  }
}

const gen = rangeGen(1, 3);
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: undefined, done: true }

// ─── Infinite sequence (lazy — only computes when asked) ──────────────
function* naturals() {
  let n = 1;
  while (true) yield n++; // infinite — but only runs when iterated
}

function* take(n, iterable) {
  let count = 0;
  for (const item of iterable) {
    if (count++ >= n) return;
    yield item;
  }
}

[...take(5, naturals())]; // [1, 2, 3, 4, 5]

// ─── Two-way communication with generators ────────────────────────────
function* calculator() {
  let result = 0;
  while (true) {
    const input = yield result; // yield sends result OUT, receives next value IN
    result += input;
  }
}

const calc = calculator();
calc.next();    // start — { value: 0, done: false }
calc.next(5);   // send 5 in → { value: 5, done: false }
calc.next(3);   // send 3 in → { value: 8, done: false }
calc.next(10);  // send 10 in → { value: 18, done: false }

// ─── Practical: custom iterable object ───────────────────────────────
class Range {
  constructor(start, end) { this.start = start; this.end = end; }
  [Symbol.iterator]() { return rangeGen(this.start, this.end); }
}

const r2 = new Range(1, 5);
[...r2];                        // [1, 2, 3, 4, 5]
const [first, second] = r2;    // destructuring works!
```

#### Common Follow-up Questions
- "What built-in types are iterable?" (Array, String, Map, Set, arguments, NodeList, generators)
- "How do generators relate to async/await under the hood?"
- "What is `Symbol.iterator`?"

#### Interview Tip
The two-way communication aspect (`yield` receives values) is advanced and impressive. More importantly: position generators as a tool for **lazy sequences** — they only compute what you consume. This avoids allocating a million-item array when you only need the first 10.

---

### Q41. What are JavaScript `Map` and `Set` and when do you use them over objects and arrays?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

`Map` is a key-value store where keys can be ANY type (not just strings). `Set` is a collection of unique values. Both maintain insertion order and have O(1) lookup.

```js
// ─── Map vs Object ────────────────────────────────────────────────────
// Object limitations:
const obj = {};
const key = { id: 1 };
obj[key] = 'value';
console.log(obj); // { '[object Object]': 'value' } — key coerced to string!

// Map fixes this:
const map = new Map();
const objKey = { id: 1 };
map.set(objKey, 'value');
map.get(objKey); // 'value' — object identity preserved!

// Map API:
const userMap = new Map();
userMap.set('alice', { age: 30 });
userMap.set('bob',   { age: 25 });
userMap.get('alice');     // { age: 30 }
userMap.has('charlie');   // false
userMap.delete('bob');    // true
userMap.size;             // 1

// Iteration (insertion order preserved):
for (const [key, value] of userMap) {
  console.log(key, value);
}
userMap.forEach((value, key) => console.log(key, value));
[...userMap.keys()];   // ['alice']
[...userMap.values()]; // [{ age: 30 }]
[...userMap.entries()]; // [['alice', { age: 30 }]]

// Initialize from array of pairs:
const map2 = new Map([['a', 1], ['b', 2], ['c', 3]]);

// ─── Set vs Array ─────────────────────────────────────────────────────
const set = new Set([1, 2, 3, 2, 1]); // duplicates removed
console.log([...set]); // [1, 2, 3]

// Deduplication (classic use case):
const arr = [1, 2, 3, 2, 1, 3];
const unique = [...new Set(arr)]; // [1, 2, 3]

// O(1) lookup (vs O(n) Array.includes):
const set2 = new Set(['apple', 'banana', 'cherry']);
set2.has('banana'); // O(1) — much faster than Array.includes for large sets

// Set operations (not built-in, but easy to implement):
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

const union        = new Set([...setA, ...setB]);          // {1,2,3,4,5,6}
const intersection = new Set([...setA].filter(x => setB.has(x))); // {3,4}
const difference   = new Set([...setA].filter(x => !setB.has(x))); // {1,2}

// ─── When to use each ─────────────────────────────────────────────────
// Map over Object when:
// ✅ Keys are not strings (objects, functions, numbers)
// ✅ Frequent additions/deletions (Map is optimized for this)
// ✅ Need to iterate in insertion order reliably
// ✅ Size matters (map.size vs Object.keys(obj).length)
// ✅ No prototype pollution risk

// Set over Array when:
// ✅ Need uniqueness enforced
// ✅ Frequent membership testing (has() is O(1) vs O(n))
// ✅ Removing duplicates
```

#### Common Follow-up Questions
- "What's a `WeakMap` / `WeakSet` and when would you use them?" (Keys must be objects, don't prevent GC, not iterable)
- "Is `Map` faster than `Object` for lookups?" (For small objects, similar. For large/dynamic keys, Map is better optimized)
- "How do you convert between Map/Object and Set/Array?"

#### Interview Tip
The O(1) membership test is Map/Set's killer advantage — when you're building something like a cache or a lookup table with thousands of entries, `Set.has()` vs `Array.includes()` is the difference between O(1) and O(n). Give a concrete performance scenario.

---

### Q42. What are JavaScript decorators?

**🔴 HARD** | **💡 RARE**

#### Concept

Decorators are a stage-3 TC39 proposal (and widely used via TypeScript/Babel) that provide a way to add behavior to classes, methods, and properties declaratively.

```js
// ─── Method decorator ─────────────────────────────────────────────────
// TypeScript / Babel syntax (Stage 3 proposal):

function log(target, propertyKey, descriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args) {
    console.log(`Calling ${propertyKey}(${JSON.stringify(args)})`);
    const result = original.apply(this, args);
    console.log(`${propertyKey} returned: ${JSON.stringify(result)}`);
    return result;
  };
  return descriptor;
}

class Calculator {
  @log
  add(a, b) { return a + b; }
}

const calc = new Calculator();
calc.add(2, 3);
// "Calling add([2,3])"
// "add returned: 5"

// ─── Class decorator ──────────────────────────────────────────────────
function singleton(constructor) {
  let instance;
  return function (...args) {
    if (!instance) instance = new constructor(...args);
    return instance;
  };
}

@singleton
class Config {
  constructor() { this.settings = {}; }
}
const c1 = new Config();
const c2 = new Config();
console.log(c1 === c2); // true — same instance

// ─── Property decorator for validation ───────────────────────────────
function required(target, propertyKey) {
  let value;
  Object.defineProperty(target, propertyKey, {
    get() { return value; },
    set(newValue) {
      if (newValue === null || newValue === undefined) {
        throw new Error(`${propertyKey} is required`);
      }
      value = newValue;
    }
  });
}

// ─── Without decorators: equivalent manual approach ───────────────────
// Decorator libraries (Angular DI, NestJS, MobX) use this pattern heavily
// In React, HOCs (Higher-Order Components) are the decorator pattern:
const withAuth = (Component) => (props) => {
  const { user } = useAuth();
  if (!user) return <Redirect to="/login" />;
  return <Component {...props} user={user} />;
};

const ProtectedDashboard = withAuth(Dashboard);
```

#### Common Follow-up Questions
- "What's the current status of the decorators proposal?"
- "How do TypeScript decorators differ from the TC39 proposal?"
- "How does NestJS use decorators?"

#### Interview Tip
Even if you don't use decorators daily, knowing they're HOFs (higher-order functions) that modify class behavior is valuable. Connect to React HOCs, Angular decorators, and NestJS — these are widely used implementations of the same pattern.

---

### Q43. What is destructuring and what are its advanced patterns?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

Destructuring extracts values from arrays and properties from objects into distinct variables. It works with any iterable (array destructuring) and any object.

```js
// ─── Object destructuring ─────────────────────────────────────────────
const user = { name: 'Alice', age: 30, role: 'admin', address: { city: 'NYC' } };

const { name, age }  = user;                    // basic
const { name: n }    = user;                    // rename
const { score = 100 } = user;                  // default value (score is undefined)
const { address: { city } } = user;            // nested
const { name: nm, ...rest } = user;            // rest pattern

// ─── Array destructuring ──────────────────────────────────────────────
const [first, second, , fourth] = [1, 2, 3, 4]; // skip with comma
const [head, ...tail] = [1, 2, 3, 4];           // rest
const [a = 0, b = 0] = [1];                     // defaults (b = 0)

// Swap variables:
let x = 1, y = 2;
[x, y] = [y, x]; // x=2, y=1 — no temp variable needed

// ─── Function parameter destructuring ────────────────────────────────
function createUser({ name, age = 18, role = 'user' } = {}) {
  // Clear named params with defaults — no positional argument order to remember
  return { name, age, role };
}
createUser({ name: 'Bob', role: 'admin' }); // { name: 'Bob', age: 18, role: 'admin' }
createUser(); // uses = {} default — prevents "Cannot destructure undefined"

// ─── Computed property names in destructuring ─────────────────────────
const prop = 'name';
const { [prop]: value } = user; // value = 'Alice'

// ─── Mixed destructuring ──────────────────────────────────────────────
const { results: [topResult, ...otherResults], total } =
  await fetch('/api/search').then(r => r.json());

// ─── Iterating with destructuring ────────────────────────────────────
const entries = [['a', 1], ['b', 2], ['c', 3]];
for (const [key, val] of entries) {
  console.log(key, val);
}
Object.entries(obj).forEach(([k, v]) => console.log(k, v));

// ─── React patterns ───────────────────────────────────────────────────
// useState:
const [count, setCount] = useState(0);

// Props:
function Card({ title, description, imageUrl, onClose }) {
  // much cleaner than accessing props.title, props.description, etc.
}
```

#### Common Follow-up Questions
- "What happens if you destructure a property that doesn't exist?" (undefined, or the default if provided)
- "Can you destructure null or undefined?" (No — throws TypeError unless you use a default `= {}` or `= []`)

#### Interview Tip
Show function parameter destructuring with defaults — this is the pattern used in every React component and most modern API functions. It's more readable than positional arguments and self-documenting. The `= {}` safety default for object parameter destructuring is a pro tip that prevents errors when the function is called with no arguments.

---

### Q44. What are template literals and tagged templates?

**🟢 EASY** | **📌 COMMON**

#### Concept

**Template literals** use backtick syntax for multi-line strings and string interpolation with `${expression}`. **Tagged templates** let you control how the template literal is processed by passing it through a function.

```js
// ─── Basic template literals ──────────────────────────────────────────
const name = 'Alice';
const age  = 30;

// Interpolation
const greeting = `Hello, ${name}! You are ${age} years old.`;

// Expressions inside ${}
const result = `${2 + 2} equals four: ${2 + 2 === 4}`;

// Multi-line (preserves newlines and whitespace)
const html = `
  <div>
    <h1>${name}</h1>
    <p>Age: ${age}</p>
  </div>
`.trim();

// ─── Tagged templates ─────────────────────────────────────────────────
// Tag is a function: (strings, ...values) => result
// strings: array of static string parts
// values: array of interpolated expression results

function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    return result + `<mark>${value}</mark>` + str;
  });
}
const product = 'iPhone';
const price   = 999;
highlight`Buy ${product} for $${price}!`;
// "Buy <mark>iPhone</mark> for $<mark>999</mark>!"

// ─── SQL sanitization (real-world use) ────────────────────────────────
function sql(strings, ...values) {
  // Sanitize values to prevent SQL injection
  const sanitized = values.map(v =>
    typeof v === 'string' ? v.replace(/'/g, "''") : v
  );
  return strings.reduce((query, str, i) => {
    return query + (sanitized[i - 1] ?? '') + str;
  });
}
const userInput = "O'Brien";
const query = sql`SELECT * FROM users WHERE name = '${userInput}'`;
// "SELECT * FROM users WHERE name = 'O''Brien'" — apostrophe escaped

// ─── CSS-in-JS (styled-components uses this exact pattern) ────────────
const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'white'};
  padding: 0.5em 1em;
  border-radius: 4px;
`;
// The tag is `styled.button` — a function that processes the template

// ─── i18n translation ─────────────────────────────────────────────────
function t(strings, ...values) {
  const key = strings.join('{?}');
  const translation = translations[key] ?? strings.join('');
  return values.reduce((str, val, i) =>
    str.replace('{?}', val), translation);
}
t`Welcome, ${userName}!`; // looks up "Welcome, {?}!" in translation table

// ─── String.raw (built-in tag) ────────────────────────────────────────
// Prevents escape sequence processing — useful for regexes and Windows paths
const path = String.raw`C:\Users\Alice\file.txt`; // no \U, \A, \f escaping
const regex = new RegExp(String.raw`\d+\.\d+`); // keeps \d literal
```

#### Common Follow-up Questions
- "How does styled-components use tagged templates?"
- "What's the `strings.raw` property?" (Same as `String.raw` — unprocessed version of strings)

#### Interview Tip
Most candidates know basic template literals. The differentiator is tagged templates. Mentioning styled-components is immediately relatable to React developers. The SQL sanitization example is concrete and shows a real security use case.

---

### Q45. What are Symbols and what are they used for?

**🟡 MEDIUM** | **💡 RARE**

#### Concept

`Symbol` is a primitive type (ES6) that creates a **guaranteed unique** value. No two Symbols are ever equal, even if they have the same description. They're commonly used as unique property keys that don't clash with string keys.

```js
// ─── Symbols are unique ───────────────────────────────────────────────
const s1 = Symbol('id');
const s2 = Symbol('id');
console.log(s1 === s2); // false — unique even with same description
console.log(typeof s1); // 'symbol'
console.log(s1.toString()); // 'Symbol(id)'
console.log(s1.description); // 'id' (ES2019+)

// ─── As object keys (non-enumerable, non-string) ──────────────────────
const ID = Symbol('id');
const user = {
  name: 'Alice',
  [ID]: 12345, // Symbol as computed property key
};

user[ID]; // 12345 ✅
Object.keys(user);         // ['name'] — Symbol NOT included
Object.getOwnPropertyNames(user); // ['name'] — still not included
JSON.stringify(user);      // '{"name":"Alice"}' — Symbols excluded
Object.getOwnPropertySymbols(user); // [Symbol(id)] — specialized API needed

// ─── Preventing key collisions in libraries ───────────────────────────
// Library A:
const LIB_A_META = Symbol('meta');
obj[LIB_A_META] = { version: 1 };

// Library B:
const LIB_B_META = Symbol('meta');
obj[LIB_B_META] = { debug: true };

// No collision! Both 'meta' Symbols are different.

// ─── Well-known Symbols (customize built-in behavior) ─────────────────
// Symbol.iterator — make an object iterable
class Fibonacci {
  [Symbol.iterator]() {
    let [prev, curr] = [0, 1];
    return {
      next() {
        [prev, curr] = [curr, prev + curr];
        return { value: prev, done: false }; // infinite
      }
    };
  }
}
const [a, b, c, d] = new Fibonacci(); // 1, 1, 2, 3

// Symbol.toPrimitive — customize type coercion
const temperature = {
  celsius: 25,
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.celsius;
    if (hint === 'string') return `${this.celsius}°C`;
    return this.celsius; // default
  }
};
+temperature;          // 25 (number hint)
`${temperature}`;      // "25°C" (string hint)

// Symbol.hasInstance — customize `instanceof`
class EvenNumber {
  static [Symbol.hasInstance](instance) {
    return typeof instance === 'number' && instance % 2 === 0;
  }
}
2 instanceof EvenNumber; // true
3 instanceof EvenNumber; // false

// ─── Symbol.for (global registry) ────────────────────────────────────
const globalSym1 = Symbol.for('shared');
const globalSym2 = Symbol.for('shared');
console.log(globalSym1 === globalSym2); // true — same global symbol
// Used for cross-realm (iframe, worker) symbol sharing
```

#### Common Follow-up Questions
- "What's the difference between `Symbol()` and `Symbol.for()`?"
- "Why aren't Symbols enumerable?"
- "What well-known Symbols do you know?"

#### Interview Tip
Most candidates know Symbols exist but can't explain why they're useful. The key insight: non-string keys that avoid collisions — perfect for library authors who need to tag objects without interfering with user code. The well-known Symbols (`Symbol.iterator`, `Symbol.toPrimitive`) are even more impressive to know.

---

## 7. DOM & Events

---

### Q46. What is event bubbling and event capturing?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

When a DOM event fires, it travels in three phases:
1. **Capture phase** — event travels DOWN from `document` to the target element
2. **Target phase** — event reaches the target element
3. **Bubble phase** — event travels UP from target back to `document`

By default, event listeners fire during the **bubble phase**. To listen during capture, pass `{ capture: true }`.

```html
<div id="grandparent">
  <div id="parent">
    <button id="child">Click me</button>
  </div>
</div>
```

```js
// ─── Default: bubble phase (bottom → top) ────────────────────────────
document.getElementById('grandparent').addEventListener('click', () => {
  console.log('grandparent bubble');
});
document.getElementById('parent').addEventListener('click', () => {
  console.log('parent bubble');
});
document.getElementById('child').addEventListener('click', () => {
  console.log('child (target)');
});

// Click on child → Output:
// child (target)
// parent bubble
// grandparent bubble

// ─── Capture phase (top → bottom) ────────────────────────────────────
document.getElementById('grandparent').addEventListener('click', () => {
  console.log('grandparent capture');
}, { capture: true }); // or just `true` as third argument

document.getElementById('parent').addEventListener('click', () => {
  console.log('parent capture');
}, true);

// Click on child → Output order with BOTH capture and bubble:
// grandparent capture  ← capture, going down
// parent capture       ← capture, going down
// child (target)       ← target phase
// parent bubble        ← bubble, going up
// grandparent bubble   ← bubble, going up

// ─── Stop propagation ────────────────────────────────────────────────
document.getElementById('child').addEventListener('click', (e) => {
  e.stopPropagation(); // stops event traveling up (or down in capture)
  console.log('child — propagation stopped');
});
// parent and grandparent bubble listeners won't fire

// stopImmediatePropagation: also prevents OTHER listeners on same element
button.addEventListener('click', (e) => {
  e.stopImmediatePropagation(); // no other click listeners on button will run
});
button.addEventListener('click', () => {
  console.log('never runs');
});

// ─── Event delegation (practical use of bubbling) ────────────────────
// Instead of adding a listener to every list item:
// ❌ N listeners (expensive, doesn't work for dynamically added items)
document.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', handleItemClick);
});

// ✅ ONE listener on the parent (uses bubbling)
document.getElementById('list').addEventListener('click', (e) => {
  // e.target is the ACTUAL element clicked
  // e.currentTarget is the element with the listener (the list)
  if (e.target.tagName === 'LI') {
    handleItemClick(e.target);
  }
  // Works for dynamically added <li> elements too!
});
```

#### Common Follow-up Questions
- "What is `e.target` vs `e.currentTarget`?" (`target` = element that fired the event, `currentTarget` = element with the listener)
- "What does `preventDefault()` do?" (Prevents the browser's default action — link navigation, form submit, etc. Does NOT stop propagation.)
- "When would you use capture instead of bubble?"

#### Interview Tip
Event delegation is the killer application of bubbling. Mention: "Instead of adding 1000 listeners to 1000 list items, add one listener to the parent. It's more performant and works for dynamically added elements." This directly demonstrates practical knowledge.

---

### Q47. What is event delegation and why is it important?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

**Event delegation** uses event bubbling to handle events at a parent level rather than attaching individual handlers to each child. Benefits: fewer event listeners (performance), handles dynamically added elements, easier to manage.

```js
// ─── Scenario: dynamic todo list ─────────────────────────────────────
// ❌ Without delegation — doesn't work for new items, N listeners
function addItemBad(text) {
  const li = document.createElement('li');
  li.textContent = text;
  li.addEventListener('click', handleClick); // new listener each time
  ul.appendChild(li);
}

// ✅ With delegation — one listener handles all items, past and future
const todoList = document.getElementById('todo-list');

todoList.addEventListener('click', (e) => {
  // e.target is the actual element clicked
  const li = e.target.closest('li'); // handles click on child elements too
  if (!li) return; // click wasn't on a list item

  const action = e.target.dataset.action; // e.g., data-action="delete"

  if (action === 'delete') {
    li.remove();
  } else if (action === 'complete') {
    li.classList.toggle('completed');
  } else if (e.target === li) {
    // Direct click on li itself (not a button inside it)
    selectItem(li);
  }
});

// Adding items — no need to attach event listeners
function addItem(text) {
  const li = document.createElement('li');
  li.innerHTML = `
    ${text}
    <button data-action="complete">✓</button>
    <button data-action="delete">✗</button>
  `;
  todoList.appendChild(li);
}

// ─── Handling multiple event types ───────────────────────────────────
document.getElementById('form').addEventListener('input', (e) => {
  if (e.target.matches('input[type="text"]')) {
    validateTextField(e.target);
  } else if (e.target.matches('input[type="email"]')) {
    validateEmail(e.target);
  }
});

// ─── Performance comparison ───────────────────────────────────────────
// Rendering 10,000 rows:
// ❌ 10,000 event listeners: ~50ms setup, high memory
// ✅ 1 delegated listener: <1ms setup, minimal memory

// ─── When NOT to use delegation ──────────────────────────────────────
// ❌ Events that don't bubble (focus, blur — use focusin/focusout instead)
// ❌ Very complex matching logic — can be slower than direct listeners
// ❌ When you need to stop propagation on specific children
```

#### Common Follow-up Questions
- "Does event delegation work with events that don't bubble?" (`focus`/`blur` don't bubble — use `focusin`/`focusout` instead, or `addEventListener('focus', fn, true)` for capture)
- "How does React's synthetic event system implement delegation?"

#### Interview Tip
React uses event delegation at the document root (React 17+) or the root React DOM container — all React event handlers are delegated to a single listener. Understanding this explains React's event system and helps debug edge cases with third-party DOM libraries.

---

### Q48. What is the virtual DOM and how does React use it?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

The **Virtual DOM (VDOM)** is an in-memory representation of the real DOM tree. React creates and maintains a VDOM, computes the difference between the current and new VDOM (diffing), and only applies the minimal set of changes to the real DOM (reconciliation).

```js
// ─── The problem VDOM solves ──────────────────────────────────────────
// Direct DOM manipulation is slow when done naively:
function renderList(items) {
  const ul = document.getElementById('list');
  ul.innerHTML = ''; // clears ALL children — forces complete re-render
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    ul.appendChild(li);
  });
}
// Every call re-renders all items even if only one changed

// ─── What React's VDOM looks like ────────────────────────────────────
// JSX:
const element = <div className="card"><h1>Hello</h1></div>;

// Compiles to:
const element = React.createElement('div', { className: 'card' },
  React.createElement('h1', null, 'Hello')
);

// Virtual DOM representation:
const vdom = {
  type: 'div',
  props: { className: 'card' },
  children: [
    { type: 'h1', props: null, children: ['Hello'] }
  ]
};

// ─── Reconciliation (diffing algorithm) ──────────────────────────────
// React uses a heuristic O(n) algorithm (not optimal O(n³)):
// 1. Different element types → destroy old tree, build new
// 2. Same element type → update changed attributes only
// 3. Lists → use `key` prop to match old/new list items

// Without key (slow — React can't match items):
<ul>
  {items.map(item => <li>{item.name}</li>)} {/* ❌ no key */}
</ul>

// With key (fast — React reuses matching DOM nodes):
<ul>
  {items.map(item => <li key={item.id}>{item.name}</li>)} {/* ✅ */}
</ul>

// ─── Keys must be stable, unique, and from data (not index) ──────────
// ❌ Index as key — breaks when list is reordered or items removed
{items.map((item, index) => <li key={index}>{item.name}</li>)}

// ✅ Stable unique ID from data
{items.map(item => <li key={item.id}>{item.name}</li>)}

// ─── React Fiber (modern reconciler) ──────────────────────────────────
// Fiber rewrote the reconciler in React 16+ to:
// - Pause and resume work (time-slicing in concurrent mode)
// - Prioritize updates (user interactions > background data fetch)
// - Render incrementally without blocking the main thread
```

#### Common Follow-up Questions
- "Does the VDOM always make things faster?" (No — for simple cases, direct DOM is faster. VDOM helps at scale with complex UIs.)
- "How does Svelte differ from React's VDOM approach?" (Svelte compiles to direct DOM manipulation — no VDOM at runtime)
- "What is React's key prop for?"

#### Interview Tip
Address the misconception that "VDOM is always faster than real DOM" — it's not. VDOM's real advantage is **developer experience**: you describe what the UI should look like and React handles the minimal updates. The diffing algorithm is the technical core, and knowing the key heuristics (type changes, keys) shows depth.

---

### Q49. What is `MutationObserver` and what problems does it solve?

**🟡 MEDIUM** | **💡 RARE**

#### Concept

`MutationObserver` watches for changes in the DOM tree (attribute changes, child additions/removals, text content changes) and fires a callback asynchronously when changes occur.

```js
// ─── Basic usage ──────────────────────────────────────────────────────
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    console.log('Type:', mutation.type);
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => console.log('Added:', node));
      mutation.removedNodes.forEach(node => console.log('Removed:', node));
    }
    if (mutation.type === 'attributes') {
      console.log('Attribute changed:', mutation.attributeName);
      console.log('Old value:', mutation.oldValue);
    }
    if (mutation.type === 'characterData') {
      console.log('Text changed to:', mutation.target.nodeValue);
    }
  });
});

const target = document.getElementById('container');
observer.observe(target, {
  childList: true,       // watch for child add/remove
  attributes: true,      // watch for attribute changes
  characterData: true,   // watch for text content changes
  subtree: true,         // observe all descendants
  attributeOldValue: true,    // include old attribute values in mutation records
  characterDataOldValue: true, // include old text content
});

// Later, stop observing:
observer.disconnect();

// ─── Practical use case 1: infinite scroll ────────────────────────────
const sentinel = document.getElementById('scroll-sentinel');
const loadObserver = new MutationObserver(() => {
  if (sentinel.isConnected) loadMoreItems();
});
loadObserver.observe(document.body, { childList: true, subtree: true });

// ─── Practical use case 2: auto-resizing textarea ────────────────────
const textarea = document.querySelector('textarea');
const resizeObserver = new ResizeObserver(entries => {
  // ResizeObserver is different from MutationObserver — watches size changes
  const { height } = entries[0].contentRect;
  adjustLayout(height);
});
resizeObserver.observe(textarea);

// ─── Practical use case 3: third-party DOM changes ───────────────────
// When a third-party library modifies the DOM and you need to react:
const chatContainer = document.getElementById('chat');
const chatObserver = new MutationObserver((mutations) => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.classList?.contains('message')) {
        highlightMentions(node);
        checkForLinks(node);
      }
    });
  });
});
chatObserver.observe(chatContainer, { childList: true, subtree: true });

// ─── MutationObserver vs old polling approach ─────────────────────────
// Old (bad):
setInterval(() => {
  if (document.querySelector('.new-element')) {
    handleNewElement();
    clearInterval(timer);
  }
}, 100); // polling — inefficient, introduces lag

// New (good):
new MutationObserver((mutations, obs) => {
  if (document.querySelector('.new-element')) {
    handleNewElement();
    obs.disconnect();
  }
}).observe(document.body, { childList: true, subtree: true });
```

#### Common Follow-up Questions
- "What's `IntersectionObserver` used for?" (Detecting when elements enter/leave the viewport — lazy loading, infinite scroll, analytics)
- "What's `ResizeObserver`?" (Watches for element size changes)
- "Why is MutationObserver better than polling?" (Event-driven, no wasted CPU cycles between mutations)

#### Interview Tip
The three Observer APIs are a modern toolset: `MutationObserver` (DOM structure changes), `IntersectionObserver` (viewport entry/exit), `ResizeObserver` (element size). Knowing all three and when to use each is impressive. The `IntersectionObserver` for lazy loading images is a very common interview topic.

---

### Q50. What is `IntersectionObserver` and how do you implement lazy loading with it?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

`IntersectionObserver` fires a callback when a target element enters or exits the viewport (or a specified ancestor element). Perfect for lazy loading images, infinite scroll, and analytics (tracking what users see).

```js
// ─── Basic IntersectionObserver ───────────────────────────────────────
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Element entered the viewport
      console.log('Visible:', entry.target);
      // entry.intersectionRatio — 0 to 1 (how much is visible)
      // entry.boundingClientRect — element's position
    }
  });
}, {
  root: null,       // null = viewport
  rootMargin: '0px', // expand/shrink root boundary
  threshold: 0.1,   // fire when 10% of element is visible (or array of thresholds)
});

observer.observe(document.getElementById('target'));
observer.unobserve(element); // stop watching specific element
observer.disconnect();       // stop all

// ─── Lazy loading images ──────────────────────────────────────────────
// HTML: <img src="placeholder.jpg" data-src="real-image.jpg" loading="lazy" />
// data-src holds the real URL — only load when visible

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const img = entry.target;
    img.src = img.dataset.src; // swap placeholder for real image
    img.removeAttribute('data-src');
    img.classList.add('loaded');
    observer.unobserve(img); // stop watching this image — it's loaded
  });
}, {
  rootMargin: '200px 0px', // start loading 200px BEFORE it enters viewport
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// ─── Infinite scroll ──────────────────────────────────────────────────
const sentinel = document.getElementById('scroll-end'); // invisible div at bottom
let page = 1;

const infiniteScrollObserver = new IntersectionObserver(async (entries) => {
  if (!entries[0].isIntersecting) return;
  if (loading) return;

  loading = true;
  const newItems = await fetchPage(++page);
  renderItems(newItems);
  loading = false;

  if (!newItems.hasMore) {
    infiniteScrollObserver.unobserve(sentinel); // no more pages
  }
});

infiniteScrollObserver.observe(sentinel);

// ─── Analytics: tracking visibility ──────────────────────────────────
const adObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio >= 0.5) {
      // Ad is 50% visible — count as an impression
      trackImpression(entry.target.dataset.adId);
      adObserver.unobserve(entry.target); // count each ad once
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.ad').forEach(ad => adObserver.observe(ad));

// ─── React custom hook ────────────────────────────────────────────────
function useInView(options = {}) {
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

// Usage:
function LazySection({ children }) {
  const [ref, inView] = useInView({ threshold: 0.1 });
  return <div ref={ref}>{inView ? children : <Skeleton />}</div>;
}
```

#### Common Follow-up Questions
- "What's `rootMargin` and why would you set it to `200px`?" (Loads images before they become visible — smoother UX)
- "How does this compare to the native `loading="lazy"` attribute on images?" (Native is simpler but less control; IntersectionObserver lets you do custom logic)
- "What performance benefit does this give?" (Avoids loading off-screen resources, reducing initial page load)

#### Interview Tip
This directly applies to performance optimization — a major interview topic. Know the `rootMargin` trick for pre-loading before the element enters view. Implementing it as a React hook (`useInView`) shows you can translate browser APIs into reusable component patterns.

---

## 8. Error Handling

---

### Q51. What are the different types of errors in JavaScript?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

JavaScript has several built-in error types, all extending `Error`. Each signals a different kind of problem.

```js
// ─── Error types ──────────────────────────────────────────────────────
// SyntaxError — code couldn't be parsed (thrown at parse/compile time)
// eval('function (') // SyntaxError: Unexpected token
// Cannot be caught with try/catch in the same script

// TypeError — operation on wrong type
try {
  null.property; // TypeError: Cannot read properties of null
  undefined();   // TypeError: undefined is not a function
  const x = 1;
  x.toUpperCase(); // TypeError: x.toUpperCase is not a function
} catch (e) {
  console.log(e instanceof TypeError); // true
  console.log(e.name);    // 'TypeError'
  console.log(e.message); // 'Cannot read properties of null...'
  console.log(e.stack);   // stack trace string
}

// ReferenceError — accessing undefined variable
try {
  console.log(undeclaredVar); // ReferenceError: undeclaredVar is not defined
} catch (e) { /* ... */ }

// RangeError — numeric value out of valid range
try {
  new Array(-1);                 // RangeError: Invalid array length
  (1.23456).toFixed(200);        // RangeError: toFixed() digits out of range
  function recurse() { recurse(); } recurse(); // RangeError: Maximum call stack exceeded
} catch (e) { /* ... */ }

// URIError — malformed URI
decodeURIComponent('%'); // URIError: URI malformed

// EvalError — (historical, rarely thrown in modern JS)

// AggregateError — multiple errors (ES2021)
Promise.any([Promise.reject('A'), Promise.reject('B')])
  .catch(e => {
    console.log(e instanceof AggregateError); // true
    console.log(e.errors); // ['A', 'B']
  });

// ─── Custom errors ────────────────────────────────────────────────────
class ValidationError extends Error {
  constructor(field, message) {
    super(message); // sets this.message
    this.name = 'ValidationError'; // override default 'Error'
    this.field = field;
    // Fix stack trace (V8 only):
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

// Catching specific error types:
async function loadUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new NetworkError('User not found', res.status);
    return await res.json();
  } catch (error) {
    if (error instanceof ValidationError) {
      showFieldError(error.field, error.message);
    } else if (error instanceof NetworkError && error.statusCode === 404) {
      return null; // expected — handle gracefully
    } else {
      throw error; // unexpected — re-throw
    }
  }
}
```

#### Common Follow-up Questions
- "How do you create custom error types?" (Extend `Error`, set `name`, optionally add properties)
- "What's the difference between `throw` and `return`?" (`throw` unwinds the call stack to the nearest try/catch)
- "When should you re-throw an error?"

#### Interview Tip
Custom error classes are the key to robust error handling. Instead of checking `error.message.includes('not found')` (brittle), use `error instanceof NotFoundError` (type-safe). Mentioning `Error.captureStackTrace` shows Node.js/V8 knowledge.

---

### Q52. What is the `finally` block and when does it run?

**🟢 EASY** | **📌 COMMON**

#### Concept

`finally` runs after `try` and `catch`, **always**, regardless of whether an error was thrown or caught. It runs even if there's a `return` statement inside `try` or `catch`. It's for cleanup code — closing connections, releasing resources, resetting state.

```js
// ─── Always runs ──────────────────────────────────────────────────────
function test(shouldThrow) {
  try {
    if (shouldThrow) throw new Error('oops');
    console.log('try succeeded');
    return 'success'; // finally still runs before the return reaches caller!
  } catch (e) {
    console.log('caught:', e.message);
    return 'caught'; // finally still runs here too!
  } finally {
    console.log('finally always runs');
    // ⚠️ If you return from finally, it OVERRIDES the try/catch return:
    // return 'from finally'; // would override 'success' or 'caught'
  }
}

test(false);
// "try succeeded"
// "finally always runs"
// returns 'success'

test(true);
// "caught: oops"
// "finally always runs"
// returns 'caught'

// ─── Practical: cleanup pattern ──────────────────────────────────────
async function processFile(path) {
  let fileHandle;
  try {
    fileHandle = await openFile(path);
    const data = await fileHandle.read();
    return processData(data);
  } catch (error) {
    console.error('Processing failed:', error);
    throw error; // re-throw after logging
  } finally {
    // ALWAYS close the file, even if an error occurred or we re-threw
    if (fileHandle) await fileHandle.close();
  }
}

// ─── Loading state pattern ────────────────────────────────────────────
async function fetchWithLoading(url) {
  setLoading(true);
  try {
    const data = await fetch(url).then(r => r.json());
    setData(data);
    return data;
  } catch (error) {
    setError(error.message);
    return null;
  } finally {
    setLoading(false); // ALWAYS reset loading, even on error
  }
}

// ─── Equivalent to try/catch/finally with Promises ───────────────────
fetch('/api/data')
  .then(r => r.json())
  .catch(err => console.error(err))
  .finally(() => setLoading(false)); // .finally() on Promises works the same way
```

#### Common Follow-up Questions
- "What happens if you throw inside `finally`?" (Overrides any previous throw or return — be careful)
- "Does `finally` prevent the original error from propagating?" (No, unless you return or throw something new from `finally`)

#### Interview Tip
The loading state pattern is a concrete, relatable example: "Whether the request succeeds or fails, we must hide the loading spinner. That's `finally`." Also worth mentioning: `Promise.prototype.finally()` works the same way — it was added in ES2018 specifically because this pattern is so common.

---

### Q53. How do you handle errors in async code globally?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Unhandled errors in async code can crash Node.js processes or silently fail in browsers. Both environments provide global error hooks for catching what slips through.

```js
// ─── Browser: global error and rejection handlers ─────────────────────
// Unhandled synchronous errors:
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  console.error('At:', event.filename, event.lineno, event.colno);
  // Send to error reporting service:
  Sentry.captureException(event.error);
  // event.preventDefault() prevents default browser error reporting
});

// Unhandled Promise rejections:
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  Sentry.captureException(event.reason);
  event.preventDefault(); // suppress default console warning
});

// Caught (handled) rejection event:
window.addEventListener('rejectionhandled', (event) => {
  console.log('Late rejection handler attached:', event.promise);
});

// ─── Node.js: global handlers ─────────────────────────────────────────
// Unhandled rejections:
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  // In Node 15+, unhandled rejections crash the process by default
  // Log, then exit cleanly:
  logger.error(reason);
  process.exit(1); // important for production — don't run in a bad state
});

// Uncaught synchronous exceptions:
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  logger.error(error);
  // After uncaughtException, process is in undefined state
  // Log and EXIT — do not try to recover!
  process.exit(1);
});

// ─── Express.js global error middleware ───────────────────────────────
// Error middleware: 4 parameters (err, req, res, next)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;
  const message    = err.isOperational ? err.message : 'Internal server error';

  console.error('Error:', err);
  res.status(statusCode).json({ error: message });
});

// ─── React Error Boundary ─────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    Sentry.captureException(error, { extra: info.componentStack });
  }
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
// Catches errors in any child component's render, lifecycle, event handlers
// Does NOT catch: async errors, event handlers, server-side rendering

// ─── Error monitoring services ────────────────────────────────────────
// Sentry, Datadog, Rollbar — integrate with global handlers above
import * as Sentry from '@sentry/browser';
Sentry.init({ dsn: 'your-dsn' });
// After init, Sentry automatically hooks into window.onerror and unhandledrejection
```

#### Common Follow-up Questions
- "What's the difference between `window.onerror` and `window.addEventListener('error', ...)`?"
- "Does a React Error Boundary catch async errors?" (No — only synchronous render errors)
- "Why should you call `process.exit(1)` after `uncaughtException`?"

#### Interview Tip
The distinction between operational errors (expected: 404, validation) and programmer errors (unexpected: null dereference) is the heart of production error handling. Operational errors get user-friendly messages; programmer errors should crash the process and alert on-call. This framework comes from "The Art of Node" and marks senior-level thinking.

---

## 9. Type Coercion & Equality

---

### Q54. What is type coercion and what are its rules?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

**Type coercion** is JavaScript's automatic conversion of values from one type to another. It happens with binary operators, comparisons, and when functions expect a specific type. Understanding coercion requires knowing three abstract operations:
- `ToNumber()` — converts to number
- `ToString()` — converts to string
- `ToPrimitive()` — converts objects to primitives (calls `valueOf` then `toString`)

```js
// ─── String coercion (+ with a string operand) ────────────────────────
'5' + 3      // '53'  — number coerced to string (+ is string concat here)
'5' + true   // '5true'
'5' + null   // '5null'
'5' + undefined // '5undefined'
'5' + {}     // '5[object Object]' — {}.toString() = '[object Object]'
'5' + []     // '5' — [].toString() = '' (empty)
'5' + [1,2]  // '51,2' — [1,2].toString() = '1,2'

// ─── Numeric coercion (other operators: -, *, /, %) ───────────────────
'5' - 3      // 2    — string coerced to number
'5' * '3'    // 15
'5' - true   // 4    — true → 1
'5' - false  // 5    — false → 0
'5' - null   // 5    — null → 0
'5' - undefined // NaN  — undefined → NaN
'5' - []     // 5    — [] → '' → 0
'5' - {}     // NaN  — {} → NaN

// ─── Boolean coercion ─────────────────────────────────────────────────
// Falsy values (exactly 8):
// false, 0, -0, 0n (BigInt zero), '', null, undefined, NaN

// Everything else is truthy — including:
Boolean('0');   // true — non-empty string
Boolean([]);    // true — empty array
Boolean({});    // true — empty object
Boolean('false'); // true — non-empty string

// ─── Comparison coercion ──────────────────────────────────────────────
// == applies type coercion, === does not
null == undefined; // true (special case)
null === undefined; // false
null == 0;         // false (null only == undefined)
null == false;     // false
NaN == NaN;        // false (NaN is never equal to anything, including itself)
NaN === NaN;       // false

// String-to-number comparison:
'5' == 5;   // true — '5' → 5
'05' == 5;  // true — '05' → 5
'' == 0;    // true — '' → 0
' ' == 0;   // true — ' ' → 0 (whitespace trimmed, then '')

// Object to primitive:
[1] == 1;     // true — [1].toString() = '1' → 1
[1,2] == '1,2'; // true — [1,2].toString() = '1,2'
{} == '[object Object]'; // true (sometimes — depends on context)

// ─── The + unary operator coerces to number ───────────────────────────
+true;      // 1
+false;     // 0
+null;      // 0
+undefined; // NaN
+'3';       // 3
+'';        // 0
+[];        // 0
+{};        // NaN
+[1,2];     // NaN
```

#### Common Follow-up Questions
- "What are all the falsy values in JavaScript?"
- "When is `NaN` useful?" (Representing failed numeric conversions — `parseInt('abc')` returns `NaN`)
- "How do you safely check for NaN?" (`Number.isNaN(val)` — not `isNaN()` which coerces first)

#### Interview Tip
You don't need to memorize every coercion rule — just understand the system: `+` prefers strings when a string is involved; `-`, `*`, `/` always try to produce numbers; `==` uses `ToPrimitive` on objects. Always use `===` in production code. The interviewer wants to see that you understand *why* coercion happens, not that you've memorized the table.

---

### Q55. What is the difference between `==` and `===`?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

- `===` (strict equality) — compares value AND type. No coercion. Always use this.
- `==` (loose equality) — compares after type coercion. Has surprising results.

```js
// ─── === (strict) — no coercion ───────────────────────────────────────
1 === 1;        // true
1 === '1';      // false — different types
null === null;  // true
undefined === undefined; // true
NaN === NaN;    // false — NaN is never strictly equal to anything

// ─── == (loose) — with coercion ───────────────────────────────────────
1 == '1';       // true — '1' coerced to 1
0 == false;     // true — false coerced to 0
0 == '';        // true — '' coerced to 0
0 == '0';       // true — '0' coerced to 0
'' == false;    // true — both coerce to 0
null == undefined; // true — special case in spec
null == 0;      // false — null only equals undefined
null == false;  // false
'' == false;    // true

// The famous WTF table:
[] == ![];      // true  — (![] = false) → (0 == 0) = true
{} == !{};      // ??? (depends on where {} appears)

// ─── Reference equality for objects ──────────────────────────────────
const a = { x: 1 };
const b = { x: 1 };
a === b; // false — different object references
a === a; // true — same reference

// ─── When == is acceptable ────────────────────────────────────────────
// null/undefined check (the ONE commonly accepted use):
function foo(x) {
  if (x == null) { // catches BOTH null and undefined
    return 'no value';
  }
  // equivalent to: x === null || x === undefined
}

// ─── Object.is: stricter than === ────────────────────────────────────
// Handles NaN and -0 edge cases:
Object.is(NaN, NaN); // true (=== would be false)
Object.is(-0, 0);    // false (=== would be true)
NaN === NaN;         // false
-0 === 0;            // true (=== gets this wrong)

// React uses Object.is internally for state comparison
```

#### Common Follow-up Questions
- "When would you use `==` intentionally?" (Only the `== null` pattern — catches both null and undefined)
- "What is `Object.is` and how does it differ from `===`?"
- "How does React use equality for re-render optimization?"

#### Interview Tip
The definitive answer: "Always use `===` in production code. The one exception I'd consider is `x == null` to simultaneously check for both null and undefined." Showing the `Object.is` edge cases (+0/-0, NaN/NaN) is a notable bonus — React's `useState` and `useMemo` use `Object.is` for comparison.

---

### Q56. What is `NaN` and how do you properly detect it?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

`NaN` (Not a Number) is a numeric value that represents the result of an invalid or undefined mathematical operation. It's type is `'number'`, and it's the only value in JavaScript that is not equal to itself.

```js
// ─── What produces NaN ────────────────────────────────────────────────
NaN;              // the value itself
parseInt('abc');  // NaN — can't parse
parseFloat('$');  // NaN
0 / 0;            // NaN
Infinity - Infinity; // NaN
Math.sqrt(-1);    // NaN
undefined + 1;    // NaN
undefined - 1;    // NaN

// ─── NaN is not equal to itself ───────────────────────────────────────
NaN === NaN;  // false (!)
NaN == NaN;   // false

// ─── How to detect NaN ────────────────────────────────────────────────

// ❌ typeof (doesn't work — typeof NaN is 'number')
typeof NaN;         // 'number' — misleading but correct per spec

// ❌ Global isNaN — coerces argument first!
isNaN('hello'); // true — 'hello' coerces to NaN, then checked
isNaN(undefined); // true — undefined coerces to NaN
isNaN({});      // true — same issue

// ✅ Number.isNaN — does NOT coerce, checks if value is actually NaN
Number.isNaN(NaN);       // true
Number.isNaN('hello');   // false — not the NaN value
Number.isNaN(undefined); // false
Number.isNaN(123);       // false

// ✅ Self-comparison trick (works because NaN ≠ NaN):
const isNaNValue = (val) => val !== val; // only NaN satisfies this
isNaNValue(NaN); // true
isNaNValue(1);   // false

// ✅ Object.is
Object.is(NaN, NaN); // true

// ─── NaN is contagious ────────────────────────────────────────────────
NaN + 1;     // NaN
NaN * 100;   // NaN
NaN === 0;   // false
NaN > 0;     // false
NaN < 0;     // false

// ─── Practical: safe number parsing ──────────────────────────────────
function safeParseInt(str, fallback = 0) {
  const n = parseInt(str, 10);
  return Number.isNaN(n) ? fallback : n;
}
safeParseInt('42px');  // 42 (parseInt stops at non-numeric)
safeParseInt('abc');   // 0 (fallback)
safeParseInt('');      // 0 (fallback)
```

#### Common Follow-up Questions
- "What's the difference between `isNaN` and `Number.isNaN`?"
- "Why is `typeof NaN === 'number'`?" (Per spec — NaN is in the IEEE 754 floating point standard as a numeric value)

#### Interview Tip
The `isNaN` vs `Number.isNaN` distinction is a classic interview question. `Number.isNaN` was introduced in ES6 specifically because the global `isNaN` is broken — it coerces its argument first. Always use `Number.isNaN`.

---

### Q57. Explain the `typeof` operator and its quirks.

**🟢 EASY** | **📌 COMMON**

#### Concept

`typeof` returns a string indicating the type of a value. It has a few surprising results that every JavaScript developer should know.

```js
// ─── typeof results ───────────────────────────────────────────────────
typeof undefined;        // 'undefined'
typeof true;             // 'boolean'
typeof 42;               // 'number'
typeof NaN;              // 'number' (!)
typeof 'hello';          // 'string'
typeof Symbol();         // 'symbol'
typeof 42n;              // 'bigint'
typeof function() {};    // 'function'  ← special case (not 'object')
typeof {};               // 'object'
typeof [];               // 'object'    (!)  arrays are objects
typeof null;             // 'object'    (!) THE classic JavaScript bug

// ─── The null bug ────────────────────────────────────────────────────
// typeof null === 'object' is a bug from JavaScript's first implementation.
// Can't be fixed — would break too much existing code.
// Correct null check:
const isNull = (val) => val === null; // not typeof

// ─── typeof is safe on undeclared variables ───────────────────────────
console.log(typeof undeclaredVariable); // 'undefined' — no ReferenceError
// Use for feature detection:
if (typeof window !== 'undefined') {
  // Browser environment
}
if (typeof process !== 'undefined' && process.versions?.node) {
  // Node.js environment
}

// ─── Better type checking ─────────────────────────────────────────────
// Array:
Array.isArray([]);       // true
Array.isArray({});       // false

// Null:
val === null;            // correct

// Object (not null):
val !== null && typeof val === 'object'; // correct

// Instance check:
[] instanceof Array;     // true (but breaks across iframes!)

// Reliable type tag:
Object.prototype.toString.call([]);         // '[object Array]'
Object.prototype.toString.call(null);       // '[object Null]'
Object.prototype.toString.call(undefined);  // '[object Undefined]'
Object.prototype.toString.call(/regex/);    // '[object RegExp]'
Object.prototype.toString.call(new Date()); // '[object Date]'
```

#### Common Follow-up Questions
- "How do you correctly check if something is an array?" (`Array.isArray()`)
- "Why does `instanceof` fail across iframes?" (Different `Array.prototype` objects across realms)
- "What is `Object.prototype.toString.call()` good for?"

#### Interview Tip
The `typeof null === 'object'` bug is legendary — every JavaScript developer should know it. Show the correct alternatives: `=== null` for null, `Array.isArray()` for arrays, `instanceof` for custom types. The `Object.prototype.toString.call()` technique is the most reliable all-purpose type checker.

---

## 10. Miscellaneous

---

### Q58. What is `JSON.stringify` and what are its limitations?

**🟢 EASY** | **📌 COMMON**

#### Concept

`JSON.stringify(value, replacer, space)` converts a JavaScript value to a JSON string. It has important limitations and useful features beyond the basic usage.

```js
// ─── Basic usage ──────────────────────────────────────────────────────
JSON.stringify({ name: 'Alice', age: 30 }); // '{"name":"Alice","age":30}'
JSON.stringify([1, 2, 3]);                   // '[1,2,3]'
JSON.stringify('hello');                     // '"hello"'

// ─── Limitations (values that don't serialize) ────────────────────────
const obj = {
  a: undefined,      // ❌ omitted
  b: function() {},  // ❌ omitted
  c: Symbol('x'),    // ❌ omitted
  d: NaN,            // → null
  e: Infinity,       // → null
  f: -Infinity,      // → null
  g: new Date(),     // → ISO string (dates serialize as strings!)
  h: /regex/,        // → {}
  i: 42,             // ✅
  j: 'string',       // ✅
  k: true,           // ✅
  l: null,           // ✅
};
JSON.stringify(obj);
// '{"d":null,"e":null,"f":null,"g":"2024-01-15T00:00:00.000Z","h":{},"i":42,"j":"string","k":true,"l":null}'

// ─── Circular reference throws ────────────────────────────────────────
const circular = { a: 1 };
circular.self = circular; // refers to itself
JSON.stringify(circular); // ❌ TypeError: Converting circular structure to JSON

// ─── replacer: filter or transform values ────────────────────────────
// Array replacer — only include these keys:
JSON.stringify({ name: 'Alice', password: 'secret', age: 30 },
  ['name', 'age']); // '{"name":"Alice","age":30}' — password excluded

// Function replacer — transform values:
JSON.stringify({ name: 'Alice', secret: '12345', score: null },
  (key, value) => {
    if (key === 'secret') return undefined; // omit the key
    if (value === null)   return 0;          // replace null with 0
    return value;
  });
// '{"name":"Alice","score":0}'

// ─── space: pretty-print ──────────────────────────────────────────────
console.log(JSON.stringify({ a: 1, b: [1, 2] }, null, 2));
// {
//   "a": 1,
//   "b": [
//     1,
//     2
//   ]
// }

// ─── toJSON method: custom serialization ─────────────────────────────
class User {
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
  toJSON() {
    return { name: this.name }; // exclude password from JSON
  }
}
JSON.stringify(new User('Alice', 'secret')); // '{"name":"Alice"}'

// ─── Deep clone (limited — only works for JSON-safe data) ────────────
const clone = JSON.parse(JSON.stringify(original));
// ❌ Loses: undefined, functions, Dates (become strings), circular refs
// ✅ For JSON-safe objects: works fine
// Better alternatives: structuredClone() (native, handles more types)
const betterClone = structuredClone(original); // ES2022+
```

#### Common Follow-up Questions
- "How do you deep clone an object?" (`structuredClone`, `JSON.parse(JSON.stringify())` with caveats, Lodash `cloneDeep`)
- "How do you handle circular references in JSON.stringify?"
- "What does `toJSON` do?"

#### Interview Tip
The `JSON.stringify` + `JSON.parse` for deep cloning is everywhere in codebases, but show you know its limitations (loses Date types, functions, undefined). The modern answer is `structuredClone()` which handles Dates, Maps, Sets, Blobs, and even some circular references.

---

### Q59. What is `structuredClone` and when should you use it?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

`structuredClone()` (ES2022, Node 17+) creates a deep copy of an object using the Structured Clone Algorithm. It handles more types than `JSON.parse(JSON.stringify())` and is the modern standard for deep cloning.

```js
// ─── What structuredClone handles ────────────────────────────────────
const original = {
  name: 'Alice',
  date: new Date(),              // ✅ actual Date object (not string)
  map: new Map([['key', 'val']]), // ✅ Map preserved
  set: new Set([1, 2, 3]),       // ✅ Set preserved
  arr: [1, [2, [3]]],            // ✅ nested arrays
  regex: /test/i,                // ✅ RegExp
  typed: new Uint8Array([1,2,3]), // ✅ TypedArrays
  buffer: new ArrayBuffer(8),    // ✅ ArrayBuffer
  error: new Error('oops'),      // ✅ Error objects
};

const clone = structuredClone(original);

clone.date.getTime() === original.date.getTime(); // true (same value)
clone.date === original.date; // false (different object) ✅

// ─── What structuredClone CANNOT handle ──────────────────────────────
const bad = {
  fn: () => {},           // ❌ TypeError: functions not cloneable
  sym: Symbol('x'),       // ❌ TypeError: Symbols not cloneable
  node: document.body,    // ❌ DOM nodes not cloneable
};
structuredClone(bad); // TypeError

// Circular references ARE handled:
const circular = { a: 1 };
circular.self = circular;
const cloned = structuredClone(circular); // ✅ no error
cloned.self === cloned; // true (circular reference preserved)

// ─── Comparison table ─────────────────────────────────────────────────
//                          JSON.parse(stringify)    structuredClone
// Dates                    ❌ (becomes string)      ✅
// Maps                     ❌ (becomes {})           ✅
// Sets                     ❌ (becomes {})           ✅
// Circular refs            ❌ (throws)               ✅
// Functions                ❌ (omitted)              ❌ (throws)
// Undefined                ❌ (omitted)              ✅
// TypedArray/ArrayBuffer   ❌                        ✅
// Performance              ~1x                       ~2x faster typically

// ─── Transferable objects (zero-copy clone) ───────────────────────────
const buffer = new ArrayBuffer(1024);
// Transfer ownership (buffer becomes unusable in current scope):
const clone2 = structuredClone(buffer, { transfer: [buffer] });
// buffer is now detached (zero-byte) — clone2 has the data
```

#### Common Follow-up Questions
- "When would you still use JSON.parse/stringify instead of structuredClone?" (When you need JSON output format, or when the data is known to be JSON-safe and you need max compatibility)
- "What's the performance difference?"
- "How did people deep clone before structuredClone?"

#### Interview Tip
Knowing `structuredClone` exists is itself differentiating — many developers still write `JSON.parse(JSON.stringify(x))` out of habit. Mentioning it shows you keep up with modern APIs. The transfer option is particularly impressive — it's zero-copy, used for performance-sensitive operations.

---

### Q60. What is the difference between `Object.freeze`, `Object.seal`, and `Object.preventExtensions`?

**🔴 HARD** | **💡 RARE**

#### Concept

Three methods for restricting object mutability, in decreasing order of restriction:

| Method | Add props | Delete props | Change values | Change descriptors |
|---|---|---|---|---|
| `Object.preventExtensions` | ❌ | ✅ | ✅ | ✅ |
| `Object.seal` | ❌ | ❌ | ✅ | ❌ |
| `Object.freeze` | ❌ | ❌ | ❌ | ❌ |

```js
// ─── Object.preventExtensions ────────────────────────────────────────
// Can't add properties, but can modify/delete existing
const obj1 = Object.preventExtensions({ x: 1, y: 2 });
obj1.z = 3;     // silently fails (throws in strict mode)
obj1.x = 99;    // ✅ can modify existing
delete obj1.y;  // ✅ can delete
Object.isExtensible(obj1); // false

// ─── Object.seal ─────────────────────────────────────────────────────
// Can't add or delete properties, but can modify values
const obj2 = Object.seal({ x: 1, y: 2 });
obj2.z = 3;     // ❌ silently fails
obj2.x = 99;    // ✅ can modify existing
delete obj2.y;  // ❌ silently fails
Object.isSealed(obj2); // true

// ─── Object.freeze ────────────────────────────────────────────────────
// Full immutability — no add, delete, or modify
const obj3 = Object.freeze({ x: 1, y: 2 });
obj3.z = 3;     // ❌
obj3.x = 99;    // ❌
delete obj3.y;  // ❌
Object.isFrozen(obj3); // true

// ─── Freeze is SHALLOW ────────────────────────────────────────────────
const nested = Object.freeze({ user: { name: 'Alice', age: 30 } });
nested.user = {};       // ❌ can't reassign user
nested.user.name = 'Bob'; // ✅ nested object is NOT frozen!
console.log(nested.user.name); // 'Bob' — shallow freeze only

// ─── Deep freeze ─────────────────────────────────────────────────────
function deepFreeze(obj) {
  Object.getOwnPropertyNames(obj).forEach(name => {
    const value = obj[name];
    if (value && typeof value === 'object') {
      deepFreeze(value); // recursively freeze
    }
  });
  return Object.freeze(obj);
}

const config = deepFreeze({
  api: { url: 'https://api.example.com', timeout: 5000 },
  features: { darkMode: true },
});
config.api.url = 'changed'; // ❌ deeply frozen
config.api.url; // 'https://api.example.com' — unchanged

// ─── Use cases ────────────────────────────────────────────────────────
// freeze: immutable config, constants, action types
const ActionTypes = Object.freeze({
  FETCH_USER: 'FETCH_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
});

// seal: objects with a fixed set of properties
// (prevent accidental typos from adding new properties)
const settings = Object.seal({
  theme: 'light',
  language: 'en',
  fontSize: 14,
});
settings.typo = 'value'; // ❌ caught as bug
settings.theme = 'dark';  // ✅ valid modification

// preventExtensions: "complete" an object's schema without locking values
class Config {
  constructor(options) {
    Object.assign(this, options);
    Object.preventExtensions(this); // no adding more props after construction
  }
}
```

#### Common Follow-up Questions
- "Is `Object.freeze` suitable for Redux state?" (Shallow freeze is often used in development — Redux Toolkit does this. Not for production — performance cost)
- "How does `const` relate to `Object.freeze`?" (`const` prevents reassignment; `freeze` prevents mutation. They're orthogonal.)
- "What's `Object.isFrozen()` vs `Object.isSealed()`?"

#### Interview Tip
Connect this to practical use cases: Redux action type constants (freeze), class instances with fixed schemas (seal or preventExtensions), configuration objects (deep freeze). The `const` vs `Object.freeze` distinction is a common follow-up — they solve different problems: `const` stops the variable pointing elsewhere, `freeze` stops the object's content changing.

---

## Quick Reference — Difficulty & Frequency Summary

| # | Question | Difficulty | Frequency |
|---|---|---|---|
| Q1 | Event loop | 🟡 | 🔥 |
| Q2 | setTimeout vs Promise.resolve | 🟢 | 🔥 |
| Q3 | Callback hell | 🟢 | 🔥 |
| Q4 | Concurrency vs Parallelism | 🟡 | 📌 |
| Q5 | requestAnimationFrame | 🟡 | 📌 |
| Q6 | process.nextTick, setImmediate | 🔴 | 📌 |
| Q7 | Web Workers | 🟡 | 📌 |
| Q8 | await inside forEach | 🟡 | 🔥 |
| Q9 | Memory leaks | 🟡 | 📌 |
| Q10 | Debounce & Throttle | 🟡 | 🔥 |
| Q11 | Closures | 🟢 | 🔥 |
| Q12 | var in loop bug | 🟢 | 🔥 |
| Q13 | Lexical vs dynamic scope | 🟡 | 📌 |
| Q14 | IIFE | 🟡 | 📌 |
| Q15 | var vs let vs const | 🟢 | 🔥 |
| Q16 | Variable shadowing | 🟢 | 📌 |
| Q17 | Pure functions | 🟡 | 📌 |
| Q18 | Currying | 🔴 | 📌 |
| Q19 | this binding rules | 🟡 | 🔥 |
| Q20 | Prototypal inheritance | 🟡 | 🔥 |
| Q21 | `__proto__` vs prototype | 🔴 | 📌 |
| Q22 | Object.create(null) | 🔴 | 💡 |
| Q23 | call, apply, bind | 🟢 | 🔥 |
| Q24 | new keyword internals | 🟡 | 📌 |
| Q25 | Object.defineProperty | 🔴 | 📌 |
| Q26 | Proxy & Reflect | 🔴 | 💡 |
| Q27 | Hoisting | 🟢 | 🔥 |
| Q28 | TDZ | 🟡 | 🔥 |
| Q29 | Declarations vs expressions | 🟢 | 🔥 |
| Q30 | arguments vs rest | 🟡 | 📌 |
| Q31 | Block-scoped functions | 🔴 | 💡 |
| Q32 | Promise states | 🟢 | 🔥 |
| Q33 | Promise combinators | 🟡 | 🔥 |
| Q34 | async/await internals | 🟡 | 🔥 |
| Q35 | Promise chaining | 🟡 | 📌 |
| Q36 | Async generators | 🔴 | 💡 |
| Q37 | Error handling async | 🟡 | 🔥 |
| Q38 | Promise.resolve() | 🟡 | 📌 |
| Q39 | Top-level await | 🟡 | 📌 |
| Q40 | Generators & Iterators | 🔴 | 📌 |
| Q41 | Map & Set | 🟢 | 🔥 |
| Q42 | Decorators | 🔴 | 💡 |
| Q43 | Destructuring | 🟢 | 🔥 |
| Q44 | Template literals | 🟢 | 📌 |
| Q45 | Symbols | 🟡 | 💡 |
| Q46 | Bubbling & Capturing | 🟡 | 🔥 |
| Q47 | Event delegation | 🟡 | 🔥 |
| Q48 | Virtual DOM | 🟡 | 🔥 |
| Q49 | MutationObserver | 🟡 | 💡 |
| Q50 | IntersectionObserver | 🟡 | 📌 |
| Q51 | Error types | 🟡 | 📌 |
| Q52 | finally block | 🟢 | 📌 |
| Q53 | Global error handling | 🟡 | 📌 |
| Q54 | Type coercion | 🟡 | 🔥 |
| Q55 | == vs === | 🟢 | 🔥 |
| Q56 | NaN detection | 🟡 | 📌 |
| Q57 | typeof quirks | 🟢 | 📌 |
| Q58 | JSON.stringify | 🟢 | 📌 |
| Q59 | structuredClone | 🟡 | 📌 |
| Q60 | freeze / seal / preventExtensions | 🔴 | 💡 |

---

## Study Priority Order

**Week 1 (Master these first):**
Q1, Q2, Q3, Q8, Q10, Q11, Q12, Q15, Q19, Q20, Q23, Q27, Q28, Q29, Q32, Q33, Q34, Q37, Q41, Q43, Q46, Q47, Q54, Q55

**Week 2 (Round out your knowledge):**
Q4, Q5, Q7, Q9, Q13, Q16, Q17, Q22, Q24, Q25, Q30, Q35, Q38, Q39, Q44, Q48, Q50, Q51, Q52, Q53, Q56, Q57, Q58, Q59

**Week 3 (Advanced topics for senior roles):**
Q6, Q18, Q21, Q26, Q31, Q36, Q40, Q42, Q45, Q49, Q60
