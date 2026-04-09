# Day 59 Tasks — Project 3: Study Complete Version + Start Starter

## Morning Block (8:00 – 11:00 AM) — Study + Setup

### Study the Complete Version (60 minutes minimum)
- [ ] Open `project-starters/nextjs-complete/` — read file structure first
- [ ] List every route (every `page.tsx` file) — write them down
- [ ] Identify how many Client Components exist — what makes each one `'use client'`?
- [ ] Understand how data flows: Server Component fetch? API route? External API?
- [ ] Write down: what are the 3 most impressive features in the complete version?
- [ ] Write down: what is the hardest feature to build? Plan how you'll approach it.
- [ ] Close the complete version — do NOT look at it while building

### Project Setup
- [ ] Run: `npx create-next-app@latest nextjs-starter` in `project-starters/`
- [ ] Select: TypeScript YES, Tailwind YES, App Router YES, src directory YES
- [ ] Run: `npm install next-themes`
- [ ] Run: `npx shadcn@latest init` (Style: Default, Color: Slate, CSS variables: Yes)
- [ ] Add needed Shadcn components: `npx shadcn@latest add button card input badge dialog table`
- [ ] Create folder structure: `src/components/`, `src/types/`, `src/lib/`, `src/data/` (as needed)
- [ ] Run `npm run dev` — confirm app starts without errors

## Midday Block (11:20 AM – 1:30 PM) — Build Core Shell
- [ ] Create `src/components/ThemeProvider.tsx` — `'use client'`, wraps `NextThemesProvider`
- [ ] Create `src/components/ThemeToggle.tsx` — `'use client'`, mounted check, uses `useTheme`
- [ ] Update `src/app/layout.tsx`
  - [ ] `suppressHydrationWarning` on `<html>`
  - [ ] ThemeProvider wraps all children
  - [ ] Navbar included in layout
  - [ ] `metadata` export with `title.template` and `title.default`
- [ ] Create `src/components/Navbar.tsx`
  - [ ] Uses `Link` (not `<a>`) for internal navigation
  - [ ] Sticky + backdrop blur styling
  - [ ] Nav links match routes in the complete version
  - [ ] ThemeToggle in the right side
- [ ] Create `src/app/page.tsx` — hero section with heading + CTA buttons
- [ ] Confirm: dark mode toggle works, persists on refresh
- [ ] Confirm: all nav links point to real or stubbed routes (no broken links)
- [ ] Run `npm run build` — zero TypeScript errors
- [ ] Start the next most important feature from your study notes

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-59-dsa.js` in `week-09-nextjs-tailwind/day-59/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Run: `git add . && git commit -m "Day 59: Project 3 setup + layout + home page + DSA"`
