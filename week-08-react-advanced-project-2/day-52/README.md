# Day 52 — Dashboard Build: StatCards + Mock Data

**Status:** 📋 READY TO START
**Week:** 8 | **Theme:** React Advanced + Dashboard Project

---

## Today's Goal

Build the StatCard components and populate the Overview page with real-looking mock data. By end of today the Overview page looks like an actual dashboard — four metric cards showing revenue, users, orders, and conversion rate.

By end of today:
- Mock data is centralized in `src/data/mockData.ts` (typed with TypeScript)
- `StatCard` component is built, typed, and handles a trend indicator (up/down)
- Overview page renders 4 StatCards in a responsive grid
- A simple data table renders below the cards

---

## Before You Start

Open `project-starters/dashboard-complete/src/data/` and `project-starters/dashboard-complete/src/components/ui/`. Study how mock data is structured and what the StatCard component looks like. You are NOT copying — you're understanding the shape so your version makes sense.

---

## Morning (8:00 – 11:00 AM) — Mock Data + Types

### Step 1 — Define your TypeScript types

Create `src/types/index.ts`:

```ts
export interface StatCardData {
  id: string
  label: string
  value: string | number
  change: number          // percentage change, e.g. 12.5 means +12.5%
  changeDirection: 'up' | 'down' | 'neutral'
  prefix?: string         // e.g. '$' for currency
  suffix?: string         // e.g. '%' for percentage
}

export interface OrderRow {
  id: string
  customer: string
  product: string
  amount: number
  status: 'completed' | 'pending' | 'cancelled'
  date: string
}

export interface DailyRevenue {
  date: string            // 'Jan 1', 'Jan 2', etc.
  revenue: number
  users: number
}
```

### Step 2 — Create mock data

Create `src/data/mockData.ts`:

```ts
import type { StatCardData, OrderRow, DailyRevenue } from '../types'

export const statCards: StatCardData[] = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '48,295',
    change: 12.5,
    changeDirection: 'up',
    prefix: '$',
  },
  {
    id: 'users',
    label: 'Active Users',
    value: '3,842',
    change: 8.1,
    changeDirection: 'up',
  },
  {
    id: 'orders',
    label: 'Total Orders',
    value: '1,247',
    change: 3.2,
    changeDirection: 'down',
  },
  {
    id: 'conversion',
    label: 'Conversion Rate',
    value: '5.4',
    change: 0.8,
    changeDirection: 'up',
    suffix: '%',
  },
]

export const recentOrders: OrderRow[] = [
  { id: 'ORD-001', customer: 'Alice Johnson', product: 'Pro Plan', amount: 99, status: 'completed', date: '2026-04-08' },
  { id: 'ORD-002', customer: 'Bob Martinez', product: 'Starter Plan', amount: 29, status: 'pending', date: '2026-04-08' },
  { id: 'ORD-003', customer: 'Carol Lee', product: 'Enterprise Plan', amount: 499, status: 'completed', date: '2026-04-07' },
  { id: 'ORD-004', customer: 'David Kim', product: 'Pro Plan', amount: 99, status: 'cancelled', date: '2026-04-07' },
  { id: 'ORD-005', customer: 'Emma White', product: 'Starter Plan', amount: 29, status: 'completed', date: '2026-04-06' },
]

// 30 days of revenue data — used for charts on Day 53
export const dailyRevenue: DailyRevenue[] = Array.from({ length: 30 }, (_, i) => ({
  date: `Apr ${i + 1}`,
  revenue: Math.floor(Math.random() * 5000) + 1000,
  users: Math.floor(Math.random() * 200) + 50,
}))
```

---

## Midday (11:20 AM – 1:30 PM) — Build StatCard + Overview Page

### Build StatCard

```tsx
// src/components/ui/StatCard.tsx
import type { StatCardData } from '../../types'

interface StatCardProps {
  data: StatCardData
}

export default function StatCard({ data }: StatCardProps) {
  const { label, value, change, changeDirection, prefix, suffix } = data

  const trendColor = changeDirection === 'up'
    ? 'text-green-600 dark:text-green-400'
    : changeDirection === 'down'
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-500'

  const trendIcon = changeDirection === 'up' ? '▲' : changeDirection === 'down' ? '▼' : '—'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
        {prefix}{value}{suffix}
      </p>
      <p className={`mt-1 text-sm font-medium ${trendColor}`}>
        {trendIcon} {Math.abs(change)}% vs last month
      </p>
    </div>
  )
}
```

### Build Overview Page

```tsx
// src/pages/OverviewPage.tsx
import StatCard from '../components/ui/StatCard'
import OrdersTable from '../components/ui/OrdersTable'
import { statCards, recentOrders } from '../data/mockData'

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(card => (
          <StatCard key={card.id} data={card} />
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
        </div>
        <OrdersTable orders={recentOrders} />
      </div>
    </div>
  )
}
```

### Build OrdersTable

```tsx
// src/components/ui/OrdersTable.tsx
import type { OrderRow } from '../../types'

const statusStyles: Record<OrderRow['status'], string> = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
}

interface OrdersTableProps {
  orders: OrderRow[]
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase">
          <tr>
            {['Order', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map(col => (
              <th key={col} className="px-6 py-3">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-t border-gray-100 dark:border-gray-700">
              <td className="px-6 py-4 font-mono text-gray-500">{order.id}</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{order.customer}</td>
              <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{order.product}</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">${order.amount}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-52-dsa.js` in this folder.

---

## End of Day Checklist

- [ ] Studied complete version's `data/` and `components/ui/` before building
- [ ] Created `src/types/index.ts` with `StatCardData`, `OrderRow`, `DailyRevenue` interfaces
- [ ] Created `src/data/mockData.ts` with typed `statCards`, `recentOrders`, `dailyRevenue`
- [ ] Built `StatCard` component — displays label, value, trend direction + color
- [ ] Built `OrdersTable` component — status badge has correct color per status
- [ ] Overview page renders 4 StatCards in a responsive grid (4 cols on wide, 1 on mobile)
- [ ] Overview page renders the orders table below the cards
- [ ] Dark mode looks correct on both StatCard and OrdersTable
- [ ] No TypeScript errors in any new file
- [ ] Completed 3 DSA problems in `day-52-dsa.js`

---

*Every dashboard in the world is basically StatCards + a table + charts. You now have two of the three.*
