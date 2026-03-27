# ES6+ JavaScript Features Cheatsheet

---

## CONCEPT

ES6 (2015) and later versions added foundational features that define modern JavaScript. Most interviews and all modern codebases use these daily.

| Feature               | ES Version | Key use                                    |
|-----------------------|------------|--------------------------------------------|
| let / const           | ES6        | Block scoping                              |
| Arrow functions       | ES6        | Concise syntax, lexical `this`             |
| Template literals     | ES6        | String interpolation, multiline            |
| Destructuring         | ES6        | Extract values from arrays/objects         |
| Spread / Rest         | ES6        | Copy, merge, collect args                  |
| Default parameters    | ES6        | Function argument defaults                 |
| Modules               | ES6        | import / export                            |
| Classes               | ES6        | OOP syntax over prototypes                 |
| Promises              | ES6        | Async handling                             |
| Map / Set             | ES6        | Better collections                         |
| Symbol                | ES6        | Unique property keys                       |
| for...of              | ES6        | Iterate iterables                          |
| async/await           | ES2017     | Cleaner async code                         |
| Optional chaining     | ES2020     | Safe property access                       |
| Nullish coalescing    | ES2020     | Null-safe defaults                         |
| Logical assignment    | ES2021     | `??=`, `||=`, `&&=`                        |
| Generators            | ES6        | Pausable functions                         |

---

## WHY IT MATTERS

- Every modern framework (React, Vue, Angular) requires fluency in these features
- Interviewers assume ES6+ knowledge — using var or old patterns signals inexperience
- Modules are the foundation of every bundled app (Webpack, Vite, esbuild)
- Classes are how React class components and many libraries are structured
- Map/Set are significantly more capable than using plain objects for collections

---

## EXAMPLES

### 1. Template literals and tagged templates
```js
const name = "Alice";
const score = 98.5;

// Interpolation
const msg = `Hello, ${name}! Your score is ${score.toFixed(1)}.`;

// Multiline — no \n needed
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>Score: ${score}</p>
  </div>
`;

// Expressions inside ${}
const label = `Status: ${score >= 90 ? "Excellent" : "Good"}`;

// Tagged templates — function processes the template parts
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] !== undefined
      ? `<mark>${values[i]}</mark>`
      : "";
    return result + str + value;
  }, "");
}

const output = highlight`Hello, ${name}! Score: ${score}`;
// "Hello, <mark>Alice</mark>! Score: <mark>98.5</mark>"

// Real use: styled-components uses tagged templates
const Button = styled.button`
  background: ${props => props.primary ? "blue" : "white"};
  padding: 8px 16px;
`;
```

### 2. Modules — import and export
```js
// ---- math.js ----

// Named exports — multiple per file
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

// Can also export at the bottom
const subtract = (a, b) => a - b;
export { subtract };

// Default export — one per file
export default function calculateArea(r) {
  return PI * r * r;
}


// ---- main.js ----

// Import named exports — must match exact names
import { PI, add, multiply } from "./math.js";

// Import with alias
import { multiply as mul } from "./math.js";

// Import default — can be named anything
import calculateArea from "./math.js";

// Import default AND named together
import calculateArea, { PI, add } from "./math.js";

// Import everything as namespace
import * as MathUtils from "./math.js";
MathUtils.add(1, 2);
MathUtils.PI;

// Re-export (barrel files — index.js)
export { add, multiply } from "./math.js";
export { default as calculateArea } from "./math.js";
```

### 3. Classes — constructor, methods, inheritance, static
```js
class Animal {
  // Class field (ES2022) — no need to declare in constructor
  #name; // private field — truly private, can't access from outside

  constructor(name, sound) {
    this.#name = name;
    this.sound = sound;
  }

  // Instance method
  speak() {
    return `${this.#name} says ${this.sound}`;
  }

  // Getter
  get name() { return this.#name; }

  // Setter
  set name(value) {
    if (!value) throw new Error("Name required");
    this.#name = value;
  }

  // Static method — called on the class, not instances
  static create(name, sound) {
    return new Animal(name, sound);
  }
}

// Inheritance
class Dog extends Animal {
  constructor(name) {
    super(name, "Woof"); // must call super first
    this.tricks = [];
  }

  learn(trick) {
    this.tricks.push(trick);
    return this; // enables chaining
  }

  // Override parent method
  speak() {
    const base = super.speak(); // call parent version
    return `${base} (and wags tail)`;
  }
}

const dog = new Dog("Rex");
dog.learn("sit").learn("shake").learn("roll over");
dog.speak(); // "Rex says Woof (and wags tail)"

// Static usage
const cat = Animal.create("Whiskers", "Meow");
```

### 4. Map — keyed collection with any key type
```js
// Map vs Object:
// - Map keys can be ANY type (objects, functions, etc.)
// - Map preserves insertion order
// - Map has .size, .has(), .delete()
// - Map is more performant for frequent add/delete

const userMap = new Map();

// Set entries
userMap.set("alice", { age: 30, role: "admin" });
userMap.set("bob",   { age: 25, role: "user" });
userMap.set(1, "numeric key works");

// Get, has, delete
userMap.get("alice");    // { age: 30, role: "admin" }
userMap.has("alice");    // true
userMap.delete("bob");
userMap.size;            // 2

// Iterate
for (const [key, value] of userMap) {
  console.log(key, value);
}

userMap.forEach((value, key) => console.log(key, value));

// Convert
const entries = [...userMap.entries()]; // [[key, val], ...]
const keys    = [...userMap.keys()];
const values  = [...userMap.values()];

// Build from array
const map = new Map([["a", 1], ["b", 2], ["c", 3]]);

// Real use: cache/memoize with object keys
const cache = new Map();
function getWidget(config) {
  if (cache.has(config)) return cache.get(config);
  const widget = buildWidget(config);
  cache.set(config, widget);
  return widget;
}
```

### 5. Set — unique value collection
```js
// Set stores unique values only — any type
const ids = new Set([1, 2, 2, 3, 3, 3]);
ids.size; // 3 — duplicates removed

ids.add(4);
ids.has(2);    // true
ids.delete(1);

// Remove duplicates from array
const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)]; // [1, 2, 3, 4]

// Iterate (preserves insertion order)
for (const id of ids) console.log(id);

// Set operations
const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5, 6]);

const union        = new Set([...a, ...b]);         // {1,2,3,4,5,6}
const intersection = new Set([...a].filter(x => b.has(x))); // {3,4}
const difference   = new Set([...a].filter(x => !b.has(x))); // {1,2}

// Real use: track seen items, deduplicate tags
const tags = ["js", "react", "js", "css", "react"];
const uniqueTags = [...new Set(tags)]; // ["js", "react", "css"]
```

### 6. Symbols
```js
// Symbol — guaranteed unique value, used as unique keys
const id = Symbol("id");       // description is just for debugging
const id2 = Symbol("id");
id === id2; // false — every Symbol is unique

// Use as object key (won't clash with string keys)
const user = {
  name: "Alice",
  [id]: 12345 // not enumerable in Object.keys/for...in
};

user[id]; // 12345
Object.keys(user); // ["name"] — Symbol key is hidden

// Well-known Symbols — customize built-in behavior
class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  // Make the class iterable with for...of
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { done: true };
      }
    };
  }
}

for (const n of new Range(1, 5)) {
  console.log(n); // 1, 2, 3, 4, 5
}
```

### 7. Generators — pausable functions
```js
// function* declares a generator — returns an iterator
function* counter(start = 0) {
  while (true) {
    yield start++; // pauses here, returns value to caller
  }
}

const gen = counter(1);
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }

// Finite generator
function* range(from, to, step = 1) {
  for (let i = from; i <= to; i += step) {
    yield i;
  }
}

[...range(0, 10, 2)]; // [0, 2, 4, 6, 8, 10]

for (const n of range(1, 5)) {
  console.log(n); // 1, 2, 3, 4, 5
}

// Async generator — yield async values
async function* paginate(url) {
  let page = 1;
  while (true) {
    const res = await fetch(`${url}?page=${page}`);
    const data = await res.json();
    if (!data.length) return;
    yield data;
    page++;
  }
}

for await (const page of paginate("/api/users")) {
  console.log(page); // each page of results
}
```

### 8. WeakMap and WeakRef awareness
```js
// WeakMap — keys must be objects, doesn't prevent garbage collection
// Keys are held weakly — if object is GC'd, entry disappears automatically
const cache = new WeakMap();

function processNode(node) {
  if (cache.has(node)) return cache.get(node);
  const result = expensiveOperation(node);
  cache.set(node, result);
  return result;
}
// When `node` is removed from DOM and GC'd, cache entry is cleaned up too
// Regular Map would hold a reference, preventing GC — memory leak!

// WeakMap is NOT iterable — can't loop over it
// Use case: attach private data to objects, DOM node metadata

// WeakRef — hold a weak reference to an object
const ref = new WeakRef(someHeavyObject);
const obj = ref.deref(); // returns object or undefined if GC'd
if (obj) {
  obj.doSomething();
}

// FinalizationRegistry — callback when object is GC'd
const registry = new FinalizationRegistry((label) => {
  console.log(`${label} was garbage collected`);
});
registry.register(someObject, "myObject");
```

---

## COMMON MISTAKES

### Mistake 1: Default export confusion
```js
// Default export can be imported with ANY name
export default function calculate() {}

import calc from "./math.js";       // works
import doMath from "./math.js";     // also works — different name, same thing
import { calculate } from "./math.js"; // FAILS — calculate is the default, not named
```

### Mistake 2: Classes are not hoisted like function declarations
```js
const dog = new Dog("Rex"); // ReferenceError — class not yet defined
class Dog { constructor(name) { this.name = name; } }
```

### Mistake 3: Map vs Object for counts/tallies
```js
// Object works but has quirks (__proto__, toString are keys already)
const counts = {};
counts["constructor"]++; // problematic — "constructor" is inherited

// Map is safer and purpose-built
const counts = new Map();
counts.set("constructor", (counts.get("constructor") ?? 0) + 1); // safe
```

### Mistake 4: Symbol in JSON
```js
const key = Symbol("id");
const obj = { [key]: 1, name: "Alice" };
JSON.stringify(obj); // '{"name":"Alice"}' — Symbol keys are omitted!
// Don't use Symbols for data you need to serialize
```

---

## INTERVIEW TIP

> **"What's the difference between Map and a plain object?"**
>
> Answer: A Map can have keys of any type (objects, functions, symbols), whereas object keys are always strings or symbols. Map has a `.size` property, guaranteed insertion-order iteration, and better performance for frequent add/delete. Use an object for fixed-shape data structures; use a Map for dynamic key-value collections.

> **"When would you use a generator?"**
>
> Answer: Generators are useful for lazy sequences (compute values on demand), infinite sequences (IDs, pagination), and async iteration. They're the foundation of how Redux-Saga works. In practice, async generators are the most common real-world use — streaming paginated API results without loading everything at once.

> **"What's the difference between default and named exports?"**
>
> Answer: A module can have only ONE default export but many named exports. Named exports must be imported with their exact name (or aliased with `as`). Default exports can be imported with any name. Convention: use named exports for utilities/constants, default export for the main thing a module provides (a component, a class, a config).
