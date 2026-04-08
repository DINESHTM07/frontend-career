# Day 26 Tasks — WEEK 4 PROJECT: Task Manager App + Deploy

## Setup (8:00 – 8:15 AM)
- [ ] Create folder `day-26/task-manager/` inside `week-04-js-advanced/`
- [ ] Create `index.html`, `style.css`, `app.js` — all empty for now
- [ ] Open the folder with Live Server — confirm blank page loads

## HTML Structure Block (8:15 – 8:45 AM)
- [ ] Add the full HTML structure from README (header, add-task section, controls section, task list)
- [ ] Confirm all IDs are correct: `#taskTitle`, `#taskPriority`, `#taskDueDate`, `#addBtn`, `#searchInput`, `#taskList`, `#summary`, `#sortSelect`
- [ ] Add all 6 filter buttons with correct `data-filter` attributes
- [ ] Link `style.css` and `app.js` — confirm no console errors

## CSS Block (8:45 – 9:30 AM)
- [ ] Style the app container — max-width, centered, padding
- [ ] Style the header and summary bar
- [ ] Style the add-task section — row layout, inputs + button
- [ ] Style the filter buttons — active state highlighted
- [ ] Style the task card — padding, border-radius, hover
- [ ] Style priority colors: `.priority-high`, `.priority-medium`, `.priority-low`
- [ ] Style completed tasks — strikethrough title, reduced opacity
- [ ] Style the priority badge (small colored tag on the card)
- [ ] Style empty state message

## Core JS — State and Factory (9:30 – 10:00 AM)
- [ ] Write `createTask(title, priority, dueDate)` — Factory pattern, generates unique id
- [ ] Write initial state: `tasks`, `currentFilter`, `currentSort`, `searchQuery`
- [ ] Write `saveToStorage()` — Observer pattern, JSON stringify to localStorage
- [ ] Write `loadFromStorage()` — parse JSON from localStorage, default to []
- [ ] Write `updateSummary()` — Frequency Counter pattern, count by priority + total

## Render Function (10:00 – 10:45 AM)
- [ ] Write `getFilteredAndSorted()` — apply search, filter tab, then sort
- [ ] Write `render()` — maps visible tasks to HTML, sets `#taskList.innerHTML`
- [ ] Confirm: empty state shows "No tasks found." when list is empty
- [ ] Confirm: task card shows title, due date (if set), priority badge, edit + delete buttons, checkbox

## CRUD Functions (10:45 – 11:30 AM)
- [ ] Write `addTask()` — validate title, push `createTask()`, save, render, clear input
- [ ] Write `toggleTask(id)` — find by id, flip `completed`, save, render
- [ ] Write `deleteTask(id)` — confirm dialog first, filter out id, save, render
- [ ] Write `editTask(id)` — prompt for new title, validate, update, save, render
- [ ] Test manually: add a task, check it off, edit it, delete it

## Debounce Block (11:30 AM – 12:00 PM)
- [ ] Paste YOUR `debounce(fn, delay)` from Day 23 into `app.js` (no library)
- [ ] Wire up `#searchInput` with `debounce(handleSearch, 300)`
- [ ] Confirm "search" label in comment: `// === PATTERN: Debounce ===`
- [ ] Test: type quickly, confirm search only fires after 300ms pause

## Event Wiring (12:00 – 1:00 PM)
- [ ] Add click listener on `#addBtn`
- [ ] Add keydown listener on `#taskTitle` — Enter key calls `addTask()`
- [ ] Add event delegation listener on `#taskList` — handles checkbox, edit, delete by class
- [ ] Add click listeners on all `.filter-btn` buttons — toggle active class, set `currentFilter`, render
- [ ] Add change listener on `#sortSelect` — set `currentSort`, render
- [ ] Call `loadFromStorage()` then `render()` on page load
- [ ] Test full flow: add 3 tasks, filter, sort, search, reload page — tasks persist

## Lunch (1:00 – 2:00 PM)

## Polish + Stretch (2:00 – 3:30 PM)
- [ ] Verify all 6 filters work correctly
- [ ] Verify all 4 sort orders work correctly
- [ ] Verify localStorage persists across page reloads
- [ ] Verify delete confirmation dialog appears before deletion
- [ ] Fix any layout issues on a narrower window (responsive check)
- [ ] Stretch: add drag-and-drop reordering (HTML5 draggable API)
- [ ] Stretch: add task count badges to filter buttons

## Deploy to Vercel (3:30 – 4:00 PM)
- [ ] Run: `git add . && git commit -m "Day 26: Task Manager app built and deployed! Week 4 complete." && git push origin main`
- [ ] Go to vercel.com → New Project → Import GitHub repo
- [ ] Set Root Directory to `week-04-js-advanced/day-26/task-manager`
- [ ] Click Deploy — wait for build to complete
- [ ] Open the live URL — test all features in production
- [ ] Copy live URL

## LinkedIn + Blog (4:00 – 5:00 PM)
- [ ] Write LinkedIn post (template in README) — include live URL + GitHub link — post it
- [ ] Write Hashnode blog post "Weeks 3-4: What I Learned Building Real Apps with Vanilla JS"
- [ ] Include: event loop explanation, why building debounce mattered, both project links
- [ ] Publish the post — copy URL

## Week 4 Self-Check (5:00 – 5:30 PM)
- [ ] Can I implement `map/filter/reduce` from scratch? (yes / need review)
- [ ] Can I build `debounce` and `throttle` from scratch? (yes / need review)
- [ ] Can I explain the event loop out loud? (yes / need review)
- [ ] Did I solve 30+ DSA problems this week? (count: ___)
- [ ] Are both projects deployed? Weather App: ___ | Task Manager: ___

## Wrap Up (5:30 PM)
- [ ] Final git push if any last changes
- [ ] Update this file with live URL: ___
- [ ] Update `journal.md` — proudest moment this week, what to practice next week

## Stretch Goals
- [ ] Add task categories / tags (beyond priority)
- [ ] Add due-date color coding (overdue = red, due today = amber)
- [ ] Add keyboard shortcuts (e.g., `n` to focus the new task input)
- [ ] Add a "Clear completed" button that deletes all completed tasks at once
