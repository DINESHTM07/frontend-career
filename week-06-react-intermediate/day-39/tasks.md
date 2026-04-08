# Day 39 Tasks — Tailwind CSS in React

## Setup Block (8:00 – 8:30 AM)
- [ ] Run: `npm install -D tailwindcss @tailwindcss/vite` in your React project
- [ ] Open `vite.config.js` — add `import tailwindcss from '@tailwindcss/vite'` and add `tailwindcss()` to plugins array
- [ ] Create `src/index.css` with single line: `@import "tailwindcss";`
- [ ] Open `src/main.jsx` — add `import './index.css'` at the top
- [ ] In `App.jsx` add test: `<h1 className="text-3xl font-bold text-indigo-600">Tailwind Works!</h1>`
- [ ] Confirm browser shows large bold indigo heading — Tailwind is working
- [ ] Remove test heading

## Morning Block (8:30 – 11:00 AM)
- [ ] Read `cheatsheets/advanced/03-tailwind.md` fully
- [ ] Study the 20 key classes in the README — spacing, layout, typography, visual, responsive, state
- [ ] Create `src/components/TailwindCard.jsx` — using only Tailwind classes (no inline styles)
- [ ] Card has: title, description, optional badge, optional link
- [ ] `hover:shadow-md transition-shadow` — hover effect working
- [ ] Badge uses `bg-indigo-100 text-indigo-700 rounded-full px-2 py-1` pill styling
- [ ] Test by rendering 3 TailwindCards in App.jsx

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Open your Movie Search App (or Budget Tracker)
- [ ] Open each component file — delete ALL `style={{ ... }}` objects
- [ ] Replace each deleted style with equivalent Tailwind classes
- [ ] Navigation: `bg-gray-900 px-6 flex items-center gap-1`
- [ ] Active NavLink: use `clsx` or template literal for conditional active class
- [ ] Search input: `w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`
- [ ] Results grid: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`
- [ ] Movie cards: `bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer`
- [ ] Loading text: `text-gray-400 text-center py-8`
- [ ] Error text: `text-red-500 text-center py-8`
- [ ] Buttons: `px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors`
- [ ] Test: resize browser from narrow to wide — layout should shift from 1 col → 2 → 3 → 4
- [ ] Confirm mobile view looks good (all content visible, readable font size)
- [ ] `npm install clsx` if using conditional classes — use `clsx()` instead of template literals

## Afternoon Block (2:00 – 4:30 PM)
- [ ] Open `exercises/advanced/32-responsive-grid.html` — work through in browser
- [ ] Complete the responsive product grid exercise
- [ ] Create `day-39-dsa.js` in `week-06-react-intermediate/day-39/`
- [ ] Open `dsa-bank/02-arrays-medium.md` — pick 3 unsolved problems
- [ ] Solve Problem 1 — pattern + complexity
- [ ] Solve Problem 2 — pattern + complexity
- [ ] Solve Problem 3 — pattern + complexity

## Wrap Up (4:30 – 5:45 PM)
- [ ] Write in `journal.md` — what md:grid-cols-3 means, p-4 vs px-4 py-2, hover: prefix, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 39: Tailwind CSS + responsive redesign + 3 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Install React Query Devtools and add the Tailwind devtools extension for your browser
- [ ] Build a dark mode toggle using Tailwind's `dark:` variant (`dark:bg-gray-900`)
- [ ] Refactor your Button component to use `cva` (class-variance-authority) for variant classes
- [ ] Research: what is `@apply` in Tailwind and when should you use it?
