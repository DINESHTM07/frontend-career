# Day 36 Tasks — useReducer + Complex State

## Morning Block (8:00 – 11:00 AM)
- [ ] Read `cheatsheets/react/05-useReducer.md` fully
- [ ] Understand the flow: `dispatch(action)` → `reducer(state, action)` → `newState` → re-render
- [ ] Create `src/pages/CartPage.jsx`
- [ ] Define `initialState = { items: [], total: 0 }`
- [ ] Write `cartReducer(state, action)` with switch statement
- [ ] Case `ADD_TO_CART`: if item exists → increment quantity; else → push new item with quantity 1
- [ ] Case `REMOVE_FROM_CART`: filter out item, subtract `price × quantity` from total
- [ ] Case `INCREMENT`: map to increment quantity, add price to total
- [ ] Case `DECREMENT`: if quantity is 1 → remove; else decrement, subtract price
- [ ] Case `CLEAR_CART`: return `initialState`
- [ ] `const [state, dispatch] = useReducer(cartReducer, initialState)`
- [ ] Render 4 products — each has "Add to Cart" button that dispatches ADD_TO_CART
- [ ] Render cart items with +/− buttons and ✕ remove button
- [ ] Render total at bottom of cart
- [ ] "Clear Cart" button dispatches CLEAR_CART
- [ ] Add route `/cart` in App.jsx, link in Navbar
- [ ] Test: add same product twice — quantity becomes 2, not two separate entries
- [ ] Test: decrement to 0 — item disappears from cart
- [ ] Test: total is always correct — matches sum of (price × quantity) across all items

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Open `exercises/react-basics/23-budget-tracker.jsx`
- [ ] Create `src/pages/BudgetTracker.jsx`
- [ ] Define state shape: `{ entries: [], balance: 0, filter: "all" }`
- [ ] Implement `ADD_INCOME`: push entry, add to balance
- [ ] Implement `ADD_EXPENSE`: push entry, subtract from balance
- [ ] Implement `DELETE_ENTRY`: filter out by id, recalculate balance
- [ ] Implement `SET_FILTER`: update filter without touching entries
- [ ] Render filtered entries (filtered in derived variable, not in state)
- [ ] Show balance prominently — green if positive, red if negative
- [ ] Complete YOUR TURN section of the exercise
- [ ] Add route `/budget` in App.jsx

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Open `src/TodoList.jsx` — understand the current useState version fully
- [ ] Rewrite using `useReducer` with a `todoReducer` function
- [ ] Cases: ADD, TOGGLE, DELETE, SET_FILTER
- [ ] Confirm all features still work after the refactor
- [ ] Create `day-36-dsa.js` in `week-06-react-intermediate/day-36/`
- [ ] Open `dsa-bank/recursion.md`
- [ ] Solve Problem 9 — pattern + complexity
- [ ] Solve Problem 10 — pattern + complexity
- [ ] Solve Problem 11 — pattern + complexity

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — action shape, why pure functions, concrete useState vs useReducer example, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 36: useReducer + budget tracker + 3 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Extract `cartReducer` to its own file `src/reducers/cartReducer.js` — import it in CartPage
- [ ] Write 3 unit tests for cartReducer (plain JS, no React needed): add, remove, clear
- [ ] Add a "saved for later" list using a second `SAVE_FOR_LATER` action
- [ ] Research: how does Redux Toolkit's `createSlice` relate to what you built today?
