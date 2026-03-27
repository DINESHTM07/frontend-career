# JavaScript Data Types Cheatsheet

---

## CONCEPT

JavaScript has **7 primitive types** and **1 reference type** (Object).

### Primitives (stored by value)
| Type        | Example                  | typeof result   |
|-------------|--------------------------|-----------------|
| String      | `"hello"`, `'world'`     | `"string"`      |
| Number      | `42`, `3.14`, `NaN`, `Infinity` | `"number"` |
| Boolean     | `true`, `false`          | `"boolean"`     |
| Undefined   | `undefined`              | `"undefined"`   |
| Null        | `null`                   | `"object"` ⚠️   |
| BigInt      | `9007199254740991n`      | `"bigint"`      |
| Symbol      | `Symbol("id")`           | `"symbol"`      |

### Reference Types (stored by reference)
| Type        | Example                  | typeof result   |
|-------------|--------------------------|-----------------|
| Object      | `{ key: "value" }`       | `"object"`      |
| Array       | `[1, 2, 3]`              | `"object"` ⚠️   |
| Function    | `function() {}`          | `"function"`    |
| null        | `null`                   | `"object"` ⚠️   |

---

## WHY IT MATTERS

- Primitives are **compared by value**, reference types by **memory address**
- `typeof null === "object"` is a known JS bug — never use typeof to check for null
- Type coercion happens silently — knowing the rules prevents nasty bugs
- Truthy/falsy values affect every `if` statement and logical expression
- `NaN !== NaN` — the only value in JS not equal to itself

---

## EXAMPLES

### 1. typeof — the quirks
```js
typeof "hello"       // "string"
typeof 42            // "number"
typeof true          // "boolean"
typeof undefined     // "undefined"
typeof null          // "object"  ← BUG in JS, not fixable for legacy reasons
typeof []            // "object"  ← arrays are objects
typeof {}            // "object"
typeof function(){}  // "function"
typeof Symbol()      // "symbol"
typeof 42n           // "bigint"

// Correct null check:
const x = null;
x === null; // true — always use strict equality for null
```

### 2. Primitives are copied by value
```js
let a = 10;
let b = a;
b = 20;

console.log(a); // 10 — unchanged, b got its own copy
console.log(b); // 20
```

### 3. Objects are copied by reference
```js
const obj1 = { name: "Alice" };
const obj2 = obj1; // both point to same object in memory

obj2.name = "Bob";
console.log(obj1.name); // "Bob" — obj1 was also changed!

// To clone (shallow):
const obj3 = { ...obj1 };
const obj4 = Object.assign({}, obj1);
```

### 4. Type coercion traps
```js
// + with a string triggers string concatenation
console.log(1 + "2");    // "12" — not 3!
console.log("3" - 1);    // 2   — minus converts to number
console.log("6" / "2");  // 3   — division converts both

// Comparison coercion
console.log(0 == "0");   // true  — coerces "0" to 0
console.log(0 == false); // true  — coerces false to 0
console.log("" == false);// true  — both coerce to 0
console.log(null == undefined); // true — special rule

// Always use === to avoid these
console.log(0 === "0");  // false
```

### 5. Truthy and Falsy values
```js
// FALSY — these 8 values are falsy in JavaScript:
false
0
-0
0n          // BigInt zero
""          // empty string
null
undefined
NaN

// Everything else is TRUTHY, including:
"0"         // non-empty string — TRUTHY
[]          // empty array — TRUTHY
{}          // empty object — TRUTHY
-1          // any non-zero number — TRUTHY
"false"     // non-empty string — TRUTHY

// Practical usage
const name = "";
if (name) {
  console.log("has name");
} else {
  console.log("no name"); // this runs — empty string is falsy
}
```

### 6. NaN is not equal to itself
```js
console.log(NaN === NaN); // false — only value not equal to itself
console.log(NaN == NaN);  // false

// Check for NaN properly:
Number.isNaN(NaN);    // true  — preferred
Number.isNaN("hello");// false — does NOT coerce (safer)
isNaN("hello");       // true  — global isNaN coerces first (tricky)

// Produce NaN:
parseInt("abc");      // NaN
0 / 0;                // NaN
Math.sqrt(-1);        // NaN
```

### 7. Checking types properly
```js
// Null check
value === null

// Array check (typeof gives "object")
Array.isArray([]);        // true
Array.isArray({});        // false

// Object check (not array, not null)
typeof value === "object" && value !== null && !Array.isArray(value)

// Undefined check
typeof value === "undefined"
value === undefined

// Number check (excludes NaN)
typeof value === "number" && !Number.isNaN(value)
```

---

## COMMON MISTAKES

### Mistake 1: Using typeof to check for null
```js
// WRONG
if (typeof value === "object") { // true for null AND arrays too!
  value.doSomething(); // crashes if value is null
}

// RIGHT
if (value !== null && typeof value === "object") { ... }
```

### Mistake 2: Trusting that empty array/object is falsy
```js
const arr = [];
if (arr) console.log("truthy"); // prints "truthy" — [] is truthy!

// To check empty array:
if (arr.length === 0) console.log("empty");
```

### Mistake 3: String + number concatenation
```js
let total = 0;
total = total + "5"; // "05" — not 5!

// Fix:
total = total + Number("5"); // 5
total = total + parseInt("5"); // 5
total += +"5"; // unary + converts to number
```

### Mistake 4: Mutating a shared object reference
```js
function updateUser(user) {
  user.name = "Bob"; // mutates the original!
}

const alice = { name: "Alice" };
updateUser(alice);
console.log(alice.name); // "Bob" — unexpected!

// Fix: clone first
function updateUser(user) {
  return { ...user, name: "Bob" };
}
```

---

## INTERVIEW TIP

> **"What's the difference between primitive and reference types?"**
>
> Answer: Primitives (string, number, boolean, null, undefined, symbol, bigint) are stored by value — copying them creates an independent copy. Reference types (objects, arrays, functions) are stored by reference — copying just copies the memory address, so both variables point to the same data. This is why mutating an object inside a function can affect the caller.

> **"What are falsy values in JavaScript?"**
>
> Answer: There are exactly 8: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`. Everything else is truthy — including empty arrays `[]` and empty objects `{}`, which trip up a lot of developers.

> **"Why does typeof null return 'object'?"**
>
> Answer: It's a historical bug in JavaScript from 1995. The original implementation used a type tag system where objects had a tag of 0, and null was represented as a null pointer (also 0), so it got misidentified as an object. It was never fixed to preserve backward compatibility.
