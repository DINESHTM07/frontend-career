# Framer Motion Cheatsheet

---

## CONCEPT

Framer Motion is the animation library for React. It works by replacing regular HTML elements with `motion` components (`motion.div`, `motion.button`, etc.) and adding animation props. The library handles all the complex CSS transitions, spring physics, and orchestration under the hood — you just describe what you want.

```tsx
// Before Framer Motion
<div className="opacity-0 translate-y-4 ...">Hello</div>

// With Framer Motion
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
>
  Hello
</motion.div>
```

---

## WHY IT MATTERS

- Smooth animations are the single biggest visual difference between a student project and a professional product.
- Framer Motion handles the hard parts: spring physics, exit animations (React doesn't natively support animating elements out), layout animations, and orchestrating parent/child sequences.
- Almost every design-forward company (Vercel, Linear, Stripe, Raycast) uses Framer Motion or similar.
- It's declarative and integrates naturally with React state — when `isOpen` changes, the animation happens automatically.

---

## EXAMPLES

### 1. Installation and basic setup

```bash
npm install framer-motion
```

```tsx
import { motion } from 'framer-motion'

// motion.X exists for every HTML and SVG element:
// motion.div, motion.span, motion.button, motion.ul, motion.li
// motion.svg, motion.path, motion.circle, etc.

// Basic animation: fade in and slide up on mount
export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      Welcome
    </motion.div>
  )
}
```

### 2. animate, initial, exit props

```tsx
import { motion } from 'framer-motion'

// initial  — state before animation starts (or element mounts)
// animate  — target state (animates to this)
// exit     — state when element is removed from DOM (requires AnimatePresence)

<motion.div
  initial={{ opacity: 0, scale: 0.8, y: 30 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.8, y: -30 }}
>
  Card content
</motion.div>

// Animate on condition
<motion.div
  animate={{
    x: isOpen ? 0 : -100,
    opacity: isOpen ? 1 : 0,
  }}
>
  Sidebar
</motion.div>

// Animate multiple properties independently
<motion.div
  animate={{
    backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
    color: isDark ? '#ffffff' : '#000000',
    borderRadius: isRound ? '50%' : '8px',
  }}
>
  Themed box
</motion.div>
```

### 3. Transition — controlling speed and physics

```tsx
// transition prop controls HOW the animation happens

// Tween — duration-based, predictable timing
<motion.div
  animate={{ x: 100 }}
  transition={{
    type: 'tween',
    duration: 0.3,
    ease: 'easeOut',   // linear | easeIn | easeOut | easeInOut | circOut
  }}
/>

// Spring — physics-based, feels natural (default in Framer Motion)
<motion.div
  animate={{ x: 100 }}
  transition={{
    type: 'spring',
    stiffness: 300,    // Higher = snappier
    damping: 20,       // Higher = less bouncy
    mass: 1,
  }}
/>

// Spring presets (easier)
transition={{ type: 'spring', bounce: 0.4 }}  // bounce: 0 (no bounce) - 1 (very bouncy)
transition={{ type: 'spring', bounce: 0 }}    // Overdamped, smooth

// Delay
<motion.div
  animate={{ opacity: 1 }}
  transition={{ delay: 0.2, duration: 0.4 }}
/>

// Per-property transitions
<motion.div
  animate={{ x: 100, opacity: 1 }}
  transition={{
    x: { type: 'spring', stiffness: 200 },
    opacity: { duration: 0.2 },
  }}
/>
```

### 4. Variants — orchestrating animations

```tsx
// Variants let you name animation states and control timing across children

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,     // Each child animates 0.1s after the previous
      delayChildren: 0.2,       // Wait 0.2s before starting children
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', bounce: 0.3 },
  },
}

// Parent propagates variant names to all children automatically
export function AnimatedList({ items }: { items: string[] }) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map(item => (
        <motion.li key={item} variants={itemVariants}>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  )
}
// Result: all list items fade in one after another with a 0.1s stagger
```

### 5. AnimatePresence — exit animations

```tsx
// React removes elements from the DOM immediately
// AnimatePresence delays removal until exit animation completes

import { AnimatePresence, motion } from 'framer-motion'

// Modal example
export function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (   // Conditional render — AnimatePresence watches for removal
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-xl p-6"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Toast notifications with AnimatePresence
function ToastList({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">  {/* mode: sync | wait | popLayout */}
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            layout  // Smoothly repositions when other toasts leave
            className="bg-white shadow-lg rounded-lg p-4"
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
```

### 6. whileHover and whileTap

```tsx
// Gesture shortcuts — no state management needed

// Scale on hover, press down on tap
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
  className="bg-blue-500 text-white px-4 py-2 rounded"
>
  Click me
</motion.button>

// Card lift effect
<motion.div
  whileHover={{
    y: -4,
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
  }}
  transition={{ duration: 0.2 }}
  className="bg-white rounded-xl p-6 shadow-md cursor-pointer"
>
  Hover me
</motion.div>

// Icon spin on hover
<motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
  <SettingsIcon />
</motion.div>

// Combined with focus for accessibility
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileFocus={{ outline: '2px solid blue' }}
>
  Accessible animated button
</motion.button>
```

### 7. Layout animations

```tsx
// layout prop — automatically animates when element changes position/size
// No need to manually calculate positions — Framer Motion handles it

import { motion, LayoutGroup } from 'framer-motion'

// Animate list reordering
function SortableList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map(item => (
        <motion.li
          key={item.id}
          layout           // Animate position changes smoothly
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 bg-white rounded mb-2"
        >
          {item.name}
        </motion.li>
      ))}
    </ul>
  )
}

// Shared layout animation — element "morphs" between two states
// (e.g., a tab indicator sliding between tabs)
function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex gap-2">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className="relative px-4 py-2"
        >
          {tab}
          {activeTab === tab && (
            <motion.div
              layoutId="tab-indicator"   // Same layoutId = shared animation
              className="absolute inset-0 bg-blue-100 rounded -z-10"
            />
          )}
        </button>
      ))}
    </div>
  )
}
```

### 8. Scroll-triggered animations

```tsx
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// useInView — trigger animation when element enters viewport
function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,       // Only animate once (not every scroll in/out)
    margin: '-100px', // Trigger 100px before element enters viewport
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// useScroll + useTransform — parallax effect
import { useScroll, useTransform } from 'framer-motion'

function ParallaxHero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])  // Input range → output range

  return (
    <div className="relative h-screen overflow-hidden">
      <motion.img
        src="/hero.jpg"
        style={{ y }}   // Note: style prop, not animate (no transition needed)
        className="absolute inset-0 w-full h-full object-cover scale-110"
      />
    </div>
  )
}
```

---

## COMMON MISTAKES

1. **Using `animate` for values that change via `style`** — For scroll-linked animations (`useTransform`), pass values to the `style` prop, not `animate`. The `animate` prop is for triggered, spring-physics animations.

2. **Forgetting `AnimatePresence` for exit animations** — `exit` prop does nothing without wrapping in `<AnimatePresence>`. The component just disappears.

3. **Missing `key` on conditional elements inside `AnimatePresence`** — AnimatePresence tracks elements by their `key`. Without a key, it can't detect when an element leaves and enters.

4. **Animating too much** — Animating every element is visually noisy and slows the page. Animate entry, key interactions (hover, tap), and meaningful state changes — not decorative elements.

5. **Not using `layout` when elements reposition** — Without `layout`, when you remove a list item, the remaining items jump to their new positions. With `layout`, they slide.

6. **Forgetting `will-change` for heavy animations** — Framer Motion handles this internally for most cases, but very complex animations may need `style={{ willChange: 'transform' }}`.

7. **Using Framer Motion for hover effects that CSS handles fine** — `hover:scale-105` in Tailwind is simpler than `whileHover={{ scale: 1.05 }}`. Use Framer Motion when CSS can't do it (spring physics, AnimatePresence, layout animations).

---

## INTERVIEW TIP

> "How do you implement animations in React? What's your approach?"

**Answer framework:**
- "For simple hover and transform effects, I use Tailwind's transition utilities — no JS overhead."
- "For more complex animations — entrance effects, exit animations, staggered lists, and spring physics — I use Framer Motion."
- "The most powerful feature I use is `AnimatePresence` for exit animations, since React doesn't natively support animating elements as they're removed from the DOM."
- "I also use `variants` with `staggerChildren` for list animations where each item appears slightly after the previous one — this draws the user's eye through the content naturally."
- Bonus: Mention `layoutId` for shared layout animations (the "morphing" tab indicator pattern). Almost no one mentions this in interviews and it's impressive.
