# Day 16 — Objects + Destructuring + Spread/Rest

**Status:** 📋 READY TO START
**Week:** 3 | **Theme:** JavaScript Core

---

## What You'll Learn Today

Objects are how JavaScript organizes complex data. Today you master:

- **Objects** — creating, reading, updating, and iterating
- **Destructuring** — unpacking objects and arrays cleanly
- **Spread operator `...`** — copying and merging without mutating
- **Rest parameters `...`** — collecting remaining values
- **`Object.keys/values/entries`** — iterating over objects

These are not "nice to have" features. Destructuring and spread are used **in every single React component**. React state management *depends* on immutability (never mutating, always spreading). You can't do React without mastering today.

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/js/07-objects.md` — left panel
3. `exercises/js-es6/16-destructuring-detective.js` — midday
4. `exercises/js-es6/17-spread-knife.js` — midday

---

## Morning (8:00 – 11:00 AM) — Read + Type + Run

### Create your practice file

Create `day-16-practice.js` in this folder.

### Work through `cheatsheets/js/07-objects.md`

Type every example. Pay special attention to these three areas:

---

### 1. Destructuring (you'll use this 100x per day in React)

**Object destructuring:**
```js
const user = { name: "Dinesh", age: 25, city: "Chennai" };

// Old way (painful)
const name = user.name;
const age = user.age;

// Destructuring (clean)
const { name, age, city } = user;

// Rename while destructuring
const { name: userName, age: userAge } = user;

// Default values
const { name, country = "India" } = user; // country = "India" if undefined
```

**Array destructuring:**
```js
const colors = ["red", "green", "blue"];
const [first, second] = colors;  // first = "red", second = "green"
const [, , third] = colors;      // skip with comma: third = "blue"

// Swap variables (no temp variable needed!)
let a = 1, b = 2;
[a, b] = [b, a]; // a = 2, b = 1
```

Type ALL of these. Run them. The swap trick is worth a moment of appreciation.

**In function parameters (this is how React props work):**
```js
// Without destructuring
function greet(user) {
  return "Hello " + user.name;
}

// With destructuring — clean!
function greet({ name, age }) {
  return `Hello ${name}, you are ${age}`;
}
```

---

### 2. Spread Operator — the key to immutability

```js
// Copy an object (don't mutate the original!)
const original = { x: 1, y: 2 };
const copy = { ...original };        // new object, same values
const updated = { ...original, y: 99 }; // override y

// Merge two objects
const defaults = { theme: "light", lang: "en" };
const userPrefs = { lang: "ta" };
const merged = { ...defaults, ...userPrefs }; // { theme: "light", lang: "ta" }

// Spread arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
```

**Why this matters for React:** In React, you NEVER modify state directly. You always create a new object with your changes. Spread makes this clean and safe.

---

### 3. Object.keys / values / entries

```js
const scores = { alice: 95, bob: 87, carol: 92 };

Object.keys(scores)    // ["alice", "bob", "carol"]
Object.values(scores)  // [95, 87, 92]
Object.entries(scores) // [["alice", 95], ["bob", 87], ["carol", 92]]

// Use entries to loop with both key and value
Object.entries(scores).forEach(([name, score]) => {
  console.log(`${name}: ${score}`);
});
```

---

## Mid-Morning Break (11:00 – 11:20 AM)

Get up. Walk around.

---

## Midday (11:20 AM – 1:00 PM) — Exercises

### Exercise 1: `exercises/js-es6/16-destructuring-detective.js`

**Pattern: Transformation / Reshaping**

You're a detective. Your data comes in messy, inconsistent shapes (it always does in real APIs). Your job: destructure and reshape it into clean, consistent structures.

This exercise will make destructuring feel natural, not foreign.

### Exercise 2: `exercises/js-es6/17-spread-knife.js`

**Pattern: Immutability**

You're learning to use spread like a precise knife — cutting and combining data without ever touching the original. This is the immutability pattern that React is built on.

When the exercise asks you to update a nested object, the spread-inside-spread pattern will feel tricky at first. It clicks after you do it a few times.

---

## Lunch (1:00 – 2:00 PM)

Real break. Leave your desk.

---

## Afternoon (2:00 – 4:00 PM) — DSA Practice

Finish easy arrays: solve **problems 11-15** from `dsa-bank/01-arrays-easy.md`.

Then solve **strings-easy problems 1, 2, and 3** from `dsa-bank/03-strings-easy.md`.

Write solutions in `day-16-dsa.js` in this folder.

Total: 8 problems. That's your best DSA day yet.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- Can you explain the difference between `{ ...obj }` and `Object.assign()`?
- What surprised you about destructuring?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 16: Objects, destructuring, spread - 2 exercises + 7 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Read `07-objects.md` cheatsheet fully
- [ ] Typed destructuring examples (object, array, function params)
- [ ] Typed the variable swap trick `[a, b] = [b, a]`
- [ ] Typed spread for copying, merging, overriding
- [ ] Typed `Object.keys/values/entries` examples
- [ ] Completed `16-destructuring-detective.js`
- [ ] Completed `17-spread-knife.js`
- [ ] Solved 7+ DSA problems in `day-16-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference

```js
// Destructuring
const { a, b } = { a: 1, b: 2 };          // a=1, b=2
const { a: renamed } = { a: 1 };           // renamed=1
const { x = 10 } = {};                     // x=10 (default)
const [first, ...rest] = [1, 2, 3];        // first=1, rest=[2,3]

// Spread
const copy = { ...original };              // shallow copy
const merged = { ...obj1, ...obj2 };      // merge (obj2 wins on conflict)
const updated = { ...obj, key: "new" };   // update one key

// Object iteration
Object.keys(obj)                           // array of keys
Object.values(obj)                         // array of values
Object.entries(obj)                        // array of [key, value] pairs
Object.fromEntries(entries)               // array of pairs → object
```

---

*Destructuring and spread will feel wordy at first. After 2 weeks of React, you won't be able to live without them.*
