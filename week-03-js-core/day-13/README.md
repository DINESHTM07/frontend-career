# Day 13 — Variables, Data Types & Operators

**Status:** 📋 READY TO START
**Week:** 3 | **Theme:** JavaScript Core

---

## What You'll Learn Today

Today is Day 1 of JavaScript. You're not just memorizing syntax — you're building the mental model of how JavaScript *thinks about data*. By end of day you'll understand:

- How JavaScript stores information (variables: `var`, `let`, `const`)
- What *kinds* of data exist (strings, numbers, booleans, null, undefined, objects, arrays)
- How to do math, compare values, and combine logic with operators

This is the foundation everything else sits on. Take it slow and type every example.

---

## Files to Open Today

Open these in order. Keep cheatsheets on the **left half** of your screen, your practice file on the **right half**.

1. **This README** — read it fully first
2. `cheatsheets/js/01-variables.md` — open left panel
3. `cheatsheets/js/02-data-types.md` — open left panel (swap when done with variables)
4. `cheatsheets/js/03-operators.md` — open left panel (swap when done with data types)
5. `exercises/js-basics/01-shapeshifter.js` — midday
6. `exercises/js-basics/02-lie-detector.js` — midday

---

## How to Open a Split Screen in Cursor

1. Open your file normally
2. Right-click the tab at the top → **"Split Right"**
3. Now you have two panels — cheatsheet on left, code on right

---

## How to Run JavaScript Files

Every time you write code today, run it like this:

1. Open the terminal: press **Ctrl + `** (backtick — the key above Tab)
2. Type: `node filename.js` and press Enter
3. You'll see output printed below

Example:
```
node day-13-practice.js
```

If you see an error — **that's good**. Read the error message. It tells you exactly what went wrong and what line.

---

## Morning (8:00 – 11:00 AM) — Read + Type + Break Things

### Step 1: Create your practice file

In this folder (`week-03-js-core/day-13/`), create a new file called `day-13-practice.js`.

You can do this in Cursor:
- Right-click the `day-13` folder in the sidebar → **New File** → type `day-13-practice.js`

### Step 2: Work through the cheatsheets

Open `cheatsheets/js/01-variables.md`. For **every single code example** you see:

1. **Type it yourself** in `day-13-practice.js` — do NOT copy-paste. Typing builds muscle memory.
2. Run it: `node day-13-practice.js`
3. Read the output. Does it match what you expected?
4. **Modify it** — change a value, rename a variable, try something you're curious about
5. **Break it** — delete a semicolon, misspell `const`, see what error you get
6. **Fix it** — get it back to working

Then move on to `02-data-types.md`, then `03-operators.md`.

### Things to pay special attention to:

**In variables.md:**
- Why `const` is preferred over `let` for things that don't change
- Why `var` is mostly avoided in modern JS
- What "block scope" means (hint: `{}` curly braces create a new scope)

**In data-types.md:**
- The difference between `null` and `undefined` (they feel similar but mean different things)
- That `typeof null` returns `"object"` — this is a famous JS bug that was never fixed
- Arrays and objects are *reference types* — they behave differently than strings/numbers

**In operators.md:**
- `==` vs `===` — always use `===` in real code (strict equality)
- Truthy and falsy values — `0`, `""`, `null`, `undefined`, `NaN` are all falsy
- Short-circuit evaluation: `a || b` returns `a` if `a` is truthy, otherwise `b`

---

## Mid-Morning Break (11:00 – 11:20 AM)

Get up, stretch, drink water. Your brain needs it.

---

## Midday (11:20 AM – 1:00 PM) — Exercises

### Exercise 1: `exercises/js-basics/01-shapeshifter.js`

Open this file. Read the top comment block first — it explains the pattern.

The exercises follow this structure every time:
- **INTRO** — what you're building and why
- **GUIDED** — partially written code with hints, you fill in the blanks
- **YOUR TURN** — write it yourself with less guidance
- **BOSS CHALLENGE** — harder version, stretch yourself

Work through each section. Don't skip ahead. The GUIDED section is there because seeing the shape of the solution first helps your brain pattern-match.

When stuck, re-read the relevant cheatsheet section before Googling. Try to stay in the cheatsheets for now.

### Exercise 2: `exercises/js-basics/02-lie-detector.js`

Same approach. This one focuses on comparison operators and booleans. Take your time with the logic operators section.

---

## Lunch (1:00 – 2:00 PM)

Eat away from your screen. Let your brain consolidate what you learned.

---

## Afternoon (2:00 – 4:00 PM) — DSA Practice

Open `dsa-bank/01-arrays-easy.md`. Solve **problems 1, 2, and 3 only**.

### How to approach each problem:

1. **Read the problem twice** — what is it asking?
2. **Write a comment** explaining your plan in plain English before any code
3. **Set a 20-minute timer** — try to solve it yourself first
4. If stuck after 20 min — look at a hint, not the full solution
5. Write your solution in a new file: `day-13-dsa.js` in this folder

Example structure in `day-13-dsa.js`:
```js
// Problem 1: [problem name]
// Plan: [your approach in English]
// Pattern: [what pattern this uses]

function solution(...) {
  // your code
}

console.log(solution(...)); // test it
```

**Don't worry about being elegant yet.** Get it working first. Ugly working code beats beautiful broken code.

---

## Wrap Up (4:15 – 5:45 PM) — Reflect + Commit

### Write in your journal

Open `journal.md` (or create it in this folder). Write:
- What did you actually understand today?
- What's still fuzzy or confusing?
- Which example surprised you the most?
- Confidence rating: 1 (lost) to 5 (nailed it)

No minimum length. Even 3 honest sentences is better than nothing.

### Commit your work

In the terminal, run these one at a time:

```bash
git add .
git commit -m "Day 13: Variables, types, operators - practice + 3 DSA problems"
git push origin main
```

If you get an error on `git push` — check that you're connected to the internet and your GitHub remote is set up. Ask for help if needed.

---

## End of Day Checklist

- [ ] Read all 3 cheatsheets (01-variables, 02-data-types, 03-operators)
- [ ] Typed 10+ examples yourself in `day-13-practice.js`
- [ ] Ran each example with `node day-13-practice.js`
- [ ] Completed `01-shapeshifter.js` exercise
- [ ] Completed `02-lie-detector.js` exercise
- [ ] Solved 3 DSA problems in `day-13-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Common Beginner Mistakes Today

| Mistake | What Actually Happens | Fix |
|---|---|---|
| Using `==` instead of `===` | `"5" == 5` is `true` (type coercion!) | Always use `===` |
| Forgetting `const`/`let` | Creates a global variable (bad) | Always declare with `const` or `let` |
| `console.log` without parentheses | Prints the function itself, not output | Always write `console.log(...)` |
| Reassigning a `const` | TypeError at runtime | Use `let` for values that change |

---

## Quick Reference

```js
// Variables
const name = "Dinesh";   // can't reassign
let age = 25;            // can reassign
// var x = ...           // avoid in modern JS

// Data Types
typeof "hello"     // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object" ← famous JS bug!
typeof []          // "object"
typeof {}          // "object"

// Operators
5 === 5            // true (strict equal)
5 == "5"           // true (loose - avoid!)
!true              // false
true && false      // false
true || false      // true
null ?? "default"  // "default" (nullish coalescing)
```

---

*You're building the foundation. Every expert was once confused by `null` vs `undefined`. Keep going.*
