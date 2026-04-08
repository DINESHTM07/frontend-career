# Day 24 Tasks — Promise.all, Event Emitter & Deep Clone From Scratch

## Morning Block (8:00 – 11:00 AM)
- [ ] Create `day-24-implementations.js` in this folder
- [ ] Open `dsa-bank/10-js-specific-dsa.md` — find Promise.all, event emitter, deep clone

### Promise.all
- [ ] Build `myPromiseAll(promises)` — collect results at original index
- [ ] Test: all 3 Promises resolve → get [1, 2, 3]
- [ ] Test: one rejects → entire thing rejects
- [ ] Test empty array: `myPromiseAll([])` → resolves with `[]`
- [ ] Time test: confirm 3 parallel 1s delays take ~1s total (not 3s)

### Event Emitter
- [ ] Build `EventEmitter` class with `events = {}` map
- [ ] Implement `.on(event, listener)` — push to listeners array
- [ ] Implement `.off(event, listener)` — filter out the listener
- [ ] Implement `.emit(event, ...args)` — call all listeners
- [ ] Implement `.once(event, listener)` — wrapper that auto-removes itself
- [ ] Test `.once()`: fire event twice — confirm listener fires only once
- [ ] Test `.off()`: remove a listener, fire event — confirm it's gone
- [ ] Test chaining: `emitter.on("a", fn1).on("b", fn2)`

### Deep Clone
- [ ] Build `deepClone(value)` handling: null/primitives, Date, Array, plain object
- [ ] Test: clone nested object, mutate clone, confirm original unchanged
- [ ] Test: clone array of objects, mutate clone, confirm original unchanged
- [ ] Test: clone object with Date, mutate date, confirm original unchanged
- [ ] Compare: show `{ ...shallow }.nested === original.nested` is true (same reference)
- [ ] Show: `deepClone(original).nested === original.nested` is false (different reference)

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Create folder `day-24-notification-system/` inside `day-24/`
- [ ] Create `index.html` with notification container + 4 trigger buttons
- [ ] Create `app.js` — paste EventEmitter from morning
- [ ] Implement `displayNotification({ type, message, duration })` using DOM
- [ ] Subscribe `displayNotification` to the `notify` event
- [ ] Add a second subscriber that logs to console
- [ ] Add a `.once()` subscriber for "first notification ever"
- [ ] Implement 4 trigger functions (success, error, info, warning)
- [ ] Open with Live Server — click all 4 buttons, see notifications appear
- [ ] Check console — confirm both subscribers fire independently
- [ ] Confirm the `.once()` subscriber only fires on the very first click

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-24-dsa.js` in this folder
- [ ] Open `dsa-bank/recursion.md`
- [ ] Solve Problem 1 — write base case and recursive case in comment first
- [ ] Solve Problem 2 — same approach
- [ ] Solve Problem 3
- [ ] Solve Problem 4
- [ ] Solve Problem 5

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — Promise.all ordering, pub/sub pattern, deep vs shallow, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 24: Promise.all + event emitter + deep clone + notification system + 5 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Add `removeAllListeners(event)` method to your EventEmitter
- [ ] Add max listeners warning (Node.js does this when you add >10 listeners to one event)
- [ ] Add notification dismiss button (click X to remove immediately)
- [ ] Research: how does React's `useState` + `useEffect` use pub/sub internally?