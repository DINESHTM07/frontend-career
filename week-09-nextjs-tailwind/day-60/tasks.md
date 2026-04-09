# Day 60 Tasks — Project 3: Build Day 2 — Core Features

## Morning Block (8:00 – 11:00 AM) — Data Layer + Core Pages
- [ ] Review your study notes from Day 59 — what features are you building today?
- [ ] Define all TypeScript interfaces in `src/types/index.ts`
  - [ ] At least 2 interfaces — matching the data shapes in the complete version
  - [ ] Use union types for status fields (e.g., `'published' | 'draft'`)
  - [ ] Export all interfaces
- [ ] Create mock data or API routes
  - [ ] If mock data: `src/data/mockData.ts` with typed arrays (at least 5 items)
  - [ ] If API routes: `src/app/api/[resource]/route.ts` with GET + POST
  - [ ] All data typed against your interfaces — zero TypeScript errors
- [ ] Build the main list/index page as a Server Component
  - [ ] Fetches or imports the data
  - [ ] Handles empty state (no data message)
  - [ ] Renders data in a grid or list using a `PostCard`-style component
  - [ ] Has `metadata` export
- [ ] Build the card/list-item component
  - [ ] Uses `Card`, `CardHeader`, `CardContent` from Shadcn
  - [ ] Uses `Badge` for status or category labels
  - [ ] Links to the detail page with `next/link`

## Midday Block (11:20 AM – 1:30 PM) — Interactive Features + Dynamic Routes
- [ ] Build the dynamic detail page (`/[segment]/[id-or-slug]/page.tsx`)
  - [ ] `params` typed correctly: `{ params: { slug: string } }`
  - [ ] Calls `notFound()` if item not found
  - [ ] Has `generateMetadata` that returns item-specific title and description
  - [ ] Renders full item content
- [ ] Build at least one interactive Client Component (search, filter, or form)
  - [ ] `'use client'` at top
  - [ ] State managed with `useState`
  - [ ] Receives data as props from a Server Component parent
  - [ ] Filtering works correctly — count shows "X of Y items"
- [ ] Add dynamic routes to the Navbar (if needed)
- [ ] Test dark mode on all new pages — all readable
- [ ] Run `npm run build` — fix any TypeScript errors immediately
- [ ] Open the complete version ONLY if stuck for more than 15 minutes — look, close, then implement

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-60-dsa.js` in `week-09-nextjs-tailwind/day-60/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## End of Day Progress Assessment
- [ ] Rate yourself: what % of the complete version's features are done? ____%
- [ ] Write down: what is left for Day 61 besides deploy?
- [ ] Run: `git add . && git commit -m "Day 60: Project 3 core features + data layer + DSA"`
