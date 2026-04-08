# Post 3 — The JavaScript Event Loop Explained

**Best time to post:** Wednesday, 9–11am IST
**Estimated reach:** High — "event loop" is one of the most searched JS concepts
**Goal:** Technical credibility, show you understand JS at depth

---

## READY TO COPY ↓

---

This JavaScript code prints B before A. Every time.

```js
setTimeout(() => console.log('A'), 0);
console.log('B');
```

Even with a 0ms delay. Why?

Because JavaScript is single-threaded — it can only do one thing at a time. The event loop is how it manages to do *anything* asynchronous at all.

Here's what happens, step by step:

1. `setTimeout` is called → the callback is handed off to the **Web API** (not JavaScript itself)
2. JavaScript keeps running → `console.log('B')` executes → prints B
3. The call stack is now **empty**
4. The event loop checks the callback queue → finds the setTimeout callback
5. Moves it to the call stack → executes it → prints A

The event loop's job is simple: **"Is the call stack empty? If yes, move the next callback from the queue."**

That's it.

---

Now here's where it gets interesting.

Promises use the **microtask queue** — which has higher priority than the callback queue.

```js
setTimeout(() => console.log('A'), 0);
Promise.resolve().then(() => console.log('B'));
console.log('C');
```

This prints: C → B → A

C first (sync). B second (microtask, runs before next macrotask). A last (macrotask / setTimeout).

---

This is why `useEffect` in React runs *after* the render is painted — it's queued, not synchronous. Understanding the event loop explains that without needing to memorize it as a rule.

---

What JavaScript concept do you wish you'd understood earlier?

#JavaScript #WebDevelopment #Frontend #Learning #React

---

## Notes for Posting

- The code blocks are the hook — they make people stop scrolling
- The "even with 0ms delay" detail in the opening creates genuine curiosity
- Follow-up comment: post the microtask vs macrotask visual if you can draw one
- Tag it under the "JavaScript" topic on LinkedIn for additional reach
