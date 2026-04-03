# Searching & Sorting — 5 Problems

Sorting and searching are fundamental — most array problems reduce to one of these or use them as a preprocessing step.

**Key complexities to know:**
```
Binary Search:    O(log n) time, O(1) space  ← requires sorted array
Merge Sort:       O(n log n) time, O(n) space ← stable, consistent
Quick Sort:       O(n log n) avg, O(n²) worst, O(log n) space ← in-place, cache-friendly
Counting Sort:    O(n + k) time, O(k) space  ← integers in known range
```

---

## Problem 1 — Binary Search

### PROBLEM STATEMENT
Find the index of `target` in a sorted array. Return -1 if not found. (LeetCode 704)

### EXAMPLES
```
Input:  [-1,0,3,5,9,12], target=9  →  4
Input:  [-1,0,3,5,9,12], target=2  →  -1
Input:  [5], target=5              →  0
```

### **PATTERN: Divide Interval**

### BRUTE FORCE
Linear scan. O(n).

### OPTIMAL APPROACH

```javascript
function binarySearch(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2); // Avoids overflow vs (lo+hi)/2

    if (nums[mid] === target) return mid;
    if (nums[mid] < target)   lo = mid + 1; // Target in right half
    else                       hi = mid - 1; // Target in left half
  }

  return -1; // Not found
}

// Find leftmost (first) occurrence of target
function binarySearchLeft(nums, target) {
  let lo = 0, hi = nums.length - 1, result = -1;

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) { result = mid; hi = mid - 1; } // Keep searching left
    else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return result;
}

// Find rightmost (last) occurrence of target
function binarySearchRight(nums, target) {
  let lo = 0, hi = nums.length - 1, result = -1;

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) { result = mid; lo = mid + 1; } // Keep searching right
    else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return result;
}

// Tests
console.log(binarySearch([-1,0,3,5,9,12], 9));  // 4
console.log(binarySearch([-1,0,3,5,9,12], 2));  // -1
console.log(binarySearchLeft([1,2,2,2,3], 2));  // 1 (first occurrence)
console.log(binarySearchRight([1,2,2,2,3], 2)); // 3 (last occurrence)
```

- **Time:** O(log n) | **Space:** O(1)

**Why `lo + Math.floor((hi - lo) / 2)` instead of `(lo + hi) / 2`?**
In languages with integer overflow (Java, C++), `lo + hi` can overflow if both are large. In JavaScript numbers don't overflow to negative, but the pattern is good practice. It's equivalent: `lo + (hi - lo) / 2 = (2*lo + hi - lo) / 2 = (lo + hi) / 2`.

### WHY THIS PATTERN
Binary search is the canonical O(log n) algorithm. The invariant: `target`, if it exists, is always within `[lo, hi]`. Each iteration eliminates half the search space — that's why it's O(log n). The variants (find first/last occurrence) show how to extend basic binary search by continuing to search even after finding a match. These are foundational for problems like "count elements in range" and "find insertion position."

---

## Problem 2 — Find Peak Element

### PROBLEM STATEMENT
A peak element is greater than its neighbors. Find any peak's index. Treat out-of-bounds as -∞. Solve in O(log n). (LeetCode 162)

### EXAMPLES
```
Input:  [1,2,3,1]      →  2  (nums[2]=3 is a peak)
Input:  [1,2,1,3,5,6,4] →  1 or 5  (multiple peaks — any is valid)
Input:  [1]             →  0
```

### **PATTERN: Modified Binary Search (Slope Following)**

### BRUTE FORCE
Scan linearly for any element greater than both neighbors. O(n).

### OPTIMAL APPROACH
At the midpoint: if `nums[mid] < nums[mid+1]`, a peak must exist to the right (the slope goes up). Otherwise, a peak must exist on the left or at mid.

```javascript
function findPeakElement(nums) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo < hi) {  // Note: lo < hi (not lo <= hi)
    const mid = lo + Math.floor((hi - lo) / 2);

    if (nums[mid] < nums[mid + 1]) {
      lo = mid + 1; // Right side is higher → peak must be right of mid
    } else {
      hi = mid;     // Left side is higher (or flat/down) → peak is at mid or left
    }
  }

  return lo; // lo === hi when loop ends
}

// Tests
console.log(findPeakElement([1,2,3,1]));       // 2
console.log(findPeakElement([1,2,1,3,5,6,4])); // 5
console.log(findPeakElement([1]));             // 0
```

- **Time:** O(log n) | **Space:** O(1)

**Why does this work?**
The array is guaranteed to have at least one peak (since edges are treated as -∞). When `nums[mid] < nums[mid+1]`, the slope is going up to the right. Either `mid+1` is a peak, or the slope continues up further right, but eventually comes back down — a peak must exist somewhere in `[mid+1, hi]`. The convergence: lo and hi approach each other until they meet at the peak.

### WHY THIS PATTERN
**Modified binary search** applies whenever you can eliminate half the search space based on a local condition. Here: comparing mid with mid+1 tells you which direction the peak is in. The key insight: binary search doesn't require the target to be a specific value — it requires a way to discard half the space at each step. This generalizes to: find minimum in rotated sorted array, search in bitonic array, and any "find turning point" problem.

---

## Problem 3 — Merge Sort

### PROBLEM STATEMENT
Implement merge sort. Return the sorted array.

### EXAMPLES
```
Input:  [5,3,8,1,9,2,7,4,6]
Output: [1,2,3,4,5,6,7,8,9]
```

### **PATTERN: Divide and Conquer (Split + Merge)**

### OPTIMAL APPROACH

```javascript
function mergeSort(arr) {
  // Base case: array of 0 or 1 elements is already sorted
  if (arr.length <= 1) return arr;

  // Divide: split into two halves
  const mid = Math.floor(arr.length / 2);
  const left  = mergeSort(arr.slice(0, mid));  // Sort left half
  const right = mergeSort(arr.slice(mid));     // Sort right half

  // Conquer: merge two sorted halves
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  // Append remaining elements
  while (i < left.length)  result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}

// Tests
console.log(mergeSort([5,3,8,1,9,2,7,4,6])); // [1,2,3,4,5,6,7,8,9]
console.log(mergeSort([3,1,2]));              // [1,2,3]
console.log(mergeSort([]));                   // []
console.log(mergeSort([1]));                  // [1]
```

- **Time:** O(n log n) — log n levels of recursion, O(n) merge work per level
- **Space:** O(n) — new arrays at each level

**Recursion tree for [5,3,8,1]:**
```
mergeSort([5,3,8,1])
├── mergeSort([5,3]) → mergeSort([5]) + mergeSort([3]) → merge([5],[3]) = [3,5]
└── mergeSort([8,1]) → mergeSort([8]) + mergeSort([1]) → merge([8],[1]) = [1,8]
merge([3,5], [1,8]):
  compare 3 vs 1 → take 1. [1]
  compare 3 vs 8 → take 3. [1,3]
  compare 5 vs 8 → take 5. [1,3,5]
  append 8.       [1,3,5,8] ✓
```

### WHY THIS PATTERN
Merge sort exemplifies divide and conquer: split into independently solvable halves, solve each recursively, combine results. The merge step exploits that both halves are already sorted — only O(n) work to combine. **Stable sort**: equal elements maintain their original relative order (important for multi-key sorting). **Consistent performance**: always O(n log n), never degrades like quicksort can. The sorting step in "sort then scan" patterns (group anagrams, merge intervals) typically uses merge sort internally.

---

## Problem 4 — Quick Sort (Lomuto Partition)

### PROBLEM STATEMENT
Implement quick sort in-place.

### EXAMPLES
```
Input:  [3,6,8,10,1,2,1]
Output: [1,1,2,3,6,8,10]
```

### **PATTERN: Partition (Pivot + Lomuto / Hoare)**

### OPTIMAL APPROACH

```javascript
// Lomuto partition scheme (pivot = last element)
function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo < hi) {
    const pivotIdx = partition(arr, lo, hi);
    quickSort(arr, lo, pivotIdx - 1);  // Sort left of pivot
    quickSort(arr, pivotIdx + 1, hi);  // Sort right of pivot
  }
  return arr;
}

function partition(arr, lo, hi) {
  const pivot = arr[hi]; // Choose last element as pivot
  let i = lo - 1;        // i: boundary between "≤ pivot" and "> pivot"

  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Move ≤ pivot to left section
    }
  }

  // Place pivot in its correct final position
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  return i + 1; // Return pivot's final index
}

// Hoare partition (more efficient in practice — fewer swaps)
function hoarePartition(arr, lo, hi) {
  const pivot = arr[Math.floor((lo + hi) / 2)]; // Middle element
  let i = lo - 1;
  let j = hi + 1;

  while (true) {
    do { i++; } while (arr[i] < pivot);
    do { j--; } while (arr[j] > pivot);
    if (i >= j) return j;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Tests
console.log(quickSort([3,6,8,10,1,2,1])); // [1,1,2,3,6,8,10]
console.log(quickSort([5,4,3,2,1]));      // [1,2,3,4,5]
console.log(quickSort([1]));              // [1]
```

- **Average Time:** O(n log n) | **Worst Time:** O(n²) when pivot is always min/max
- **Space:** O(log n) average recursion depth

**Partition trace for [3,1,2], pivot=2:**
```
i=-1+0=lo-1=-1. j scans 0 to 1.
j=0: arr[0]=3 > pivot=2. No swap. i still -1.
j=1: arr[1]=1 ≤ pivot=2. i=0. swap arr[0],arr[1] → [1,3,2].
Loop ends. Place pivot: swap arr[1] (i+1=1), arr[2] → [1,2,3]. Return 1.
```

### WHY THIS PATTERN
Quick sort is often faster than merge sort in practice due to **cache locality** (in-place, no auxiliary arrays). The partition step places the pivot in its **final sorted position** in O(n) — no pivot ever needs to move again. Lomuto is simpler to implement; Hoare uses fewer swaps. **Worst case prevention:** randomize pivot selection (`swap arr[random], arr[hi]` before partitioning). The partition pattern also underlies: QuickSelect (find kth smallest in O(n) average), and Dutch National Flag.

---

## Problem 5 — Search in Rotated Sorted Array

### PROBLEM STATEMENT
A sorted array was rotated at some unknown pivot. Find the target's index, or return -1. (LeetCode 33)

### EXAMPLES
```
Input:  [4,5,6,7,0,1,2], target=0  →  4
Input:  [4,5,6,7,0,1,2], target=3  →  -1
Input:  [1], target=0               →  -1
```

### **PATTERN: Modified Binary Search (Identify Sorted Half)**

### BRUTE FORCE
Linear scan. O(n).

### OPTIMAL APPROACH
At any midpoint, one half is guaranteed to be sorted. Determine which half, then check if target falls within it.

```javascript
function searchRotated(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);

    if (nums[mid] === target) return mid;

    // Determine which half is sorted
    if (nums[lo] <= nums[mid]) {
      // Left half [lo..mid] is sorted
      if (nums[lo] <= target && target < nums[mid]) {
        hi = mid - 1; // Target is in sorted left half
      } else {
        lo = mid + 1; // Target must be in right half
      }
    } else {
      // Right half [mid..hi] is sorted
      if (nums[mid] < target && target <= nums[hi]) {
        lo = mid + 1; // Target is in sorted right half
      } else {
        hi = mid - 1; // Target must be in left half
      }
    }
  }

  return -1;
}

// Tests
console.log(searchRotated([4,5,6,7,0,1,2], 0)); // 4
console.log(searchRotated([4,5,6,7,0,1,2], 3)); // -1
console.log(searchRotated([1], 0));             // -1
console.log(searchRotated([3,1], 1));           // 1
```

- **Time:** O(log n) | **Space:** O(1)

**Trace for [4,5,6,7,0,1,2], target=0:**
```
lo=0, hi=6. mid=3. nums[3]=7 ≠ 0.
nums[0]=4 ≤ nums[3]=7 → left [0..3] is sorted.
Is 4 ≤ 0 < 7? No (0 < 4). → lo=4.

lo=4, hi=6. mid=5. nums[5]=1 ≠ 0.
nums[4]=0 ≤ nums[5]=1 → left [4..5] is sorted.
Is 0 ≤ 0 < 1? Yes! → hi=4.

lo=4, hi=4. mid=4. nums[4]=0 === 0. Return 4 ✓
```

### WHY THIS PATTERN
A rotated sorted array is **partially ordered** — exactly one of the two halves around any midpoint is always sorted. The sorted half gives a reliable range to check: if target falls within `[nums[lo], nums[mid])` (for left sorted) or `(nums[mid], nums[hi]]` (for right sorted), narrow to that half; otherwise go to the other. This is the key binary search insight for any "almost sorted" or "rotated" array: always identify the sorted portion first, then decide which half to search.

---

## Pattern Summary

| Problem | Pattern | Time | Space |
|---------|---------|------|-------|
| Binary search | Divide interval (classic) | O(log n) | O(1) |
| Find peak element | Modified binary search (slope) | O(log n) | O(1) |
| Merge sort | Divide and conquer (split+merge) | O(n log n) | O(n) |
| Quick sort | Partition (pivot placement) | O(n log n) avg | O(log n) |
| Search in rotated array | Modified binary search (sorted half) | O(log n) | O(1) |

**Binary search mental model:**
```
Standard:    "Is target here? Eliminate half that can't contain it."
Peak:        "Which direction is the peak? Go that way."
Rotated:     "Which half is sorted? Is target in it? Go there."

All binary search variants share: eliminate half the space each step.
The distinguishing factor: the condition used to decide which half to eliminate.
```
