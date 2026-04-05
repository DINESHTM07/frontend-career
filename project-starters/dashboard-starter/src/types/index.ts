/*
  types/index.ts — All TypeScript interfaces. Fully defined — types are needed
  by every file that compiles. Read this file on Day 1 to understand the
  data shapes before you start building.

  WHY centralize types here:
  When a data shape changes (e.g., adding a field to Order), you update ONE place.
  All components that use the type get TypeScript errors immediately if they
  don't handle the new field.
*/

// ─── Chart Data Types ────────────────────────────────────────────────────────

/** One month of revenue — used by RevenueLineChart (Day 3) */
export interface RevenueDataPoint {
  month: string    // 'Jan', 'Feb', etc.
  revenue: number  // actual revenue
  target: number   // planned/budget target
}

/** One product category — used by CategoryBarChart (Day 3) */
export interface CategoryDataPoint {
  category: string
  sales: number
  returns: number
}

/** One traffic source — used by TrafficPieChart (Day 4) */
export interface TrafficDataPoint {
  name: string   // source name
  value: number  // session count
  color: string  // hex color — defined in data file, used by chart
}

/** One day of users — used by DailyUsersAreaChart (Day 4) */
export interface DailyUsersDataPoint {
  date: string       // 'YYYY-MM-DD'
  newUsers: number
  returning: number
}

// ─── Table Types ──────────────────────────────────────────────────────────────

export type OrderStatus = 'completed' | 'pending' | 'cancelled' | 'refunded'

/** A single order row displayed in DataTable (Day 5) */
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

export type SortDirection = 'asc' | 'desc'

/**
 * TODO (Day 5): Used by DataTable's sort state.
 * WHY keyof Order (not string): restricts sort to actual Order fields.
 * TypeScript will flag it if you rename a field and forget to update sort code.
 */
export interface SortConfig {
  key: keyof Order
  direction: SortDirection
}

/** Date range for filtering — used by DateRangePicker + filterByDateRange (Day 6) */
export interface DateRange {
  startDate: string  // 'YYYY-MM-DD' or '' (no lower bound)
  endDate: string    // 'YYYY-MM-DD' or '' (no upper bound)
}

// ─── StatCard Types ───────────────────────────────────────────────────────────

export type StatColor = 'blue' | 'green' | 'purple' | 'orange'

/**
 * TODO (Day 2): Used by StatCard component.
 * Bundling into one object lets Dashboard map() over an array of metrics
 * instead of repeating <StatCard title="..." value="..." /> four times.
 */
export interface StatMetric {
  title: string
  value: string       // pre-formatted display string, e.g. "$728.7k"
  rawValue: number
  change: number      // percentage change; positive = up, negative = down
  changeLabel: string // e.g. "vs last month"
  icon: string        // emoji
  color: StatColor
}

// ─── Theme ────────────────────────────────────────────────────────────────────

/** TODO (Day 6): used by ThemeContext */
export type Theme = 'light' | 'dark'
