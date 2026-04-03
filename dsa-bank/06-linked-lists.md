# Linked Lists — 5 Problems

Linked list problems require thinking in terms of **pointer manipulation**. You almost never need extra space — solutions involve rearranging existing `next` pointers. Master three building blocks: dummy head, slow/fast pointers, and iterative pointer reversal.

**Node definition (used in all problems):**
```javascript
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Helper: build list from array
function buildList(arr) {
  if (!arr.length) return null;
  const head = new ListNode(arr[0]);
  let cur = head;
  for (let i = 1; i < arr.length; i++) {
    cur.next = new ListNode(arr[i]);
    cur = cur.next;
  }
  return head;
}

// Helper: list to array (for testing)
function listToArray(head) {
  const arr = [];
  while (head) { arr.push(head.val); head = head.next; }
  return arr;
}
```

---

## Problem 1 — Reverse Linked List

### PROBLEM STATEMENT
Reverse a singly linked list in-place. Return the new head. (LeetCode 206)

### EXAMPLES
```
Input:  1 → 2 → 3 → 4 → 5 → null
Output: 5 → 4 → 3 → 2 → 1 → null

Input:  1 → 2 → null
Output: 2 → 1 → null

Input:  null
Output: null
```

### **PATTERN: Iterative Pointer Swap**

### BRUTE FORCE
Collect all values into an array, rebuild list in reverse. O(n) time, O(n) space.

### OPTIMAL APPROACH
Three pointers: `prev` (reversed so far), `curr` (current node), `next` (save before overwriting). At each step, flip `curr.next` to point backward.

```javascript
function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    const next = curr.next; // 1. Save next before we overwrite it
    curr.next = prev;       // 2. Reverse the pointer
    prev = curr;            // 3. Advance prev
    curr = next;            // 4. Advance curr
  }

  return prev; // prev is now the new head
}

// Recursive version (good to know for interviews)
function reverseListRecursive(head) {
  // Base case: empty or single node
  if (!head || !head.next) return head;

  // Reverse the rest of the list
  const newHead = reverseListRecursive(head.next);

  // Make the next node point back to head
  head.next.next = head;
  head.next = null; // Disconnect head from what follows

  return newHead;
}

// Tests
let list = buildList([1, 2, 3, 4, 5]);
console.log(listToArray(reverseList(list)));          // [5,4,3,2,1]

list = buildList([1, 2]);
console.log(listToArray(reverseList(list)));           // [2,1]

console.log(listToArray(reverseList(null)));           // []
```

- **Time:** O(n) | **Space:** O(1) iterative, O(n) recursive (call stack)

**Trace for 1→2→3:**
```
prev=null, curr=1→2→3
Step 1: next=2→3. curr.next=null. prev=1. curr=2→3  →  null←1  2→3
Step 2: next=3. curr.next=1. prev=2. curr=3          →  null←1←2  3
Step 3: next=null. curr.next=2. prev=3. curr=null    →  null←1←2←3
Return prev=3  →  3→2→1→null ✓
```

### WHY THIS PATTERN
The three-pointer swap is the canonical in-place list reversal. The key invariant: before each iteration, everything to the left of `curr` is already reversed, `prev` is the head of the reversed portion. The `next` save is essential — once you redirect `curr.next`, you'd lose the rest of the list without it. The recursive version is elegant but risks stack overflow on very long lists.

---

## Problem 2 — Detect Cycle

### PROBLEM STATEMENT
Return `true` if the linked list has a cycle. A cycle means some node's `next` points to a previously visited node. (LeetCode 141)

### EXAMPLES
```
Input:  3→2→0→-4→(back to 2)   →  true
Input:  1→2→(back to 1)         →  true
Input:  1→null                  →  false
```

### **PATTERN: Floyd's Fast/Slow Pointers (Tortoise and Hare)**

### BRUTE FORCE
Store all visited nodes in a Set. If you visit the same node twice, there's a cycle. O(n) time, O(n) space.

```javascript
function hasCycleSet(head) {
  const seen = new Set();
  while (head) {
    if (seen.has(head)) return true;
    seen.add(head);
    head = head.next;
  }
  return false;
}
```

### OPTIMAL APPROACH
Two pointers: slow moves 1 step, fast moves 2 steps. If there's a cycle, fast will eventually lap slow and they'll meet. If no cycle, fast reaches null.

```javascript
function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;       // Move 1 step
    fast = fast.next.next;  // Move 2 steps

    if (slow === fast) return true; // They met — cycle exists
  }

  return false; // fast hit null — no cycle
}

// Extension: find the START of the cycle (LeetCode 142)
function detectCycleStart(head) {
  let slow = head, fast = head;

  // Phase 1: detect meeting point
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) break;
  }

  if (!fast || !fast.next) return null; // No cycle

  // Phase 2: find cycle entry
  // Move one pointer to head, keep other at meeting point.
  // Both move 1 step — they meet at cycle start.
  slow = head;
  while (slow !== fast) {
    slow = slow.next;
    fast = fast.next;
  }

  return slow; // Cycle start node
}

// Test (manual cycle construction)
const n1 = new ListNode(3);
const n2 = new ListNode(2);
const n3 = new ListNode(0);
const n4 = new ListNode(-4);
n1.next = n2; n2.next = n3; n3.next = n4; n4.next = n2; // Cycle to n2

console.log(hasCycle(n1));              // true
console.log(detectCycleStart(n1)?.val); // 2

const list2 = buildList([1, 2, 3]);
console.log(hasCycle(list2));           // false
```

- **Time:** O(n) | **Space:** O(1)

**Why Floyd's works:** In a cycle of length L, fast gains 1 step on slow per iteration. They will meet in at most L iterations after both enter the cycle. **Why phase 2 finds cycle start:** If the meeting point is k steps into the cycle, and the cycle start is m steps from head, then both pointers traveling at speed 1 — one from head, one from meeting point — will arrive at the cycle start simultaneously. (Mathematical proof: head-to-start = m, meeting-point-to-start = L - k = m.)

### WHY THIS PATTERN
Floyd's algorithm achieves O(1) space by using the relative speed difference to detect a cycle. The "two speeds" insight is broadly applicable: whenever you need to detect whether a sequence will "loop back," the tortoise-and-hare approach avoids storing visited elements. Also used for finding duplicates in arrays constrained to a range (LeetCode 287).

---

## Problem 3 — Merge Two Sorted Lists

### PROBLEM STATEMENT
Merge two sorted linked lists and return the merged sorted list. (LeetCode 21)

### EXAMPLES
```
Input:  1→2→4,  1→3→4    →  1→1→2→3→4→4
Input:  [],     []        →  []
Input:  [],     0         →  0
```

### **PATTERN: Dummy Head Technique**

### BRUTE FORCE
Collect all values, sort them, build new list. O((n+m) log(n+m)) time, O(n+m) space.

### OPTIMAL APPROACH
The dummy head simplifies edge cases (empty lists, result head assignment). Use two pointers to pick the smaller node from each list.

```javascript
function mergeTwoLists(l1, l2) {
  // Dummy head: gives us a stable starting point without special-casing the head
  const dummy = new ListNode(-1);
  let curr = dummy;

  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }

  // Attach remaining nodes (one list is exhausted, the other might have more)
  curr.next = l1 !== null ? l1 : l2;

  return dummy.next; // Real head is dummy.next
}

// Recursive version
function mergeTwoListsRecursive(l1, l2) {
  if (!l1) return l2;
  if (!l2) return l1;

  if (l1.val <= l2.val) {
    l1.next = mergeTwoListsRecursive(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoListsRecursive(l1, l2.next);
    return l2;
  }
}

// Tests
const a = buildList([1, 2, 4]);
const b = buildList([1, 3, 4]);
console.log(listToArray(mergeTwoLists(a, b)));         // [1,1,2,3,4,4]
console.log(listToArray(mergeTwoLists(null, buildList([0])))); // [0]
```

- **Time:** O(n + m) | **Space:** O(1) iterative, O(n+m) recursive

### WHY THIS PATTERN
The **dummy head** is a standard technique when you need to build a result list but don't know the head value up front. Without it: you'd need to special-case setting the first node of the result, making the code verbose. `dummy.next` is always the real result head. The same technique appears in: partition linked list, reverse linked list in groups, and any "build a new list from existing nodes" problem.

---

## Problem 4 — Find Middle Node

### PROBLEM STATEMENT
Find the middle node of a linked list. If two middles, return the second. (LeetCode 876)

### EXAMPLES
```
Input:  1→2→3→4→5     →  Node(3)  (middle)
Input:  1→2→3→4→5→6   →  Node(4)  (second middle when even length)
Input:  1             →  Node(1)
```

### **PATTERN: Fast/Slow Pointers**

### BRUTE FORCE
Count nodes (O(n)), then traverse to count/2. Two passes. O(n) time, O(1) space.

### OPTIMAL APPROACH
Slow moves 1 step, fast moves 2 steps. When fast reaches the end, slow is at the middle — one pass.

```javascript
function middleNode(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;       // 1 step
    fast = fast.next.next;  // 2 steps
  }

  return slow;
  // When fast reaches end (odd length) or fast.next=null (even length), slow is at middle
}

// Tests
console.log(middleNode(buildList([1,2,3,4,5]))?.val);   // 3
console.log(middleNode(buildList([1,2,3,4,5,6]))?.val); // 4
console.log(middleNode(buildList([1]))?.val);            // 1
```

- **Time:** O(n) — single pass | **Space:** O(1)

**Trace for [1,2,3,4,5]:**
```
Start: slow=1, fast=1
Iter 1: slow=2, fast=3
Iter 2: slow=3, fast=5
Iter 3: fast.next=null → STOP. slow=3 ✓
```

**Trace for [1,2,3,4,5,6]:**
```
Iter 1: slow=2, fast=3
Iter 2: slow=3, fast=5
Iter 3: slow=4, fast=null (fast=6, fast.next=null) → STOP. slow=4 ✓
```

### WHY THIS PATTERN
When fast (2x speed) reaches the end, slow (1x speed) is exactly halfway. The speed ratio of 2:1 means the halfway point is hit exactly. This "relative speed" principle generalizes: use speed ratio k:1 to divide the list into k parts. The fast/slow pattern also underlies cycle detection (Problem 2) and finding the kth-from-end (foundation of Problem 5).

---

## Problem 5 — Remove Nth Node from End

### PROBLEM STATEMENT
Remove the nth node from the end of the list. Return the head. (LeetCode 19)

### EXAMPLES
```
Input:  1→2→3→4→5, n=2   →  1→2→3→5  (removed 4, which is 2nd from end)
Input:  1,          n=1   →  null      (removed only node)
Input:  1→2,        n=1   →  1         (removed last)
```

### **PATTERN: Two Pointers with Gap**

### BRUTE FORCE
Count list length L, then remove node at position (L - n). Two passes.

### OPTIMAL APPROACH
Move `fast` n+1 steps ahead of `slow`. When `fast` reaches null, `slow` is at the node just before the target.

```javascript
function removeNthFromEnd(head, n) {
  // Dummy head handles edge case of removing the actual head (n = list length)
  const dummy = new ListNode(0);
  dummy.next = head;

  let slow = dummy;
  let fast = dummy;

  // Advance fast by n+1 steps to create a gap of n between fast and slow
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }

  // Move both until fast reaches null
  while (fast !== null) {
    slow = slow.next;
    fast = fast.next;
  }

  // slow is now just before the node to remove
  slow.next = slow.next.next;

  return dummy.next;
}

// Tests
console.log(listToArray(removeNthFromEnd(buildList([1,2,3,4,5]), 2))); // [1,2,3,5]
console.log(listToArray(removeNthFromEnd(buildList([1]), 1)));          // []
console.log(listToArray(removeNthFromEnd(buildList([1,2]), 1)));        // [1]
```

- **Time:** O(L) — one pass | **Space:** O(1)

**Trace for [1,2,3,4,5], n=2:**
```
dummy→1→2→3→4→5
fast advances n+1=3 steps: fast=3
slow=dummy(0), fast=3

Iter 1: slow=1, fast=4
Iter 2: slow=2, fast=5
Iter 3: slow=3, fast=null → STOP

slow=3. slow.next = slow.next.next  →  3.next = 5  →  removes 4 ✓
```

**Why n+1 steps (not n)?** We need `slow` to stop at the node **before** the target (so we can do `slow.next = slow.next.next`). Advancing `n+1` creates a gap of n, meaning when `fast` is at null, `slow` is exactly one behind the nth-from-end.

### WHY THIS PATTERN
The **fixed-gap two pointers** technique solves "find position relative to the end" in one pass. The gap between slow and fast is fixed at n, so when fast terminates, slow is exactly where needed. The dummy head handles the edge case where the target is the actual head (n = list length). This pattern generalizes to "kth from end," "middle of list" (gap = L/2), and other distance-from-end problems.

---

## Pattern Summary

| Problem | Pattern | Time | Space |
|---------|---------|------|-------|
| Reverse list | Iterative pointer swap (prev/curr/next) | O(n) | O(1) |
| Detect cycle | Floyd's fast/slow (2:1 speed) | O(n) | O(1) |
| Merge sorted lists | Dummy head + two pointers | O(n+m) | O(1) |
| Find middle | Fast/slow (2:1 speed) | O(n) | O(1) |
| Remove Nth from end | Fixed-gap two pointers | O(n) | O(1) |

**The three building blocks:**
```
1. Dummy Head     → simplifies head assignment and edge cases
2. Slow/Fast      → speed ratio determines position relationship
3. Pointer Swap   → in-place restructuring without extra space

Most linked list problems are combinations of these three.
```
