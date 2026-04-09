# Day 65 — Dark Mode Exercise + Exercise 33 + Framer Motion Animations

**Status:** 📋 READY TO START
**Week:** 10 | **Theme:** Testing + Polish + Open Source

---

## Today's Goal

Three things today: finish the dark mode exercise, complete exercise 33, and add Framer Motion animations to all three projects. By end of today, your projects feel alive — transitions, page animations, micro-interactions.

By end of today:
- Dark mode exercise completed
- Exercise 33 completed
- Framer Motion installed and used in all 3 projects
- At least 3 distinct animation types used: fade in, slide in, stagger

---

## Morning (8:00 – 11:00 AM) — Dark Mode Exercise + Exercise 33

### Part 1 — Dark Mode Exercise

This exercise reinforces what you built in Week 9. The goal is to implement dark mode from scratch — without looking at the Week 9 code — using only the pattern you now know:

1. `'use client'` ThemeProvider wrapping the app
2. `attribute="class"` → adds `dark` class to `<html>`
3. CSS variables in `:root` and `.dark` blocks
4. A toggle button that reads from and writes to `useTheme`

**The exercise:** Take one of your React projects (not Next.js — do this in e-commerce or dashboard) and add a dark mode implementation from scratch using this Tailwind-based approach:

```css
/* Add to your globals.css or index.css */
:root {
  --bg: #ffffff;
  --fg: #111827;
  --card: #f9fafb;
  --border: #e5e7eb;
  --muted: #6b7280;
}

.dark {
  --bg: #0f172a;
  --fg: #f1f5f9;
  --card: #1e293b;
  --border: #334155;
  --muted: #94a3b8;
}

body {
  background-color: var(--bg);
  color: var(--fg);
}
```

Then update your Tailwind config to use CSS variable colors:
```js
theme: {
  extend: {
    colors: {
      background: 'var(--bg)',
      foreground: 'var(--fg)',
      card: 'var(--card)',
      border: 'var(--border)',
      muted: 'var(--muted)',
    }
  }
}
```

Test: toggle dark mode → all CSS variable colors flip automatically → no component-by-component changes needed.

### Part 2 — Exercise 33

Open `exercises/33-[exercise name].jsx` and complete it. This exercise is in your exercises folder — it is the context for this day. Read it and complete all parts.

---

## Midday (11:20 AM – 1:30 PM) — Framer Motion Animations

### Step 1 — Install Framer Motion

In each of your 3 projects:

```bash
npm install framer-motion
```

### Step 2 — Learn the Core API (5 minute read)

Framer Motion has 3 things you need to know:

**`motion.div`** — replace any HTML element with its `motion` equivalent:
```tsx
import { motion } from 'framer-motion'

// Before:
<div className="card">...</div>

// After (now animated):
<motion.div
  className="card"
  initial={{ opacity: 0, y: 20 }}  // starting state
  animate={{ opacity: 1, y: 0 }}   // end state
  transition={{ duration: 0.3 }}    // how long
>
  ...
</motion.div>
```

**`AnimatePresence`** — animates components as they mount and unmount:
```tsx
import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence>
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}         // plays when component is removed
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>
```

**`variants`** — define reusable animation presets:
```tsx
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

<motion.div variants={cardVariants} initial="hidden" animate="visible">
  ...
</motion.div>
```

### Step 3 — Add to E-Commerce Project

**Animate the product grid (stagger effect):**
```tsx
// In your ProductList component
import { motion } from 'framer-motion'

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,  // each child starts 50ms after the previous
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}

// Wrap the grid:
<motion.ul variants={container} initial="hidden" animate="visible" className="grid ...">
  {products.map(product => (
    <motion.li key={product.id} variants={item}>
      <ProductCard product={product} />
    </motion.li>
  ))}
</motion.ul>
```

**Animate the cart drawer/modal appearing:**
```tsx
<AnimatePresence>
  {cartOpen && (
    <motion.div
      key="cart"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl"
    >
      <CartDrawer />
    </motion.div>
  )}
</AnimatePresence>
```

### Step 4 — Add to Dashboard Project

**Animate StatCards on load:**
```tsx
// Wrap each StatCard in motion.div with stagger
<motion.div
  className="grid ..."
  variants={container}
  initial="hidden"
  animate="visible"
>
  {statCards.map(card => (
    <motion.div key={card.id} variants={item}>
      <StatCard data={card} />
    </motion.div>
  ))}
</motion.div>
```

**Animate page transitions** — wrap `{children}` in the layout:
```tsx
'use client'
import { motion } from 'framer-motion'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
```

### Step 5 — Add to Next.js Project

For Next.js App Router, animations in Server Components don't work directly. Wrap content in a Client Component:

```tsx
// src/components/PageTransition.tsx
'use client'
import { motion } from 'framer-motion'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}
```

Use it in layouts or pages:
```tsx
// Wrap page content:
<PageTransition>
  <YourPageContent />
</PageTransition>
```

### Animation Principles to Follow

- **Fast is better:** most transitions should be 150–300ms. Longer than 500ms feels slow.
- **Ease out for entering:** things coming into view should decelerate (ease-out)
- **Spring for interactive:** dragging, bouncing, interactive elements feel best with spring physics
- **Don't animate everything:** 3–5 animated elements per page is usually the maximum before it feels chaotic
- **Respect `prefers-reduced-motion`:** some users need less animation for accessibility

```tsx
// Respect reduced motion preference
import { useReducedMotion } from 'framer-motion'

function AnimatedCard({ children }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  )
}
```

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-65-dsa.js` in this folder.

---

## End of Day Checklist

- [ ] Dark mode exercise completed using CSS variables + Tailwind config
- [ ] Exercise 33 completed fully
- [ ] Framer Motion installed in all 3 projects
- [ ] E-commerce: product grid stagger animation on load
- [ ] E-commerce: cart drawer/modal slide animation
- [ ] Dashboard: StatCards stagger animation on load
- [ ] Dashboard: page fade transition
- [ ] Next.js: `PageTransition` component wrapping page content
- [ ] Animations are fast (≤300ms) — not slow or dramatic
- [ ] `prefers-reduced-motion` respected in at least one animation
- [ ] Completed 3 DSA problems in `day-65-dsa.js`

---

*Good animations make your UI feel professional. Great animations are the ones you barely notice — they just make the experience feel smooth.*
