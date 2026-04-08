# Day 11 — Freelance Guide, Mock Interview System, LinkedIn Calendar, Learning Guide, Post Drafts

> **Goal:** Build the full operational layer for the job hunt — how to find clients, how to practice interviews, what to post on LinkedIn, how to keep learning after Pro, and 5 ready-to-post drafts.

---

## What Was Built Today

| File | Location | Purpose |
|---|---|---|
| `freelance-guide.md` | `job-hunt/` | Find local clients, pitch, price, contract, deliver |
| `mock-interview-guide.md` | `job-hunt/` | Pramp setup, self-recording, Top 20 questions, rubric |
| `linkedin-calendar.md` | `job-hunt/` | 30 post ideas mapped to the learning journey |
| `LEARNING-GUIDE.md` | root | Complete guide for self-directed learning after Pro |
| `post-01-closures.md` | `linkedin-post-drafts/` | Ready-to-post: closures explained |
| `post-02-novel-to-code.md` | `linkedin-post-drafts/` | Ready-to-post: novel → software thinking |
| `post-03-event-loop.md` | `linkedin-post-drafts/` | Ready-to-post: event loop explained |
| `post-04-open-to-work.md` | `linkedin-post-drafts/` | Ready-to-post: open to opportunities |
| `post-05-ecc-to-frontend.md` | `linkedin-post-drafts/` | Ready-to-post: ECE to frontend story |

---

## File Summaries

### `job-hunt/freelance-guide.md`

**Part 1 — Finding Local Businesses (Thanjavur / Tamil Nadu)**
- Street-level targeting: hotels, clinics, coaching centres, photographers, boutiques
- Online discovery: Google Maps no-website filter, JustDial, Instagram businesses
- Targeting criteria: they have something to show, they lose money without a site, the owner is reachable

**Part 2 — Pitch Templates**
- In-person walk-in script (word-for-word)
- WhatsApp / phone message template
- Email pitch template
- All three offer the work free in exchange for a testimonial

**Part 3 — Pricing Guide (After Portfolio Phase)**

| Tier | Price Range | Best For |
|---|---|---|
| Basic (3–5 pages) | ₹3,000–₹8,000 | Clinics, coaches |
| Standard (5–8 pages) | ₹8,000–₹18,000 | Restaurants, photographers |
| Pro (CMS, blog) | ₹18,000–₹35,000 | Businesses with regular updates |
| E-commerce | ₹35,000–₹80,000 | Retailers, boutiques |
| Monthly retainer | ₹1,000–₹3,000/mo | Any existing client |

**Part 4 — Contract Template**
- Lightweight agreement for free portfolio projects (what's in, what's out, what client provides, timeline, testimonial clause)
- Paid project add-on clauses (50/50 payment, late fee, ownership transfer)

**Part 5 — Project Management**
- 5-phase process: Discovery → Design → Build → Review → Handoff
- Common scope creep scenarios + prevention rules
- The one rule: everything in writing (WhatsApp counts)

---

### `job-hunt/mock-interview-guide.md`

**Part 1 — Pramp.com Setup (Step by Step)**
- Account creation, interview type selection, scheduling
- What to do before, during, and after each session
- Frequency schedule by phase (1/week → 3–4/week)

**Part 2 — Self-Recording Protocol**
- Camera, lighting, and framing setup
- The 6-step self-recording process (pick → timer → record → watch → score → write one improvement)
- What to watch for in the playback

**Part 3 — Top 20 Questions to Practice First**
- 5 Behavioral (practice these first — every round has them)
- 5 JavaScript core (closures, event loop, `this`, Promises)
- 5 React (setState, hooks rules, useCallback, useLayoutEffect, reconciliation)
- 5 CSS/HTML (box model, flex vs grid, specificity, sticky, semantic HTML)
- Practice order by week (behavioral → JS → React → CSS → full mix)

**Part 4 — Self-Scoring Rubric (0–5 per dimension)**

| Dimension | What It Measures |
|---|---|
| Clarity | Did the answer make sense to someone new? |
| Correctness | Was the technical content accurate? |
| Code Quality | Would it pass a PR review? |
| Communication | Did you think out loud and explain decisions? |
| Confidence | Did you own your answer even under uncertainty? |

Score interpretation: 0–10 (early) / 11–15 (building) / 16–19 (interview-ready) / 20–23 (strong) / 24–25 (go get the job)

**Part 5 — Weekly Schedule**
- Active job hunt: 2 Pramp sessions + 4 self-recording sessions per week
- Minimum (pre-hunt): 1 Pramp + 2 self-record sessions per week

---

### `job-hunt/linkedin-calendar.md`

30 post ideas across 6 phases:

| Phase | Posts | Topic |
|---|---|---|
| Week 1–2 | 1–5 | JavaScript deep dives (closures, event loop, `this`, Promises, var/let/const) |
| Week 3–4 | 6–10 | React concepts (first app mistakes, useState vs useReducer, useEffect cleanup) |
| Week 5–6 | 11–15 | Project showcases (e-commerce, dashboard, portfolio, first OSS PR, 30-day reflection) |
| Week 7–8 | 16–20 | Depth and learning process (learning system, novel→code, ECE transfer, React thinking) |
| Week 9+ | 21–25 | Job hunt posts (open to work, 90-day recap, interview failure lesson, first client) |
| Evergreen | 26–30 | TypeScript, dark mode hook, accessibility, advice post, offer announcement |

Every post has: hook, story draft, lesson, CTA, and notes on what makes it work.

---

### `LEARNING-GUIDE.md` (root)

**The complete self-directed learning system:**

- Full folder map with descriptions of every directory and key file
- Daily routine for learning phase (90+90+30 min blocks)
- Daily routine for job hunt phase (different priorities, same structure)
- DSA practice: 3-problem daily system (1 easy + 1 medium + 1 revisit), 20 patterns that cover 80% of interview problems
- Cheatsheet usage rules: when to look, when not to look, split-screen setup
- Portfolio update process: 5-step checklist (edit `projects.js` → screenshot → test → deploy → update resume)
- Cursor free tier: what to use it for, what not to, what to do when quota runs out
- Weekly + monthly milestone checklists (Weeks 1–12)
- What to do when stuck (4 scenarios with specific fixes)
- The one rule: build something every day

---

### `linkedin-post-drafts/` — 5 Ready-to-Post Drafts

| Post | Hook | Best Day |
|---|---|---|
| `post-01-closures.md` | "I was confused by closures for weeks. Then this clicked." | Tue/Wed |
| `post-02-novel-to-code.md` | "I wrote 250,000 words before I wrote a line of React." | Mon/Thu |
| `post-03-event-loop.md` | "This prints B before A. Always. Here's why." | Wed |
| `post-04-open-to-work.md` | "I'm a frontend developer looking for my first role." | Mon morning |
| `post-05-ecc-to-frontend.md` | "I studied ECE. I'm now a React developer. Here's what surprised me." | Thu |

Every draft is copy-paste ready with posting tips, timing notes, and a first-comment strategy.

**Recommended posting order:**
1. Post 2 (novel → code) — most unique, highest engagement, sets you apart
2. Post 5 (ECE → frontend) — establishes your story
3. Post 1 (closures) — technical credibility
4. Post 3 (event loop) — more technical credibility
5. Post 4 (open to work) — now recruiters have seen who you are before the ask

---

## The Full Picture: Day 11 Completes the System

```
HOW TO LEARN (self-directed)    → LEARNING-GUIDE.md
HOW TO PRACTICE INTERVIEWS      → mock-interview-guide.md
HOW TO GET CLIENTS (freelance)  → freelance-guide.md
HOW TO STAY VISIBLE (LinkedIn)  → linkedin-calendar.md + linkedin-post-drafts/
HOW TO APPLY + TRACK            → application-tracker.md (Day 10)
HOW TO FOLLOW UP                → follow-up-templates.md (Day 10)
HOW TO NEGOTIATE                → salary-negotiation.md (Day 10)
HOW TO INTERVIEW                → interview-vault/ (Day 8)
```

Everything is built. The only thing left is to execute.

---

*Day 11 — Dinesh S, April 2026*
