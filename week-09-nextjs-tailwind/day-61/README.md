# Day 61 — Project 3: Finish + Deploy + Update Portfolio + Resume

**Status:** 📋 READY TO START
**Week:** 9 | **Theme:** Next.js + Tailwind

---

## Today's Goal

Ship Project 3. Finish remaining features, run through the quality checklist, deploy to Vercel, update your portfolio and resume, post on LinkedIn.

By end of today:
- Project 3 live on Vercel with a public URL
- Portfolio shows 3 deployed projects
- Resume updated with Project 3 bullets
- LinkedIn post published

---

## Morning (8:00 – 11:00 AM) — Finish + Quality Check

### Step 1 — Finish Remaining Features

Look at your Day 60 progress assessment. Finish whatever is left, prioritizing:
1. Any broken features
2. Missing pages (404, empty states)
3. Mobile responsiveness

Do not add new features. Finish what you started.

### Step 2 — Final Quality Checklist

Work through this systematically. Do not skip items.

**Functionality:**
- [ ] All nav links work — no 404s on expected routes
- [ ] Dark mode toggle works on all pages, persists on refresh
- [ ] All forms validate — empty submissions are blocked
- [ ] Dynamic routes work — `/posts/some-slug` loads correctly
- [ ] `notFound()` called correctly — 404 page shows for unknown IDs/slugs
- [ ] API routes return correct status codes (200, 201, 400, 404)
- [ ] Search/filter (if present) works correctly with all combinations

**Metadata:**
- [ ] Every page has a `metadata` export with `title` and `description`
- [ ] Dynamic pages have `generateMetadata`
- [ ] View page source — `<title>` and `<meta description>` are in the HTML

**Performance + Quality:**
- [ ] No `console.log` statements in any file
- [ ] No unused imports
- [ ] `npm run build` — zero TypeScript errors, zero warnings
- [ ] `next/image` used for all images (no plain `<img>` tags)
- [ ] `Link` from `next/link` used for all internal navigation (no plain `<a>` for internal links)

**Responsive:**
- [ ] All pages look correct at 375px (mobile)
- [ ] No horizontal scroll on mobile
- [ ] No text overflow or broken layout at any screen size

**Dark mode:**
- [ ] All pages readable in dark mode — no invisible text, no white boxes
- [ ] Recharts or other third-party components look correct in dark mode (if applicable)

---

## Midday (11:20 AM – 1:00 PM) — Deploy to Vercel

### Step 1 — Production Build Test

```bash
npm run build
npm run start  # or npm run preview
```

Visit `localhost:3000` (or `:4173`) and test every page. Fix any build errors before deploying.

### Step 2 — Create GitHub Repo

```bash
cd project-starters/nextjs-starter

git init
git add .
git commit -m "Initial commit: Project 3 Next.js App"

# Create new GitHub repo: nextjs-project-3 (or name it after your app's theme)
git remote add origin https://github.com/YOUR_USERNAME/nextjs-project-3.git
git branch -M main
git push -u origin main
```

### Step 3 — Deploy on Vercel

1. Go to **vercel.com** → New Project
2. Import `nextjs-project-3`
3. Vercel auto-detects Next.js — confirm:
   - Framework: **Next.js** (auto-detected)
   - Build Command: `npm run build` (auto)
   - Output Directory: `.next` (auto)
4. Add any environment variables if needed (if you used `.env.local`)
5. Click Deploy → wait for green ✓
6. Copy your live URL

**Test the live URL:**
- Every page loads
- Dark mode works and persists
- API routes work (if applicable)
- Mobile layout looks correct
- No JavaScript console errors

---

## Afternoon (1:30 – 4:00 PM) — Portfolio + Resume + LinkedIn

### Step 1 — Update Portfolio

Open `portfolio/data/projects.js`. Add Project 3:

```js
{
  name: "Project 3 — [Your App Name]",
  description: "Full-stack Next.js application with TypeScript, Tailwind CSS, and Shadcn/UI. [Describe what your app actually does]. Server Components for data fetching, Client Components for interactivity. Dark mode, responsive, deployed on Vercel.",
  techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Shadcn/UI", "React"],
  liveUrl: "https://your-project.vercel.app",     // PASTE REAL URL
  githubUrl: "https://github.com/YOUR_USERNAME/nextjs-project-3",
  featured: true,
}
```

Push portfolio — Vercel auto-deploys. Confirm the new project is visible on your live portfolio.

### Step 2 — Update Resume

Open `resume/resume-content.md`. Add to Projects section:

```markdown
**[Your App Name]** | [Live](https://your-url.vercel.app) | [GitHub](https://github.com/your/repo)
- Built a full-stack web application with Next.js App Router — Server Components for zero-JS data pages, Client Components for interactive features
- Implemented [key feature] using [technology] — describe the impact or scale
- Integrated Shadcn/UI component library with custom dark mode via next-themes and Tailwind CSS variables
- Typed all components, API routes, and data models with TypeScript — zero `any` types
- Deployed on Vercel with optimized images (next/image), SEO metadata, and proper HTTP status codes
Tech: Next.js 15, TypeScript, Tailwind CSS, Shadcn/UI, React 19
```

Replace the bracketed placeholders with your actual project details. These bullets are interview-ready — each describes WHAT you did and HOW, not just WHAT the app is.

### Step 3 — LinkedIn Post

Post this today. Do not schedule for later.

> Just shipped Project 3 — built with Next.js, TypeScript, Tailwind, and Shadcn/UI!
>
> What's inside:
> ✅ Next.js App Router — Server Components for fast, zero-JS pages
> ✅ TypeScript throughout — zero `any` types, full type safety
> ✅ Shadcn/UI — accessible, customizable components I own the code for
> ✅ Dark mode with next-themes — persists across sessions
> ✅ SEO metadata on every page — title templates + OpenGraph
> ✅ Optimized images with next/image — WebP, responsive srcset
> ✅ Responsive design — works on mobile and desktop
>
> Tech: Next.js, TypeScript, Tailwind CSS, Shadcn/UI
>
> Live: [paste URL]
> GitHub: [paste URL]
>
> 3 deployed projects. Week 9 of 12 done.
>
> #nextjs #typescript #react #tailwindcss #frontend #buildinpublic

---

## End of Day Checklist

**Quality:**
- [ ] All pages pass the full quality checklist above
- [ ] `npm run build` — zero errors, zero TypeScript warnings
- [ ] No `console.log` anywhere

**Deploy:**
- [ ] Production build tested locally before deploying
- [ ] GitHub repo created for Project 3
- [ ] Deployed to Vercel — have a live URL
- [ ] Live URL fully tested — all pages, all features

**Portfolio + Resume:**
- [ ] `portfolio/data/projects.js` updated with Project 3 (real live URL)
- [ ] Portfolio deployed — 3 projects now visible
- [ ] `resume/resume-content.md` updated with 5 impact-first bullets for Project 3

**Content:**
- [ ] LinkedIn post published — not drafted, actually posted — with live URL

**Monorepo:**
- [ ] Final commit pushed to `frontend-career` main
- [ ] Live URL: _______________
- [ ] GitHub repo URL: _______________
- [ ] LinkedIn post URL: _______________

---

## Week 9 Reflection

Write in `journal.md` — **"Week 9: Next.js and the Server/Client Split"**:

- What was the hardest concept this week? (Server vs Client? Metadata? Route Handlers?)
- What did you build that you couldn't have built before this week?
- Name one decision you made differently from the complete version — and why
- What would you add to Project 3 if you had two more days?

---

*Three deployed projects. Three live URLs. Three things to show a recruiter. That is what Week 9 built.*
