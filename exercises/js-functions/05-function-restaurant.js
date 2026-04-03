// ============================================
// INTRO: What is `this` Binding and WHY it matters
// ============================================
// In JavaScript, `this` refers to the EXECUTION CONTEXT — the object
// that is "owning" the current function call at runtime.
//
// Unlike most languages where `this` is fixed at class definition,
// in JS, `this` is determined by HOW a function is called, not WHERE
// it is written. This distinction breaks more code than any other JS concept.
//
// WHY it matters: setTimeout callbacks lose `this`. Event handlers lose `this`.
// Array method callbacks lose `this`. Understanding the 4 binding rules
// (default, implicit, explicit, new) lets you predict and control `this` always.
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// Think of a restaurant where the same script ("bring the menu") means
// different things depending on WHO says it:
//
// Chef says it    → bring MY kitchen menu (this = chef's domain)
// Waiter says it  → bring the table's menu (this = customer's table)
// A random person → bring... whose menu? (this = undefined or window)
//
// In JS:
//   obj.method()      → this = obj          (implicit binding)
//   method()          → this = undefined    (default binding, strict mode)
//   method.call(obj)  → this = obj          (explicit binding)
//   new Constructor() → this = new object   (new binding)
//   Arrow function    → this = inherited from surrounding lexical scope
// ============================================

// ============================================
// GUIDED EXERCISE: Restaurant with 3 roles
// ============================================

console.log("=== FUNCTION RESTAURANT ===\n");

// ---- THE RESTAURANT (global object simulation) ----
const restaurant = {
  name: "The JS Bistro",
  cuisine: "Modern JavaScript",
  tables: ["Table 1", "Table 2", "Table 3"],
  openTables: 2,

  // ---- CHEF: Regular function — this = the object that calls it ----
  chef: {
    name: "Chef Gordon",
    specialty: "Async Soufflé",

    // Regular function: `this` = whoever calls this method
    prepareSpecial() {
      // When called as chef.prepareSpecial(), this = chef object
      console.log(`${this.name} is preparing ${this.specialty}`);
      return `Special ready: ${this.specialty} by ${this.name}`;
    },

    // The PROBLEM: regular function inside a method loses `this`
    prepareWithTimer() {
      console.log(`Outer this.name: ${this.name}`); // "Chef Gordon" ✓
      setTimeout(function () {
        // Here, `this` is NO LONGER the chef object!
        // In strict mode: undefined. In sloppy mode: global (window/global)
        console.log(`Inner this.name (regular fn in setTimeout): ${this?.name}`); // undefined!
      }, 0);
    },

    // THE FIX option 1: Save `this` in a variable before entering callback
    prepareWithTimerFixed_v1() {
      const self = this; // Capture `this` before the callback
      setTimeout(function () {
        console.log(`Inner (self pattern): ${self.name}`); // "Chef Gordon" ✓
      }, 0);
    },

    // THE FIX option 2: Use an arrow function (inherits `this` from surrounding scope)
    prepareWithTimerFixed_v2() {
      setTimeout(() => {
        // Arrow function: `this` = the surrounding method's `this`
        console.log(`Inner (arrow fn): ${this.name}`); // "Chef Gordon" ✓
      }, 0);
    },
  },

  // ---- WAITER: Arrow function — `this` is LEXICALLY bound ----
  // Arrow functions DON'T have their own `this`. They inherit from where they were DEFINED.
  // In this case, they're defined inside the 'restaurant' object literal,
  // which is defined in the module/global scope — NOT inside a method.
  // So `this` for an arrow function here is the OUTER scope (module/global), NOT restaurant.
  waiterWrong: {
    name: "Waiter Alex",
    greet: () => {
      // `this` is NOT waiterWrong or restaurant here!
      // Arrow functions capture `this` from the point of definition.
      // At the object literal level, `this` is the outer scope (global/module).
      console.log(`Arrow `this` in object literal: ${this?.name}`); // undefined in strict mode
      return "Arrow function lost `this` in object literal context";
    },
  },

  // Arrow functions WORK correctly when defined inside a REGULAR method
  manager: {
    name: "Manager Sarah",
    team: ["Waiter Alex", "Waiter Ben", "Chef Gordon"],

    // Regular method — establishes `this` context
    introduceTeam() {
      console.log(`${this.name} managing: `);
      // Arrow callback here correctly uses `this` from introduceTeam
      this.team.forEach((member) => {
        // `this` here = manager (the surrounding method's `this`)
        console.log(`  - ${member} (managed by ${this.name})`);
      });
    },

    // WRONG: using regular function in forEach — loses `this`
    introduceTeamWrong() {
      this.team.forEach(function (member) {
        // `this` here is NOT manager — it's undefined (strict) or global
        console.log(`  - ${member} (manager: ${this?.name || "LOST!"})`);
      });
    },
  },

  // ---- CUSTOMER: Explicit binding with call/apply/bind ----
  // Sometimes you want to borrow a method from one object and use it with another
  serveCustomer(food, drink) {
    return `Serving ${this.name}: ${food} and ${drink} at ${this.tableNumber}`;
  },
};

// Test Chef
console.log("--- CHEF ---");
console.log(restaurant.chef.prepareSpecial()); // Works: this = chef
restaurant.chef.prepareWithTimer();             // Loses `this`
restaurant.chef.prepareWithTimerFixed_v1();     // Fixed with `self`
restaurant.chef.prepareWithTimerFixed_v2();     // Fixed with arrow

// Test Manager (arrow in method — works)
console.log("\n--- MANAGER ---");
restaurant.manager.introduceTeam();     // Correct: arrow closes over method's `this`
restaurant.manager.introduceTeamWrong(); // Wrong: regular fn loses `this`

// Test explicit binding (call / apply / bind)
console.log("\n--- EXPLICIT BINDING ---");
const customer1 = { name: "Customer A", tableNumber: "Table 3" };
const customer2 = { name: "Customer B", tableNumber: "Table 1" };

// call: immediately invoke with specified `this` and args
console.log(restaurant.serveCustomer.call(customer1, "Pasta", "Wine"));
console.log(restaurant.serveCustomer.call(customer2, "Steak", "Water"));

// apply: same as call but args in an array
console.log(restaurant.serveCustomer.apply(customer1, ["Risotto", "Juice"]));

// bind: returns a NEW function with `this` permanently bound — not called immediately
const serveCustomerA = restaurant.serveCustomer.bind(customer1);
console.log(serveCustomerA("Soup", "Tea")); // Calls later, `this` always = customer1

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. What are the 4 rules for determining `this`?
//    Answer:
//    1. Default: called alone → undefined (strict) or global
//    2. Implicit: obj.method() → this = obj
//    3. Explicit: fn.call(obj) / fn.apply(obj) / fn.bind(obj) → this = obj
//    4. New: new Foo() → this = the new object being created
//
// 2. Why do arrow functions NOT have their own `this`?
//    Answer: Arrow functions are designed for callbacks where you WANT
//    `this` to be inherited from the surrounding code, not reset by how
//    the callback is called. They make forEach, map, setTimeout safe.
//
// 3. What's the difference between call, apply, and bind?
//    Answer: call → invoke immediately with args listed
//            apply → invoke immediately with args in array
//            bind → return new function with `this` baked in, don't call yet
//
// 4. Why does `this` break inside setTimeout with a regular function?
//    Answer: setTimeout calls your callback as a plain function (not as obj.method()).
//    That triggers Default binding → `this` = undefined or global.
// ============================================

// ============================================
// YOUR TURN: Build a classroom with the same patterns
// ============================================
// Build a `classroom` object with:
//
// teacher (regular function methods):
//   name, subject
//   teach()         → logs "Teacher [name] is teaching [subject]"
//   teachWithTimer()         → BREAKS (show the bug with regular fn in setTimeout)
//   teachWithTimerFixed()    → FIXED (use arrow function)
//
// teacherAssistant (arrow function — show the limitation):
//   name
//   assist: arrow fn → show that `this.name` is undefined here
//
// principal (demonstrate forEach with regular vs arrow):
//   name
//   staff: ["Teacher A", "Teacher B", "TA C"]
//   listStaffCorrect()  → uses arrow in forEach → logs all with principal.name
//   listStaffWrong()    → uses regular fn in forEach → loses `this`
//
// exam (demonstrate call/apply/bind):
//   grade(student, score) → "Grading [student.name]: [score]"
//   Use .call(), .apply(), and .bind() with two different student objects

const classroom = {
  // YOUR CODE HERE
};

console.log("\n=== YOUR TURN: Classroom ===\n");
// Add tests below:

// ============================================
// BOSS CHALLENGE: Build a `this`-safe Event System
// ============================================
// Build an EventEmitter class using regular functions (no class syntax yet) that:
// - Has private listeners Map (closure)
// - on(event, handler) — register a handler for an event
// - off(event, handler) — remove a specific handler
// - emit(event, data) — call all handlers for event
// - once(event, handler) — handler auto-removes after first call
//
// CRITICAL: Ensure `this` inside handlers refers to the EventEmitter itself,
// not the calling context. Use .call(this, ...) or bind() in emit().
//
// Test:
//   const emitter = createEventEmitter();
//   emitter.on("login", (data) => console.log("Logged in:", data.user));
//   emitter.once("start", () => console.log("Started! (fires once)"));
//   emitter.emit("login", { user: "Dinesh" });   // fires
//   emitter.emit("start");                        // fires once
//   emitter.emit("start");                        // does NOT fire again

function createEventEmitter() {
  // YOUR CODE HERE
}

console.log("\n=== BOSS CHALLENGE: EventEmitter ===\n");
const emitter = createEventEmitter();
emitter.on("login", (data) => console.log("Logged in:", data?.user));
emitter.once("start", () => console.log("Started! (fires once)"));
emitter.emit("login", { user: "Dinesh" });
emitter.emit("start");
emitter.emit("start"); // Should NOT fire

// ============================================
// PATTERN LEARNED: this Binding
// ============================================
// PATTERN NAME: Arrow Function for Callbacks, Regular Functions for Methods
// WHEN YOU SEE: A function passed as a callback (setTimeout, forEach, addEventListener)
//               that needs access to an outer object's `this`
// USE THIS: Arrow function → it inherits `this` from the method that contains it
//
// DECISION TREE for choosing function type:
//   Defining an object method?        → Regular function (implicit binding works)
//   Callback inside a method?         → Arrow function (inherits method's `this`)
//   Need to reuse with different obj? → Regular fn + .call()/.apply()/.bind()
//   Want `this` locked permanently?   → .bind() → store as new variable
//
// NEVER use arrow functions as:
//   - Object methods (they won't have `this` = the object)
//   - Constructors (can't use with `new`)
//   - Functions that need their own `arguments` object
// ============================================
