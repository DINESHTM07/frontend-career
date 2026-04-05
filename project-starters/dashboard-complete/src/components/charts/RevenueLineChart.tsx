import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  type TooltipProps,
} from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { revenueData } from '../../data/revenueData'
import type { RevenueDataPoint } from '../../types'

/*
  RevenueLineChart.tsx — Monthly revenue vs target, full year.

  RECHARTS PATTERN:
  Every chart follows: ResponsiveContainer > [ChartType] > axes > data series > tooltip/legend.
  ResponsiveContainer is critical — it reads the parent's dimensions and makes
  the chart fill the available width. Without it, you'd hardcode a pixel width.

  WHY two lines (revenue + target):
  A single revenue line tells you "how much did we make?"
  Two lines answer "did we hit our plan?" — which is the more important question.

  DARK MODE IN RECHARTS:
  Recharts renders SVG — it doesn't respond to Tailwind dark: variants.
  We read `isDark` from ThemeContext and pass theme-aware hex colors directly
  to axis stroke, grid stroke, and tick fill. This is the correct pattern.

  CUSTOM TOOLTIP:
  Recharts' default tooltip is functional but plain. A custom tooltip lets us:
  - Control formatting (currency, %)
  - Apply our own styling (dark/light aware)
  - Show additional context (variance from target)
*/

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null

  const revenue = payload.find(p => p.dataKey === 'revenue')?.value ?? 0
  const target  = payload.find(p => p.dataKey === 'target')?.value ?? 0
  const variance = revenue - target
  const pct = target > 0 ? ((variance / target) * 100).toFixed(1) : '0'

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                    rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
      <div className="space-y-1">
        <p className="text-brand-600 dark:text-brand-400">
          Revenue: <strong>${revenue.toLocaleString()}</strong>
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Target: ${target.toLocaleString()}
        </p>
        <p className={`text-xs font-medium ${variance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
          {variance >= 0 ? '▲' : '▼'} {Math.abs(variance).toLocaleString()} ({variance >= 0 ? '+' : ''}{pct}%)
        </p>
      </div>
    </div>
  )
}

export default function RevenueLineChart() {
  const { isDark } = useTheme()

  // Theme-aware colors for SVG elements (can't use Tailwind classes here)
  const gridColor   = isDark ? '#374151' : '#f3f4f6'
  const axisColor   = isDark ? '#9ca3af' : '#9ca3af'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6
                    border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Monthly Revenue</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Actual vs target — 2024</p>
      </div>

      {/*
        WHY height={320} not percentage:
        ResponsiveContainer makes WIDTH 100% of the parent.
        HEIGHT must be a fixed pixel value — a percentage would require
        the parent to have a fixed height, which breaks flex layouts.
      */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: axisColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: axisColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: axisColor }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#4f46e5"   // brand-600
            strokeWidth={2.5}
            dot={{ fill: '#4f46e5', r: 3 }}
            activeDot={{ r: 5, fill: '#4f46e5' }}
          />
          <Line
            type="monotone"
            dataKey="target"
            name="Target"
            stroke="#a5b4fc"   // brand-300
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Export type for use in starter file
export type { RevenueDataPoint }
