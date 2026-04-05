import type { RevenueDataPoint } from '../types'

/*
  revenueData.ts — Fully working. No implementation needed here.

  WHY data lives in its own file (not inside chart components):
  Charts are display components — they should not know where data comes from.
  When you connect a real API later, you only change this file.
  The chart component stays identical.
*/

export const revenueData: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 42500,  target: 40000 },
  { month: 'Feb', revenue: 38200,  target: 41000 },
  { month: 'Mar', revenue: 51000,  target: 45000 },
  { month: 'Apr', revenue: 48700,  target: 46000 },
  { month: 'May', revenue: 55200,  target: 50000 },
  { month: 'Jun', revenue: 62100,  target: 55000 },
  { month: 'Jul', revenue: 58900,  target: 57000 },
  { month: 'Aug', revenue: 67400,  target: 60000 },
  { month: 'Sep', revenue: 71200,  target: 65000 },
  { month: 'Oct', revenue: 68800,  target: 67000 },
  { month: 'Nov', revenue: 79500,  target: 72000 },
  { month: 'Dec', revenue: 85200,  target: 78000 },
]

// Summary values used by StatCard in Dashboard.tsx
export const totalRevenue2024 = revenueData.reduce((s, d) => s + d.revenue, 0) // 728,700
export const prevYearRevenue  = 647_200  // simulated prior year
