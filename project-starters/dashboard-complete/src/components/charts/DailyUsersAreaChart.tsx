import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  type TooltipProps,
} from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { usersData } from '../../data/usersData'

/*
  DailyUsersAreaChart.tsx — New users vs returning users over 30 days.

  WHY AreaChart vs LineChart for this data:
  Area charts emphasize cumulative volume. With two stacked/overlapping areas,
  the TOTAL area under both lines represents total daily users, while the split
  between new and returning shows the mix. This is standard for user metrics
  in analytics dashboards (e.g., Google Analytics, Mixpanel).

  STACKED vs OVERLAPPING areas:
  We use `stackId="users"` to stack the areas — this makes the combined height
  equal to total daily users. Overlapping areas (no stackId) would obscure the
  smaller series when both are similar in magnitude.

  GRADIENT FILL:
  Area fills with a gradient (full opacity → transparent toward the bottom)
  look cleaner than solid fills and reduce visual weight at the bottom of the chart.
  We define SVG <defs> gradients with unique IDs.
*/

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null

  const newUsers   = payload.find(p => p.dataKey === 'newUsers')?.value ?? 0
  const returning  = payload.find(p => p.dataKey === 'returning')?.value ?? 0
  const total      = newUsers + returning
  const newPct     = total > 0 ? ((newUsers / total) * 100).toFixed(0) : '0'

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                    rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
      <p className="text-brand-600 dark:text-brand-400">
        New: <strong>{newUsers.toLocaleString()}</strong> ({newPct}%)
      </p>
      <p className="text-cyan-600 dark:text-cyan-400">
        Returning: <strong>{returning.toLocaleString()}</strong>
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 border-t border-gray-100 dark:border-gray-700 pt-1.5">
        Total: {total.toLocaleString()}
      </p>
    </div>
  )
}

export default function DailyUsersAreaChart() {
  const { isDark } = useTheme()
  const gridColor  = isDark ? '#374151' : '#f3f4f6'
  const axisColor  = isDark ? '#9ca3af' : '#9ca3af'

  // Abbreviate date for X-axis: '2024-12-01' → 'Dec 1'
  function formatXAxis(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00Z')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  }

  // Only show every 5th date label to avoid crowding
  function xTickFormatter(value: string, index: number): string {
    return index % 5 === 0 ? formatXAxis(value) : ''
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6
                    border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Daily Users</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">New vs returning — last 30 days</p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={usersData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          {/* SVG gradient definitions */}
          <defs>
            <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="colorReturning" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: axisColor, fontSize: 11 }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
            tickFormatter={xTickFormatter}
          />
          <YAxis
            tick={{ fill: axisColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: axisColor }} />

          <Area
            type="monotone"
            dataKey="returning"
            name="Returning"
            stackId="users"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#colorReturning)"
          />
          <Area
            type="monotone"
            dataKey="newUsers"
            name="New Users"
            stackId="users"
            stroke="#4f46e5"
            strokeWidth={2}
            fill="url(#colorNew)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
