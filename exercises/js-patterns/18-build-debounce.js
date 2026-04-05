// ============================================
// INTRO: Debounce and Throttle and WHY they matter
// ============================================
// Some events fire extremely rapidly: typing, resizing, scrolling, mouse moves.
// If each event triggers an expensive operation (API call, DOM reflow, heavy
// computation), the application becomes sluggish and the server gets hammered.
//
// DEBOUNCE: "Wait until they stop. Then act."
//   After each event, reset a timer. Only execute after X ms of silence.
//   → Search: wait until user stops typing, THEN fetch results.
//   → Save: wait until edits stop, THEN auto-save.
//
// THROTTLE: "Act now. Then ignore for a while."
//   Execute immediately. Then block all calls for X ms. Then allow next.
//   → Scroll handlers: run at most once every 16ms (60fps).
//   → Button click: prevent double-submit, run once per second max.
//
// These are HIGHER-ORDER FUNCTIONS: they take a function and return
// a new, wrapped function with the rate-limiting behavior applied.
//
// WHY it matters: Every production search bar, resize handler, and
// scroll listener uses one of these. Understanding the difference lets
// you choose the right tool for each use case.
// ============================================

// ============================================
// MENTAL MODEL: How to think about them
// ============================================
// Debounce: You're waiting to get on an elevator.
//   Every time a new person arrives, the doors stay open (timer resets).
//   Doors only close (function executes) when nobody new arrives for X seconds.
//   Waiting for a pause before acting.
//
// Throttle: You're texting your friend news updates.
//   You can send at most one text per minute.
//   If more happens: first message goes immediately, rest are dropped or queued.
//   Acting at a steady, limited rate regardless of input frequency.
//
// When to use which:
//   "Wait for calm":       debounce (search input, validation, auto-save)
//   "Keep up, but slower": throttle (scroll, resize, mouse position, gaming input)
// ============================================

console.log("=== DEBOUNCE / THROTTLE: Build from Scratch ===\n");

// ---- PART 1: Build debounce from scratch ----

console.log("--- PART 1: Building debounce ---\n");

// debounce(fn, delay): returns a new function that waits 'delay' ms after
// the last call before executing fn
function debounce(fn, delay) {
  let timerId = null;

  return function(...args) {
    // Cancel the previous pending timer
    clearTimeout(timerId);

    // Set a new timer
    timerId = setTimeout(() => {
      fn.apply(this, args);  // Call original function with correct context and args
      timerId = null;
    }, delay);
  };
}

// Test: simulated typing — only the last keystroke should fire
console.log("Testing debounce (300ms delay):");
console.log("User types: 'j', 'js', 'jav', 'java', 'javas' — expect one call after last");

const mockSearch = (query) => {
  console.log(`  [FETCH] Searching for: "${query}"`);
};

const debouncedSearch = debounce(mockSearch, 100); // 100ms for demo

// Simulate rapid keypresses
debouncedSearch("j");
debouncedSearch("js");
debouncedSearch("jav");
debouncedSearch("java");
debouncedSearch("javas");

setTimeout(() => {
  // After 200ms total, the debounced search fires once for "javas"
  debouncedSearch("javasc");
  debouncedSearch("javascri");
  debouncedSearch("javascript");
}, 200); // New burst starts 200ms later

setTimeout(() => {
  // After 500ms total, "javascript" fires
  console.log('  (You should see 2 fetch calls: "javas" and "javascript")');
}, 500);

// ---- PART 2: Enhanced debounce with immediate option ----

console.log("\n--- PART 2: Debounce with immediate execution option ---\n");

// immediate: true → execute FIRST call immediately, then debounce trailing calls
// This is useful for: button clicks where you want instant feedback,
//   then block subsequent rapid clicks
function debounceEnhanced(fn, delay, { immediate = false, maxWait = null } = {}) {
  let timerId = null;
  let lastCallTime = null;
  let lastInvokeTime = 0;
  let result;

  function shouldInvoke(time) {
    if (lastCallTime === null) return true;
    if (maxWait !== null && (time - lastInvokeTime) >= maxWait) return true;
    return false;
  }

  return function(...args) {
    const time = Date.now();
    const isFirstCall = lastCallTime === null;
    lastCallTime = time;

    // Immediate mode: invoke on first call, then debounce
    if (immediate && isFirstCall) {
      lastInvokeTime = time;
      result = fn.apply(this, args);
      return result;
    }

    // maxWait: if we've waited too long, flush immediately
    if (maxWait !== null && (time - lastInvokeTime) >= maxWait) {
      clearTimeout(timerId);
      timerId = null;
      lastInvokeTime = time;
      result = fn.apply(this, args);
      return result;
    }

    clearTimeout(timerId);
    timerId = setTimeout(() => {
      lastInvokeTime = Date.now();
      lastCallTime = null;
      timerId = null;
      result = fn.apply(this, args);
    }, delay);

    return result;
  };
}

// Test immediate debounce
let submitCount = 0;
const submitForm = debounceEnhanced(
  (data) => { submitCount++; console.log(`  [SUBMIT #${submitCount}] Form submitted:`, data); },
  500,
  { immediate: true }
);

setTimeout(() => {
  console.log("Clicking submit 3 times rapidly (immediate mode):");
  submitForm({ email: "test@test.com" }); // fires immediately (first call)
  submitForm({ email: "test@test.com" }); // blocked
  submitForm({ email: "test@test.com" }); // blocked — only 1 submit
}, 600);

// ---- PART 3: Build throttle from scratch ----

console.log("\n--- PART 3: Building throttle ---\n");

// throttle(fn, limit): returns a function that executes fn at most once per 'limit' ms
// First call executes immediately. Subsequent calls during the limit are ignored (trailing).
function throttle(fn, limit) {
  let lastRun = 0;
  let timerId = null;

  return function(...args) {
    const now = Date.now();
    const remaining = limit - (now - lastRun);

    if (remaining <= 0) {
      // Enough time has passed — execute now
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      lastRun = now;
      fn.apply(this, args);
    } else {
      // Within the limit window — schedule the trailing call
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        lastRun = Date.now();
        timerId = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

// Test throttle
console.log("Testing throttle (100ms limit) — scroll simulation:");
const updateScrollProgress = (position) => {
  console.log(`  [SCROLL] Position: ${position}px`);
};

const throttledScroll = throttle(updateScrollProgress, 100);

// Simulate scroll events firing every 16ms (60fps)
let position = 0;
const scrollSim = setInterval(() => {
  position += 50;
  throttledScroll(position);
  if (position >= 500) clearInterval(scrollSim);
}, 16);

// Should fire: ~500ms / 100ms = ~5 times, not 30+ times

// ---- PART 4: Side-by-side comparison demo ----

setTimeout(() => {
  console.log("\n--- PART 4: Debounce vs Throttle side-by-side ---\n");
  console.log("Rapid button clicks — observe different behaviors:\n");

  let debounceCount = 0;
  let throttleCount = 0;

  const debouncedFn = debounce(() => {
    debounceCount++;
    console.log(`  DEBOUNCE fired (count: ${debounceCount}) — fires AFTER clicks stop`);
  }, 100);

  const throttledFn = throttle(() => {
    throttleCount++;
    console.log(`  THROTTLE fired (count: ${throttleCount}) — fires DURING clicks, max once/100ms`);
  }, 100);

  // Simulate 10 clicks over 200ms
  const clickTimes = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180];
  clickTimes.forEach(ms => {
    setTimeout(() => {
      debouncedFn();
      throttledFn();
    }, ms);
  });

  setTimeout(() => {
    console.log(`\n  Result: debounce fired ${debounceCount}x, throttle fired ${throttleCount}x`);
    console.log("  Debounce: 1 time (only after all clicks stopped)");
    console.log("  Throttle: ~2-3 times (once per 100ms window)");
  }, 500);
}, 1000);

// ---- PART 5: Real use case — search bar with debounce ----

setTimeout(() => {
  console.log("\n--- PART 5: Real search bar pattern ---\n");

  let apiCallCount = 0;
  let renderCount = 0;

  async function searchAPI(query) {
    apiCallCount++;
    console.log(`  [API call #${apiCallCount}] GET /search?q=${query}`);
    // Simulate async response
    return new Promise(resolve =>
      setTimeout(() => resolve([`Result for: ${query}`]), 50)
    );
  }

  function renderResults(results) {
    renderCount++;
    console.log(`  [Render #${renderCount}] Showing:`, results);
  }

  // Without debounce: every keystroke = one API call
  // With debounce: only call after user pauses typing

  const debouncedAPISearch = debounce(async (query) => {
    if (query.length < 2) return;       // Don't search single chars
    const results = await searchAPI(query);
    renderResults(results);
  }, 150);

  // Simulate typing "react hooks"
  const typingSequence = ["r", "re", "rea", "reac", "react", "react ", "react h", "react ho", "react hoo", "react hook", "react hooks"];
  typingSequence.forEach((text, i) => {
    setTimeout(() => {
      console.log(`  Typed: "${text}"`);
      debouncedAPISearch(text);
    }, i * 80); // 80ms between each character
  });

  setTimeout(() => {
    console.log(`\n  Typed ${typingSequence.length} characters → ${apiCallCount} API calls`);
    console.log("  (Without debounce: would have been 9+ API calls)");
  }, typingSequence.length * 80 + 300);
}, 2000);

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. In debounce: what happens if the user NEVER stops typing?
//    Answer: The function never executes. The timer keeps resetting.
//    This is why maxWait exists — force execution after a maximum time
//    even if input is continuous. Lodash's debounce has maxWait option.
//
// 2. What does "this" refer to inside fn.apply(this, args)?
//    Answer: In debounce/throttle, we use a regular function (not arrow)
//    as the wrapper. When called as someObject.debounced(), this inside
//    the wrapper is someObject. fn.apply(this, args) forwards that context
//    to the original function. Arrow functions would capture lexical this
//    (the debounce function's scope), losing the caller's context.
//
// 3. What is the difference between "leading" and "trailing" execution?
//    Answer: Trailing (default): execute after the delay, once calls stop.
//    Leading (immediate): execute on first call, block subsequent calls
//    during delay window. Many implementations support both options.
//    Throttle typically does leading execution; debounce does trailing.
//
// 4. Can you debounce an async function?
//    Answer: Yes — but the debounced wrapper returns undefined (not a Promise)
//    because the timer callback runs later. For async debounce where you need
//    the return value: use a different pattern (AbortController + direct call).
//    For side-effect async (API call, no return needed): debounce works fine.
// ============================================

// ============================================
// YOUR TURN: Build Throttle + Side-by-Side Demo
// ============================================
// You have debounce working. Now build a complete throttle and compare them.
//
// Step 1 — Build throttleWithOptions(fn, limit, options):
//   options.leading  (default true):  fire on first call immediately
//   options.trailing (default true):  fire once more after last call + delay
//   options.leading = false, trailing = true → wait for delay, then fire once
//   options.leading = true, trailing = false → fire immediately, then ignore
//   options.leading = true, trailing = true  → fire immediately AND after last call
//
// Step 2 — Build a cancelable wrapper:
//   Both debounce and throttle should have a .cancel() method
//   const debouncedSearch = debounce(fn, 300)
//   debouncedSearch.cancel()  → clears any pending timer
//   debouncedSearch.flush()   → execute immediately (ignoring delay)
//   debouncedSearch.pending() → returns true if a timer is scheduled
//
// Step 3 — Build a requestAnimationFrame-based throttle:
//   throttleRAF(fn) → like throttle but synced to screen refresh (60fps)
//   Uses requestAnimationFrame instead of setTimeout
//   Perfect for scroll handlers and animations

function throttleWithOptions(fn, limit, options = {}) {
  // YOUR CODE HERE
  // options: { leading: true, trailing: true }
}

function debounceWithControls(fn, delay) {
  // YOUR CODE HERE
  // Must return function with .cancel(), .flush(), .pending() methods
  // Hint: return Object.assign(wrapper, { cancel, flush, pending })
}

function throttleRAF(fn) {
  // YOUR CODE HERE
  // Hint: let rafId = null; return: if rafId: return; rafId = requestAnimationFrame(...)
}

// Step 4 — Visual demo comparing both (run in browser):
// Create a simple HTML page or just console.log comparison:

function runComparison() {
  console.log("--- YOUR TURN: Comparing debounce vs throttle ---\n");

  const debounced = debounceWithControls((x) => console.log(`  DEBOUNCE(${x})`), 100);
  const throttled = throttleWithOptions((x) => console.log(`  THROTTLE(${x})`), 100);

  // Fire 10 events over 300ms
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      debounced(i);
      throttled(i);
    }, i * 30);
  }

  setTimeout(() => {
    console.log("  pending:", debounced.pending?.());
    debounced.cancel?.();
    console.log("  cancelled!");
  }, 200);
}

setTimeout(runComparison, 4000);

// ============================================
// BOSS CHALLENGE: Build a requestAnimationFrame scheduler
// ============================================
// Real animation libraries use a scheduler to batch DOM updates efficiently.
// Build a micro-scheduler that:
//
//   const scheduler = createScheduler()
//
//   scheduler.schedule('updateCounter', () => { el.textContent = count })
//   scheduler.schedule('updateCounter', () => { el.textContent = count + 1 })
//   // Calling with same key REPLACES the previous (deduplication)
//   // Both calls above: only the second callback runs in the next frame
//
//   scheduler.schedule('updateList', () => renderList())
//   // Different key: runs alongside updateCounter in the same animation frame
//
// Uses requestAnimationFrame to batch all scheduled work into one frame.
// Benefits:
//   - No more than one DOM update per key per frame (deduplication)
//   - All DOM updates happen at once (no layout thrashing from interleaved reads/writes)
//   - Automatically pauses when tab is hidden
//
// Also build:
//   scheduler.scheduleWork(priority, fn) where priority is "high" | "normal" | "low"
//   High priority runs in same frame, normal after 1 frame, low after 3+ frames idle

function createScheduler() {
  // YOUR CODE HERE
}

// ============================================
// PATTERN LEARNED: Debounce / Throttle
// ============================================
// PATTERN NAME: Rate Limiting — Debounce & Throttle
// WHEN YOU SEE: Rapidly-firing events connected to expensive operations
// USE THIS:
//
//   import { debounce, throttle } from 'lodash'  ← in production, use lodash
//   OR roll your own (interview question, small projects)
//
//   DEBOUNCE (wait for calm):
//     Search input → fetch       "Don't search until they pause"
//     Form validation → render   "Don't validate until they stop typing"
//     Auto-save → write          "Don't save until they stop editing"
//     Resize → recalculate       "Don't recalculate until resize ends"
//
//   THROTTLE (limit rate):
//     Scroll → track position    "Update position max every 16ms"
//     Mouse move → tooltip       "Show tooltip max every 100ms"
//     Button → API call          "Can only submit once per 2 seconds"
//     Realtime typing → socket   "Send keystrokes max 10x per second"
//
//   DECISION:
//     "Should final value reach the function?"  → DEBOUNCE
//     "Should every interval get a call?"       → THROTTLE
//
// IMPLEMENTATION NOTES:
//   - Lodash debounce/throttle have maxWait, leading, trailing options
//   - In React: useCallback + useMemo for memoizing debounced functions
//   - In React: cleanup in useEffect return: return () => debouncedFn.cancel()
//   - TypeScript: declare return type as the original function's type
//
// REACT PATTERN:
//   const debouncedSearch = useCallback(
//     debounce((q) => fetchResults(q), 300),
//     []  // create once on mount
//   )
//   useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch])
// ============================================
