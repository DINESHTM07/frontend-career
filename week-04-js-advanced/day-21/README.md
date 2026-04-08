# Day 21 — Advanced DOM + Keyboard Warrior Game

**Status:** 📋 READY TO START
**Week:** 4 | **Theme:** JavaScript Advanced

---

## What You'll Learn Today

Day 18 was DOM basics. Today is advanced DOM — the APIs that power modern web apps.

- **Intersection Observer** — detect when elements enter/leave the viewport (lazy loading, scroll animations)
- **MutationObserver** — watch for DOM changes (react to dynamic content)
- **ResizeObserver** — detect when elements change size (responsive charts)

Then you build a **typing speed game** — a real, playable project using all three observer types plus the state machine pattern.

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/js/09-dom.md` — re-read the advanced observer sections (morning)
3. `exercises/js-dom/15-keyboard-warrior.html` — midday
4. `dsa-bank/hashmaps.md` — afternoon

---

## Morning (8:00 – 11:00 AM) — Advanced DOM Observer Experiments

### Create your practice file

Create `day-21-practice.html` in this folder:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Day 21 — Advanced DOM Practice</title>
  <style>
    .tall { height: 1000px; background: #eee; display: flex; align-items: flex-end; padding: 20px; }
    .target { width: 120px; height: 120px; background: salmon; margin: 50px auto; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .box { width: 250px; padding: 20px; background: lightblue; border-radius: 8px; margin: 20px; resize: both; overflow: auto; }
  </style>
</head>
<body>
  <div class="tall">↓ Scroll down to see the target</div>
  <div class="target" id="observed">Watch me!</div>
  <div class="box" id="resizable">Resize me by dragging the corner →</div>
  <div id="dynamic-container"></div>
  <button id="addBtn">Add Element</button>

  <script>
    // experiments go here
  </script>
</body>
</html>
```

Open with **Live Server** (right-click file → Open with Live Server). Open browser Console with **F12 → Console tab**.

---

### Experiment 1 — Intersection Observer

```js
const target = document.querySelector("#observed");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.background = "limegreen";
      console.log("✅ Element entered viewport!");
    } else {
      entry.target.style.background = "salmon";
      console.log("❌ Element left viewport!");
    }
  });
}, { threshold: 0.5 }); // fires when 50% of element is visible

observer.observe(target);
```

**Type this, save, then scroll down slowly.** Watch the box change color. This is exactly how scroll-reveal animations work on modern websites.

Try changing `threshold` to `0` (fires on first pixel) and `1` (fires only when fully visible).

---

### Experiment 2 — MutationObserver

```js
const container = document.querySelector("#dynamic-container");

const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    console.log("DOM changed!", mutation.type, mutation.addedNodes.length, "nodes added");
  });
});

mutationObserver.observe(container, {
  childList: true,   // watch for added/removed children
  subtree: true      // watch all descendants
});

document.querySelector("#addBtn").addEventListener("click", () => {
  const p = document.createElement("p");
  p.textContent = "Added at " + new Date().toLocaleTimeString();
  container.appendChild(p);
});
```

Click the button and watch the console react. This is how tools like Vue and React devtools watch for changes.

---

### Experiment 3 — ResizeObserver

```js
const box = document.querySelector("#resizable");

const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect;
    box.textContent = `${Math.round(width)} × ${Math.round(height)}px`;
  });
});

resizeObserver.observe(box);
```

**Drag the bottom-right corner of the box** — the dimensions update in real time. This is how Chart.js redraws itself when its container resizes.

---

### Experiment 4 — State Machine Pattern

Games use state machines so invalid actions are impossible:

```js
const States = { IDLE: "idle", COUNTDOWN: "countdown", PLAYING: "playing", GAME_OVER: "game_over" };

const transitions = {
  [States.IDLE]:      ["start"],
  [States.COUNTDOWN]: ["playing"],
  [States.PLAYING]:   ["end"],
  [States.GAME_OVER]: ["restart"]
};

let state = States.IDLE;

function transition(action) {
  if (transitions[state]?.includes(action)) {
    console.log(`✅ ${state} → [${action}]`);
    // update state here
  } else {
    console.log(`❌ Cannot "${action}" from state "${state}"`);
  }
}

transition("start");   // ✅
transition("start");   // ❌ already in countdown
transition("playing"); // ✅
```

Type this. Test valid and invalid transitions. This exact pattern runs the Keyboard Warrior game.

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:00 PM) — Build the Keyboard Warrior Game

### `exercises/js-dom/15-keyboard-warrior.html`

**Pattern: Event Loop + State Machine**

Open with **Live Server**. You're building a typing speed game:

- A random word appears on screen
- Player types it as fast as possible
- Correct letters turn green, wrong letters turn red
- Timer counts down
- Score shows words per minute
- States: idle → countdown → playing → game_over

Work through INTRO → GUIDED → YOUR TURN → BOSS CHALLENGE.

**BOSS CHALLENGE — Add 3 difficulty levels:**

| Level | Words | Timer | Extras |
|-------|-------|-------|--------|
| Easy | Common words only | 60 sec | None |
| Medium | Shorter words + numbers | 45 sec | None |
| Hard | Mixed case + punctuation | 30 sec | Double points |

The difficulty selector must be disabled while a game is in progress — that's your state machine enforcing rules. Can only change difficulty from IDLE state.

**This is genuinely fun to play.** Race yourself after building it.

---

## Lunch (1:00 – 2:00 PM)

---

## Afternoon (2:00 – 4:00 PM) — Hash Maps DSA

Open `dsa-bank/hashmaps.md`. Solve **problems 6 through 10**, plus **1 medium array problem** from `dsa-bank/02-arrays-medium.md`.

Write solutions in `day-21-dsa.js` in this folder.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- What's the difference between IntersectionObserver, MutationObserver, and ResizeObserver — one sentence each
- What is a state machine and why does it prevent bugs?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 21: Advanced DOM + Keyboard Warrior game + 6 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Re-read observer sections in `09-dom.md`
- [ ] Created `day-21-practice.html` and ran all 4 experiments in browser
- [ ] Saw Intersection Observer fire on scroll
- [ ] Saw MutationObserver fire on button click
- [ ] Saw ResizeObserver update when element is resized
- [ ] Typed and tested the State Machine pattern
- [ ] Built working `15-keyboard-warrior.html` (can play it!)
- [ ] Added 3 difficulty levels (BOSS CHALLENGE)
- [ ] Solved 6 DSA problems in `day-21-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference — Observers

```js
// Intersection Observer
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) console.log("visible!");
  });
}, { threshold: 0.5 });
io.observe(element);
io.disconnect(); // stop

// Mutation Observer
const mo = new MutationObserver(mutations => {
  mutations.forEach(m => console.log(m.type, m.addedNodes));
});
mo.observe(container, { childList: true, subtree: true });
mo.disconnect();

// Resize Observer
const ro = new ResizeObserver(entries => {
  entries.forEach(e => console.log(e.contentRect.width, e.contentRect.height));
});
ro.observe(element);
ro.disconnect();
```

---

*Observer APIs are used in every production frontend. IntersectionObserver alone powers lazy-loading images on every major website you use daily.*
