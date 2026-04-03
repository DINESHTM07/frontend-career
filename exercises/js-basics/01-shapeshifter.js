// ============================================
// INTRO: What is the Type System and WHY it matters
// ============================================
// JavaScript is DYNAMICALLY typed — a variable has no fixed type.
// The same variable can hold a number, then a string, then null.
// This is powerful but dangerous: silent type coercion causes bugs
// that are extremely hard to track down in production.
// Knowing *exactly* what type you're holding at every moment is
// the difference between a JS beginner and a confident engineer.
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// Think of a variable like a box with a label on it.
// The label is the variable name. The BOX has no permanent shape —
// you can put a number, a word, nothing, a list, anything inside.
// typeof is you peeking inside the box and reading what's there.
//
// Analogy: a backpack that can carry books, food, clothes, or nothing.
// The backpack is always "a backpack" — but what's INSIDE changes.
// ============================================

// ============================================
// GUIDED EXERCISE: Type this code yourself — comments explain each step
// ============================================

let shapeshifter; // Step 1: Declare without a value

console.log("Step 1:", typeof shapeshifter);
// typeof an uninitialized variable is "undefined"
// The box exists but it's empty

shapeshifter = 42; // Step 2: Assign a number
console.log("Step 2:", typeof shapeshifter, "| value:", shapeshifter);
// "number" — integers and decimals are BOTH "number" in JS

shapeshifter = "forty-two"; // Step 3: Overwrite with a string
console.log("Step 3:", typeof shapeshifter, "| value:", shapeshifter);
// "string" — any text in quotes is a string

shapeshifter = true; // Step 4: Overwrite with a boolean
console.log("Step 4:", typeof shapeshifter, "| value:", shapeshifter);
// "boolean" — only two values: true or false

shapeshifter = null; // Step 5: Explicitly set to nothing
console.log("Step 5:", typeof shapeshifter, "| value:", shapeshifter);
// *** FAMOUS JS BUG *** typeof null === "object" — this is a 27-year-old bug
// null means "intentionally empty" but typeof lies about it

shapeshifter = { name: "Dinesh" }; // Step 6: Assign an object
console.log("Step 6:", typeof shapeshifter, "| value:", shapeshifter);
// "object" — plain objects, arrays, and null all return "object"

shapeshifter = [1, 2, 3]; // Step 7: Assign an array
console.log("Step 7:", typeof shapeshifter, "| value:", shapeshifter);
// Still "object"! Arrays are objects in JS.
// To truly check for array: Array.isArray(shapeshifter)
console.log("  Is array?", Array.isArray(shapeshifter));

shapeshifter = function () {}; // Step 8: Assign a function
console.log("Step 8:", typeof shapeshifter, "| value:", shapeshifter);
// "function" — functions get their own typeof result (even though they're objects)

shapeshifter = Symbol("id"); // Step 9: Assign a Symbol (ES6)
console.log("Step 9:", typeof shapeshifter, "| value:", shapeshifter.toString());
// "symbol" — unique, immutable values. Used as object keys to avoid collisions

shapeshifter = 9007199254740991n; // Step 10: BigInt (ES2020)
console.log("Step 10:", typeof shapeshifter, "| value:", shapeshifter);
// "bigint" — for integers beyond Number.MAX_SAFE_INTEGER

// Summary table:
console.log("\n--- TYPE SUMMARY ---");
const allTypes = [
  undefined,
  42,
  "hello",
  true,
  null,
  { a: 1 },
  [1, 2],
  function () {},
  Symbol("x"),
  9007199254740991n,
];
allTypes.forEach((val) => {
  console.log(`typeof ${String(val).padEnd(20)} => "${typeof val}"`);
});

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. Why does typeof null return "object" even though null is not an object?
//    (Answer: historical bug from JS's first implementation — never fixed to avoid breaking the web)
//
// 2. How do you correctly check if something is an array?
//    (Answer: Array.isArray(value) — not typeof)
//
// 3. What's the difference between undefined and null?
//    (Answer: undefined = variable exists but has no value assigned
//             null = programmer intentionally set it to "nothing")
//
// 4. How many primitive types does JS have?
//    (Answer: 7 — undefined, null, boolean, number, string, symbol, bigint)
// ============================================

// ============================================
// YOUR TURN: Build a type checker utility
// ============================================
// Build a function called getType(value) that returns a MORE accurate type string than typeof.
// It should handle the typeof null === "object" bug and distinguish arrays from plain objects.
//
// Expected behavior:
//   getType(42)          → "number"
//   getType("hi")        → "string"
//   getType(true)        → "boolean"
//   getType(undefined)   → "undefined"
//   getType(null)        → "null"          ← typeof would wrongly say "object"
//   getType([1,2,3])     → "array"         ← typeof would say "object"
//   getType({a: 1})      → "object"
//   getType(function(){})→ "function"
//   getType(Symbol())    → "symbol"
//   getType(42n)         → "bigint"
//
// HINT: Use a series of checks. null check first, then Array.isArray, then typeof.

function getType(value) {
  // YOUR CODE HERE
}

// Test your function:
const testCases = [
  [42, "number"],
  ["hi", "string"],
  [true, "boolean"],
  [undefined, "undefined"],
  [null, "null"],
  [[1, 2, 3], "array"],
  [{ a: 1 }, "object"],
  [function () {}, "function"],
  [Symbol(), "symbol"],
  [42n, "bigint"],
];

console.log("\n--- YOUR TURN: Testing getType() ---");
testCases.forEach(([value, expected]) => {
  const result = getType(value);
  const status = result === expected ? "PASS" : `FAIL (got "${result}")`;
  console.log(`getType(${String(value).padEnd(15)}) expected "${expected}" → ${status}`);
});

// ============================================
// BOSS CHALLENGE: Build a strict comparator
// ============================================
// Build strictEqual(a, b) that:
// 1. Returns false if types differ (even before comparing values)
// 2. Returns false for NaN === NaN (JS's weird NaN rule)
// 3. Returns false for +0 === -0 (they're technically different)
// 4. Uses your getType() function from above for the type check
// 5. Returns true only when both value AND type match
//
// Expected behavior:
//   strictEqual(1, 1)         → true
//   strictEqual(1, "1")       → false  (different types)
//   strictEqual(NaN, NaN)     → false  (NaN is never equal to anything, including itself)
//   strictEqual(+0, -0)       → false  (subtle but real difference)
//   strictEqual(null, null)   → true
//   strictEqual(null, undefined) → false
//
// HINT: Object.is(a, b) correctly handles NaN and -0. But use getType() for the type check first.

function strictEqual(a, b) {
  // YOUR CODE HERE
}

console.log("\n--- BOSS CHALLENGE: Testing strictEqual() ---");
console.log(strictEqual(1, 1));         // true
console.log(strictEqual(1, "1"));       // false
console.log(strictEqual(NaN, NaN));     // false
console.log(strictEqual(+0, -0));       // false
console.log(strictEqual(null, null));   // true
console.log(strictEqual(null, undefined)); // false

// ============================================
// PATTERN LEARNED: Type System
// ============================================
// PATTERN NAME: Defensive Type Checking
// WHEN YOU SEE: A value coming from user input, an API, or a function you didn't write
// USE THIS: getType(value) or typeof + explicit null/array checks
//
// WHY: typeof has two lies:
//   Lie #1 → typeof null === "object"  (should be "null")
//   Lie #2 → typeof [] === "object"    (should be "array")
//
// RULE: Never use == for type-sensitive comparisons.
//       Always use === or Object.is() for edge cases (NaN, -0).
// ============================================
