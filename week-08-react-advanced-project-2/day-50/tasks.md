# Day 50 Tasks — Error Boundaries + React Patterns

## Morning Block (8:00 – 11:00 AM) — Read + ErrorBoundary
- [ ] Open `cheatsheets/react/14-react-patterns.md` — read fully
- [ ] Write down: what errors does ErrorBoundary NOT catch? (3 categories)
- [ ] Create `ErrorBoundary.jsx` with `getDerivedStateFromError` + `componentDidCatch`
- [ ] Add a `fallback` prop that renders when `hasError` is true
- [ ] Add a "Try again" button that resets `hasError` to false
- [ ] Create `BrokenWidget.jsx` that throws when `shouldCrash={true}`
- [ ] Wrap `BrokenWidget shouldCrash={true}` with `<ErrorBoundary>` — confirm fallback renders
- [ ] Wrap `BrokenWidget shouldCrash={false}` with `<ErrorBoundary>` — confirm it works normally
- [ ] Click "Try again" button — confirm error state resets

## Midday Block (11:20 AM – 1:30 PM) — Compound Components: Tabs
- [ ] Create `Tabs.jsx` with: `Tabs`, `TabList`, `Tab`, `TabPanels`, `TabPanel`
- [ ] `Tabs` owns `activeIndex` state and provides it via `createContext`
- [ ] `Tab` reads context, updates `activeIndex` on click, shows active styling
- [ ] `TabList` uses `React.Children.map` + `cloneElement` to inject `index` into each `Tab`
- [ ] `TabPanel` reads context, renders children only when `index === activeIndex`
- [ ] `TabPanels` uses `React.Children.map` + `cloneElement` to inject `index` into each `TabPanel`
- [ ] Use the Tabs in App.jsx with 3 tabs — clicking switches panels correctly
- [ ] Active tab is visually distinct (bold, underline, or background)
- [ ] Can explain to yourself: how does `Tab` know what index it is?

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-50-dsa.js` in `week-08-react-advanced-project-2/day-50/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Run: `git add . && git commit -m "Day 50: ErrorBoundary + Compound Tabs component + DSA"`
