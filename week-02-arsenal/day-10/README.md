# Day 10 — Job Hunt Arsenal: Templates, Research, Negotiation, Tracking

> **Goal:** Build a complete operational system for the job search — not just lists, but ready-to-use tools for every stage of the process from first contact to signed offer.

---

## What Was Built Today

Five files added to `job-hunt/`:

| File | Purpose | Contents |
|---|---|---|
| `cold-email-templates.md` | First contact outreach | 5 templates across every channel |
| `company-research.md` | Target company list | 50+ companies across 4 tiers |
| `salary-negotiation.md` | Negotiation scripts | 4 scripts, BATNA strategy |
| `application-tracker.md` | Progress tracking | Full tracker + weekly review ritual |
| `follow-up-templates.md` | Every follow-up stage | 8 templates, timing reference |

---

## File Summaries

### `cold-email-templates.md` — 5 Outreach Templates

| Template | When to Use |
|---|---|
| Cold email to hiring manager | Job posted, have a name, want to bypass ATS |
| Cold LinkedIn message to CTO | Small startup, no post, going straight to top |
| Follow-up after no response | Sent email 5–7 days ago, no reply — adds new value |
| Thank you email after interview | Within 2 hours of any interview — same day |
| Referral request (two-step) | Know someone there — build context before asking |

Key feature: every template has a personalization checklist and a "why this works" explanation. The referral template is a 2-message sequence with explicit reasoning for the two-step approach.

---

### `company-research.md` — 50+ Companies Across 4 Tiers

**Tier 1 — Funded Startups (15 companies)**
Razorpay, Setu, Groww, Smallcase, Khatabook, Cred, Darwinbox, Leadsquared, Chargebee, Zoho, Freshworks, Instamojo, Dukaan, Slice, Unacademy — all with direct career page URLs and research checklists.

**Tier 2 — Product Companies (15 companies)**
Heavy Chennai weighting: Zoho, Freshworks, Chargebee, Kissflow, Kovai.co, Facilio — all marked 🏠 for in-person/hybrid reach. Also includes Browserstack, Postman, InfraCloud, Superset, Fampay.

**Tier 3 — Service-Tech (10 companies)**
WITCH + mid-tier (TCS, Infosys, Wipro, HCLTech, Cognizant, Capgemini, Mphasis, LTIMindtree, Hexaware, Persistent) with specific strategy: target "Digital / Experience / UI Engineering" divisions, not generic IT pools.

**Tier 4 — Remote-First (12 platforms)**
Toptal, Gun.io, Turing, Arc.dev, Contra, Remote OK, We Work Remotely, Wellfound, Otta, LinkedIn, Instahyre, Hirist — with notes on vetting difficulty and best use case per platform.

Also includes:
- Application priority matrix (where to spend 60% / 25% / 15% of time)
- 30-min weekly research ritual (5 concrete steps)

---

### `salary-negotiation.md` — 4 Scripts + Strategy

| Script | Situation |
|---|---|
| Deflecting the salary question | "What are your expectations?" — before offer exists |
| Counter-offer after low offer | They offered below target — email counter template |
| Negotiating a joining bonus | Base is fixed, need upfront money or to bridge a gap |
| Asking for time to decide | Waiting on another process, need space to decide |

Also includes:
- Pre-negotiation numbers worksheet (walk-away / target / stretch)
- Market rate benchmarks for React dev (fresher/0-1 yr) by company type
- The BATNA principle explained with 3 concrete scenarios
- Offer comparison table (12-factor side-by-side)

---

### `application-tracker.md` — Full Tracking System

- Status key with 10 states (Applied → Contacted → Screening → Technical → Final → Offer → Accepted / Rejected / Ghosted / Withdrew)
- Simple quick-entry table (6 columns) for fast logging
- Full tracker (12 columns including contact name, email/LinkedIn, last action, salary range)
- Platform abbreviation reference (LI, WF, Direct, Cold, Referral, etc.)
- Weekly 6-point review checklist (runs in 5 minutes every Monday)
- Monthly stats block (application volume, response rate, best platform)
- Rejection log with pattern → fix reference table
- Offer comparison table for when multiple offers exist

---

### `follow-up-templates.md` — 8 Templates, Full Timeline

| Template | Timing |
|---|---|
| After applying | Day 7 exactly |
| After phone screen | Same day, within 2 hours |
| After technical round | Same day, within 2 hours |
| After final round | Same day, within 1 hour |
| After rejection (early stage) | Within 24 hours |
| After rejection (technical) | Within 24 hours |
| After rejection (final round) | Within 24 hours |
| Accepting an offer | Within their stated deadline |
| Declining an offer | As soon as decided |

Also includes:
- The 48-hour rule (how long to wait before checking in after a stated deadline)
- Rules for when NOT to follow up
- What not to say when declining (keeps bridges intact)
- What to do with rejection feedback (write it, pattern-match after 5+ rejections)

---

## The Job Hunt System — How It All Fits Together

```
DISCOVER          → company-research.md (50+ targets, 4 tiers)
     ↓
OUTREACH          → cold-email-templates.md (Templates 1–2)
     ↓
TRACK             → application-tracker.md (log every contact)
     ↓
FOLLOW UP         → follow-up-templates.md (Template 1: 7 days post-apply)
     ↓
INTERVIEW         → interview-vault/ (04-behavioral + 05-system-design)
     ↓
THANK YOU         → cold-email-templates.md (Template 4) same day
     ↓
NEGOTIATE         → salary-negotiation.md (Scripts 1–4)
     ↓
DECIDE            → application-tracker.md (offer comparison table)
     ↓
ACCEPT / DECLINE  → follow-up-templates.md (Templates 4A / 4B)
```

---

## Weekly Job Hunt Ritual

**Monday (30 min):**
- Review `application-tracker.md` — what needs follow-up this week?
- Check Wellfound + LinkedIn + Hirist for new roles
- Add new companies to research list

**Tuesday–Thursday (1 hr/day):**
- Write and send 2–3 targeted applications (not spray-apply)
- Personalize one cold email per day to a hiring manager

**Friday (20 min):**
- Update application tracker with the week's progress
- Fill in monthly stats if end of month
- Log any rejections + what to improve

---

*Job hunt arsenal built on Day 10 — Dinesh S, April 2026*
