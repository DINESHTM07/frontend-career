// ============================================
// INTRO: What is Transformation + Filtering + Accumulation and WHY it matters
// ============================================
// Arrays are the most-used data structure in frontend development.
// Three operations cover ~90% of what you'll ever do with arrays:
//
//   map()    → TRANSFORM: produce a new array of the same length, different values
//   filter() → FILTER: produce a new array with only elements that pass a test
//   reduce() → ACCUMULATE: collapse an array into a single value (any type)
//
// WHY it matters: Every dashboard, every data table, every dropdown list
// is produced by chaining these three operations on raw data. Master these
// and React data flows become obvious.
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// Think of an array workout circuit:
//
// WARMUP: push/pop — adding/removing from the ends (in-place mutation)
//
// map = TRANSFORMATION STATION
//   "Take each item, transform it, put result in new array."
//   Input:  [1, 2, 3]   → multiply by 2 →  Output: [2, 4, 6]
//   SAME length, DIFFERENT values
//
// filter = STRENGTH TEST
//   "Take each item, test it, keep only the ones that PASS."
//   Input:  [1, 2, 3, 4, 5] → only even → Output: [2, 4]
//   SHORTER or same length, SAME values (filtered)
//
// reduce = BOSS ROUND
//   "Carry a running value through the array, processing each item."
//   Input:  [1, 2, 3, 4] → sum → Output: 10  (single value)
//   Can produce: number, string, object, array — anything!
// ============================================

// ============================================
// GUIDED EXERCISE: Array Gym — 4 rounds
// ============================================

console.log("=== ARRAY GYM ===\n");

// ---- WARMUP: push, pop, shift, unshift, splice ----
console.log("--- WARMUP: Mutating Methods ---");

const workout = ["squats", "lunges", "planks"];

workout.push("burpees");           // add to END
console.log("After push:", workout);

const lastExercise = workout.pop(); // remove from END, returns removed item
console.log("After pop:", workout, "| removed:", lastExercise);

workout.unshift("warm-up jog");   // add to START
console.log("After unshift:", workout);

const firstExercise = workout.shift(); // remove from START, returns removed
console.log("After shift:", workout, "| removed:", firstExercise);

// splice: remove/insert ANYWHERE — most powerful mutating method
// splice(startIndex, deleteCount, ...itemsToInsert)
workout.splice(1, 0, "push-ups"); // At index 1, delete 0, insert "push-ups"
console.log("After splice insert:", workout);
workout.splice(2, 1);             // At index 2, delete 1
console.log("After splice delete:", workout);

// NON-MUTATING alternatives (return new array)
const combined = [...workout, "cool-down"]; // spread — doesn't mutate
console.log("Spread (original unchanged):", workout);
console.log("New combined:", combined);

// ---- ROUND 1: map — TRANSFORMATION ----
console.log("\n--- ROUND 1: map (Transformation) ---");

const numbers = [1, 2, 3, 4, 5];

// Basic map: double each number
const doubled = numbers.map((n) => n * 2);
console.log("Original:", numbers);   // unchanged — map is pure
console.log("Doubled:", doubled);

// map with index (second parameter)
const indexed = numbers.map((n, i) => `[${i}] ${n}`);
console.log("Indexed:", indexed);

// map on objects — most common real-world use
const users = [
  { id: 1, firstName: "Dinesh", lastName: "S",    role: "developer" },
  { id: 2, firstName: "Priya",  lastName: "K",    role: "designer" },
  { id: 3, firstName: "Arjun",  lastName: "R",    role: "developer" },
  { id: 4, firstName: "Meera",  lastName: "V",    role: "manager" },
];

// Extract specific fields (like SQL SELECT)
const fullNames = users.map((u) => `${u.firstName} ${u.lastName}`);
console.log("Full names:", fullNames);

// Transform the shape of objects
const userCards = users.map((u) => ({
  id: u.id,
  displayName: `${u.firstName} ${u.lastName}`,
  badge: u.role.toUpperCase(),
}));
console.log("User cards:", userCards);

// ---- ROUND 2: filter — STRENGTH ----
console.log("\n--- ROUND 2: filter (Filtering) ---");

// filter: keep only elements where callback returns true
const evens = numbers.filter((n) => n % 2 === 0);
console.log("Even numbers:", evens);

const odds = numbers.filter((n) => n % 2 !== 0);
console.log("Odd numbers:", odds);

// filter on objects — extremely common in React state
const developers = users.filter((u) => u.role === "developer");
console.log("Developers:", developers.map((u) => u.firstName));

// filter can chain with map
const developerNames = users
  .filter((u) => u.role === "developer")
  .map((u) => u.firstName);
console.log("Developer first names:", developerNames);

// filter for search functionality
function searchUsers(users, query) {
  const q = query.toLowerCase();
  return users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
  );
}
console.log("Search 'dev':", searchUsers(users, "dev").map((u) => u.firstName));
console.log("Search 'p':", searchUsers(users, "p").map((u) => u.firstName));

// ---- ROUND 3: reduce — BOSS ----
console.log("\n--- ROUND 3: reduce (Accumulation) ---");
// reduce(callback, initialValue)
// callback receives: (accumulator, currentValue, index, array)

// Basic: sum
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum); // 15

// product
const product = numbers.reduce((acc, n) => acc * n, 1);
console.log("Product:", product); // 120

// max/min without Math.max
const max = numbers.reduce((acc, n) => (n > acc ? n : acc), -Infinity);
console.log("Max:", max); // 5

// Flatten array of arrays
const nested = [[1, 2], [3, 4], [5]];
const flat = nested.reduce((acc, arr) => [...acc, ...arr], []);
console.log("Flattened:", flat); // [1,2,3,4,5]

// Group by property — one of reduce's superpowers
const grouped = users.reduce((acc, user) => {
  const key = user.role;
  // If this key doesn't exist in acc yet, create an empty array
  if (!acc[key]) acc[key] = [];
  acc[key].push(user.firstName);
  return acc;
}, {});
console.log("Grouped by role:", grouped);
// { developer: ['Dinesh', 'Arjun'], designer: ['Priya'], manager: ['Meera'] }

// Count occurrences
const roles = users.map((u) => u.role);
const roleCounts = roles.reduce((acc, role) => {
  acc[role] = (acc[role] || 0) + 1;
  return acc;
}, {});
console.log("Role counts:", roleCounts);

// Build an object from an array (like Object.fromEntries)
const userMap = users.reduce((acc, user) => {
  acc[user.id] = user;
  return acc;
}, {});
console.log("User lookup by id:", userMap[1].firstName); // "Dinesh"

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. What's the key difference between map and filter?
//    Answer: map always returns same-length array with transformed values.
//    filter always returns same or shorter array with ORIGINAL values (just selected).
//
// 2. What does reduce's initialValue do and when can you omit it?
//    Answer: Sets the starting value of the accumulator. You CAN omit it —
//    then the first element becomes acc and iteration starts at index 1.
//    ALWAYS provide initialValue for clarity and to handle empty arrays safely.
//
// 3. When would you use reduce instead of a for loop?
//    Answer: When you're collapsing an array to a single value (any type).
//    Especially: sums, grouping, counting, building objects from arrays.
//    for loops are fine too — reduce is just more composable/chainable.
//
// 4. Do map/filter/reduce mutate the original array?
//    Answer: No. They are PURE (non-mutating) methods that return new arrays/values.
//    The original array is never changed. (push/pop/splice DO mutate.)
// ============================================

// ============================================
// YOUR TURN: Transform a real dataset
// ============================================
// Given this dataset of products, use map/filter/reduce to answer each query.
// Each answer must use the functional method (no for loops).

const products = [
  { id: 1, name: "Laptop",     category: "Electronics", price: 999,  inStock: true,  rating: 4.5 },
  { id: 2, name: "Phone",      category: "Electronics", price: 699,  inStock: true,  rating: 4.2 },
  { id: 3, name: "Headphones", category: "Electronics", price: 199,  inStock: false, rating: 4.7 },
  { id: 4, name: "Desk",       category: "Furniture",   price: 349,  inStock: true,  rating: 4.0 },
  { id: 5, name: "Chair",      category: "Furniture",   price: 249,  inStock: true,  rating: 4.3 },
  { id: 6, name: "Monitor",    category: "Electronics", price: 449,  inStock: true,  rating: 4.6 },
  { id: 7, name: "Keyboard",   category: "Electronics", price: 89,   inStock: true,  rating: 4.1 },
  { id: 8, name: "Bookshelf",  category: "Furniture",   price: 159,  inStock: false, rating: 3.8 },
];

// Query 1: Get names of all in-stock products
const inStockNames = null; // YOUR CODE HERE using filter + map
console.log("\n--- YOUR TURN ---");
console.log("Q1 In-stock names:", inStockNames);

// Query 2: Get all electronics, sorted by price ascending
const sortedElectronics = null; // YOUR CODE HERE using filter + sort
console.log("Q2 Electronics by price:", sortedElectronics?.map((p) => `${p.name}($${p.price})`));

// Query 3: Get total value of all in-stock inventory (price × 1 per item)
const totalInventoryValue = null; // YOUR CODE HERE using filter + reduce
console.log("Q3 Total inventory value: $" + totalInventoryValue);

// Query 4: Get average rating across all products
const averageRating = null; // YOUR CODE HERE using reduce
console.log("Q4 Average rating:", averageRating?.toFixed(2));

// Query 5: Group products by category with their names
const byCategory = null; // YOUR CODE HERE using reduce
console.log("Q5 By category:", byCategory);

// Query 6: Find the most expensive in-stock product
const mostExpensiveInStock = null; // YOUR CODE HERE using filter + reduce
console.log("Q6 Most expensive in-stock:", mostExpensiveInStock?.name);

// Query 7: Create a price lookup object { productName: price }
const priceList = null; // YOUR CODE HERE using reduce
console.log("Q7 Price list:", priceList);

// Query 8: Get product names with rating > 4.4, formatted as "Name (★4.5)"
const topRated = null; // YOUR CODE HERE using filter + map
console.log("Q8 Top rated:", topRated);

// ============================================
// BOSS CHALLENGE: Build a mini data pipeline
// ============================================
// Build a createPipeline(...fns) function that:
// - Takes any number of transformation functions as arguments
// - Returns a function that pipes an array through all transformations in order
// - Each transformation receives the result of the previous one
//
// Also build these pre-made pipeline stages:
//   filterBy(key, value)   → returns a filter fn: keeps items where item[key] === value
//   sortBy(key, dir)       → returns a sort fn: sorts by key asc/desc
//   pluck(key)             → returns a map fn: extracts just one key from each object
//   top(n)                 → returns a slice fn: takes first n items
//   withIndex()            → returns a map fn: adds { index: i } to each item
//
// Usage:
//   const pipeline = createPipeline(
//     filterBy("inStock", true),
//     sortBy("price", "asc"),
//     top(3),
//     pluck("name")
//   );
//   console.log(pipeline(products)); // ["Keyboard", "Chair", "Bookshelf"...filtered]

function createPipeline(...fns) {
  // YOUR CODE HERE
}

const filterBy = (key, value) => (arr) => arr.filter((item) => item[key] === value);
const sortBy = (key, dir = "asc") => (arr) =>
  [...arr].sort((a, b) => dir === "asc" ? a[key] - b[key] : b[key] - a[key]);
const pluck = (key) => (arr) => arr.map((item) => item[key]);
const top = (n) => (arr) => arr.slice(0, n);
const withIndex = () => (arr) => arr.map((item, i) => ({ ...item, index: i }));

console.log("\n--- BOSS CHALLENGE: Pipeline ---");
const pipeline = createPipeline(
  filterBy("inStock", true),
  sortBy("price", "asc"),
  top(3),
  pluck("name")
);
console.log("Cheapest 3 in-stock items:", pipeline(products));

const ratingPipeline = createPipeline(
  filterBy("category", "Electronics"),
  sortBy("rating", "desc"),
  withIndex(),
  top(3)
);
console.log("Top 3 Electronics by rating:", ratingPipeline(products).map((p) => `#${p.index + 1} ${p.name}`));

// ============================================
// PATTERN LEARNED: Transformation + Filtering + Accumulation
// ============================================
// PATTERN NAME: Functional Array Pipeline
// WHEN YOU SEE: Raw data that needs to be displayed, filtered, or computed
// USE THIS:
//   Step 1: filter()  — remove what you don't need
//   Step 2: map()     — shape the data for display
//   Step 3: reduce()  — if you need a summary or grouping
//
// CHAINING RULE: filter → map → reduce (in that order is most efficient)
//   filter first reduces the array size (less work for map and reduce)
//   map second transforms what's left
//   reduce last if you need a single result
//
// WHEN TO USE EACH:
//   "I need the same items, just changed" → map
//   "I need fewer items, unchanged"       → filter
//   "I need ONE result from the array"    → reduce
//   "I need to add/remove items"          → push/pop/splice (or spread)
// ============================================
