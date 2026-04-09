# Day 55 Tasks — Next.js Setup + App Router Basics

## Morning Block (8:00 – 11:00 AM) — Read + Create Project
- [ ] Open `cheatsheets/advanced/01-nextjs.md` — read fully
- [ ] Write down: what is the difference between a React SPA route and a Next.js App Router route?
- [ ] Write down: what does it mean for a component to be a "Server Component"?
- [ ] Run: `npx create-next-app@latest my-nextjs-app`
- [ ] Select: TypeScript YES, Tailwind YES, App Router YES, src directory YES
- [ ] Run: `cd my-nextjs-app && npm run dev`
- [ ] Confirm: `localhost:3000` loads the Next.js welcome page
- [ ] Open and read `src/app/layout.tsx` — what does it do?
- [ ] Open and read `src/app/page.tsx` — what route does it serve?
- [ ] Open and read `next.config.ts` — what does it configure?
- [ ] Write down the 5 reserved filenames and what each one does

## Midday Block (11:20 AM – 1:30 PM) — Build 3 Pages
- [ ] Replace `src/app/page.tsx` with a simple home page (heading + nav links)
- [ ] Update `src/app/layout.tsx` — add header with nav links to /, /about, /blog
- [ ] Confirm: navigating between pages does NOT reload the header (layout persists)
- [ ] Create `src/app/about/page.tsx` — renders About heading + description
- [ ] Create `src/app/blog/` folder
- [ ] Create `src/app/blog/page.tsx` — async Server Component with 1.5s simulated delay
- [ ] Create `src/app/blog/loading.tsx` — 3 skeleton cards with `animate-pulse`
- [ ] Create `src/app/blog/error.tsx` — has `'use client'` at top, accepts `error` + `reset` props
- [ ] Navigate to `/blog` — loading skeleton appears first, then posts load
- [ ] Can explain: why does `error.tsx` require `'use client'`?
- [ ] Open `exercises/28-blog-rendering.jsx` — work through it fully
- [ ] Can explain in one sentence each: SSR vs SSG vs CSR — when would you use each?

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-55-dsa.js` in `week-09-nextjs-tailwind/day-55/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Run: `git add . && git commit -m "Day 55: Next.js setup + App Router pages + exercise 28 + DSA"`
