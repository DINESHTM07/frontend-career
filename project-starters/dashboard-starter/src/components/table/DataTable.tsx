import { useState, useMemo } from 'react'
import type { Order, SortConfig } from '../../types'
import { exportToCSV } from '../../utils/csvExport'

/*
  DataTable — Sortable, paginated table for Order data with CSV export.

  TODO (Day 5): Implement this component.

  Props:
    data: Order[]  — filtered orders from Dashboard (date range already applied)

  Features to implement:

  1. SORT (click column header):
     - State: const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
     - Cycle: null → 'asc' → 'desc' → null (clicking same column 3× resets it)
     - Clicking a different column: starts at 'asc'
     - useMemo to compute sorted data (re-sort only when data or sortConfig changes)
     - Sort icon: ↑ when asc, ↓ when desc, ↕ (faded) when not sorted

  2. PAGINATION:
     - const PAGE_SIZE = 10
     - currentPage state, reset to 1 when sort changes
     - pageRows = sortedData.slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE)
     - "Showing X–Y of Z" footer label
     - Prev / Next buttons (disabled at boundaries)
     - Page number buttons with ellipsis for large ranges

  3. CSV EXPORT (top-right button):
     - Call exportToCSV(sortedData, 'orders-YYYY-MM-DD', columns)
     - Exports the currently-filtered+sorted data (what the user sees)

  4. STATUS BADGES (color-coded):
     completed → green, pending → yellow, cancelled → red, refunded → gray

  WHY useMemo for sorting:
  Sorting is O(n log n). Without useMemo it re-runs on every render —
  even when only currentPage changes (which doesn't affect sort order).
  useMemo caches the result and only re-sorts when data or sortConfig changes.

  WHY `[...data].sort()` (not `data.sort()`):
  Array.sort() mutates in place. Spreading creates a new array so React
  detects the change. Mutating the prop directly causes subtle bugs.

  WHY sort cycle goes null → asc → desc → null:
  Three-state sort lets users return to "original order" (by date, the natural
  order of the mock data). Two-state (asc ↔ desc) has no way back without refresh.
*/

const PAGE_SIZE = 10

const STATUS_STYLES: Record<Order['status'], string> = {
  completed:  'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400',
  pending:    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  cancelled:  'bg-red-100    text-red-600    dark:bg-red-900/30    dark:text-red-400',
  refunded:   'bg-gray-100   text-gray-600   dark:bg-gray-700      dark:text-gray-300',
}

interface DataTableProps {
  data: Order[]
}

export default function DataTable({ data }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // TODO: implement sort cycle
  function handleSort(key: keyof Order) {
    // TODO: null → 'asc' → 'desc' → null cycle
    // TODO: reset currentPage to 1
    setSortConfig(prev => {
      if (prev?.key !== key) return { key, direction: 'asc' }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      return null
    })
    setCurrentPage(1)
  }

  // TODO: implement sorting logic inside useMemo
  const sortedData = useMemo(() => {
    // TODO: if sortConfig is null, return data as-is
    // TODO: spread data into new array, sort by sortConfig.key and direction
    // Temporary: return data unsorted
    return data
  }, [data, sortConfig])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE))
  const safePage   = Math.min(currentPage, totalPages)
  const pageStart  = (safePage - 1) * PAGE_SIZE
  const pageRows   = sortedData.slice(pageStart, pageStart + PAGE_SIZE)

  function handleExport() {
    exportToCSV(sortedData, `orders-${new Date().toISOString().split('T')[0]}`, [
      { key: 'id',       label: 'Order ID' },
      { key: 'date',     label: 'Date' },
      { key: 'customer', label: 'Customer' },
      { key: 'product',  label: 'Product' },
      { key: 'category', label: 'Category' },
      { key: 'amount',   label: 'Amount ($)' },
      { key: 'status',   label: 'Status' },
    ])
  }

  const columns: { key: keyof Order; label: string; align?: 'right' }[] = [
    { key: 'id',       label: 'Order ID'  },
    { key: 'date',     label: 'Date'      },
    { key: 'customer', label: 'Customer'  },
    { key: 'product',  label: 'Product'   },
    { key: 'category', label: 'Category'  },
    { key: 'amount',   label: 'Amount',   align: 'right' },
    { key: 'status',   label: 'Status'    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">

      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {data.length} order{data.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={data.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                     bg-brand-600 text-white hover:bg-brand-700
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ↓ Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`
                    px-4 py-3 text-xs font-semibold
                    text-gray-500 dark:text-gray-400 uppercase tracking-wider
                    cursor-pointer select-none whitespace-nowrap
                    hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750
                    transition-colors
                    ${col.align === 'right' ? 'text-right' : 'text-left'}
                  `}
                >
                  {/* TODO: replace with proper sort icon (↑ / ↓ / ↕) */}
                  {col.label} {sortConfig?.key === col.key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-gray-400 dark:text-gray-500">
                  No orders match the selected date range.
                </td>
              </tr>
            ) : (
              pageRows.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="px-4 py-3 font-medium text-brand-600 dark:text-brand-400 whitespace-nowrap">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{order.date}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">{order.customer}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">{order.product}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{order.category}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    ${order.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {/* TODO: implement full pagination with page number buttons + ellipsis */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {data.length === 0
            ? 'No results'
            : `Showing ${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, sortedData.length)} of ${sortedData.length}`
          }
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="px-3 py-1.5 text-xs rounded-lg text-gray-600 dark:text-gray-400
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400 px-2">
            Page {safePage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="px-3 py-1.5 text-xs rounded-lg text-gray-600 dark:text-gray-400
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
