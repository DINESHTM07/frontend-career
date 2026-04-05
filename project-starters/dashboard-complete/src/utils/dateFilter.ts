import type { DateRange } from '../types'

/*
  dateFilter.ts — Utility for filtering arrays of dated records.

  WHY string comparison instead of Date objects for range checks:
  ISO 8601 date strings ('YYYY-MM-DD') sort lexicographically the same
  as chronologically. '2024-03-01' < '2024-12-01' works with plain string
  comparison. This avoids timezone ambiguity from `new Date('2024-03-01')`
  (which creates a UTC midnight date that shifts when converted to local time).
*/

/**
 * Filter an array of records that have a `date: string` field.
 * Returns all records where `date` is within [startDate, endDate] inclusive.
 * Empty startDate or endDate = no bound on that side.
 */
export function filterByDateRange<T extends { date: string }>(
  data: T[],
  range: DateRange
): T[] {
  const { startDate, endDate } = range

  // No filter set — return everything
  if (!startDate && !endDate) return data

  return data.filter(item => {
    if (startDate && item.date < startDate) return false
    if (endDate   && item.date > endDate)   return false
    return true
  })
}

/**
 * Pre-built date range presets.
 * Returns DateRange objects with ISO date strings relative to today.
 */
export function getDatePreset(preset: 'last7' | 'last30' | 'last90' | 'ytd' | 'all'): DateRange {
  const today = new Date()
  const pad   = (n: number) => String(n).padStart(2, '0')
  const fmt   = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

  const endDate = fmt(today)

  if (preset === 'all') return { startDate: '', endDate: '' }

  const start = new Date(today)

  switch (preset) {
    case 'last7':
      start.setDate(today.getDate() - 6)
      break
    case 'last30':
      start.setDate(today.getDate() - 29)
      break
    case 'last90':
      start.setDate(today.getDate() - 89)
      break
    case 'ytd':
      start.setMonth(0, 1)  // January 1st of current year
      break
  }

  return { startDate: fmt(start), endDate }
}

/**
 * Format a 'YYYY-MM-DD' string to a human-readable label.
 * e.g. '2024-03-15' → 'Mar 15, 2024'
 */
export function formatDateLabel(dateStr: string): string {
  if (!dateStr) return ''
  // Use UTC to avoid timezone-shifted display
  const d = new Date(dateStr + 'T00:00:00Z')
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
