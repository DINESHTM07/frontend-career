// ============================================
// INTRO: What is Hoisting and WHY it matters
// ============================================
// JavaScript is compiled before it runs. During compilation, the engine
// "hoists" (moves to the top) declarations of variables and functions.
// But NOT their values — only the declaration.
//
// WHY it matters: Code that looks like it should crash runs fine, and
// code that looks fine crashes in unexpected ways. Understanding hoisting
// is essential for reading other people's code and debugging subtle bugs.
// It also explains WHY modern JS prefers const/let over var.
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// Think of hoisting like a two-pass reading system:
//
// PASS 1 (Compile): JS scans the entire file, writes down all
//   declarations (var names, function names) at the top of their scope.
//   var → written as: var x = undefined
//   function → written as: the ENTIRE function definition
//   let/const → written BUT locked in the "Temporal Dead Zone" (TDZ)
//
// PASS 2 (Execute): JS runs the code top to bottom, line by line.
//   Assignments happen here. var already exists (as undefined).
//   let/const unlock when the declaration line is reached.
//
// Analogy: A teacher reads the whole exam before starting.
//   She writes "I know about variable x" (var → undefined).
//   She writes the whole answer for functions (full definition).
//   She knows let/const exist but won't let students use them early.
// ============================================

// ============================================
// GUIDED EXERCISE: The Hoisting Rules
// ============================================

console.log("=== HOISTING RULES ===\n");

// RULE 1: var is hoisted and initialized as undefined
console.log("--- RULE 1: var hoisting ---");
console.log("Before declaration:", hoistedVar); // undefined — NOT a crash
var hoistedVar = "I exist now";
console.log("After declaration:", hoistedVar);  // "I exist now"

// What JS actually sees:
// var hoistedVar = undefined;  ← hoisted
// console.log(hoistedVar);     → undefined
// hoistedVar = "I exist now";
// console.log(hoistedVar);     → "I exist now"

// RULE 2: let and const are hoisted but stay in the Temporal Dead Zone (TDZ)
console.log("\n--- RULE 2: let/const TDZ ---");
try {
  console.log("Before let declaration:", letVariable); // ReferenceError!
} catch (e) {
  console.log("Caught expected error:", e.message);
  // "Cannot access 'letVariable' before initialization"
}
let letVariable = "I exist now";
console.log("After let declaration:", letVariable);

// RULE 3: Function DECLARATIONS are fully hoisted (including body)
console.log("\n--- RULE 3: Function declarations fully hoisted ---");
console.log("Calling before declaration:", sayHello()); // Works perfectly!

function sayHello() {
  return "Hello! I was hoisted with my full body.";
}

// RULE 4: Function EXPRESSIONS are NOT fully hoisted (only the var is)
console.log("\n--- RULE 4: Function expressions are NOT fully hoisted ---");
try {
  console.log(greet()); // TypeError: greet is not a function
} catch (e) {
  console.log("Caught expected error:", e.message);
  // Because var greet = undefined at this point — calling undefined()
}
var greet = function () {
  return "I am a function expression";
};
console.log("After declaration:", greet());

// RULE 5: Functions hoist OVER vars with the same name
console.log("\n--- RULE 5: Function wins over var with same name ---");
console.log(typeof conflict); // "function" — not undefined
var conflict = "I am a var";
function conflict() {
  return "I am a function";
}
// After both are processed: conflict = "I am a var" (assignment overwrites)
console.log(typeof conflict); // "string" — after assignment

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. What is the Temporal Dead Zone?
//    Answer: The period between when let/const are hoisted and when their
//    declaration line is reached. Accessing them in this zone throws ReferenceError.
//
// 2. What's the difference between:
//      function foo() {}  and  var foo = function() {}  ?
//    Answer: Declarations are fully hoisted. Expressions: only the var is hoisted
//    (as undefined). The function body is NOT available before the line runs.
//
// 3. What does this log?
//      console.log(x);
//      var x = 5;
//    Answer: undefined (not ReferenceError, not 5)
//
// 4. What does this log?
//      console.log(y);
//      let y = 5;
//    Answer: ReferenceError — y is in the TDZ
// ============================================

// ============================================
// GUIDED: 10 Predict-the-Output Puzzles
// ============================================
// For each puzzle: write your prediction BEFORE looking at the answer.
// Run the file to verify.

console.log("\n=== 10 PREDICT-THE-OUTPUT PUZZLES ===\n");

// Puzzle 1
console.log("--- Puzzle 1 ---");
var a = 1;
function outer1() {
  console.log(a); // PREDICT: ___
  var a = 2;
  console.log(a); // PREDICT: ___
}
outer1();
// ANSWER: undefined, then 2
// WHY: 'var a' inside outer1 is hoisted to top of outer1, shadowing the outer a.
// When console.log(a) runs, inner 'a' exists but = undefined.

// Puzzle 2
console.log("\n--- Puzzle 2 ---");
function puzzle2() {
  console.log(typeof b); // PREDICT: ___
  console.log(typeof c); // PREDICT: ___
  var b = 10;
}
puzzle2();
// ANSWER: "undefined", "undefined"
// WHY: var b is hoisted. typeof c — c doesn't exist anywhere, but typeof
// on an undeclared variable returns "undefined" instead of throwing.

// Puzzle 3
console.log("\n--- Puzzle 3 ---");
var result3 = getValue();
function getValue() {
  return "got it";
}
console.log(result3); // PREDICT: ___
// ANSWER: "got it"
// WHY: Function declarations are fully hoisted — getValue is available at call time.

// Puzzle 4
console.log("\n--- Puzzle 4 ---");
var x4 = "global";
function puzzle4() {
  var x4 = "local";
  return function () {
    console.log(x4); // PREDICT: ___
  };
}
puzzle4()();
// ANSWER: "local"
// WHY: Inner function closes over the local x4. Hoisting doesn't cross into closure.

// Puzzle 5
console.log("\n--- Puzzle 5 ---");
for (var i5 = 0; i5 < 3; i5++) {
  setTimeout(() => console.log("Puzzle 5:", i5), 0); // PREDICT: ___
}
// ANSWER: 3, 3, 3 (not 0, 1, 2)
// WHY: var i5 is hoisted to function scope. By the time setTimeout fires,
// the loop is done and i5 = 3. All callbacks share the same i5.

// Puzzle 6
console.log("\n--- Puzzle 6 ---");
for (let i6 = 0; i6 < 3; i6++) {
  setTimeout(() => console.log("Puzzle 6:", i6), 0); // PREDICT: ___
}
// ANSWER: 0, 1, 2
// WHY: let is block-scoped — each iteration gets its OWN i6.
// The classic fix for the var-in-loop problem.

// Puzzle 7
console.log("\n--- Puzzle 7 ---");
function puzzle7() {
  if (true) {
    var blockVar = "I'm var";
    let blockLet = "I'm let";
  }
  console.log(blockVar); // PREDICT: ___
  try {
    console.log(blockLet); // PREDICT: ___
  } catch (e) {
    console.log("blockLet error:", e.message);
  }
}
puzzle7();
// ANSWER: "I'm var", then ReferenceError
// WHY: var leaks out of blocks (if, for, while). let stays in the block.

// Puzzle 8
console.log("\n--- Puzzle 8 ---");
var double = function (x) {
  return x * 2;
};
var double = function (x) {
  return x * 200; // Different!
};
console.log(double(5)); // PREDICT: ___
// ANSWER: 1000
// WHY: var allows re-declaration. Second assignment overwrites first.
// With const, this would be a SyntaxError.

// Puzzle 9
console.log("\n--- Puzzle 9 ---");
function puzzle9() {
  function inner() {
    return "first";
  }
  function inner() {
    return "second";
  }
  return inner();
}
console.log(puzzle9()); // PREDICT: ___
// ANSWER: "second"
// WHY: Both declarations are hoisted, but the second one overwrites the first.

// Puzzle 10
console.log("\n--- Puzzle 10 ---");
let p10 = "outer";
{
  try {
    console.log(p10); // PREDICT: ___
  } catch (e) {
    console.log("Error:", e.message);
  }
  let p10 = "inner";
  console.log(p10); // PREDICT: ___
}
// ANSWER: ReferenceError, then "inner"
// WHY: The inner let p10 is hoisted to the top of the block, putting
// the outer p10 in shadow — but the inner is in TDZ until its declaration line.
// So even though outer p10 exists, the inner's TDZ blocks access.

// ============================================
// YOUR TURN: Create 5 tricky hoisting scenarios
// ============================================
// Write 5 code snippets that produce SURPRISING output due to hoisting.
// For each one:
//   1. Write the code
//   2. Add a "// PREDICT: ___" comment at each console.log
//   3. Add a "// ANSWER: ..." comment with the real output
//   4. Add a "// WHY: ..." comment explaining the hoisting rule
//
// REQUIREMENTS:
//   - At least one must use var inside a for-loop with setTimeout
//   - At least one must involve a function declaration vs expression
//   - At least one must involve the TDZ with let inside a block
//   - At least two must be ones you INVENTED (not variations of above)
//
// Write your 5 scenarios below:

// Scenario A:
// YOUR CODE HERE

// Scenario B:
// YOUR CODE HERE

// Scenario C:
// YOUR CODE HERE

// Scenario D:
// YOUR CODE HERE

// Scenario E:
// YOUR CODE HERE

// ============================================
// BOSS CHALLENGE: Explain and fix the bugs
// ============================================
// Each block below has a hoisting-related bug. Two tasks:
// 1. Add a comment explaining WHY it's broken
// 2. Rewrite the fixed version below it

// Bug 1: The counter bug
var counter = 0;
function incrementCounter() {
  counter++; // WHY MIGHT THIS BE BROKEN? ___
  var counter = 0;
  return counter;
}
// Explain: ___
// Fix:
function incrementCounterFixed() {
  // YOUR CODE HERE
}

// Bug 2: The factory bug
function makeAdders(nums) {
  var adders = [];
  for (var i = 0; i < nums.length; i++) {
    adders.push(function (x) {
      return x + nums[i]; // WHY IS THIS BROKEN? ___
    });
  }
  return adders;
}
var add = makeAdders([1, 2, 3]);
console.log("\n--- Boss: makeAdders ---");
console.log(add[0](10)); // Expect 11, but gets: ___
console.log(add[1](10)); // Expect 12, but gets: ___
// Explain: ___
// Fix:
function makeAddersFixed(nums) {
  // YOUR CODE HERE
}

// Bug 3: The initialization bug
function loadConfig() {
  console.log("Config:", config); // WHY IS THIS BROKEN? ___
  const config = { debug: true };
  return config;
}
// Explain: ___
// Fix:
function loadConfigFixed() {
  // YOUR CODE HERE
}

// ============================================
// PATTERN LEARNED: Hoisting Rules
// ============================================
// PATTERN NAME: Declaration-Before-Use
// WHEN YOU SEE: var declarations, for-loop closures, function-before-call
// USE THIS: Declare everything at the TOP of its scope. Use let/const instead of var.
//
// HOISTING CHEAT SHEET:
//   var           → hoisted as undefined (survives blocks, leaks out)
//   let / const   → hoisted but TDZ (block-scoped, safer)
//   function foo()→ fully hoisted (body AND name, use before declaration is OK)
//   var foo = fn  → only var hoisted (foo = undefined until assignment)
//
// THE for-loop closure bug:
//   var + setTimeout → all callbacks share ONE variable (use let or IIFE)
//   let + setTimeout → each iteration gets its OWN binding
//
// RULE: Always declare before you use. Use const by default, let when you need
//       to reassign, never var in modern code.
// ============================================
