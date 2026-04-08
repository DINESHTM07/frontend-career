# Day 40 Tasks — Week 6 Review + Polish + Deploy

## Morning Block (8:00 – 11:00 AM)
- [ ] Create `day-40-review.md` in `week-06-react-intermediate/day-40/`
- [ ] Skim `cheatsheets/react/09-react-router.md` — 5 minutes
- [ ] Skim `cheatsheets/react/10-forms.md` — 5 minutes
- [ ] Skim `cheatsheets/react/05-useReducer.md` — 5 minutes
- [ ] Skim `cheatsheets/react/08-custom-hooks.md` — 5 minutes
- [ ] Skim `cheatsheets/react/11-state-management.md` — 5 minutes
- [ ] Skim `cheatsheets/advanced/03-tailwind.md` — 5 minutes
- [ ] Answer Quiz Q1–Q3 (React Router) in review file — no notes
- [ ] Answer Quiz Q4–Q5 (React Hook Form)
- [ ] Answer Quiz Q6–Q7 (useReducer)
- [ ] Answer Quiz Q8–Q9 (Custom Hooks)
- [ ] Answer Quiz Q10–Q11 (Zustand)
- [ ] Answer Quiz Q12–Q13 (React Query)
- [ ] Answer Quiz Q14–Q15 (Tailwind)
- [ ] Mark which answers you had to look up — those are your weak spots
- [ ] Pick your best app (Movie Search / Budget Tracker / Cart)
- [ ] Remove all `console.log` statements (search with Ctrl+Shift+F)
- [ ] Remove all commented-out dead code
- [ ] Remove unused imports from every file
- [ ] Check file structure: `pages/`, `components/`, `hooks/`, `stores/` all organized
- [ ] `index.html` title updated from "Vite + React" to your app's real name
- [ ] Click every nav link — confirm no broken routes or blank pages
- [ ] Resize browser to 375px width — confirm mobile layout looks good
- [ ] Confirm no inline `style={{ }}` objects remain (everything in Tailwind)
- [ ] Confirm favorites/cart persists after page refresh (Zustand persist working)

## Midday Block (11:20 AM – 1:30 PM)
- [ ] Create `README.md` inside your React project folder (not the monorepo root)
- [ ] README includes: app name, feature list, tech stack, live URL placeholder, setup steps
- [ ] Commit: `git add . && git commit -m "Week 6 final: routing, forms, state management, Tailwind" && git push origin main`
- [ ] Go to vercel.com → your project → Redeploy (or create new project if needed)
- [ ] Wait for green build checkmark
- [ ] Open live URL — test every page (home, search/movies, favorites, forms, cart)
- [ ] Update README with the real live Vercel URL
- [ ] Push updated README: `git add . && git commit -m "Add live URL to README" && git push origin main`

## Afternoon Block (2:30 – 4:30 PM)
- [ ] Write LinkedIn post (template in README) — include live URL + GitHub link
- [ ] Post it — not just draft
- [ ] Create `day-40-dsa.js` in `week-06-react-intermediate/day-40/`
- [ ] Solve DSA Problem 1 — pick from your weakest category, pattern + complexity
- [ ] Solve DSA Problem 2
- [ ] Solve DSA Problem 3
- [ ] Solve DSA Problem 4
- [ ] Solve DSA Problem 5 (challenge day — one more than usual)

## Wrap Up (4:30 – 5:45 PM)
- [ ] Write "Week 6: What I Can Build Now" in `journal.md` (template in README)
- [ ] Complete Week 6 Self-Check (8 questions in README) — mark each yes/no
- [ ] Paste your live Vercel URL in this file: _______________
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 40: Week 6 complete - intermediate React mastered!"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Install React Query Devtools and inspect the cache — see what's cached and when it expires
- [ ] Add a `404.html` to Vercel to handle direct URL navigation (common Vite deployment issue)
- [ ] Profile your app with React DevTools Profiler — identify any unnecessary re-renders
- [ ] Write one unit test for your budget/cart reducer using Vitest (no React needed, just pure function)
