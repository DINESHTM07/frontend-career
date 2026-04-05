import { categoryData } from '../../data/categoryData'

/*
  CategoryBarChart — Grouped bars showing sales vs returns per category.

  TODO (Day 3): Implement using Recharts BarChart.

  Recharts structure to build:
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={categoryData} barCategoryGap="25%" barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="category"
          tickFormatter={(v) => v.length > 8 ? v.slice(0, 8) + '…' : v}
        />
        <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="sales"   fill="#4f46e5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="returns" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>

  Custom tooltip:
    Show: category name, sales amount, returns amount, return rate %
    Return rate = (returns / sales * 100).toFixed(1) + '%'

  Hover cursor style:
    <Tooltip cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }} />

  WHY grouped bars (not stacked):
  Grouped bars let you compare returns across categories at the same baseline.
  Stacked would show totals well but obscure the return-rate comparison.

  Data available: categoryData (array of { category, sales, returns })
*/

export default function CategoryBarChart() {
  // TODO: implement with Recharts BarChart + dark mode + CustomTooltip
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6
                    border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Sales by Category</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Gross sales vs returns</p>
      </div>
      <div className="h-80 flex items-center justify-center border-2 border-dashed
                      border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="text-center">
          <p className="text-3xl mb-2">📊</p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CategoryBarChart</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Build me! (Day 3) — {categoryData.length} categories
          </p>
        </div>
      </div>
    </div>
  )
}
