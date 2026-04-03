# Day 4 — DSA Bank: 100 Problems Across 10 Files

**Date:** Week 1, Day 4 of the 90-day frontend career journey.

**Theme:** Build a complete DSA reference bank covering all patterns that appear in frontend engineering interviews — from easy arrays to JavaScript-specific implementation problems.

---

## What Was Created Today

All files live in `dsa-bank/` at the root of the project.

### File Index

| File | Topic | Problems | Difficulty |
|------|-------|----------|------------|
| `01-arrays-easy.md` | Arrays — Easy | 15 | Easy |
| `02-arrays-medium.md` | Arrays — Medium | 10 | Medium |
| `03-strings-easy.md` | Strings — Easy | 12 | Easy |
| `04-strings-medium.md` | Strings — Medium | 8 | Medium |
| `05-hashmaps.md` | Hash Maps & Sets | 10 | Easy–Medium |
| `06-linked-lists.md` | Linked Lists | 5 | Medium |
| `07-stacks-queues.md` | Stacks & Queues | 5 | Medium |
| `08-recursion.md` | Recursion | 10 | Easy–Medium |
| `09-searching-sorting.md` | Searching & Sorting | 5 | Medium |
| `10-js-specific-dsa.md` | JS Implementations | 20 | Medium–Hard |
| **TOTAL** | | **100 problems** | |

---

## All 100 Problems Listed

### Arrays — Easy (15)
1. Find max/min — **Linear Scan**
2. Reverse in-place — **Two Pointers (converging)**
3. Check if sorted — **Linear Scan + early exit**
4. Remove duplicates from sorted — **Two Pointers (slow/fast)**
5. Move zeros to end — **Two Pointers (slow/fast)**
6. Find missing number — **Gauss Formula**
7. Find duplicate — **Frequency Counter (Set)**
8. Merge two sorted arrays — **Two Pointers (parallel walk)**
9. Rotate array by K — **Reverse Trick**
10. Second largest element — **Linear Scan (2 vars)**
11. Count frequency of elements — **Frequency Counter (Map)**
12. Intersection of two arrays — **Hash Set**
13. Union of two arrays — **Hash Set**
14. Pair with given sum — **Hash Set complement**
15. Best time to buy/sell stock — **Greedy scan**

### Arrays — Medium (10)
16. Two Sum — **Hash Map complement + index**
17. Container with most water — **Two Pointers (greedy convergence)**
18. Three Sum — **Sort + Two Pointers (fix one)**
19. Maximum subarray (Kadane's) — **Greedy local decision**
20. Product except self — **Prefix + Suffix product**
21. Merge intervals — **Sort + Greedy sweep**
22. Sort colors (Dutch National Flag) — **Three Pointers**
23. Spiral matrix — **Boundary Shrinking**
24. Next permutation — **Scan from right + Reverse**
25. Subarray sum equals K — **Prefix Sum + Hash Map**

### Strings — Easy (12)
26. Reverse a string — **Two Pointers (array conversion)**
27. Check palindrome — **Two Pointers (skip non-alphanumeric)**
28. Count vowels/consonants — **Linear Scan + Set**
29. Check anagram — **Frequency Counter (count up/down)**
30. First non-repeating character — **Frequency Counter (two-pass)**
31. Remove duplicates from string — **Hash Set (seen tracker)**
32. Count words — **Split + Filter / state machine**
33. Capitalize first letter each word — **Split / Map / Join**
34. Check only digits — **Regex + Linear Scan**
35. Most frequent character — **Frequency Counter + original-order max**
36. Truncate string with ellipsis — **Slice + word boundary**
37. String compression — **Accumulator (count consecutive)**

### Strings — Medium (8)
38. Longest substring no repeating chars — **Sliding Window (variable) + Map**
39. Group anagrams — **Hash Map + sorted canonical key**
40. Longest palindromic substring — **Expand Around Center**
41. Valid parentheses — **Stack (LIFO matching)**
42. Generate all permutations — **Backtracking (Choose/Explore/Unchoose)**
43. Minimum window substring — **Sliding Window (shrinkable)**
44. Longest common prefix — **Vertical Scan / Sort trick**
45. Decode string `"3[ab]"` — **Stack (nested context)**

### Hash Maps & Sets (10)
46. Two Sum — **Complement Pattern**
47. Frequency of elements — **Counting Pattern**
48. Group anagrams — **Canonical Key**
49. First unique character — **Count then Scan**
50. Intersection of arrays — **Set Lookup**
51. Isomorphic strings — **Bidirectional Map**
52. Word pattern matching — **Bijection**
53. Subarray sum equals K — **Prefix Sum Map**
54. Longest consecutive sequence — **Set Expansion**
55. Contains duplicate within K distance — **Sliding Window + Set**

### Linked Lists (5)
56. Reverse linked list — **Iterative Pointer Swap**
57. Detect cycle — **Floyd's Fast/Slow (Tortoise & Hare)**
58. Merge two sorted lists — **Dummy Head technique**
59. Find middle node — **Fast/Slow Pointers (2:1 speed)**
60. Remove Nth node from end — **Fixed-Gap Two Pointers**

### Stacks & Queues (5)
61. Valid parentheses — **Stack Matching**
62. Min stack — **Auxiliary Stack**
63. Evaluate Reverse Polish Notation — **Stack Processing**
64. Queue using two stacks — **Lazy Transfer (amortized O(1))**
65. Next greater element — **Monotonic Stack (decreasing)**

### Recursion (10)
66. Fibonacci — **Memoization (Top-Down DP)**
67. Factorial — **Base Case + Reduction**
68. Sum of array — **Head + Tail recursion**
69. Power function — **Divide and Conquer (squaring)**
70. Flatten nested array — **Type Dispatch + Collect**
71. Deep clone object — **Type Dispatch + Copy**
72. Binary search (recursive) — **Divide Interval**
73. Count occurrences in nested object — **Tree Traversal**
74. Generate parentheses — **Backtracking + Constraints**
75. Subset generation — **Include/Exclude**

### Searching & Sorting (5)
76. Binary search — **Divide Interval (classic)**
77. Find peak element — **Modified Binary Search (slope)**
78. Merge sort — **Divide and Conquer (split + merge)**
79. Quick sort — **Partition (Lomuto/Hoare)**
80. Search in rotated sorted array — **Modified Binary Search (sorted half)**

### JavaScript Implementations (20)
81. `Array.prototype.myMap` — HIGH frequency
82. `Array.prototype.myFilter` — HIGH frequency
83. `Array.prototype.myReduce` — HIGH frequency
84. `Array.prototype.myFlat` — MEDIUM frequency
85. `Array.prototype.myFind` — MEDIUM frequency
86. `Function.prototype.myBind` — HIGH frequency
87. `Function.prototype.myCall` — HIGH frequency
88. `Function.prototype.myApply` — HIGH frequency
89. `debounce` with cancel — HIGH frequency
90. `throttle` with leading/trailing — HIGH frequency
91. Deep clone (handles Date, RegExp, circular) — HIGH frequency
92. Deep equal comparison — MEDIUM frequency
93. `curry` function — HIGH frequency
94. `pipe` and `compose` — MEDIUM frequency
95. `Promise.all` from scratch — HIGH frequency
96. `Promise.race` from scratch — MEDIUM frequency
97. Event Emitter (`on`, `off`, `emit`, `once`) — HIGH frequency
98. LRU Cache — HIGH frequency
99. `JSON.stringify` from scratch — MEDIUM frequency
100. `getElementsByClassName` from scratch — MEDIUM frequency

---

## Core Patterns Reference

| Pattern | Problem Numbers |
|---------|----------------|
| Two Pointers (converging) | #2, #17, #27 |
| Two Pointers (slow/fast) | #4, #5, #59, #60 |
| Linear Scan | #1, #3, #10, #28, #29 |
| Frequency Counter | #7, #11, #29, #30, #35, #47, #49 |
| Hash Set / Map | #12, #13, #46, #50, #51, #52, #53, #54, #55 |
| Sliding Window | #38, #43, #55 |
| Stack | #41, #45, #61, #62, #63, #64, #65 |
| Backtracking | #42, #74, #75 |
| Expand Around Center | #40 |
| Fast/Slow Pointers (Floyd's) | #57, #59 |
| Monotonic Stack | #65 |
| Binary Search | #72, #76, #77, #80 |
| Divide and Conquer | #69, #78, #79 |
| Memoization / DP | #19, #66 |
| Greedy | #15, #17, #21, #24 |
| Prefix / Suffix | #20, #25, #53 |

---

## Interview Prep Priority Order

1. **`10-js-specific-dsa.md`** — uniquely frontend, highest ROI for JS interviews
2. **`01-arrays-easy.md`** — universal fundamentals, must be instant recall
3. **`05-hashmaps.md`** — appears in 50%+ of interviews
4. **`02-arrays-medium.md`** — most LeetCode mediums use these patterns
5. **`08-recursion.md`** — needed for tree/graph problems later
6. **`03-strings-easy.md`** + **`04-strings-medium.md`** — string manipulation
7. **`06-linked-lists.md`** + **`07-stacks-queues.md`** — pointer/structure problems
8. **`09-searching-sorting.md`** — binary search variants

---

## Files

```
dsa-bank/
├── 01-arrays-easy.md        (15 problems)
├── 02-arrays-medium.md      (10 problems)
├── 03-strings-easy.md       (12 problems)
├── 04-strings-medium.md     (8 problems)
├── 05-hashmaps.md           (10 problems)
├── 06-linked-lists.md       (5 problems)
├── 07-stacks-queues.md      (5 problems)
├── 08-recursion.md          (10 problems)
├── 09-searching-sorting.md  (5 problems)
└── 10-js-specific-dsa.md    (20 problems)
                              ─────────────
                              100 problems total
```

---

*Day 4 complete. 100 problems. Every major DSA pattern covered.*
*Next: Start building projects using these patterns and the Day 3 cheatsheets.*
