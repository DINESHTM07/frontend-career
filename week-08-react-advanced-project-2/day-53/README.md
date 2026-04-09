# Day 53 — Dashboard Build: 4 Chart Types with Recharts

**Status:** 📋 READY TO START
**Week:** 8 | **Theme:** React Advanced + Dashboard Project

---

## Today's Goal

Add four chart types to the dashboard using Recharts: Line, Bar, Pie, and Area. By end of today the Analytics page has all four charts displaying data from your mock data.

By end of today:
- Recharts installed and working
- Analytics page has: LineChart (revenue over time), BarChart (orders per day), PieChart (revenue by product), AreaChart (users over time)
- All charts are responsive (`ResponsiveContainer`)
- All charts have custom tooltips
- All charts work in dark mode

---

## Before You Start

Open `project-starters/dashboard-complete/src/pages/AnalyticsPage.tsx` and `dashboard-complete/src/components/charts/`. Study how Recharts is used — what props each chart takes, how ResponsiveContainer is used, what a custom tooltip looks like. Then close it and build from memory.

---

## Morning (8:00 – 11:00 AM) — Install + LineChart

### Step 1 — Install Recharts

```bash
npm install recharts
npm install -D @types/recharts  # may already be included with recharts
```

### Step 2 — Read the Recharts Pattern

Every Recharts chart follows the same structure:
```tsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip content={<CustomTooltip />} />
    <Legend />
    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
  </LineChart>
</ResponsiveContainer>
```

The key insight: `data` is an array of objects. `dataKey` tells Recharts which property to use for each axis or line.

### Step 3 — Build a Custom Tooltip

The default tooltip works, but a custom one looks professional:

```tsx
// src/components/charts/ChartTooltip.tsx
interface TooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

export default function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      {payload.map(entry => (
        <p key={entry.name} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}
```

### Step 4 — Build the Revenue Line Chart

```tsx
// src/components/charts/RevenueLineChart.tsx
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'
import type { DailyRevenue } from '../../types'
import ChartTooltip from './ChartTooltip'

interface Props {
  data: DailyRevenue[]
}

export default function RevenueLineChart({ data }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Revenue Over Time
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

---

## Midday (11:20 AM – 1:30 PM) — Bar, Pie, Area Charts

### BarChart — Orders Per Day

```tsx
// src/components/charts/OrdersBarChart.tsx
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'
import type { DailyRevenue } from '../../types'
import ChartTooltip from './ChartTooltip'

export default function OrdersBarChart({ data }: { data: DailyRevenue[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Daily Active Users
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} interval={4} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="users" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

### PieChart — Revenue by Product

```tsx
// src/components/charts/RevenuePieChart.tsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const pieData = [
  { name: 'Pro Plan', value: 45 },
  { name: 'Starter Plan', value: 25 },
  { name: 'Enterprise', value: 20 },
  { name: 'Add-ons', value: 10 },
]

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']

export default function RevenuePieChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Revenue by Product
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="45%"
            outerRadius={90}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
            labelLine={false}
          >
            {pieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
```

### AreaChart — Users Over Time

```tsx
// src/components/charts/UsersAreaChart.tsx
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'
import type { DailyRevenue } from '../../types'
import ChartTooltip from './ChartTooltip'

export default function UsersAreaChart({ data }: { data: DailyRevenue[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        User Growth
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} interval={4} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#usersGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
```

### Wire Up Analytics Page

```tsx
// src/pages/AnalyticsPage.tsx
import RevenueLineChart from '../components/charts/RevenueLineChart'
import OrdersBarChart from '../components/charts/OrdersBarChart'
import RevenuePieChart from '../components/charts/RevenuePieChart'
import UsersAreaChart from '../components/charts/UsersAreaChart'
import { dailyRevenue } from '../data/mockData'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RevenueLineChart data={dailyRevenue} />
        <OrdersBarChart data={dailyRevenue} />
        <RevenuePieChart />
        <UsersAreaChart data={dailyRevenue} />
      </div>
    </div>
  )
}
```

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-53-dsa.js` in this folder.

---

## End of Day Checklist

- [ ] Studied complete version's chart components before building
- [ ] Recharts installed — no import errors
- [ ] `ChartTooltip` built — renders label + payload entries with correct colors
- [ ] `RevenueLineChart` renders with correct data, x/y axis labels, custom tooltip
- [ ] `OrdersBarChart` renders with bars, rounded corners, correct color
- [ ] `RevenuePieChart` renders with 4 slices, correct colors, legend
- [ ] `UsersAreaChart` renders with gradient fill, area under the line
- [ ] Analytics page shows all 4 charts in a 2-column grid (1-col on mobile)
- [ ] All charts resize correctly when window is resized (ResponsiveContainer works)
- [ ] Charts look correct in dark mode (background, text, grid lines)
- [ ] Zero TypeScript errors across all chart components
- [ ] Completed 3 DSA problems in `day-53-dsa.js`

---

*Four chart types, one custom tooltip, one data source. This is what every data dashboard in the world is made of.*
