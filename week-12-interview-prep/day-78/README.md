# Day 78 — CSS/HTML Interview Questions + System Design

**Status:** 📋 READY TO START
**Week:** 12 | **Theme:** Interview Preparation

---

## Today's Goal

30 CSS/HTML questions + 5 system design questions. CSS trips people up in interviews because they think it's easy — then can't explain the box model or specificity on the spot. Same method: read, close, explain out loud, compare.

By end of today:
- 30 CSS/HTML questions practiced out loud
- 5 system design questions walked through aloud with full structure
- 3 DSA problems solved

---

## What to Open

1. `interview-vault/03-css-html-interview.md`
2. `interview-vault/05-system-design.md`

---

## The Method

1. Read the question
2. **Close the file**
3. Explain your answer out loud — at least 30 seconds
4. Open and compare
5. Mark: ✅ / ⚠️ / ❌
6. For ❌: read the correct answer out loud twice, then say it again from memory

---

## Morning (8:00 – 11:00 AM) — CSS Questions 1-20

### Box Model, Positioning, Flexbox, Grid (1-12)

**"Explain the CSS box model."**
> Every element is a rectangular box with four layers: content (the actual text/image), padding (space inside the border), border (the border itself), and margin (space outside the border). By default, `width` sets the content width only — padding and border add to the total size. With `box-sizing: border-box`, `width` includes padding and border. Always set `box-sizing: border-box` globally.

**"What is the difference between `position: relative`, `absolute`, `fixed`, and `sticky`?"**
> - `relative`: positioned relative to its normal flow position. Doesn't remove it from flow. Used as an anchor for absolutely positioned children.
> - `absolute`: removed from normal flow. Positioned relative to the nearest ancestor with `position` set (not `static`). If none, relative to the viewport.
> - `fixed`: removed from flow. Positioned relative to the viewport — stays in place when scrolling. Used for sticky headers/navbars.
> - `sticky`: hybrid. Acts like `relative` until it reaches a scroll threshold, then acts like `fixed`. Used for headers that stick after scrolling past them.

**"What is the difference between Flexbox and Grid?"**
> Flexbox is one-dimensional — it arranges items in a row or column. Grid is two-dimensional — it arranges items in rows AND columns simultaneously. Use Flexbox for components (navbar items, button groups, card content). Use Grid for layouts (page structure, image galleries, dashboard widgets).

**"How does `z-index` work?"**
> `z-index` controls stacking order — higher value = on top. It only works on elements with `position` set to `relative`, `absolute`, `fixed`, or `sticky`. Elements with `position: static` (the default) ignore `z-index`. Stacking contexts are created by positioned elements with `z-index`, so child elements can't escape their parent's stacking context.

### Specificity, Cascade, Selectors (13-20)

**"How does CSS specificity work?"**
> Specificity determines which CSS rule wins when multiple rules target the same element. Calculate it as a 3-part score: (ID count, class/attribute/pseudo-class count, element/pseudo-element count). `#nav .link a` = (1, 1, 1). Higher specificity wins regardless of source order. `!important` overrides all specificity — avoid it, it makes debugging a nightmare.

**"What is the difference between `em`, `rem`, `px`, `vw`, `vh`?"**
> - `px`: absolute unit, fixed size
> - `em`: relative to the element's own font-size (or parent's, for font-size). Compounds if nested.
> - `rem`: relative to the root element's font-size. Consistent and predictable. Preferred for spacing and font sizes.
> - `vw`/`vh`: percentage of the viewport width/height. `100vw` = full viewport width. Useful for full-screen sections.

---

## Midday (11:20 AM – 1:30 PM) — HTML Questions 21-30 + System Design 1-3

### HTML Questions (21-30)

**"What is semantic HTML?"**
> Using HTML elements that describe their meaning, not just their appearance. `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<main>`, `<aside>` instead of `<div>` everywhere. Benefits: better accessibility (screen readers understand the structure), better SEO (search engines understand the content), more maintainable code.

**"What is the difference between `localStorage`, `sessionStorage`, and cookies?"**
> - `localStorage`: persists across sessions, no expiry, ~5MB, JS only, same origin
> - `sessionStorage`: cleared when the tab closes, ~5MB, JS only, same tab
> - Cookies: sent with every HTTP request, can be set with expiry, ~4KB, accessible by server. Use cookies for auth tokens (with `HttpOnly` to prevent XSS). Use localStorage for user preferences.

**"What are `data-*` attributes?"**
> Custom HTML attributes for storing extra data on elements. `<div data-user-id="123">`. Access with `element.dataset.userId` in JS. Useful for passing data to JS without visible attributes or hidden inputs. Don't store sensitive data in them — they're visible in HTML.

### System Design Questions 1-3

Walk through each question aloud using this structure: **Requirements → High-level design → Key components → Trade-offs**

**"How would you design an autocomplete search input?"**
> Requirements: fast suggestions, debounced, handles empty/loading/error states. Design: user types → debounce 300ms → fetch suggestions from API → display in dropdown → keyboard navigation (up/down/enter). Key concerns: debounce prevents excess requests, cache previous queries to avoid re-fetching, abort in-flight requests on new keystroke (AbortController), accessibility (aria-expanded, aria-activedescendant).

**"How would you design an infinite scroll feed?"**
> Requirements: load items as user scrolls, no jank, handle errors. Design: Intersection Observer watches a sentinel element at the bottom of the list → triggers fetch when visible → appends items. Key concerns: virtual scrolling for very large lists (only render visible items), loading skeleton during fetch, error state with retry button, deduplication if the same item appears in multiple pages.

**"How would you design a real-time notification system?"**
> Options: polling (simple, wasteful), WebSocket (bi-directional, persistent connection), Server-Sent Events (one-way server push, simpler than WebSocket, auto-reconnects). For most notification systems: SSE is sufficient and simpler. Connect on login, display toast/badge on new event, reconnect automatically on disconnect.

---

## Afternoon (1:30 – 3:30 PM) — System Design 4-5 + DSA

### System Design Questions 4-5

**"How would you design a file upload component?"**
> Requirements: single/multi-file, progress, validation, error handling. Design: `<input type="file">` triggers file selection → validate (type, size) → FormData → XMLHttpRequest (for progress events) or fetch. Show: progress bar per file, success state, error message, cancel button. Drag-and-drop: `dragover` + `drop` events on a div, call `e.preventDefault()`, extract `e.dataTransfer.files`.

**"How would you make a slow page faster?"**
> Diagnosis first: Chrome DevTools Performance tab, Lighthouse. Then: code-split with `React.lazy` (smaller initial bundle), lazy-load images (`loading="lazy"`), optimize images (WebP, correct size), remove unused dependencies, memoize expensive renders (`useMemo`/`React.memo`), move heavy computation to a Web Worker, add caching headers. Measure before and after every change.

### DSA (3 Problems)

Create `day-78-dsa.js`. Focus on array/string patterns — these come up most in frontend interviews.

---

## End of Day Checklist

- [ ] Opened `interview-vault/03-css-html-interview.md`
- [ ] Questions 1-20: CSS — box model, positioning, flexbox, grid, specificity
- [ ] Questions 21-30: HTML — semantic, storage, data attributes
- [ ] Opened `interview-vault/05-system-design.md`
- [ ] System design 1-5: walked through aloud with requirements → design → trade-offs
- [ ] All ❌ questions: re-read and said out loud
- [ ] 3 DSA problems solved in `day-78-dsa.js`

---

*System design answers that are vague lose points. Be specific: name the API, name the event, name the trade-off.*
