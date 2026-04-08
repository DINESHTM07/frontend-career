# Day 21 Tasks — Advanced DOM + Keyboard Warrior Game

## Morning Block (8:00 – 11:00 AM)
- [ ] Create `day-21-practice.html` with the starter template from README
- [ ] Open with Live Server, open Console (F12 → Console tab)
- [ ] Re-read the observer sections in `cheatsheets/js/09-dom.md`
- [ ] Experiment 1: Intersection Observer — scroll down, watch element change color
- [ ] Change threshold to 0, then 1 — see how entry timing changes
- [ ] Experiment 2: MutationObserver — click the button, see console log fire
- [ ] Try: add a class to an element via JS while observing — does it fire?
- [ ] Experiment 3: ResizeObserver — drag the box corner, watch dimensions update
- [ ] Experiment 4: State Machine — test valid and invalid transitions
- [ ] Try an invalid transition — confirm it's blocked

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Open `exercises/js-dom/15-keyboard-warrior.html` with Live Server
- [ ] Read the INTRO — understand all game states (idle → countdown → playing → game_over)
- [ ] Complete GUIDED section — basic typing detection working
- [ ] Complete YOUR TURN — timer, scoring, word display
- [ ] Play the game once! See how fast you can type
- [ ] BOSS CHALLENGE: Add Easy / Medium / Hard difficulty selector
- [ ] Verify: difficulty selector is disabled during active game (state machine!)
- [ ] Test all 3 difficulty levels

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-21-dsa.js` in this folder
- [ ] Solve hashmaps Problem 6 (pattern + complexity)
- [ ] Solve hashmaps Problem 7
- [ ] Solve hashmaps Problem 8
- [ ] Solve hashmaps Problem 9
- [ ] Solve hashmaps Problem 10
- [ ] Attempt 1 medium array problem from `dsa-bank/02-arrays-medium.md`

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — 3 observers, state machine, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 21: Advanced DOM + Keyboard Warrior game + 6 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Add a leaderboard to Keyboard Warrior using localStorage (top 5 scores)
- [ ] Add visual feedback: flash the word red briefly on wrong letter
- [ ] Research: `requestAnimationFrame` — when is it better than setTimeout for animations?