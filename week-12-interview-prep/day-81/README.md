# Day 81 — Review Weak Areas + DSA + System Design 6-10

**Status:** 📋 READY TO START
**Week:** 12 | **Theme:** Interview Preparation

---

## Today's Goal

Yesterday's mock interview showed you exactly where you're weak. Today you attack those weak areas directly. No general review — only the specific things that went wrong or felt shaky. Then 5 DSA problems and system design questions 6-10.

By end of today:
- Weak areas from mock interview debrief drilled and improved
- 5 DSA problems solved (medium difficulty, timed)
- System design questions 6-10 walked through aloud

---

## What to Open

1. `interview-vault/mock-interview-log.md` — your debrief from yesterday
2. `interview-vault/05-system-design.md` — questions 6-10
3. Whichever question files cover your weak areas

---

## Morning (8:00 – 11:00 AM) — Attack Weak Areas

### Read your debrief first

Open `interview-vault/mock-interview-log.md`. Read what you wrote yesterday. Find the section "Specific Things to Improve". Those items are your agenda for this morning.

### If you struggled with the coding problem:

Go back to that problem type. Solve 2-3 more problems in the same pattern. The goal is to make the pattern feel routine, not to memorize one solution.

Common patterns that trip people up in first mock interviews:
- **Two pointers**: practice on sorted array problems
- **Sliding window**: practice on substring/subarray problems
- **Hash map for O(n)**: anytime you have a brute-force O(n²), ask "can a hash map help?"
- **Tree/graph traversal**: BFS for shortest path, DFS for all paths / detecting cycles

### If you struggled to talk while coding:

Pick any problem you already know the solution to. Solve it again — but this time, narrate every single line you write:
> "I'm initializing a hash map to track... I'm iterating through the array, and for each element I'm checking... if I find it in the map, that means I've seen it before, so... otherwise I add it..."

Practice narrating until it feels less weird.

### If you blanked on a technical question:

Find that question in the interview vault. Read the answer. Close the file. Say the answer out loud three times, then write a short version in your own words.

---

## Midday (11:20 AM – 1:30 PM) — System Design Questions 6-10

Use the same structure for each: **Requirements → Components → Trade-offs → What would break at scale**

**"How would you design a multi-step form?"**
> Requirements: preserve state across steps, handle back/forward navigation, validate each step before proceeding. Design: store all form state in a parent component or Zustand store (not local state per step — you'd lose data on unmount). Step component only renders current step. Progress bar shows position. On submit: all validation passes → single API call with complete data. Edge cases: what if user refreshes? (persist to sessionStorage). What if the submit fails? (show step with error, don't clear data).

**"How would you design a drag-and-drop kanban board?"**
> Requirements: drag cards between columns, persist order, optimistic updates. Libraries: HTML5 Drag and Drop API (verbose but no dependency) or a library like `@dnd-kit/core`. Data model: columns array, each column has cards array with order field. On drop: update local state immediately (optimistic) → PATCH to API → revert if API fails. Key concerns: accessibility (keyboard drag-and-drop), touch support (mobile), performance if board has hundreds of cards.

**"How would you implement dark mode?"**
> Options: CSS variables (change root variables on toggle), Tailwind dark mode class (`dark:bg-gray-900` on `html`), or CSS prefers-color-scheme media query. Best approach: CSS variables for design tokens + class toggle on `<html>`. Persist preference to `localStorage`. Respect system preference on first visit via `window.matchMedia('(prefers-color-scheme: dark)')`. No flash on load: read from localStorage in a blocking `<script>` before body renders (or use Next.js middleware for server-side).

**"How would you design a data table with sorting, filtering, and pagination?"**
> Requirements: sort by any column, filter rows, paginate. Design: derive displayed rows from: `allRows → filter(searchTerm) → sort(column, direction) → slice(page * pageSize, (page+1) * pageSize)`. Keep raw data in state, compute display on render. For large datasets: move filtering/sorting/pagination to the server — only fetch the current page. Use `TanStack Table` (React Table) for complex table logic rather than rebuilding it.

**"How would you handle authentication in a React SPA?"**
> Login form → POST credentials → receive JWT → store in `httpOnly` cookie (NOT localStorage — XSS can steal localStorage). On every API request, the cookie is sent automatically. On app load: hit a `/me` endpoint to check if session is valid → update auth state. Protected routes: check auth state in React Router's loader or a `<ProtectedRoute>` wrapper — redirect to `/login` if not authenticated. Logout: call `/logout` endpoint → server invalidates session → clear local auth state.

---

## Afternoon (1:30 – 3:30 PM) — 5 DSA Problems, Timed

### Rules for this session:
- Pick 5 medium-difficulty problems from LeetCode or your existing problem set
- Set a timer for 20 minutes per problem
- Explain your approach out loud before writing code
- If you don't solve it in 20 minutes, look at the solution, understand it, then solve it again from scratch without looking

**Focus areas (pick what's weakest for you):**
- Binary search
- Linked list (reverse, detect cycle, find middle)
- BFS/DFS on trees
- Dynamic programming (start with 1D: climbing stairs, coin change, house robber)
- Stack problems (valid parentheses, daily temperatures)

Create `day-81-dsa.js` — all 5 problems with solutions and complexity analysis.

---

## End of Day Checklist

- [ ] Read mock interview debrief — weak areas identified
- [ ] Morning spent attacking specific weak areas (not general review)
- [ ] If coding: solved 2-3 more problems in the same pattern
- [ ] If talking: narrated a known solution out loud from start to finish
- [ ] If technical knowledge: said the answer out loud 3 times, then wrote it in own words
- [ ] System design 6-10: walked through aloud with full structure
- [ ] 5 DSA problems in `day-81-dsa.js` — timed, approach stated before coding, complexity noted
- [ ] Reviewed any solutions you didn't reach in time — solved again from scratch

---

*Reviewing your debrief is not enough. You have to do the thing you were bad at, again, today. That is how weaknesses become strengths.*
