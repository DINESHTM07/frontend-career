# Medium JavaScript Problems (20)

---

## Problem 1 — Implement Debounce

### PROBLEM
Implement a `debounce(fn, delay)` function. The returned function should only invoke `fn` after `delay` ms have passed since the last call. Each new call resets the timer.
```js
const debouncedSearch = debounce(search, 300);
input.addEventListener("input", e => debouncedSearch(e.target.value));
// search() only fires 300ms after the user stops typing
```

### HINT
Use `setTimeout` and `clearTimeout`. Store the timer ID in the closure.

### PATTERN NAME
**Closure / Timer**

### SOLUTION
```js
function debounce(fn, delay) {
  let timerId;

  return function(...args) {
    clearTimeout(timerId); // cancel the previous timer

    timerId = setTimeout(() => {
      fn.apply(this, args); // preserve `this` and all arguments
    }, delay);
  };
}

// Usage
const log = debounce((msg) => console.log(msg), 300);
log("a"); // cancelled
log("b"); // cancelled
log("c"); // runs after 300ms → logs "c"
```
**Explanation:** Each call clears the existing timer before setting a new one. Only the last call's timer survives to completion. `apply(this, args)` ensures the original `this` context and all arguments are forwarded correctly.

### TIME COMPLEXITY
- Time: O(1) per call
- Space: O(1) — single timer ID in closure

---

## Problem 2 — Implement Throttle

### PROBLEM
Implement a `throttle(fn, interval)` function. The returned function should invoke `fn` at most once per `interval` ms, no matter how often it's called.
```js
const throttledScroll = throttle(updateNavbar, 100);
window.addEventListener("scroll", throttledScroll);
// updateNavbar fires at most every 100ms even if scroll fires 1000x/sec
```

### HINT
Track the last time the function was called. Only allow execution if enough time has passed since then.

### PATTERN NAME
**Closure / Timestamp**

### SOLUTION
```js
function throttle(fn, interval) {
  let lastCallTime = 0;

  return function(...args) {
    const now = Date.now();

    if (now - lastCallTime >= interval) {
      lastCallTime = now;
      fn.apply(this, args);
    }
  };
}

// With trailing call (fires one final time after the last call)
function throttleWithTrailing(fn, interval) {
  let lastCallTime = 0;
  let timerId;

  return function(...args) {
    const now = Date.now();
    const remaining = interval - (now - lastCallTime);

    clearTimeout(timerId);

    if (remaining <= 0) {
      lastCallTime = now;
      fn.apply(this, args);
    } else {
      timerId = setTimeout(() => {
        lastCallTime = Date.now();
        fn.apply(this, args);
      }, remaining);
    }
  };
}

// Usage
const log = throttle((n) => console.log(n), 1000);
log(1); // fires
log(2); // suppressed
log(3); // suppressed — within 1000ms
```
**Explanation:** `Date.now()` is compared to `lastCallTime`. If the elapsed time is >= the interval, we execute and update `lastCallTime`. Otherwise we skip. No timer needed for the basic version.

### TIME COMPLEXITY
- Time: O(1) per call
- Space: O(1)

---

## Problem 3 — Deep Clone an Object

### PROBLEM
Write a function that creates a deep clone of an object — nested objects and arrays must be fully independent from the original.
```js
const original = { a: 1, b: { c: 2 }, d: [3, 4] };
const clone = deepClone(original);
clone.b.c = 99;
clone.d.push(5);
console.log(original.b.c); // 2  — unaffected
console.log(original.d);   // [3, 4] — unaffected
```

### HINT
Recursively copy each property. Handle arrays and objects differently. Be aware of circular references.

### PATTERN NAME
**Recursion / Structural Clone**

### SOLUTION
```js
function deepClone(value) {
  // Primitives — return as-is
  if (value === null || typeof value !== "object") return value;

  // Array
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item));
  }

  // Handle Date, RegExp
  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value);

  // Plain object — recursively clone each property
  const clone = {};
  for (const key of Object.keys(value)) {
    clone[key] = deepClone(value[key]);
  }
  return clone;
}

// Modern native alternative (handles most cases)
const clone = structuredClone(original);

// JSON trick (simple but loses functions, Dates, undefined, Infinity)
const clone2 = JSON.parse(JSON.stringify(original));

// Test
const obj = { a: 1, b: { c: [1, 2, 3] } };
const cloned = deepClone(obj);
cloned.b.c.push(99);
console.log(obj.b.c); // [1, 2, 3] — unchanged
```
**Explanation:** Recursively copy each value. Arrays are mapped (each element deep-cloned). Objects are reconstructed key-by-key. Primitives are returned directly since they're already value types.

### TIME COMPLEXITY
- Time: O(n) — n = total nodes in the object tree
- Space: O(n) + O(d) stack space where d = depth

---

## Problem 4 — Flatten Deeply Nested Array

### PROBLEM
Write a function that flattens an array of any depth.
```js
deepFlatten([1, [2, [3, [4, [5]]]]]) → [1, 2, 3, 4, 5]
deepFlatten([1, [2, 3], [4, [5, 6]]]) → [1, 2, 3, 4, 5, 6]
deepFlatten([1, 2, 3]) → [1, 2, 3]
```

### HINT
Recursion: for each element, if it's an array, flatten it recursively; otherwise push it to the result.

### PATTERN NAME
**Recursion / Flatten**

### SOLUTION
```js
function deepFlatten(arr) {
  return arr.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? deepFlatten(item) : item);
  }, []);
}

// Alternative: recursive with spread
function deepFlatten2(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...deepFlatten2(item));
    } else {
      result.push(item);
    }
  }
  return result;
}

// Built-in: flat(Infinity)
const flattened = arr.flat(Infinity);

// Test
console.log(deepFlatten([1, [2, [3, [4]]]])); // [1, 2, 3, 4]
console.log(deepFlatten([1, [2, 3], [4, [5, 6]]])); // [1, 2, 3, 4, 5, 6]
```
**Explanation:** `reduce` accumulates a flat array. For each item, if it's an array we recursively flatten it first; otherwise we concat the raw value. The recursion depth matches the nesting depth.

### TIME COMPLEXITY
- Time: O(n) — n = total elements across all levels
- Space: O(n) + O(d) stack depth

---

## Problem 5 — Group Array of Objects by Property

### PROBLEM
Write a function `groupBy(arr, key)` that groups an array of objects by a given property, returning an object where each key is a distinct property value and the value is an array of matching items.
```js
const users = [
  { name: "Alice", role: "admin" },
  { name: "Bob",   role: "user" },
  { name: "Carol", role: "admin" },
  { name: "Dave",  role: "user" },
];
groupBy(users, "role");
// { admin: [{Alice},{Carol}], user: [{Bob},{Dave}] }
```

### HINT
Use `reduce`. For each item, look up `item[key]`, initialize that bucket if it doesn't exist, then push the item.

### PATTERN NAME
**Reduce to Object / Bucketing**

### SOLUTION
```js
function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const groupKey = item[key];
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(item);
    return groups;
  }, {});
}

// Alternative: with nullish coalescing assignment (ES2021)
function groupBy2(arr, key) {
  return arr.reduce((groups, item) => {
    const k = item[key];
    (groups[k] ??= []).push(item);
    return groups;
  }, {});
}

// With a getter function instead of key (more flexible)
function groupByFn(arr, fn) {
  return arr.reduce((groups, item) => {
    const k = fn(item);
    (groups[k] ??= []).push(item);
    return groups;
  }, {});
}

// Test
const orders = [
  { id: 1, status: "shipped" },
  { id: 2, status: "pending" },
  { id: 3, status: "shipped" },
];
console.log(groupBy(orders, "status"));
// { shipped: [{id:1},{id:3}], pending: [{id:2}] }
```

### TIME COMPLEXITY
- Time: O(n)
- Space: O(n)

---

## Problem 6 — Longest Substring Without Repeating Characters

### PROBLEM
Given a string, find the length of the longest substring without repeating characters.
```js
longestUnique("abcabcbb")  → 3  ("abc")
longestUnique("bbbbb")     → 1  ("b")
longestUnique("pwwkew")    → 3  ("wke")
longestUnique("")           → 0
```

### HINT
Sliding window with a Set. Expand the right pointer, shrink the left pointer when a duplicate is found.

### PATTERN NAME
**Sliding Window**

### SOLUTION
```js
function longestUnique(str) {
  const seen = new Set();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < str.length; right++) {
    // Shrink window from left until the duplicate is removed
    while (seen.has(str[right])) {
      seen.delete(str[left]);
      left++;
    }

    seen.add(str[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// Alternative: Map to store last index (skip directly to right position)
function longestUnique2(str) {
  const lastIndex = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < str.length; right++) {
    if (lastIndex.has(str[right])) {
      left = Math.max(left, lastIndex.get(str[right]) + 1);
    }
    lastIndex.set(str[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

console.log(longestUnique("abcabcbb")); // 3
console.log(longestUnique("pwwkew"));   // 3
```
**Explanation:** Two pointers define a window of unique characters. Right pointer always advances. When it hits a duplicate, left pointer moves forward until the duplicate is removed. The Map version skips the while loop by jumping left directly past the previous occurrence.

### TIME COMPLEXITY
- Time: O(n) — each character added/removed from Set at most once
- Space: O(min(n, alphabet_size))

---

## Problem 7 — Implement Array.prototype.map from Scratch

### PROBLEM
Implement your own `myMap` that works exactly like `Array.prototype.map`.
```js
[1, 2, 3].myMap(x => x * 2)    → [2, 4, 6]
["a","b"].myMap((x, i) => `${i}:${x}`) → ["0:a", "1:b"]
```

### HINT
The callback receives `(currentValue, index, array)`. Build a new array, never mutate the original.

### PATTERN NAME
**Prototype Extension / Iteration**

### SOLUTION
```js
Array.prototype.myMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) { // handle sparse arrays
      result[i] = callback(this[i], i, this);
    }
  }
  return result;
};

// Standalone function version (preferred in interviews)
function myMap(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(callback(arr[i], i, arr));
  }
  return result;
}

// Test
console.log(myMap([1, 2, 3], x => x * 2));             // [2, 4, 6]
console.log(myMap(["a", "b"], (x, i) => `${i}:${x}`)); // ["0:a","1:b"]
```
**Explanation:** Iterate the array, call the callback with `(element, index, originalArray)`, and push the return value to a new result array. The `i in this` check handles sparse arrays where some indices are empty.

### TIME COMPLEXITY
- Time: O(n)
- Space: O(n)

---

## Problem 8 — Implement Array.prototype.filter from Scratch

### PROBLEM
Implement your own `myFilter` that works exactly like `Array.prototype.filter`.
```js
[1,2,3,4,5].myFilter(x => x % 2 === 0) → [2, 4]
["apple","banana","cherry"].myFilter(x => x.length > 5) → ["banana","cherry"]
```

### HINT
Only push elements for which the callback returns a truthy value.

### PATTERN NAME
**Prototype Extension / Predicate**

### SOLUTION
```js
function myFilter(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (callback(arr[i], i, arr)) {
      result.push(arr[i]);
    }
  }
  return result;
}

// Test
console.log(myFilter([1,2,3,4,5], x => x % 2 === 0));          // [2, 4]
console.log(myFilter([1,2,3,4,5], (x, i) => i % 2 === 0));     // [1, 3, 5]
console.log(myFilter(["apple","banana","cherry"], x => x.length > 5)); // ["banana","cherry"]
```
**Explanation:** Iterate the array, call the callback as a predicate, and only include the element in results if the predicate returns truthy. Callback gets `(element, index, array)` just like the native version.

### TIME COMPLEXITY
- Time: O(n)
- Space: O(k) — k = number of matching elements

---

## Problem 9 — Implement Array.prototype.reduce from Scratch

### PROBLEM
Implement your own `myReduce` that works exactly like `Array.prototype.reduce`, including the case where no initial value is provided.
```js
[1,2,3,4].myReduce((acc, n) => acc + n, 0) → 10
[1,2,3,4].myReduce((acc, n) => acc + n)    → 10  (no initial value)
[[1,2],[3,4]].myReduce((acc, a) => acc.concat(a), []) → [1,2,3,4]
```

### HINT
If no initial value is provided, use the first element as the accumulator and start iterating from index 1.

### PATTERN NAME
**Prototype Extension / Accumulator**

### SOLUTION
```js
function myReduce(arr, callback, initialValue) {
  if (arr.length === 0 && initialValue === undefined) {
    throw new TypeError("Reduce of empty array with no initial value");
  }

  let accumulator;
  let startIndex;

  if (initialValue !== undefined) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    accumulator = arr[0]; // first element becomes initial accumulator
    startIndex = 1;
  }

  for (let i = startIndex; i < arr.length; i++) {
    accumulator = callback(accumulator, arr[i], i, arr);
  }

  return accumulator;
}

// Test
console.log(myReduce([1,2,3,4], (acc, n) => acc + n, 0)); // 10
console.log(myReduce([1,2,3,4], (acc, n) => acc + n));    // 10
console.log(myReduce([1,2,3], (acc, n) => acc * n, 1));   // 6
```
**Explanation:** Two cases for initialization. With initial value: start at index 0 with the provided value. Without: start at index 1, using `arr[0]` as the seed. The callback signature is `(accumulator, currentValue, index, array)`.

### TIME COMPLEXITY
- Time: O(n)
- Space: O(1)

---

## Problem 10 — Two Sum

### PROBLEM
Given an array of numbers and a target, return the indices of the two numbers that add up to the target. Assume exactly one solution exists.
```js
twoSum([2, 7, 11, 15], 9)   → [0, 1]   (2 + 7 = 9)
twoSum([3, 2, 4], 6)        → [1, 2]   (2 + 4 = 6)
twoSum([3, 3], 6)           → [0, 1]
```

### HINT
Use a Map to store each number and its index. For each number, check if its complement (target - num) already exists in the Map.

### PATTERN NAME
**Hash Map / Complement**

### SOLUTION
```js
function twoSum(nums, target) {
  const seen = new Map(); // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }

    seen.set(nums[i], i);
  }
}

// Brute force O(n²) — for comparison
function twoSumBrute(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
}

// Test
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));      // [1, 2]
```
**Explanation:** For each element, compute `target - nums[i]`. If that complement has already been seen (stored in the Map), we have our pair. This beats brute force O(n²) by doing it in one pass.

### TIME COMPLEXITY
- Hash Map: O(n) time, O(n) space
- Brute force: O(n²) time, O(1) space

---

## Problem 11 — Find All Pairs That Sum to Target

### PROBLEM
Given an array of numbers and a target, return all unique pairs (as arrays) that sum to the target. No duplicate pairs.
```js
findPairs([1, 5, 3, 3, 2, 4], 6)  → [[1,5],[3,3],[2,4]]
findPairs([1, 2, 3], 10)          → []
```

### HINT
Use a Set to track seen numbers. For each number, check if its complement exists in the set. Use a separate Set to avoid duplicate pairs.

### PATTERN NAME
**Hash Set / Pairs**

### SOLUTION
```js
function findPairs(nums, target) {
  const seen = new Set();
  const usedFirst = new Set(); // avoid duplicate pairs
  const result = [];

  for (const num of nums) {
    const complement = target - num;

    if (seen.has(complement) && !usedFirst.has(complement)) {
      result.push([complement, num]);
      usedFirst.add(complement);
      usedFirst.add(num);
    }

    seen.add(num);
  }

  return result;
}

// Alternative: sort + two pointers (no extra space for dedup)
function findPairs2(nums, target) {
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  const result = [];
  let left = 0, right = sorted.length - 1;

  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum === target)      { result.push([sorted[left++], sorted[right--]]); }
    else if (sum < target)   left++;
    else                     right--;
  }

  return result;
}

// Test
console.log(findPairs([1, 5, 3, 3, 2, 4], 6)); // [[1,5],[3,3],[2,4]]
```
**Explanation:** Two-pointer approach: sort unique values, then walk pointers inward. Sum too small → move left up. Sum too large → move right down. Sum equals target → record pair and move both.

### TIME COMPLEXITY
- Hash Set: O(n) time, O(n) space
- Two pointers: O(n log n) time (sort), O(n) space

---

## Problem 12 — Rotate Array by K Positions

### PROBLEM
Rotate an array to the right by `k` steps in-place.
```js
rotate([1,2,3,4,5,6,7], 3) → [5,6,7,1,2,3,4]
rotate([1,2], 3)            → [2,1]  (k > length, wraps)
rotate([1], 1)              → [1]
```

### HINT
`k = k % arr.length` handles cases where k > length. Then use the reverse trick: reverse the whole array, reverse first k, reverse the rest.

### PATTERN NAME
**Reverse Trick / Modulo**

### SOLUTION
```js
function rotate(arr, k) {
  const n = arr.length;
  k = k % n; // handle k > n
  if (k === 0) return arr;

  // Reverse trick: 3 reversals
  reverse(arr, 0, n - 1);  // reverse whole array
  reverse(arr, 0, k - 1);  // reverse first k elements
  reverse(arr, k, n - 1);  // reverse remaining

  return arr;
}

function reverse(arr, start, end) {
  while (start < end) {
    [arr[start], arr[end]] = [arr[end], arr[start]];
    start++;
    end--;
  }
}

// Alternative: slice (cleaner but O(n) space)
function rotate2(arr, k) {
  k = k % arr.length;
  return [...arr.slice(-k), ...arr.slice(0, -k)];
  // slice(-k) = last k elements, slice(0, -k) = everything before last k
}

// Test
console.log(rotate([1,2,3,4,5,6,7], 3)); // [5,6,7,1,2,3,4]
console.log(rotate2([1,2,3,4,5], 2));    // [4,5,1,2,3]
```

### TIME COMPLEXITY
- Reverse trick: O(n) time, O(1) space (in-place)
- Slice version: O(n) time, O(n) space

---

## Problem 13 — Implement Curry Function

### PROBLEM
Implement a `curry(fn)` function that transforms a multi-argument function into a chain of single-argument functions.
```js
const add = curry((a, b, c) => a + b + c);
add(1)(2)(3)   → 6
add(1, 2)(3)   → 6
add(1)(2, 3)   → 6
add(1, 2, 3)   → 6
```

### HINT
Check if the number of collected arguments >= the function's expected arity (`fn.length`). If yes, call it. If no, return a function that collects more.

### PATTERN NAME
**Curry / Partial Application**

### SOLUTION
```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args); // enough args — execute
    }

    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs)); // collect more
    };
  };
}

// Test
const multiply = curry((a, b, c) => a * b * c);
console.log(multiply(2)(3)(4));    // 24
console.log(multiply(2, 3)(4));    // 24
console.log(multiply(2)(3, 4));    // 24

// Practical usage
const validate = curry((min, max, value) => value >= min && value <= max);
const isValidAge   = validate(0, 120);
const isValidScore = validate(0, 100);
console.log(isValidAge(25));    // true
console.log(isValidScore(105)); // false
```
**Explanation:** `fn.length` is the number of declared parameters. If enough have been collected, call the original function. Otherwise, return a new function that combines the collected args with any new ones and calls `curried` again — until enough are gathered.

### TIME COMPLEXITY
- Time: O(n) — n = number of arguments
- Space: O(n) — args accumulated in closures

---

## Problem 14 — Implement Memoize Function

### PROBLEM
Implement a `memoize(fn)` function that caches results so repeated calls with the same arguments return the cached result instead of recomputing.
```js
let callCount = 0;
const expensive = memoize((n) => { callCount++; return n * n; });
expensive(5); // 25 — computed
expensive(5); // 25 — cached (callCount still 1)
expensive(6); // 36 — computed
```

### HINT
Use a Map to store results keyed by the arguments. `JSON.stringify(args)` converts argument list to a string key.

### PATTERN NAME
**Closure / Cache**

### SOLUTION
```js
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// With WeakMap for object args (allows GC)
function memoizeWeak(fn) {
  const cache = new WeakMap();

  return function(obj) { // single object arg
    if (cache.has(obj)) return cache.get(obj);
    const result = fn.call(this, obj);
    cache.set(obj, result);
    return result;
  };
}

// Test
const fib = memoize(function(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});
console.log(fib(40)); // fast — each value computed only once
```

### TIME COMPLEXITY
- Time: O(1) per cached call
- Space: O(n) — n = unique argument combinations

---

## Problem 15 — Find Intersection of Two Arrays

### PROBLEM
Return the intersection of two arrays — elements that appear in both (no duplicates in result).
```js
intersection([1,2,3,4], [3,4,5,6])     → [3,4]
intersection([1,2,2,3], [2,2,3,4])     → [2,3]
intersection(["a","b"], ["b","c","b"]) → ["b"]
```

### HINT
Put one array into a Set for O(1) lookup, then filter the other array against it. Put results into a Set to deduplicate.

### PATTERN NAME
**Set Intersection**

### SOLUTION
```js
function intersection(a, b) {
  const setB = new Set(b);
  return [...new Set(a.filter(item => setB.has(item)))];
}

// Multiple arrays
function intersectionAll(...arrays) {
  return arrays.reduce((acc, arr) => {
    const set = new Set(arr);
    return acc.filter(item => set.has(item));
  });
}

// Test
console.log(intersection([1,2,3,4], [3,4,5,6]));     // [3, 4]
console.log(intersection([1,2,2,3], [2,2,3,4]));     // [2, 3]
console.log(intersectionAll([1,2,3],[2,3,4],[2,3,5])); // [2, 3]
```

### TIME COMPLEXITY
- Time: O(m + n) — building Set is O(n), filtering is O(m)
- Space: O(n) for the Set

---

## Problem 16 — Implement Event Emitter Class

### PROBLEM
Implement an `EventEmitter` class with `on`, `off`, `emit`, and `once` methods.
```js
const emitter = new EventEmitter();
emitter.on("data", (x) => console.log(x));
emitter.emit("data", 42);  // logs 42
emitter.once("end", () => console.log("done")); // fires only once
```

### HINT
Store listeners in a Map of `eventName → [callbacks]`. `once` wraps the callback to auto-remove itself after firing.

### PATTERN NAME
**Event Emitter / Observer**

### SOLUTION
```js
class EventEmitter {
  #listeners = new Map();

  on(event, callback) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, []);
    }
    this.#listeners.get(event).push(callback);
    return this; // chainable
  }

  off(event, callback) {
    if (!this.#listeners.has(event)) return this;
    const updated = this.#listeners.get(event).filter(cb => cb !== callback);
    this.#listeners.set(event, updated);
    return this;
  }

  emit(event, ...args) {
    if (!this.#listeners.has(event)) return this;
    this.#listeners.get(event).forEach(cb => cb(...args));
    return this;
  }

  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper); // auto-remove after first call
    };
    return this.on(event, wrapper);
  }
}

// Test
const emitter = new EventEmitter();
emitter.on("data", val => console.log("received:", val));
emitter.once("end", () => console.log("stream ended"));
emitter.emit("data", 1);  // received: 1
emitter.emit("data", 2);  // received: 2
emitter.emit("end");       // stream ended
emitter.emit("end");       // nothing — once was removed
```

### TIME COMPLEXITY
- `on`/`emit`: O(n) — n = number of listeners for the event
- `off`: O(n) — must filter the array
- Space: O(total listeners)

---

## Problem 17 — Parse URL Query String to Object

### PROBLEM
Write a function that parses a URL query string into a key-value object.
```js
parseQuery("name=Alice&age=30&role=admin")
// → { name: "Alice", age: "30", role: "admin" }

parseQuery("tags=js&tags=css&tags=html")
// → { tags: ["js", "css", "html"] }

parseQuery("")
// → {}
```

### HINT
Split on `&` for pairs, split each pair on `=` for key/value. Handle repeated keys by building arrays.

### PATTERN NAME
**String Parsing / Reduce**

### SOLUTION
```js
function parseQuery(queryString) {
  if (!queryString) return {};

  return queryString.split("&").reduce((params, pair) => {
    const [key, value] = pair.split("=").map(decodeURIComponent);

    if (params[key] !== undefined) {
      // Already exists — make it an array or push
      params[key] = [].concat(params[key], value);
    } else {
      params[key] = value;
    }

    return params;
  }, {});
}

// Modern: URLSearchParams (built-in)
function parseQuery2(queryString) {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params) {
    result[key] = params.getAll(key).length > 1
      ? params.getAll(key)
      : value;
  }
  return result;
}

// Test
console.log(parseQuery("name=Alice&age=30"));
// { name: "Alice", age: "30" }
console.log(parseQuery("tags=js&tags=css"));
// { tags: ["js", "css"] }
```

### TIME COMPLEXITY
- Time: O(n) — n = length of query string
- Space: O(k) — k = number of parameters

---

## Problem 18 — Implement Simple Pub/Sub

### PROBLEM
Implement a publish-subscribe system with `subscribe`, `publish`, and `unsubscribe` methods.
```js
const unsubscribe = pubsub.subscribe("login", (user) => console.log(user));
pubsub.publish("login", { name: "Alice" }); // logs user
unsubscribe(); // stop receiving events
pubsub.publish("login", { name: "Bob" });   // nothing logged
```

### HINT
Store handlers in an object keyed by topic. Return an unsubscribe function from `subscribe`.

### PATTERN NAME
**Pub/Sub / Closure for Unsubscribe**

### SOLUTION
```js
function createPubSub() {
  const topics = {};

  return {
    subscribe(topic, handler) {
      topics[topic] = topics[topic] || [];
      topics[topic].push(handler);

      // Return unsubscribe function
      return function unsubscribe() {
        topics[topic] = topics[topic].filter(h => h !== handler);
      };
    },

    publish(topic, data) {
      (topics[topic] || []).forEach(handler => handler(data));
    },

    clear(topic) {
      if (topic) delete topics[topic];
      else Object.keys(topics).forEach(t => delete topics[t]);
    }
  };
}

const pubsub = createPubSub();

// Test
const unsub = pubsub.subscribe("cart", (cart) => console.log("Cart:", cart));
pubsub.publish("cart", { items: 3 }); // Cart: { items: 3 }
unsub();
pubsub.publish("cart", { items: 5 }); // nothing
```

### TIME COMPLEXITY
- `subscribe`/`publish`: O(n) — n = subscribers for topic
- Space: O(total subscriptions)

---

## Problem 19 — Convert Callback to Promise

### PROBLEM
Write a `promisify(fn)` function that wraps a Node.js-style callback function `(err, result)` into a Promise.
```js
const readFile = promisify(fs.readFile);
const data = await readFile("file.txt", "utf8"); // returns Promise
```

### HINT
Return a function that, when called, creates a new Promise. Inside, call the original function with the same args, appending a callback that resolves or rejects the Promise.

### PATTERN NAME
**Promisify / Callback Wrapping**

### SOLUTION
```js
function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, function(err, result) {
        if (err) reject(err);
        else     resolve(result);
      });
    });
  };
}

// Usage
function readFileCb(path, encoding, callback) {
  // Simulated Node callback style
  try {
    const data = "file contents"; // simulate fs.readFile
    callback(null, data);
  } catch (err) {
    callback(err);
  }
}

const readFileAsync = promisify(readFileCb);

async function main() {
  try {
    const data = await readFileAsync("file.txt", "utf8");
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

// Node.js has this built-in: require("util").promisify
```
**Explanation:** The promisified function passes all original arguments plus appends a new callback. That callback follows Node.js convention: first arg is error (falsy on success), second is result. On error it rejects; on success it resolves.

### TIME COMPLEXITY
- Time: O(1) — just wrapping
- Space: O(1)

---

## Problem 20 — Implement Retry Function with Max Attempts

### PROBLEM
Write a `retry(fn, maxAttempts, delay)` function that calls an async function and retries up to `maxAttempts` times on failure, waiting `delay` ms between attempts.
```js
const result = await retry(() => fetchData(), 3, 1000);
// Tries up to 3 times, waits 1s between failures
```

### HINT
Use recursion or a loop with try/catch. On failure, wait the delay then try again. After max attempts, throw the last error.

### PATTERN NAME
**Retry / Exponential Backoff**

### SOLUTION
```js
async function retry(fn, maxAttempts, delay = 0) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn(); // success — return immediately
    } catch (err) {
      lastError = err;
      console.log(`Attempt ${attempt} failed: ${err.message}`);

      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError; // all attempts failed — propagate last error
}

// With exponential backoff (doubles delay each retry)
async function retryWithBackoff(fn, maxAttempts, baseDelay = 100) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const delay = baseDelay * Math.pow(2, attempt - 1); // 100, 200, 400...
      const jitter = Math.random() * delay * 0.1; // ±10% randomness
      await new Promise(r => setTimeout(r, delay + jitter));
    }
  }
}

// Test
let callCount = 0;
const flakyFetch = () => {
  callCount++;
  if (callCount < 3) throw new Error("Network error");
  return Promise.resolve("success");
};

const result = await retry(flakyFetch, 3, 100);
console.log(result); // "success" (on 3rd attempt)
```
**Explanation:** Loop up to `maxAttempts` times. On success, return immediately. On failure, wait then try again. Exponential backoff prevents hammering a struggling server — each retry waits longer than the last.

### TIME COMPLEXITY
- Time: O(maxAttempts) in worst case
- Space: O(1)
