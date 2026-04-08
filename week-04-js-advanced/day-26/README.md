# Day 26 — WEEK 4 PROJECT: Task Manager App + Deploy

**Status:** 📋 READY TO START
**Week:** 4 | **Theme:** JavaScript Advanced

---

## What You're Building Today

This is your **second deployed project**. You built Weather App in Week 3. Today you build a full **Task Manager** from scratch — no template, no starter code.

This project exists to prove you can build a complete app with vanilla JS. No React. No framework. Just HTML, CSS, and JavaScript, using every pattern you've learned this week.

Live URL on Vercel by end of day.
LinkedIn post by end of day.
Hashnode blog post by end of day.

---

## Create the Project Folder

```
day-26/
  task-manager/
    index.html
    style.css
    app.js
```

Create the `task-manager/` folder inside `day-26/`. That's it. Three files.

---

## Features to Build

### Core Features (must have all of these)

- **Add task** — title (required), priority (high / medium / low), due date
- **Edit task** — click a task to open edit mode, change any field
- **Delete task** — show a confirmation before deleting (no accidental deletions)
- **Mark complete / incomplete** — click to toggle, show visual difference
- **Filter** — All / Active / Completed / High Priority / Medium Priority / Low Priority
- **Sort** — by date (newest / oldest), by priority (high → low), by name (A-Z)
- **Search with debounce** — live search as user types, but only fires after 300ms pause
- **Persist in localStorage** — reload the page, tasks are still there

### Stretch Goals (attempt after core is working)

- Drag and drop to reorder tasks
- Responsive design — works on mobile too
- Task count by priority in a summary bar

---

## Patterns to Use (required — name them in comments)

In `app.js`, mark which pattern you're using with a comment:

```js
// === PATTERN: Factory ===
function createTask(title, priority, dueDate) {
  return {
    id: Date.now().toString(),
    title,
    priority,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString()
  };
}
```

| Pattern | Where to use it |
|---------|----------------|
| **Factory** | `createTask()` — every task created through one function |
| **State Machine** | Task states: `active → completed → active` (toggle), edit mode on/off |
| **Debounce** | Search input — use YOUR debounce from Day 23, not a library |
| **Observer** | localStorage sync — whenever state changes, sync to storage |
| **Frequency Counter** | Count tasks by priority for the summary bar |

---

## How to Build — Step by Step

### Step 1 — HTML Structure (30 min)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task Manager</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app">
    <header class="app-header">
      <h1>Task Manager</h1>
      <div class="summary" id="summary"></div>
    </header>

    <section class="add-task">
      <input id="taskTitle" type="text" placeholder="Task title..." required>
      <select id="taskPriority">
        <option value="high">High</option>
        <option value="medium" selected>Medium</option>
        <option value="low">Low</option>
      </select>
      <input id="taskDueDate" type="date">
      <button id="addBtn">Add Task</button>
    </section>

    <section class="controls">
      <input id="searchInput" type="text" placeholder="Search tasks...">
      <div class="filters">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="active">Active</button>
        <button class="filter-btn" data-filter="completed">Completed</button>
        <button class="filter-btn" data-filter="high">High Priority</button>
        <button class="filter-btn" data-filter="medium">Medium Priority</button>
        <button class="filter-btn" data-filter="low">Low Priority</button>
      </div>
      <select id="sortSelect">
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="priority">Priority (High → Low)</option>
        <option value="name">Name (A–Z)</option>
      </select>
    </section>

    <main id="taskList" class="task-list"></main>
  </div>

  <script src="app.js"></script>
</body>
</html>
```

---

### Step 2 — CSS (45 min)

Build a clean, functional design. No framework. Pure CSS.

Key things to style:
- Priority colors: red for high, amber for medium, green for low
- Completed tasks: strikethrough + reduced opacity
- Active filter button: highlighted
- Task card: padding, border-radius, hover state
- Add section: a row of inputs + button

Reference the Weather App's CSS for patterns you already know.

---

### Step 3 — `app.js` Core State (30 min)

```js
// === PATTERN: Factory ===
function createTask(title, priority, dueDate) {
  return {
    id: Date.now().toString(),
    title,
    priority,
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString()
  };
}

// === STATE ===
let tasks = [];
let currentFilter = "all";
let currentSort = "newest";
let searchQuery = "";

// === PATTERN: Observer — sync state to localStorage on every change ===
function saveToStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadFromStorage() {
  const saved = localStorage.getItem("tasks");
  tasks = saved ? JSON.parse(saved) : [];
}
```

---

### Step 4 — Render Function (45 min)

One function that re-renders the task list based on current state:

```js
function getFilteredAndSorted() {
  let result = [...tasks];

  // Apply search filter
  if (searchQuery.trim()) {
    result = result.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply filter tab
  if (currentFilter === "active")    result = result.filter(t => !t.completed);
  if (currentFilter === "completed") result = result.filter(t => t.completed);
  if (currentFilter === "high")      result = result.filter(t => t.priority === "high");
  if (currentFilter === "medium")    result = result.filter(t => t.priority === "medium");
  if (currentFilter === "low")       result = result.filter(t => t.priority === "low");

  // Apply sort
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  if (currentSort === "newest")   result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (currentSort === "oldest")   result.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  if (currentSort === "priority") result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  if (currentSort === "name")     result.sort((a, b) => a.title.localeCompare(b.title));

  return result;
}

function render() {
  const list = document.querySelector("#taskList");
  const visible = getFilteredAndSorted();

  if (visible.length === 0) {
    list.innerHTML = `<p class="empty-state">No tasks found.</p>`;
    return;
  }

  list.innerHTML = visible.map(task => `
    <div class="task-card priority-${task.priority} ${task.completed ? "completed" : ""}" data-id="${task.id}">
      <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""}>
      <div class="task-content">
        <span class="task-title">${task.title}</span>
        ${task.dueDate ? `<span class="task-date">Due: ${task.dueDate}</span>` : ""}
      </div>
      <span class="priority-badge">${task.priority}</span>
      <div class="task-actions">
        <button class="edit-btn" data-id="${task.id}">Edit</button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    </div>
  `).join("");

  updateSummary();
}
```

---

### Step 5 — Add, Toggle, Delete, Edit (45 min)

```js
function addTask() {
  const title = document.querySelector("#taskTitle").value.trim();
  if (!title) return;

  const priority = document.querySelector("#taskPriority").value;
  const dueDate = document.querySelector("#taskDueDate").value;

  tasks.push(createTask(title, priority, dueDate)); // Factory pattern
  saveToStorage();   // Observer pattern
  render();

  document.querySelector("#taskTitle").value = "";
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
  saveToStorage();
  render();
}

function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  tasks = tasks.filter(t => t.id !== id);
  saveToStorage();
  render();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newTitle = prompt("Edit task:", task.title);
  if (newTitle === null) return; // cancelled
  if (!newTitle.trim()) return;  // empty

  task.title = newTitle.trim();
  saveToStorage();
  render();
}
```

---

### Step 6 — Event Delegation + Search Debounce (30 min)

```js
// === PATTERN: Debounce (your implementation from Day 23) ===
function debounce(fn, delay) {
  let timeoutId = null;
  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
}

// Event delegation — ONE listener for all task actions
document.querySelector("#taskList").addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains("task-check"))  toggleTask(e.target.closest(".task-card").dataset.id);
  if (e.target.classList.contains("delete-btn"))  deleteTask(id);
  if (e.target.classList.contains("edit-btn"))    editTask(id);
});

// Add task button
document.querySelector("#addBtn").addEventListener("click", addTask);

// Enter key in title input
document.querySelector("#taskTitle").addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

// Search with debounce
const handleSearch = debounce((query) => {
  searchQuery = query;
  render();
}, 300);

document.querySelector("#searchInput").addEventListener("input", e => {
  handleSearch(e.target.value);
});

// Filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Sort
document.querySelector("#sortSelect").addEventListener("change", e => {
  currentSort = e.target.value;
  render();
});
```

---

### Step 7 — Summary Bar (Frequency Counter pattern) (15 min)

```js
// === PATTERN: Frequency Counter ===
function updateSummary() {
  const counts = tasks.reduce((acc, t) => {
    acc.total++;
    if (t.completed) acc.completed++;
    acc[t.priority] = (acc[t.priority] || 0) + 1;
    return acc;
  }, { total: 0, completed: 0 });

  document.querySelector("#summary").textContent =
    `${counts.total} tasks · ${counts.completed} done · ${counts.high || 0} high · ${counts.medium || 0} medium · ${counts.low || 0} low`;
}
```

---

### Step 8 — Initialize on Load (5 min)

```js
// On page load
loadFromStorage();
render();
```

---

## Deploy to Vercel (30 min)

1. Push your code to GitHub: `git add . && git commit -m "Day 26: Task Manager built" && git push origin main`
2. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
3. Set **Root Directory** to `week-04-js-advanced/day-26/task-manager`
4. Click Deploy
5. Copy your live URL

---

## LinkedIn Post

Post this after you get your live URL:

> Week 4 complete! Built a full Task Manager from scratch — vanilla JS, no frameworks.
>
> Features: add/edit/delete tasks, priority system, filter + sort + search (with my own debounce function), localStorage persistence, and responsive design.
>
> I also implemented debounce, throttle, Promise.all, and an event emitter from scratch this week — the kind of stuff that comes up in every frontend interview.
>
> Live app: [paste URL]
> Code: [paste GitHub link]
>
> #buildinpublic #javascript #frontend #100daysofcode

---

## Hashnode Blog Post

Write a second post titled: **"Weeks 3-4: What I Learned Building Real Apps with Vanilla JS"**

Include:
- What the Event Loop actually is (in your words)
- Why building debounce from scratch was worth it
- What patterns you'll carry into React
- Links to both deployed projects (Weather App + Task Manager)

---

## Week 4 Self-Check

Complete this before marking Day 26 done:

- [ ] Can I implement `map`, `filter`, `reduce` from scratch — without looking?
- [ ] Can I build `debounce` and `throttle` from scratch — without looking?
- [ ] Can I explain the event loop (microtasks vs macrotasks) — out loud, to someone?
- [ ] Can I build a complete app with vanilla JS?
- [ ] Did I solve 30+ DSA problems this week?
- [ ] Are BOTH projects (Weather App + Task Manager) deployed and working?

---

## Wrap Up

Commit:
```bash
git add .
git commit -m "Day 26: Task Manager app built and deployed! Week 4 complete."
git push origin main
```

---

## End of Day Checklist

- [ ] Created `day-26/task-manager/` with `index.html`, `style.css`, `app.js`
- [ ] All 8 core features working (add, edit, delete, toggle, filter, sort, search, localStorage)
- [ ] Factory pattern used for `createTask()`
- [ ] Debounce pattern used for search (YOUR implementation, no library)
- [ ] Observer pattern used for localStorage sync
- [ ] Frequency Counter used for summary bar
- [ ] Pattern names commented in `app.js`
- [ ] Deployed on Vercel — have a live URL
- [ ] LinkedIn post published with live link
- [ ] Hashnode blog post published
- [ ] Week 4 Self-Check completed
- [ ] Committed and pushed to GitHub

---

## Quick Reference — Patterns Used Today

```
createTask()        → Factory (consistent object shape)
toggle/edit/delete  → State Machine (controlled state transitions)
search input        → Debounce (rate limiting)
saveToStorage()     → Observer (sync side effect on change)
updateSummary()     → Frequency Counter (count by category)
#taskList listener  → Event Delegation (one listener, many targets)
```

---

*Two projects deployed. Two weeks of patterns internalized. You are no longer a beginner.*
