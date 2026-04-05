import { revenueData } from '../../data/revenueData'

/*
  RevenueLineChart — Monthly revenue vs target (two lines), full year.

  TODO (Day 3): Implement using Recharts LineChart.

  Install: npm install recharts (already in package.json)

  Recharts structure to build:
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={revenueData} margin={{ ... }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} ... />
        <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} ... />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line dataKey="revenue" stroke="#4f46e5" strokeWidth={2.5} ... />
        <Line dataKey="target"  stroke="#a5b4fc" strokeDasharray="5 5" dot={false} />
      </LineChart>
    </ResponsiveContainer>

  Dark mode in Recharts (IMPORTANT):
    Recharts renders SVG — Tailwind dark: variants don't work here.
    Read isDark from useTheme() and pass hex colors to SVG props:
      const { isDark } = useTheme()
      const gridColor = isDark ? '#374151' : '#f3f4f6'
      const axisColor = isDark ? '#9ca3af' : '#9ca3af'

  Custom tooltip:
    function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
      if (!active || !payload?.length) return null
      // render a styled div with the revenue, target, and variance
    }

  WHY two lines (not one):
  Revenue alone shows "how much". Revenue vs target answers "did we hit plan?" —
  the more useful question for a business dashboard.

  Data available: revenueData (array of { month, revenue, target })
*/

export default function RevenueLineChart() {
  // TODO: implement with Recharts LineChart + dark mode colors + CustomTooltip
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6
                    border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Monthly Revenue</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Actual vs target — 2024</p>
      </div>
      <div className="h-80 flex items-center justify-center border-2 border-dashed
                      border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="text-center">
          <p className="text-3xl mb-2">📈</p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">RevenueLineChart</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Build me! (Day 3) — {revenueData.length} months of data
          </p>
        </div>
      </div>
    </div>
  )
}
