# JavaScript-Specific DSA — 20 Frontend Interview Problems

These are implementations frequently asked in frontend/JavaScript interviews. Unlike algorithm problems, these test knowledge of JavaScript's internals, prototype chain, closures, and asynchronous patterns.

**Interview frequency:** `HIGH` = asked at most companies | `MEDIUM` = commonly seen | `LOW` = occasionally asked

---

## 1 — Implement Array.prototype.myMap

**Interview Frequency: HIGH**

```javascript
Array.prototype.myMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) { // Skip holes in sparse arrays
      result[i] = callback(this[i], i, this);
      // callback receives: (currentValue, index, array)
    }
  }
  return result;
};

// Tests
console.log([1,2,3].myMap(x => x * 2));           // [2,4,6]
console.log([1,2,3].myMap((x,i) => x + i));       // [1,3,5]
console.log(['a','b','c'].myMap(x => x.toUpperCase())); // ['A','B','C']
// Verify sparse array handling
const sparse = [1,,3];
console.log(sparse.myMap(x => x * 2)); // [2, empty, 6]
```

- **Time:** O(n) | **Space:** O(n)
- **Key points:** Uses `this` to access the array. Passes `(value, index, array)` to callback. Does not mutate the original.

---

## 2 — Implement Array.prototype.myFilter

**Interview Frequency: HIGH**

```javascript
Array.prototype.myFilter = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback(this[i], i, this)) {
      result.push(this[i]); // Only include if callback returns truthy
    }
  }
  return result;
};

// Tests
console.log([1,2,3,4,5].myFilter(x => x % 2 === 0));      // [2,4]
console.log([1,2,3,4,5].myFilter((x,i) => i % 2 === 0));  // [1,3,5]
console.log(['a','bb','ccc'].myFilter(s => s.length > 1)); // ['bb','ccc']
```

- **Time:** O(n) | **Space:** O(k) where k = count of truthy results

---

## 3 — Implement Array.prototype.myReduce

**Interview Frequency: HIGH**

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
  let accumulator;
  let startIndex;

  if (arguments.length >= 2) {
    // Initial value provided
    accumulator = initialValue;
    startIndex = 0;
  } else {
    // No initial value: use first element, skip it in loop
    if (this.length === 0) throw new TypeError('Reduce of empty array with no initial value');
    accumulator = this[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < this.length; i++) {
    if (i in this) {
      accumulator = callback(accumulator, this[i], i, this);
      // callback receives: (accumulator, currentValue, index, array)
    }
  }

  return accumulator;
};

// Tests
console.log([1,2,3,4].myReduce((acc, x) => acc + x, 0));     // 10
console.log([1,2,3,4].myReduce((acc, x) => acc + x));        // 10 (no initial)
console.log([[1,2],[3,4]].myReduce((acc,x) => acc.concat(x), [])); // [1,2,3,4]
// Edge case
try { [].myReduce((a,b) => a+b); } catch(e) { console.log(e.message); } // TypeError
```

- **Time:** O(n) | **Space:** O(1) — accumulator is one value

---

## 4 — Implement Array.prototype.myFlat

**Interview Frequency: MEDIUM**

```javascript
Array.prototype.myFlat = function(depth = 1) {
  const result = [];

  function flattenHelper(arr, currentDepth) {
    for (const item of arr) {
      if (Array.isArray(item) && currentDepth > 0) {
        flattenHelper(item, currentDepth - 1); // Recurse with reduced depth
      } else {
        result.push(item);
      }
    }
  }

  flattenHelper(this, depth);
  return result;
};

// Tests
console.log([1,[2,[3,[4]]]].myFlat());     // [1,2,[3,[4]]]  depth=1
console.log([1,[2,[3,[4]]]].myFlat(2));    // [1,2,3,[4]]    depth=2
console.log([1,[2,[3,[4]]]].myFlat(Infinity)); // [1,2,3,4]  full flatten
console.log([[1,2],[3,4]].myFlat());       // [1,2,3,4]
```

- **Time:** O(n × d) where d = depth | **Space:** O(n + d)

---

## 5 — Implement Array.prototype.myFind

**Interview Frequency: MEDIUM**

```javascript
Array.prototype.myFind = function(callback) {
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback(this[i], i, this)) {
      return this[i]; // Return the VALUE (not index — that's findIndex)
    }
  }
  return undefined; // No match
};

Array.prototype.myFindIndex = function(callback) {
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback(this[i], i, this)) {
      return i; // Return the INDEX
    }
  }
  return -1;
};

// Tests
console.log([1,2,3,4].myFind(x => x > 2));        // 3 (first match)
console.log([1,2,3,4].myFindIndex(x => x > 2));   // 2 (index of first match)
console.log([1,2,3].myFind(x => x > 10));          // undefined
```

- **Time:** O(n) worst case, O(1) best case | **Space:** O(1)

---

## 6 — Implement Function.prototype.myBind

**Interview Frequency: HIGH**

`bind` creates a new function with `this` permanently set and optional pre-filled arguments (partial application).

```javascript
Function.prototype.myBind = function(thisArg, ...boundArgs) {
  const fn = this; // The original function

  return function(...callArgs) {
    // Merge pre-bound args with args passed at call time
    return fn.apply(thisArg, [...boundArgs, ...callArgs]);
  };
};

// Tests
const person = { name: 'Alice' };

function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const greetAlice = greet.myBind(person, 'Hello');
console.log(greetAlice('!'));  // "Hello, Alice!"
console.log(greetAlice('?'));  // "Hello, Alice?"

// Partial application test
const add = (a, b, c) => a + b + c;
const add5 = add.myBind(null, 5);
console.log(add5(3, 2)); // 10

// Verify this is fixed
const obj = { x: 42 };
const getX = function() { return this.x; }.myBind(obj);
console.log(getX()); // 42
```

- **Time:** O(1) for bind itself, O(n) per call (argument spreading)
- **Key insight:** Returns a closure that captures `fn` and `thisArg`. When called later, `apply` sets `this` and spreads args.

---

## 7 — Implement Function.prototype.myCall

**Interview Frequency: HIGH**

`call` invokes a function immediately with a specified `this` and individual arguments.

```javascript
Function.prototype.myCall = function(thisArg, ...args) {
  // Handle null/undefined thisArg → global object (or {} in strict mode)
  thisArg = thisArg ?? globalThis;

  // Temporarily attach the function to thisArg as a property
  const tempKey = Symbol('temp'); // Symbol avoids collision with existing properties
  thisArg[tempKey] = this;

  // Call it — 'this' inside the function will be thisArg
  const result = thisArg[tempKey](...args);

  // Clean up
  delete thisArg[tempKey];
  return result;
};

// Tests
function introduce(greeting) {
  return `${greeting}, I'm ${this.name}`;
}

const alice = { name: 'Alice' };
const bob   = { name: 'Bob' };

console.log(introduce.myCall(alice, 'Hello')); // "Hello, I'm Alice"
console.log(introduce.myCall(bob, 'Hi'));      // "Hi, I'm Bob"
console.log(Math.max.myCall(null, 1, 2, 3));  // 3
```

- **Time:** O(n) for argument spreading | **Space:** O(1)
- **Key trick:** Temporarily assign the function as a method on `thisArg`. When called as a method, `this` is automatically bound to the object. Symbol prevents property name collisions.

---

## 8 — Implement Function.prototype.myApply

**Interview Frequency: HIGH**

`apply` is like `call` but takes arguments as an array.

```javascript
Function.prototype.myApply = function(thisArg, argsArray = []) {
  thisArg = thisArg ?? globalThis;
  const tempKey = Symbol('temp');
  thisArg[tempKey] = this;
  const result = thisArg[tempKey](...argsArray); // Spread the array
  delete thisArg[tempKey];
  return result;
};

// Tests
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}

console.log(sum.myApply(null, [1, 2, 3, 4]));  // 10
console.log(Math.max.myApply(null, [3,1,4,1,5,9])); // 9

// Classic apply use case: spread array into Math.max
const nums = [3, 1, 4, 1, 5, 9, 2];
console.log(Math.max.myApply(null, nums)); // 9
// Modern equivalent: Math.max(...nums)
```

- **Time:** O(n) | **Space:** O(1)
- **Difference from call:** `call(thisArg, a, b, c)` vs `apply(thisArg, [a,b,c])`. Prefer spread `fn(...arr)` in modern JS.

---

## 9 — Implement Debounce with Cancel

**Interview Frequency: HIGH**

Debounce delays execution until after `delay` ms of inactivity. Each new call resets the timer.

```javascript
function debounce(fn, delay) {
  let timer = null;

  function debounced(...args) {
    clearTimeout(timer); // Cancel previous pending call

    timer = setTimeout(() => {
      fn.apply(this, args); // Execute after delay with correct this + args
      timer = null;
    }, delay);
  }

  // Cancel any pending invocation
  debounced.cancel = function() {
    clearTimeout(timer);
    timer = null;
  };

  return debounced;
}

// Tests
const log = debounce((msg) => console.log(msg), 300);

log('a'); // Cancelled by 'b'
log('b'); // Cancelled by 'c'
log('c'); // ← Only this executes (after 300ms silence)
// Output after 300ms: "c"

// Cancel test
log('d');
log.cancel(); // 'd' never executes
```

- **Time:** O(1) per call | **Space:** O(1)
- **Use cases:** Search input (wait for user to stop typing), window resize handlers, button click protection.

---

## 10 — Implement Throttle with Leading/Trailing Options

**Interview Frequency: HIGH**

Throttle ensures a function executes at most once per `limit` ms, regardless of how often it's called.

```javascript
function throttle(fn, limit, options = { leading: true, trailing: true }) {
  let lastRan = 0;
  let timer = null;

  return function(...args) {
    const now = Date.now();
    const remaining = limit - (now - lastRan);

    if (remaining <= 0) {
      // Enough time has passed — execute immediately (leading)
      if (timer) { clearTimeout(timer); timer = null; }
      if (options.leading) {
        fn.apply(this, args);
        lastRan = now;
      }
    } else if (options.trailing) {
      // Schedule trailing execution at end of throttle window
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
        lastRan = Date.now();
        timer = null;
      }, remaining);
    }
  };
}

// Simple throttle (leading only, easier to remember)
function throttleSimple(fn, limit) {
  let lastRan = 0;

  return function(...args) {
    const now = Date.now();
    if (now - lastRan >= limit) {
      fn.apply(this, args);
      lastRan = now;
    }
  };
}

// Tests
const throttled = throttleSimple(() => console.log('fired'), 1000);
// Only first call in each 1000ms window executes
```

- **Time:** O(1) | **Space:** O(1)
- **Debounce vs Throttle:** Debounce → execute once after activity stops. Throttle → execute at most once per interval.

---

## 11 — Implement Deep Clone

**Interview Frequency: HIGH**

Handle: objects, arrays, Date, RegExp, null, undefined, and all primitives.

```javascript
function deepClone(value, seen = new WeakMap()) {
  // Primitives (null, undefined, number, string, boolean, symbol, BigInt)
  if (value === null || typeof value !== 'object') return value;

  // Handle circular references
  if (seen.has(value)) return seen.get(value);

  // Special types
  if (value instanceof Date)   return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (value instanceof Map) {
    const clone = new Map();
    seen.set(value, clone);
    for (const [k, v] of value) clone.set(deepClone(k, seen), deepClone(v, seen));
    return clone;
  }
  if (value instanceof Set) {
    const clone = new Set();
    seen.set(value, clone);
    for (const v of value) clone.add(deepClone(v, seen));
    return clone;
  }

  // Array
  if (Array.isArray(value)) {
    const clone = [];
    seen.set(value, clone); // Register before recursing (circular ref protection)
    for (let i = 0; i < value.length; i++) clone[i] = deepClone(value[i], seen);
    return clone;
  }

  // Plain object
  const clone = Object.create(Object.getPrototypeOf(value)); // Preserve prototype
  seen.set(value, clone);
  for (const key of [...Object.keys(value), ...Object.getOwnPropertySymbols(value)]) {
    clone[key] = deepClone(value[key], seen);
  }
  return clone;
}

// Tests
const obj = { a: 1, b: { c: [1, 2, 3] }, d: new Date(), e: /test/gi };
const clone = deepClone(obj);
clone.b.c.push(4);
console.log(obj.b.c);   // [1,2,3] — unchanged

// Circular reference test
const circular = { x: 1 };
circular.self = circular;
const clonedCircular = deepClone(circular);
console.log(clonedCircular.self === clonedCircular); // true (correctly cloned)
```

- **Time:** O(n) | **Space:** O(n)
- **WeakMap for circular refs:** Maps original → clone. If we encounter an already-seen object, return the in-progress clone.

---

## 12 — Implement Deep Equal Comparison

**Interview Frequency: MEDIUM**

```javascript
function deepEqual(a, b) {
  // Same reference or same primitive value
  if (a === b) return true;

  // Either is null/not-object (already handled strict equality above)
  if (a === null || b === null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  // Different types
  if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) return false;

  // Arrays
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }

  // Date
  if (a instanceof Date) return a.getTime() === b.getTime();

  // RegExp
  if (a instanceof RegExp) return a.source === b.source && a.flags === b.flags;

  // Plain objects
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key]));
}

// Tests
console.log(deepEqual({ a: 1, b: [1,2,3] }, { a: 1, b: [1,2,3] })); // true
console.log(deepEqual({ a: 1 }, { a: 2 }));                          // false
console.log(deepEqual([1,2,[3]], [1,2,[3]]));                        // true
console.log(deepEqual(new Date('2024'), new Date('2024')));           // true
console.log(deepEqual(null, null));                                   // true
console.log(deepEqual(null, undefined));                              // false
```

- **Time:** O(n) | **Space:** O(d) stack depth

---

## 13 — Implement Curry

**Interview Frequency: HIGH**

Curry transforms `f(a,b,c)` into `f(a)(b)(c)`. The curried function collects arguments until it has enough to call the original.

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      // Have enough arguments — call the original function
      return fn.apply(this, args);
    }

    // Not enough arguments — return a function collecting more
    return function(...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

// Tests
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3));   // 6  — one at a time
console.log(curriedAdd(1,2)(3));    // 6  — partial batch
console.log(curriedAdd(1)(2,3));    // 6  — partial batch
console.log(curriedAdd(1,2,3));     // 6  — all at once

const addTo10 = curriedAdd(10);
console.log(addTo10(5)(1));         // 16 — reusable partial

// Real-world use
const multiply = curry((a, b) => a * b);
const double = multiply(2);
const triple = multiply(3);
console.log([1,2,3,4].map(double)); // [2,4,6,8]
console.log([1,2,3,4].map(triple)); // [3,6,9,12]
```

- **Time:** O(n) per call | **Space:** O(n × depth) for accumulated args
- **Key:** `fn.length` gives the function's declared parameter count.

---

## 14 — Implement Pipe and Compose

**Interview Frequency: MEDIUM**

`pipe(f,g,h)(x)` = `h(g(f(x)))` — left to right.
`compose(f,g,h)(x)` = `f(g(h(x)))` — right to left.

```javascript
// Pipe: left-to-right composition
function pipe(...fns) {
  return function(value) {
    return fns.reduce((acc, fn) => fn(acc), value);
  };
}

// Compose: right-to-left composition
function compose(...fns) {
  return function(value) {
    return fns.reduceRight((acc, fn) => fn(acc), value);
  };
}

// Tests
const add1  = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const transform = pipe(add1, double, square);
console.log(transform(3)); // square(double(add1(3))) = square(double(4)) = square(8) = 64

const compose1 = compose(square, double, add1);
console.log(compose1(3)); // square(double(add1(3))) = 64 (same result, different order)

// Real-world: data pipeline
const processUser = pipe(
  user => ({ ...user, name: user.name.trim() }),
  user => ({ ...user, email: user.email.toLowerCase() }),
  user => ({ ...user, verified: true })
);

console.log(processUser({ name: '  Alice ', email: 'ALICE@EXAMPLE.COM' }));
// { name: 'Alice', email: 'alice@example.com', verified: true }
```

- **Time:** O(n) per call (n = number of functions) | **Space:** O(1)

---

## 15 — Implement Promise.all

**Interview Frequency: HIGH**

Resolves when all promises resolve. Rejects immediately if any rejects.

```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) { resolve([]); return; }

    const results = new Array(promises.length);
    let resolved = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise) // Handle non-Promise values
        .then(value => {
          results[index] = value; // Store at correct index (preserve order!)
          resolved++;
          if (resolved === promises.length) resolve(results); // All done
        })
        .catch(reject); // Any rejection rejects the whole thing immediately
    });
  });
}

// Tests
promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(console.log); // [1, 2, 3]

promiseAll([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).catch(console.log); // 'error'

promiseAll([]).then(console.log); // []

// With non-promise values
promiseAll([1, Promise.resolve(2), 3]).then(console.log); // [1, 2, 3]
```

- **Key detail:** Results stored by index, not arrival order — preserves input ordering even if later promises resolve first.

---

## 16 — Implement Promise.race

**Interview Frequency: MEDIUM**

Settles (resolves or rejects) with the first promise that settles.

```javascript
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) return; // Never settles (per spec)

    for (const promise of promises) {
      Promise.resolve(promise)
        .then(resolve)  // First resolve wins
        .catch(reject); // First reject wins
    }
    // After one settles, subsequent resolve/reject calls are no-ops
    // (a Promise can only settle once)
  });
}

// Tests
const slow = new Promise(resolve => setTimeout(() => resolve('slow'), 500));
const fast = new Promise(resolve => setTimeout(() => resolve('fast'), 100));

promiseRace([slow, fast]).then(console.log); // 'fast'

// Timeout pattern (real-world use)
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
  );
  return promiseRace([promise, timeout]);
}
```

---

## 17 — Implement Event Emitter

**Interview Frequency: HIGH**

`on(event, fn)`, `off(event, fn)`, `emit(event, ...args)`, `once(event, fn)`.

```javascript
class EventEmitter {
  constructor() {
    this.events = {}; // event name → [listeners]
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return this; // Enable chaining
  }

  off(event, listener) {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(fn => fn !== listener);
    return this;
  }

  emit(event, ...args) {
    if (!this.events[event]) return false;
    // Call each listener with the provided args
    // Snapshot the array in case a listener calls off() during emit
    [...this.events[event]].forEach(listener => listener.apply(this, args));
    return true;
  }

  once(event, listener) {
    // Wrap listener: auto-removes itself after first call
    const wrapper = (...args) => {
      listener.apply(this, args);
      this.off(event, wrapper);
    };
    wrapper._original = listener; // Store reference for off() compatibility
    return this.on(event, wrapper);
  }
}

// Tests
const emitter = new EventEmitter();

const handler = (msg) => console.log('Received:', msg);
emitter.on('message', handler);
emitter.emit('message', 'hello'); // "Received: hello"
emitter.emit('message', 'world'); // "Received: world"
emitter.off('message', handler);
emitter.emit('message', 'gone'); // Nothing (listener removed)

// Once test
emitter.once('connect', () => console.log('Connected!'));
emitter.emit('connect'); // "Connected!"
emitter.emit('connect'); // Nothing (already removed)
```

- **Time:** `on`/`off`/`once` O(n listeners) | `emit` O(n listeners)
- **Space:** O(total listeners)

---

## 18 — Implement LRU Cache

**Interview Frequency: HIGH**

Least Recently Used cache: O(1) get and put. Evicts the least recently accessed item when full. (LeetCode 146)

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // Map preserves insertion order in JS
    // Key: the actual key. Value: the cached value.
    // We use Map's iteration order as our LRU order.
    // Map.keys() gives oldest-inserted first.
  }

  get(key) {
    if (!this.map.has(key)) return -1;

    const value = this.map.get(key);
    // Move to end (most recently used) by delete + re-insert
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key); // Remove old position
    } else if (this.map.size >= this.capacity) {
      // Evict LRU (oldest = first key in Map iteration order)
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }

    this.map.set(key, value); // Insert at end (most recently used)
  }
}

// Tests
const cache = new LRUCache(3);
cache.put(1, 'a');  // {1:'a'}
cache.put(2, 'b');  // {1:'a', 2:'b'}
cache.put(3, 'c');  // {1:'a', 2:'b', 3:'c'}
console.log(cache.get(1)); // 'a' — moves 1 to end: {2:'b', 3:'c', 1:'a'}
cache.put(4, 'd');  // Capacity exceeded — evict LRU (2): {3:'c', 1:'a', 4:'d'}
console.log(cache.get(2)); // -1 (evicted)
console.log(cache.get(3)); // 'c'
console.log(cache.get(4)); // 'd'
```

- **Time:** O(1) for both get and put | **Space:** O(capacity)
- **Key insight:** JavaScript's `Map` preserves insertion order. Delete + re-insert moves a key to the "most recent" position. The oldest key is `map.keys().next().value`.

---

## 19 — Implement JSON.stringify

**Interview Frequency: MEDIUM**

Serialize a JavaScript value to a JSON string. Handle: objects, arrays, strings, numbers, booleans, null. Exclude: undefined, functions, symbols.

```javascript
function jsonStringify(value) {
  // null
  if (value === null) return 'null';

  // Excluded types → undefined signals "exclude this key"
  if (typeof value === 'undefined' || typeof value === 'function' || typeof value === 'symbol') {
    return undefined;
  }

  // Boolean and number
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') {
    if (!isFinite(value)) return 'null'; // Infinity and NaN → null in JSON
    return String(value);
  }

  // String: wrap in quotes and escape special chars
  if (typeof value === 'string') {
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    return `"${escaped}"`;
  }

  // Array
  if (Array.isArray(value)) {
    const items = value.map(item => {
      const serialized = jsonStringify(item);
      return serialized === undefined ? 'null' : serialized; // undefined in arrays → null
    });
    return `[${items.join(',')}]`;
  }

  // Object (including custom toJSON support)
  if (typeof value === 'object') {
    if (typeof value.toJSON === 'function') return jsonStringify(value.toJSON());

    const pairs = [];
    for (const key of Object.keys(value)) {
      const serialized = jsonStringify(value[key]);
      if (serialized !== undefined) { // Exclude undefined values
        pairs.push(`${jsonStringify(key)}:${serialized}`);
      }
    }
    return `{${pairs.join(',')}}`;
  }
}

// Tests
console.log(jsonStringify({ a: 1, b: [2, true, null, 'x'] }));
// '{"a":1,"b":[2,true,null,"x"]}'

console.log(jsonStringify({ fn: () => {}, undef: undefined, sym: Symbol() }));
// '{}' — all excluded

console.log(jsonStringify([undefined, function(){}, 1]));
// '[null,null,1]' — undefined in arrays → null

console.log(jsonStringify('hello "world"'));
// '"hello \\"world\\""'
```

- **Time:** O(n) where n = total nodes | **Space:** O(d) stack depth

---

## 20 — Implement getElementsByClassName

**Interview Frequency: MEDIUM**

Traverse the DOM tree and return all elements with the given class name.

```javascript
function getElementsByClassName(root, className) {
  const result = [];

  function traverse(node) {
    if (!node) return;

    // Check if this element has the target class
    if (node.classList && node.classList.contains(className)) {
      result.push(node);
    }

    // Recurse into children
    for (const child of node.children) {
      traverse(child);
    }
  }

  traverse(root);
  return result;
}

// Iterative version (BFS)
function getElementsByClassNameBFS(root, className) {
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) continue;

    if (node.classList && node.classList.contains(className)) {
      result.push(node);
    }

    for (const child of node.children) {
      queue.push(child);
    }
  }

  return result;
}

// Test (in browser environment)
// <div class="box">
//   <p class="box text">Hello</p>
//   <div>
//     <span class="box">World</span>
//   </div>
// </div>
// getElementsByClassName(document.body, 'box')
// → [div.box, p.box.text, span.box]
```

- **Time:** O(n) where n = DOM nodes | **Space:** O(d) for DFS stack, O(n) for BFS queue
- **DFS vs BFS:** DFS (recursive) is simpler. BFS is better for wide shallow trees. Native `getElementsByClassName` is DFS order.

---

## Quick Reference — Interview Frequency

| Problem | Frequency | Core Concept |
|---------|-----------|-------------|
| myMap | HIGH | `this`, callback(val, i, arr) |
| myFilter | HIGH | `this`, truthy predicate |
| myReduce | HIGH | accumulator, optional initialValue |
| myFlat | MEDIUM | recursive depth tracking |
| myFind | MEDIUM | early return on first match |
| myBind | HIGH | closure + partial application |
| myCall | HIGH | Symbol temp property trick |
| myApply | HIGH | spread array as args |
| debounce | HIGH | setTimeout + clearTimeout |
| throttle | HIGH | lastRan timestamp |
| deepClone | HIGH | type dispatch + WeakMap |
| deepEqual | MEDIUM | type dispatch + recursion |
| curry | HIGH | fn.length + arg accumulation |
| pipe/compose | MEDIUM | reduce / reduceRight |
| Promise.all | HIGH | counter + index tracking |
| Promise.race | MEDIUM | first settle wins |
| EventEmitter | HIGH | Map of listener arrays |
| LRU Cache | HIGH | Map insertion order |
| JSON.stringify | MEDIUM | type dispatch + recursion |
| getElementsByClassName | MEDIUM | DOM tree traversal |
