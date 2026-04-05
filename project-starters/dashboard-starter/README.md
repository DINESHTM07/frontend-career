# DataPulse 📊

A fully-featured analytics dashboard built with Vite + React + TypeScript + Tailwind CSS.
Powered by mock data — swap in a real API by replacing the files in `src/data/`.

---

## Tech Stack

| Tool | Version | Why |
|------|---------|-----|
| **Vite** | 5.x | Near-instant dev server, fast HMR |
| **React** | 18.x | Component model, hooks, Context API |
| **TypeScript** | 5.x | Type safety across all data shapes |
| **Tailwind CSS** | 3.x | Utility-first styling, dark mode via class |
| **Recharts** | 2.x | Composable SVG charts, responsive containers |

---

## Features (to build)

- **4 StatCards** — Revenue, Users, Orders, Traffic with trend indicators
- **4 chart types** — LineChart, BarChart, PieChart, AreaChart (all dark-mode aware)
- **DataTable** — Sortable columns (any key), pagination (10/page), CSV export
- **Date range filter** — Preset buttons (7d, 30d, 90d, YTD, All) + custom date inputs
- **Dark/light mode** — Context API, no flash on load, persists to localStorage
- **Fully typed** — TypeScript interfaces for every data shape and component prop
- **Responsive** — 1-col mobile, 2-col tablet, 4-col desktop

---

## Project Structure

```
src/
├── types/
│   └── index.ts               # All TypeScript types — READ THIS FIRST
│
├── context/
│   └── ThemeContext.tsx        # TODO (Day 6): implement localStorage persistence
│
├── data/                       # Fully working mock data — no changes needed
│   ├── revenueData.ts
│   ├── categoryData.ts
│   ├── trafficData.ts
│   ├── usersData.ts
│   └── tableData.ts
│
├── utils/
│   ├── csvExport.ts            # TODO (Day 6): implement CSV download
│   └── dateFilter.ts           # TODO (Day 6): implement filter + presets
│
├── components/
│   ├── layout/
│   │   ├── Layout.tsx          # Working shell — build Sidebar + Header inside
│   │   ├── Sidebar.tsx         # TODO (Day 1): build nav panel + mobile overlay
│   │   └── Header.tsx          # TODO (Day 1): build top bar + notifications
│   │
│   ├── ui/
│   │   ├── StatCard.tsx        # TODO (Day 2): build KPI card with trend badge
│   │   ├── DarkModeToggle.tsx  # TODO (Day 6): add proper SVG icons + persistence
│   │   └── DateRangePicker.tsx # TODO (Day 6): implement preset detection + styling
│   │
│   ├── charts/
│   │   ├── RevenueLineChart.tsx     # TODO (Day 3)
│   │   ├── CategoryBarChart.tsx     # TODO (Day 3)
│   │   ├── TrafficPieChart.tsx      # TODO (Day 4)
│   │   └── DailyUsersAreaChart.tsx  # TODO (Day 4)
│   │
│   └── table/
│       └── DataTable.tsx       # TODO (Day 5): implement sort + pagination
│
└── pages/
    └── Dashboard.tsx           # Working orchestrator — all sections wired up
```

---

## Setup

```bash
cd project-starters/dashboard-starter
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — you'll see placeholder cards and chart containers. Replace them day by day following TASKS.md.

```bash
npm run typecheck   # check TypeScript without building
npm run build       # tsc + Vite production build
```

---

## Architecture Decisions (understand before building)

### Why Context API for theme (not Zustand)?
Theme is a single boolean — no complex derived state. Context is React-idiomatic
for cross-cutting values. More importantly: Recharts renders SVG (not HTML), so
Tailwind `dark:` classes don't work on chart elements. Chart components read
`isDark` from Context and pass hex colors directly to SVG props.

### Why data files are separate from chart components
Charts are display components — they shouldn't know where data comes from.
Swapping to a real API means only changing `src/data/` files. Chart components stay identical.

### Why filter orders in Dashboard (not in DataTable)
Dashboard needs the filtered count for the header label. If filtering happened
inside DataTable, Dashboard couldn't access that count without adding prop drilling.

### Why string comparison for date filtering
ISO 8601 (`YYYY-MM-DD`) sorts lexicographically == chronologically.
`new Date('2024-03-01')` creates UTC midnight which shifts in local timezones.
String comparison is simpler and correct for this format.

### Why sort cycle: null → asc → desc → null
Third click resets to original order (by ID/date). Two-state sort (asc ↔ desc)
has no escape back to original without a page refresh.
