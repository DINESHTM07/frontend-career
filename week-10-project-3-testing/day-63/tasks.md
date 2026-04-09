# Day 63 Tasks — More Tests + Bug Fixes Found Through Testing

## Morning Block (8:00 – 11:00 AM) — Expand E-Commerce Tests
- [ ] Open `project-starters/ecommerce-starter` — run `npm test` — confirm existing 3 tests still pass
- [ ] Write Test 4: Cart renders empty state when `items=[]`
- [ ] Write Test 5: Cart badge shows correct total item count (sum of quantities)
- [ ] Write Test 6: Cart total calculation is correct (price × quantity summed)
- [ ] Write Test 7: Product search filters list as user types (use `userEvent.type`)
- [ ] Write Test 8: Product search shows "no results" message when nothing matches
- [ ] Write Test 9: ProductList renders empty state when passed empty array
- [ ] All 9 e-commerce tests pass — `npm test` shows green
- [ ] Use `queryByText` (not `getByText`) for elements that should NOT be present
- [ ] If any test fails due to a real bug: fix the component code, rerun, confirm green
- [ ] Write down any bugs found: what was wrong, what you fixed

## Midday Block (11:20 AM – 1:30 PM) — Dashboard + Next.js Tests
- [ ] Open `project-starters/dashboard-starter` — run `npm test` — confirm existing 3 tests still pass
- [ ] Write Test 4: OrdersTable renders all 3 status badge variants (completed, pending, cancelled)
- [ ] Write Test 5: StatCard with `changeDirection: 'down'` shows ▼ red indicator
- [ ] All 5+ dashboard tests pass
- [ ] Open `project-starters/nextjs-starter` — run `npm test` — confirm existing 3 tests still pass
- [ ] Write Test 4: A Client Component with `useState` updates correctly on user interaction
- [ ] Write Test 5: A list component with empty array shows empty state message
- [ ] All 5+ Next.js tests pass
- [ ] Total across all projects: 20+ passing tests
- [ ] No `.only` or `.skip` left in any test file (clean up)

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-63-dsa.js` in `week-10-project-3-testing/day-63/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Count total passing tests: ____
- [ ] Write down any bugs found and fixed through testing (for LinkedIn/portfolio use)
- [ ] Run: `git add . && git commit -m "Day 63: 20+ tests across 3 projects + bug fixes + DSA"`
