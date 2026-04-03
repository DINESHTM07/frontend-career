// ============================================
// INTRO: What is Internal Implementation and WHY it matters
// ============================================
// Building array methods from scratch teaches you EXACTLY how they work internally.
// Most developers use map/filter/reduce without understanding their mechanics —
// which means they can't debug edge cases, optimize for performance, or build
// custom variants when the built-in doesn't quite fit.
//
// WHY it matters:
// 1. Interview question: "Implement Array.prototype.map" is extremely common.
// 2. Debugging: If you know the internals, unexpected behavior isn't mysterious.
// 3. Custom needs: Sometimes you need a variant — myMap with early exit, myFilter
//    with a count limit, myReduce that's async. You need the internals for this.
// 4. Deep understanding: Builds your mental model of higher-order functions.
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// Every array method is secretly a for loop with extra structure.
//
// myMap(arr, fn):
//   1. Create empty result array
//   2. Loop through arr
//   3. For each element: call fn(element, index, arr)
//   4. Push the RETURN VALUE of fn into result
//   5. Return result
//
// myFilter(arr, fn):
//   1. Create empty result array
//   2. Loop through arr
//   3. For each element: call fn(element, index, arr)
//   4. If the return value is TRUTHY: push element into result (NOT the return value)
//   5. Return result
//
// myReduce(arr, fn, initialValue):
//   1. If initialValue provided: acc = initialValue, start at index 0
//      If no initialValue: acc = arr[0], start at index 1
//   2. Loop from start to end
//   3. acc = fn(acc, currentElement, currentIndex, arr)
//   4. Return acc after loop
// ============================================

// ============================================
// GUIDED EXERCISE: Build myMap, myFilter, myReduce from scratch
// ============================================

console.log("=== BUILD ARRAY METHODS FROM SCRATCH ===\n");

// ---- Build myMap ----
function myMap(arr, callback) {
  // Guard: handle non-array inputs gracefully
  if (!Array.isArray(arr)) throw new TypeError("First argument must be an array");
  if (typeof callback !== "function") throw new TypeError("Second argument must be a function");

  const result = []; // Start with empty array

  for (let i = 0; i < arr.length; i++) {
    // Only process actual indices (skip holes in sparse arrays)
    if (i in arr) {
      // Call callback with same signature as native: (element, index, originalArray)
      result[i] = callback(arr[i], i, arr);
    }
  }

  return result;
}

// Test myMap
console.log("--- Testing myMap ---");
const nums = [1, 2, 3, 4, 5];

console.log("double:", myMap(nums, (n) => n * 2));          // [2, 4, 6, 8, 10]
console.log("stringify:", myMap(nums, (n) => `#${n}`));     // ['#1','#2',...]
console.log("with index:", myMap(nums, (n, i) => i * n));   // [0, 2, 6, 12, 20]

// Prove it matches native map
const nativeResult = nums.map((n) => n ** 2);
const myResult = myMap(nums, (n) => n ** 2);
console.log("Matches native map:", JSON.stringify(nativeResult) === JSON.stringify(myResult));

// ---- Build myFilter ----
function myFilter(arr, callback) {
  if (!Array.isArray(arr)) throw new TypeError("First argument must be an array");
  if (typeof callback !== "function") throw new TypeError("Second argument must be a function");

  const result = [];

  for (let i = 0; i < arr.length; i++) {
    if (i in arr) {
      // Call callback — if it returns truthy, push the ORIGINAL element (not return value!)
      if (callback(arr[i], i, arr)) {
        result.push(arr[i]);
      }
    }
  }

  return result;
}

// Test myFilter
console.log("\n--- Testing myFilter ---");
console.log("evens:", myFilter(nums, (n) => n % 2 === 0));   // [2, 4]
console.log("odds:", myFilter(nums, (n) => n % 2 !== 0));    // [1, 3, 5]
console.log("gt3:", myFilter(nums, (n) => n > 3));           // [4, 5]

// CRITICAL TEST: filter returns original elements, not callback return values
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob",   age: 17 },
  { name: "Carol", age: 30 },
];
const adults = myFilter(people, (p) => p.age >= 18);
console.log("Adults:", adults.map((p) => p.name));           // Alice, Carol

const nativeFilter = nums.filter((n) => n > 2);
const myFilterResult = myFilter(nums, (n) => n > 2);
console.log("Matches native filter:", JSON.stringify(nativeFilter) === JSON.stringify(myFilterResult));

// ---- Build myReduce ----
function myReduce(arr, callback, initialValue) {
  if (!Array.isArray(arr)) throw new TypeError("First argument must be an array");
  if (typeof callback !== "function") throw new TypeError("Second argument must be a function");

  // Edge case: empty array with no initialValue → TypeError (matches native behavior)
  if (arr.length === 0 && initialValue === undefined) {
    throw new TypeError("Reduce of empty array with no initial value");
  }

  let acc;
  let startIndex;

  if (initialValue !== undefined) {
    // initialValue provided: acc starts as initialValue, loop starts at 0
    acc = initialValue;
    startIndex = 0;
  } else {
    // No initialValue: acc starts as first element, loop starts at 1
    acc = arr[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < arr.length; i++) {
    if (i in arr) {
      // callback signature: (accumulator, currentValue, currentIndex, array)
      acc = callback(acc, arr[i], i, arr);
    }
  }

  return acc;
}

// Test myReduce
console.log("\n--- Testing myReduce ---");
console.log("sum:", myReduce(nums, (acc, n) => acc + n, 0));   // 15
console.log("product:", myReduce(nums, (acc, n) => acc * n, 1)); // 120
console.log("max:", myReduce(nums, (acc, n) => n > acc ? n : acc));  // 5 (no initialValue)
console.log("join:", myReduce(nums, (acc, n) => acc + "-" + n)); // "1-2-3-4-5" (no initialValue)

// Prove it matches native reduce
const nativeReduce = nums.reduce((acc, n) => acc + n, 0);
const myReduceResult = myReduce(nums, (acc, n) => acc + n, 0);
console.log("Matches native reduce:", nativeReduce === myReduceResult);

// Advanced: reduce building an object
const words = ["apple", "banana", "apple", "cherry", "banana", "apple"];
const counts = myReduce(words, (acc, word) => {
  acc[word] = (acc[word] || 0) + 1;
  return acc;
}, {});
console.log("Word counts:", counts);

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. Why does myFilter push arr[i] instead of the callback's return value?
//    Answer: filter's job is to SELECT elements, not transform them.
//    The callback is just a test (predicate) — truthy keeps the original element.
//
// 2. What happens if you call myReduce([1,2,3], fn) without an initialValue?
//    Answer: acc = arr[0] = 1, and the loop starts at index 1.
//    The first call to fn is fn(1, 2, 1, arr).
//
// 3. What's a "sparse array" and how should methods handle holes?
//    Answer: [1, , , 4] has holes at indices 1 and 2.
//    The `if (i in arr)` check skips holes, matching native behavior.
//
// 4. What's a higher-order function?
//    Answer: A function that takes a function as an argument (or returns one).
//    map/filter/reduce are all higher-order functions — they receive callbacks.
// ============================================

// ============================================
// YOUR TURN: Build myFind, myEvery, myFlat
// ============================================

// ---- YOUR TURN 1: myFind ----
// Native Array.find() returns the FIRST element where callback returns truthy.
// If nothing matches, return undefined.
// Signature: myFind(arr, callback)
//
// Example:
//   myFind([1,2,3,4], n => n > 2)  → 3  (first match, not all matches)
//   myFind([1,2,3], n => n > 10)   → undefined

function myFind(arr, callback) {
  // YOUR CODE HERE
}

// Test myFind:
console.log("\n--- YOUR TURN: myFind ---");
console.log(myFind([1, 2, 3, 4], (n) => n > 2));   // 3
console.log(myFind([1, 2, 3], (n) => n > 10));     // undefined
console.log(myFind(people, (p) => p.age < 20));    // { name: 'Bob', age: 17 }

// Verify against native:
console.log("Matches native find:", myFind(nums, n => n > 3) === nums.find(n => n > 3));

// ---- YOUR TURN 2: myEvery ----
// Native Array.every() returns true if ALL elements pass the test.
// Returns true for empty array (vacuous truth).
// SHORT-CIRCUITS: stops as soon as it finds a failing element.
// Signature: myEvery(arr, callback)
//
// Example:
//   myEvery([2,4,6], n => n % 2 === 0)  → true   (all even)
//   myEvery([2,4,5], n => n % 2 === 0)  → false  (5 is odd, stops here)
//   myEvery([], n => false)              → true   (empty = vacuously true)

function myEvery(arr, callback) {
  // YOUR CODE HERE
  // HINT: Return false as soon as one element fails. Return true if loop completes.
}

// Test myEvery:
console.log("\n--- YOUR TURN: myEvery ---");
console.log(myEvery([2, 4, 6], (n) => n % 2 === 0)); // true
console.log(myEvery([2, 4, 5], (n) => n % 2 === 0)); // false
console.log(myEvery([], (n) => false));               // true (empty array)
console.log(myEvery(people, (p) => p.age > 0));       // true (all positive ages)

// Verify against native:
console.log("Matches native every:", myEvery(nums, n => n > 0) === nums.every(n => n > 0));

// ---- YOUR TURN 3: myFlat ----
// Native Array.flat(depth) flattens nested arrays up to specified depth.
// Default depth is 1. Depth Infinity flattens all levels.
// Signature: myFlat(arr, depth = 1)
//
// Example:
//   myFlat([1, [2, 3], [4, [5]]])         → [1, 2, 3, 4, [5]] (depth 1)
//   myFlat([1, [2, 3], [4, [5]]], 2)      → [1, 2, 3, 4, 5]   (depth 2)
//   myFlat([1, [2, [3, [4]]]], Infinity)  → [1, 2, 3, 4]       (full flatten)

function myFlat(arr, depth = 1) {
  // YOUR CODE HERE
  // HINT: Use recursion. For each element:
  //   - If it's an array AND depth > 0: recurse with depth - 1
  //   - Otherwise: push as-is into result
}

// Test myFlat:
console.log("\n--- YOUR TURN: myFlat ---");
console.log(myFlat([1, [2, 3], [4, [5]]]));          // [1, 2, 3, 4, [5]]
console.log(myFlat([1, [2, 3], [4, [5]]], 2));        // [1, 2, 3, 4, 5]
console.log(myFlat([1, [2, [3, [4]]]], Infinity));    // [1, 2, 3, 4]
console.log(myFlat([1, 2, 3]));                       // [1, 2, 3] (no nesting)

// Verify against native:
const nested2 = [1, [2, 3], [4, [5, [6]]]];
console.log("Matches native flat(1):", JSON.stringify(myFlat(nested2)) === JSON.stringify(nested2.flat()));
console.log("Matches native flat(2):", JSON.stringify(myFlat(nested2, 2)) === JSON.stringify(nested2.flat(2)));

// ============================================
// BOSS CHALLENGE: Build mySome, myFindIndex, myFlatMap, myGroupBy
// ============================================

// ---- Boss 1: mySome ----
// Returns true if AT LEAST ONE element passes the test.
// Short-circuits on first truthy result (opposite of myEvery).
// myEvery is like AND (&&), mySome is like OR (||)

function mySome(arr, callback) {
  // YOUR CODE HERE
}

console.log("\n--- BOSS: mySome ---");
console.log(mySome([1, 3, 5], (n) => n % 2 === 0)); // false (no even numbers)
console.log(mySome([1, 2, 5], (n) => n % 2 === 0)); // true (2 is even)
console.log(mySome([], (n) => true));                // false (empty array)
console.log("Matches native some:", mySome(nums, n => n > 4) === nums.some(n => n > 4));

// ---- Boss 2: myFindIndex ----
// Like myFind, but returns the INDEX of the first match, not the element.
// Returns -1 if not found (like indexOf).

function myFindIndex(arr, callback) {
  // YOUR CODE HERE
}

console.log("\n--- BOSS: myFindIndex ---");
console.log(myFindIndex([1, 2, 3, 4], (n) => n > 2));  // 2 (index of 3)
console.log(myFindIndex([1, 2, 3], (n) => n > 10));    // -1
console.log("Matches native findIndex:", myFindIndex(nums, n => n > 3) === nums.findIndex(n => n > 3));

// ---- Boss 3: myFlatMap ----
// Equivalent to .map().flat(1) — map then flatten one level.
// More efficient than calling both separately.

function myFlatMap(arr, callback) {
  // YOUR CODE HERE — use myMap and myFlat internally, or implement directly
}

console.log("\n--- BOSS: myFlatMap ---");
const sentences = ["Hello World", "JS is fun"];
console.log(myFlatMap(sentences, (s) => s.split(" "))); // ['Hello','World','JS','is','fun']
console.log(myFlatMap([1, 2, 3], (n) => [n, n * 2]));  // [1,2,2,4,3,6]
console.log("Matches native flatMap:", JSON.stringify(myFlatMap(nums, n => [n, n])) ===
  JSON.stringify(nums.flatMap(n => [n, n])));

// ---- Boss 4: myGroupBy ----
// Groups array elements by the result of a key function.
// Returns an object where keys are the group names.
// Note: This is similar to Object.groupBy() in ES2024 — great to know the internals.

function myGroupBy(arr, keyFn) {
  // YOUR CODE HERE — use myReduce internally!
}

console.log("\n--- BOSS: myGroupBy ---");
console.log(myGroupBy([1, 2, 3, 4, 5], (n) => n % 2 === 0 ? "even" : "odd"));
// { odd: [1,3,5], even: [2,4] }

console.log(myGroupBy(people, (p) => p.age >= 18 ? "adult" : "minor"));
// { adult: [{Alice},{Carol}], minor: [{Bob}] }

console.log(myGroupBy(words, (w) => w));
// { apple: ['apple','apple','apple'], banana: [...], cherry: [...] }

// ============================================
// PATTERN LEARNED: Internal Implementation
// ============================================
// PATTERN NAME: Callback-Based Higher-Order Functions
// WHEN YOU SEE: "Implement X" interview question, or need custom variant of built-in
// USE THIS: for loop + accumulate results + call callback with (element, index, array)
//
// IMPLEMENTATION TEMPLATE:
//   function myMethod(arr, callback) {
//     const result = []; // or appropriate initial value
//     for (let i = 0; i < arr.length; i++) {
//       if (i in arr) {           // handle sparse arrays
//         const returnValue = callback(arr[i], i, arr);
//         // decide what to do with returnValue based on method's contract:
//         //   map: result[i] = returnValue
//         //   filter: if (returnValue) result.push(arr[i])
//         //   reduce: acc = returnValue (no push — single accumulator)
//         //   find: if (returnValue) return arr[i]
//         //   every: if (!returnValue) return false
//         //   some: if (returnValue) return true
//       }
//     }
//     return result; // or acc, or true/false/-1
//   }
//
// KEY INSIGHT: All these methods are the SAME loop with different policies
// for what to do with the callback's return value.
// ============================================
