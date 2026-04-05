// ============================================
// INTRO: Spread/Rest and WHY it matters
// ============================================
// The spread operator (...) expands an iterable (array, object, string) into
// individual elements. The rest parameter (...) collects multiple elements
// into a single array or object. Same syntax, opposite directions.
//
// The IMMUTABILITY pattern means: never mutate existing data. Instead,
// create a NEW value that incorporates your change. This is the foundation
// of React state management — every state update returns a NEW object,
// it never modifies the existing one.
//
// WHY it matters:
// - React re-renders only when it detects a NEW reference (===)
//   If you mutate an array in place, React sees the same array reference
//   and does NOT re-render. Your UI stays stale.
// - Redux, Zustand, and all state managers require immutable updates
// - Immutability makes bugs easy to find: data can't change "behind your back"
// - Spread enables the pure function pattern: same input → same output, no side effects
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// Spread is like dumping a bag of items onto a table.
// const newBag = [...oldBag, newItem]  →  dump old bag, then add new item, pack new bag.
// The old bag is unchanged. You created a new bag.
//
// Object spread is like photocopying a document and writing on the copy.
// const newConfig = { ...oldConfig, darkMode: true }
// You get all the old settings in a new object, with your override on top.
// The original config object is never touched.
//
// Rest is the reverse: collecting loose items back into a bag.
// function log(first, ...rest) — "give me the first item, bag up everything else"
// ============================================

console.log("=== SPREAD / REST: Immutability Patterns ===\n");

// ---- PART 1: Array spread — immutable operations ----

console.log("--- PART 1: Array spread (immutable) ---\n");

const original = [1, 2, 3, 4, 5];

// ❌ MUTABLE — modifies original array
const mutated = original;
mutated.push(6);
console.log("After mutable push, original:", original); // [1,2,3,4,5,6] — SURPRISE!

const source = [10, 20, 30];

// ✅ IMMUTABLE — creates new array, source is unchanged
const withAppended  = [...source, 40];          // Add to end
const withPrepended = [0, ...source];           // Add to front
const withInserted  = [...source.slice(0, 2), 25, ...source.slice(2)]; // Insert at index 2

console.log("source (unchanged):", source);
console.log("append 40:         ", withAppended);
console.log("prepend 0:         ", withPrepended);
console.log("insert 25 at idx 2:", withInserted);

// Immutable remove by index
function removeAt(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

// Immutable update by index
function updateAt(arr, index, newValue) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

const items = ["apple", "banana", "cherry", "date"];
console.log("\nImmutable array operations:");
console.log("remove idx 1:", removeAt(items, 1));
console.log("update idx 2:", updateAt(items, 2, "grape"));
console.log("original unchanged:", items);

// Combining arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log("\nCombined:", combined);

// Shallow clone
const clone = [...source];
clone.push(99);
console.log("Clone after push:", clone, "| Source:", source); // source unchanged

// Convert string to array of chars
const chars = [..."hello"];
console.log("String spread:", chars);

// Convert Set to array (deduplication pattern)
const withDupes = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(withDupes)];
console.log("Deduplicated:", unique);

// ---- PART 2: Object spread — immutable updates ----

console.log("\n--- PART 2: Object spread (immutable) ---\n");

const userState = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  role: "viewer",
  preferences: {
    theme: "light",
    fontSize: 14,
  },
};

// ❌ MUTABLE — mutates original object (React won't re-render!)
// userState.role = "admin";  ← Never do this for React state

// ✅ IMMUTABLE — new object with override
const updatedRole = { ...userState, role: "admin" };
console.log("Updated role (new obj):", updatedRole.role);
console.log("Original role (unchanged):", userState.role);

// Later properties override earlier ones with same key
const withOverride = { a: 1, b: 2, ...{ b: 99, c: 3 } };
console.log("Override order:", withOverride); // { a: 1, b: 99, c: 3 }

// Merge multiple objects
const defaults   = { theme: "light", lang: "en", timeout: 5000 };
const userConfig = { theme: "dark", lang: "te" };
const merged = { ...defaults, ...userConfig };
console.log("Merged config:", merged);
// userConfig properties override defaults for same keys

// Add and update in one step
const withNewProp = { ...userState, role: "admin", verified: true, updatedAt: new Date().toISOString() };
console.log("Added verified:", withNewProp.verified, "| Role:", withNewProp.role);

// Remove a property (combine spread + rest destructuring)
const { email: _email, ...userWithoutEmail } = userState;
console.log("Without email:", userWithoutEmail);
// _email is discarded. userState is unchanged.

// ---- PART 3: Nested immutable updates (the tricky part) ----

console.log("\n--- PART 3: Nested immutable updates ---\n");

// ⚠️ Object spread is SHALLOW — nested objects are still shared references!
const shallow = { ...userState };
shallow.preferences.theme = "dark"; // ← MUTATES the nested object!
console.log("After shallow clone update, original theme:", userState.preferences.theme);
// "dark" — because preferences is a shared reference

// ✅ Deep immutable update — spread at EACH LEVEL you're changing
const deepUpdated = {
  ...userState,
  preferences: {
    ...userState.preferences,  // ← must spread the nested object too
    theme: "dark",
  },
};
console.log("Deep updated theme:", deepUpdated.preferences.theme);
console.log("Original still light:", userState.preferences.theme); // unchanged

// Pattern for deeply nested update:
const state = {
  users: {
    alice: { age: 30, city: "Mumbai" },
    bob:   { age: 25, city: "Delhi" },
  },
};

// Update alice's city immutably
const newState = {
  ...state,
  users: {
    ...state.users,
    alice: {
      ...state.users.alice,
      city: "Bangalore",
    },
  },
};

console.log("Alice's new city:", newState.users.alice.city);
console.log("Original state alice:", state.users.alice.city); // unchanged
console.log("Bob unchanged:", state.users.bob.city);

// ---- PART 4: Rest parameters in functions ----

console.log("\n--- PART 4: Rest parameters ---\n");

// Collect unlimited arguments into an array
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
console.log("sum(1,2,3,4,5):", sum(1, 2, 3, 4, 5));
console.log("sum():", sum()); // 0

// First N params are named, rest is collected
function logWithPrefix(prefix, timestamp, ...messages) {
  return messages.map(msg => `[${prefix}][${timestamp}] ${msg}`);
}
console.log(logWithPrefix("INFO", "12:00", "Server started", "Port 3000", "Ready"));

// Rest in destructuring (collect remaining properties)
const { id: userId, name: uName, ...profileData } = userState;
console.log("userId:", userId, "| remaining:", profileData);

// Rest in array destructuring
const [firstItem, secondItem, ...remaining] = [1, 2, 3, 4, 5];
console.log("First:", firstItem, "| Second:", secondItem, "| Rest:", remaining);

// ---- PART 5: Spread in function calls ----

console.log("\n--- PART 5: Spread in function calls ---\n");

// Spread array as individual arguments
function add3(a, b, c) { return a + b + c; }

const values = [10, 20, 30];
console.log("Spread in call:", add3(...values));
// Equivalent to: add3(10, 20, 30)

// Get max from array (Math.max doesn't take arrays)
const nums = [3, 1, 4, 1, 5, 9, 2, 6];
console.log("Max:", Math.max(...nums));
console.log("Min:", Math.min(...nums));

// Combine with DOM APIs:
// const allDivs = document.querySelectorAll('div') // NodeList, not Array
// [...allDivs].filter(el => el.classList.has('active')) // convert to array first

// ---- PART 6: 10 immutability problems ----

console.log("\n--- PART 6: 10 Immutability Problems with Solutions ---\n");

// Problem 1: Add item to cart
const cart = [{ id: 1, qty: 1 }, { id: 2, qty: 3 }];
const addToCart = (cart, item) => [...cart, item];
console.log("1. Add to cart:", addToCart(cart, { id: 3, qty: 1 }));

// Problem 2: Remove item from cart by id
const removeFromCart = (cart, id) => cart.filter(item => item.id !== id);
console.log("2. Remove from cart:", removeFromCart(cart, 1));

// Problem 3: Update quantity of item
const updateQty = (cart, id, qty) =>
  cart.map(item => item.id === id ? { ...item, qty } : item);
console.log("3. Update qty:", updateQty(cart, 1, 5));

// Problem 4: Toggle a boolean field
const toggleDone = (todo) => ({ ...todo, done: !todo.done });
const todo = { id: 1, text: "Learn spread", done: false };
console.log("4. Toggle done:", toggleDone(todo));

// Problem 5: Merge two config objects with array concatenation for lists
const config1 = { features: ["auth", "search"], debug: false };
const config2 = { features: ["analytics"], debug: true };
const mergeConfigs = (a, b) => ({ ...a, ...b, features: [...a.features, ...b.features] });
console.log("5. Merge configs:", mergeConfigs(config1, config2));

// Problem 6: Deep update nested state
const appState = { user: { name: "Bob", settings: { darkMode: false } } };
const toggleDarkMode = (state) => ({
  ...state,
  user: { ...state.user, settings: { ...state.user.settings, darkMode: !state.user.settings.darkMode } },
});
console.log("6. Toggle dark mode:", toggleDarkMode(appState).user.settings.darkMode);

// Problem 7: Move item in array (drag and drop)
function moveItem(arr, fromIndex, toIndex) {
  const item = arr[fromIndex];
  const withoutItem = removeAt(arr, fromIndex);
  return [...withoutItem.slice(0, toIndex), item, ...withoutItem.slice(toIndex)];
}
const list = ["a", "b", "c", "d", "e"];
console.log("7. Move 'd' (idx3) to idx1:", moveItem(list, 3, 1));

// Problem 8: Reorder by sorting immutably
const people = [{ name: "Zara" }, { name: "Alice" }, { name: "Mike" }];
const sortedByName = [...people].sort((a, b) => a.name.localeCompare(b.name));
console.log("8. Sorted (original unchanged):", sortedByName.map(p => p.name));
console.log("   Original:", people.map(p => p.name));

// Problem 9: Batch update — update multiple users at once
const updateUsers = (users, updates) =>
  users.map(user => ({ ...user, ...(updates[user.id] || {}) }));

const usersArr = [{ id: 1, name: "Alice", score: 80 }, { id: 2, name: "Bob", score: 70 }];
console.log("9. Batch update:", updateUsers(usersArr, { 1: { score: 95 }, 2: { score: 88 } }));

// Problem 10: Flatten one level with spread
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = [].concat(...nested);          // ES5 way with spread
const flat2 = nested.flat();                // ES2019 way
const flat3 = nested.reduce((acc, arr) => [...acc, ...arr], []); // manual spread
console.log("10. Flat:", flat3);

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. Why is object spread SHALLOW? When does this matter?
//    Answer: Spread copies own enumerable property references — it doesn't
//    recursively clone nested objects. Nested objects are still shared.
//    This matters when you update a nested property: if you only spread
//    the top level, the nested object is mutated (shared reference). Must
//    spread at EVERY level you change.
//
// 2. What is the difference between spread (...) and rest (...)?
//    Answer: Same syntax, different context.
//    Spread: IN an array literal or object literal or function call → expands.
//    Rest: IN a function parameter or destructuring → collects.
//    const [a, ...rest] = [1,2,3]  → rest collects [2,3]
//    const arr = [...[1,2,3], 4]   → spread expands [1,2,3,4]
//
// 3. Why does React require immutable state updates?
//    Answer: React's change detection uses reference equality (===).
//    If you mutate the same array/object reference, === returns true,
//    React thinks nothing changed, and skips re-render. Returning a new
//    reference forces React to detect the change and re-render.
//
// 4. Why does [...new Set(array)] deduplicate?
//    Answer: Set stores only unique values. The spread then converts the
//    Set back to an Array. Combined: deduplicate + convert in one line.
// ============================================

// ============================================
// YOUR TURN: Build an Immutable State Update Utility
// ============================================
// Build a library of utilities for immutable state operations.
// These are the functions you'd use in a React app instead of mutation.
//
// Part A — Array utilities:
//   immutablePush(arr, item)             → new array with item appended
//   immutableUnshift(arr, item)          → new array with item prepended
//   immutableRemove(arr, index)          → new array without item at index
//   immutableRemoveById(arr, id)         → new array without item where item.id === id
//   immutableUpdate(arr, index, updater) → new array with arr[index] replaced by updater(arr[index])
//   immutableUpdateById(arr, id, patch)  → new array with matching item merged with patch
//   immutableMove(arr, fromIdx, toIdx)   → new array with item moved
//   immutableToggle(arr, item)           → if item in arr: remove it; else: add it
//
// Part B — Object utilities:
//   immutableSet(obj, keyPath, value)    → set nested key by dot-path: "user.address.city"
//   immutableDelete(obj, key)            → new object without that key
//   immutableMerge(target, source)       → shallow merge (like Object.assign but returns new)
//   immutableToggleProp(obj, key)        → flip a boolean property
//
// Part C — Build a tiny state store using these utilities:
//   createStore(initialState) → returns { getState, setState, subscribe, reset }
//   setState takes a function: setState(prev => ({ ...prev, count: prev.count + 1 }))
//   subscribe(listener) → called every time state changes
//   getState() → returns current state (frozen object so you can't mutate it)
//
// Test your store with:
//   const store = createStore({ count: 0, todos: [], user: null })
//   store.subscribe(state => console.log("State:", state))
//   store.setState(prev => ({ ...prev, count: prev.count + 1 }))
//   store.setState(prev => ({ ...prev, todos: immutablePush(prev.todos, { id: 1, text: "Buy milk", done: false }) }))

// YOUR CODE HERE:

function immutablePush(arr, item) { /* YOUR CODE HERE */ }
function immutableUnshift(arr, item) { /* YOUR CODE HERE */ }
function immutableRemove(arr, index) { /* YOUR CODE HERE */ }
function immutableRemoveById(arr, id) { /* YOUR CODE HERE */ }
function immutableUpdate(arr, index, updater) { /* YOUR CODE HERE */ }
function immutableUpdateById(arr, id, patch) { /* YOUR CODE HERE */ }
function immutableMove(arr, fromIdx, toIdx) { /* YOUR CODE HERE */ }
function immutableToggle(arr, item) { /* YOUR CODE HERE */ }

function immutableSet(obj, keyPath, value) { /* YOUR CODE HERE */ }
function immutableDelete(obj, key) { /* YOUR CODE HERE */ }
function immutableMerge(target, source) { /* YOUR CODE HERE */ }
function immutableToggleProp(obj, key) { /* YOUR CODE HERE */ }

function createStore(initialState) { /* YOUR CODE HERE */ }

// ============================================
// BOSS CHALLENGE: Structural Sharing
// ============================================
// Real immutable data structures (like Immutable.js or Immer) use
// "structural sharing" — unchanged branches of the data tree are REUSED,
// not copied. This makes immutable updates O(log n) instead of O(n).
//
// Build a simple path-based updater:
//
//   const nextState = produce(state, draft => {
//     draft.user.address.city = "Bangalore"   // look like mutation
//     draft.cart.push({ id: 4, qty: 1 })      // look like mutation
//   })
//   // But state is UNCHANGED — nextState is a new object with structural sharing
//
// Your produce(base, recipe) should:
//   1. Create a "draft" proxy that records all mutations
//   2. Apply each recorded mutation to a new object tree
//   3. Reuse unchanged branches of the original (structural sharing)
//   4. Return the new root (base is untouched)
//
// SIMPLIFIED version: instead of a Proxy, use a path-collector:
//   const draft = createDraft(base)  // returns an object that records changes
//   draft.user.address.city = "Bangalore"  // records: set ["user","address","city"] = "Bangalore"
//   const result = finalize(draft, base)  // applies recorded changes immutably
//
// Hint: use a Proxy with a 'set' trap that records { path: [...], value }
//       Then replay those operations using your immutableSet utility.

function produce(base, recipe) {
  // YOUR CODE HERE
}

// Test:
const testState = { user: { name: "Alice", address: { city: "Mumbai" } }, count: 0 };
const next = produce(testState, draft => {
  draft.user.address.city = "Bangalore";
  draft.count = 5;
});

console.log("\n--- BOSS: produce ---");
console.log("Original city:", testState.user.address.city); // Mumbai (unchanged)
console.log("Next city:", next?.user?.address?.city);       // Bangalore
console.log("Next count:", next?.count);                    // 5

// ============================================
// PATTERN LEARNED: Immutability
// ============================================
// PATTERN NAME: Immutable Updates with Spread/Rest
// WHEN YOU SEE: State updates in React, Redux reducers, anything with
//               useState or useReducer, any data transformation
// CORE RULES:
//   1. Never mutate arrays:   push/pop/splice/sort MUTATE — always spread or use map/filter
//   2. Never mutate objects:  obj.key = val MUTATES — always spread: { ...obj, key: val }
//   3. Spread is SHALLOW:     nest spread at every level you change
//   4. Primitives are always immutable (numbers, strings, booleans)
//
// ARRAY IMMUTABLE CHEAT SHEET:
//   Add end:    [...arr, item]
//   Add start:  [item, ...arr]
//   Remove:     arr.filter(x => x.id !== id)
//   Update:     arr.map(x => x.id === id ? { ...x, ...patch } : x)
//   Sort:       [...arr].sort(compareFn)   ← clone first, sort mutates!
//   Slice:      arr.slice()                ← creates a copy
//
// OBJECT IMMUTABLE CHEAT SHEET:
//   Add/update: { ...obj, newKey: val }
//   Remove:     const { unwanted, ...rest } = obj  → use rest
//   Override:   { ...defaults, ...overrides }
//   Nested:     { ...obj, nested: { ...obj.nested, key: val } }
//
// REACT CONNECTION:
//   useState setter: setItems(prev => [...prev, newItem])
//   useReducer: returns new state (never mutates)
//   Immer library: write "mutable" code, get immutable output
//   Redux Toolkit uses Immer internally — you can mutate in reducers
// ============================================
