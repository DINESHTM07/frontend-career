# Day 9 — Portfolio Build + Video Introduction Script

> **Goal:** Ship a complete, production-quality personal portfolio website and write a compelling 2-minute video introduction script.

---

## What Was Built Today

### 1. `portfolio/` — Full Portfolio Website

A complete personal portfolio built from scratch with React, Tailwind CSS, and Framer Motion.

**Tech stack:**
- React 18 + Vite
- Tailwind CSS (dark mode via `class` strategy)
- Framer Motion (scroll-triggered animations)
- Lucide React (icons)
- Formspree (contact form backend)

**Sections built:**

| Section | Highlights |
|---|---|
| **Navbar** | Sticky, scroll-aware blur, hamburger mobile menu, dark mode toggle |
| **Hero** | Typewriter effect cycling 4 titles, animated gradient blobs, CTA buttons, bounce scroll indicator |
| **About** | 5 story cards (ECE → novel → recovery → self-taught → why frontend) + quick stats row + long-form personal narrative |
| **Skills** | Chip grid organized by category (Core / Framework / Styling / Tools) + animated proficiency bars for 10 skills |
| **Projects** | Card grid with tag color system, screenshot placeholders, featured/rest split, GitHub + live links |
| **Book** | 3D book cover effect, floating stat badges, engineering parallel callout, Formspree-ready publish link |
| **Contact** | Formspree form with loading/success/error states + social links + availability badge + location |
| **Footer** | Nav links, social links, back-to-top button |

**Architecture decisions:**

- `src/data/projects.js` — single source of truth for all project cards; adding a project requires editing only this one file
- `src/hooks/useDarkMode.js` — persists in `localStorage`, respects `prefers-color-scheme` on first visit
- `src/utils/animations.js` — shared Framer Motion variants (fadeUp, stagger, slideLeft, slideRight, scaleIn) reused across all sections
- Mobile-first responsive throughout — tested at 375px, 768px, 1280px

**File structure:**
```
portfolio/
├── src/
│   ├── components/       (8 components)
│   ├── data/projects.js  ← edit this to add projects
│   ├── hooks/
│   └── utils/
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md             ← setup + personalization checklist
```

**Build output:** `✓ built in 5.02s` — 306KB JS (96KB gzip), 36KB CSS (6KB gzip)

---

### 2. `portfolio/video-script.md` — 2-Minute Video Introduction Script

A fully written, naturally worded video script for use on LinkedIn, portfolio, and job applications.

**Structure:**

| Section | Duration | Content |
|---|---|---|
| Greeting | 0:05 | Name, location, intent |
| Who you are | 0:30 | ECE background → systems thinking → React |
| Your story | 0:30 | Recovery → 250K-word novel → frontend discovery |
| What you've built | 0:30 | Dashboard, e-commerce, portfolio, interview vault |
| What makes you different | 0:20 | Published author + AI-native mindset |
| Call to action | 0:10 | Looking for frontend roles, links below |

**Also includes:**
- Full read-through script (no section breaks — single flow)
- Per-section delivery notes (emphasis, pacing, body language cues)
- Timing guide with cumulative timestamps
- Recording tips: camera setup, lighting, framing, audio
- Delivery tips: speaking pace, pause placement, take count
- Post-production tips: mute review, subtitle recommendation
- Where to post: LinkedIn native video, portfolio embed, cover letters

---

## Personalization Checklist (before going live)

### Portfolio
- [ ] `src/components/Contact.jsx` — add Formspree URL + real email + LinkedIn URL
- [ ] `src/components/Book.jsx` — add book title, description, publish URL, cover image
- [ ] `src/components/Hero.jsx` + `Footer.jsx` — update LinkedIn href
- [ ] `src/data/projects.js` — replace 3 placeholder projects with real ones + live URLs
- [ ] `public/projects/` — add real screenshots (named to match `image` field)

### Video
- [ ] Do 3–5 takes — take 1 is always stiff
- [ ] Trim first/last 0.5 seconds of recording
- [ ] Add subtitles before posting to LinkedIn
- [ ] Link video in portfolio Hero section

---

## How to Run the Portfolio

```bash
cd portfolio
npm install   # already done
npm run dev   # → http://localhost:5173
npm run build # production build → dist/
```

---

## Key Files

| File | Purpose |
|---|---|
| `portfolio/src/data/projects.js` | Add/edit projects here — no other changes needed |
| `portfolio/src/hooks/useDarkMode.js` | Dark mode with localStorage persistence |
| `portfolio/src/utils/animations.js` | Shared Framer Motion variants |
| `portfolio/README.md` | Full setup + deploy guide (Vercel, Netlify, GitHub Pages) |
| `portfolio/video-script.md` | 2-minute video introduction script + recording tips |
| `resume/resume-content.md` | Complete one-page resume content — all sections, ATS checklist |

---

### 3. `resume/resume-content.md` — One-Page Resume Content

Complete resume content for Dinesh S, ready to paste into any resume builder or Word/Google Docs template.

**Sections:**

| Section | Content |
|---|---|
| **Header** | Name, title, duke02101@gmail.com, LinkedIn, GitHub, portfolio placeholder |
| **Summary** | 3-line ATS-friendly summary with tailoring tips for startup vs enterprise |
| **Technical Skills** | 6-category table + flat ATS version for copy-paste |
| **Projects** | 3 placeholder projects with 3 impact-focused bullets each |
| **Education** | BE ECE — GCE Thanjavur (2022–2025) · Diploma ECE — KSRIT (2019–2022) |
| **Publications** | 250,000-word fantasy novel with resume bullet version |

**Also included:**
- One-page layout guide (line budget per section, font and margin recommendations)
- ATS checklist (8 items — file format, naming, no tables, keyword matching)
- Cover letter opener template (copy-paste and adapt per application)
- Tips for tailoring summary and project bullets per job description

---

*Portfolio shipped. Resume written. Script ready. Next: record the video, deploy to Vercel, build the PDF resume.*
