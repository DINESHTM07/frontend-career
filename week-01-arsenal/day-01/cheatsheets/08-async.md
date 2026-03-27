# JavaScript Async Cheatsheet

---

## CONCEPT

JavaScript is single-threaded. Async patterns let it handle waiting (network, timers, I/O) without blocking the main thread.

| Pattern        | Style          | Error handling         | When to use              |
|----------------|----------------|------------------------|--------------------------|
| Callbacks      | Nested         | First arg convention   | Legacy code, event handlers |
| Promises       | Chainable      | `.catch()`             | Libraries, complex chains |
| async/await    | Synchronous-looking | `try/catch`       | Modern code, all new work |

Promise states: **pending** → **fulfilled** (resolved) or **rejected**

---

## WHY IT MATTERS

- Callback hell makes code unreadable and error-prone — Promises and async/await solve this
- `Promise.all` runs requests in parallel — critical for performance
- Forgetting `await` is the #1 async bug — you get a Promise object, not the value
- `fetch` doesn't reject on 4xx/5xx — you must check `response.ok` manually
- AbortController is how you cancel in-flight requests (important for React cleanup)

---

## EXAMPLES

### 1. Callbacks and callback hell
```js
// Single callback — fine
getUserById(1, function(user) {
  console.log(user);
});

// Callback hell — each step depends on the previous
getUserById(1, function(user) {
  getOrdersByUser(user.id, function(orders) {
    getProductById(orders[0].productId, function(product) {
      getInventory(product.id, function(inventory) {
        // Now we're 4 levels deep — hard to read, hard to error handle
        console.log(inventory);
      }, function(err) { handleError(err); });
    }, function(err) { handleError(err); });
  }, function(err) { handleError(err); });
}, function(err) { handleError(err); });
```

### 2. Creating and chaining Promises
```js
// Creating a Promise
function delay(ms) {
  return new Promise((resolve, reject) => {
    if (ms < 0) reject(new Error("ms must be positive"));
    setTimeout(resolve, ms);
  });
}

// Chaining — each .then() receives the return value of the previous
delay(500)
  .then(() => {
    console.log("500ms passed");
    return delay(300); // return a new Promise to chain
  })
  .then(() => {
    console.log("300ms more passed");
    return "done";
  })
  .then(result => console.log(result)) // "done"
  .catch(err => console.error(err));   // catches ANY error in the chain
  .finally(() => console.log("always runs"));
```

### 3. Promise.all — parallel execution
```js
// Run multiple promises at the same time, wait for ALL to finish
const [user, orders, notifications] = await Promise.all([
  fetch("/api/user/1").then(r => r.json()),
  fetch("/api/orders?userId=1").then(r => r.json()),
  fetch("/api/notifications?userId=1").then(r => r.json())
]);
// All 3 run in parallel — takes as long as the SLOWEST one
// If ANY rejects, the whole Promise.all rejects

// vs sequential (3x slower):
const user  = await fetch("/api/user/1").then(r => r.json());
const orders = await fetch("/api/orders?userId=1").then(r => r.json());
const notifs = await fetch("/api/notifications?userId=1").then(r => r.json());
```

### 4. Promise.allSettled, Promise.race, Promise.any
```js
// allSettled — waits for ALL, never rejects, gives status of each
const results = await Promise.allSettled([
  fetch("/api/a").then(r => r.json()),
  fetch("/api/b").then(r => r.json()), // this one might fail
  fetch("/api/c").then(r => r.json()),
]);
results.forEach(result => {
  if (result.status === "fulfilled") console.log("OK:", result.value);
  if (result.status === "rejected")  console.log("ERR:", result.reason);
});

// race — resolves/rejects with whichever settles FIRST
const winner = await Promise.race([
  fetch("/api/fast"),
  fetch("/api/slow")
]);

// Timeout pattern with race:
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );
  return Promise.race([promise, timeout]);
}

// any — resolves with first FULFILLED (ignores rejections unless ALL fail)
const fastest = await Promise.any([
  fetch("https://server1.com/api"),
  fetch("https://server2.com/api"),
  fetch("https://server3.com/api")
]);
// Gets first successful response — great for redundant servers
```

### 5. async/await with try/catch/finally
```js
// Basic async function
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json(); // returns a Promise — async functions always return a Promise
}

// Consuming it
async function displayUser() {
  try {
    const user = await getUser(1);
    console.log(user);
  } catch (err) {
    console.error("Failed to load user:", err.message);
  } finally {
    hideLoadingSpinner(); // always runs — cleanup here
  }
}

// Multiple awaits with error handling
async function processOrder(orderId) {
  try {
    const order = await getOrder(orderId);
    const payment = await processPayment(order.amount);
    const receipt = await sendReceipt(payment.id);
    return receipt;
  } catch (err) {
    await logError(err); // await in catch is fine
    throw err; // re-throw if you want the caller to handle it
  }
}
```

### 6. fetch GET with headers and error checking
```js
async function getWeather(city) {
  const API_KEY = "your_api_key";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${API_KEY}` // some APIs use Bearer token
    }
  });

  // fetch ONLY rejects on network failure — not on 4xx/5xx!
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Weather API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  return {
    city: data.name,
    temp: data.main.temp,
    description: data.weather[0].description,
    humidity: data.main.humidity
  };
}

// Usage
try {
  const weather = await getWeather("London");
  console.log(`${weather.city}: ${weather.temp}°C, ${weather.description}`);
} catch (err) {
  console.error(err.message);
}
```

### 7. fetch POST with JSON body
```js
async function createUser(userData) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(userData) // must stringify the body
  });

  if (response.status === 409) {
    throw new Error("User already exists");
  }

  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.status}`);
  }

  return response.json(); // created user with id from server
}

// Usage
const newUser = await createUser({
  name: "Alice",
  email: "alice@example.com",
  role: "user"
});
console.log("Created:", newUser.id);
```

### 8. AbortController — cancelling requests
```js
// Create a controller
const controller = new AbortController();
const { signal } = controller;

// Pass signal to fetch
async function searchUsers(query) {
  const response = await fetch(`/api/users?q=${query}`, { signal });
  return response.json();
}

// Cancel the request
controller.abort(); // fetch rejects with AbortError

// Real-world: cancel on new keystroke (search input)
let currentController = null;

async function handleSearchInput(query) {
  // Cancel the previous request if still in flight
  if (currentController) currentController.abort();

  currentController = new AbortController();

  try {
    const results = await fetch(
      `/api/search?q=${query}`,
      { signal: currentController.signal }
    ).then(r => r.json());

    displayResults(results);
  } catch (err) {
    if (err.name === "AbortError") return; // ignore cancelled requests
    console.error(err);
  }
}

// React cleanup pattern
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/data", { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(err => { if (err.name !== "AbortError") setError(err); });

  return () => controller.abort(); // cancel on unmount
}, []);
```

### 9. Sequential vs parallel — performance comparison
```js
// SEQUENTIAL — each waits for the previous (slow when independent)
async function loadDashboardSequential(userId) {
  const profile = await fetchProfile(userId);      // 200ms
  const orders  = await fetchOrders(userId);       // 300ms
  const reviews = await fetchReviews(userId);      // 150ms
  // Total: ~650ms
  return { profile, orders, reviews };
}

// PARALLEL — all start at the same time (fast)
async function loadDashboardParallel(userId) {
  const [profile, orders, reviews] = await Promise.all([
    fetchProfile(userId),   // \
    fetchOrders(userId),    //  all start simultaneously
    fetchReviews(userId)    // /
  ]);
  // Total: ~300ms (slowest one)
  return { profile, orders, reviews };
}

// MIXED — some must be sequential, others can be parallel
async function loadOrderDetails(orderId) {
  const order = await fetchOrder(orderId);         // must be first

  // These can run in parallel once we have the order
  const [customer, product, shipping] = await Promise.all([
    fetchCustomer(order.customerId),
    fetchProduct(order.productId),
    fetchShipping(order.shippingId)
  ]);

  return { order, customer, product, shipping };
}
```

### 10. Async error handling patterns
```js
// Pattern 1: try/catch in each async function
async function safeGetUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`${res.status}`);
    return [null, await res.json()];  // [error, data] tuple
  } catch (err) {
    return [err, null];
  }
}

const [err, user] = await safeGetUser(1);
if (err) return handleError(err);
// use user safely

// Pattern 2: global unhandled rejection handler
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  event.preventDefault();
});

// Pattern 3: async IIFE to use await at top level (older environments)
(async () => {
  const data = await fetchData();
  console.log(data);
})();

// Pattern 4: top-level await (modern — in ES modules or Node 14+)
const config = await fetch("/config.json").then(r => r.json());
```

---

## COMMON MISTAKES

### Mistake 1: Forgetting await
```js
// WRONG — data is a Promise, not the value
async function getUser() {
  const data = fetch("/api/user"); // missing await!
  console.log(data); // Promise { <pending> }
}

// RIGHT
async function getUser() {
  const data = await fetch("/api/user").then(r => r.json());
  console.log(data); // { id: 1, name: "Alice" }
}
```

### Mistake 2: Not checking response.ok
```js
// WRONG — fetch doesn't reject on 404/500
const res = await fetch("/api/user/999");
const user = await res.json(); // might be { error: "Not found" }

// RIGHT
const res = await fetch("/api/user/999");
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const user = await res.json();
```

### Mistake 3: await in a forEach loop
```js
const ids = [1, 2, 3];

// WRONG — forEach doesn't await — all fire without waiting
ids.forEach(async (id) => {
  const user = await fetchUser(id); // these run concurrently, uncontrolled
  console.log(user);
});

// RIGHT option 1 — sequential
for (const id of ids) {
  const user = await fetchUser(id);
  console.log(user);
}

// RIGHT option 2 — parallel
const users = await Promise.all(ids.map(id => fetchUser(id)));
```

### Mistake 4: Unhandled promise rejections
```js
// WRONG — rejected promise with no handler
fetchData(); // fire and forget — if this rejects, nothing handles it

// RIGHT — always handle rejections
fetchData().catch(err => console.error(err));
// or use await in a try/catch
```

---

## INTERVIEW TIP

> **"What's the difference between Promise.all and Promise.allSettled?"**
>
> Answer: `Promise.all` rejects immediately if ANY promise rejects — you get the first error but lose results from successful ones. `Promise.allSettled` waits for ALL to finish regardless of success/failure, giving you a result array with `{ status: "fulfilled", value }` or `{ status: "rejected", reason }` for each. Use `allSettled` when partial success is acceptable.

> **"What does async/await return?"**
>
> Answer: An `async` function always returns a Promise — even if you `return 5`, the caller gets `Promise.resolve(5)`. `await` unwraps the Promise inside the async function. This is why you can chain `.then()` on an async function call from outside.

> **"How do you run async operations in parallel?"**
>
> Answer: `Promise.all([p1, p2, p3])` — starts all promises simultaneously and waits for all to complete. Sequential `await` calls run one-by-one. The difference can be 3x–10x in real applications when loading independent data.
