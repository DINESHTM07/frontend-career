# Arrays — Easy Problems

15 foundational array problems. Master these patterns first — they are the building blocks every medium and hard problem is built on.

---

## Problem 1 — Find Maximum and Minimum in an Array

### PROBLEM STATEMENT
Given an array of integers, find both the maximum and minimum values in a single pass.

### EXAMPLES
```
Input:  [3, 1, 7, 2, 9, 4]
Output: max = 9, min = 1

Input:  [5]
Output: max = 5, min = 5

Input:  [-3, -1, -7, -2]
Output: max = -1, min = -7
```

### **PATTERN: Linear Scan**

### BRUTE FORCE APPROACH
Sort the array. Min = first element, Max = last element.
- Time: O(n log n) — sorting
- Space: O(1) or O(n) depending on sort

### OPTIMAL APPROACH
Single pass — initialize max and min to first element, update as you scan.

```javascript
function findMinMax(arr) {
  if (arr.length === 0) return null;

  let max = arr[0];
  let min = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
  }

  return { max, min };
}

// Test
console.log(findMinMax([3, 1, 7, 2, 9, 4])); // { max: 9, min: 1 }
```

- Time: O(n) — one pass
- Space: O(1) — two variables

### WHY THIS PATTERN
Use **Linear Scan** when you need to find a single aggregate value (max, min, sum, count) across the entire array. The key idea: you only need to remember the "best so far" as you walk through. No need to look at any element twice.

---

## Problem 2 — Reverse an Array In-Place

### PROBLEM STATEMENT
Reverse the elements of an array in-place (without using extra space).

### EXAMPLES
```
Input:  [1, 2, 3, 4, 5]
Output: [5, 4, 3, 2, 1]

Input:  [1, 2, 3, 4]
Output: [4, 3, 2, 1]

Input:  [7]
Output: [7]
```

### **PATTERN: Two Pointers (Converging)**

### BRUTE FORCE APPROACH
Create a new array, fill it from the end of the original.
- Time: O(n)
- Space: O(n) — requires extra array

### OPTIMAL APPROACH
Two pointers at opposite ends, swap and move inward until they meet.

```javascript
function reverseArray(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    // Swap
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }

  return arr;
}

// Test
console.log(reverseArray([1, 2, 3, 4, 5])); // [5, 4, 3, 2, 1]
console.log(reverseArray([1, 2, 3, 4]));     // [4, 3, 2, 1]
```

- Time: O(n) — n/2 swaps
- Space: O(1) — in-place

### WHY THIS PATTERN
Use **Two Pointers (Converging)** when you need to process pairs of elements from opposite ends simultaneously — reversals, palindrome checks, and certain sum problems. The pointers naturally meet in the middle, so you never do redundant work.

---

## Problem 3 — Check if Array is Sorted

### PROBLEM STATEMENT
Return `true` if the array is sorted in non-decreasing order, `false` otherwise.

### EXAMPLES
```
Input:  [1, 2, 3, 4, 5]
Output: true

Input:  [1, 3, 2, 4, 5]
Output: false

Input:  [1, 1, 2, 3]
Output: true  (equal elements are fine for non-decreasing)

Input:  []
Output: true
```

### **PATTERN: Linear Scan**

### BRUTE FORCE APPROACH
Compare every pair (i, j) where i < j to check arr[i] <= arr[j]. O(n²).

### OPTIMAL APPROACH
Only compare adjacent elements. One violation = not sorted.

```javascript
function isSorted(arr) {
  if (arr.length <= 1) return true;

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false; // Found a violation — stop immediately
  }

  return true;
}

// Test
console.log(isSorted([1, 2, 3, 4, 5])); // true
console.log(isSorted([1, 3, 2, 4, 5])); // false
console.log(isSorted([1, 1, 2, 3]));     // true
```

- Time: O(n) — one pass, early exit on first violation
- Space: O(1)

### WHY THIS PATTERN
**Linear Scan with early exit** is ideal for validation problems — you're checking a condition that must hold for every adjacent pair. The moment it fails, you're done. In the best case (violation at index 1) this is O(1). Comparing all pairs is wasteful since arr[i] <= arr[i+1] transitively implies arr[i] <= arr[i+2].

---

## Problem 4 — Remove Duplicates from Sorted Array

### PROBLEM STATEMENT
Given a sorted array, remove duplicates in-place so each unique element appears only once. Return the count of unique elements. (LeetCode 26)

### EXAMPLES
```
Input:  [1, 1, 2, 3, 3, 4]
Output: 4  (array becomes [1, 2, 3, 4, ...])

Input:  [0, 0, 1, 1, 1, 2, 2, 3]
Output: 4  (array becomes [0, 1, 2, 3, ...])

Input:  [1]
Output: 1
```

### **PATTERN: Two Pointers (Slow/Fast)**

### BRUTE FORCE APPROACH
Use a Set, collect unique elements, copy back. Requires O(n) extra space.

### OPTIMAL APPROACH
`slow` pointer marks where next unique goes. `fast` pointer scans ahead. When fast finds a new value (different from slow), copy it forward.

```javascript
function removeDuplicates(arr) {
  if (arr.length === 0) return 0;

  let slow = 0; // Position to place next unique element

  for (let fast = 1; fast < arr.length; fast++) {
    if (arr[fast] !== arr[slow]) {
      // New unique value found
      slow++;
      arr[slow] = arr[fast];
    }
    // If arr[fast] === arr[slow], skip it (duplicate)
  }

  return slow + 1; // Count of unique elements
}

// Test
const arr = [1, 1, 2, 3, 3, 4];
const count = removeDuplicates(arr);
console.log(count);           // 4
console.log(arr.slice(0, count)); // [1, 2, 3, 4]
```

- Time: O(n) — single pass
- Space: O(1) — in-place

### WHY THIS PATTERN
**Slow/Fast Two Pointers** work when you need to filter elements in-place. The slow pointer tracks the "write position" (valid output so far) and the fast pointer reads ahead. This pattern appears constantly — removing elements, compacting arrays, squeezing out values that fail a condition. The array being sorted is key here: duplicates are adjacent, so one comparison catches them all.

---

## Problem 5 — Move All Zeros to End

### PROBLEM STATEMENT
Move all zeroes in an array to the end while maintaining the relative order of non-zero elements. Do it in-place. (LeetCode 283)

### EXAMPLES
```
Input:  [0, 1, 0, 3, 12]
Output: [1, 3, 12, 0, 0]

Input:  [0, 0, 1]
Output: [1, 0, 0]

Input:  [1, 2, 3]
Output: [1, 2, 3]  (no change)
```

### **PATTERN: Two Pointers (Slow/Fast)**

### BRUTE FORCE APPROACH
Collect all non-zeros in a new array, then fill remaining spots with zeros. O(n) time but O(n) space.

### OPTIMAL APPROACH
`slow` points to next position for a non-zero. `fast` scans. When fast finds a non-zero, place it at slow's position.

```javascript
function moveZeros(arr) {
  let slow = 0; // Next position to place a non-zero

  // Pass 1: push all non-zeros to the front
  for (let fast = 0; fast < arr.length; fast++) {
    if (arr[fast] !== 0) {
      arr[slow] = arr[fast];
      slow++;
    }
  }

  // Pass 2: fill remaining positions with zeros
  while (slow < arr.length) {
    arr[slow] = 0;
    slow++;
  }

  return arr;
}

// Test
console.log(moveZeros([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]
console.log(moveZeros([0, 0, 1]));         // [1, 0, 0]
```

- Time: O(n) — two passes but still linear
- Space: O(1) — in-place

### WHY THIS PATTERN
Same slow/fast pattern as Problem 4. When you need to "partition" an array in-place (keep some elements, discard or move others), the slow pointer tracks the boundary between the "good" section and the "pending" section. Here: non-zeros go left of slow, zeros fill in after.

---

## Problem 6 — Find Missing Number (1 to N)

### PROBLEM STATEMENT
Given an array of n distinct numbers in the range [1, n+1] with exactly one number missing, find the missing number.

### EXAMPLES
```
Input:  [1, 2, 4, 5, 6]  (n=5, range 1-6)
Output: 3

Input:  [2, 3, 4, 5, 6]  (n=5, range 1-6)
Output: 1

Input:  [1, 2, 3, 4, 5]  (n=5, range 1-6)
Output: 6
```

### **PATTERN: Math / Gauss Formula**

### BRUTE FORCE APPROACH
Sort the array, scan for the gap. O(n log n) time.

### OPTIMAL APPROACH
Expected sum of 1 to (n+1) = (n+1)(n+2)/2. Subtract actual sum. The difference is the missing number.

```javascript
function findMissingNumber(arr) {
  const n = arr.length; // Array has n elements, range is 1 to n+1

  // Gauss formula: sum of 1 to (n+1)
  const expectedSum = ((n + 1) * (n + 2)) / 2;

  // Actual sum of the array
  const actualSum = arr.reduce((sum, num) => sum + num, 0);

  return expectedSum - actualSum;
}

// Test
console.log(findMissingNumber([1, 2, 4, 5, 6])); // 3
console.log(findMissingNumber([2, 3, 4, 5, 6])); // 1
console.log(findMissingNumber([1, 2, 3, 4, 5])); // 6
```

- Time: O(n) — one pass for sum
- Space: O(1) — two variables

### WHY THIS PATTERN
The **Gauss/Math pattern** works when there's a mathematical relationship you can exploit. Instead of tracking "which number I've seen," compute what the answer must be from a formula. The XOR variant is also popular: XOR all numbers 1 to (n+1), then XOR the array — remaining bits are the missing number. Both are O(n) time, O(1) space, and avoid hashing or sorting.

---

## Problem 7 — Find Duplicate in Array

### PROBLEM STATEMENT
Given an array of integers, find the first element that appears more than once. Return -1 if no duplicate exists.

### EXAMPLES
```
Input:  [1, 3, 4, 2, 2]
Output: 2

Input:  [3, 1, 3, 4, 2]
Output: 3

Input:  [1, 2, 3, 4]
Output: -1
```

### **PATTERN: Frequency Counter (Hash Set)**

### BRUTE FORCE APPROACH
Nested loop — for each element, check if it appears again. O(n²) time.

### OPTIMAL APPROACH
Use a Set to track elements seen so far. First time we try to add an element already in the set — that's the duplicate.

```javascript
function findDuplicate(arr) {
  const seen = new Set();

  for (const num of arr) {
    if (seen.has(num)) return num; // Seen before = duplicate
    seen.add(num);
  }

  return -1;
}

// Test
console.log(findDuplicate([1, 3, 4, 2, 2])); // 2
console.log(findDuplicate([3, 1, 3, 4, 2])); // 3
console.log(findDuplicate([1, 2, 3, 4]));    // -1
```

- Time: O(n) — one pass
- Space: O(n) — Set stores up to n elements

### WHY THIS PATTERN
**Frequency Counter** trades space for time — instead of comparing every pair (O(n²)), remember what you've seen in a hash structure for O(1) lookups. Use it when you need to detect repeats, count occurrences, or check membership as you scan. If space is constrained and values are in range [1, n], the Floyd's cycle detection (O(1) space) is the follow-up.

---

## Problem 8 — Merge Two Sorted Arrays

### PROBLEM STATEMENT
Given two sorted arrays, merge them into one sorted array.

### EXAMPLES
```
Input:  [1, 3, 5, 7], [2, 4, 6, 8]
Output: [1, 2, 3, 4, 5, 6, 7, 8]

Input:  [1, 2, 3], [4, 5, 6]
Output: [1, 2, 3, 4, 5, 6]

Input:  [1, 5, 9], [2, 3, 4, 6, 7]
Output: [1, 2, 3, 4, 5, 6, 7, 9]
```

### **PATTERN: Two Pointers (Parallel Walk)**

### BRUTE FORCE APPROACH
Concatenate both arrays, then sort. O((n+m) log(n+m)) time — wastes the fact that both arrays are already sorted.

### OPTIMAL APPROACH
Two pointers — one per array. Always pick the smaller current element and advance that pointer.

```javascript
function mergeSortedArrays(arr1, arr2) {
  const result = [];
  let i = 0; // Pointer for arr1
  let j = 0; // Pointer for arr2

  // Compare heads of both arrays, take the smaller one
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr2[j]);
      j++;
    }
  }

  // One array is exhausted — append the rest of the other
  while (i < arr1.length) result.push(arr1[i++]);
  while (j < arr2.length) result.push(arr2[j++]);

  return result;
}

// Test
console.log(mergeSortedArrays([1, 3, 5, 7], [2, 4, 6, 8]));
// [1, 2, 3, 4, 5, 6, 7, 8]
```

- Time: O(n + m) — each element processed once
- Space: O(n + m) — result array

### WHY THIS PATTERN
**Two Pointers (Parallel Walk)** exploits the sorted property. Because both arrays are sorted, you only need to compare the current front of each. This is the core of Merge Sort's merge step. If you're merging in-place (LeetCode 88), you start from the end to avoid overwriting — but same pointer logic.

---

## Problem 9 — Rotate Array by K Positions

### PROBLEM STATEMENT
Rotate an array to the right by k positions in-place. (LeetCode 189)

### EXAMPLES
```
Input:  arr = [1, 2, 3, 4, 5, 6, 7], k = 3
Output: [5, 6, 7, 1, 2, 3, 4]

Input:  arr = [1, 2], k = 3
Output: [2, 1]  (k=3 mod 2 = 1, rotate by 1)

Input:  arr = [1, 2, 3], k = 0
Output: [1, 2, 3]
```

### **PATTERN: Reverse Trick**

### BRUTE FORCE APPROACH
Rotate one position at a time, k times. O(n × k) time.
Or: use extra array — copy last k elements first, then first n-k. O(n) time, O(n) space.

### OPTIMAL APPROACH
Three reverses in-place:
1. Reverse the whole array
2. Reverse first k elements
3. Reverse remaining n-k elements

```javascript
function rotate(arr, k) {
  const n = arr.length;
  k = k % n; // Handle k > n (rotating by n = no change)
  if (k === 0) return arr;

  function reverse(start, end) {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  }

  reverse(0, n - 1);     // Step 1: reverse entire array
  reverse(0, k - 1);     // Step 2: reverse first k elements
  reverse(k, n - 1);     // Step 3: reverse rest

  return arr;
}

// Test
// [1,2,3,4,5,6,7] → reverse all → [7,6,5,4,3,2,1]
// → reverse first 3 → [5,6,7,4,3,2,1]
// → reverse last 4 → [5,6,7,1,2,3,4] ✓
console.log(rotate([1, 2, 3, 4, 5, 6, 7], 3)); // [5, 6, 7, 1, 2, 3, 4]
```

- Time: O(n) — three passes
- Space: O(1) — in-place

### WHY THIS PATTERN
The **Reverse Trick** is a classic in-place transformation. The insight: rotating right by k is equivalent to reversing three segments. It's non-obvious but elegant and O(1) space — interviewers love asking "can you do it without extra space?" and this is the answer.

---

## Problem 10 — Find Second Largest Element

### PROBLEM STATEMENT
Find the second largest distinct element in an array. Return -1 if it doesn't exist.

### EXAMPLES
```
Input:  [12, 35, 1, 10, 34, 1]
Output: 34

Input:  [10, 10, 10]
Output: -1  (no second distinct element)

Input:  [1, 2]
Output: 1
```

### **PATTERN: Linear Scan (Track Two Variables)**

### BRUTE FORCE APPROACH
Sort descending, scan for first element different from the largest. O(n log n).

### OPTIMAL APPROACH
Single pass tracking both `largest` and `secondLargest`.

```javascript
function secondLargest(arr) {
  let largest = -Infinity;
  let second = -Infinity;

  for (const num of arr) {
    if (num > largest) {
      second = largest; // Old largest becomes second
      largest = num;
    } else if (num > second && num !== largest) {
      // num is between second and largest (also handles distinct check)
      second = num;
    }
  }

  return second === -Infinity ? -1 : second;
}

// Test
console.log(secondLargest([12, 35, 1, 10, 34, 1])); // 34
console.log(secondLargest([10, 10, 10]));            // -1
console.log(secondLargest([1, 2]));                  // 1
```

- Time: O(n) — one pass
- Space: O(1)

### WHY THIS PATTERN
Extension of the "track best so far" linear scan. When you need the top-K values where K is small and fixed, maintain K variables instead of sorting. For K=2: track `largest` and `second`. For K=3: add `third`. Beyond K=4–5, use a min-heap.

---

## Problem 11 — Count Frequency of Each Element

### PROBLEM STATEMENT
Given an array, return an object/map where each key is a unique element and its value is the number of times it appears.

### EXAMPLES
```
Input:  [1, 2, 2, 3, 3, 3, 4]
Output: { 1: 1, 2: 2, 3: 3, 4: 1 }

Input:  ['a', 'b', 'a', 'c', 'b', 'a']
Output: { a: 3, b: 2, c: 1 }

Input:  [5]
Output: { 5: 1 }
```

### **PATTERN: Frequency Counter (Hash Map)**

### BRUTE FORCE APPROACH
For each element, count how many times it appears by scanning the whole array. O(n²) time.

### OPTIMAL APPROACH
Single pass — build a hash map counting occurrences.

```javascript
function countFrequency(arr) {
  const freq = {};

  for (const item of arr) {
    freq[item] = (freq[item] || 0) + 1;
    // If key doesn't exist yet: freq[item] = 0 + 1 = 1
    // If it does: increment by 1
  }

  return freq;
}

// Test
console.log(countFrequency([1, 2, 2, 3, 3, 3, 4]));
// { '1': 1, '2': 2, '3': 3, '4': 1 }

// Find most frequent element
function mostFrequent(arr) {
  const freq = countFrequency(arr);
  return Object.entries(freq).reduce((a, b) => b[1] > a[1] ? b : a)[0];
}
console.log(mostFrequent([1, 2, 2, 3, 3, 3, 4])); // '3'
```

- Time: O(n)
- Space: O(k) where k = number of unique elements

### WHY THIS PATTERN
**Frequency Counter** is the go-to for any problem involving counts, frequencies, or "how many times" questions. Build it once in O(n), then all subsequent lookups are O(1). This pattern underlies anagram checking, character counting, and is step 1 in many sorting algorithms (counting sort).

---

## Problem 12 — Find Intersection of Two Arrays

### PROBLEM STATEMENT
Return an array containing all elements that appear in both arrays. Each element in the result should appear only once. (LeetCode 349)

### EXAMPLES
```
Input:  [1, 2, 2, 1], [2, 2]
Output: [2]

Input:  [4, 9, 5], [9, 4, 9, 8, 4]
Output: [4, 9]  (order doesn't matter)

Input:  [1, 2, 3], [4, 5, 6]
Output: []
```

### **PATTERN: Hash Set**

### BRUTE FORCE APPROACH
Nested loop — for each element in arr1, check if it's in arr2. O(n × m) time.

### OPTIMAL APPROACH
Put one array in a Set (O(1) lookup), then check each element of the other array against it.

```javascript
function intersection(arr1, arr2) {
  const set1 = new Set(arr1); // O(n) to build
  const result = new Set();   // Use Set so no duplicates in output

  for (const num of arr2) {
    if (set1.has(num)) {    // O(1) lookup
      result.add(num);
    }
  }

  return [...result];
}

// Test
console.log(intersection([1, 2, 2, 1], [2, 2]));         // [2]
console.log(intersection([4, 9, 5], [9, 4, 9, 8, 4]));   // [9, 4]
```

- Time: O(n + m) — build set O(n), check O(m)
- Space: O(n) — set of first array

### WHY THIS PATTERN
Convert one array to a **Hash Set** whenever you need fast membership testing. Without the set, checking "is this in arr1?" costs O(n) per check → O(nm) total. With the set it's O(1) per check → O(n+m) total. This trick (convert to set, then check) applies to intersection, difference, and "is this element common?" problems.

---

## Problem 13 — Find Union of Two Arrays

### PROBLEM STATEMENT
Return an array containing all distinct elements from both arrays combined.

### EXAMPLES
```
Input:  [1, 2, 3], [3, 4, 5]
Output: [1, 2, 3, 4, 5]

Input:  [1, 1, 2], [2, 3, 3]
Output: [1, 2, 3]

Input:  [1, 2], [1, 2]
Output: [1, 2]
```

### **PATTERN: Hash Set**

### BRUTE FORCE APPROACH
Concatenate, sort, remove duplicates. O((n+m) log(n+m)).

### OPTIMAL APPROACH
Merge both arrays into a Set (automatically deduplicates), then spread to array.

```javascript
function union(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])];
}

// Explicit version (for understanding)
function unionExplicit(arr1, arr2) {
  const seen = new Set();
  const result = [];

  for (const num of [...arr1, ...arr2]) {
    if (!seen.has(num)) {
      seen.add(num);
      result.push(num);
    }
  }

  return result;
}

// Test
console.log(union([1, 2, 3], [3, 4, 5]));  // [1, 2, 3, 4, 5]
console.log(union([1, 1, 2], [2, 3, 3]));  // [1, 2, 3]
```

- Time: O(n + m)
- Space: O(n + m)

### WHY THIS PATTERN
Set's fundamental property is **unique membership** — adding a duplicate is a no-op. Whenever a problem asks for "distinct" or "unique" elements from any combination of inputs, reach for a Set. Creating a Set from an iterable deduplicates automatically in O(n).

---

## Problem 14 — Check if Pair with Given Sum Exists

### PROBLEM STATEMENT
Given an array of integers and a target sum, return true if any two distinct elements in the array add up to the target.

### EXAMPLES
```
Input:  [2, 7, 11, 15], target = 9
Output: true  (2 + 7 = 9)

Input:  [1, 2, 3, 9], target = 8
Output: false

Input:  [1, 2, 4, 4], target = 8
Output: true  (4 + 4 = 8, two different positions)
```

### **PATTERN: Hash Map Complement / Two Pointers**

### BRUTE FORCE APPROACH
Check every pair (i, j) where i ≠ j. O(n²) time.

### OPTIMAL APPROACH — Hash Set

```javascript
// Hash Set approach — works on unsorted arrays
function hasPairWithSum(arr, target) {
  const seen = new Set();

  for (const num of arr) {
    const complement = target - num;
    if (seen.has(complement)) return true; // Found the pair!
    seen.add(num);
  }

  return false;
}

// Two Pointers approach — requires sorted array
function hasPairWithSumSorted(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return true;
    if (sum < target) left++;   // Need bigger sum → move left right
    else right--;               // Need smaller sum → move right left
  }

  return false;
}

// Test
console.log(hasPairWithSum([2, 7, 11, 15], 9));  // true
console.log(hasPairWithSum([1, 2, 3, 9], 8));    // false
```

- Time: O(n) both approaches (sorting adds O(n log n) for two pointers)
- Space: O(n) for hash set, O(1) for two pointers on sorted array

### WHY THIS PATTERN
The **complement trick**: for every number x, the only partner that makes target is (target - x). Instead of looking for the partner by scanning forward (O(n) per element), check the "have I seen the complement?" question in O(1) with a hash set. This reduces O(n²) to O(n). This is the exact foundation of Two Sum (LeetCode 1).

---

## Problem 15 — Best Time to Buy and Sell Stock

### PROBLEM STATEMENT
Given an array where `prices[i]` is the price of a stock on day i, find the maximum profit you can make by buying on one day and selling on a later day. Return 0 if no profit is possible. (LeetCode 121)

### EXAMPLES
```
Input:  [7, 1, 5, 3, 6, 4]
Output: 5  (buy at 1, sell at 6)

Input:  [7, 6, 4, 3, 1]
Output: 0  (prices only fall — no profit possible)

Input:  [2, 4, 1, 7]
Output: 6  (buy at 1, sell at 7)
```

### **PATTERN: Kadane Variant / Track Running Minimum**

### BRUTE FORCE APPROACH
Try every pair (buy day, sell day) where buy < sell. O(n²).

### OPTIMAL APPROACH
Single pass: track the minimum price seen so far (`minPrice`). At each day, the best profit IF we sell today = `currentPrice - minPrice`. Track the max of all these.

```javascript
function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    if (price < minPrice) {
      minPrice = price;        // Found a cheaper buy price
    } else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice; // Found a better sell price
    }
  }

  return maxProfit;
}

// Test
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5
console.log(maxProfit([7, 6, 4, 3, 1]));    // 0
console.log(maxProfit([2, 4, 1, 7]));       // 6
```

- Time: O(n) — one pass
- Space: O(1)

### WHY THIS PATTERN
This is a **greedy scan** — at each point, you optimistically compute "what's the best I could do if I sold RIGHT NOW?" and update the running answer. You never need to go back. The insight: if you're going to sell on day i, you want to have bought at the lowest price among days 0 to i-1, which `minPrice` tracks as you go. This greedy + linear scan pattern appears in all "single pass optimal decision" problems.

---

## Pattern Summary

| Problem | Pattern | Time | Space |
|---------|---------|------|-------|
| Max/Min | Linear Scan | O(n) | O(1) |
| Reverse array | Two Pointers (converging) | O(n) | O(1) |
| Is sorted | Linear Scan + early exit | O(n) | O(1) |
| Remove duplicates | Two Pointers (slow/fast) | O(n) | O(1) |
| Move zeros | Two Pointers (slow/fast) | O(n) | O(1) |
| Missing number | Gauss formula | O(n) | O(1) |
| Find duplicate | Frequency Counter (Set) | O(n) | O(n) |
| Merge sorted | Two Pointers (parallel) | O(n+m) | O(n+m) |
| Rotate array | Reverse trick | O(n) | O(1) |
| Second largest | Linear Scan (2 vars) | O(n) | O(1) |
| Count frequency | Frequency Counter (Map) | O(n) | O(k) |
| Intersection | Hash Set | O(n+m) | O(n) |
| Union | Hash Set | O(n+m) | O(n+m) |
| Pair with sum | Hash Set complement | O(n) | O(n) |
| Stock profit | Greedy scan | O(n) | O(1) |
