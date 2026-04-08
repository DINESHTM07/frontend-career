# Day 14 — Functions, Closures & Scope

**Status:** 📋 READY TO START
**Week:** 3 | **Theme:** JavaScript Core

---

## What You'll Learn Today

Functions are the single most important concept in JavaScript. Today you go deep:

- **Arrow functions vs regular functions** — they behave differently with `this`
- **Closures** — a function that "remembers" the variables around it even after that outer function finishes
- **Scope** — where variables can be seen and accessed
- **Hoisting** — why some code works even when called "before" it's defined
- **`this` binding** — one of the most confusing JS topics, made simple

By end of day, closures will click for you. The `04-secret-diary.js` exercise is legendary for making this happen.

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/js/05-functions.md` — left panel, right panel = your practice file
3. `exercises/js-functions/04-secret-diary.js` — midday
4. `exercises/js-functions/05-function-restaurant.js` — midday

---

## Morning (8:00 – 11:00 AM) — Read + Type + Experiment

### Create your practice file

Create `day-14-practice.js` in this folder (right-click `day-14` in sidebar → New File).

### Work through `cheatsheets/js/05-functions.md`

For every single example:
1. **Type it** in `day-14-practice.js` — no copy-paste
2. Run it: `node day-14-practice.js`
3. Read the output
4. Modify something and run again

### Pay special attention to these sections:

**Arrow functions vs regular functions:**
```js
// Regular function
function greet(name) {
  return "Hello " + name;
}

// Arrow function — shorter, BUT different 'this' behavior
const greet = (name) => "Hello " + name;
```

Type both. Call both. Are the outputs the same? Yes. But inside a class or object method, they're very different — you'll see why in the restaurant exercise.

**Closures — read this twice:**

A closure is when a function "closes over" variables from its surrounding scope. Even when the outer function finishes, the inner function still has access.

```js
function makeCounter() {
  let count = 0;             // this variable lives on!
  return function() {
    count++;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3  ← count is still alive!
```

TYPE THIS. Run it. Add `console.log(count)` outside — notice you can't access `count` from outside. That's the magic.

**Hoisting:**
```js
sayHi(); // works! because function declarations are hoisted

function sayHi() {
  console.log("Hi!");
}

// But this does NOT work:
sayHello(); // Error! arrow functions are NOT hoisted

const sayHello = () => console.log("Hello!");
```

---

## Mid-Morning Break (11:00 – 11:20 AM)

Walk away. Drink water. Let your brain process.

---

## Midday (11:20 AM – 1:00 PM) — Exercises

### Exercise 1: `exercises/js-functions/04-secret-diary.js`

**Pattern: Encapsulation with Closures**

This exercise will make closures click forever. You'll build a secret diary where the data is completely private — nobody can read or change it without going through your functions.

The key insight: the diary data lives inside a closure. It's not a global variable. It can't be accessed directly. This is exactly how real apps protect their state.

Work through INTRO → GUIDED → YOUR TURN → BOSS CHALLENGE in order.

### Exercise 2: `exercises/js-functions/05-function-restaurant.js`

**Pattern: `this` Binding**

This exercise shows you why `this` behaves differently in arrow functions vs regular functions. You're building a restaurant order system.

When you see `this` referring to the wrong thing — that's the bug this exercise teaches you to spot and fix.

---

## Lunch (1:00 – 2:00 PM)

Real break. No screens.

---

## Afternoon (2:00 – 4:00 PM) — DSA Practice

Open `dsa-bank/01-arrays-easy.md`. Solve **problems 4, 5, and 6**.

Also solve **1 problem from `dsa-bank/03-strings-easy.md`** (problem 1).

Write solutions in `day-14-dsa.js` in this folder.

### Pattern Recognition Practice

Before coding each problem, write a comment:
```js
// Problem: [name]
// Pattern: [two pointers / sliding window / frequency count / etc.]
// Plan: [your approach in 1-2 sentences]
```

Recognizing the PATTERN before coding is what separates people who solve problems in 5 minutes from those who struggle for an hour.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- Can you explain closures in your own words, without looking at notes?
- What surprised you about `this`?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 14: Functions, closures, scope - Secret Diary + 4 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Read `05-functions.md` cheatsheet fully
- [ ] Typed 10+ examples in `day-14-practice.js`
- [ ] Made the counter closure example and saw it work
- [ ] Completed `04-secret-diary.js` (all sections)
- [ ] Completed `05-function-restaurant.js` (all sections)
- [ ] Solved 4 DSA problems in `day-14-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference

```js
// Closure pattern — the most important pattern in JS
function createPrivateCounter() {
  let count = 0;                    // private — nobody outside can touch this
  return {
    increment() { count++; },
    getCount() { return count; }
  };
}

// Arrow vs regular — THIS is the difference
const obj = {
  name: "Dinesh",
  regularFn: function() { return this.name; },   // "Dinesh" ✓
  arrowFn: () => { return this.name; }           // undefined ✗ (arrow has no own 'this')
};

// Hoisting
hoisted();       // ✓ works
// notHoisted(); // ✗ ReferenceError

function hoisted() { console.log("I'm hoisted!"); }
const notHoisted = () => console.log("I'm NOT hoisted");
```

---

*Closures will feel abstract today. That's normal. The Secret Diary exercise is designed to make them concrete. Trust the process.*
