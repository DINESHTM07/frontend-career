# Day 68 Tasks — FINAL BOSS: Exercise 40 Bookmark Manager

## Morning Block (8:00 – 11:00 AM) — Read Spec + Plan

### Read the Spec
- [ ] Open `exercises/40-bookmark-manager.jsx` — read it fully
- [ ] Read it a second time — highlight every "should" requirement
- [ ] Write down all requirements in your own words (paraphrase the spec)

### Plan the Data Model
- [ ] Define `Bookmark` interface: id, url, title, tags, createdAt, isFavorite, description?
- [ ] Define any other TypeScript interfaces needed
- [ ] Write down: what is the shape of a new bookmark before an `id` is assigned?

### Plan the Architecture
- [ ] Draw or write the component tree (App → BookmarkApp → AddForm, FilterBar, Grid, Card)
- [ ] Write down: what state lives where?
- [ ] Write down: what is derived state (computed from stored state)?
- [ ] Choose persistence strategy: Zustand persist OR localStorage hook
- [ ] Write down the derivation logic for `filteredBookmarks` (filter, then sort)

## Midday Block (11:20 AM – 1:30 PM) — Build Core Features
- [ ] Create new project or file for the bookmark manager (separate from existing projects)
- [ ] Set up Zustand with persist middleware OR a `useLocalStorage` hook
- [ ] Implement add bookmark: stores `{ id: crypto.randomUUID(), ...formData, createdAt: new Date().toISOString() }`
- [ ] Build `AddBookmarkForm` — URL (required), title (optional), tags (comma-separated)
- [ ] Form resets after successful submit
- [ ] Submit button disabled when URL is empty
- [ ] Build `BookmarkCard` — shows title, URL (truncated), tags as pills, favorite star, delete button
- [ ] Build basic `BookmarkGrid` — renders cards in a responsive grid
- [ ] Test: add a bookmark → appears in grid
- [ ] Test: delete a bookmark → disappears from grid
- [ ] Test: toggle favorite star → fills/unfills
- [ ] Test: refresh page → bookmarks are still there (persistence working)
- [ ] Build `FilterBar` with search input — filters in real time using `useMemo`
- [ ] Build tag filter — clicking a tag shows only bookmarks with that tag
- [ ] Build sort dropdown or buttons: newest, oldest, A-Z
- [ ] Build empty state — shows when no bookmarks or no search results

## Afternoon Block (1:30 – 3:00 PM) — LinkedIn Post + DSA

### LinkedIn Post
- [ ] Draft the LinkedIn post (template in README)
- [ ] Include all 3 live URLs
- [ ] Mention the open source PR (even if not merged yet — "submitted" is honest)
- [ ] Publish it — do not just draft

### DSA
- [ ] Create `day-68-dsa.js` in `week-10-project-3-testing/day-68/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Write in `journal.md`: "Week 10 — Testing, Open Source, and the Final Boss"
- [ ] Run in monorepo: `git add . && git commit -m "Day 68: Bookmark manager started + LinkedIn post + DSA"`
- [ ] LinkedIn post URL: _______________
- [ ] Bookmark manager: what % complete? ____%
- [ ] What is left to build tomorrow? _______________
