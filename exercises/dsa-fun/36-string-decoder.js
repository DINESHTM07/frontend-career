// ============================================
// INTRO: String Decoder — Spy Mission HQ
// ============================================
// You've just been recruited as a codebreaker at String Decoder HQ.
// Each mission involves intercepted messages that need decoding.
// The decoded messages reveal secrets about string manipulation patterns.
//
// Every mission uses one of two techniques:
//
//   SLIDING WINDOW:
//     A "window" of characters moves across the string.
//     You slide the window forward — one character in, one out.
//     Perfect for: "find substring with property X" problems.
//     Time: O(n) — each character enters and leaves the window once.
//
//   FREQUENCY COUNTER:
//     Count character occurrences before comparing or validating.
//     Two strings match if their frequency maps are identical.
//     Perfect for: anagram detection, character comparison problems.
//     Time: O(n) — one pass per string.
//
// INTEL: These two patterns solve 80% of LeetCode medium string problems.
//        Recognizing which to use is the real skill.
// ============================================

console.log("=== STRING DECODER HQ — Active Missions ===\n");

// ============================================
// MISSION 1: Reverse the Message (Basic)
// TECHNIQUE: Two Pointers (in-place reversal)
// ============================================
console.log("--- MISSION 1: Reverse the Message ---");
// Intel: A spy sent a message with words in reverse order.
// The interception reversed the entire string, but word order needs fixing.
// Reverse EACH WORD individually, then reverse the whole string.
// Result: "the sky is blue" → "blue is sky the"
// Approach: split, reverse, join OR two-pointer in-place

function reverseMessage(message) {
  // Step 1: Reverse each word
  // Step 2: Reverse the whole string
  return message
    .trim()
    .split(/\s+/)        // split on any whitespace (handles multiple spaces)
    .reverse()
    .join(" ");
}

function reverseMessageInPlace(message) {
  // O(n) time, O(1) extra space — interview-style
  // Convert to array (strings are immutable)
  const chars = message.trim().split("");

  // Helper: reverse a range in-place
  function reverseRange(arr, left, right) {
    while (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
      right--;
    }
  }

  // 1. Reverse each word
  let wordStart = 0;
  for (let i = 0; i <= chars.length; i++) {
    if (i === chars.length || chars[i] === " ") {
      reverseRange(chars, wordStart, i - 1);
      wordStart = i + 1;
    }
  }

  // 2. Reverse the whole array
  reverseRange(chars, 0, chars.length - 1);

  return chars.join("");
}

console.log(reverseMessage("the sky is blue"));           // → "blue is sky the"
console.log(reverseMessage("  hello world  "));           // → "world hello"
console.log(reverseMessageInPlace("Let us code"));        // → "code us Let"
console.log();

// ============================================
// MISSION 2: Anagram Reconnaissance
// TECHNIQUE: Frequency Counter
// ============================================
console.log("--- MISSION 2: Anagram Reconnaissance ---");
// Intel: Two agents use anagram code names. If their code names are anagrams,
// they're in the same cell. Find all pairs of anagram code names.
// Bonus: find ALL anagram GROUPS from a list of words.
//
// Classic problem: Group Anagrams (LeetCode #49)
// Key: sorting a word gives its canonical anagram key
// "eat" → "aet", "tea" → "aet", "tan" → "ant", "ate" → "aet"

function groupAnagramAgents(codenames) {
  const groups = new Map();

  for (const name of codenames) {
    const key = name.split("").sort().join("");  // canonical form
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(name);
  }

  return [...groups.values()];
}

// Optimized: use character count as key instead of sorting (O(n) per word vs O(n log n))
function groupAnagramsFast(codenames) {
  const groups = new Map();

  for (const name of codenames) {
    // 26-element frequency array for a-z
    const freq = new Array(26).fill(0);
    for (const char of name) {
      freq[char.charCodeAt(0) - 97]++;
    }
    const key = freq.join(",");  // "1,0,0,...,1,0,..." → unique per character set
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(name);
  }

  return [...groups.values()];
}

const agents = ["eat", "tea", "tan", "ate", "nat", "bat"];
console.log("Agent codenames:", agents);
console.log("Anagram groups:", JSON.stringify(groupAnagramAgents(agents)));
// → [["eat","tea","ate"], ["tan","nat"], ["bat"]]
console.log();

// ============================================
// MISSION 3: Compression Protocol
// TECHNIQUE: Two Pointers (in-place compression)
// ============================================
console.log("--- MISSION 3: Compression Protocol ---");
// Intel: Messages are compressed using run-length encoding before transmission.
// "aaabbc" → "a3b2c1" (or "a3b2c" — skip count if 1)
// Compress the string; if the compressed version is longer, return the original.
//
// Extension: decompress "a3b2c1" → "aaabbc"

function compressMessage(message) {
  if (!message) return message;

  let compressed = "";
  let count = 1;

  for (let i = 1; i <= message.length; i++) {
    if (i < message.length && message[i] === message[i - 1]) {
      count++;
    } else {
      compressed += message[i - 1] + (count > 1 ? count : "");
      count = 1;
    }
  }

  return compressed.length < message.length ? compressed : message;
}

function decompressMessage(compressed) {
  let result = "";
  let i = 0;

  while (i < compressed.length) {
    const char = compressed[i];
    i++;

    // Read digits following the character
    let numStr = "";
    while (i < compressed.length && !isNaN(compressed[i])) {
      numStr += compressed[i];
      i++;
    }

    const count = numStr ? parseInt(numStr) : 1;
    result += char.repeat(count);
  }

  return result;
}

const messages = ["aaabbc", "aabbcc", "abcde", "aaaaaaabbb"];
messages.forEach(msg => {
  const compressed = compressMessage(msg);
  const decompressed = decompressMessage(compressed);
  console.log(`"${msg}" → "${compressed}" → "${decompressed}"`);
});
console.log();

// ============================================
// MISSION 4: Longest Unique Sequence
// TECHNIQUE: Sliding Window + Set (Frequency Counter)
// ============================================
console.log("--- MISSION 4: Longest Unique Sequence ---");
// Intel: Extract the longest stretch of the message with no repeated characters.
// Repeated characters could be intercepted by enemy scanners.
// Find the LENGTH of the longest substring with all unique characters.
//
// Example: "abcabcbb" → "abc" → length 3
//          "pwwkew"   → "wke" → length 3
//          "bbbbb"    → "b"   → length 1
//
// SLIDING WINDOW:
//   left and right pointers define the current window
//   right advances: add character to window
//   If duplicate found: advance left until duplicate is gone
//   Window is always valid (no duplicates at any time)

function longestUniqueSequence(message) {
  const inWindow = new Set();
  let left = 0;
  let maxLength = 0;
  let maxStart = 0;

  for (let right = 0; right < message.length; right++) {
    // Shrink window from left until current char is no longer duplicate
    while (inWindow.has(message[right])) {
      inWindow.delete(message[left]);
      left++;
    }

    inWindow.add(message[right]);

    if (right - left + 1 > maxLength) {
      maxLength = right - left + 1;
      maxStart = left;
    }
  }

  return {
    length: maxLength,
    substring: message.slice(maxStart, maxStart + maxLength),
  };
}

const intercepts = ["abcabcbb", "bbbbb", "pwwkew", "dvdf", "abcdef"];
intercepts.forEach(msg => {
  const { length, substring } = longestUniqueSequence(msg);
  console.log(`"${msg}" → longest unique: "${substring}" (length: ${length})`);
});
console.log();

// ============================================
// MISSION 5: Minimum Cover Transmission
// TECHNIQUE: Sliding Window (minimum window substring)
// ============================================
console.log("--- MISSION 5: Minimum Cover Transmission ---");
// Intel: A message was transmitted with noise characters mixed in.
// You need the SHORTEST contiguous window in the signal that contains
// ALL characters of the target code word (in any order, can have extras).
//
// Example: signal = "ADOBECODEBANC", code = "ABC"
// Shortest window: "BANC" (contains A, B, C)
//
// SLIDING WINDOW + FREQUENCY COUNTER:
//   need: frequency map of target characters needed
//   have: frequency map of current window
//   formed: count of distinct characters fully satisfied
//   When window is valid (formed === required): try to shrink from left
//   When window is invalid: expand right

function minCoverTransmission(signal, code) {
  if (!signal || !code || signal.length < code.length) return "";

  // What we need to find in the window
  const need = {};
  for (const char of code) need[char] = (need[char] || 0) + 1;

  const required = Object.keys(need).length; // number of distinct chars needed
  let formed = 0;           // how many distinct chars are fully satisfied in window

  const windowCount = {};
  let left = 0;
  let minLen = Infinity;
  let minStart = 0;

  for (let right = 0; right < signal.length; right++) {
    const char = signal[right];
    windowCount[char] = (windowCount[char] || 0) + 1;

    // Check if this char's requirement is now fully met
    if (need[char] !== undefined && windowCount[char] === need[char]) {
      formed++;
    }

    // Window is valid — try to shrink from left
    while (formed === required && left <= right) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }

      // Remove left character from window
      const leftChar = signal[left];
      windowCount[leftChar]--;
      if (need[leftChar] !== undefined && windowCount[leftChar] < need[leftChar]) {
        formed--;  // this char is no longer fully satisfied
      }
      left++;
    }
  }

  return minLen === Infinity ? "" : signal.slice(minStart, minStart + minLen);
}

const transmissions = [
  ["ADOBECODEBANC", "ABC"],
  ["a", "a"],
  ["a", "aa"],
  ["ABCDEFGH", "CEH"],
];

transmissions.forEach(([signal, code]) => {
  const result = minCoverTransmission(signal, code);
  console.log(`signal="${signal}", code="${code}" → min window: "${result}"`);
});
console.log();

// ============================================
// MISSION 6: Permutation Patrol
// TECHNIQUE: Sliding Window + Frequency Counter (fixed size)
// ============================================
console.log("--- MISSION 6: Permutation Patrol ---");
// Intel: A spy is hiding inside a longer message as a permutation (anagram).
// Determine if any permutation of the spy code appears as a substring.
//
// Example: s1="ab", s2="eidbaooo" → true ("ba" is in s2)
// Example: s1="ab", s2="eidboaoo" → false
//
// FIXED-SIZE SLIDING WINDOW: window size = s1.length
// Compare frequency maps of s1 and current window

function isPermutationHiding(spyCode, signal) {
  if (spyCode.length > signal.length) return false;

  const need = new Array(26).fill(0);
  const window = new Array(26).fill(0);

  const base = "a".charCodeAt(0);

  // Build frequency arrays
  for (const char of spyCode) need[char.charCodeAt(0) - base]++;
  for (let i = 0; i < spyCode.length; i++) window[signal[i].charCodeAt(0) - base]++;

  if (need.join() === window.join()) return true;

  // Slide window
  for (let i = spyCode.length; i < signal.length; i++) {
    window[signal[i].charCodeAt(0) - base]++;
    window[signal[i - spyCode.length].charCodeAt(0) - base]--;
    if (need.join() === window.join()) return true;
  }

  return false;
}

// Find ALL starting positions where permutations appear
function findPermutationPositions(spyCode, signal) {
  if (spyCode.length > signal.length) return [];

  const need = new Array(26).fill(0);
  const window = new Array(26).fill(0);
  const base = "a".charCodeAt(0);
  const positions = [];
  const k = spyCode.length;

  for (const char of spyCode) need[char.charCodeAt(0) - base]++;
  for (let i = 0; i < k; i++) window[signal[i].charCodeAt(0) - base]++;

  if (need.join() === window.join()) positions.push(0);

  for (let i = k; i < signal.length; i++) {
    window[signal[i].charCodeAt(0) - base]++;
    window[signal[i - k].charCodeAt(0) - base]--;
    if (need.join() === window.join()) positions.push(i - k + 1);
  }

  return positions;
}

console.log(`"ab" in "eidbaooo": ${isPermutationHiding("ab", "eidbaooo")}`);   // true
console.log(`"ab" in "eidboaoo": ${isPermutationHiding("ab", "eidboaoo")}`);   // false
console.log(`Positions of "abc" in "cbabcacb": ${findPermutationPositions("abc", "cbabcacb")}`); // [0, 2, 5]
console.log();

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. In Mission 4 (Longest Unique), why do we use a Set instead of a Map?
//    When would you need a Map over a Set for a sliding window problem?
//
// 2. In Mission 5 (Minimum Cover), explain 'formed' and 'required'.
//    When does formed === required? What does it mean for the window?
//    Why do we shrink from the LEFT when the window is valid (not the right)?
//
// 3. Fixed-size sliding window (Mission 6) vs variable-size (Mission 5):
//    What makes a window "fixed size"? What signals the window should grow/shrink
//    in a variable-size window?
//
// 4. Mission 3 compresses "abcde" and returns the original (not "a1b1c1d1e1").
//    Why? What's the logic that decides whether to return compressed or original?

// ============================================
// YOUR TURN: 3 Harder Spy Missions
// ============================================

// ============================================
// MISSION 7: The DNA Sequence (Harder)
// TECHNIQUE: Sliding Window + Hashing
// ============================================
// Intel: Enemy DNA sequences appear repeatedly in a long string.
// Find all repeated 10-letter DNA sequences (substrings of length 10).
// Return the ones that appear more than once.
//
// Example: dna = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"
// Repeated: ["AAAAACCCCC", "CCCCCAAAAA"]
//
// Hint: Slide a window of size 10 across the string.
//       Store each 10-char window in a frequency map.
//       Return all with frequency >= 2.
//
// BONUS: Rabin-Karp rolling hash — instead of storing strings,
//        use a hash of the window. O(n) time and space.

function findRepeatedDNA(dna) {
  // YOUR CODE HERE
  // 1. Use a Map to count occurrences of each 10-char window
  // 2. Slide window across dna string
  // 3. Return all sequences with count >= 2
  return [];
}

// console.log("Mission 7:", findRepeatedDNA("AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"));
// Expected: ["AAAAACCCCC", "CCCCCAAAAA"]

// ============================================
// MISSION 8: The Zigzag Frequency (Harder)
// TECHNIQUE: Sliding Window + Two Frequency Counters
// ============================================
// Intel: A "balanced window" in a transmission is a substring where
// NO character appears more than k times. Find the length of the longest
// such window (longest substring with at most k of any one character).
//
// Example: s = "AABABBA", k = 1
// Longest window with no char appearing more than 1 time: "AB" or "BA" → length 2
//
// Example: s = "AABABBA", k = 2
// Longest window with no char appearing more than 2 times: "AABAB" → length 5
//
// Hint: Slide a window. When any character's count exceeds k, shrink from left.

function longestBalancedWindow(s, k) {
  // YOUR CODE HERE
  // windowCount: track freq of each char in current window
  // If windowCount[char] > k: shrink left until windowCount[char] <= k
  // Track max window size throughout
  return 0;
}

// console.log("Mission 8:", longestBalancedWindow("AABABBA", 1)); // → 2
// console.log("Mission 8:", longestBalancedWindow("AABABBA", 2)); // → 5

// ============================================
// MISSION 9: The Palindrome Intercept (Boss Level)
// TECHNIQUE: Sliding Window + Frequency Counter (palindrome partitioning)
// ============================================
// Intel: Find all palindromic substrings in an intercepted message.
// Return the count of palindromic substrings and the longest one.
// "aaa" has 6 palindromic substrings: "a","a","a","aa","aa","aaa"
//
// Approach: Expand Around Center
//   For each position (and each gap between positions), expand outward
//   while the characters match. Each expansion = one palindrome found.
//   O(n²) time, O(1) space.
//
// "racecar" → palindromes: r,a,c,e,c,a,r,cec,aceca,racecar → 10

function findAllPalindromes(message) {
  // YOUR CODE HERE
  // Function: expandFromCenter(left, right) → count palindromes while expanding
  // Call for each center: expandFromCenter(i, i) for odd-length
  //                       expandFromCenter(i, i+1) for even-length
  // Accumulate total count and track the longest
  return { count: 0, longest: "" };
}

// console.log("Mission 9:", findAllPalindromes("aaa"));      // { count: 6, longest: "aaa" }
// console.log("Mission 9:", findAllPalindromes("racecar")); // { count: 10, longest: "racecar" }
// console.log("Mission 9:", findAllPalindromes("abc"));     // { count: 3, longest: "a" }

// ============================================
// PATTERN LEARNED: Sliding Window + Frequency Counter
// ============================================
// SLIDING WINDOW — Use when:
//   "Find substring/subarray with property X"
//   "Longest/shortest window satisfying a condition"
//   "All windows of size k" (fixed size)
//
//   FIXED SIZE (size = k):
//     Initialize window with first k elements
//     Slide: add right element, remove element k steps behind
//     Compare at each valid position
//     Use for: "k-size window with max sum", "find permutations of length k"
//
//   VARIABLE SIZE (shrink/grow on conditions):
//     right expands: add to window, update state
//     When invalid: left shrinks, remove from window, update state
//     When valid: record result (and optionally keep shrinking for minimum)
//     Use for: "longest substring with at most k distinct chars",
//              "minimum window containing all target chars"
//
// FREQUENCY COUNTER IN WINDOW:
//   Map/Object to count chars in current window
//   When sliding: increment new char, decrement removed char
//   Compare window freq to target freq for anagram/permutation problems
//
// TEMPLATE:
//   let left = 0;
//   const window = {};
//   for (let right = 0; right < s.length; right++) {
//     window[s[right]] = (window[s[right]] || 0) + 1;  // expand
//     while (/* invalid condition */) {
//       window[s[left]]--;                              // shrink
//       if (!window[s[left]]) delete window[s[left]];
//       left++;
//     }
//     result = Math.max(result, right - left + 1);     // record
//   }
// ============================================
