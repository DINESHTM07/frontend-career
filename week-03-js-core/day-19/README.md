# Day 19 — ES6+ Features + Patterns + WEEK REVIEW + MINI PROJECT

**Status:** 📋 READY TO START
**Week:** 3 | **Theme:** JavaScript Core

---

## What You'll Learn Today

This is the biggest day of Week 3. You're doing four things:

1. **ES6+ features** — modules, classes, Map, Set, optional chaining, nullish coalescing
2. **JS Patterns** — debounce, throttle, memoize, curry (asked in 60% of frontend interviews)
3. **2 pattern exercises** — build debounce from scratch + see memoization make fibonacci instant
4. **Mini Project** — Weather Dashboard using EVERYTHING from this week

By end of today, you'll have a deployed project. Your first one.

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/js/10-es6-plus.md` — morning
3. `cheatsheets/js/11-common-patterns.md` — morning (after 10)
4. `exercises/js-patterns/18-build-debounce.js` — midday
5. `exercises/js-patterns/19-memoize-curry.js` — midday
6. New folder you'll create: `week-03-js-core/day-19/weather-app/` — afternoon

---

## Morning (8:00 – 11:00 AM) — ES6+ + Patterns Cheatsheets

### Create your practice file

Create `day-19-practice.js` in this folder.

### Read `cheatsheets/js/10-es6-plus.md`

Type every example. Focus on:

**Optional chaining `?.`** — the operator that prevents "Cannot read property of undefined":
```js
const user = { profile: { name: "Dinesh" } };

// Old way (verbose)
const name = user && user.profile && user.profile.name;

// Optional chaining (clean)
const name = user?.profile?.name;        // "Dinesh"
const city = user?.address?.city;        // undefined (no error!)
```

**Nullish coalescing `??`** — "use this if null or undefined":
```js
const input = null;
const value = input ?? "default";        // "default"
const zero = 0 ?? "default";            // 0 (0 is NOT null/undefined!)
const empty = "" ?? "default";          // "" (empty string is NOT null/undefined!)

// Compare: || would give "default" for 0 and ""
// ?? only falls back for null and undefined — usually what you want
```

**Classes:**
```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name} barks`;
  }
}

const dog = new Dog("Rex");
dog.speak(); // "Rex barks"
```

**Map and Set:**
```js
// Map — like an object but any type can be a key
const map = new Map();
map.set("key", "value");
map.set(42, "number key!");
map.get("key");   // "value"
map.has(42);      // true

// Set — array with no duplicates
const set = new Set([1, 2, 2, 3, 3, 3]);
console.log([...set]); // [1, 2, 3]

// Remove duplicates from array
const unique = [...new Set([1, 1, 2, 3, 3])]; // [1, 2, 3]
```

---

### Read `cheatsheets/js/11-common-patterns.md`

Type every pattern. **These 4 patterns come up in 60% of frontend interviews:**

**Debounce** — wait until user stops typing before firing:
```
User types: a... b... c... [pause 500ms] → fires ONCE with "abc"
Without debounce: fires 3 times (once per keystroke)
```

**Throttle** — fire at most once per interval:
```
User scrolls rapidly for 3 seconds + 100ms throttle → fires ~30 times max
Without throttle: fires hundreds of times (every pixel!)
```

**Memoize** — cache the result of expensive functions:
```js
fibonacci(40) without memoize → 2+ seconds, billions of calls
fibonacci(40) with memoize    → instant, ~80 calls
```

**Curry** — transform `fn(a, b, c)` into `fn(a)(b)(c)`:
```js
const add = a => b => a + b;
const add5 = add(5);    // partially applied
add5(3);                // 8
add5(10);               // 15
```

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:00 PM) — Pattern Exercises

### Exercise 1: `exercises/js-patterns/18-build-debounce.js`

**Pattern: Debounce / Throttle**

You'll implement debounce FROM SCRATCH. No library. Just closures and setTimeout.

This is one of the most common interview questions: *"Can you implement debounce?"*

After building it yourself, you'll never forget how it works.

### Exercise 2: `exercises/js-patterns/19-memoize-curry.js`

**Pattern: Memoization**

You'll implement memoize, then apply it to a slow fibonacci function.

When you see fibonacci(40) go from 5+ seconds to instant — you'll feel the power of this pattern in a way no explanation can give you.

---

## Lunch (1:00 – 2:00 PM)

Eat well. You're building something real this afternoon.

---

## Afternoon (2:00 – 5:00 PM) — MINI PROJECT: Weather Dashboard

Build a Weather Dashboard from **scratch** using everything from this week.

### Create your project folder

```
week-03-js-core/day-19/weather-app/
├── index.html
├── style.css
└── app.js
```

### Features to build (in this order):

**1. Basic structure (start here)**
```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Weather Dashboard</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <input id="searchInput" type="text" placeholder="Search city...">
  <button id="searchBtn">Search</button>
  <div id="weatherCard"></div>
  <div id="favorites"></div>
  <script src="app.js"></script>
</body>
</html>
```

**2. Fetch weather data**

Use mock data if you don't want to deal with API keys right now:
```js
// OPTION A: Mock data (no API key needed, works offline)
function getMockWeather(city) {
  const data = {
    "Chennai": { temp: 32, condition: "Sunny", humidity: 78 },
    "Mumbai": { temp: 28, condition: "Cloudy", humidity: 85 },
    "Delhi": { temp: 25, condition: "Hazy", humidity: 60 }
  };
  return Promise.resolve(data[city] || { temp: 20, condition: "Unknown", humidity: 50 });
}
```

**OPTION B: Real OpenWeatherMap API (free)**
1. Go to openweathermap.org → Sign up → Free tier
2. Get your API key from the dashboard
3. It activates within 10 minutes of sign-up
4. Use this URL:
   ```
   https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric
   ```

**3. Display the weather**
```js
// Use DOM manipulation to show results
function displayWeather(city, data) {
  const card = document.querySelector("#weatherCard");
  card.innerHTML = `
    <h2>${city}</h2>
    <p>Temperature: ${data.temp}°C</p>
    <p>Condition: ${data.condition}</p>
    <p>Humidity: ${data.humidity}%</p>
  `;
}
```

**4. Add debounce to the search input**
```js
// Use your debounce from the morning exercise!
const debouncedSearch = debounce(handleSearch, 500);
document.querySelector("#searchInput").addEventListener("input", debouncedSearch);
```

**5. Save favorite cities with localStorage**
```js
// localStorage persists between page refreshes
function saveFavorite(city) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
  displayFavorites();
}

function displayFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const el = document.querySelector("#favorites");
  el.innerHTML = favorites.map(city =>
    `<button onclick="searchCity('${city}')">${city}</button>`
  ).join("");
}
```

**6. Use async/await with error handling**
```js
async function searchCity(city) {
  try {
    const data = await getMockWeather(city);
    displayWeather(city, data);
    saveFavorite(city);
  } catch (error) {
    document.querySelector("#weatherCard").innerHTML = `<p>Error: ${error.message}</p>`;
  }
}
```

### Week 3 concepts used in this project:
- Variables and data types (Day 13)
- Functions and closures (Day 14) — debounce uses closures!
- Arrays and map (Day 15) — rendering favorite cities list
- Objects and destructuring (Day 16) — weather data
- Async/await and fetch (Day 17) — getting weather
- DOM manipulation and events (Day 18) — the whole UI
- Debounce pattern (Day 19) — search input

---

## Deployment — Vercel (Free, Takes 5 Minutes)

After building, deploy so anyone can see it:

1. Push to GitHub first: `git add . && git commit -m "..." && git push origin main`
2. Go to vercel.com → Sign in with GitHub
3. Click **"Add New Project"** → select your `frontend-career` repo
4. Set **Root Directory** to `week-03-js-core/day-19/weather-app`
5. Click **Deploy** → wait 1 minute
6. Copy your live URL!

---

## LinkedIn Post

Share your project this week:

```
Week 3 of my JS learning journey complete.

Built a Weather Dashboard from scratch:
→ fetch API for weather data
→ localStorage for favorite cities
→ debounce on search input
→ pure DOM manipulation (no framework)

Live: [your Vercel URL]
Code: [your GitHub link]

What I learned this week:
→ Closures finally clicked for me
→ Promise.all is mind-blowing
→ Debounce was my favorite pattern to implement

Week 4: React starts Monday.
```

---

## Evening — Blog Post

Write your first Hashnode post using `blog-templates/01-what-i-learned-week-x.md` as a template.

---

## WEEK 3 SELF-CHECK

Go through these honestly. If any answer is NO, spend Day 20 morning reviewing that topic before starting Week 4:

- [ ] Can I explain closures without looking at notes?
- [ ] Can I use `map`, `filter`, `reduce` confidently?
- [ ] Can I write `async/await` with proper error handling?
- [ ] Can I manipulate the DOM and handle events?
- [ ] Can I implement debounce from scratch?
- [ ] Did I solve 25+ DSA problems this week?
- [ ] Is my Weather App deployed and live?

**If any answer is NO** — that's not failure, that's data. Spend Day 20 morning reviewing that topic before moving to Week 4.

---

## Commit

```bash
git add .
git commit -m "Day 19: ES6, patterns, Weather App built and deployed!"
git push origin main
```

---

## End of Day Checklist

- [ ] Read `10-es6-plus.md` cheatsheet
- [ ] Read `11-common-patterns.md` cheatsheet
- [ ] Typed optional chaining and nullish coalescing examples
- [ ] Typed Map and Set examples — saw Set remove duplicates
- [ ] Completed `18-build-debounce.js` — built debounce from scratch
- [ ] Completed `19-memoize-curry.js` — saw fibonacci go instant with memoize
- [ ] Built Weather Dashboard (all 6 features)
- [ ] Deployed on Vercel (have a live URL)
- [ ] Posted on LinkedIn
- [ ] Wrote blog post on Hashnode
- [ ] Committed everything and pushed to GitHub
- [ ] Completed WEEK 3 SELF-CHECK

---

*You just finished Week 3. JavaScript is no longer a mystery. It's a tool you're building fluency in. Week 4 is React — and everything you learned this week is exactly what React is built on.*
