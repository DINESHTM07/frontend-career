# JavaScript Arrays Cheatsheet

---

## CONCEPT

Arrays are ordered, zero-indexed collections. JavaScript array methods split into two groups:

**Non-mutating** (return new array, original unchanged):
`map`, `filter`, `reduce`, `find`, `findIndex`, `some`, `every`, `flat`, `flatMap`, `slice`, `concat`, `includes`, `indexOf`

**Mutating** (modify original array):
`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`

---

## WHY IT MATTERS

- Mutating vs non-mutating determines whether you need to clone first
- `sort` mutates and compares as strings by default — always pass a comparator
- `splice` vs `slice` is a classic interview question: one mutates, one doesn't
- `reduce` is the most powerful — it can replicate map, filter, and more
- Chaining `.filter().map().reduce()` is idiomatic modern JS

---

## EXAMPLES

### 1. map — transform every item
```js
// Real-world: format user data for display
const users = [
  { id: 1, firstName: "Alice", lastName: "Smith", salary: 95000 },
  { id: 2, firstName: "Bob",   lastName: "Jones", salary: 82000 },
  { id: 3, firstName: "Carol", lastName: "White", salary: 110000 },
];

// Create display names
const displayNames = users.map(u => `${u.firstName} ${u.lastName}`);
// ["Alice Smith", "Bob Jones", "Carol White"]

// Extract IDs for an API call
const ids = users.map(u => u.id); // [1, 2, 3]

// Apply a 10% raise
const withRaise = users.map(u => ({ ...u, salary: u.salary * 1.1 }));
// original users array is unchanged
```

### 2. filter — keep items that match a condition
```js
const products = [
  { name: "Shirt",  price: 29, inStock: true  },
  { name: "Pants",  price: 59, inStock: false },
  { name: "Shoes",  price: 89, inStock: true  },
  { name: "Hat",    price: 19, inStock: true  },
  { name: "Jacket", price: 129, inStock: false },
];

// In-stock items only
const available = products.filter(p => p.inStock);
// [Shirt, Shoes, Hat]

// Under $50 AND in stock
const affordable = products.filter(p => p.inStock && p.price < 50);
// [Shirt, Hat]

// Search by name (search bar pattern)
const query = "sh";
const results = products.filter(p =>
  p.name.toLowerCase().includes(query.toLowerCase())
);
// [Shirt, Shoes]
```

### 3. reduce — accumulate into a single value
```js
const cart = [
  { name: "Shirt",  price: 29, qty: 2 },
  { name: "Shoes",  price: 89, qty: 1 },
  { name: "Hat",    price: 19, qty: 3 },
];

// Total cart value
const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
// 29*2 + 89*1 + 19*3 = 58 + 89 + 57 = 204

// Group items by a property
const orders = [
  { id: 1, status: "pending" },
  { id: 2, status: "shipped" },
  { id: 3, status: "pending" },
  { id: 4, status: "delivered" },
];

const grouped = orders.reduce((acc, order) => {
  const key = order.status;
  acc[key] = acc[key] || [];
  acc[key].push(order);
  return acc;
}, {});
// { pending: [{id:1},{id:3}], shipped: [{id:2}], delivered: [{id:4}] }

// Count occurrences
const votes = ["yes", "no", "yes", "yes", "no"];
const tally = votes.reduce((acc, vote) => {
  acc[vote] = (acc[vote] || 0) + 1;
  return acc;
}, {});
// { yes: 3, no: 2 }
```

### 4. find and findIndex — locate a specific item
```js
const users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob",   role: "user"  },
  { id: 3, name: "Carol", role: "user"  },
];

// find — returns the first matching ITEM (or undefined)
const admin = users.find(u => u.role === "admin");
// { id: 1, name: "Alice", role: "admin" }

const notFound = users.find(u => u.id === 99);
// undefined

// findIndex — returns the first matching INDEX (or -1)
const bobIndex = users.findIndex(u => u.name === "Bob");
// 1

// Useful for updating by id
const idx = users.findIndex(u => u.id === 2);
if (idx !== -1) {
  const updated = [...users];
  updated[idx] = { ...users[idx], role: "moderator" };
}
```

### 5. some and every — boolean checks
```js
const cart = [
  { name: "Shirt",  price: 29, inStock: true  },
  { name: "Shoes",  price: 89, inStock: false },
  { name: "Hat",    price: 19, inStock: true  },
];

// some — true if AT LEAST ONE item matches
const hasOutOfStock = cart.some(item => !item.inStock);   // true
const hasExpensive  = cart.some(item => item.price > 100); // false

// every — true if ALL items match
const allInStock    = cart.every(item => item.inStock);   // false
const allAffordable = cart.every(item => item.price < 200); // true

// Practical: form validation
const fields = [
  { name: "email", value: "alice@example.com", valid: true  },
  { name: "name",  value: "",                  valid: false },
];
const canSubmit = fields.every(f => f.valid); // false — block submit
const hasErrors = fields.some(f => !f.valid); // true — show error UI
```

### 6. flat and flatMap
```js
// flat — flatten nested arrays
const nested = [1, [2, 3], [4, [5, 6]]];
nested.flat();    // [1, 2, 3, 4, [5, 6]] — one level
nested.flat(2);   // [1, 2, 3, 4, 5, 6]  — two levels
nested.flat(Infinity); // fully flattened

// Real-world: users with multiple tags
const users = [
  { name: "Alice", tags: ["admin", "editor"] },
  { name: "Bob",   tags: ["viewer"] },
  { name: "Carol", tags: ["editor", "reviewer"] },
];

// Get all tags (with map then flat)
const allTags = users.map(u => u.tags).flat();
// ["admin", "editor", "viewer", "editor", "reviewer"]

// flatMap — map + flat(1) in one pass (more efficient)
const allTagsFM = users.flatMap(u => u.tags);
// ["admin", "editor", "viewer", "editor", "reviewer"]

// flatMap use case: expand each item into multiple items
const sentences = ["hello world", "foo bar"];
const words = sentences.flatMap(s => s.split(" "));
// ["hello", "world", "foo", "bar"]
```

### 7. sort — with a comparator
```js
const nums = [10, 1, 21, 2];

// WRONG — default sort converts to strings
nums.sort(); // [1, 10, 2, 21] — string sort, not numeric!

// RIGHT — provide a comparator
nums.sort((a, b) => a - b); // [1, 2, 10, 21] — ascending
nums.sort((a, b) => b - a); // [21, 10, 2, 1] — descending

// Sort objects by property
const products = [
  { name: "Shoes", price: 89 },
  { name: "Hat",   price: 19 },
  { name: "Shirt", price: 29 },
];

products.sort((a, b) => a.price - b.price);
// [Hat 19, Shirt 29, Shoes 89]

// Sort strings alphabetically
const names = ["Carol", "Alice", "Bob"];
names.sort((a, b) => a.localeCompare(b));
// ["Alice", "Bob", "Carol"]

// WARNING: sort MUTATES the original array — clone first if needed
const sorted = [...products].sort((a, b) => a.price - b.price);
```

### 8. splice vs slice
```js
const fruits = ["apple", "banana", "cherry", "date", "elderberry"];

// SLICE — non-mutating, returns a portion
// slice(start, end) — end is exclusive
fruits.slice(1, 3);  // ["banana", "cherry"] — original unchanged
fruits.slice(2);     // ["cherry", "date", "elderberry"]
fruits.slice(-2);    // ["date", "elderberry"] — from end

// SPLICE — mutating! removes/inserts in place
// splice(start, deleteCount, ...itemsToInsert)
const removed = fruits.splice(1, 2); // removes 2 items starting at index 1
// removed = ["banana", "cherry"]
// fruits is now ["apple", "date", "elderberry"]

// Insert without removing
fruits.splice(1, 0, "blueberry", "coconut");
// ["apple", "blueberry", "coconut", "date", "elderberry"]

// Replace items
fruits.splice(0, 1, "avocado");
// replaces "apple" with "avocado"
```

### 9. forEach, includes, indexOf
```js
const scores = [85, 92, 78, 92, 88];

// forEach — iterate for side effects (no return value)
scores.forEach((score, index) => {
  console.log(`Student ${index + 1}: ${score}`);
});
// Note: forEach always returns undefined — don't use for transformation

// includes — check if value exists (returns boolean)
scores.includes(92);  // true
scores.includes(100); // false

// indexOf — find first position of a value (-1 if not found)
scores.indexOf(92);   // 1 — first occurrence
scores.indexOf(100);  // -1

// lastIndexOf — find last position
scores.lastIndexOf(92); // 3 — last occurrence

// Practical: toggle item in a selection list
function toggleSelection(selected, id) {
  if (selected.includes(id)) {
    return selected.filter(item => item !== id); // remove
  }
  return [...selected, id]; // add
}
```

### 10. Chaining methods — real-world pipeline
```js
const orders = [
  { id: 1, userId: 1, amount: 150, status: "completed" },
  { id: 2, userId: 2, amount: 80,  status: "pending"   },
  { id: 3, userId: 1, amount: 200, status: "completed" },
  { id: 4, userId: 3, amount: 50,  status: "cancelled" },
  { id: 5, userId: 2, amount: 300, status: "completed" },
];

// Get total revenue from completed orders for user 1
const revenue = orders
  .filter(o => o.status === "completed")  // [1, 3] + 5
  .filter(o => o.userId === 1)            // [1, 3]
  .map(o => o.amount)                     // [150, 200]
  .reduce((sum, amt) => sum + amt, 0);    // 350
```

---

## COMMON MISTAKES

### Mistake 1: sort without a comparator
```js
[10, 9, 2, 1, 100].sort(); // [1, 10, 100, 2, 9] — string comparison!
[10, 9, 2, 1, 100].sort((a, b) => a - b); // [1, 2, 9, 10, 100] — correct
```

### Mistake 2: Using forEach when map is appropriate
```js
// WRONG — building array with forEach
const doubled = [];
[1, 2, 3].forEach(n => doubled.push(n * 2)); // verbose

// RIGHT
const doubled = [1, 2, 3].map(n => n * 2); // clean
```

### Mistake 3: Forgetting reduce's initial value
```js
const nums = [1, 2, 3];
nums.reduce((acc, n) => acc + n);    // 6 — works, but risky
nums.reduce((acc, n) => acc + n, 0); // 6 — safe with empty arrays

[].reduce((acc, n) => acc + n);      // TypeError — no initial value!
[].reduce((acc, n) => acc + n, 0);   // 0 — safe
```

### Mistake 4: Mutating array while filtering
```js
// splice inside filter — unpredictable
const arr = [1, 2, 3, 4];
arr.filter(n => {
  if (n === 2) arr.splice(arr.indexOf(n), 1); // mutates mid-iteration!
  return n !== 2;
});

// Just use filter without side effects
const result = arr.filter(n => n !== 2);
```

### Mistake 5: Confusing splice return value
```js
const arr = [1, 2, 3, 4, 5];
const result = arr.splice(1, 2);
// result = [2, 3] — the REMOVED items
// arr is now [1, 4, 5] — mutated!
// Many people expect result to be the modified array
```

---

## INTERVIEW TIP

> **"What's the difference between splice and slice?"**
>
> Answer: `slice(start, end)` is non-mutating — it returns a shallow copy of a portion of the array, original untouched. `splice(start, count, ...items)` mutates the original array by removing and/or inserting items, and returns the removed items. Memory trick: **spl**ice = **sp**oi**l**s (mutates), **sl**ice = like slicing bread (leaves the loaf).

> **"When would you use reduce over map/filter?"**
>
> Answer: When you need to transform an array into a single non-array value — a number (sum, count), an object (groupBy, index), or a string. If you're just transforming shape, use `map`. If you're selecting items, use `filter`. If you need a fundamentally different data structure, use `reduce`.

> **"What's the difference between find and filter?"**
>
> Answer: `find` returns the first matching element (or `undefined`) and stops searching. `filter` returns ALL matching elements as an array (or `[]`). Use `find` when you know there's at most one match (like finding by ID). Use `filter` for collecting multiple matches.
