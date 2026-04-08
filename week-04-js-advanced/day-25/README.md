# Day 25 — DSA Intensive Day + Pattern Recognition Practice

**Status:** 📋 READY TO START
**Week:** 4 | **Theme:** JavaScript Advanced

---

## What You'll Learn Today

This is your consolidation day. No new syntax to learn — instead you're going wide and fast.

The goal: **pattern recognition speed**. In real interviews you have 20-30 minutes per problem. Most of that time is wasted on "wait, how do I approach this?" Today you train yourself to see the pattern immediately, name it, then solve it.

By end of day you'll have:
- Solved 15 DSA problems with explicit pattern naming
- Implemented 5 more classic JS functions from scratch (curry, pipe, compose, LRU Cache, JSON.stringify)
- Built a personal pattern cheat sheet you can review before every interview

---

## Files to Open Today

1. **This README** — read first
2. `dsa-bank/` folder — morning (10 mixed problems, your choice of categories)
3. `dsa-bank/10-js-specific-dsa.md` — midday (problems: curry, pipe, compose, LRU Cache, JSON.stringify)
4. New file: `day-25-pattern-cheat.md` — afternoon (you write this)

---

## Morning (8:00 – 11:00 AM) — 10 Problems, Pattern First

Create `day-25-dsa.js` in this folder.

Open the `dsa-bank/` folder and pick 10 problems from **at least 3 different categories** (arrays, hashmaps, linked lists, stacks, recursion, strings — your choice). Go for a mix of difficulty.

### The Rule: Name the Pattern Before You Code

For EVERY problem, write this comment block before a single line of solution:

```js
// ============================================================
// Problem: Two Sum
// Pattern: Hash Map — store seen values for O(1) complement lookup
// Why NOT brute force: O(n²) is too slow for large inputs
// Time: O(n) | Space: O(n)
// ============================================================
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }
}
```

**No pattern name = don't start coding.** Identify it first. This is the skill.

---

### Pattern Cheat Card (memorize these)

| You see... | Think... |
|-----------|---------|
| "Find pair that sums to X" | Hash Map |
| "Sliding window / subarray" | Two Pointers or Sliding Window |
| "Nested structure / tree" | Recursion or DFS |
| "Maximum/minimum of subarrays" | Stack (Monotonic) |
| "Next greater element" | Monotonic Stack |
| "Count occurrences" | Hash Map / Frequency Counter |
| "Is it valid / balanced?" | Stack |
| "Merge sorted arrays" | Two Pointers |
| "Shortest path" | BFS |
| "K-th largest" | Heap / Sort |

Before each problem, scan this table. Point to the pattern. Then code.

---

### Step 1 — Pick your 10 problems

Suggested spread:
- 3 problems from hashmaps or arrays (you've done most of these — go fast)
- 2 problems from linked lists or stacks (slower — take your time)
- 2 recursion problems
- 2 from any category you feel weakest on
- 1 free choice — anything that looks interesting

---

### Step 2 — Solve with a timer

Set a 15-minute timer per problem. Not because you must finish — because you need to feel the pressure.

If you finish early: revisit and optimize.
If time runs out: write what you know, explain the approach in a comment, then look at the solution.

Seeing the solution after an attempt is still learning. Copying the solution before attempting = no learning.

---

### Step 3 — After each solution, write one line

```js
// Takeaway: Hash Map turns O(n²) into O(n). Any "find pair" problem, reach for it first.
```

Ten problems, ten takeaways. These become your cheat sheet material.

---

## Mid-Morning Break (11:00 – 11:20 AM)

You just did 10 problems. That's real work. Step away.

---

## Midday (11:20 AM – 1:00 PM) — 5 Classic JS Implementations

Create `day-25-implementations.js` in this folder.

Open `dsa-bank/10-js-specific-dsa.md` and find the curry, pipe, compose, LRU Cache, and JSON.stringify problems.

---

### Build 1 — Curry

Curry transforms a function that takes multiple arguments into a chain of functions that each take one:

```js
function curry(fn) {
  return function curried(...args) {
    // If we have enough args, call the original function
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    // Otherwise, return a new function that collects more args
    return function(...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

// Test
function add(a, b, c) { return a + b + c; }

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3));   // 6
console.log(curriedAdd(1, 2)(3));   // 6
console.log(curriedAdd(1)(2, 3));   // 6
console.log(curriedAdd(1, 2, 3));   // 6 — all args at once still works
```

**Use case:** Pre-filling configuration. `const add5 = curriedAdd(5)` creates a reusable "add 5 to anything" function.

---

### Build 2 — Pipe and Compose

Pipe chains functions left-to-right. Compose chains them right-to-left.

```js
// Pipe: apply functions left to right: pipe(f, g, h)(x) = h(g(f(x)))
function pipe(...fns) {
  return function(value) {
    return fns.reduce((acc, fn) => fn(acc), value);
  };
}

// Compose: apply functions right to left: compose(f, g, h)(x) = f(g(h(x)))
function compose(...fns) {
  return pipe(...fns.reverse());
}

// Test
const double = x => x * 2;
const addTen = x => x + 10;
const square = x => x * x;

const transform = pipe(double, addTen, square);
console.log(transform(3));  // double(3)=6, addTen(6)=16, square(16)=256

const transform2 = compose(square, addTen, double);
console.log(transform2(3)); // same: 256
```

**Use case:** Data transformation pipelines. Every functional programming library (Ramda, Lodash/fp) is built on this.

---

### Build 3 — LRU Cache

LRU (Least Recently Used) Cache: stores up to N items. When full, evicts the item used least recently.

This is one of the most common medium/hard interview questions.

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Map preserves insertion order — key insight!
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key); // remove old position
    } else if (this.cache.size >= this.capacity) {
      // Evict the least recently used (first item in Map)
      const lruKey = this.cache.keys().next().value;
      this.cache.delete(lruKey);
    }
    this.cache.set(key, value); // add to end (most recently used)
  }
}

// Test
const cache = new LRUCache(3);
cache.put("a", 1);
cache.put("b", 2);
cache.put("c", 3);
cache.get("a");        // access a → a is now most recent
cache.put("d", 4);     // evicts b (least recently used)
console.log(cache.get("b")); // -1 (evicted!)
console.log(cache.get("a")); // 1 (still there)
```

**Key insight:** JavaScript's `Map` preserves insertion order. The FIRST key is always the LRU. This makes the implementation elegant — no doubly-linked list needed.

---

### Build 4 — `JSON.stringify` From Scratch

This tests deep understanding of data types and recursion:

```js
function myStringify(value) {
  // null
  if (value === null) return "null";

  // undefined, functions, symbols → omit in objects, convert to null in arrays
  if (value === undefined || typeof value === "function" || typeof value === "symbol") {
    return undefined; // caller handles this
  }

  // String — wrap in double quotes, escape special chars
  if (typeof value === "string") return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

  // Number and boolean
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  // Array
  if (Array.isArray(value)) {
    const items = value.map(item => myStringify(item) ?? "null");
    return `[${items.join(",")}]`;
  }

  // Object
  if (typeof value === "object") {
    const pairs = Object.keys(value)
      .map(key => {
        const serialized = myStringify(value[key]);
        if (serialized === undefined) return null; // skip functions/undefined
        return `"${key}":${serialized}`;
      })
      .filter(Boolean);
    return `{${pairs.join(",")}}`;
  }
}

// Test
const obj = {
  name: "Dinesh",
  age: 25,
  active: true,
  skills: ["JS", "CSS"],
  address: { city: "Chennai" },
  secret: undefined,      // omitted from output
  fn: () => "hello"       // omitted from output
};

console.log(myStringify(obj));
console.log(JSON.stringify(obj)); // should match!
```

---

## Lunch (1:00 – 2:00 PM)

---

## Afternoon (2:00 – 4:00 PM) — Build Your Pattern Cheat Sheet

Create `day-25-pattern-cheat.md` in this folder.

This is YOUR document. Write it in your own words. It should contain every pattern you've encountered over the past 5 days (and earlier in the course).

### Template for each pattern entry:

```
## Pattern Name: Hash Map / Frequency Counter

### When to reach for it:
- Finding pairs or complements
- Counting occurrences of elements
- Checking if an element was seen before
- Grouping elements by category

### Signal words in the problem:
"find a pair", "count how many", "group by", "anagram", "unique"

### Time/Space tradeoff:
- Brute force: O(n²) time, O(1) space
- Hash Map: O(n) time, O(n) space
- Trade space for time — almost always the right call

### Example problem:
Two Sum: find two numbers that add to target
→ Store each number in a Map. For each new number, check if (target - number) exists.

### Template:
const seen = new Map();
for (const [i, val] of nums.entries()) {
  if (seen.has(target - val)) return [seen.get(target - val), i];
  seen.set(val, i);
}
```

### Patterns to include (at minimum):

1. **Hash Map / Frequency Counter** — seen before, count occurrences
2. **Two Pointers** — sorted arrays, finding pairs, reversing
3. **Sliding Window** — subarray/substring problems, "longest/shortest X"
4. **Recursion / DFS** — nested structures, tree traversal
5. **Stack** — balanced brackets, next greater element, undo/redo
6. **State Machine** — games, multi-step flows, UI with strict rules
7. **Factory Pattern** — creating objects with consistent shape
8. **Observer / Pub-Sub** — event systems, reactive state
9. **Debounce / Throttle** — rate limiting user events
10. **Divide and Conquer** — binary search, merge sort
11. **Memoization** — repeated subproblems (dynamic programming lite)
12. **Closure** — private state, function factories, currying

---

### How to write each entry

Don't copy-paste definitions. Write what YOU would tell a friend who asked "when do I use this?" in a coffee-shop conversation.

If you can't explain it simply, you haven't understood it yet. Rewrite until it's simple.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- Which pattern do you reach for instinctively now (vs. Day 1)?
- Which pattern still confuses you — and what's the specific confusion?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 25: DSA intensive - 15 problems + 5 JS implementations + pattern cheat sheet"
git push origin main
```

---

## End of Day Checklist

- [ ] Solved 10 DSA problems in `day-25-dsa.js` — pattern name comment on EVERY one
- [ ] Named the pattern BEFORE writing the solution each time
- [ ] Wrote one "Takeaway" line per problem
- [ ] Built `curry` from scratch — tested all 4 call styles
- [ ] Built `pipe` and `compose` — tested with 3-function chain
- [ ] Built `LRU Cache` — tested eviction behavior
- [ ] Built `myStringify` — output matches `JSON.stringify` for test object
- [ ] Created `day-25-pattern-cheat.md` with at least 8 pattern entries
- [ ] Each pattern entry has: when to use, signal words, time/space, example
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference — The Big Patterns

```
SEE THIS → THINK THIS

Pair/complement needed?       → Hash Map
Sorted array, find pair?      → Two Pointers (start + end)
Longest/shortest subarray?    → Sliding Window
Nested / branching structure? → Recursion
Valid brackets / undo stack?  → Stack
Rate-limit user input?        → Debounce / Throttle
Repeated function creation?   → Closure / Factory
React to any event anywhere?  → Observer / EventEmitter
```

---

*Pattern recognition is what separates an engineer who "solves DSA sometimes" from one who consistently passes interviews. Today you trained that muscle.*
