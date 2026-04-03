# Strings — Medium Problems

8 medium string problems. These introduce the core patterns that appear on 80% of string interview questions: Sliding Window, Stack, and Backtracking. Each problem here has a non-obvious optimal approach that's worth understanding deeply.

---

## Problem 1 — Longest Substring Without Repeating Characters

### PROBLEM STATEMENT
Given a string, find the length of the longest substring that contains no repeating characters. (LeetCode 3)

### EXAMPLES
```
Input:  "abcabcbb"
Output: 3  (substring "abc")

Input:  "bbbbb"
Output: 1  (substring "b")

Input:  "pwwkew"
Output: 3  (substring "wke")

Input:  ""
Output: 0

Input:  "abcdef"
Output: 6  (entire string)
```

### **PATTERN: Sliding Window (Variable Size + Hash Map)**

### BRUTE FORCE APPROACH
Generate all substrings, check each for uniqueness using a Set. Return length of longest valid one.
- Time: O(n³) — O(n²) substrings × O(n) uniqueness check
- Space: O(n)

```javascript
// Brute force
function lengthOfLongestSubstringBrute(s) {
  let maxLen = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set();
    for (let j = i; j < s.length; j++) {
      if (seen.has(s[j])) break; // Duplicate found — stop extending
      seen.add(s[j]);
      maxLen = Math.max(maxLen, j - i + 1);
    }
  }
  return maxLen;
}
```

### OPTIMAL APPROACH
Sliding window with a Map tracking the **last seen index** of each character. When a duplicate is found, jump `left` directly to `lastIndex + 1` instead of shrinking one step at a time.

```javascript
function lengthOfLongestSubstring(s) {
  const lastSeen = new Map(); // char → last seen index
  let maxLen = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    // If char seen before AND its last occurrence is inside our current window
    if (lastSeen.has(char) && lastSeen.get(char) >= left) {
      // Jump left past the previous occurrence to maintain no-duplicate invariant
      left = lastSeen.get(char) + 1;
    }

    lastSeen.set(char, right); // Update last seen index for this char
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// Test
console.log(lengthOfLongestSubstring("abcabcbb")); // 3
console.log(lengthOfLongestSubstring("bbbbb"));    // 1
console.log(lengthOfLongestSubstring("pwwkew"));   // 3
console.log(lengthOfLongestSubstring(""));         // 0
```

- Time: O(n) — right pointer visits each char once; left jumps forward, never back
- Space: O(min(n, k)) — map stores at most k unique chars

**Trace for "abcabcbb":**
```
right=0 (a): lastSeen={a:0}. window=[0,0]. len=1
right=1 (b): lastSeen={a:0,b:1}. window=[0,1]. len=2
right=2 (c): lastSeen={a:0,b:1,c:2}. window=[0,2]. len=3
right=3 (a): a seen at 0, 0>=left(0) → left=1. lastSeen={a:3,b:1,c:2}. window=[1,3]. len=3
right=4 (b): b seen at 1, 1>=left(1) → left=2. lastSeen={a:3,b:4,c:2}. window=[2,4]. len=3
right=5 (c): c seen at 2, 2>=left(2) → left=3. window=[3,5]. len=3
right=6 (b): b seen at 4, 4>=left(3) → left=5. window=[5,6]. len=2
right=7 (b): b seen at 6, 6>=left(5) → left=7. window=[7,7]. len=1
Result: 3 ✓
```

**Critical detail:** The check `lastSeen.get(char) >= left` prevents jumping `left` backwards. If a character was seen before the current window started, its last-seen index is irrelevant — we don't shrink left unnecessarily.

### WHY THIS PATTERN
**Variable-size sliding window** maintains a window `[left, right]` that satisfies a constraint (no duplicates). The right pointer expands; when the constraint breaks, the left pointer shrinks. The jump-to-position optimization (using a map vs a set) skips O(n) individual left++ steps. This problem is the canonical sliding window template — master it and you can solve all variants (at most K distinct chars, at most K repeating chars, etc.).

---

## Problem 2 — Group Anagrams

### PROBLEM STATEMENT
Given an array of strings, group the anagrams together and return the groups. (LeetCode 49)

### EXAMPLES
```
Input:  ["eat","tea","tan","ate","nat","bat"]
Output: [["eat","tea","ate"],["tan","nat"],["bat"]]

Input:  [""]
Output: [[""]]

Input:  ["a"]
Output: [["a"]]
```

### **PATTERN: Hash Map + Sorted String as Key**

### BRUTE FORCE APPROACH
Compare every pair of strings to check if they're anagrams. Group into clusters. O(n² × k log k) where k = average string length.

### OPTIMAL APPROACH
Sorted characters of an anagram are always identical: `"eat"` → `"aet"`, `"tea"` → `"aet"`, `"ate"` → `"aet"`. Use this sorted form as the hash map key.

```javascript
function groupAnagrams(strs) {
  const map = new Map(); // sorted_chars → [original strings]

  for (const str of strs) {
    const key = str.split('').sort().join(''); // "eat" → "aet"

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(str);
  }

  return [...map.values()]; // Convert map values to array of arrays
}

// Alternative key: character frequency array as key
// (O(k) instead of O(k log k) but more complex)
function groupAnagramsFreq(strs) {
  const map = new Map();

  for (const str of strs) {
    // Build 26-element frequency array for lowercase letters
    const freq = new Array(26).fill(0);
    for (const char of str) {
      freq[char.charCodeAt(0) - 97]++; // 'a' = 97
    }
    const key = freq.join('#'); // "1#0#0...#1..." unique representation

    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }

  return [...map.values()];
}

// Test
console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));
// [["eat","tea","ate"],["tan","nat"],["bat"]]

console.log(groupAnagrams([""]));  // [[""]]
console.log(groupAnagrams(["a"])); // [["a"]]
```

- Time: O(n × k log k) — n strings, sort each in O(k log k)
- Space: O(n × k) — storing all strings in the map

**For the frequency-array approach:**
- Time: O(n × k) — no sort needed
- Space: O(n × k)

### WHY THIS PATTERN
**Canonical form as hash key** is the general technique for grouping equivalent items. The insight: two things that are "equivalent under some transformation" will produce the same key when that transformation is applied. For anagrams, sorted order is the canonical form. Other canonical forms: sorted absolute values for grouping by magnitude, prime-product encoding for anagrams (but overflow risk), or frequency string. The Map-of-arrays structure is the natural grouping container.

---

## Problem 3 — Longest Palindromic Substring

### PROBLEM STATEMENT
Given a string, find the longest substring that is a palindrome. (LeetCode 5)

### EXAMPLES
```
Input:  "babad"
Output: "bab"  (or "aba" — either is valid)

Input:  "cbbd"
Output: "bb"

Input:  "a"
Output: "a"

Input:  "racecar"
Output: "racecar"

Input:  "abcba"
Output: "abcba"
```

### **PATTERN: Expand Around Center**

### BRUTE FORCE APPROACH
Check every substring whether it's a palindrome using the two-pointer method.
- Time: O(n³) — O(n²) substrings × O(n) palindrome check
- Space: O(1)

### OPTIMAL APPROACH
Every palindrome has a center. There are `2n - 1` possible centers for a string of length n:
- n odd-length centers (single character)
- n-1 even-length centers (between two adjacent characters)

Expand outward from each center while characters match. Track the longest found.

```javascript
function longestPalindrome(s) {
  if (s.length <= 1) return s;

  let start = 0;
  let maxLen = 1;

  function expandFromCenter(left, right) {
    // Expand outward while within bounds and chars match
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const len = right - left + 1;
      if (len > maxLen) {
        maxLen = len;
        start = left; // Track where longest starts
      }
      left--;
      right++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    expandFromCenter(i, i);     // Odd-length palindromes: center is s[i]
    expandFromCenter(i, i + 1); // Even-length palindromes: center is between s[i] and s[i+1]
  }

  return s.slice(start, start + maxLen);
}

// Test
console.log(longestPalindrome("babad"));   // "bab"
console.log(longestPalindrome("cbbd"));    // "bb"
console.log(longestPalindrome("a"));       // "a"
console.log(longestPalindrome("racecar")); // "racecar"
```

- Time: O(n²) — n centers, each expands up to O(n)
- Space: O(1) — only tracking indices

**Trace for "cbbd":**
```
i=0 (c): odd expand: c==c (single). len=1. even expand: c≠b stop.
i=1 (b): odd expand: b==b (single). left=0,right=2: c≠b stop. len=1. even: b==b! len=2, start=1.
         left=0,right=3: c≠d stop.
i=2 (b): odd expand: b==b. left=1,right=3: b≠d stop. len=1. even: b≠d stop.
i=3 (d): odd expand: d==d. even: out of bounds.
maxLen=2, start=1 → s.slice(1,3) = "bb" ✓
```

**Note on Manacher's Algorithm:** There is an O(n) solution called Manacher's algorithm. It's extremely rarely asked in frontend interviews. The expand-around-center O(n²) is the expected interview answer.

### WHY THIS PATTERN
**Expand Around Center** leverages the structural property that palindromes are symmetric. Instead of checking every boundary pair (O(n²) checks × O(n) each), you fix the center and expand outward — the expansion terminates as soon as symmetry breaks. The `2n-1` centers trick handles both odd and even length palindromes uniformly. This "work outward from structure" approach is more efficient than "work inward from boundaries."

---

## Problem 4 — Valid Parentheses

### PROBLEM STATEMENT
Given a string of brackets `()[]{}`, determine if the input is valid. Valid means: open brackets must be closed by the same type in correct order. (LeetCode 20)

### EXAMPLES
```
Input:  "()"
Output: true

Input:  "()[]{}"
Output: true

Input:  "(]"
Output: false

Input:  "([)]"
Output: false

Input:  "{[]}"
Output: true

Input:  "((("
Output: false
```

### **PATTERN: Stack (LIFO matching)**

### BRUTE FORCE APPROACH
Repeatedly scan and remove matched pairs until no more removals occur. Empty string = valid.
- Time: O(n²) — each scan is O(n), up to n/2 rounds
- Space: O(n)

### OPTIMAL APPROACH
Use a stack. Push opening brackets. When a closing bracket is seen, the stack top must be its matching opener.

```javascript
function isValid(str) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const char of str) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);             // Opening bracket — push
    } else {
      // Closing bracket
      if (stack.length === 0) return false;       // Nothing to match
      if (stack.pop() !== pairs[char]) return false; // Wrong type
    }
  }

  return stack.length === 0; // Valid only if all opened brackets were closed
}

// Test
console.log(isValid("()"));     // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]"));     // false
console.log(isValid("([)]"));   // false
console.log(isValid("{[]}"));   // true
console.log(isValid("((("));    // false
```

- Time: O(n) — one pass
- Space: O(n) — stack holds at most n/2 opening brackets

**Trace for "{[]}":**
```
char='{': push. stack=['{']
char='[': push. stack=['{','[']
char=']': closing. pop='['. pairs[']']='['. '[' === '[' ✓. stack=['{']
char='}': closing. pop='{'. pairs['}']='['. '{' === '{' ✓. stack=[]
End: stack empty → true ✓
```

**Trace for "([)]":**
```
char='(': push. stack=['(']
char='[': push. stack=['(','[']
char=')': closing. pop='['. pairs[')']]='('. '[' !== '(' → false ✗
```

### WHY THIS PATTERN
**Stack** is the natural data structure for any problem involving nested matching or "most recent unmatched X." The LIFO property maps perfectly to nesting: the most recently opened bracket must be the next one closed. The `pairs` map makes the matching condition a single O(1) lookup. This pattern is the foundation for expression evaluation, HTML/XML validation, and undo/redo systems.

---

## Problem 5 — Generate All Permutations of a String

### PROBLEM STATEMENT
Given a string with all unique characters, generate all possible permutations. Return them in any order.

### EXAMPLES
```
Input:  "abc"
Output: ["abc","acb","bac","bca","cab","cba"]  (6 = 3! permutations)

Input:  "ab"
Output: ["ab","ba"]

Input:  "a"
Output: ["a"]
```

### **PATTERN: Backtracking (Choose → Explore → Unchoose)**

### BRUTE FORCE APPROACH
There is no non-backtracking approach — brute force IS generating all permutations. The question is HOW to generate them efficiently.

### OPTIMAL APPROACH
Backtracking: at each step, choose a character from the remaining characters, add it to the current path, recurse for the rest, then remove it (backtrack) to try the next option.

```javascript
function permutations(str) {
  const result = [];

  function backtrack(current, remaining) {
    // Base case: no more characters to add — we have a complete permutation
    if (remaining.length === 0) {
      result.push(current);
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      // Choose: pick character at index i
      const chosen = remaining[i];
      const newRemaining = remaining.slice(0, i) + remaining.slice(i + 1); // Remove chosen char

      // Explore: recurse with this choice made
      backtrack(current + chosen, newRemaining);

      // Unchoose: (implicit here — we pass new strings, no mutation to undo)
    }
  }

  backtrack('', str);
  return result;
}

// In-place version using character swapping (more space-efficient)
function permutationsInPlace(str) {
  const result = [];
  const chars = str.split('');

  function backtrack(start) {
    if (start === chars.length) {
      result.push(chars.join(''));
      return;
    }

    for (let i = start; i < chars.length; i++) {
      [chars[start], chars[i]] = [chars[i], chars[start]]; // Swap
      backtrack(start + 1);                                 // Explore
      [chars[start], chars[i]] = [chars[i], chars[start]]; // Unchoose (swap back)
    }
  }

  backtrack(0);
  return result;
}

// Test
console.log(permutations("abc"));
// ["abc","acb","bac","bca","cab","cba"]

console.log(permutations("ab"));
// ["ab","ba"]
```

- Time: O(n! × n) — n! permutations, O(n) to build each
- Space: O(n! × n) — storing all permutations; O(n) call stack depth

**Backtracking decision tree for "abc":**
```
backtrack('', 'abc')
├── choose 'a': backtrack('a', 'bc')
│   ├── choose 'b': backtrack('ab', 'c') → push "abc"
│   └── choose 'c': backtrack('ac', 'b') → push "acb"
├── choose 'b': backtrack('b', 'ac')
│   ├── choose 'a': backtrack('ba', 'c') → push "bac"
│   └── choose 'c': backtrack('bc', 'a') → push "bca"
└── choose 'c': backtrack('c', 'ab')
    ├── choose 'a': backtrack('ca', 'b') → push "cab"
    └── choose 'b': backtrack('cb', 'a') → push "cba"
```

### WHY THIS PATTERN
**Backtracking** is the systematic way to generate all possibilities when each step has multiple choices. The three-step template — **Choose, Explore, Unchoose** — is universal. "Unchoose" (backtrack) is what makes it efficient: you reuse the same data structure for all branches instead of copying. For permutations, the swap-based in-place version avoids creating new strings at each level. This pattern is the foundation of subset generation, combinations, N-queens, sudoku solving, and word search.

---

## Problem 6 — Minimum Window Substring

### PROBLEM STATEMENT
Given strings `s` and `t`, find the minimum length substring of `s` that contains all characters of `t`. Return `""` if no such substring exists. (LeetCode 76)

### EXAMPLES
```
Input:  s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"

Input:  s = "a", t = "a"
Output: "a"

Input:  s = "a", t = "aa"
Output: ""  (need 2 a's, only 1 available)

Input:  s = "aa", t = "aa"
Output: "aa"
```

### **PATTERN: Sliding Window (Shrinkable — Two Pointers + Frequency Map)**

### BRUTE FORCE APPROACH
Generate all substrings of s, check if each contains all characters of t.
- Time: O(n² × m) where m = length of t
- Space: O(m)

### OPTIMAL APPROACH
Expand right until the window contains all characters of t. Then shrink left as much as possible while still valid. Track the minimum valid window found.

```javascript
function minWindow(s, t) {
  if (t.length > s.length) return '';

  // Build target frequency map
  const need = new Map();
  for (const char of t) {
    need.set(char, (need.get(char) || 0) + 1);
  }

  let have = 0;                    // How many chars of t we've satisfied
  const required = need.size;      // How many UNIQUE chars of t we need (not total count)
  const window = new Map();        // Current window character frequencies

  let left = 0;
  let minLen = Infinity;
  let minStart = 0;

  for (let right = 0; right < s.length; right++) {
    // Expand: add s[right] to window
    const char = s[right];
    window.set(char, (window.get(char) || 0) + 1);

    // Check if this character satisfies a requirement
    if (need.has(char) && window.get(char) === need.get(char)) {
      have++; // This char's count in window now matches what we need
    }

    // Shrink: while window is valid, try to make it smaller
    while (have === required) {
      // Update minimum window
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }

      // Remove leftmost character
      const leftChar = s[left];
      window.set(leftChar, window.get(leftChar) - 1);
      if (need.has(leftChar) && window.get(leftChar) < need.get(leftChar)) {
        have--; // Lost a required character — window no longer valid
      }
      left++;
    }
  }

  return minLen === Infinity ? '' : s.slice(minStart, minStart + minLen);
}

// Test
console.log(minWindow("ADOBECODEBANC", "ABC")); // "BANC"
console.log(minWindow("a", "a"));               // "a"
console.log(minWindow("a", "aa"));              // ""
```

- Time: O(n + m) — right visits each char once; left advances at most n times total
- Space: O(m + k) — need map (size of t's unique chars) + window map

**Trace for s="ADOBECODEBANC", t="ABC":**
```
need={A:1, B:1, C:1}. required=3.
Expand right until have=3:
  right=0(A): window={A:1}. A satisfied. have=1
  right=1(D): window={A:1,D:1}. have=1
  right=2(O): have=1
  right=3(B): B satisfied. have=2
  right=4(E): have=2
  right=5(C): C satisfied. have=3 → SHRINK
    left=0(A): window{A:0} < need{A:1} → have=2. left=1. minWindow="ADOBEC"
Expand again...
  right=9(A): A satisfied. have=3 → SHRINK
    left=1(D): not in need. left=2
    left=2(O): not in need. left=3
    left=3(B): B still satisfied (count stays≥1 after removal? no:0<1). have=2.
Expand...
  right=10(N): have=2
  right=11(A): have=2 (A already satisfied from index 9)...
  Wait — right=10(B): B satisfied. have=3 → SHRINK
    left=3(B): window{B:0}<need{B:1}. have=2. left=4. minWindow="BANC" ✓
```

### WHY THIS PATTERN
**Shrinkable sliding window** is used when you need the **minimum** window satisfying a condition (as opposed to maximum, which uses a different shrink trigger). The expand-then-shrink loop structure ensures every valid window is found. The `have === required` condition uses count matching (window count equals need count, not just "character present") to correctly handle duplicate characters in t. This problem is considered the hardest sliding window pattern — mastering it means you can solve all window problems.

---

## Problem 7 — Longest Common Prefix

### PROBLEM STATEMENT
Find the longest string that is a prefix of all strings in the array. Return `""` if no common prefix exists. (LeetCode 14)

### EXAMPLES
```
Input:  ["flower","flow","flight"]
Output: "fl"

Input:  ["dog","racecar","car"]
Output: ""

Input:  ["interview","internal","inter"]
Output: "inter"

Input:  ["a"]
Output: "a"
```

### **PATTERN: Vertical Scan (Column by Column)**

### BRUTE FORCE APPROACH
Take first string as prefix candidate. For each other string, shorten candidate until it's a prefix. O(n × m) where m = average length. (This is actually optimal — we just improve constant factor with vertical scan.)

### OPTIMAL APPROACHES

```javascript
// Approach 1: Vertical Scan (column by column across all strings)
function longestCommonPrefix(strs) {
  if (!strs.length) return '';

  // Check column by column (character position across all strings)
  for (let col = 0; col < strs[0].length; col++) {
    const char = strs[0][col]; // Reference character from first string

    for (let row = 1; row < strs.length; row++) {
      // Stop if: we've gone past the length of this string, or characters differ
      if (col >= strs[row].length || strs[row][col] !== char) {
        return strs[0].slice(0, col); // Return prefix built so far
      }
    }
  }

  return strs[0]; // First string is entirely a prefix of all others
}

// Approach 2: Horizontal Scan (reduce prefix one string at a time)
function longestCommonPrefixHorizontal(strs) {
  let prefix = strs[0];

  for (let i = 1; i < strs.length; i++) {
    // Shorten prefix until strs[i] starts with it
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1); // Remove last character
      if (!prefix) return '';       // No common prefix
    }
  }

  return prefix;
}

// Approach 3: Sort + compare first/last (elegant)
function longestCommonPrefixSort(strs) {
  strs.sort();
  const first = strs[0];
  const last = strs[strs.length - 1];
  let i = 0;

  while (i < first.length && first[i] === last[i]) i++;
  return first.slice(0, i);
  // Lexicographically first and last differ most — common prefix of all = common prefix of these two
}

// Test
console.log(longestCommonPrefix(["flower","flow","flight"])); // "fl"
console.log(longestCommonPrefix(["dog","racecar","car"]));    // ""
console.log(longestCommonPrefix(["interview","internal","inter"])); // "inter"
console.log(longestCommonPrefix(["a"]));                      // "a"
```

- Time: O(n × m) all approaches — n strings, m chars per string in worst case
- Space: O(1) extra (O(n log n) if using sort approach)

**Why vertical scan terminates early:** As soon as any column fails (character mismatch or string too short), we immediately return. For ["flower","flow","flight"], col=2 ('o' vs 'i') → return "fl" immediately without checking columns 3+.

**Why sort approach works:** After lexicographic sort, the first and last strings have the maximum possible difference. Any prefix shared by both must be shared by all strings in between. So only 2 comparisons needed regardless of array size.

### WHY THIS PATTERN
**Vertical scan** works here because prefix checking is naturally a column-by-column operation — you check position 0 across all strings, then position 1, etc. The early termination makes it efficient. The **sort trick** is an elegant O(1)-comparison insight: in a sorted array, maximum divergence is at the ends, so the first/last pair determines the answer. Multiple valid approaches — know at least two and their tradeoffs.

---

## Problem 8 — Decode String

### PROBLEM STATEMENT
Given an encoded string like `"3[ab]2[cd]"`, decode it to `"ababcdcd"`. Rules: `k[encoded]` means `encoded` is repeated k times. Brackets can be nested: `"2[3[a]b]"` → `"aaabaaab"`. (LeetCode 394)

### EXAMPLES
```
Input:  "3[a]2[bc]"
Output: "aaabcbc"

Input:  "3[a2[c]]"
Output: "accaccacc"

Input:  "2[abc]3[cd]ef"
Output: "abcabccdcdcdef"

Input:  "10[a]"
Output: "aaaaaaaaaa"
```

### **PATTERN: Stack (Nested Structure Processing)**

### BRUTE FORCE APPROACH
Recursive parsing. Scan for innermost brackets first, expand, repeat. O(n × maxDepth) and complex to implement correctly.

### OPTIMAL APPROACH
Use a stack to handle nesting. Push current string and repeat count when `[` is seen. Pop and repeat when `]` is seen.

```javascript
function decodeString(s) {
  const stack = [];         // Stack of [currentString, repeatCount] pairs
  let currentStr = '';
  let currentNum = 0;

  for (const char of s) {
    if (char >= '0' && char <= '9') {
      // Build multi-digit numbers (e.g., "10" = 1 then 0)
      currentNum = currentNum * 10 + parseInt(char);

    } else if (char === '[') {
      // Save current state to stack, start fresh inside brackets
      stack.push([currentStr, currentNum]);
      currentStr = '';
      currentNum = 0;

    } else if (char === ']') {
      // Pop state, repeat currentStr by saved count, prepend saved string
      const [prevStr, repeatCount] = stack.pop();
      currentStr = prevStr + currentStr.repeat(repeatCount);

    } else {
      // Regular character — append to current string
      currentStr += char;
    }
  }

  return currentStr;
}

// Test
console.log(decodeString("3[a]2[bc]"));  // "aaabcbc"
console.log(decodeString("3[a2[c]]"));   // "accaccacc"
console.log(decodeString("2[abc]3[cd]ef")); // "abcabccdcdcdef"
console.log(decodeString("10[a]"));      // "aaaaaaaaaa"
```

- Time: O(n × maxRepeat) — each char processed once, but repeat() copies up to maxRepeat times
- Space: O(n) — stack depth proportional to nesting level

**Trace for "3[a2[c]]":**
```
char='3': currentNum=3
char='[': push(['', 3]). currentStr='', currentNum=0. stack=[['',3]]
char='a': currentStr='a'
char='2': currentNum=2
char='[': push(['a', 2]). currentStr='', currentNum=0. stack=[['',3],['a',2]]
char='c': currentStr='c'
char=']': pop ['a',2]. currentStr = 'a' + 'c'.repeat(2) = 'acc'. stack=[['',3]]
char=']': pop ['',3]. currentStr = '' + 'acc'.repeat(3) = 'accaccacc'. stack=[]
Result: 'accaccacc' ✓
```

**Multi-digit number handling:** `currentNum = currentNum * 10 + parseInt(char)` is the standard way to accumulate digits — "10" is processed as `0*10+1=1`, then `1*10+0=10`.

### WHY THIS PATTERN
**Stack** handles nested structure by allowing you to "pause" processing of the outer context and work on the inner context, then "resume" when the inner context is done. The push on `[` saves the outer state; the pop on `]` restores it. This is exactly how recursive call stacks work — using an explicit stack lets you avoid actual recursion and its overhead. This pattern appears in: HTML/XML parsing, expression evaluation, nested JSON parsing, and compiler design (tokenizers).

---

## Pattern Summary

| Problem | Pattern | Time | Space |
|---------|---------|------|-------|
| Longest substring no repeat | Sliding Window (variable) + Map | O(n) | O(k) |
| Group anagrams | Hash Map + sorted key | O(n×k log k) | O(n×k) |
| Longest palindromic substring | Expand Around Center | O(n²) | O(1) |
| Valid parentheses | Stack (LIFO matching) | O(n) | O(n) |
| All permutations | Backtracking | O(n! × n) | O(n! × n) |
| Minimum window substring | Sliding Window (shrinkable) | O(n+m) | O(m) |
| Longest common prefix | Vertical Scan / Sort | O(n×m) | O(1) |
| Decode string | Stack (nested structure) | O(n×maxK) | O(n) |

---

## Connecting Patterns

```
Sliding Window
  ├── Longest Substring No Repeat (variable window, expand + jump left)
  └── Minimum Window Substring (variable window, expand + shrink)
  Key difference: "longest" → shrink only on violation
                  "minimum" → shrink whenever valid (find tightest)

Stack
  ├── Valid Parentheses (matching pairs)
  └── Decode String (nested context restore)
  Key property: LIFO maps to "most recent unresolved" context

Frequency Counter
  ├── Group Anagrams (sorted string as canonical key)
  └── Minimum Window (need/have count matching)
  Key insight: counting lets you avoid comparing directly

Backtracking Template: Choose → Explore → Unchoose
  └── Permutations (generate all orderings)
  └── Also applies to: subsets, combinations, N-queens, sudoku

Expand Around Center
  └── Longest Palindromic Substring
  └── Also: check any symmetric property from a fixed point outward
```
