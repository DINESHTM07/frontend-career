# Day 32 — useContext + Theme Switching + Language Toggle

**Status:** 📋 READY TO START
**Week:** 5 | **Theme:** React Basics

---

## What You'll Learn Today

`useContext` solves **prop drilling** — the problem where you pass the same data through 5 component layers just so the bottom component can use it.

Without context:
```
App (has theme) → Header (doesn't need theme) → Nav (doesn't need theme) → Button (needs theme)
```
You'd have to pass `theme` through every layer. That's prop drilling. It's annoying and fragile.

With context:
```
ThemeContext.Provider wraps everything
Button reads theme directly from context — no prop drilling needed
```

Context is essentially a "teleporter" for data — it jumps past all the intermediate components.

By end of day you'll have:
- A `ThemeContext` providing dark/light mode to your whole app
- A `LanguageContext` that switches text between English and Tamil
- Completed the context exercise

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/react/04-useContext.md` — read this morning
3. `exercises/react-basics/24-context-tower.jsx` — midday
4. `week-05-react-basics/day-27/my-react-app/src/` — where you'll code

---

## Morning (8:00 – 11:00 AM) — ThemeContext + LanguageContext

### Step 1 — Read the cheatsheet

Open `cheatsheets/react/04-useContext.md` and read it fully.

Key concepts to focus on:
- How to create a context (`createContext`)
- How to provide values (`Context.Provider`)
- How to consume values (`useContext`)
- When to use context vs props (hint: not for everything)

---

### Step 2 — Create ThemeContext

Create `src/context/ThemeContext.jsx`:

```jsx
import { createContext, useContext, useState } from 'react'

// 1. Create the context with a default value
const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

// 2. Create the Provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  function toggleTheme() {
    setTheme(prev => prev === "light" ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom hook — so any component can use the theme
export function useTheme() {
  return useContext(ThemeContext);
}
```

**Why a custom hook (`useTheme`)?** Instead of importing both `useContext` and `ThemeContext` in every component that needs the theme, you import one function: `useTheme()`. Cleaner, reusable, and it lets you add validation later.

---

### Step 3 — Wrap the app in ThemeProvider

In `src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
```

Now EVERY component in the app can access the theme without prop drilling.

---

### Step 4 — Use the theme in components

Create `src/ThemedApp.jsx`:

```jsx
import { useTheme } from './context/ThemeContext.jsx'
import Button from './components/Button.jsx'

const themes = {
  light: { background: "#ffffff", color: "#111827", border: "1px solid #e5e7eb" },
  dark:  { background: "#1f2937", color: "#f9fafb", border: "1px solid #374151" },
};

export default function ThemedApp() {
  const { theme, toggleTheme } = useTheme();
  const style = themes[theme];

  return (
    <div style={{
      minHeight: "100vh",
      background: style.background,
      color: style.color,
      padding: "40px",
      transition: "background 0.3s, color 0.3s"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h1>Theme Demo</h1>
        <Button onClick={toggleTheme} variant="secondary">
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </Button>
      </div>

      <p>Current theme: <strong>{theme}</strong></p>
      <p>This component reads the theme from context — no props needed.</p>

      <ThemedCard />
    </div>
  );
}

// This nested component reads context directly — no prop drilling
function ThemedCard() {
  const { theme } = useTheme();

  return (
    <div style={{
      border: theme === "light" ? "1px solid #e5e7eb" : "1px solid #374151",
      borderRadius: "8px",
      padding: "20px",
      marginTop: "20px",
      background: theme === "light" ? "#f9fafb" : "#374151"
    }}>
      <h3>Themed Card</h3>
      <p>I read the theme from context, not from props.</p>
    </div>
  );
}
```

Update `App.jsx` to render `<ThemedApp />` so you see the theme switching.

---

### Step 5 — Create LanguageContext

Create `src/context/LanguageContext.jsx`:

```jsx
import { createContext, useContext, useState } from 'react'

const strings = {
  en: {
    welcome:     "Welcome",
    greeting:    "Hello, World!",
    switchLang:  "Switch to Tamil",
    description: "This app supports multiple languages via React Context.",
  },
  ta: {
    welcome:     "வரவேற்பு",
    greeting:    "வணக்கம், உலகம்!",
    switchLang:  "ஆங்கிலத்திற்கு மாறு",
    description: "இந்த பயன்பாடு React Context மூலம் பல மொழிகளை ஆதரிக்கிறது.",
  },
};

const LanguageContext = createContext({
  lang: "en",
  t: key => strings.en[key] ?? key,
  toggleLang: () => {},
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  function toggleLang() {
    setLang(prev => prev === "en" ? "ta" : "en");
  }

  function t(key) {
    return strings[lang][key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
```

---

### Step 6 — Wrap in LanguageProvider too

In `src/main.jsx` — nest both providers:
```jsx
<ThemeProvider>
  <LanguageProvider>
    <App />
  </LanguageProvider>
</ThemeProvider>
```

Use language context in `ThemedApp.jsx`:
```jsx
import { useLang } from './context/LanguageContext.jsx'

function ThemedApp() {
  const { theme, toggleTheme } = useTheme();
  const { t, toggleLang } = useLang();

  return (
    <div ...>
      <h1>{t("greeting")}</h1>
      <p>{t("description")}</p>
      <Button onClick={toggleTheme}>Toggle Theme</Button>
      <Button onClick={toggleLang}>{t("switchLang")}</Button>
    </div>
  );
}
```

Click the language button — everything switches to Tamil. Click again — back to English.

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:00 PM) — Context Tower Exercise

### `exercises/react-basics/24-context-tower.jsx`

**Pattern: Pub-Sub**

This exercise builds a component tree where deeply nested components share state through context. Work through the whole exercise.

Create `src/ContextTower.jsx`, copy/work through it there, import in `App.jsx`.

---

## Afternoon (2:00 – 4:00 PM) — DSA Focus (medium difficulty)

Open `dsa-bank/hashmaps.md` and solve **problems 4 medium-difficulty** problems (your choice). Go harder today — you've been at medium for a while.

Create `day-32-dsa.js` in the `day-32/` folder.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- What problem does `useContext` solve? What is prop drilling?
- When would you NOT use context (i.e., when are regular props the right choice)?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 32: Context API - theme + language + 4 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Read `cheatsheets/react/04-useContext.md` in full
- [ ] Created `src/context/ThemeContext.jsx` with `ThemeProvider` and `useTheme` hook
- [ ] `ThemeProvider` wraps everything in `main.jsx`
- [ ] Theme toggle button switches light/dark — UI updates immediately
- [ ] Deeply nested `ThemedCard` reads theme from context — NO props passed to it
- [ ] Created `src/context/LanguageContext.jsx` with `LanguageProvider` and `useLang` hook
- [ ] Language button switches English/Tamil — text updates across the whole app
- [ ] Both providers nested in `main.jsx`
- [ ] Completed `24-context-tower.jsx` exercise in `src/ContextTower.jsx`
- [ ] Solved 4 DSA problems in `day-32-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference — Context Pattern

```jsx
// 1. Create context
const MyContext = createContext(defaultValue);

// 2. Provider — wraps the part of the tree that needs access
function MyProvider({ children }) {
  const [value, setValue] = useState("hello");
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
}

// 3. Custom hook — cleaner consumption
function useMyContext() {
  return useContext(MyContext);
}

// 4. Consumer — any component in the tree
function DeepChild() {
  const { value } = useMyContext(); // no props needed!
  return <p>{value}</p>;
}

// 5. Wire up in main.jsx or App.jsx
<MyProvider>
  <App />  {/* and all its children can use useMyContext() */}
</MyProvider>
```

---

*Context makes your component tree flat — any component can talk to any other without a long chain of props. This is how React's own state management libraries (and Redux) work under the hood.*
