/*
  csvExport.ts — Utility to convert any array of objects to a downloadable CSV.

  WHY a generic utility (not tied to Order):
  The DataTable could be reused with users, products, invoices, etc.
  A generic <T> function works for any data shape as long as you pass
  the column config. This is the correct level of abstraction — specific
  enough to be useful, generic enough to be reused.

  WHY Blob + createObjectURL (not a data: URI):
  data: URIs with large strings can crash browsers. Blob URLs are stored
  in browser memory, not the URL string itself, making them safe for large datasets.
*/

export interface CsvColumn<T> {
  key: keyof T
  label: string  // Header row label
}

/**
 * Convert an array of objects to a CSV file and trigger a browser download.
 *
 * @param data     - Array of records to export
 * @param filename - Download filename (without .csv extension)
 * @param columns  - Which keys to include and their column labels
 *
 * @example
 * exportToCSV(filteredOrders, 'orders-export', [
 *   { key: 'id', label: 'Order ID' },
 *   { key: 'customer', label: 'Customer' },
 *   { key: 'amount', label: 'Amount ($)' },
 * ])
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns: CsvColumn<T>[]
): void {
  if (data.length === 0) {
    console.warn('exportToCSV: no data to export')
    return
  }

  // Build header row
  const header = columns.map(col => escapeCell(col.label)).join(',')

  // Build data rows
  const rows = data.map(row =>
    columns
      .map(col => {
        const val = row[col.key]
        return escapeCell(String(val ?? ''))
      })
      .join(',')
  )

  const csv = [header, ...rows].join('\n')

  // Create a temporary anchor tag and click it to trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // WHY revokeObjectURL: Blob URLs stay in memory until the page unloads.
  // Revoking immediately after click frees that memory.
  // Small delay because some browsers need the click event to complete first.
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/**
 * Wrap a cell value in quotes if it contains commas, quotes, or newlines.
 * Escapes internal double-quotes by doubling them (CSV spec RFC 4180).
 */
function escapeCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
