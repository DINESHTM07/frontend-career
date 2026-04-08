# Day 23 — Build Debounce, Throttle & Bind From Scratch

**Status:** 📋 READY TO START
**Week:** 4 | **Theme:** JavaScript Advanced

---

## What You'll Learn Today

Three JavaScript implementations come up in **60%+ of frontend interviews**:

1. **Debounce with cancel** — "fire only after user stops" (search inputs, resize handlers)
2. **Throttle with leading/trailing** — "fire at most once per interval" (scroll, mousemove)
3. **`Function.prototype.myBind`** — attach a permanent `this` context to any function

Today you build all three from scratch — no libraries — then wire your debounce into a real search app.

---

## Files to Open Today

1. **This README** — read first
2. `dsa-bank/10-js-specific-dsa.md` — morning (debounce, throttle, bind problems)
3. New file you'll create: `day-23-search-app/` folder — midday
4. `dsa-bank/linked-lists.md` and `dsa-bank/stacks.md` — afternoon

---

## Morning (8:00 – 11:00 AM) — Build the Three Implementations

Create `day-23-implementations.js` in this folder.

Open `dsa-bank/10-js-specific-dsa.md` and find the debounce, throttle, and bind problems.

---

### Build 1 — Debounce with Cancel

Debounce: delay execution until the user stops performing an action. If they act again before the delay, reset the timer.

```js
function debounce(fn, delay) {
  let timeoutId = null;

  function debounced(...args) {
    // Clear any existing timer — reset the countdown
    clearTimeout(timeoutId);

    // Start a new timer
    timeoutId = setTimeout(() => {
      fn.apply(this, args);  // call fn with correct this and all args
      timeoutId = null;
    }, delay);
  }

  // Add a cancel method — stops pending call without calling fn
  debounced.cancel = function() {
    clearTimeout(timeoutId);
    timeoutId = null;
    console.log("Debounce cancelled");
  };

  return debounced;
}

// Test it
const handleSearch = debounce((query) => {
  console.log("Searching for:", query);
}, 500);

handleSearch("h");
handleSearch("he");
handleSearch("hel");
handleSearch("hell");
handleSearch("hello"); // ← only THIS fires (after 500ms silence)

// Test cancel
handleSearch("test");
handleSearch.cancel(); // cancelled before 500ms — nothing fires
```

Type this. Test it. The output should show only "hello" appears (after a brief pause).

**Why it uses `.apply(this, args)`:** Preserves the calling context and spreads arguments. Without this, `this` inside the original function would be wrong, and rest params wouldn't pass through.

---

### Build 2 — Throttle with Leading/Trailing

Throttle: fire at most once per interval, no matter how many times it's called.

- **Leading edge:** fire immediately on first call, then wait
- **Trailing edge:** fire after the interval ends with the last call's args
- **Both:** fire immediately AND once more at the end if called during the wait

```js
function throttle(fn, interval, { leading = true, trailing = true } = {}) {
  let lastTime = 0;
  let timeoutId = null;
  let lastArgs = null;

  return function(...args) {
    const now = Date.now();
    lastArgs = args;

    if (leading && now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    } else if (trailing) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        fn.apply(this, lastArgs);
        timeoutId = null;
      }, interval - (now - lastTime));
    }
  };
}

// Test
const logScroll = throttle((pos) => console.log("scroll:", pos), 1000);

// Simulate rapid calls
logScroll(100);   // fires immediately (leading)
logScroll(200);   // suppressed
logScroll(300);   // suppressed, but trailing will fire with this value
// ~1 second later: fires with 300 (trailing)
```

---

### Build 3 — `Function.prototype.myBind`

`bind` creates a new function with a permanently locked `this` context.

```js
Function.prototype.myBind = function(context, ...boundArgs) {
  const fn = this; // 'this' here is the function being bound

  return function(...callArgs) {
    // Merge pre-bound args with args passed at call time
    return fn.apply(context, [...boundArgs, ...callArgs]);
  };
};

// Test
const user = { name: "Dinesh" };

function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const boundGreet = greet.myBind(user, "Hello"); // pre-bind 'Hello'
console.log(boundGreet("!"));   // "Hello, Dinesh!"
console.log(boundGreet("..."));  // "Hello, Dinesh..."

// Compare with native bind
const nativeBound = greet.bind(user, "Hello");
console.log(nativeBound("!"));   // same output ✓
```

**Key concept:** The pre-bound args (`boundArgs`) are merged with call-time args (`callArgs`) using spread. This is called **partial application** — one of currying's cousins.

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:00 PM) — Build a Real Search App with YOUR Debounce

Build a search app that uses your `debounce` function — no library, just what you built this morning.

### Create the project

Create a folder `day-23-search-app/` inside the `day-23` folder. Add these files:

**`index.html`:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Debounced Search</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
    input { width: 100%; padding: 12px; font-size: 16px; border: 2px solid #ddd; border-radius: 8px; outline: none; }
    input:focus { border-color: #4f46e5; }
    #status { color: #888; font-size: 14px; margin: 8px 0; min-height: 20px; }
    #results { list-style: none; padding: 0; margin-top: 16px; }
    #results li { padding: 12px; border: 1px solid #eee; border-radius: 6px; margin-bottom: 8px; }
    #results li:hover { background: #f9f9f9; }
    .loading { opacity: 0.5; }
  </style>
</head>
<body>
  <h1>Search Users</h1>
  <input id="searchInput" type="text" placeholder="Type to search...">
  <p id="status"></p>
  <ul id="results"></ul>
  <script src="app.js"></script>
</body>
</html>
```

**`app.js`:**
```js
// === YOUR DEBOUNCE (paste from morning) ===
function debounce(fn, delay) {
  let timeoutId = null;
  function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  }
  debounced.cancel = function() {
    clearTimeout(timeoutId);
    timeoutId = null;
  };
  return debounced;
}

// === SEARCH LOGIC ===
const input = document.querySelector("#searchInput");
const status = document.querySelector("#status");
const resultsList = document.querySelector("#results");

async function searchUsers(query) {
  if (!query.trim()) {
    resultsList.innerHTML = "";
    status.textContent = "";
    return;
  }

  status.textContent = "Searching...";
  resultsList.classList.add("loading");

  try {
    // JSONPlaceholder — free fake API, no key needed
    const res = await fetch(`https://jsonplaceholder.typicode.com/users`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const users = await res.json();

    // Filter locally (the API doesn't support search params)
    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
    );

    status.textContent = `${filtered.length} result(s) for "${query}"`;
    resultsList.innerHTML = filtered.length
      ? filtered.map(u => `<li><strong>${u.name}</strong> — ${u.email}</li>`).join("")
      : `<li>No results found</li>`;
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
    resultsList.innerHTML = "";
  } finally {
    resultsList.classList.remove("loading");
  }
}

// === WIRE UP WITH YOUR DEBOUNCE ===
const debouncedSearch = debounce(searchUsers, 500);

input.addEventListener("input", (e) => {
  status.textContent = "Waiting..."; // shows debounce is working
  debouncedSearch(e.target.value);
});
```

Open with Live Server. Type in the search box:
- Notice "Waiting..." appears immediately
- "Searching..." only appears after you stop typing for 500ms
- Only ONE API call fires per "typing session" — that's your debounce working

**This is exactly how search works at Google, GitHub, and everywhere else.**

---

## Lunch (1:00 – 2:00 PM)

---

## Afternoon (2:00 – 4:00 PM) — DSA: Linked Lists + Stacks

Open `dsa-bank/linked-lists.md`. Solve **problems 1, 2, and 3**.

Then open `dsa-bank/stacks.md`. Solve **problems 1 and 2**.

Write solutions in `day-23-dsa.js` in this folder.

### Linked List Mental Model

A linked list is a chain of nodes. Each node has a value and a pointer to the next node:

```js
// Node
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// Linked List
class LinkedList {
  constructor() {
    this.head = null;
  }

  append(value) {
    const node = new Node(value);
    if (!this.head) { this.head = node; return; }
    let current = this.head;
    while (current.next) current = current.next; // traverse to end
    current.next = node;
  }
}
```

Start from scratch on each problem — don't look at solutions until you've tried for 20 minutes.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- What is the difference between debounce and throttle — one concrete example each
- What does `Function.prototype.myBind` do internally?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 23: Debounce + throttle + bind from scratch + search app + 5 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Built `debounce` with `.cancel()` method in `day-23-implementations.js`
- [ ] Built `throttle` with leading/trailing options
- [ ] Built `Function.prototype.myBind` — tested with partial application
- [ ] Compared each with the native implementation — same behavior
- [ ] Built `day-23-search-app/` — working search with YOUR debounce
- [ ] Saw "Waiting..." vs "Searching..." timing in browser (debounce is visible!)
- [ ] Solved 3 linked list problems in `day-23-dsa.js`
- [ ] Solved 2 stack problems in `day-23-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference

```js
// Debounce — delay until quiet
function debounce(fn, delay) {
  let id;
  const debounced = (...args) => { clearTimeout(id); id = setTimeout(() => fn(...args), delay); };
  debounced.cancel = () => clearTimeout(id);
  return debounced;
}

// Throttle — limit to once per interval
function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) { last = now; fn(...args); }
  };
}

// myBind — lock this context
Function.prototype.myBind = function(ctx, ...bound) {
  const fn = this;
  return (...args) => fn.apply(ctx, [...bound, ...args]);
};
```

---

*Interviewers love these three. "Implement debounce" is a gift question — you just spent a morning building it from scratch.*
