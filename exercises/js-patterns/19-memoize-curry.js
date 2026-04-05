// ============================================
// INTRO: Memoization and Currying and WHY they matter
// ============================================
// MEMOIZATION is a caching technique: store the result of a function call
// indexed by its inputs. If the same inputs come again, return the cached
// result instantly instead of recomputing.
//
// CURRYING transforms a function with multiple parameters into a chain of
// single-parameter functions. Instead of add(1, 2), you write add(1)(2).
// This enables PARTIAL APPLICATION — creating a specialized version of a
// function with some arguments pre-filled.
//
// WHY they matter:
// Memoization: React.memo, useMemo, useCallback are all forms of memoization.
//   Avoid expensive re-renders, cache API responses, speed up recursive algorithms.
//
// Currying: Creates reusable, composable utility functions.
//   const double = multiply(2);     ← partial application
//   const tax = percentage(0.18);   ← reusable specialized function
//   [1,2,3].map(double)             ← clean, point-free style
//
// These are FUNCTIONAL PROGRAMMING patterns — the same ideas powering
// React's hooks, Redux's reducers, and functional utilities like lodash/fp.
// ============================================

// ============================================
// MENTAL MODEL: How to think about them
// ============================================
// Memoization: You're a student who memorizes answers.
//   First time teacher asks "12 × 13?" — you calculate: 156. Write it down.
//   Next time same question: read from notes. No calculation needed.
//   Trade memory for speed. Works when same inputs always give same output.
//
// Currying: Assembly line with staged inputs.
//   Regular: addTax(price, rate) needs both at once.
//   Curried: addTax(rate)(price) — configure the rate once, apply to any price later.
//   Like a function factory: withTax = addTax(0.18) → withTax(100) → 118
// ============================================

console.log("=== MEMOIZATION AND CURRYING ===\n");

// ---- PART 1: Build memoize from scratch ----

console.log("--- PART 1: Building memoize ---\n");

function memoize(fn) {
  const cache = new Map(); // Map allows any value as key (not just strings)

  return function(...args) {
    // Create a cache key from the arguments
    // JSON.stringify works for primitives and simple objects
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`  [CACHE HIT] key: ${key}`);
      return cache.get(key);
    }

    console.log(`  [COMPUTE]   key: ${key}`);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Test with simple arithmetic
const memoAdd = memoize((a, b) => a + b);
console.log("memoAdd(2, 3):", memoAdd(2, 3));   // COMPUTE
console.log("memoAdd(2, 3):", memoAdd(2, 3));   // CACHE HIT
console.log("memoAdd(5, 5):", memoAdd(5, 5));   // COMPUTE
console.log("memoAdd(2, 3):", memoAdd(2, 3));   // CACHE HIT again

// ---- PART 2: Memoize with fibonacci — dramatic speedup ----

console.log("\n--- PART 2: Fibonacci — naive vs memoized ---\n");

// NAIVE: exponential time O(2^n) — recalculates same subproblems
function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// MEMOIZED: linear time O(n) — each subproblem computed once
const fibMemo = memoize(function fib(n) {
  if (n <= 1) return n;
  return fibMemo(n - 1) + fibMemo(n - 2); // recursive calls also hit cache!
});

// Time the difference
console.log("Testing fib(35):");

let start = Date.now();
const naiveResult = fibNaive(35);
const naiveTime = Date.now() - start;
console.log(`  Naive:    fib(35) = ${naiveResult} in ${naiveTime}ms`);

start = Date.now();
const memoResult = fibMemo(35);
const memoTime = Date.now() - start;
console.log(`  Memoized: fib(35) = ${memoResult} in ${memoTime}ms`);

// Second call to memoized (completely cached now)
start = Date.now();
fibMemo(35);
const cachedTime = Date.now() - start;
console.log(`  Cached:   fib(35) returned in ${cachedTime}ms (0ms expected)\n`);

// Even better: memoized fib can handle larger numbers
console.log("  fib(40) with memoized:", fibMemo(40));
console.log("  (naive would take seconds!)");

// ---- PART 3: Memoize with custom key function ----

console.log("\n--- PART 3: Memoize with custom key resolver ---\n");

// Problem: JSON.stringify doesn't work for objects with functions,
// circular references, or when you want to cache by specific fields
function memoizeWithKey(fn, keyFn) {
  const cache = new Map();

  return function(...args) {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return { result: cache.get(key), fromCache: true };
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return { result, fromCache: false };
  };
}

// Cache API responses by URL
const fetchUserMemo = memoizeWithKey(
  (userId) => {
    // Simulated fetch
    return { id: userId, name: `User ${userId}`, email: `user${userId}@test.com` };
  },
  (userId) => `user:${userId}` // custom key — just the userId
);

console.log("Fetching user 1:", fetchUserMemo(1));
console.log("Fetching user 1:", fetchUserMemo(1)); // fromCache: true
console.log("Fetching user 2:", fetchUserMemo(2)); // new compute

// ---- PART 4: Build curry from scratch ----

console.log("\n--- PART 4: Building curry ---\n");

// curry(fn): transforms fn(a, b, c) into fn(a)(b)(c)
// Also supports partial application: fn(a, b)(c) or fn(a)(b, c)
function curry(fn) {
  const arity = fn.length; // number of expected parameters

  return function curried(...args) {
    if (args.length >= arity) {
      // Have enough args — execute the original function
      return fn.apply(this, args);
    }

    // Not enough args — return a new function waiting for more
    return function(...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

// Test with 2-parameter function
const add = curry((a, b) => a + b);

console.log("Curried add:");
console.log("  add(1, 2):", add(1, 2));   // Both args at once
console.log("  add(1)(2):", add(1)(2));   // One at a time
const add10 = add(10);                    // Partial application: lock in first arg
console.log("  add10(5):", add10(5));     // add10 is a specialized add function
console.log("  add10(20):", add10(20));   // Reusable!

// Test with 3-parameter function
const multiply3 = curry((a, b, c) => a * b * c);
console.log("\nCurried multiply3:");
console.log("  all at once:", multiply3(2, 3, 4));
console.log("  one-by-one:", multiply3(2)(3)(4));
console.log("  two + one:", multiply3(2, 3)(4));
const double = multiply3(2)(1); // double = multiply3(2, 1, c) → 2 * 1 * c = 2c
console.log("  double(5):", double(5));
console.log("  double(10):", double(10));

// ---- PART 5: Currying for practical patterns ----

console.log("\n--- PART 5: Currying for reusable functions ---\n");

// Pattern 1: Configurable utilities
const multiply = curry((factor, n) => n * factor);
const double2 = multiply(2);
const triple  = multiply(3);
const withGST = multiply(1.18);  // 18% GST

console.log("Array transformations with curried functions:");
console.log("  [1,2,3].map(double):", [1, 2, 3].map(double2));
console.log("  [1,2,3].map(triple):", [1, 2, 3].map(triple));
console.log("  Prices with GST:", [100, 250, 500].map(withGST));

// Pattern 2: Curried filter predicates
const isGreaterThan = curry((threshold, n) => n > threshold);
const isLessThan    = curry((threshold, n) => n < threshold);
const isEqualTo     = curry((expected, x) => x === expected);

const numbers = [1, 5, 10, 15, 20, 25];
console.log("\nCurried filter predicates:");
console.log("  > 10:", numbers.filter(isGreaterThan(10)));
console.log("  < 15:", numbers.filter(isLessThan(15)));
console.log("  === 15:", numbers.filter(isEqualTo(15)));

// Pattern 3: Curried event handlers (common in React)
const handleChange = curry((setter, e) => setter(e.target.value));
// In React:
//   const [name, setName] = useState("")
//   <input onChange={handleChange(setName)} />
console.log("\nCurried event handler created:", typeof handleChange(console.log));

// Pattern 4: API caller with curried config
const createApiCall = curry((baseURL, endpoint, params) => {
  const url = `${baseURL}${endpoint}?${new URLSearchParams(params).toString()}`;
  return { url, method: "GET" };
});

const callJSONPlaceholder = createApiCall("https://jsonplaceholder.typicode.com");
const getPost  = callJSONPlaceholder("/posts");
const getUsers = callJSONPlaceholder("/users");

console.log("\nCurried API factory:");
console.log("  getPost({ id: 1 }):", getPost({ id: 1 }));
console.log("  getUsers({ _limit: 5 }):", getUsers({ _limit: 5 }));

// ---- PART 6: Memoize + Curry combined ----

console.log("\n--- PART 6: Memoize + Curry = Memoized Partial Application ---\n");

// Cache results per partial application
const memoizedMultiply = memoize(curry((a, b) => {
  console.log(`  Computing ${a} × ${b}`);
  return a * b;
}));

const times5 = memoizedMultiply(5);

console.log("times5(6):", times5(6)); // compute
console.log("times5(6):", times5(6)); // cache hit
console.log("times5(7):", times5(7)); // compute 5 × 7

// ---- PART 7: Memoized API cache pattern ----

console.log("\n--- PART 7: Memoized API cache ---\n");

// Production pattern: cache API responses to avoid redundant network calls
function createApiCache(fetchFn, ttlMs = 5 * 60 * 1000) { // 5 min default TTL
  const cache = new Map(); // key → { data, expiresAt }

  return async function cachedFetch(...args) {
    const key = JSON.stringify(args);
    const now = Date.now();

    // Return cached value if still fresh
    if (cache.has(key)) {
      const { data, expiresAt } = cache.get(key);
      if (now < expiresAt) {
        console.log(`  [CACHE] Returning cached response for: ${key}`);
        return data;
      }
      console.log(`  [STALE] Cache expired for: ${key}, refetching...`);
      cache.delete(key);
    }

    // Fetch fresh data
    console.log(`  [FETCH] Calling API for: ${key}`);
    const data = await fetchFn(...args);
    cache.set(key, { data, expiresAt: now + ttlMs });
    return data;
  };
}

// Simulated fetch
async function mockFetchUser(userId) {
  return new Promise(resolve =>
    setTimeout(() => resolve({ id: userId, name: `User ${userId}` }), 50)
  );
}

const cachedFetchUser = createApiCache(mockFetchUser, 200); // 200ms TTL for demo

async function testApiCache() {
  console.log("API cache test:");
  await cachedFetchUser(1);  // fetch
  await cachedFetchUser(2);  // fetch (different id)
  await cachedFetchUser(1);  // cache hit
  await cachedFetchUser(2);  // cache hit

  // Wait for TTL to expire
  await new Promise(r => setTimeout(r, 250));
  await cachedFetchUser(1);  // stale → refetch
  console.log("  (Cache expired after 200ms — refetched)");
}

setTimeout(testApiCache, 500);

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. When should you NOT use memoize?
//    Answer: When the function has side effects (it's not a "pure" function),
//    when inputs are large objects (JSON.stringify is slow and lossy),
//    when results change over time (API calls without TTL), or when the
//    function is called with too many different inputs (memory leak from
//    unlimited cache growth).
//
// 2. What is "arity" in the context of currying?
//    Answer: Arity is the number of parameters a function expects.
//    fn.length returns this. Currying uses arity to know when enough
//    arguments have been collected to call the original function.
//
// 3. What is the difference between currying and partial application?
//    Answer: Currying strictly converts fn(a,b,c) to fn(a)(b)(c) — one
//    argument per call. Partial application pre-fills SOME arguments but
//    not necessarily one at a time: const add5 = add.bind(null, 5) pre-fills
//    one arg but add5(1, 2) still takes multiple. Curried functions naturally
//    support partial application as a side effect.
//
// 4. How does React.memo relate to the memoize function you built?
//    Answer: React.memo memoizes a React component — it only re-renders
//    if its props change (shallow comparison). useMemo memoizes a computed
//    value within a component. Both follow the same idea: "if inputs haven't
//    changed, return the cached output." Your memoize() is the pure-function
//    equivalent; React's are optimized for the component lifecycle.
// ============================================

// ============================================
// YOUR TURN: Memoized API Cache
// ============================================
// Build a full-featured API cache system for a React app.
//
// Step 1 — Build memoizeAsync(fn, options):
//   options: {
//     ttl: 300000,         // milliseconds until cache expires (5min default)
//     maxSize: 100,        // max number of entries (LRU eviction when full)
//     keyFn: null,         // custom key function (default: JSON.stringify(args))
//     onHit: null,         // callback when cache hit: onHit(key, data)
//     onMiss: null,        // callback when cache miss: onMiss(key)
//     onExpire: null,      // callback when entry expires: onExpire(key)
//   }
//   Returns the memoized function AND .clear() and .invalidate(key) methods
//   Invalidate by key prefix: .invalidate("user:") removes all user entries
//
// Step 2 — Build a useApiCache React hook (describe in comments if no browser env):
//   const { data, isLoading, error, refetch } = useApiCache('/api/users', { ttl: 60000 })
//   - Uses memoizeAsync internally
//   - Returns { data, isLoading, error, refetch }
//   - Automatically fetches on mount
//   - refetch() forces a cache bypass and re-fetches
//   - Stale data shows while revalidating (SWR pattern)
//
// Step 3 — Build an LRU Cache class (classic interview question):
//   class LRUCache {
//     constructor(capacity: number)
//     get(key): value or -1
//     put(key, value): void — evicts least recently used if at capacity
//   }
//   Requirements: both get and put must be O(1) time
//   HINT: use Map (which preserves insertion order) or doubly-linked list + hashmap

function memoizeAsync(fn, options = {}) {
  // YOUR CODE HERE
  // Return: memoized async function with .clear() and .invalidate(prefix) methods
}

class LRUCache {
  constructor(capacity) {
    // YOUR CODE HERE
    // HINT: Map.keys().next().value → oldest key (Maps preserve insertion order)
  }

  get(key) {
    // YOUR CODE HERE
    // Must update access order (delete and re-insert to move to end)
    // Return -1 if not found
  }

  put(key, value) {
    // YOUR CODE HERE
    // If key exists: update value, update access order
    // If at capacity: delete oldest entry (first key in Map)
    // Then add new entry
  }
}

// Test LRU Cache:
console.log("\n--- YOUR TURN: LRU Cache test ---");
const lru = new LRUCache(3);
lru.put("a", 1);
lru.put("b", 2);
lru.put("c", 3);
console.log("get(a):", lru.get("a")); // 1 (now most recently used)
lru.put("d", 4);                       // evicts "b" (least recently used after "a" was accessed)
console.log("get(b):", lru.get("b")); // -1 (evicted)
console.log("get(c):", lru.get("c")); // 3
console.log("get(d):", lru.get("d")); // 4

// ============================================
// BOSS CHALLENGE: Function composition + memoization
// ============================================
// Build a composable, memoized data processing pipeline.
//
// compose(...fns): right-to-left composition
//   const process = compose(formatCurrency, addTax, applyDiscount)
//   process(100) → applyDiscount(100) → addTax(result) → formatCurrency(result)
//
// pipe(...fns): left-to-right composition (more readable)
//   const process = pipe(applyDiscount, addTax, formatCurrency)
//   process(100) → same result, reads left to right
//
// memoizePipeline(pipeline): wrap a composed pipeline with memoization
//   const processOrder = memoizePipeline(pipe(validate, calculate, format))
//
// Build a practical example:
//   const priceCalc = pipe(
//     (price) => price * 0.9,           // 10% discount
//     memoize((price) => price * 1.18), // 18% tax (memoized — same after-discount prices recur)
//     (price) => `₹${price.toFixed(2)}` // format
//   )
//
//   Bonus: make the pipeline lazy — return a "thunk" that only computes when called.
//   const lazyCalc = createLazyPipeline(step1, step2, step3)
//   lazyCalc.run(100)    // executes pipeline
//   lazyCalc.preview(100) // executes but doesn't cache (for "what-if" simulations)

function compose(...fns) {
  // YOUR CODE HERE — reduce right-to-left
}

function pipe(...fns) {
  // YOUR CODE HERE — reduce left-to-right
}

function memoizePipeline(pipelineFn) {
  // YOUR CODE HERE — wrap with memoize
}

// Test:
console.log("\n--- BOSS: Function composition ---");
const applyDiscount  = (price) => price * 0.9;
const applyTax       = (price) => price * 1.18;
const formatPrice    = (price) => `₹${price.toFixed(2)}`;

const calculatePrice = pipe(applyDiscount, applyTax, formatPrice);
const memoCalcPrice  = memoizePipeline(pipe(applyDiscount, applyTax, formatPrice));

console.log("Pipe result:", calculatePrice(1000));
console.log("Memoized (1st):", memoCalcPrice(1000)); // compute
console.log("Memoized (2nd):", memoCalcPrice(1000)); // cache hit

// ============================================
// PATTERN LEARNED: Memoization / Caching
// ============================================
// PATTERN NAME: Memoization + Currying
// WHEN YOU SEE: Repeated expensive computations with same inputs;
//               functions you want to partially configure;
//               functional utility pipelines
// USE THIS:
//
//   MEMOIZE — cache pure function results:
//     const memoAdd = memoize(add)
//     const cachedFetch = createApiCache(fetchFn, { ttl: 300000 })
//
//   When to memoize:
//     ✓ Pure function (same input → same output, no side effects)
//     ✓ Expensive computation (recursion, complex math, parsing)
//     ✓ Repeated calls with same args (API results, processed data)
//     ✗ Functions with side effects (logging, writing to DB)
//     ✗ Functions where output changes over time (Date.now(), random)
//
//   CURRY — partial application and composition:
//     const withTax = addTax(0.18)      // configure once
//     prices.map(withTax)               // apply many times
//     pipe(step1, step2, step3)(data)   // compose a pipeline
//
//   When to curry:
//     ✓ Functions called with the same first arg repeatedly
//     ✓ Building functional pipelines (pipe/compose)
//     ✓ Event handlers with configuration: onChange={handleChange(setter)}
//     ✗ When code reads more clearly without it
//
// REACT CONNECTION:
//   useMemo:      const result = useMemo(() => expensiveCalc(a, b), [a, b])
//   useCallback:  const handler = useCallback(fn, [deps]) → memoized function ref
//   React.memo:   export default React.memo(MyComponent) → skip re-render if props unchanged
//   React Query:  entire library is a memoized async cache (deduplication, TTL, stale-while-revalidate)
// ============================================
