# Day 33 Tasks — Week 5 Review + Deploy React App + LinkedIn

## Morning Block (8:00 – 11:00 AM)
- [ ] Create `day-33-review.md` in `week-05-react-basics/day-33/`
- [ ] Skim `cheatsheets/react/01-react-basics.md` — 5 minutes max, no deep reading
- [ ] Skim `cheatsheets/react/02-useState.md` — 5 minutes
- [ ] Skim `cheatsheets/react/03-useEffect.md` — 5 minutes
- [ ] Skim `cheatsheets/react/04-useContext.md` — 5 minutes
- [ ] Answer Quiz Q1 in `day-33-review.md`: what does `<Button onClick={fn} />` compile to?
- [ ] Answer Quiz Q2: what is the difference between `isNew` and `isNew={true}` on a component?
- [ ] Answer Quiz Q3: why does calling `setCount` twice in a row not give +2? (state snapshot)
- [ ] Answer Quiz Q4: what happens without a `key` prop on list items?
- [ ] Answer Quiz Q5: what does `useEffect(fn, [])` do?
- [ ] Answer Quiz Q6: what does the return function inside `useEffect` do?
- [ ] Answer Quiz Q7: what is prop drilling? how does context fix it?
- [ ] Answer Quiz Q8: what is the `children` prop?
- [ ] Open your best app (Movie Search or Pokemon Cards)
- [ ] Search for and remove all `console.log` statements
- [ ] Remove unused imports (look at the top of each file)
- [ ] Remove any practice components that aren't part of the final app
- [ ] Open `index.html` → change `<title>` from "Vite + React" to your app name
- [ ] Open the app in browser — test every feature one more time

## Midday Block (11:20 AM – 1:30 PM)
- [ ] Commit: `git add . && git commit -m "Day 33: Clean up app for deployment" && git push origin main`
- [ ] Go to vercel.com → Add New Project → Import Git Repository
- [ ] Connect GitHub account if not already connected
- [ ] Find your `frontend-career` repo — click Import
- [ ] Set Root Directory to `week-05-react-basics/day-27/my-react-app`
- [ ] Confirm Build Command is `npm run build` and Output Directory is `dist`
- [ ] Click Deploy — wait for green checkmark
- [ ] Click "Visit" — confirm app loads and all features work on live URL
- [ ] Copy the live Vercel URL
- [ ] Stretch: add `VITE_OMDB_KEY` as Vercel environment variable and update code to use `import.meta.env.VITE_OMDB_KEY`

## Afternoon Block (2:30 – 4:00 PM)
- [ ] Write LinkedIn post (template in README) — include live URL + GitHub link
- [ ] Post it on LinkedIn — not just draft it
- [ ] Create `day-33-dsa.js` in `week-05-react-basics/day-33/`
- [ ] Open `dsa-bank/recursion.md`
- [ ] Solve Problem 6 — pattern + complexity
- [ ] Solve Problem 7 — pattern + complexity
- [ ] Solve Problem 8 — pattern + complexity

## Wrap Up (4:00 – 5:30 PM)
- [ ] Write "7 days ago vs now" journal entry in `journal.md` (template in README)
- [ ] Fill in: what you didn't know 7 days ago, what you can do now, what still feels fuzzy
- [ ] Complete Week 5 Self-Check (7 questions in README) — answer honestly
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 33: Week 5 complete - React app deployed!"`
- [ ] Run: `git push origin main`
- [ ] Paste live URL here: _______________

## Stretch Goals
- [ ] Add `VITE_OMDB_KEY` env variable to Vercel + update code to use `import.meta.env`
- [ ] Write a Hashnode blog post: "My First Week with React — What Actually Clicked"
- [ ] Add a `README.md` to your React project folder explaining what it is and the live link
- [ ] Look ahead: read the first section of `cheatsheets/react/05-react-router.md` if it exists
