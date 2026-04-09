# Day 76 — JS Interview Questions: Practice Out Loud

**Status:** 📋 READY TO START
**Week:** 12 | **Theme:** Interview Preparation

---

## Today's Goal

Work through 60 JavaScript interview questions using the only method that works: read the question, close the file, explain the answer out loud, then compare. By end of today, JS fundamentals feel like muscle memory — not something you have to think hard about.

By end of today:
- 60 JS questions practiced out loud
- Questions you struggled with marked and noted
- Weak spots identified for review tomorrow
- 3 DSA problems solved

---

## What to Open

1. `interview-vault/01-js-interview.md`

---

## The Method — Do This for EVERY Question

1. Read the question
2. **Close the file** (minimize it, or cover the screen)
3. Answer out loud — speak for at least 30 seconds
4. Open the file — compare your answer to the reference
5. Mark the question: ✅ (nailed it) / ⚠️ (partial) / ❌ (missed it)
6. For ❌ questions: read the correct answer out loud twice, then close and say it again

**Why out loud?** Because reading and understanding are not the same as explaining. Interviews test your ability to explain — not read. Every minute of silent study is worth less than 30 seconds of speaking practice.

---

## Morning (8:00 – 11:00 AM) — Questions 1-20: Event Loop, Closures, `this`, Prototypes

### Event Loop Questions (1-6)

These appear in almost every JS interview. Know them cold.

**Key answers to have ready:**

**"What is the event loop?"**
> JavaScript is single-threaded — it executes one piece of code at a time. The event loop is the mechanism that allows async operations to happen without blocking. When you call `setTimeout` or `fetch`, the operation is handed off to the browser's Web APIs. When it completes, the callback is placed in the task queue (or microtask queue for Promises). The event loop continuously checks: is the call stack empty? If yes, take the next item from the queue and push it onto the stack.

**"What is the difference between the microtask queue and the task queue?"**
> Microtasks (Promises, `queueMicrotask`) run after every task but before the browser renders or picks up the next task. So Promise callbacks always run before `setTimeout` callbacks, even if the `setTimeout` delay is 0. Order: current call stack → all microtasks → one task → render → repeat.

**"What will this print?"**
```js
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('4')
// Answer: 1, 4, 3, 2
// Why: synchronous first (1, 4), then microtask queue (3), then task queue (2)
```

**Closures Questions (7-11)**

**"What is a closure?"**
> A closure is when a function remembers the variables from its outer (enclosing) scope even after the outer function has returned. Every function in JavaScript is a closure. The classic example: a factory function that returns a function — the returned function still has access to the factory's variables.

```js
function makeCounter() {
  let count = 0
  return function() {
    count++
    return count
  }
}
const counter = makeCounter()
counter() // 1
counter() // 2 — 'count' is remembered between calls
```

**"What is the classic closure-in-loop bug?"**
```js
// Bug: all callbacks log 3 (not 0, 1, 2)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}

// Fix 1: use 'let' (block-scoped, creates new binding per iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}

// Fix 2: IIFE (creates a new scope per iteration)
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 0)
  })(i)
}
```

**`this` Questions (12-16)**

**"What does `this` refer to in different contexts?"**
> - In a method: `this` is the object the method belongs to
> - In a regular function (non-strict): `this` is the global object (`window`)
> - In a regular function (strict mode): `this` is `undefined`
> - In an arrow function: `this` is inherited from the enclosing scope (lexical `this`)
> - In a class constructor: `this` is the new object being created

**"What is the difference between `call`, `apply`, and `bind`?"**
> All three set the value of `this` explicitly.
> - `call(thisArg, arg1, arg2)` — calls the function immediately, args as comma-separated list
> - `apply(thisArg, [arg1, arg2])` — calls the function immediately, args as an array
> - `bind(thisArg, arg1)` — returns a NEW function with `this` permanently bound, doesn't call immediately

**Prototype Questions (17-20)**

**"What is the prototype chain?"**
> Every JavaScript object has a `__proto__` property pointing to its prototype object. When you access a property on an object, JS looks at the object itself first. If not found, it goes up the prototype chain until it finds it or reaches `null`. This is how methods like `.map()` and `.toString()` are available on all arrays and objects — they're defined on `Array.prototype` and `Object.prototype`.

**"What is the difference between `__proto__` and `prototype`?"**
> `prototype` is a property on constructor functions (and classes). It's the object that becomes the `__proto__` of instances created by `new`. `__proto__` is the actual prototype link on any object. They refer to the same object: `Array.prototype === [1,2,3].__proto__`.

---

## Midday (11:20 AM – 1:30 PM) — Questions 21-40: Promises, ES6+, DOM

### Promises Questions (21-28)

**"What is a Promise?"**
> A Promise is an object representing a future value. It's in one of three states: pending, fulfilled (resolved), or rejected. You handle the result with `.then()` for success and `.catch()` for errors. Promises solve "callback hell" — deeply nested callbacks become flat chains.

**"What is the difference between `Promise.all`, `Promise.allSettled`, `Promise.any`, and `Promise.race`?"**
> - `Promise.all([...])` — waits for ALL to resolve. Rejects immediately if ANY rejects.
> - `Promise.allSettled([...])` — waits for ALL to finish (resolve OR reject). Never rejects — gives you the status of each.
> - `Promise.any([...])` — resolves as soon as ANY resolves. Rejects only if ALL reject.
> - `Promise.race([...])` — resolves or rejects as soon as the FIRST one settles (either way).

**"What is `async/await`?"**
> Syntactic sugar over Promises. `async` marks a function as returning a Promise. `await` pauses execution inside the function until the Promise resolves — but only inside that function, not globally. Error handling: `try/catch` works with `await` exactly like synchronous code.

### ES6+ Questions (29-35)

Cover: `let`/`const` vs `var`, arrow functions, destructuring, spread/rest, template literals, optional chaining (`?.`), nullish coalescing (`??`), modules (`import`/`export`).

**"What is the difference between `let`, `const`, and `var`?"**
> - `var`: function-scoped, hoisted (initialized as `undefined`), can be redeclared
> - `let`: block-scoped, hoisted but not initialized (temporal dead zone), cannot be redeclared
> - `const`: block-scoped, must be initialized at declaration, cannot be reassigned (but objects and arrays it points to can be mutated)

### DOM Questions (36-40)

**"What is event delegation?"**
> Instead of attaching an event listener to each child element, you attach one listener to the parent. Events bubble up — so a click on a child will reach the parent. You check `event.target` to determine which child was clicked. Benefits: fewer event listeners (better performance), handles dynamically added elements automatically.

---

## Afternoon (1:30 – 3:30 PM) — Questions 41-60 + DSA

### Questions 41-60: Error Handling, Type Coercion, Misc

Work through the remaining 20 questions from `interview-vault/01-js-interview.md`.

Key topics in this section:
- `try/catch/finally` — `finally` always runs
- Type coercion: `==` vs `===`, `+` operator with strings, `Boolean()` falsy values
- `typeof null === 'object'` — the famous bug
- `NaN !== NaN` — use `Number.isNaN()`
- Hoisting: function declarations are fully hoisted, `var` is hoisted but undefined

### DSA (3 Problems)

Create `day-76-dsa.js`. Solve 3 problems — pick from whichever pattern was weakest in Week 11.

---

## Scoring Your Day

At the end, count your marks:
- ✅ count: ___
- ⚠️ count: ___
- ❌ count: ___

Any question marked ❌ goes on your "must review" list. You will hit these again tomorrow.

---

## End of Day Checklist

- [ ] Opened `interview-vault/01-js-interview.md`
- [ ] Questions 1-20: read, closed, explained out loud, marked — Event Loop, Closures, `this`, Prototypes
- [ ] Questions 21-40: read, closed, explained out loud, marked — Promises, ES6+, DOM
- [ ] Questions 41-60: read, closed, explained out loud, marked — Error handling, Coercion, Misc
- [ ] All ❌ questions: re-read correct answer + said it out loud
- [ ] ❌ count recorded — these questions get extra attention tomorrow
- [ ] 3 DSA problems solved in `day-76-dsa.js`

---

*You have read these answers before. But you've never had to say them out loud without notes. That is a completely different skill. Today you practice the actual skill.*
