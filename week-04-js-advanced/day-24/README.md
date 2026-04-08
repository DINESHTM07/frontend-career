# Day 24 — Build Promise.all, Event Emitter & Deep Clone From Scratch

**Status:** 📋 READY TO START
**Week:** 4 | **Theme:** JavaScript Advanced

---

## What You'll Learn Today

Three more classic interview implementations — each one teaches a fundamental concept:

1. **`Promise.all` from scratch** — understand parallel async execution deeply
2. **Event Emitter (on/off/emit/once)** — the pub/sub pattern used in Node.js and React state management
3. **Deep Clone** — copy nested objects + arrays + dates without mutation

Then you'll wire the Event Emitter into a real notification system.

---

## Files to Open Today

1. **This README** — read first
2. `dsa-bank/10-js-specific-dsa.md` — morning (Promise.all, event emitter, deep clone problems)
3. New folder `day-24-notification-system/` — midday
4. `dsa-bank/recursion.md` — afternoon

---

## Morning (8:00 – 11:00 AM) — Three Implementations

Create `day-24-implementations.js` in this folder.

Open `dsa-bank/10-js-specific-dsa.md` and find the relevant problems.

---

### Build 1 — `Promise.all` From Scratch

`Promise.all` takes an array of Promises and returns a single Promise that:
- Resolves with an array of all results (in original order) when ALL resolve
- Rejects immediately if ANY single Promise rejects

```js
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]); // edge case: empty array resolves immediately
      return;
    }

    const results = new Array(promises.length);
    let resolvedCount = 0;

    promises.forEach((promise, index) => {
      // Wrap in Promise.resolve to handle non-Promise values too
      Promise.resolve(promise).then(value => {
        results[index] = value;          // store at original index (order matters!)
        resolvedCount++;

        if (resolvedCount === promises.length) {
          resolve(results);              // all done!
        }
      }).catch(reject);                  // any rejection fails everything
    });
  });
}

// Test 1: all resolve
myPromiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(console.log); // [1, 2, 3]

// Test 2: one rejects
myPromiseAll([
  Promise.resolve(1),
  Promise.reject(new Error("failed!")),
  Promise.resolve(3)
]).catch(err => console.log("Error:", err.message)); // "Error: failed!"

// Test 3: compare timing — parallel vs sequential
async function testParallel() {
  const delay = (ms, val) => new Promise(r => setTimeout(() => r(val), ms));
  
  console.time("parallel");
  await myPromiseAll([delay(1000, "a"), delay(1000, "b"), delay(1000, "c")]);
  console.timeEnd("parallel"); // ~1000ms (all run simultaneously)
  
  console.time("sequential");
  await delay(1000, "a");
  await delay(1000, "b");
  await delay(1000, "c");
  console.timeEnd("sequential"); // ~3000ms (runs one by one)
}

testParallel();
```

**Key insight:** `results[index] = value` — results are stored at their ORIGINAL index, not in the order they resolve. That's why your array is always in the same order as the input.

---

### Build 2 — Event Emitter (on/off/emit/once)

The Event Emitter is one of the most used patterns in JavaScript. Node.js built-in modules, React state libraries, and custom pub/sub systems all use this pattern.

```js
class EventEmitter {
  constructor() {
    this.events = {}; // eventName → [array of listener functions]
  }

  // Register a listener for an event
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this; // allow chaining: emitter.on("a", fn).on("b", fn)
  }

  // Remove a specific listener
  off(event, listener) {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(l => l !== listener);
    return this;
  }

  // Fire all listeners for an event
  emit(event, ...args) {
    if (!this.events[event]) return false;
    this.events[event].forEach(listener => listener(...args));
    return true;
  }

  // Listen only ONCE — auto-removes after first call
  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);    // call the real listener
      this.off(event, wrapper); // remove this wrapper
    };
    this.on(event, wrapper);
    return this;
  }
}

// Test it
const emitter = new EventEmitter();

function handleLogin(user) {
  console.log(`${user} logged in`);
}

emitter.on("login", handleLogin);
emitter.on("login", user => console.log(`Welcome, ${user}!`));
emitter.once("first-login", user => console.log(`First time for ${user}!`));

emitter.emit("login", "Dinesh");  // both handlers fire
emitter.emit("login", "Dinesh");  // both fire again
emitter.emit("first-login", "Dinesh"); // fires once
emitter.emit("first-login", "Dinesh"); // does NOT fire (once is used up)

emitter.off("login", handleLogin);
emitter.emit("login", "Dinesh"); // only welcome message fires
```

---

### Build 3 — Deep Clone

Shallow copy (`{ ...obj }`) only copies one level deep. Nested objects are still references:

```js
const original = { a: 1, nested: { b: 2 } };
const shallow = { ...original };
shallow.nested.b = 99;
console.log(original.nested.b); // 99 ← original was mutated!
```

Deep clone copies EVERYTHING, all the way down:

```js
function deepClone(value) {
  // Primitives — just return
  if (value === null || typeof value !== "object") return value;

  // Date — create new Date with same time
  if (value instanceof Date) return new Date(value.getTime());

  // Array — clone each element recursively
  if (Array.isArray(value)) return value.map(item => deepClone(item));

  // Plain object — clone each property recursively
  const cloned = {};
  for (const key of Object.keys(value)) {
    cloned[key] = deepClone(value[key]);
  }
  return cloned;
}

// Test
const original = {
  name: "Dinesh",
  scores: [95, 87, 92],
  address: { city: "Chennai", zip: "600001" },
  joined: new Date("2024-01-01")
};

const clone = deepClone(original);
clone.address.city = "Mumbai";
clone.scores.push(100);
clone.joined.setFullYear(2025);

console.log(original.address.city);  // "Chennai" ← unchanged!
console.log(original.scores.length); // 3 ← unchanged!
console.log(original.joined.getFullYear()); // 2024 ← unchanged!
```

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:00 PM) — Notification System

Build a notification system using your `EventEmitter`. Components subscribe to events. The system emits notifications. Anyone can subscribe or unsubscribe.

### Create the project

Create folder `day-24-notification-system/` with:

**`index.html`:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Notification System</title>
  <style>
    body { font-family: sans-serif; max-width: 700px; margin: 40px auto; padding: 20px; }
    .notification { padding: 12px 16px; border-radius: 8px; margin: 8px 0; animation: slideIn 0.3s ease; }
    .success { background: #d1fae5; border-left: 4px solid #10b981; color: #065f46; }
    .error   { background: #fee2e2; border-left: 4px solid #ef4444; color: #991b1b; }
    .info    { background: #dbeafe; border-left: 4px solid #3b82f6; color: #1e40af; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; color: #92400e; }
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    .controls { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
    button { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
    .btn-success { background: #10b981; color: white; }
    .btn-error { background: #ef4444; color: white; }
    .btn-info { background: #3b82f6; color: white; }
    .btn-warning { background: #f59e0b; color: white; }
  </style>
</head>
<body>
  <h1>Notification System</h1>
  <div class="controls">
    <button class="btn-success" onclick="triggerSuccess()">Success</button>
    <button class="btn-error" onclick="triggerError()">Error</button>
    <button class="btn-info" onclick="triggerInfo()">Info</button>
    <button class="btn-warning" onclick="triggerWarning()">Warning</button>
  </div>
  <div id="notifications"></div>
  <script src="app.js"></script>
</body>
</html>
```

**`app.js`:**
```js
// === YOUR EVENT EMITTER (paste from morning) ===
class EventEmitter {
  constructor() { this.events = {}; }
  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return this;
  }
  off(event, listener) {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(l => l !== listener);
    return this;
  }
  emit(event, ...args) {
    if (!this.events[event]) return false;
    this.events[event].forEach(l => l(...args));
    return true;
  }
  once(event, listener) {
    const wrapper = (...args) => { listener(...args); this.off(event, wrapper); };
    this.on(event, wrapper);
    return this;
  }
}

// === NOTIFICATION SYSTEM ===
const notifier = new EventEmitter();

const container = document.querySelector("#notifications");

// Listener: display notification in the DOM
function displayNotification({ type, message, duration = 3000 }) {
  const el = document.createElement("div");
  el.className = `notification ${type}`;
  el.textContent = message;
  container.prepend(el);
  setTimeout(() => el.remove(), duration);
}

// Subscribe to all notification types
notifier.on("notify", displayNotification);

// Log all notifications (second subscriber — this is the power of pub/sub)
notifier.on("notify", ({ type, message }) => {
  console.log(`[${type.toUpperCase()}] ${message}`);
});

// One-time welcome notification
notifier.once("notify", () => {
  console.log("First notification ever triggered!");
});

// === TRIGGER FUNCTIONS ===
function triggerSuccess() {
  notifier.emit("notify", { type: "success", message: "Operation completed successfully!" });
}
function triggerError() {
  notifier.emit("notify", { type: "error", message: "Something went wrong. Please try again." });
}
function triggerInfo() {
  notifier.emit("notify", { type: "info", message: "New update available." });
}
function triggerWarning() {
  notifier.emit("notify", { type: "warning", message: "Your session expires in 5 minutes." });
}
```

Open with Live Server. Click buttons. Each click emits an event — the display listener shows it in the UI, the log listener logs it to console. Both independently subscribed. This is pub/sub.

---

## Lunch (1:00 – 2:00 PM)

---

## Afternoon (2:00 – 4:00 PM) — Recursion DSA

Open `dsa-bank/recursion.md`. Solve **problems 1 through 5**.

Write solutions in `day-24-dsa.js` in this folder.

### Recursion Mental Model

Every recursive function needs two things:
1. **Base case** — when to STOP
2. **Recursive case** — call itself with a SMALLER problem

```js
// Example: factorial
function factorial(n) {
  if (n <= 1) return 1;           // base case
  return n * factorial(n - 1);   // recursive case (smaller: n-1)
}
```

Before coding each problem, identify base case and recursive case in a comment.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- How does `myPromiseAll` preserve order even when Promises resolve out of order?
- What is the pub/sub pattern? How does your EventEmitter implement it?
- What's the difference between shallow clone and deep clone?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 24: Promise.all + event emitter + deep clone + notification system + 5 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Built `myPromiseAll` — tested all-resolve AND one-reject cases
- [ ] Verified parallel timing (~1s) vs sequential timing (~3s)
- [ ] Built `EventEmitter` with `on`, `off`, `emit`, `once`
- [ ] Tested `.once()` — confirmed it fires only one time
- [ ] Tested `.off()` — confirmed listener stops firing after removal
- [ ] Built `deepClone` — tested with nested objects, arrays, and Dates
- [ ] Confirmed original is NOT mutated after modifying clone
- [ ] Built `day-24-notification-system/` — notifications appear in browser
- [ ] Multiple subscribers work independently (display + console log)
- [ ] Solved 5 recursion problems in `day-24-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference

```js
// Promise.all — resolves when all resolve, rejects if any reject
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let count = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(v => {
        results[i] = v;
        if (++count === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}

// Event Emitter — pub/sub pattern
// emitter.on("event", fn)   → subscribe
// emitter.off("event", fn)  → unsubscribe
// emitter.emit("event", data) → publish to all subscribers
// emitter.once("event", fn) → subscribe for one call only

// Deep Clone — handles nested objects, arrays, dates
// JSON.parse(JSON.stringify(obj)) works but loses Date, functions, undefined
// Use the recursive deepClone function for real use
```

---

*The EventEmitter pattern is how React's context, Redux, and Zustand work under the hood. You just built the foundation.*
