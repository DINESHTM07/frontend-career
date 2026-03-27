# JavaScript Objects Cheatsheet

---

## CONCEPT

Objects are key-value stores. Keys are strings (or Symbols), values can be anything.

| Feature                  | Syntax                              |
|--------------------------|-------------------------------------|
| Object literal           | `const obj = { key: value }`        |
| Dot notation             | `obj.key`                           |
| Bracket notation         | `obj["key"]`                        |
| Shorthand property       | `{ name }` instead of `{ name: name }` |
| Computed property name   | `{ [variable]: value }`             |
| Destructuring            | `const { a, b } = obj`              |
| Spread                   | `{ ...obj, newKey: value }`         |
| Rest in destructuring    | `const { a, ...rest } = obj`        |

---

## WHY IT MATTERS

- Objects are the primary data structure in JS — APIs return them, components receive them as props
- Destructuring reduces repetition and makes intent clear
- Spread creates shallow copies — understanding shallow vs deep copy prevents mutation bugs
- `Object.entries` + `reduce` can do almost any object transformation
- `Object.freeze` is how you create truly immutable config/constants

---

## EXAMPLES

### 1. Object creation and property access
```js
// Object literal — most common
const user = {
  id: 1,
  name: "Alice",
  role: "admin",
  address: {
    city: "New York",
    zip: "10001"
  }
};

// Dot notation — use when key is a known identifier
user.name;        // "Alice"
user.address.city; // "New York"

// Bracket notation — use when key is dynamic or has special characters
const key = "role";
user[key];        // "admin" — key is a variable

user["first-name"] = "Alice"; // key with hyphen — must use brackets
user["2fast"];                 // key starting with number — must use brackets

// Add / update / delete properties
user.email = "alice@example.com"; // add
user.name = "Alicia";             // update
delete user.role;                 // remove
```

### 2. Shorthand properties and methods
```js
const name = "Alice";
const age = 30;
const role = "admin";

// Old style
const user = { name: name, age: age, role: role };

// Shorthand — when variable name matches key name
const user = { name, age, role };

// Method shorthand
const api = {
  baseUrl: "https://api.example.com",

  // Old style
  getUser: function(id) {
    return fetch(`${this.baseUrl}/users/${id}`);
  },

  // Method shorthand
  getUser(id) {
    return fetch(`${this.baseUrl}/users/${id}`);
  },

  // Arrow — careful: no own `this`
  log: () => console.log("log"), // can't use `this` here
};
```

### 3. Computed property names
```js
// Build property name dynamically at runtime
const field = "email";
const user = {
  name: "Alice",
  [field]: "alice@example.com",  // key is the VALUE of `field`
  [`${field}_verified`]: true    // template literal as key
};
// { name: "Alice", email: "alice@example.com", email_verified: true }

// Real-world: dynamic form state
function updateField(state, fieldName, value) {
  return {
    ...state,
    [fieldName]: value // update only the field that changed
  };
}

const formState = { name: "", email: "" };
updateField(formState, "name", "Alice");
// { name: "Alice", email: "" }

// Build lookup table from array
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];
const byId = users.reduce((acc, user) => ({
  ...acc,
  [user.id]: user  // computed key from data
}), {});
// { 1: { id: 1, name: "Alice" }, 2: { id: 2, name: "Bob" } }
```

### 4. Destructuring — basic and with rename/default
```js
const user = { id: 1, name: "Alice", role: "admin", age: 30 };

// Basic destructuring
const { name, role } = user;
console.log(name, role); // "Alice" "admin"

// Rename while destructuring
const { name: userName, role: userRole } = user;
console.log(userName, userRole); // "Alice" "admin"

// Default values (used when property is undefined)
const { name, theme = "dark", language = "en" } = user;
console.log(theme);    // "dark" — user has no theme property
console.log(language); // "en"

// Rename + default
const { name: displayName = "Anonymous" } = {};
console.log(displayName); // "Anonymous"

// In function parameters — very common in React
function UserCard({ name, role = "user", isActive = true }) {
  return `${name} (${role}) — ${isActive ? "active" : "inactive"}`;
}
UserCard({ name: "Alice", role: "admin" });
// "Alice (admin) — active"
```

### 5. Nested destructuring
```js
const order = {
  id: "ord_123",
  customer: {
    name: "Alice",
    address: {
      city: "New York",
      zip: "10001"
    }
  },
  items: [
    { product: "Shirt", qty: 2 },
    { product: "Shoes", qty: 1 }
  ]
};

// Nested destructuring
const {
  id,
  customer: {
    name: customerName,
    address: { city, zip }
  },
  items: [firstItem, secondItem]
} = order;

console.log(id);           // "ord_123"
console.log(customerName); // "Alice"
console.log(city);         // "New York"
console.log(firstItem);    // { product: "Shirt", qty: 2 }

// Note: `customer` and `address` are NOT declared as variables here
// only the leaves (name, city, zip) are
```

### 6. Spread operator — shallow copy and merge
```js
const defaults = { theme: "dark", lang: "en", fontSize: 14 };
const userPrefs = { lang: "fr", fontSize: 16 };

// Merge objects — later keys override earlier ones
const settings = { ...defaults, ...userPrefs };
// { theme: "dark", lang: "fr", fontSize: 16 }

// Clone an object (shallow)
const original = { name: "Alice", scores: [90, 85] };
const clone = { ...original };
clone.name = "Bob"; // doesn't affect original
clone.scores.push(95); // DOES affect original — shallow copy!

// Add/override properties immutably
const user = { id: 1, name: "Alice", role: "user" };
const promoted = { ...user, role: "admin", promotedAt: new Date() };
// original user is unchanged

// Remove a property by spreading without it
const { password, ...safeUser } = user; // rest in destructuring
// safeUser has everything except password
```

### 7. Rest in object destructuring
```js
const config = {
  host: "localhost",
  port: 3000,
  debug: true,
  timeout: 5000,
  retries: 3
};

// Extract specific keys, collect the rest
const { host, port, ...options } = config;
console.log(host);    // "localhost"
console.log(port);    // 3000
console.log(options); // { debug: true, timeout: 5000, retries: 3 }

// Real-world: separate component props from HTML attributes
function Button({ label, onClick, variant = "primary", ...htmlProps }) {
  // label, onClick, variant are component-specific
  // htmlProps (disabled, className, id, etc.) go to the DOM element
  return `<button class="${variant}" ...>${label}</button>`;
}
```

### 8. Object.keys / values / entries / assign / freeze
```js
const product = { name: "Shirt", price: 29, inStock: true };

// Object.keys — array of keys
Object.keys(product);    // ["name", "price", "inStock"]

// Object.values — array of values
Object.values(product);  // ["Shirt", 29, true]

// Object.entries — array of [key, value] pairs
Object.entries(product);
// [["name", "Shirt"], ["price", 29], ["inStock", true]]

// Iterate over object (modern pattern)
for (const [key, value] of Object.entries(product)) {
  console.log(`${key}: ${value}`);
}

// Transform object values
const discounted = Object.fromEntries(
  Object.entries(product).map(([key, value]) =>
    key === "price" ? [key, value * 0.9] : [key, value]
  )
);
// { name: "Shirt", price: 26.1, inStock: true }

// Object.assign — merge into target (mutates target!)
const target = { a: 1 };
Object.assign(target, { b: 2 }, { c: 3 });
// target = { a: 1, b: 2, c: 3 }

// Clone with Object.assign (target is a fresh object)
const clone = Object.assign({}, product);

// Prefer spread over Object.assign for clarity
const clone2 = { ...product };

// Object.freeze — prevent all modifications
const CONFIG = Object.freeze({
  API_URL: "https://api.example.com",
  MAX_RETRIES: 3
});
CONFIG.API_URL = "hacked"; // silently fails (throws in strict mode)
CONFIG.API_URL; // still "https://api.example.com"

// Note: freeze is shallow — nested objects are still mutable
const obj = Object.freeze({ nested: { value: 1 } });
obj.nested.value = 2; // works! nested is not frozen
```

---

## COMMON MISTAKES

### Mistake 1: Shallow copy mutation
```js
const user = { name: "Alice", address: { city: "NYC" } };
const clone = { ...user }; // shallow copy

clone.name = "Bob";          // safe — primitive
clone.address.city = "LA";   // MUTATES original! address is still shared

console.log(user.address.city); // "LA" — unexpected!

// Fix: deep clone nested objects
const deepClone = { ...user, address: { ...user.address } };
// or for deeply nested:
const deepClone2 = JSON.parse(JSON.stringify(user)); // simple but loses functions/dates
const deepClone3 = structuredClone(user); // modern native deep clone
```

### Mistake 2: Destructuring from null/undefined
```js
const response = null;

const { data } = response; // TypeError: Cannot destructure property 'data' of null

// Fix: provide a default
const { data } = response ?? {};
const { data } = response || {};
```

### Mistake 3: Object.keys order dependency
```js
const obj = { b: 2, a: 1, c: 3 };
Object.keys(obj); // ["b", "a", "c"] — insertion order, not alphabetical
// Don't rely on key order for logic — use a Map if order matters
```

### Mistake 4: Forgetting Object.assign mutates the target
```js
const base = { a: 1 };
const result = Object.assign(base, { b: 2 }); // base is now { a: 1, b: 2 }!

// If you don't want to mutate base:
const result = Object.assign({}, base, { b: 2 }); // base unchanged
const result2 = { ...base, b: 2 };               // cleaner
```

### Mistake 5: Spreading non-objects
```js
const num = 5;
const str = "hello";

console.log({ ...num }); // {} — primitives spread to empty object
console.log({ ...str }); // { 0: "h", 1: "e", 2: "l", 3: "l", 4: "o" }

// Be intentional — spread only plain objects
```

---

## INTERVIEW TIP

> **"What's the difference between spread and Object.assign?"**
>
> Answer: Both do a shallow merge. The key difference: `Object.assign(target, source)` mutates the target object and triggers setters. Spread `{ ...source }` always creates a new object and doesn't trigger setters. In modern code, spread is preferred for immutability — it makes it obvious a new object is being created.

> **"What does 'shallow copy' mean for objects?"**
>
> Answer: A shallow copy creates a new object with the same top-level key-value pairs, but nested objects are still shared by reference. So cloning `{ name, address: { city } }` with spread gives you a new object, but `address` still points to the same inner object — mutating `clone.address.city` also changes the original. For deep copies, use `structuredClone()` or a library like lodash's `cloneDeep`.

> **"How do you iterate over an object's properties?"**
>
> Answer: Three main ways — `for...in` (iterates keys including inherited ones, so add a `hasOwnProperty` check), `Object.keys(obj).forEach(...)` (own enumerable keys only), or `Object.entries(obj)` with destructuring for both key and value at once. `Object.entries` is the most useful in modern code.
