# Day 51 — Dashboard Build: Sidebar + Header Layout

**Status:** 📋 READY TO START
**Week:** 8 | **Theme:** React Advanced + Dashboard Project

---

## Today's Goal

Start building the Analytics Dashboard. By end of today the shell is done: sidebar navigation, header, responsive grid layout, dark mode toggle. No charts yet — just the structure everything else will plug into.

By end of today:
- Dashboard app runs locally with sidebar + header
- Sidebar has nav links (Overview, Analytics, Reports, Settings)
- Header has title + dark mode toggle
- Layout is responsive (sidebar collapses on mobile)
- Dark mode works and persists

---

## Before You Start — Study the Complete Version

Open `project-starters/dashboard-complete/` in your editor. Spend 20 minutes reading the file structure and the layout components. You are not copying — you are understanding the architecture so your starter makes deliberate choices, not random ones.

Questions to answer while reading:
- How is the sidebar state managed? (local state? context? store?)
- How does dark mode get applied? (CSS class on `<html>`? CSS variables?)
- What does the layout component look like — is it one big component or split?
- What routes does the app have?

Close the complete version. Build your starter from memory and judgment.

---

## Morning (8:00 – 11:00 AM) — Project Setup

### Step 1 — Create the project

```bash
# In project-starters/ folder
npm create vite@latest dashboard-starter -- --template react-ts
cd dashboard-starter
npm install
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure Tailwind in `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',   // dark mode via class on <html>
  theme: { extend: {} },
  plugins: [],
}
```

Add Tailwind directives to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 2 — Plan the file structure

Create these folders before writing any components:
```
src/
  components/
    layout/       ← Sidebar, Header, MainLayout
    ui/           ← Card, StatCard, Button (shared primitives)
    charts/       ← chart components (Day 53)
  pages/
    OverviewPage.tsx
    AnalyticsPage.tsx
    ReportsPage.tsx
    SettingsPage.tsx
  hooks/
    useDarkMode.ts
  store/
    dashboardStore.ts  ← (if using Zustand — optional)
  data/
    mockData.ts        ← all mock data in one place
```

### Step 3 — Set up routing

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import OverviewPage from './pages/OverviewPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

---

## Midday (11:20 AM – 1:30 PM) — Build the Layout

### Sidebar

```tsx
// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/overview', label: 'Overview' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
]

interface SidebarProps {
  isOpen: boolean
}

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside className={`
      h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
      transition-all duration-300
      ${isOpen ? 'w-64' : 'w-0 overflow-hidden md:w-16'}
    `}>
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {isOpen ? 'Dashboard' : 'D'}
        </h1>
      </div>
      <nav className="mt-4">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center px-4 py-3 text-sm font-medium transition-colors
              ${isActive
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
              }
            `}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
```

### Header

```tsx
// src/components/layout/Header.tsx
interface HeaderProps {
  onToggleSidebar: () => void
  isDark: boolean
  onToggleDark: () => void
}

export default function Header({ onToggleSidebar, isDark, onToggleDark }: HeaderProps) {
  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      <button
        onClick={onToggleDark}
        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Toggle dark mode"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </header>
  )
}
```

### MainLayout + Dark Mode

```tsx
// src/components/layout/MainLayout.tsx
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('darkMode', String(isDark))
  }, [isDark])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          isDark={isDark}
          onToggleDark={() => setIsDark(d => !d)}
        />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

### Stub the Pages

Each page just needs a placeholder for now:

```tsx
// src/pages/OverviewPage.tsx
export default function OverviewPage() {
  return <div className="text-gray-900 dark:text-white"><h1>Overview</h1></div>
}
```

Create the same stub for Analytics, Reports, and Settings.

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-51-dsa.js` in this folder.

---

## End of Day Checklist

- [ ] Studied `dashboard-complete` file structure for 20 minutes — can describe the architecture
- [ ] Created `dashboard-starter` with Vite + TypeScript + React Router + Tailwind
- [ ] `darkMode: 'class'` configured in Tailwind
- [ ] File structure created: `components/layout/`, `components/ui/`, `pages/`, `hooks/`, `data/`
- [ ] Routing works: `/overview`, `/analytics`, `/reports`, `/settings` all load
- [ ] Sidebar renders with nav links — NavLink highlights active route
- [ ] Sidebar toggle button collapses/expands the sidebar
- [ ] Header renders with toggle buttons for sidebar and dark mode
- [ ] Dark mode toggle works — `dark` class added to `<html>`, persists on refresh
- [ ] Layout holds together: sidebar left, header top, content fills remaining space
- [ ] Completed 3 DSA problems in `day-51-dsa.js`

---

*The shell is everything. Content is easy to add — layout is hard to change later. Get it right today.*
