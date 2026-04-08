# Day 31 Tasks — Component Composition + Props Patterns + Children

## Morning Block (8:00 – 11:00 AM)
- [ ] Create `src/components/` folder inside your React project
- [ ] Create `src/components/Button.jsx`
- [ ] Implement 4 variants: `primary`, `secondary`, `danger`, `ghost`
- [ ] Implement 3 sizes: `sm`, `md`, `lg`
- [ ] Handle `disabled` prop — changes cursor, reduces opacity
- [ ] Test in `App.jsx`: render all 4 variants + a disabled one side by side
- [ ] Confirm all variants look distinct and disabled state is obvious
- [ ] Create `src/components/Card.jsx` with 4 named exports
- [ ] `Card` — outer container with border + border-radius, renders `{children}`
- [ ] `CardHeader` — top section with padding + bottom border
- [ ] `CardBody` — main content area with padding
- [ ] `CardFooter` — bottom section with top border + light background
- [ ] Import with named imports: `import { Card, CardHeader, CardBody, CardFooter } from ...`
- [ ] Test: render a Card with all 4 sub-components, put a Button in the CardFooter
- [ ] Create `src/components/Modal.jsx`
- [ ] Accepts: `isOpen`, `onClose`, `title`, `children`
- [ ] `if (!isOpen) return null` — truly removes from DOM when closed
- [ ] Overlay click closes modal (outer div `onClick={onClose}`)
- [ ] Inner content click does NOT close modal (`e.stopPropagation()`)
- [ ] ✕ button in header calls `onClose`
- [ ] `useEffect` with Escape key listener — cleaned up in return function
- [ ] Test with `useState(false)`: open button → modal shows, ✕ closes it, Escape closes it, overlay click closes it
- [ ] Create `src/components/Badge.jsx` — 6 color variants, pill shape
- [ ] Test: render a badge for each color

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Open `src/MovieSearch.jsx`
- [ ] Replace all raw `<button>` elements with `<Button>` from your library
- [ ] Replace the `MovieDetail` inline overlay code with your `<Modal>` component
- [ ] Modal: `isOpen={!!selected}` `onClose={() => setSelected(null)}` `title={selected?.Title}`
- [ ] Movie type indicator (movie / series) → replace with `<Badge color="blue">`
- [ ] Confirm: Movie Search still works exactly as before
- [ ] Confirm: Escape key closes the movie detail modal
- [ ] Confirm: clicking movie card overlay background closes it

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-31-dsa.js` in `week-05-react-basics/day-31/`
- [ ] Open `dsa-bank/strings.md` (or continue arrays-medium)
- [ ] Solve Problem 1 — pattern + complexity
- [ ] Solve Problem 2 — pattern + complexity
- [ ] Solve Problem 3 — pattern + complexity
- [ ] Review: open each React file you've built this week — can you explain every line?

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — what `children` is, why reusable Button > raw button, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 31: Component library + refactored Movie App + 3 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Add `className` prop support to Button for extra styling from outside
- [ ] Add an `icon` prop to Button that renders before the children
- [ ] Build a `Spinner` component for loading states — use CSS animation
- [ ] Research: what is `forwardRef` and when do you need it for a component library?
