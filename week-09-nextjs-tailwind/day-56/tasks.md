# Day 56 Tasks — Server Components vs Client Components + API Routes

## Morning Block (8:00 – 11:00 AM) — Server/Client Mental Model
- [ ] Write down from memory: what can Server Components do that Client Components can't?
- [ ] Write down from memory: what can Client Components do that Server Components can't?
- [ ] Write down: what does `'use client'` actually mark — a component or a boundary?
- [ ] Write down: can a Server Component render a Client Component? Can a Client Component render a Server Component? Why?
- [ ] Create `src/app/demo/page.tsx` — async Server Component that fetches mock data
- [ ] Create `src/components/CounterButton.tsx` — `'use client'` component with `useState`
- [ ] Embed `<CounterButton />` inside the Server Component page
- [ ] Verify: the page renders server data + working counter button
- [ ] Open DevTools → Sources — confirm the server data HTML is in the initial response (view-source)
- [ ] Can explain: which part of this page sends JavaScript to the browser?

## Midday Block (11:20 AM – 1:30 PM) — API Routes (Route Handlers)
- [ ] Create `src/app/api/posts/route.ts`
  - [ ] `GET` handler returns array of 3 posts as JSON
  - [ ] `POST` handler reads `request.json()`, validates `title` + `author` present
  - [ ] `POST` returns 400 with error if validation fails
  - [ ] `POST` returns 201 with new post if valid
- [ ] Test: open `localhost:3000/api/posts` in browser — JSON array appears
- [ ] Test: POST with valid body → 201 + new post in response
- [ ] Test: POST with missing `title` → 400 + error message
- [ ] Create `src/app/api/posts/[id]/route.ts`
  - [ ] `GET` handler reads `params.id`, finds matching post
  - [ ] Returns 404 with error if not found
  - [ ] Returns 200 with post if found
- [ ] Test: `localhost:3000/api/posts/1` → returns post 1
- [ ] Test: `localhost:3000/api/posts/999` → returns 404 JSON
- [ ] Create `src/app/posts/page.tsx` — Server Component that fetches from `/api/posts`
- [ ] Confirm: `/posts` page renders the list of posts fetched from your own API

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-56-dsa.js` in `week-09-nextjs-tailwind/day-56/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Run: `git add . && git commit -m "Day 56: Server vs Client Components + Route Handlers + DSA"`
