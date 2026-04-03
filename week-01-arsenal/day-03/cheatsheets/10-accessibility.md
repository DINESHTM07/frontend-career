# Web Accessibility (a11y) Cheatsheet

---

## CONCEPT

Web accessibility (a11y — "a" + 11 letters + "y") means building websites that everyone can use, including people who are blind, deaf, have motor impairments, or cognitive disabilities. Accessibility relies on three pillars: **semantic HTML** (use the right element for the job), **ARIA** (add meaning where HTML falls short), and **keyboard navigation** (every interaction must work without a mouse).

**Key mental model:** If a screen reader can understand your page, and a keyboard user can navigate it, you're most of the way there.

---

## WHY IT MATTERS

**Legal**: The ADA (Americans with Disabilities Act) and WCAG 2.1 are legally enforceable. Companies like Target, Domino's, and Netflix have faced lawsuits for inaccessible websites.

**Business**: ~15% of the world's population has some form of disability. Inaccessible sites lose these users.

**SEO**: Screen readers and search engine crawlers work similarly — semantic HTML that screen readers understand is also better for SEO.

**Ethics**: The web was designed to be for everyone.

**Interview**: Accessibility questions appear at senior/mid-level interviews. Most candidates can't answer them — you can differentiate yourself.

---

## EXAMPLES

### 1. Semantic HTML — use the right element

```html
<!-- BAD — div soup, no meaning for screen readers or SEO -->
<div class="header">
  <div class="nav">
    <div class="nav-item">Home</div>
    <div class="nav-item">About</div>
  </div>
</div>
<div class="main-content">
  <div class="article">
    <div class="title">My Post</div>
    <div class="content">...</div>
  </div>
</div>
<div class="footer">...</div>

<!-- GOOD — semantic landmarks screen readers announce -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>My Post</h1>
    <p>Content...</p>
  </article>
  <aside>
    <h2>Related Posts</h2>
  </aside>
</main>
<footer>
  <p>© 2024</p>
</footer>

<!-- Semantic element reference:
  <header>    — site header or section header
  <nav>       — navigation links
  <main>      — primary content (one per page)
  <article>   — self-contained content (blog post, comment)
  <section>   — thematic grouping (needs a heading)
  <aside>     — supplementary content (sidebar)
  <footer>    — footer for page or section
  <figure>    — image with caption
  <figcaption>— caption for <figure>
  <time>      — dates and times
  <address>   — contact information
-->
```

### 2. Heading hierarchy

```html
<!-- BAD — headings chosen for visual size, not structure -->
<h1>Blog</h1>
<h3>Latest Post</h3>   <!-- skipped h2 — confuses screen reader users -->
<h1>Post Title</h1>    <!-- two h1s — no clear document structure -->

<!-- GOOD — one h1 per page, logical hierarchy -->
<h1>My Blog</h1>          <!-- Page title — only one -->
  <h2>Latest Posts</h2>
    <h3>Post Title One</h3>
    <h3>Post Title Two</h3>
  <h2>Categories</h2>
    <h3>Technology</h3>
    <h3>Design</h3>

<!-- Screen reader users navigate by headings — it's like a table of contents -->
<!-- Rule: never skip heading levels (h1 → h3 with no h2) -->
```

### 3. ARIA — Accessible Rich Internet Applications

```html
<!-- aria-label — provide a name when visual text is absent -->
<button aria-label="Close dialog">
  <XIcon />   <!-- icon-only button has no visible text -->
</button>

<nav aria-label="Breadcrumb">  <!-- distinguish from main nav -->
<nav aria-label="Footer navigation">

<!-- aria-labelledby — reference another element as the label -->
<h2 id="section-title">Recent Posts</h2>
<section aria-labelledby="section-title">
  ...
</section>

<!-- aria-hidden — hide decorative elements from screen readers -->
<span aria-hidden="true">→</span>  <!-- decorative arrow -->
<img src="decorative-bg.jpg" aria-hidden="true" alt="" />

<!-- aria-live — announce dynamic content changes -->
<div aria-live="polite">    <!-- announces changes without interrupting -->
  {status}                  <!-- e.g., "3 results found" -->
</div>
<div aria-live="assertive">  <!-- interrupts current speech — use sparingly -->
  {criticalError}
</div>

<!-- aria-expanded — for dropdowns, accordions, menus -->
<button aria-expanded={isOpen} aria-controls="menu">
  Menu
</button>
<ul id="menu" hidden={!isOpen}>...</ul>

<!-- aria-current — mark active item in navigation -->
<a href="/about" aria-current="page">About</a>

<!-- role — when HTML element doesn't exist for the pattern -->
<div role="alert">Error: Invalid email address</div>   <!-- announces immediately -->
<div role="status">Saving...</div>
<div role="tablist">
  <button role="tab" aria-selected="true">Tab 1</button>
  <button role="tab" aria-selected="false">Tab 2</button>
</div>
```

### 4. Keyboard navigation

```tsx
// Every interactive element must be keyboard-accessible
// Native elements (button, a, input, select) are keyboard-accessible by default
// Custom elements need tabIndex and keyboard handlers

// BAD — div is not focusable by keyboard
<div onClick={handleClick} className="btn">Submit</div>

// GOOD — use the correct semantic element
<button onClick={handleClick} className="btn">Submit</button>

// If you must use a non-button element (rare):
<div
  role="button"
  tabIndex={0}           // Makes it focusable
  onClick={handleClick}
  onKeyDown={(e) => {    // Handle Enter and Space (button behavior)
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
>
  Custom button
</div>

// tabIndex values:
// tabIndex={0}    — adds to tab order in DOM sequence
// tabIndex={-1}   — focusable programmatically but NOT in tab order
//                   (use for modal focus management)
// tabIndex={1+}   — explicit order — avoid! creates maintenance nightmare
```

### 5. Skip links — keyboard users shouldn't tab through nav 50 times

```tsx
// Place at the very top of the page, before anything else
// Visible only when focused (common pattern)

// globals.css
.skip-link {
  position: absolute;
  top: -100%;
  left: 1rem;
  z-index: 9999;
  padding: 0.5rem 1rem;
  background: #000;
  color: #fff;
}
.skip-link:focus {
  top: 1rem;   // Appears when keyboard user tabs to it
}

// layout.tsx
<>
  <a href="#main-content" className="skip-link">
    Skip to main content
  </a>
  <Header />
  <main id="main-content" tabIndex={-1}>  {/* tabIndex={-1} so it can be focused by href */}
    {children}
  </main>
</>
```

### 6. Form accessibility

```tsx
// Every input needs a <label> with matching htmlFor/id
<div className="space-y-2">
  <label htmlFor="email">Email address</label>
  <input
    id="email"
    type="email"
    name="email"
    required
    aria-required="true"
    aria-describedby="email-hint email-error"  // Can reference multiple elements
    autoComplete="email"
  />
  <p id="email-hint" className="text-sm text-gray-500">
    We'll never share your email.
  </p>
  {error && (
    <p id="email-error" role="alert" className="text-red-500 text-sm">
      {error}
    </p>
  )}
</div>

// Fieldset + legend for grouped inputs (radio buttons, checkboxes)
<fieldset>
  <legend>Preferred contact method</legend>
  <label>
    <input type="radio" name="contact" value="email" /> Email
  </label>
  <label>
    <input type="radio" name="contact" value="phone" /> Phone
  </label>
</fieldset>

// Required fields
<label htmlFor="name">
  Full Name
  <span aria-hidden="true" className="text-red-500"> *</span>
</label>
<input id="name" type="text" required aria-required="true" />
<p className="sr-only">Fields marked with * are required</p>
```

### 7. Color contrast and visual design

```
WCAG contrast requirements:
  Normal text (< 18px):   4.5:1 minimum ratio
  Large text (≥ 18px):    3:1 minimum ratio
  UI components:          3:1 minimum ratio

Common failures:
  Gray on white:  #999999 on #ffffff = 2.85:1 ❌ (fails AA)
  Gray on white:  #767676 on #ffffff = 4.54:1 ✅ (passes AA)
  Blue link:      #4d90fe on white = 3.0:1   ❌ (fails for normal text)
  Blue link:      #1a56db on white = 5.18:1  ✅ (passes AA)

Tools to check contrast:
  - WebAIM Contrast Checker: webaim.org/resources/contrastchecker
  - Chrome DevTools: Elements → Accessibility tab (shows contrast ratio)
  - Coolors Contrast Checker: coolors.co/contrast-checker
  - axe DevTools browser extension

Tailwind color contrast quick reference:
  ✅ text-gray-700 on white (#374151, 10.7:1)
  ✅ text-gray-600 on white (#4B5563, 7.0:1)
  ⚠️ text-gray-400 on white (#9CA3AF, 3.0:1) — only for large text
  ❌ text-gray-300 on white (#D1D5DB, 1.5:1) — never use for text

Don't rely on color alone:
  ❌ Red text = error, green text = success (colorblind users can't distinguish)
  ✅ Red text + error icon + descriptive message
```

### 8. Alt text for images

```tsx
// Descriptive alt text — describe what's in the image
<img src="/product.jpg" alt="Red running shoes with white sole, size 10" />

// Context-dependent — describe what's relevant for the page
// On a news article:
<img src="/photo.jpg" alt="President signing the climate bill on July 4th" />
// On a photo gallery:
<img src="/photo.jpg" alt="Sunset over the Pacific Ocean from Big Sur" />

// Decorative images — empty alt attribute (not missing, empty)
<img src="/decorative-divider.png" alt="" />  // Screen reader skips it

// Background images via CSS — use aria-label or aria-hidden
<div
  style={{ backgroundImage: 'url(/hero.jpg)' }}
  aria-label="Hero: team collaborating in a modern office"
  role="img"
>

// Icons
<button>
  <SearchIcon aria-hidden="true" />  // Hide icon from screen reader
  <span>Search</span>                // Let the text label the button
</button>

// Icon-only button
<button aria-label="Search">
  <SearchIcon aria-hidden="true" />  // Hide icon (button's aria-label is the label)
</button>
```

### 9. Focus management in React — modal focus trap

```tsx
// When a modal opens, focus should move into it
// When it closes, focus should return to the trigger button
// While open, Tab should NOT leave the modal (focus trap)

import { useEffect, useRef } from 'react'

function Modal({ isOpen, onClose, triggerRef, children }) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    // Move focus into modal when it opens
    const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()

    // Focus trap
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key !== 'Tab') return

      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Return focus to trigger when modal closes
      triggerRef.current?.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title">Dialog Title</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  )
}

// Note: Use Radix UI (which shadcn is built on) for production —
// it handles all of this automatically and correctly
```

### 10. Lighthouse accessibility audit

```
How to run:
  1. Open Chrome DevTools (F12)
  2. Click "Lighthouse" tab
  3. Check "Accessibility"
  4. Click "Analyze page load"
  5. Review scored issues (0-100)

What it checks:
  - Color contrast ratios
  - Images with missing alt text
  - Form inputs without labels
  - Missing document title
  - Heading hierarchy violations
  - Keyboard-unreachable interactive elements
  - Missing lang attribute on <html>

Other tools:
  axe DevTools (browser extension) — more detailed than Lighthouse
  WAVE (webaim.org/wave) — visual overlay of issues
  VoiceOver (Mac: Cmd+F5) — actual screen reader
  NVDA (Windows, free) — actual screen reader
  screen reader simulator in Chrome DevTools

The sr-only utility (Tailwind):
  .sr-only {                        // Visually hidden but screen reader accessible
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0);
    white-space: nowrap; border: 0;
  }
  // Usage:
  <span className="sr-only">Loading...</span>
```

---

## COMMON MISTAKES

1. **Using `<div>` and `<span>` for everything** — `<div>` has no semantic meaning. Use `<button>` for buttons, `<a>` for links, `<nav>` for navigation. Native elements are focusable and announce correctly for free.

2. **Placeholder text as a label** — `<input placeholder="Email">` with no `<label>` fails accessibility. The placeholder disappears when the user types and never reads to screen readers as a label.

3. **Missing `alt` attribute entirely** — `<img>` with no `alt` attribute causes screen readers to read the file name ("logo-2x-final-FINAL.png"). Use `alt=""` for decorative images.

4. **`aria-label` on non-interactive elements** — `aria-label` is for interactive elements or landmark regions. It does nothing on a plain `<div>` with no role.

5. **Removing focus outlines without replacing them** — `outline: none` on `:focus` removes the visible keyboard indicator. Replace with a custom styled outline: `focus:ring-2 focus:ring-blue-500`.

6. **Using `tabIndex={1}` or higher** — Positive tabIndex creates a separate tab order before natural DOM order. This is almost always wrong. Use `0` or `-1` only.

7. **Using `display: none` for content that should be screen-reader accessible** — `display: none` hides from both screen readers and visual users. Use `sr-only` / visually-hidden CSS to show to screen readers only.

---

## INTERVIEW TIP

> "How do you approach accessibility in your React applications?"

**Answer framework:**
- "I start with semantic HTML — using `<button>` for buttons, `<nav>` for navigation, proper heading hierarchy. Native elements give me keyboard support and ARIA semantics for free."
- "I use Radix UI-based components (via shadcn/ui) for complex widgets like modals, dropdowns, and tabs — they handle focus trapping, keyboard navigation, and ARIA attributes correctly."
- "I check color contrast during development using Chrome DevTools' built-in contrast checker, aiming for the 4.5:1 WCAG AA requirement."
- "I run Lighthouse audits before shipping and add the `axe` extension to catch issues in development."
- "For dynamic content changes, I use `aria-live` regions so screen readers announce updates like form errors or loading states."

Bonus: Mention that you know accessibility is not just about screen readers — it includes keyboard users, users with cognitive disabilities, and users in low-bandwidth situations. Shows you've thought about it holistically.
