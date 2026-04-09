# Day 61 Tasks — Project 3: Finish + Deploy + Update Portfolio

## Morning Block (8:00 – 11:00 AM) — Finish + Quality Check

### Finish Remaining Features
- [ ] Review Day 60 progress — list what is unfinished
- [ ] Finish any broken or incomplete features (no new features)
- [ ] Add empty states where data could be empty
- [ ] Add 404 handling — `notFound()` called on unknown slugs/IDs

### Quality Checklist
- [ ] All nav links work — no unexpected 404s
- [ ] Dark mode works and persists on every page
- [ ] Forms validate — empty submissions blocked or show error
- [ ] Dynamic routes load correctly
- [ ] API routes return correct HTTP status codes (if applicable)
- [ ] Search/filter (if present) works with all combinations
- [ ] Every page has `metadata` export with `title` + `description`
- [ ] Dynamic pages have `generateMetadata` — view page source to verify
- [ ] No `console.log` anywhere (search Ctrl+Shift+F)
- [ ] No unused imports
- [ ] `npm run build` — zero TypeScript errors, zero warnings
- [ ] No plain `<img>` tags — only `next/image`
- [ ] No plain `<a>` for internal links — only `next/link`
- [ ] At 375px width: no horizontal scroll, all text readable, layout intact

## Midday Block (11:20 AM – 1:30 PM) — Deploy
- [ ] Run: `npm run build` — must succeed with zero errors
- [ ] Run: `npm run start` — test every page on production build locally
- [ ] All features work on local production build — fix anything broken before pushing
- [ ] Navigate to `project-starters/nextjs-starter` in terminal
- [ ] Run: `git init && git add . && git commit -m "Initial commit: Project 3 Next.js App"`
- [ ] Create new GitHub repo — name it after your app (not "nextjs-starter")
- [ ] Push to GitHub — confirm code visible on GitHub
- [ ] Go to vercel.com → New Project → import repo
- [ ] Confirm: Framework = Next.js (auto-detected), no manual config needed
- [ ] Add environment variables if using `.env.local`
- [ ] Click Deploy → wait for green ✓
- [ ] Open live URL — test every page
- [ ] Test dark mode on live URL — persists after refresh
- [ ] Test on mobile (375px) — layout works
- [ ] No JavaScript console errors on any page
- [ ] Copy and save live URL: _______________

## Afternoon Block (1:30 – 4:00 PM) — Portfolio + Resume + LinkedIn + Journal
- [ ] Open `portfolio/data/projects.js`
- [ ] Add Project 3: name, description (what it does), techStack, liveUrl, githubUrl, featured: true
- [ ] Push portfolio — confirm Vercel auto-deploys — 3 projects now visible
- [ ] Open `resume/resume-content.md`
- [ ] Add 5 bullet-point project entry — replace ALL bracketed placeholders with real details
- [ ] Write LinkedIn post (use template from README) — include live URL + GitHub
- [ ] Publish LinkedIn post — confirm it is live with the URL
- [ ] Write "Week 9: Next.js and the Server/Client Split" in `journal.md`

## Final Wrap Up
- [ ] In monorepo root: `git add .`
- [ ] Run: `git commit -m "Day 61: Project 3 deployed + portfolio + resume + LinkedIn"`
- [ ] Run: `git push origin main`
- [ ] Live URL: _______________
- [ ] GitHub repo URL: _______________
- [ ] LinkedIn post URL: _______________
