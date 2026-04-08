# Day 29 — useEffect + API Calls + Loading States

**Status:** 📋 READY TO START
**Week:** 5 | **Theme:** React Basics

---

## What You'll Learn Today

`useEffect` is where React components talk to the outside world — APIs, timers, browser events, localStorage. It is also the hook that confuses beginners most.

The confusion comes from the dependency array. Once you understand what it actually means, `useEffect` becomes obvious.

**The three forms and what they mean:**

```jsx
useEffect(() => { ... });           // runs after EVERY render (almost always a bug)
useEffect(() => { ... }, []);       // runs ONCE after first render (mount)
useEffect(() => { ... }, [value]); // runs after first render AND whenever value changes
```

**The key mental model:** `useEffect` doesn't run during render — it runs **after** the render is painted to the screen. That's why you can safely fetch data inside it without blocking the UI.

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/react/03-useEffect.md` — read this morning before coding
3. `exercises/react-basics/21-pokemon-cards.jsx` — midday
4. `exercises/react-basics/22-effect-escape.jsx` — afternoon
5. `week-05-react-basics/day-27/my-react-app/src/` — where you'll code

---

## Morning (8:00 – 11:00 AM) — useEffect with API Calls

### Step 1 — Read the useEffect cheatsheet

Open `cheatsheets/react/03-useEffect.md` and read it fully. Focus on:
- When effects run relative to renders
- What the dependency array means
- Cleanup functions (the return inside useEffect)
- Common mistakes (missing deps, infinite loops)

---

### Step 2 — Joke Fetcher (fetch on mount)

Create `src/JokeFetcher.jsx`:

```jsx
import { useState, useEffect } from 'react'

export default function JokeFetcher() {
  const [joke, setJoke] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchJoke() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("https://official-joke-api.appspot.com/random_joke");
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      setJoke(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Empty array [] = run once when component mounts
  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "500px" }}>
      <h2 style={{ margin: "0 0 16px" }}>Random Joke</h2>

      {isLoading && <p style={{ color: "#888" }}>Loading joke...</p>}

      {error && (
        <p style={{ color: "#ef4444" }}>Error: {error}</p>
      )}

      {joke && !isLoading && (
        <div>
          <p style={{ fontWeight: "bold" }}>{joke.setup}</p>
          <p style={{ color: "#10b981", marginTop: "8px" }}>{joke.punchline}</p>
        </div>
      )}

      <button
        onClick={fetchJoke}
        disabled={isLoading}
        style={{ marginTop: "16px", padding: "8px 16px", cursor: isLoading ? "default" : "pointer" }}
      >
        {isLoading ? "Loading..." : "New Joke"}
      </button>
    </div>
  );
}
```

**What's happening here:**
1. Component renders with `isLoading: true` and `joke: null`
2. After first render, `useEffect` fires and calls `fetchJoke()`
3. `fetchJoke` sets loading, fetches, sets the joke, sets loading to false
4. React re-renders with the joke data → displays it
5. Clicking "New Joke" calls `fetchJoke()` again directly (bypasses useEffect)

---

### Step 3 — Experiment with the dependency array

Add this to `JokeFetcher.jsx` to see what happens with different deps:

```jsx
const [count, setCount] = useState(0);

// This effect logs every time count changes:
useEffect(() => {
  console.log("Count changed to:", count);
}, [count]);  // dependency: count

// This would fetch a new joke on EVERY count change:
// useEffect(() => { fetchJoke(); }, [count]);  ← try it, then revert
```

Add a temporary button: `<button onClick={() => setCount(c => c + 1)}>Increment</button>`

Watch the console as you click. This is how `useEffect` with dependencies works.

---

### Step 4 — Cleanup function (important)

The cleanup function runs before the next effect fires, or when the component unmounts:

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log("tick");
  }, 1000);

  // Return cleanup — runs when component unmounts or before next effect
  return () => {
    clearInterval(timer);
    console.log("Timer cleaned up");
  };
}, []); // only once on mount, cleaned up on unmount
```

This prevents memory leaks. If you set up a subscription or timer in `useEffect`, always clean it up in the return function.

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:00 PM) — Pokemon Cards Exercise

### `exercises/react-basics/21-pokemon-cards.jsx`

**Pattern: Observer + Filtering + Transformation**

This is the exercise where React "clicks" for most people. You'll fetch a list of Pokémon from the PokeAPI, display them as cards, and add a search filter.

Open the exercise file. Work through INTRO → GUIDED → YOUR TURN.

**How to add to your React project:**

Create `src/PokemonCards.jsx`, work through the exercise there, then import it in `App.jsx`.

**Key patterns in this exercise:**
- `useEffect` with `[]` to fetch the initial list on mount
- Loading state while fetch is in progress
- Error state if fetch fails
- Filtering the results with `useState` for the search query
- Transforming the data shape before storing it

The PokeAPI endpoint: `https://pokeapi.co/api/v2/pokemon?limit=20`

This returns a list with names and URLs. You then fetch each Pokémon individually for their sprite. The exercise guides you through this.

**BOSS CHALLENGE:** Add pagination. Load 20 at a time, with "Load more" button.

---

## Lunch (1:00 – 2:00 PM)

---

## Afternoon (2:00 – 4:00 PM) — Effect Escape Room + DSA

### Fix broken useEffects

Open `exercises/react-basics/22-effect-escape.jsx`.

This is a set of broken `useEffect` scenarios. Fix the **first 2 bugs**:

Common bugs you'll encounter:
- Missing dependency that causes stale state
- Missing cleanup causing a memory leak
- Wrong dependency causing an infinite loop
- Fetching inside useEffect without handling the component unmount case

For each bug:
1. Read the broken code
2. Look at the comments — they hint at what's wrong
3. Run it and see the symptom
4. Fix it
5. Add a comment: `// BUG: [what was wrong] | FIX: [what you changed]`

### DSA

Open `dsa-bank/02-arrays-medium.md`. Solve **problems 7, 8, and 9**.

Create `day-29-dsa.js` in the `day-29/` folder.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- Explain what `useEffect(() => {}, [])` does in one sentence
- What does the return function inside `useEffect` do and why do you need it?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 29: useEffect + API calls + Pokemon cards + 3 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Read `cheatsheets/react/03-useEffect.md` in full
- [ ] Built `JokeFetcher.jsx` — loads a joke on mount, button fetches new one
- [ ] Shows loading state while fetching, error state if fetch fails
- [ ] Experimented with dependency array — saw console log fire on count change
- [ ] Understands cleanup function — can explain why it prevents memory leaks
- [ ] Completed `21-pokemon-cards.jsx` exercise — working cards with search
- [ ] Fixed 2 bugs in `22-effect-escape.jsx` with comments
- [ ] Solved 3 DSA problems in `day-29-dsa.js`
- [ ] Committed and pushed to GitHub
- [ ] Wrote in journal.md

---

## Quick Reference — useEffect

```jsx
// On mount only (most common for API calls)
useEffect(() => {
  fetchData();
}, []);

// On mount + when url changes
useEffect(() => {
  fetchData(url);
}, [url]);

// With cleanup (timers, subscriptions, event listeners)
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);     // cleanup
}, []);

// NEVER do this (runs every render = infinite loop if you setState inside)
useEffect(() => { ... }); // no array

// Async in useEffect — define the function inside, then call it
useEffect(() => {
  async function load() {
    const data = await fetchSomething();
    setData(data);
  }
  load();
}, []);
// Note: you cannot make the useEffect callback async directly
```

---

*Once you understand that useEffect = "do this after the render, and clean up before the next one" — everything else follows.*
