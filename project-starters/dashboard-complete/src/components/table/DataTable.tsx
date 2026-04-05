import { useState, useMemo } from 'react'
import type { Order, SortConfig, SortDirection } from '../../types'
import { exportToCSV } from '../../utils/csvExport'

/*
  DataTable.tsx — Sortable, paginated table for order data.

  FEATURES:
  1. Sortable columns: click any header to sort asc → desc → clear
  2. Pagination: 10 rows per page with prev/next and page indicator
  3. CSV export: downloads currently-filtered data (respects date filter)
  4. Status badges: color-coded by order status
  5. Amount formatting: right-aligned with currency symbol

  SORT CYCLE:
  null → 'asc' → 'desc' → null (clicking the same column clears the sort)
  Clicking a different column starts fresh at 'asc'.

  WHY useMemo for sorted data (not sort inside render):
  Sorting is O(n log n). Without useMemo, it re-runs on EVERY render —
  including renders caused by pagination state changing, which doesn't
  affect the sort. useMemo caches the sorted array and only re-sorts
  when `data` or `sortConfig` changes.

  WHY this component doesn't own the data:
  The parent (Dashboard) filters data by date range BEFORE passing it here.
  DataTable only sorts and paginates whatever it receives. Separation of
  concerns: Dashboard handles "which data", DataTable handles "how to display it".
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

  // ─── Sort Logic ──────────────────────────────────────────────────────────

  function handleSort(key: keyof Order) {
    setSortConfig(prev => {
      if (prev?.key !== key) return { key, direction: 'asc' }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      return null  // third click clears sort
    })
    setCurrentPage(1)  // always go back to page 1 when sort changes
  }

  const sortedData = useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      let comparison = 0
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal
      } else {
        comparison = String(aVal).localeCompare(String(bVal))
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison
    })
  }, [data, sortConfig])

  // ─── Pagination ───────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE))
  // Clamp page if filtered data shrinks (e.g., date filter reduces to 3 pages)
  const safePage   = Math.min(currentPage, totalPages)
  const pageStart  = (safePage - 1) * PAGE_SIZE
  const pageRows   = sortedData.slice(pageStart, pageStart + PAGE_SIZE)

  // ─── Sort Icon ────────────────────────────────────────────────────────────

  function SortIcon({ columnKey }: { columnKey: keyof Order }) {
    if (sortConfig?.key !== columnKey) {
      return (
        <svg className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    return (
      <svg className={`w-3.5 h-3.5 text-brand-600 dark:text-brand-400 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    )
  }

  // ─── CSV Export ───────────────────────────────────────────────────────────

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

  // ─── Column Definitions ───────────────────────────────────────────────────

  const columns: { key: keyof Order; label: string; align?: 'left' | 'right' }[] = [
    { key: 'id',       label: 'Order ID' },
    { key: 'date',     label: 'Date' },
    { key: 'customer', label: 'Customer' },
    { key: 'product',  label: 'Product' },
    { key: 'category', label: 'Category' },
    { key: 'amount',   label: 'Amount',  align: 'right' },
    { key: 'status',   label: 'Status' },
  ]

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">

      {/* Table header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {data.length} order{data.length !== 1 ? 's' : ''}
            {data.length < 50 ? ' (filtered)' : ''}
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={data.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                     bg-brand-600 text-white hover:bg-brand-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-150"
          aria-label={`Export ${data.length} orders to CSV`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Scrollable table wrapper — handles overflow on small screens */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`
                    group px-4 py-3 text-left text-xs font-semibold
                    text-gray-500 dark:text-gray-400 uppercase tracking-wider
                    cursor-pointer select-none whitespace-nowrap
                    hover:text-gray-700 dark:hover:text-gray-200
                    hover:bg-gray-50 dark:hover:bg-gray-750
                    transition-colors duration-150
                    ${col.align === 'right' ? 'text-right' : 'text-left'}
                  `}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    <SortIcon columnKey={col.key} />
                  </span>
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
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-100"
                >
                  <td className="px-4 py-3 font-medium text-brand-600 dark:text-brand-400 whitespace-nowrap">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                    {order.customer}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                    {order.product}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {order.category}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    ${order.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full
                      text-xs font-medium capitalize
                      ${STATUS_STYLES[order.status]}
                    `}>
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
      <div className="flex items-center justify-between px-6 py-3
                      border-t border-gray-100 dark:border-gray-700">
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
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100
                       dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page number buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => Math.abs(page - safePage) <= 2 || page === 1 || page === totalPages)
            .reduce<(number | '...')[]>((acc, page, idx, arr) => {
              if (idx > 0) {
                const prev = arr[idx - 1] as number
                if (page - prev > 1) acc.push('...')
              }
              acc.push(page)
              return acc
            }, [])
            .map((item, idx) =>
              item === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-400">…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  className={`
                    w-7 h-7 rounded-lg text-xs font-medium transition-colors
                    ${item === safePage
                      ? 'bg-brand-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {item}
                </button>
              )
            )
          }

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100
                       dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
