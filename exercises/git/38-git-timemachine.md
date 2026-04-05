# Exercise 38: Git Time Machine — Version Control Walkthrough

## PATTERN: Version Control

Git is a time machine for your code. Every commit is a snapshot you can return to.
This exercise walks you through the essential git operations step by step.
By the end, you'll be able to navigate git history, undo mistakes, and manage work in progress.

**Open your terminal and follow along.** Do every step — reading alone won't build muscle memory.

---

## MENTAL MODEL: How Git Works

```
Working Directory  →  Staging Area  →  Local Repository  →  Remote Repository
   (your files)       (git add)         (git commit)          (git push)

Think of it as:
  Working Dir  = your desk (messy, in-progress)
  Staging Area = your inbox (ready to file)
  Repository   = your filing cabinet (permanent record)
  Remote       = a backup safe in a different building
```

---

## PHASE 1: Create a New Repository

### Step 1.1 — Create and enter a project folder

```bash
mkdir git-timemachine-lab
cd git-timemachine-lab
```

### Step 1.2 — Initialize git

```bash
git init
```

**What happened?** Git created a hidden `.git/` folder. This is the entire repository — all history, all branches, all configuration lives here.

```bash
ls -la          # see the .git folder
git status      # "On branch main, No commits yet, nothing to commit"
```

### Step 1.3 — Configure your identity (if not already done)

```bash
git config user.name "Your Name"
git config user.email "your@email.com"

# Verify:
git config --list
```

---

## PHASE 2: Making Commits — Building History

### Step 2.1 — Create your first file

```bash
echo "# My Project" > README.md
echo "This project demonstrates git time travel." >> README.md
```

### Step 2.2 — Check status, then stage and commit

```bash
git status
# Output: README.md is listed as "Untracked files" (red)

git add README.md
git status
# Output: README.md is now "Changes to be committed" (green)

git commit -m "Initial commit: add README"
```

**CHECKPOINT:** What is the difference between `git add` and `git commit`?
> `git add` moves changes to the staging area. `git commit` saves the staged snapshot to history permanently.

### Step 2.3 — Add more files and commits

```bash
# Create an app file
cat > app.js << 'EOF'
// Version 1.0
function greet(name) {
  return "Hello, " + name;
}

console.log(greet("World"));
EOF

git add app.js
git commit -m "feat: add greet function"
```

```bash
# Improve the function
cat > app.js << 'EOF'
// Version 1.1
function greet(name, greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log(greet("World"));
console.log(greet("Alice", "Hi"));
EOF

git add app.js
git commit -m "feat: add greeting parameter with default"
```

```bash
# Add a second feature
cat > utils.js << 'EOF'
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function repeat(str, times) {
  return str.repeat(times);
}

module.exports = { capitalize, repeat };
EOF

git add utils.js
git commit -m "feat: add capitalize and repeat utilities"
```

```bash
# Intentionally add a bug (we'll fix it later)
cat > app.js << 'EOF'
// Version 1.2 — has a bug!
function greet(name, greeting = "Hello") {
  return `${greeting}, ${nme}!`;   // BUG: 'nme' should be 'name'
}

console.log(greet("World"));
EOF

git add app.js
git commit -m "refactor: simplify greet (has bug)"
```

Now you have **5 commits**. Time to explore the history.

---

## PHASE 3: Reading History — git log and git diff

### Step 3.1 — View commit history

```bash
git log
# Shows: commit hash, author, date, message — newest first

git log --oneline
# Compact view: hash (short) + message — easier to scan

git log --oneline --graph --decorate --all
# Visual branch graph — useful with multiple branches
```

**Write down** the short hashes of your 5 commits. You'll use them below.

### Step 3.2 — Compare changes with git diff

```bash
# See unstaged changes (working dir vs staging area)
git diff

# See staged changes (staging area vs last commit)
git diff --staged

# Compare two specific commits
git diff HEAD~1 HEAD
# HEAD = latest commit, HEAD~1 = one before that

# Compare commit hashes directly (use your actual hashes)
git diff <hash1> <hash2>

# See changes in a single file across commits
git diff HEAD~3 HEAD -- app.js
```

**QUESTION:** In `HEAD~1`, what does the `~1` mean?
> It means "1 commit before HEAD". `~2` = 2 before, `~3` = 3 before. You can also use `HEAD^` for the same as `~1`.

### Step 3.3 — Inspect a specific commit

```bash
git show HEAD          # show last commit's changes
git show HEAD~2        # show 3rd-most-recent commit
git show <hash>        # show any specific commit

git log --oneline app.js    # log of only commits that changed app.js
```

---

## PHASE 4: Undoing Changes

These are the most important and most feared git commands. Learn them precisely.

### Step 4.1 — Undo unstaged changes (working directory only)

```bash
# Make a change you want to undo
echo "accidental change" >> app.js

git status       # shows "modified: app.js"
git diff         # see the accidental change

# Discard the change — IRREVERSIBLE (no undo for this!)
git restore app.js
# Old syntax: git checkout -- app.js

git status       # clean again
```

⚠️ **Warning:** `git restore` discards working directory changes permanently. There is no "undo restore".

### Step 4.2 — Unstage a file (keep changes, just unstage)

```bash
# Stage a change
echo "some change" >> utils.js
git add utils.js
git status    # "Changes to be committed"

# Unstage it (keeps the change in working dir)
git restore --staged utils.js
git status    # Back to "Changes not staged for commit"

# The change is still there in utils.js — just unstaged
git diff      # you can see it
```

### Step 4.3 — Amend the last commit

```bash
# Fix that bug we introduced in the last commit
cat > app.js << 'EOF'
// Version 1.2 — fixed
function greet(name, greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log(greet("World"));
EOF

git add app.js

# Option 1: Amend — REPLACE the last commit (changes its hash)
# Use only for commits NOT yet pushed to remote
git commit --amend -m "refactor: simplify greet"

git log --oneline   # still 5 commits, but last one has new hash and fixed message
```

### Step 4.4 — git revert (safe undo — creates new commit)

```bash
# Get the hash of the "buggy" commit (the one we amended above)
git log --oneline

# Revert it: creates a NEW commit that undoes the specified commit
# This is SAFE — it doesn't rewrite history, just adds an undo commit
git revert HEAD        # revert the most recent commit
# OR
git revert <hash>      # revert any specific commit

# A commit message editor opens — save as-is (or customize)
# :wq in vim, Ctrl+O then Ctrl+X in nano
```

**When to use revert vs amend:**
- `revert`: the commit is already on a shared branch / already pushed → safe, preserves history
- `amend`: the commit is only local, not shared → cleaner, replaces the commit

### Step 4.5 — git reset (powerful — use carefully)

```bash
git log --oneline    # note your commit hashes

# reset --soft: moves HEAD back, keeps changes STAGED
# "undo the commit, but keep the changes ready to commit again"
git reset --soft HEAD~1
git status    # changes are staged
git log --oneline    # one less commit

# Recommit to restore
git commit -m "restored: same changes, different commit"

# reset --mixed (default): moves HEAD back, keeps changes UNSTAGED
git reset HEAD~1
git status    # changes are in working dir, not staged
git log --oneline

# Recommit
git add .
git commit -m "restored again"

# reset --hard: moves HEAD back, DISCARDS all changes (DANGEROUS)
# ⚠️ Only use when you are CERTAIN you want to lose those changes
# git reset --hard HEAD~1   ← commented out to prevent accidents
```

**The Three Resets:**
| Command | HEAD moves back? | Staging area? | Working dir? |
|---------|-----------------|---------------|--------------|
| `--soft` | ✅ Yes | Kept (staged) | Untouched |
| `--mixed` | ✅ Yes | Cleared | Kept |
| `--hard` | ✅ Yes | Cleared | Discarded ⚠️ |

---

## PHASE 5: git stash — Save Work in Progress

### Step 5.1 — Stash uncommitted changes

```bash
# Simulate work in progress
echo "work in progress feature" >> app.js
echo "more wip" >> utils.js

git status    # shows modified files

# Stash: saves changes and reverts working dir to clean state
git stash
git status    # clean!
git stash list    # stash@{0}: WIP on main: <hash> <message>
```

### Step 5.2 — Switch tasks, then restore stash

```bash
# You can now work on something else without losing your progress
echo "urgent hotfix" >> README.md
git add README.md
git commit -m "fix: urgent hotfix in README"

# Now restore your stashed work
git stash pop        # restores and removes from stash list
# OR
git stash apply      # restores but KEEPS it in the stash list

git status    # your WIP changes are back!
```

### Step 5.3 — Named stashes and multiple stashes

```bash
# Create a named stash
echo "feature A in progress" >> app.js
git stash push -m "feature-a: wip login form"

echo "feature B in progress" >> utils.js
git stash push -m "feature-b: wip user settings"

git stash list
# stash@{0}: On main: feature-b: wip user settings
# stash@{1}: On main: feature-a: wip login form

# Apply a specific stash
git stash apply stash@{1}    # apply feature-a

# Drop a stash you no longer need
git stash drop stash@{0}

# Clear all stashes
# git stash clear    ← commented out, use carefully
```

---

## PHASE 6: Navigating History — Detached HEAD and Checkout

### Step 6.1 — Travel to a past commit

```bash
git log --oneline    # note a hash from 2-3 commits ago

# Check out an old commit — enters "detached HEAD" state
git checkout <old-hash>
cat app.js    # see the old version!
```

**What is "detached HEAD"?**
> Normally HEAD points to a branch (like `main`). In detached HEAD state, HEAD points directly to a commit. You can look around, run the code, but any commits you make here are on no branch and will be "lost" when you checkout another branch.

```bash
git log --oneline    # you're at the old commit
git status           # "HEAD detached at <hash>"

# Return to main branch
git checkout main    # reattaches HEAD to main
git log --oneline    # back to the full history
```

### Step 6.2 — Restore a single file from history

```bash
# Get a specific file from a past commit WITHOUT detaching HEAD
git checkout HEAD~3 -- app.js    # old syntax
# OR
git restore --source HEAD~3 app.js   # new syntax

cat app.js    # shows the version from 3 commits ago

# Stage and commit if you want to keep this version
git add app.js
git commit -m "revert: restore app.js to version from HEAD~3"
```

---

## PHASE 7: Review and Reflect

### Run these commands and study the output

```bash
# Full history with all details
git log --oneline --decorate --graph --all

# Statistics: how many lines changed in each commit
git log --stat

# See the patch (diff) for each commit
git log -p

# Search commit messages
git log --grep="feat"

# Find when a specific line was added
git blame app.js    # shows which commit last changed each line
```

---

## CHECKPOINT: Answer These

1. What is the difference between `git revert` and `git reset --hard`?
   > Revert creates a new commit that undoes; history is preserved.
   > Reset --hard moves the branch pointer back and discards changes; history is rewritten.

2. When would you use `git stash` instead of creating a commit?
   > When your work is not ready to commit yet but you need to switch tasks.
   > Stash is temporary; commits are permanent.

3. What is "detached HEAD" and when does it happen?
   > HEAD is detached when it points directly to a commit instead of a branch.
   > Happens when you `git checkout <hash>` or `git checkout <tag>`.

4. Explain the staging area. Why does git have it? What would change without it?
   > The staging area lets you craft precise commits — you can stage only some of your changes.
   > Without it, every modified file goes into every commit. The staging area enables atomic commits.

---

## YOUR TURN: Build a More Complex History

Create a new repository with at least **10 commits** that exercises everything you learned:

1. Initialize repo, add `.gitignore` (ignore `node_modules/`, `.env`)
2. Create `index.html`, `style.css`, `script.js` with basic content
3. Commit each file separately (practice staging individual files)
4. Make 3 improvements across multiple files in one commit
5. Introduce a "bug" and commit it
6. Use `git revert` to fix it cleanly
7. Use `git stash` to save unfinished work, do a "hotfix", then restore the stash
8. Use `git log --oneline --graph` to visualize the history
9. Use `git blame` on one of your files — understand the output
10. Use `git restore --source HEAD~2 -- style.css` to restore an old version of one file

**Verify your understanding:** After step 10, run `git log --oneline` and explain why the history has only forward commits (no "going back") even though you restored an old file.

---

## REFERENCE CARD

```bash
# Inspecting
git status                        # current state
git log --oneline                 # history (compact)
git diff                          # unstaged changes
git diff --staged                 # staged changes
git diff HEAD~1 HEAD              # last commit's changes
git show <hash>                   # inspect one commit
git blame <file>                  # who changed each line

# Staging & Committing
git add <file>                    # stage a file
git add .                         # stage all changes
git add -p                        # stage interactively (by hunk)
git commit -m "message"           # commit
git commit --amend                # replace last commit (local only)

# Undoing
git restore <file>                # discard unstaged changes ⚠️
git restore --staged <file>       # unstage a file
git revert <hash>                 # safe undo (new commit)
git reset --soft HEAD~1           # undo commit, keep staged
git reset HEAD~1                  # undo commit, keep unstaged
git reset --hard HEAD~1           # undo commit, discard changes ⚠️

# Stashing
git stash                         # save WIP
git stash pop                     # restore and remove
git stash apply stash@{0}         # restore, keep in list
git stash list                    # see all stashes
git stash drop stash@{0}          # remove one stash

# Navigating
git checkout <hash>               # go to old commit (detached)
git checkout main                 # return to branch
git restore --source <hash> -- <file>  # restore one file from history
```
