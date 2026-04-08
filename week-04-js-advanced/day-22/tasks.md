# Day 22 Tasks — Build Array Methods From Scratch

## Morning Block (8:00 – 11:00 AM)
- [ ] Open `exercises/js-arrays/09-build-array-methods.js`
- [ ] Read the INTRO — understand how Array.prototype works
- [ ] Understand the callback signature: (value, index, originalArray)
- [ ] Build `myMap` using `Array.prototype.myMap = function(callback) {...}`
- [ ] Test: `[1,2,3].myMap(x => x * 2)` should equal `[2, 4, 6]`
- [ ] Compare with native `.map()` — outputs must be identical
- [ ] Build `myFilter` from scratch
- [ ] Test with even number filter — compare with native `.filter()`
- [ ] Build `myReduce` from scratch (hardest one — handle missing initialValue)
- [ ] Test with sum — with initial value 0 AND without initial value
- [ ] BOSS: Implement `myMap` using only your `myReduce` (no for loop)

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Build `myFind` — returns first matching element or undefined
- [ ] Test: `[1,2,3].myFind(x => x > 1)` should return `2`
- [ ] Build `myEvery` — returns true only if ALL elements pass
- [ ] Test: `[2,4,6].myEvery(x => x % 2 === 0)` should return `true`
- [ ] Test: `[2,3,6].myEvery(x => x % 2 === 0)` should return `false`
- [ ] Build `myFlat` — flatten nested arrays to given depth using recursion
- [ ] Test: `[1,[2,[3]]].myFlat()` → `[1,2,[3]]`
- [ ] Test: `[1,[2,[3]]].myFlat(Infinity)` → `[1,2,3]`
- [ ] BOSS CHALLENGE: Implement `myFilter` using only `myReduce`

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-22-dsa.js` in this folder
- [ ] Open `dsa-bank/10-js-specific-dsa.md`
- [ ] Solve Problem 1 (array method implementation with edge cases)
- [ ] Solve Problem 2
- [ ] Solve Problem 3
- [ ] Solve Problem 4
- [ ] Solve Problem 5
- [ ] Compare your solutions to the provided answers — note differences

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — how myMap works, why myReduce needs initialValue, hardest method
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 22: Built array methods from scratch + 5 JS implementation DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Build `mySome` from scratch (returns true if ANY element passes)
- [ ] Build `myFlatMap` from scratch (map + flatten by 1 level)
- [ ] Build `mySort` from scratch using bubble sort or merge sort
- [ ] Research: why must `Array.prototype.myX` use `function` keyword, not arrow?