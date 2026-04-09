# Day 67 — Polish ALL 3 Projects

**Status:** 📋 READY TO START
**Week:** 10 | **Theme:** Testing + Polish + Open Source

---

## Today's Goal

Today you make all three deployed projects recruiter-proof. Clean code, good READMEs, consistent styling, no console errors, no broken links. By end of today, you can hand any of these three URLs to a recruiter with confidence.

By end of today:
- All 3 projects pass a full quality check
- All 3 projects have professional READMEs
- All 3 projects have clean, commented code with no debug artifacts
- Consistent styling and dark mode work correctly on all 3 live URLs

---

## Morning (8:00 – 11:00 AM) — E-Commerce Polish

Open your live e-commerce URL. Go through every page as if you are a recruiter seeing it for the first time.

### Code Quality
- [ ] Search Ctrl+Shift+F for `console.log` — remove ALL of them
- [ ] Search for commented-out code — remove it
- [ ] Search for unused imports — remove them (TypeScript will flag these as warnings)
- [ ] Search for `TODO:` or `FIXME:` comments — either fix them or remove them
- [ ] All variable names are meaningful (`product` not `p`, `filteredProducts` not `arr`)

### Functionality
- [ ] Home → product grid loads (with skeleton if using React Query)
- [ ] Search: type "shirt" → filters to shirts → clear → all products return
- [ ] Category filter: click Electronics → only electronics → click All → all return
- [ ] Search + category combined: works correctly
- [ ] Product detail: click any product card → correct detail page → back button works
- [ ] Add to cart from product card AND from detail page — both work
- [ ] Cart page: adjust quantity → total updates → remove item → total updates
- [ ] Cart persists on page refresh (Zustand persist middleware)
- [ ] Favorites: add → heart fills → go to /favorites → they appear → remove → gone
- [ ] Favorites persist on page refresh
- [ ] Dark mode: toggle → all pages → persists on refresh

### Responsive Check (DevTools)
- [ ] 375px: no horizontal scroll, readable text, single column
- [ ] 768px: grid shows 2 columns
- [ ] 1280px: full layout

### Write the README

In `project-starters/ecommerce-starter/`, create or update `README.md`:

```markdown
# E-Commerce Product Explorer

A full-featured product browsing app built with React 18, Tailwind CSS, and Zustand.

**Live:** [your-url.vercel.app](https://your-url.vercel.app)
**GitHub:** [link]

## Features
- Product grid with search (debounced), category filter, and sort — all work together
- Product detail pages with dynamic routing (`/product/:id`)
- Cart with quantity controls and Zustand persistence across page refreshes
- Favorites with heart toggle, also persisted
- Dark mode — persists across sessions
- Loading skeletons during API calls
- Responsive — works on mobile and desktop

## Tech Stack
React 18 · React Router v6 · Zustand · TanStack Query · Tailwind CSS · Vite

## Running Locally
\`\`\`bash
npm install
npm run dev
\`\`\`
```

---

## Midday (11:20 AM – 1:30 PM) — Dashboard + Next.js Polish

### Dashboard Polish

Open your live dashboard URL. Apply the same quality check:

- [ ] All 4 pages render correctly: Overview, Analytics, Reports, Settings
- [ ] Sidebar toggle collapses and expands — state persists on the same session
- [ ] All 4 Recharts charts render — hover tooltips work
- [ ] StatCards show correct trend indicators (▲ green, ▼ red)
- [ ] Reports page: CSV export button downloads a file — open it, data is correct
- [ ] Dark mode works on all pages — charts readable in dark mode
- [ ] Responsive at 375px: sidebar collapses, cards stack, charts resize

Write `project-starters/dashboard-starter/README.md`:

```markdown
# Analytics Dashboard

A data visualization dashboard with 4 chart types, dark mode, and CSV export.

**Live:** [your-url.vercel.app](https://your-url.vercel.app)
**GitHub:** [link]

## Features
- 4 chart types: Line (revenue), Bar (users), Pie (revenue by product), Area (user growth)
- KPI stat cards with trend indicators (▲/▼ with color)
- Orders table with status badge variants
- CSV export — downloads order data as a formatted .csv file
- Dark mode — class strategy with Tailwind + localStorage persistence
- Responsive — sidebar collapses on mobile, charts resize

## Tech Stack
React 18 · TypeScript · Recharts · Tailwind CSS · React Router v6 · Vite

## Running Locally
\`\`\`bash
npm install
npm run dev
\`\`\`
```

### Next.js Project Polish

Open your live Next.js URL. Apply the quality check:

- [ ] All pages load — view source on each page: `<title>` and `<meta description>` present
- [ ] Dynamic routes work (`/posts/some-slug` loads correct content)
- [ ] 404 page shows for unknown routes
- [ ] Dark mode works on all pages — persists on refresh
- [ ] `next/image` used for all images — open DevTools Network → Images: `.webp` format served
- [ ] `next/link` used for all internal navigation
- [ ] `npm run build` → zero TypeScript errors, zero warnings
- [ ] No console errors in browser on any page

Write or update `project-starters/nextjs-starter/README.md`:

```markdown
# [Your App Name]

[One sentence: what this app does and who it's for.]

**Live:** [your-url.vercel.app](https://your-url.vercel.app)
**GitHub:** [link]

## Features
- Server Components for zero-JS data pages — fast initial load
- [Feature 2 specific to your app]
- [Feature 3 specific to your app]
- Dark mode with next-themes — persists across sessions
- SEO metadata on every page with Next.js Metadata API
- Optimized images via next/image (WebP, responsive srcset)
- TypeScript throughout — zero `any` types
- Deployed on Vercel

## Tech Stack
Next.js 15 · TypeScript · Tailwind CSS · Shadcn/UI · React 19

## Running Locally
\`\`\`bash
npm install
npm run dev
\`\`\`
\`\`\`
```

---

## Afternoon (1:30 – 3:00 PM) — Cross-Project Consistency Check + DSA

### Consistency Check

Look at all 3 projects together. Ask:

1. **Styling consistency** — do they all have a similar visual quality level? If one looks noticeably worse, spend 20 minutes on it.
2. **README consistency** — all 3 have live URL, GitHub link, features list, tech stack, run instructions?
3. **Dark mode** — all 3 have dark mode? (If not, add it.)
4. **Responsive** — all 3 work at 375px?
5. **Testing** — all 3 have tests that pass?

### DSA

Solve 3 DSA problems. Create `day-67-dsa.js` in this folder.

---

## End of Day Checklist

**E-Commerce:**
- [ ] Zero console.log, dead code, unused imports
- [ ] All 5 features work on the live URL
- [ ] README written with live URL, features, tech stack
- [ ] Responsive at 375px

**Dashboard:**
- [ ] All 4 pages work — charts render, CSV exports
- [ ] README written
- [ ] Responsive and dark mode working on live URL

**Next.js:**
- [ ] `<title>` in every page's source HTML
- [ ] `npm run build` zero errors
- [ ] README written — features are specific to YOUR app, not generic
- [ ] Dark mode working on live URL

**All 3:**
- [ ] 3 live URLs you can share with anyone
- [ ] 3 clean GitHub repos with professional READMEs
- [ ] 3 portfolio entries with live URLs

**DSA:**
- [ ] Completed 3 DSA problems in `day-67-dsa.js`

---

*Polish is the difference between "I built this" and "I ship this." Today you cross that line.*
