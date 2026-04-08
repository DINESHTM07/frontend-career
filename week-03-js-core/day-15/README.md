# Day 15 — Arrays Deep Dive (map, filter, reduce & friends)

**Status:** 📋 READY TO START
**Week:** 3 | **Theme:** JavaScript Core

---

## What You'll Learn Today

Arrays are everywhere. Every list of products, every feed of posts, every table of data — it's all arrays. Today you master the three most important array methods:

- **`map`** — transform each item into something new (same length, different shape)
- **`filter`** — keep only items that pass a test (same shape, fewer items)
- **`reduce`** — combine all items into a single value (one output from many)

Plus: `find`, `findIndex`, `some`, `every`, `flat`, `flatMap`, `sort`, method chaining.

These three methods are used in **every React component** you will ever write. This is not optional knowledge — this is daily bread.

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/js/06-arrays.md` — left panel (most important cheatsheet of the week)
3. `exercises/js-arrays/07-array-gym.js` — midday
4. `exercises/js-arrays/08-report-card.js` — midday
5. `dsa-bank/01-arrays-easy.md` — afternoon

---

## Morning (8:00 – 11:00 AM) — Read + Type + Run

### Create your practice file

Create `day-15-practice.js` in this folder.

### Work through `cheatsheets/js/06-arrays.md`

This is the most important cheatsheet of week 3. Treat it with respect. For every example:

1. **Type it yourself** — no copy-paste
2. `node day-15-practice.js` — run and see output
3. Modify the data and run again
4. Try to break it, then fix it

### The Big Three — understand the mental model:

**`map` = transform**
```js
const prices = [10, 20, 30];
const withTax = prices.map(price => price * 1.18);
// [11.8, 23.6, 35.4]
// Input: 3 items → Output: 3 items (same count, different values)
```

**`filter` = select**
```js
const prices = [10, 20, 30, 40, 50];
const affordable = prices.filter(price => price < 35);
// [10, 20, 30]
// Input: 5 items → Output: 3 items (fewer items, same shape)
```

**`reduce` = combine**
```js
const prices = [10, 20, 30];
const total = prices.reduce((sum, price) => sum + price, 0);
// 60
// Input: 3 items → Output: 1 value (many → one)
```

Type all three. Run them. Now try chaining:
```js
const prices = [10, 20, 30, 40, 50];
const taxedAffordableTotal = prices
  .filter(price => price < 35)    // [10, 20, 30]
  .map(price => price * 1.18)     // [11.8, 23.6, 35.4]
  .reduce((sum, p) => sum + p, 0); // 70.8
```

This is **method chaining**. It's elegant, readable, and used everywhere.

### Other methods to practice:

```js
const users = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 17, active: false },
  { name: "Carol", age: 30, active: true }
];

// find — returns first match (or undefined)
users.find(u => u.age > 20);           // { name: "Alice", ... }

// findIndex — returns index of first match (or -1)
users.findIndex(u => u.name === "Bob"); // 1

// some — is ANY item truthy?
users.some(u => u.age < 18);           // true

// every — are ALL items truthy?
users.every(u => u.active);            // false
```

---

## Mid-Morning Break (11:00 – 11:20 AM)

Step away. Your brain needs a moment to absorb this.

---

## Midday (11:20 AM – 1:00 PM) — Exercises

### Exercise 1: `exercises/js-arrays/07-array-gym.js`

**Pattern: Transformation + Filtering + Accumulation**

You're working out each array method like muscles at a gym. Each "station" focuses on one method. Don't skip stations.

The BOSS CHALLENGE will ask you to combine all three in one chain. That's the real workout.

### Exercise 2: `exercises/js-arrays/08-report-card.js`

**Pattern: Method Chaining**

You're building a student report card system. Real data, real transformations. The entire exercise uses method chaining — you'll chain `.filter().map().sort()` in ways that feel natural by the end.

**Extra Challenge from the prompt:**
> Can you solve problem 8 using ONLY method chaining — `map.filter.reduce` in one line?

Try it. It's possible. It's satisfying when you get it.

---

## Lunch (1:00 – 2:00 PM)

Real break.

---

## Afternoon (2:00 – 4:00 PM) — DSA Practice

Open `dsa-bank/01-arrays-easy.md`. Solve **problems 7, 8, 9, and 10** (finishing easy arrays!).

Write solutions in `day-15-dsa.js` in this folder.

### For every solution, write this comment format:

```js
// Problem 7: [name]
// Pattern used: [two pointers / sliding window / frequency count / hash map / etc.]
// Time: O(n) | Space: O(1)
```

Writing the pattern and complexity forces you to *think* about what you're doing, not just hack until it works.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- In your own words: what is the difference between `map`, `filter`, and `reduce`?
- Which one feels most confusing still?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 15: Arrays mastery - gym + report card + 4 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Read `06-arrays.md` cheatsheet fully
- [ ] Typed map, filter, reduce examples and saw them work
- [ ] Typed method chaining example (filter → map → reduce)
- [ ] Completed `07-array-gym.js` (all sections including BOSS)
- [ ] Completed `08-report-card.js` (all sections)
- [ ] Solved 4 DSA problems (7-10) in `day-15-dsa.js`
- [ ] Labeled the pattern used for each DSA solution
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference

```js
const data = [1, 2, 3, 4, 5];

// map — transform (same length)
data.map(x => x * 2)          // [2, 4, 6, 8, 10]

// filter — select (shorter or equal length)
data.filter(x => x % 2 === 0) // [2, 4]

// reduce — combine (single value)
data.reduce((acc, x) => acc + x, 0) // 15

// Chain them
data
  .filter(x => x > 2)         // [3, 4, 5]
  .map(x => x * 10)           // [30, 40, 50]
  .reduce((a, b) => a + b, 0) // 120

// Useful extras
data.find(x => x > 3)         // 4 (first match)
data.some(x => x > 4)         // true (any?)
data.every(x => x > 0)        // true (all?)
[1, [2, [3]]].flat()          // [1, 2, [3]]
[1, [2, [3]]].flat(Infinity)  // [1, 2, 3]
```

---

*`map`, `filter`, `reduce` will feel awkward at first. By the end of this week they'll feel like your hands.*
