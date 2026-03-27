# JavaScript Variables Cheatsheet

---

## CONCEPT

JavaScript has three ways to declare variables: `var`, `let`, and `const`.
They differ in **scope**, **hoisting behavior**, and **reassignability**.

| Feature        | var              | let              | const            |
|----------------|------------------|------------------|------------------|
| Scope          | Function         | Block            | Block            |
| Hoisting       | Yes (undefined)  | Yes (TDZ)        | Yes (TDZ)        |
| Reassignable   | Yes              | Yes              | No               |
| Redeclarable   | Yes              | No               | No               |
| Global prop    | Yes (window.x)   | No               | No               |

---

## WHY IT MATTERS

- `var` leaks out of blocks (if, for, while) — causes subtle bugs
- `let` and `const` are block-scoped — predictable and safe
- `const` doesn't mean immutable — objects/arrays can still be mutated
- The Temporal Dead Zone (TDZ) catches use-before-declaration errors early
- Almost all modern JS code uses `let`/`const` — interviewers notice if you use `var`

---

## EXAMPLES

### 1. var leaks out of blocks
```js
if (true) {
  var name = "Alice";
  let age = 25;
}

console.log(name); // "Alice" — var leaked out!
console.log(age);  // ReferenceError — let is block-scoped
```

### 2. var in loops — classic bug
```js
// Bug: all callbacks share the same `i`
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3

// Fix: use let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2
```

### 3. Hoisting with var vs let
```js
console.log(a); // undefined (hoisted, not initialized)
var a = 10;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;
```

### 4. Temporal Dead Zone (TDZ)
```js
// The TDZ is the time between entering the block and the declaration line
{
  // TDZ starts here for `x`
  console.log(x); // ReferenceError — in the TDZ
  let x = 5;      // TDZ ends here
  console.log(x); // 5
}
```

### 5. const with objects — mutation is still allowed
```js
const user = { name: "Alice" };
user.name = "Bob";    // OK — mutating the object
user.age = 30;        // OK — adding a property

user = { name: "Charlie" }; // TypeError — can't reassign the binding

const nums = [1, 2, 3];
nums.push(4);         // OK — mutating the array
nums = [5, 6];        // TypeError — can't reassign
```

### 6. Function scope vs block scope
```js
function demo() {
  var x = 1;
  let y = 2;

  if (true) {
    var x = 10;  // same x — overwrites!
    let y = 20;  // different y — block-scoped
    console.log(x, y); // 10, 20
  }

  console.log(x, y); // 10, 2 — var was overwritten, let was not
}
```

### 7. When to use each
```js
// const — default choice for everything
const API_URL = "https://api.example.com";
const user = { name: "Alice" };

// let — only when you need to reassign
let count = 0;
count++;

let result;
if (condition) {
  result = "yes";
} else {
  result = "no";
}

// var — avoid in modern JS. Only in legacy codebases.
```

---

## COMMON MISTAKES

### Mistake 1: Thinking const makes objects immutable
```js
const config = { debug: false };
config.debug = true; // This works! const only locks the binding, not the value
// To truly freeze: Object.freeze(config)
```

### Mistake 2: Re-declaring let/const
```js
let x = 1;
let x = 2; // SyntaxError: Identifier 'x' has already been declared
```

### Mistake 3: Using var inside loops with async code
```js
// Common in older code, breaks with callbacks/promises
for (var i = 0; i < 5; i++) {
  fetch(`/item/${i}`).then(() => console.log(i)); // always logs 5
}
// Fix: always use let in loops
```

### Mistake 4: Declaring without a keyword (implicit global)
```js
function oops() {
  x = 42; // no var/let/const — creates a global variable!
}
oops();
console.log(x); // 42 — pollutes global scope
// Fix: always use strict mode or a keyword
```

---

## INTERVIEW TIP

> **"Why do we use const by default?"**
>
> Answer: `const` signals intent — this binding won't be reassigned. It makes code easier to reason about because you know the variable always points to the same value. Use `let` only when reassignment is genuinely needed. Avoid `var` because function scoping and hoisting-to-`undefined` cause unpredictable bugs.

> **"What is the Temporal Dead Zone?"**
>
> Answer: The TDZ is the period between entering a block scope and the actual `let`/`const` declaration line. Accessing the variable during this window throws a `ReferenceError`. This is intentional — it catches bugs where code accidentally relies on a variable before it's set up.

> **Quick rule for interviews:** Say "I use `const` by default, `let` when I need to reassign, and I avoid `var` in modern code."
