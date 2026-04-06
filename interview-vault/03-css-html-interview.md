# CSS & HTML Interview Questions — 30 Questions with Detailed Answers

> **How to use this guide:**
> - `🟢 EASY` `🟡 MEDIUM` `🔴 HARD` — calibrate your depth of answer
> - `🔥 VERY COMMON` `📌 COMMON` `💡 RARE` — prioritize your prep time
> - Read the **Interview Tip** on every question — these are the differentiators
> - Work through the examples in your browser's DevTools

---

## Table of Contents

1. [Box Model & Layout](#1-box-model--layout) — 6 questions
2. [Flexbox & Grid](#2-flexbox--grid) — 6 questions
3. [Responsive Design](#3-responsive-design) — 4 questions
4. [Specificity & Cascade](#4-specificity--cascade) — 4 questions
5. [Semantic HTML](#5-semantic-html) — 3 questions
6. [Accessibility](#6-accessibility) — 4 questions
7. [Animations & Transitions](#7-animations--transitions) — 3 questions

---

## 1. Box Model & Layout

---

### Q1. Explain the CSS box model and the difference between `content-box` and `border-box`.

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

Every HTML element is a rectangular box composed of four layers (outside in):

```
┌─────────────────────── margin ──────────────────────────┐
│  ┌──────────────────── border ───────────────────────┐  │
│  │  ┌─────────────── padding ─────────────────────┐  │  │
│  │  │  ┌────────────── content ───────────────┐   │  │  │
│  │  │  │         width × height               │   │  │  │
│  │  │  └──────────────────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**`box-sizing: content-box` (default):**
- `width` / `height` apply to the **content area only**
- Total rendered width = width + padding-left + padding-right + border-left + border-right

**`box-sizing: border-box`:**
- `width` / `height` include padding and border
- Content area shrinks to accommodate them
- Total rendered width = `width` (exactly what you set)

```css
/* content-box — width 200px, but renders at 240px */
.box-content {
  box-sizing: content-box;
  width: 200px;
  padding: 10px;   /* adds 20px */
  border: 5px solid; /* adds 10px */
  /* total: 230px rendered */
}

/* border-box — width 200px, renders at exactly 200px */
.box-border {
  box-sizing: border-box;
  width: 200px;
  padding: 10px;
  border: 5px solid;
  /* content area: 200 - 20 - 10 = 170px */
}

/* Universal reset — the standard approach */
*, *::before, *::after {
  box-sizing: border-box;
}
```

> **Interview Tip:** Always use `border-box` universally. It makes sizing predictable — `width: 50%` means exactly half the parent, regardless of padding. Every modern CSS framework (Tailwind, Bootstrap) uses this reset.

---

### Q2. What is the difference between `display: block`, `inline`, and `inline-block`?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

| Property | Width | Height | Top/Bottom Margin | Starts on new line |
|---|---|---|---|---|
| `block` | Full parent width | Set by content or CSS | Respected | Yes |
| `inline` | Content width | Content height | **Ignored** | No |
| `inline-block` | Content width (settable) | Settable | Respected | No |

```css
/* Block — like <div>, <p>, <h1> */
.block {
  display: block;
  width: 200px;     /* works */
  height: 100px;    /* works */
  margin: 20px 0;   /* vertical margin works */
}

/* Inline — like <span>, <a>, <strong> */
.inline {
  display: inline;
  width: 200px;     /* IGNORED */
  height: 100px;    /* IGNORED */
  margin: 20px 0;   /* IGNORED — horizontal margin only */
}

/* Inline-block — best of both: flows inline, accepts box model */
.inline-block {
  display: inline-block;
  width: 200px;     /* works */
  height: 100px;    /* works */
  margin: 20px;     /* works */
  /* Does NOT start on a new line */
}
```

```html
<!-- Visual example -->
<span class="inline-block" style="width:100px;height:50px;background:red;">A</span>
<span class="inline-block" style="width:100px;height:50px;background:blue;">B</span>
<!-- A and B sit side by side, both 100×50px -->
```

> **Interview Tip:** `inline-block` is great for navigation items and icon-badge combinations. The main gotcha: whitespace between inline-block elements renders as a small gap in HTML. Common fix: `font-size: 0` on parent or Flexbox instead.

---

### Q3. How does margin collapsing work?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Adjacent **vertical margins** of block elements merge (collapse) into a single margin — the larger of the two. This only happens vertically, never horizontally, and only between block elements in normal flow.

**Case 1 — Adjacent siblings:**
```css
.top    { margin-bottom: 30px; }
.bottom { margin-top: 20px; }
/* Space between them: 30px (not 50px) */
```

**Case 2 — Parent and first/last child:**
```css
.parent { margin-top: 40px; }
.child  { margin-top: 20px; }
/* Parent's margin-top becomes 40px — child's margin bleeds through */
```

**Preventing collapse:**
```css
/* Any of these stop parent-child collapse: */
.parent {
  padding-top: 1px;     /* creates barrier */
  border-top: 1px solid transparent; /* creates barrier */
  overflow: hidden;     /* establishes BFC */
  display: flex;        /* establishes BFC */
  display: grid;
}
```

**Margins never collapse when:**
- Element has `padding`, `border`, or `overflow` (not visible)
- Element is `flex` or `grid` child
- Element is positioned (`absolute`, `fixed`)
- Horizontal margins

> **Interview Tip:** Margin collapsing is the source of many "why is there a gap here?" bugs. The fix is almost always "establish a Block Formatting Context on the parent" (overflow, flex, grid). Knowing BFC is the underlying concept here.

---

### Q4. What is a Block Formatting Context (BFC) and when does it matter?

**🟡 MEDIUM** | **💡 RARE**

#### Concept

A Block Formatting Context (BFC) is an independent layout region where:
- Internal floats don't interact with outside floats
- External margins don't collapse with internal margins
- The BFC expands to contain its float children

**BFC is created by:**
```css
.bfc {
  overflow: hidden;   /* or auto, scroll (not visible) */
  display: flex;
  display: grid;
  display: table;
  position: absolute;
  position: fixed;
  float: left;        /* (the element itself becomes a BFC) */
  contain: layout;    /* modern approach */
  display: flow-root; /* cleanest modern approach — creates BFC, no side effects */
}
```

**Use cases:**

```css
/* 1. Contain floats (classic clearfix alternative) */
.gallery {
  display: flow-root; /* expands to wrap all floated images inside */
}

/* 2. Prevent margin collapse */
.card {
  overflow: hidden; /* child margins don't escape */
}

/* 3. Stop float wrapping */
.sidebar { float: left; width: 200px; }
.content {
  display: flow-root; /* content box doesn't flow under sidebar */
}
```

> **Interview Tip:** `display: flow-root` is the cleanest modern way to establish a BFC — unlike `overflow: hidden`, it has no visual side effects. Knowing BFC explains margin collapse, float clearfix, and float wrapping in one mental model.

---

### Q5. What is the difference between `position: relative`, `absolute`, `fixed`, and `sticky`?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

| Value | Positioning context | Space in flow | Scroll behavior |
|---|---|---|---|
| `static` | N/A (default) | Yes | Scrolls |
| `relative` | Its normal position | Yes (holds space) | Scrolls |
| `absolute` | Nearest positioned ancestor | No | Scrolls with ancestor |
| `fixed` | Viewport | No | Stays fixed on screen |
| `sticky` | Scroll container | Yes | Scrolls until threshold |

```css
/* relative — offset from where it would normally be */
.badge {
  position: relative;
  top: -4px; /* nudges up 4px, original space preserved */
}

/* absolute — positioned relative to nearest ancestor with position != static */
.card {
  position: relative; /* establishes positioning context */
}
.card .dismiss-button {
  position: absolute;
  top: 8px;
  right: 8px; /* top-right corner of .card */
}

/* fixed — relative to viewport, stays on screen while scrolling */
.sticky-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
}

/* sticky — scrolls normally, then "sticks" at threshold */
.table-header th {
  position: sticky;
  top: 0; /* sticks 0px from top of scroll container */
  background: white;
  z-index: 1;
}
```

> **Interview Tip:** The most common gotcha: `position: absolute` climbs the DOM tree looking for the first ancestor with `position` not `static`. If none exists, it positions relative to the `<html>` element. Always set `position: relative` on the intended container.

---

### Q6. Explain stacking contexts and z-index.

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

`z-index` only works on **positioned elements** (`position` not `static`) or flex/grid children. Each stacking context is painted as a unit — child elements can't escape their parent's stacking order.

**A new stacking context is created by:**
```css
/* Common stacking context triggers */
.stacking-context {
  position: relative; z-index: anything-not-auto;
  position: absolute/fixed/sticky;
  opacity: < 1;
  transform: anything;
  filter: anything;
  will-change: transform; /* or opacity, filter */
  isolation: isolate; /* explicit, cleanest way */
}
```

```css
/* Classic z-index trap */
.modal-overlay {
  position: fixed;
  z-index: 9999;
}

.card {
  transform: translateZ(0); /* creates new stacking context! */
}
.card .tooltip {
  position: absolute;
  z-index: 9999; /* BUT this 9999 is scoped inside .card's context */
  /* Tooltip is trapped behind .modal-overlay even though z-index is equal */
}
```

**Fix with `isolation: isolate`:**
```css
/* Explicitly create a stacking context for component scoping */
.card {
  isolation: isolate; /* contains child z-indexes without side effects */
}
```

> **Interview Tip:** "My z-index isn't working" is almost always a stacking context issue. The fix is to either move the element out of the stacking context, or raise the z-index of the stacking context ancestor. `isolation: isolate` is the modern tool for intentional scoping.

---

## 2. Flexbox & Grid

---

### Q7. Explain the Flexbox model — main axis, cross axis, and key properties.

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

Flexbox is a one-dimensional layout model. It distributes space along a **main axis** (default: horizontal) with alignment control on the **cross axis** (perpendicular).

```css
.container {
  display: flex;
  flex-direction: row;       /* main axis: left→right (default) */
  /* row-reverse | column | column-reverse */

  justify-content: center;   /* main axis alignment */
  /* flex-start | flex-end | center | space-between | space-around | space-evenly */

  align-items: stretch;      /* cross axis alignment (single line) */
  /* flex-start | flex-end | center | baseline | stretch */

  flex-wrap: nowrap;         /* wrap | nowrap | wrap-reverse */
  gap: 16px;                 /* space between items (not margins) */
}

.item {
  flex-grow: 0;    /* how much to grow relative to siblings */
  flex-shrink: 1;  /* how much to shrink if needed */
  flex-basis: auto; /* initial size before grow/shrink */

  /* Shorthand: flex: grow shrink basis */
  flex: 1;         /* shorthand for flex: 1 1 0% — grow evenly */
  flex: 0 0 200px; /* fixed 200px, never grow or shrink */

  align-self: auto; /* override container's align-items for this item */
  order: 0;         /* visual order without changing DOM */
}
```

**Common patterns:**
```css
/* Center anything */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Equal-width columns */
.cols > * { flex: 1; }

/* Sidebar layout */
.layout { display: flex; }
.sidebar { flex: 0 0 250px; }   /* fixed width */
.main    { flex: 1; }            /* takes remaining space */
```

> **Interview Tip:** Know the difference between `align-items` (single line) and `align-content` (multiple lines when wrapping). `flex: 1` is shorthand for `flex: 1 1 0%` — the `0%` basis means items start from zero and grow equally, unlike `flex: 1 1 auto` which grows proportionally to content size.

---

### Q8. Explain CSS Grid and when to use it vs Flexbox.

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

Grid is a **two-dimensional** layout system — rows and columns simultaneously. Flexbox is one-dimensional (either rows or columns).

```css
.grid {
  display: grid;

  /* Define columns */
  grid-template-columns: 250px 1fr 1fr;      /* fixed + flexible */
  grid-template-columns: repeat(3, 1fr);      /* 3 equal columns */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* responsive */

  /* Define rows */
  grid-template-rows: auto 1fr auto;          /* header / content / footer */

  gap: 16px;        /* row and column gap */
  row-gap: 8px;
  column-gap: 16px;
}

/* Placing items */
.header  { grid-column: 1 / -1; }  /* span all columns (1 to last) */
.sidebar { grid-row: 2 / 4; }      /* span rows 2 and 3 */

/* Named areas — best for page layout */
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 60px 1fr 40px;
}
.header { grid-area: header; }
.nav    { grid-area: nav; }
.main   { grid-area: main; }
.aside  { grid-area: aside; }
.footer { grid-area: footer; }
```

**Flexbox vs Grid:**
| Use Flexbox when | Use Grid when |
|---|---|
| One-dimensional (nav items, button groups) | Two-dimensional (page layout, card grids) |
| Content size drives layout | You define the layout, content fills in |
| Order items along one axis | Precise placement across rows and columns |

> **Interview Tip:** The "content out vs layout in" distinction is the key: Flexbox lets content drive the layout; Grid lets you define the layout first. You can — and often should — nest them: Grid for overall page layout, Flexbox inside each Grid area.

---

### Q9. What is the difference between `align-items` and `align-content` in Flexbox?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

| Property | Applies to | What it aligns |
|---|---|---|
| `align-items` | Container | Items within a **single line** (cross-axis) |
| `align-content` | Container | **Multiple lines** when `flex-wrap: wrap` |

```css
/* align-items — controls cross-axis alignment within each row */
.container {
  display: flex;
  flex-wrap: wrap;
  height: 300px;
  align-items: center; /* items centered within their individual row */
}

/* align-content — controls spacing between the rows themselves */
.container {
  display: flex;
  flex-wrap: wrap;
  height: 300px;
  align-content: space-between; /* rows spread to top and bottom */
}
```

```
align-items: center (2 rows)     align-content: space-between (2 rows)
┌─────────────────────────┐      ┌─────────────────────────┐
│   [A] [B] [C]           │      │ [A] [B] [C]             │
│                         │      │                         │
│   [D] [E]               │      │                         │
└─────────────────────────┘      │ [D] [E]                 │
Items centered within rows       └─────────────────────────┘
                                 Rows pushed to top/bottom
```

> **Interview Tip:** `align-content` has no effect when there's only one row (no wrapping). This is a common source of confusion. A quick mental test: if `flex-wrap: nowrap`, `align-content` does nothing.

---

### Q10. Explain `fr` units and `minmax()` in CSS Grid.

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

`fr` (fraction unit) represents a fraction of the **available space** in the grid container after fixed sizes are allocated.

```css
.grid {
  /* 1fr 2fr 1fr: 25% | 50% | 25% of available space */
  grid-template-columns: 1fr 2fr 1fr;

  /* 200px sidebar, then equal columns for the rest */
  grid-template-columns: 200px 1fr 1fr;
}
```

**`minmax(min, max)`** — sets a size range for a track:
```css
.grid {
  /* Each column: at least 200px, at most 1fr */
  grid-template-columns: repeat(3, minmax(200px, 1fr));

  /* The responsive holy grail — as many columns as fit at ≥200px */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  /* auto-fit collapses empty tracks; auto-fill keeps them */
}
```

**`auto-fill` vs `auto-fit`:**
```css
/* 3 items, 600px container, minmax(150px, 1fr) */

/* auto-fill: creates as many tracks as fit — items don't stretch to fill gaps */
grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
/* → 4 tracks created, items in first 3, empty 4th track stays */

/* auto-fit: collapses empty tracks — items stretch to fill */
grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
/* → 3 tracks, each item fills 1/3 */
```

> **Interview Tip:** `repeat(auto-fill, minmax(200px, 1fr))` is the "no media query needed" responsive grid. Mention it when asked about responsive design — it adapts from 1 to N columns automatically based on container width.

---

### Q11. How do you create a sticky footer layout?

**🟢 EASY** | **📌 COMMON**

#### Concept

A sticky footer stays at the bottom of the viewport when content is short, and is pushed down by content when it's long.

```css
/* Method 1 — Flexbox (most common) */
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex: 1; /* grows to fill available space, pushing footer down */
}
footer {
  flex-shrink: 0;
}

/* Method 2 — Grid */
body {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
/* header: auto, main: 1fr (fills space), footer: auto */

/* Method 3 — Modern: min-height with dvh for mobile */
body {
  display: flex;
  flex-direction: column;
  min-height: 100dvh; /* dynamic viewport height — accounts for mobile browser chrome */
}
main { flex: 1; }
```

> **Interview Tip:** Use `100dvh` instead of `100vh` on mobile — `100vh` on iOS Safari includes the browser chrome height, causing overflow. `dvh` (dynamic viewport height) adjusts as the browser chrome shows/hides.

---

### Q12. What is subgrid and why is it useful?

**🟡 MEDIUM** | **💡 RARE**

#### Concept

`subgrid` lets a nested grid element participate in its parent grid's tracks instead of creating its own.

```css
/* Without subgrid — inner grids don't align with outer grid */
.outer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.card {
  display: grid;
  grid-template-rows: auto 1fr auto; /* card's OWN rows — unrelated to neighbors */
}

/* With subgrid — card rows align across all cards */
.outer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto; /* title, body, footer */
  gap: 16px;
}
.card {
  display: grid;
  grid-row: span 3;           /* occupies 3 rows of parent */
  grid-template-rows: subgrid; /* participates in parent's row tracks */
}
/* Now card title, body, and footer align across all 3 cards */
```

> **Interview Tip:** Subgrid solves the "card with aligned headers and footers" problem without JavaScript height equalization. Browser support is now good (Chrome 117+, Firefox 71+, Safari 16+). It's a differentiator question — mentioning it shows deep CSS knowledge.

---

## 3. Responsive Design

---

### Q13. What is mobile-first design and why is it preferred?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

Mobile-first means writing base CSS for the smallest viewport and using `min-width` media queries to add complexity for larger screens.

```css
/* Mobile-first (preferred) — base styles for mobile */
.nav {
  display: flex;
  flex-direction: column; /* stacked on mobile */
  gap: 8px;
}

/* Add tablet layout */
@media (min-width: 768px) {
  .nav {
    flex-direction: row; /* horizontal on tablet+ */
    gap: 24px;
  }
}

/* Add desktop layout */
@media (min-width: 1024px) {
  .nav {
    gap: 40px;
    justify-content: flex-end;
  }
}

/* Desktop-first (avoid) — starts complex, strips down */
.nav {
  display: flex;
  flex-direction: row;
}
@media (max-width: 767px) {   /* max-width: fighting against base */
  .nav { flex-direction: column; }
}
```

**Why mobile-first wins:**
1. **Progressive enhancement** — start with what works everywhere, add features for capable devices
2. **Performance** — mobile gets minimal CSS (no unused rules to parse)
3. **Forces prioritization** — makes you decide what content is essential
4. **Aligns with how CSS cascade works** — `min-width` queries are additive

> **Interview Tip:** Tailwind enforces mobile-first — unprefixed classes apply to all sizes, `md:` applies from 768px up. If asked to contrast with "desktop-first," mention the cognitive load of fighting `max-width` queries and specificity wars.

---

### Q14. What are CSS custom properties (variables) and how do they enable theming?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

CSS custom properties are variables defined with `--` prefix and consumed with `var()`. They cascade and can be overridden at any scope, making them ideal for theming.

```css
/* Define on :root — global scope */
:root {
  --color-primary: #3b82f6;
  --color-text: #1a1a1a;
  --color-bg: #ffffff;
  --font-size-base: 16px;
  --radius: 8px;
  --shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Dark theme — override on [data-theme="dark"] */
[data-theme="dark"] {
  --color-text: #f5f5f5;
  --color-bg: #1a1a1a;
  --shadow: 0 2px 8px rgba(0,0,0,0.4);
  /* --color-primary stays the same — only override what changes */
}

/* Consume everywhere */
.card {
  background: var(--color-bg);
  color: var(--color-text);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.button-primary {
  background: var(--color-primary);
  /* Fallback value */
  padding: var(--spacing-md, 12px); /* 12px if --spacing-md not defined */
}
```

```js
// Toggle theme with JS
document.documentElement.dataset.theme = 'dark';

// Read/write from JS
const primary = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary');

document.documentElement.style.setProperty('--color-primary', '#10b981');
```

> **Interview Tip:** CSS variables live-update — change them in JS and every consumer re-renders instantly, no class toggling needed. Contrast with Sass variables which are compiled away — they can't be changed at runtime.

---

### Q15. Explain responsive images — srcset, sizes, and `<picture>`.

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Serving appropriately sized images for each device saves bandwidth and improves performance.

```html
<!-- srcset with w descriptors — browser picks best size -->
<img
  src="hero-800.jpg"
  srcset="
    hero-400.jpg  400w,
    hero-800.jpg  800w,
    hero-1600.jpg 1600w
  "
  sizes="
    (max-width: 600px) 100vw,
    (max-width: 1200px) 50vw,
    800px
  "
  alt="Hero image"
  loading="lazy"
/>
<!-- Browser calculates: on 375px screen, image = 100vw = 375px
     Picks 400w image (closest >= 375 × device pixel ratio) -->

<!-- srcset with x descriptors — for fixed-size images at different DPRs -->
<img
  src="logo.png"
  srcset="logo.png 1x, logo@2x.png 2x, logo@3x.png 3x"
  alt="Logo"
  width="120" height="40"
/>

<!-- <picture> — art direction (different crops, not just sizes) -->
<picture>
  <!-- Portrait crop for mobile -->
  <source
    media="(max-width: 768px)"
    srcset="hero-portrait-400.webp 400w, hero-portrait-800.webp 800w"
    type="image/webp"
  />
  <!-- Landscape crop for desktop -->
  <source
    media="(min-width: 769px)"
    srcset="hero-landscape-800.webp 800w, hero-landscape-1600.webp 1600w"
    type="image/webp"
  />
  <!-- Fallback -->
  <img src="hero-landscape-800.jpg" alt="Hero" />
</picture>
```

> **Interview Tip:** `sizes` is a hint to the browser about how wide the image will be displayed — the browser uses it with `srcset` widths to pick the best image before downloading. Always include `width` and `height` attributes to prevent layout shift (CLS).

---

### Q16. What are container queries and how do they differ from media queries?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Media queries respond to the **viewport** size. Container queries respond to the **container element's** size — enabling truly reusable, context-aware components.

```css
/* Container query — component adapts to its container, not the viewport */
.card-container {
  container-type: inline-size; /* declare as a container */
  container-name: card;        /* optional name */
}

/* Style the card based on its container width */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 150px 1fr;
  }
}

@container card (max-width: 399px) {
  .card {
    display: flex;
    flex-direction: column;
  }
}
```

```html
<!-- Same component, different layouts based on where it's placed -->
<div class="card-container" style="width: 300px"> <!-- narrow → stacked -->
  <article class="card">...</article>
</div>

<div class="card-container" style="width: 600px"> <!-- wide → side-by-side -->
  <article class="card">...</article>
</div>
```

**Why it matters:**
- A card in a narrow sidebar and a wide main column can have different layouts
- Without container queries, you'd need viewport media queries, but those can't know where the component is placed

> **Interview Tip:** Container queries are supported in all modern browsers since 2023. They're a game-changer for design systems — components become truly self-contained without needing context about their page location.

---

## 4. Specificity & Cascade

---

### Q17. How is CSS specificity calculated?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

Specificity is a weight that determines which CSS rule wins when multiple rules target the same element. Calculated as a three-part score: `(A, B, C)`.

| Selector type | A | B | C |
|---|---|---|---|
| Inline styles (`style=""`) | 1 | 0 | 0 |
| IDs (`#nav`) | 0 | 1 | 0 |
| Classes, attributes, pseudo-classes | 0 | 0 | 1 |
| Elements, pseudo-elements | 0 | 0 | 1? |

Wait — let's be precise:

| | Score |
|---|---|
| Inline `style=""` | 1,0,0 |
| `#id` | 0,1,0 |
| `.class`, `[attr]`, `:hover` | 0,0,1 |
| `div`, `p`, `::before` | 0,0,1 |
| `*`, combinators (`+`, `~`, `>`) | 0 |
| `:is()`, `:not()`, `:has()` | specificity of their argument |

```css
p              { color: black; }  /* 0,0,1 */
.text          { color: blue; }   /* 0,0,1 — wins over p (same A,B; but declared later) */
p.text         { color: green; }  /* 0,0,2 — wins over .text */
#main p.text   { color: red; }    /* 0,1,2 — wins over p.text */
style="..."    /* 1,0,0 — wins over everything except !important */
.text !important { color: purple; } /* wins over inline styles too */
```

> **Interview Tip:** Think of it as a three-digit number where carrying never happens — `0,1,0` always beats `0,0,99`. Avoid `!important` except for utility classes (Tailwind uses it for this reason) and forced browser overrides.

---

### Q18. Explain the CSS cascade — what factors determine which style wins?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

When multiple rules apply to the same element and property, the cascade resolves conflicts in this order (highest priority first):

1. **Origin and importance**
   - User-agent `!important`
   - User `!important`
   - Author `!important` ← most common developer concern
   - Author normal
   - User normal
   - User-agent (browser default)

2. **Specificity** (within the same origin/importance level)

3. **Source order** (later declarations win when specificity is equal)

```css
/* Same specificity — source order wins */
.btn { background: blue; }
.btn { background: green; } /* wins — declared later */

/* Higher specificity wins regardless of source order */
.btn { background: blue; }
#submit-btn { background: green; } /* wins — ID beats class */
.btn { background: red !important; } /* wins — !important beats ID */
```

**`@layer` — new cascade control:**
```css
/* Define layer order — later layers have lower priority */
@layer base, components, utilities;

@layer base {
  .btn { background: blue; } /* low priority */
}
@layer utilities {
  .bg-red { background: red; } /* high priority — wins over base */
}
```

> **Interview Tip:** `@layer` is a modern tool for managing third-party styles. Putting a UI library in `@layer base` means your app styles always win without needing higher specificity or `!important`. This is how Tailwind v4 works internally.

---

### Q19. What is the difference between inheritance and the cascade?

**🟢 EASY** | **📌 COMMON**

#### Concept

**Cascade** — determines which rule wins when multiple rules target the same element.

**Inheritance** — some CSS properties automatically pass their value from a parent to children.

```css
/* Inherited properties — pass down automatically */
/* font-family, font-size, color, line-height, text-align, list-style, etc. */

body {
  font-family: 'Inter', sans-serif; /* all descendants inherit this */
  color: #333;
}
/* <p>, <span>, <li>, etc. all get font-family and color for free */

/* Non-inherited properties — do NOT pass down */
/* border, padding, margin, background, width, display, position, etc. */

.card { border: 1px solid #ccc; } /* children do NOT get a border */
```

**`inherit`, `initial`, `unset`, `revert`:**
```css
.reset-link {
  color: inherit;  /* explicitly inherit from parent (overrides browser default blue) */
  text-decoration: inherit;
}

.fresh-start {
  all: unset;     /* reset all properties to their inherited or initial values */
}

.browser-default {
  all: revert;    /* restore browser's user-agent stylesheet values */
}
```

> **Interview Tip:** When explaining why CSS text styling "just works" on nested elements, that's inheritance. When explaining why a rule was overridden by a more specific rule, that's the cascade. They're often confused but are distinct mechanisms.

---

### Q20. What are CSS pseudo-classes and pseudo-elements?

**🟢 EASY** | **📌 COMMON**

#### Concept

**Pseudo-classes** (`:`) — select elements based on state or position. They add to specificity as a class (0,0,1):

```css
a:hover   { color: blue; }      /* user interaction */
a:visited { color: purple; }
input:focus { outline: 2px solid blue; }
input:invalid { border-color: red; }

li:first-child  { font-weight: bold; }
li:last-child   { border-bottom: none; }
li:nth-child(2n) { background: #f5f5f5; } /* even rows */
li:nth-child(3n+1) { color: red; }         /* every 3rd, starting at 1 */

:is(h1, h2, h3) { font-family: serif; }   /* matches any of the selectors */
:where(h1, h2)  { margin: 0; }            /* same but zero specificity */
:not(.disabled) { cursor: pointer; }
:has(img)       { padding: 0; }           /* parent with img child */
```

**Pseudo-elements** (`::`) — create virtual elements that don't exist in HTML. They add specificity as an element (0,0,1):

```css
p::first-line   { font-weight: bold; }
p::first-letter { font-size: 2em; float: left; }

/* ::before and ::after — generated content */
.required::after {
  content: ' *';
  color: red;
}

.external-link::after {
  content: ' ↗';
}

/* Custom checkbox using ::before */
.checkbox input:checked + label::before {
  content: '✓';
  background: #3b82f6;
  color: white;
}
```

> **Interview Tip:** Modern CSS selectors `:is()`, `:has()`, `:where()` are game-changers. `:has()` is the "parent selector" developers wanted for years — `.card:has(img)` selects cards containing an image. `:where()` is like `:is()` but contributes zero specificity, making it great for base styles.

---

## 5. Semantic HTML

---

### Q21. What is semantic HTML and why does it matter?

**🟢 EASY** | **🔥 VERY COMMON**

#### Concept

Semantic HTML uses elements that describe the **meaning and purpose** of content, not just its appearance.

```html
<!-- Non-semantic — everything is a div -->
<div class="header">
  <div class="nav">
    <div class="nav-item"><a href="/">Home</a></div>
  </div>
</div>
<div class="main">
  <div class="article">
    <div class="article-title">My Post</div>
    <div class="article-body">Content...</div>
  </div>
</div>
<div class="footer">© 2024</div>

<!-- Semantic — each element conveys meaning -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>My Post</h1>
    <p>Content...</p>
  </article>
</main>
<footer>
  <p>© 2024</p>
</footer>
```

**Why it matters:**

1. **Accessibility** — screen readers announce `<nav>` as "navigation landmark," `<main>` as "main content." Assistive technology users can jump between landmarks.
2. **SEO** — search engines understand page structure. `<article>` signals content worth indexing; `<h1>–<h6>` signals hierarchy.
3. **Maintainability** — self-documenting markup
4. **Default styles/behaviors** — `<button>` is keyboard-focusable and fires click on Enter/Space. `<a>` is part of the tab order. `<input>` works with forms.

> **Interview Tip:** The key insight is: don't use an element for how it looks — use it for what it means. Then style it. A `<nav>` with `list-style: none` is better than a `<div>` styled to look like navigation.

---

### Q22. When should you use `<section>` vs `<article>` vs `<div>`?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

| Element | Use when |
|---|---|
| `<article>` | Self-contained, independently distributable content (blog post, news article, forum post, product card, tweet) |
| `<section>` | Thematic grouping with a heading; part of a larger whole (chapter, tabbed content, "About Us" section) |
| `<div>` | No semantic meaning — purely for styling or scripting grouping |

**Decision tree:**
```
Could this content be syndicated as-is (RSS, email)? → <article>
Is it a named section of the page with a heading?    → <section>
Is it just a styling/scripting container?            → <div>
```

```html
<!-- Article — self-contained blog post -->
<article>
  <header>
    <h2>Understanding CSS Grid</h2>
    <time datetime="2024-01-15">January 15, 2024</time>
  </header>
  <p>CSS Grid is a two-dimensional layout system...</p>
  <footer>
    <address>By <a rel="author" href="/authors/jane">Jane Doe</a></address>
  </footer>
</article>

<!-- Section — thematic grouping -->
<section aria-labelledby="skills-heading">
  <h2 id="skills-heading">Skills</h2>
  <ul>...</ul>
</section>

<!-- Articles nested in a section -->
<section>
  <h2>Latest Posts</h2>
  <article>...</article>
  <article>...</article>
</section>
```

> **Interview Tip:** `<section>` should almost always have a heading. If it doesn't, reconsider whether `<div>` is more appropriate. `<article>` can contain `<section>` elements (a long article split into sections) and vice versa.

---

### Q23. What HTML elements should you use for a navigation menu and why?

**🟢 EASY** | **📌 COMMON**

#### Concept

```html
<!-- Correct semantic structure -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/about">About</a></li>
    <li>
      <button aria-expanded="false" aria-haspopup="true">
        Products
      </button>
      <ul>
        <li><a href="/products/web">Web Apps</a></li>
        <li><a href="/products/mobile">Mobile</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

**Why each element:**
- `<nav>` — landmark role, screen readers announce "navigation"
- `<ul>` + `<li>` — a list of items; screen readers announce "list of N items"
- `<a>` — links for navigation (supports `href`, keyboard nav, right-click → open in tab)
- `<button>` for dropdown triggers — not `<a href="#">`, not `<div onClick>`
- `aria-current="page"` — tells screen readers which link is the current page
- `aria-label="Main navigation"` — distinguishes from footer nav if multiple `<nav>` exist

> **Interview Tip:** A common mistake is using `<div>` with `onClick` for navigation. `<a>` gives you keyboard focus, right-click menus, browser history, and `aria-current` for free. `<button>` for dropdown triggers gives keyboard activation and ARIA state.

---

## 6. Accessibility

---

### Q24. What is ARIA and when should you use it?

**🟡 MEDIUM** | **🔥 VERY COMMON**

#### Concept

ARIA (Accessible Rich Internet Applications) is a set of attributes that add semantic meaning to HTML for assistive technologies.

**The first rule of ARIA: don't use ARIA if you can use native HTML.**

```html
<!-- Native HTML — always prefer this -->
<button>Submit</button>                         <!-- role="button" for free -->
<input type="checkbox" />                       <!-- role="checkbox" for free -->
<nav>, <main>, <header>, <footer>               <!-- landmark roles for free -->

<!-- ARIA — only when native HTML can't express it -->

<!-- Custom interactive widget -->
<div
  role="slider"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="30"
  aria-label="Volume"
  tabindex="0"          <!-- must be focusable -->
>
```

**The ARIA alphabet:**
```html
<!-- Roles — what is this element? -->
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">

<!-- Properties — static facts about an element -->
<input aria-label="Search" aria-required="true" aria-describedby="help-text" />
<span id="help-text">Enter at least 3 characters</span>

<!-- States — dynamic conditions -->
<button aria-expanded="false" aria-controls="dropdown-menu">Menu</button>
<div id="dropdown-menu" aria-hidden="true">...</div>

<!-- Live regions — announce dynamic updates -->
<div aria-live="polite" aria-atomic="true">
  {statusMessage} <!-- announced when content changes -->
</div>
```

> **Interview Tip:** The four ARIA no-nos: (1) Don't add roles that duplicate native semantics. (2) Don't hide focusable elements with `aria-hidden`. (3) Don't forget to manage focus on dynamic content. (4) Don't use `aria-label` when visible label text exists — use `aria-labelledby` instead.

---

### Q25. How do you make a custom modal dialog accessible?

**🔴 HARD** | **📌 COMMON**

#### Concept

An accessible modal requires: correct ARIA roles, focus management, and keyboard trapping.

```jsx
function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement; // remember focus
      modalRef.current?.focus(); // move focus into modal
    } else {
      previousFocusRef.current?.focus(); // return focus when closed
    }
  }, [isOpen]);

  // Trap focus inside modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab') return;

    const focusable = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus(); // wrap backward
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus(); // wrap forward
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      tabIndex={-1}         /* focusable container */
      onKeyDown={handleKeyDown}
    >
      <h2 id="modal-title">{title}</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

**Checklist:**
- [ ] `role="dialog"` + `aria-modal="true"`
- [ ] `aria-labelledby` pointing to modal title
- [ ] Focus moved into modal on open
- [ ] Focus returned to trigger on close
- [ ] Tab focus trapped inside modal
- [ ] Escape key closes modal
- [ ] Background content `inert` or `aria-hidden`

> **Interview Tip:** Use `inert` attribute on the background content — `document.querySelector('#app').inert = true` — to prevent screen readers from reading or tabbing to background content while modal is open. It's more robust than `aria-hidden`.

---

### Q26. What is keyboard accessibility and how do you implement it?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

Keyboard accessibility ensures all functionality is accessible without a mouse — essential for users with motor disabilities and power users.

```html
<!-- Natural tab order — follows DOM order -->
<!-- Use tabindex to customize: -->

tabindex="0"   <!-- add to tab order in DOM position -->
tabindex="-1"  <!-- focusable by JS (.focus()) but not in tab order -->
tabindex="1+"  <!-- avoid! creates unpredictable tab order -->

<!-- Focusable by default: <a>, <button>, <input>, <select>, <textarea>, <details> -->
<!-- Not focusable: <div>, <span>, <p> -->
```

```css
/* Never remove focus outline without replacement */
:focus {
  outline: none; /* NEVER do this without a visible replacement */
}

/* Use focus-visible for keyboard users only */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
/* :focus-visible applies to keyboard focus, not mouse click */
```

```jsx
// Skip link — allows keyboard users to skip nav to main content
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
    >
      Skip to main content
    </a>
  );
}

// Keyboard handler for custom interactive elements
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {title}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
// <button> handles Enter, Space, and Tab automatically — use native elements!
```

> **Interview Tip:** The quick test: unplug your mouse and try using the site with only Tab, Shift+Tab, Enter, Space, and arrow keys. If you can't reach or activate every feature, it's not keyboard accessible.

---

### Q27. What is the difference between `alt`, `aria-label`, and `aria-labelledby`?

**🟡 MEDIUM** | **📌 COMMON**

#### Concept

All three provide accessible names — text announced by screen readers — but in different contexts:

| Attribute | Used on | Source |
|---|---|---|
| `alt` | `<img>` only | Inline text |
| `aria-label` | Any element | Inline text |
| `aria-labelledby` | Any element | Text from another element (by ID) |
| `aria-describedby` | Any element | Additional description (by ID) |

```html
<!-- alt — image alternative text -->
<img src="logo.png" alt="Acme Corp" />         <!-- "Acme Corp, image" -->
<img src="divider.png" alt="" />                <!-- decorative — ignored -->
<img src="chart.png" alt="Sales grew 40% in Q3" />  <!-- meaningful description -->

<!-- aria-label — label not visible in UI -->
<button aria-label="Close dialog">×</button>   <!-- "Close dialog, button" (not "×") -->
<nav aria-label="Breadcrumb">...</nav>
<input type="search" aria-label="Search products" />

<!-- aria-labelledby — label is visible text elsewhere on page -->
<h2 id="billing-heading">Billing Address</h2>
<form aria-labelledby="billing-heading">       <!-- "Billing Address, form" -->
  ...
</form>

<!-- aria-describedby — supplementary description -->
<input
  id="password"
  type="password"
  aria-describedby="password-hint"
/>
<p id="password-hint">Must be at least 8 characters with one number</p>
<!-- Screen reader: "Password, edit text. Must be at least 8 characters..." -->
```

> **Interview Tip:** Prefer visible text + `aria-labelledby` over invisible `aria-label` — visible labels help all users, not just screen reader users. Use `aria-label` only when a visible label isn't appropriate (icon buttons, landmark regions).

---

## 7. Animations & Transitions

---

### Q28. What is the difference between CSS transitions and animations?

**🟢 EASY** | **📌 COMMON**

#### Concept

| | Transitions | Animations |
|---|---|---|
| Trigger | State change (`:hover`, class add/remove) | Starts automatically or on class |
| Keyframes | Two states (from → to) | Multiple keyframes |
| Looping | No | Yes (`infinite`) |
| Direction control | Forward only | Forwards, backwards, alternate |
| Use for | Hover effects, UI state changes | Loading spinners, attention effects |

```css
/* Transition — smooth change between two states */
.button {
  background: #3b82f6;
  transition: background 200ms ease, transform 150ms ease;
}
.button:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

/* Shorthand */
.button {
  transition: all 200ms ease; /* all properties — avoid, can be expensive */
}

/* Animation — keyframe-based, self-running */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}

.spinner {
  animation: spin 1s linear infinite;
}

.loading-dot {
  animation: pulse 1.5s ease-in-out infinite;
}

/* Multiple keyframe stops */
@keyframes bounce {
  0%   { transform: translateY(0); }
  40%  { transform: translateY(-30px); }
  60%  { transform: translateY(-15px); }
  80%  { transform: translateY(-5px); }
  100% { transform: translateY(0); }
}
```

> **Interview Tip:** Always prefer `transform` and `opacity` for animations — they run on the compositor thread (GPU) without triggering layout or paint. Animating `width`, `height`, `top`, `left` triggers expensive reflows. Chrome DevTools Performance tab shows paint flashing when this happens.

---

### Q29. What does `will-change` do and when should you use it?

**🟡 MEDIUM** | **💡 RARE**

#### Concept

`will-change` hints to the browser that an element will change, allowing it to set up hardware acceleration (a GPU layer) in advance.

```css
/* Without will-change — browser creates layer during animation (jank) */
.modal {
  transition: transform 300ms ease;
}

/* With will-change — layer created in advance, smoother animation */
.modal-trigger:hover + .modal,
.modal.is-animating {
  will-change: transform;
}

/* Remove after animation to free GPU memory */
.modal-done {
  will-change: auto;
}
```

**Values:**
```css
will-change: transform;   /* pre-promote to composited layer */
will-change: opacity;
will-change: scroll-position; /* for scroll-driven animations */
will-change: auto;        /* remove hint */
```

**Use sparingly:**
```css
/* Bad — applying to many elements wastes GPU memory */
* { will-change: transform; } /* NEVER do this */

/* Good — apply only before animation, remove after */
.animate-enter { will-change: transform, opacity; }
```

> **Interview Tip:** `will-change` is a last resort for jank. First try ensuring you're only animating `transform` and `opacity`. Then use `translateZ(0)` or `transform: translate3d(0,0,0)` as a legacy hack. Reach for `will-change` when profiling still shows compositor issues.

---

### Q30. How do you respect user motion preferences with `prefers-reduced-motion`?

**🟢 EASY** | **📌 COMMON**

#### Concept

Some users experience nausea, dizziness, or seizures from motion. The `prefers-reduced-motion` media query lets you respect their OS preference.

```css
/* Default — full animation */
.hero-image {
  animation: float 3s ease-in-out infinite;
}

.slide-in {
  transition: transform 400ms cubic-bezier(0.34, 1.56, 1, 1);
}

/* Reduce motion — disable or substitute with fade */
@media (prefers-reduced-motion: reduce) {
  .hero-image {
    animation: none; /* stop infinite animation */
  }

  .slide-in {
    transition: opacity 200ms ease; /* fade instead of slide */
  }

  /* Global — disable all transitions and animations */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```jsx
// In React — check preference in JavaScript too
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// With Framer Motion
const variants = {
  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
  visible: { opacity: 1, y: 0 },
};
```

**`prefers-reduced-motion: no-preference`** — user has no preference or wants motion:
```css
/* Only animate if user explicitly wants motion (stricter approach) */
@media (prefers-reduced-motion: no-preference) {
  .fancy-entrance {
    animation: slideUp 400ms ease;
  }
}
```

> **Interview Tip:** This is an accessibility and UX win that takes minutes to implement. Mention it whenever animations come up in interviews — it shows you think beyond visual design. For autoplay videos, also use `prefers-reduced-motion` to disable or pause them.

---

*End of CSS & HTML Interview Guide — 30 Questions*
