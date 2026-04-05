import type { DateRange } from '../../types'
import { getDatePreset } from '../../utils/dateFilter'

/*
  DateRangePicker.tsx — Controlled date range input with preset buttons.

  CONTROLLED COMPONENT PATTERN:
  The parent (Dashboard) owns the dateRange state.
  This component receives it via props and calls onChange to update it.
  WHY: Dashboard needs the dateRange to filter both the table AND potentially
  the charts. If state lived here, Dashboard couldn't access it.

  PRESETS:
  Pre-built buttons ("Last 7 days", etc.) are the most common way users
  actually filter data — they rarely type custom dates. Offering presets
  as one-click buttons dramatically reduces friction.

  WHY native <input type="date"> (not a date picker library):
  - Zero bundle size cost
  - Works on all modern browsers
  - Handles keyboard input, locale formatting, and mobile date pickers natively
  - Good enough for a dashboard; add a library (react-datepicker) if you need
    date ranges spanning multiple months with a visual calendar UI
*/

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

const presets = [
  { label: 'Last 7d',    key: 'last7'  as const },
  { label: 'Last 30d',   key: 'last30' as const },
  { label: 'Last 90d',   key: 'last90' as const },
  { label: 'YTD',        key: 'ytd'    as const },
  { label: 'All',        key: 'all'    as const },
]

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  function handlePreset(key: (typeof presets)[number]['key']) {
    onChange(getDatePreset(key))
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Preset buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {presets.map(p => {
          // Determine if this preset is currently active
          const preset = getDatePreset(p.key)
          const isActive =
            value.startDate === preset.startDate && value.endDate === preset.endDate

          return (
            <button
              key={p.key}
              onClick={() => handlePreset(p.key)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
                ${isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400'
                }
              `}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      {/* Custom date inputs */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={value.startDate}
          max={value.endDate || undefined}
          onChange={e => onChange({ ...value, startDate: e.target.value })}
          className="text-xs px-3 py-1.5 rounded-lg
                     bg-white dark:bg-gray-800
                     border border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-gray-300
                     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                     transition-all duration-150"
          aria-label="Start date"
        />
        <span className="text-gray-400 dark:text-gray-500 text-xs">to</span>
        <input
          type="date"
          value={value.endDate}
          min={value.startDate || undefined}
          onChange={e => onChange({ ...value, endDate: e.target.value })}
          className="text-xs px-3 py-1.5 rounded-lg
                     bg-white dark:bg-gray-800
                     border border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-gray-300
                     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                     transition-all duration-150"
          aria-label="End date"
        />
      </div>
    </div>
  )
}
