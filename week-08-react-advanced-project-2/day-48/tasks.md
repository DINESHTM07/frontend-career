# Day 48 Tasks — React.memo + useMemo + useCallback

## Morning Block (8:00 – 11:00 AM) — Read Cheatsheets
- [ ] Open `cheatsheets/react/06-useMemo-useCallback.md` — read fully
- [ ] Open `cheatsheets/react/12-performance.md` — read fully
- [ ] Write down in your own words: what is the difference between `useMemo` and `useCallback`?
- [ ] Write down: when should you NOT use these tools?

## Midday Block (11:20 AM – 1:30 PM) — Build the Demo
- [ ] Create a new Vite project or scratch file for the demo
- [ ] Build `ParentComponent` with count state and text input
- [ ] Build `ChildComponent` with `console.log('🔴 ChildComponent rendered')` in it
- [ ] Verify: typing in the input causes the child to log every keypress (the problem is visible)
- [ ] Wrap `ChildComponent` export with `React.memo`
- [ ] Add `useCallback` to `handleChildAction` in the parent
- [ ] Add `useMemo` to `expensiveList` in the parent
- [ ] Verify: typing in the input no longer triggers the child log (problem solved)
- [ ] Add the slow loop (`1_000_000` iterations) wrapped in `useMemo`
- [ ] Verify: typing in input does NOT trigger "Computing expensive sum..." log
- [ ] Verify: clicking "Change Multiplier" DOES trigger "Computing expensive sum..." log
- [ ] Can explain to yourself: why does `React.memo` alone not work without `useCallback`?

## Afternoon Block (1:30 – 3:00 PM) — DSA + Read Ahead
- [ ] Create `day-48-dsa.js` in `week-08-react-advanced-project-2/day-48/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment
- [ ] Read `cheatsheets/react/13-error-boundaries.md` (needed for Day 50)

## Wrap Up
- [ ] Run: `git add . && git commit -m "Day 48: React.memo useMemo useCallback demo + DSA"`
- [ ] Write one journal sentence: when would you actually reach for these tools?
