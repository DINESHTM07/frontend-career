# Day 47 Tasks — Polish + Deploy + Update Portfolio

## Morning Block (8:00 – 11:00 AM) — Final Polish
- [ ] Open the complete version one last time — look for anything your version is missing
- [ ] Close the complete version
- [ ] Run through the full functionality checklist in README — mark each as working or broken
- [ ] Fix any broken items found in the checklist
- [ ] Remove ALL `console.log` statements (search Ctrl+Shift+F for "console.log")
- [ ] Remove all commented-out dead code from every file
- [ ] Remove unused imports from every file
- [ ] Check mobile at 375px width in DevTools → no horizontal scroll, everything readable
- [ ] Check dark mode on every page → all text readable, no invisible elements
- [ ] Test in DevTools → Network → Slow 3G → loading skeletons appear
- [ ] Create `src/components/ScrollToTop.jsx` — scrolls to top on each route change
- [ ] Add `<ScrollToTop />` to App.jsx or MainLayout.jsx
- [ ] Add `<title>E-Commerce Store</title>` in index.html
- [ ] Add per-page title update on ProductDetailPage (shows product name in tab)
- [ ] Verify all 5 file organization folders exist: `pages/`, `components/`, `hooks/`, `stores/`, `utils/`

## Midday Block (11:20 AM – 1:30 PM) — Deploy
- [ ] Navigate to `project-starters/ecommerce-starter` in terminal
- [ ] Run: `git init` (if not already a git repo)
- [ ] Run: `git add . && git commit -m "Initial commit: E-Commerce Product Explorer"`
- [ ] Create new GitHub repository named "ecommerce-product-explorer"
- [ ] Add remote and push: follow GitHub's instructions for existing repository
- [ ] Confirm code appears on GitHub
- [ ] Go to vercel.com → New Project → Import `ecommerce-product-explorer` repo
- [ ] Build Command: `npm run build` | Output Directory: `dist` | Root: `/`
- [ ] Click Deploy — wait for green ✓
- [ ] Open live URL — click through every page
- [ ] Test: search → filter → sort → add to cart → go to cart → change quantity → remove
- [ ] Test: add favorites → go to /favorites → they appear
- [ ] Test: toggle dark mode → stays dark after refresh
- [ ] Test: hard refresh on /product/5 — page loads correctly (not 404)
- [ ] Copy and save your live URL: _______________

## Afternoon Block (1:30 – 4:00 PM) — Portfolio + Resume + Content
- [ ] Open `portfolio/data/projects.js`
- [ ] Add project entry: name, description, tech stack, liveUrl, githubUrl, featured: true
- [ ] Push portfolio: `git add . && git commit -m "Add ecommerce project to portfolio" && git push`
- [ ] Confirm portfolio site shows the new project (check Vercel auto-deploy)
- [ ] Open `resume/resume-content.md`
- [ ] Add 5 bullet-point project entry (use the template from README — impact-first language)
- [ ] Write LinkedIn post (copy template from README) — include live URL + GitHub link
- [ ] Post it on LinkedIn — do not just draft it
- [ ] Write Hashnode blog post: "Building My First React Project — What I Learned"
- [ ] Include at least 2 screenshots from the live app
- [ ] Publish the post — copy blog URL

## DSA Block (if time allows)
- [ ] Create `day-47-dsa.js` in `week-07-project-1-ecommerce/day-47/`
- [ ] Solve 3 problems from your weakest category

## Final Wrap Up
- [ ] Write "Week 7: From Learning to Building" in `journal.md` (template in README)
- [ ] Run in `frontend-career` monorepo: `git add .`
- [ ] Run: `git commit -m "Day 47: E-Commerce deployed + portfolio updated + blog written"`
- [ ] Run: `git push origin main`
- [ ] Paste live URL here: _______________
- [ ] Paste GitHub repo URL here: _______________
- [ ] Paste blog post URL here: _______________

## Key URLs to Save
Live app: _______________
GitHub repo: _______________
Vercel dashboard: _______________
Blog post: _______________
LinkedIn post: _______________
