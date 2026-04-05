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
  Dashboard.tsx — Main page. Orchestrates all section components.

  STATE OWNED HERE:
  - dateRange: passed to DataTable for filtering. Charts use fixed 2024 data
    (real dashboards would re-fetch charts on date change too).

  GRID LAYOUT:
  - StatCards:   1 col (mobile) → 2 col (sm) → 4 col (xl)
  - Charts:      1 col (mobile) → 2 col (lg)
  - PieChart:    1 col always (needs enough width for the legend)
  - DataTable:   full width always

  WHY stat metrics defined here (not in a data file):
  StatCard metrics are computed from data (e.g., YoY % change from revenueData).
  They're not pure static data — they depend on imported summaries.
  Keeping the computation co-located with the import makes the dependency clear.
*/

// ─── Stat Metrics ─────────────────────────────────────────────────────────────

const yoyGrowth = (((totalRevenue2024 - prevYearRevenue) / prevYearRevenue) * 100).toFixed(1)

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

// ─── Dashboard Component ───────────────────────────────────────────────────────

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: '', endDate: '' })

  // Filter orders by selected date range. useMemo prevents re-filtering on
  // unrelated state changes (e.g., if we add more local state later).
  const filteredOrders = useMemo(
    () => filterByDateRange(ordersData, dateRange),
    [dateRange]
  )

  return (
    <div className="px-4 sm:px-6 py-6 max-w-[1600px] mx-auto space-y-6">

      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <section aria-label="Key metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statMetrics.map((metric, i) => (
            <StatCard
              key={metric.title}
              metric={metric}
              // Orders: lower = bad, but we don't flag it as inverse here
              // because a 2% dip could just be seasonality
              animationDelay={`${i * 50}ms`}
            />
          ))}
        </div>
      </section>

      {/* ── Charts Grid ────────────────────────────────────────────────── */}
      <section aria-label="Charts">
        {/*
          WHY two-column for most charts, one-column for PieChart:
          Line/bar/area charts need horizontal space to show trends.
          The PieChart + its custom legend is self-contained and compact —
          forcing it to full-width would leave too much empty space.
          The 2-col grid means charts pair naturally on desktop.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RevenueLineChart />
          <CategoryBarChart />
          <DailyUsersAreaChart />
          <TrafficPieChart />
        </div>
      </section>

      {/* ── Orders Table ────────────────────────────────────────────────── */}
      <section aria-label="Orders table">
        {/* Date filter sits above the table, filtering only table data */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl px-6 py-4
                        border border-gray-100 dark:border-gray-700 shadow-sm mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Filter by date:
            </p>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </div>

        <DataTable data={filteredOrders} />
      </section>
    </div>
  )
}
