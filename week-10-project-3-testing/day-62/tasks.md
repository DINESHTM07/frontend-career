# Day 62 Tasks — Testing Your Projects

## Morning Block (8:00 – 11:00 AM) — Read + Setup + E-Commerce Tests
- [ ] Open `cheatsheets/react/15-testing-basics.md` — read fully
- [ ] Write down: what is the difference between `getByRole` and `getByText`? When do you use each?
- [ ] Write down: what does `vi.fn()` do and when do you need it?
- [ ] Navigate to `project-starters/ecommerce-starter`
- [ ] Run: `npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom`
- [ ] Create `vitest.config.js` at project root — environment: jsdom, globals: true, setupFiles
- [ ] Create `src/test/setup.js` — imports `@testing-library/jest-dom`
- [ ] Add `"test": "vitest"` and `"test:run": "vitest run"` to `package.json` scripts
- [ ] Run `npm test` — watch mode starts, zero tests (confirm no errors)
- [ ] Create `src/test/ecommerce.test.jsx`
- [ ] Test 1: ProductCard renders product title and price — PASS
- [ ] Test 2: Clicking "Add to Cart" button calls the `onAddToCart` callback with the product — PASS
- [ ] Test 3: Filter logic — search returns correct subset, empty search returns all — PASS
- [ ] All 3 tests green in terminal

## Midday Block (11:20 AM – 1:30 PM) — Dashboard + Next.js Tests

### Dashboard Tests
- [ ] Navigate to `project-starters/dashboard-starter`
- [ ] Install same testing dependencies
- [ ] Create `vitest.config.js` and `src/test/setup.js`
- [ ] Add test scripts to `package.json`
- [ ] Create `src/test/dashboard.test.jsx`
- [ ] Test 1: StatCard renders correct label and value — PASS
- [ ] Test 2: StatCard with `changeDirection: 'up'` shows ▲ indicator — PASS
- [ ] Test 3: OrdersTable renders a row for each order in the array — PASS
- [ ] All 3 tests green

### Next.js Tests
- [ ] Navigate to `project-starters/nextjs-starter`
- [ ] Install testing dependencies
- [ ] Create `vitest.config.js` — also needs to handle TypeScript (add `@vitejs/plugin-react`)
- [ ] Create `src/test/setup.ts` — import jest-dom + mock `next/navigation` + mock `next/image`
- [ ] Create `src/test/nextjs.test.tsx`
- [ ] Test 1: A component renders its content correctly — PASS
- [ ] Test 2: A button/interactive element responds to click — PASS
- [ ] Test 3: A list component renders correct number of items — PASS
- [ ] All 3 tests green

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-62-dsa.js` in `week-10-project-3-testing/day-62/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Total passing tests across all 3 projects: 9+ — confirm all green
- [ ] Run: `git add . && git commit -m "Day 62: Vitest + RTL setup + 9 tests across 3 projects + DSA"`
