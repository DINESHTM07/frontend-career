// ============================================
// INTRO: Parallel Execution and WHY it matters
// ============================================
// Sequential async code runs one operation AFTER another — each waits for
// the previous to finish. Parallel async code starts MULTIPLE operations
// AT THE SAME TIME and waits for them together.
//
// If each API call takes 500ms:
//   Sequential (3 calls): 500 + 500 + 500 = 1500ms total
//   Parallel  (3 calls):  max(500, 500, 500) = 500ms total  ← 3x faster
//
// JavaScript has 4 Promise combinators for this:
//   Promise.all()         → wait for ALL, fail fast if any fails
//   Promise.allSettled()  → wait for ALL, never fails, gives each result
//   Promise.race()        → first to SETTLE (resolve or reject) wins
//   Promise.any()         → first to RESOLVE wins (ignores rejections)
//
// WHY it matters: every dashboard, comparison view, or data aggregation
// page in the real world uses parallel fetching. Knowing these four methods
// separates developers who know async from those who truly master it.
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// Imagine you're a restaurant manager sending 3 waiters to 3 different
// suppliers to pick up ingredients simultaneously.
//
// Promise.all():
//   All 3 MUST succeed. If one supplier is closed, you cancel the whole
//   dinner service immediately. Great for "need everything or nothing".
//
// Promise.allSettled():
//   All 3 go out. Some might fail. You wait for everyone to return,
//   then work with whatever ingredients actually came back.
//   Great for "best effort, report on each".
//
// Promise.race():
//   First waiter to return (success OR failure) wins. You make a decision
//   based on whoever responds first — maybe a timeout waiter that returns
//   in 2 seconds saying "give up".
//
// Promise.any():
//   First waiter to come back with ACTUAL ingredients (not empty-handed)
//   wins. Failures are ignored unless EVERYONE fails.
// ============================================

// ============================================
// GUIDED EXERCISE: Fetch from 3 weather APIs — compare all 4 methods
// ============================================

console.log("=== PARALLEL EXECUTION: 4 Promise Combinators ===\n");

// ---- Simulated API calls with realistic variable delays ----

function fetchCity(city, delay, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(`API_ERROR: Could not fetch weather for ${city}`));
        return;
      }
      resolve({
        city,
        temp: Math.round(15 + Math.random() * 25),
        humidity: Math.round(40 + Math.random() * 50),
        condition: ["Sunny", "Cloudy", "Rainy", "Windy"][Math.floor(Math.random() * 4)],
        fetchedIn: delay,
      });
    }, delay);
  });
}

// ---- PART 1: Sequential — the slow way ----

async function fetchSequential() {
  console.log("--- METHOD 1: Sequential ---");
  const start = Date.now();

  // Each call WAITS for the previous one to finish
  const london    = await fetchCity("London",    600);
  const tokyo     = await fetchCity("Tokyo",     400);
  const newYork   = await fetchCity("New York",  500);

  const elapsed = Date.now() - start;
  console.log(`Sequential completed in ${elapsed}ms`);
  console.log(`  (600 + 400 + 500 = 1500ms expected — got ${elapsed}ms)`);
  console.log(`  London: ${london.temp}°C | Tokyo: ${tokyo.temp}°C | NY: ${newYork.temp}°C`);
  console.log();

  return elapsed;
}

// ---- PART 2: Promise.all — parallel, fail fast ----

async function fetchWithPromiseAll() {
  console.log("--- METHOD 2: Promise.all ---");
  const start = Date.now();

  try {
    // All 3 start SIMULTANEOUSLY. Resolves when ALL resolve.
    // If ANY rejects, Promise.all rejects immediately (other calls still run, results discarded)
    const [london, tokyo, newYork] = await Promise.all([
      fetchCity("London",   600),
      fetchCity("Tokyo",    400),
      fetchCity("New York", 500),
    ]);

    const elapsed = Date.now() - start;
    console.log(`Promise.all completed in ${elapsed}ms`);
    console.log(`  (max(600, 400, 500) = 600ms expected — got ${elapsed}ms)`);
    console.log(`  London: ${london.temp}°C | Tokyo: ${tokyo.temp}°C | NY: ${newYork.temp}°C`);
    console.log();
  } catch (error) {
    console.error(`Promise.all FAILED: ${error.message}\n`);
  }
}

// ---- PART 3: Promise.allSettled — parallel, never fails ----

async function fetchWithAllSettled() {
  console.log("--- METHOD 3: Promise.allSettled (one API is down) ---");
  const start = Date.now();

  // allSettled ALWAYS resolves — even if some promises reject
  const results = await Promise.allSettled([
    fetchCity("London",   400),
    fetchCity("Tokyo",    300, true),  // ← this one fails
    fetchCity("New York", 500),
  ]);

  const elapsed = Date.now() - start;
  console.log(`Promise.allSettled completed in ${elapsed}ms`);

  results.forEach((result, i) => {
    const cities = ["London", "Tokyo", "New York"];
    if (result.status === "fulfilled") {
      console.log(`  ✓ ${cities[i]}: ${result.value.temp}°C, ${result.value.condition}`);
    } else {
      console.log(`  ✗ ${cities[i]}: FAILED — ${result.reason.message}`);
    }
  });

  const successful = results.filter(r => r.status === "fulfilled").length;
  console.log(`  ${successful}/3 APIs responded successfully\n`);
}

// ---- PART 4: Promise.race — first to settle wins ----

async function fetchWithRace() {
  console.log("--- METHOD 4: Promise.race ---");
  const start = Date.now();

  // Classic use: race against a timeout to implement request timeout
  function timeout(ms) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: no response after ${ms}ms`)), ms)
    );
  }

  try {
    // Race: first to resolve OR reject wins
    const winner = await Promise.race([
      fetchCity("London",   800),  // slow
      fetchCity("Tokyo",    200),  // fastest
      fetchCity("New York", 500),
      timeout(1000),               // safety net: fail after 1 second
    ]);

    const elapsed = Date.now() - start;
    console.log(`Promise.race — winner: ${winner.city} (${elapsed}ms)`);
    console.log(`  ${winner.city}: ${winner.temp}°C, ${winner.condition}`);
    console.log(`  Other requests still running in background (results discarded)\n`);
  } catch (error) {
    console.log(`Promise.race timed out: ${error.message}\n`);
  }
}

// ---- PART 5: Promise.any — first SUCCESS wins (ignores rejections) ----

async function fetchWithAny() {
  console.log("--- METHOD 5: Promise.any (first success wins) ---");
  const start = Date.now();

  try {
    // Like race but only cares about first SUCCESSFUL result
    // Use case: try multiple mirror servers, use whichever responds first
    const result = await Promise.any([
      fetchCity("Mirror1", 100, true),  // fails immediately
      fetchCity("Mirror2", 300, true),  // also fails
      fetchCity("Mirror3", 500),        // this succeeds at 500ms
    ]);

    const elapsed = Date.now() - start;
    console.log(`Promise.any — got result from ${result.city} in ${elapsed}ms`);
    console.log(`  (first two mirrors failed — fell through to Mirror3)\n`);
  } catch (error) {
    // AggregateError — thrown only when ALL promises reject
    console.log(`Promise.any — ALL failed: ${error.message}\n`);
  }
}

// ---- Run all comparisons in sequence (so output is readable) ----

async function runComparisons() {
  const seqTime = await fetchSequential();
  await fetchWithPromiseAll();
  await fetchWithAllSettled();
  await fetchWithRace();
  await fetchWithAny();

  console.log("=== TIMING SUMMARY ===");
  console.log(`Sequential:       ~1500ms (sum of all delays)`);
  console.log(`Promise.all:       ~600ms (longest single delay)`);
  console.log(`Promise.allSettled: ~500ms (longest of the successful ones)`);
  console.log(`Promise.race:       ~200ms (fastest one)`);
  console.log(`Promise.any:        ~500ms (first success, skipping failures)\n`);
}

runComparisons();

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. You have 5 API calls and ALL must succeed. Which combinator?
//    Answer: Promise.all — rejects immediately if any fails, so you
//    know right away if you can proceed with all the data you need.
//
// 2. You want a dashboard that shows whatever data arrives — partial OK.
//    Which combinator?
//    Answer: Promise.allSettled — never rejects, gives you each result's
//    status so you can display successful data and show errors for the rest.
//
// 3. You're calling 3 fallback servers. Use the first one that responds.
//    Which combinator?
//    Answer: Promise.race — resolves/rejects as soon as the first settles.
//    If servers can also fail, use Promise.any (first SUCCESS not first settle).
//
// 4. Promise.all has 3 promises: A(200ms), B(800ms), C(500ms).
//    B rejects at 300ms. When does Promise.all reject?
//    Answer: At 300ms — the moment B rejects. A and C continue running in
//    the background (JS doesn't cancel them) but their results are discarded.
// ============================================

// ============================================
// YOUR TURN: Weather Comparison App
// ============================================
// Build a weather comparison app that fetches 3 cities in parallel
// and presents a clean comparison report.
//
// Step 1 — Build fetchWeather(city) using this mock:
//   Returns a Promise that resolves after 200-800ms (random) with:
//   { city, temp, humidity, windSpeed, condition, fetchedIn }
//   Has a 20% chance of failing with "SERVICE_UNAVAILABLE"
//
// Step 2 — Build fetchAllCities(cities) using Promise.allSettled:
//   Takes array of city names, fetches all in parallel
//   Returns { successful: [...results], failed: [...cityNames], totalTime }
//
// Step 3 — Build findColdest(results) and findHottest(results):
//   Take array of fulfilled weather results, return the extreme cities
//
// Step 4 — Build printWeatherReport(cities) that:
//   Fetches all cities in parallel
//   Prints a formatted table:
//     City        Temp   Humidity  Wind   Condition
//     London      18°C   72%       15km/h Rainy
//     Tokyo       28°C   65%       8km/h  Sunny
//     New York    22°C   58%       12km/h Cloudy
//   Shows: "Hottest: Tokyo (28°C)" and "Coldest: London (18°C)"
//   Shows: "X/Y cities responded — [failed cities] unavailable"
//
// BONUS: Add Promise.race with a 1-second timeout — if the entire fetch
//   takes more than 1 second, show partial results with a "SLOW" warning.

function fetchWeather(city) {
  // YOUR CODE HERE
}

async function fetchAllCities(cities) {
  // YOUR CODE HERE
}

function findColdest(results) {
  // YOUR CODE HERE
}

function findHottest(results) {
  // YOUR CODE HERE
}

async function printWeatherReport(cities) {
  // YOUR CODE HERE
}

// Test it:
printWeatherReport(["London", "Tokyo", "New York", "Sydney", "Berlin"]);

// ============================================
// BOSS CHALLENGE: Promise Pool — limit concurrency
// ============================================
// Promise.all runs EVERYTHING at once. With 100 API calls, that could
// overwhelm a server. A "promise pool" limits concurrent requests to N at a time.
//
// Build promisePool(tasks, limit) where:
//   tasks: array of functions that return Promises (NOT the promises themselves!)
//   limit: max concurrent promises running at any moment
//
// Behavior:
//   - Starts the first `limit` tasks immediately
//   - When any task finishes, starts the next pending task
//   - Resolves when ALL tasks complete
//   - Returns results in the SAME ORDER as input (like Promise.all)
//   - Collects errors but doesn't stop other tasks (like allSettled)
//
// Test case — 10 tasks, limit 3, each logs its slot number:
//   Tasks 1,2,3 start immediately
//   When task 2 finishes (200ms), task 4 starts
//   When task 1 finishes (300ms), task 5 starts
//   etc. — never more than 3 running simultaneously

function promisePool(tasks, limit) {
  // YOUR CODE HERE
  // HINT: Keep a counter of running tasks and an index of next task to start
}

// Test:
const poolTasks = Array.from({ length: 10 }, (_, i) => () =>
  new Promise(resolve => {
    const ms = 100 + Math.random() * 400;
    setTimeout(() => {
      console.log(`  Task ${i + 1} done (${Math.round(ms)}ms)`);
      resolve({ task: i + 1, ms: Math.round(ms) });
    }, ms);
  })
);

console.log("\n--- BOSS CHALLENGE: Promise Pool (limit 3) ---");
promisePool(poolTasks, 3)
  .then(results => console.log(`Pool done. ${results?.length} tasks completed.`))
  .catch(err => console.error(err.message));

// ============================================
// PATTERN LEARNED: Parallel Execution
// ============================================
// PATTERN NAME: Parallel Execution with Promise Combinators
// WHEN YOU SEE: Multiple independent async operations that don't depend on
//               each other's results — fetch multiple resources, check
//               multiple endpoints, aggregate from multiple sources
// USE THIS:
//
//   All must succeed, data from all needed:
//     const [a, b, c] = await Promise.all([fa(), fb(), fc()])
//
//   All should run, partial success OK:
//     const results = await Promise.allSettled([fa(), fb(), fc()])
//     const good = results.filter(r => r.status === 'fulfilled').map(r => r.value)
//
//   Need first response (fallback pattern):
//     const first = await Promise.race([primary(), fallback(), timeout(5000)])
//
//   Need first SUCCESS (ignore failures):
//     const first = await Promise.any([mirror1(), mirror2(), mirror3()])
//
//   Need to limit concurrency (avoid overwhelming API):
//     promisePool(tasks, 5)  ← custom implementation as above
//
// PERFORMANCE RULE:
//   If operations are INDEPENDENT → run in parallel (always)
//   If operation B needs result of A → run sequentially (must)
//   If you have > 10 parallel requests → use promisePool with limit
//
// REACT CONNECTION:
//   useEffect with Promise.all for dashboard data
//   React Query's useQueries() for parallel queries with auto-caching
//   SWR with multiple keys in parallel
// ============================================
