# Day 19 Tasks — ES6+, Patterns, Week Review & Weather App

## Morning Block (8:00 – 11:00 AM)
- [ ] Create `day-19-practice.js` in this folder
- [ ] Read `cheatsheets/js/10-es6-plus.md` — type every example
- [ ] Type optional chaining `?.` — see it return undefined instead of throwing
- [ ] Type nullish coalescing `??` — compare with `||`, note the difference with `0` and `""`
- [ ] Type class + extends example — call the overridden method
- [ ] Type Map example — use a non-string key (number, object)
- [ ] Type Set example — see duplicates removed automatically
- [ ] Read `cheatsheets/js/11-common-patterns.md` — type every pattern
- [ ] Type debounce pseudocode in a comment before looking at implementation
- [ ] Understand throttle: how is it different from debounce?

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Open `exercises/js-patterns/18-build-debounce.js`, read the INTRO
- [ ] Complete GUIDED section — debounce skeleton with hints
- [ ] Complete YOUR TURN — write debounce from scratch
- [ ] Attempt BOSS CHALLENGE — add leading edge debounce option
- [ ] Open `exercises/js-patterns/19-memoize-curry.js`
- [ ] Time fibonacci(35) without memoize — note how long it takes
- [ ] Implement memoize and apply it
- [ ] Time fibonacci(35) again with memoize — see the difference
- [ ] Complete curry exercises

## Afternoon Block (2:00 – 5:00 PM) — Weather App
- [ ] Create folder: `week-03-js-core/day-19/weather-app/`
- [ ] Create `index.html` with search input, button, weather card, favorites section
- [ ] Create `style.css` with basic styling (doesn't need to be fancy)
- [ ] Create `app.js`
- [ ] Implement mock weather data function (or connect real OpenWeatherMap API)
- [ ] Implement `displayWeather(city, data)` using DOM manipulation
- [ ] Implement `searchCity(city)` with async/await + try/catch
- [ ] Hook up the search button with event listener
- [ ] Add debounce to the text input (use your debounce from morning)
- [ ] Implement `saveFavorite(city)` with localStorage
- [ ] Implement `displayFavorites()` using array.map
- [ ] Test: search a city → weather shows → city saves to favorites
- [ ] Test: refresh the page → favorites are still there (localStorage works!)
- [ ] Push to GitHub: `git add . && git commit -m "Day 19: Weather App" && git push origin main`
- [ ] Deploy on Vercel — get a live URL

## Week 3 Self-Check
- [ ] Can I explain closures without notes?
- [ ] Can I use map/filter/reduce confidently?
- [ ] Can I write async/await with error handling?
- [ ] Can I manipulate the DOM and handle events?
- [ ] Can I implement debounce from scratch?
- [ ] Did I solve 25+ DSA problems this week?
- [ ] Is my Weather App deployed and live?

## Sharing
- [ ] Post on LinkedIn with Vercel URL and GitHub link
- [ ] Write blog post using `blog-templates/01-what-i-learned-week-x.md`

## Final Commit
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 19: ES6, patterns, Weather App built and deployed!"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Add a 5-day forecast display to the Weather App
- [ ] Add a "clear favorites" button
- [ ] Add dark/light mode toggle using classList and localStorage
- [ ] Implement throttle from scratch (similar to debounce but different behavior)
