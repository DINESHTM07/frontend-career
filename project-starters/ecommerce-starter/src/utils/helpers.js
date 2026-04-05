// helpers.js — Pure utility functions (no React, no side effects)
// These are reused across multiple components and can be tested in isolation.

/**
 * Format a number as USD currency string.
 * TODO (Day 2): Implement using Intl.NumberFormat with style: 'currency', currency: 'USD'
 * @param {number} amount
 * @returns {string} e.g. "$29.99"
 */
export function formatCurrency(amount) {
  // TODO: implement
  return `$${Number(amount).toFixed(2)}`
}

/**
 * Truncate a string to maxLength characters, appending '...' if truncated.
 * TODO (Day 2): Trim at last word boundary before maxLength (avoid cutting mid-word).
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength = 60) {
  // TODO: implement — don't forget to handle falsy str
  if (!str) return ''
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

/**
 * Capitalize the first letter of each word.
 * e.g. "men's clothing" → "Men's Clothing"
 * TODO (Day 2): Implement using split/map/join.
 * @param {string} str
 * @returns {string}
 */
export function titleCase(str) {
  // TODO: implement
  if (!str) return ''
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

/**
 * Convert a numeric rating to an array of star types.
 * TODO (Day 2): Return array of 5 entries: 'full' | 'half' | 'empty'
 *   - fullStars = Math.floor(rating)
 *   - hasHalf = (rating - fullStars) >= 0.5
 * @param {number} rating — 0 to 5
 * @returns {Array<'full'|'half'|'empty'>}
 */
export function getRatingStars(rating) {
  // TODO: implement
  const stars = []
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push('full')
    else if (i === full && half) stars.push('half')
    else stars.push('empty')
  }
  return stars
}

/**
 * Sort an array of products by the given sort key.
 * TODO (Day 3): Implement all four cases. Return a NEW array (don't mutate).
 * @param {Object[]} products
 * @param {'default'|'price-asc'|'price-desc'|'rating-desc'} sortKey
 * @returns {Object[]}
 */
export function sortProducts(products, sortKey) {
  // TODO: implement — use [...products] to avoid mutating the original
  const sorted = [...products]
  switch (sortKey) {
    case 'price-asc':   return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':  return sorted.sort((a, b) => b.price - a.price)
    case 'rating-desc': return sorted.sort((a, b) => b.rating.rate - a.rating.rate)
    default:            return sorted.sort((a, b) => a.id - b.id)
  }
}

/**
 * Filter products by a search query (case-insensitive, searches title + category + description).
 * TODO (Day 3): Return products where title OR category OR description includes the query.
 * @param {Object[]} products
 * @param {string} query
 * @returns {Object[]}
 */
export function filterBySearch(products, query) {
  // TODO: implement — return all products if query is empty/whitespace
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
 * Return Tailwind classes for a category badge color.
 * TODO (Day 2): Add entries for all four FakeStore categories.
 * @param {string} category
 * @returns {string}
 */
export function getCategoryColor(category) {
  // TODO: add all categories — electronics, jewelery, men's clothing, women's clothing
  const colors = {
    'electronics':      'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'jewelery':         'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    "men's clothing":   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    "women's clothing": 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  }
  return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
}
