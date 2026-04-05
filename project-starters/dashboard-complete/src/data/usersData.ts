import type { DailyUsersDataPoint } from '../types'

/*
  usersData.ts — Daily new vs returning users for the last 30 days.
  Used by DailyUsersAreaChart.

  WHY area chart (not line) for users:
  Area charts emphasize volume — the filled area represents total users,
  with two stacked layers showing the composition (new vs returning).
  A line chart would show trends but lose the sense of scale.
*/

// Generates ISO date strings relative to a fixed reference date
// so the chart always has 30 data points regardless of when you run the app.
const BASE_DATE = new Date('2024-12-01')

function dateOffset(days: number): string {
  const d = new Date(BASE_DATE)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export const usersData: DailyUsersDataPoint[] = [
  { date: dateOffset(0),  newUsers: 142, returning: 380 },
  { date: dateOffset(1),  newUsers: 158, returning: 392 },
  { date: dateOffset(2),  newUsers: 131, returning: 401 },
  { date: dateOffset(3),  newUsers: 175, returning: 415 },
  { date: dateOffset(4),  newUsers: 189, returning: 428 },
  { date: dateOffset(5),  newUsers: 210, returning: 445 },
  { date: dateOffset(6),  newUsers: 228, returning: 462 },
  { date: dateOffset(7),  newUsers: 195, returning: 470 },
  { date: dateOffset(8),  newUsers: 183, returning: 458 },
  { date: dateOffset(9),  newUsers: 167, returning: 443 },
  { date: dateOffset(10), newUsers: 201, returning: 489 },
  { date: dateOffset(11), newUsers: 219, returning: 501 },
  { date: dateOffset(12), newUsers: 243, returning: 516 },
  { date: dateOffset(13), newUsers: 267, returning: 532 },
  { date: dateOffset(14), newUsers: 248, returning: 520 },
  { date: dateOffset(15), newUsers: 231, returning: 509 },
  { date: dateOffset(16), newUsers: 214, returning: 496 },
  { date: dateOffset(17), newUsers: 238, returning: 511 },
  { date: dateOffset(18), newUsers: 252, returning: 524 },
  { date: dateOffset(19), newUsers: 279, returning: 543 },
  { date: dateOffset(20), newUsers: 294, returning: 561 },
  { date: dateOffset(21), newUsers: 271, returning: 548 },
  { date: dateOffset(22), newUsers: 256, returning: 535 },
  { date: dateOffset(23), newUsers: 243, returning: 521 },
  { date: dateOffset(24), newUsers: 261, returning: 538 },
  { date: dateOffset(25), newUsers: 278, returning: 554 },
  { date: dateOffset(26), newUsers: 302, returning: 573 },
  { date: dateOffset(27), newUsers: 318, returning: 588 },
  { date: dateOffset(28), newUsers: 295, returning: 572 },
  { date: dateOffset(29), newUsers: 311, returning: 591 },
]
