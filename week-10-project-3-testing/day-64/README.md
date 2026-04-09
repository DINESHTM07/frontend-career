# Day 64 — Open Source Contribution Day

**Status:** 📋 READY TO START
**Week:** 10 | **Theme:** Testing + Polish + Open Source

---

## Today's Goal

Make your first real open source contribution. This is not optional — every senior developer has open source contributions, and starting now puts you months ahead of other job seekers.

By end of today:
- You've found a real beginner-friendly issue on GitHub
- You've forked the repository, cloned it, and reproduced the issue
- You've made a fix and submitted a pull request
- The PR is live on GitHub with a clean description

---

## What to Open

1. `open-source-guide.md` — follow it step by step

---

## Morning (8:00 – 11:00 AM) — Find an Issue + Fork + Setup

### Step 1 — Read `open-source-guide.md`

Open `open-source-guide.md` before doing anything else. It has the complete workflow. Read it fully — this is the map for the day.

### Step 2 — Find a Beginner-Friendly Issue

Search GitHub for issues labeled `good first issue` or `beginner friendly`. Good places to look:

**React ecosystem projects:**
- `facebook/react` — documentation issues
- `vitejs/vite` — documentation, config issues
- `shadcn-ui/ui` — documentation, typos, small bugs
- `tanstack/query` — documentation, examples
- `pmndrs/zustand` — documentation, examples

**General frontend:**
- `nicedoc.io` — documentation site projects
- `EddieHubCommunity/good-first-issue-finder` — aggregator
- Search: `github.com/search?q=label%3A"good+first+issue"+language%3ATypeScript+state%3Aopen`

**What makes a good first issue:**
- Has a clear description of what's wrong
- The fix is localized to one file or a few lines
- Not assigned to anyone yet
- The maintainer replied recently (repo is active)
- 5 or fewer comments (not controversial)

**Avoid:**
- Issues that require understanding the entire codebase
- Issues that need design decisions
- Issues that have been open for years with no activity

### Step 3 — Fork and Clone

Once you have an issue:

1. Click "Fork" on the repository page — this creates your copy
2. Clone YOUR fork (not the original):

```bash
git clone https://github.com/YOUR_USERNAME/repo-name.git
cd repo-name
npm install  # or yarn/pnpm — check their contributing guide
```

3. Add the original repo as `upstream`:
```bash
git remote add upstream https://github.com/original-owner/repo-name.git
```

4. Create a branch for your fix:
```bash
git checkout -b fix/description-of-the-fix
# or: git checkout -b docs/fix-typo-in-readme
```

---

## Midday (11:20 AM – 1:30 PM) — Make the Fix + Submit PR

### Step 1 — Reproduce the Issue

Before fixing, reproduce the problem described in the issue. If you can't reproduce it, comment on the issue asking for clarification — don't guess.

### Step 2 — Make the Fix

Keep it small. The best first contributions are:
- Fixing a typo or grammar error in docs
- Adding a missing example to documentation
- Fixing a broken link
- Adding a missing JSDoc comment
- Fixing an obvious logic bug in a utility function

Do NOT:
- Refactor code that wasn't mentioned in the issue
- "Improve" unrelated things while you're in the file
- Change formatting unless the issue is specifically about formatting

### Step 3 — Test Your Fix

Run the project's tests if they exist:
```bash
npm test
# or whatever their test command is (check README or CONTRIBUTING.md)
```

Make sure you haven't broken anything.

### Step 4 — Commit and Push

```bash
git add .
git commit -m "fix: correct typo in Button component docs"
# or: "docs: add missing TypeScript example to README"
# Use conventional commits if the project uses them (check their git history)

git push origin fix/description-of-the-fix
```

### Step 5 — Open the Pull Request

Go to your fork on GitHub. You'll see a banner: "Compare & pull request". Click it.

**Write a good PR description:**

```markdown
## What this PR does
Fixes #[issue number] — [brief description]

## Changes made
- [Specific file changed]: [what you changed]
- [If multiple files, list them]

## How to test
1. [Step to verify the fix works]
2. [Expected result]

## Screenshots (if UI change)
[Before and after screenshots if applicable]
```

Submit the PR. You're done. Now wait — maintainers may request changes. That's normal and expected.

### If the PR Gets Review Comments

Review comments are the normal part of open source. When you get them:
1. Read them carefully — maintainers know their codebase better than you
2. Make the requested changes in the same branch
3. Push again — the PR updates automatically
4. Reply to each comment with "Done" or explain your reasoning if you disagree

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-64-dsa.js` in this folder.

---

## What to Do While You Wait for a Review

After submitting the PR, the maintainer may take a few hours to a few days to review. While you wait:

- Look for a second issue in the same repository (you already know the codebase)
- Look for issues in other repositories
- Document this contribution in your `journal.md`

Note for the LinkedIn post (Day 68): the post says "Open source contribution merged!" — if it hasn't merged yet by Day 68, that's fine. Post about submitting the PR and what you learned.

---

## End of Day Checklist

- [ ] Read `open-source-guide.md` fully before starting
- [ ] Found a `good first issue` on a real open source repository
- [ ] Forked the repository — your fork exists at `github.com/YOUR_USERNAME/repo-name`
- [ ] Cloned your fork locally
- [ ] Added `upstream` remote pointing to the original repo
- [ ] Created a feature branch: `fix/...` or `docs/...`
- [ ] Reproduced the issue before fixing
- [ ] Made the fix — small, targeted, only touches what the issue describes
- [ ] Project tests pass (if tests exist) — or confirmed your change doesn't break anything
- [ ] Committed with a meaningful commit message
- [ ] Pushed to your fork
- [ ] Opened a pull request with a clear description
- [ ] PR is live and visible at `github.com/original-owner/repo-name/pulls`
- [ ] Commented on the issue: "I've submitted a PR for this: [PR link]"
- [ ] Completed 3 DSA problems in `day-64-dsa.js`

---

*Most developers never contribute to open source because they think they're not good enough yet. You are good enough. A documentation fix is a real contribution. A typo fix shipped to production is more than most developers ever do.*
