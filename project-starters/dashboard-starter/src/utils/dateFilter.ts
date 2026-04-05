import type { DateRange } from '../types'

/*
  dateFilter.ts — Utilities for filtering dated records and computing presets.

  TODO (Day 6): Replace the stub implementations below with real logic.
*/

/**
 * TODO (Day 6): Filter records where `date` falls within [startDate, endDate].
 * Empty startDate or endDate = no bound on that side.
 *
 * WHY string comparison (not new Date()):
 * ISO 8601 ('YYYY-MM-DD') sorts lexicographically the same as chronologically.
 * Using new Date() introduces timezone ambiguity — new Date('2024-03-01') creates
 * UTC midnight, which can shift when converted to local time.
 *
 * @param data      - Array of objects with a `date: string` field
 * @param range     - { startDate, endDate } — empty string = no bound
 * @returns Filtered array
 */
export function filterByDateRange<T extends { date: string }>(
  data: T[],
  range: DateRange
): T[] {
  // TODO: implement — return data filtered to range.startDate..range.endDate
  // Temporary pass-through so the table renders without error:
  const { startDate, endDate } = range
  if (!startDate && !endDate) return data
  return data.filter(item => {
    if (startDate && item.date < startDate) return false
    if (endDate   && item.date > endDate)   return false
    return true
  })
}

/**
 * TODO (Day 6): Return a { startDate, endDate } object for a named preset.
 * Use today's date and subtract the appropriate number of days.
 *
 * Presets to implement:
 *   'last7'  → last 6 days + today
 *   'last30' → last 29 days + today
 *   'last90' → last 89 days + today
 *   'ytd'    → January 1st of current year → today
 *   'all'    → { startDate: '', endDate: '' }
 */
export function getDatePreset(preset: 'last7' | 'last30' | 'last90' | 'ytd' | 'all'): DateRange {
  // TODO: implement
  // Temporary stub — returns empty range (= no filter)
  if (preset === 'all') return { startDate: '', endDate: '' }
  return { startDate: '', endDate: '' }
}

/**
 * TODO (Day 6): Format 'YYYY-MM-DD' → 'Mar 15, 2024'.
 * Use UTC timezone to avoid locale-based date shifts.
 */
export function formatDateLabel(dateStr: string): string {
  // TODO: implement using toLocaleDateString with timeZone: 'UTC'
  return dateStr
}
