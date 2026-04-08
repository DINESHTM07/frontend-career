# Day 28 Tasks — useState Deep Dive + Events + Lists

## Morning Block (8:00 – 11:00 AM)
- [ ] Re-read `cheatsheets/react/02-useState.md` fully — note the "state as snapshot" section
- [ ] Create `src/Counter.jsx` in your day-27 React project
- [ ] Implement `increment`, `decrement`, `reset` using `setCount(prev => prev + 1)`
- [ ] Wire buttons with `onClick` — confirm counter updates in browser
- [ ] Verify: clicking + shows new count immediately (React re-renders)
- [ ] Create `src/TodoList.jsx`
- [ ] Add controlled input: `value={inputValue}` + `onChange={e => setInputValue(e.target.value)}`
- [ ] `addItem()`: spread into new array `[...prev, newItem]` — NEVER push directly
- [ ] `deleteItem(id)`: filter out by id — confirm item disappears immediately
- [ ] Add `key={item.id}` to every `.map()` list item
- [ ] Add Enter key support: `onKeyDown` handler calls `addItem()` when `e.key === "Enter"`
- [ ] Clear input after adding (`setInputValue("")`)
- [ ] Create `src/ColorPicker.jsx`
- [ ] Map over COLORS array to render swatch buttons
- [ ] Selected color shows border — compare `selected.value === color.value`
- [ ] Preview box background updates on selection
- [ ] Import all three components in `App.jsx` — confirm all render side by side

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Create `src/ShoppingList.jsx`
- [ ] State: `items`, `nameInput`, `qtyInput`
- [ ] `addItem()`: validate name not empty, push `createItem()` to state, reset inputs
- [ ] Render items with `.map()` — `key={item.id}` required
- [ ] Show `item.name` and `item.quantity` in the list
- [ ] `changeQty(id, delta)`: map over items, update matching id with `Math.max(1, qty + delta)`
- [ ] `+` and `−` buttons call `changeQty(item.id, +1)` and `changeQty(item.id, -1)`
- [ ] `removeItem(id)`: confirm dialog first, then filter
- [ ] `clearAll()`: confirm dialog first, then `setItems([])`
- [ ] Total items display: use `reduce` over items to sum quantities
- [ ] Test: add 3 items, adjust quantities, remove one, clear all — all work correctly

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-28-dsa.js` in `week-05-react-basics/day-28/` (not in React project)
- [ ] Open `dsa-bank/02-arrays-medium.md`
- [ ] Solve Problem 4 — pattern comment + complexity
- [ ] Solve Problem 5 — pattern comment + complexity
- [ ] Solve Problem 6 — pattern comment + complexity
- [ ] Review: open `src/App.jsx`, `src/TodoList.jsx` — can you explain every single line?

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — functional vs direct update, why no push, what key does, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 28: useState mastery - counter, todo, shopping list + 3 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Add "mark complete" checkbox to each TodoList item (strike-through when done)
- [ ] Add a max quantity limit to ShoppingList (e.g., can't go above 99)
- [ ] Research: what happens if you call `setState` inside a `useEffect`? (when is it OK, when is it a bug?)
