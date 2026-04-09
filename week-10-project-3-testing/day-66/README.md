# Day 66 — Exercise 34: Clone a Real UI with Tailwind Only

**Status:** 📋 READY TO START
**Week:** 10 | **Theme:** Testing + Polish + Open Source

---

## Today's Goal

Clone a real, professional UI using Tailwind CSS only — no component libraries, no pre-built UI kits. This is the most effective way to level up your Tailwind skills because you can measure yourself against a real target.

By end of today:
- Exercise 34 completed — a real UI cloned with Tailwind
- You can reproduce spacing, typography, shadows, and color systems from a screenshot
- Your Tailwind skill is meaningfully higher than it was this morning

---

## What to Open

1. `exercises/34-[exercise name].jsx` — the clone target and spec

---

## Morning (8:00 – 11:00 AM) — Study the Target + Plan

### Step 1 — Open Exercise 34

Open `exercises/34-[exercise name].jsx` and read the full spec. The exercise gives you a target UI to clone. Study it carefully before writing any code.

### Step 2 — Decompose the UI

Before writing any code, break the target UI into components and layout sections:

1. **Identify the layout grid** — how many columns? what breakpoints?
2. **Identify the spacing rhythm** — is padding consistent (8px multiples)? What's the gap between elements?
3. **Identify the typography scale** — how many font sizes? Which are bold? What colors?
4. **Identify the color palette** — primary color, text color, border color, background color
5. **Identify interactive states** — hover effects, focus rings, active states

Write these down before touching code.

### Step 3 — The Tailwind Clone Workflow

**Pixel-perfect approach (what you're practicing today):**

1. Start with the outer container and layout
2. Build section by section, top to bottom
3. Compare your clone against the target after each section
4. Fix differences before moving to the next section
5. Never move on while a section looks wrong

**The most common mistakes when cloning with Tailwind:**

- Wrong spacing (`p-4` when the target is `p-6`)
- Wrong font weight (`font-medium` when target is `font-semibold`)
- Wrong border radius (`rounded` vs `rounded-lg` vs `rounded-xl`)
- Wrong shadow depth (`shadow-sm` vs `shadow` vs `shadow-md`)
- Missing `gap` between flex/grid items

**How to measure spacing from a screenshot:**

Use your browser's DevTools on the actual page if available, or estimate:
- 4px = `p-1` / `gap-1`
- 8px = `p-2` / `gap-2`
- 12px = `p-3` / `gap-3`
- 16px = `p-4` / `gap-4`
- 24px = `p-6` / `gap-6`
- 32px = `p-8` / `gap-8`
- 48px = `p-12` / `gap-12`

---

## Midday (11:20 AM – 1:30 PM) — Build the Clone

Work section by section. If the exercise gives you a specific target, build that. If it gives you freedom to choose, pick one of these common UI patterns that employers recognize:

### Option A — Pricing Page

```tsx
// Three-column pricing cards with a featured "Pro" card
export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      description: 'Perfect for individuals and small projects.',
      features: ['5 projects', '10GB storage', 'Basic analytics', 'Email support'],
      cta: 'Get started',
      featured: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For professionals who need more power.',
      features: ['Unlimited projects', '100GB storage', 'Advanced analytics', 'Priority support', 'Custom domains'],
      cta: 'Start free trial',
      featured: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For teams and organizations at scale.',
      features: ['Everything in Pro', '1TB storage', 'SSO & SAML', 'Dedicated support', 'SLA guarantee'],
      cta: 'Contact sales',
      featured: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-gray-500">No hidden fees. Cancel anytime.</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.featured
                  ? 'bg-blue-600 text-white shadow-xl scale-105'
                  : 'bg-white text-gray-900 shadow-sm border border-gray-200'
              }`}
            >
              <h2 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${
                plan.featured ? 'text-blue-200' : 'text-blue-600'
              }`}>
                {plan.name}
              </h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={`text-sm ${plan.featured ? 'text-blue-200' : 'text-gray-500'}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`text-sm mb-6 ${plan.featured ? 'text-blue-100' : 'text-gray-500'}`}>
                {plan.description}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <span className={plan.featured ? 'text-blue-200' : 'text-green-500'}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-colors ${
                plan.featured
                  ? 'bg-white text-blue-600 hover:bg-blue-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Option B — Dashboard Header + Sidebar

If the exercise specifies this pattern, build a professional admin sidebar:

```tsx
// Sidebar with icons, active state, sections, and user avatar at the bottom
// Header with breadcrumbs, search, notification bell, and avatar
```

### After Building Each Section

Put your clone and the target side by side (or compare in browser). Ask:
- Is the spacing the same?
- Is the font weight the same?
- Is the color the same?
- Are the border radius and shadow the same?

Fix every difference before moving to the next section.

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-66-dsa.js` in this folder.

---

## Tailwind Classes That Cloners Always Forget

| What | Classes |
|------|---------|
| Remove default list style | `list-none` |
| Truncate long text | `truncate` (single line) or `line-clamp-2` |
| Smooth hover transition | `transition-colors duration-200` |
| Focus ring (accessibility) | `focus:outline-none focus:ring-2 focus:ring-blue-500` |
| Sticky header | `sticky top-0 z-50` |
| Visually hidden (but accessible) | `sr-only` |
| Aspect ratio (16:9 video) | `aspect-video` |
| No text selection | `select-none` |
| Disable pointer events | `pointer-events-none` |
| Letter spacing | `tracking-tight` / `tracking-wide` / `tracking-wider` |

---

## End of Day Checklist

- [ ] Opened exercise 34 — read the full spec before starting
- [ ] Decomposed the target UI into sections, layout, spacing, and typography before coding
- [ ] Built each section top-to-bottom, comparing after each one
- [ ] Responsive layout working — at least 2 breakpoints
- [ ] Hover states on buttons and interactive elements
- [ ] Typography matches the target (size, weight, color, spacing)
- [ ] Shadows and border radius match the target
- [ ] No hardcoded pixels — only Tailwind utility classes
- [ ] Completed 3 DSA problems in `day-66-dsa.js`

---

*Cloning is not cheating — it is how every professional learns. The designer who created the target spent hours on the spacing decisions. You learn those decisions by reproducing them.*
