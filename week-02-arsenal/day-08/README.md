# Day 8 — Interview Vault: Complete Question Bank

> **Goal:** Build a permanent, deeply detailed reference for every category of frontend interview — technical, behavioral, and system design.

---

## What Was Built Today

Five comprehensive interview-prep files added to `interview-vault/`:

| File | Content | Questions |
|---|---|---|
| `01-js-interview.md` | JavaScript deep-dive | 60 questions |
| `02-react-interview.md` | React hooks to SSR | 50 questions |
| `03-css-html-interview.md` | CSS/HTML fundamentals | 30 questions |
| `04-behavioral-interview.md` | STAR-method behavioral | 20 questions |
| `05-system-design-frontend.md` | Frontend system design | 10 designs |

**Total: 170 questions + 10 system designs across the full interview spectrum.**

---

## File Summaries

### `01-js-interview.md` — 60 Questions

Every answer has: Concept → Code example → Common Follow-up Questions → Interview Tip.

| Category | Questions |
|---|---|
| Event Loop & Async | Q1–Q10 |
| Closures & Scope | Q11–Q18 |
| this & Prototypes | Q19–Q26 |
| Hoisting & TDZ | Q27–Q31 |
| Promises & Async/Await | Q32–Q39 |
| ES6+ Features | Q40–Q45 |
| DOM & Events | Q46–Q50 |
| Error Handling | Q51–Q53 |
| Type Coercion & Equality | Q54–Q57 |
| Miscellaneous | Q58–Q60 |

Ends with a quick-reference difficulty + frequency table for all 60.

---

### `02-react-interview.md` — 50 Questions

| Category | Questions |
|---|---|
| Hooks (useState, useEffect, useRef, useMemo, useCallback, useReducer, useContext, useLayoutEffect, useId, custom hooks) | Q1–Q12 |
| State Management (prop drilling, Redux Toolkit, Zustand, Context+useReducer, Jotai, TanStack Query, colocation, controlled vs uncontrolled) | Q13–Q20 |
| Component Patterns (compound, render props, HOC, Provider, React.memo, container/presentational) | Q21–Q26 |
| Performance (reconciliation, lazy+Suspense, Profiler, virtualization, concurrent rendering, keys) | Q27–Q32 |
| Router (React Router v6, protected routes, BrowserRouter vs HashRouter, code-split routing) | Q33–Q36 |
| Forms (React Hook Form, Zod validation, dynamic fields, Controller) | Q37–Q40 |
| Testing (RTL, MSW, renderHook) | Q41–Q43 |
| Error Handling (Error Boundaries, async errors, global strategy) | Q44–Q46 |
| Server-Side Rendering (CSR/SSR/SSG, hydration, Next.js App Router, RSC) | Q47–Q50 |

---

### `03-css-html-interview.md` — 30 Questions

| Category | Questions |
|---|---|
| Box Model & Layout (box-sizing, display, margin collapse, BFC, positioning, z-index/stacking) | Q1–Q6 |
| Flexbox & Grid (flex model, grid vs flex, align-items vs align-content, fr+minmax, sticky footer, subgrid) | Q7–Q12 |
| Responsive Design (mobile-first, CSS variables+theming, responsive images, container queries) | Q13–Q16 |
| Specificity & Cascade (specificity scoring, cascade layers, inheritance, pseudo-classes/elements) | Q17–Q20 |
| Semantic HTML (why semantics, section vs article vs div, navigation) | Q21–Q23 |
| Accessibility (ARIA, accessible modal, keyboard nav, alt vs aria-label) | Q24–Q27 |
| Animations (transitions vs animations, will-change, prefers-reduced-motion) | Q28–Q30 |

---

### `04-behavioral-interview.md` — 20 Questions (Personalized)

Fully personalized for Dinesh S. Every answer uses the STAR method with real biographical details:

- **ECE background** → systems thinking transferable to frontend
- **GCE Thanjavur** → concrete origin story
- **250,000-word fantasy novel** → proof of discipline, shipping, and long-haul commitment
- **Medical recovery** → resilience narrative; turned constraint into productivity
- **Self-taught with AI tools** → honest, differentiating, modern learning model
- **Interview Vault itself** → cited as "going above and beyond" evidence

| Question | What It Tests |
|---|---|
| Tell me about yourself (2-min script with pacing guide) | First impression + story arc |
| Why frontend? | Genuine passion vs. opportunism |
| Why should we hire you? (3-pillar answer) | Confidence + evidence |
| Biggest challenge | Resilience + growth mindset |
| Project you're proud of (novel OR dashboard, pick by context) | Craft + technical depth |
| How do you learn? (3-phase system) | Self-direction + depth |
| How do you handle failure? (bad architecture → rebuilt) | Accountability + principle extraction |
| 3-year vision | Ambition + realism |
| Tell me about your book | Memorability + transferable skills |
| Why switch from ECE? | Agency + self-knowledge |
| How do you handle deadlines? (scope first) | Reliability + communication |
| Team experience (interface contract story) | Collaboration + communication |
| Biggest weakness (no team experience → what I'm doing about it) | Honest self-awareness |
| How do you stay updated? (named sources + vault) | Continuous learning |
| Disagreed with someone (3-layer state management debate) | Evidence-based thinking |
| What motivates you? | Authentic drivers |
| Handle stress? (3 tactics) | Resilience + self-management |
| Above and beyond (cheat sheet → full vault) | Intrinsic motivation |
| Colleagues say? (with one genuine critique) | Self-awareness |
| Questions for them? (5 smart questions) | Preparation + intelligence |

Ends with a **Quick Reference table** — one-line skeleton for all 20 answers.

---

### `05-system-design-frontend.md` — 10 Designs

Every design follows the 6-section framework:

```
Requirements gathering → Component architecture → State management →
API design → Performance considerations → Scalability & edge cases
```

| Design | Highlights |
|---|---|
| Chat Application | WebSocket, optimistic messages, offline queuing, virtualized list, reconnection backoff |
| Infinite Scroll Feed | TanStack infinite query, IntersectionObserver, optimistic likes, new-post banner |
| Form Builder | Normalized schema state, drag-and-drop with @dnd-kit, undo/redo diffs, CRDT mention |
| E-Commerce Cart | Zustand persistence, cross-tab sync, guest→auth cart merge, never trust client prices |
| Real-Time Notifications | SSE vs WebSocket comparison, BroadcastChannel tab sync, missed-event replay, push API |
| File Upload with Progress | XHR progress events, S3 multipart, pause/resume, abort controller, concurrent limit |
| Search Autocomplete | Debounce + TanStack cache = minimal requests, ARIA combobox pattern, text highlighting |
| Dashboard with Widgets | Per-widget data isolation, ErrorBoundary per widget, react-grid-layout, lazy widget types |
| State Management Architecture | Three-layer model (TanStack / Zustand / useState), query key factory, URL as state |
| Caching Strategies | 5-layer cache stack, HTTP Cache-Control, Service Worker strategies, CDN edge caching |

---

## How to Use the Vault

### By Interview Type

| Round | Files to prioritize |
|---|---|
| Phone screen (30 min) | `04-behavioral` Q1–Q3, `01-js` Q1 Q8 Q11 |
| Technical round 1 | `01-js-interview` + `03-css-html` |
| Technical round 2 | `02-react-interview` |
| System design round | `05-system-design-frontend` |
| Final / culture fit | `04-behavioral` all 20 |

### By Time Available

| Time | What to do |
|---|---|
| 30 min | Read the Quick Reference tables in 01, 02, 03. Read Q1 in each. |
| 2 hours | All 🔥 VERY COMMON questions across all files |
| Full day | Everything, prioritize MEDIUM then HARD |
| 1 week | Full files + build one project from memory after each section |

### Difficulty Priority

Start with `🔥 VERY COMMON` regardless of difficulty — those are the questions
every interviewer asks. Then hit `🟡 MEDIUM` to cover depth. `🔴 HARD` and
`💡 RARE` are for senior roles or extra preparation time.

---

## Key Concepts to Always Have Ready

These come up in nearly every frontend interview:

**JavaScript:**
- Event loop: sync → microtasks → one macrotask → repeat
- Closures: function + its lexical environment
- `this` binding: call site rules (default, implicit, explicit, new)
- Promise chain vs async/await error handling

**React:**
- `useEffect` dependency array and cleanup
- When to use each state management layer
- Reconciliation + key prop importance
- Server Components: zero JS to client

**CSS:**
- `box-sizing: border-box` universal reset
- Flexbox: main axis alignment (`justify-content`) vs cross axis (`align-items`)
- Specificity: (inline, ID, class/attr/pseudo, element)
- `display: grid` + `repeat(auto-fill, minmax(200px, 1fr))` responsive pattern

**Behavioral:**
- 2-minute "tell me about yourself" — practise aloud until it flows naturally
- 3 stories that cover: challenge, failure, going above and beyond
- 5 smart questions ready for "do you have any questions?"

**System Design:**
- Always start with requirements (2–3 min). Never jump to solution.
- Three-layer state model: server state / shared client state / local state
- Name the performance tool before describing it (IntersectionObserver, not "a scroll thing")

---

## Stats

```
Total questions:         170
Total system designs:    10
Unique code examples:    ~200+
Files in vault:          5
Estimated reading time:  12–15 hours (full depth)
```

---

*Interview Vault built during Day 8 of the Frontend Career Sprint.*
