/*
  types/index.ts — Single source of truth for all TypeScript shapes.

  WHY centralize types here (not inline in each file):
  When a data shape changes (e.g., adding a field to Order), you update ONE place.
  Without this, you'd hunt down the type definition in whichever component happened
  to define it first. Centralized types also make cross-component consistency obvious.
*/

// ─── Chart Data Types ────────────────────────────────────────────────────────

/** One month of revenue data — used by RevenueLineChart */
export interface RevenueDataPoint {
  month: string    // 'Jan', 'Feb', etc.
  revenue: number  // actual revenue that month
  target: number   // planned/budget target
}

/** One product category — used by CategoryBarChart */
export interface CategoryDataPoint {
  category: string  // category name
  sales: number     // gross sales
  returns: number   // returned/refunded amount
}

/** One traffic source — used by TrafficPieChart */
export interface TrafficDataPoint {
  name: string   // source name
  value: number  // session count
  color: string  // hex color for this slice
}

/** One day of user activity — used by DailyUsersAreaChart */
export interface DailyUsersDataPoint {
  date: string       // 'YYYY-MM-DD'
  newUsers: number   // first-time users that day
  returning: number  // returning users that day
}

// ─── Table / Order Types ──────────────────────────────────────────────────────

export type OrderStatus = 'completed' | 'pending' | 'cancelled' | 'refunded'

/** A single order row in the DataTable */
export interface Order {
  id: string
  customer: string
  product: string
  category: string
  amount: number
  status: OrderStatus
  date: string  // 'YYYY-MM-DD'
}

// ─── UI State Types ───────────────────────────────────────────────────────────

/** Which column the DataTable is sorted on, and in which direction */
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  key: keyof Order
  direction: SortDirection
}

/** Date range for filtering table rows and charts */
export interface DateRange {
  startDate: string  // 'YYYY-MM-DD', empty string = no lower bound
  endDate: string    // 'YYYY-MM-DD', empty string = no upper bound
}

// ─── StatCard Metric Type ─────────────────────────────────────────────────────

export type StatColor = 'blue' | 'green' | 'purple' | 'orange'

/**
 * Data shape for a single StatCard.
 * WHY not just pass individual props to StatCard: bundling into an object
 * lets you store the stat config in an array and map() over it in Dashboard,
 * which is cleaner than repeating <StatCard title="..." value="..." /> four times.
 */
export interface StatMetric {
  title: string
  value: string       // pre-formatted display string (e.g. "$284,350")
  rawValue: number    // numeric value for programmatic use
  change: number      // percentage change, positive = good, negative = bad
  changeLabel: string // context label e.g. "vs last month"
  icon: string        // emoji icon
  color: StatColor
}

// ─── Theme ────────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark'
