# Day 3 — Cheatsheet Arsenal: Tools, Frameworks & Workflow

**Date:** Week 1, Day 3 of the 90-day frontend career journey.

**Theme:** Build a reference library of everything a working frontend developer actually uses daily — from Next.js and TypeScript to Git, deployment, accessibility, and beyond.

---

## What Was Created Today

### Cheatsheets — `cheatsheets/` (10 files)

Each cheatsheet follows the same structure: **CONCEPT → WHY IT MATTERS → EXAMPLES → COMMON MISTAKES → INTERVIEW TIP**

| # | File | Topic | Examples |
|---|------|--------|----------|
| 01 | `01-nextjs.md` | Next.js 14+ App Router | 13 examples: routing, Server/Client Components, SSG, API routes, middleware, Image, Metadata, navigation |
| 02 | `02-typescript-react.md` | TypeScript for React | 10 examples: typing props, useState, events, API responses, custom hooks, generics, utility types, discriminated unions |
| 03 | `03-tailwind.md` | Tailwind CSS | 12 examples: responsive design, flexbox, grid, spacing, typography, colors, dark mode, transitions, config, @apply, group/peer |
| 04 | `04-shadcn-ui.md` | Shadcn/UI | 11 examples: setup, Button, Card, Input, Dialog, Sheet, Toast/Sonner, Select, Form + RHF + Zod, Skeleton |
| 05 | `05-git-commands.md` | Complete Git Reference | 15 examples: full lifecycle, merge conflict resolution, rebase, stash, reset, cherry-pick, feature branch workflow |
| 06 | `06-vscode-shortcuts.md` | VS Code Shortcuts & Extensions | 15 shortcut categories + 6 essential React dev extensions + settings.json config |
| 07 | `07-deployment.md` | Vercel & Netlify Deployment | 8 examples: step-by-step Vercel, env vars, preview deploys, custom domains, Serverless vs Edge, Netlify comparison, CLI |
| 08 | `08-api-integration.md` | API Integration in Frontend | 10 examples: GET/POST/DELETE, error handling, loading states, AbortController, axios vs fetch, CORS, proxy pattern, public APIs |
| 09 | `09-framer-motion.md` | Framer Motion Animations | 8 examples: motion components, animate/initial/exit, transitions, variants, AnimatePresence, whileHover/whileTap, layout, scroll |
| 10 | `10-accessibility.md` | Web Accessibility (a11y) | 10 examples: semantic HTML, ARIA, keyboard nav, skip links, forms, color contrast, alt text, focus trap, Lighthouse |

**Total cheatsheet content:** ~3,960 lines across 10 files

---

## Key Concepts Covered

### Framework & Language
- Next.js App Router: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- Server Components vs Client Components (`'use client'` directive)
- TypeScript: interfaces, utility types, event typing, discriminated unions
- Tailwind CSS: responsive design, dark mode, custom config

### UI & Components
- Shadcn/UI setup, every major component with code examples
- Framer Motion: entrance animations, exit animations, spring physics, stagger effects

### Developer Workflow
- VS Code: 15+ shortcut categories, 6 essential extensions
- Git: complete reference from init to cherry-pick
- API integration: proper error handling, CORS, security patterns

### Production & Deployment
- Vercel: full deployment workflow, preview deploys, Edge vs Serverless
- Environment variables: security patterns, `NEXT_PUBLIC_` prefix rules

### Quality & Accessibility
- WCAG contrast requirements (4.5:1 minimum)
- ARIA attributes: label, hidden, live, expanded, current
- Focus management, focus traps, keyboard navigation

---

## Quick Reference: Interview Tips From Today's Cheatsheets

1. **Next.js**: "Server Components run on the server with no JS in bundle; Client Components are opt-in with `'use client'`"
2. **TypeScript**: "Use `interface` for object shapes, `type` for unions and aliases — know discriminated unions for component variants"
3. **Tailwind**: "Utility-first: compose classes in markup; extract React components (not CSS classes) for reuse"
4. **Shadcn**: "Not a library — it copies code into your project via `npx shadcn-ui@latest add`. You own it."
5. **Git**: "Rebase for local cleanup, merge for shared branches; use `git revert` on main, never `git reset --hard`"
6. **Deployment**: "Every branch gets a preview URL on Vercel; prefix public env vars with `NEXT_PUBLIC_`"
7. **APIs**: "`fetch` only throws on network errors — always check `response.ok` for HTTP errors (4xx/5xx)"
8. **Accessibility**: "Semantic HTML first, ARIA where HTML falls short, always test keyboard navigation"

---

## How to Use These Cheatsheets

**Daily review:** Pick one cheatsheet per day and skim the examples. Don't memorize — build familiarity.

**Before interviews:** Re-read the INTERVIEW TIP section of each file. Each one is a framework for answering real interview questions.

**While building:** Keep the relevant cheatsheet open in a side panel. Refer to examples instead of Googling basic syntax.

**For blogging:** Each cheatsheet has enough material for 2-3 blog posts. The "COMMON MISTAKES" sections are especially good for educational content.

---

## Files in This Directory

```
day-03/
├── README.md              ← this file
└── cheatsheets/
    ├── 01-nextjs.md
    ├── 02-typescript-react.md
    ├── 03-tailwind.md
    ├── 04-shadcn-ui.md
    ├── 05-git-commands.md
    ├── 06-vscode-shortcuts.md
    ├── 07-deployment.md
    ├── 08-api-integration.md
    ├── 09-framer-motion.md
    └── 10-accessibility.md
```

---

*Day 3 complete. 10 cheatsheets. ~4,000 lines of reference material.*
*Next: Day 4 — Start applying these tools by building a real project.*
