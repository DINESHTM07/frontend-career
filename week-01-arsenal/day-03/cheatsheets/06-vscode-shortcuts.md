# VS Code Shortcuts & Extensions Cheatsheet

---

## CONCEPT

VS Code is the dominant editor for frontend development. Knowing its shortcuts turns it from a text editor into a power tool — navigating large codebases, multi-cursor editing, refactoring, and terminal management without ever leaving the keyboard. The Command Palette alone (`Ctrl+Shift+P`) gives you access to every feature by name.

**Key mental model:** Every repetitive mouse action has a keyboard equivalent. The goal is to keep your hands on the keyboard and your eyes on the code.

---

## WHY IT MATTERS

- Faster coding = more output per hour, especially during technical interviews.
- Multi-cursor editing eliminates repetitive rename tasks that juniors do manually.
- Knowing extensions separates developers who fight their tooling from those who leverage it.
- Many technical screeners and pair programming sessions happen in VS Code — fluency is visible.

---

## EXAMPLES

### 1. File & Workspace Navigation

```
Ctrl+P                  → Quick Open: go to any file by name (fuzzy search)
                          Type "user" → finds UserCard.tsx, useUser.ts, etc.
                          Type ":42" after filename → jump to line 42
                          Type "@" → jump to symbol in file
                          Type "#" → search symbols across workspace

Ctrl+Shift+P            → Command Palette: run any VS Code command by name
                          "Format Document", "Toggle Word Wrap", "Rename Symbol"

Ctrl+Shift+E            → Toggle Explorer panel (file tree)
Ctrl+Shift+G            → Toggle Source Control panel (git)
Ctrl+B                  → Toggle sidebar visibility

Ctrl+Tab                → Cycle through open editor tabs
Ctrl+W                  → Close current tab
Ctrl+Shift+T            → Reopen last closed tab

Ctrl+\                  → Split editor (open current file on right side)
Ctrl+1 / Ctrl+2         → Focus left / right editor pane

Ctrl+Shift+`            → Open new integrated terminal
Ctrl+`                  → Toggle terminal panel visibility
```

### 2. Multi-Cursor & Selection

```
Alt+Click               → Place additional cursor at click position
                          Click 5 places → edit all 5 simultaneously

Ctrl+D                  → Select current word; press again to select NEXT occurrence
                          Great for renaming a variable in 5 places at once

Ctrl+Shift+L            → Select ALL occurrences of current word at once
                          More aggressive than Ctrl+D

Alt+Shift+I             → Add cursor to end of each line in selection
                          Select 10 lines → get 10 cursors at line ends

Ctrl+Alt+Up / Down      → Add cursor above / below current line (column mode)

Ctrl+L                  → Select entire current line

Ctrl+Shift+Right/Left   → Select word by word

Shift+Alt+Drag          → Column/box selection (select a rectangle of text)
```

### 3. Line Editing

```
Alt+Up / Alt+Down       → Move current line (or selection) up or down
                          No cut-paste needed — just nudge the line

Shift+Alt+Up / Down     → Duplicate current line above / below

Ctrl+Shift+K            → Delete entire current line (no clipboard)

Ctrl+Enter              → Insert new line BELOW (cursor doesn't need to be at end)
Ctrl+Shift+Enter        → Insert new line ABOVE

Ctrl+Shift+\            → Jump to matching bracket { } [ ] ( )

Ctrl+] / Ctrl+[         → Indent / outdent current line or selection

Home                    → Jump to start of line (first non-whitespace)
End                     → Jump to end of line
Ctrl+Home / End         → Jump to start / end of file
```

### 4. Comment & Format

```
Ctrl+/                  → Toggle line comment (// in JS/TS)
Shift+Alt+A             → Toggle block comment (/* */)

Shift+Alt+F             → Format entire document (runs Prettier if installed)
Ctrl+K Ctrl+F           → Format selection only

Ctrl+K Ctrl+X           → Trim trailing whitespace
```

### 5. Code Folding

```
Ctrl+Shift+[            → Fold (collapse) current code block
Ctrl+Shift+]            → Unfold (expand) current code block

Ctrl+K Ctrl+0           → Fold ALL blocks in file
Ctrl+K Ctrl+J           → Unfold ALL blocks in file

Ctrl+K Ctrl+1           → Fold level 1 (top-level)
Ctrl+K Ctrl+2           → Fold level 2
Ctrl+K Ctrl+[1-9]       → Fold to level N
```

### 6. Search & Replace

```
Ctrl+F                  → Find in current file
Ctrl+H                  → Find and Replace in current file
                          Click .* button for regex
                          Click Aa button for case-sensitive

Ctrl+Shift+F            → Global search across all files
Ctrl+Shift+H            → Global find and replace across all files

F3 / Shift+F3           → Next / previous match while in search

Alt+Enter               → Select all occurrences of search match
                          (in Find bar) → multi-cursor on all matches
```

### 7. IntelliSense & Refactoring

```
Ctrl+Space              → Trigger IntelliSense / autocomplete manually

F12                     → Go to Definition (jump to where it's defined)
Alt+F12                 → Peek Definition (inline view without leaving file)
Shift+F12               → Find All References (where is this used?)

F2                      → Rename Symbol (renames across ALL files)
                          The single most useful refactoring shortcut

Ctrl+.                  → Quick Fix / Suggestions
                          Shows: import missing module, add type, etc.

Ctrl+Shift+O            → Go to Symbol in file (functions, variables, classes)
Ctrl+T                  → Go to Symbol in workspace

Ctrl+K Ctrl+I           → Show hover info (same as hovering with mouse)
```

### 8. Terminal Shortcuts

```
Ctrl+`                  → Toggle terminal panel
Ctrl+Shift+`            → New terminal instance
Ctrl+Shift+5            → Split terminal (two terminals side by side)

Ctrl+PageUp/Down        → Switch between terminal instances
Ctrl+C                  → Kill running process (in terminal)

Ctrl+K                  → Clear terminal (while focused in terminal)
```

### 9. Zen Mode & Display

```
Ctrl+K Z                → Toggle Zen Mode (distraction-free, full screen)
Esc Esc                 → Exit Zen Mode

Ctrl++ / Ctrl+-         → Zoom in / zoom out (entire UI)
Ctrl+Shift+F11          → Toggle full screen

Ctrl+Shift+V            → Preview Markdown file
Ctrl+K V                → Preview Markdown side by side
```

### 10. Debugging Shortcuts

```
F5                      → Start / Continue debugging
Shift+F5                → Stop debugging
F9                      → Toggle breakpoint on current line
F10                     → Step Over (next line, don't enter function)
F11                     → Step Into (enter the function)
Shift+F11               → Step Out (exit current function)

Ctrl+Shift+D            → Open Debug panel
```

### 11. Essential Extensions for React Developers

```
ES7+ React/Redux/React-Native Snippets
  Publisher: dsznajder
  Key snippets:
    rafce     → React Arrow Function Component with Export
    rfc       → React Function Component
    useState  → useState hook snippet
    useEffect → useEffect hook snippet
    imp       → import statement
    imn       → import with no curly braces

Tailwind CSS IntelliSense
  Publisher: Bradlc
  Features:
    - Autocomplete for Tailwind classes as you type
    - Hover preview shows the CSS a class generates
    - Linting for invalid/unknown classes
    - Color swatches inline in editor

Prettier - Code Formatter
  Publisher: Prettier
  Setup in settings.json:
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"

ESLint
  Publisher: Microsoft
  Shows linting errors inline as you type
  Setup: project needs .eslintrc.js or eslint config in package.json

Auto Rename Tag
  Publisher: Jun Han
  Automatically renames the closing HTML/JSX tag
  when you rename the opening tag — huge time saver

Error Lens
  Publisher: Alexander
  Shows error messages INLINE on the same line
  instead of forcing you to hover over the red squiggle

GitLens
  Publisher: GitKraken
  Inline git blame ("Last changed 2 days ago by Alice")
  Full git history, visual diff, branch comparison

Thunder Client
  Publisher: Ranga Vadhineni
  Postman-style API testing inside VS Code
  Test your REST API endpoints without leaving the editor

Import Cost
  Publisher: Wix
  Shows the bundle size of each import inline
  Helps catch accidentally importing a 50kb library

Bracket Pair Colorizer 2
  (Now built into VS Code — enable via:)
  "editor.bracketPairColorization.enabled": true
```

### 12. Useful settings.json snippets

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": false,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  "editor.inlineSuggest.enabled": true,
  "editor.fontSize": 14,
  "editor.fontFamily": "'JetBrains Mono', Menlo, monospace",
  "editor.fontLigatures": true,
  "terminal.integrated.fontSize": 13,
  "explorer.compactFolders": false,
  "files.autoSave": "onFocusChange",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  }
}
```

### 13. Multi-cursor workflow example

```
Scenario: Rename 'userId' → 'user_id' in 8 places in a file

Option A (Ctrl+D):
1. Click on 'userId'
2. Press Ctrl+D 7 times to select all occurrences
3. Type 'user_id' — all 8 are replaced simultaneously

Option B (F2 — Rename Symbol):
1. Click on 'userId'
2. Press F2
3. Type 'user_id', press Enter
4. VS Code renames it in EVERY file in the project

Option C (Ctrl+Shift+L):
1. Click on 'userId'
2. Press Ctrl+Shift+L to select ALL at once
3. Type the replacement
```

### 14. Quick file creation workflow

```
Ctrl+Shift+P → "New File" → type path
Or in Explorer: right-click folder → "New File"

With path intellisense (install Path Intellisense extension):
- type ./ in import → get autocomplete for local files
- No more typos in import paths
```

### 15. Workspace tips

```
# .vscode/settings.json — project-level settings (commit this)
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}

# .vscode/extensions.json — recommended extensions for teammates
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss"
  ]
}
# Teammates see "Install recommended extensions?" prompt when opening repo
```

---

## COMMON MISTAKES

1. **Using Find+Replace manually instead of `F2` Rename Symbol** — `F2` renames across all files simultaneously and understands code scope. Manual find-replace can catch comments and strings you don't want to change.

2. **Not using `Ctrl+D` for multi-cursor rename** — Developers who manually edit each instance of a variable one by one are losing 5-10x productivity.

3. **Having Prettier and ESLint conflict** — Install `eslint-config-prettier` to disable ESLint formatting rules that conflict with Prettier. ESLint handles logic errors; Prettier handles formatting.

4. **Not committing `.vscode/extensions.json`** — Your teammates get a "install recommended extensions" prompt, ensuring everyone has the same tooling. Not committing this means new teammates set up manually.

5. **Using the wrong formatter on save** — If you have multiple formatters, VS Code will ask which to use. Set `"editor.defaultFormatter"` explicitly to avoid conflicts.

6. **Ignoring `Ctrl+Shift+P`** — Most developers only use it occasionally. But it's the gateway to every feature: "Sort Lines", "Convert Indentation to Spaces", "Toggle Word Wrap", etc.

---

## INTERVIEW TIP

> "What tools and editor setup do you use for development?"

**Answer framework:**
- "I use VS Code with Prettier for auto-formatting on save, ESLint for catching errors, and Tailwind IntelliSense for class autocomplete."
- "I rely heavily on `F2` for rename refactors across files, `Ctrl+D` for multi-cursor editing, and `Ctrl+P` for fast file navigation."
- "I commit `.vscode/extensions.json` to repos so teammates get the same recommended extensions setup."
- Bonus: Mention `Git Lens` for inline blame — shows you care about code history and collaboration, not just writing new code.
