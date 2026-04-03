# Complete Git Reference Cheatsheet

---

## CONCEPT

Git is a **distributed version control system** — every developer has the full history of the project. It tracks changes as snapshots (commits), not file diffs. Each commit points to its parent, forming a directed acyclic graph (DAG) of your project's history.

**Three areas to know:**
- **Working directory**: Your files as you edit them.
- **Staging area (index)**: Changes queued for the next commit (`git add`).
- **Repository**: Committed snapshots (`.git/` folder).

---

## WHY IT MATTERS

- Every professional developer uses Git daily. It's the baseline skill.
- Understanding branching, rebasing, and conflict resolution separates juniors from seniors.
- Good commit hygiene makes code review, debugging (`git bisect`), and reverting easier.
- You'll use GitHub/GitLab/Bitbucket for PRs, code review, and CI/CD — Git is the foundation.

---

## EXAMPLES

### 1. Setup and init

```bash
# Global config (first thing after installing Git)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global core.editor "code --wait"    # VS Code as editor
git config --global init.defaultBranch main

# View config
git config --list
git config user.name

# Initialize a new repo
git init                   # Current directory
git init my-project        # New directory

# Clone an existing repo
git clone https://github.com/user/repo.git
git clone https://github.com/user/repo.git my-folder  # Custom folder name
git clone --depth 1 https://...                        # Shallow clone (only latest)
```

### 2. Staging and committing

```bash
# Check status
git status                 # Full status
git status -s              # Short format: M = modified, A = added, ?? = untracked

# Stage files
git add file.txt           # Single file
git add src/               # Entire directory
git add *.ts               # Pattern
git add -p                 # Interactive: stage hunks (parts of a file) — very useful!
git add .                  # All changes in current directory

# Unstage (keep changes in working directory)
git restore --staged file.txt

# Commit
git commit -m "feat: add user authentication"
git commit --amend -m "fix: correct typo in auth"   # Rewrite LAST commit message
                                                      # (only before pushing!)

# Good commit message format (Conventional Commits):
# <type>(<scope>): <description>
# Types: feat, fix, docs, style, refactor, test, chore, perf
# Examples:
# feat(auth): add JWT refresh token support
# fix(ui): correct button alignment on mobile
# refactor: extract user validation to separate module
```

### 3. Viewing history

```bash
# Log
git log                            # Full log
git log --oneline                  # Compact: hash + message
git log --oneline --graph          # ASCII graph (branches visible)
git log --oneline --graph --all    # All branches in graph
git log -5                         # Last 5 commits
git log --author="Alice"           # Filter by author
git log --since="2024-01-01"       # Since date
git log --grep="auth"              # Filter by message content
git log -- src/auth.ts             # Commits touching a specific file

# Show a specific commit
git show abc1234                   # Full details of a commit
git show HEAD                      # Latest commit
git show HEAD~2                    # 2 commits before HEAD

# Diff
git diff                           # Working dir vs staging
git diff --staged                  # Staging vs last commit
git diff main feature-branch       # Between branches
git diff HEAD~1 HEAD               # Between last two commits
```

### 4. Branches

```bash
# List branches
git branch                   # Local branches (* = current)
git branch -r                # Remote branches
git branch -a                # All (local + remote)

# Create and switch
git branch feature/login              # Create (stay on current branch)
git checkout feature/login            # Switch
git checkout -b feature/login         # Create AND switch (older syntax)
git switch -c feature/login           # Create AND switch (modern syntax)
git switch main                       # Switch to main (modern)

# Rename
git branch -m old-name new-name

# Delete
git branch -d feature/login           # Delete (only if merged)
git branch -D feature/login           # Force delete (even if unmerged)
git push origin --delete feature/login  # Delete remote branch
```

### 5. Push and pull

```bash
# Remote management
git remote add origin https://github.com/user/repo.git
git remote -v                           # List remotes
git remote rename origin upstream
git remote remove origin

# Push
git push origin main                    # Push to remote
git push -u origin feature/login        # Push + set upstream (first push)
git push                                # Push to tracked remote (after -u)
git push --tags                         # Push tags too

# Pull (fetch + merge)
git pull                                # Pull from tracked remote
git pull origin main                    # Explicit
git pull --rebase                       # Fetch + rebase instead of merge

# Fetch (update remote tracking, don't merge)
git fetch origin                        # Fetch all remote changes
git fetch --prune                       # Also remove deleted remote branches
```

### 6. Merge

```bash
# Fast-forward merge (linear history — no merge commit created)
git checkout main
git merge feature/login              # Fast-forward if main hasn't moved

# 3-way merge (creates a merge commit)
# When main has new commits since feature branch was created
git merge feature/login --no-ff      # Force merge commit even if fast-forward possible
                                     # (preferred in feature branch workflows)

# Squash merge (combine all branch commits into one on main)
git merge --squash feature/login
git commit -m "feat: add login feature"   # Then commit manually

# Abort a merge in progress
git merge --abort
```

### 7. Resolving merge conflicts

```bash
# Step-by-step conflict resolution:

# 1. Start the merge
git merge feature/login

# 2. Git reports conflicts
# CONFLICT (content): Merge conflict in src/auth.ts

# 3. Open the file — Git marks conflicts like this:
<<<<<<< HEAD
  const user = await findUser(email)     // your version (current branch)
=======
  const user = await getUser(email)      // incoming version (feature branch)
>>>>>>> feature/login

# 4. Edit the file to the correct version (remove all <<<<, ====, >>>> markers)
  const user = await findUser(email)     // keep yours, or merge both

# 5. Stage the resolved file
git add src/auth.ts

# 6. Complete the merge
git commit                               # Opens editor with merge commit message

# Useful conflict tools
git mergetool                            # Opens configured visual merge tool
git diff --diff-filter=U                 # List only conflicted files
git checkout --ours file.txt             # Take your version entirely
git checkout --theirs file.txt           # Take incoming version entirely
```

### 8. Rebase

```bash
# Rebase: move your commits on top of another branch (rewrites history)
git checkout feature/login
git rebase main                          # Replay feature commits on top of main

# Interactive rebase — rewrite, squash, reorder last N commits
git rebase -i HEAD~3                     # Last 3 commits
# Commands in editor:
# pick   = keep commit as-is
# reword = change commit message
# squash = combine with previous commit
# fixup  = squash, discard message
# drop   = delete commit entirely

# Rebase --onto (advanced — move commits to a different base)
git rebase --onto main serverfix feature/login

# Abort rebase
git rebase --abort

# Continue after resolving conflicts
git add .
git rebase --continue

# Golden rule: NEVER rebase commits that have been pushed to a shared branch
```

### 9. Stash

```bash
# Save dirty working state temporarily
git stash                                # Stash tracked changes
git stash push -m "WIP: half-done auth" # With a description
git stash -u                             # Include untracked files

# Apply and remove
git stash pop                            # Apply most recent stash + remove it
git stash apply                          # Apply most recent stash (keep it)
git stash apply stash@{2}                # Apply specific stash

# Manage stashes
git stash list                           # List all stashes
git stash show stash@{0}                 # Show what's in a stash
git stash drop stash@{0}                 # Delete a specific stash
git stash clear                          # Delete all stashes

# Create a branch from a stash
git stash branch feature/from-stash stash@{0}
```

### 10. Reset

```bash
# DANGER: reset rewrites history — don't use on shared branches

# Soft reset — undo commits, keep changes STAGED
git reset --soft HEAD~1                  # Undo last commit, keep staged

# Mixed reset (default) — undo commits, keep changes UNSTAGED
git reset HEAD~1                         # Undo last commit, changes in working dir
git reset HEAD~3                         # Undo last 3 commits

# Hard reset — DISCARD changes entirely
git reset --hard HEAD~1                  # Undo commit AND delete changes (irreversible)
git reset --hard origin/main             # Match remote main exactly

# Unstage a file (safe)
git reset HEAD file.txt                  # Old syntax
git restore --staged file.txt            # Modern syntax
```

### 11. Revert and cherry-pick

```bash
# Revert — creates a NEW commit that undoes a previous commit (safe for shared branches)
git revert abc1234                       # Revert specific commit
git revert HEAD                          # Revert last commit
git revert HEAD~3..HEAD                  # Revert last 3 commits (3 revert commits)
git revert --no-commit HEAD~3..HEAD      # Stage all reverts, commit manually

# Cherry-pick — apply a specific commit from another branch to current branch
git cherry-pick abc1234                  # Apply that commit here
git cherry-pick abc1234 def5678          # Multiple commits
git cherry-pick main~3..main             # Range of commits
git cherry-pick --no-commit abc1234      # Stage changes without committing
```

### 12. Tags

```bash
# Create tags (usually for releases)
git tag v1.0.0                           # Lightweight tag
git tag -a v1.0.0 -m "Release 1.0.0"    # Annotated tag (recommended)
git tag -a v1.0.0 abc1234               # Tag a specific commit

# List and show
git tag                                  # List all tags
git tag -l "v1.*"                        # Filter tags
git show v1.0.0                          # Show tag details

# Push tags
git push origin v1.0.0                   # Push specific tag
git push origin --tags                   # Push all tags

# Delete tags
git tag -d v1.0.0                        # Delete local tag
git push origin --delete v1.0.0          # Delete remote tag
```

### 13. .gitignore patterns

```gitignore
# Files
.env
.env.local
.env.*.local
*.log

# Folders
node_modules/
.next/
dist/
build/
.cache/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/settings.json
.idea/
*.swp

# Wildcards
*.log          # All .log files
**/*.log       # .log files in any subdirectory
!important.log # Negate: DO track this file

# Check if file is ignored
git check-ignore -v filename

# Remove already-tracked file that should be ignored
git rm --cached .env          # Remove from index without deleting file
```

### 14. Feature branch workflow

```bash
# The standard workflow for team development

# 1. Start from up-to-date main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/user-profile

# 3. Work in small commits
git add -p              # Stage relevant hunks
git commit -m "feat(profile): add avatar upload component"
git commit -m "feat(profile): connect to S3 upload endpoint"

# 4. Stay up to date with main
git fetch origin
git rebase origin/main  # Or: git merge origin/main

# 5. Push and open PR
git push -u origin feature/user-profile
# Open PR on GitHub

# 6. After PR is merged, clean up
git checkout main
git pull origin main
git branch -d feature/user-profile
git push origin --delete feature/user-profile
```

### 15. Useful power commands

```bash
# Find what commit introduced a bug (binary search)
git bisect start
git bisect bad                     # Current commit has the bug
git bisect good v1.0.0             # This version was good
# Git checks out middle commit — test it, then:
git bisect good                    # or: git bisect bad
# Git narrows down — repeat until found
git bisect reset                   # Done — return to HEAD

# Blame — who changed this line?
git blame src/auth.ts
git blame -L 10,25 src/auth.ts     # Lines 10-25 only

# Grep through tracked files
git grep "TODO" src/

# List files changed in a commit
git diff-tree --no-commit-id -r --name-only abc1234

# Recover a dropped stash or lost commit
git reflog                         # Shows all recent HEAD positions
git checkout abc1234               # Go back to any reflog entry
```

---

## COMMON MISTAKES

1. **Committing directly to main** — Always work on a feature branch. Main should only receive changes through PRs.

2. **`git add .` without checking `git status` first** — You might stage `.env`, large binaries, or debug files. Use `git add -p` for precision.

3. **Rebasing pushed branches** — Rebase rewrites history. If someone else has your branch, rebasing creates divergent histories. Use merge for shared branches.

4. **Vague commit messages** — "fix stuff", "WIP", "changes" are useless. Write messages that explain WHY, not just what: "fix: handle null user in auth middleware (fixes #42)".

5. **Using `git reset --hard` without understanding what you'll lose** — Hard reset permanently discards working directory changes. Use `git stash` if unsure.

6. **Not using `.gitignore` early** — Once `node_modules` or `.env` is committed, removing it from history requires rewriting history (`git filter-branch` or `git filter-repo`).

7. **Force pushing to main** — `git push --force origin main` rewrites the remote's history and can destroy teammates' work. Add branch protection rules on GitHub.

8. **Ignoring merge conflicts instead of resolving them** — Deleting conflict markers without reading both versions can silently discard important changes.

---

## INTERVIEW TIP

> "Walk me through your typical Git workflow on a team project."

**Answer framework:**
1. "I start by creating a feature branch from an up-to-date main: `git checkout -b feature/name`."
2. "I commit frequently in small, logical units with conventional commit messages — this makes code review and bisecting easier."
3. "Before opening a PR, I rebase on the latest main to keep history clean: `git fetch origin && git rebase origin/main`."
4. "On the PR, I squash or rebase to clean up WIP commits before merge."
5. "I never force-push to shared branches and use `git revert` instead of `git reset` for undoing changes on main."

Bonus: Mention you know the difference between merge and rebase, and when to use each (merge for shared branches, rebase for local cleanup). Shows maturity.
