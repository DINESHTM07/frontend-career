# Recursion — 10 Problems

Every recursive solution has the same anatomy:
1. **Base case(s):** The simplest input where the answer is known directly.
2. **Recursive case:** Break the problem into a smaller version of itself, call recursively, use the result.

**Trust the recursion:** When writing the recursive case, assume the recursive call correctly solves the subproblem. Don't trace through it manually — just use its result.

```
T(n) = Work per call × Number of subproblems branching from each call
     + Cost to combine results
```

---

## Problem 1 — Fibonacci (with Memoization)

### PROBLEM STATEMENT
Return the nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).

### EXAMPLES
```
F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8, F(10)=55
```

### **PATTERN: Memoization (Top-Down DP)**

### BRUTE FORCE — Naive Recursion
```javascript
function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}
// Time: O(2^n) — exponential! fibNaive(5) computes fibNaive(3) twice, fibNaive(2) three times
```

### OPTIMAL APPROACH

```javascript
// Memoization: cache results to avoid redundant computation
function fib(n, memo = new Map()) {
  if (n <= 1) return n;                   // Base cases
  if (memo.has(n)) return memo.get(n);    // Cached result

  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}

// Bottom-up DP (iterative, no recursion overhead)
function fibIterative(n) {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}

// Tests
console.log(fib(10));         // 55
console.log(fib(50));         // 12586269025
console.log(fibIterative(10)); // 55
```

- Naive: **Time:** O(2^n) | **Space:** O(n) stack
- Memoized: **Time:** O(n) | **Space:** O(n) memo + O(n) stack
- Iterative: **Time:** O(n) | **Space:** O(1)

### WHY THIS PATTERN
**Memoization** caches the result of each unique subproblem. The key observation: F(n) only depends on F(n-1) and F(n-2), and both are computed many times in the naive recursion tree. Adding a cache converts the exponential tree into a linear chain. The memo map converts overlapping subproblems from repeated work into single computations. This is the definition of dynamic programming.

---

## Problem 2 — Factorial

### PROBLEM STATEMENT
Return n! (n factorial). 0! = 1, 1! = 1, n! = n × (n-1)!

### EXAMPLES
```
factorial(0) = 1
factorial(1) = 1
factorial(5) = 120
factorial(10) = 3628800
```

### **PATTERN: Base Case + Recursive Reduction**

### OPTIMAL APPROACH

```javascript
function factorial(n) {
  if (n < 0) throw new Error('Factorial undefined for negative numbers');
  if (n <= 1) return 1;         // Base case: 0! = 1! = 1
  return n * factorial(n - 1);  // Recursive case: n! = n × (n-1)!
}

// Iterative version
function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// Tail-recursive version (optimized in engines that support TCO)
function factorialTail(n, acc = 1) {
  if (n <= 1) return acc;
  return factorialTail(n - 1, n * acc); // Accumulate in second parameter
}

// Tests
console.log(factorial(5));          // 120
console.log(factorial(10));         // 3628800
console.log(factorialTail(5));      // 120
```

- **Time:** O(n) | **Space:** O(n) call stack (O(1) for iterative)

### WHY THIS PATTERN
The simplest recursive pattern. The key is identifying: (1) the base case where no further recursion is needed, and (2) the reduction: how does f(n) relate to f(n-1)? For factorial: f(n) = n × f(n-1). The tail-recursive version accumulates the result in a parameter — this allows tail call optimization in languages that support it (JavaScript does in strict mode, rarely used in practice).

---

## Problem 3 — Sum of Array

### PROBLEM STATEMENT
Recursively find the sum of all elements in an array.

### EXAMPLES
```
sum([1,2,3,4,5]) = 15
sum([]) = 0
sum([-1, 1]) = 0
```

### **PATTERN: Divide (Reduce to Smaller Subproblem)**

### OPTIMAL APPROACH

```javascript
function sum(arr) {
  if (arr.length === 0) return 0;             // Base case: empty array
  return arr[0] + sum(arr.slice(1));          // Head + sum(tail)
}

// More efficient: use index to avoid slice (O(n) extra space per call)
function sumWithIndex(arr, i = 0) {
  if (i === arr.length) return 0;             // Base case
  return arr[i] + sumWithIndex(arr, i + 1);  // Current + sum of rest
}

// Divide and conquer: split in half
function sumDivide(arr, lo = 0, hi = arr.length - 1) {
  if (lo > hi) return 0;
  if (lo === hi) return arr[lo];              // Single element
  const mid = Math.floor((lo + hi) / 2);
  return sumDivide(arr, lo, mid) + sumDivide(arr, mid + 1, hi);
}

// Tests
console.log(sum([1, 2, 3, 4, 5])); // 15
console.log(sum([]));               // 0
console.log(sumWithIndex([1,2,3,4,5])); // 15
```

- `sum`: **Time:** O(n) | **Space:** O(n²) — `slice` creates new arrays
- `sumWithIndex`: **Time:** O(n) | **Space:** O(n) — index avoids slice
- `sumDivide`: **Time:** O(n) | **Space:** O(log n) — balanced tree

### WHY THIS PATTERN
Array recursion: `f(array) = f(head) combine f(tail)`. The base case is always the empty array (or single element for D&C). Using an index instead of `slice` is the performance optimization — `arr.slice(1)` creates a new O(n) array at every call level, leading to O(n²) total space. This index pattern generalizes to all array recursive problems.

---

## Problem 4 — Power Function

### PROBLEM STATEMENT
Compute `base^exponent` efficiently. Handle negative exponents. (LeetCode 50)

### EXAMPLES
```
pow(2, 10)   = 1024
pow(2, -2)   = 0.25
pow(2.1, 3)  = 9.261
pow(2, 0)    = 1
```

### **PATTERN: Divide and Conquer (Exponentiation by Squaring)**

### BRUTE FORCE
Multiply base by itself exp times. O(n).

### OPTIMAL APPROACH
`base^n = (base^(n/2))^2` for even n, `base × base^(n-1)` for odd n. Recursion depth is log(n).

```javascript
function myPow(base, exp) {
  if (exp === 0) return 1;                   // Base case: anything^0 = 1
  if (exp < 0) return 1 / myPow(base, -exp); // Negative: flip and recurse

  if (exp % 2 === 0) {
    const half = myPow(base, exp / 2);       // Compute once, square it
    return half * half;
  } else {
    return base * myPow(base, exp - 1);      // Odd: factor out one base
  }
}

// Iterative version (avoids call stack)
function myPowIterative(base, exp) {
  if (exp < 0) { base = 1 / base; exp = -exp; }
  let result = 1;

  while (exp > 0) {
    if (exp % 2 === 1) result *= base;  // Odd: multiply result
    base *= base;                        // Square the base
    exp = Math.floor(exp / 2);          // Halve the exponent
  }

  return result;
}

// Tests
console.log(myPow(2, 10));        // 1024
console.log(myPow(2, -2));        // 0.25
console.log(myPow(2, 0));         // 1
console.log(myPowIterative(2,10)); // 1024
```

- **Time:** O(log n) — halving exponent each level | **Space:** O(log n) recursion depth

**Trace for pow(2, 10):**
```
pow(2,10): even → half=pow(2,5). return half*half
  pow(2,5):  odd  → 2 * pow(2,4)
    pow(2,4): even → half=pow(2,2). return half*half
      pow(2,2): even → half=pow(2,1). return half*half
        pow(2,1): odd → 2 * pow(2,0) = 2 * 1 = 2
      half=2. return 4
    half=4. return 16
  return 2 * 16 = 32
half=32. return 32*32 = 1024 ✓
```

### WHY THIS PATTERN
Exponentiation by squaring reduces O(n) multiplications to O(log n) by exploiting the recurrence `x^n = (x^(n/2))²`. This is divide and conquer: divide the problem in half at each step. The computed `half` is reused (not computed twice), which is the critical efficiency gain over the naive O(n) approach.

---

## Problem 5 — Flatten Nested Array

### PROBLEM STATEMENT
Flatten an arbitrarily nested array into a single-level array.

### EXAMPLES
```
Input:  [1, [2, [3, [4]], 5]]
Output: [1, 2, 3, 4, 5]

Input:  [[1,2],[3,[4,5]]]
Output: [1, 2, 3, 4, 5]
```

### **PATTERN: Recursive Traversal + Concat**

### OPTIMAL APPROACH

```javascript
function flatten(arr) {
  const result = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item)); // Recursively flatten nested array
    } else {
      result.push(item);             // Leaf value — add directly
    }
  }

  return result;
}

// Using reduce (functional style)
function flattenReduce(arr) {
  return arr.reduce((acc, item) =>
    Array.isArray(item)
      ? acc.concat(flattenReduce(item))
      : acc.concat(item),
    []
  );
}

// Flatten to specific depth (Array.prototype.flat(depth) built-in)
function flattenDepth(arr, depth = 1) {
  if (depth === 0) return arr.slice(); // No more flattening
  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...flattenDepth(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

// Tests
console.log(flatten([1, [2, [3, [4]], 5]]));   // [1,2,3,4,5]
console.log(flatten([[1,2],[3,[4,5]]]));        // [1,2,3,4,5]
console.log(flattenDepth([1,[2,[3]]], 1));      // [1,2,[3]]
```

- **Time:** O(n) where n = total elements | **Space:** O(n + d) where d = nesting depth

### WHY THIS PATTERN
The recursive structure of nested arrays maps directly to recursive traversal. The decision at each node: is it an array (recurse) or a value (collect)? This "tree traversal" mental model applies to nested objects, JSON structures, and DOM trees. `Array.isArray()` is the type discriminator. The spread `...flatten(item)` flattens one level at a time from the return value.

---

## Problem 6 — Deep Clone Object

### PROBLEM STATEMENT
Create a deep clone of a JavaScript value — handles objects, arrays, Date, RegExp, and primitives.

### EXAMPLES
```
const a = { x: 1, y: { z: 2 } };
const b = deepClone(a);
b.y.z = 99;
console.log(a.y.z); // 2 (not 99 — truly deep cloned)
```

### **PATTERN: Recursive Traversal (Type-Based Dispatch)**

### OPTIMAL APPROACH

```javascript
function deepClone(value) {
  // Primitives: null, undefined, number, string, boolean, symbol, BigInt
  if (value === null || typeof value !== 'object') return value;

  // Handle special object types
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  // Array
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item)); // Recursively clone each element
  }

  // Plain object
  const cloned = {};
  for (const key of Object.keys(value)) {
    cloned[key] = deepClone(value[key]); // Recursively clone each property
  }
  return cloned;
}

// Test
const original = {
  name: 'Alice',
  scores: [1, 2, 3],
  meta: { created: new Date('2024-01-01'), tag: /test/gi },
  nested: { deep: { value: 42 } }
};

const clone = deepClone(original);
clone.scores.push(4);
clone.nested.deep.value = 99;
clone.meta.created.setFullYear(2000);

console.log(original.scores);           // [1,2,3] — unchanged
console.log(original.nested.deep.value); // 42 — unchanged
console.log(original.meta.created.getFullYear()); // 2024 — unchanged
```

- **Time:** O(n) where n = total nodes | **Space:** O(n + d) where d = depth

### WHY THIS PATTERN
Deep cloning requires visiting every node in the value tree. The pattern: dispatch on type → handle leaves (primitives) as base cases → recursively handle composite types (arrays, objects). `typeof` and `instanceof` are the type discriminators. The common interview pitfall: `JSON.parse(JSON.stringify(x))` fails for Date, RegExp, functions, undefined values, and circular references.

---

## Problem 7 — Binary Search (Recursive)

### PROBLEM STATEMENT
Find the index of target in a sorted array. Return -1 if not found.

### EXAMPLES
```
binarySearch([1,2,3,4,5,6,7], 5)   →  4
binarySearch([1,2,3,4,5,6,7], 8)   →  -1
binarySearch([1], 1)                →  0
```

### **PATTERN: Divide Interval (Halving)**

### OPTIMAL APPROACH

```javascript
function binarySearch(arr, target, lo = 0, hi = arr.length - 1) {
  if (lo > hi) return -1;                          // Base case: not found

  const mid = Math.floor((lo + hi) / 2);

  if (arr[mid] === target) return mid;             // Found!
  if (arr[mid] < target) return binarySearch(arr, target, mid + 1, hi); // Right half
  return binarySearch(arr, target, lo, mid - 1);  // Left half
}

// Test
console.log(binarySearch([1,2,3,4,5,6,7], 5)); // 4
console.log(binarySearch([1,2,3,4,5,6,7], 8)); // -1
console.log(binarySearch([1], 1));              // 0
```

- **Time:** O(log n) | **Space:** O(log n) — recursion depth

**Why `lo > hi` not `lo === hi`?** When lo === hi, there's still one element to check. The base case is when the interval is empty (lo has crossed hi). The mid calculation `(lo + hi) / 2` uses integer division — use `lo + Math.floor((hi - lo) / 2)` to avoid integer overflow in languages with fixed int size (not an issue in JS but good practice).

### WHY THIS PATTERN
Binary search halves the search space at each step → O(log n). The recursive version naturally expresses the "reduce to subproblem" structure. The iterative version (move lo/hi pointers) is preferred in practice for O(1) space. Both implementations revolve around the same invariant: the target, if present, is within `[lo, hi]`.

---

## Problem 8 — Count Occurrences in Nested Object

### PROBLEM STATEMENT
Given a nested object/array, count how many times a given value appears anywhere in the structure.

### EXAMPLES
```
const data = { a: 1, b: { c: 1, d: [1, 2, 1] }, e: 1 };
countOccurrences(data, 1) → 5

const data2 = { x: 'foo', y: ['foo', { z: 'foo' }] };
countOccurrences(data2, 'foo') → 3
```

### **PATTERN: Recursive Tree Traversal**

### OPTIMAL APPROACH

```javascript
function countOccurrences(node, target) {
  // Base case: primitive value
  if (node === null || typeof node !== 'object') {
    return node === target ? 1 : 0;
  }

  let count = 0;

  if (Array.isArray(node)) {
    for (const item of node) {
      count += countOccurrences(item, target); // Recurse into each element
    }
  } else {
    for (const key of Object.keys(node)) {
      count += countOccurrences(node[key], target); // Recurse into each value
    }
  }

  return count;
}

// Tests
const data = { a: 1, b: { c: 1, d: [1, 2, 1] }, e: 1 };
console.log(countOccurrences(data, 1));     // 5

const data2 = { x: 'foo', y: ['foo', { z: 'foo' }] };
console.log(countOccurrences(data2, 'foo')); // 3
```

- **Time:** O(n) | **Space:** O(d) where d = nesting depth

### WHY THIS PATTERN
Nested objects are trees. Recursively traverse all nodes, accumulating counts at leaf nodes. The key decision: array → iterate by index; object → iterate by key; primitive → check value. This structure (dispatch on type, recurse on composite, collect at leaves) is universal for any nested data traversal: deep search, deep transform, schema validation.

---

## Problem 9 — Generate Parentheses

### PROBLEM STATEMENT
Generate all combinations of `n` pairs of valid parentheses. (LeetCode 22)

### EXAMPLES
```
n=1 → ["()"]
n=2 → ["(())", "()()"]
n=3 → ["((()))", "(()())", "(())()", "()(())", "()()()"]
```

### **PATTERN: Backtracking with Constraints**

### OPTIMAL APPROACH
At each step, you can add `(` if `open < n`, or `)` if `close < open`. Backtrack when neither is valid.

```javascript
function generateParentheses(n) {
  const result = [];

  function backtrack(current, open, close) {
    if (current.length === 2 * n) {  // Base case: placed all 2n brackets
      result.push(current);
      return;
    }

    if (open < n) {
      backtrack(current + '(', open + 1, close); // Add opening bracket
    }
    if (close < open) {
      backtrack(current + ')', open, close + 1); // Add closing bracket
    }
  }

  backtrack('', 0, 0);
  return result;
}

// Tests
console.log(generateParentheses(1)); // ["()"]
console.log(generateParentheses(2)); // ["(())", "()()"]
console.log(generateParentheses(3).length); // 5 (Catalan number C3)
```

- **Time:** O(4^n / √n) — nth Catalan number of valid sequences
- **Space:** O(n) — recursion depth, plus O(result) for output

**Decision tree for n=2:**
```
backtrack('', 0, 0)
├── add '(':  backtrack('(', 1, 0)
│   ├── add '(':  backtrack('((', 2, 0)
│   │   └── add ')':  backtrack('(()', 2, 1)
│   │       └── add ')':  backtrack('(())', 2, 2) → push "(())" ✓
│   └── add ')':  backtrack('()', 1, 1)
│       └── add '(':  backtrack('()(', 2, 1)
│           └── add ')':  backtrack('()()', 2, 2) → push "()()" ✓
```

### WHY THIS PATTERN
Backtracking with validity constraints is more efficient than generating all combinations and filtering. By only making valid moves (`open < n` and `close < open`), no invalid string is ever fully built — pruning happens at each step. The two constraints encode all rules of valid parentheses: you can't add more `(` than n, and you can't add `)` before there's an unmatched `(` to close.

---

## Problem 10 — Generate All Subsets

### PROBLEM STATEMENT
Return all subsets (the power set) of an array of unique elements. (LeetCode 78)

### EXAMPLES
```
Input:  [1,2,3]
Output: [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]  (8 = 2^3 subsets)

Input:  [1]
Output: [[], [1]]

Input:  []
Output: [[]]
```

### **PATTERN: Include / Exclude (Backtracking)**

### OPTIMAL APPROACH
For each element, make a binary choice: **include** it or **exclude** it.

```javascript
function subsets(nums) {
  const result = [];

  function backtrack(index, current) {
    result.push([...current]); // Add current subset (at every level, not just leaves)

    for (let i = index; i < nums.length; i++) {
      current.push(nums[i]);        // Include nums[i]
      backtrack(i + 1, current);    // Recurse with remaining elements
      current.pop();                // Exclude nums[i] (backtrack)
    }
  }

  backtrack(0, []);
  return result;
}

// Pure include/exclude decision tree
function subsetsDecisionTree(nums) {
  const result = [];

  function helper(index, current) {
    if (index === nums.length) {
      result.push([...current]);
      return;
    }

    // Exclude nums[index]
    helper(index + 1, current);

    // Include nums[index]
    current.push(nums[index]);
    helper(index + 1, current);
    current.pop();
  }

  helper(0, []);
  return result;
}

// Tests
console.log(subsets([1,2,3]));
// [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]

console.log(subsets([]).length); // 1 (just the empty set)
console.log(subsets([1]).length); // 2
```

- **Time:** O(n × 2^n) — 2^n subsets, O(n) to copy each
- **Space:** O(n) — recursion depth

**Why `[...current]` not `current`?** Arrays are reference types. If we push `current` directly, all collected subsets point to the same array object, which gets modified by subsequent push/pop operations. Spreading creates a snapshot copy.

### WHY THIS PATTERN
The **include/exclude** pattern maps directly to the binary nature of subsets: each element is either in or not in a subset. The decision tree has 2^n leaves (one per subset). The iterative `push/pop` pattern keeps a single `current` array and restores it after exploring each branch — this is the canonical backtracking approach. The same pattern generates combinations (fix subset size) and solves the subset-sum problem (add a validity constraint).

---

## Pattern Summary

| Problem | Pattern | Time | Space |
|---------|---------|------|-------|
| Fibonacci | Memoization (cache subproblems) | O(n) | O(n) |
| Factorial | Base case + reduction | O(n) | O(n) |
| Sum of array | Head + tail recursion | O(n) | O(n) |
| Power function | Divide and conquer (halving) | O(log n) | O(log n) |
| Flatten nested array | Type dispatch + collect | O(n) | O(n+d) |
| Deep clone | Type dispatch + copy | O(n) | O(n+d) |
| Binary search | Divide interval | O(log n) | O(log n) |
| Count in nested object | Tree traversal + sum | O(n) | O(d) |
| Generate parentheses | Backtracking + prune | O(4^n/√n) | O(n) |
| Generate subsets | Include/exclude | O(n × 2^n) | O(n) |

**Recursion complexity guide:**
```
O(log n)  → halving: binary search, power function
O(n)      → linear reduction: factorial, sum, flatten
O(n²)     → accidental — often fixable with index instead of slice
O(2^n)    → binary choices: subsets
O(n!)     → all orderings: permutations
```
