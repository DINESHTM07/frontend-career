# Arrays — Medium Problems

10 medium array problems. Each introduces a pattern that generalizes to dozens of other problems. Don't just memorize solutions — internalize the pattern and the "why."

---

## Problem 1 — Two Sum

### PROBLEM STATEMENT
Given an array of integers and a target, return the **indices** of the two numbers that add up to the target. Exactly one solution exists. You may not use the same element twice. (LeetCode 1)

### EXAMPLES
```
Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]  (nums[0] + nums[1] = 2 + 7 = 9)

Input:  nums = [3, 2, 4], target = 6
Output: [1, 2]  (nums[1] + nums[2] = 2 + 4 = 6)

Input:  nums = [3, 3], target = 6
Output: [0, 1]
```

### **PATTERN: Hash Map Complement (Index Tracking)**

### BRUTE FORCE APPROACH
Check every pair (i, j) where i < j. Return when nums[i] + nums[j] === target.
- Time: O(n²)
- Space: O(1)

```javascript
// Brute force for reference
function twoSumBrute(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}
```

### OPTIMAL APPROACH
For each number, compute its complement `target - num`. If that complement is already in the map, we found the pair. Otherwise, store `num → index` in the map.

```javascript
function twoSum(nums, target) {
  // Map: value → index
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i]; // Found it! Return both indices
    }

    map.set(nums[i], i); // Store this number's index for future lookups
  }

  return []; // No solution (problem guarantees one exists)
}

// Test
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));      // [1, 2]
console.log(twoSum([3, 3], 6));         // [0, 1]
```

- Time: O(n) — one pass, O(1) map operations
- Space: O(n) — map stores up to n entries

**Trace through [2, 7, 11, 15], target=9:**
```
i=0: num=2, complement=7. Map empty. Store {2:0}
i=1: num=7, complement=2. Map has 2! Return [map.get(2), 1] = [0, 1] ✓
```

### WHY THIS PATTERN
The **complement trick** converts a "find two numbers" problem into a "find one number" problem. As you scan forward, you're not looking for two unknowns simultaneously — you're asking "have I already seen the partner for this element?" The Map stores `value → index` (not just value) because Two Sum requires returning indices, not values. This distinction from the Easy #14 (which only needed existence) shows how the same pattern adapts to different output requirements.

---

## Problem 2 — Container with Most Water

### PROBLEM STATEMENT
Given n non-negative integers representing heights of vertical lines, find two lines that together with the x-axis form a container that holds the most water. (LeetCode 11)

### EXAMPLES
```
Input:  heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]
Output: 49
Explanation: lines at index 1 (height=8) and index 8 (height=7)
             width = 8-1 = 7, height = min(8,7) = 7, area = 49

Input:  heights = [1, 1]
Output: 1

Input:  heights = [4, 3, 2, 1, 4]
Output: 16  (index 0 and 4: width=4, height=min(4,4)=4, area=16)
```

### **PATTERN: Two Pointers (Greedy Convergence)**

### BRUTE FORCE APPROACH
Try every pair of lines (i, j), compute area = min(h[i], h[j]) × (j - i).
- Time: O(n²)
- Space: O(1)

### OPTIMAL APPROACH
Start with the widest possible container (pointers at both ends). Move the pointer with the **shorter** height inward — because moving the taller one can never increase the area (width decreases, height bounded by the shorter).

```javascript
function maxArea(heights) {
  let left = 0;
  let right = heights.length - 1;
  let maxWater = 0;

  while (left < right) {
    const width = right - left;
    const height = Math.min(heights[left], heights[right]);
    const area = width * height;
    maxWater = Math.max(maxWater, area);

    // Move the shorter pointer inward — moving the taller can never help
    if (heights[left] <= heights[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}

// Test
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxArea([1, 1]));                        // 1
console.log(maxArea([4, 3, 2, 1, 4]));               // 16
```

- Time: O(n) — each pointer moves at most n times
- Space: O(1)

**Why move the shorter pointer?**
Area = min(h[L], h[R]) × (R - L). If we move the taller pointer inward:
- Width decreases by 1
- Height is still capped by the shorter side
- Area can only stay the same or decrease

If we move the shorter pointer:
- Width decreases by 1
- But we might find a taller line → height could increase → area might increase

### WHY THIS PATTERN
**Two Pointers (Greedy Convergence)** works when you can prove that certain moves are never beneficial. The key insight is an elimination argument: "I can prove I never need to check this pair." Starting from the widest container and moving inward while keeping the greedy choice (always move shorter) guarantees we check all potentially optimal pairs. This same reasoning drives the proof for Three Sum's inner loop.

---

## Problem 3 — Three Sum

### PROBLEM STATEMENT
Find all unique triplets in the array that sum to zero. The solution set must not contain duplicate triplets. (LeetCode 15)

### EXAMPLES
```
Input:  [-1, 0, 1, 2, -1, -4]
Output: [[-1, -1, 2], [-1, 0, 1]]

Input:  [0, 0, 0]
Output: [[0, 0, 0]]

Input:  [0, 1, 1]
Output: []
```

### **PATTERN: Sort + Two Pointers (Fix one, scan two)**

### BRUTE FORCE APPROACH
Three nested loops, check every triplet (i, j, k). Deduplicate with a Set.
- Time: O(n³)
- Space: O(n) for result storage

### OPTIMAL APPROACH
Sort first. Fix one element (outer loop), then use Two Pointers on the rest.

```javascript
function threeSum(nums) {
  nums.sort((a, b) => a - b); // Sort ascending
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    // Skip duplicate values for the fixed element
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    // If smallest possible triplet sum > 0, no point continuing
    if (nums[i] > 0) break;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        // Skip duplicates for left and right
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;  // Sum too small, move left right to increase it
      } else {
        right--; // Sum too large, move right left to decrease it
      }
    }
  }

  return result;
}

// Test
console.log(threeSum([-1, 0, 1, 2, -1, -4]));
// [[-1, -1, 2], [-1, 0, 1]]

console.log(threeSum([0, 0, 0]));
// [[0, 0, 0]]
```

- Time: O(n²) — O(n log n) sort + O(n) outer loop × O(n) two-pointer inner = O(n²)
- Space: O(1) extra (result space not counted)

**Trace for [-4, -1, -1, 0, 1, 2] (sorted):**
```
i=0: nums[i]=-4. left=1(-1), right=5(2). sum=-3 < 0 → left++
     left=2(-1), right=5(2). sum=-3 < 0 → left++  ...no triplet
i=1: nums[i]=-1. left=2(-1), right=5(2). sum=0 → FOUND [-1,-1,2]
     After dedup: left=3(0), right=4(1). sum=0 → FOUND [-1,0,1]
i=2: nums[2]=-1 === nums[1]=-1 → SKIP (duplicate)
i=3: nums[i]=0 > 0 already? No (0 is not > 0). left=4, right=5. sum=1 > 0 → right--. Done.
```

### WHY THIS PATTERN
**Fix one, search two with Two Pointers** reduces a 3-variable problem to a 2-variable problem you already know how to solve. Sorting is the key enabler — it makes the two-pointer logic work (you know which direction to move) AND makes deduplication easy (identical values are adjacent). The same approach extends to 4Sum (fix two, two-pointer the rest) in O(n³).

---

## Problem 4 — Maximum Subarray Sum (Kadane's Algorithm)

### PROBLEM STATEMENT
Find the contiguous subarray with the largest sum. Return the sum. (LeetCode 53)

### EXAMPLES
```
Input:  [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6  (subarray [4, -1, 2, 1])

Input:  [1]
Output: 1

Input:  [-1, -2, -3]
Output: -1  (all negative — best is just the least-negative element)
```

### **PATTERN: Kadane's Algorithm (Dynamic Sliding Window)**

### BRUTE FORCE APPROACH
Try every subarray (i, j), compute sum. O(n²) or O(n³) depending on implementation.

### OPTIMAL APPROACH
At each position, decide: extend the current subarray OR start fresh from here?

```javascript
function maxSubarraySum(nums) {
  let currentSum = nums[0];  // Best sum ending at current position
  let maxSum = nums[0];      // Best sum seen overall

  for (let i = 1; i < nums.length; i++) {
    // Choice: extend current subarray OR start a new one here
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    // If currentSum went negative, starting fresh at nums[i] is better

    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

// Test
console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubarraySum([1]));                              // 1
console.log(maxSubarraySum([-1, -2, -3]));                     // -1

// Bonus: also return the subarray indices
function maxSubarrayWithIndices(nums) {
  let maxSum = nums[0], currentSum = nums[0];
  let start = 0, end = 0, tempStart = 0;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > currentSum + nums[i]) {
      currentSum = nums[i];
      tempStart = i;          // Potential new start
    } else {
      currentSum += nums[i];
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      start = tempStart;
      end = i;
    }
  }

  return { maxSum, subarray: nums.slice(start, end + 1) };
}
```

- Time: O(n) — one pass
- Space: O(1)

**Trace for [-2, 1, -3, 4, -1, 2, 1, -5, 4]:**
```
i=0: curr=-2, max=-2
i=1: max(-2+1, 1) = max(-1, 1) = 1. curr=1, max=1
i=2: max(1-3, -3) = max(-2, -3) = -2. curr=-2, max=1
i=3: max(-2+4, 4) = max(2, 4) = 4. curr=4, max=4
i=4: max(4-1, -1) = max(3, -1) = 3. curr=3, max=4
i=5: max(3+2, 2) = 5. curr=5, max=5
i=6: max(5+1, 1) = 6. curr=6, max=6  ← answer
i=7: max(6-5, -5) = 1. curr=1, max=6
i=8: max(1+4, 4) = 5. curr=5, max=6
```

### WHY THIS PATTERN
**Kadane's** is the textbook example of a greedy/DP hybrid. The key insight: a subarray ending at position i is either (1) just the element itself, or (2) the best subarray ending at i-1 extended by one. If extending makes it worse (currentSum goes negative), starting fresh is always better. This "local vs extend" decision made greedily at each step produces the global optimum. Foundational for all "maximum in a window" variants.

---

## Problem 5 — Product of Array Except Self

### PROBLEM STATEMENT
Given an array, return an array where `output[i]` equals the product of all elements except `nums[i]`. Solve without division and in O(n). (LeetCode 238)

### EXAMPLES
```
Input:  [1, 2, 3, 4]
Output: [24, 12, 8, 6]
        (24=2×3×4, 12=1×3×4, 8=1×2×4, 6=1×2×3)

Input:  [-1, 1, 0, -3, 3]
Output: [0, 0, 9, 0, 0]

Input:  [2, 3]
Output: [3, 2]
```

### **PATTERN: Prefix / Suffix Product**

### BRUTE FORCE APPROACH
For each index i, multiply all elements except i. O(n²) time.
OR: total product ÷ nums[i] — fails if any element is 0 (division undefined).

### OPTIMAL APPROACH
Two passes:
1. **Left pass**: `prefix[i]` = product of all elements to the LEFT of i
2. **Right pass**: Multiply by suffix (product of elements to the RIGHT of i) as we scan back

```javascript
function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);

  // Left pass: result[i] = product of everything to the left of i
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    result[i] = leftProduct;
    leftProduct *= nums[i]; // Update left product AFTER setting result[i]
  }
  // After: result = [1, 1, 2, 6] for input [1,2,3,4]
  // (result[0]=1 — nothing to left; result[1]=1; result[2]=2; result[3]=6)

  // Right pass: multiply result[i] by product of everything to the right of i
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightProduct;
    rightProduct *= nums[i]; // Update AFTER
  }
  // result[3] *= 1 = 6, result[2] *= 4 = 8, result[1] *= 12 = 12, result[0] *= 24 = 24

  return result;
}

// Test
console.log(productExceptSelf([1, 2, 3, 4]));       // [24, 12, 8, 6]
console.log(productExceptSelf([-1, 1, 0, -3, 3]));  // [0, 0, 9, 0, 0]
```

- Time: O(n) — two passes
- Space: O(1) extra (result array doesn't count)

**Visualization for [1, 2, 3, 4]:**
```
Index:        0    1    2    3
Left products: [1,   1,   2,   6]   (product of all to the LEFT)
Right products:[24,  12,  4,   1]   (product of all to the RIGHT)
Result:       [24,  12,  8,   6]   (left[i] × right[i])
```

### WHY THIS PATTERN
**Prefix/Suffix** works when each position's answer depends on everything before it AND everything after it. Computing two separate passes (one left-to-right accumulating prefix, one right-to-left accumulating suffix) and combining them is a common divide-and-conquer insight. Division-free approach handles zeros correctly. This pattern generalizes to prefix sums, prefix XOR, and prefix min/max for range queries.

---

## Problem 6 — Merge Intervals

### PROBLEM STATEMENT
Given an array of intervals `[start, end]`, merge all overlapping intervals and return the non-overlapping intervals that cover all intervals in the input. (LeetCode 56)

### EXAMPLES
```
Input:  [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: [1,3] and [2,6] overlap (2 is inside [1,3]) → merged to [1,6]

Input:  [[1,4],[4,5]]
Output: [[1,5]]  (touching endpoints count as overlapping)

Input:  [[1,4],[2,3]]
Output: [[1,4]]  (one interval completely inside another)
```

### **PATTERN: Sort + Sweep (Greedy)**

### BRUTE FORCE APPROACH
For every interval, check if it overlaps with every other interval. Merge and repeat until no more merges. O(n²) per round, multiple rounds.

### OPTIMAL APPROACH
Sort by start time. Scan left-to-right — if the current interval overlaps the last merged, extend it. Otherwise, start a new one.

```javascript
function mergeIntervals(intervals) {
  if (intervals.length <= 1) return intervals;

  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [intervals[0]]; // Start with first interval

  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1]; // Last merged interval

    // Two intervals [a,b] and [c,d] overlap if c <= b
    if (current[0] <= last[1]) {
      // Overlap — extend the last merged interval's end if needed
      last[1] = Math.max(last[1], current[1]);
    } else {
      // No overlap — add as new separate interval
      merged.push(current);
    }
  }

  return merged;
}

// Test
console.log(mergeIntervals([[1,3],[2,6],[8,10],[15,18]]));
// [[1,6],[8,10],[15,18]]

console.log(mergeIntervals([[1,4],[4,5]]));
// [[1,5]]

console.log(mergeIntervals([[1,4],[2,3]]));
// [[1,4]]
```

- Time: O(n log n) — dominated by sort; merge sweep is O(n)
- Space: O(n) — result

**Why sorting is the key:** Without sorting, you might miss an interval that starts before the current one and overlaps it. After sorting by start, overlapping intervals are always adjacent — you only need to look at the previous merged interval.

### WHY THIS PATTERN
**Sort + Greedy Sweep** appears in all interval problems (meeting rooms, calendar overlap, minimum platforms, etc.). Sorting brings related intervals together, eliminating the need to compare non-adjacent ones. Once sorted, a single left-to-right sweep with a simple merge condition handles everything. The key invariant: after sorting, if an interval doesn't overlap with the previous one, it can't overlap with any earlier one either.

---

## Problem 7 — Sort Colors (Dutch National Flag)

### PROBLEM STATEMENT
Given an array with values 0, 1, and 2 (representing red, white, blue), sort it in-place so all 0s come first, then 1s, then 2s. Do not use a library sort. (LeetCode 75)

### EXAMPLES
```
Input:  [2, 0, 2, 1, 1, 0]
Output: [0, 0, 1, 1, 2, 2]

Input:  [2, 0, 1]
Output: [0, 1, 2]

Input:  [0]
Output: [0]
```

### **PATTERN: Three Pointers (Dutch National Flag)**

### BRUTE FORCE APPROACH
Count 0s, 1s, 2s (two passes), then rewrite array. O(n) but two passes.
OR: regular sort. O(n log n).

### OPTIMAL APPROACH
Single pass with three pointers:
- `low`: boundary between 0s and 1s (everything left of low is 0)
- `mid`: current element being examined
- `high`: boundary between 1s and 2s (everything right of high is 2)

```javascript
function sortColors(nums) {
  let low = 0;            // Next position for 0
  let mid = 0;            // Current element
  let high = nums.length - 1; // Next position for 2 (from right)

  while (mid <= high) {
    if (nums[mid] === 0) {
      // Swap with low — put 0 in its zone
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++; // nums[low] was either 0 or 1 (already processed), safe to advance
    } else if (nums[mid] === 1) {
      mid++; // 1 is already in the right zone — just advance
    } else {
      // nums[mid] === 2
      // Swap with high — put 2 in its zone
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
      // DON'T advance mid — the swapped-in element is unknown, re-examine it
    }
  }

  return nums;
}

// Test
console.log(sortColors([2, 0, 2, 1, 1, 0])); // [0, 0, 1, 1, 2, 2]
console.log(sortColors([2, 0, 1]));           // [0, 1, 2]
```

- Time: O(n) — single pass, each element processed once
- Space: O(1) — in-place

**Trace for [2, 0, 2, 1, 1, 0]:**
```
low=0, mid=0, high=5. nums[mid]=2 → swap(0,5) → [0,0,2,1,1,2]. high=4
low=0, mid=0, high=4. nums[mid]=0 → swap(0,0) → [0,0,2,1,1,2]. low=1,mid=1
low=1, mid=1, high=4. nums[mid]=0 → swap(1,1) → same. low=2,mid=2
low=2, mid=2, high=4. nums[mid]=2 → swap(2,4) → [0,0,1,1,2,2]. high=3
low=2, mid=2, high=3. nums[mid]=1 → mid=3
low=2, mid=3, high=3. nums[mid]=1 → mid=4. mid>high → STOP
Result: [0, 0, 1, 1, 2, 2] ✓
```

### WHY THIS PATTERN
**Dutch National Flag (3-way partition)** is the generalized two-pointer technique for 3 categories. The critical insight: when you swap from high to mid, the incoming element is unknown (mid hasn't processed it), so you must not advance mid. When you swap from low to mid, the incoming element was already processed (low only catches up to mid), so advancing mid is safe. This asymmetry is what trips people up. Used as the partition step in 3-way QuickSort.

---

## Problem 8 — Spiral Matrix Traversal

### PROBLEM STATEMENT
Given an m×n matrix, return all elements in spiral order (clockwise from top-left). (LeetCode 54)

### EXAMPLES
```
Input:  [[1, 2, 3],
         [4, 5, 6],
         [7, 8, 9]]
Output: [1, 2, 3, 6, 9, 8, 7, 4, 5]

Input:  [[1,  2,  3,  4],
         [5,  6,  7,  8],
         [9, 10, 11, 12]]
Output: [1,2,3,4,8,12,11,10,9,5,6,7]
```

### **PATTERN: Boundary Shrinking (Layer-by-Layer)**

### BRUTE FORCE APPROACH
Track visited cells with a boolean matrix and simulate direction changes. O(nm) time and O(nm) space for visited.

### OPTIMAL APPROACH
Maintain four boundaries (top, bottom, left, right). After traversing each side, shrink that boundary inward.

```javascript
function spiralOrder(matrix) {
  const result = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    // Traverse top row: left → right
    for (let col = left; col <= right; col++) {
      result.push(matrix[top][col]);
    }
    top++; // Shrink top boundary

    // Traverse right column: top → bottom
    for (let row = top; row <= bottom; row++) {
      result.push(matrix[row][right]);
    }
    right--; // Shrink right boundary

    // Traverse bottom row: right → left (only if row still exists)
    if (top <= bottom) {
      for (let col = right; col >= left; col--) {
        result.push(matrix[bottom][col]);
      }
      bottom--; // Shrink bottom boundary
    }

    // Traverse left column: bottom → top (only if column still exists)
    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        result.push(matrix[row][left]);
      }
      left++; // Shrink left boundary
    }
  }

  return result;
}

// Test
console.log(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]));
// [1,2,3,6,9,8,7,4,5]

console.log(spiralOrder([[1,2,3,4],[5,6,7,8],[9,10,11,12]]));
// [1,2,3,4,8,12,11,10,9,5,6,7]
```

- Time: O(n × m) — visit every element once
- Space: O(1) extra (result not counted)

**Guards: Why check `if (top <= bottom)` and `if (left <= right)`?**
For non-square matrices or single row/column matrices, after traversing top and right, the "bottom" row or "left" column may have already been covered. The guards prevent double-counting.

### WHY THIS PATTERN
**Boundary Shrinking** elegantly handles the decreasing-scope nature of spiral traversal without direction arrays or visited sets. Each layer is processed by four boundary traversals, then the boundaries shrink inward. This "peel the onion" mental model applies to any problem where you process a 2D structure from outside in (or inside out). The same pattern is used in matrix rotation.

---

## Problem 9 — Next Permutation

### PROBLEM STATEMENT
Find the next lexicographically greater permutation of an array of integers. If no next permutation exists (array is descending), rearrange to the smallest (ascending). Modify in-place. (LeetCode 31)

### EXAMPLES
```
Input:  [1, 2, 3]
Output: [1, 3, 2]

Input:  [3, 2, 1]
Output: [1, 2, 3]  (largest permutation → wrap to smallest)

Input:  [1, 1, 5]
Output: [1, 5, 1]

Input:  [1, 3, 2]
Output: [2, 1, 3]
```

### **PATTERN: Scan from Right (Find Pivot + Reverse)**

### BRUTE FORCE APPROACH
Generate all permutations sorted lexicographically, find current, return next. O(n! × n) — completely impractical.

### OPTIMAL APPROACH
Three steps:
1. Scan right-to-left to find the **pivot** — first index where `nums[i] < nums[i+1]` (the descending suffix starts AFTER the pivot)
2. Scan right-to-left again to find the **smallest element greater than pivot** and swap them
3. Reverse everything to the right of the pivot position (makes it the smallest ordering)

```javascript
function nextPermutation(nums) {
  const n = nums.length;

  // Step 1: Find pivot — rightmost position where sequence is still increasing
  let pivot = -1;
  for (let i = n - 2; i >= 0; i--) {
    if (nums[i] < nums[i + 1]) {
      pivot = i;
      break;
    }
  }

  // If no pivot: entire array is descending — just reverse (wrap around)
  if (pivot === -1) {
    nums.reverse();
    return nums;
  }

  // Step 2: Find rightmost element greater than nums[pivot]
  for (let j = n - 1; j > pivot; j--) {
    if (nums[j] > nums[pivot]) {
      [nums[pivot], nums[j]] = [nums[j], nums[pivot]]; // Swap
      break;
    }
  }

  // Step 3: Reverse the suffix after pivot (it's currently descending → reverse = ascending)
  let left = pivot + 1;
  let right = n - 1;
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }

  return nums;
}

// Test
console.log(nextPermutation([1, 2, 3])); // [1, 3, 2]
console.log(nextPermutation([3, 2, 1])); // [1, 2, 3]
console.log(nextPermutation([1, 3, 2])); // [2, 1, 3]
```

- Time: O(n) — three linear scans
- Space: O(1) — in-place

**Trace for [1, 3, 2]:**
```
Step 1: i=1: nums[1]=3 > nums[2]=2, skip. i=0: nums[0]=1 < nums[1]=3 → pivot=0
Step 2: j=2: nums[2]=2 > nums[0]=1 → swap → [2, 3, 1]
Step 3: Reverse suffix [1..2] → [3, 1] reversed = [1, 3] → [2, 1, 3] ✓
```

### WHY THIS PATTERN
The key insight is observing structure in the array: the **suffix that is already in descending order can't be made larger** without changing an element before it. The pivot is the "last thing we can meaningfully increment." After swapping with the smallest-larger element, the suffix is still descending — reversing it gives the lexicographically smallest arrangement of those elements, completing the "next" permutation. This scan-from-right approach directly observes the problem's mathematical structure.

---

## Problem 10 — Subarray Sum Equals K

### PROBLEM STATEMENT
Given an array of integers and a value k, return the total number of continuous subarrays whose sum equals k. (LeetCode 560)

### EXAMPLES
```
Input:  nums = [1, 1, 1], k = 2
Output: 2  ([1,1] starting at 0, [1,1] starting at 1)

Input:  nums = [1, 2, 3], k = 3
Output: 2  ([3] at index 2, [1,2] at indices 0-1)

Input:  nums = [1, -1, 1], k = 1
Output: 3  ([1], [-1,1,1]...wait: [1] at idx 0, [1,-1,1] sums to 1, [1] at idx 2)
```

### **PATTERN: Prefix Sum + Hash Map**

### BRUTE FORCE APPROACH
Try every subarray (i, j), compute its sum. O(n²) time.

### OPTIMAL APPROACH
Key insight: sum of subarray `[i..j]` = `prefixSum[j] - prefixSum[i-1]`. If this equals k, then `prefixSum[i-1] = prefixSum[j] - k`.

So: as we build the prefix sum, for each new prefix sum, check how many times `(currentPrefixSum - k)` has appeared before in the map.

```javascript
function subarraySum(nums, k) {
  const prefixCounts = new Map();
  prefixCounts.set(0, 1); // Empty subarray has prefix sum 0 (count 1)

  let count = 0;
  let prefixSum = 0;

  for (const num of nums) {
    prefixSum += num;

    // How many previous prefix sums equal (prefixSum - k)?
    // Those prefix sums define subarrays that sum to exactly k
    const complement = prefixSum - k;
    count += prefixCounts.get(complement) || 0;

    // Record this prefix sum
    prefixCounts.set(prefixSum, (prefixCounts.get(prefixSum) || 0) + 1);
  }

  return count;
}

// Test
console.log(subarraySum([1, 1, 1], 2)); // 2
console.log(subarraySum([1, 2, 3], 3)); // 2
console.log(subarraySum([1, -1, 1], 1)); // 3
```

- Time: O(n) — one pass, O(1) map operations
- Space: O(n) — map stores up to n prefix sums

**Trace for [1, 1, 1], k=2:**
```
Init: map={0:1}, count=0, prefix=0
num=1: prefix=1. complement=1-2=-1. map has no -1. count=0. map={0:1, 1:1}
num=1: prefix=2. complement=2-2=0.  map has 0 (count 1)! count=1. map={0:1,1:1,2:1}
num=1: prefix=3. complement=3-2=1.  map has 1 (count 1)! count=2. map={0:1,1:1,2:1,3:1}
Result: 2 ✓
```

**Why `prefixCounts.set(0, 1)` initialization?**
It handles subarrays starting from index 0. If `prefixSum[j] = k`, then `prefixSum[j] - k = 0`, which should contribute 1 to count. Seeding `{0: 1}` handles this.

### WHY THIS PATTERN
**Prefix Sum + Hash Map** transforms a "subarray with property X" problem into a "two-index sum equals target" problem, which the complement trick solves in O(1) per step. The prefix sum encodes all subarray sums implicitly: `sum(i..j) = prefix[j] - prefix[i-1]`. The map counts how many valid "left boundaries" exist for each current "right boundary." This pattern handles arrays with negative numbers (unlike the sliding window approach) because there's no monotonicity to exploit.

---

## Pattern Summary

| Problem | Pattern | Time | Space |
|---------|---------|------|-------|
| Two Sum | Hash Map complement | O(n) | O(n) |
| Container with most water | Two Pointers (greedy convergence) | O(n) | O(1) |
| Three Sum | Sort + Two Pointers (fix one) | O(n²) | O(1) |
| Maximum subarray (Kadane) | Greedy / DP local decision | O(n) | O(1) |
| Product except self | Prefix + Suffix product | O(n) | O(1) |
| Merge intervals | Sort + Sweep | O(n log n) | O(n) |
| Sort colors (DNF) | Three Pointers | O(n) | O(1) |
| Spiral matrix | Boundary Shrinking | O(nm) | O(1) |
| Next permutation | Scan from right + Reverse | O(n) | O(1) |
| Subarray sum = K | Prefix Sum + Hash Map | O(n) | O(n) |

---

## Connecting Patterns to Each Other

```
Hash Map/Set
  └── Two Sum (index tracking)
  └── Subarray Sum = K (prefix sum + complement)
  └── Easy #14 (pair with sum — value only, no index)

Two Pointers
  └── Container with Water (greedy convergence, unsorted)
  └── Three Sum (sorted, fix one + two pointers)
  └── Easy #2, #4, #5, #8 (converging, slow/fast, parallel)

Prefix Computation
  └── Product Except Self (prefix + suffix product)
  └── Subarray Sum = K (prefix sum)
  └── Range sum queries (prefix sum)

Greedy Scan (track best so far)
  └── Kadane's (local vs extend decision)
  └── Easy #15 Stock (running minimum)
  └── Easy #1 Max/Min (running max/min)

Sort + Process
  └── Merge Intervals (sort by start, sweep)
  └── Three Sum (sort enables two pointers + dedup)
  └── Dutch National Flag (3-way partition)
```
