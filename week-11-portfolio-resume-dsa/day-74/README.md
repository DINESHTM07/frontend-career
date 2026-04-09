# Day 74 — DSA Intensive: 8 More Problems, Explaining Out Loud

**Status:** 📋 READY TO START
**Week:** 11 | **Theme:** Portfolio + Resume + DSA

---

## Today's Goal

8 more DSA problems, different categories from yesterday. Focus on trees, binary search, and recursion — the categories that feel least natural but appear constantly in interviews. Keep explaining out loud.

By end of today:
- 8 more problems solved (16 total this week)
- Binary search pattern internalized
- Tree traversal (BFS and DFS) done at least once each
- Recursion confidence improved

---

## The Focus: Categories That Feel Hard

Yesterday was arrays, strings, hash maps, stacks — the comfortable territory for most React developers. Today is the less comfortable territory: trees, binary search, recursion.

The good news: these patterns are actually simpler than they look. There are only 3-4 templates. Once you know the template, the problem reduces to "how do I fit my problem into this template?"

---

## Morning (8:00 – 11:00 AM) — Binary Search (Problems 1-3)

### The Binary Search Template

Memorize this. Every binary search problem is a variation of this:

```js
function binarySearch(nums, target) {
  let lo = 0
  let hi = nums.length - 1

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)

    if (nums[mid] === target) return mid
    else if (nums[mid] < target) lo = mid + 1
    else hi = mid - 1
  }

  return -1  // not found
}
```

Time complexity: always O(log n). That's the point.

**Problem 1: Binary Search** (Easy — practice explaining perfectly)
```
Given a sorted array and a target, return the index or -1.
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
```
This is the template above. Explain it out loud in 45 seconds.

**Problem 2: First Bad Version** (Easy-Medium)
```
You have n versions [1..n]. Given API isBadVersion(n), find the first bad version.
All versions after the first bad one are also bad.
```
Key insight: binary search on the versions. If mid is bad, go left. If mid is good, go right.

**Problem 3: Search in Rotated Sorted Array** (Medium)
```
A sorted array was rotated at some pivot. Find target's index.
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
```
Key insight: one half is always sorted. Check which half the target belongs to.

---

## Midday (11:20 AM – 1:30 PM) — Trees + Recursion (Problems 4-8)

### The Tree Traversal Templates

**DFS (Depth First Search) — recursive:**
```js
function dfs(node) {
  if (!node) return

  // Pre-order: process here (before children)
  console.log(node.val)

  dfs(node.left)
  dfs(node.right)

  // Post-order: process here (after children)
}
```

**BFS (Breadth First Search) — iterative with queue:**
```js
function bfs(root) {
  if (!root) return []
  const queue = [root]
  const result = []

  while (queue.length > 0) {
    const level = []
    const levelSize = queue.length  // process one level at a time

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()
      level.push(node.val)
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }

    result.push(level)
  }

  return result
}
```

**Problem 4: Maximum Depth of Binary Tree** (Easy)
```
Find the maximum depth of a binary tree.
```
Key insight: DFS. Return 1 + max(depth(left), depth(right)). Base case: null node returns 0.

**Problem 5: Invert Binary Tree** (Easy)
```
Flip the tree — left becomes right, right becomes left, recursively.
```
Key insight: DFS. Swap left and right at each node, recurse on both children.

**Problem 6: Level Order Traversal** (Medium)
```
Return values grouped by level: [[3],[9,20],[15,7]]
```
Key insight: BFS with queue. Process `levelSize` nodes per iteration to separate levels.

**Problem 7: Validate Binary Search Tree** (Medium)
```
Determine if a binary tree is a valid BST.
```
Key insight: DFS with min/max bounds. Each node must be > min and < max. Pass updated bounds to children.

**Problem 8: Climbing Stairs** (Easy-Medium — intro to DP)
```
You can climb 1 or 2 stairs at a time. How many ways to reach step n?
Input: n = 4, Output: 5
```
Key insight: dp[i] = dp[i-1] + dp[i-2]. This is Fibonacci. Base: dp[1]=1, dp[2]=2.
Space optimization: you only need the last 2 values — use two variables instead of an array.

---

## Afternoon (1:30 – 3:30 PM) — Job Platforms Setup Preview

While you have energy left after DSA, spend 30 minutes preparing for tomorrow's platform setup:

### Accounts to Create Today (so Day 75 is faster)

Create accounts (don't fill the profiles yet — just register):
- **Wellfound** (formerly AngelList) — wellfound.com — startup jobs
- **Instahyre** — instahyre.com — good for India-based companies
- **Cutshort** — cutshort.io — tech-focused hiring
- **Hirect** — hirect.in — direct messaging with founders/CTOs
- **Naukri** — naukri.com — largest India job board

This takes 10-15 minutes. Tomorrow you fill all profiles completely.

### Also: DSA Debrief

Review your Day 73 and Day 74 problems together. Which patterns did you nail? Which did you avoid?

Write in `dsa-bank/patterns.md` (or at the bottom of `day-74-dsa.js`) a summary table:

```
| Pattern       | Confidence (1-5) | Problems Done | Weak Points |
|---------------|-----------------|---------------|-------------|
| Two Pointers  | 4               | 3             | 3Sum setup  |
| Sliding Window| 3               | 2             | Shrink logic|
| Hash Map      | 5               | 4             | None        |
| Stack         | 4               | 2             | Monotonic   |
| Binary Search | 3               | 3             | Rotated arr |
| Tree DFS      | 3               | 3             | BST bounds  |
| Tree BFS      | 2               | 1             | Level size  |
| Recursion/DP  | 2               | 1             | Memoization |
```

Fill this out honestly. The ones rated 1-2 are what you practice in Week 12.

---

## End of Day Checklist

- [ ] 8 problems solved in `day-74-dsa.js`
- [ ] Binary search: 3 problems — template memorized, can write it without looking
- [ ] Tree DFS: 2 problems — recursive template in memory
- [ ] Tree BFS: 1 problem — queue-based template in memory
- [ ] DP introduction: Climbing Stairs solved — understand the recurrence relation
- [ ] Each problem: time taken + time complexity + space complexity + key insight
- [ ] Explained approach out loud for every problem
- [ ] Pattern confidence table written
- [ ] Accounts created on Wellfound, Instahyre, Cutshort, Hirect, Naukri

---

*Binary search and tree traversal feel unnatural because you rarely use them in frontend work. But they appear in 40%+ of coding interviews. Two days of focused practice is enough to build a solid foundation. That's what today is.*
