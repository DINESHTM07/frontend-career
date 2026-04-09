# Day 64 Tasks — Open Source Contribution Day

## Morning Block (8:00 – 11:00 AM) — Find Issue + Fork + Setup
- [ ] Open `open-source-guide.md` — read fully before anything else
- [ ] Search GitHub: `label:"good first issue" language:TypeScript state:open`
- [ ] Look at 5+ issues before choosing — pick one that is clear, small, and active
- [ ] Write down why you chose this issue over the others
- [ ] Confirm: the issue is not already assigned to someone else
- [ ] Confirm: the repo has been active in the last 3 months (check latest commits)
- [ ] Read the repo's `CONTRIBUTING.md` (if it exists) — follow their specific rules
- [ ] Click Fork — confirm your fork exists at `github.com/YOUR_USERNAME/repo-name`
- [ ] Clone YOUR fork: `git clone https://github.com/YOUR_USERNAME/repo-name.git`
- [ ] Run: `cd repo-name && npm install` (or whatever the project uses)
- [ ] Confirm project builds or runs without errors
- [ ] Add upstream: `git remote add upstream https://github.com/original/repo.git`
- [ ] Create branch: `git checkout -b fix/short-description`

## Midday Block (11:20 AM – 1:30 PM) — Fix + PR
- [ ] Reproduce the issue exactly as described — don't fix what you can't reproduce
- [ ] Make the fix — small and targeted (only what the issue describes)
- [ ] DO NOT refactor or "improve" anything not in the issue
- [ ] Run project tests if they exist: `npm test` — confirm nothing broken
- [ ] Stage and commit: `git add . && git commit -m "fix: [description]"`
- [ ] Push: `git push origin fix/short-description`
- [ ] Go to GitHub — click "Compare & pull request"
- [ ] Write PR description: what it does, what files changed, how to test
- [ ] Reference the issue number in the description: "Fixes #123"
- [ ] Submit the PR
- [ ] Comment on the original issue with your PR link
- [ ] Paste PR URL here: _______________

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-64-dsa.js` in `week-10-project-3-testing/day-64/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Write in `journal.md`: what repo, what issue, what you changed, what you learned
- [ ] Run: `git add . && git commit -m "Day 64: Open source PR submitted + DSA"`
- [ ] PR URL: _______________
- [ ] Repo: _______________
- [ ] Issue: _______________
