// ============================================
// INTRO: What is Comparison and WHY it matters
// ============================================
// JavaScript has two equality operators: == (loose) and === (strict).
// == performs TYPE COERCION — it converts values before comparing.
// === does NOT coerce — both value AND type must match.
//
// WHY it matters: == is the #1 source of "impossible bugs" in JS.
// Code works in testing but fails on edge cases because of silent coercions.
// Every experienced JS developer uses === by default and knows EXACTLY
// when and why == would behave differently.
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// === is like a strict bouncer: "Your name AND your face must match the list."
// == is like a lazy bouncer: "Close enough? You're in."
//
// The lazy bouncer (==) follows complex rules to convert types before comparing:
//   - null == undefined  (these two are "close enough" to the lazy bouncer)
//   - "5" == 5           (string gets converted to number first)
//   - false == 0         (boolean converted to number: false → 0)
//   - [] == false        (array → string → number, boolean → number)
//   - "" == false        (empty string → 0, false → 0... they match!)
//
// The strict bouncer (===) checks everything: no shortcuts, no coercion.
// ============================================

// ============================================
// GUIDED EXERCISE: Predict the output, then run it
// ============================================
// For each comparison below:
//   1. READ the comparison
//   2. Write your prediction in a comment
//   3. Run the file and check if you were right

console.log("=== LIE DETECTOR: Where == and === disagree ===\n");

// Round 1: Numbers vs Strings
// Your prediction: ___
console.log('Case 1:  "5" == 5    →', "5" == 5);
// Your prediction: ___
console.log('Case 2:  "5" === 5   →', "5" === 5);
// Why: == converts string "5" to number 5, then compares. === sees different types → false.

// Round 2: Booleans
// Your prediction: ___
console.log('Case 3:  true == 1   →', true == 1);
// Your prediction: ___
console.log('Case 4:  false == 0  →', false == 0);
// Your prediction: ___
console.log('Case 5:  true == "1" →', true == "1");
// Why: booleans are converted to numbers (true→1, false→0), then the other side is also converted.

// Round 3: null and undefined — the sneaky pair
// Your prediction: ___
console.log('Case 6:  null == undefined →', null == undefined);
// Your prediction: ___
console.log('Case 7:  null === undefined →', null === undefined);
// Your prediction: ___
console.log('Case 8:  null == 0         →', null == 0);
// Your prediction: ___
console.log('Case 9:  null == false     →', null == false);
// Why: null ONLY equals undefined (and itself) with ==. It doesn't coerce to 0 or false.

// Round 4: Objects, arrays, and empty string
// Your prediction: ___
console.log('Case 10: [] == false       →', [] == false);
// Your prediction: ___
console.log('Case 11: "" == false       →', "" == false);
// Your prediction: ___
console.log('Case 12: [] == ""          →', [] == "");
// Your prediction: ___
console.log('Case 13: [] == 0           →', [] == 0);
// Why: [] → "" (toString), then "" → 0 (Number), false → 0. All become 0.

// Round 5: NaN — the number that isn't equal to itself
// Your prediction: ___
console.log('Case 14: NaN == NaN        →', NaN == NaN);
// Your prediction: ___
console.log('Case 15: NaN === NaN       →', NaN === NaN);
// Your prediction: ___
console.log('Case 16: isNaN(NaN)        →', isNaN(NaN));
// Why: NaN is the ONLY value in JS not equal to itself. Use isNaN() or Number.isNaN().

// Round 6: Object reference equality
const obj1 = { name: "Dinesh" };
const obj2 = { name: "Dinesh" };
const obj3 = obj1;

// Your prediction: ___
console.log("Case 17: obj1 == obj2      →", obj1 == obj2);
// Your prediction: ___
console.log("Case 18: obj1 === obj2     →", obj1 === obj2);
// Your prediction: ___
console.log("Case 19: obj1 === obj3     →", obj1 === obj3);
// Why: objects compare by REFERENCE (memory address), not by value.
// obj1 and obj2 are different boxes even though they look the same inside.

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. What does == do that === does not?
//    Answer: Type coercion — it converts operands to a common type before comparing
//
// 2. When is it actually OK to use ==?
//    Answer: Only one legitimate use case: null == undefined (catches both at once)
//    Example: if (value == null) { } // catches both null and undefined
//
// 3. Why is NaN !== NaN?
//    Answer: NaN represents an invalid numeric computation. Two invalid results
//    aren't necessarily the same invalid result. Use Number.isNaN() instead.
//
// 4. How do you compare two objects by their contents (not reference)?
//    Answer: JSON.stringify(obj1) === JSON.stringify(obj2) for simple objects,
//            or a deep-equal library like lodash's _.isEqual() for complex ones.
// ============================================

// ============================================
// YOUR TURN: Build a coercion quiz game
// ============================================
// Build a function called coercionQuiz() that:
// 1. Has an array of quiz questions. Each question is: { a, b, expected }
//    where expected is what (a == b) actually returns.
// 2. Shows the question: 'Does "5" == 5 ?'
// 3. Reveals the answer and a brief explanation of WHY
// 4. Tracks score: how many the user gets right (simulate by having the
//    user's "guesses" hardcoded as a separate array, then compare)
//
// STRUCTURE:
//   const questions = [
//     { a: "5",    b: 5,     expected: true,  why: "string coerced to number" },
//     { a: false,  b: 0,     expected: true,  why: "boolean false → 0" },
//     { a: null,   b: false, expected: false, why: "null only == undefined" },
//     // add 5 more of your own
//   ];
//
//   const userGuesses = [true, true, false, ...]; // simulate user input
//
//   function runQuiz(questions, userGuesses) { ... }
//   runQuiz(questions, userGuesses);

const questions = [
  { a: "5",    b: 5,         expected: true,  why: "string coerced to number before comparing" },
  { a: false,  b: 0,         expected: true,  why: "boolean false converts to number 0" },
  { a: null,   b: false,     expected: false, why: "null only loosely equals undefined, not false" },
  { a: null,   b: undefined, expected: true,  why: "null and undefined are the only == pair across types" },
  { a: "",     b: false,     expected: true,  why: "empty string → 0, false → 0, so both become 0" },
  { a: [],     b: 0,         expected: true,  why: "[] → '' → 0, 0 is 0" },
  { a: NaN,    b: NaN,       expected: false, why: "NaN is never equal to anything, not even itself" },
  // Add 3 more question objects here
];

const userGuesses = [true, true, false, true, true, true, false];
// ^ Change these to simulate different answers

function runQuiz(questions, userGuesses) {
  // YOUR CODE HERE
  // For each question:
  //   - Print the question: `Does ${a} == ${b}?`
  //   - Print if guess was correct
  //   - Print the explanation (why)
  // At the end, print: "Score: X / Y"
}

console.log("\n=== COERCION QUIZ ===");
runQuiz(questions, userGuesses);

// ============================================
// BOSS CHALLENGE: Build a safe equality checker library
// ============================================
// Build an object called SafeEquals with these methods:
//
//   SafeEquals.values(a, b)
//     → true only if same type AND same value (like ===)
//     → handles NaN correctly (NaN should equal NaN here, unlike ===)
//     → handles +0 and -0 correctly (they should NOT be equal)
//
//   SafeEquals.deep(a, b)
//     → compares objects/arrays by their CONTENTS recursively
//     → { a: 1 } deep-equals { a: 1 } → true
//     → [1, [2, 3]] deep-equals [1, [2, 3]] → true
//     → does NOT use JSON.stringify (handle circular refs gracefully by returning false)
//
//   SafeEquals.nullable(a, b)
//     → treats null and undefined as the same (the ONE valid use of ==)
//     → SafeEquals.nullable(null, undefined) → true
//     → SafeEquals.nullable(null, 0)         → false
//     → everything else uses ===

const SafeEquals = {
  values(a, b) {
    // YOUR CODE HERE
  },

  deep(a, b) {
    // YOUR CODE HERE
    // HINT: If both are arrays → check lengths, recurse on each element
    //       If both are objects → check keys, recurse on each value
    //       Otherwise → use this.values()
  },

  nullable(a, b) {
    // YOUR CODE HERE
  },
};

console.log("\n=== BOSS CHALLENGE: SafeEquals ===");
console.log(SafeEquals.values(NaN, NaN));            // true (unlike ===)
console.log(SafeEquals.values(+0, -0));              // false (unlike ===)
console.log(SafeEquals.values(1, "1"));              // false
console.log(SafeEquals.deep({ a: 1 }, { a: 1 }));   // true
console.log(SafeEquals.deep([1, [2]], [1, [2]]));    // true
console.log(SafeEquals.deep({ a: 1 }, { a: 2 }));   // false
console.log(SafeEquals.nullable(null, undefined));   // true
console.log(SafeEquals.nullable(null, 0));           // false

// ============================================
// PATTERN LEARNED: Comparison
// ============================================
// PATTERN NAME: Strict Equality Default
// WHEN YOU SEE: Any comparison between two values
// USE THIS: Always === unless you have a specific reason for ==
//
// The ONE exception where == is acceptable:
//   if (value == null) { }  →  catches both null and undefined
//
// For objects/arrays: never use == or ===. Use:
//   - JSON.stringify() for simple objects
//   - SafeEquals.deep() or lodash _.isEqual() for nested structures
//
// For NaN: never use === or ==. Use:
//   - Number.isNaN(value)  (strict: only true for actual NaN)
//   - isNaN(value)         (loose: coerces first — can cause false positives)
// ============================================
