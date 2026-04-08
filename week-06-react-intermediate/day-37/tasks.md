# Day 37 Tasks — Custom Hooks: Your Superpower

## Morning Block (8:00 – 11:00 AM)
- [ ] Read `cheatsheets/react/08-custom-hooks.md` fully
- [ ] Create `src/hooks/` folder in your React project
- [ ] Create `src/hooks/useToggle.js`
- [ ] Returns `[value, toggle, setOn, setOff]`
- [ ] Test: use in a component with a button that toggles a visible div
- [ ] Create `src/hooks/useLocalStorage.js`
- [ ] Lazy initializer: reads from localStorage on first render only
- [ ] `setValue` handles both direct values and updater functions `(prev => newValue)`
- [ ] Test: set a value, refresh the page — confirm value persists
- [ ] Create `src/hooks/useFetch.js`
- [ ] State: `data` (null), `loading` (true), `error` (null)
- [ ] Use `cancelled` flag in useEffect cleanup to prevent state update after unmount
- [ ] Returns `{ data, loading, error }`
- [ ] Test: `const { data, loading, error } = useFetch("https://official-joke-api.appspot.com/random_joke")` — confirm joke loads
- [ ] Create `src/hooks/useDebounce.js`
- [ ] Stores delayed copy of a value — updates after `delay` ms of no changes
- [ ] Cleanup `clearTimeout` prevents premature update on rapid changes
- [ ] Test: type into an input, log the debounced value — confirm it lags by 500ms
- [ ] Create `src/hooks/useMediaQuery.js`
- [ ] Reads `window.matchMedia(query).matches` as initial value
- [ ] Adds + cleans up `change` event listener
- [ ] Test: resize browser window — `isMobile` value should change at 768px breakpoint
- [ ] Create `src/hooks/useClickOutside.js`
- [ ] Returns a `ref` to attach to an element
- [ ] `mousedown` listener on `document` — fires callback if click is outside `ref.current`
- [ ] Test: open a dropdown with a button, click outside — confirm it closes automatically

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Open `exercises/react-basics/26-hook-factory.jsx`
- [ ] Work through GUIDED section — extend or compose the hooks
- [ ] Complete YOUR TURN section
- [ ] Export all 6 hooks from `src/hooks/index.js` for cleaner imports

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Open `src/pages/MoviesPage.jsx`
- [ ] Replace manual debounce logic with `useDebounce(query, 500)`
- [ ] Replace manual `useEffect` + fetch with `useFetch(url)` where possible
- [ ] Confirm movie search still works after refactor
- [ ] Confirm the component is shorter and easier to read
- [ ] Create `day-37-dsa.js` in `week-06-react-intermediate/day-37/`
- [ ] Open `dsa-bank/strings.md`
- [ ] Solve Problem 7 — pattern + complexity
- [ ] Solve Problem 8 — pattern + complexity
- [ ] Solve Problem 9 — pattern + complexity

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — what makes a custom hook, why the cancelled flag, how useClickOutside works, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 37: 5 custom hooks from scratch + refactored app + 3 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Build `useWindowSize` — returns `{ width, height }`, updates on resize
- [ ] Build `usePrevious(value)` — returns the previous render's value using `useRef`
- [ ] Build `useAsync(asyncFn, deps)` — generalizes useFetch for any async function
- [ ] Publish your hooks as a `src/hooks/index.js` barrel export file
