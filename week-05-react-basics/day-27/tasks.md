# Day 27 Tasks — React Setup + JSX + Your First Component

## Setup Block (8:00 – 8:30 AM)
- [ ] Open Cursor terminal (`Ctrl + \``)
- [ ] Navigate: `cd week-05-react-basics/day-27`
- [ ] Run: `npm create vite@latest my-react-app -- --template react`
- [ ] Run: `cd my-react-app && npm install && npm run dev`
- [ ] Open http://localhost:5173 — confirm Vite + React spinning logo appears
- [ ] Delete: `src/App.css`, `src/index.css`, `src/assets/` folder, `src/App.jsx`
- [ ] Clean `src/main.jsx` — remove the CSS import line
- [ ] Create blank `src/App.jsx` that returns `<h1>Hello React!</h1>`
- [ ] Confirm browser shows "Hello React!" without errors

## Morning Block (8:30 – 11:00 AM)
- [ ] Read `cheatsheets/react/01-react-basics.md` — full read before coding
- [ ] Study the JSX rules table (className vs class, camelCase events, close all tags)
- [ ] Build `App.jsx` with `name`, `role`, `about` as variables — render them in JSX `{}`
- [ ] Confirm: style={{ }} double-curly syntax works — card appears with border
- [ ] Create `src/ProfileCard.jsx` — extract the card into its own component
- [ ] Accept `{ name, role, about, isNew }` as destructured props
- [ ] Import `ProfileCard` in `App.jsx`
- [ ] Render 3 `<ProfileCard />` instances with different prop values
- [ ] Add `isNew` conditional badge: `{isNew && <span>NEW</span>}` — renders only when prop is true
- [ ] Add `isNew` to one card — confirm badge appears on that card only
- [ ] Confirm all 3 cards display with correct content in browser

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Read `cheatsheets/react/02-useState.md` — full read before exercise
- [ ] Open `exercises/react-basics/20-mood-tracker.jsx`
- [ ] Create `src/MoodTracker.jsx` — copy/work through exercise content here
- [ ] Import `MoodTracker` in `App.jsx` — render it above the team cards
- [ ] Complete GUIDED section — mood selection state working
- [ ] Complete YOUR TURN — history/accumulation working
- [ ] Play with it: click moods, see history accumulate, confirm state updates work
- [ ] Confirm: page shows MoodTracker + 3 ProfileCards together

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-27-dsa.js` in `week-05-react-basics/day-27/` (not inside React project)
- [ ] Open `dsa-bank/02-arrays-medium.md`
- [ ] Solve Problem 1 — pattern comment + complexity before writing code
- [ ] Solve Problem 2 — pattern comment + complexity
- [ ] Solve Problem 3 — pattern comment + complexity

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — explain JSX in one sentence, prop vs variable distinction, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 27: First React app + ProfileCard + mood tracker + 3 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Add an `avatar` prop to `ProfileCard` that shows an emoji or image URL
- [ ] Create a `src/Badge.jsx` component and use it inside ProfileCard
- [ ] Research: what does React.StrictMode do and why does it render components twice in development?
