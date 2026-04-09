# Day 54 Tasks — Dark Mode Polish + CSV Export + Deploy

## Morning Block (8:00 – 11:00 AM) — Polish + CSV Export

### Dark Mode Check
- [ ] Open all 4 pages in dark mode — confirm no white boxes, no invisible text
- [ ] Recharts charts in dark mode — axis text, grid lines readable
- [ ] Sidebar and header correct in dark mode
- [ ] Dark mode persists on page refresh

### Responsive Check
- [ ] At 375px: sidebar collapses, stat cards stack to 1 column
- [ ] At 375px: orders table scrolls horizontally — no broken overflow
- [ ] At 375px: charts resize (ResponsiveContainer works)
- [ ] At 768px: layout reasonable, nothing broken
- [ ] At 1280px+: full layout — sidebar open, 4-col stats, 2-col charts

### Code Quality
- [ ] Search for `console.log` — remove all instances
- [ ] Remove any unused imports
- [ ] Run `npm run build` — zero TypeScript errors, zero warnings
- [ ] Remove any commented-out code

### CSV Export
- [ ] Create `src/utils/exportCsv.ts` — typed with `OrderRow[]` parameter
- [ ] Function creates CSV string with headers row + data rows
- [ ] Wraps each cell in quotes to handle commas in data
- [ ] Creates Blob → object URL → programmatic link click → `revokeObjectURL`
- [ ] Update `src/pages/ReportsPage.tsx` — add "Export CSV" button
- [ ] Click Export CSV — `.csv` file downloads
- [ ] Open the downloaded file — headers correct, data correct, no corruption

## Midday Block (11:20 AM – 1:30 PM) — Deploy
- [ ] Run: `npm run build` — build succeeds with zero errors
- [ ] Run: `npm run preview` — test on localhost:4173
- [ ] Test all 4 pages on preview — no runtime errors
- [ ] Test CSV export on preview — downloads correctly
- [ ] Navigate to `project-starters/dashboard-starter`
- [ ] Run: `git init && git add . && git commit -m "Initial commit: Analytics Dashboard"`
- [ ] Create new GitHub repo: `analytics-dashboard`
- [ ] Push to GitHub — confirm code appears on GitHub
- [ ] Go to vercel.com → New Project → import `analytics-dashboard`
- [ ] Build Command: `npm run build` | Output Directory: `dist`
- [ ] Click Deploy — wait for green ✓
- [ ] Open live URL — test all 4 pages
- [ ] Test dark mode on live URL — persists after refresh
- [ ] Test CSV export on live URL — downloads correctly
- [ ] Test on mobile (375px) — layout works
- [ ] Copy and save live URL: _______________

## Afternoon Block (1:30 – 4:00 PM) — Portfolio + Resume + LinkedIn
- [ ] Open `portfolio/data/projects.js`
- [ ] Add Analytics Dashboard: name, description, techStack, liveUrl, githubUrl, featured: true
- [ ] Push portfolio — confirm Vercel auto-deploys — new project visible on live portfolio
- [ ] Open `resume/resume-content.md`
- [ ] Add 5 bullet-point project entry (impact-first language — use template from README)
- [ ] Write LinkedIn post (use template from README) — include live URL + GitHub
- [ ] Post on LinkedIn — not just draft, actually publish it
- [ ] Write "Week 8: Going Advanced" in `journal.md`

## Final Wrap Up
- [ ] Run in monorepo root: `git add .`
- [ ] Run: `git commit -m "Day 54: Dashboard deployed + portfolio + resume + LinkedIn"`
- [ ] Run: `git push origin main`
- [ ] Live URL: _______________
- [ ] GitHub repo URL: _______________
- [ ] LinkedIn post URL: _______________
