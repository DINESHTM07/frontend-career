# Tailwind CSS Cheatsheet

---

## CONCEPT

Tailwind CSS is a **utility-first CSS framework** — instead of writing custom CSS classes, you compose small single-purpose utility classes directly in your HTML/JSX. No more context-switching between files. No more naming things.

```html
<!-- Traditional CSS -->
<button class="btn-primary">Submit</button>
/* .btn-primary { background: blue; color: white; padding: 8px 16px; ... } */

<!-- Tailwind -->
<button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
```

---

## WHY IT MATTERS

- **Speed**: No context switching — styles live next to markup.
- **No naming fatigue**: No `.container-wrapper-inner-left` naming debates.
- **Consistency**: Design tokens (spacing, colors, fonts) enforced by default.
- **Tree-shaking**: Unused styles are purged — tiny production bundles.
- **Industry standard**: Used by Vercel, GitHub, Shopify, and most modern React shops.

---

## EXAMPLES

### 1. Responsive design breakpoints

```tsx
// Mobile-first: base styles apply to all screens
// Breakpoint prefixes add styles at that size and UP

// sm: 640px+, md: 768px+, lg: 1024px+, xl: 1280px+, 2xl: 1536px+

<div className="
  w-full          // mobile: full width
  md:w-1/2        // tablet: half width
  lg:w-1/3        // desktop: one-third
">

<p className="
  text-sm         // mobile: small text
  md:text-base    // tablet: normal text
  lg:text-lg      // desktop: large text
">

// Grid that changes columns by breakpoint
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```

### 2. Flexbox utilities

```tsx
// Flex container
<div className="flex">                          // display: flex
<div className="inline-flex">                   // display: inline-flex

// Direction
<div className="flex flex-row">                 // default
<div className="flex flex-col">                 // column

// Alignment
<div className="flex items-center">             // align-items: center
<div className="flex items-start">
<div className="flex items-end">
<div className="flex items-stretch">

// Justify
<div className="flex justify-between">          // space between
<div className="flex justify-center">
<div className="flex justify-start">
<div className="flex justify-end">
<div className="flex justify-around">
<div className="flex justify-evenly">

// Common combos
<div className="flex items-center justify-between">  // nav bar pattern
<div className="flex items-center gap-2">            // icon + label

// Flex children
<div className="flex-1">        // flex: 1 1 0% (grows to fill)
<div className="flex-none">     // flex: none (fixed size)
<div className="flex-auto">     // flex: 1 1 auto (respects content)
<div className="shrink-0">      // flex-shrink: 0 (don't shrink)

// Gap
<div className="flex gap-4">                    // gap: 1rem (16px)
<div className="flex gap-x-4 gap-y-2">         // separate x/y gaps
```

### 3. Grid utilities

```tsx
// Grid container
<div className="grid grid-cols-3 gap-4">          // 3 equal columns
<div className="grid grid-cols-12 gap-4">         // 12-column grid

// Fixed columns
<div className="grid grid-cols-2">    // 2 columns
<div className="grid grid-cols-4">    // 4 columns

// Column span
<div className="col-span-2">          // spans 2 columns
<div className="col-span-full">       // spans all columns
<div className="col-start-2 col-span-3">  // starts at column 2, spans 3

// Row span
<div className="row-span-2">          // spans 2 rows

// Auto-fit responsive grid (no breakpoints needed)
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">

// Named areas (advanced)
<div className="grid [grid-template-areas:'header_header''sidebar_main'] grid-cols-[200px_1fr]">
```

### 4. Spacing — padding and margin

```tsx
// Tailwind spacing scale: 1 unit = 4px (0.25rem)
// p-0=0px, p-1=4px, p-2=8px, p-3=12px, p-4=16px, p-6=24px, p-8=32px, p-12=48px, p-16=64px

// Padding (all sides, sides, individual)
<div className="p-4">          // padding: 16px all sides
<div className="px-4">         // padding-left + padding-right
<div className="py-2">         // padding-top + padding-bottom
<div className="pt-4 pb-2">    // individual sides (t, r, b, l)
<div className="pl-8 pr-4">

// Margin
<div className="m-4">          // margin: 16px all sides
<div className="mx-auto">      // center horizontally
<div className="mt-8 mb-4">
<div className="mx-4 my-2">

// Negative margin
<div className="-mt-2">        // margin-top: -8px

// Space between children (alternative to gap for non-grid)
<div className="space-y-4">    // adds margin-top to all children except first
<div className="space-x-4">    // horizontal spacing
```

### 5. Typography

```tsx
// Font size
<p className="text-xs">    // 12px
<p className="text-sm">    // 14px
<p className="text-base">  // 16px
<p className="text-lg">    // 18px
<p className="text-xl">    // 20px
<p className="text-2xl">   // 24px
<p className="text-3xl">   // 30px
<p className="text-4xl">   // 36px

// Font weight
<p className="font-light">     // 300
<p className="font-normal">    // 400
<p className="font-medium">    // 500
<p className="font-semibold">  // 600
<p className="font-bold">      // 700

// Line height (leading)
<p className="leading-none">   // 1
<p className="leading-tight">  // 1.25
<p className="leading-normal"> // 1.5
<p className="leading-loose">  // 2

// Letter spacing (tracking)
<p className="tracking-tight">  // -0.025em
<p className="tracking-normal"> // 0
<p className="tracking-wide">   // 0.025em
<p className="tracking-widest"> // 0.1em

// Text align
<p className="text-left text-center text-right text-justify">

// Text color
<p className="text-gray-600">
<p className="text-blue-500">
<p className="text-red-600 dark:text-red-400">
```

### 6. Colors and opacity

```tsx
// Tailwind color scale: 50 (lightest) → 950 (darkest)
// Colors: slate, gray, zinc, neutral, stone, red, orange, amber, yellow,
//         lime, green, emerald, teal, cyan, sky, blue, indigo, violet,
//         purple, fuchsia, pink, rose

// Background color
<div className="bg-blue-500">
<div className="bg-slate-100">
<div className="bg-white dark:bg-gray-900">

// Opacity on backgrounds
<div className="bg-blue-500/50">     // 50% opacity (Tailwind v3+)
<div className="bg-black/20">        // Semi-transparent overlay

// Text color
<p className="text-gray-900 dark:text-gray-100">

// Border color
<div className="border border-gray-200 dark:border-gray-700">

// Standalone opacity
<div className="opacity-50">         // affects element + children
```

### 7. Hover, focus, active states

```tsx
// Pseudo-class variants
<button className="
  bg-blue-500
  hover:bg-blue-600           // on hover
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  focus:ring-offset-2
  active:bg-blue-700          // when pressed
  disabled:opacity-50
  disabled:cursor-not-allowed
">

// Focus-visible (keyboard focus only, not mouse click)
<button className="focus-visible:ring-2 focus-visible:ring-blue-500">

// Group hover — parent hover affects children
<div className="group hover:bg-gray-50">
  <span className="text-gray-600 group-hover:text-blue-600">
    Hover the card to change text color
  </span>
</div>
```

### 8. Dark mode

```tsx
// In tailwind.config.js: darkMode: 'class' (toggle via class on <html>)
// or darkMode: 'media' (follows OS preference)

<div className="bg-white dark:bg-gray-900">
<p className="text-gray-900 dark:text-gray-100">
<div className="border border-gray-200 dark:border-gray-700">
<button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">

// Toggle dark mode (class strategy)
document.documentElement.classList.toggle('dark')
```

### 9. Transitions and animations

```tsx
// Transition
<button className="transition">                       // all properties, 150ms
<button className="transition-colors duration-200">   // only colors, 200ms
<button className="transition-all duration-300 ease-in-out">

// Common transition pattern for hover effects
<button className="
  bg-blue-500
  transition-colors duration-200
  hover:bg-blue-600
">

// Transform
<div className="hover:scale-105 transition-transform">   // scale on hover
<div className="hover:-translate-y-1 transition-transform"> // lift on hover
<div className="rotate-45">                               // rotate

// Built-in animations
<div className="animate-spin">      // spinning loader
<div className="animate-ping">      // pulsing dot
<div className="animate-pulse">     // skeleton loading
<div className="animate-bounce">    // bouncing indicator
```

### 10. tailwind.config.js — extending the theme

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {        // Use 'extend' to ADD to defaults (not replace)
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',   // p-18, m-18, w-18, etc.
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
```

### 11. @apply — extracting reusable components

```css
/* globals.css — use sparingly, prefer component abstraction */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium
           transition-colors focus-visible:outline-none focus-visible:ring-2
           disabled:pointer-events-none disabled:opacity-50;
  }

  .btn-primary {
    @apply btn bg-blue-600 text-white hover:bg-blue-700;
  }

  .card {
    @apply rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800;
  }
}
```

### 12. group and peer modifiers

```tsx
// group — style a child based on parent state
<a href="#" className="group block p-4 hover:bg-blue-50">
  <h3 className="text-gray-900 group-hover:text-blue-600">Title</h3>
  <p className="text-gray-500 group-hover:text-blue-400">Subtitle</p>
</a>

// peer — style a sibling based on another element's state
<div>
  <input
    id="email"
    type="email"
    className="peer border-2 border-gray-300 focus:border-blue-500"
    required
  />
  <p className="hidden peer-invalid:block text-red-500 text-sm">
    Invalid email address
  </p>
</div>
```

---

## COMMON MISTAKES

1. **Forgetting content paths in `tailwind.config.js`** — If your JSX files aren't in the `content` array, Tailwind purges the classes you use. Include all files with Tailwind classes.

2. **Building class names with string concatenation** — `"text-" + color` breaks Tailwind's purging. Write full class names: `color === 'red' ? 'text-red-500' : 'text-blue-500'`.

3. **Overusing `@apply`** — `@apply` re-introduces the CSS naming problem. Only use it for truly reused button/input patterns; prefer React components for UI reuse.

4. **Using `!important` modifier excessively** — `!text-red-500` (! prefix) forces styles. It's a code smell. Fix specificity issues instead.

5. **Ignoring `sm:` is 640px and UP** — It's mobile-first. Base classes = mobile. `sm:` = small screens AND above. Don't put mobile styles on `sm:`.

6. **Not using `gap` and using `space-x`/`space-y` instead** — `gap` works with flex and grid, is more predictable. `space-x`/`space-y` uses margin and has edge cases with wrapping.

7. **Arbitrary values for things already in the scale** — `w-[16px]` when `w-4` (= 16px) exists. Learn the spacing scale.

---

## INTERVIEW TIP

> "What is utility-first CSS and what are its tradeoffs?"

**Answer framework:**
- **Utility-first**: Compose small, single-purpose classes in markup instead of writing custom CSS per component.
- **Pros**: No naming, colocated styles, no dead CSS, consistent design tokens, faster iteration.
- **Cons**: Long class strings (use `clsx`/`cn` for conditionals), HTML looks noisy, harder for non-Tailwind devs to read.
- **Vs CSS Modules**: CSS Modules give encapsulation but require context-switching and naming. Tailwind is faster for most component work.
- **How you handle reuse**: Extract React components (not CSS classes) — the component is the reusable unit, not the CSS.
