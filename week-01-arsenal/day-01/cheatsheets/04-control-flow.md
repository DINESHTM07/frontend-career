# JavaScript Control Flow Cheatsheet

---

## CONCEPT

Control flow determines the order in which code executes. JavaScript has:

| Construct       | Use case                                              |
|-----------------|-------------------------------------------------------|
| `if / else if / else` | Branch based on a condition                   |
| `switch`        | Multi-branch on a single value                        |
| `for`           | Known number of iterations                            |
| `while`         | Loop while a condition is true (check first)          |
| `do...while`    | Loop while a condition is true (run at least once)    |
| `for...of`      | Iterate over iterable values (arrays, strings, maps)  |
| `for...in`      | Iterate over object keys                              |
| `break`         | Exit a loop or switch immediately                     |
| `continue`      | Skip current iteration, continue loop                 |

---

## WHY IT MATTERS

- `for...in` on arrays iterates keys (indices as strings) — usually wrong for arrays
- `for...of` is the modern, safe way to loop over array values
- `switch` uses `===` for comparison but falls through without `break`
- Early returns (guard clauses) make code far more readable than nested if/else
- Knowing when NOT to loop (use `.map`, `.filter`, `.find` instead) signals seniority

---

## EXAMPLES

### 1. if / else if / else — guard clause pattern
```js
// Nested style — harder to read
function processUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        doWork(user);
      } else {
        throw new Error("No permission");
      }
    } else {
      throw new Error("Inactive user");
    }
  } else {
    throw new Error("No user");
  }
}

// Guard clause style — same logic, much cleaner
function processUser(user) {
  if (!user) throw new Error("No user");
  if (!user.isActive) throw new Error("Inactive user");
  if (!user.hasPermission) throw new Error("No permission");

  doWork(user); // happy path at the bottom, no nesting
}
```

### 2. switch — with and without fall-through
```js
const day = "Monday";

switch (day) {
  case "Monday":
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
  case "Friday":
    console.log("Weekday");
    break; // REQUIRED — without this, falls through to next case
  case "Saturday":
  case "Sunday":
    console.log("Weekend");
    break;
  default:
    console.log("Unknown day");
}

// Fall-through BUG (forgot break):
switch (status) {
  case "active":
    doActive();
    // missing break!
  case "pending":
    doPending(); // ALSO runs when status is "active" — unintentional!
    break;
}
```

### 3. for loop — classic indexed iteration
```js
// Standard for loop
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// Reverse iteration
const arr = [1, 2, 3, 4, 5];
for (let i = arr.length - 1; i >= 0; i--) {
  console.log(arr[i]); // 5, 4, 3, 2, 1
}

// Skip even indices
for (let i = 0; i < arr.length; i += 2) {
  console.log(arr[i]); // 1, 3, 5
}
```

### 4. while and do...while
```js
// while — checks condition BEFORE running
let count = 0;
while (count < 3) {
  console.log(count); // 0, 1, 2
  count++;
}

// do...while — runs AT LEAST once, then checks condition
let input;
do {
  input = prompt("Enter a number:"); // always runs at least once
} while (isNaN(input));

// Infinite loop safety — always ensure exit condition changes
let attempts = 0;
while (true) {
  if (attempts >= 3) break; // exit condition
  attempts++;
}
```

### 5. for...of — iterating values (preferred for arrays)
```js
const fruits = ["apple", "banana", "cherry"];

// Basic value iteration
for (const fruit of fruits) {
  console.log(fruit); // "apple", "banana", "cherry"
}

// With index using entries()
for (const [index, fruit] of fruits.entries()) {
  console.log(`${index}: ${fruit}`);
  // "0: apple", "1: banana", "2: cherry"
}

// Works on strings too
for (const char of "hello") {
  console.log(char); // "h", "e", "l", "l", "o"
}

// Works on Map and Set
const map = new Map([["a", 1], ["b", 2]]);
for (const [key, value] of map) {
  console.log(key, value); // "a" 1, "b" 2
}
```

### 6. for...in — iterating object keys
```js
const person = { name: "Alice", age: 25, city: "NYC" };

for (const key in person) {
  console.log(`${key}: ${person[key]}`);
  // "name: Alice", "age: 25", "city: NYC"
}

// WARNING: for...in on arrays gives string keys + prototype keys
const arr = [10, 20, 30];
for (const key in arr) {
  console.log(key, typeof key); // "0" string, "1" string, "2" string
}
// Use for...of for arrays instead!

// Safe alternative for object keys:
Object.keys(person).forEach(key => console.log(key));
Object.entries(person).forEach(([key, val]) => console.log(key, val));
```

### 7. break and continue
```js
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// break — exit loop entirely
for (const num of numbers) {
  if (num === 5) break;
  console.log(num); // 1, 2, 3, 4
}

// continue — skip this iteration, go to next
for (const num of numbers) {
  if (num % 2 === 0) continue; // skip even numbers
  console.log(num); // 1, 3, 5, 7, 9
}

// break with labeled loop — exits outer loop
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) break outer; // exits BOTH loops
    console.log(i, j);
  }
}
// Output: 0 0 (then stops)
```

---

## COMMON MISTAKES

### Mistake 1: for...in on arrays
```js
const arr = [10, 20, 30];

// WRONG — for...in gives string indices, not values
for (const i in arr) {
  console.log(i); // "0", "1", "2" — strings, not numbers!
  console.log(arr[i]); // 10, 20, 30 — works but wrong approach
}

// RIGHT — use for...of for values
for (const val of arr) {
  console.log(val); // 10, 20, 30
}
```

### Mistake 2: Forgetting break in switch
```js
switch (role) {
  case "admin":
    grantAdminAccess();
    // forgot break!
  case "user":
    grantUserAccess(); // ALSO runs for admin — security bug!
    break;
}
```

### Mistake 3: Mutating array while iterating
```js
const arr = [1, 2, 3, 4, 5];

// Skips elements because indices shift after splice
for (let i = 0; i < arr.length; i++) {
  if (arr[i] % 2 === 0) arr.splice(i, 1); // mutating mid-loop!
}

// Fix: iterate backwards when removing, or use filter
const result = arr.filter(n => n % 2 !== 0); // cleaner
```

### Mistake 4: Infinite while loop
```js
let i = 0;
while (i < 10) {
  console.log(i);
  // forgot i++ — loop never ends, browser crashes
}

// Always ensure loop variable changes each iteration
```

### Mistake 5: Using loops when array methods are cleaner
```js
// Verbose — using a loop to build a new array
const nums = [1, 2, 3, 4, 5];
const doubled = [];
for (const n of nums) {
  doubled.push(n * 2);
}

// Clean — use map
const doubled = nums.map(n => n * 2);

// Same for filtering, finding, reducing
const evens = nums.filter(n => n % 2 === 0);
const first = nums.find(n => n > 3);
const sum = nums.reduce((acc, n) => acc + n, 0);
```

---

## INTERVIEW TIP

> **"When would you use for...of vs for...in?"**
>
> Answer: Use `for...of` to iterate over the **values** of an iterable (arrays, strings, Maps, Sets). Use `for...in` to iterate over the **keys** of an object. Never use `for...in` on arrays — it gives string indices and can include inherited prototype properties.

> **"What's the difference between break and continue?"**
>
> Answer: `break` exits the entire loop immediately. `continue` skips the rest of the current iteration and jumps to the next one. Both can be used with a label to control nested loops.

> **"How do you avoid deeply nested if/else?"**
>
> Answer: Guard clauses — return or throw early for invalid conditions, so the happy path stays at the bottom with no nesting. This is a common pattern in production code and signals clean coding habits.

> **Quick rule for interviews:** Prefer `for...of` for arrays, `for...in` for plain objects, array methods (`.map`, `.filter`, `.reduce`) when transforming data, and guard clauses over nested `if/else`.
