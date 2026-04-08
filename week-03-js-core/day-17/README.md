# Day 17 — Async JavaScript (Promises, async/await, fetch)

**Status:** 📋 READY TO START
**Week:** 3 | **Theme:** JavaScript Core

---

## What You'll Learn Today

Async is the hardest topic in JavaScript. Most beginners avoid it. You're going to face it head on.

JavaScript is single-threaded — it can only do one thing at a time. But real apps need to wait for things: network requests, timers, file reads. Async lets JavaScript *pause* work and come back to it later without freezing the entire page.

Today you'll understand:
- **Callbacks** — the old, painful way
- **Promises** — the modern contract: "I'll give you a value... eventually"
- **async/await** — syntactic sugar that makes async code look synchronous
- **fetch API** — how to talk to the internet
- **Error handling** — what to do when things go wrong (they always do)

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/js/08-async.md` — left panel (read this TWICE)
3. `exercises/js-async/10-pizza-simulator.js` — midday
4. `exercises/js-async/11-parallel-race.js` — midday

---

## Morning (8:00 – 11:00 AM) — Read Carefully, Type Everything

### Create your practice file

Create `day-17-practice.js` in this folder.

### Read `cheatsheets/js/08-async.md` — read it twice

This is the one cheatsheet where I mean it: **read the whole thing, then read it again**. Async confuses everyone on the first pass. The second pass is where it starts to make sense.

---

### The Mental Model — understand this before typing code

JavaScript uses an **event loop**. When async work starts (like a network request), JavaScript doesn't wait — it says "go do that, I'll check back later" and keeps running other code. When the async work finishes, the result is placed in a queue and JavaScript picks it up when it's free.

**Without async/await (confusing):**
```js
console.log("1");
setTimeout(() => console.log("2"), 1000);
console.log("3");
// Output: 1, 3, 2  ← "2" is LAST even though it looks like it's in the middle!
```

**TYPE THIS. RUN IT. See the output order with your own eyes.**

---

### Promises

A Promise is an object that represents a future value. It has three states:
- **pending** — not done yet
- **fulfilled** — done successfully, has a value
- **rejected** — failed, has an error

```js
// Creating a Promise
const myPromise = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("It worked!");
  } else {
    reject("It failed!");
  }
});

// Using a Promise
myPromise
  .then(value => console.log("Success:", value))
  .catch(error => console.log("Error:", error));
```

Type this. Change `success` to `false`. Run it again. See how `.catch` fires.

---

### async/await — the clean way

`async/await` doesn't change how Promises work. It just makes them easier to read:

```js
// Promise chain (works, but nests)
fetch("https://api.example.com/data")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.log("Error:", err));

// async/await (same thing, reads like normal code)
async function getData() {
  try {
    const res = await fetch("https://api.example.com/data");
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log("Error:", err);
  }
}
getData();
```

**`await` can only be used inside an `async` function.** Always wrap await in try/catch.

---

### How to see async output in the terminal

When you run async code with `node day-17-practice.js`, results appear in the order they finish — not the order they appear in your code. This surprises everyone.

Try this:
```js
async function demo() {
  console.log("start");
  await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second
  console.log("after 1 second");
}

demo();
console.log("this runs immediately!"); // this appears BEFORE "after 1 second"
```

Run it. The output order will teach you more than any explanation.

---

## Mid-Morning Break (11:00 – 11:20 AM)

Async code needs time to settle in your brain. Take a proper break.

---

## Midday (11:20 AM – 1:00 PM) — Exercises

### Exercise 1: `exercises/js-async/10-pizza-simulator.js`

**Pattern: State Machine / Async**

You're simulating a pizza delivery system. Each step takes time: order placed → preparing → out for delivery → delivered.

Promises make this feel real. You'll see async code execute in real-time with actual delays. This exercise is designed to make Promises fun and memorable — not abstract.

### Exercise 2: `exercises/js-async/11-parallel-race.js`

**Pattern: Parallel Execution**

This is the one that blows minds every time.

- **Sequential:** tasks run one after another → 6 seconds total
- **Parallel with `Promise.all`:** all tasks run at the same time → 2 seconds total

You'll time both approaches and see the difference. After this, you'll never accidentally write sequential async code when parallel is possible.

Key methods:
```js
// Run all in parallel — wait for ALL to finish
Promise.all([fetch(url1), fetch(url2), fetch(url3)])

// Run all in parallel — use whichever finishes FIRST
Promise.race([slowRequest, fastRequest])

// Like Promise.all but doesn't fail if one fails
Promise.allSettled([req1, req2, req3])
```

---

## Lunch (1:00 – 2:00 PM)

---

## Afternoon (2:00 – 4:00 PM) — DSA Practice

Open `dsa-bank/03-strings-easy.md`. Solve **problems 4, 5, 6, 7, and 8**.

Then try **1 medium string problem** from `dsa-bank/04-strings-medium.md`.

Write solutions in `day-17-dsa.js` in this folder.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- What is the difference between `Promise.all` and `Promise.race`?
- When would you use `async/await` vs `.then/.catch`?
- What was the most confusing part today?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 17: Async JS - pizza simulator + parallel race + 6 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Read `08-async.md` cheatsheet (twice!)
- [ ] Ran the setTimeout example — saw output order surprise
- [ ] Typed a Promise from scratch (new Promise, resolve, reject)
- [ ] Typed async/await with try/catch
- [ ] Completed `10-pizza-simulator.js`
- [ ] Completed `11-parallel-race.js`
- [ ] Saw sequential (slow) vs parallel (fast) with your own eyes
- [ ] Solved 6 DSA problems in `day-17-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference

```js
// Create a Promise
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done!"), 1000);
});

// Consume a Promise
p.then(val => console.log(val))
 .catch(err => console.error(err));

// async/await (always in try/catch)
async function main() {
  try {
    const val = await p;
    console.log(val);
  } catch (err) {
    console.error(err);
  }
}

// Parallel execution
const [a, b, c] = await Promise.all([fetch(url1), fetch(url2), fetch(url3)]);

// fetch pattern
async function getUser(id) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}
```

---

*Async will feel uncomfortable for 1-2 more days. That's normal. Everyone goes through it. Keep typing the examples.*
