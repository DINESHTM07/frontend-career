# Day 20 Tasks — Event Loop Deep Dive + Advanced Async Patterns

## Morning Block (8:00 – 11:00 AM)
- [ ] Create `day-20-eventloop.js` in this folder
- [ ] Re-read the Event Loop section in `cheatsheets/js/08-async.md`
- [ ] Write down in a comment: synchronous → microtasks → macrotask order
- [ ] Experiment 1: Type the setTimeout vs Promise.resolve example
- [ ] Write your predicted output as a comment BEFORE running
- [ ] Run: `node day-20-eventloop.js` — was your guess correct?
- [ ] Experiment 2: Type the recursive microtask example — see all 5 run before setTimeout
- [ ] Experiment 3: Type the async/await = Promise sugar example — predict where "B" appears
- [ ] Experiment 4: Type the unhandled rejection — read the Node warning
- [ ] Fix the unhandled rejection with `.catch()` and with `try/catch`
- [ ] Bonus: `queueMicrotask` experiment — confirm it runs before setTimeout

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Open `exercises/js-async/12-async-errors.js`
- [ ] Read the INTRO — understand each broken scenario before starting
- [ ] Fix scenario 1 — add comment explaining the bug and fix
- [ ] Fix scenario 2 — add comment explaining the bug and fix
- [ ] Fix scenario 3 — add comment explaining the bug and fix
- [ ] Fix scenario 4 — add comment explaining the bug and fix
- [ ] Fix scenario 5 — add comment explaining the bug and fix
- [ ] Fix scenarios 6–10 — comment each one
- [ ] Run all 10 after fixing — confirm zero errors or unhandled rejections

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-20-dsa.js` in this folder
- [ ] Open `dsa-bank/hashmaps.md`
- [ ] Solve Problem 1 — pattern + time/space complexity comment
- [ ] Solve Problem 2 — pattern + time/space complexity comment
- [ ] Solve Problem 3 — pattern + time/space complexity comment
- [ ] Solve Problem 4 — pattern + time/space complexity comment
- [ ] Solve Problem 5 — pattern + time/space complexity comment

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — microtask vs macrotask, hardest async bug, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 20: Event loop mastery + async error fixing + 5 hashmap DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Research: what is `process.nextTick` in Node.js — is it a microtask or macrotask?
- [ ] Research: what happens if a microtask throws an uncaught error?
- [ ] Build a simple task queue that processes items one at a time using Promises