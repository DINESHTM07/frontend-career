# Stacks & Queues — 5 Problems

**Stack (LIFO):** Push/pop from the top. JavaScript: use array with `.push()` / `.pop()`.
**Queue (FIFO):** Enqueue at back, dequeue from front. JavaScript: use array with `.push()` / `.shift()`, or a deque with two pointers for O(1).

**Key insight:** Use a stack when the **most recently seen** item is what matters. Use a queue when **order of arrival** matters.

```javascript
// Stack operations
const stack = [];
stack.push(x);    // O(1)
stack.pop();      // O(1)
stack.at(-1);     // Peek top — O(1)

// Queue operations (naive — shift is O(n))
const queue = [];
queue.push(x);    // Enqueue O(1)
queue.shift();    // Dequeue O(n) for array — use two-pointer or linked list for O(1)
```

---

## Problem 1 — Valid Parentheses

### PROBLEM STATEMENT
Given a string of `()[]{}`, determine if all brackets are correctly matched and nested. (LeetCode 20)

### EXAMPLES
```
Input:  "()"       →  true
Input:  "()[]{}"   →  true
Input:  "(]"       →  false
Input:  "([)]"     →  false
Input:  "{[]}"     →  true
Input:  "((("      →  false
```

### **PATTERN: Stack Matching**

### BRUTE FORCE
Repeatedly scan and remove matched pairs until no change. O(n²).

### OPTIMAL APPROACH

```javascript
function isValid(s) {
  const stack = [];
  const match = { ')': '(', ']': '[', '}': '{' };

  for (const char of s) {
    if ('([{'.includes(char)) {
      stack.push(char);                        // Opening: push
    } else {
      if (!stack.length) return false;         // Closing with empty stack
      if (stack.pop() !== match[char]) return false; // Wrong type
    }
  }

  return stack.length === 0; // All opened brackets must be closed
}

// Tests
console.log(isValid("()"));     // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]"));     // false
console.log(isValid("([)]"));   // false
console.log(isValid("{[]}"));   // true
console.log(isValid("((("));    // false
```

- **Time:** O(n) | **Space:** O(n)

### WHY THIS PATTERN
The **LIFO property of stacks maps directly to nesting**: the most recently opened bracket must be the next one closed. This is the foundational stack application. The `match` object makes the type check a single O(1) lookup. Two failure modes: (1) closing bracket doesn't match top of stack — wrong type; (2) stack not empty at end — unclosed brackets remain.

---

## Problem 2 — Min Stack

### PROBLEM STATEMENT
Design a stack that supports `push`, `pop`, `top`, and `getMin` — all in O(1). (LeetCode 155)

### EXAMPLES
```
push(-2), push(0), push(-3)
getMin() → -3
pop()
top()    → 0
getMin() → -2
```

### **PATTERN: Auxiliary Stack**

### BRUTE FORCE
Scan all stack elements to find minimum. `getMin` is O(n).

### OPTIMAL APPROACH
Maintain a second `minStack` that tracks the current minimum at each stack level. When an element is pushed, also push the current minimum to `minStack`.

```javascript
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = []; // Each position: minimum at that depth
  }

  push(val) {
    this.stack.push(val);
    const currentMin = this.minStack.length === 0
      ? val
      : Math.min(val, this.minStack.at(-1));
    this.minStack.push(currentMin);
  }

  pop() {
    this.stack.pop();
    this.minStack.pop(); // Both stacks stay in sync
  }

  top() {
    return this.stack.at(-1);
  }

  getMin() {
    return this.minStack.at(-1); // Current min is always at top of minStack
  }
}

// Test
const ms = new MinStack();
ms.push(-2);
ms.push(0);
ms.push(-3);
console.log(ms.getMin()); // -3
ms.pop();
console.log(ms.top());    // 0
console.log(ms.getMin()); // -2
```

- **Time:** O(1) all operations | **Space:** O(n)

**State trace:**
```
push(-2): stack=[-2],      minStack=[-2]  (min=-2)
push(0):  stack=[-2,0],    minStack=[-2,-2] (min stays -2)
push(-3): stack=[-2,0,-3], minStack=[-2,-2,-3] (new min=-3)
getMin(): minStack.top() = -3 ✓
pop():    stack=[-2,0],    minStack=[-2,-2]
top():    stack.top() = 0 ✓
getMin(): minStack.top() = -2 ✓
```

### WHY THIS PATTERN
The **auxiliary stack** stores additional metadata that would be expensive to recompute. The key insight: the minimum is a property of the stack's current state (all elements below the top). When you pop, the previous state's minimum is still recorded in `minStack`. This trades O(n) extra space for O(1) query time. Generalizes to: max stack, median stack, and any "O(1) aggregate query on a dynamic set."

---

## Problem 3 — Evaluate Reverse Polish Notation

### PROBLEM STATEMENT
Evaluate an arithmetic expression in Reverse Polish Notation (postfix). Valid operators: `+`, `-`, `*`, `/` (truncate toward zero). (LeetCode 150)

### EXAMPLES
```
Input:  ["2","1","+","3","*"]    →  9     ((2+1)*3)
Input:  ["4","13","5","/","+"]   →  6     (4+(13/5)=4+2=6)
Input:  ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]  →  22
```

### **PATTERN: Stack Processing (Operand/Operator)**

### OPTIMAL APPROACH

```javascript
function evalRPN(tokens) {
  const stack = [];
  const ops = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => Math.trunc(a / b), // Truncate toward zero
  };

  for (const token of tokens) {
    if (token in ops) {
      const b = stack.pop(); // Second operand (top)
      const a = stack.pop(); // First operand
      stack.push(ops[token](a, b));
    } else {
      stack.push(Number(token)); // Operand: push onto stack
    }
  }

  return stack[0]; // Final result
}

// Tests
console.log(evalRPN(["2","1","+","3","*"]));  // 9
console.log(evalRPN(["4","13","5","/","+"])); // 6
```

- **Time:** O(n) | **Space:** O(n)

**Trace for ["2","1","+","3","*"]:**
```
"2": push. stack=[2]
"1": push. stack=[2,1]
"+": pop b=1, pop a=2. push(2+1=3). stack=[3]
"3": push. stack=[3,3]
"*": pop b=3, pop a=3. push(3*3=9). stack=[9]
Return 9 ✓
```

**Note:** Pop order matters — `b = stack.pop()` then `a = stack.pop()`. For subtraction `a - b`, the first operand encountered is `a` (deeper in stack). Getting this backwards flips the operand order for non-commutative operations.

### WHY THIS PATTERN
RPN was designed to use a stack. The rule is simple: operands are pushed; operators pop two operands, compute, and push the result. This eliminates the need for parentheses and operator precedence parsing entirely. The same stack-based evaluation underlies how compilers and calculators work internally.

---

## Problem 4 — Implement Queue Using Two Stacks

### PROBLEM STATEMENT
Implement a FIFO queue using only two stacks. Implement `enqueue`, `dequeue`, and `peek`. (LeetCode 232)

### EXAMPLES
```
enqueue(1), enqueue(2)
peek()    → 1   (FIFO: first in)
dequeue() → 1
dequeue() → 2
```

### **PATTERN: Two Stack Trick (Lazy Transfer)**

### OPTIMAL APPROACH
`s1` is the input stack (for push). `s2` is the output stack (for pop/peek). Only transfer s1→s2 when s2 is empty and a dequeue is needed.

```javascript
class MyQueue {
  constructor() {
    this.s1 = []; // Inbox (newest at top)
    this.s2 = []; // Outbox (oldest at top)
  }

  enqueue(val) {
    this.s1.push(val); // Always push to s1
  }

  // Transfer from s1 to s2 when s2 is empty (lazy)
  _transfer() {
    if (this.s2.length === 0) {
      while (this.s1.length > 0) {
        this.s2.push(this.s1.pop()); // Reverses order → oldest on top of s2
      }
    }
  }

  dequeue() {
    this._transfer();
    return this.s2.pop();
  }

  peek() {
    this._transfer();
    return this.s2.at(-1);
  }

  isEmpty() {
    return this.s1.length === 0 && this.s2.length === 0;
  }
}

// Test
const q = new MyQueue();
q.enqueue(1);
q.enqueue(2);
q.enqueue(3);
console.log(q.peek());    // 1
console.log(q.dequeue()); // 1
console.log(q.dequeue()); // 2
q.enqueue(4);
console.log(q.dequeue()); // 3
console.log(q.dequeue()); // 4
```

- **Time:** `enqueue` O(1). `dequeue`/`peek` O(1) amortized — each element is moved at most once from s1 to s2.
- **Space:** O(n)

**Why amortized O(1)?** Each element crosses from s1 to s2 exactly once over its lifetime. Total work = 2n operations for n elements = O(1) per element amortized.

### WHY THIS PATTERN
Two stacks of opposite orientation reconstruct FIFO ordering. When s1 is reversed into s2, the oldest element is now at the top of s2 — correct FIFO order. The **lazy transfer** (only when s2 is empty) is what achieves amortized O(1). Eager transfer (every dequeue) would be O(n). This problem tests understanding of amortized analysis, a key CS concept.

---

## Problem 5 — Next Greater Element

### PROBLEM STATEMENT
For each element in an array, find the next element that is greater. If none exists, output -1. (LeetCode 496/503)

### EXAMPLES
```
Input:  [2, 1, 2, 4, 3]
Output: [4, 2, 4,-1,-1]

Input:  [4, 3, 2, 1]
Output: [-1,-1,-1,-1]  (strictly decreasing — nothing greater)

Input:  [1, 3, 2]
Output: [3,-1,-1]
```

### **PATTERN: Monotonic Stack (Decreasing)**

### BRUTE FORCE
For each element, scan right until a greater element is found. O(n²).

### OPTIMAL APPROACH
Maintain a stack of **indices** whose next greater element hasn't been found yet. The stack stays in decreasing order of values. When a new element is larger than the stack top, that element is the "next greater" for the top.

```javascript
function nextGreaterElement(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // Stack of indices (not values)

  for (let i = 0; i < nums.length; i++) {
    // While stack has elements and current element is greater than top
    while (stack.length > 0 && nums[i] > nums[stack.at(-1)]) {
      const idx = stack.pop();
      result[idx] = nums[i]; // nums[i] is the next greater for index idx
    }
    stack.push(i);
  }
  // Remaining indices in stack have no next greater → result stays -1

  return result;
}

// Extension: circular array (LeetCode 503)
function nextGreaterElementCircular(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = [];

  // Traverse twice to simulate circular array
  for (let i = 0; i < 2 * n; i++) {
    while (stack.length > 0 && nums[i % n] > nums[stack.at(-1)]) {
      result[stack.pop()] = nums[i % n];
    }
    if (i < n) stack.push(i); // Only push indices from first pass
  }

  return result;
}

// Tests
console.log(nextGreaterElement([2,1,2,4,3])); // [4,2,4,-1,-1]
console.log(nextGreaterElement([4,3,2,1]));   // [-1,-1,-1,-1]
console.log(nextGreaterElement([1,3,2]));     // [3,-1,-1]
console.log(nextGreaterElementCircular([1,2,1])); // [2,-1,2]
```

- **Time:** O(n) — each element pushed and popped at most once
- **Space:** O(n)

**Trace for [2,1,2,4,3]:**
```
i=0 (2):  stack empty. push 0. stack=[0]
i=1 (1):  1 < nums[0]=2. push 1. stack=[0,1]
i=2 (2):  2 > nums[1]=1 → result[1]=2. pop 1. 2 == nums[0]=2, not >. push 2. stack=[0,2]
i=3 (4):  4 > nums[2]=2 → result[2]=4. pop 2. 4 > nums[0]=2 → result[0]=4. pop 0. push 3. stack=[3]
i=4 (3):  3 < nums[3]=4. push 4. stack=[3,4]
End: indices 3,4 remain → result[3]=-1, result[4]=-1
result=[4,2,4,-1,-1] ✓
```

### WHY THIS PATTERN
**Monotonic stack** processes elements in a way that maintains a sorted invariant in the stack. Here: the stack is always in decreasing order of values (an element smaller than the current is resolved immediately). Each element is pushed once and popped once → O(n) total. This pattern solves all "find nearest greater/smaller to the left/right" problems. Variants: next smaller, previous greater, largest rectangle in histogram.

---

## Pattern Summary

| Problem | Pattern | Time | Space |
|---------|---------|------|-------|
| Valid parentheses | Stack matching (LIFO = nesting) | O(n) | O(n) |
| Min stack | Auxiliary stack (metadata) | O(1) all ops | O(n) |
| Evaluate RPN | Stack processing (operand/operator) | O(n) | O(n) |
| Queue from two stacks | Lazy transfer (amortized O(1)) | O(1) amortized | O(n) |
| Next greater element | Monotonic stack (decreasing) | O(n) | O(n) |
