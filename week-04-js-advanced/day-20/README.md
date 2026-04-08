# Day 20 — Event Loop Deep Dive + Advanced Async Patterns

**Status:** 📋 READY TO START
**Week:** 4 | **Theme:** JavaScript Advanced

---

## What You'll Learn Today

Yesterday you used async/await. Today you understand *why* it works the way it does.

The Event Loop is what makes JavaScript async possible despite being single-threaded. Every interview that goes beyond surface-level will ask you about this. Most candidates wave their hands and say "something about queues." You're going to know it cold.

By end of day you'll understand:
- The **Call Stack** — where your code actually runs
- The **Microtask Queue** — where Promises resolve (runs BEFORE macrotasks)
- The **Macrotask Queue** — where setTimeout, setInterval callbacks live
- Why `Promise.resolve().then()` runs before `setTimeout(fn, 0)` — even with a 0ms delay
- How to handle every async failure scenario without your app crashing

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/js/08-async.md` — re-read the Event Loop section
3. `exercises/js-async/12-async-errors.js` — midday
4. `dsa-bank/hashmaps.md` — afternoon

---

## Morning (8:00 – 11:00 AM) — Event Loop Experiments

### Create your experiment file

Create `day-20-eventloop.js` in this folder.

### Step 1 — Re-read the Event Loop section in the async cheatsheet

Find the section on the Event Loop in `cheatsheets/js/08-async.md`. Read it carefully, then come back here.

---

### Step 2 — The Core Mental Model

JavaScript has ONE call stack. Only one thing runs at a time.

When async work is scheduled (setTimeout, fetch, Promises), the JS engine hands it off to the browser/Node runtime and keeps running. When the async work finishes, the callback goes into a queue. The Event Loop constantly checks: "Is the call stack empty? If yes, pull the next item from the queue."

**Two queues, different priority:**
- **Microtask Queue** — Promises, `queueMicrotask()` → runs IMMEDIATELY after the current task, before any macrotask
- **Macrotask Queue** — `setTimeout`, `setInterval`, I/O → runs after microtasks are empty

```
Call Stack empty?
  → Run ALL microtasks first (until microtask queue is empty)
  → Then run ONE macrotask
  → Check microtasks again
  → Repeat
```

---

### Step 3 — The Experiment That Proves It

Type this into `day-20-eventloop.js` and run it. **Before running, predict the output order:**

```js
console.log("1 — synchronous start");

setTimeout(() => console.log("2 — setTimeout (macrotask)"), 0);

Promise.resolve().then(() => console.log("3 — Promise.then (microtask)"));

console.log("4 — synchronous end");
```

Your prediction: _______ (write it as a comment before running!)

**Actual output:**
```
1 — synchronous start
4 — synchronous end
3 — Promise.then (microtask)   ← microtask before macrotask!
2 — setTimeout (macrotask)     ← macrotask last, even with 0ms delay
```

If this surprises you — good. That means you're learning something real.

---

### Step 4 — More Experiments to Type and Run

**Experiment 2: Microtasks run before each macrotask**
```js
let count = 0;

function scheduleMicrotask() {
  Promise.resolve().then(() => {
    count++;
    console.log("Microtask", count);
    if (count < 5) scheduleMicrotask();
  });
}

setTimeout(() => console.log("Macrotask — setTimeout"), 0);
scheduleMicrotask();

// All 5 microtasks run FIRST, setTimeout runs last
```

**Experiment 3: async/await is Promise sugar**
```js
async function example() {
  console.log("A — inside async fn, before await");
  await Promise.resolve();
  console.log("C — after await (this is a microtask!)");
}

console.log("before calling example");
example();
console.log("B — synchronous code after calling example()");

// Output: before calling example → A → B → C
// Code after `await` is essentially a .then() callback
```

**Experiment 4: Unhandled rejections**
```js
async function failing() {
  throw new Error("Async failure!");
}

// This causes a warning in Node — always handle rejections!
failing();

// Fix with .catch():
failing().catch(err => console.log("Caught:", err.message));

// Or with async/await try/catch:
async function main() {
  try {
    await failing();
  } catch (err) {
    console.log("Caught:", err.message);
  }
}
main();
```

---

### Step 5 — `queueMicrotask` (bonus)

```js
queueMicrotask(() => console.log("explicit microtask"));
setTimeout(() => console.log("macrotask"), 0);
Promise.resolve().then(() => console.log("promise microtask"));

// Output: explicit microtask, promise microtask, macrotask
// Both microtask sources run before the macrotask
```

---

## Mid-Morning Break (11:00 – 11:20 AM)

The event loop is a lot to absorb. Step away, let it settle.

---

## Midday (11:20 AM – 1:00 PM) — Error Handling Exercise

### `exercises/js-async/12-async-errors.js`

**Pattern: Error Handling**

This exercise has 10 broken async scenarios. Each one fails in a different way:
- Missing `await`
- Missing `try/catch`
- Swallowed errors
- Race conditions
- Unhandled rejections
- Wrong error propagation in `Promise.all`

Your job: find what's broken, fix it, and comment your fix.

**How to work through each scenario:**
1. Read the broken code
2. Predict what will fail and why
3. Run it and see the actual error
4. Fix it
5. Run again to confirm it works
6. Write: `// BUG: [what was wrong] | FIX: [what you changed]`

---

## Lunch (1:00 – 2:00 PM)

---

## Afternoon (2:00 – 4:00 PM) — Hash Maps DSA

Open `dsa-bank/hashmaps.md`. Solve **problems 1 through 5**.

Create `day-20-dsa.js` in this folder.

Hash maps turn O(n²) brute force into O(n) elegant solutions by trading space for time. When you see: "find a pair", "count occurrences", "check if seen before" — the answer is almost always a hash map.

```js
// Pattern example: Two Sum
function twoSum(nums, target) {
  const seen = new Map();           // number → index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }
}
// O(n) time, O(n) space — vs O(n²) brute force
```

Before each problem:
```js
// Problem: [name]
// Pattern: Hash Map — [why hash map helps here]
// Time: O(?) | Space: O(?)
```

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- Explain microtask queue vs macrotask queue in your own words
- Which async error scenario was hardest to diagnose?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 20: Event loop mastery + async error fixing + 5 hashmap DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Re-read Event Loop section in async cheatsheet
- [ ] Created `day-20-eventloop.js` with all 4 experiments
- [ ] Predicted output before running each experiment
- [ ] Saw microtask beats macrotask even with `setTimeout(fn, 0)`
- [ ] Fixed all 10 broken scenarios in `12-async-errors.js`
- [ ] Commented each fix explaining what was wrong
- [ ] Solved 5 hash map problems in `day-20-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference — Event Loop

```
Execution order:
1. Run all synchronous code (call stack)
2. Run ALL microtasks (Promise .then, await continuations, queueMicrotask)
3. Run ONE macrotask (setTimeout, setInterval, I/O)
4. Go back to step 2

Key insight: setTimeout(fn, 0) is NOT immediate.
             Promise.resolve().then(fn) always runs before it.
```

---

*The event loop separates developers who "use" async from those who truly understand it. You now understand it.*
