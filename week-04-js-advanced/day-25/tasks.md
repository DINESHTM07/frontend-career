# Day 25 Tasks — DSA Intensive Day + Pattern Recognition Practice

## Morning Block (8:00 – 11:00 AM)
- [ ] Create `day-25-dsa.js` in this folder
- [ ] Open `dsa-bank/` folder and pick 10 problems across at least 3 categories
- [ ] Problem 1 — write pattern name + why as a comment BEFORE any code
- [ ] Problem 1 — solve it, write one "Takeaway:" line after
- [ ] Problem 2 — pattern first, then solve, then takeaway
- [ ] Problem 3 — pattern first, then solve, then takeaway
- [ ] Problem 4 — pattern first, then solve, then takeaway
- [ ] Problem 5 — pattern first, then solve, then takeaway
- [ ] Problem 6 — pattern first, then solve, then takeaway
- [ ] Problem 7 — pattern first, then solve, then takeaway
- [ ] Problem 8 — pattern first, then solve, then takeaway
- [ ] Problem 9 — pattern first, then solve, then takeaway
- [ ] Problem 10 — pattern first, then solve, then takeaway
- [ ] Review: did you name the pattern on EVERY problem before coding?

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Create `day-25-implementations.js` in this folder
- [ ] Open `dsa-bank/10-js-specific-dsa.md` — find curry, pipe, compose, LRU Cache, JSON.stringify
- [ ] Build `curry(fn)` — works with any argument count, any calling style
- [ ] Test curry: `curriedAdd(1)(2)(3)`, `curriedAdd(1,2)(3)`, `curriedAdd(1,2,3)` — all equal 6
- [ ] Build `pipe(...fns)` — applies functions left to right
- [ ] Build `compose(...fns)` — applies functions right to left (reuse pipe!)
- [ ] Test: `pipe(double, addTen, square)(3)` === `compose(square, addTen, double)(3)` === 256
- [ ] Build `LRUCache` class with `get(key)` and `put(key, value)`
- [ ] Test LRU: fill to capacity, access one item, add new → oldest unused is evicted
- [ ] Build `myStringify(value)` — handles null, string, number, boolean, array, object
- [ ] Test: output of `myStringify(obj)` matches `JSON.stringify(obj)` for a complex object
- [ ] Test edge case: `undefined` and function values are omitted from object, `null` in arrays

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-25-pattern-cheat.md` in this folder
- [ ] Write entry for: Hash Map / Frequency Counter
- [ ] Write entry for: Two Pointers
- [ ] Write entry for: Sliding Window
- [ ] Write entry for: Recursion / DFS
- [ ] Write entry for: Stack (Monotonic / Valid Brackets)
- [ ] Write entry for: State Machine
- [ ] Write entry for: Factory Pattern
- [ ] Write entry for: Observer / Pub-Sub / EventEmitter
- [ ] Write entry for: Debounce / Throttle
- [ ] Write entry for: Closure / Function Factory
- [ ] Write entry for: Memoization
- [ ] Each entry has: when to use, signal words, time/space tradeoff, mini example
- [ ] All entries written in YOUR own words (not copied definitions)

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — instinctive pattern now vs Day 1, still-confusing pattern, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 25: DSA intensive - 15 problems + 5 JS implementations + pattern cheat sheet"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Add `Promise.race` from scratch to your implementations
- [ ] Add `Promise.allSettled` from scratch
- [ ] Build `memoize(fn)` — cache return values by arguments
- [ ] Add 2 more pattern entries to `day-25-pattern-cheat.md` (Divide & Conquer, BFS)
