/*
  csvExport.ts — Generic CSV download utility.

  TODO (Day 6): Implement exportToCSV.

  Steps:
  1. Build the header row: columns.map(c => escapeCell(c.label)).join(',')
  2. Build data rows: for each item, map each column key to its string value
  3. Join rows with '\n' to get the full CSV string
  4. Create a Blob: new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  5. Create a temporary <a> tag, set href = URL.createObjectURL(blob),
     set download = `${filename}.csv`, click it, then removeChild
  6. Call URL.revokeObjectURL(url) after a short delay (frees browser memory)

  WHY generic <T> (not typed to Order):
  The table could show users, products, or any other data in the future.
  A generic function accepts any object array + column config and works for all of them.

  WHY Blob + createObjectURL (not a data: URI):
  Large data URIs can crash browsers. Blob URLs reference browser memory
  by pointer — the URL string itself is tiny regardless of data size.
*/

export interface CsvColumn<T> {
  key: keyof T
  label: string
}

/**
 * Convert an array of records to a CSV file and trigger a browser download.
 * @param data     - Array of objects to export
 * @param filename - Download filename without .csv extension
 * @param columns  - Which keys to include and their header labels
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns: CsvColumn<T>[]
): void {
  // TODO: implement CSV generation and download
  // Temporary stub — logs instead of downloading:
  console.log(`exportToCSV called: ${filename}.csv, ${data.length} rows, ${columns.length} columns`)
  console.log('TODO (Day 6): implement real CSV export')
}

/**
 * TODO (Day 6): Wrap a cell value in double-quotes if it contains
 * commas, quotes, or newlines (CSV spec RFC 4180).
 * Internal double-quotes must be escaped by doubling them: " → ""
 */
function escapeCell(_value: string): string {
  // TODO: implement
  return _value
}

// Prevent "unused" TypeScript error while stub is incomplete
void escapeCell
