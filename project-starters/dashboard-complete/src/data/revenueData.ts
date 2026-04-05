import type { RevenueDataPoint } from '../types'

/*
  revenueData.ts — Monthly revenue vs target for 2024.

  WHY mock data in a separate file (not inline in the chart):
  Charts are display components — they should not know where data comes from.
  Separating data means you can swap in a real API call later by only
  changing this file. The chart component itself never changes.

  In a real app, this data would come from:
    const { data } = useQuery(['revenue'], fetchMonthlyRevenue)
  The chart component would look exactly the same.
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

// Derived summary values used by StatCards
export const totalRevenue2024 = revenueData.reduce((s, d) => s + d.revenue, 0) // 728,700
export const prevYearRevenue  = 647_200  // simulated prior year for YoY comparison
