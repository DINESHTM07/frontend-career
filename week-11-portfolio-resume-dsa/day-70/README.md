# Day 70 — Resume Finalize

**Status:** 📋 READY TO START
**Week:** 11 | **Theme:** Portfolio + Resume + DSA

---

## Today's Goal

Turn `resume/resume-content.md` into a polished, ATS-passing PDF resume. By end of today you have one document you can attach to any job application with confidence.

By end of today:
- `resume/resume-content.md` is fully updated with all 3 projects and real details
- A PDF resume exists — either from Canva, Google Docs, or rxresume.me
- The resume passes an ATS checklist
- The resume is one page (or max two pages if you have substantial experience)

---

## What to Open

1. `resume/resume-content.md` — the source of truth for your resume content

---

## Morning (8:00 – 11:00 AM) — Update `resume-content.md`

### Step 1 — Update Every Section

Open `resume/resume-content.md`. Go through every section and make it real.

**Header:**
```markdown
# Dinesh S
Frontend Developer

📧 your.real.email@gmail.com
🔗 linkedin.com/in/your-real-profile
🐙 github.com/your-real-username
🌐 your-real-portfolio.vercel.app
📍 [City, State] — Open to remote
```

**Summary (3 sentences max):**

Write this last — after updating everything else. A good summary is:
- Who you are (frontend developer with X months of intensive training)
- What you can build (React, Next.js, TypeScript, Tailwind)
- What you're looking for (junior frontend developer role)

Example:
```
Frontend developer with 3+ months of intensive full-stack React training.
Built 3 deployed projects: e-commerce, analytics dashboard, and a Next.js app —
each with TypeScript, Tailwind CSS, and automated tests. Seeking a junior frontend
role where I can contribute immediately and grow with a team.
```

**Skills section — be specific:**
```markdown
## Technical Skills

**Languages:** JavaScript (ES2022+), TypeScript, HTML5, CSS3
**Frameworks:** React 18, Next.js 15, Vite
**State Management:** Zustand, TanStack Query (React Query)
**Styling:** Tailwind CSS, Shadcn/UI, Framer Motion
**Testing:** Vitest, React Testing Library
**Tools:** Git, GitHub, Vercel, npm, ESLint
**Concepts:** Server Components, REST APIs, localStorage, responsive design, dark mode
```

**Projects — use the impact-first bullets from each project's deploy day:**

```markdown
## Projects

**E-Commerce Product Explorer** | [Live](URL) | [GitHub](URL)
- Built a full-featured product browsing app with React 18, React Router v6, and Tailwind CSS
- Implemented debounced search + category filter + sort — all combinable simultaneously with useMemo
- Managed cart and favorites with Zustand + localStorage persistence across browser sessions
- Integrated FakeStore API via TanStack Query — caching, loading skeletons, and error handling

**Analytics Dashboard** | [Live](URL) | [GitHub](URL)
- Built a data visualization dashboard with 4 Recharts chart types (Line, Bar, Pie, Area)
- Added CSV export feature — generates formatted .csv file from order data on button click
- TypeScript throughout — all components, props, and API data typed with zero `any` types
- Responsive layout (sidebar collapses on mobile) — dark mode persisted via localStorage

**[Next.js App Name]** | [Live](URL) | [GitHub](URL)
- Built a full-stack web app with Next.js 15 App Router — Server Components for zero-JS data pages
- Implemented SEO Metadata API on every page — title templates, meta descriptions, OpenGraph tags
- Integrated Shadcn/UI with next-themes dark mode — CSS variable theming, persists across sessions
- Deployed on Vercel with optimized images (next/image WebP + responsive srcset)
```

**Education:**
```markdown
## Education

**[Your Degree]** — [Your College/University]
[Year] | [City]

**Frontend Development Intensive** — Self-directed (90-day curriculum)
2026 | Remote
```

### Step 2 — ATS Checklist

ATS (Applicant Tracking System) is software that parses your resume before a human sees it. Many companies use it. If your resume doesn't parse, it doesn't matter how good it is.

Check these:
- [ ] No tables, columns, or text boxes (ATS can't read them)
- [ ] No headers/footers (ATS often skips them)
- [ ] Skills appear as plain text, not icons
- [ ] Job titles use standard terms ("Frontend Developer" not "Code Wizard")
- [ ] File saved as `.pdf` (not `.docx` which may not render correctly)
- [ ] Standard section headings: "Experience", "Projects", "Education", "Skills"
- [ ] No special characters in section headings
- [ ] Contact info is in the main body, not the header
- [ ] URLs are plain text (no hyperlinks that hide the URL)

---

## Midday (11:20 AM – 1:30 PM) — Create the PDF

### Option A — Canva (Recommended for design quality)

1. Go to canva.com → search "resume" → choose a clean, single-column template
2. Choose a template that is:
   - Single column (two-column templates often fail ATS)
   - White background
   - Standard fonts (not script or decorative)
   - Minimal icons (icons don't parse as text)
3. Copy your content from `resume-content.md` section by section into Canva
4. Adjust font sizes: name 24-28pt, section headers 12-14pt, body 10-11pt
5. Keep line spacing generous (1.15-1.5)
6. Download as PDF

### Option B — Google Docs (Recommended for ATS reliability)

1. Go to docs.google.com → create new document
2. Use the "Resume" template (File → New → From template)
3. Copy content from `resume-content.md`
4. Format: File → Page setup → Margins: 0.75 inches all sides
5. File → Download → PDF

### Option C — rxresume.me (Recommended if you want ATS + design)

1. Go to rxresume.me → create account → new resume
2. Fill in each section from `resume-content.md`
3. Choose the "Simple" or "Kakuna" template (clean, ATS-friendly)
4. Download as PDF

### After Creating the PDF

1. **Read it on your phone** — can you read the text without zooming? Is anything cut off?
2. **Send it to yourself by email** — attach the PDF and open it on your phone. If it looks good on mobile email, it looks good everywhere.
3. **Save it as:** `Dinesh_S_Frontend_Developer_Resume.pdf` — specific name, not "resume.pdf"
4. **Move it to `resume/` folder** in the monorepo

---

## Afternoon (1:30 – 3:30 PM) — DSA (5 Problems)

Create `day-70-dsa.js` in this folder. Solve 5 problems.

Focus on problems you've been avoiding. The problems you avoid are the ones that appear in interviews.

---

## The One-Page Rule

Your resume should be one page. You are applying as a junior developer — you do not have 5 years of experience. One page is not a limitation; it is a professional signal that you understand your audience.

If you're going over one page:
- Cut the summary to 2 sentences
- Remove any bullet points that start with "Assisted" or "Helped" — passive language wastes space and credibility
- Each project: max 4 bullets, each bullet max 1.5 lines
- Skills: one line per category, not a list of individual items

---

## End of Day Checklist

**Content:**
- [ ] `resume/resume-content.md` fully updated — all 3 projects with real URLs
- [ ] Summary written (3 sentences max, specific to your situation)
- [ ] Skills section uses exact technology names (React 18, not just "React")
- [ ] Project bullets are impact-first — describe HOW, not just WHAT

**ATS:**
- [ ] Single-column layout
- [ ] No tables, columns, or text boxes
- [ ] Standard section headings
- [ ] Contact info in body (not header/footer)

**PDF:**
- [ ] PDF created — looks professional
- [ ] One page (or justified two pages)
- [ ] Readable on mobile screen
- [ ] Saved as `Dinesh_S_Frontend_Developer_Resume.pdf` in `resume/`

**DSA:**
- [ ] 5 problems solved in `day-70-dsa.js` with complexity notes

---

*A resume gets you an interview. The interview gets you the job. Your resume's job is narrow: get you into the room. Make it clean, specific, and honest.*
