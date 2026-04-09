# Frontend Career — Learning Guide

> **For after Pro expires (or whenever you're continuing alone).**
> This file tells you exactly what to open, when to open it, how to practice, and how to measure progress.
> Read this whenever you feel lost. It has all the answers.

---

## Your 5 Survival Files (Root Directory)

These files live in the root folder alongside this one. Know when to open each.

| File | Open When |
|------|-----------|
| `RESCUE-KIT.md` | Motivation crashes, you want to quit, you feel behind |
| `DEBUG-YOURSELF.md` | Your code doesn't work and you don't know why |
| `WHAT-RECRUITERS-SEE.md` | Every Sunday — audit your online presence before another week of applying |
| `CONFIDENCE-TRACKER.md` | Every Sunday — fill in the weekly score table, check milestones |
| `POWER-NEGOTIATION.md` | The moment you receive an offer — read it BEFORE you respond |

**RESCUE-KIT.md** is a personal letter written for the week when everything feels impossible. Read it all the way through. Then close it and open today's exercise. It works.

**DEBUG-YOURSELF.md** is a 10-step flowchart for when your code breaks and you don't know where to start. Steps 1-4 fix 80% of bugs. Step 10 is the nuclear option (ask Claude directly). Use it before you've been stuck for more than 30 minutes.

**WHAT-RECRUITERS-SEE.md** walks through exactly what a hiring manager looks at when they research you: LinkedIn, GitHub, portfolio, live demos, code, and resume. There's a Sunday audit checklist at the bottom. Run it every week during the job hunt.

**CONFIDENCE-TRACKER.md** has a weekly table for scoring yourself (JS, React, DSA, projects, commits, posts) and a milestone tracker with blank date fields. Fill the table every Sunday. Watch the numbers move upward over 13 weeks.

**POWER-NEGOTIATION.md** has word-for-word scripts for every negotiation scenario: deflecting the salary question, countering an offer, handling "this is our final offer," using a competing offer, and spotting red flags in offer calls. Read it before any offer comes — not during.

---

## The Folder Map — What Goes Where

```
frontend-career/
│
├── interview-vault/          ← STUDY THIS DAILY during job hunt
│   ├── 01-js-interview.md    — 60 JavaScript Q&As with code examples
│   ├── 02-react-interview.md — 50 React Q&As (hooks to SSR)
│   ├── 03-css-html-interview.md — 30 CSS/HTML Q&As
│   ├── 04-behavioral-interview.md — 20 STAR answers (personalized for you)
│   └── 05-system-design-frontend.md — 10 frontend system designs
│
├── portfolio/                ← Your live portfolio site (React + Vite)
│   ├── src/data/projects.js  — EDIT THIS to add new projects
│   └── README.md             — Setup and deploy instructions
│
├── job-hunt/                 ← Everything you need to get hired
│   ├── application-tracker.md    — Log every application here
│   ├── cold-email-templates.md   — Copy, personalize, send
│   ├── follow-up-templates.md    — After interview, after rejection
│   ├── salary-negotiation.md     — Scripts for every negotiation scenario
│   ├── company-research.md       — 50+ target companies, 4 tiers
│   ├── mock-interview-guide.md   — Pramp setup, self-scoring rubric
│   ├── linkedin-calendar.md      — 30 post ideas mapped to your journey
│   └── freelance-guide.md        — Find local clients, pitch, contract, deliver
│
├── resume/
│   └── resume-content.md         — Full resume content, ATS checklist
│
├── linkedin-post-drafts/     ← 5 ready-to-post LinkedIn drafts
│
├── week-01-arsenal/          ← Foundational skill builders (Week 1)
├── week-02-arsenal/          ← Advanced tools (Week 2)
├── week-03-js-core/ → week-12-interview-prep/   ← Curriculum weeks
│
└── dsa-bank/                 ← DSA practice problems and patterns
```

---

## Daily Routine

### Morning Block (90 min) — Deep Learning

**If you're in learning phase (Weeks 1–8):**
```
00:00–00:20   Review yesterday's notes / interview vault Q&As
              Open: interview-vault/01-js-interview.md or 02-react-interview.md
              Read 5 questions. Say the answers out loud. No peeking.

00:20–01:10   Build something from the current week's curriculum
              Open the week folder (e.g. week-05-react-basics/)
              Do the task, not the tutorial. Build. Break. Fix.

01:10–01:30   Write one short note about what you learned
              (Even 3 sentences in journal.md counts)
```

**If you're in job hunt phase (Weeks 9+):**
```
00:00–00:20   Review 5 behavioral Q&As (interview-vault/04-behavioral-interview.md)
              Say "Tell me about yourself" out loud. Time it.

00:20–01:00   Study 5 technical Q&As (rotate: JS → React → CSS)
              For each one: read it, close the file, explain it in your own words

01:00–01:30   Apply to 2 targeted roles (not spray-apply)
              Open: job-hunt/application-tracker.md — log the entry
```

---

### Afternoon Block (90 min) — Building

```
00:00–01:00   Work on a real project
              Rule: every 2 weeks, you should have something new to add to portfolio

00:00–00:30   DSA practice (3 problems, see DSA section below)

01:00–01:30   LinkedIn or mock interview
              Post 1 LinkedIn draft from linkedin-post-drafts/ or linkedin-calendar.md
              OR do a Pramp session (see mock-interview-guide.md)
```

---

### Evening Block (30 min) — Review

```
Review what you built today
Ask: "Could I explain this to someone else?"
If no → spend 15 min re-reading the relevant interview vault section
If yes → write the LinkedIn post about it (see linkedin-calendar.md)
```

---

## How to Practice DSA

> You don't need to grind 500 LeetCode problems. You need to understand 20 patterns deeply.

### The 3-Problem Daily Practice

**Step 1 — Pick 3 problems** from dsa-bank/ or LeetCode filtered by tag. Pick:
- 1 Easy (to stay sharp)
- 1 Medium (to grow)
- 1 revisit from a previous day you got wrong (to consolidate)

**Step 2 — Set a timer:**
- Easy: 10 minutes
- Medium: 20 minutes
- Never look at the solution until the timer ends

**Step 3 — Solve it:**
- Write pseudocode first (2 min)
- Then actual code
- Think out loud as if in an interview

**Step 4 — Check the pattern (not just the answer):**
After solving (or after time runs out), open the solution and ask:
- What pattern does this use? (sliding window, two pointer, BFS, DP, etc.)
- Could I have identified that pattern faster?
- What's the time and space complexity?

**Step 5 — Write it in dsa-bank/**
One file per pattern. Each problem gets:
```
Problem name:
Pattern:
My solution (copy your code):
Key insight I missed:
```

### The 20 Patterns That Cover 80% of Interview Problems

```
Arrays:         Two Pointer, Sliding Window, Prefix Sum
Strings:        Frequency Map, Sliding Window, Two Pointer
Trees:          DFS (pre/in/post order), BFS (level order)
Graphs:         BFS, DFS, Union-Find
Linked Lists:   Two Pointer (fast/slow), Reversal
Dynamic Prog:   Fibonacci pattern, 0/1 Knapsack, LCS
Sorting:        Merge sort pattern, Quick select
Binary Search:  Standard, on answer space
Heaps:          Top-K pattern
Backtracking:   Subsets, Permutations, Combinations
```

Start with Arrays and Strings. Master those before touching Trees. Never skip to DP.

---

## How to Use Cheatsheets While Coding

> Cheatsheets are reference tools, not crutches. Here's how to use them properly.

**Split-screen setup:**
- Left side: your editor (VS Code / Cursor)
- Right side: the relevant cheatsheet (open in browser or another VS Code tab)

**When to look:**
- Syntax you know conceptually but can't remember exactly → look it up fast, keep going
- A method name you've used before but forgot → look it up
- A concept you're implementing for the first time → read the relevant section before coding

**When NOT to look:**
- To copy-paste code you haven't understood
- Before trying to write it yourself first
- During a self-timed mock interview (train without the net)

**Recommended cheatsheets:**
- `interview-vault/01-js-interview.md` — JS syntax and patterns
- `interview-vault/02-react-interview.md` — React hooks reference
- `interview-vault/03-css-html-interview.md` — CSS layout reference
- MDN (developer.mozilla.org) — authoritative, use for specific method signatures

---

## How to Update Portfolio When a New Project Is Done

Five steps — takes 10 minutes:

**Step 1 — Add to `portfolio/src/data/projects.js`:**
```js
{
  id:          'your-project-slug',
  title:       'Your Project Name',
  description: 'What it does in 1–2 sentences.',
  image:       '/projects/your-project.png',  // or '' for placeholder
  tags:        ['React', 'TypeScript'],
  liveUrl:     'https://your-project.vercel.app',
  githubUrl:   'https://github.com/DINESHTM07/your-project',
  featured:    false,
}
```

**Step 2 — Add a screenshot:**
- Take a screenshot of the live project
- Save it as `portfolio/public/projects/your-project.png`
- Recommended size: 1200×800px or similar 3:2 ratio

**Step 3 — Test locally:**
```bash
cd portfolio
npm run dev
# Check the Projects section looks right
```

**Step 4 — Deploy:**
```bash
cd portfolio
npm run build
vercel --prod
# OR: just push to GitHub — Vercel auto-deploys if connected
```

**Step 5 — Update your resume:**
- Open `resume/resume-content.md`
- Update or add the project entry
- Rebuild your PDF from your resume template

That's it. No other changes needed — `projects.js` is the single source of truth.

---

## How to Use Cursor Free Tier Effectively

Cursor's free tier gives you limited AI completions per month. Make them count.

**Use Cursor AI for:**
- Understanding an error message you've never seen before (Cmd+K → "explain this error")
- Getting unstuck after 15+ minutes on one problem (not before)
- Reviewing your code for improvements after you've written it yourself
- Generating boilerplate (component shells, type definitions, test stubs)

**Do NOT use Cursor AI for:**
- Writing logic you haven't thought through first
- Explaining concepts you should look up in interview-vault/ instead
- Getting it to "just write the whole component" — you won't learn

**Cursor free tier tips:**
- Tab completions are unlimited — use them freely for autocomplete
- AI chat (Cmd+K / Cmd+L) uses the limited quota — save for real blocks
- Use "Chat with codebase" sparingly — it uses more tokens
- Close and reopen the window if completions seem slow

**When Cursor's quota runs out for the month:**
- GitHub Copilot free tier (VS Code extension) — same workflow
- Continue.dev (free, local or cloud models)
- Claude.ai (claude.ai) — paste your code directly, free tier available

---

## Weekly Milestones

### Weeks 1–4 — Foundation

```
Week 1:  [ ] JavaScript fundamentals solid (can answer Q1–Q30 in 01-js-interview.md)
Week 2:  [ ] React basics solid (can build a CRUD app from scratch without tutorial)
Week 3:  [ ] CSS confident (can implement any layout from a screenshot)
Week 4:  [ ] First real project deployed to Vercel + in portfolio
```

### Weeks 5–8 — Depth

```
Week 5:  [ ] React advanced solid (hooks, state management, performance basics)
Week 6:  [ ] Second project deployed — different domain from first
Week 7:  [ ] TypeScript — can type a full React component without errors
Week 8:  [ ] Can answer all 20 behavioral questions out loud, naturally
```

### Weeks 9–12 — Job Hunt Active

```
Week 9:   [ ] Portfolio live on Vercel + resume PDF ready + LinkedIn updated
Week 10:  [ ] Applied to 10+ companies (tracked in application-tracker.md)
Week 11:  [ ] At least 2 technical rounds completed
Week 12:  [ ] 4+ Pramp sessions done, self-score consistently 18+/25
```

---

## Monthly Milestones

| Month | Goal | Measure |
|---|---|---|
| Month 1 | Solid JS + React foundation | Can explain every topic in interview-vault/01 and 02 |
| Month 2 | 2 real projects deployed | Both in portfolio with live URLs |
| Month 3 | Job hunt in full swing | 20+ applications, 3+ interviews, 1+ offer or advancing |

---

## What To Do When You Feel Stuck

**If you've been on the same bug for 30+ minutes:**
1. Rubber duck debug — explain the problem out loud to nobody
2. Check the browser console and read the error completely
3. Search the exact error message (not a paraphrase)
4. Open Cursor / Claude.ai and describe what you've already tried
5. Take a 10-minute break and come back

**If you feel like you're not making progress:**
1. Open `application-tracker.md` — count what you've done this month
2. Open interview-vault and answer 5 questions out loud — you know more than you think
3. Read the commit history: `git log --oneline` — see how much you've built
4. Do one small, completable task and finish it. Progress builds momentum.

**If you don't know what to study next:**
1. Look at the current week folder (e.g. `week-06-react-intermediate/`)
2. Check `tasks.md` in that folder
3. If you've done everything there, move to the next week folder
4. When all weeks are done: build a new project, apply for jobs, contribute to open source

**If you're comparing yourself to others:**
Stop. Your timeline is yours. You wrote a 250,000-word novel during a medical recovery. You know how to outlast difficulty. Apply that here.

---

## The One Rule

**Build something every day — even if it's small.**

A bug fix counts. A new component counts. A refactor counts. Reading does not count as building. Watching a tutorial does not count as building. Writing code counts.

The portfolio grows commit by commit. So does the career.

---

*This guide was built for Dinesh S — ECE graduate, published author, self-taught React developer.*
*Last updated: April 2026*
