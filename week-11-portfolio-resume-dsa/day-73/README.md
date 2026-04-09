# Day 73 — DSA Intensive: 8 Problems, Timed, Out Loud

**Status:** 📋 READY TO START
**Week:** 11 | **Theme:** Portfolio + Resume + DSA

---

## Today's Goal

Solve 8 DSA problems at medium difficulty. Time yourself on each one. Practice explaining your approach out loud while solving — this is the actual interview skill. By end of today, medium-difficulty problems feel like a warm-up, not a panic.

By end of today:
- 8 medium-difficulty problems solved
- Each one timed — you know where you're slow
- Each one explained out loud while solving
- Patterns documented for review before interviews

---

## The Rule for Today

**Talk while you code.**

Set up a recording on your phone or just speak to the wall. The point is that the words come out of your mouth before the final answer appears. Interviewers don't care about your silent thought process — they care about the audible one.

The structure to narrate:
1. "The problem is asking me to..." (restate it)
2. "My first instinct is..." (naive approach — even if you'll improve it)
3. "But that's O(n²), so instead I'll use..." (optimize)
4. "The data structure I'll use is... because..."
5. "Let me trace through the example: if input is X, then..."
6. "Edge cases: empty array, single element, all same values..."
7. Code it
8. "Time complexity is O(...) because... Space complexity is O(...) because..."

---

## Morning (8:00 – 11:00 AM) — Problems 1-4

Create `day-73-dsa.js`. Solve Problems 1-4 from your `dsa-bank/` medium-difficulty section.

**Target areas for today (pick 4 of these):**

### Two Pointers

**Problem: Valid Palindrome** (Easy-Medium)
```
Given a string, check if it reads the same forwards and backwards,
ignoring non-alphanumeric characters and case.

Input: "A man, a plan, a canal: Panama"
Output: true
```
Key insight: two pointer from both ends, skip non-alphanumeric, compare lowercase.

**Problem: 3Sum** (Medium)
```
Given an array of integers, find all unique triplets that sum to zero.
Input: [-1, 0, 1, 2, -1, -4]
Output: [[-1,-1,2], [-1,0,1]]
```
Key insight: sort first, fix one element, use two pointers for the remaining pair.

### Sliding Window

**Problem: Longest Substring Without Repeating Characters** (Medium)
```
Find the length of the longest substring with no duplicate characters.
Input: "abcabcbb"
Output: 3 ("abc")
```
Key insight: sliding window with a Set. When duplicate found, shrink from left.

**Problem: Maximum Average Subarray** (Easy-Medium)
```
Find the subarray of length k with maximum average.
Input: nums = [1,12,-5,-6,50,3], k = 4
Output: 12.75
```
Key insight: compute first window sum, slide by adding right and subtracting left.

---

## Midday (11:20 AM – 1:30 PM) — Problems 5-8

**Target areas for midday:**

### Hash Maps / Sets

**Problem: Two Sum** (Easy — but practice explaining it perfectly)
```
Given an array and a target, return indices of two numbers that add to target.
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
```
Key insight: hash map stores `complement → index`. O(n) time, O(n) space.
Practice explaining this in under 60 seconds. This is the most common entry-level problem.

**Problem: Group Anagrams** (Medium)
```
Group strings that are anagrams of each other.
Input: ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
```
Key insight: sort each string → use sorted string as hash map key.

### Stack

**Problem: Valid Parentheses** (Easy — practice explaining perfectly)
```
Given a string with brackets, determine if it's valid.
Input: "()[]{}"   Output: true
Input: "([)]"     Output: false
```
Key insight: stack. Push open brackets, pop when closing bracket matches.

**Problem: Daily Temperatures** (Medium)
```
Given daily temperatures, find how many days until a warmer day.
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
```
Key insight: monotonic decreasing stack. Store indices. Pop when current temp is warmer.

---

## Afternoon (1:30 – 3:30 PM) — Pattern Review + Debrief

### Review Your Times

Look at all 8 problems. For each one, answer:
- Did I remember the pattern immediately? (Good)
- Did I struggle to start? (Need more practice in this category)
- Did I get the time complexity wrong? (Review Big O for this pattern)

### The Patterns to Know for Interviews

Document these in `dsa-bank/` or as comments in `day-73-dsa.js`:

```
Two Pointers:
- When: sorted array, find pairs/triplets summing to target, palindrome check
- Template: left=0, right=n-1, move based on comparison

Sliding Window:
- When: "longest/shortest subarray/substring with constraint"
- Template: expand right, shrink left when constraint violated

Hash Map:
- When: "find if X exists", "count frequency", "group by property"
- Template: build map first, then query

Stack:
- When: "matching pairs", "next greater/smaller element", "nested structure"
- Template: push opening, pop/check when closing

Binary Search:
- When: sorted array, "find target", "minimum condition that satisfies X"
- Template: lo=0, hi=n-1, mid=(lo+hi)//2, move based on comparison
```

---

## End of Day Checklist

- [ ] 8 problems solved in `day-73-dsa.js`
- [ ] Each problem has: time taken (minutes), time complexity, space complexity, key insight
- [ ] Explained approach out loud for every problem while solving
- [ ] Two pointer pattern: ≥2 problems solved
- [ ] Sliding window pattern: ≥1 problem solved
- [ ] Hash map pattern: ≥1 problem solved
- [ ] Stack pattern: ≥1 problem solved
- [ ] Reviewed times — know which category is your slowest
- [ ] Pattern cheat sheet written in `dsa-bank/` or `day-73-dsa.js`

---

*The interview is not a test of whether you know the answer. It is a test of whether you can think out loud under pressure. Practice the out-loud part as much as you practice the solution.*
