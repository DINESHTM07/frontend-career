# Day 39 — Tailwind CSS in React

**Status:** 📋 READY TO START
**Week:** 6 | **Theme:** React Intermediate

---

## What You'll Learn Today

Every app you've built so far uses inline styles. They work, but they're verbose and hard to make responsive. Tailwind CSS changes everything.

Tailwind is a utility-first CSS framework. Instead of writing:
```css
.card { padding: 16px; border-radius: 8px; background: white; box-shadow: ...; }
```

You write:
```jsx
<div className="p-4 rounded-lg bg-white shadow-md">
```

Each class does ONE thing. You compose them. The browser only downloads the CSS classes you actually use — the output bundle is tiny.

Why it matters for React: Tailwind and React work perfectly together. Conditional classes replace conditional inline styles. The component model + utility classes = fast, consistent UI.

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/advanced/03-tailwind.md` — read before starting setup
3. Your React project — add Tailwind here
4. `exercises/advanced/32-responsive-grid.html` — afternoon

---

## Morning (8:00 – 8:30 AM) — Install Tailwind

### The exact steps for Tailwind v4 with Vite

Tailwind setup changes between versions. These steps are for Tailwind v4 (the current version as of 2025). **If something doesn't work, open Cursor AI and ask: "How do I install Tailwind CSS v4 with Vite and React?"** — it will give you the exact current commands.

**Step 1 — Install Tailwind:**
```bash
npm install -D tailwindcss @tailwindcss/vite
```

**Step 2 — Add the plugin to `vite.config.js`:**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),    // add this line
  ],
})
```

**Step 3 — Create (or update) your CSS file:**

Create `src/index.css` if it doesn't exist:
```css
@import "tailwindcss";
```

**Step 4 — Import the CSS in `main.jsx`:**
```jsx
import './index.css'  // add this line
```

**Step 5 — Verify it works:**

Add a test class to `App.jsx`:
```jsx
<h1 className="text-3xl font-bold text-indigo-600">Tailwind Works!</h1>
```

If you see a large, bold, indigo heading — Tailwind is installed correctly. If not, check the [Tailwind docs](https://tailwindcss.com/docs/installation/using-vite) or use Cursor AI to debug.

---

## Morning (8:30 – 11:00 AM) — Learn Tailwind by Doing

### Read the cheatsheet

Open `cheatsheets/advanced/03-tailwind.md` and read the key utility classes.

---

### The 20 Tailwind classes you'll use 80% of the time

**Spacing:**
```
p-4      → padding: 1rem
px-4     → padding left + right: 1rem
py-2     → padding top + bottom: 0.5rem
m-4      → margin: 1rem
mx-auto  → margin left + right: auto (centering!)
mt-4     → margin-top: 1rem
gap-4    → gap: 1rem (in flex/grid)
```

**Layout:**
```
flex           → display: flex
flex-col       → flex-direction: column
items-center   → align-items: center
justify-between → justify-content: space-between
grid           → display: grid
grid-cols-3    → grid-template-columns: repeat(3, 1fr)
w-full         → width: 100%
max-w-xl       → max-width: 36rem
```

**Typography:**
```
text-sm    → font-size: 0.875rem
text-xl    → font-size: 1.25rem
text-3xl   → font-size: 1.875rem
font-bold  → font-weight: 700
text-gray-500 → color: #6b7280
```

**Visual:**
```
bg-white          → background-color: white
bg-indigo-600     → background-color: indigo
rounded-lg        → border-radius: 0.5rem
rounded-full      → border-radius: 9999px (pill)
border            → border: 1px solid
border-gray-200   → border-color: #e5e7eb
shadow-md         → box-shadow: medium
```

**Responsive (mobile-first):**
```
sm:grid-cols-2   → grid-cols-2 at 640px+
md:grid-cols-3   → grid-cols-3 at 768px+
lg:grid-cols-4   → grid-cols-4 at 1024px+
```

**State modifiers:**
```
hover:bg-indigo-700   → background changes on hover
focus:ring-2          → ring appears on focus
disabled:opacity-50   → reduced opacity when disabled
```

---

### Practice Component — build in Tailwind

Create `src/components/TailwindCard.jsx` to practice:

```jsx
export default function TailwindCard({ title, description, badge, href }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {badge && (
          <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">{description}</p>
      {href && (
        <a href={href} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
          Learn more →
        </a>
      )}
    </div>
  );
}
```

Notice: no CSS files, no style objects. The component is self-contained.

---

## Midday (11:20 AM – 1:00 PM) — Restyle Your Best App with Tailwind

Pick your Movie Search App or Budget Tracker. Remove ALL inline styles. Replace with Tailwind classes.

**Rules:**
- No `style={{ ... }}` anywhere in the component files
- Only `className="..."` with Tailwind utilities
- Must be mobile-responsive (use `sm:`, `md:`, `lg:` prefixes)

**Before:**
```jsx
<div style={{ display: "flex", gap: "12px", padding: "16px" }}>
```

**After:**
```jsx
<div className="flex gap-3 p-4">
```

### Key Tailwind patterns for your app

**Responsive grid:**
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
```

**Navigation bar:**
```jsx
<nav className="bg-gray-900 px-6 flex items-center gap-1">
  <a className="text-indigo-400 border-b-2 border-indigo-400 px-3 py-4 font-semibold text-sm">Active</a>
  <a className="text-gray-400 hover:text-white px-3 py-4 text-sm transition-colors">Inactive</a>
</nav>
```

**Conditional classes with template literals:**
```jsx
<button
  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700"
      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
  }`}
>
  {children}
</button>
```

**Or use `clsx` for complex conditional classes:**
```bash
npm install clsx
```
```jsx
import clsx from 'clsx'
<div className={clsx("rounded-lg p-4", isActive && "bg-indigo-50 border-indigo-200", isError && "bg-red-50 border-red-200")}>
```

---

## Afternoon (2:00 – 4:30 PM) — Responsive Grid Exercise + DSA

### `exercises/advanced/32-responsive-grid.html`

This is an HTML/CSS exercise using Tailwind CDN. Open it in the browser and work through it — you'll build a responsive product grid that works on mobile, tablet, and desktop.

### DSA

Open `dsa-bank/02-arrays-medium.md`. Solve **3 more problems** (your choice of which ones you haven't done yet).

Create `day-39-dsa.js` in the `week-06-react-intermediate/day-39/` folder.

---

## Wrap Up (4:30 – 5:45 PM)

Write in `journal.md`:
- What does `md:grid-cols-3` mean and when does it apply?
- What is the difference between `p-4` and `px-4 py-2`?
- How does `hover:bg-indigo-700` work — what CSS does it generate?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 39: Tailwind CSS + responsive redesign + 3 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Installed Tailwind with Vite plugin (`@tailwindcss/vite`)
- [ ] `@import "tailwindcss"` in `src/index.css`
- [ ] Imported CSS in `main.jsx`
- [ ] Test class `text-3xl font-bold text-indigo-600` shows styled heading
- [ ] Read `cheatsheets/advanced/03-tailwind.md`
- [ ] Built `TailwindCard.jsx` — badge, hover shadow, link — all in Tailwind
- [ ] Movie Search or Budget Tracker: ALL inline styles removed and replaced with Tailwind
- [ ] App is responsive — tested by resizing browser window
- [ ] Mobile view (narrow window) looks good — single column
- [ ] Desktop view (wide window) uses multi-column grid
- [ ] Completed `32-responsive-grid.html` exercise
- [ ] Solved 3 DSA problems in `day-39-dsa.js`
- [ ] Committed and pushed

---

## Quick Reference — Tailwind Cheat Sheet

```
SPACING       p-{n}  m-{n}  gap-{n}  (n: 0,1,2,3,4,5,6,8,10,12,16,20,24...)
SIZING        w-full  w-{n}  max-w-{sm,md,lg,xl,2xl,...}  h-screen
FLEXBOX       flex  flex-col  items-center  justify-between  flex-wrap  flex-1
GRID          grid  grid-cols-{n}  col-span-{n}
TYPOGRAPHY    text-{xs,sm,base,lg,xl,2xl,3xl}  font-{normal,medium,semibold,bold}
COLORS        text-gray-{100-900}  bg-indigo-{50-950}  border-gray-{200}
BORDER        border  border-{n}  rounded-{none,sm,md,lg,xl,2xl,full}
SHADOW        shadow-{sm,md,lg,xl}
RESPONSIVE    sm:{class}  md:{class}  lg:{class}  xl:{class}
STATE         hover:{class}  focus:{class}  disabled:{class}  active:{class}
TRANSITION    transition  transition-colors  duration-{150,300}
```

---

*Tailwind removes the context-switching between your JS and CSS files. Your UI lives entirely in your components. That's faster to write, faster to read, and easier to maintain.*
