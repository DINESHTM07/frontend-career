import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  type TooltipProps,
} from 'recharts'
import { trafficData, totalTraffic } from '../../data/trafficData'

/*
  TrafficPieChart.tsx — Breakdown of website traffic by acquisition channel.

  WHY PieChart (not donut or bar) for traffic sources:
  Part-of-whole relationships are what pie charts do best.
  When you have 5 traffic sources that together equal 100% of visitors,
  a pie chart communicates the proportions at a glance.
  (If you had 12+ sources, a sorted bar chart would be better — pie slices
  get hard to compare once there are more than ~7.)

  CUSTOM LABEL:
  Recharts supports a labelLine prop and a custom label render function.
  We use a renderCustomizedLabel to show percentage inside/outside the slice
  because the default labels often overlap on smaller slices.

  LEGEND CUSTOMIZATION:
  We render a custom legend below the chart that also shows the raw session
  count, giving more context than just the colored dot + name.

  NOTE: Colors are defined in trafficData.ts, not here.
  This component is "dumb" about colors — it just uses entry.color.
*/

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null
  const entry = payload[0]
  if (!entry) return null

  const pct = totalTraffic > 0 ? ((entry.value! / totalTraffic) * 100).toFixed(1) : '0'

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                    rounded-xl shadow-lg px-4 py-3 text-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.payload.color }} />
        <p className="font-semibold text-gray-900 dark:text-white">{entry.name}</p>
      </div>
      <p className="text-gray-600 dark:text-gray-300">
        {entry.value!.toLocaleString()} sessions
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{pct}% of total</p>
    </div>
  )
}

// Custom legend that shows session counts, not just labels
function CustomLegend() {
  return (
    <div className="grid grid-cols-1 gap-2 mt-4">
      {trafficData.map(entry => {
        const pct = ((entry.value / totalTraffic) * 100).toFixed(1)
        return (
          <div key={entry.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.color }} />
              <span className="text-xs text-gray-600 dark:text-gray-400">{entry.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {entry.value.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function TrafficPieChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6
                    border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Traffic Sources</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {totalTraffic.toLocaleString()} total sessions
        </p>
      </div>

      {/*
        WHY outerRadius 100 (not 100%):
        Recharts pie radius is relative to the containing SVG viewport.
        A value of 100 gives good spacing; too large and labels get clipped.
      */}
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={trafficData}
            cx="50%"
            cy="50%"
            innerRadius={55}   // WHY innerRadius: creates a donut style, which looks cleaner
            outerRadius={100}  // and allows a label in the center if needed
            paddingAngle={3}   // WHY paddingAngle: small gap between slices aids readability
            dataKey="value"
          >
            {trafficData.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <CustomLegend />
    </div>
  )
}
