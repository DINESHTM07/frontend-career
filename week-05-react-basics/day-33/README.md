# Day 33 — Week 5 Review + Deploy React App + LinkedIn

**Status:** 📋 READY TO START
**Week:** 5 | **Theme:** React Basics

---

## What You're Doing Today

This is your consolidation and deployment day. No new concepts — you're reviewing, polishing, deploying, and sharing.

By end of day:
- You'll have reviewed all 5 core React concepts from this week
- Your best app (Movie Search or Pokemon) will be live on Vercel
- You'll have a LinkedIn post up with the live link
- You'll have 3 more DSA problems done
- You'll have written in your journal about how much your React knowledge has grown

---

## Files to Open Today

1. **This README**
2. Your 5 React cheatsheets (quick skim each one)
3. `week-05-react-basics/day-27/my-react-app/` — clean up and deploy this
4. `dsa-bank/` — afternoon

---

## Morning (8:00 – 11:00 AM) — Rapid React Review

### Step 1 — Open each cheatsheet for 5 minutes

Go through them in order. For each one, don't read every word — skim and ask yourself: "Can I explain this without looking?"

| Cheatsheet | Key question to answer |
|-----------|----------------------|
| `cheatsheets/react/01-react-basics.md` | What is JSX? What are the rules? What are props? |
| `cheatsheets/react/02-useState.md` | Why use functional updates? What's wrong with mutating state? |
| `cheatsheets/react/03-useEffect.md` | What do the 3 forms of `useEffect` do? What is the cleanup for? |
| `cheatsheets/react/04-useContext.md` | What problem does context solve? How do you create and use one? |
| `cheatsheets/react/01-react-basics.md` | (re-read composition section) What is the `children` prop? |

---

### Step 2 — React Self-Quiz (answer out loud or in a comment)

Try answering each of these without looking at any notes. Check after each one:

1. **JSX:** What does `<Button onClick={handleClick} />` compile to?
2. **Props:** What is the difference between `isNew` and `isNew={true}` on a component?
3. **State:** Why does this not work? `const [count, setCount] = useState(0); setCount(count + 1); setCount(count + 1); // count is still 1, not 2`
4. **Lists:** What happens if you don't add a `key` prop to list items?
5. **useEffect:** What does the empty array `[]` mean in `useEffect(fn, [])`?
6. **useEffect:** What does the return function inside `useEffect` do?
7. **Context:** What is prop drilling? How does context fix it?
8. **Composition:** What is the `children` prop? When would you use it?

Write answers in `day-33-review.md` in the `day-33/` folder (not in the React project).

---

### Step 3 — Clean up your best app

Pick your BEST project from this week. Most likely: **Movie Search** (Day 30) or **Pokemon Cards** (Day 29). It should be the one with the most features.

**Clean-up checklist:**

1. **Remove console.log statements** — search for `console.log` and delete them
2. **Check for hardcoded API keys** — for now it's fine (free tier OMDB key), but note it for later
3. **Remove dead code** — any commented-out code or unused imports
4. **Check the title** — open `index.html`, change `<title>Vite + React</title>` to your app name
5. **Remove test components** — remove any Counter/ColorPicker components from `App.jsx` that were just practice
6. **Final visual check** — open the app, use every feature, confirm nothing is broken

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:30 PM) — Deploy to Vercel

### How to deploy a Vite React app

**Step 1 — Commit all changes:**
```bash
git add .
git commit -m "Day 33: Clean up app for deployment"
git push origin main
```

**Step 2 — Go to Vercel:**
1. Open **vercel.com** in your browser
2. Click **"Add New Project"**
3. Click **"Import Git Repository"** — connect your GitHub if not already connected
4. Find your `frontend-career` repo — click Import

**Step 3 — Configure the build:**

Vercel will auto-detect it's a Vite app. But you need to tell it which subfolder to build from:

- **Root Directory:** click "Edit" and set it to `week-05-react-basics/day-27/my-react-app`
- **Build Command:** `npm run build` (already set)
- **Output Directory:** `dist` (already set)
- Click **Deploy**

**Step 4 — Wait and copy the URL:**

Build takes ~30 seconds. When it shows a green ✓, click "Visit" — you'll see your live app.

Copy the URL — it looks like `your-app-name.vercel.app`

**That's it. Your React app is live.**

---

### If you have an OMDB API key in the code

Right now your API key is hardcoded in the component — that's okay for a free key, but good practice is to use environment variables. You can add this after deployment works:

1. In Vercel project settings → Environment Variables → add `VITE_OMDB_KEY=yourkey`
2. In your code, use `import.meta.env.VITE_OMDB_KEY` instead of the hardcoded string
3. Redeploy

Do this as a stretch goal if you have time.

---

## Lunch (1:30 – 2:30 PM)

---

## Afternoon (2:30 – 4:00 PM) — DSA + Journal

Open `dsa-bank/recursion.md`. Solve **problems 6, 7, and 8**.

Create `day-33-dsa.js` in the `day-33/` folder.

---

## LinkedIn Post

Write and post this **before committing for the day:**

> Week 3 of my 12-week frontend journey complete! 🎯
>
> This week I went from zero React knowledge to building and deploying a full [Movie Search / Pokemon] app.
>
> What I built this week:
> - First React components with props and JSX
> - useState for interactive UIs (counter, todo list, shopping list)
> - useEffect for API calls with loading + error states
> - A reusable component library (Button, Card, Modal, Badge)
> - Context API for theme switching and language toggle
>
> Live app: [paste your Vercel URL]
> GitHub: [paste your repo link]
>
> Still 9 weeks to go. Next up: React Router, custom hooks, and Tailwind CSS.
>
> #100daysofcode #javascript #react #buildinpublic #frontend

---

## Wrap Up (4:00 – 5:30 PM)

Write in `journal.md`:

**Title: "What I know in React now vs 7 days ago"**

Answer these honestly:

**7 days ago I didn't know:**
- (list things that confused you on Day 27)

**Now I can:**
- Explain what JSX compiles to
- Build components, pass props, handle events
- Manage state with useState — add to arrays, update objects, never mutate
- Fetch data in useEffect and handle loading/error/empty states
- Build reusable components with the children prop
- Share state across the whole app with useContext
- Deploy a React app to Vercel

**What still feels fuzzy:**
- (be honest — list what you're not fully clear on)

**What I'll strengthen next week:**
- (React Router, custom hooks, or whatever is on your curriculum)

---

Then commit:
```bash
git add .
git commit -m "Day 33: Week 5 complete - React app deployed!"
git push origin main
```

---

## End of Day Checklist

- [ ] Skimmed all 4 React cheatsheets (5 min each)
- [ ] Answered all 8 quiz questions in `day-33-review.md`
- [ ] Cleaned up the best app from this week
- [ ] Changed `<title>` in `index.html` to your app name
- [ ] Removed all `console.log`, dead code, unused imports
- [ ] Deployed to Vercel — have a live URL
- [ ] App is fully functional on the live URL
- [ ] LinkedIn post published with live link
- [ ] Solved 3 DSA problems in `day-33-dsa.js`
- [ ] Wrote the "7 days ago vs now" journal entry
- [ ] Committed and pushed to GitHub

---

## Week 5 Self-Check

Answer without notes:

- [ ] Can I build a React component from scratch?
- [ ] Can I explain what JSX is and how it differs from HTML?
- [ ] Can I manage a list in state (add, remove, update) without mutating it?
- [ ] Can I fetch data with useEffect and handle all 3 states (loading, error, success)?
- [ ] Can I build reusable components that accept children?
- [ ] Can I explain what useContext solves and how to use it?
- [ ] Do I have a deployed React app with a live URL?

---

## Quick Reference — The Week in One Page

```jsx
// Component + Props
function Card({ title, children }) {
  return <div className="card"><h2>{title}</h2>{children}</div>;
}

// useState
const [items, setItems] = useState([]);
setItems(prev => [...prev, newItem]);       // add
setItems(prev => prev.filter(i => i.id !== id)); // remove
setItems(prev => prev.map(i => i.id === id ? {...i, done: true} : i)); // update

// useEffect
useEffect(() => {
  fetch(url).then(r => r.json()).then(setData);
  return () => { /* cleanup */ };
}, [url]);

// Context
const ThemeContext = createContext();
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
function useTheme() { return useContext(ThemeContext); }

// Conditional rendering
{isLoading && <Spinner />}
{error ? <ErrorMessage /> : <Content />}

// List rendering
{items.map(item => <Item key={item.id} {...item} />)}
```

---

*You built a full React app. It's live on the internet. A week ago you had never written a React component. That is real progress.*
