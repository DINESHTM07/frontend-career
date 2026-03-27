# JavaScript Operators Cheatsheet

---

## CONCEPT

Operators act on values (operands) and produce a result. The key operators to master:

| Operator         | Symbol       | Purpose                                      |
|------------------|--------------|----------------------------------------------|
| Loose equality   | `==`         | Compares after type coercion                 |
| Strict equality  | `===`        | Compares value AND type, no coercion         |
| Logical AND      | `&&`         | Returns first falsy or last value            |
| Logical OR       | `\|\|`       | Returns first truthy or last value           |
| Logical NOT      | `!`          | Inverts truthiness                           |
| Ternary          | `? :`        | Inline if/else expression                   |
| Nullish coalescing | `??`       | Returns right side only if left is null/undefined |
| Optional chaining | `?.`        | Safe property/method access on null/undefined |

---

## WHY IT MATTERS

- `==` causes bugs through silent coercion — `0 == false` is `true`
- `&&` and `||` don't always return booleans — they return one of their operands
- `??` vs `||`: `||` treats `0`, `""`, `false` as fallbacks; `??` only treats `null`/`undefined`
- `?.` prevents the most common runtime error: "Cannot read property of undefined"
- Ternary is for expressions — use if/else for multi-line logic

---

## EXAMPLES

### 1. == vs === (loose vs strict equality)
```js
// == coerces types before comparing
console.log(0 == false);    // true  — false coerces to 0
console.log("" == false);   // true  — both coerce to 0
console.log(null == undefined); // true — special case
console.log(1 == "1");      // true  — "1" coerces to 1
console.log([] == false);   // true  — [] → "" → 0, false → 0

// === never coerces — compares value AND type
console.log(0 === false);   // false — different types
console.log(1 === "1");     // false — different types
console.log(null === undefined); // false — different types

// Rule: always use === unless you specifically need coercion (rare)
```

### 2. Logical AND (&&) — short-circuit evaluation
```js
// && returns the first FALSY value, or the last value if all truthy
console.log(true && "hello");  // "hello"
console.log(false && "hello"); // false   — short-circuits
console.log(null && "hello");  // null    — short-circuits
console.log(1 && 2 && 3);      // 3       — all truthy, returns last

// Practical: guard before calling a method
const user = null;
const name = user && user.name; // null — doesn't crash

// Conditional rendering pattern (React)
const isLoggedIn = true;
const element = isLoggedIn && <Dashboard />; // renders only if truthy
```

### 3. Logical OR (||) — default values
```js
// || returns the first TRUTHY value, or the last value if all falsy
console.log(null || "default");    // "default"
console.log(undefined || "default"); // "default"
console.log(0 || "default");       // "default" ← 0 is falsy!
console.log("" || "default");      // "default" ← "" is falsy!
console.log(false || "default");   // "default"
console.log("Alice" || "default"); // "Alice"

// Problem: || treats 0 and "" as missing values
const port = userConfig.port || 3000;
// If userConfig.port is 0 (valid!), this wrongly defaults to 3000
```

### 4. Nullish coalescing (??) — null/undefined only
```js
// ?? returns right side ONLY if left is null or undefined
console.log(null ?? "default");      // "default"
console.log(undefined ?? "default"); // "default"
console.log(0 ?? "default");         // 0    ← 0 is preserved!
console.log("" ?? "default");        // ""   ← "" is preserved!
console.log(false ?? "default");     // false ← false is preserved!

// Fix for the port problem above:
const port = userConfig.port ?? 3000;
// Now port = 0 stays as 0, only null/undefined falls back to 3000

// Chaining:
const value = a ?? b ?? c ?? "final default";
```

### 5. Optional chaining (?.) — safe property access
```js
const user = null;

// Without ?. — crashes
console.log(user.profile.name); // TypeError: Cannot read property of null

// With ?. — returns undefined instead of crashing
console.log(user?.profile?.name); // undefined — safe

// With method calls
const str = null;
str?.toUpperCase(); // undefined — not a crash

// With arrays
const arr = null;
arr?.[0]; // undefined — not a crash

// Real-world: API response might be missing nested data
const city = response?.data?.user?.address?.city ?? "Unknown";

// Combining with ?? for a safe default:
const displayName = user?.profile?.displayName ?? "Anonymous";
```

### 6. Ternary operator
```js
// Syntax: condition ? valueIfTrue : valueIfFalse
const age = 20;
const status = age >= 18 ? "adult" : "minor";
console.log(status); // "adult"

// Inline in JSX/template literals
const greeting = `Hello, ${isLoggedIn ? "User" : "Guest"}!`;

// Can be chained (use sparingly — hurts readability)
const grade =
  score >= 90 ? "A" :
  score >= 80 ? "B" :
  score >= 70 ? "C" : "F";

// AVOID: ternary for side effects — use if/else instead
// Bad:
isAdmin ? doAdminThing() : doUserThing();

// Better:
if (isAdmin) {
  doAdminThing();
} else {
  doUserThing();
}
```

### 7. Logical assignment operators (ES2021)
```js
// &&= — assign only if left side is truthy
user.name &&= user.name.trim();
// same as: user.name = user.name && user.name.trim()

// ||= — assign only if left side is falsy
settings.theme ||= "dark";
// same as: settings.theme = settings.theme || "dark"

// ??= — assign only if left side is null/undefined
config.retries ??= 3;
// same as: config.retries = config.retries ?? 3
```

---

## COMMON MISTAKES

### Mistake 1: Using || for defaults when 0 or "" are valid
```js
// WRONG — hides valid falsy values
function createServer(port) {
  const p = port || 8080; // if port is 0, wrongly uses 8080
}

// RIGHT — use ?? for "only null/undefined" fallback
function createServer(port) {
  const p = port ?? 8080; // 0 is kept as 0
}
```

### Mistake 2: Not checking null before optional chaining saves the line above
```js
// Still need to handle null at some point — ?. just defers the error
const name = user?.profile?.name;
// name is undefined — if you then do name.toUpperCase(), it still crashes
const safeName = user?.profile?.name ?? "Unknown"; // always a string
```

### Mistake 3: Confusing && return value for boolean
```js
const count = 0;
const show = count && <List />; // renders "0" in React — 0 is falsy but renders!

// Fix: coerce to boolean explicitly
const show = count > 0 && <List />;
// or
const show = Boolean(count) && <List />;
```

### Mistake 4: Using == with null checks
```js
// == null is actually a safe pattern (matches both null AND undefined)
if (value == null) { ... }  // true for null and undefined — intentional
if (value === null || value === undefined) { ... } // equivalent but verbose

// But avoid == elsewhere — too unpredictable
```

---

## INTERVIEW TIP

> **"When would you use ?? instead of ||?"**
>
> Answer: Use `??` (nullish coalescing) when `0`, `""`, or `false` are valid values that should NOT trigger a fallback. Use `||` only when any falsy value should fall back. For example, a port number of `0` is valid — `port ?? 8080` keeps it, but `port || 8080` replaces it.

> **"What does optional chaining return?"**
>
> Answer: `undefined` — it short-circuits the entire chain and returns `undefined` as soon as it hits a `null` or `undefined`. It doesn't throw. Combine it with `??` to provide a safe default: `obj?.prop ?? "fallback"`.

> **"What's the difference between == and ===?"**
>
> Answer: `==` performs type coercion before comparing — it converts operands to the same type first. `===` compares both value and type with no conversion. Always use `===` in production code unless you specifically need coercion (like `value == null` to catch both null and undefined).
