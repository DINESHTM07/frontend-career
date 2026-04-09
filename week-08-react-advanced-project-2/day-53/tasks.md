# Day 53 Tasks — Dashboard Build: 4 Chart Types with Recharts

## Morning Block (8:00 – 11:00 AM) — Study + Install + LineChart
- [ ] Open `dashboard-complete/src/components/charts/` — study chart components
- [ ] Open `dashboard-complete/src/pages/AnalyticsPage.tsx` — study how charts are composed
- [ ] Close complete version — build from memory and judgment
- [ ] Run: `npm install recharts`
- [ ] Create `src/components/charts/ChartTooltip.tsx` with typed `active`, `payload`, `label` props
- [ ] Tooltip renders: label at top, one line per payload entry with matching color
- [ ] Tooltip returns `null` when `!active || !payload?.length`
- [ ] Create `src/components/charts/RevenueLineChart.tsx`
  - [ ] Wrapped in `ResponsiveContainer width="100%" height={280}`
  - [ ] `CartesianGrid` with dashed stroke
  - [ ] `XAxis` with `dataKey="date"`, small font, no tick lines, interval=4
  - [ ] `YAxis` formatted as `$Xk` (divide by 1000)
  - [ ] `Tooltip content={<ChartTooltip />}`
  - [ ] `Line` with `type="monotone"`, blue stroke, `dot={false}`, `activeDot` visible
- [ ] RevenueLineChart renders correctly in browser — hover shows custom tooltip

## Midday Block (11:20 AM – 1:30 PM) — Bar + Pie + Area Charts
- [ ] Create `src/components/charts/OrdersBarChart.tsx`
  - [ ] `BarChart` with `dailyRevenue` data, `dataKey="users"`
  - [ ] `Bar` with purple fill and rounded top corners (`radius={[4,4,0,0]}`)
  - [ ] Custom tooltip works
- [ ] Create `src/components/charts/RevenuePieChart.tsx`
  - [ ] Static `pieData` array (4 products + values = 100%)
  - [ ] `COLORS` array with 4 distinct colors
  - [ ] Each `Cell` gets a color from COLORS array
  - [ ] Labels show name + percentage
- [ ] Create `src/components/charts/UsersAreaChart.tsx`
  - [ ] SVG `linearGradient` defined in `<defs>` with fade to transparent
  - [ ] `Area` uses `fill="url(#usersGradient)"` and green stroke
  - [ ] Custom tooltip works
- [ ] Update `src/pages/AnalyticsPage.tsx`
  - [ ] Import all 4 chart components
  - [ ] Import `dailyRevenue` from mockData
  - [ ] Render in 2-column grid (1 col on mobile, 2 on xl)
- [ ] Test: resize window — all charts resize smoothly
- [ ] Test: hover all 4 charts — custom tooltip appears on all
- [ ] Test: dark mode — charts readable, backgrounds correct
- [ ] Zero TypeScript errors across all chart files

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-53-dsa.js` in `week-08-react-advanced-project-2/day-53/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Run: `git add . && git commit -m "Day 53: 4 Recharts chart types on Analytics page + DSA"`
