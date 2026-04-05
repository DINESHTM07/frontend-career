import { trafficData, totalTraffic } from '../../data/trafficData'

/*
  TrafficPieChart — Donut chart showing traffic by acquisition channel.

  TODO (Day 4): Implement using Recharts PieChart.

  Recharts structure to build:
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={trafficData}
          cx="50%" cy="50%"
          innerRadius={55}      ← makes it a donut (cleaner than solid pie)
          outerRadius={100}
          paddingAngle={3}      ← small gap between slices for readability
          dataKey="value"
        >
          {trafficData.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>

  Custom tooltip:
    Show: source name, session count, percentage of totalTraffic

  Custom legend (render below the chart, not using Recharts Legend):
    For each entry: colored dot + name + session count + percentage
    Use a grid or flexbox layout

  WHY custom legend (not <Legend /> from Recharts):
  Default Legend only shows colored dot + name. Custom legend can show
  the session count and % too, giving more context at a glance.

  WHY innerRadius (donut vs solid pie):
  Donut charts look cleaner and allow a center label if needed.
  The hollow center also makes individual slices easier to distinguish.

  Data available:
    trafficData  — array of { name, value, color }
    totalTraffic — sum of all session counts (for % calculation)
*/

export default function TrafficPieChart() {
  // TODO: implement with Recharts PieChart + Cell + custom legend + custom tooltip
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6
                    border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Traffic Sources</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {totalTraffic.toLocaleString()} total sessions
        </p>
      </div>
      <div className="h-64 flex items-center justify-center border-2 border-dashed
                      border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="text-center">
          <p className="text-3xl mb-2">🥧</p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">TrafficPieChart</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Build me! (Day 4) — {trafficData.length} sources
          </p>
        </div>
      </div>
    </div>
  )
}
