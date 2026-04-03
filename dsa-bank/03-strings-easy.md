# Strings — Easy Problems

12 foundational string problems. Strings in JavaScript are immutable — you can't modify them in-place. Most solutions involve converting to array, using indices, or building a new string character by character.

**Key reminder:** `str[i]` reads a character. `str.split('')` → array of chars. `arr.join('')` → back to string.

---

## Problem 1 — Reverse a String

### PROBLEM STATEMENT
Given a string, return it reversed.

### EXAMPLES
```
Input:  "hello"
Output: "olleh"

Input:  "abcde"
Output: "edcba"

Input:  "a"
Output: "a"

Input:  ""
Output: ""
```

### **PATTERN: Two Pointers (Converging)**

### BRUTE FORCE APPROACH
Loop from end to start, build a new string by concatenation.
- Time: O(n²) — string concatenation in a loop is O(n) per concat in many engines
- Space: O(n)

```javascript
// Brute force — avoid in interviews
function reverseBrute(str) {
  let result = '';
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i]; // Each += can create a new string object
  }
  return result;
}
```

### OPTIMAL APPROACH
Convert to array (arrays are mutable), apply two-pointer swap in-place, join back.

```javascript
function reverseString(str) {
  const chars = str.split('');  // ["h","e","l","l","o"]
  let left = 0;
  let right = chars.length - 1;

  while (left < right) {
    [chars[left], chars[right]] = [chars[right], chars[left]]; // Swap
    left++;
    right--;
  }

  return chars.join(''); // "olleh"
}

// One-liner (acceptable in interviews, uses built-in)
const reverseOneLiner = str => str.split('').reverse().join('');

// Test
console.log(reverseString("hello")); // "olleh"
console.log(reverseString("abcde")); // "edcba"
console.log(reverseString(""));      // ""
```

- Time: O(n) — split O(n), swap O(n/2), join O(n)
- Space: O(n) — char array

### WHY THIS PATTERN
Strings are immutable in JavaScript — you can't do `str[0] = 'x'`. The workaround: convert to a mutable array, apply the same two-pointer swap used for array reversal, then convert back. This convert → process → convert pattern appears in many string problems. Always prefer `join('')` over string concatenation in a loop to avoid O(n²) behavior.

---

## Problem 2 — Check Palindrome

### PROBLEM STATEMENT
Return `true` if a string reads the same forwards and backwards. Ignore case and non-alphanumeric characters (real interview version). (LeetCode 125)

### EXAMPLES
```
Input:  "racecar"
Output: true

Input:  "A man, a plan, a canal: Panama"
Output: true  (after cleaning: "amanaplanacanalpanama")

Input:  "hello"
Output: false

Input:  " "
Output: true  (empty after cleaning)
```

### **PATTERN: Two Pointers (Converging)**

### BRUTE FORCE APPROACH
Clean string, reverse it, compare. O(n) but creates extra strings.

### OPTIMAL APPROACH
Two pointers from both ends. Skip non-alphanumeric characters. Compare case-insensitively.

```javascript
function isPalindrome(str) {
  let left = 0;
  let right = str.length - 1;

  while (left < right) {
    // Skip non-alphanumeric from left
    while (left < right && !isAlphanumeric(str[left])) left++;
    // Skip non-alphanumeric from right
    while (left < right && !isAlphanumeric(str[right])) right--;

    if (str[left].toLowerCase() !== str[right].toLowerCase()) {
      return false; // Mismatch found
    }

    left++;
    right--;
  }

  return true;
}

function isAlphanumeric(char) {
  return /[a-zA-Z0-9]/.test(char);
}

// Simpler version (no cleaning edge cases needed)
function isPalindromeSimple(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;

  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}

// Test
console.log(isPalindrome("racecar"));                       // true
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("hello"));                         // false
console.log(isPalindrome(" "));                             // true
```

- Time: O(n) — each character visited at most once
- Space: O(1) for two-pointer; O(n) if using clean string

### WHY THIS PATTERN
Two converging pointers check a "symmetric around center" property in O(1) space. The early-exit on mismatch makes best-case O(1) (fail at first character). The key interview nuance: handle non-alphanumeric characters and case. The `isAlphanumeric` helper makes the pointer logic clean — skip invalid characters before comparing.

---

## Problem 3 — Count Vowels and Consonants

### PROBLEM STATEMENT
Given a string, count the number of vowels (a, e, i, o, u) and consonants (other alphabetic characters). Ignore spaces and non-alphabetic characters.

### EXAMPLES
```
Input:  "Hello World"
Output: { vowels: 3, consonants: 7 }
        (vowels: e, o, o | consonants: H, l, l, W, r, l, d)

Input:  "aeiou"
Output: { vowels: 5, consonants: 0 }

Input:  "rhythm"
Output: { vowels: 0, consonants: 6 }

Input:  "Hello, World! 123"
Output: { vowels: 3, consonants: 7 }  (ignore punctuation and digits)
```

### **PATTERN: Linear Scan (Lookup Set)**

### BRUTE FORCE APPROACH
Same as optimal — there's only one reasonable approach here.

### OPTIMAL APPROACH
Scan each character, classify it using a vowel set lookup.

```javascript
function countVowelsConsonants(str) {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
  let vowelCount = 0;
  let consonantCount = 0;

  for (const char of str.toLowerCase()) {
    if (char >= 'a' && char <= 'z') {    // Is it alphabetic?
      if (vowels.has(char)) {
        vowelCount++;
      } else {
        consonantCount++;
      }
    }
    // Spaces, digits, punctuation → ignored
  }

  return { vowels: vowelCount, consonants: consonantCount };
}

// Test
console.log(countVowelsConsonants("Hello World"));
// { vowels: 3, consonants: 7 }

console.log(countVowelsConsonants("Hello, World! 123"));
// { vowels: 3, consonants: 7 }

console.log(countVowelsConsonants("rhythm"));
// { vowels: 0, consonants: 6 }
```

- Time: O(n)
- Space: O(1) — Set has constant 5 elements

### WHY THIS PATTERN
**Linear Scan with a lookup structure** is the standard for character classification. Using a `Set` for vowels gives O(1) membership check (`vowels.has(char)`) vs O(v) with `includes` on an array (where v = 5, so it's minor here, but the habit matters). Always lowercase before comparison to avoid handling upper and lower separately.

---

## Problem 4 — Check Anagram

### PROBLEM STATEMENT
Given two strings, return `true` if one is an anagram of the other — same characters, same frequencies, different arrangement. (LeetCode 242)

### EXAMPLES
```
Input:  "listen", "silent"
Output: true

Input:  "hello", "world"
Output: false

Input:  "anagram", "nagaram"
Output: true

Input:  "rat", "car"
Output: false

Input:  "ab", "a"
Output: false  (different lengths)
```

### **PATTERN: Frequency Counter (Hash Map)**

### BRUTE FORCE APPROACH
Sort both strings, compare. O(n log n) time.

```javascript
const isAnagramSort = (a, b) =>
  a.split('').sort().join('') === b.split('').sort().join('');
```

### OPTIMAL APPROACH
Count character frequencies in both strings. If frequency maps are identical, they're anagrams.

```javascript
function isAnagram(s, t) {
  if (s.length !== t.length) return false; // Different lengths = never anagram

  const freq = {};

  // Count up for s
  for (const char of s) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // Count down for t
  for (const char of t) {
    if (!freq[char]) return false; // Character not in s, or used up
    freq[char]--;
  }

  return true; // All characters balanced to zero
}

// Alternative: two separate maps, compare
function isAnagramTwoMaps(s, t) {
  if (s.length !== t.length) return false;

  const buildFreq = str => {
    const map = {};
    for (const c of str) map[c] = (map[c] || 0) + 1;
    return map;
  };

  const freqS = buildFreq(s);
  const freqT = buildFreq(t);

  for (const key in freqS) {
    if (freqS[key] !== freqT[key]) return false;
  }
  return true;
}

// Test
console.log(isAnagram("listen", "silent")); // true
console.log(isAnagram("anagram", "nagaram")); // true
console.log(isAnagram("rat", "car"));         // false
console.log(isAnagram("ab", "a"));            // false
```

- Time: O(n) — two passes
- Space: O(k) where k = unique characters (at most 26 for lowercase)

### WHY THIS PATTERN
The **"count up then count down"** trick is cleaner than comparing two separate maps. You increment for one string and decrement for the other — if any count goes negative or a character doesn't exist, they're not anagrams. This single-map approach uses half the space and avoids the final comparison loop. The early length check eliminates entire classes of non-anagrams in O(1).

---

## Problem 5 — Find First Non-Repeating Character

### PROBLEM STATEMENT
Given a string, find the first character that appears exactly once. Return it, or return `''` if all characters repeat. (LeetCode 387)

### EXAMPLES
```
Input:  "leetcode"
Output: "l"  (l appears once; e appears 3 times, t/c/o/d appear once but l is first)

Input:  "loveleetcode"
Output: "v"

Input:  "aabb"
Output: ""  (all repeat)

Input:  "z"
Output: "z"
```

### **PATTERN: Frequency Counter (Two-Pass)**

### BRUTE FORCE APPROACH
For each character, scan the rest of the string to check if it repeats. O(n²).

### OPTIMAL APPROACH
Pass 1: build frequency map. Pass 2: scan string in order, return first char with frequency 1.

```javascript
function firstUniqueChar(str) {
  const freq = {};

  // Pass 1: count frequencies
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // Pass 2: find first with frequency 1 (preserves original order)
  for (const char of str) {
    if (freq[char] === 1) return char;
  }

  return ''; // No unique character
}

// Test
console.log(firstUniqueChar("leetcode"));     // "l"
console.log(firstUniqueChar("loveleetcode")); // "v"
console.log(firstUniqueChar("aabb"));          // ""
console.log(firstUniqueChar("z"));             // "z"
```

- Time: O(n) — two passes
- Space: O(k) where k ≤ 26

**Why two passes instead of one?**
In one pass, when you encounter a character you don't know yet if it'll repeat later. You must finish counting before you can determine uniqueness. The second pass, critically, scans in **original order** — this is what gives you the *first* unique character, not just *any* unique character.

### WHY THIS PATTERN
**Two-pass Frequency Counter** is the go-to for "first X that satisfies a property" in strings. First pass builds the complete picture (counts), second pass finds the answer in original order. This order-preservation distinction is the key difference from just finding any unique character. The same pattern solves "first character appearing exactly k times."

---

## Problem 6 — Remove Duplicates from String

### PROBLEM STATEMENT
Remove all duplicate characters from a string, keeping only the first occurrence of each character. Preserve original order.

### EXAMPLES
```
Input:  "programming"
Output: "progamin"

Input:  "aabbcc"
Output: "abc"

Input:  "abcdef"
Output: "abcdef"  (no duplicates)

Input:  "aaaa"
Output: "a"
```

### **PATTERN: Hash Set (Seen Tracker)**

### BRUTE FORCE APPROACH
For each character, check if it appeared before it in the string using `indexOf`. O(n²).

### OPTIMAL APPROACH
Scan left to right. Use a Set to track seen characters. Only include a character in the result if not yet seen.

```javascript
function removeDuplicates(str) {
  const seen = new Set();
  let result = '';

  for (const char of str) {
    if (!seen.has(char)) {
      seen.add(char);
      result += char;
    }
  }

  return result;
}

// Using filter (more declarative)
function removeDuplicatesFilter(str) {
  const seen = new Set();
  return str.split('').filter(char => {
    if (seen.has(char)) return false;
    seen.add(char);
    return true;
  }).join('');
}

// Test
console.log(removeDuplicates("programming")); // "progamin"
console.log(removeDuplicates("aabbcc"));      // "abc"
console.log(removeDuplicates("abcdef"));      // "abcdef"
```

- Time: O(n)
- Space: O(k) — Set of up to k unique chars

### WHY THIS PATTERN
A **Set as a "seen" tracker** converts any "first occurrence" problem into a single pass. The boolean question "have I seen this before?" is answered in O(1) by the Set. String concatenation here is acceptable since we build the result once (no loop-within-loop), though `split/filter/join` is cleaner for readability. Always prefer `new Set()` over tracking with a plain object when you only need membership, not counts.

---

## Problem 7 — Count Words in a String

### PROBLEM STATEMENT
Count the number of words in a string. Words are separated by spaces. Handle multiple consecutive spaces.

### EXAMPLES
```
Input:  "Hello World"
Output: 2

Input:  "  Hello   World  "
Output: 2  (leading/trailing/multiple spaces ignored)

Input:  "one"
Output: 1

Input:  "  "
Output: 0

Input:  ""
Output: 0
```

### **PATTERN: Split + Filter**

### BRUTE FORCE APPROACH
Manually scan character by character, count transitions from space to non-space. Works but verbose.

### OPTIMAL APPROACH
Use `split` with regex to handle multiple spaces, then filter out empty strings.

```javascript
function countWords(str) {
  if (!str || !str.trim()) return 0;

  // split(/\s+/) splits on one or more whitespace characters
  // filter(Boolean) removes empty strings (from leading/trailing spaces)
  return str.trim().split(/\s+/).length;
}

// Manual approach (good to know for interviews without built-ins)
function countWordsManual(str) {
  let count = 0;
  let inWord = false;

  for (const char of str) {
    if (char !== ' ' && !inWord) {
      count++;
      inWord = true;
    } else if (char === ' ') {
      inWord = false;
    }
  }

  return count;
}

// Test
console.log(countWords("Hello World"));       // 2
console.log(countWords("  Hello   World  ")); // 2
console.log(countWords("one"));               // 1
console.log(countWords("  "));                // 0
console.log(countWords(""));                  // 0
```

- Time: O(n)
- Space: O(n) for `split` result; O(1) for manual approach

### WHY THIS PATTERN
`split(/\s+/)` is the canonical JavaScript idiom for tokenizing on whitespace. The regex `\s+` matches one or more whitespace characters (spaces, tabs, newlines), handling all edge cases at once. The `trim()` before `split` prevents a leading space from creating an empty string as the first token. Know both the built-in and the manual state-machine approach — interviewers sometimes say "without using split."

---

## Problem 8 — Capitalize First Letter of Each Word

### PROBLEM STATEMENT
Given a string, capitalize the first letter of every word. (Title Case)

### EXAMPLES
```
Input:  "hello world"
Output: "Hello World"

Input:  "the quick brown fox"
Output: "The Quick Brown Fox"

Input:  "already Capitalized"
Output: "Already Capitalized"

Input:  "  multiple   spaces  "
Output: "Multiple   Spaces"  (preserve spacing structure)
```

### **PATTERN: Split / Map / Join**

### BRUTE FORCE APPROACH
Scan character by character, capitalize after every space. O(n) but verbose.

### OPTIMAL APPROACH
Split into words, capitalize each word's first letter, rejoin.

```javascript
function titleCase(str) {
  return str
    .split(' ')                    // Split on single space (preserves multiple spaces as empty strings)
    .map(word => {
      if (!word) return word;      // Preserve empty strings from multiple spaces
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

// Variant: only uppercase first, leave rest unchanged (don't lowercase)
function capitalizeFirst(str) {
  return str
    .split(' ')
    .map(word => word ? word[0].toUpperCase() + word.slice(1) : word)
    .join(' ');
}

// Using regex (one-liner)
const titleCaseRegex = str =>
  str.replace(/\b\w/g, char => char.toUpperCase());
// \b = word boundary, \w = word character

// Test
console.log(titleCase("hello world"));           // "Hello World"
console.log(titleCase("the quick brown fox"));   // "The Quick Brown Fox"
console.log(capitalizeFirst("already Capitalized")); // "Already Capitalized"
```

- Time: O(n)
- Space: O(n)

### WHY THIS PATTERN
The **split → map → join** pipeline is the idiomatic JavaScript string transformation pattern. It maps naturally to "process each word independently." The regex approach (`/\b\w/g`) is elegant but can behave unexpectedly with apostrophes and hyphens (e.g., "o'clock" → "O'Clock"). Know both. The `slice(1)` to get everything after the first character is a key string idiom.

---

## Problem 9 — Check if String Contains Only Digits

### PROBLEM STATEMENT
Return `true` if the string consists entirely of numeric digits (0–9). Return `false` for empty strings, spaces, or any non-digit character.

### EXAMPLES
```
Input:  "12345"
Output: true

Input:  "123a5"
Output: false

Input:  "123 45"
Output: false  (space is not a digit)

Input:  ""
Output: false

Input:  "007"
Output: true
```

### **PATTERN: Regex / Linear Scan**

### BRUTE FORCE / APPROACHES
Multiple valid approaches depending on context.

```javascript
// Approach 1: Regex (cleanest, most readable)
function isAllDigitsRegex(str) {
  if (!str) return false;
  return /^\d+$/.test(str);
  // ^ = start, \d = digit, + = one or more, $ = end
}

// Approach 2: Linear scan (good when regex not allowed)
function isAllDigitsLinear(str) {
  if (!str) return false;

  for (const char of str) {
    if (char < '0' || char > '9') return false; // Character comparison works!
  }
  return true;
}

// Approach 3: every() (functional)
function isAllDigitsEvery(str) {
  if (!str) return false;
  return [...str].every(char => char >= '0' && char <= '9');
}

// Approach 4: Number() — AVOID (has edge cases)
// Number("  123  ") = 123 — passes despite spaces
// Number("") = 0 — empty string passes as 0

// Test
console.log(isAllDigitsRegex("12345"));  // true
console.log(isAllDigitsRegex("123a5"));  // false
console.log(isAllDigitsRegex("123 45")); // false
console.log(isAllDigitsRegex(""));       // false
console.log(isAllDigitsRegex("007"));    // true
```

- Time: O(n) — all approaches
- Space: O(1) — regex and linear scan

### WHY THIS PATTERN
Know at least two approaches: **regex** for interviews where conciseness matters, **linear scan** for environments where regex is restricted or you need to explain each step. The character comparison `char >= '0' && char <= '9'` works because JavaScript compares strings lexicographically — '0' to '9' are consecutive ASCII codes. Avoid `isNaN(str)` or `Number(str)` — they handle whitespace unexpectedly and are unreliable validators.

---

## Problem 10 — Find Most Frequent Character

### PROBLEM STATEMENT
Return the character that appears most often in the string. If there's a tie, return the one that appears first.

### EXAMPLES
```
Input:  "programming"
Output: "g"  (appears 2 times, same as r and m — but g appears first at idx 4...
              actually: p=1,r=2,o=1,g=2,a=1,m=2,i=1,n=1 → r appears first at idx 1)
Output: "r"  (r is the first char among the most frequent ones)

Input:  "aabbcc"
Output: "a"  (a, b, c each appear twice — a appears first)

Input:  "zzzzz"
Output: "z"

Input:  "abcde"
Output: "a"  (all appear once — return first)
```

### **PATTERN: Frequency Counter + Linear Scan for Max**

### BRUTE FORCE APPROACH
For each unique character, count its occurrences. O(n × k) where k = unique chars.

### OPTIMAL APPROACH
Build frequency map in one pass, then find max with a single scan preserving first-occurrence priority.

```javascript
function mostFrequentChar(str) {
  // Pass 1: build frequency map
  const freq = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // Pass 2: scan original string — first char we see with the max count wins
  let maxCount = 0;
  for (const char in freq) {
    maxCount = Math.max(maxCount, freq[char]);
  }

  // Scan original order to find first char with maxCount (preserves "first" requirement)
  for (const char of str) {
    if (freq[char] === maxCount) return char;
  }

  return '';
}

// One-pass-ish alternative using reduce
function mostFrequentCharReduce(str) {
  const freq = [...str].reduce((map, c) => {
    map[c] = (map[c] || 0) + 1;
    return map;
  }, {});

  return [...str].find(
    c => freq[c] === Math.max(...Object.values(freq))
  );
  // Note: Math.max(...Object.values(freq)) is O(k) on each find iteration — ok for small k
}

// Test
console.log(mostFrequentChar("programming")); // "r"
console.log(mostFrequentChar("aabbcc"));      // "a"
console.log(mostFrequentChar("zzzzz"));       // "z"
```

- Time: O(n)
- Space: O(k)

### WHY THIS PATTERN
Splitting into "build counts" then "find max in original order" is cleaner than trying to track max during the build phase. Scanning the **original string** (not the map keys) in Pass 2 naturally handles the tie-breaking rule (first occurrence) — the map's key iteration order is insertion order in modern JS, but scanning the original string guarantees correct behavior.

---

## Problem 11 — Truncate String to N Characters with Ellipsis

### PROBLEM STATEMENT
Truncate a string to a maximum of N characters. If truncated, append `"..."`. If the string is already ≤ N characters, return it unchanged.

### EXAMPLES
```
Input:  "Hello, World!", 5
Output: "Hello..."

Input:  "Hello", 10
Output: "Hello"  (shorter than limit — no truncation)

Input:  "Hello", 5
Output: "Hello"  (exactly 5 — no truncation)

Input:  "Hello World", 5
Output: "Hello..."

Input:  "", 5
Output: ""
```

### **PATTERN: Slice + Conditional**

### BRUTE FORCE / APPROACH
One clean approach exists — slice and conditional append.

```javascript
function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}

// With word boundary awareness (don't cut in middle of word)
function truncateAtWord(str, maxLen) {
  if (str.length <= maxLen) return str;

  const truncated = str.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(' ');

  // If there's a space, cut at last word boundary
  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + '...';
  }

  return truncated + '...';
}

// Test
console.log(truncate("Hello, World!", 5));  // "Hello..."
console.log(truncate("Hello", 10));         // "Hello"
console.log(truncate("Hello", 5));          // "Hello"
console.log(truncate("Hello World", 5));    // "Hello..."

console.log(truncateAtWord("Hello World foo", 10)); // "Hello..."
// (truncated to "Hello Worl", last space at 5 → cut there)
```

- Time: O(n)
- Space: O(n) — new string

### WHY THIS PATTERN
`str.slice(start, end)` is the primary JavaScript string extraction method. `str.substring` and `str.substr` also exist but `slice` is preferred — it handles negative indices and is consistent. The key interview extension is **word-boundary truncation** (`lastIndexOf(' ')`), which is what real applications need (never cut "Hello Wo..."). `lastIndexOf` finds the rightmost occurrence — perfect for "last space before the limit."

---

## Problem 12 — String Compression

### PROBLEM STATEMENT
Compress consecutive repeated characters into `character + count`. If the compressed string is not shorter, return the original. (LeetCode 443 variant)

### EXAMPLES
```
Input:  "aaabbc"
Output: "a3b2c1"

Input:  "aabcccdd"
Output: "a2b1c3d2"

Input:  "abcd"
Output: "a1b1c1d1"  → length 8 > 4 → return "abcd" (original shorter)

Input:  "aaaaaa"
Output: "a6"

Input:  "a"
Output: "a"
```

### **PATTERN: Accumulator (Count Consecutive)**

### BRUTE FORCE APPROACH
Same complexity — there's one natural approach.

### OPTIMAL APPROACH
Walk the string tracking current character and its consecutive count. When the character changes, flush the accumulated count.

```javascript
function compress(str) {
  if (!str) return str;

  let result = '';
  let i = 0;

  while (i < str.length) {
    const currentChar = str[i];
    let count = 0;

    // Count how many times currentChar repeats consecutively
    while (i < str.length && str[i] === currentChar) {
      count++;
      i++;
    }

    result += currentChar + count; // e.g., "a3"
  }

  // Only return compressed if it's actually shorter
  return result.length < str.length ? result : str;
}

// Cleaner version using for loop and lookahead
function compressClean(str) {
  if (!str) return str;

  let result = '';
  let count = 1;

  for (let i = 1; i <= str.length; i++) {
    if (i < str.length && str[i] === str[i - 1]) {
      count++; // Same character — increment count
    } else {
      result += str[i - 1] + count; // Different character — flush
      count = 1;                     // Reset for next group
    }
  }

  return result.length < str.length ? result : str;
}

// Test
console.log(compress("aaabbc"));   // "a3b2c1"
console.log(compress("aabcccdd")); // "a2b1c3d2"
console.log(compress("abcd"));     // "abcd" (compressed "a1b1c1d1" is longer)
console.log(compress("aaaaaa"));   // "a6"
console.log(compress("a"));        // "a"
```

- Time: O(n) — one pass
- Space: O(n) — result string

### WHY THIS PATTERN
The **accumulator** pattern groups consecutive equal elements. The key technique: iterate with a lookahead (`str[i] !== str[i-1]` or `i === str.length`) to detect when a run ends. This is the same approach used in run-length encoding (image compression) and diff algorithms. The "flush on change" mechanic — accumulating until something changes, then outputting — appears in many stream-processing and encoding problems. The `i <= str.length` (inclusive) trick in the for loop handles flushing the final group without a separate post-loop statement.

---

## Pattern Summary

| Problem | Pattern | Time | Space |
|---------|---------|------|-------|
| Reverse string | Two Pointers (convert to array) | O(n) | O(n) |
| Check palindrome | Two Pointers (converging) | O(n) | O(1) |
| Count vowels/consonants | Linear Scan + Set lookup | O(n) | O(1) |
| Check anagram | Frequency Counter (count up/down) | O(n) | O(k) |
| First non-repeating char | Frequency Counter (two-pass) | O(n) | O(k) |
| Remove duplicates | Hash Set (seen tracker) | O(n) | O(k) |
| Count words | Split + Filter | O(n) | O(n) |
| Title case | Split / Map / Join | O(n) | O(n) |
| Only digits check | Regex / Linear Scan | O(n) | O(1) |
| Most frequent char | Frequency Counter + max scan | O(n) | O(k) |
| Truncate with ellipsis | Slice + conditional | O(n) | O(n) |
| String compression | Accumulator (count consecutive) | O(n) | O(n) |

**Common JS string methods used across these problems:**
```javascript
str.split('')          // string → char array
arr.join('')           // char array → string
str.slice(start, end)  // extract substring
str.toUpperCase/toLowerCase()
str.trim()             // remove leading/trailing whitespace
str.replace(regex, fn) // powerful substitution
str.indexOf(char)      // first occurrence
str.lastIndexOf(char)  // last occurrence
/regex/.test(str)      // boolean regex match
str[i]                 // character at index (read-only)
```
