# Day 29 Tasks — useEffect + API Calls + Loading States

## Morning Block (8:00 – 11:00 AM)
- [ ] Read `cheatsheets/react/03-useEffect.md` fully — focus on dependency array section
- [ ] Create `src/JokeFetcher.jsx` in your React project
- [ ] State: `joke` (null), `isLoading` (true), `error` (null)
- [ ] Write `fetchJoke()` async function: set loading → fetch → set joke → set loading false
- [ ] Wrap fetch in `try/catch/finally` — catch sets error, finally clears loading
- [ ] Add `useEffect(() => { fetchJoke() }, [])` — empty array = run once on mount
- [ ] Render: loading state as text, error state with red color, joke setup + punchline
- [ ] Add "New Joke" button that calls `fetchJoke()` directly (not via useEffect)
- [ ] Disable button while loading (`disabled={isLoading}`)
- [ ] Confirm: joke loads automatically on page load, button fetches a new one
- [ ] Experiment: add a count state and `useEffect(() => { console.log(count) }, [count])`
- [ ] Click the counter button — confirm console logs the new value each time
- [ ] Confirm: you understand why `[]` vs `[count]` behaves differently
- [ ] Experiment: add and then remove a setInterval + cleanup to understand the return function

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Open `exercises/react-basics/21-pokemon-cards.jsx`
- [ ] Create `src/PokemonCards.jsx` — work through the exercise here
- [ ] `useEffect` with `[]` — fetch `https://pokeapi.co/api/v2/pokemon?limit=20` on mount
- [ ] Show loading spinner/text while fetching
- [ ] Show error message if fetch fails
- [ ] Render Pokémon cards with name + sprite image
- [ ] Add search input with `useState` — filter the list as user types
- [ ] Import `PokemonCards` in `App.jsx` — confirm it renders
- [ ] Play with it: search for "char" — should show Charmander, Charmeleon, Charizard
- [ ] BOSS CHALLENGE: add "Load more" button to paginate 20 at a time

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Open `exercises/react-basics/22-effect-escape.jsx`
- [ ] Read Bug 1 — identify what's wrong before fixing
- [ ] Fix Bug 1 — add comment `// BUG: ... | FIX: ...`
- [ ] Read Bug 2 — identify what's wrong before fixing
- [ ] Fix Bug 2 — add comment
- [ ] Create `day-29-dsa.js` in `week-05-react-basics/day-29/`
- [ ] Open `dsa-bank/02-arrays-medium.md`
- [ ] Solve Problem 7 — pattern + complexity
- [ ] Solve Problem 8 — pattern + complexity
- [ ] Solve Problem 9 — pattern + complexity

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — what `useEffect(fn, [])` does, what the return/cleanup does, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 29: useEffect + API calls + Pokemon cards + 3 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Add a loading skeleton (grey placeholder boxes) instead of plain "Loading..." text
- [ ] Add error retry button that calls `fetchJoke()` again
- [ ] Fix the remaining bugs in `22-effect-escape.jsx` (all of them)
- [ ] Research: why can't you make the `useEffect` callback itself `async`?
