import type { StatMetric } from '../../types'

/*
  StatCard.tsx — Displays a single KPI metric with trend indicator.

  DESIGN DECISIONS:
  - Color is passed as a prop (not hardcoded) so all 4 cards can have
    distinct accent colors from one data array in Dashboard.
  - The change percentage can be positive or negative. We show green/red
    accordingly, but also check the `inverse` flag — for metrics like
    "Cancelled Orders", a decrease is good (should show green for negative).
  - Large number + trend is the standard analytics card pattern (see Stripe,
    Vercel, Mixpanel dashboards) because it answers: "what is it?" and
    "is it moving the right direction?" at a glance.

  WHY animate-fadeIn:
  When the dashboard first loads, staggering the card entrance (handled
  by delay classes in Dashboard) makes the page feel less jarring than
  everything appearing instantly.
*/

const colorMap: Record<StatMetric['color'], {
  bg: string
  iconBg: string
  iconText: string
}> = {
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',   iconBg: 'bg-blue-100 dark:bg-blue-900/40',   iconText: 'text-blue-600 dark:text-blue-400' },
  green:  { bg: 'bg-green-50 dark:bg-green-900/20', iconBg: 'bg-green-100 dark:bg-green-900/40', iconText: 'text-green-600 dark:text-green-400' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20',iconBg: 'bg-purple-100 dark:bg-purple-900/40',iconText: 'text-purple-600 dark:text-purple-400' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20',iconBg: 'bg-orange-100 dark:bg-orange-900/40',iconText: 'text-orange-600 dark:text-orange-400' },
}

interface StatCardProps {
  metric: StatMetric
  /** If true, a negative change is shown green (e.g. "cancellations down = good") */
  inverse?: boolean
  animationDelay?: string
}

export default function StatCard({ metric, inverse = false, animationDelay = '0ms' }: StatCardProps) {
  const colors = colorMap[metric.color]
  const isPositive = metric.change >= 0
  // For most metrics: up = good (green). For inverse metrics: down = good (green).
  const isGood = inverse ? !isPositive : isPositive
  const changeColor = isGood
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-500 dark:text-red-400'
  const changeBg = isGood
    ? 'bg-green-50 dark:bg-green-900/20'
    : 'bg-red-50 dark:bg-red-900/20'

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl p-6
                 border border-gray-100 dark:border-gray-700
                 shadow-sm hover:shadow-md transition-shadow duration-200
                 animate-fadeIn"
      style={{ animationDelay }}
    >
      {/* Top row: icon + title */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {metric.title}
          </p>
        </div>
        {/* Icon circle */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${colors.iconBg}`}>
          <span className={colors.iconText} aria-hidden="true">
            {metric.icon}
          </span>
        </div>
      </div>

      {/* Main value */}
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
        {metric.value}
      </p>

      {/* Change badge + label */}
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${changeColor} ${changeBg}`}>
          {/* Arrow icon */}
          <svg
            className={`w-3 h-3 ${isPositive ? '' : 'rotate-180'}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
          {Math.abs(metric.change)}%
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {metric.changeLabel}
        </span>
      </div>
    </div>
  )
}
