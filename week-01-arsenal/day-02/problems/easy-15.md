# Easy JavaScript Problems (15)

---

## Problem 1 — Reverse a String

### PROBLEM
Write a function that takes a string and returns it reversed.
```
reverseString("hello")   → "olleh"
reverseString("world")   → "dlrow"
reverseString("a")       → "a"
reverseString("")        → ""
```

### HINT
Arrays have a `.reverse()` method. Strings don't — but you can split a string into an array of characters, reverse, then join back.

### PATTERN NAME
**Array Transformation**

### SOLUTION
```js
function reverseString(str) {
  return str.split("").reverse().join("");
}

// Alternative: reduce from right
function reverseString2(str) {
  return [...str].reduce((reversed, char) => char + reversed, "");
}

// Alternative: for loop
function reverseString3(str) {
  let result = "";
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}

// Test
console.log(reverseString("hello")); // "olleh"
console.log(reverseString(""));      // ""
```
**Explanation:** `split("")` turns `"hello"` into `["h","e","l","l","o"]`, `.reverse()` gives `["o","l","l","e","h"]`, `.join("")` gives `"olleh"`.

### TIME COMPLEXITY
- Time: O(n) — visits each character once
- Space: O(n) — new array of n characters

---

## Problem 2 — Find Largest Number in Array

### PROBLEM
Write a function that returns the largest number in an array.
```
findLargest([3, 1, 4, 1, 5, 9, 2])  → 9
findLargest([-3, -1, -4])            → -1
findLargest([7])                     → 7
```

### HINT
`Math.max` accepts multiple arguments. The spread operator lets you unpack an array into individual arguments.

### PATTERN NAME
**Math / Spread**

### SOLUTION
```js
function findLargest(arr) {
  return Math.max(...arr);
}

// Alternative: reduce
function findLargest2(arr) {
  return arr.reduce((max, num) => num > max ? num : max, arr[0]);
}

// Alternative: sort (less efficient — O(n log n))
function findLargest3(arr) {
  return [...arr].sort((a, b) => b - a)[0];
}

// Test
console.log(findLargest([3, 1, 9, 2])); // 9
console.log(findLargest([-3, -1, -4])); // -1
```
**Explanation:** `Math.max(...arr)` spreads the array as individual arguments. `reduce` version tracks the running max as it iterates.

### TIME COMPLEXITY
- Time: O(n) — single pass (reduce version)
- Space: O(1) — no extra data structures

---

## Problem 3 — Count Vowels

### PROBLEM
Write a function that counts the number of vowels (a, e, i, o, u) in a string (case-insensitive).
```
countVowels("hello")       → 2
countVowels("JavaScript")  → 3
countVowels("rhythm")      → 0
countVowels("AEIOU")       → 5
```

### HINT
Use a regular expression with the `g` (global) flag to find all matches. `str.match()` returns an array of matches or `null`.

### PATTERN NAME
**Regex Matching**

### SOLUTION
```js
function countVowels(str) {
  const matches = str.match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}

// Alternative: filter with a Set
function countVowels2(str) {
  const vowels = new Set("aeiou");
  return [...str.toLowerCase()].filter(char => vowels.has(char)).length;
}

// Alternative: reduce
function countVowels3(str) {
  return str.toLowerCase().split("").reduce((count, char) => {
    return "aeiou".includes(char) ? count + 1 : count;
  }, 0);
}

// Test
console.log(countVowels("hello"));      // 2
console.log(countVowels("rhythm"));     // 0
console.log(countVowels("JavaScript")); // 3
```
**Explanation:** `/[aeiou]/gi` matches any vowel, case-insensitive, globally. `match()` returns an array of all matches; we return its length (or 0 if no matches / null).

### TIME COMPLEXITY
- Time: O(n) — scans each character once
- Space: O(n) — matches array in worst case

---

## Problem 4 — Check Palindrome

### PROBLEM
Write a function that returns `true` if a string is a palindrome (reads the same forwards and backwards), ignoring case and non-alphanumeric characters.
```
isPalindrome("racecar")        → true
isPalindrome("A man a plan a canal Panama") → true
isPalindrome("hello")          → false
isPalindrome("Was it a car or a cat I saw") → true
```

### HINT
Clean the string first (lowercase, remove non-alphanumeric), then compare it to its reverse.

### PATTERN NAME
**Two Pointers / String Cleaning**

### SOLUTION
```js
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}

// Alternative: two-pointer (no extra string allocation)
function isPalindrome2(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  return true;
}

// Test
console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("hello"));   // false
console.log(isPalindrome("A man a plan a canal Panama")); // true
```
**Explanation:** Clean the string, then either reverse-compare or use two pointers walking inward from both ends. Two-pointer is more memory-efficient.

### TIME COMPLEXITY
- Time: O(n)
- Space: O(n) for the cleaned string — O(1) extra with two-pointer approach

---

## Problem 5 — FizzBuzz

### PROBLEM
Write a function that returns an array of strings for numbers 1 to n:
- "FizzBuzz" if divisible by both 3 and 5
- "Fizz" if divisible by 3
- "Buzz" if divisible by 5
- The number as a string otherwise
```
fizzBuzz(15) → ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
```

### HINT
Check divisibility by 15 FIRST (or combine with &&), otherwise the 3 and 5 checks catch it before you reach FizzBuzz.

### PATTERN NAME
**Modulo / Conditionals**

### SOLUTION
```js
function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0)      result.push("FizzBuzz");
    else if (i % 3 === 0)  result.push("Fizz");
    else if (i % 5 === 0)  result.push("Buzz");
    else                   result.push(String(i));
  }
  return result;
}

// Clean alternative: build the string piece by piece
function fizzBuzz2(n) {
  return Array.from({ length: n }, (_, i) => {
    const num = i + 1;
    let str = "";
    if (num % 3 === 0) str += "Fizz";
    if (num % 5 === 0) str += "Buzz";
    return str || String(num);
  });
}

// Test
console.log(fizzBuzz(15));
```
**Explanation:** The second version builds the string by concatenating — if divisible by 3 adds "Fizz", if by 5 adds "Buzz", naturally producing "FizzBuzz" for multiples of 15. Elegant and easy to extend (add new rules).

### TIME COMPLEXITY
- Time: O(n)
- Space: O(n) — result array

---

## Problem 6 — Sum of Array

### PROBLEM
Write a function that returns the sum of all numbers in an array.
```
sumArray([1, 2, 3, 4, 5])   → 15
sumArray([-1, -2, 3])        → 0
sumArray([])                  → 0
sumArray([10])                → 10
```

### HINT
`reduce` is the idiomatic solution. Always provide the initial value `0` to handle empty arrays safely.

### PATTERN NAME
**Reduce / Accumulator**

### SOLUTION
```js
function sumArray(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}

// Alternative: for...of
function sumArray2(arr) {
  let sum = 0;
  for (const num of arr) sum += num;
  return sum;
}

// One-liner with Math
// (only works for non-empty arrays without reduce)
const sum = arr.reduce((a, b) => a + b, 0);

// Test
console.log(sumArray([1, 2, 3, 4, 5])); // 15
console.log(sumArray([]));               // 0
```
**Explanation:** `reduce` starts at `0` (the initial value) and adds each element to the accumulator. Starting at `0` ensures empty arrays return `0` instead of throwing an error.

### TIME COMPLEXITY
- Time: O(n)
- Space: O(1)

---

## Problem 7 — Remove Duplicates

### PROBLEM
Write a function that removes duplicate values from an array, returning only unique values in their original order.
```
removeDuplicates([1, 2, 2, 3, 4, 4, 5])     → [1, 2, 3, 4, 5]
removeDuplicates(["a", "b", "a", "c", "b"])  → ["a", "b", "c"]
removeDuplicates([])                          → []
```

### HINT
`Set` only stores unique values. Spreading a Set back into an array gives you the deduplicated result.

### PATTERN NAME
**Set for Uniqueness**

### SOLUTION
```js
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

// Alternative: filter with indexOf
function removeDuplicates2(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
  // keeps only the first occurrence of each value
}

// Alternative: reduce with a seen Set
function removeDuplicates3(arr) {
  const seen = new Set();
  return arr.reduce((unique, item) => {
    if (!seen.has(item)) {
      seen.add(item);
      unique.push(item);
    }
    return unique;
  }, []);
}

// Test
console.log(removeDuplicates([1, 2, 2, 3, 4, 4])); // [1, 2, 3, 4]
console.log(removeDuplicates(["a", "b", "a"]));     // ["a", "b"]
```
**Explanation:** `new Set(arr)` creates a Set (no duplicates, preserves insertion order), then spread `[...]` converts it back to an array.

### TIME COMPLEXITY
- Time: O(n)
- Space: O(n) — Set stores up to n unique values

---

## Problem 8 — Find Second Largest

### PROBLEM
Write a function that finds the second largest number in an array. Assume the array has at least 2 distinct values.
```
secondLargest([3, 1, 4, 1, 5, 9, 2, 6])  → 6
secondLargest([10, 10, 9])               → 9
secondLargest([1, 2])                    → 1
```

### HINT
Get unique values first (to handle duplicates), sort descending, then pick index 1.

### PATTERN NAME
**Sort / Set**

### SOLUTION
```js
function secondLargest(arr) {
  const unique = [...new Set(arr)].sort((a, b) => b - a);
  return unique[1];
}

// Alternative: single pass O(n) — more efficient
function secondLargest2(arr) {
  let first = -Infinity;
  let second = -Infinity;

  for (const num of arr) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second && num < first) {
      second = num;
    }
  }
  return second;
}

// Test
console.log(secondLargest([3, 1, 4, 1, 5, 9, 2, 6])); // 6
console.log(secondLargest([10, 10, 9]));               // 9
```
**Explanation:** Single-pass approach tracks `first` and `second` max. When a new value beats `first`, the old `first` becomes `second`. When it beats `second` but not `first`, update `second`.

### TIME COMPLEXITY
- Sort version: O(n log n)
- Single-pass version: O(n) — preferred

---

## Problem 9 — Capitalize First Letter of Each Word

### PROBLEM
Write a function that capitalizes the first letter of every word in a string.
```
capitalizeWords("hello world")          → "Hello World"
capitalizeWords("the quick brown fox")  → "The Quick Brown Fox"
capitalizeWords("javaScript")           → "JavaScript"
```

### HINT
Split by spaces, transform each word, then join back. For each word, uppercase `charAt(0)` and append the rest with `slice(1)`.

### PATTERN NAME
**String Split-Map-Join**

### SOLUTION
```js
function capitalizeWords(str) {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Alternative: regex replace
function capitalizeWords2(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
  // \b = word boundary, \w = word character
}

// Test
console.log(capitalizeWords("hello world"));         // "Hello World"
console.log(capitalizeWords("the quick brown fox")); // "The Quick Brown Fox"
```
**Explanation:** `charAt(0).toUpperCase()` capitalizes the first character; `slice(1)` keeps the rest unchanged. The regex version is more concise: `\b\w` matches the first character of each word.

### TIME COMPLEXITY
- Time: O(n) — processes each character
- Space: O(n)

---

## Problem 10 — Check if Array is Sorted

### PROBLEM
Write a function that returns `true` if an array is sorted in ascending order.
```
isSorted([1, 2, 3, 4, 5])   → true
isSorted([1, 2, 2, 3])      → true  (equal is fine)
isSorted([1, 3, 2, 4])      → false
isSorted([5, 4, 3])         → false
isSorted([1])               → true
```

### HINT
Check each adjacent pair. If any pair is out of order, return false immediately. If you get through all pairs, return true.

### PATTERN NAME
**Adjacent Pair Check / Early Return**

### SOLUTION
```js
function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

// Alternative: every
function isSorted2(arr) {
  return arr.every((num, i) => i === 0 || arr[i - 1] <= num);
}

// Test
console.log(isSorted([1, 2, 3, 4, 5])); // true
console.log(isSorted([1, 3, 2, 4]));    // false
console.log(isSorted([1]));             // true
```
**Explanation:** Compare each element to the next. If `arr[i] > arr[i+1]`, the array is not sorted — return false. `every` version checks that each element (after the first) is >= its predecessor.

### TIME COMPLEXITY
- Time: O(n) — but exits early on first unsorted pair
- Space: O(1)

---

## Problem 11 — Find Missing Number in 1-N Sequence

### PROBLEM
Given an array containing n-1 numbers from the range 1 to n (one number is missing), find the missing number.
```
findMissing([1, 2, 4, 5, 6])  → 3     (n=6)
findMissing([2, 3, 4, 5])     → 1     (n=5)
findMissing([1, 2, 3, 4])     → 5     (n=5)
```

### HINT
The sum of numbers 1 to n is `n*(n+1)/2`. Subtract the actual sum of the array from the expected sum.

### PATTERN NAME
**Math / Gauss Formula**

### SOLUTION
```js
function findMissing(arr) {
  const n = arr.length + 1; // original sequence length
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = arr.reduce((sum, num) => sum + num, 0);
  return expectedSum - actualSum;
}

// Alternative: XOR (no overflow risk for large numbers)
function findMissing2(arr) {
  const n = arr.length + 1;
  let xor = 0;
  for (let i = 1; i <= n; i++) xor ^= i;
  for (const num of arr) xor ^= num;
  return xor; // all pairs cancel out, leaving the missing number
}

// Test
console.log(findMissing([1, 2, 4, 5, 6])); // 3
console.log(findMissing([2, 3, 4, 5]));    // 1
```
**Explanation:** Gauss formula gives the expected sum of a complete 1-to-n sequence. The difference between expected and actual is the missing number. XOR version works because `a ^ a = 0` — pairing each array element with 1-to-n leaves only the missing number.

### TIME COMPLEXITY
- Time: O(n)
- Space: O(1)

---

## Problem 12 — Merge Two Sorted Arrays

### PROBLEM
Given two sorted arrays, merge them into a single sorted array without using `.sort()`.
```
mergeSorted([1, 3, 5], [2, 4, 6])     → [1, 2, 3, 4, 5, 6]
mergeSorted([1, 2, 3], [4, 5, 6])     → [1, 2, 3, 4, 5, 6]
mergeSorted([], [1, 2])               → [1, 2]
mergeSorted([1, 3], [2])              → [1, 2, 3]
```

### HINT
Use two pointers, one for each array. At each step, pick the smaller of the two current elements and advance that pointer.

### PATTERN NAME
**Two Pointers / Merge**

### SOLUTION
```js
function mergeSorted(a, b) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      result.push(a[i++]);
    } else {
      result.push(b[j++]);
    }
  }

  // Append remaining elements from whichever array has leftovers
  while (i < a.length) result.push(a[i++]);
  while (j < b.length) result.push(b[j++]);

  return result;
}

// Shorter but same logic using slice
function mergeSorted2(a, b) {
  const result = [];
  let i = 0, j = 0;

  while (i < a.length && j < b.length) {
    result.push(a[i] <= b[j] ? a[i++] : b[j++]);
  }

  return [...result, ...a.slice(i), ...b.slice(j)];
}

// Test
console.log(mergeSorted([1, 3, 5], [2, 4, 6])); // [1, 2, 3, 4, 5, 6]
console.log(mergeSorted([1, 2, 3], []));         // [1, 2, 3]
```
**Explanation:** Two pointers advance through both arrays simultaneously, always picking the smaller element. After one array is exhausted, the remaining elements of the other (which are already sorted and all larger) are appended.

### TIME COMPLEXITY
- Time: O(m + n) — each element visited once
- Space: O(m + n) — result array

---

## Problem 13 — Count Occurrences of a Character

### PROBLEM
Write a function that counts how many times a specific character appears in a string.
```
countChar("hello world", "l")   → 3
countChar("mississippi", "s")   → 4
countChar("aaa", "b")           → 0
```

### HINT
`split(char)` splits the string at every occurrence — the number of splits is one less than the number of occurrences.

### PATTERN NAME
**Split Trick / Reduce**

### SOLUTION
```js
function countChar(str, char) {
  return str.split(char).length - 1;
}

// Alternative: match with regex
function countChar2(str, char) {
  const escaped = char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape special chars
  const matches = str.match(new RegExp(escaped, "g"));
  return matches ? matches.length : 0;
}

// Alternative: reduce
function countChar3(str, char) {
  return [...str].reduce((count, c) => count + (c === char ? 1 : 0), 0);
}

// Test
console.log(countChar("hello world", "l")); // 3
console.log(countChar("mississippi", "s")); // 4
console.log(countChar("aaa", "b"));         // 0
```
**Explanation:** `"hello".split("l")` → `["he", "", "o"]` — 3 elements, 2 splits, 2 "l"s. Works because splitting at n occurrences produces n+1 parts, so `length - 1 = occurrences`.

### TIME COMPLEXITY
- Time: O(n)
- Space: O(n) — split creates array of substrings

---

## Problem 14 — Flatten One-Level Nested Array

### PROBLEM
Write a function that flattens a one-level deep nested array (does not need to handle deeper nesting).
```
flattenOne([[1, 2], [3, 4], [5]])         → [1, 2, 3, 4, 5]
flattenOne([["a", "b"], ["c"]])           → ["a", "b", "c"]
flattenOne([[1, [2]], [3]])               → [1, [2], 3]  (only one level)
```

### HINT
`Array.prototype.flat(1)` is built-in. But also know the manual approaches: `concat` with spread, or `reduce`.

### PATTERN NAME
**Flatten / Concat**

### SOLUTION
```js
// Modern — built-in
function flattenOne(arr) {
  return arr.flat();  // flat() defaults to depth 1
}

// Alternative: reduce + concat
function flattenOne2(arr) {
  return arr.reduce((flat, subArr) => flat.concat(subArr), []);
}

// Alternative: spread with concat
function flattenOne3(arr) {
  return [].concat(...arr);
}

// Alternative: flatMap (map + flat(1))
function flattenOne4(arr) {
  return arr.flatMap(item => item);
}

// Test
console.log(flattenOne([[1, 2], [3, 4], [5]]));  // [1, 2, 3, 4, 5]
console.log(flattenOne([["a", "b"], ["c"]]));    // ["a", "b", "c"]
```
**Explanation:** `reduce` with `concat` appends each sub-array to the accumulator. `[].concat(...arr)` uses spread to pass all sub-arrays as separate arguments to concat. Both are O(n).

### TIME COMPLEXITY
- Time: O(n) — n = total number of elements
- Space: O(n)

---

## Problem 15 — Check if Two Strings are Anagrams

### PROBLEM
Write a function that returns `true` if two strings are anagrams (contain the same characters in any order, case-insensitive).
```
isAnagram("listen", "silent")    → true
isAnagram("triangle", "integral")→ true
isAnagram("hello", "world")      → false
isAnagram("Astronomer", "Moon starer") → true  (ignore spaces)
```

### HINT
Sort both strings and compare — anagrams will produce identical sorted strings. Or build a character frequency map and compare.

### PATTERN NAME
**Frequency Map / Sort Comparison**

### SOLUTION
```js
// Sort approach — simple
function isAnagram(a, b) {
  const normalize = str =>
    str.toLowerCase().replace(/\s/g, "").split("").sort().join("");
  return normalize(a) === normalize(b);
}

// Frequency map approach — O(n), more efficient
function isAnagram2(a, b) {
  const clean = str => str.toLowerCase().replace(/\s/g, "");
  const s1 = clean(a);
  const s2 = clean(b);

  if (s1.length !== s2.length) return false;

  const freq = {};
  for (const char of s1) freq[char] = (freq[char] || 0) + 1;
  for (const char of s2) {
    if (!freq[char]) return false;
    freq[char]--;
  }
  return true;
}

// Test
console.log(isAnagram("listen", "silent"));   // true
console.log(isAnagram("hello", "world"));     // false
console.log(isAnagram("Astronomer", "Moon starer")); // true
```
**Explanation:** Frequency map approach: increment count for each char in s1, decrement for each char in s2. If any char goes to 0 before being decremented (or missing), strings aren't anagrams. This avoids the O(n log n) sort cost.

### TIME COMPLEXITY
- Sort version: O(n log n)
- Frequency map version: O(n) — two linear passes, O(1) space (only 26 letters)
