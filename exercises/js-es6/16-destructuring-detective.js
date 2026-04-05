// ============================================
// INTRO: Destructuring and WHY it matters
// ============================================
// Destructuring is a syntax for unpacking values from objects and arrays
// into variables in a single statement. It's not just a shortcut —
// it expresses INTENT: "I want these specific values from this shape."
//
// The TRANSFORMATION (or "Reshaping") pattern is about converting raw
// data (like an API response) into the exact shape your application needs.
// Every real app does this: backend shape ≠ frontend shape.
//
// WHY it matters:
// - Eliminates temporary variables: const name = user.name; const age = user.age;
//   → Becomes: const { name, age } = user;
// - Enables precise function parameters (take only what you need)
// - Makes data transformation pipelines readable
// - React props use object destructuring everywhere
// - useState, useEffect hooks return arrays → array destructuring
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// Object destructuring = picking items from a drawer by label.
// You say: "give me the item labeled 'name' and 'age'" from this object.
// You can rename them: "give me 'name' but call it 'fullName' in my code."
// You can set defaults: "give me 'color', default to 'blue' if missing."
//
// Array destructuring = picking items by POSITION, not label.
// const [first, second, , fourth] = arr;  // skip third with empty comma
//
// The key insight: destructuring is about the SHAPE of data, not the data itself.
// If you change a variable name inside a destructure, the original object is unchanged.
// ============================================

console.log("=== DESTRUCTURING: Reshaping Data ===\n");

// ---- PART 1: Basic object destructuring ----

console.log("--- PART 1: Object destructuring basics ---\n");

const user = {
  id: 42,
  name: "Dinesh Kumar",
  email: "dinesh@example.com",
  role: "admin",
  age: 26,
};

// ❌ Without destructuring — repetitive, verbose
const id1    = user.id;
const name1  = user.name;
const email1 = user.email;
console.log("Old way:", id1, name1, email1);

// ✅ With destructuring — single statement
const { id, name, email } = user;
console.log("Destructured:", id, name, email);

// Rename while destructuring (alias)
const { name: fullName, role: userRole } = user;
console.log("Renamed:", fullName, userRole);

// Default values (used when property is undefined)
const { age, city = "Chennai", country = "India" } = user;
console.log("With defaults:", age, city, country);
// city is "Chennai" (not in user object) — default kicks in
// age is 26 (from user object) — default would NOT be used

// Rename + default combined
const { nickname: displayName = "Anonymous" } = user;
console.log("Rename + default:", displayName); // "Anonymous"

// ---- PART 2: Nested object destructuring ----

console.log("\n--- PART 2: Nested destructuring ---\n");

const apiResponse = {
  status: 200,
  data: {
    user: {
      id: 1,
      name: "Alice",
      address: {
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
      },
      preferences: {
        theme: "dark",
        language: "en",
        notifications: {
          email: true,
          push: false,
        },
      },
    },
    meta: {
      totalRecords: 150,
      page: 1,
    },
  },
};

// Flat access — tedious without destructuring
const city1 = apiResponse.data.user.address.city;
console.log("Manual:", city1);

// Nested destructuring — extract deeply nested values
const {
  status,
  data: {
    user: {
      name: userName,
      address: { city: userCity, pincode },
      preferences: {
        theme,
        notifications: { email: emailNotif, push: pushNotif },
      },
    },
    meta: { totalRecords, page },
  },
} = apiResponse;

console.log("Nested destructuring:");
console.log("  userName:", userName);
console.log("  userCity:", userCity);
console.log("  pincode:", pincode);
console.log("  theme:", theme);
console.log("  emailNotif:", emailNotif, "| pushNotif:", pushNotif);
console.log("  totalRecords:", totalRecords, "| page:", page);

// CAUTION: if intermediate node is null/undefined, destructuring throws
// Guard with defaults at each level:
const { data: { user: { avatar: { url: avatarUrl } = {} } = {} } = {} } = apiResponse;
// Empty object defaults prevent TypeError when avatar doesn't exist
console.log("  avatarUrl (missing):", avatarUrl); // undefined, not a crash

// ---- PART 3: Array destructuring ----

console.log("\n--- PART 3: Array destructuring ---\n");

const colors = ["red", "green", "blue", "yellow", "purple"];

// Position-based extraction
const [first, second, third] = colors;
console.log("First three:", first, second, third);

// Skip elements with empty commas
const [primaryColor, , accentColor] = colors;
console.log("Skip second:", primaryColor, accentColor);

// Rest pattern (collects remaining)
const [head, ...tail] = colors;
console.log("Head:", head, "| Tail:", tail);

// Swap variables without temp variable
let x = 1, y = 2;
[x, y] = [y, x];
console.log("Swapped:", x, y); // 2, 1

// Default values in array destructuring
const [a = "default-a", b = "default-b"] = ["actual-a"];
console.log("Array defaults:", a, b); // "actual-a", "default-b"

// Return multiple values from function using array destructuring
function getMinMax(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  return [sorted[0], sorted[sorted.length - 1]];
}

const [min, max] = getMinMax([5, 2, 8, 1, 9, 3]);
console.log("Min:", min, "Max:", max);

// React's useState hook uses this pattern!
// const [count, setCount] = useState(0);

// ---- PART 4: Destructuring in function parameters ----

console.log("\n--- PART 4: Function parameter destructuring ---\n");

// BAD: access properties via parameter name
function renderUserBad(user) {
  return `${user.name} (${user.role}) — ${user.email}`;
}

// GOOD: destructure in the parameter — only request what you need
function renderUser({ name, role, email }) {
  return `${name} (${role}) — ${email}`;
}

// Even better: with defaults
function renderUserWithDefaults({ name, role = "viewer", email, avatar = "👤" }) {
  return `${avatar} ${name} (${role}) — ${email}`;
}

console.log(renderUser(user));
console.log(renderUserWithDefaults({ name: "Bob", email: "bob@test.com" }));

// Destructuring array parameters
function sumFirst([first, second]) {
  return first + second;
}
console.log("Sum first two:", sumFirst([10, 20, 30])); // 30

// Object with nested destructuring in params
function displayAddress({ address: { city, state } }) {
  return `${city}, ${state}`;
}
console.log(displayAddress(apiResponse.data.user));

// ---- PART 5: Destructuring with loops ----

console.log("\n--- PART 5: Destructuring in for...of loops ---\n");

const users = [
  { id: 1, name: "Alice", score: 95 },
  { id: 2, name: "Bob",   score: 72 },
  { id: 3, name: "Carol", score: 88 },
];

// Without destructuring
for (const user of users) {
  console.log(`  ${user.name}: ${user.score}`);
}

// With destructuring — cleaner
console.log("With destructuring:");
for (const { name, score, id } of users) {
  const grade = score >= 90 ? "A" : score >= 80 ? "B" : "C";
  console.log(`  [${id}] ${name}: ${score} (${grade})`);
}

// Object.entries() returns [key, value] pairs — array destructuring
const config = { theme: "dark", fontSize: 14, lang: "en" };
console.log("\nObject.entries:");
for (const [key, value] of Object.entries(config)) {
  console.log(`  ${key}: ${value}`);
}

// Map also works with destructuring
const inventory = new Map([
  ["apples",  50],
  ["bananas", 30],
  ["oranges", 25],
]);
console.log("\nMap destructuring:");
for (const [item, count] of inventory) {
  console.log(`  ${item}: ${count} units`);
}

// ---- PART 6: Combined destructuring and transformation ----

console.log("\n--- PART 6: Real-world API reshaping ---\n");

// Messy API response — what a real backend might send
const rawMovieData = {
  Response: "True",
  Title: "Inception",
  Year: "2010",
  Rated: "PG-13",
  Released: "16 Jul 2010",
  Runtime: "148 min",
  Genre: "Action, Adventure, Sci-Fi",
  Director: "Christopher Nolan",
  Actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
  Plot: "A thief who steals corporate secrets through the use of dream-sharing technology.",
  Poster: "https://example.com/poster.jpg",
  imdbRating: "8.8",
  imdbVotes: "2,406,890",
  imdbID: "tt1375666",
  Type: "movie",
  BoxOffice: "$292,576,195",
};

// Transform: extract what we need, rename to camelCase, parse types
function reshapeMovie({
  imdbID: id,
  Title: title,
  Year: year,
  imdbRating: rating,
  Genre: genreString,
  Director: director,
  Actors: actorString,
  Runtime: runtime,
  BoxOffice: boxOffice,
  Plot: synopsis,
  Poster: posterUrl,
}) {
  return {
    id,
    title,
    year: parseInt(year),
    rating: parseFloat(rating),
    genres: genreString.split(", "),
    director,
    cast: actorString.split(", "),
    runtimeMinutes: parseInt(runtime),
    boxOfficeUSD: parseInt(boxOffice.replace(/[$,]/g, "")),
    synopsis,
    posterUrl,
  };
}

const movie = reshapeMovie(rawMovieData);
console.log("Reshaped movie:");
console.log("  id:", movie.id);
console.log("  title:", movie.title);
console.log("  year:", movie.year, "(number, not string)");
console.log("  rating:", movie.rating, "(float, not string)");
console.log("  genres:", movie.genres, "(array, not comma-string)");
console.log("  cast:", movie.cast);
console.log("  runtimeMinutes:", movie.runtimeMinutes);
console.log("  boxOfficeUSD:", movie.boxOfficeUSD.toLocaleString());

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. What is the difference between renaming and default in destructuring?
//    Answer: Renaming ({ name: myName }) creates a new variable called myName
//    with the VALUE of name. Default ({ name = "Anonymous" }) is only used
//    when the property is UNDEFINED. These compose: { name: myName = "Anon" }.
//
// 2. When does nested destructuring throw an error?
//    Answer: When an intermediate value is null or undefined. If you try to
//    destructure { a: { b } } = { a: null }, it throws: "Cannot read properties
//    of null". Guard with: { a: { b } = {} } to default the intermediate node.
//
// 3. How does destructuring in function parameters affect the caller?
//    Answer: It doesn't. The caller passes the full object — destructuring
//    only affects how the function body accesses it. The original object
//    is unchanged. It's about readability, not API contract.
//
// 4. What does the rest pattern (...rest) collect in destructuring?
//    Answer: In arrays: all remaining elements after the explicit ones.
//    In objects: all remaining OWN enumerable properties not explicitly named.
//    const { id, ...rest } = user; → rest has everything except id.
// ============================================

// ============================================
// YOUR TURN: Reshape a Messy API Response
// ============================================
// The GitHub API returns user data in a specific shape.
// Your frontend needs a different shape. Build the transformation.
//
// Given this raw GitHub API response:
const rawGitHubUser = {
  login: "octocat",
  id: 583231,
  avatar_url: "https://avatars.githubusercontent.com/u/583231",
  html_url: "https://github.com/octocat",
  type: "User",
  name: "The Octocat",
  company: "@github",
  blog: "https://github.blog",
  location: "San Francisco, CA",
  email: null,
  hireable: null,
  bio: "GitHub mascot",
  twitter_username: "github",
  public_repos: 8,
  public_gists: 8,
  followers: 15000,
  following: 9,
  created_at: "2011-01-25T18:44:36Z",
  updated_at: "2024-01-01T00:00:00Z",
};

// TASK 1 — Build reshapeGitHubUser(raw) using destructuring in function params:
//   Must return this shape:
//   {
//     id: 583231,
//     username: "octocat",
//     displayName: "The Octocat",
//     avatarUrl: "...",
//     profileUrl: "...",
//     bio: "...",
//     location: "...",
//     company: "github",       // Remove the @ prefix
//     social: {
//       twitter: "github",     // twitter_username
//       blog: "...",
//     },
//     stats: {
//       repos: 8,              // public_repos
//       gists: 8,              // public_gists
//       followers: 15000,
//       following: 9,
//     },
//     joinedAt: Date object,   // created_at parsed
//     isOrg: false,            // type === "Organization"
//   }

function reshapeGitHubUser(raw) {
  // YOUR CODE HERE — use parameter destructuring
}

// TASK 2 — Given this array of GitHub repos (simulated):
const rawRepos = [
  { id: 1, name: "hello-world",     stargazers_count: 2085, forks_count: 1879, language: "Ruby",       updated_at: "2023-01-01", description: "My first repository" },
  { id: 2, name: "octocat.github.io", stargazers_count: 459,  forks_count: 236,  language: "HTML",       updated_at: "2022-06-01", description: "My personal website" },
  { id: 3, name: "Spoon-Knife",     stargazers_count: 12440, forks_count: 143590, language: "HTML",      updated_at: "2024-01-01", description: "For those of you" },
];

// Build reshapeRepos(repos) that returns:
//   [{
//     id, name, description,
//     stars: 2085,           // stargazers_count
//     forks: 1879,           // forks_count
//     language,
//     lastUpdated: Date,     // updated_at parsed
//   }]
// Sort by stars descending.

function reshapeRepos(repos) {
  // YOUR CODE HERE — use array destructuring + map
}

// TASK 3 — Build a profile summary using both:
function buildProfileSummary(rawUser, rawRepos) {
  // YOUR CODE HERE
  // Returns: { user: reshapedUser, topRepo: repoWithMostStars, totalStars: sum }
}

const result = buildProfileSummary(rawGitHubUser, rawRepos);
console.log("\n--- YOUR TURN output ---");
console.log("Profile summary:", result);

// ============================================
// BOSS CHALLENGE: Deep merge with destructuring
// ============================================
// Build a deepMerge(target, source) function that:
//   - Merges source into target recursively
//   - Arrays in source REPLACE arrays in target (not concat)
//   - Objects are merged deeply (not replaced)
//   - Source values override target values for same keys
//   - Uses destructuring wherever it makes code clearer
//
// Also build extractPaths(obj, paths) where paths is an array of
// dot-notation strings:
//   extractPaths(obj, ["user.name", "user.address.city", "meta.page"])
//   Returns: { "user.name": "Alice", "user.address.city": "Mumbai", "meta.page": 1 }
//
// And buildFromPaths(paths) that does the reverse:
//   buildFromPaths({ "user.name": "Alice", "user.address.city": "Mumbai" })
//   Returns: { user: { name: "Alice", address: { city: "Mumbai" } } }

function deepMerge(target, source) {
  // YOUR CODE HERE
}

function extractPaths(obj, paths) {
  // YOUR CODE HERE
  // HINT: each path like "user.address.city" → reduce over ["user","address","city"]
}

function buildFromPaths(pathValueMap) {
  // YOUR CODE HERE
}

// Test:
const base = { user: { name: "Alice", age: 30 }, theme: "dark", tags: ["a", "b"] };
const override = { user: { age: 31, city: "Mumbai" }, tags: ["x"], newProp: true };
console.log("\n--- BOSS: deepMerge ---");
console.log(deepMerge(base, override));
// Expected: { user: { name: "Alice", age: 31, city: "Mumbai" }, theme: "dark", tags: ["x"], newProp: true }

console.log("\n--- BOSS: extractPaths ---");
console.log(extractPaths(apiResponse, ["status", "data.meta.totalRecords", "data.user.address.city"]));

// ============================================
// PATTERN LEARNED: Transformation (Reshaping)
// ============================================
// PATTERN NAME: Data Transformation / Reshaping
// WHEN YOU SEE: Raw API data that doesn't match what your component needs;
//               deeply nested objects you need to partially extract;
//               function parameters that take large objects but use few properties
// USE THIS:
//
//   Extract from nested objects:
//     const { a: { b: { c } } } = obj
//
//   Rename and default in one step:
//     const { snake_case: camelCase = "default" } = obj
//
//   Collect the rest:
//     const { keep, ...rest } = obj
//
//   In function params (only take what's needed):
//     function fn({ id, name, role = "viewer" }) {}
//
//   Loop + destructure:
//     for (const { id, name } of users) {}
//     for (const [key, value] of Object.entries(obj)) {}
//
//   Transform array of objects:
//     const clean = raw.map(({ snake_key: camelKey, ...rest }) => ({ camelKey, ...rest }))
//
// THE RESHAPE WORKFLOW:
//   1. console.log the raw API response
//   2. Identify what your component actually needs
//   3. Write a reshape function that takes raw, returns clean
//   4. The function IS the documentation of the API contract
//   5. Put reshape functions in /lib/transformers.ts
//
// REACT CONNECTION:
//   Props destructuring: function Button({ onClick, children, variant = "primary" })
//   useState returns: const [value, setValue] = useState(0)
//   useContext: const { user, dispatch } = useContext(AuthContext)
//   React Query: const { data, isLoading, error } = useQuery(...)
// ============================================
