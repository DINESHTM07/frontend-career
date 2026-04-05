// ============================================
// INTRO: Array Detective Agency
// ============================================
// Welcome to the Array Detective Agency.
// You've been hired to solve 10 open cases.
// Each case is an array problem in disguise.
//
// Every case follows the same structure:
//   1. The crime scene: what happened, who the suspects are (the input)
//   2. Your mission: what you need to find (the problem statement)
//   3. Evidence: worked example with explanation
//   4. Your investigation: implement the solution
//   5. Test your theory: run it
//
// PATTERNS USED:
//   Two Pointers: Two indices moving toward each other or at different speeds
//   Frequency Counter: Count occurrences before comparing (avoid nested loops)
//
// WHY these patterns?
//   Naive solutions use nested loops → O(n²) time
//   These patterns → O(n) or O(n log n) time
//   On LeetCode/interviews: if you see "find a pair", think Two Pointers or HashMap
// ============================================

console.log("=== ARRAY DETECTIVE AGENCY — Open for Business ===\n");

// ============================================
// CASE 1: The Missing Person
// PATTERN: Frequency Counter (or math trick)
// ============================================
console.log("--- CASE 1: The Missing Person ---");
// Crime Scene: A town has exactly 100 registered citizens, numbered 1 to 100.
// The census list only has 99 entries. One citizen is unaccounted for.
// The list is NOT sorted. Find the missing citizen's number.
//
// Example:
//   suspects = [3, 1, 4, 5, 2] (should be 1-5, one missing)
//   Missing: 6? No wait — range is 1..n+1 where n = arr.length
//   suspects = [3, 1, 4, 2], n=4 → range 1..5 → missing: 5
//
// KEY INSIGHT: sum(1..n+1) - sum(array) = missing number
// sum(1..n) = n*(n+1)/2 — Gauss's formula

function findMissingCitizen(citizens) {
  const n = citizens.length + 1; // full range is 1..n
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = citizens.reduce((acc, num) => acc + num, 0);
  return expectedSum - actualSum;
}

const census = [3, 7, 1, 2, 8, 4, 5];  // range 1-8, one missing
const missing = findMissingCitizen(census);
console.log(`Census list: [${census}]`);
console.log(`Missing citizen: #${missing}`);  // → 6
console.log(`Verified: ${[...census, missing].sort((a,b)=>a-b).join(", ")}\n`);

// ============================================
// CASE 2: The Duplicate ID Badge
// PATTERN: Frequency Counter (HashMap)
// ============================================
console.log("--- CASE 2: The Duplicate ID Badge ---");
// Crime Scene: Security found a duplicate ID badge. All badges are numbered,
// and each number should appear exactly once — but one number was printed twice.
// Find the duplicate.
//
// Example: badges = [1, 3, 4, 2, 2] → duplicate is 2
// Constraint: O(n) time, O(1) space preferred (try XOR trick)
//
// XOR TRICK: x XOR x = 0, x XOR 0 = x
// XOR all badge numbers AND all expected numbers 1..n
// Duplicate XORs itself one extra time → survives

function findDuplicateBadge(badges) {
  // Approach 1: Frequency counter (O(n) time, O(n) space)
  const seen = new Set();
  for (const badge of badges) {
    if (seen.has(badge)) return badge;
    seen.add(badge);
  }

  // Approach 2: XOR trick (O(n) time, O(1) space)
  // let xor = 0;
  // for (let i = 1; i <= badges.length - 1; i++) xor ^= i;
  // for (const b of badges) xor ^= b;
  // return xor;
}

const badges = [1, 3, 4, 2, 2];
console.log(`Badges found: [${badges}]`);
console.log(`Duplicate: #${findDuplicateBadge(badges)}\n`);  // → 2

// ============================================
// CASE 3: The Alibi Pair
// PATTERN: Two Pointers (sorted array)
// ============================================
console.log("--- CASE 3: The Alibi Pair ---");
// Crime Scene: Two suspects claim they were together the night of the crime.
// Their combined alibi time adds up to exactly T minutes.
// The witness log (sorted ascending) has all recorded times.
// Find any two times that sum to T. Return their indices.
//
// Example: times = [2, 7, 11, 15], target = 9 → [0, 1] (2 + 7 = 9)

function findAlibiPair(times, target) {
  // Two pointers: left starts at 0, right at end
  // If sum < target: move left pointer right (increase sum)
  // If sum > target: move right pointer left (decrease sum)
  // If sum = target: found it!
  // O(n) time (already sorted), O(1) space

  let left = 0;
  let right = times.length - 1;

  while (left < right) {
    const sum = times[left] + times[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }

  return null; // no pair found
}

const alibilog = [2, 7, 11, 15];
const targetTime = 9;
const pairIndices = findAlibiPair(alibilog, targetTime);
console.log(`Witness log: [${alibilog}], target: ${targetTime}`);
console.log(`Alibi pair indices: [${pairIndices}] → values: ${pairIndices.map(i => alibilog[i])}\n`);

// ============================================
// CASE 4: The Anagram Forgery
// PATTERN: Frequency Counter
// ============================================
console.log("--- CASE 4: The Anagram Forgery ---");
// Crime Scene: A forger copied a document but rearranged the letters.
// Determine if the two documents are anagrams of each other.
// Two words are anagrams if they use exactly the same letters, same frequency.
//
// Example: "listen" and "silent" are anagrams
// "hello" and "world" are not

function isAnagramForgery(doc1, doc2) {
  if (doc1.length !== doc2.length) return false;

  // Frequency counter: count chars in doc1, then subtract for doc2
  const freq = {};
  for (const char of doc1) freq[char] = (freq[char] || 0) + 1;
  for (const char of doc2) {
    if (!freq[char]) return false;  // char not in doc1, or already exhausted
    freq[char]--;
  }
  return true;

  // Alternative: sort both and compare (O(n log n), simpler)
  // return doc1.split('').sort().join('') === doc2.split('').sort().join('')
}

const pairs = [
  ["listen", "silent"],
  ["hello", "world"],
  ["anagram", "nagaram"],
  ["rat", "car"],
];

pairs.forEach(([a, b]) => {
  console.log(`"${a}" vs "${b}": ${isAnagramForgery(a, b) ? "FORGERY CONFIRMED (anagram)" : "Not a forgery"}`);
});
console.log();

// ============================================
// CASE 5: The Getaway Container
// PATTERN: Two Pointers (max water problem)
// ============================================
console.log("--- CASE 5: The Getaway Container ---");
// Crime Scene: The thief stashed the loot in a container made of two walls.
// You have a list of wall heights along the escape route.
// Find the two walls that hold the most water (form the largest container).
// You cannot tilt the container.
//
// Example: walls = [1,8,6,2,5,4,8,3,7]
// Best pair: walls[1]=8 and walls[8]=7 → min(8,7) * (8-1) = 7 * 7 = 49
//
// KEY INSIGHT: Two pointers from outside in. Move the shorter wall inward.
// Why? Moving the taller wall can only decrease width, and height is still
// limited by the shorter wall — so it can't improve. Moving shorter wall
// MIGHT find a taller wall and increase the result.

function findMaxContainer(walls) {
  let left = 0;
  let right = walls.length - 1;
  let maxWater = 0;

  while (left < right) {
    const height = Math.min(walls[left], walls[right]);
    const width = right - left;
    maxWater = Math.max(maxWater, height * width);

    // Move the pointer with the shorter wall inward
    if (walls[left] <= walls[right]) left++;
    else right--;
  }

  return maxWater;
}

const walls = [1, 8, 6, 2, 5, 4, 8, 3, 7];
console.log(`Wall heights: [${walls}]`);
console.log(`Max water: ${findMaxContainer(walls)} units\n`);  // → 49

// ============================================
// CASE 6: The Triplet Conspiracy
// PATTERN: Two Pointers + Sort (3Sum)
// ============================================
console.log("--- CASE 6: The Triplet Conspiracy ---");
// Crime Scene: Three conspirators need to be identified. You have a list of
// suspects with assigned "threat scores". Find all unique triplets of suspects
// whose scores add up to zero (they cancel each other out — a perfect cover).
//
// Example: scores = [-1, 0, 1, 2, -1, -4]
// Triplets: [[-1, -1, 2], [-1, 0, 1]]

function findTripletConspiracies(scores) {
  scores.sort((a, b) => a - b);  // sort first — enables two-pointer approach
  const result = [];

  for (let i = 0; i < scores.length - 2; i++) {
    // Skip duplicates for the first element
    if (i > 0 && scores[i] === scores[i - 1]) continue;

    let left = i + 1;
    let right = scores.length - 1;

    while (left < right) {
      const sum = scores[i] + scores[left] + scores[right];

      if (sum === 0) {
        result.push([scores[i], scores[left], scores[right]]);
        // Skip duplicates for second and third elements
        while (left < right && scores[left] === scores[left + 1]) left++;
        while (left < right && scores[right] === scores[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

const threatScores = [-1, 0, 1, 2, -1, -4];
const conspiracies = findTripletConspiracies(threatScores);
console.log(`Threat scores: [${threatScores}]`);
console.log(`Triplet conspiracies: ${JSON.stringify(conspiracies)}\n`);

// ============================================
// CASE 7: The Smuggler's Subarray
// PATTERN: Frequency Counter (prefix sum + map)
// ============================================
console.log("--- CASE 7: The Smuggler's Subarray ---");
// Crime Scene: A smuggler hid contraband across a cargo manifest.
// Each cargo item has a value (+1 if legal, -1 if contraband).
// Find the LONGEST contiguous subarray where the sum equals 0
// (equal legal and contraband items — perfect camouflage).
//
// Example: manifest = [1, -1, 1, 1, -1, -1, 1, -1]
// Longest balanced subarray: the whole array has sum 0 (or find max)
//
// KEY INSIGHT: If prefix_sum[i] == prefix_sum[j], then subarray [i+1..j] sums to 0.
// Store first occurrence of each prefix sum in a map.

function longestBalancedSubarray(manifest) {
  const firstSeen = new Map();
  firstSeen.set(0, -1);  // prefix sum of 0 "starts" before index 0

  let prefixSum = 0;
  let maxLength = 0;

  for (let i = 0; i < manifest.length; i++) {
    prefixSum += manifest[i];

    if (firstSeen.has(prefixSum)) {
      maxLength = Math.max(maxLength, i - firstSeen.get(prefixSum));
    } else {
      firstSeen.set(prefixSum, i);  // only store first occurrence
    }
  }

  return maxLength;
}

const manifest = [1, -1, 1, 1, -1, -1, 1, -1];
console.log(`Manifest: [${manifest}]`);
console.log(`Longest balanced span: ${longestBalancedSubarray(manifest)} items\n`);

// ============================================
// CASE 8: The Rotating Alibi
// PATTERN: Two Pointers (Dutch National Flag / partition)
// ============================================
console.log("--- CASE 8: The Rotating Alibi ---");
// Crime Scene: Suspects are labeled with one of three status codes: 0 (cleared),
// 1 (under investigation), 2 (guilty). Sort them in-place: cleared first,
// then under investigation, then guilty. Minimize swap count.
//
// Example: statuses = [2, 0, 2, 1, 1, 0] → [0, 0, 1, 1, 2, 2]
// PATTERN: Dutch National Flag (Dijkstra) — 3-way partition with two pointers

function sortSuspectStatuses(statuses) {
  let low = 0;               // boundary: everything before low is 0
  let mid = 0;               // current element being examined
  let high = statuses.length - 1;  // boundary: everything after high is 2

  while (mid <= high) {
    if (statuses[mid] === 0) {
      [statuses[low], statuses[mid]] = [statuses[mid], statuses[low]];
      low++;
      mid++;
    } else if (statuses[mid] === 1) {
      mid++;  // already in correct relative position
    } else {  // statuses[mid] === 2
      [statuses[mid], statuses[high]] = [statuses[high], statuses[mid]];
      high--;
      // Don't increment mid — the swapped element hasn't been examined yet
    }
  }

  return statuses;
}

const statuses = [2, 0, 2, 1, 1, 0];
console.log(`Before: [${statuses}]`);
console.log(`After:  [${sortSuspectStatuses([...statuses])}]\n`);

// ============================================
// CASE 9: The Evidence Majority
// PATTERN: Boyer-Moore Voting (Frequency Counter variant)
// ============================================
console.log("--- CASE 9: The Evidence Majority ---");
// Crime Scene: Witnesses submitted evidence votes. One suspect appears
// in more than n/2 of the votes. Find who it is.
// (A majority element always exists in this case.)
//
// Example: votes = [3, 2, 3, 1, 3, 2, 3] → 3 appears 4/7 times
// PATTERN: Boyer-Moore Voting — if we cancel out each different pair,
// the majority element always survives.

function findMajoritySuspect(votes) {
  let candidate = null;
  let count = 0;

  for (const vote of votes) {
    if (count === 0) {
      candidate = vote;
      count = 1;
    } else if (vote === candidate) {
      count++;
    } else {
      count--;  // cancel out a different vote
    }
  }

  // candidate is guaranteed to be the majority (given problem constraint)
  // If not guaranteed, verify: count occurrences to confirm
  return candidate;
}

const votes = [3, 2, 3, 1, 3, 2, 3];
console.log(`Votes: [${votes}]`);
console.log(`Majority suspect: ${findMajoritySuspect(votes)}\n`);

// ============================================
// CASE 10: The Sliding Window Robbery
// PATTERN: Two Pointers (Sliding Window) + Frequency Counter
// ============================================
console.log("--- CASE 10: The Sliding Window Robbery ---");
// Crime Scene: A robber hit exactly K houses in a row (a contiguous streak).
// You have the daily robbery reports. Find the K-house window with the
// highest total stolen value.
//
// Example: reports = [2, 3, 4, 1, 5, 9, 2, 1], k = 3
// Windows: [2,3,4]=9, [3,4,1]=8, [4,1,5]=10, [1,5,9]=15, [5,9,2]=16, [9,2,1]=12
// Max: [5,9,2] = 16, starting at index 4

function maxKWindowRobbery(reports, k) {
  if (k > reports.length) return 0;

  // Compute first window
  let windowSum = reports.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;
  let maxStart = 0;

  // Slide: add next element, remove first element of previous window
  for (let i = k; i < reports.length; i++) {
    windowSum += reports[i] - reports[i - k];
    if (windowSum > maxSum) {
      maxSum = windowSum;
      maxStart = i - k + 1;
    }
  }

  return { maxSum, window: reports.slice(maxStart, maxStart + k), startIndex: maxStart };
}

const reports = [2, 3, 4, 1, 5, 9, 2, 1];
const k = 3;
const result = maxKWindowRobbery(reports, k);
console.log(`Reports: [${reports}], k=${k}`);
console.log(`Max window: [${result.window}] = ${result.maxSum} (starting at index ${result.startIndex})\n`);

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. In Case 3 (Alibi Pair / Two Sum), why do we need the array to be sorted
//    before using two pointers? What would go wrong with unsorted data?
//    Is there a way to solve it without sorting? (Hint: think frequency counter)
//
// 2. In Case 7 (Smuggler's Subarray), explain the prefix sum trick.
//    If prefix_sum[i] == prefix_sum[j], why does subarray [i+1..j] sum to 0?
//    Trace through: manifest = [1, -1, 1, 1, -1, -1]
//
// 3. In Case 9 (Boyer-Moore Voting), what does it mean to "cancel out" votes?
//    Why does the majority element always survive?
//    What happens if there is NO majority element? Does the algorithm still work?
//
// 4. Cases 3, 5, 6, 8, 10 all use Two Pointers but in different ways.
//    For each, describe: how do the pointers move and what is the termination condition?

// ============================================
// YOUR TURN: Create 5 New Crime Scenes
// ============================================
// Using the Two Pointers or Frequency Counter patterns, create 5 new cases.
// Each must have: a crime narrative, the problem in array terms, and a solution.
//
// SUGGESTED CASES (or make up your own):
//
// CASE 11 — The Palindrome Witness:
//   A witness statement might be a palindrome — reads the same forwards and backwards.
//   Check if a string is a palindrome using two pointers (no extra space).
//   Ignore spaces and case: "A man a plan a canal Panama" → true
//
// CASE 12 — The Consecutive Evidence:
//   Find the longest consecutive sequence in an unsorted array.
//   [100, 4, 200, 1, 3, 2] → [1, 2, 3, 4] → length 4
//   Frequency counter: put all in Set, then check if n-1 exists to find sequence starts.
//
// CASE 13 — The Vanishing Suspects:
//   Two numbers in range 1..n are missing (array has n-2 elements).
//   Find both missing numbers in O(n) time and O(1) space.
//   Hint: sum and sum-of-squares can give you two equations with two unknowns.
//
// CASE 14 — The Crooked Median:
//   Given a sorted crime scene (sorted array), insert a new evidence value
//   and return the new median. Do it in O(log n) time.
//   Hint: binary search for insertion point, then find median index.
//
// CASE 15 — The K-Closest Suspects:
//   Given sorted distances and a target distance, find the K numbers closest
//   to the target. Return them sorted by closeness.
//   distances = [1, 2, 3, 4, 5], target = 3, k = 2 → [3, 2] or [3, 4]?
//   Two pointers: one at insertion point - 1, one at insertion point, expand k times.

// YOUR CODE BELOW:

console.log("--- YOUR TURN: Cases 11-15 ---\n");

// CASE 11 — The Palindrome Witness
function isPalindromeWitness(statement) {
  // YOUR CODE HERE
  // 1. Clean: remove non-alphanumeric, lowercase
  // 2. Two pointers: check if chars at left and right match
  // 3. Return true if all match
}

// CASE 12 — The Consecutive Evidence
function longestConsecutiveEvidence(suspects) {
  // YOUR CODE HERE
  // 1. Put all numbers in a Set (O(1) lookup)
  // 2. For each number, check if it's a sequence START (num-1 not in set)
  // 3. If it's a start, count how long the sequence goes
  // 4. Track the max length
}

// CASE 13 — The Vanishing Suspects
function findTwoMissingInRange(present, n) {
  // YOUR CODE HERE
  // present: array of n-2 numbers in range 1..n, two are missing
  // Return [missing1, missing2]
  // Hint: let sum_diff = expected_sum - actual_sum  (= a + b)
  //       let sq_diff = expected_sum_squares - actual_sum_squares  (= a² + b²)
  //       Use these to solve: a + b = sum_diff, a² + b² = sq_diff
  //       Then: (a+b)² = a² + 2ab + b²  → ab = ((a+b)² - (a²+b²)) / 2
  //       Then: a and b are roots of: x² - (a+b)x + ab = 0
}

// CASE 14 — The Crooked Median
function insertAndGetMedian(sorted, newEvidence) {
  // YOUR CODE HERE
  // 1. Binary search to find insertion index
  // 2. Insert element (without sort!)
  // 3. Find and return the new median value
}

// CASE 15 — The K-Closest Suspects
function findKClosestSuspects(distances, target, k) {
  // YOUR CODE HERE
  // Binary search to find insertion point
  // Two pointers: expand outward, picking the closer of left/right each time
  // Collect k elements
  // Return sorted by closeness to target
}

// Test your cases
// console.log("Case 11:", isPalindromeWitness("A man a plan a canal Panama")); // → true
// console.log("Case 12:", longestConsecutiveEvidence([100, 4, 200, 1, 3, 2])); // → 4
// console.log("Case 13:", findTwoMissingInRange([1, 2, 4], 5));  // → [3, 5]
// console.log("Case 14:", insertAndGetMedian([1, 3, 5, 7], 4));  // → median of [1,3,4,5,7]
// console.log("Case 15:", findKClosestSuspects([1, 2, 3, 4, 5], 3, 2)); // → [3, 2] or [3, 4]

// ============================================
// PATTERN LEARNED: Two Pointers + Frequency Counter
// ============================================
// TWO POINTERS — Use when:
//   - Array is SORTED or can be sorted first
//   - Looking for a PAIR or TRIPLET with a target sum
//   - Need to partition/filter in-place without extra space
//   - Sliding window: contiguous subarray with a property
//
//   Movement patterns:
//   → ← (converging): start from both ends, meet in middle
//       Use for: pair sum, container water, palindrome check
//   → → (same direction, different speeds): slow/fast pointers
//       Use for: linked list cycle, remove duplicates, sliding window
//
// FREQUENCY COUNTER — Use when:
//   - Comparing two collections (anagram check, duplicate detection)
//   - Counting occurrences before making decisions
//   - Avoiding nested loops: O(n²) → O(n) by pre-counting
//
//   Template:
//   const freq = {}
//   for (const item of arr) freq[item] = (freq[item] || 0) + 1
//   // or: new Map(), new Set() for O(1) lookup
//
// DECISION: Two Pointers or Frequency Counter?
//   "Find pair/triplet with sum X in SORTED array" → Two Pointers (O(n))
//   "Find pair/triplet with sum X in UNSORTED array" → Frequency Counter (O(n))
//   "Check if two arrays have same elements" → Frequency Counter
//   "Remove/partition in-place" → Two Pointers
//   "Find maximum/minimum in all subarrays of size k" → Sliding Window (Two Pointers)
// ============================================
