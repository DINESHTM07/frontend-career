import type { StatMetric } from '../../types'

/*
  StatCard — Displays a single KPI metric with value and trend indicator.

  TODO (Day 2): Build the full StatCard.

  Props:
    metric:         StatMetric  — all card data bundled in one object
    inverse?:       boolean     — if true, negative change = green (e.g. "cancellations down")
    animationDelay?: string     — CSS delay for staggered entrance, e.g. "150ms"

  What to build:
    1. Outer card: bg-white dark:bg-gray-800, rounded-2xl, border, shadow-sm
    2. Top row: metric.title (left) + icon circle (right)
       - Icon circle: colored bg based on metric.color (blue/green/purple/orange)
    3. Large value: metric.value, text-2xl font-bold
    4. Change badge:
       - Arrow icon (rotate 180 if negative change)
       - Absolute value: `${Math.abs(metric.change)}%`
       - Green badge if isGood, red badge if !isGood
       - isGood = inverse ? !isPositive : isPositive
    5. Change label: metric.changeLabel ("vs last month")
    6. Add `animate-fadeIn` + inline `style={{ animationDelay }}`

  Color map for icon circles (implement with a lookup object):
    blue:   bg-blue-100 text-blue-600 (dark: bg-blue-900/40 text-blue-400)
    green:  bg-green-100 text-green-600 ...
    purple: bg-purple-100 text-purple-600 ...
    orange: bg-orange-100 text-orange-600 ...
*/

interface StatCardProps {
  metric: StatMetric
  inverse?: boolean
  animationDelay?: string
}

export default function StatCard({ metric, animationDelay = '0ms' }: StatCardProps) {
  // TODO: implement full StatCard
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl p-6
                 border border-gray-100 dark:border-gray-700 shadow-sm
                 animate-fadeIn"
      style={{ animationDelay }}
    >
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
        {metric.title}
      </p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {metric.value}
      </p>
      <p className={`text-xs font-medium ${metric.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
        {metric.change >= 0 ? '▲' : '▼'} {Math.abs(metric.change)}% {metric.changeLabel}
      </p>
      <p className="text-xs text-gray-400 italic mt-2">StatCard — build me! (Day 2)</p>
    </div>
  )
}
