# Day 40 — Week 6 Review + Polish + Deploy

**Status:** 📋 READY TO START
**Week:** 6 | **Theme:** React Intermediate

---

## What You're Doing Today

Six weeks in. Forty days. Today you consolidate, polish, and ship.

No new concepts. Instead: review every tool from this week, pick your best app, make it production-ready, deploy it, and write a LinkedIn post that shows your growth.

By end of day:
- You'll have reviewed routing, forms, useReducer, custom hooks, Zustand, React Query, and Tailwind
- Your best app will be polished, clean-coded, and live on Vercel
- You'll have solved 5 DSA problems (challenge day)
- You'll have a LinkedIn post showing 6 weeks of progress

---

## Files to Open Today

1. **This README**
2. All 6 React cheatsheets for the quick morning review
3. Your React project
4. `dsa-bank/` — afternoon

---

## Morning (8:00 – 11:00 AM) — Rapid Review + Self-Quiz

### Step 1 — Open each cheatsheet for 5 minutes

| Cheatsheet | Can you answer without looking? |
|-----------|--------------------------------|
| `cheatsheets/react/09-react-router.md` | How do you read a `:id` URL param? What is `NavLink`'s `end` prop for? |
| `cheatsheets/react/10-forms.md` | What does `register("email", { required: "..." })` spread onto the input? |
| `cheatsheets/react/05-useReducer.md` | What is the shape of an action? Why must reducers be pure? |
| `cheatsheets/react/08-custom-hooks.md` | Why must custom hooks start with `use`? |
| `cheatsheets/react/11-state-management.md` | Zustand vs Context: when to use each? |
| `cheatsheets/advanced/03-tailwind.md` | What does `md:grid-cols-3` mean? |

---

### Step 2 — Week 6 Self-Quiz

Write your answers in `day-40-review.md` in the `day-40/` folder. Answer without notes first, then check.

**React Router:**
1. What hook do you use to navigate programmatically? (`useNavigate`)
2. What hook reads `/movie/:id` from the URL? (`useParams`)
3. What is the difference between `<Link>` and `<NavLink>`?

**React Hook Form:**
4. What does `handleSubmit(onSubmit)` do before calling `onSubmit`?
5. How do you validate that two password fields match?

**useReducer:**
6. Write the skeleton of a reducer function (switch, cases, default)
7. What does `dispatch({ type: "ADD", payload: item })` do?

**Custom Hooks:**
8. What is the naming rule for custom hooks?
9. Write a `useToggle` hook in 5 lines.

**Zustand:**
10. How is Zustand different from Context + useReducer?
11. What does the `persist` middleware do?

**React Query:**
12. What is `staleTime` in `useQuery`?
13. What does `queryKey` do — why is it important?

**Tailwind:**
14. What class centers a div horizontally? (`mx-auto`)
15. What class makes text bold and large? (`text-xl font-bold`)

---

### Step 3 — Pick your best app and clean it up

Choose one: **Movie Search App** (Day 30, extended in Days 34-39) or **Budget Tracker** (Day 36) or **Cart Page** (Day 36 + 38).

**Clean-up checklist:**

- [ ] Remove all `console.log` statements
- [ ] Remove commented-out dead code
- [ ] Remove unused imports (check every file)
- [ ] All components have meaningful names (no `Comp1`, `Test`, etc.)
- [ ] All files in sensible folders (`pages/`, `components/`, `hooks/`, `stores/`)
- [ ] `index.html` has your app's real name in `<title>`
- [ ] No broken routes or 404s when clicking nav links
- [ ] Mobile view looks good at 375px width (resize browser to check)
- [ ] No inline styles (everything in Tailwind classes)
- [ ] Favorites/cart persists across page refresh (Zustand + persist)

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:30 PM) — Polish + Write README + Deploy

### Add a proper README to your React project

Create `week-05-react-basics/day-27/my-react-app/README.md`:

```markdown
# Movie Search App

A full-featured movie discovery app built with React.

## Features
- Search movies via OMDB API with debounced search
- Loading, error, and empty states handled
- Save/unsave favorites (persisted in localStorage)
- Multi-page navigation with React Router
- Registration form with React Hook Form validation
- Dark/light theme toggle

## Tech Stack
- React 18 + Vite
- React Router v6 (routing)
- React Hook Form (form validation)
- Zustand (favorites state)
- React Query / TanStack Query (data fetching)
- Tailwind CSS (styling)

## Live App
[your-app.vercel.app](https://your-app.vercel.app)

## Getting Started
npm install
npm run dev
```

---

### Deploy to Vercel

If you haven't deployed yet, or if you need to redeploy after all this week's changes:

**Step 1 — Commit everything:**
```bash
git add .
git commit -m "Week 6 final: routing, forms, state management, Tailwind"
git push origin main
```

**Step 2 — Check if you already have a Vercel deployment:**
- Go to vercel.com → your project
- If it shows a deployment, click "Redeploy" to pick up your latest push
- If not set up yet: New Project → Import → `week-05-react-basics/day-27/my-react-app` as root directory

**Step 3 — Test the live URL**

Click through every page on the live site. Things to verify:
- Navigation works (all links work)
- Search works
- Favorites persist
- Registration form validates correctly
- Mobile layout looks correct

---

## Afternoon (2:30 – 4:30 PM) — DSA Challenge Day

Open your `day-40-pattern-review.md` notes (or look at `dsa-bank/`). Solve **5 problems** today — one more than usual.

Pick from categories you feel weakest in. Go for medium/hard difficulty.

Create `day-40-dsa.js` in the `week-06-react-intermediate/day-40/` folder.

As always: pattern name first, then code, then complexity.

---

## LinkedIn Post

Post this after your Vercel URL is live:

> 6 weeks in. Here's what I built this week alone:
>
> React Router → multi-page app with URL navigation
> React Hook Form → validated registration + multi-step forms
> useReducer → complex state with explicit actions
> 5 custom hooks from scratch (useFetch, useDebounce, useLocalStorage, useMediaQuery, useClickOutside)
> Zustand → global state without Redux boilerplate
> React Query → automatic caching, loading states, background updates
> Tailwind CSS → responsive UI without writing a single CSS file
>
> Live app: [paste Vercel URL]
> GitHub: [paste repo link]
>
> These are the exact tools on job listings for junior/mid React roles. 6 more weeks to go.
>
> #react #javascript #frontend #buildinpublic #100daysofcode

---

## Wrap Up (4:30 – 5:45 PM)

Write in `journal.md` — **"Week 6: What I Can Build Now"**:

**I can now build a React app that:**
- Has multiple pages with working URL navigation
- Validates forms without writing error state manually
- Manages complex state with predictable actions (useReducer)
- Shares logic between components with custom hooks
- Has global state that persists across pages and refreshes
- Fetches and caches API data without boilerplate
- Looks professional and responsive without writing CSS

**What I'll work on next:**
- TypeScript in React
- Testing with Vitest / React Testing Library
- Performance optimization (React.memo, useMemo, useCallback)

Then final commit:
```bash
git add .
git commit -m "Day 40: Week 6 complete - intermediate React mastered!"
git push origin main
```

---

## End of Day Checklist

- [ ] Reviewed all 6 cheatsheets (5 min each)
- [ ] Answered all 15 quiz questions in `day-40-review.md`
- [ ] Selected best app and completed clean-up checklist
- [ ] App README written in the React project folder
- [ ] Deployed to Vercel — live URL confirmed working
- [ ] Mobile layout tested (resize to 375px — looks good)
- [ ] LinkedIn post published with live URL
- [ ] Solved 5 DSA problems in `day-40-dsa.js`
- [ ] "Week 6: What I Can Build Now" written in `journal.md`
- [ ] Committed and pushed to GitHub

---

## Week 6 Self-Check

Answer honestly — no notes:

- [ ] Can I add routing to any React app with `<BrowserRouter>`, `<Routes>`, `<Route>`?
- [ ] Can I build a validated form without `useState` for each field?
- [ ] Can I write a reducer function with multiple action types?
- [ ] Can I write a custom hook that other components can share?
- [ ] Can I set up a Zustand store with persist?
- [ ] Can I replace a manual fetch + useEffect with `useQuery`?
- [ ] Can I make any React component responsive using only Tailwind?
- [ ] Do I have a deployed app with ALL of this week's features working?

---

## What's Coming in Week 7

- TypeScript in React — type your props, state, and API responses
- Testing — Vitest + React Testing Library
- Performance — React.memo, useMemo, useCallback, code splitting
- Advanced patterns — compound components, render props, portals

---

*Six weeks ago you didn't know what a component was. Today you're deploying apps with routing, form validation, global state management, data caching, and responsive UI. That's not beginner territory anymore.*
