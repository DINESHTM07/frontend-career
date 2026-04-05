# Exercise 39: Branch Battle — Conflicts, Resolution, and Rebase

## PATTERN: Collaboration

Branches let multiple developers work independently without breaking each other's work.
Conflicts happen when two branches change the same lines. Resolving them is a core skill.

This exercise walks you through:
1. Creating and working on branches
2. Causing a real merge conflict
3. Resolving it manually (not with a GUI — with your eyes and brain)
4. Redoing the same conflict with `git rebase` instead of `git merge`
5. Understanding the difference

**Do every step in your terminal.** The goal is muscle memory + pattern recognition.

---

## MENTAL MODEL: Branches and Merges

```
main:    A --- B --- C
                      \
feature:               D --- E --- F

After merge:
main:    A --- B --- C --- M   (M = merge commit)
                      \   /
feature:               D-E-F

After rebase:
main:    A --- B --- C --- D' --- E' --- F'
                                          ↑
                               (feature commits replayed on top of C)
```

**Merge:** Preserves exact history. Creates a merge commit. Non-destructive.
**Rebase:** Rewrites history — replays commits on top of the target branch. Cleaner history, but changes commit hashes.

---

## PHASE 1: Setup — Create the Battlefield

### Step 1.1 — Create a new repository

```bash
mkdir branch-battle-lab
cd branch-battle-lab
git init
git config user.name "Your Name"
git config user.email "your@email.com"
```

### Step 1.2 — Create a shared starting file

```bash
cat > config.js << 'EOF'
// Application Configuration
const config = {
  appName: "MyApp",
  version: "1.0.0",
  api: {
    baseUrl: "http://localhost:3000",
    timeout: 5000,
  },
  features: {
    darkMode: false,
    notifications: false,
  },
  theme: {
    primaryColor: "#3b82f6",
    fontFamily: "Inter",
  },
};

module.exports = config;
EOF

cat > index.js << 'EOF'
const config = require('./config');

function init() {
  console.log(`Starting ${config.appName} v${config.version}`);
  console.log(`API: ${config.api.baseUrl}`);
}

init();
EOF

git add .
git commit -m "Initial: add config and entry point"
```

---

## PHASE 2: Two Branches, Two Developers

Imagine Developer A and Developer B both start work at the same commit.

### Step 2.1 — Developer A: feature/dark-mode branch

```bash
# Developer A creates their branch
git checkout -b feature/dark-mode

# Developer A modifies config.js
cat > config.js << 'EOF'
// Application Configuration — Updated by Dev A
const config = {
  appName: "MyApp",
  version: "1.1.0",
  api: {
    baseUrl: "http://localhost:3000",
    timeout: 5000,
  },
  features: {
    darkMode: true,          // Dev A: enabled dark mode
    notifications: false,
  },
  theme: {
    primaryColor: "#1e293b", // Dev A: updated to dark theme color
    fontFamily: "Inter",
  },
};

module.exports = config;
EOF

git add config.js
git commit -m "feat: enable dark mode in config"

# Dev A also modifies index.js
cat > index.js << 'EOF'
const config = require('./config');

function init() {
  console.log(`Starting ${config.appName} v${config.version}`);
  console.log(`API: ${config.api.baseUrl}`);
  console.log(`Dark mode: ${config.features.darkMode}`);   // Dev A added this
}

init();
EOF

git add index.js
git commit -m "feat: log dark mode status on startup"
```

### Step 2.2 — Developer B: feature/notifications branch

```bash
# Switch back to main and create Dev B's branch from the SAME starting point
git checkout main

git checkout -b feature/notifications

# Developer B also modifies config.js — the SAME file as Dev A
cat > config.js << 'EOF'
// Application Configuration — Updated by Dev B
const config = {
  appName: "MyApp",
  version: "1.1.0",
  api: {
    baseUrl: "https://api.myapp.com",  // Dev B: updated to production URL
    timeout: 10000,                    // Dev B: increased timeout
  },
  features: {
    darkMode: false,
    notifications: true,               // Dev B: enabled notifications
  },
  theme: {
    primaryColor: "#3b82f6",
    fontFamily: "Roboto",              // Dev B: changed font
  },
};

module.exports = config;
EOF

git add config.js
git commit -m "feat: enable notifications, update API config"

# Dev B also modifies index.js
cat > index.js << 'EOF'
const config = require('./config');

function init() {
  console.log(`Starting ${config.appName} v${config.version}`);
  console.log(`API: ${config.api.baseUrl}`);
  console.log(`Notifications: ${config.features.notifications}`);  // Dev B added this
}

init();
EOF

git add index.js
git commit -m "feat: log notification status on startup"
```

### Step 2.3 — Visualize the branches

```bash
git log --oneline --graph --all --decorate
```

You should see:
```
* <hash> (HEAD -> feature/notifications) feat: log notification status
* <hash> feat: enable notifications, update API config
| * <hash> (feature/dark-mode) feat: log dark mode status
| * <hash> feat: enable dark mode in config
|/
* <hash> (main) Initial: add config and entry point
```

---

## PHASE 3: The Merge — When Conflict Happens

### Step 3.1 — Merge the first branch into main

```bash
git checkout main

# Merge dark-mode first — this should work cleanly
git merge feature/dark-mode
git log --oneline   # main now has 3 commits
```

### Step 3.2 — Merge the second branch — CONFLICT!

```bash
git merge feature/notifications
```

Git will say:
```
Auto-merging config.js
CONFLICT (content): Merge conflict in config.js
Auto-merging index.js
CONFLICT (content): Merge conflict in index.js
Automatic merge failed; fix conflicts then commit the result.
```

### Step 3.3 — Understand the conflict markers

```bash
git status
# Both files listed as "both modified"

cat config.js
```

You'll see conflict markers in the file:
```javascript
<<<<<<< HEAD
  primaryColor: "#1e293b",   // (Dev A's version — dark theme color)
=======
  primaryColor: "#3b82f6",   // (Dev B's version — kept original)
>>>>>>> feature/notifications
```

**Anatomy of a conflict:**
```
<<<<<<< HEAD              ← start of YOUR version (current branch)
your changes here
=======                   ← divider
their changes here
>>>>>>> feature/branch    ← end of INCOMING version
```

---

## PHASE 4: Resolving the Conflict

You must decide: keep mine, keep theirs, or merge both thoughtfully.

### Step 4.1 — Open and edit config.js manually

```bash
# Open in your editor
# On Windows: notepad config.js
# On Mac/Linux: nano config.js  OR  code config.js (VS Code)
```

For each conflict, you need to:
1. Delete the `<<<<<<< HEAD` marker
2. Delete the `=======` divider
3. Delete the `>>>>>>> branch` marker
4. Keep the content you want (could be one version, the other, or a mix)

**Resolving config.js — think about what makes sense:**
- `version`: both changed to "1.1.0" — agree, keep "1.1.0"
- `api.baseUrl`: Dev B updated to prod URL — this is better, keep Dev B's
- `api.timeout`: Dev B increased — keep Dev B's
- `features.darkMode`: Dev A enabled it — keep true
- `features.notifications`: Dev B enabled it — keep true
- `theme.primaryColor`: Conflict — dark mode (Dev A) uses dark color. Keep "#1e293b" since dark mode is active
- `theme.fontFamily`: Dev B changed to "Roboto" — judgment call, keep "Roboto"

The resolved `config.js` should look like:
```javascript
// Application Configuration — Merged by Developer
const config = {
  appName: "MyApp",
  version: "1.1.0",
  api: {
    baseUrl: "https://api.myapp.com",
    timeout: 10000,
  },
  features: {
    darkMode: true,
    notifications: true,
  },
  theme: {
    primaryColor: "#1e293b",
    fontFamily: "Roboto",
  },
};

module.exports = config;
```

**Resolving index.js:**
```javascript
// Both devs added a console.log — keep BOTH
const config = require('./config');

function init() {
  console.log(`Starting ${config.appName} v${config.version}`);
  console.log(`API: ${config.api.baseUrl}`);
  console.log(`Dark mode: ${config.features.darkMode}`);
  console.log(`Notifications: ${config.features.notifications}`);
}

init();
```

### Step 4.2 — Mark conflicts as resolved and commit

```bash
# After editing both files to remove conflict markers:
git add config.js
git add index.js

git status    # should show "All conflicts fixed but you are still merging"

git commit    # opens editor with auto-generated merge commit message
# Save as-is, or customize the message

git log --oneline --graph --all
# You should now see the merge commit connecting both branches
```

---

## PHASE 5: Redo with Rebase (Clean History Version)

Now let's see how `git rebase` handles the same situation differently.

### Step 5.1 — Reset and recreate the scenario

```bash
# Create a fresh setup to practice rebase
mkdir rebase-lab
cd rebase-lab
git init
git config user.name "Your Name"
git config user.email "your@email.com"

# Same starting files as before
cat > config.js << 'EOF'
const config = {
  version: "1.0.0",
  primaryColor: "#3b82f6",
  darkMode: false,
  notifications: false,
};
module.exports = config;
EOF

git add config.js
git commit -m "Initial config"
```

### Step 5.2 — Create feature branch with commits

```bash
git checkout -b feature/improvements

# Two commits on the feature branch
cat > config.js << 'EOF'
const config = {
  version: "1.1.0",
  primaryColor: "#1e293b",
  darkMode: true,
  notifications: false,
};
module.exports = config;
EOF
git add config.js
git commit -m "feat: dark mode and version bump"

cat > config.js << 'EOF'
const config = {
  version: "1.1.0",
  primaryColor: "#1e293b",
  darkMode: true,
  notifications: true,
};
module.exports = config;
EOF
git add config.js
git commit -m "feat: enable notifications"
```

### Step 5.3 — Add a commit to main while working on the branch

```bash
git checkout main

# Someone else merged something to main while you were on your branch
cat > hotfix.js << 'EOF'
// Emergency hotfix
console.log("Hotfix applied");
EOF
git add hotfix.js
git commit -m "fix: emergency hotfix"

git log --oneline --graph --all
```

### Step 5.4 — Rebase instead of merge

```bash
git checkout feature/improvements

# Rebase: replay our commits ON TOP of current main
git rebase main
```

If there are conflicts during rebase, resolve them the same way:
1. Edit the conflicted files
2. `git add <file>` (do NOT `git commit`)
3. `git rebase --continue`

If you want to abort: `git rebase --abort`

### Step 5.5 — Fast-forward merge (clean, no merge commit)

```bash
git checkout main

# After rebase, feature branch is directly ahead of main
# This merge creates NO merge commit — just moves the pointer
git merge feature/improvements    # "Fast-forward" in the output

git log --oneline --graph
# Clean linear history: A - B - C - D - E
# No merge commit ✓
```

---

## PHASE 6: Branch Cleanup and Best Practices

### Step 6.1 — Delete merged branches

```bash
# List all branches
git branch          # local branches
git branch -a       # all (including remote)

# Delete a merged branch (safe — git will refuse to delete unmerged branches)
git branch -d feature/dark-mode
git branch -d feature/notifications

# Force delete (for unmerged branches — careful!)
# git branch -D unfinished-experiment
```

### Step 6.2 — Interactive rebase — clean up commits before merging

```bash
# On your feature branch, before merging to main:
git log --oneline   # see your feature's commits

# Squash last 3 commits into 1 clean commit
git rebase -i HEAD~3
```

In the interactive editor:
```
pick abc123 feat: first draft
pick def456 fix: typo
pick ghi789 fix: another typo

# Change 'pick' to 'squash' (or 's') for commits to combine:
pick abc123 feat: first draft
squash def456 fix: typo
squash ghi789 fix: another typo
```

Save, then write a clean final commit message in the next editor.

```bash
git log --oneline   # now 1 clean commit instead of 3 messy ones
```

---

## CHECKPOINT: Answer These

1. What is the key difference between `git merge` and `git rebase`?
   - **Merge:** Preserves original history, creates a merge commit. Use for public/shared branches.
   - **Rebase:** Rewrites history, replays commits onto target. Use for local/feature branches before merging.

2. During a rebase conflict, you do `git add` but NOT `git commit`. Why?
   > Rebase handles the commit itself via `git rebase --continue`. Using `git commit` would create an unexpected extra commit in the middle of the rebase.

3. What does "fast-forward merge" mean and when does it happen?
   > It happens when the target branch has not diverged — it's directly behind the source branch. Git just moves the pointer forward. No merge commit needed. After a rebase, the parent branch can always fast-forward.

4. When should you use `rebase` vs `merge`? Give a real scenario for each.
   > **Rebase:** Updating your feature branch with main's latest commits (before submitting a PR) — keeps your branch current without messy merge commits.
   > **Merge:** Combining two long-running branches (release into main, main into develop) — preserving exact history of when things were integrated matters.

5. Why is `git rebase` considered "dangerous" for shared branches?
   > Rebase rewrites commit hashes. If someone else has already based work on those original commits, their history diverges from yours after the rebase. This causes the dreaded "push rejected — non-fast-forward" and can cause major confusion or lost work.

---

## YOUR TURN: Deliberate Conflict Practice

Create a 3-way conflict scenario and resolve it without any GUI tools.

1. Create a fresh repo with a `users.json` file (5 users with names, emails, roles)
2. Create TWO branches from the same commit:
   - `feature/add-admin`: add an admin user, change all roles to use "admin"/"member"
   - `feature/add-timestamps`: add `createdAt` fields to all users, change email format
3. Merge `feature/add-admin` to main first (should be clean)
4. Try to merge `feature/add-timestamps` — expect conflicts in `users.json`
5. Resolve the conflicts: keep ALL changes from both branches (both the role changes AND the timestamps)
6. Verify the final file has: new admin user + updated roles + all timestamps + new email format
7. Check the git log and explain: how many commits does main have? Draw the graph.

**Bonus challenge — interactive rebase:**
1. Create a branch with 4 "messy" commits (like "wip", "fix typo", "fix typo again", "final")
2. Use `git rebase -i HEAD~4` to squash them into 1 clean commit
3. Merge to main — main should show only the 1 clean commit

---

## REFERENCE CARD

```bash
# Branches
git branch                          # list local branches
git branch -a                       # list all (including remote)
git checkout -b <branch>            # create and switch to new branch
git checkout <branch>               # switch to existing branch
git branch -d <branch>              # delete merged branch
git branch -D <branch>              # force delete (unmerged) ⚠️

# Merging
git merge <branch>                  # merge branch into current
git merge --no-ff <branch>          # force merge commit (even if fast-forward)
git merge --abort                   # abort a conflicted merge
git merge --squash <branch>         # squash all commits into one (then git commit)

# Rebasing
git rebase <branch>                 # rebase current branch onto branch
git rebase -i HEAD~<n>              # interactive rebase: last n commits
git rebase --continue               # continue after resolving conflict
git rebase --abort                  # abort and return to pre-rebase state
git rebase --skip                   # skip the current conflicted commit

# During a conflict
git status                          # see which files are conflicted
git diff                            # see the conflicts in each file
git add <file>                      # mark conflict as resolved
git commit                          # for merge (rebase uses --continue)

# Log inspection
git log --oneline --graph --all     # visual branch history
git log --merges                    # only show merge commits
git log --no-merges                 # exclude merge commits
```
