# Day 51 Tasks — Dashboard Build: Sidebar + Header Layout

## Morning Block (8:00 – 11:00 AM) — Study + Setup
- [ ] Open `project-starters/dashboard-complete/` — study file structure for 20 min
- [ ] Answer before closing: how is sidebar state managed?
- [ ] Answer before closing: how does dark mode get applied to the DOM?
- [ ] Answer before closing: what routes does the complete version have?
- [ ] Run: `npm create vite@latest dashboard-starter -- --template react-ts` in `project-starters/`
- [ ] Install: `npm install react-router-dom`
- [ ] Install: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
- [ ] Configure Tailwind: add `content` paths + `darkMode: 'class'` to `tailwind.config.js`
- [ ] Add `@tailwind base/components/utilities` to `src/index.css`
- [ ] Create folder structure: `components/layout/`, `components/ui/`, `pages/`, `hooks/`, `data/`
- [ ] Run `npm run dev` — confirm Tailwind works (add a test class, verify it renders)

## Midday Block (11:20 AM – 1:30 PM) — Build Layout Components
- [ ] Create `src/pages/OverviewPage.tsx` with stub heading
- [ ] Create `src/pages/AnalyticsPage.tsx` with stub heading
- [ ] Create `src/pages/ReportsPage.tsx` with stub heading
- [ ] Create `src/pages/SettingsPage.tsx` with stub heading
- [ ] Set up routing in `App.tsx` — `/` redirects to `/overview`
- [ ] Confirm: all 4 routes load in browser
- [ ] Create `src/components/layout/Sidebar.tsx`
  - [ ] `isOpen` prop controls width (expanded vs collapsed)
  - [ ] `NavLink` for each route — active link has distinct styling
- [ ] Create `src/components/layout/Header.tsx`
  - [ ] Props: `onToggleSidebar`, `isDark`, `onToggleDark`
  - [ ] Sidebar toggle button renders on left
  - [ ] Dark mode toggle button renders on right
- [ ] Create `src/components/layout/MainLayout.tsx`
  - [ ] `sidebarOpen` state managed here
  - [ ] `isDark` state initialized from `localStorage`
  - [ ] `useEffect` adds/removes `dark` class on `document.documentElement`
  - [ ] `useEffect` saves `isDark` to `localStorage`
  - [ ] `<Outlet />` renders inside main content area
- [ ] Test: sidebar toggle collapses and expands sidebar
- [ ] Test: dark mode toggle flips dark/light, persists on page refresh
- [ ] Test: clicking nav links navigates and highlights the active link

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-51-dsa.js` in `week-08-react-advanced-project-2/day-51/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Run: `git add . && git commit -m "Day 51: Dashboard sidebar + header + routing + dark mode"`
