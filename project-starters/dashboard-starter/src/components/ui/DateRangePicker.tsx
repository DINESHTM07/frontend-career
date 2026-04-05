import type { DateRange } from '../../types'
import { getDatePreset } from '../../utils/dateFilter'

/*
  DateRangePicker — Preset buttons + custom date inputs for filtering.

  TODO (Day 6): Build the full date range picker.

  Props:
    value:    DateRange               — controlled value from Dashboard
    onChange: (range: DateRange) => void — called when selection changes

  What to build:
    1. Five preset buttons: Last 7d | Last 30d | Last 90d | YTD | All
       - Active preset: brand-colored background
       - Detect active: compare value against getDatePreset(key)
       - On click: call onChange(getDatePreset(key))

    2. Two native date inputs for custom range:
       - Start date: <input type="date"> with max={value.endDate}
       - End date: <input type="date"> with min={value.startDate}
       - On change: call onChange({ ...value, startDate: e.target.value })

  WHY native <input type="date"> (not a library):
  - Zero bundle size cost
  - Works on all modern browsers + mobile native date pickers
  - Good enough for a dashboard; add react-datepicker only for calendar UIs

  WHY this is a controlled component (not internal state):
  Dashboard needs the dateRange to filter the table data. If state lived here,
  Dashboard couldn't access it. Controlled = parent owns the state.
*/

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

const presets = [
  { label: 'Last 7d',  key: 'last7'  as const },
  { label: 'Last 30d', key: 'last30' as const },
  { label: 'Last 90d', key: 'last90' as const },
  { label: 'YTD',      key: 'ytd'    as const },
  { label: 'All',      key: 'all'    as const },
]

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  // TODO: implement active preset detection and full styling
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Preset buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {presets.map(p => (
          <button
            key={p.key}
            onClick={() => onChange(getDatePreset(p.key))}
            className="px-3 py-1.5 rounded-lg text-xs font-medium
                       bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400
                       border border-gray-200 dark:border-gray-700
                       hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400
                       transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom date inputs */}
      {/* TODO: add max/min constraints between start and end */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={value.startDate}
          onChange={e => onChange({ ...value, startDate: e.target.value })}
          className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800
                     border border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-gray-300
                     focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Start date"
        />
        <span className="text-xs text-gray-400">to</span>
        <input
          type="date"
          value={value.endDate}
          onChange={e => onChange({ ...value, endDate: e.target.value })}
          className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800
                     border border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-gray-300
                     focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="End date"
        />
      </div>
    </div>
  )
}
