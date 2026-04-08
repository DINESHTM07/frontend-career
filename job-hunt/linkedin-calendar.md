# LinkedIn Content Calendar — 30 Post Ideas

> **Why post on LinkedIn during a job hunt?**
> Recruiters search LinkedIn. Posts keep you visible even when you're not applying.
> A developer who shares what they're learning signals growth, consistency, and communication skills.
> You don't need to go viral — you need the right 3 people to notice you.
>
> **Posting strategy:** 2–3 posts per week. Quality > quantity. Always add a lesson, not just an update.

---

## Content Formula (Use for Every Post)

```
Hook (1–2 lines):    Something surprising, a mistake you made, or a bold claim
Story (3–5 lines):   What happened — specific, personal, honest
Lesson (2–3 lines):  What you learned — one concrete takeaway
CTA (1 line):        A question to spark comments, or a link to your work
```

---

## Week 1–2 — JavaScript Deep Dives

*Goal: establish credibility as someone who knows JS at depth, not just syntax.*

---

### Post 1 — Closures Explained Simply

**Hook:**
> I was confused by JavaScript closures for weeks. Then I explained it to myself like this — and it finally clicked.

**Story draft:**
> A closure is just a function that remembers the variables from the scope it was created in — even after that scope is gone.
>
> Here's the simplest example:
> ```js
> function makeCounter() {
>   let count = 0;
>   return () => ++count;
> }
> const counter = makeCounter();
> counter(); // 1
> counter(); // 2
> ```
> `count` lives inside `makeCounter`. That scope is "closed over" by the returned function. The function keeps a reference to it.

**Lesson:**
> Every time you use `useState`, you're using closures. Every event handler that references variables from the component is a closure. Understanding this makes React debugging 10x faster.

**CTA:**
> What's the closure concept that confused you longest? Drop it in the comments.

---

### Post 2 — The Event Loop Visualized

**Hook:**
> JavaScript is single-threaded. So how does `setTimeout` work at all?

**Story draft:**
> This code prints B before A. Always:
> ```js
> setTimeout(() => console.log('A'), 0);
> console.log('B');
> ```
> Even with 0ms delay, A prints second. Why?
>
> Because of the event loop:
> 1. Call stack runs `setTimeout` — hands the callback to the Web API
> 2. Call stack runs `console.log('B')` — prints B
> 3. Call stack is now empty
> 4. Event loop checks the callback queue — moves the `setTimeout` callback to the call stack
> 5. Prints A

**Lesson:**
> The event loop is why JavaScript can do async things despite being single-threaded. Understanding it explains `setTimeout`, Promises, `async/await`, and `useEffect` cleanup — all at once.

**CTA:**
> Can you predict what this logs? `Promise.resolve().then(() => console.log('C')); setTimeout(() => console.log('D'), 0); console.log('E');`

---

### Post 3 — `this` in JavaScript Is Context, Not the Function

**Hook:**
> `this` in JavaScript doesn't mean what you think it means. It's not the function. It's the call site.

**Story draft:**
> `this` has 4 rules — in order of precedence:
> 1. `new` binding — `new Foo()` → `this` is the new object
> 2. Explicit — `.call()`, `.apply()`, `.bind()` — `this` is what you pass
> 3. Implicit — `obj.method()` — `this` is `obj`
> 4. Default — `this` is `window` (or `undefined` in strict mode)
>
> Arrow functions have no `this` — they inherit from the enclosing scope. That's why we use them in React event handlers.

**Lesson:**
> Memorize the 4 rules in order. Every `this` confusion resolves to one of them.

**CTA:**
> What's the hardest `this` bug you've ever debugged?

---

### Post 4 — Promises vs Async/Await (Same Thing, Different Syntax)

**Hook:**
> `async/await` didn't replace Promises. It IS Promises — just with different syntax.

**Story draft:** *(write your own here — compare a fetch with `.then()` and with `async/await`)*

**Lesson:** *(explain that `await` pauses execution within the async function but not the whole thread)*

**CTA:** When do you prefer `.then()` over `async/await`?

---

### Post 5 — The `var` vs `let` vs `const` Decision Tree

**Hook:**
> In 2024, there's almost no reason to use `var`. Here's why — and the one exception.

**Story + Lesson draft:** *(explain hoisting to undefined vs TDZ, function scope vs block scope)*

**CTA:** Still using `var` somewhere? Tell me why.

---

## Week 3–4 — React Concepts

*Goal: show React depth — not just "I use hooks" but "I understand why hooks work this way."*

---

### Post 6 — My First React App and What I Got Wrong

**Hook:**
> I built my first React app and immediately made all the classic mistakes. Here's what I'd do differently.

**Story draft:**
> - Put everything in one giant component
> - Used `useState` for data that should have been derived
> - Added `useEffect` for things that didn't need effects at all
> - Fetched data in components that weren't the right level

**Lesson:**
> The biggest React mistake beginners make: treating state like a database instead of a source of truth that drives UI. If you can compute it from existing state — compute it. Don't store it.

**CTA:** What was your first React mistake?

---

### Post 7 — useState vs useReducer — When to Switch

**Hook:**
> I used `useState` for everything for months. Then I hit a form with 8 fields and realized I needed `useReducer`.

**Story draft:**
> `useState` is great for: a toggle, a string input, a number counter.
> `useReducer` becomes better when:
> - Multiple state values that change together
> - Next state depends on the previous state in complex ways
> - State transitions have names (submitted, loading, error, idle)
>
> Quick rule: if your update logic has more than 2 conditions, consider `useReducer`.

**Lesson:**
> `useReducer` isn't just "Redux lite." It's a signal that your state has meaningful transitions — not just raw values.

**CTA:** When did you first reach for `useReducer`?

---

### Post 8 — The useEffect Cleanup Nobody Tells You About

**Hook:**
> I had a memory leak in React for 2 days before I understood why cleanup functions exist.

**Story + Lesson:** *(explain the scenario — subscription or interval not cleared, component unmounts, callback fires on unmounted component, warning appears)*

**CTA:** Have you ever hit the "setState on unmounted component" error?

---

### Post 9 — What Actually Happens When You Call setState

**Hook:**
> `setState` doesn't update state immediately. Here's what actually happens.

**Story + Lesson:** *(explain batching, the re-render cycle, why reading state immediately after setState gives the old value)*

---

### Post 10 — Keys in Lists Are Not Just for Suppressing Warnings

**Hook:**
> You've added `key={index}` to suppress React warnings. I did too. Here's why it's often the wrong choice.

**Story + Lesson:** *(explain reconciliation, why key matters, when index key causes bugs with input fields or animations)*

---

## Week 5–6 — Project Showcases

*Goal: show real work. These posts drive the most direct recruiter interest.*

---

### Post 11 — I Built an E-Commerce Store (With What I Learned)

**Hook:**
> I spent 2 weeks building a React e-commerce store from scratch. Here are the 5 decisions I had to make that no tutorial covered.

**Story draft:**
> 1. Where does cart state live? (Zustand — because it needs to persist across routes)
> 2. Guest cart vs authenticated cart — how to merge them on login
> 3. Product filtering — derived state vs URL state (I chose URL — shareable links)
> 4. When to use `useMemo` (I used it, then profiled, and removed half of them)
> 5. How to handle optimistic UI on "Add to cart" without waiting for server confirmation

**Lesson:**
> The gap between "knowing React" and "building real things" is all the decisions no tutorial makes for you.

**CTA:** Link to live demo or GitHub. "Full code on GitHub — link in comments."

---

### Post 12 — Dashboard with Real-Time Charts (What I Learned About Data Viz)

**Hook:**
> I built an analytics dashboard. Recharts is easy. Making it good is not.

**Story:** *(responsive charts, skeleton loading, the moment a chart renders on a 375px phone wrong, how you fixed it)*

**CTA:** Live demo link + GitHub

---

### Post 13 — I Built My Portfolio. Here's Every Decision I Made.

**Hook:**
> I spent a week building my portfolio. Every decision I made — and why.

**Story:**
> - Why Vite over CRA (build speed, no lock-in)
> - Why Framer Motion (scroll animations in 5 lines vs 50)
> - Why `data/projects.js` as a single source of truth (adding a project = editing one file)
> - Why Formspree over EmailJS (simpler, free tier, no client-side API key)
> - Dark mode via `localStorage` + `prefers-color-scheme` — the 10-line `useDarkMode` hook

**CTA:** Portfolio link. "Tell me what you'd change."

---

### Post 14 — What I Learned from My First Rejected Pull Request

**Hook:**
> My first open-source PR was rejected. Here's what the reviewer said — and why it made me a better developer.

*(Write this when it happens — incredibly relatable content)*

---

### Post 15 — 30 Days of Building. Here's What Actually Improved.

**Hook:**
> 30 days ago I couldn't explain reconciliation. Here's a before/after of what changed.

**Story:** *(concrete before/after — what you couldn't answer vs what you can answer now, show a code snippet)*

---

## Week 7–8 — Depth and Learning Process

*Goal: show how you think and learn, not just what you've built.*

---

### Post 16 — How I Learn New Tech (A System, Not Just Vibes)

**Hook:**
> I learned React, TypeScript, TanStack Query, Framer Motion, and Zustand in 6 months without a bootcamp. Here's the exact system I use.

**Story:** *(Map the terrain → Build something real → Go back to deepen — from your behavioral interview answer)*

---

### Post 17 — The One Book That Taught Me More About Software Than Any Tutorial

**Hook:**
> I wrote a 250,000-word fantasy novel. It taught me more about software than 6 months of tutorials.

**Story:** *(the connection — world bible = spec doc, daily word count = consistent commits, editing = refactoring, finishing it = shipping)*

**This is your most unique post. It will get the most comments.**

---

### Post 18 — ECE to Frontend Developer — The Unexpected Skills That Transferred

**Hook:**
> I studied electronics engineering. Here's what surprised me when I started writing React.

**Story:** *(state machines, signal flow, feedback loops, systems thinking — how ECE made React click faster)*

---

### Post 19 — The Difference Between Knowing React and Understanding React

**Hook:**
> Most React tutorials teach you how to use hooks. Almost none teach you why they work the way they do.

*(Closures, the rules of hooks, what the reconciler actually does)*

---

### Post 20 — CSS Grid vs Flexbox — The Decision I Make Before Every Layout

**Hook:**
> Every time I start a new layout, I ask myself one question. Here's how it always ends up being Grid or Flex.

*(Simple decision tree: one-dimensional? Flex. Two-dimensional? Grid. Content-driven size? Flex. Explicit tracks? Grid.)*

---

## Week 9+ — Job Hunt Posts

*Goal: make your search visible. Recruiters and founders do read these.*

---

### Post 21 — I'm Open to Frontend Developer Opportunities

**Hook:**
> After 8 months of deliberate self-study and building real projects, I'm looking for my first professional frontend role.

**Story:**
> What I've built: [3 projects in one line each]
> What I know: React, TypeScript, Tailwind CSS, Next.js, Framer Motion
> What makes me different: ECE background (systems thinking), published author (I finish things), AI-native (I learn fast)

**CTA:**
> If you're hiring or know someone who is — my portfolio is [link]. Reach out here or at duke02101@gmail.com.

**This post should be professional and specific — not desperate. You're making an offer, not a plea.**

---

### Post 22 — What I Learned in 90 Days of Self-Teaching Frontend

**Hook:**
> 90 days ago I had zero professional frontend experience. Here's what I know now that I didn't then.

**Story:** *(10 specific things — not generic, but specific lessons from your actual journey)*

---

### Post 23 — The Interview Question That Taught Me Something

**Hook:**
> I bombed a question in a technical interview last week. Here's what I learned from it.

*(Vulnerability + learning = high engagement. Recruiters respect this.)*

---

### Post 24 — I Got My First Freelance Client. Here's How.

**Hook:**
> I walked into a local restaurant with a pitch. They said yes. Here's what happened.

*(Tell the full story — the pitch, the build, the reaction, the testimonial)*

---

### Post 25 — React Is Not the Framework. It's the Thinking.

**Hook:**
> After 8 months of React, I realized I wasn't just learning a framework. I was learning a way to think about UI.

*(State drives UI, composition over inheritance, one-way data flow — explain what these feel like after internalizing them)*

---

## Posts 26–30 — Advanced / Evergreen

| # | Title Hook | Core idea |
|---|---|---|
| 26 | "TypeScript saved me 2 hours of debugging last week" | A specific bug TS caught — show the type error |
| 27 | "I added dark mode in 20 lines. Here's the hook." | Share the `useDarkMode` code |
| 28 | "Accessibility is not an afterthought. Here's what I added to every project." | aria attributes, keyboard nav, focus management |
| 29 | "What I wish someone had told me before I started learning to code" | 5 specific things — honest, personal |
| 30 | "I got an offer. Here's what the journey looked like." | The full arc — share when it happens |

---

## Posting Checklist (Before Every Post)

- [ ] Does the first line make someone stop scrolling?
- [ ] Is there a specific story, not just a concept?
- [ ] Is there one clear lesson — not five?
- [ ] Is there a question at the end to invite comments?
- [ ] Did I add a relevant link (portfolio, GitHub, demo) where appropriate?
- [ ] Is it under 300 words? (LinkedIn's sweet spot)
- [ ] Did I break it into short paragraphs? (No walls of text)

---

*LinkedIn content calendar for Dinesh S — 30 posts mapped to the learning journey*
