# JavaScript Functions Cheatsheet

---

## CONCEPT

Functions are first-class citizens in JavaScript — they can be assigned to variables, passed as arguments, and returned from other functions.

| Type                  | Syntax                              | Hoisted | Own `this` |
|-----------------------|-------------------------------------|---------|------------|
| Declaration           | `function foo() {}`                 | Yes     | Yes        |
| Expression            | `const foo = function() {}`         | No      | Yes        |
| Arrow                 | `const foo = () => {}`              | No      | No (lexical)|
| IIFE                  | `(function() {})()`                 | N/A     | Yes        |

---

## WHY IT MATTERS

- Arrow functions don't have their own `this` — critical for class methods and callbacks
- Function declarations are hoisted — you can call them before they appear in the file
- Closures let inner functions remember outer scope — the foundation of module patterns, memoization, and React hooks
- Higher-order functions (functions that take/return functions) are everywhere in modern JS
- Default and rest parameters eliminate the need for manual argument checking

---

## EXAMPLES

### 1. Declaration vs Expression vs Arrow
```js
// Declaration — hoisted, can call before definition
greet("Alice"); // works!
function greet(name) {
  return `Hello, ${name}`;
}

// Expression — not hoisted
sayBye("Bob"); // TypeError: sayBye is not a function
const sayBye = function(name) {
  return `Bye, ${name}`;
};

// Arrow — shortest syntax, lexical this
const double = (n) => n * 2;
const add = (a, b) => a + b;
const getUser = () => ({ id: 1, name: "Alice" }); // wrap object in ()

// Single param — parens optional
const triple = n => n * 3;

// Multi-line arrow — needs explicit return
const processUser = (user) => {
  const name = user.name.trim();
  return { ...user, name };
};
```

### 2. Hoisting — declarations vs expressions
```js
// Function declarations are fully hoisted
console.log(add(2, 3)); // 5 — works before definition
function add(a, b) { return a + b; }

// Function expressions — only the variable is hoisted, not the function
console.log(multiply); // undefined — variable hoisted but not the value
console.log(multiply(2, 3)); // TypeError: multiply is not a function
var multiply = function(a, b) { return a * b; };

// With let/const — TDZ applies
console.log(subtract(5, 2)); // ReferenceError
const subtract = (a, b) => a - b;
```

### 3. Closures — real example 1: counter factory
```js
// The inner function "closes over" the outer function's variable
function createCounter(start = 0) {
  let count = start; // private — not accessible from outside

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    value() { return count; },
    reset() { count = start; }
  };
}

const counter = createCounter(10);
counter.increment(); // 11
counter.increment(); // 12
counter.decrement(); // 11
counter.value();     // 11
// count is inaccessible directly — closure provides controlled access
```

### 4. Closures — real example 2: memoization
```js
// Cache expensive results using a closure to hold the cache
function memoize(fn) {
  const cache = {}; // closed over — lives as long as memoized function

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key] !== undefined) {
      console.log("cache hit");
      return cache[key];
    }
    cache[key] = fn(...args);
    return cache[key];
  };
}

const expensiveCalc = memoize((n) => {
  // simulate heavy work
  return n * n;
});

expensiveCalc(10); // computes: 100
expensiveCalc(10); // cache hit: 100
expensiveCalc(5);  // computes: 25
```

### 5. Closures — real example 3: partial application
```js
// Pre-fill some arguments using a closure
function multiply(a, b) {
  return a * b;
}

function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

const double = partial(multiply, 2);
const triple = partial(multiply, 3);

double(5);  // 10
triple(5);  // 15
double(20); // 40

// Real-world: pre-fill API base URL
const apiRequest = partial(fetch, "https://api.example.com");
```

### 6. IIFE — Immediately Invoked Function Expression
```js
// Runs immediately, creates its own scope
(function() {
  const privateVar = "I'm private";
  console.log(privateVar);
})();

console.log(privateVar); // ReferenceError — not accessible

// Arrow IIFE
(() => {
  console.log("Arrow IIFE");
})();

// IIFE with return value
const result = (function() {
  const x = 10;
  const y = 20;
  return x + y;
})();
console.log(result); // 30

// Use case: avoid polluting global scope in scripts
// Use case: initialize config without exposing internals
const config = (function() {
  const ENV = "production";
  return {
    isProduction: ENV === "production",
    apiUrl: ENV === "production" ? "https://api.prod.com" : "http://localhost:3000"
  };
})();
```

### 7. Higher-order functions and callbacks
```js
// A function that accepts another function as an argument
function runTwice(fn, value) {
  return fn(fn(value));
}

const addTen = (n) => n + 10;
runTwice(addTen, 5); // 25 (5 + 10 + 10)

// A function that returns a function
function makeMultiplier(factor) {
  return (n) => n * factor;
}
const double = makeMultiplier(2);
const triple = makeMultiplier(3);
double(7); // 14

// Callback pattern — pass behavior as an argument
function loadData(url, onSuccess, onError) {
  fetch(url)
    .then(res => res.json())
    .then(data => onSuccess(data))
    .catch(err => onError(err));
}

loadData(
  "/api/users",
  (data) => console.log("Got users:", data),
  (err) => console.error("Failed:", err)
);
```

### 8. Default parameters
```js
// Old way — manual default
function createUser(name, role) {
  role = role || "user"; // problem: role=false would default!
}

// Modern — default parameters
function createUser(name, role = "user", isActive = true) {
  return { name, role, isActive };
}

createUser("Alice");               // { name: "Alice", role: "user", isActive: true }
createUser("Bob", "admin");        // { name: "Bob", role: "admin", isActive: true }
createUser("Carol", "mod", false); // { name: "Carol", role: "mod", isActive: false }

// Default can reference earlier params
function createItem(name, quantity = 1, total = quantity * 10) {
  return { name, quantity, total };
}
createItem("Widget"); // { name: "Widget", quantity: 1, total: 10 }
```

### 9. Rest parameters
```js
// Collect remaining args into an array
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

sum(1, 2, 3);       // 6
sum(1, 2, 3, 4, 5); // 15

// Mix with regular params — rest must be last
function logMessage(level, ...messages) {
  console.log(`[${level}]`, messages.join(" "));
}

logMessage("INFO", "Server", "started", "on", "port", "3000");
// [INFO] Server started on port 3000

// Rest vs arguments object
function oldStyle() {
  console.log(arguments); // array-like, not a real array — no .map()
}
function newStyle(...args) {
  console.log(args); // real array — .map(), .filter() work
}
```

---

## COMMON MISTAKES

### Mistake 1: Arrow function as object method (loses this)
```js
const user = {
  name: "Alice",
  // WRONG — arrow has no own `this`, gets outer (window/undefined)
  greet: () => {
    return `Hello, I'm ${this.name}`; // this.name is undefined!
  },
  // RIGHT — regular function method has its own `this`
  greet() {
    return `Hello, I'm ${this.name}`; // "Alice"
  }
};
```

### Mistake 2: Arrow function as constructor
```js
const Person = (name) => { this.name = name; };
new Person("Alice"); // TypeError: Person is not a constructor
// Arrow functions cannot be used with `new`
```

### Mistake 3: Forgetting to return from arrow function
```js
const doubled = [1, 2, 3].map(n => {
  n * 2; // no return! — produces [undefined, undefined, undefined]
});

// Fix: explicit return or remove braces
const doubled = [1, 2, 3].map(n => n * 2);           // implicit return
const doubled = [1, 2, 3].map(n => { return n * 2; }); // explicit return
```

### Mistake 4: Mutating closure variable from multiple places
```js
let count = 0;
const inc = () => count++;
const reset = () => count = 0;

// Both closures share the same `count` — fine if intentional,
// but can cause bugs if you meant each call to be independent
// Use factory functions to give each instance its own variable
```

---

## INTERVIEW TIP

> **"What is a closure?"**
>
> Answer: A closure is a function that retains access to variables from its outer (enclosing) scope even after the outer function has returned. It's how JavaScript implements private state — the outer variable isn't accessible directly, but the inner function can read and update it. Real uses: counter factories, memoization, module pattern, React's useState hook.

> **"When would you NOT use an arrow function?"**
>
> Answer: Three cases — (1) as an object method that needs `this` to refer to the object, (2) as a constructor with `new`, (3) when you need the `arguments` object. In all other cases, arrow functions are preferred for their concise syntax and predictable `this`.

> **"What's the difference between rest parameters and the arguments object?"**
>
> Answer: `arguments` is an array-like object available in regular functions — it's not a real array, so `.map()` and `.filter()` don't work directly. Rest parameters (`...args`) collect remaining arguments into a real array with all array methods available. Always prefer rest parameters in modern code.
