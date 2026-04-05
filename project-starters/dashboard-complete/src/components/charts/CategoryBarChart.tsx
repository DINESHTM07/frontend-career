import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
  type TooltipProps,
} from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { categoryData } from '../../data/categoryData'

/*
  CategoryBarChart.tsx — Sales vs returns by product category (grouped bars).

  WHY grouped bars (not stacked):
  Stacked bars show totals well, but comparing the return rate ACROSS
  categories requires seeing both bars at the same baseline (zero).
  Grouped bars make "Electronics returns are much lower than Clothing's"
  immediately visible.

  WHY Cell with different opacity for the returns bar:
  We use the same color family (brand blue for sales, red/orange for returns)
  so the chart reads as "two aspects of the same thing" rather than unrelated
  data series. Consistency in color language aids comprehension.

  LABEL FORMATTER:
  The YAxis shows "$125k" not "$125000" because humans scan abbreviated
  numbers faster. The tooltip shows the full amount for precision.
*/

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null

  const sales   = payload.find(p => p.dataKey === 'sales')?.value ?? 0
  const returns = payload.find(p => p.dataKey === 'returns')?.value ?? 0
  const returnRate = sales > 0 ? ((returns / sales) * 100).toFixed(1) : '0'

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                    rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
      <p className="text-brand-600 dark:text-brand-400">
        Sales: <strong>${sales.toLocaleString()}</strong>
      </p>
      <p className="text-red-500 dark:text-red-400">
        Returns: ${returns.toLocaleString()}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Return rate: {returnRate}%
      </p>
    </div>
  )
}

export default function CategoryBarChart() {
  const { isDark } = useTheme()
  const gridColor = isDark ? '#374151' : '#f3f4f6'
  const axisColor = isDark ? '#9ca3af' : '#9ca3af'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6
                    border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Sales by Category</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Gross sales vs returns</p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={categoryData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          barCategoryGap="25%"
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fill: axisColor, fontSize: 11 }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
            // Abbreviate long category names on small screens
            tickFormatter={(v: string) => v.length > 8 ? v.slice(0, 8) + '…' : v}
          />
          <YAxis
            tick={{ fill: axisColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }} />
          <Legend wrapperStyle={{ fontSize: '12px', color: axisColor }} />

          <Bar dataKey="sales" name="Sales" fill="#4f46e5" radius={[4, 4, 0, 0]}>
            {categoryData.map((_, i) => (
              <Cell key={i} fill="#4f46e5" fillOpacity={0.85} />
            ))}
          </Bar>

          <Bar dataKey="returns" name="Returns" fill="#ef4444" radius={[4, 4, 0, 0]}>
            {categoryData.map((_, i) => (
              <Cell key={i} fill="#ef4444" fillOpacity={0.7} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
