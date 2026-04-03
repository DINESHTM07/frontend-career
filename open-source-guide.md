# Open Source Contribution Guide for Frontend Developers

A practical guide to making your first open source contribution — even as a beginner.

---

## What Is Open Source?

Open source software is code that is publicly available for anyone to read, use, modify, and contribute to. When a project is open source, its codebase lives on a public repository (usually GitHub) and anyone can:

- Read the source code
- Report bugs (open issues)
- Suggest improvements
- Fix bugs and submit the fix (open a Pull Request)
- Add new features (if welcomed by maintainers)

Projects you use every day — React, Next.js, VS Code, Node.js, TypeScript — are all open source. The code is on GitHub right now, and anyone (including you) can contribute.

---

## Why Contribute to Open Source?

### Resume and Portfolio Value
- Contributions appear on your public GitHub profile with a green commit square in the contribution graph.
- A merged PR to a well-known project (even a small one) is a strong signal to employers — it shows you can navigate a real codebase, follow contribution guidelines, and collaborate with other developers.
- "Contributed to [known project]" in your resume is more credible than "built a todo app" because it's verifiable.

### Real-World Learning
- Reading production code is different from tutorial code. Real codebases have structure, patterns, and constraints you won't see in courses.
- Contributing forces you to understand code you didn't write — a skill you'll use every single day on the job.
- You encounter code review from experienced maintainers — free feedback from senior developers.

### Networking and Visibility
- Maintainers and contributors often become professional contacts.
- Being visible in a community (even through thoughtful issue comments) builds reputation over time.
- Some contributors have been hired by the companies whose projects they contributed to.

### Giving Back
- Every tool you're using right now was built by people who contributed their time. Contributing is how the ecosystem stays healthy.

---

## How to Find Beginner-Friendly Issues

### GitHub Labels to Search For

Every project can tag issues with labels. These are the ones that signal "good for beginners":

```
good first issue      ← The most common label for beginner tasks
good-first-issue      ← Alternate spelling
help wanted           ← Maintainer wants community help
beginner friendly     ← Explicitly beginner-targeted
easy                  ← Flagged as easy complexity
starter               ← Good starting tasks
up for grabs          ← Not assigned to anyone, open for contributions
first-timers-only     ← Reserved specifically for first-time contributors
hacktoberfest         ← October-only label, tons of issues added
```

**How to find them on GitHub:**
```
https://github.com/[owner]/[repo]/labels/good%20first%20issue
```

Or search GitHub globally:
```
https://github.com/search?q=label%3A%22good+first+issue%22+language%3Atypescript&state=open&type=Issues
```

### Dedicated Websites

**up-for-grabs.net**
- Lists thousands of projects that have open issues tagged for new contributors
- Filter by technology (JavaScript, TypeScript, React, etc.)
- Direct links to the specific issues

**firsttimersonly.com**
- Issues specifically reserved for people making their VERY FIRST contribution
- Maintainers hold these issues open and provide extra guidance
- Links to multiple discovery tools

**goodfirstissue.dev**
- Curated list of good first issues across popular open source projects
- Filter by language
- Updated regularly

**codetriage.com**
- Helps you subscribe to a project and get one open issue emailed per day
- Good for building the habit of staying connected to a project

**hacktoberfest (every October)**
- Annual event (October 1-31) where contributions to eligible repos earn a t-shirt or digital badge
- Hundreds of projects add beginner issues specifically for the event
- Great forcing function if you keep postponing your first contribution

---

## Step-by-Step: Your First Contribution

### Step 1 — Find the right issue

1. Go to a repo from the list below (or a project you actually use)
2. Click **Issues** tab → **Labels** → **good first issue**
3. Read through open issues. Look for:
   - Small, well-defined scope ("fix typo in docs", "add missing aria-label", "update example in README")
   - Clear description of what needs to be done
   - Recent activity (last comment within a few weeks — active project)
   - No one assigned yet
4. Read the comments — if someone asked "can I take this?" and it was assigned to them weeks ago with no follow-up, it might be abandoned and safe to claim

### Step 2 — Comment to claim the issue

Before doing anything, comment on the issue:
```
Hi, I'd like to work on this if it's still available. I'm new to contributing
but I understand the issue. Could you point me to any relevant files?
```

Wait for a response if the project is active. Some projects auto-assign on request; others need maintainer approval.

### Step 3 — Fork the repository

```bash
# On GitHub: click the "Fork" button (top right of the repo)
# This creates a copy of the repo under YOUR GitHub account
# Your fork: https://github.com/YOUR-USERNAME/REPO-NAME
```

### Step 4 — Clone YOUR fork locally

```bash
# Clone your fork (not the original)
git clone https://github.com/YOUR-USERNAME/REPO-NAME.git
cd REPO-NAME

# Add the original repo as "upstream" so you can pull future updates
git remote add upstream https://github.com/ORIGINAL-OWNER/REPO-NAME.git

# Verify remotes
git remote -v
# origin    https://github.com/YOUR-USERNAME/REPO-NAME.git (fetch)
# origin    https://github.com/YOUR-USERNAME/REPO-NAME.git (push)
# upstream  https://github.com/ORIGINAL-OWNER/REPO-NAME.git (fetch)
# upstream  https://github.com/ORIGINAL-OWNER/REPO-NAME.git (push)
```

### Step 5 — Read CONTRIBUTING.md FIRST

```bash
cat CONTRIBUTING.md
# or open it in VS Code
```

This file tells you:
- How to set up the dev environment
- Code style requirements (do they use Prettier? ESLint? specific conventions?)
- How to run tests
- Branch naming conventions
- Commit message format
- Whether you need to sign a CLA (Contributor License Agreement)

**Not reading CONTRIBUTING.md is the #1 reason first PRs get rejected.**

### Step 6 — Set up the project

```bash
# Install dependencies
npm install
# or yarn install / pnpm install

# Run the dev server / tests to make sure it works before you change anything
npm run dev
npm test

# If anything fails at this point, check the README or open an issue asking for help
```

### Step 7 — Create a new branch

```bash
# NEVER work on main — always create a feature branch
git checkout -b fix/issue-123-button-aria-label
# or: docs/update-readme-example
# or: feat/add-loading-state

# Naming conventions vary — check CONTRIBUTING.md
# Common patterns:
# fix/short-description
# feat/short-description
# docs/what-you-changed
# chore/what-you-cleaned-up
```

### Step 8 — Make the change

```bash
# Make the smallest change that solves the issue
# Don't refactor other code while you're here
# Don't fix unrelated issues in the same PR
# Don't change whitespace/formatting in files you didn't need to touch

# Run tests as you go
npm test

# If the project has linting
npm run lint
npm run lint:fix   # auto-fix if available
```

### Step 9 — Commit with a clear message

```bash
git add path/to/changed/file.tsx   # Specific files, not git add .

git commit -m "fix: add aria-label to close button in Dialog component

Fixes #123

The close button in the Dialog component was missing an accessible name,
causing screen readers to announce it as 'button' with no context."

# Format: type: short description (50 chars max)
# Body: optional, explains WHY not WHAT
# Footer: references the issue ("Fixes #123" auto-closes the issue when PR merges)
```

### Step 10 — Push to your fork

```bash
git push origin fix/issue-123-button-aria-label
```

### Step 11 — Open a Pull Request

1. Go to your fork on GitHub
2. GitHub shows a banner: "Compare & pull request" — click it
3. **Title**: Clear, specific. "fix: add aria-label to Dialog close button"
4. **Body**: Use this structure:

```markdown
## What does this PR do?
Adds an `aria-label="Close dialog"` to the close button in the Dialog component.

## Why?
Fixes #123 — the button had no accessible name, making it unusable with screen readers.

## How to test
1. Open the Dialog component in Storybook
2. Use a screen reader (or axe DevTools)
3. The close button should now announce "Close dialog, button"

## Screenshots (if visual change)
[before/after screenshot or N/A]

## Checklist
- [x] I've read CONTRIBUTING.md
- [x] Tests pass (`npm test`)
- [x] Linting passes (`npm run lint`)
- [x] The change is minimal and focused on the issue
```

5. Click "Create pull request"

### Step 12 — Respond to code review

- Maintainers may request changes — this is normal, not personal.
- Make the requested changes on the same branch.
- Push again — the PR updates automatically.
- Reply to each comment with what you changed or a question if unclear.
- Don't force-push after the PR is open (it makes review history confusing).

---

## 15 Beginner-Friendly React/JS Repositories

| Repository | Why It's Good for Beginners |
|------------|----------------------------|
| [facebook/react](https://github.com/facebook/react) | Good-first-issue label, excellent docs on contributing, very active |
| [vercel/next.js](https://github.com/vercel/next.js) | Huge project, many docs/example improvements needed, active team |
| [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) | Well-maintained, clear issues, great for learning CSS internals |
| [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | Component docs, examples, and accessibility improvements often needed |
| [alan2207/bulletproof-react](https://github.com/alan2207/bulletproof-react) | Architecture guide — good for docs improvements and example updates |
| [pmndrs/zustand](https://github.com/pmndrs/zustand) | Small state management lib, docs and TypeScript improvements often welcome |
| [TanStack/query](https://github.com/TanStack/query) | Docs, examples, and TypeScript improvements — very active community |
| [remix-run/remix](https://github.com/remix-run/remix) | Docs/examples, very explicit about beginner contributions |
| [storybookjs/storybook](https://github.com/storybookjs/storybook) | Explicit `good first issue` label, friendly community |
| [testing-library/react-testing-library](https://github.com/testing-library/react-testing-library) | Docs improvements, TypeScript types — small and focused |
| [jaredpalmer/formik](https://github.com/jaredpalmer/formik) | Form library — docs and example improvements frequently open |
| [react-hook-form/react-hook-form](https://github.com/react-hook-form/react-hook-form) | Docs, TypeScript improvements, example updates |
| [nickvdyck/webbundle](https://github.com/nickvdyck/webbundle) | Smaller project — easier to understand the full codebase |
| [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw) | React + TypeScript, active, range of issue difficulties |
| [carbon-design-system/carbon](https://github.com/carbon-design-system/carbon) | IBM's design system — accessibility improvements always welcomed |

**Tip for finding more:** Go to a library you actually use, click Issues, filter by `good first issue`. You'll care more about fixing bugs in tools you use daily.

---

## Open Source Etiquette

### Read CONTRIBUTING.md before anything else
Every project is different. Some require a specific format. Some require tests. Some require you to open an issue before submitting a PR. Ignoring this file is disrespectful of maintainers' time.

### Be polite and patient — maintainers are volunteers
Most open source maintainers are doing this in their free time, often nights and weekends. Don't demand quick reviews. Don't comment "any updates?" after 3 days. Wait at least 1-2 weeks before a gentle nudge.

### Keep PRs small and focused
One PR = one thing. "Fix button aria-label" should not also refactor the entire Dialog component and update 5 unrelated tests. Small PRs get reviewed faster and merged more often.

### Don't take feedback personally
Code review comments are about the code, not about you. "This approach has an edge case in X scenario" is not "you are bad at coding." Respond professionally and learn from it.

### Ask before building large features
If you want to add a significant new feature, open an issue first: "I'd like to add X — is this something the project wants?" Getting buy-in before spending 10 hours building avoids the heartbreak of a well-intentioned PR getting closed because it doesn't fit the project's direction.

### Leave things better than you found them
If you notice a typo or a small issue while working on your fix — you can fix it. But consider whether it should be in the same PR (if it's in the same file, usually fine) or a separate PR (if it's unrelated). Mention it in your PR description.

---

## Your First PR Checklist

Before you open a PR, run through this:

**Setup**
- [ ] I read `CONTRIBUTING.md` in full
- [ ] I set up the project locally and confirmed it runs
- [ ] I commented on the issue and it was assigned to me (or project doesn't require this)

**The Change**
- [ ] My branch is named appropriately (check CONTRIBUTING.md conventions)
- [ ] I made the smallest change that solves the issue — no scope creep
- [ ] I did NOT change unrelated files or formatting
- [ ] I added or updated tests if the project requires it
- [ ] All tests pass locally (`npm test`)
- [ ] Linting passes (`npm run lint`)

**The Commit**
- [ ] Commit message is clear and follows the project's format
- [ ] The commit references the issue number (e.g., "Fixes #123")

**The PR**
- [ ] PR title is clear and specific
- [ ] PR description explains WHAT I changed and WHY
- [ ] I included how to test the change
- [ ] I included screenshots if there's a visual change
- [ ] I mentioned the issue being fixed ("Fixes #123")

**After Opening**
- [ ] I'm watching the PR for review comments
- [ ] I'm prepared to make changes if requested
- [ ] I won't force-push after the PR is open (just add new commits)

---

## What To Do If Your PR Stalls

Projects get busy. If your PR has been open for 2+ weeks with no response:

1. Leave a polite comment: "Hi — just checking if there's anything I can update to help with the review. Happy to make any changes needed."
2. Check if the project is still active (last commit, last merged PR)
3. If it's truly abandoned, look for an active fork of the project
4. Move on — don't let one stalled PR discourage you. Open another one elsewhere.

---

*Start small. Fix a typo. Fix a broken link in docs. Then work up to code changes.*
*Your first merged PR will feel disproportionately good. That feeling is worth chasing.*
