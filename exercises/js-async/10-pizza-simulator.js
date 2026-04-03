// ============================================
// INTRO: What is the Async State Machine and WHY it matters
// ============================================
// Asynchronous JavaScript means code runs in a non-blocking way —
// you start an operation, and instead of waiting, you move on.
// When the operation finishes, a callback/promise/async-await handles the result.
//
// A STATE MACHINE is a model where a process moves through discrete states:
// each state has a defined meaning, valid transitions, and associated actions.
//
// WHY it matters: Every real-world async operation is a state machine:
//   - API call: idle → loading → success/error
//   - File upload: idle → uploading → processing → done/failed
//   - Authentication: logged-out → authenticating → logged-in/failed
// Understanding async state machines is the key to understanding React's
// useEffect, loading states, error boundaries, and async data fetching patterns.
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// Ordering a pizza has clear states:
//   PLACED → PREPARING → BAKING → DELIVERING → DELIVERED
//
// At each state:
//   - Something is happening (chef is cooking, driver is driving)
//   - You can't skip states (can't deliver before baking)
//   - Each state takes time (async operation)
//   - Something can go wrong in any state (no ingredients, traffic)
//
// Promise-based code mirrors this exactly:
//   placeOrder()              // returns Promise
//     .then(prepareOrder)     // next state when previous resolves
//     .then(bakeOrder)
//     .then(deliverOrder)
//     .catch(handleError);    // any state can reject
//
// async/await is just cleaner syntax for the same thing:
//   try {
//     const order = await placeOrder();
//     const ready = await prepareOrder(order);
//     const baked = await bakeOrder(ready);
//     await deliverOrder(baked);
//   } catch (error) {
//     handleError(error);
//   }
// ============================================

// ============================================
// GUIDED EXERCISE: Pizza Simulator — Promises, then async/await
// ============================================

console.log("=== PIZZA SIMULATOR ===\n");

// ---- PART 1: Building blocks — simulate async delays ----

// Helper: simulates an async operation with variable delay
// Returns a Promise that resolves after 'ms' milliseconds
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper: simulates a chance of failure
function mayFail(probability = 0.0) {
  if (Math.random() < probability) {
    throw new Error("Random failure occurred");
  }
}

// ---- PART 2: State machine functions — each returns a Promise ----

// State 1: PLACE ORDER
function placeOrder(orderDetails) {
  console.log(`[ORDER] Placing order: ${orderDetails.pizza}, qty: ${orderDetails.qty}`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Validate the order
      if (!orderDetails.pizza) {
        reject(new Error("ORDER_FAILED: No pizza type specified"));
        return;
      }
      if (orderDetails.qty <= 0) {
        reject(new Error("ORDER_FAILED: Invalid quantity"));
        return;
      }

      const order = {
        id: `ORD-${Date.now()}`,
        ...orderDetails,
        status: "placed",
        placedAt: new Date().toISOString(),
      };

      console.log(`[ORDER] ✓ Order confirmed: ${order.id}`);
      resolve(order);
    }, 500); // Simulates network latency
  });
}

// State 2: PREPARE (kitchen gets ingredients, makes dough)
function prepareOrder(order) {
  console.log(`[PREPARE] Preparing ${order.pizza} (${order.id})...`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate chance of ingredients being out of stock
      if (order.pizza === "pineapple" && Math.random() < 0.8) {
        reject(new Error("PREPARE_FAILED: Pineapple on pizza? We're out. Good."));
        return;
      }

      const prepared = {
        ...order,
        status: "prepared",
        ingredients: ["dough", "sauce", "cheese", order.pizza + " topping"],
        preparedAt: new Date().toISOString(),
      };

      console.log(`[PREPARE] ✓ Ingredients assembled: ${prepared.ingredients.join(", ")}`);
      resolve(prepared);
    }, 800);
  });
}

// State 3: BAKE (oven time)
function bakeOrder(order) {
  console.log(`[BAKE] Putting ${order.pizza} in oven...`);

  return new Promise((resolve, reject) => {
    const bakeTime = 1000 + Math.random() * 500; // 1-1.5 seconds

    setTimeout(() => {
      // Simulate occasional oven malfunction
      if (Math.random() < 0.1) {
        reject(new Error("BAKE_FAILED: Oven temperature sensor error"));
        return;
      }

      const baked = {
        ...order,
        status: "baked",
        bakeTimeMs: Math.round(bakeTime),
        bakedAt: new Date().toISOString(),
        temperature: "450°F",
      };

      console.log(`[BAKE] ✓ Pizza baked in ${baked.bakeTimeMs}ms at ${baked.temperature}`);
      resolve(baked);
    }, bakeTime);
  });
}

// State 4: DELIVER
function deliverOrder(order) {
  console.log(`[DELIVER] Dispatching driver for ${order.id}...`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const delivered = {
        ...order,
        status: "delivered",
        deliveredAt: new Date().toISOString(),
        driver: "Rahul",
        rating: null, // customer hasn't rated yet
      };

      console.log(`[DELIVER] ✓ Delivered by ${delivered.driver}!`);
      resolve(delivered);
    }, 700);
  });
}

// ---- PART 3: Chaining with Promises (.then()) ----

console.log("--- METHOD 1: Promise Chaining ---\n");

placeOrder({ pizza: "pepperoni", qty: 2, address: "123 Main St" })
  .then((order) => prepareOrder(order))
  .then((prepared) => bakeOrder(prepared))
  .then((baked) => deliverOrder(baked))
  .then((delivered) => {
    console.log("\n[DONE] Pizza journey complete!");
    console.log("Final status:", delivered.status);
    console.log("Order ID:", delivered.id);
    console.log("Timeline: placed → prepared → baked → delivered\n");

    // ---- PART 4: Same flow with async/await ----
    return runWithAsyncAwait();
  })
  .catch((error) => {
    console.error("\n[ERROR] Order failed:", error.message);
    console.log("Handling error — maybe offer refund or retry\n");
  });

// ---- PART 4: Same state machine with async/await ----
async function runWithAsyncAwait() {
  console.log("--- METHOD 2: async/await ---\n");

  try {
    const order     = await placeOrder({ pizza: "margherita", qty: 1, address: "456 Oak Ave" });
    const prepared  = await prepareOrder(order);
    const baked     = await bakeOrder(prepared);
    const delivered = await deliverOrder(baked);

    console.log("\n[DONE] Pizza delivered with async/await!");
    console.log("Driver:", delivered.driver);
    console.log("Bake time:", delivered.bakeTimeMs + "ms\n");

    // ---- PART 5: Advanced — parallel orders with Promise.all ----
    await runParallelOrders();
  } catch (error) {
    // One try-catch handles ALL states — much cleaner than chained .catch()
    console.error("[ERROR]", error.message);
    // In real code: update UI state to show error, log to monitoring service
  }
}

// ---- PART 5: Parallel operations with Promise.all ----
async function runParallelOrders() {
  console.log("--- METHOD 3: Promise.all (parallel orders) ---\n");
  console.log("Placing 3 orders simultaneously...\n");

  const startTime = Date.now();

  try {
    // Promise.all runs all Promises SIMULTANEOUSLY (not sequentially)
    // Resolves when ALL resolve, rejects if ANY rejects
    const orders = await Promise.all([
      placeOrder({ pizza: "pepperoni",  qty: 1, address: "Addr 1" }),
      placeOrder({ pizza: "margherita", qty: 2, address: "Addr 2" }),
      placeOrder({ pizza: "bbq chicken", qty: 1, address: "Addr 3" }),
    ]);

    console.log(`\n[PARALLEL] All 3 orders placed in ${Date.now() - startTime}ms`);
    console.log("Order IDs:", orders.map((o) => o.id));

    // Promise.allSettled: wait for ALL to finish, don't fail on rejection
    const results = await Promise.allSettled(
      orders.map((order) =>
        prepareOrder(order)
          .then(bakeOrder)
          .then(deliverOrder)
      )
    );

    console.log("\n[PARALLEL] All deliveries settled:");
    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        console.log(`  Order ${i + 1}: DELIVERED (${result.value.deliveredAt})`);
      } else {
        console.log(`  Order ${i + 1}: FAILED — ${result.reason.message}`);
      }
    });

    // Promise.race: resolves/rejects as soon as the FIRST Promise settles
    console.log("\n[RACE] Which order gets baked first?");
    const winner = await Promise.race(
      orders.map((order) => prepareOrder(order).then(bakeOrder))
    );
    console.log(`[RACE] Winner: ${winner.pizza} pizza (${winner.id})\n`);

  } catch (error) {
    console.error("[PARALLEL ERROR]", error.message);
  }
}

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. What is the difference between Promise.all and Promise.allSettled?
//    Answer: Promise.all rejects immediately if ANY promise rejects.
//    Promise.allSettled waits for ALL to finish and gives each one's status
//    as { status: "fulfilled" | "rejected", value/reason }.
//    Use allSettled when failures are acceptable and you want all results.
//
// 2. What does async/await do under the hood?
//    Answer: It's syntactic sugar for Promises. `await` pauses execution of
//    the async function (not the entire thread!) and resumes when the Promise
//    settles. The event loop continues running other code while waiting.
//
// 3. Why does one try/catch in async/await replace multiple .catch() calls?
//    Answer: await throws the rejection reason as a regular Error, making
//    all async errors catchable with a single synchronous try/catch block.
//
// 4. When would you NOT use async/await?
//    Answer: Event listeners (can't make addEventListener callback async
//    meaningfully), simple one-time callbacks, when you specifically need
//    Promise.race/allSettled (easier to read as chain), or when you're
//    in a context that doesn't support async (some older environments).
// ============================================

// ============================================
// YOUR TURN: Build a laundry machine simulator
// ============================================
// Model a laundry machine as an async state machine with these states:
//   IDLE → LOADING → WASHING → RINSING → SPINNING → DONE
//
// Build these async functions (each returns a Promise):
//   loadClothes(items)         → 300ms, validates items array is not empty
//   wash(load, temperature)    → 1000ms, temp can be "hot"/"warm"/"cold"
//   rinse(load)                → 600ms, 10% chance of "Water supply interrupted"
//   spin(load, speed)          → 400ms, speed: "gentle"/"normal"/"fast"
//
// Build runLaundry(items, options) async function that:
//   1. Runs all 4 states in sequence with async/await
//   2. Logs each state transition: "[LOADING] Adding 5 items..."
//   3. Returns final state object with all timing info
//   4. Handles errors with clear messages (e.g., "WASHING_FAILED: ...")
//
// Build runLaundryLoads(loads) that runs multiple loads in parallel:
//   1. Uses Promise.allSettled to run all loads simultaneously
//   2. Reports which loads succeeded and which failed
//
// BONUS: Add a watchMode that uses Promise.race to start a 30-second timer,
//   if laundry takes longer than that, log "Running late! Speeding up spin..."

// State functions:
function loadClothes(items) {
  // YOUR CODE HERE
}

function wash(load, temperature = "warm") {
  // YOUR CODE HERE
}

function rinse(load) {
  // YOUR CODE HERE
}

function spin(load, speed = "normal") {
  // YOUR CODE HERE
}

// Main orchestrator:
async function runLaundry(items, options = {}) {
  // YOUR CODE HERE
  // options: { temperature: "warm", speed: "normal" }
}

// Parallel loader:
async function runLaundryLoads(loads) {
  // YOUR CODE HERE
  // loads: [{ items: [...], options: {...} }, ...]
}

// Test your laundry machine:
console.log("--- YOUR TURN: Laundry Machine ---\n");
runLaundry(
  ["shirt", "pants", "socks", "jacket"],
  { temperature: "warm", speed: "normal" }
)
  .then((result) => {
    console.log("Laundry done!", result?.status);
    return runLaundryLoads([
      { items: ["whites"], options: { temperature: "hot" } },
      { items: ["darks"], options: { temperature: "cold" } },
      { items: [], options: {} }, // This should fail validation
    ]);
  })
  .catch((err) => console.error("Laundry error:", err.message));

// ============================================
// BOSS CHALLENGE: Build a generic async retry mechanism
// ============================================
// Build withRetry(asyncFn, options) that:
//   - Calls asyncFn()
//   - If it fails, waits options.backoff ms before retrying
//   - Doubles the backoff after each failure (exponential backoff)
//   - Tries up to options.maxAttempts times
//   - Throws if all attempts fail (with attempt count in message)
//   - Calls options.onRetry(attempt, error) if provided
//
// Build withTimeout(asyncFn, ms) that:
//   - Races asyncFn() against a timeout Promise
//   - If asyncFn takes longer than ms: rejects with "Timeout after Xms"
//   - If asyncFn finishes first: resolves with its result
//
// Usage:
//   const resilientOrder = await withRetry(
//     () => placeOrder({ pizza: "pepperoni", qty: 1 }),
//     { maxAttempts: 3, backoff: 200, onRetry: (n, e) => console.log(`Retry ${n}: ${e.message}`) }
//   );
//
//   const timedOrder = await withTimeout(
//     () => bakeOrder(someOrder),
//     500 // fail if baking takes more than 500ms
//   );

function withRetry(asyncFn, options = {}) {
  const { maxAttempts = 3, backoff = 1000, onRetry } = options;
  // YOUR CODE HERE
}

function withTimeout(asyncFn, ms) {
  // YOUR CODE HERE
  // HINT: Promise.race between asyncFn() and a delay that rejects
}

console.log("\n--- BOSS CHALLENGE: withRetry + withTimeout ---\n");

// Flaky function that fails 70% of the time
let attemptCount = 0;
function flakyBake(order) {
  attemptCount++;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.7) {
        reject(new Error(`Bake attempt ${attemptCount} failed`));
      } else {
        resolve({ ...order, status: "baked", attempts: attemptCount });
      }
    }, 100);
  });
}

withRetry(
  () => flakyBake({ pizza: "test", id: "RETRY-001" }),
  {
    maxAttempts: 5,
    backoff: 100,
    onRetry: (attempt, error) =>
      console.log(`  Retry attempt ${attempt}: ${error.message}`),
  }
)
  .then((result) => console.log(`[withRetry] Succeeded after ${result.attempts} attempts`))
  .catch((err) => console.error(`[withRetry] Failed: ${err.message}`));

// ============================================
// PATTERN LEARNED: State Machine (Async)
// ============================================
// PATTERN NAME: Async State Machine
// WHEN YOU SEE: A multi-step process where each step depends on the previous
//               and each step is asynchronous (API calls, timers, I/O)
// USE THIS: async/await with explicit state objects passed through each step
//
// TEMPLATE:
//   async function runProcess(input) {
//     try {
//       const state1 = await step1(input);   // IDLE → STATE1
//       const state2 = await step2(state1);  // STATE1 → STATE2
//       const state3 = await step3(state2);  // STATE2 → STATE3
//       return state3;                       // STATE3 → DONE
//     } catch (error) {
//       handleError(error);                  // any state → ERROR
//       throw error;
//     }
//   }
//
// PARALLEL PATTERNS:
//   Promise.all(fns)        → all must succeed, fail fast
//   Promise.allSettled(fns) → all run, get each result
//   Promise.race(fns)       → first to settle wins
//   Promise.any(fns)        → first to RESOLVE wins (ignore rejections)
//
// RESILIENCE PATTERNS:
//   withRetry()   → retry on failure with exponential backoff
//   withTimeout() → fail fast if too slow
//   circuit breaker pattern — stop retrying after N consecutive failures
//
// REACT CONNECTION:
//   useState for: idle | loading | success | error
//   useEffect with async IIFE or custom hook
//   React Query / SWR handle all of this automatically
// ============================================
