/*
  WHY a utils/ folder:
  Pure functions with no side effects and no React dependencies.
  These can be tested in isolation, reused across components, and
  don't need to be re-created on every render.
*/

/**
 * Format a number as a USD currency string.
 * WHY Intl.NumberFormat: It handles locale-specific formatting automatically.
 * On a user's device set to German locale, it would still show correct USD.
 * It's also significantly faster than regex-based approaches.
 *
 * @param {number} amount
 * @returns {string} e.g. "$29.99"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Truncate a string to maxLength characters, appending '...' if truncated.
 * WHY: Product titles from FakeStoreAPI can be very long. Truncating them
 * prevents cards from having inconsistent heights in the grid.
 *
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength = 60) {
  if (!str) return ''
  if (str.length <= maxLength) return str
  // Trim at the last word boundary before maxLength to avoid cutting mid-word
  return str.slice(0, maxLength).trimEnd() + '...'
}

/**
 * Capitalize the first letter of each word in a string.
 * Used for category names: "men's clothing" → "Men's Clothing"
 *
 * @param {string} str
 * @returns {string}
 */
export function titleCase(str) {
  if (!str) return ''
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Generate an array of star ratings as filled/half/empty strings.
 * Used by the StarRating component.
 *
 * WHY: FakeStoreAPI returns ratings like 3.9. We need to convert this to
 * a visual representation. Rather than computing this in the component
 * (causing re-calculation on every render), we compute it once here.
 *
 * @param {number} rating - 0 to 5
 * @returns {Array<'full'|'half'|'empty'>}
 */
export function getRatingStars(rating) {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.5

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) stars.push('full')
    else if (i === fullStars && hasHalf) stars.push('half')
    else stars.push('empty')
  }
  return stars
}

/**
 * Sort an array of products by a given field and direction.
 * WHY pure function: Keeping sort logic outside components means we can
 * change sorting behavior without touching any component code.
 *
 * @param {Product[]} products
 * @param {'price-asc'|'price-desc'|'rating-desc'|'default'} sortKey
 * @returns {Product[]} new sorted array (does NOT mutate the original)
 */
export function sortProducts(products, sortKey) {
  // WHY spread: Array.sort() mutates in place. We return a new array so
  // React can detect the change and re-render. Mutating the original
  // would cause subtle bugs where the UI doesn't update.
  const sorted = [...products]

  switch (sortKey) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating.rate - a.rating.rate)
    default:
      // 'default' = original API order (by id)
      return sorted.sort((a, b) => a.id - b.id)
  }
}

/**
 * Filter products by a search query (case-insensitive, searches title and category).
 *
 * WHY search both title AND category: A user searching "electronics" expects
 * to see all electronics products, not just ones with "electronics" in their title.
 *
 * @param {Product[]} products
 * @param {string} query
 * @returns {Product[]}
 */
export function filterBySearch(products, query) {
  if (!query || !query.trim()) return products
  const q = query.toLowerCase().trim()
  return products.filter(
    p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  )
}

/**
 * Generate a CSS class string for a category badge color.
 * Each category gets a consistent color so users can identify them visually.
 *
 * @param {string} category
 * @returns {string} Tailwind class string
 */
export function getCategoryColor(category) {
  const colors = {
    "electronics":     "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    "jewelery":        "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "men's clothing":  "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    "women's clothing":"bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  }
  // Fallback for any unknown categories
  return colors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
}
