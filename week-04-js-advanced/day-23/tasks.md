# Day 23 Tasks — Build Debounce, Throttle & Bind From Scratch

## Morning Block (8:00 – 11:00 AM)
- [ ] Create `day-23-implementations.js` in this folder
- [ ] Open `dsa-bank/10-js-specific-dsa.md` — find debounce, throttle, bind problems
- [ ] Build `debounce(fn, delay)` from scratch using setTimeout + clearTimeout
- [ ] Add `.cancel()` method to your debounce
- [ ] Test: call debounced fn 5 times quickly — only the last one should fire (after delay)
- [ ] Test `.cancel()`: call debounced fn, immediately cancel — confirm nothing fires
- [ ] Build `throttle(fn, interval)` from scratch — leading edge only first
- [ ] Add trailing edge option to throttle
- [ ] Test throttle: call rapidly for 3 seconds — confirm it fires at most once per interval
- [ ] Build `Function.prototype.myBind(context, ...args)` from scratch
- [ ] Test myBind: lock `this` to an object, pre-bind one argument, call with rest
- [ ] Compare: `greet.myBind(user, "Hello")("!")` === `greet.bind(user, "Hello")("!")`

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Create folder `day-23-search-app/` inside `day-23/`
- [ ] Create `index.html` with input, status, results list (use template from README)
- [ ] Create `app.js` — paste your debounce from morning at the top
- [ ] Implement `searchUsers(query)` with async/await + try/catch
- [ ] Use JSONPlaceholder API: `fetch("https://jsonplaceholder.typicode.com/users")`
- [ ] Filter results locally by name or email containing the query
- [ ] Display results in the `#results` list using `.map().join("")`
- [ ] Wire up `input` event with your `debouncedSearch`
- [ ] Show "Waiting..." on every keystroke, "Searching..." only when debounce fires
- [ ] Open with Live Server — test it works
- [ ] Count API calls in Network tab (F12 → Network) — confirm only 1 call per "session"

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-23-dsa.js` in this folder
- [ ] Open `dsa-bank/linked-lists.md`
- [ ] Solve Problem 1 — write Node class + LinkedList class first
- [ ] Solve Problem 2
- [ ] Solve Problem 3
- [ ] Open `dsa-bank/stacks.md`
- [ ] Solve Problem 1
- [ ] Solve Problem 2

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — debounce vs throttle examples, how myBind works, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 23: Debounce + throttle + bind from scratch + search app + 5 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Add a "Clear" button to the search app that also calls `debouncedSearch.cancel()`
- [ ] Show how many API calls were made (counter in the UI)
- [ ] Research: what is the difference between `call`, `apply`, and `bind`?
- [ ] Build `Function.prototype.myCall` and `Function.prototype.myApply` from scratch