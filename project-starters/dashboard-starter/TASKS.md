# DataPulse — 7-Day Build Guide

Build this analytics dashboard from scratch, one feature at a time.
Compare your work to `project-starters/dashboard-complete/` at any point.

---

## Day 1 — Project Setup + Layout Shell

**Goal:** Get the skeleton running with sidebar, header, and a placeholder main area.

**What you're building:**
```
┌────────────┬───────────────────────────────────┐
│  Sidebar   │  Header                           │
│  ─────────  │  ─────────────────────────────── │
│  Dashboard  │  (placeholder content)           │
│  Analytics  │                                  │
│  Orders     │                                  │
│  Users      │                                  │
│  Settings   │                                  │
└────────────┴───────────────────────────────────┘
```

**Files to create:**
- `src/types/index.ts` — define TypeScript interfaces (copy or write your own)
- `src/components/layout/Layout.tsx` — flex container: sidebar + main column
- `src/components/layout/Sidebar.tsx` — nav panel, responsive overlay on mobile
- `src/components/layout/Header.tsx` — top bar with hamburger + title + user
- `src/App.tsx` — render `<Layout>` with placeholder content

**Layout checklist:**
- [ ] `h-screen overflow-hidden` on the outer container (only main area scrolls)
- [ ] Sidebar: `w-64`, fixed on left for lg+, overlay for mobile
- [ ] Mobile hamburger: `lg:hidden` button opens sidebar overlay
- [ ] Backdrop (black/50): clicking it closes the mobile sidebar
- [ ] Header: `sticky top-0 z-10` so it stays visible on scroll
- [ ] Main content area: `flex-1 overflow-y-auto` for independent scroll

**Key concept:** Why `h-screen overflow-hidden` on the outer div + `overflow-y-auto` on main?
If the page itself scrolled, the sidebar and header would disappear off screen.
Fixing the outer div to full-viewport height and giving ONLY main its own scroll
keeps the chrome (sidebar, header) always visible.

**Done when:** The layout renders on all screen sizes. Sidebar opens/closes on mobile.

---

## Day 2 — TypeScript Types + Mock Data + StatCards

**Goal:** Define all data shapes and display the 4 KPI stat cards.

**Files to create:**
- `src/types/index.ts` — all interfaces: `Order`, `RevenueDataPoint`, `StatMetric`, etc.
- `src/data/revenueData.ts` — 12 months of revenue data
- `src/data/tableData.ts` — 50 mock orders
- `src/data/trafficData.ts` — 5 traffic sources
- `src/data/usersData.ts` — 30 days of daily user counts
- `src/components/ui/StatCard.tsx` — KPI card with value + trend

**StatCard checklist:**
- [ ] Accepts `metric: StatMetric` prop (not individual props — lets you map() over an array)
- [ ] Shows: icon, title, large value, change % badge with arrow
- [ ] Change badge: green if positive, red if negative (use `isGood` logic)
- [ ] `inverse` prop: for metrics where decrease = good (e.g. cancellations)
- [ ] Four color variants: blue, green, purple, orange
- [ ] `animate-fadeIn` with staggered `animationDelay` per card

**TypeScript checklist:**
- [ ] `interface Order` has status as a union type: `'completed' | 'pending' | 'cancelled' | 'refunded'`
- [ ] `interface StatMetric` bundles all card data (value, change, icon, color)
- [ ] `type SortConfig = { key: keyof Order; direction: 'asc' | 'desc' }`

**Key concept:** Why `keyof Order` for sort config (not `string`)?
`keyof Order` restricts the sort key to actual properties of Order.
If you rename a field, TypeScript immediately tells you where sort breaks.
With `string`, you'd get runtime errors only.

**Done when:** 4 stat cards render in a responsive grid (1 → 2 → 4 columns).

---

## Day 3 — Recharts: Line + Bar Charts

**Goal:** Build the first two charts — monthly revenue trend and category sales.

**Install Recharts:**
```bash
npm install recharts
```

**Files to create:**
- `src/components/charts/RevenueLineChart.tsx` — two lines: actual vs target
- `src/components/charts/CategoryBarChart.tsx` — grouped bars: sales vs returns

**Recharts checklist (apply to both charts):**
- [ ] `<ResponsiveContainer width="100%" height={320}>` wraps every chart
- [ ] `<CartesianGrid strokeDasharray="3 3" vertical={false}>` for horizontal gridlines only
- [ ] `<XAxis tickLine={false}>` and `<YAxis axisLine={false} tickLine={false}>`
- [ ] Custom `<Tooltip content={<CustomTooltip />}>` — styled with Tailwind classes
- [ ] Read `isDark` from `useTheme()` and pass hex colors to `stroke`, `tick.fill`, etc.

**Dark mode in Recharts:**
```tsx
const { isDark } = useTheme()
const gridColor = isDark ? '#374151' : '#f3f4f6'
const axisColor = isDark ? '#9ca3af' : '#9ca3af'
// Pass these to CartesianGrid stroke, XAxis tick.fill, etc.
```
You can't use Tailwind dark: variants inside SVG elements — only JS conditionals work.

**RevenueLineChart specifics:**
- [ ] Two `<Line>` elements: `dataKey="revenue"` (solid) and `dataKey="target"` (dashed)
- [ ] Dashed target line: `strokeDasharray="5 5"` and `dot={false}`
- [ ] YAxis formatter: `$${(v/1000).toFixed(0)}k`
- [ ] Tooltip shows variance from target + percentage

**CategoryBarChart specifics:**
- [ ] `<Bar dataKey="sales">` and `<Bar dataKey="returns">`
- [ ] `radius={[4, 4, 0, 0]}` on each Bar (rounded top corners)
- [ ] Tooltip shows return rate percentage

**Done when:** Both charts render correctly in light and dark mode.

---

## Day 4 — Recharts: Pie + Area Charts

**Goal:** Complete the chart section with traffic sources and daily users.

**Files to create:**
- `src/components/charts/TrafficPieChart.tsx` — donut chart with custom legend
- `src/components/charts/DailyUsersAreaChart.tsx` — stacked areas: new + returning

**TrafficPieChart checklist:**
- [ ] `<Pie innerRadius={55} outerRadius={100} paddingAngle={3}>`
- [ ] `<Cell fill={entry.color}>` for each data point (colors from data file)
- [ ] Custom legend showing name + session count + percentage (not just colored dots)
- [ ] Custom tooltip showing source, count, and % of total

**DailyUsersAreaChart checklist:**
- [ ] Two `<Area>` elements with `stackId="users"` to stack them
- [ ] SVG gradient fills defined in `<defs>`:
  ```tsx
  <defs>
    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.3} />
      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
    </linearGradient>
  </defs>
  ```
- [ ] XAxis date formatter: show every 5th tick only (`index % 5 === 0`)
- [ ] Tooltip shows new %, returning count, and total

**Chart grid layout (Dashboard.tsx):**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  <RevenueLineChart />
  <CategoryBarChart />
  <DailyUsersAreaChart />
  <TrafficPieChart />
</div>
```

**Done when:** All 4 charts visible and interactive in both themes.

---

## Day 5 — DataTable with Sort + Pagination

**Goal:** Build the orders table with sortable columns and page controls.

**Files to create:**
- `src/components/table/DataTable.tsx` — full table component

**Sort implementation:**
```tsx
const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)

function handleSort(key: keyof Order) {
  setSortConfig(prev => {
    if (prev?.key !== key) return { key, direction: 'asc' }
    if (prev.direction === 'asc') return { key, direction: 'desc' }
    return null  // third click = clear sort
  })
}
```

**Sort cycle:** null → asc → desc → null (click same column 3x to reset)

**useMemo for sorting:**
```tsx
const sortedData = useMemo(() => {
  if (!sortConfig) return data
  return [...data].sort((a, b) => {
    const aVal = a[sortConfig.key]
    const bVal = b[sortConfig.key]
    const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal))
    return sortConfig.direction === 'asc' ? cmp : -cmp
  })
}, [data, sortConfig])
```

**Why `[...data]` before sort?** `Array.sort()` mutates in place. Spreading creates a new array so React can detect the change. Mutating the original array causes subtle bugs where the UI doesn't re-render.

**Pagination checklist:**
- [ ] `const PAGE_SIZE = 10`
- [ ] `pageStart = (currentPage - 1) * PAGE_SIZE`
- [ ] `pageRows = sortedData.slice(pageStart, pageStart + PAGE_SIZE)`
- [ ] "Showing X–Y of Z" footer text
- [ ] Prev / next buttons (disabled at boundaries)
- [ ] Page number buttons with ellipsis for large page counts
- [ ] Reset to page 1 when sort changes (`setCurrentPage(1)` in `handleSort`)

**Status badge colors:**
```tsx
const STATUS_STYLES = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending:   'bg-yellow-100 text-yellow-700 ...',
  cancelled: 'bg-red-100 text-red-600 ...',
  refunded:  'bg-gray-100 text-gray-600 ...',
}
```

**Done when:** All 50 rows accessible across 5 pages; clicking column headers sorts.

---

## Day 6 — CSV Export + Date Filter + Dark Mode

**Goal:** Add the CSV export utility, date range filter, and theme toggle.

**Files to create:**
- `src/utils/csvExport.ts` — generic CSV download
- `src/utils/dateFilter.ts` — filter + date presets
- `src/context/ThemeContext.tsx` — Context API theme management
- `src/components/ui/DarkModeToggle.tsx` — sun/moon toggle button
- `src/components/ui/DateRangePicker.tsx` — preset buttons + date inputs

**csvExport.ts pattern:**
```ts
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; label: string }[]
): void {
  const header = columns.map(c => c.label).join(',')
  const rows   = data.map(row => columns.map(c => String(row[c.key] ?? '')).join(','))
  const csv    = [header, ...rows].join('\n')
  const blob   = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url    = URL.createObjectURL(blob)
  const a      = document.createElement('a')
  a.href = url; a.download = `${filename}.csv`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
```

**Why `URL.revokeObjectURL` matters:** Blob URLs are stored in browser memory until the page unloads. If you export many times without revoking, memory accumulates. `revokeObjectURL` frees it immediately.

**ThemeContext checklist:**
- [ ] `useState<Theme>` initialized from localStorage (lazy init function)
- [ ] `useEffect` adds/removes `dark` class on `document.documentElement`
- [ ] Saves to `localStorage.setItem('dashboard-theme', theme)` on change
- [ ] `toggleTheme()` flips between 'light' and 'dark'
- [ ] Custom `useTheme()` hook throws if used outside `<ThemeProvider>`

**DarkModeToggle checklist:**
- [ ] Reads `isDark` from `useTheme()` (NOT from localStorage directly)
- [ ] Shows ☀️ in dark mode, 🌙 in light mode
- [ ] `aria-pressed={isDark}` for screen readers

**DateRangePicker checklist:**
- [ ] 5 preset buttons: Last 7d, Last 30d, Last 90d, YTD, All
- [ ] Active preset has brand-colored background
- [ ] Two `<input type="date">` for custom start/end
- [ ] `max` on start input = current endDate (can't pick start after end)
- [ ] `min` on end input = current startDate

**Done when:** CSV downloads work; date filter narrows table rows; dark mode toggles with no flash.

---

## Day 7 — Polish + TypeScript Strictness + Deploy

**Goal:** Tighten types, fix any warnings, and deploy to Vercel.

**TypeScript polish checklist:**
```bash
npm run typecheck   # run tsc --noEmit
```
- [ ] No `any` types anywhere
- [ ] All component props have explicit interface types
- [ ] Chart custom tooltips use `TooltipProps<number, string>` from recharts
- [ ] `keyof Order` used for sort config (not string)
- [ ] `Record<Order['status'], string>` for status badge map

**Accessibility checklist:**
- [ ] All icon buttons have `aria-label`
- [ ] Sidebar nav buttons have `aria-current="page"` on active item
- [ ] DarkModeToggle has `aria-pressed`
- [ ] Table headers are `<th scope="col">`
- [ ] Empty state in table has a clear message

**Performance checklist:**
- [ ] Chart data computations inside `useMemo` (not naked in render)
- [ ] `filterByDateRange` result memoized in Dashboard
- [ ] Table sort computed with `useMemo` (already done in Day 5)

**Deploy to Vercel:**
```bash
npm run build   # must pass with no errors first

# Option 1: CLI
npm install -g vercel
vercel

# Option 2: GitHub → vercel.com → Import → Deploy
# Vercel auto-detects Vite (build: npm run build, output: dist)
```

**Final checklist:**
- [ ] `npm run build` completes with no TypeScript errors
- [ ] `npm run typecheck` passes cleanly
- [ ] Dark mode has no flash on page load (check index.html inline script)
- [ ] Table CSV export downloads correctly
- [ ] Date range filter correctly narrows table rows
- [ ] All 4 charts visible and responsive
- [ ] App works on 375px viewport (mobile)

---

## Quick Reference

### Data flow
```
src/data/ files
  → imported in Dashboard.tsx / chart components
  → filtered by dateFilter.ts utility (in Dashboard)
  → passed as props to DataTable
  → DataTable sorts + paginates locally
```

### Theme flow
```
index.html <script>       (prevents FOUC — runs before React)
  → ThemeContext.tsx      (React source of truth, reads/writes localStorage)
    → DarkModeToggle      (reads context, calls toggleTheme)
    → Recharts components (read isDark, pass hex colors to SVG props)
    → Tailwind dark: vars (respond to 'dark' class on <html>)
```

### Key Recharts components
| Component | Use case |
|-----------|----------|
| `<ResponsiveContainer>` | Makes chart fill parent width |
| `<CartesianGrid>` | Background gridlines |
| `<XAxis>` / `<YAxis>` | Axis labels + ticks |
| `<Tooltip content={...}>` | Custom hover tooltip |
| `<Legend>` | Auto-generated legend (or build custom) |
| `<Line>` | Single data series on LineChart |
| `<Bar>` | Single data series on BarChart |
| `<Area>` | Single data series on AreaChart |
| `<Pie>` / `<Cell>` | Slices on PieChart |

### CSS architecture
| Where | What |
|-------|------|
| `tailwind.config.js` | `brand-*` color scale, custom animations |
| `index.css @layer base` | Global resets, scrollbar, SVG transition disable |
| `index.css @layer utilities` | `animate-fadeIn` keyframes |
| Component classes | All Tailwind utilities inline |
