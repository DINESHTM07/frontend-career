import { useState, useMemo } from 'react'
import type { DateRange, StatMetric } from '../types'
import StatCard from '../components/ui/StatCard'
import DateRangePicker from '../components/ui/DateRangePicker'
import RevenueLineChart from '../components/charts/RevenueLineChart'
import CategoryBarChart from '../components/charts/CategoryBarChart'
import TrafficPieChart from '../components/charts/TrafficPieChart'
import DailyUsersAreaChart from '../components/charts/DailyUsersAreaChart'
import DataTable from '../components/table/DataTable'
import { ordersData } from '../data/tableData'
import { totalRevenue2024, prevYearRevenue } from '../data/revenueData'
import { totalTraffic } from '../data/trafficData'
import { filterByDateRange } from '../utils/dateFilter'

/*
  Dashboard.tsx — Main page. Orchestrates all sections.

  TODO (Day 2): Define statMetrics array and render StatCards.
  TODO (Day 3): The chart placeholders below are replaced as you build each chart component.
  TODO (Day 5): DataTable is already wired — implement sorting inside the component.
  TODO (Day 6): Date range filtering is already wired — implement filterByDateRange util.

  State owned here:
  - dateRange: used to filter orders before passing to DataTable.
    Charts use fixed 2024 data (a real dashboard would re-fetch on date change).

  WHY filter in Dashboard (not inside DataTable):
  The order count shown in the DataTable header is a filtered count.
  If filtering happened inside DataTable, Dashboard couldn't access that number.
  Filtering in the parent and passing filtered data keeps DataTable's API simple.
*/

const yoyGrowth = (((totalRevenue2024 - prevYearRevenue) / prevYearRevenue) * 100).toFixed(1)

// TODO (Day 2): Review and customize these metrics, then build StatCard to display them.
const statMetrics: StatMetric[] = [
  {
    title:       'Total Revenue',
    value:       `$${(totalRevenue2024 / 1000).toFixed(1)}k`,
    rawValue:    totalRevenue2024,
    change:      parseFloat(yoyGrowth),
    changeLabel: 'vs last year',
    icon:        '💰',
    color:       'blue',
  },
  {
    title:       'Active Users',
    value:       '18,492',
    rawValue:    18492,
    change:      8.2,
    changeLabel: 'vs last month',
    icon:        '👥',
    color:       'green',
  },
  {
    title:       'Total Orders',
    value:       '3,847',
    rawValue:    3847,
    change:      -2.1,
    changeLabel: 'vs last month',
    icon:        '📦',
    color:       'purple',
  },
  {
    title:       'Traffic Sources',
    value:       totalTraffic.toLocaleString(),
    rawValue:    totalTraffic,
    change:      14.3,
    changeLabel: 'vs last month',
    icon:        '📈',
    color:       'orange',
  },
]

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: '', endDate: '' })

  const filteredOrders = useMemo(
    () => filterByDateRange(ordersData, dateRange),
    [dateRange]
  )

  return (
    <div className="px-4 sm:px-6 py-6 max-w-[1600px] mx-auto space-y-6">

      {/* ── Stat Cards (Day 2) ─────────────────────────────────────────── */}
      <section aria-label="Key metrics">
        {/*
          TODO (Day 2): Build StatCard to replace these placeholders.
          Grid: 1 col mobile → 2 col sm → 4 col xl
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statMetrics.map((metric, i) => (
            <StatCard
              key={metric.title}
              metric={metric}
              animationDelay={`${i * 50}ms`}
            />
          ))}
        </div>
      </section>

      {/* ── Charts (Day 3–4) ───────────────────────────────────────────── */}
      <section aria-label="Charts">
        {/*
          TODO (Day 3): Replace RevenueLineChart + CategoryBarChart placeholders
          TODO (Day 4): Replace DailyUsersAreaChart + TrafficPieChart placeholders
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RevenueLineChart />
          <CategoryBarChart />
          <DailyUsersAreaChart />
          <TrafficPieChart />
        </div>
      </section>

      {/* ── Orders Table (Day 5–6) ─────────────────────────────────────── */}
      <section aria-label="Orders table">
        {/* Date filter — wired to filteredOrders passed to DataTable */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl px-6 py-4
                        border border-gray-100 dark:border-gray-700 shadow-sm mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Filter by date:
            </p>
            {/* TODO (Day 6): implement DateRangePicker presets + getDatePreset utility */}
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </div>

        {/* TODO (Day 5): implement sorting + pagination inside DataTable */}
        <DataTable data={filteredOrders} />
      </section>
    </div>
  )
}
