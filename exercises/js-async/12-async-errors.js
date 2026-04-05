// ============================================
// INTRO: Async Error Handling and WHY it matters
// ============================================
// Errors in async code are easy to swallow silently. Unlike synchronous code
// where uncaught errors immediately crash and print stack traces, async errors
// can disappear into the void — leaving users with blank screens, infinite
// spinners, or stale data, with no indication of what went wrong.
//
// There are TWO fundamentally different types of async errors:
//   1. Network errors — the request never completed (no internet, DNS failure,
//      server unreachable). fetch() THROWS these as exceptions.
//   2. HTTP errors — the server responded, but with an error status (404, 500,
//      401, 403). fetch() does NOT throw these — response.ok is false.
//
// WHY it matters: Every real API call can fail. Production code that doesn't
// handle errors crashes for users at the worst possible time. Knowing exactly
// WHICH error happened, and responding appropriately, is a core skill.
// ============================================

// ============================================
// MENTAL MODEL: How to think about async errors
// ============================================
// Think of a delivery service with many failure modes:
//
// Network Error:  Your phone has no signal. You can't even place the order.
//                 → fetch() throws. Catch with try/catch around the await.
//
// HTTP 400:       Order placed but form was invalid. Server said "bad request".
//                 → fetch() resolves. response.ok === false. response.status === 400.
//
// HTTP 401:       Not logged in. "Unauthorized — please sign in first."
//                 → fetch() resolves. Status 401. Redirect to login.
//
// HTTP 403:       Logged in but you don't have permission. "Forbidden."
//                 → fetch() resolves. Status 403. Show "access denied" message.
//
// HTTP 404:       Resource doesn't exist. "Order ID not found."
//                 → fetch() resolves. Status 404. Show "not found" UI.
//
// HTTP 500:       Server crashed. "Internal server error — our fault."
//                 → fetch() resolves. Status 500. Show retry button.
//
// RULE: fetch() only throws on NETWORK failure. All HTTP status codes
//       (including 4xx and 5xx) are SUCCESSFUL network responses from fetch's POV.
// ============================================

console.log("=== ASYNC ERROR HANDLING: 10 Scenarios ===\n");

// ---- Shared utilities ----

// Simulate a fetch that can fail in specific ways
function mockFetch(url, options = {}) {
  const { status = 200, delay = 100, networkError = false, body = null } = options;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (networkError) {
        // Simulates: no internet, DNS failure, server unreachable
        reject(new TypeError("Failed to fetch"));
        return;
      }

      const responseBody = body ?? (status < 400
        ? { success: true, data: { id: 1, name: "Result" } }
        : { error: true, message: `Error for status ${status}` });

      resolve({
        ok: status >= 200 && status < 300,
        status,
        statusText: getStatusText(status),
        json: () => Promise.resolve(responseBody),
        text: () => Promise.resolve(JSON.stringify(responseBody)),
      });
    }, delay);
  });
}

function getStatusText(status) {
  const texts = { 200: "OK", 201: "Created", 400: "Bad Request",
    401: "Unauthorized", 403: "Forbidden", 404: "Not Found",
    409: "Conflict", 422: "Unprocessable Entity",
    429: "Too Many Requests", 500: "Internal Server Error",
    503: "Service Unavailable" };
  return texts[status] || "Unknown";
}

// ---- SCENARIO 1: The silent failure bug (broken code) ----

console.log("--- SCENARIO 1: Silent failure (BROKEN) ---");

async function scenario1_broken() {
  // BUG: fetch doesn't throw on 404/500. response.json() may work but
  // the data is an error object, not the expected data.
  const response = await mockFetch("/api/user/999", { status: 404 });
  const data = await response.json();
  // ❌ No check — data is { error: true, message: "..." } but code treats it as user
  console.log("  [BROKEN] User name:", data.name ?? "UNDEFINED — silent fail!");
}

// ---- SCENARIO 1: Fixed ----

async function scenario1_fixed() {
  try {
    const response = await mockFetch("/api/user/999", { status: 404 });

    if (!response.ok) {
      // ✅ Check response.ok BEFORE reading the body
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${errorData.message}`);
    }

    const data = await response.json();
    console.log("  [FIXED] User name:", data.data.name);
  } catch (error) {
    console.log("  [FIXED] Caught:", error.message);
  }
}

await scenario1_broken();
await scenario1_fixed();
console.log();

// ---- SCENARIO 2: Network error vs HTTP error ----

console.log("--- SCENARIO 2: Distinguishing error types ---");

async function scenario2() {
  async function callWithContext(url, fetchOptions, label) {
    try {
      const response = await mockFetch(url, fetchOptions);

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const error = new Error(body.message || response.statusText);
        error.type = "HTTP_ERROR";
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      console.log(`  [${label}] ✓ Success:`, data.data);
    } catch (error) {
      if (error.type === "HTTP_ERROR") {
        // Server responded with an error code
        console.log(`  [${label}] HTTP ${error.status}: ${error.message}`);
        if (error.status === 401) console.log(`    → Action: redirect to /login`);
        if (error.status === 404) console.log(`    → Action: show "not found" UI`);
        if (error.status === 500) console.log(`    → Action: show retry button`);
      } else {
        // Network failure — couldn't reach server
        console.log(`  [${label}] Network error: ${error.message}`);
        console.log(`    → Action: check connection, show offline banner`);
      }
    }
  }

  await callWithContext("/api/data", { status: 200 }, "success case  ");
  await callWithContext("/api/data", { status: 401 }, "401 unauth    ");
  await callWithContext("/api/data", { status: 404 }, "404 not found ");
  await callWithContext("/api/data", { status: 500 }, "500 server err");
  await callWithContext("/api/data", { networkError: true }, "network error ");
}

await scenario2();
console.log();

// ---- SCENARIO 3: Unhandled async errors in event listeners ----

console.log("--- SCENARIO 3: Async errors in event handlers ---");

// BAD: async function passed to addEventListener — errors are silently swallowed
function scenario3_broken_pattern() {
  // button.addEventListener('click', async () => {
  //   const data = await fetchData()  // ← if this throws, NO ONE catches it
  //   updateUI(data)
  // })
  console.log("  [BROKEN pattern — not run]: async event handler with no try/catch");
  console.log("  Error would be swallowed: 'Unhandled promise rejection'");
}

// GOOD: wrap async logic in a safe handler
function createSafeHandler(asyncFn, onError) {
  return function(event) {
    asyncFn(event).catch(onError);
    // OR wrap in try/catch inside an immediately-invoked async
  };
}

async function handleButtonClick(event) {
  const response = await mockFetch("/api/submit", { status: 500 });
  if (!response.ok) throw new Error(`Submit failed: ${response.status}`);
  console.log("  Submitted successfully!");
}

const safeHandler = createSafeHandler(
  handleButtonClick,
  (err) => console.log(`  [SCENARIO 3] Caught in safe handler: ${err.message}`)
);

scenario3_broken_pattern();
safeHandler({}); // simulate a click event
await new Promise(r => setTimeout(r, 200)); // wait for async to complete
console.log();

// ---- SCENARIO 4: Promise.all error propagation ----

console.log("--- SCENARIO 4: Promise.all — fail fast behavior ---");

async function scenario4() {
  console.log("  Attempting Promise.all with one failing request...");

  try {
    const [users, products, orders] = await Promise.all([
      mockFetch("/api/users",    { status: 200, delay: 100 }),
      mockFetch("/api/products", { status: 500, delay: 50  }),  // ← fails first
      mockFetch("/api/orders",   { status: 200, delay: 200 }),
    ]);

    // ❌ Still need to check .ok on each — Promise.all doesn't do this
    for (const [res, name] of [[users, "users"], [products, "products"], [orders, "orders"]]) {
      if (!res.ok) throw new Error(`Failed to load ${name}: HTTP ${res.status}`);
    }
  } catch (error) {
    console.log(`  [SCENARIO 4] Promise.all caught: ${error.message}`);
    console.log(`  Note: other requests may still complete in background`);
  }

  // Better pattern for partial success: use allSettled
  console.log("  Using Promise.allSettled for partial success...");
  const results = await Promise.allSettled([
    mockFetch("/api/users",    { status: 200, delay: 100 }).then(r => { if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
    mockFetch("/api/products", { status: 500, delay: 50  }).then(r => { if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
    mockFetch("/api/orders",   { status: 200, delay: 200 }).then(r => { if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
  ]);

  results.forEach((result, i) => {
    const names = ["users", "products", "orders"];
    if (result.status === "fulfilled") {
      console.log(`  ✓ ${names[i]}: loaded`);
    } else {
      console.log(`  ✗ ${names[i]}: ${result.reason.message} — showing cached/empty`);
    }
  });
}

await scenario4();
console.log();

// ---- SCENARIO 5: JSON parse errors ----

console.log("--- SCENARIO 5: JSON parse errors ---");

async function scenario5() {
  // If server returns HTML error page instead of JSON, response.json() throws
  const malformedResponse = {
    ok: false,
    status: 502,
    statusText: "Bad Gateway",
    json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    text: () => Promise.resolve("<html><body>502 Bad Gateway</body></html>"),
  };

  async function safeParseResponse(response) {
    if (!response.ok) {
      // Try JSON first (API error details), fall back to text, fall back to status
      let errorMessage;
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorBody.error || response.statusText;
      } catch {
        try {
          const text = await response.text();
          errorMessage = text.slice(0, 100); // First 100 chars of HTML
        } catch {
          errorMessage = response.statusText;
        }
      }
      throw new Error(`HTTP ${response.status}: ${errorMessage}`);
    }

    return response.json();
  }

  try {
    await safeParseResponse(malformedResponse);
  } catch (error) {
    console.log(`  [SCENARIO 5] Handled malformed response: ${error.message.slice(0, 70)}`);
  }
}

await scenario5();
console.log();

// ---- SCENARIO 6: Race condition — stale state from cancelled requests ----

console.log("--- SCENARIO 6: Race condition with AbortController ---");

async function scenario6() {
  // Simulate search-as-you-type: user types fast, multiple requests in flight
  const searches = ["r", "re", "rea", "reac", "react"];
  let latestSearch = "";
  const results = [];

  // BAD: without cancellation, earlier slow requests can overwrite later fast ones
  async function searchBad(query) {
    const delay = query.length === 3 ? 400 : 100; // "rea" is slow
    const response = await mockFetch(`/search?q=${query}`, { delay, body: { results: [query] } });
    const data = await response.json();
    console.log(`  [BAD]  Showing results for "${query}" (returned ${delay}ms after start)`);
  }

  // GOOD: cancel previous request when new one starts
  let currentController = null;

  async function searchGood(query) {
    // Cancel previous in-flight request
    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();
    const { signal } = currentController;

    try {
      const delay = query.length === 3 ? 400 : 100;
      // In real fetch: fetch(url, { signal })
      // Here we simulate abort checking
      await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, delay);
        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        });
      });

      if (!signal.aborted) {
        console.log(`  [GOOD] Showing results for "${query}" — most recent query`);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log(`  [GOOD] Request for "${query}" cancelled (newer query started)`);
      } else {
        throw error;
      }
    }
  }

  console.log("  Without cancellation (race condition):");
  await Promise.all(searches.slice(0, 3).map(s => searchBad(s)));
  await new Promise(r => setTimeout(r, 500));

  console.log("\n  With AbortController (correct):");
  for (const query of searches) {
    searchGood(query);
    await new Promise(r => setTimeout(r, 80));
  }
  await new Promise(r => setTimeout(r, 500));
}

await scenario6();
console.log();

// ---- SCENARIO 7: Error propagation in async chains ----

console.log("--- SCENARIO 7: Error propagation through async calls ---");

async function scenario7() {
  // Errors propagate up the async call stack — just like synchronous errors
  async function getUser(id) {
    const res = await mockFetch(`/api/user/${id}`, { status: id > 0 ? 200 : 404 });
    if (!res.ok) throw new Error(`User ${id} not found`);
    return (await res.json()).data;
  }

  async function getUserPosts(userId) {
    const user = await getUser(userId); // ← error from here propagates up
    const res = await mockFetch(`/api/posts?userId=${user.id}`, { status: 200 });
    return (await res.json()).data;
  }

  async function renderUserPage(userId) {
    try {
      const posts = await getUserPosts(userId); // ← and propagates here
      console.log(`  ✓ User page rendered with posts:`, posts);
    } catch (error) {
      // Caught at the top level — error bubbled up through 2 async functions
      console.log(`  Caught at renderUserPage: ${error.message}`);
      console.log(`  Showing 404 page to user`);
    }
  }

  await renderUserPage(1);   // works
  await renderUserPage(-1);  // getUser fails → propagates → caught at top
}

await scenario7();
console.log();

// ---- SCENARIO 8: finally for cleanup ----

console.log("--- SCENARIO 8: finally for guaranteed cleanup ---");

async function scenario8() {
  let isLoading = false;

  async function fetchWithCleanup(url, shouldFail) {
    isLoading = true;
    console.log(`  Loading: ${isLoading}`);

    try {
      const res = await mockFetch(url, { status: shouldFail ? 500 : 200 });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log(`  ✓ Data:`, data.data);
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
    } finally {
      // ALWAYS runs — whether success or error
      isLoading = false;
      console.log(`  Loading: ${isLoading} (guaranteed cleanup)`);
    }
  }

  await fetchWithCleanup("/api/data", false); // success
  await fetchWithCleanup("/api/data", true);  // failure
}

await scenario8();
console.log();

// ---- SCENARIO 9: Custom error classes ----

console.log("--- SCENARIO 9: Custom error classes for typed handling ---");

class ApiError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

class NetworkError extends Error {
  constructor(message, endpoint) {
    super(message);
    this.name = "NetworkError";
    this.endpoint = endpoint;
  }
}

class ValidationError extends Error {
  constructor(message, fields) {
    super(message);
    this.name = "ValidationError";
    this.fields = fields;
  }
}

async function typedFetch(url, options = {}) {
  let response;
  try {
    response = await mockFetch(url, options);
  } catch (cause) {
    throw new NetworkError(`Cannot reach ${url}`, url);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    if (response.status === 422) {
      throw new ValidationError(body.message || "Validation failed", body.fields || []);
    }
    throw new ApiError(body.message || response.statusText, response.status, url);
  }

  return response.json();
}

async function scenario9() {
  const testCases = [
    { status: 200 }, { status: 401 }, { status: 422 }, { networkError: true }
  ];

  for (const opts of testCases) {
    try {
      const data = await typedFetch("/api/data", opts);
      console.log(`  ✓ Success:`, data.data);
    } catch (error) {
      if (error instanceof ValidationError) {
        console.log(`  ValidationError: ${error.message} — highlight form fields`);
      } else if (error instanceof ApiError) {
        if (error.status === 401) console.log(`  ApiError 401: redirect to login`);
        else console.log(`  ApiError ${error.status}: ${error.message}`);
      } else if (error instanceof NetworkError) {
        console.log(`  NetworkError: show offline banner — ${error.message}`);
      }
    }
  }
}

await scenario9();
console.log();

// ---- SCENARIO 10: Global unhandled rejection handler ----

console.log("--- SCENARIO 10: Global error boundary for async ---");

// In Node.js — catch any unhandled promise rejection before app crashes
process.on("unhandledRejection", (reason, promise) => {
  console.log(`  [GLOBAL] Unhandled rejection caught: ${reason?.message}`);
  console.log(`  → Log to Sentry, show user-friendly error, prevent crash`);
  // In production: log to monitoring, notify team, gracefully degrade
});

// Demonstrate: a "forgotten" catch that would normally crash
console.log("  Triggering unhandled rejection (recovered by global handler)...");
mockFetch("/api/data", { networkError: true });
// No .catch() — but global handler saves us

await new Promise(r => setTimeout(r, 200)); // wait for it
console.log();

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. When does fetch() throw vs return an error response?
//    Answer: fetch() throws ONLY on network errors (no connection, DNS failure,
//    server unreachable). For any HTTP response (including 404, 500), fetch()
//    resolves — you must check response.ok or response.status manually.
//
// 2. Why does using just .catch() at the end of a chain miss some errors?
//    Answer: If you call response.json() and the JSON is malformed, that throws
//    inside the .then(), which IS caught by .catch(). But if you forget to check
//    response.ok and the server returned a 500, your .then() runs with error data
//    and no error is thrown at all — silent failure.
//
// 3. What's the purpose of 'finally' in async error handling?
//    Answer: finally runs whether the try succeeded or the catch ran. Use it for
//    guaranteed cleanup: hiding loading spinners, releasing locks, closing
//    connections — things that must happen regardless of success or failure.
//
// 4. When should you create custom error classes?
//    Answer: When you need to handle different error types differently. Instead of
//    parsing error.message strings, you can use instanceof to branch cleanly.
//    Useful when errors need extra properties (status code, validation fields, etc).
// ============================================

// ============================================
// YOUR TURN: Resilient API Caller with Retry Logic
// ============================================
// Build a production-grade API caller that handles all real-world failure modes.
//
// Step 1 — Build parseResponse(response):
//   If response.ok: return { success: true, data: await response.json() }
//   If not ok: try to parse JSON error body, fall back to statusText
//   Returns: { success: false, status, message, isRetryable }
//   isRetryable: true for 429, 500, 502, 503, 504 (server errors worth retrying)
//               false for 400, 401, 403, 404 (client errors, retrying won't help)
//
// Step 2 — Build withRetry(fetchFn, options):
//   options: { maxAttempts=3, baseBackoff=500, onRetry }
//   On network error OR retryable HTTP error: wait and retry
//   Backoff: baseBackoff * 2^attemptNumber (exponential: 500, 1000, 2000ms)
//   Add jitter: multiply backoff by (0.8 + Math.random() * 0.4)
//   On non-retryable error: throw immediately (no retry)
//   After maxAttempts: throw with "Max retries exceeded (3/3)"
//
// Step 3 — Build apiCall(endpoint, options):
//   Wraps fetch with: timeout (10s default), retry logic, error parsing
//   Logs each attempt: "[API] GET /users - attempt 1/3"
//   Returns data directly on success
//   Throws typed error on final failure
//
// Step 4 — Test with these scenarios:
//   apiCall("/api/users")                          → success
//   apiCall("/api/users/999")                      → 404, no retry
//   apiCall("/api/flaky", { maxAttempts: 3 })      → 500 twice, then success
//   apiCall("/api/slow",  { timeout: 100 })        → timeout, with retry
//
// BONUS: Add a circuit breaker — after 5 consecutive failures to the same
//   endpoint, stop trying for 30 seconds and throw "Circuit open" immediately

async function parseResponse(response) {
  // YOUR CODE HERE
}

async function withRetry(fetchFn, options = {}) {
  // YOUR CODE HERE
}

async function apiCall(endpoint, options = {}) {
  // YOUR CODE HERE
}

// Tests:
console.log("--- YOUR TURN: Resilient API Caller ---\n");
// Uncomment as you build each part:
// await apiCall("/api/users")
// await apiCall("/api/users/999")

// ============================================
// BOSS CHALLENGE: Build a request queue with rate limiting
// ============================================
// Some APIs only allow N requests per second. Build a RateLimitedQueue that:
//
//   const queue = new RateLimitedQueue({ requestsPerSecond: 3 })
//
//   queue.add(() => fetch("/api/item/1"))  // starts immediately
//   queue.add(() => fetch("/api/item/2"))  // starts immediately
//   queue.add(() => fetch("/api/item/3"))  // starts immediately
//   queue.add(() => fetch("/api/item/4"))  // WAITS until 1 second has passed
//   queue.add(() => fetch("/api/item/5"))  // waits for slot in second window
//
// Requirements:
//   - Each request has a priority (default 0, higher = runs sooner)
//   - queue.drain() → Promise that resolves when all queued work is done
//   - Errors in individual requests don't kill the queue
//   - queue.stats() → { total, completed, failed, pending, rateLimit }

class RateLimitedQueue {
  constructor(options = {}) {
    // YOUR CODE HERE
    // options: { requestsPerSecond: 3 }
  }

  add(fetchFn, priority = 0) {
    // YOUR CODE HERE
    // Returns a Promise for this specific request
  }

  drain() {
    // YOUR CODE HERE
    // Returns Promise that resolves when queue is empty
  }

  stats() {
    // YOUR CODE HERE
  }
}

// ============================================
// PATTERN LEARNED: Async Error Handling
// ============================================
// PATTERN NAME: Resilient Async Error Handling
// WHEN YOU SEE: Any async operation that can fail (API calls, file I/O, DB queries)
// USE THIS:
//
//   ALWAYS check response.ok after fetch (HTTP errors don't throw):
//     if (!response.ok) throw new ApiError(...)
//
//   ALWAYS separate network errors from HTTP errors:
//     try { res = await fetch() } catch { throw new NetworkError() }
//
//   USE finally for guaranteed cleanup:
//     finally { setLoading(false) }
//
//   USE custom error classes for typed handling:
//     catch(e) { if (e instanceof ApiError && e.status === 401) ... }
//
//   USE AbortController to cancel stale requests:
//     const ac = new AbortController()
//     fetch(url, { signal: ac.signal })
//     return () => ac.abort()  // cleanup in useEffect
//
//   Retry only for transient failures (5xx, network, timeout):
//     isRetryable = [429, 500, 502, 503, 504].includes(status)
//
// ERROR TYPE DECISION TREE:
//   catch(e) throws?
//     → Yes: NetworkError (no internet / server unreachable)
//   response.ok?
//     → No: HTTP Error — check status
//       401: not authenticated → redirect to login
//       403: not authorized → show "forbidden"
//       404: not found → show empty/not-found UI
//       422: validation → show field errors
//       429: rate limited → retry with backoff
//       5xx: server error → retry or show "try again"
//   response.json() throws?
//     → SyntaxError: server returned non-JSON (HTML error page?) → parse text instead
//
// REACT CONNECTION:
//   React Query: handles loading/error/success states + retries automatically
//   Error Boundaries: catch errors in React render tree
//   Suspense: declarative loading states (works with React Query)
// ============================================
