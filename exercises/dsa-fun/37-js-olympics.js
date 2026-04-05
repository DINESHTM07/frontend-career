// ============================================
// INTRO: JavaScript Olympics — Build It From Scratch
// ============================================
// Welcome to the JS Olympics, where the events are:
// "Can you build what JavaScript already gives you — from scratch?"
//
// WHY build built-ins from scratch?
//   1. Interview prep: "implement bind/debounce/Promise.all" is real
//   2. Deep understanding: you can't truly understand a tool until you've built it
//   3. Edge case knowledge: building it forces you to know every edge case
//   4. Pattern recognition: these implementations reveal core JS patterns
//
// PATTERN: Internal Implementation
// Each event: understand what it DOES → build what makes it DO that → test it.
//
// SCORING:
//   Bronze: Makes the basic test pass
//   Silver: Handles all edge cases
//   Gold:   Matches the spec behavior exactly (MDN-level correctness)
// ============================================

console.log("=== JS OLYMPICS — BUILD THE BUILT-INS ===\n");

// ============================================
// EVENT 1: Array.prototype.map
// ============================================
console.log("--- EVENT 1: myMap ---");
// What map does: transforms every element via a callback, returns NEW array.
// Signature: arr.myMap(callback(element, index, array))
// Never mutates the original array.

Array.prototype.myMap = function(callback) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const result = [];
  for (let i = 0; i < this.length; i++) {
    // Only process existing indices (sparse array support)
    if (Object.prototype.hasOwnProperty.call(this, i)) {
      result[i] = callback(this[i], i, this);
    }
  }
  return result;
};

// Tests
console.log([1, 2, 3].myMap(x => x * 2));                 // [2, 4, 6]
console.log([1, 2, 3].myMap((x, i) => `${i}:${x}`));      // ["0:1", "1:2", "2:3"]
console.log(["a", "b"].myMap(x => x.toUpperCase()));       // ["A", "B"]
// Edge: sparse array
const sparse = [1, , 3];
console.log(sparse.myMap(x => x * 10));                    // [10, empty, 30]
console.log();

// ============================================
// EVENT 2: Array.prototype.filter
// ============================================
console.log("--- EVENT 2: myFilter ---");
// What filter does: returns new array containing only elements where callback returns truthy.
// Preserves ORDER. Does not change indices of kept elements (doesn't leave holes).

Array.prototype.myFilter = function(callback) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (Object.prototype.hasOwnProperty.call(this, i)) {
      if (callback(this[i], i, this)) {
        result.push(this[i]);   // push (not result[i]) — no holes in output
      }
    }
  }
  return result;
};

console.log([1, 2, 3, 4, 5].myFilter(x => x % 2 === 0));  // [2, 4]
console.log(["foo", "", "bar", null, "baz"].myFilter(Boolean)); // ["foo", "bar", "baz"]
console.log([1, 2, 3].myFilter((x, i) => i > 0));          // [2, 3]
console.log();

// ============================================
// EVENT 3: Array.prototype.reduce
// ============================================
console.log("--- EVENT 3: myReduce ---");
// What reduce does: fold array into a single value by applying callback to accumulator.
// If no initialValue: uses first element as accumulator, starts iteration at index 1.
// Edge case: empty array + no initial value → TypeError

Array.prototype.myReduce = function(callback, initialValue) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const hasInitial = arguments.length >= 2;

  if (this.length === 0 && !hasInitial) {
    throw new TypeError("Reduce of empty array with no initial value");
  }

  let accumulator;
  let startIndex;

  if (hasInitial) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    // Find first non-empty index (sparse array support)
    let firstIndex = -1;
    for (let i = 0; i < this.length; i++) {
      if (Object.prototype.hasOwnProperty.call(this, i)) {
        firstIndex = i;
        break;
      }
    }
    if (firstIndex === -1) throw new TypeError("Reduce of empty array with no initial value");
    accumulator = this[firstIndex];
    startIndex = firstIndex + 1;
  }

  for (let i = startIndex; i < this.length; i++) {
    if (Object.prototype.hasOwnProperty.call(this, i)) {
      accumulator = callback(accumulator, this[i], i, this);
    }
  }

  return accumulator;
};

console.log([1, 2, 3, 4].myReduce((acc, x) => acc + x, 0));   // 10
console.log([1, 2, 3, 4].myReduce((acc, x) => acc + x));      // 10 (no initial)
console.log([[1,2],[3,4],[5]].myReduce((acc, arr) => acc.concat(arr), [])); // [1,2,3,4,5]
// Implement pipe using reduce
const pipe = (...fns) => x => fns.myReduce((v, fn) => fn(v), x);
const double = x => x * 2;
const addTen = x => x + 10;
const square = x => x * x;
console.log(pipe(double, addTen, square)(3));  // ((3*2)+10)^2 = 256
console.log();

// ============================================
// EVENT 4: Function.prototype.bind
// ============================================
console.log("--- EVENT 4: myBind ---");
// What bind does: returns a new function with 'this' permanently set to the context.
// Supports partial application: pre-fill arguments.
// The bound function can still be called with new (constructor) — this overrides the bind.

Function.prototype.myBind = function(context, ...partialArgs) {
  if (typeof this !== "function") {
    throw new TypeError("myBind must be called on a function");
  }

  const originalFn = this;

  // The bound function
  function boundFn(...args) {
    // If called with 'new', 'this' inside should be the newly created object
    // Check by seeing if 'this' is an instance of boundFn (new keyword creates this)
    const isCalledWithNew = this instanceof boundFn;
    return originalFn.apply(
      isCalledWithNew ? this : context,
      [...partialArgs, ...args]
    );
  }

  // Preserve prototype chain for constructor usage
  if (originalFn.prototype) {
    boundFn.prototype = Object.create(originalFn.prototype);
  }

  return boundFn;
};

// Test basic bind
const person = { name: "Alice" };
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const boundGreet = greet.myBind(person, "Hello");
console.log(boundGreet("!"));       // "Hello, Alice!"
console.log(boundGreet("..."));     // "Hello, Alice..."

// Test partial application
function multiply(a, b, c) { return a * b * c; }
const triple = multiply.myBind(null, 3);    // pre-fill a=3
console.log(triple(4, 5));          // 3 * 4 * 5 = 60
console.log(triple(2, 2));          // 3 * 2 * 2 = 12
console.log();

// ============================================
// EVENT 5: debounce
// ============================================
console.log("--- EVENT 5: debounce ---");
// What debounce does: delays function execution until after 'wait' ms have elapsed
// since the LAST call. Each new call resets the timer.

function debounce(fn, wait) {
  let timerId = null;

  function debounced(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      fn.apply(this, args);
    }, wait);
  }

  debounced.cancel = () => {
    clearTimeout(timerId);
    timerId = null;
  };

  debounced.flush = function(...args) {
    clearTimeout(timerId);
    timerId = null;
    fn.apply(this, args);
  };

  debounced.pending = () => timerId !== null;

  return debounced;
}

// Demo
let callCount = 0;
const debouncedFn = debounce((msg) => {
  callCount++;
  console.log(`  Called: "${msg}" (call #${callCount})`);
}, 50);

console.log("Rapid calls (only last should fire after 50ms):");
debouncedFn("first");
debouncedFn("second");
debouncedFn("third");
setTimeout(() => {
  console.log(`  Pending: ${debouncedFn.pending()}`); // true (timer running)
}, 20);
setTimeout(() => {
  console.log(`  After 200ms, total calls: ${callCount}`); // → 1 ("third" fired)
  console.log();
}, 200);

// ============================================
// EVENT 6: throttle
// ============================================
console.log("--- EVENT 6: throttle ---");
// What throttle does: executes fn at most once per 'limit' ms.
// First call executes immediately. Subsequent calls within limit are dropped.
// A trailing call fires after the limit window ends.

function throttle(fn, limit) {
  let lastRun = 0;
  let timerId = null;

  return function(...args) {
    const now = Date.now();
    const remaining = limit - (now - lastRun);

    if (remaining <= 0) {
      if (timerId) { clearTimeout(timerId); timerId = null; }
      lastRun = now;
      fn.apply(this, args);
    } else {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        lastRun = Date.now();
        timerId = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

// Demo
let throttleCount = 0;
const throttledFn = throttle(() => {
  throttleCount++;
  console.log(`  Throttle fired (call #${throttleCount})`);
}, 100);

console.log("10 rapid calls, 100ms throttle (should fire 1-2 times immediately):");
for (let i = 0; i < 10; i++) throttledFn();

setTimeout(() => {
  console.log(`  After 300ms, total fires: ${throttleCount} (expect ~2)`);
  console.log();
}, 300);

// ============================================
// EVENT 7: deep clone
// ============================================
console.log("--- EVENT 7: deepClone ---");
// What deep clone does: creates a completely independent copy of any value.
// Nested objects/arrays are new objects — changing them doesn't affect the original.
// Handles: primitives, arrays, objects, Date, RegExp, Map, Set, circular refs.

function deepClone(value, seen = new Map()) {
  // Primitives: return as-is
  if (value === null || typeof value !== "object") return value;

  // Circular reference guard
  if (seen.has(value)) return seen.get(value);

  // Date
  if (value instanceof Date) return new Date(value.getTime());

  // RegExp
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  // Map
  if (value instanceof Map) {
    const cloned = new Map();
    seen.set(value, cloned);
    for (const [k, v] of value) cloned.set(deepClone(k, seen), deepClone(v, seen));
    return cloned;
  }

  // Set
  if (value instanceof Set) {
    const cloned = new Set();
    seen.set(value, cloned);
    for (const v of value) cloned.add(deepClone(v, seen));
    return cloned;
  }

  // Array
  if (Array.isArray(value)) {
    const cloned = [];
    seen.set(value, cloned);  // register before recursing (circular refs)
    for (let i = 0; i < value.length; i++) {
      cloned[i] = deepClone(value[i], seen);
    }
    return cloned;
  }

  // Plain object
  const cloned = Object.create(Object.getPrototypeOf(value));
  seen.set(value, cloned);
  for (const key of Object.keys(value)) {
    cloned[key] = deepClone(value[key], seen);
  }
  return cloned;
}

// Tests
const original = {
  name: "Alice",
  scores: [1, 2, 3],
  address: { city: "NYC", zip: 10001 },
  createdAt: new Date(2024, 0, 1),
  tags: new Set(["js", "ts"]),
};

const cloned = deepClone(original);
cloned.name = "Bob";
cloned.scores.push(4);
cloned.address.city = "LA";

console.log("Original still intact:");
console.log("  name:", original.name);        // Alice
console.log("  scores:", original.scores);    // [1,2,3]
console.log("  city:", original.address.city); // NYC
console.log("  date equal:", original.createdAt.getTime() === cloned.createdAt.getTime()); // true (same value)
console.log("  date same ref:", original.createdAt === cloned.createdAt); // false (different object)

// Circular reference test
const circular = { a: 1 };
circular.self = circular;
const clonedCircular = deepClone(circular);
console.log("  Circular clone works:", clonedCircular.a === 1 && clonedCircular.self === clonedCircular);
console.log();

// ============================================
// EVENT 8: Promise.all
// ============================================
console.log("--- EVENT 8: myPromiseAll ---");
// What Promise.all does: takes an array of promises. Returns a promise that:
//   - Resolves with array of all values when ALL promises resolve (in order)
//   - Rejects immediately when ANY promise rejects (fail-fast)
// Non-promise values in the array are treated as already-resolved.

function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }

    if (promises.length === 0) return resolve([]);

    const results = new Array(promises.length);
    let remaining = promises.length;

    promises.forEach((promise, index) => {
      // Wrap in Promise.resolve to handle non-promise values
      Promise.resolve(promise).then(value => {
        results[index] = value;
        remaining--;
        if (remaining === 0) resolve(results);  // all done!
      }).catch(reject);  // any rejection immediately rejects the whole thing
    });
  });
}

// Tests
async function testPromiseAll() {
  // All resolve
  const p1 = Promise.resolve(1);
  const p2 = new Promise(res => setTimeout(() => res(2), 30));
  const p3 = Promise.resolve(3);
  const results = await myPromiseAll([p1, p2, p3]);
  console.log("All resolve:", results);  // [1, 2, 3] — ORDER preserved

  // One rejects → all fail
  try {
    await myPromiseAll([
      Promise.resolve("ok"),
      Promise.reject(new Error("one failed")),
      Promise.resolve("also ok"),
    ]);
  } catch (err) {
    console.log("One rejects:", err.message);  // "one failed"
  }

  // Non-promise values
  const mixed = await myPromiseAll([1, "hello", Promise.resolve(true)]);
  console.log("Mixed values:", mixed);  // [1, "hello", true]

  // Empty array
  const empty = await myPromiseAll([]);
  console.log("Empty:", empty);  // []
  console.log();
}

setTimeout(testPromiseAll, 500);  // give throttle demo time to finish

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. In myReduce, why do we handle the case where there's no initialValue separately?
//    What exactly happens when you call [1,2,3].reduce(fn) vs [1,2,3].reduce(fn, 0)?
//    Trace both through your implementation.
//
// 2. In myBind, why do we check 'this instanceof boundFn'?
//    Give an example where bind is used with 'new' and explain what should happen.
//    How does `Object.create(originalFn.prototype)` preserve the prototype chain?
//
// 3. In deepClone, why do we register the clone in the 'seen' map BEFORE recursing?
//    What would happen if we didn't? (Hint: what is a circular reference?)
//    Trace through the circular reference test.
//
// 4. In myPromiseAll, why does the ORDER of results match the order of input promises
//    even though promises resolve at different times? (Hint: results[index] = value)
//    How would you change it to be Promise.allSettled instead?

// ============================================
// YOUR TURN: Build Promise.race, Object.assign, Array.flat from scratch
// ============================================

// ============================================
// BONUS EVENT 1: Promise.race
// ============================================
// What Promise.race does: resolves/rejects with the FIRST promise to settle.
// If the first to settle resolved: the race resolves.
// If the first to settle rejected: the race rejects.
// All other promises continue but their results are ignored.
//
// Use case: timeout pattern:
//   Promise.race([fetchData(), rejectAfter(5000, 'Timeout')])

function myPromiseRace(promises) {
  // YOUR CODE HERE
  // Hint: Promise.resolve(promise).then(resolve).catch(reject) for each
  // The first to call resolve or reject wins. Subsequent calls to resolve/reject
  // on a settled Promise are silently ignored.
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) return reject(new TypeError("Must be array"));
    promises.forEach(p => Promise.resolve(p).then(resolve).catch(reject));
  });
}

// Test (uncomment when ready):
// const slow = new Promise(res => setTimeout(() => res("slow"), 200));
// const fast = new Promise(res => setTimeout(() => res("fast"), 50));
// myPromiseRace([slow, fast]).then(console.log); // "fast"

// ============================================
// BONUS EVENT 2: Object.assign
// ============================================
// What Object.assign does: copies OWN ENUMERABLE properties from sources to target.
// Returns the mutated target.
// Later sources override earlier ones. Does NOT deep merge.
// Triggers setters on target, reads getters from sources.
//
// Signature: Object.assign(target, ...sources)

function myObjectAssign(target, ...sources) {
  // YOUR CODE HERE
  // Guard: target must be an object
  // For each source: iterate own enumerable properties and copy to target
  // Hint: use Object.keys() or for...in + hasOwnProperty
  // Hint: property assignment (target[key] = source[key]) triggers setters on target
  if (target === null || target === undefined) {
    throw new TypeError("Cannot convert undefined or null to object");
  }

  const result = Object(target);  // ensure it's an object

  for (const source of sources) {
    if (source === null || source === undefined) continue;  // skip null/undefined sources
    for (const key of Object.keys(source)) {
      result[key] = source[key];
    }
    // Also copy Symbol properties (bonus)
    for (const sym of Object.getOwnPropertySymbols(source)) {
      if (Object.prototype.propertyIsEnumerable.call(source, sym)) {
        result[sym] = source[sym];
      }
    }
  }

  return result;
}

// Test (uncomment):
// console.log(myObjectAssign({a: 1}, {b: 2}, {c: 3})); // {a:1, b:2, c:3}
// console.log(myObjectAssign({a: 1}, {a: 99, b: 2}));  // {a:99, b:2}
// const target = { a: 1 };
// const result = myObjectAssign(target, { b: 2 });
// console.log(target === result); // true — mutates and returns target

// ============================================
// BONUS EVENT 3: Array.flat
// ============================================
// What Array.flat does: flattens nested arrays by 'depth' levels.
// Default depth: 1. Infinity depth: fully flatten.
// Removes holes in sparse arrays.
//
// [1, [2, [3, [4]]]] .flat()       → [1, 2, [3, [4]]]
// [1, [2, [3, [4]]]] .flat(2)      → [1, 2, 3, [4]]
// [1, [2, [3, [4]]]] .flat(Infinity) → [1, 2, 3, 4]

Array.prototype.myFlat = function(depth = 1) {
  // YOUR CODE HERE
  // Option 1: recursive approach
  //   function flatten(arr, currentDepth) {
  //     for (const item of arr) {
  //       if (Array.isArray(item) && currentDepth > 0) {
  //         flatten(item, currentDepth - 1)
  //       } else {
  //         result.push(item)
  //       }
  //     }
  //   }
  //
  // Option 2: reduce + concat approach
  //   return depth > 0
  //     ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? val.myFlat(depth-1) : val), [])
  //     : arr.slice()

  function flatten(arr, currentDepth) {
    const result = [];
    for (const item of arr) {
      if (Array.isArray(item) && currentDepth > 0) {
        result.push(...flatten(item, currentDepth - 1));
      } else {
        result.push(item);
      }
    }
    return result;
  }

  return flatten(this, depth);
};

// Tests (uncomment):
// console.log([1, [2, [3, [4]]]].myFlat());         // [1, 2, [3, [4]]]
// console.log([1, [2, [3, [4]]]].myFlat(2));        // [1, 2, 3, [4]]
// console.log([1, [2, [3, [4]]]].myFlat(Infinity)); // [1, 2, 3, 4]
// console.log([[1, 2], [3, 4]].myFlat());           // [1, 2, 3, 4]
// console.log([1, [2], [[3]]].myFlat(0));           // [1, [2], [[3]]] (depth 0 = no change)

// ============================================
// GRAND FINAL: Implement curry
// ============================================
// What curry does: transforms a multi-argument function into a chain of
// single-argument functions. Call until all arguments are filled.
//
// curry(f)(a)(b)(c) === f(a, b, c)
// curry(add)(1)(2) = 3
// curry(add)(1, 2) = 3    (also accepts multiple args at once)
// const add5 = curry(add)(5)  → partial application

function curry(fn) {
  // YOUR CODE HERE
  // Key insight: if enough args collected (>= fn.length), call fn
  // Otherwise, return a new function that collects more args
  function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  }
  return curried;
}

// Test (uncomment):
// const add = (a, b, c) => a + b + c;
// const curriedAdd = curry(add);
// console.log(curriedAdd(1)(2)(3));     // 6
// console.log(curriedAdd(1, 2)(3));     // 6
// console.log(curriedAdd(1)(2, 3));     // 6
// console.log(curriedAdd(1, 2, 3));     // 6
// const add10 = curriedAdd(10);
// console.log(add10(5)(3));             // 18

// ============================================
// PATTERN LEARNED: Internal Implementation
// ============================================
// KEY INSIGHTS FROM BUILDING BUILT-INS:
//
//   map/filter/reduce:
//     - They NEVER mutate the original array
//     - They skip holes in sparse arrays (hasOwnProperty check)
//     - reduce without initialValue uses first element as accumulator
//     - All pass (element, index, array) to callback — most built-ins do this
//
//   bind:
//     - Returns a NEW function (original unchanged)
//     - Partial application: pre-filled arguments + new arguments concatenated
//     - Must handle 'new' keyword: bound function should work as constructor
//     - The 'this' override from bind is IGNORED when called with 'new'
//
//   deepClone:
//     - Primitives are already immutable — return as-is
//     - Objects need recursive copying
//     - Register in seen map BEFORE recursing to handle circular refs
//     - Special types (Date, Map, Set, RegExp) need special handling
//
//   Promise.all / Promise.race:
//     - Wrapping each input in Promise.resolve handles non-promise values
//     - Use an index array to preserve order (Promise.all)
//     - Once rejected/resolved, a Promise ignores future calls to resolve/reject
//
//   curry:
//     - Closures accumulate arguments until fn.length is reached
//     - fn.length is the number of declared parameters
//     - Variadic functions (...args) have fn.length = 0 — can't auto-curry these
//
// INTERVIEW PATTERN:
//   "Implement X from scratch" questions test:
//   1. Do you know what X does in all edge cases?
//   2. Can you write clean recursive/iterative code?
//   3. Do you understand the language primitives (closures, prototypes, 'this')?
// ============================================
