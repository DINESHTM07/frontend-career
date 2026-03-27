# JavaScript Common Patterns Cheatsheet

---

## CONCEPT

Design patterns are reusable solutions to recurring problems. These 9 patterns appear constantly in production code and interviews.

| Pattern         | Category     | Interview Frequency |
|-----------------|--------------|---------------------|
| Debounce        | Performance  | Very High           |
| Throttle        | Performance  | Very High           |
| Memoize         | Performance  | High                |
| Curry           | Functional   | High                |
| Pub/Sub         | Behavioral   | High                |
| Observer        | Behavioral   | High                |
| Module (IIFE)   | Structural   | Medium              |
| Factory         | Creational   | Medium              |
| Singleton       | Creational   | Medium              |

---

## WHY IT MATTERS

- Debounce and throttle come up in almost every frontend interview — know them cold
- Memoize demonstrates you understand closures and performance optimization
- Curry shows functional programming knowledge — highly valued at top companies
- Pub/Sub and Observer are the foundation of event systems, React's state model, and RxJS
- Factory and Singleton show you understand object creation patterns beyond `new`

---

## EXAMPLES

### 1. Debounce — delay execution until user stops
```js
// CONCEPT: Only fire after N ms of silence.
// Each new call resets the timer.

function debounce(fn, delay) {
  let timerId;

  return function(...args) {
    clearTimeout(timerId); // cancel the previous timer

    timerId = setTimeout(() => {
      fn.apply(this, args); // call with correct `this` and all args
    }, delay);
  };
}

// --- USAGE ---

// Search input — don't hit the API on every keystroke
const searchInput = document.querySelector("#search");

const handleSearch = debounce(async (query) => {
  const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
  displayResults(results);
}, 300); // wait 300ms after user stops typing

searchInput.addEventListener("input", (e) => {
  handleSearch(e.target.value);
});

// Window resize — expensive recalculations
const handleResize = debounce(() => {
  recalculateLayout();
}, 200);
window.addEventListener("resize", handleResize);

// --- WHEN TO USE ---
// Search boxes, form validation on input, window resize handlers,
// auto-save drafts. Any case where you want "only after user stops doing X".
```

### 2. Throttle — limit to once per interval
```js
// CONCEPT: Fire at most once every N ms, no matter how often called.
// Unlike debounce, it guarantees regular execution during continuous activity.

function throttle(fn, interval) {
  let lastCallTime = 0;

  return function(...args) {
    const now = Date.now();

    if (now - lastCallTime >= interval) {
      lastCallTime = now;
      fn.apply(this, args);
    }
  };
}

// Leading + trailing throttle (more complete version)
function throttleFull(fn, interval) {
  let lastCallTime = 0;
  let timerId;

  return function(...args) {
    const now = Date.now();
    const remaining = interval - (now - lastCallTime);

    if (remaining <= 0) {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      lastCallTime = now;
      fn.apply(this, args);
    } else {
      // Schedule trailing call
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        lastCallTime = Date.now();
        fn.apply(this, args);
      }, remaining);
    }
  };
}

// --- USAGE ---

// Scroll handler — update UI at most every 100ms
const handleScroll = throttle(() => {
  updateScrollProgress();
  checkInfiniteScrollTrigger();
}, 100);
window.addEventListener("scroll", handleScroll);

// Button click protection — prevent double-submit
const submitBtn = document.querySelector("#submit");
submitBtn.addEventListener("click", throttle(async () => {
  await submitForm();
}, 2000)); // can't submit more than once every 2 seconds

// --- WHEN TO USE ---
// Scroll events, mousemove tracking, game loops, rate-limiting API calls,
// button click protection. Any case where you want "at most once per interval".

// Debounce vs Throttle:
// Debounce: "wait until they STOP" — search, resize, auto-save
// Throttle: "fire REGULARLY even if continuous" — scroll, mousemove, game input
```

### 3. Memoize — cache function results
```js
// CONCEPT: Cache results by arguments so expensive calls run only once.
// Closure holds the cache for the lifetime of the memoized function.

function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// --- USAGE ---

// Expensive calculation — only compute once per unique input
const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

fibonacci(40); // computes
fibonacci(40); // instant — from cache

// API response caching
const getUser = memoize(async (id) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});

await getUser(1); // fetches
await getUser(1); // returns cached Promise

// With TTL (time-to-live) — cache expires after N ms
function memoizeWithTTL(fn, ttl) {
  const cache = new Map(); // { key: { value, expiresAt } }

  return function(...args) {
    const key = JSON.stringify(args);
    const entry = cache.get(key);

    if (entry && Date.now() < entry.expiresAt) {
      return entry.value;
    }

    const value = fn.apply(this, args);
    cache.set(key, { value, expiresAt: Date.now() + ttl });
    return value;
  };
}

// --- WHEN TO USE ---
// Pure functions with expensive computation, repeated API calls with same args,
// React useMemo/useCallback are the built-in framework equivalent.
```

### 4. Curry — transform multi-arg functions into chains
```js
// CONCEPT: A curried function takes arguments one at a time,
// returning a new function until all args are provided.

// Manual curry — fixed 3 arguments
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      // Have enough args — call the original function
      return fn.apply(this, args);
    }
    // Not enough — return a function waiting for more
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// --- USAGE ---

// Base function
function add(a, b, c) { return a + b + c; }
const curriedAdd = curry(add);

curriedAdd(1)(2)(3);   // 6 — one at a time
curriedAdd(1, 2)(3);   // 6 — mixed
curriedAdd(1)(2, 3);   // 6 — mixed
curriedAdd(1, 2, 3);   // 6 — all at once

// Partial application — pre-fill arguments
const add10 = curriedAdd(10);
const add10and5 = add10(5);
add10and5(3); // 18

// Real-world: reusable event handler factory
const handleEvent = curry((eventType, handler, element) => {
  element.addEventListener(eventType, handler);
});

const onClick = handleEvent("click");
const onClickLog = onClick(() => console.log("clicked"));

// Apply to multiple elements
document.querySelectorAll(".btn").forEach(onClickLog);

// Real-world: configurable validators
const validate = curry((min, max, value) =>
  value >= min && value <= max
);

const isValidAge    = validate(0, 120);
const isValidScore  = validate(0, 100);
const isValidRating = validate(1, 5);

isValidAge(25);     // true
isValidScore(105);  // false

// --- WHEN TO USE ---
// Building configurable utility functions, React prop transformers,
// functional pipelines. Shows strong FP knowledge in interviews.
```

### 5. Pub/Sub (Publish-Subscribe) pattern
```js
// CONCEPT: Publishers emit events without knowing who listens.
// Subscribers listen without knowing who publishes.
// Decouples components completely.

function createEventBus() {
  const subscribers = {}; // { eventName: [callbacks] }

  return {
    on(event, callback) {
      if (!subscribers[event]) subscribers[event] = [];
      subscribers[event].push(callback);

      // Return unsubscribe function
      return () => this.off(event, callback);
    },

    off(event, callback) {
      if (!subscribers[event]) return;
      subscribers[event] = subscribers[event].filter(cb => cb !== callback);
    },

    emit(event, data) {
      if (!subscribers[event]) return;
      subscribers[event].forEach(cb => cb(data));
    },

    once(event, callback) {
      const unsubscribe = this.on(event, (data) => {
        callback(data);
        unsubscribe(); // auto-remove after first call
      });
    }
  };
}

// --- USAGE ---
const bus = createEventBus();

// Subscribe
const unsubCart = bus.on("cart:updated", (cart) => {
  updateCartIcon(cart.items.length);
  updateCartTotal(cart.total);
});

bus.on("user:logout", () => {
  clearUserSession();
  redirectToLogin();
});

bus.once("app:ready", () => {
  console.log("App initialized — fires only once");
});

// Publish from anywhere
bus.emit("cart:updated", { items: [...cartItems], total: 89.99 });
bus.emit("user:logout");

// Unsubscribe when done
unsubCart();

// --- WHEN TO USE ---
// Communication between unrelated components, real-time features (chat, notifications),
// micro-frontend coordination, analytics event tracking.
```

### 6. Observer pattern — objects watch other objects
```js
// CONCEPT: Subject maintains a list of observers and notifies them on state change.
// Similar to Pub/Sub but observers are directly coupled to the subject.

class Store {
  #state;
  #observers = new Set();

  constructor(initialState) {
    this.#state = initialState;
  }

  // Register an observer
  subscribe(observer) {
    this.#observers.add(observer);
    return () => this.#observers.delete(observer); // unsubscribe
  }

  // Update state and notify all observers
  setState(updates) {
    const prevState = this.#state;
    this.#state = { ...this.#state, ...updates };
    this.#notify(this.#state, prevState);
  }

  getState() {
    return { ...this.#state }; // return copy, not reference
  }

  #notify(newState, prevState) {
    this.#observers.forEach(observer => observer(newState, prevState));
  }
}

// --- USAGE ---
const cartStore = new Store({ items: [], total: 0, count: 0 });

// Multiple UI components observe the same store
const unsubHeader = cartStore.subscribe((state) => {
  document.querySelector(".cart-count").textContent = state.count;
});

const unsubSidebar = cartStore.subscribe((state, prev) => {
  if (state.total !== prev.total) {
    document.querySelector(".cart-total").textContent = `$${state.total}`;
  }
});

// Update triggers all observers
cartStore.setState({ items: [product], count: 1, total: 29.99 });

// Cleanup
unsubHeader();
unsubSidebar();

// --- WHEN TO USE ---
// State management (Redux, Zustand, MobX are built on this),
// real-time UI updates, any time multiple parts of UI depend on shared state.
```

### 7. Module pattern with IIFE — private state
```js
// CONCEPT: IIFE creates a private scope. Only the returned object is public.
// Foundation of the revealing module pattern.

const ShoppingCart = (function() {
  // Private — not accessible from outside
  let items = [];
  let discount = 0;

  function calculateTotal() {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return subtotal * (1 - discount);
  }

  function findItem(id) {
    return items.find(item => item.id === id);
  }

  // Public API — only what we expose
  return {
    addItem(product, qty = 1) {
      const existing = findItem(product.id);
      if (existing) {
        existing.qty += qty;
      } else {
        items.push({ ...product, qty });
      }
      return this; // chainable
    },

    removeItem(id) {
      items = items.filter(item => item.id !== id);
      return this;
    },

    applyDiscount(percent) {
      discount = percent / 100;
      return this;
    },

    getTotal() { return calculateTotal(); },
    getItems() { return [...items]; }, // return copy
    getCount() { return items.reduce((sum, i) => sum + i.qty, 0); },
    clear()    { items = []; discount = 0; return this; }
  };
})();

// --- USAGE ---
ShoppingCart
  .addItem({ id: 1, name: "Shirt", price: 29 })
  .addItem({ id: 2, name: "Shoes", price: 89 }, 2)
  .applyDiscount(10);

ShoppingCart.getTotal(); // 188.1
ShoppingCart.getCount(); // 3
// items and discount are completely private — can't be tampered with

// --- WHEN TO USE ---
// Encapsulating state in non-framework JS, browser scripts that need private state,
// legacy codebases. In modern code, ES modules provide better encapsulation.
```

### 8. Factory function — create objects without `new`
```js
// CONCEPT: A regular function that creates and returns objects.
// No `new`, no `this` confusion, no prototype chain complexity.
// Preferred by many functional programmers over classes.

function createUser(name, email, role = "user") {
  // Private state via closure
  let loginCount = 0;
  const createdAt = new Date();

  // Public interface
  return {
    name,
    email,
    role,

    login() {
      loginCount++;
      console.log(`${name} logged in (${loginCount} times)`);
      return this;
    },

    promote(newRole) {
      return createUser(name, email, newRole); // immutable update — new object
    },

    getStats() {
      return { loginCount, createdAt, daysActive: getDaysActive(createdAt) };
    },

    toString() { return `${name} <${email}> [${role}]`; }
  };
}

// Factory with validation
function createProduct(data) {
  if (!data.name) throw new Error("Product name is required");
  if (data.price < 0) throw new Error("Price cannot be negative");

  return {
    id: crypto.randomUUID(),
    name: data.name.trim(),
    price: data.price,
    inStock: data.inStock ?? true,
    createdAt: new Date().toISOString()
  };
}

// --- USAGE ---
const alice = createUser("Alice", "alice@example.com", "admin");
alice.login().login();
alice.getStats(); // { loginCount: 2, ... }

const shirt = createProduct({ name: "Shirt", price: 29 });

// Factory vs Class:
// Factory: simpler, no `new`, closures for private state, composable
// Class:   inheritance, instanceof checks, familiar OOP style
// Both are valid — factories are preferred in functional-style codebases

// --- WHEN TO USE ---
// Creating many objects of same shape, when you need private state without classes,
// when you want to avoid `new` and `this` complexity, composable object creation.
```

### 9. Singleton pattern — one instance globally
```js
// CONCEPT: Ensure a class/object has only ONE instance shared across the app.

// Module-based singleton (modern — preferred)
// In ES modules, the module itself is a singleton — code runs only once

// config.js
let instance = null;

class AppConfig {
  constructor() {
    if (instance) return instance; // return existing instance
    instance = this;

    this.env = process.env.NODE_ENV || "development";
    this.apiUrl = this.env === "production"
      ? "https://api.prod.com"
      : "http://localhost:3000";
    this.maxRetries = 3;
  }

  get(key) { return this[key]; }
}

// Usage — always the same object
const config1 = new AppConfig();
const config2 = new AppConfig();
config1 === config2; // true — same instance

// Simpler singleton with a plain object (module pattern)
// database.js
const db = (function() {
  let connection = null;

  function connect() {
    if (!connection) {
      connection = createDatabaseConnection(); // expensive — do once
      console.log("DB connected");
    }
    return connection;
  }

  return { connect, getConnection: () => connection };
})();

// Any module importing db.js gets the same connection
db.connect(); // creates connection
db.connect(); // returns existing connection — no reconnect

// Real-world singletons:
// - Logger instance
// - Analytics tracker
// - WebSocket connection
// - Store (Redux store, single store for the whole app)
// - Feature flags config

// --- WHEN TO USE ---
// Shared resources that are expensive to create (DB connections, WebSockets),
// global config/state that must be consistent, logging services.
// WARNING: Singletons make testing harder — dependency injection is often better.
```

---

## COMMON MISTAKES

### Mistake 1: Debounce inside render/component body (loses closure)
```js
// WRONG — new debounce function created every render, timer always resets
function SearchComponent() {
  const handleInput = debounce(search, 300); // new function every render!
  return <input onInput={handleInput} />;
}

// RIGHT — create once, keep the reference stable
const handleInput = debounce(search, 300); // outside component
// OR use useMemo/useCallback in React
```

### Mistake 2: Throttle vs debounce for scroll
```js
// Debounce on scroll means the handler fires ONLY when scrolling STOPS
// — not useful for real-time progress bars or sticky headers

// Use throttle for scroll — fires regularly during scrolling
window.addEventListener("scroll", throttle(updateNavbar, 100));

// Use debounce for scroll — fires when user finishes scrolling
window.addEventListener("scroll", debounce(saveScrollPosition, 500));
```

### Mistake 3: Memoize with object arguments (reference equality)
```js
const memoizedFn = memoize(processData);

const obj = { id: 1 };
memoizedFn(obj); // computes, caches with key '{"id":1}'

obj.id = 2;
memoizedFn(obj); // cache MISS — key is now '{"id":2}'
// JSON.stringify helps here, but beware of circular refs and functions in args
```

### Mistake 4: Not cleaning up pub/sub subscriptions
```js
// Memory leak — subscriber lives forever even after component is gone
bus.on("data:update", updateUI);

// RIGHT — always unsubscribe when component is destroyed
const unsubscribe = bus.on("data:update", updateUI);
// In React: return unsubscribe from useEffect
// In vanilla: call on destroy/cleanup
```

---

## INTERVIEW TIP

> **"Implement debounce from scratch."**
>
> Answer template: "Debounce uses a closure to hold a timer ID. Each call clears the previous timer and sets a new one. The actual function only fires when no new calls arrive within the delay window." Then write the 8-line implementation above. This is the most common frontend coding question at mid-to-senior level.

> **"What's the difference between debounce and throttle?"**
>
> Answer: Debounce delays execution until N ms after the LAST call — good for search inputs (wait until user stops typing). Throttle ensures execution happens at most once per N ms — good for scroll handlers (update regularly during scrolling). Both use closures to hold timing state.

> **"What design pattern does React's useState/useReducer use?"**
>
> Answer: Observer pattern — components subscribe to state changes and re-render when notified. The store holds state and a list of subscribers (React's reconciler). When state updates, all subscribers (components) are notified to re-render.
