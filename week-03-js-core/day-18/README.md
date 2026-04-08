# Day 18 — DOM Manipulation + Events

**Status:** 📋 READY TO START
**Week:** 3 | **Theme:** JavaScript Core

---

## What You'll Learn Today

This is the day JavaScript meets the visible page. The DOM (Document Object Model) is how JavaScript sees and controls HTML. Every time you click a button and something happens, that's DOM + Events.

Today you'll learn:
- **`querySelector` / `querySelectorAll`** — find elements on the page
- **Reading and changing content** — `textContent`, `innerHTML`, `style`, `classList`
- **`addEventListener`** — make things respond to user actions
- **Event delegation** — one listener handles many elements efficiently
- **Creating elements dynamically** — adding new HTML without refreshing
- **Intersection Observer** — detect when elements enter the viewport

By end of day, you'll have built a painting app and an infinite scroll — two things that look impressive but use exactly what you learned today.

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/js/09-dom.md` — left panel
3. `exercises/js-dom/13-color-painter.html` — midday
4. `exercises/js-dom/14-infinite-scroll.html` — midday

---

## How to Run HTML Files (Different from JS files!)

**Do NOT use `node filename.html`** — that won't work. HTML files need a browser.

**Option 1 — Live Server (recommended):**
1. In Cursor, install the **Live Server** extension if you haven't:
   - Press `Ctrl+Shift+X` to open extensions
   - Search "Live Server" by Ritwick Dey → Install
2. Right-click the `.html` file in the sidebar → **"Open with Live Server"**
3. Your browser opens automatically. Changes refresh automatically!

**Option 2 — Direct browser open:**
- Double-click the `.html` file in Windows Explorer
- It opens in your default browser

**To see your code running:** Right-click in the browser → **Inspect** → **Console** tab. This shows `console.log` output, errors, and more.

---

## Morning (8:00 – 11:00 AM) — Read + Practice

### Create your practice file

For DOM practice, create `day-18-practice.html` in this folder with this starter:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Day 18 Practice</title>
</head>
<body>
  <h1 id="title">Hello World</h1>
  <button id="myBtn">Click Me</button>
  <ul id="myList">
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>

  <script>
    // your practice code goes here
  </script>
</body>
</html>
```

Open it with Live Server, then add code to the `<script>` section and save to see changes instantly.

### Work through `cheatsheets/js/09-dom.md`

For every example, add it to your HTML file's script section, save, and watch the browser update.

---

### Key concepts to practice:

**Selecting elements:**
```js
const title = document.querySelector("#title");         // by id
const items = document.querySelectorAll("li");           // all li elements
const firstItem = document.querySelector("li");          // first li only
```

**Reading and changing content:**
```js
title.textContent = "New Title";              // change text
title.style.color = "red";                    // change CSS
title.classList.add("highlight");             // add class
title.classList.toggle("hidden");             // toggle class
title.classList.contains("highlight");        // check if has class
```

**Creating new elements:**
```js
const newItem = document.createElement("li");
newItem.textContent = "New Item";
document.querySelector("#myList").appendChild(newItem);
```

**Event listeners:**
```js
document.querySelector("#myBtn").addEventListener("click", function(event) {
  console.log("Button clicked!", event);
  console.log("Target:", event.target);
});
```

**Event delegation (important — one listener for many elements):**
```js
// Instead of adding listeners to each li:
document.querySelector("#myList").addEventListener("click", function(event) {
  if (event.target.tagName === "LI") {
    event.target.style.backgroundColor = "yellow";
  }
});
```

This is how you handle 1000 list items with ONE event listener. Efficient and elegant.

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:00 PM) — Exercises

### Exercise 1: `exercises/js-dom/13-color-painter.html`

**Pattern: Event Delegation + Observer**

You're building a painting app! Click cells to paint them. It uses event delegation — one click listener on the grid handles clicks on all cells.

Open it with Live Server. Follow INTRO → GUIDED → YOUR TURN → BOSS CHALLENGE.

The BOSS CHALLENGE adds color palettes, brush sizes, or an eraser. Be creative.

### Exercise 2: `exercises/js-dom/14-infinite-scroll.html`

**Pattern: Observer / Intersection Observer**

This is how Instagram, Twitter, and every modern feed works. When you scroll near the bottom, more content loads automatically.

The Intersection Observer API watches an element. When it enters the viewport (you can see it), a callback fires. You use that callback to load more content.

Open with Live Server and scroll the page after completing each section.

---

## Lunch (1:00 – 2:00 PM)

---

## Afternoon (2:00 – 4:00 PM) — DSA Practice

Open `dsa-bank/03-strings-easy.md`. Solve **problems 9, 10, 11, and 12** (finishing easy strings!).

Then try **1 medium string problem** from `dsa-bank/04-strings-medium.md`.

Write solutions in `day-18-dsa.js` in this folder.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- What is event delegation and why is it better than adding individual listeners?
- How does Intersection Observer work in simple terms?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 18: DOM manipulation - color painter + infinite scroll + 5 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Read `09-dom.md` cheatsheet fully
- [ ] Created `day-18-practice.html` and practiced in browser
- [ ] Typed querySelector, textContent, classList, createElement examples
- [ ] Typed event listener example and saw it fire in browser
- [ ] Typed event delegation example with a list
- [ ] Completed `13-color-painter.html` (built a painting app!)
- [ ] Completed `14-infinite-scroll.html` (built infinite scroll!)
- [ ] Solved 5 DSA problems in `day-18-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference

```js
// Select
document.querySelector("#id")           // one element by CSS selector
document.querySelectorAll(".class")     // NodeList of all matches
document.getElementById("id")          // shorthand for id

// Read/Write
el.textContent                          // get/set text (safe)
el.innerHTML                            // get/set HTML (be careful with user input!)
el.getAttribute("href")                 // get attribute
el.setAttribute("href", "url")          // set attribute

// Classes
el.classList.add("active")
el.classList.remove("active")
el.classList.toggle("active")
el.classList.contains("active")        // boolean

// Create and insert
const el = document.createElement("div")
el.textContent = "Hello"
parent.appendChild(el)                  // add at end
parent.insertBefore(el, referenceEl)    // add before reference

// Events
el.addEventListener("click", handler)
el.addEventListener("input", handler)   // for text inputs
el.addEventListener("submit", handler)  // for forms
el.removeEventListener("click", handler)

// Event object
function handler(event) {
  event.target          // element that was clicked
  event.preventDefault() // stop default behavior (like form submit)
  event.stopPropagation() // stop event bubbling up
}
```

---

*DOM manipulation is what makes JavaScript visible. Everything you build for users lives here.*
