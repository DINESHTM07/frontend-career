# Day 65 Tasks — Dark Mode Exercise + Exercise 33 + Framer Motion

## Morning Block (8:00 – 11:00 AM) — Dark Mode Exercise + Exercise 33

### Dark Mode Exercise
- [ ] Choose one of your React projects (e-commerce or dashboard — not Next.js)
- [ ] Add CSS variables to `index.css` or `globals.css`: `--bg`, `--fg`, `--card`, `--border`, `--muted`
- [ ] Define both `:root` (light) and `.dark` (dark) variable values
- [ ] Update `tailwind.config.js` — extend colors to use CSS variables
- [ ] Create a `useDarkMode` hook or toggle button that adds/removes `dark` class on `<html>`
- [ ] Persist choice in `localStorage`
- [ ] Test: toggle — all colors flip without changing any component code
- [ ] Test: refresh — choice persists

### Exercise 33
- [ ] Open `exercises/33-[exercise name].jsx`
- [ ] Read the full spec/instructions before starting
- [ ] Complete Part 1
- [ ] Complete Part 2
- [ ] Complete Part 3 (if present)
- [ ] All parts working — no console errors

## Midday Block (11:20 AM – 1:30 PM) — Framer Motion

### Setup
- [ ] `npm install framer-motion` in ecommerce-starter
- [ ] `npm install framer-motion` in dashboard-starter
- [ ] `npm install framer-motion` in nextjs-starter

### E-Commerce Animations
- [ ] Define `container` + `item` variants for stagger effect
- [ ] Wrap product grid in `motion.ul` with `variants={container}` + `initial="hidden"` + `animate="visible"`
- [ ] Wrap each product card in `motion.li` with `variants={item}`
- [ ] Test: page load → cards fade in one after another (stagger visible)
- [ ] Add `AnimatePresence` around cart modal or drawer
- [ ] Cart slides in from the right (`x: '100%'` → `x: 0`) and out on close
- [ ] Test: open/close cart — slide animation plays in both directions

### Dashboard Animations
- [ ] Add stagger animation to StatCards grid (same container/item pattern)
- [ ] Create `PageWrapper` Client Component — wraps children in `motion.div` with fade
- [ ] Wrap page content in `PageWrapper`
- [ ] Test: navigate between pages — content fades in

### Next.js Animations
- [ ] Create `src/components/PageTransition.tsx` — `'use client'`, motion.div with opacity + y animation
- [ ] Use `PageTransition` to wrap content on at least 2 pages
- [ ] Test: navigate between pages — content slides/fades in
- [ ] All animations are ≤300ms — feels fast and professional, not theatrical
- [ ] Add `useReducedMotion` check in at least one animated component

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-65-dsa.js` in `week-10-project-3-testing/day-65/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Run: `git add . && git commit -m "Day 65: Dark mode exercise + exercise 33 + Framer Motion in all 3 projects + DSA"`
