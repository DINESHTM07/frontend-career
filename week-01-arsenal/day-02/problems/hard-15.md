# Hard JavaScript Problems (15)

---

## Problem 1 — Implement Promise.all from Scratch

### PROBLEM
Implement `myPromiseAll(promises)` that behaves exactly like `Promise.all`: resolves with an array of results when all promises resolve, or rejects immediately when any promise rejects.
```js
myPromiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]) // → [1, 2, 3]

myPromiseAll([Promise.resolve(1), Promise.reject("error")])
// → rejects with "error"
```

### HINT
Track a `resolvedCount` and a `results` array (preserve index order). Resolve the outer Promise when all are done; reject on the first failure.

### PATTERN NAME
**Promise Coordination / Counter**

### SOLUTION
```js
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) return resolve([]);

    const results = new Array(promises.length);
    let resolvedCount = 0;

    promises.forEach((promise, index) => {
      // Wrap non-promises with Promise.resolve
      Promise.resolve(promise).then(value => {
        results[index] = value;    // preserve order by index
        resolvedCount++;

        if (resolvedCount === promises.length) {
          resolve(results);        // all done
        }
      }).catch(reject);            // first rejection rejects all
    });
  });
}

// Also implement Promise.allSettled
function myPromiseAllSettled(promises) {
  return new Promise(resolve => {
    if (!promises.length) return resolve([]);

    const results = new Array(promises.length);
    let settledCount = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value  => { results[index] = { status: "fulfilled", value }; })
        .catch(reason => { results[index] = { status: "rejected", reason }; })
        .finally(() => {
          settledCount++;
          if (settledCount === promises.length) resolve(results);
        });
    });
  });
}

// Test
myPromiseAll([
  Promise.resolve(1),
  new Promise(r => setTimeout(() => r(2), 100)),
  Promise.resolve(3)
]).then(console.log); // [1, 2, 3]
```
**Explanation:** Each promise is given `.then` and `.catch`. On success, we store the result at its original index (not push — this preserves order). A counter tracks completions. When all are done, resolve with the results array. Any rejection immediately calls the outer `reject`.

### TIME COMPLEXITY
- Time: O(n) to set up listeners; resolves in O(max latency)
- Space: O(n) for results array

---

## Problem 2 — Implement Function.prototype.bind

### PROBLEM
Implement `myBind` that works like `Function.prototype.bind`: returns a new function permanently bound to a given `this` and optionally pre-fills arguments.
```js
function greet(greeting, name) {
  return `${greeting}, ${name}! I am ${this.title}`;
}
const boundGreet = greet.myBind({ title: "Dr" }, "Hello");
boundGreet("Alice"); // "Hello, Alice! I am Dr"
```

### HINT
Return a regular function that calls the original with `apply`, merging pre-filled args with any new args. Handle `new` invocation (bound function used as constructor).

### PATTERN NAME
**Closure / Function Context**

### SOLUTION
```js
Function.prototype.myBind = function(context, ...presetArgs) {
  const originalFn = this; // `this` here is the function being bound

  function BoundFunction(...laterArgs) {
    const allArgs = [...presetArgs, ...laterArgs];

    // Handle `new BoundFunction()` — constructor call ignores bound `this`
    if (new.target) {
      return new originalFn(...allArgs);
    }

    return originalFn.apply(context, allArgs);
  }

  // Preserve prototype chain for `new` usage
  if (originalFn.prototype) {
    BoundFunction.prototype = Object.create(originalFn.prototype);
  }

  return BoundFunction;
};

// Test
function multiply(a, b) { return a * b; }
const double = multiply.myBind(null, 2);
console.log(double(5));  // 10
console.log(double(10)); // 20

function Person(name) { this.name = name; }
const BoundPerson = Person.myBind(null);
const p = new BoundPerson("Alice");
console.log(p.name); // "Alice" — new.target handles this
```
**Explanation:** The closure captures `context` and `presetArgs`. When the bound function is invoked, it merges preset and new args. `new.target` detects if it was called with `new` — in that case, the bound `this` is ignored and a new object is created from the original function.

### TIME COMPLEXITY
- Time: O(n) — n = number of args
- Space: O(n) — stored preset args

---

## Problem 3 — Deep Equality Check

### PROBLEM
Implement `deepEqual(a, b)` that returns `true` if two values are deeply equal — including nested objects and arrays.
```js
deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }) → true
deepEqual([1, [2, 3]], [1, [2, 3]])                       → true
deepEqual({ a: 1 }, { a: 1, b: 2 })                      → false
deepEqual(NaN, NaN)                                        → true
```

### HINT
Handle primitives first (including NaN). Then check if both are arrays (compare lengths + each element), then objects (compare keys count + each value recursively).

### PATTERN NAME
**Recursion / Structural Equality**

### SOLUTION
```js
function deepEqual(a, b) {
  // Handle NaN (NaN !== NaN in JS)
  if (typeof a === "number" && typeof b === "number") {
    return a === b || (Number.isNaN(a) && Number.isNaN(b));
  }

  // Primitive or same reference
  if (a === b) return true;

  // Null check (typeof null === "object")
  if (a === null || b === null) return false;

  // Different types
  if (typeof a !== typeof b) return false;

  // Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }

  // One is array, other isn't
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  // Objects
  if (typeof a === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(key =>
      Object.prototype.hasOwnProperty.call(b, key) &&
      deepEqual(a[key], b[key])
    );
  }

  return false;
}

// Test
console.log(deepEqual({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] })); // true
console.log(deepEqual([1, { x: 2 }], [1, { x: 3 }]));             // false
console.log(deepEqual(NaN, NaN));                                   // true
```

### TIME COMPLEXITY
- Time: O(n) — n = total nodes in the object trees
- Space: O(d) — d = maximum nesting depth (call stack)

---

## Problem 4 — Implement Virtual DOM Diff (Concept)

### PROBLEM
Implement a simplified `diff(oldTree, newTree)` that returns a list of patch operations needed to transform the old virtual DOM tree into the new one.
```js
diff(
  { type: "div", props: { id: "app" }, children: ["Hello"] },
  { type: "div", props: { id: "app" }, children: ["World"] }
)
// → [{ type: "TEXT_UPDATE", path: [0], value: "World" }]
```

### HINT
Compare nodes recursively. Generate patches for: REPLACE (different type), PROPS_UPDATE (same type, different props), TEXT_UPDATE (text changed), and recurse into children.

### PATTERN NAME
**Tree Diffing / Recursion**

### SOLUTION
```js
function diff(oldNode, newNode, patches = [], path = []) {
  // Both are text nodes
  if (typeof oldNode === "string" && typeof newNode === "string") {
    if (oldNode !== newNode) {
      patches.push({ type: "TEXT_UPDATE", path, value: newNode });
    }
    return patches;
  }

  // New node replaces old (different element types)
  if (!oldNode || !newNode || oldNode.type !== newNode.type) {
    patches.push({ type: "REPLACE", path, node: newNode });
    return patches;
  }

  // Same type — check props
  const propPatches = diffProps(oldNode.props, newNode.props);
  if (Object.keys(propPatches).length > 0) {
    patches.push({ type: "PROPS_UPDATE", path, props: propPatches });
  }

  // Recurse into children
  const maxLen = Math.max(
    (oldNode.children || []).length,
    (newNode.children || []).length
  );

  for (let i = 0; i < maxLen; i++) {
    diff(
      (oldNode.children || [])[i],
      (newNode.children || [])[i],
      patches,
      [...path, i]
    );
  }

  return patches;
}

function diffProps(oldProps = {}, newProps = {}) {
  const patches = {};
  const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);

  for (const key of allKeys) {
    if (oldProps[key] !== newProps[key]) {
      patches[key] = newProps[key] ?? null; // null means removed
    }
  }
  return patches;
}

// Test
const oldTree = {
  type: "ul", props: {},
  children: [
    { type: "li", props: { class: "item" }, children: ["Apple"] },
    { type: "li", props: { class: "item" }, children: ["Banana"] },
  ]
};
const newTree = {
  type: "ul", props: {},
  children: [
    { type: "li", props: { class: "item active" }, children: ["Apple"] },
    { type: "li", props: { class: "item" }, children: ["Cherry"] },
  ]
};
console.log(diff(oldTree, newTree));
```
**Explanation:** React's actual reconciler is far more complex (fiber, keys, priority scheduling), but the core idea is this: compare type (REPLACE if different), compare props (PROPS_UPDATE if changed), recurse into children. The `path` array tracks where in the tree each patch applies so it can be applied to the real DOM.

### TIME COMPLEXITY
- Time: O(n) — React's heuristic (same-level only, keyed children)
- Space: O(n) for patches + O(d) call stack

---

## Problem 5 — Implement LRU Cache

### PROBLEM
Implement an `LRUCache` class with a fixed capacity. `get(key)` returns the value or -1. `put(key, value)` inserts/updates. When capacity is exceeded, evict the least-recently-used entry.
```js
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);    // 1 (moves 1 to most recent)
cache.put(3, 3); // evicts 2 (least recent)
cache.get(2);    // -1 (evicted)
```

### HINT
A `Map` maintains insertion order and provides O(1) operations. Delete and re-insert on access to move to "most recent". The first entry is always the least recently used.

### PATTERN NAME
**LRU Cache / Ordered Map**

### SOLUTION
```js
class LRUCache {
  #capacity;
  #cache; // Map preserves insertion order

  constructor(capacity) {
    this.#capacity = capacity;
    this.#cache = new Map();
  }

  get(key) {
    if (!this.#cache.has(key)) return -1;

    // Move to most recently used (delete and re-insert)
    const value = this.#cache.get(key);
    this.#cache.delete(key);
    this.#cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.#cache.has(key)) {
      this.#cache.delete(key); // remove old position
    } else if (this.#cache.size >= this.#capacity) {
      // Evict LRU — first key in Map (oldest insertion)
      const lruKey = this.#cache.keys().next().value;
      this.#cache.delete(lruKey);
    }

    this.#cache.set(key, value); // insert as most recent
  }

  get size() { return this.#cache.size; }
}

// Test
const cache = new LRUCache(2);
cache.put(1, 10); cache.put(2, 20);
console.log(cache.get(1));    // 10
cache.put(3, 30);             // evicts key 2
console.log(cache.get(2));    // -1
console.log(cache.get(3));    // 30
```
**Explanation:** Map iteration order = insertion order. "Most recently used" = last inserted. On `get`, delete-then-re-insert moves the entry to the back. On `put` when full, `keys().next().value` gets the first (oldest) key to evict.

### TIME COMPLEXITY
- `get`/`put`: O(1) — Map operations are O(1)
- Space: O(capacity)

---

## Problem 6 — Async Queue with Concurrency Limit

### PROBLEM
Implement an async task queue that runs at most `concurrency` tasks simultaneously.
```js
const queue = createQueue(2); // max 2 concurrent
queue.add(() => fetch("/api/a")); // starts immediately
queue.add(() => fetch("/api/b")); // starts immediately
queue.add(() => fetch("/api/c")); // waits — slot opens when a or b finishes
```

### HINT
Track `running` count and a `pending` list. When a task finishes, decrement running and run the next pending task.

### PATTERN NAME
**Concurrency Control / Queue**

### SOLUTION
```js
function createQueue(concurrency) {
  let running = 0;
  const pending = [];

  function runNext() {
    while (running < concurrency && pending.length > 0) {
      const { task, resolve, reject } = pending.shift();
      running++;

      Promise.resolve()
        .then(() => task())
        .then(result => {
          running--;
          resolve(result);
          runNext(); // slot freed — pick up next task
        })
        .catch(err => {
          running--;
          reject(err);
          runNext();
        });
    }
  }

  return {
    add(task) {
      return new Promise((resolve, reject) => {
        pending.push({ task, resolve, reject });
        runNext();
      });
    },

    get stats() {
      return { running, pending: pending.length };
    }
  };
}

// Test
const queue = createQueue(2);
const delay = (ms, label) => () =>
  new Promise(r => setTimeout(() => { console.log(label); r(label); }, ms));

queue.add(delay(300, "A")); // starts immediately
queue.add(delay(100, "B")); // starts immediately
queue.add(delay(200, "C")); // waits for first available slot
// Output: B (100ms), C (200ms), A (300ms — but started first)
```

### TIME COMPLEXITY
- Time: O(n/concurrency) in parallel — n tasks, c at a time
- Space: O(n) for pending queue

---

## Problem 7 — Deep Merge Objects

### PROBLEM
Write a `deepMerge(target, source)` that merges two objects recursively. Nested objects are merged (not replaced). Arrays are replaced (not concatenated).
```js
deepMerge(
  { a: 1, b: { x: 1, y: 2 }, c: [1,2] },
  { b: { y: 99, z: 3 }, c: [9], d: 4 }
)
// → { a: 1, b: { x: 1, y: 99, z: 3 }, c: [9], d: 4 }
```

### HINT
If both values for a key are plain objects (not arrays), recurse. Otherwise, the source value wins.

### PATTERN NAME
**Recursion / Deep Merge**

### SOLUTION
```js
function isPlainObject(val) {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

function deepMerge(target, source) {
  const result = { ...target }; // start with a shallow copy of target

  for (const key of Object.keys(source)) {
    if (isPlainObject(source[key]) && isPlainObject(result[key])) {
      // Both are plain objects — recurse
      result[key] = deepMerge(result[key], source[key]);
    } else {
      // Source wins: primitives, arrays, nulls, type mismatches
      result[key] = source[key];
    }
  }

  return result;
}

// Merge multiple sources
function deepMergeAll(...objects) {
  return objects.reduce(deepMerge, {});
}

// Test
const defaults = { theme: "dark", font: { size: 14, family: "sans" } };
const userPrefs = { font: { size: 18 }, lang: "fr" };
console.log(deepMerge(defaults, userPrefs));
// { theme: "dark", font: { size: 18, family: "sans" }, lang: "fr" }
// Note: font.family preserved because we merge, not replace
```

### TIME COMPLEXITY
- Time: O(n) — n = total keys across both objects
- Space: O(n) + O(d) call stack

---

## Problem 8 — Serialize and Deserialize a Binary Tree

### PROBLEM
Implement `serialize(root)` and `deserialize(data)` for a binary tree. Serialization converts the tree to a string; deserialization reconstructs the original tree.
```js
const root = new TreeNode(1, new TreeNode(2), new TreeNode(3, new TreeNode(4), new TreeNode(5)));
const data = serialize(root);    // "1,2,null,null,3,4,null,null,5,null,null"
const restored = deserialize(data); // identical tree structure
```

### HINT
Use pre-order traversal (root → left → right). Use "null" as a placeholder for missing nodes. Deserialize using a pointer/queue into the values array.

### PATTERN NAME
**Tree Traversal / Pre-order / Queue**

### SOLUTION
```js
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function serialize(root) {
  const result = [];

  function preorder(node) {
    if (!node) { result.push("null"); return; }
    result.push(node.val);
    preorder(node.left);
    preorder(node.right);
  }

  preorder(root);
  return result.join(",");
}

function deserialize(data) {
  const values = data.split(",");
  let index = 0;

  function buildTree() {
    const val = values[index++];
    if (val === "null") return null;

    const node = new TreeNode(Number(val));
    node.left  = buildTree();
    node.right = buildTree();
    return node;
  }

  return buildTree();
}

// Test
const root = new TreeNode(1,
  new TreeNode(2),
  new TreeNode(3, new TreeNode(4), new TreeNode(5))
);
const serialized = serialize(root);
console.log(serialized); // "1,2,null,null,3,4,null,null,5,null,null"

const restored = deserialize(serialized);
console.log(restored.right.left.val); // 4
```
**Explanation:** Pre-order serialization: visit root, recurse left (appending "null" for empty), recurse right. Deserialization reads values in the same order — it knows structure because "null" marks leaf boundaries. The shared `index` variable advances through the flat array as the tree is rebuilt.

### TIME COMPLEXITY
- Time: O(n) — visits every node once
- Space: O(n) for the serialized string + O(h) call stack

---

## Problem 9 — Implement Observable / Reactive State

### PROBLEM
Implement a `reactive(obj)` function that wraps an object with a Proxy. Any change to a property should automatically notify registered watchers.
```js
const state = reactive({ count: 0, name: "Alice" });
watch(state, "count", (newVal, oldVal) => console.log(`count: ${oldVal} → ${newVal}`));
state.count = 5; // logs "count: 0 → 5"
state.count++;   // logs "count: 5 → 6"
```

### HINT
Use `Proxy` with a `set` trap to intercept property assignments. Maintain a map of `property → [callbacks]` for subscriptions.

### PATTERN NAME
**Proxy / Reactive / Observer**

### SOLUTION
```js
function reactive(obj) {
  const watchers = new Map(); // property → [callbacks]

  const proxy = new Proxy(obj, {
    set(target, key, newValue) {
      const oldValue = target[key];

      if (oldValue === newValue) return true; // no change

      target[key] = newValue;

      // Notify watchers for this property
      if (watchers.has(key)) {
        watchers.get(key).forEach(cb => cb(newValue, oldValue, key));
      }

      // Notify wildcard watchers (watch all changes)
      if (watchers.has("*")) {
        watchers.get("*").forEach(cb => cb(newValue, oldValue, key));
      }

      return true; // required by Proxy spec
    },

    get(target, key) {
      // Allow attaching watchers via the proxy
      if (key === "__watch__") {
        return (prop, callback) => {
          if (!watchers.has(prop)) watchers.set(prop, []);
          watchers.get(prop).push(callback);
          // Return unwatch function
          return () => {
            const cbs = watchers.get(prop);
            watchers.set(prop, cbs.filter(cb => cb !== callback));
          };
        };
      }
      return Reflect.get(target, key);
    }
  });

  return proxy;
}

// Test
const state = reactive({ count: 0, name: "Alice" });

const unwatch = state.__watch__("count", (newVal, oldVal) => {
  console.log(`count changed: ${oldVal} → ${newVal}`);
});

state.count = 5;   // count changed: 0 → 5
state.count++;     // count changed: 5 → 6
state.name = "Bob"; // no log — not watching name
unwatch();
state.count = 10;  // no log — unwatched
```
**Explanation:** `Proxy` intercepts `set` operations. When a property changes, we look up all registered callbacks for that property key and call them with the new and old values. Vue 3's reactivity system is built on exactly this pattern.

### TIME COMPLEXITY
- `set`: O(w) — w = number of watchers for the property
- Space: O(properties × watchers)

---

## Problem 10 — Implement Middleware Pattern (like Express)

### PROBLEM
Implement a `Middleware` class that registers handler functions (middleware) and runs them in sequence, where each handler calls `next()` to pass control to the next one.
```js
const app = new Middleware();
app.use((ctx, next) => { ctx.log.push("A"); next(); ctx.log.push("A_after"); });
app.use((ctx, next) => { ctx.log.push("B"); next(); });
app.use((ctx, next) => { ctx.log.push("C"); });
const ctx = { log: [] };
app.run(ctx);
// ctx.log → ["A", "B", "C", "A_after"]
```

### HINT
Store middleware in an array. Use a recursive `dispatch(index)` function as the `next` callback — it calls `middlewares[index]`, passing `dispatch(index+1)` as the next function.

### PATTERN NAME
**Middleware / Chain of Responsibility**

### SOLUTION
```js
class Middleware {
  #middlewares = [];

  use(fn) {
    this.#middlewares.push(fn);
    return this; // chainable
  }

  run(ctx) {
    const dispatch = (index) => {
      if (index >= this.#middlewares.length) return;
      const middleware = this.#middlewares[index];
      middleware(ctx, () => dispatch(index + 1));
    };

    dispatch(0);
  }

  // Async version — returns Promise
  async runAsync(ctx) {
    const dispatch = async (index) => {
      if (index >= this.#middlewares.length) return;
      const middleware = this.#middlewares[index];
      await middleware(ctx, () => dispatch(index + 1));
    };

    await dispatch(0);
  }
}

// Test
const app = new Middleware();

app
  .use((ctx, next) => { ctx.log.push("auth"); next(); })
  .use((ctx, next) => { ctx.log.push("validate"); next(); })
  .use((ctx, next) => { ctx.log.push("handle"); });
  // No next() call — stops the chain

const ctx = { log: [], user: null };
app.run(ctx);
console.log(ctx.log); // ["auth", "validate", "handle"]
```
**Explanation:** `dispatch(i)` calls `middlewares[i]` with context and `dispatch(i+1)` as `next`. When a middleware calls `next()`, control passes to the next middleware. If a middleware doesn't call `next()`, the chain stops. Code after `next()` in a middleware runs on the way back (like Express's layered middleware, or Koa's onion model).

### TIME COMPLEXITY
- Time: O(n) — n = number of middlewares
- Space: O(n) call stack depth

---

## Problem 11 — Implement Template Engine

### PROBLEM
Implement a simple `compile(template)` function that returns a renderer. The renderer takes a data object and replaces `{{variable}}` placeholders with actual values. Support dot notation for nested access.
```js
const render = compile("Hello, {{name}}! You have {{cart.count}} items.");
render({ name: "Alice", cart: { count: 3 } });
// → "Hello, Alice! You have 3 items."

const render2 = compile("{{a}} + {{b}} = {{sum}}");
render2({ a: 1, b: 2, sum: 3 });
// → "1 + 2 = 3"
```

### HINT
Use `String.replace` with a regex that captures `{{...}}`. For each match, resolve the key path using `split(".")` and traverse the data object.

### PATTERN NAME
**Template / Regex Replace / Path Resolution**

### SOLUTION
```js
function compile(template) {
  return function render(data) {
    return template.replace(/\{\{([\w.]+)\}\}/g, (match, path) => {
      // Resolve dot-notation path: "cart.count" → data.cart.count
      const value = path.split(".").reduce((obj, key) => {
        return obj != null ? obj[key] : undefined;
      }, data);

      return value != null ? value : match; // keep placeholder if not found
    });
  };
}

// Extended version with conditionals and loops
function compileAdvanced(template) {
  return function render(data) {
    // Handle {{#if condition}}...{{/if}}
    let result = template.replace(
      /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (_, key, content) => data[key] ? content : ""
    );

    // Handle {{#each items}}...{{/each}}
    result = result.replace(
      /\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
      (_, key, content) =>
        (data[key] || []).map(item =>
          content.replace(/\{\{this\}\}/g, item)
        ).join("")
    );

    // Handle simple variables
    result = result.replace(/\{\{([\w.]+)\}\}/g, (match, path) => {
      const value = path.split(".").reduce((o, k) => o?.[k], data);
      return value != null ? value : "";
    });

    return result;
  };
}

// Test
const render = compile("Dear {{user.name}}, your order #{{order.id}} is {{status}}.");
console.log(render({ user: { name: "Alice" }, order: { id: 123 }, status: "shipped" }));
// "Dear Alice, your order #123 is shipped."
```

### TIME COMPLEXITY
- Time: O(n × m) — n = template length, m = number of placeholders
- Space: O(n) for the output string

---

## Problem 12 — Throttle with Leading and Trailing Options

### PROBLEM
Implement a full-featured `throttle(fn, interval, options)` where `options.leading` (default true) fires on the first call, and `options.trailing` (default true) fires one final time after the last call.
```js
const t = throttle(fn, 1000, { leading: true, trailing: true });
// First call: fires immediately (leading)
// Middle calls: dropped
// After silence: fires once more (trailing)
```

### HINT
Track `lastCallTime`, a trailing `timerId`, and the last seen args. The leading call fires if enough time has passed; the trailing timer is scheduled on every suppressed call.

### PATTERN NAME
**Throttle / Options / Closure**

### SOLUTION
```js
function throttle(fn, interval, { leading = true, trailing = true } = {}) {
  let lastCallTime = 0;
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;

  function invokeTrailing() {
    timerId = null;
    if (trailing && lastArgs) {
      fn.apply(lastThis, lastArgs);
      lastCallTime = Date.now();
      lastArgs = null;
    }
  }

  return function throttled(...args) {
    const now = Date.now();
    const elapsed = now - lastCallTime;
    const remaining = interval - elapsed;

    lastArgs = args;
    lastThis = this;

    if (elapsed >= interval) {
      // Enough time passed — fire (leading)
      if (timerId) { clearTimeout(timerId); timerId = null; }
      if (leading) {
        lastCallTime = now;
        fn.apply(this, args);
        lastArgs = null;
      }
    } else if (!timerId && trailing) {
      // Schedule trailing call for the end of the interval
      timerId = setTimeout(invokeTrailing, remaining);
    }
  };
}

// Test scenarios:
// leading only:  fires immediately, trailing calls ignored
// trailing only: first call delayed, fires at end of silence
// both (default): fires immediately AND one final time after silence
// neither:        every call is dropped (useless but valid)

const log = throttle(console.log, 1000, { leading: true, trailing: true });
log("A"); // fires immediately
log("B"); // suppressed, schedules trailing
log("C"); // suppressed, reschedules trailing
// ~1000ms later: logs "C" (trailing)
```

### TIME COMPLEXITY
- Time: O(1) per call
- Space: O(1)

---

## Problem 13 — Implement JSON.stringify from Scratch

### PROBLEM
Implement `myStringify(value)` that serializes a JavaScript value to a JSON string, matching the behavior of `JSON.stringify` for the common cases.
```js
myStringify(42)                    → "42"
myStringify("hello")               → '"hello"'
myStringify(true)                  → "true"
myStringify(null)                  → "null"
myStringify([1, "a", true, null])  → '[1,"a",true,null]'
myStringify({ a: 1, b: "x" })     → '{"a":1,"b":"x"}'
```

### HINT
Handle each type: number, string (escape special chars), boolean, null, array (recurse), object (recurse). Undefined, functions, and Symbols are omitted from objects and replaced with `null` in arrays.

### PATTERN NAME
**Recursion / Type Dispatch**

### SOLUTION
```js
function myStringify(value) {
  // null
  if (value === null) return "null";

  // Primitives that serialize to themselves
  if (typeof value === "number") {
    if (!isFinite(value)) return "null"; // Infinity, NaN → null
    return String(value);
  }

  if (typeof value === "boolean") return String(value);

  // undefined, function, Symbol → omit (return undefined so caller can handle)
  if (typeof value === "undefined" || typeof value === "function" || typeof value === "symbol") {
    return undefined;
  }

  // String — must wrap in quotes and escape special characters
  if (typeof value === "string") {
    const escaped = value
      .replace(/\\/g,  "\\\\")  // backslash
      .replace(/"/g,   '\\"')   // double quote
      .replace(/\n/g,  "\\n")   // newline
      .replace(/\r/g,  "\\r")   // carriage return
      .replace(/\t/g,  "\\t");  // tab
    return `"${escaped}"`;
  }

  // Array
  if (Array.isArray(value)) {
    const items = value.map(item => {
      const serialized = myStringify(item);
      return serialized === undefined ? "null" : serialized; // undefined → null in arrays
    });
    return `[${items.join(",")}]`;
  }

  // Object
  if (typeof value === "object") {
    const pairs = Object.keys(value)
      .map(key => {
        const serialized = myStringify(value[key]);
        if (serialized === undefined) return undefined; // skip undefined values
        return `${myStringify(key)}:${serialized}`;
      })
      .filter(pair => pair !== undefined);

    return `{${pairs.join(",")}}`;
  }
}

// Test
console.log(myStringify({ a: 1, b: [true, null, "hi"] }));
// '{"a":1,"b":[true,null,"hi"]}'

console.log(myStringify({ fn: () => {}, x: 1 }));
// '{"x":1}' — function omitted
```

### TIME COMPLEXITY
- Time: O(n) — n = total nodes in the value tree
- Space: O(n) for the output string + O(d) call stack

---

## Problem 14 — Debounce with Cancel and Flush

### PROBLEM
Implement a full-featured `debounce(fn, delay)` that, in addition to the basic behavior, provides:
- `.cancel()` — cancels any pending invocation
- `.flush()` — immediately invokes the pending call (if any)
```js
const save = debounce(saveDraft, 1000);
save("draft 1");
save("draft 2");
save.flush();   // saves "draft 2" immediately
save.cancel();  // cancels any pending call
```

### HINT
Return a function with extra methods. Store both the timer ID and the pending args/context so `flush` can invoke them.

### PATTERN NAME
**Debounce / Extended API / Closure**

### SOLUTION
```js
function debounce(fn, delay) {
  let timerId;
  let lastArgs;
  let lastThis;
  let pendingCall = false;

  function invoke() {
    pendingCall = false;
    fn.apply(lastThis, lastArgs);
  }

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    pendingCall = true;

    clearTimeout(timerId);
    timerId = setTimeout(invoke, delay);
  }

  debounced.cancel = function() {
    clearTimeout(timerId);
    timerId = undefined;
    pendingCall = false;
  };

  debounced.flush = function() {
    if (pendingCall) {
      clearTimeout(timerId);
      invoke();
    }
  };

  debounced.isPending = function() {
    return pendingCall;
  };

  return debounced;
}

// Test
let saved = [];
const save = debounce((draft) => saved.push(draft), 500);

save("a");
save("b");
save("c");
save.flush(); // saves "c" immediately
console.log(saved); // ["c"]

save("d");
save.cancel(); // cancels "d"
// After 500ms — nothing happens
console.log(saved); // still ["c"]
```
**Explanation:** The debounced function stores `lastArgs` and `lastThis` on every call. `flush` calls `invoke()` (which does the real call) and clears the timer. `cancel` clears the timer and resets state. Lodash's debounce has this exact API.

### TIME COMPLEXITY
- Time: O(1) per call, flush, or cancel
- Space: O(1) — stores only last args

---

## Problem 15 — Implement pipe and compose

### PROBLEM
Implement `pipe(...fns)` and `compose(...fns)` for function composition.
- `pipe` applies functions left-to-right (f → g → h)
- `compose` applies functions right-to-left (h → g → f)
Both should handle async functions transparently.
```js
const transform = pipe(
  x => x * 2,
  x => x + 1,
  x => x ** 2
);
transform(3); // ((3*2)+1)^2 = 49

const transform2 = compose(
  x => x ** 2,
  x => x + 1,
  x => x * 2
);
transform2(3); // same result: 49
```

### HINT
`pipe` = `reduce` left to right, each function receiving the output of the previous. `compose` = `reduceRight` or just reverse the functions array.

### PATTERN NAME
**Function Composition / Pipe**

### SOLUTION
```js
// Synchronous versions
function pipe(...fns) {
  return function(value) {
    return fns.reduce((acc, fn) => fn(acc), value);
  };
}

function compose(...fns) {
  return function(value) {
    return fns.reduceRight((acc, fn) => fn(acc), value);
  };
}

// Async-aware versions (handle both sync and async fns transparently)
function pipeAsync(...fns) {
  return function(value) {
    return fns.reduce(
      (promise, fn) => Promise.resolve(promise).then(fn),
      Promise.resolve(value)
    );
  };
}

function composeAsync(...fns) {
  return pipeAsync(...fns.reverse());
}

// Test — sync
const double  = x => x * 2;
const addOne  = x => x + 1;
const square  = x => x * x;

const transform = pipe(double, addOne, square);
console.log(transform(3)); // (3*2+1)^2 = 49

const transform2 = compose(square, addOne, double);
console.log(transform2(3)); // same: 49 — applied right-to-left

// Test — async
const asyncDouble = async x => x * 2;
const asyncAddOne = async x => x + 1;

const asyncTransform = pipeAsync(asyncDouble, asyncAddOne);
asyncTransform(5).then(console.log); // 11

// Real-world: data transformation pipeline
const processUser = pipe(
  user => ({ ...user, name: user.name.trim() }),
  user => ({ ...user, email: user.email.toLowerCase() }),
  user => ({ ...user, role: user.role || "user" }),
  user => ({ ...user, createdAt: new Date().toISOString() })
);

const cleanUser = processUser({ name: "  Alice  ", email: "ALICE@EXAMPLE.COM" });
```
**Explanation:** `pipe` uses `reduce` — the initial value is the input; each step passes its output as the input to the next function. `compose` is identical but functions run in reverse order. The async version wraps the accumulator in `Promise.resolve` so it works whether each function is sync or async.

### TIME COMPLEXITY
- Time: O(n) — n = number of functions in the pipeline
- Space: O(1) extra (O(n) call stack for deeply nested composition)
