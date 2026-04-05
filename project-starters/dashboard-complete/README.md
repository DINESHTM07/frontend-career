# DataPulse 📊

A fully-featured analytics dashboard built with Vite + React + TypeScript + Tailwind CSS.
Powered by mock data — swap in a real API by replacing the files in `src/data/`.

---

## Screenshots

| Light Mode | Dark Mode |
|---|---|
| *(Add screenshot)* | *(Add screenshot)* |

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

## Features

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
│   └── index.ts               # All TypeScript types (single source of truth)
│
├── context/
│   └── ThemeContext.tsx        # Dark/light mode via Context API + localStorage
│
├── data/                       # Mock data (replace with API calls)
│   ├── revenueData.ts          # Monthly revenue vs target (2024)
│   ├── categoryData.ts         # Sales + returns by product category
│   ├── trafficData.ts          # Traffic sources (organic, direct, social, etc.)
│   ├── usersData.ts            # Daily new + returning users (30 days)
│   └── tableData.ts            # 50 mock orders with varied dates + statuses
│
├── utils/
│   ├── csvExport.ts            # Generic CSV download utility
│   └── dateFilter.ts           # filterByDateRange + date preset helpers
│
├── components/
│   ├── layout/
│   │   ├── Layout.tsx          # Shell: sidebar + header + scrollable main
│   │   ├── Sidebar.tsx         # Navigation panel (overlay on mobile)
│   │   └── Header.tsx          # Top bar: title, notifications, user, theme toggle
│   │
│   ├── ui/
│   │   ├── StatCard.tsx        # KPI metric with value + trend badge
│   │   ├── DarkModeToggle.tsx  # Sun/moon button reading ThemeContext
│   │   └── DateRangePicker.tsx # Preset buttons + custom date inputs
│   │
│   ├── charts/
│   │   ├── RevenueLineChart.tsx     # Monthly revenue + target (two lines)
│   │   ├── CategoryBarChart.tsx     # Sales vs returns per category
│   │   ├── TrafficPieChart.tsx      # Acquisition channel breakdown
│   │   └── DailyUsersAreaChart.tsx  # New vs returning users (stacked areas)
│   │
│   └── table/
│       └── DataTable.tsx       # Sortable + paginated + CSV-exportable table
│
└── pages/
    └── Dashboard.tsx           # Main page: composes all sections
```

---

## Setup

```bash
cd project-starters/dashboard-complete
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build       # TypeScript check + Vite production build
npm run typecheck   # Type-check without building
npm run preview     # Preview production build
```

---

## Architecture Decisions

### Why Context API for theme (not Zustand)?
Theme is a single boolean with no complex derived state or actions.
Context is the React-standard solution for simple cross-cutting values.
Zustand would be correct if theme interacted with other state slices.

### Why does ThemeContext matter for Recharts?
Recharts renders SVG — Tailwind's `dark:` classes don't affect SVG attributes.
Components read `isDark` from ThemeContext and pass hex colors directly to
Recharts props (`stroke`, `fill`, `tick.fill`). Without Context, there'd
be no way for charts to react to theme changes.

### Why mock data in separate files (not inline in charts)?
Charts are display components — they shouldn't know where data comes from.
Separating data means swapping to a real API only changes the data files.
All chart components remain identical.

### Why `filterByDateRange` in a utility (not inside DataTable)?
Dashboard needs to know the filtered count for the table header ("X orders").
If filtering happened inside DataTable, Dashboard couldn't access that count.
Filtering in the parent and passing filtered data down follows the single
responsibility principle and keeps DataTable's API simple.

### Why the DataTable sort cycles null → asc → desc → null?
Three-state sort gives users a clear way to "undo" a sort and return to
original order (by date, the natural order of the mock data). Two-state
sort (asc ↔ desc) has no way back to the original without refreshing.

### Why `string` comparison for ISO dates in dateFilter.ts?
ISO 8601 (`YYYY-MM-DD`) sorts lexicographically the same as chronologically.
Using `new Date()` introduces timezone ambiguity — `new Date('2024-03-01')`
creates UTC midnight, which shifts when converted to local time in some locales.

---

## Extending This App

**Connect to a real API:**
Replace the data files in `src/data/` with fetch calls or React Query hooks.
The chart and table components accept the same TypeScript types — no changes needed.

**Add React Query:**
```bash
npm install @tanstack/react-query
```
Wrap `main.tsx` in `<QueryClientProvider>` and replace each data file with a `useQuery` hook.

**Add routing:**
```bash
npm install react-router-dom
```
Replace the `activeNav` state in `App.tsx` with `<Routes>` and create separate page components.

**Add real authentication:**
Add an `AuthContext` alongside `ThemeContext`, with a `ProtectedRoute` wrapper
that redirects to `/login` if the user is not authenticated.
