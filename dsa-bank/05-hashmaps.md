# Hash Maps & Sets — 10 Problems

Hash maps offer O(1) average insert/lookup/delete. The core skill is recognizing when to trade O(n) space for a faster time complexity by precomputing a lookup structure.

**JS Reference:**
```javascript
const map = new Map();     map.set(k,v); map.get(k); map.has(k); map.delete(k);
const set = new Set();     set.add(v);   set.has(v);  set.delete(v);
const obj = {};            obj[k] = v;   obj[k];      k in obj;
```

---

## Problem 1 — Two Sum

### PROBLEM STATEMENT
Return indices of two numbers in an array that add up to target. Exactly one solution. (LeetCode 1)

### EXAMPLES
```
Input:  [2,7,11,15], target=9    →  Output: [0,1]
Input:  [3,2,4],     target=6    →  Output: [1,2]
Input:  [3,3],       target=6    →  Output: [0,1]
```

### **PATTERN: Complement Pattern**

The complement of `x` for target `t` is `t - x`. Instead of searching forward for a partner, ask: "have I already seen the complement?"

### BRUTE FORCE
Nested loop, check every pair. O(n²) time, O(1) space.

### OPTIMAL APPROACH

```javascript
function twoSum(nums, target) {
  const seen = new Map(); // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }

    seen.set(nums[i], i);
  }

  return [];
}

// Tests
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));      // [1, 2]
console.log(twoSum([3, 3], 6));         // [0, 1]
```

- **Time:** O(n) | **Space:** O(n)

### WHY THIS PATTERN
The complement pattern converts "find two unknowns" into "find one unknown given the other." Store as you scan — by the time you reach the second element of a valid pair, the first is already in the map. The map stores `value → index` (not just value) because indices are required in the output.

---

## Problem 2 — Frequency of Elements

### PROBLEM STATEMENT
Return an object mapping each unique element to how many times it appears.

### EXAMPLES
```
Input:  [1,2,2,3,3,3]    →  { 1:1, 2:2, 3:3 }
Input:  ['a','b','a','c'] →  { a:2, b:1, c:1 }
```

### **PATTERN: Counting Pattern**

### OPTIMAL APPROACH

```javascript
function frequency(arr) {
  const freq = new Map();

  for (const item of arr) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }

  return Object.fromEntries(freq);
}

// Top-K frequent elements (common extension)
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);

  // Bucket sort by frequency (O(n) total)
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq) buckets[count].push(num);

  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    result.push(...buckets[i]);
  }
  return result.slice(0, k);
}

// Tests
console.log(frequency([1, 2, 2, 3, 3, 3])); // { '1':1, '2':2, '3':3 }
console.log(topKFrequent([1,1,1,2,2,3], 2)); // [1, 2]
```

- **Time:** O(n) | **Space:** O(k) where k = unique elements

### WHY THIS PATTERN
The frequency map is the foundational preprocessing step for dozens of problems. Build it once in O(n), then all subsequent queries are O(1). The bucket-sort extension avoids sorting the map (O(k log k)) by exploiting the constraint that frequencies are bounded by n.

---

## Problem 3 — Group Anagrams

### PROBLEM STATEMENT
Group strings that are anagrams of each other. (LeetCode 49)

### EXAMPLES
```
Input:  ["eat","tea","tan","ate","nat","bat"]
Output: [["eat","tea","ate"],["tan","nat"],["bat"]]
```

### **PATTERN: Canonical Key**

Two items that are "equivalent under transformation" will produce the same key when that transformation is applied.

### OPTIMAL APPROACH

```javascript
function groupAnagrams(strs) {
  const map = new Map();

  for (const str of strs) {
    // Canonical key: sorted characters are identical for all anagrams
    const key = str.split('').sort().join('');

    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }

  return [...map.values()];
}

// O(n*k) variant using character frequency as key
function groupAnagramsLinear(strs) {
  const map = new Map();

  for (const str of strs) {
    const freq = new Array(26).fill(0);
    for (const c of str) freq[c.charCodeAt(0) - 97]++;
    const key = freq.join('#'); // Unique serialization

    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }

  return [...map.values()];
}

// Tests
console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));
// [["eat","tea","ate"],["tan","nat"],["bat"]]
```

- **Time:** O(n·k log k) sort-key | O(n·k) freq-key | **Space:** O(n·k)

### WHY THIS PATTERN
The canonical key technique generalizes to any "group equivalent items" problem. The transformation defines equivalence. For anagrams: sorted string. For equivalent fractions: reduced fraction. For isomorphic shapes: normalized coordinates. The transformation must be deterministic and produce identical output for equivalent inputs.

---

## Problem 4 — First Unique Character

### PROBLEM STATEMENT
Return the first character in a string that appears exactly once. Return `''` if none. (LeetCode 387)

### EXAMPLES
```
Input:  "leetcode"      →  "l"
Input:  "loveleetcode"  →  "v"
Input:  "aabb"          →  ""
```

### **PATTERN: Count Then Scan**

### OPTIMAL APPROACH

```javascript
function firstUniqueChar(s) {
  const freq = new Map();

  // Pass 1: build counts
  for (const c of s) freq.set(c, (freq.get(c) || 0) + 1);

  // Pass 2: scan ORIGINAL order to find first with count=1
  for (const c of s) {
    if (freq.get(c) === 1) return c;
  }

  return '';
}

// Extension: find index (LeetCode original asks for index)
function firstUniqCharIndex(s) {
  const freq = new Map();
  for (const c of s) freq.set(c, (freq.get(c) || 0) + 1);
  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) return i;
  }
  return -1;
}

// Tests
console.log(firstUniqueChar("leetcode"));     // "l"
console.log(firstUniqueChar("loveleetcode")); // "v"
console.log(firstUniqueChar("aabb"));          // ""
```

- **Time:** O(n) | **Space:** O(k ≤ 26)

### WHY THIS PATTERN
Two-pass is necessary: you can't determine uniqueness while still scanning (the character might repeat later). Pass 1 builds the complete picture; Pass 2 answers the query. The second pass scans in **original order** — this is what guarantees "first" rather than just "any" unique character.

---

## Problem 5 — Intersection of Arrays

### PROBLEM STATEMENT
Return elements present in both arrays (unique). (LeetCode 349)

### EXAMPLES
```
Input:  [1,2,2,1], [2,2]       →  [2]
Input:  [4,9,5],   [9,4,9,8,4] →  [4,9]
```

### **PATTERN: Set Lookup**

### OPTIMAL APPROACH

```javascript
function intersection(a, b) {
  const setA = new Set(a);
  const result = new Set();

  for (const val of b) {
    if (setA.has(val)) result.add(val); // O(1) lookup
  }

  return [...result];
}

// Extension: intersection with duplicates (intersect II - LeetCode 350)
function intersectWithDuplicates(a, b) {
  const freq = new Map();
  for (const n of a) freq.set(n, (freq.get(n) || 0) + 1);

  const result = [];
  for (const n of b) {
    if (freq.get(n) > 0) {
      result.push(n);
      freq.set(n, freq.get(n) - 1);
    }
  }
  return result;
}

// Tests
console.log(intersection([1,2,2,1], [2,2]));       // [2]
console.log(intersection([4,9,5], [9,4,9,8,4]));   // [9,4]
console.log(intersectWithDuplicates([1,2,2,1],[2,2])); // [2,2]
```

- **Time:** O(n + m) | **Space:** O(n)

### WHY THIS PATTERN
Convert one collection to a Set for O(1) membership testing. Without it: O(n) per lookup → O(n·m) total. The second Set in the result deduplicates automatically. The "with duplicates" variant swaps Set for a frequency Map and decrements to track remaining allowances.

---

## Problem 6 — Isomorphic Strings

### PROBLEM STATEMENT
Two strings are isomorphic if characters in `s` can be replaced to get `t`. The mapping must be consistent (same char always maps to same char, no two chars map to same char). (LeetCode 205)

### EXAMPLES
```
Input:  s="egg",  t="add"  →  true  (e→a, g→d)
Input:  s="foo",  t="bar"  →  false (o maps to both a and r)
Input:  s="paper",t="title"→  true  (p→t, a→i, e→l, r→e)
Input:  s="ab",   t="aa"   →  false (a and b both map to a — violates bijection)
```

### **PATTERN: Bidirectional Map**

### OPTIMAL APPROACH

```javascript
function isIsomorphic(s, t) {
  if (s.length !== t.length) return false;

  const sToT = new Map(); // s char → t char
  const tToS = new Map(); // t char → s char (reverse mapping)

  for (let i = 0; i < s.length; i++) {
    const sc = s[i], tc = t[i];

    // Check s→t mapping consistency
    if (sToT.has(sc) && sToT.get(sc) !== tc) return false;
    // Check t→s mapping consistency (prevents two s-chars mapping to same t-char)
    if (tToS.has(tc) && tToS.get(tc) !== sc) return false;

    sToT.set(sc, tc);
    tToS.set(tc, sc);
  }

  return true;
}

// Tests
console.log(isIsomorphic("egg", "add"));   // true
console.log(isIsomorphic("foo", "bar"));   // false
console.log(isIsomorphic("paper","title")); // true
console.log(isIsomorphic("ab", "aa"));     // false
```

- **Time:** O(n) | **Space:** O(k) — at most 256 unique chars

### WHY THIS PATTERN
The bidirectional map enforces a **bijection** (one-to-one and onto). One-directional mapping only catches "same char maps to different chars." The reverse map catches the symmetric violation: "two different chars map to the same char." Problems requiring bijection always need both directions. Contrasted with word pattern (Problem 7) which is structurally identical at a higher level.

---

## Problem 7 — Word Pattern Matching

### PROBLEM STATEMENT
Given a pattern string and a string of words, check if there is a bijection between pattern characters and words. (LeetCode 290)

### EXAMPLES
```
Input:  pattern="abba", s="dog cat cat dog"  →  true
Input:  pattern="abba", s="dog cat cat fish" →  false
Input:  pattern="aaaa", s="dog cat cat dog"  →  false
Input:  pattern="abba", s="dog dog dog dog"  →  false
```

### **PATTERN: Bijection (Bidirectional Map, Word-Level)**

### OPTIMAL APPROACH

```javascript
function wordPattern(pattern, s) {
  const words = s.split(' ');
  if (pattern.length !== words.length) return false;

  const charToWord = new Map();
  const wordToChar = new Map();

  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    const w = words[i];

    if (charToWord.has(c) && charToWord.get(c) !== w) return false;
    if (wordToChar.has(w) && wordToChar.get(w) !== c) return false;

    charToWord.set(c, w);
    wordToChar.set(w, c);
  }

  return true;
}

// Tests
console.log(wordPattern("abba", "dog cat cat dog"));  // true
console.log(wordPattern("abba", "dog cat cat fish")); // false
console.log(wordPattern("aaaa", "dog cat cat dog"));  // false
console.log(wordPattern("abba", "dog dog dog dog"));  // false
```

- **Time:** O(n) | **Space:** O(k) where k = unique chars/words

### WHY THIS PATTERN
Identical structure to isomorphic strings — both enforce a bijection, but at different granularities (character vs. word). Recognizing this structural similarity is the key insight: the pattern is "two things must correspond one-to-one." The length check is a necessary but not sufficient early exit.

---

## Problem 8 — Subarray Sum Equals K

### PROBLEM STATEMENT
Count subarrays whose elements sum to exactly k. Array may contain negatives. (LeetCode 560)

### EXAMPLES
```
Input:  [1,1,1], k=2    →  2
Input:  [1,2,3], k=3    →  2
Input:  [1,-1,1], k=1   →  3
```

### **PATTERN: Prefix Sum Map**

### OPTIMAL APPROACH

```javascript
function subarraySum(nums, k) {
  // prefixCount[s] = how many times prefix sum 's' has occurred
  const prefixCount = new Map([[0, 1]]); // Empty prefix = sum 0, occurs once
  let count = 0;
  let prefixSum = 0;

  for (const num of nums) {
    prefixSum += num;

    // sum(i..j) = prefixSum[j] - prefixSum[i-1]
    // We want sum = k, so we need prefixSum[i-1] = prefixSum[j] - k
    count += prefixCount.get(prefixSum - k) || 0;

    prefixCount.set(prefixSum, (prefixCount.get(prefixSum) || 0) + 1);
  }

  return count;
}

// Tests
console.log(subarraySum([1, 1, 1], 2));   // 2
console.log(subarraySum([1, 2, 3], 3));   // 2
console.log(subarraySum([1, -1, 1], 1));  // 3
```

- **Time:** O(n) | **Space:** O(n)

### WHY THIS PATTERN
The **prefix sum identity**: `sum(i..j) = prefix[j] - prefix[i-1]`. If we want `sum(i..j) = k`, then `prefix[i-1] = prefix[j] - k`. The map counts how many previous prefix sums equal the needed value — each match represents a valid subarray. The seed `{0: 1}` handles subarrays starting from index 0. Works with negatives (unlike the two-pointer approach which requires non-negative elements).

---

## Problem 9 — Longest Consecutive Sequence

### PROBLEM STATEMENT
Find the length of the longest sequence of consecutive integers in an unsorted array. Solve in O(n). (LeetCode 128)

### EXAMPLES
```
Input:  [100,4,200,1,3,2]    →  4  (sequence: 1,2,3,4)
Input:  [0,3,7,2,5,8,4,6,0,1] → 9 (sequence: 0-8)
Input:  [1,2,3,4]            →  4
```

### **PATTERN: Set Expansion**

### OPTIMAL APPROACH

```javascript
function longestConsecutive(nums) {
  const numSet = new Set(nums); // O(1) lookups
  let maxLen = 0;

  for (const num of numSet) {
    // Only start a sequence from its LOWEST element
    // (if num-1 exists, num is not the start)
    if (!numSet.has(num - 1)) {
      let current = num;
      let length = 1;

      // Expand the sequence upward
      while (numSet.has(current + 1)) {
        current++;
        length++;
      }

      maxLen = Math.max(maxLen, length);
    }
  }

  return maxLen;
}

// Tests
console.log(longestConsecutive([100,4,200,1,3,2]));    // 4
console.log(longestConsecutive([0,3,7,2,5,8,4,6,0,1])); // 9
console.log(longestConsecutive([1,2,3,4]));            // 4
```

- **Time:** O(n) — each number processed at most twice (once in outer loop, once in inner while)
- **Space:** O(n)

### WHY THIS PATTERN
The key insight: **only start counting from sequence beginnings**. A number is a sequence beginning if `num-1` is not in the set. Without this, each number starts a sequence → O(n²) total inner-loop iterations. With it, the inner while loop across all iterations totals O(n) because each element is visited at most once. Converting to a Set first makes `has()` O(1) — trying to do this on a sorted array requires O(n log n) sorting first.

---

## Problem 10 — Contains Duplicate Within K Distance

### PROBLEM STATEMENT
Return `true` if there are two equal elements within index distance ≤ k. (LeetCode 219)

### EXAMPLES
```
Input:  [1,2,3,1], k=3   →  true  (nums[0]==nums[3], distance=3)
Input:  [1,0,1,1], k=1   →  true  (nums[2]==nums[3], distance=1)
Input:  [1,2,3,1,2,3],k=2→  false
```

### **PATTERN: Sliding Window + Set**

### OPTIMAL APPROACH

```javascript
function containsNearbyDuplicate(nums, k) {
  const window = new Set(); // Maintains a sliding window of size k

  for (let i = 0; i < nums.length; i++) {
    if (window.has(nums[i])) return true; // Duplicate within window

    window.add(nums[i]);

    // Keep window size at most k
    if (window.size > k) {
      window.delete(nums[i - k]); // Remove element that fell out of window
    }
  }

  return false;
}

// Tests
console.log(containsNearbyDuplicate([1,2,3,1], 3));     // true
console.log(containsNearbyDuplicate([1,0,1,1], 1));     // true
console.log(containsNearbyDuplicate([1,2,3,1,2,3], 2)); // false
```

- **Time:** O(n) | **Space:** O(min(n, k))

### WHY THIS PATTERN
**Fixed-size sliding window with a Set** maintains the invariant "all elements in the window are within k distance of the current element." The Set provides O(1) duplicate checking. When the window exceeds size k, evict the oldest element (`nums[i-k]`). This is cleaner than a Map storing last-seen indices and avoids distance calculations. The Set's size stays bounded at O(k), not O(n).

---

## Pattern Summary

| Problem | Pattern | Time | Space |
|---------|---------|------|-------|
| Two Sum | Complement (Map: value→index) | O(n) | O(n) |
| Frequency of elements | Counting (Map: value→count) | O(n) | O(k) |
| Group anagrams | Canonical key | O(nk log k) | O(nk) |
| First unique char | Count then scan (two-pass) | O(n) | O(k) |
| Intersection | Set lookup | O(n+m) | O(n) |
| Isomorphic strings | Bidirectional map | O(n) | O(k) |
| Word pattern | Bijection (bidirectional) | O(n) | O(k) |
| Subarray sum = K | Prefix sum map | O(n) | O(n) |
| Longest consecutive | Set expansion | O(n) | O(n) |
| Duplicate within K | Sliding window + Set | O(n) | O(k) |

**Decision guide:**
- Need O(1) membership? → Set
- Need value→index? → Map (complement pattern)
- Need value→count? → Map (counting pattern)
- Need to group equivalents? → Map with canonical key
- Need bijection? → Two Maps (bidirectional)
- Need subarray sums? → Prefix sum + Map
