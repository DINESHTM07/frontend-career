# Day 47 — Project 1 Day 7: Polish + Deploy + Update Portfolio

**Status:** 📋 READY TO START
**Week:** 7 | **Theme:** E-Commerce Project

---

## Today's Goal

The app is complete. Today you ship it.

Ship = deploy live + update portfolio + update resume + LinkedIn post + blog post.

Every day you delay shipping is a day a recruiter can't see your work. Do not leave today without a live URL in hand.

By end of today:
- E-Commerce app live on Vercel with a public URL
- Portfolio updated with the new project (live URL + GitHub link)
- Resume updated with the project details
- LinkedIn post published
- Hashnode blog post published

---

## Morning (8:00 – 11:00 AM) — Final Polish

### Step 1 — Run the complete version one more time

Look at the complete version fresh with experienced eyes. After building the starter all week, you'll see things you missed before. Note anything your version is missing or handles differently.

Close it. Make the fixes in your starter version.

---

### Step 2 — Final quality checklist

Work through these systematically:

**Functionality:**
- [ ] Home page loads products with skeleton, then grid
- [ ] Search filters correctly as you type (debounced)
- [ ] Category filter works alone and combined with search
- [ ] Sort works with all combinations of filters active
- [ ] "X of 20 products" count updates when filtered
- [ ] Clicking a product card navigates to `/product/:id`
- [ ] Product detail page shows full info (image, title, description, rating, price)
- [ ] "Add to Cart" works from both product card AND detail page
- [ ] Cart badge in Navbar updates immediately on add
- [ ] Cart page: quantities, totals, remove, clear all — all correct
- [ ] Cart persists on page refresh
- [ ] Favorites heart toggle works on card and detail page
- [ ] Favorites page shows saved products
- [ ] Favorites persist on page refresh
- [ ] Dark mode toggle works, persists on refresh
- [ ] Back button on detail page returns to previous page correctly
- [ ] 404 page shows for unknown URLs

**Polish:**
- [ ] No `console.log` statements in any file
- [ ] No commented-out dead code
- [ ] No unused imports
- [ ] Loading skeletons appear on slow connections (test in DevTools: Network → Slow 3G)
- [ ] Empty states have friendly messages (empty cart, empty favorites, no search results)
- [ ] Mobile layout looks good at 375px width
- [ ] No horizontal scroll on mobile
- [ ] Dark mode looks good for all pages
- [ ] All text is readable in both light and dark mode

**Code quality:**
- [ ] All components have meaningful names
- [ ] Store files are in `src/stores/`
- [ ] Hook files are in `src/hooks/`
- [ ] Utility functions are in `src/utils/`
- [ ] Page components are in `src/pages/`
- [ ] UI components are in `src/components/`

---

### Step 3 — Add a scroll-to-top on route change

A small but important UX detail — when you navigate from the product detail page back to home, the scroll position stays at wherever you were. Fix with a scroll-restore component:

Create `src/components/ScrollToTop.jsx`:

```jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
```

Add it in `App.jsx` (or `MainLayout.jsx`) alongside `<Routes>`:
```jsx
<ScrollToTop />
<Routes>...</Routes>
```

---

### Step 4 — Add `<title>` updates per page

The browser tab should show the page name, not just "Vite + React":

```jsx
// In main.jsx or index.html
// index.html: <title>E-Commerce Store</title>

// Or per-page in each page component:
import { useEffect } from 'react'
useEffect(() => { document.title = "E-Commerce Store" }, []);

// On product detail page:
useEffect(() => {
  if (product) document.title = `${product.title} | Store`;
  return () => { document.title = "E-Commerce Store" }; // cleanup
}, [product]);
```

---

## Midday (11:20 AM – 1:00 PM) — Deploy to Vercel

### Step 1 — Create a new GitHub repository for this project

The ecommerce project should have its OWN repository (separate from the `frontend-career` monorepo) so recruiters can see it cleanly.

```bash
# Navigate to the starter folder
cd project-starters/ecommerce-starter

# Initialize git
git init
git add .
git commit -m "Initial commit: E-Commerce Product Explorer"

# Create a new repo on GitHub: github.com → New repository
# Name it: ecommerce-product-explorer (or similar)
# Do NOT initialize with README (you already have files)

# Add remote and push (GitHub will show you the exact commands)
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-product-explorer.git
git branch -M main
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to **vercel.com** → New Project
2. Import the new `ecommerce-product-explorer` repository
3. Vercel should auto-detect Vite — confirm:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Root Directory:** leave as `/` (it's the root of the new repo)
4. Click Deploy
5. Wait for green ✓
6. Copy your live URL: `your-project.vercel.app`

**Test the live URL:**
- All pages load
- API calls work (FakeStore API is public — no key needed)
- Cart and favorites persist
- Dark mode works
- Mobile layout looks good

---

## Afternoon (1:30 – 4:00 PM) — Update Portfolio + Resume

### Step 1 — Update portfolio projects data

Open `portfolio/data/projects.js` (or wherever your portfolio stores project data).

Add the new project:

```js
{
  name: "E-Commerce Product Explorer",
  description: "Full-featured e-commerce product browsing app. Search with debounce, filter by category, sort by price/rating. Cart and favorites with Zustand (persisted). Product detail pages with React Router. Dark mode. Built with React, Tailwind, React Query, and Zustand.",
  techStack: ["React", "React Router", "Zustand", "React Query", "Tailwind CSS"],
  liveUrl: "https://your-project.vercel.app",   // PASTE YOUR REAL URL
  githubUrl: "https://github.com/YOUR_USERNAME/ecommerce-product-explorer",
  featured: true,
}
```

Push portfolio changes — if your portfolio is on Vercel, it will auto-deploy.

### Step 2 — Update resume

Open `resume/resume-content.md`. In the Projects section, add:

```markdown
**E-Commerce Product Explorer** | [Live](https://your-url.vercel.app) | [GitHub](https://github.com/your/repo)
- Built a full-featured product browsing app using React, React Router, and Tailwind CSS
- Implemented debounced search, multi-category filter, and multi-sort with useMemo for performance
- Managed cart and favorites state with Zustand + localStorage persistence across sessions
- Integrated FakeStore API via React Query with caching, loading skeletons, and error handling
- Deployed on Vercel; responsive design works on mobile and desktop
Tech: React 18, React Router v6, Zustand, TanStack Query, Tailwind CSS
```

**These bullet points are interview-ready.** Each one describes WHAT you did, not just WHAT it is. Recruiters look for these patterns.

---

## LinkedIn Post

Post this immediately after you have the live URL:

> Just deployed my first major React project — an E-Commerce Product Explorer! 🛒
>
> What I built:
> ✅ Product grid with real API data (FakeStore API)
> ✅ Debounced search + category filter + multi-sort (all work together)
> ✅ Product detail pages with dynamic routing (/product/:id)
> ✅ Cart with Zustand — persisted across page refreshes
> ✅ Favorites with heart toggle — also persisted
> ✅ Dark mode toggle — persisted
> ✅ Loading skeletons + error states
> ✅ Responsive design — works on mobile
>
> Tech: React, React Router, Zustand, React Query, Tailwind CSS
>
> Live app: [paste URL]
> GitHub: [paste URL]
>
> Week 7 of 12 complete. Building toward a job.
>
> #react #javascript #frontend #buildinpublic #100daysofcode

---

## Hashnode Blog Post

Write a post titled: **"Building My First React Project — What I Learned"**

Cover:
1. What you built (with screenshots — take them from the live app)
2. The architecture decisions (why 3 stores, why pure filterProducts, why React Query over useFetch)
3. The hardest part (probably the cart quantity logic or dark mode)
4. What you'd do differently
5. Link to live app + GitHub

This post proves you can think, not just code. Recruiters read these.

---

## DSA (Afternoon, if time allows)

Open `dsa-bank/` — pick 3 problems from any category you feel weakest on.

Create `day-47-dsa.js` in the `week-07-project-1-ecommerce/day-47/` folder.

---

## Wrap Up

```bash
# Final commit in the monorepo
git add .
git commit -m "Day 47: E-Commerce deployed + portfolio updated + blog written"
git push origin main
```

---

## End of Day Checklist

**App quality:**
- [ ] All functionality from Days 42-46 works on the live URL
- [ ] No console errors in production
- [ ] Loads correctly on mobile (375px)
- [ ] Dark mode works in production
- [ ] Cart + favorites persist after hard refresh on live URL

**Shipping:**
- [ ] New GitHub repo created for the ecommerce project
- [ ] Deployed to Vercel — have a live URL
- [ ] Live URL tested: all pages, API calls, cart, favorites, dark mode

**Portfolio update:**
- [ ] `portfolio/data/projects.js` updated with project details and live URL
- [ ] Portfolio deployed (push to GitHub → Vercel auto-deploys)
- [ ] Live portfolio shows the new project

**Resume update:**
- [ ] `resume/resume-content.md` updated with project section (5 bullet points with impact)

**Content:**
- [ ] LinkedIn post published with live URL
- [ ] Hashnode blog post published (with screenshots)

**Monorepo:**
- [ ] Final commit pushed to `frontend-career` main

---

## Week 7 Reflection

Write in `journal.md` — **"Week 7: From Learning to Building"**:

- What was harder than expected?
- What was easier than expected?
- Name one architecture decision you made and why you made it
- What would you add if you had one more week?
- What did you learn from studying the complete version that you couldn't have learned from exercises?

---

*Week 7 done. You have a deployed React project you built yourself, you understand every line of it, and you can explain every decision. That is the difference between a student and a developer.*
