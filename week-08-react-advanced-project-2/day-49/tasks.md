# Day 49 Tasks — TypeScript Basics for React

## Morning Block (8:00 – 11:00 AM) — Read + Setup
- [ ] Open `cheatsheets/advanced/02-typescript-react.md` — read fully
- [ ] Write down (in your own words): what is an `interface` in TypeScript?
- [ ] Write down: what does `name?: string` mean vs `name: string`?
- [ ] Run: `npm create vite@latest ts-react -- --template react-ts`
- [ ] Run: `cd ts-react && npm install && npm run dev`
- [ ] Open `src/App.tsx` — confirm it runs without errors
- [ ] Intentionally add a wrong type to a prop — confirm red underline appears
- [ ] Fix the error — confirm red underline disappears
- [ ] Write a `Greeting` component with typed props: `name: string`, `age?: number`

## Midday Block (11:20 AM – 1:30 PM) — Exercise 30
- [ ] Open `exercises/30-ts-translator.tsx`
- [ ] Component 1: Add interface for props, type any events
- [ ] Component 2: Add interface for props, type any useState with ambiguous initial value
- [ ] Component 3: Add interface for props, type event handlers
- [ ] Component 4: Add interface for props, use union type for status-style prop
- [ ] Component 5: Add interface for props, type children as `React.ReactNode`
- [ ] All 5 components compile with zero TypeScript errors
- [ ] Can explain: why does `useState([])` need `useState<string[]>([])`?

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-49-dsa.js` in `week-08-react-advanced-project-2/day-49/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Run: `git add . && git commit -m "Day 49: TypeScript basics + 5 components converted + DSA"`
