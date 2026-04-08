# Day 22 — Build Array Methods From Scratch

**Status:** 📋 READY TO START
**Week:** 4 | **Theme:** JavaScript Advanced

---

## What You'll Learn Today

You've been USING `map`, `filter`, `reduce` since Day 15. Today you BUILD them.

This is one of the most important exercises for interviews. "Can you implement `Array.prototype.map` from scratch?" is asked constantly at mid-to-senior level interviews — and most people can't do it.

By building the internals, you'll understand:
- How these methods actually work under the hood
- Why they don't mutate the original array
- How the callback signature works (`value, index, array`)
- Why `reduce` can implement every other array method

This understanding makes you a significantly better developer.

---

## Files to Open Today

1. **This README** — read first
2. `exercises/js-arrays/09-build-array-methods.js` — this is the main focus, morning + midday
3. `dsa-bank/10-js-specific-dsa.md` — afternoon (problems 1-5)

---

## Morning (8:00 – 11:00 AM) — Build myMap, myFilter, myReduce

Open `exercises/js-arrays/09-build-array-methods.js`.

This is THE most important exercise for interviews. Take your time. No rushing.

### Step 1 — Read the INTRO section

Before writing any code, read the INTRO. It explains:
- How `Array.prototype` works (every array inherits these methods)
- The callback signature: `(currentValue, index, array)`
- Why you use `this` inside the implementation

### Step 2 — Build `myMap`

```js
// HOW IT SHOULD WORK:
// [1, 2, 3].myMap(x => x * 2)  →  [2, 4, 6]

Array.prototype.myMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));  // value, index, original array
  }
  return result;
};

// Test it
const doubled = [1, 2, 3].myMap(x => x * 2);
console.log(doubled); // [2, 4, 6]

// Compare with built-in — should be identical
console.log([1, 2, 3].map(x => x * 2)); // [2, 4, 6] ✓
```

**Key insight:** `this` refers to the array that `.myMap()` is called on. The `function` keyword (not arrow) is required here — arrow functions don't have their own `this`.

### Step 3 — Build `myFilter`

```js
// HOW IT SHOULD WORK:
// [1, 2, 3, 4].myFilter(x => x % 2 === 0)  →  [2, 4]

Array.prototype.myFilter = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {   // only include if callback returns truthy
      result.push(this[i]);
    }
  }
  return result;
};

// Test
console.log([1, 2, 3, 4].myFilter(x => x % 2 === 0)); // [2, 4]
```

### Step 4 — Build `myReduce`

This is the hard one. Reduce is the most powerful — every other method can be implemented using reduce.

```js
// HOW IT SHOULD WORK:
// [1, 2, 3].myReduce((acc, val) => acc + val, 0)  →  6

Array.prototype.myReduce = function(callback, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;

  // If no initialValue, use first element as accumulator
  if (accumulator === undefined) {
    accumulator = this[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }
  return accumulator;
};

// Test
console.log([1, 2, 3].myReduce((acc, val) => acc + val, 0)); // 6
console.log([1, 2, 3].myReduce((acc, val) => acc + val));    // 6 (no initial value)
```

**Mind-bending bonus:** Can you implement `myMap` using your `myReduce`?
```js
Array.prototype.myMap2 = function(callback) {
  return this.myReduce((acc, val, i, arr) => {
    acc.push(callback(val, i, arr));
    return acc;
  }, []);
};
```

Yes — reduce is that powerful.

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:00 PM) — Build myFind, myEvery, myFlat

Continue with the YOUR TURN section of `09-build-array-methods.js`.

### Build `myFind`

```js
// Returns the FIRST element that passes the test, or undefined
Array.prototype.myFind = function(callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      return this[i];  // return immediately on first match
    }
  }
  return undefined;
};
```

### Build `myEvery`

```js
// Returns true if ALL elements pass the test
Array.prototype.myEvery = function(callback) {
  for (let i = 0; i < this.length; i++) {
    if (!callback(this[i], i, this)) {
      return false;    // short-circuit: fail fast
    }
  }
  return true;
};
```

### Build `myFlat` (trickiest one — uses recursion)

```js
// Flatten nested arrays to given depth
Array.prototype.myFlat = function(depth = 1) {
  const result = [];

  function flatten(arr, currentDepth) {
    for (const item of arr) {
      if (Array.isArray(item) && currentDepth > 0) {
        flatten(item, currentDepth - 1);  // recurse
      } else {
        result.push(item);
      }
    }
  }

  flatten(this, depth);
  return result;
};

// Test
console.log([1, [2, [3, [4]]]].myFlat());         // [1, 2, [3, [4]]] — depth 1
console.log([1, [2, [3, [4]]]].myFlat(2));         // [1, 2, 3, [4]] — depth 2
console.log([1, [2, [3, [4]]]].myFlat(Infinity));  // [1, 2, 3, 4] — fully flat
```

### BOSS CHALLENGE

Can you implement `myMap` and `myFilter` using only `myReduce`? (No for loops allowed.)

---

## Lunch (1:00 – 2:00 PM)

---

## Afternoon (2:00 – 4:00 PM) — JS-Specific DSA

Open `dsa-bank/10-js-specific-dsa.md`. Solve **problems 1 through 5**.

These problems ask you to implement things like `map`, `filter`, `reduce`, `flat`, `find` — but with edge cases and custom behavior. Compare your solutions with the provided answers.

Write solutions in `day-22-dsa.js` in this folder.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- Explain in one sentence how `myMap` works internally
- Why does `myReduce` need an `initialValue` parameter?
- What was the hardest method to implement?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 22: Built array methods from scratch + 5 JS implementation DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Built `myMap` — tested against native `.map()` (same output)
- [ ] Built `myFilter` — tested against native `.filter()` (same output)
- [ ] Built `myReduce` — tested with and without initial value
- [ ] Implemented `myMap` using `myReduce` (BOSS)
- [ ] Built `myFind` from scratch
- [ ] Built `myEvery` from scratch
- [ ] Built `myFlat` from scratch (with recursion)
- [ ] Tested each implementation with edge cases (empty array, no initial value)
- [ ] Solved 5 JS-specific DSA problems in `day-22-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference — What You Built

```js
// myMap: transform each element, return new array of same length
Array.prototype.myMap = function(cb) {
  const result = [];
  for (let i = 0; i < this.length; i++) result.push(cb(this[i], i, this));
  return result;
};

// myFilter: keep elements where callback returns truthy
Array.prototype.myFilter = function(cb) {
  const result = [];
  for (let i = 0; i < this.length; i++) if (cb(this[i], i, this)) result.push(this[i]);
  return result;
};

// myReduce: fold array into single value
Array.prototype.myReduce = function(cb, init) {
  let acc = init ?? this[0];
  const start = init === undefined ? 1 : 0;
  for (let i = start; i < this.length; i++) acc = cb(acc, this[i], i, this);
  return acc;
};
```

---

*"I can implement map from scratch" is a sentence that very few frontend developers can honestly say. You can now.*
