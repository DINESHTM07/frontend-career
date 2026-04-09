# Day 54 — Dashboard: Dark Mode Polish + Responsive + CSV Export + Deploy

**Status:** 📋 READY TO START
**Week:** 8 | **Theme:** React Advanced + Dashboard Project

---

## Today's Goal

Today you ship Project 2. Polish, export feature, deploy, update your portfolio and resume, post on LinkedIn.

By end of today:
- Dashboard passes a full quality check (dark mode, responsive, no console errors)
- CSV export works from the Reports page
- Dashboard is live on Vercel with a public URL
- Portfolio updated with Project 2
- Resume updated with Project 2 bullets
- LinkedIn post published

---

## Morning (8:00 – 11:00 AM) — Polish + CSV Export

### Step 1 — Final Quality Check

Work through this list systematically. Do not ship without checking each one.

**Dark mode:**
- [ ] All pages look correct in dark mode — no white boxes, no invisible text
- [ ] Recharts charts: axis text, grid lines, and backgrounds look correct in dark mode
- [ ] Cards, table, sidebar, header all correct in dark mode
- [ ] Persists on page refresh

**Responsive:**
- [ ] At 375px: sidebar collapses, cards stack to 1 column, table scrolls horizontally, charts resize
- [ ] At 768px (tablet): layout looks reasonable, no broken overflow
- [ ] At 1280px+: full layout with sidebar open, 4-column stats grid, 2-column charts

**Code quality:**
- [ ] No `console.log` statements in any file (search with Ctrl+Shift+F)
- [ ] No unused imports
- [ ] Zero TypeScript errors (`npm run build` should produce zero errors)
- [ ] No commented-out code

### Step 2 — CSV Export

Add a CSV export button to the Reports page. When clicked, it downloads the `recentOrders` data as a `.csv` file.

```tsx
// src/utils/exportCsv.ts
import type { OrderRow } from '../types'

export function exportToCsv(data: OrderRow[], filename: string): void {
  const headers = ['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date']

  const rows = data.map(row => [
    row.id,
    row.customer,
    row.product,
    `$${row.amount}`,
    row.status,
    row.date,
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}
```

Wire it to the Reports page:

```tsx
// src/pages/ReportsPage.tsx
import { exportToCsv } from '../utils/exportCsv'
import OrdersTable from '../components/ui/OrdersTable'
import { recentOrders } from '../data/mockData'

export default function ReportsPage() {
  const handleExport = () => {
    exportToCsv(recentOrders, 'dashboard-orders.csv')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Orders</h2>
        </div>
        <OrdersTable orders={recentOrders} />
      </div>
    </div>
  )
}
```

Test the export: click the button → a `.csv` file should download → open it in Excel or a text editor → verify the data is correct.

---

## Midday (11:20 AM – 1:00 PM) — Deploy to Vercel

### Step 1 — Run the production build locally

```bash
npm run build
npm run preview
```

Test the preview on `localhost:4173`. Check every page. Fix any build errors before deploying.

### Step 2 — Create a GitHub repo for the dashboard

The dashboard should have its own repository (separate from the monorepo).

```bash
cd project-starters/dashboard-starter

git init
git add .
git commit -m "Initial commit: Analytics Dashboard"

# Create new repo on GitHub: analytics-dashboard (or similar)
git remote add origin https://github.com/YOUR_USERNAME/analytics-dashboard.git
git branch -M main
git push -u origin main
```

### Step 3 — Deploy on Vercel

1. Go to **vercel.com** → New Project
2. Import `analytics-dashboard`
3. Build Command: `npm run build` | Output Directory: `dist` | Root: `/`
4. Click Deploy → wait for green ✓
5. Copy your live URL

**Test the live URL:**
- All 4 pages load
- Charts render
- Dark mode toggle works and persists
- Sidebar toggle works
- CSV export downloads a file
- Responsive layout works on mobile

---

## Afternoon (1:30 – 4:00 PM) — Portfolio + Resume + LinkedIn

### Step 1 — Update portfolio

Open `portfolio/data/projects.js`. Add:

```js
{
  name: "Analytics Dashboard",
  description: "Analytics dashboard with real-time data visualization. 4 chart types (Line, Bar, Pie, Area) with Recharts. TypeScript throughout. Dark mode, responsive layout, CSV export. Built with React, TypeScript, Recharts, and Tailwind CSS.",
  techStack: ["React", "TypeScript", "Recharts", "Tailwind CSS", "React Router"],
  liveUrl: "https://your-dashboard.vercel.app",    // PASTE YOUR REAL URL
  githubUrl: "https://github.com/YOUR_USERNAME/analytics-dashboard",
  featured: true,
}
```

Push portfolio — Vercel auto-deploys.

### Step 2 — Update resume

Open `resume/resume-content.md`. Add to Projects section:

```markdown
**Analytics Dashboard** | [Live](https://your-url.vercel.app) | [GitHub](https://github.com/your/repo)
- Built a data analytics dashboard with 4 chart types (Line, Bar, Pie, Area) using Recharts
- Implemented dark mode with Tailwind CSS class strategy — persisted via localStorage
- Typed all components, props, and data with TypeScript — zero `any` types
- Added CSV export feature — downloads order data as a formatted .csv file
- Responsive layout (sidebar collapses on mobile, charts resize via ResponsiveContainer)
Tech: React 18, TypeScript, Recharts, Tailwind CSS, React Router v6
```

### Step 3 — LinkedIn Post

Post this today with the live URL — do not schedule for later.

> Just shipped Project 2 — an Analytics Dashboard built with React + TypeScript!
>
> What's inside:
> ✅ 4 chart types — Line, Bar, Pie, Area (Recharts)
> ✅ KPI stat cards with trend indicators (up/down)
> ✅ Orders table with status badges
> ✅ Dark mode — persisted across sessions
> ✅ Fully responsive — works on mobile
> ✅ CSV export — downloads data as a .csv file
> ✅ TypeScript throughout — zero `any` types
>
> Tech: React, TypeScript, Recharts, Tailwind CSS, React Router
>
> Live: [paste URL]
> GitHub: [paste URL]
>
> Week 8 of 12 done. The job hunt starts at Week 12 but I'm building the portfolio now.
>
> #react #typescript #frontend #buildinpublic #100daysofcode

---

## End of Day Checklist

**Polish:**
- [ ] All pages pass dark mode check — no invisible text or white boxes
- [ ] Responsive at 375px — cards stack, table scrolls, sidebar collapses
- [ ] `npm run build` — zero TypeScript errors, zero warnings
- [ ] No `console.log` in any file
- [ ] CSV export downloads correctly — data is accurate

**Deploy:**
- [ ] `npm run build && npm run preview` — tested locally before deploying
- [ ] New GitHub repo created for the dashboard
- [ ] Deployed to Vercel — have a live URL
- [ ] Live URL tested on all 4 pages
- [ ] CSV export works on the live URL

**Portfolio + Resume:**
- [ ] `portfolio/data/projects.js` updated with live URL + GitHub link
- [ ] Portfolio live — new project visible
- [ ] `resume/resume-content.md` updated with 5 impact-first bullet points

**Content:**
- [ ] LinkedIn post published with live URL — not just drafted, actually posted
- [ ] Live URL written here: _______________

**Monorepo:**
- [ ] Final commit pushed to `frontend-career` main

---

## Week 8 Reflection

Write in `journal.md` — **"Week 8: Going Advanced"**:

- What was harder than expected? (TypeScript? Recharts? Dark mode?)
- What clicked that didn't before?
- What pattern will you use in every project from now on?
- What would you add if you had two more days?

---

*Two deployed projects. Two live URLs in your portfolio. That's the difference between someone who studied React and someone who built things with React. Keep going.*
