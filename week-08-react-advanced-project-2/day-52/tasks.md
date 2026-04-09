# Day 52 Tasks — Dashboard Build: StatCards + Mock Data

## Morning Block (8:00 – 11:00 AM) — Study + Types + Data
- [ ] Open `dashboard-complete/src/data/` — study the mock data structure
- [ ] Open `dashboard-complete/src/components/ui/` — study the StatCard implementation
- [ ] Create `src/types/index.ts` with `StatCardData` interface (id, label, value, change, changeDirection, prefix?, suffix?)
- [ ] Add `OrderRow` interface to `src/types/index.ts`
- [ ] Add `DailyRevenue` interface to `src/types/index.ts`
- [ ] Create `src/data/mockData.ts`
- [ ] Add 4 entries to `statCards` array — typed as `StatCardData[]`
- [ ] Add 5 entries to `recentOrders` array — typed as `OrderRow[]`
- [ ] Add 30 days of `dailyRevenue` data using `Array.from` — typed as `DailyRevenue[]`
- [ ] All types import correctly — no TypeScript errors

## Midday Block (11:20 AM – 1:30 PM) — Build Components
- [ ] Create `src/components/ui/StatCard.tsx`
  - [ ] Accepts `data: StatCardData` prop
  - [ ] Renders label, formatted value (with prefix/suffix)
  - [ ] Renders trend: green/▲ for up, red/▼ for down, gray/— for neutral
  - [ ] Dark mode styles applied
- [ ] Create `src/components/ui/OrdersTable.tsx`
  - [ ] Accepts `orders: OrderRow[]` prop
  - [ ] Status badge has 3 color variants: green (completed), yellow (pending), red (cancelled)
  - [ ] `statusStyles` is a `Record<OrderRow['status'], string>` — no if/else needed
  - [ ] Table is horizontally scrollable on small screens
  - [ ] Dark mode styles applied
- [ ] Update `src/pages/OverviewPage.tsx`
  - [ ] Import `statCards` and `recentOrders` from mockData
  - [ ] Render 4 StatCards in grid: 1 col mobile, 2 col tablet, 4 col desktop
  - [ ] Render OrdersTable below the cards inside a white/dark card container
- [ ] Test at 375px width — cards stack to 1 column, table scrolls horizontally
- [ ] Test dark mode — all text readable, no invisible elements
- [ ] Zero TypeScript errors in `types/index.ts`, `mockData.ts`, `StatCard.tsx`, `OrdersTable.tsx`

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-52-dsa.js` in `week-08-react-advanced-project-2/day-52/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Run: `git add . && git commit -m "Day 52: StatCards + OrdersTable + mock data + DSA"`
