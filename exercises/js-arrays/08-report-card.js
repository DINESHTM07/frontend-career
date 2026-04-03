// ============================================
// INTRO: What is Method Chaining and WHY it matters
// ============================================
// Method chaining means calling multiple methods in sequence on the same data,
// where each method returns a value that the next method operates on.
// In JavaScript arrays, map/filter/reduce/sort/slice all return new arrays
// (except reduce, which returns any value), making them perfect for chaining.
//
// WHY it matters: Chaining is the backbone of data processing in modern JS.
// Every time you see data go from a raw API response to a rendered table or chart,
// there's a chain of array methods transforming it. Reading and writing chains
// fluently is essential for React components, data fetching logic, and analytics.
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// Think of a water treatment plant:
//
// Raw water → [Filter]→ [Chemical treatment]→ [UV purification]→ [Test]→ Clean water
//
// Each stage takes the output of the previous stage as its input.
// You wouldn't want to store every intermediate stage in a separate tank.
// You chain them into one continuous pipeline.
//
// In code:
//   rawData
//     .filter(...)    // stage 1: keep what we need
//     .map(...)       // stage 2: transform
//     .sort(...)      // stage 3: order
//     .slice(0, 10)   // stage 4: paginate
//   // one continuous flow — no intermediate variables
// ============================================

// ============================================
// GUIDED EXERCISE: Student Report Card System
// ============================================

console.log("=== STUDENT REPORT CARD ===\n");

// Dataset: a class of students with grades per subject
const students = [
  { id: 1, name: "Dinesh",   grade: 10, scores: { math: 92, english: 85, science: 88, history: 79, cs: 95 } },
  { id: 2, name: "Priya",    grade: 10, scores: { math: 78, english: 91, science: 82, history: 88, cs: 76 } },
  { id: 3, name: "Arjun",    grade: 11, scores: { math: 95, english: 72, science: 97, history: 65, cs: 99 } },
  { id: 4, name: "Meera",    grade: 10, scores: { math: 60, english: 55, science: 63, history: 70, cs: 58 } },
  { id: 5, name: "Ravi",     grade: 11, scores: { math: 88, english: 82, science: 85, history: 80, cs: 90 } },
  { id: 6, name: "Sita",     grade: 11, scores: { math: 45, english: 62, science: 50, history: 58, cs: 55 } },
  { id: 7, name: "Kavya",    grade: 12, scores: { math: 98, english: 94, science: 96, history: 91, cs: 97 } },
  { id: 8, name: "Vikram",   grade: 12, scores: { math: 55, english: 48, science: 60, history: 52, cs: 65 } },
  { id: 9, name: "Ananya",   grade: 12, scores: { math: 82, english: 89, science: 80, history: 85, cs: 78 } },
  { id: 10, name: "Suresh",  grade: 11, scores: { math: 70, english: 75, science: 68, history: 72, cs: 80 } },
];

// Helper: calculate average of an object's values
function average(obj) {
  const values = Object.values(obj);
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

// Helper: get grade letter
function getLetterGrade(avg) {
  if (avg >= 90) return "A";
  if (avg >= 80) return "B";
  if (avg >= 70) return "C";
  if (avg >= 60) return "D";
  return "F";
}

// ---- CHAIN 1: Individual Averages with Letter Grades ----
console.log("--- Chain 1: Individual Averages ---");

const reportCards = students
  .map((s) => {                                    // Step 1: add computed fields
    const avg = average(s.scores);
    return {
      ...s,                                        // spread original data
      average: Math.round(avg * 10) / 10,          // round to 1 decimal
      letterGrade: getLetterGrade(avg),
      bestSubject: Object.entries(s.scores)        // find best subject
        .sort(([, a], [, b]) => b - a)[0][0],
    };
  })
  .sort((a, b) => b.average - a.average);          // Step 2: sort by average desc

reportCards.forEach((s, i) => {
  console.log(
    `${(i + 1).toString().padStart(2)}. ${s.name.padEnd(8)} | ` +
    `Avg: ${s.average.toFixed(1).padStart(5)} | ` +
    `${s.letterGrade} | Best: ${s.bestSubject}`
  );
});

// ---- CHAIN 2: Top performers (filter + sort) ----
console.log("\n--- Chain 2: Top Performers (avg ≥ 85) ---");

const topPerformers = students
  .map((s) => ({ ...s, avg: average(s.scores) }))
  .filter((s) => s.avg >= 85)                      // only high achievers
  .sort((a, b) => b.avg - a.avg)                   // highest first
  .map((s) => `${s.name} (${s.avg.toFixed(1)})`);  // format for display

console.log("Top performers:", topPerformers);

// ---- CHAIN 3: Class average using reduce ----
console.log("\n--- Chain 3: Class Statistics ---");

const classAverage = students
  .map((s) => average(s.scores))                   // get each student's avg
  .reduce((sum, avg, _, arr) => sum + avg / arr.length, 0); // running average

console.log(`Class average: ${classAverage.toFixed(2)}`);

// subject-wise class performance
const subjects = Object.keys(students[0].scores);
const subjectAverages = subjects
  .map((subject) => ({
    subject,
    avg: students
      .map((s) => s.scores[subject])               // all scores for this subject
      .reduce((sum, score) => sum + score, 0) / students.length,
  }))
  .sort((a, b) => b.avg - a.avg);                  // best subject first

console.log("Subject averages (best to worst):");
subjectAverages.forEach((s) =>
  console.log(`  ${s.subject.padEnd(10)}: ${s.avg.toFixed(1)}`)
);

// ---- CHAIN 4: Group by grade and summarize ----
console.log("\n--- Chain 4: Grade-wise Summary ---");

const byGrade = students
  .map((s) => ({ ...s, avg: average(s.scores) }))
  .reduce((acc, s) => {                            // group by grade
    const key = `Grade ${s.grade}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

// Process each grade group
Object.entries(byGrade)
  .sort(([a], [b]) => a.localeCompare(b))          // sort by grade name
  .forEach(([grade, gradeStudents]) => {
    const avgs = gradeStudents.map((s) => s.avg);
    const gradeAvg = avgs.reduce((a, b) => a + b, 0) / avgs.length;
    const topStudent = gradeStudents.sort((a, b) => b.avg - a.avg)[0];
    console.log(
      `${grade}: avg=${gradeAvg.toFixed(1)}, ` +
      `top=${topStudent.name}(${topStudent.avg.toFixed(1)}), ` +
      `count=${gradeStudents.length}`
    );
  });

// ---- CHAIN 5: Find struggling students and specific help needed ----
console.log("\n--- Chain 5: Students Needing Support ---");

const needsSupport = students
  .flatMap((s) =>                                  // flatMap = map + flat
    Object.entries(s.scores)
      .filter(([, score]) => score < 65)           // failing subjects
      .map(([subject, score]) => ({
        student: s.name,
        subject,
        score,
        gap: 65 - score,                           // how far from passing
      }))
  )
  .sort((a, b) => b.gap - a.gap)                   // worst gap first
  .slice(0, 5);                                    // top 5 most urgent

console.log("Most urgent interventions:");
needsSupport.forEach((item) =>
  console.log(
    `  ${item.student.padEnd(8)}: ${item.subject.padEnd(10)} ` +
    `score=${item.score}, gap=${item.gap}`
  )
);

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. What does flatMap do that map doesn't?
//    Answer: flatMap maps then flattens one level. Useful when your map callback
//    returns arrays — instead of [[a,b],[c]] you get [a,b,c].
//
// 2. In Chain 3, why is reduce's callback `(sum, avg, _, arr) => sum + avg / arr.length`?
//    Answer: We use `arr.length` to divide on each addition (running average).
//    The `_` is the index (ignored). This avoids a second pass to divide at the end.
//
// 3. When should you NOT chain methods?
//    Answer: When readability suffers. If you have more than 4-5 steps,
//    or if each step needs a complex callback, break into named variables.
//    "Readable" always beats "clever."
//
// 4. What's the performance cost of chaining?
//    Answer: Each method creates a new array and iterates the full array.
//    5 chained methods = 5 iterations. For large datasets, a single for loop
//    or reduce that does all steps at once is faster. Profile first — optimize last.
// ============================================

// ============================================
// YOUR TURN: Process e-commerce order data
// ============================================
// Given this dataset, write chained method expressions to answer each query.
// NO for loops. Each answer should be a single chained expression.

const orders = [
  { id: "ORD-001", customer: "Alice",  status: "delivered", items: [{ name: "Laptop",  qty: 1, price: 999 }, { name: "Mouse", qty: 2, price: 25 }],    date: "2024-01-15" },
  { id: "ORD-002", customer: "Bob",    status: "pending",   items: [{ name: "Phone",   qty: 1, price: 699 }],                                            date: "2024-01-18" },
  { id: "ORD-003", customer: "Alice",  status: "delivered", items: [{ name: "Keyboard",qty: 1, price: 89 },  { name: "Monitor", qty: 1, price: 449 }],   date: "2024-01-20" },
  { id: "ORD-004", customer: "Carol",  status: "cancelled", items: [{ name: "Desk",    qty: 1, price: 349 }],                                            date: "2024-01-22" },
  { id: "ORD-005", customer: "Bob",    status: "shipped",   items: [{ name: "Tablet",  qty: 2, price: 299 }],                                            date: "2024-01-25" },
  { id: "ORD-006", customer: "Carol",  status: "delivered", items: [{ name: "Chair",   qty: 2, price: 249 }, { name: "Lamp", qty: 1, price: 45 }],       date: "2024-01-28" },
  { id: "ORD-007", customer: "Alice",  status: "pending",   items: [{ name: "Webcam",  qty: 1, price: 79 }],                                             date: "2024-02-01" },
  { id: "ORD-008", customer: "David",  status: "delivered", items: [{ name: "Headphones", qty: 1, price: 199 }, { name: "Stand", qty: 1, price: 35 }],   date: "2024-02-03" },
];

// Helper: compute order total
const orderTotal = (order) =>
  order.items.reduce((sum, item) => sum + item.qty * item.price, 0);

console.log("\n--- YOUR TURN: E-commerce Queries ---\n");

// Q1: Total revenue from delivered orders only
const deliveredRevenue = null; // YOUR CODE HERE
console.log("Q1 Delivered revenue: $" + deliveredRevenue);

// Q2: Get all delivered order IDs, sorted newest first
const deliveredIds = null; // YOUR CODE HERE
console.log("Q2 Delivered IDs:", deliveredIds);

// Q3: List all unique customers who have at least one delivered order
const loyalCustomers = null; // YOUR CODE HERE
console.log("Q3 Customers with deliveries:", loyalCustomers);

// Q4: Get all items across all orders, flattened (name, price, qty)
const allItems = null; // YOUR CODE HERE using flatMap
console.log("Q4 All items count:", allItems?.length);

// Q5: Find the most ordered product by total quantity
const mostOrderedProduct = null; // YOUR CODE HERE using reduce + sort
console.log("Q5 Most ordered product:", mostOrderedProduct);

// Q6: Get each customer's total spend (only delivered orders)
const customerSpend = null; // YOUR CODE HERE using reduce
console.log("Q6 Customer spend:", customerSpend);

// Q7: Find all orders with a total above $500, formatted as "ORD-001: $1049"
const bigOrders = null; // YOUR CODE HERE using filter + map
console.log("Q7 Big orders:", bigOrders);

// Q8: Build an order status summary { delivered: 4, pending: 2, ... }
const statusSummary = null; // YOUR CODE HERE using reduce
console.log("Q8 Status summary:", statusSummary);

// ============================================
// BOSS CHALLENGE: Build a queryable data store
// ============================================
// Build createDataStore(data) that returns a fluent query builder.
// Each method returns `this` (the store itself) so calls can be chained.
// The chain is LAZY — it doesn't execute until .execute() is called.
//
// Methods:
//   .where(predicate)       → add a filter
//   .select(transformer)    → add a map
//   .orderBy(key, dir)      → add a sort (asc/desc)
//   .limit(n)               → take first n results
//   .groupBy(key)           → group results by key
//   .execute()              → run all operations and return result
//
// Usage:
//   const store = createDataStore(orders);
//   const result = store
//     .where(o => o.status === "delivered")
//     .select(o => ({ id: o.id, total: orderTotal(o), customer: o.customer }))
//     .orderBy("total", "desc")
//     .limit(3)
//     .execute();

function createDataStore(data) {
  // YOUR CODE HERE
  // HINT: Store operations as an array of { type, fn } objects
  // On execute(), reduce through all operations in order
}

console.log("\n--- BOSS CHALLENGE: Data Store ---\n");
const store = createDataStore(orders);
const result = store
  .where((o) => o.status === "delivered")
  .select((o) => ({ id: o.id, total: orderTotal(o), customer: o.customer }))
  .orderBy("total", "desc")
  .limit(3)
  .execute();
console.log("Top 3 delivered orders by value:", result);

// ============================================
// PATTERN LEARNED: Chaining
// ============================================
// PATTERN NAME: Functional Data Pipeline (Chaining)
// WHEN YOU SEE: Raw data that needs multiple transformations before display
// USE THIS: Chain map/filter/sort/reduce in a single expression
//
// OPTIMAL ORDER:
//   .filter()  first — reduces array size early (less work downstream)
//   .map()     second — transform what remains
//   .sort()    third — sort the transformed, smaller set
//   .slice()   last — paginate/limit
//   .reduce()  standalone — when you need a single value at the end
//
// READABILITY RULES:
//   - Each chained call on its own line, indented
//   - If a callback is more than 1 line, extract it to a named function
//   - If you need the intermediate result for debugging, break into variables
//   - Prefer clarity over cleverness in code you'll maintain
//
// REAL-WORLD PATTERN:
//   const displayData = rawApiResponse.data
//     .filter(item => item.active)
//     .map(item => normalizeItem(item))
//     .sort((a, b) => b.createdAt - a.createdAt)
//     .slice(0, pageSize);
// ============================================
