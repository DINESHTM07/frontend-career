import { usersData } from '../../data/usersData'

/*
  DailyUsersAreaChart — Stacked areas: new users + returning users, 30 days.

  TODO (Day 4): Implement using Recharts AreaChart.

  Recharts structure to build:
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={usersData}>

        ← SVG gradient definitions (goes inside AreaChart)
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

        <CartesianGrid ... />
        <XAxis
          dataKey="date"
          tickFormatter={(value, index) => index % 5 === 0 ? formatDate(value) : ''}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        <Area
          dataKey="returning"
          stackId="users"        ← SAME stackId = stacked areas
          stroke="#06b6d4"
          fill="url(#colorReturning)"
        />
        <Area
          dataKey="newUsers"
          stackId="users"
          stroke="#4f46e5"
          fill="url(#colorNew)"
        />

      </AreaChart>
    </ResponsiveContainer>

  Date formatter for XAxis:
    function formatXAxis(dateStr: string): string {
      const d = new Date(dateStr + 'T00:00:00Z')
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
    }

  WHY stackId="users" on both Areas:
  Same stackId stacks the areas — the total height = total daily users,
  with two layers showing the composition. Without stackId they'd overlap.

  WHY gradient fill (not solid):
  Gradients fade to transparent at the bottom — reduces visual weight
  and makes the chart look cleaner than a solid-filled area.

  Data available: usersData (array of { date, newUsers, returning })
*/

export default function DailyUsersAreaChart() {
  // TODO: implement with Recharts AreaChart + stacked areas + SVG gradients + dark mode
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6
                    border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Daily Users</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">New vs returning — last 30 days</p>
      </div>
      <div className="h-80 flex items-center justify-center border-2 border-dashed
                      border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="text-center">
          <p className="text-3xl mb-2">📉</p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">DailyUsersAreaChart</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Build me! (Day 4) — {usersData.length} days of data
          </p>
        </div>
      </div>
    </div>
  )
}
