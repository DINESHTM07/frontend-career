# Day 32 Tasks — useContext + Theme Switching + Language Toggle

## Morning Block (8:00 – 11:00 AM)
- [ ] Read `cheatsheets/react/04-useContext.md` fully — focus on when to use vs not use context
- [ ] Create `src/context/` folder inside your React project
- [ ] Create `src/context/ThemeContext.jsx`
- [ ] `createContext({ theme: "light", toggleTheme: () => {} })` — default value
- [ ] Build `ThemeProvider` component: `useState("light")`, `toggleTheme` function, `Provider` wrap
- [ ] Export custom hook `useTheme()` — returns `useContext(ThemeContext)`
- [ ] Open `src/main.jsx` — wrap `<App />` with `<ThemeProvider>`
- [ ] Create `src/ThemedApp.jsx` — use `useTheme()` hook, no theme prop needed
- [ ] Apply theme styles conditionally: light = white bg, dark = dark bg
- [ ] Add toggle button calling `toggleTheme` — confirm UI switches immediately
- [ ] Create a nested `ThemedCard` component inside `ThemedApp.jsx`
- [ ] `ThemedCard` uses `useTheme()` directly — confirm no theme prop is passed to it
- [ ] Confirm: toggling theme changes both the outer container AND the nested card
- [ ] Create `src/context/LanguageContext.jsx`
- [ ] Define `strings` object with `en` and `ta` translations for 4+ keys
- [ ] Build `LanguageProvider` with `useState("en")`, `toggleLang`, and `t(key)` function
- [ ] Export `useLang()` custom hook
- [ ] Open `src/main.jsx` — nest `<LanguageProvider>` inside `<ThemeProvider>`
- [ ] Update `ThemedApp.jsx` to use `t("greeting")` and `t("description")` from `useLang()`
- [ ] Add language toggle button calling `toggleLang`
- [ ] Confirm: clicking language button switches all text between English and Tamil

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Open `exercises/react-basics/24-context-tower.jsx`
- [ ] Create `src/ContextTower.jsx` — work through the exercise here
- [ ] Complete GUIDED section
- [ ] Complete YOUR TURN section
- [ ] Import `ContextTower` in `App.jsx` — confirm it renders alongside ThemedApp

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-32-dsa.js` in `week-05-react-basics/day-32/`
- [ ] Open `dsa-bank/hashmaps.md` — find 4 problems (aim for medium difficulty)
- [ ] Solve Problem 1 — pattern + complexity
- [ ] Solve Problem 2 — pattern + complexity
- [ ] Solve Problem 3 — pattern + complexity
- [ ] Solve Problem 4 — pattern + complexity

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — what prop drilling is, when NOT to use context, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 32: Context API - theme + language + 4 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Persist theme preference in localStorage — so dark mode survives a page refresh
- [ ] Persist language preference in localStorage
- [ ] Add a third language (your choice)
- [ ] Research: what is `useReducer` and when would you use it instead of `useState` with context?
