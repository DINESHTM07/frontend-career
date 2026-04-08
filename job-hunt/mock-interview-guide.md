# Mock Interview Guide — Practice System

> **Why mock interviews matter:** Reading about interviews is not practice. Saying the answer out loud — under time pressure, being watched — is practice. Every mock interview you do is worth 5 hours of reading.
>
> **The goal:** By the time your real interview arrives, you've already done it 10 times.

---

## Part 1 — Using Pramp.com (Free Peer Mock Interviews)

Pramp matches you with another developer for a 1-hour session. You interview each other. It's free, requires no setup beyond a browser, and the peer pressure is real enough to simulate an actual interview.

### Step-by-Step Setup

1. **Go to pramp.com** — sign up with Google or email (free)
2. **Choose your interview type:**
   - Select "Frontend Development" for JS/React questions
   - Select "Data Structures & Algorithms" for coding rounds
   - You can switch between types per session
3. **Schedule a session:**
   - Click "Schedule Interview"
   - Pick a time slot — sessions are 30–60 minutes
   - Pramp matches you with another candidate around your level
4. **Before the session:**
   - Test your camera and mic (Pramp has a built-in check)
   - Have a notepad ready for thinking out loud
   - Close all tabs except Pramp
5. **During the session:**
   - You'll be the interviewer for the first 25 min, then swap
   - When you're the interviewee: think out loud, ask clarifying questions before coding
   - When you're the interviewer: take notes — you'll rate them at the end
6. **After the session:**
   - Both sides rate each other on a structured rubric
   - Read the feedback you receive — it's often brutally honest and that's the point

### How Often to Use Pramp

| Week | Frequency |
|---|---|
| Week 1 | 1 session — just get comfortable with the format |
| Week 2–3 | 2 sessions per week |
| Week 4+ (active job hunt) | 3–4 sessions per week |

**Pro tip:** Request the same type of question repeatedly until you're consistently scoring well before moving on. Don't jump around.

---

## Part 2 — Self-Recording Mock Interviews on Your Phone

When you can't get a Pramp partner (or want more reps), record yourself. It feels awkward. Do it anyway — watching yourself is one of the most effective feedback loops in existence.

### Setup

- **Camera:** Your phone, propped against something at eye level
- **What to record:** Your face + voice (not your screen)
- **Lighting:** Face a window or lamp — don't record in a dark room
- **Duration:** 15–20 minutes per session

### The Self-Recording Protocol

1. **Pick one question** from the Top 20 list below
2. **Set a timer for 2 minutes** — think about your answer, don't write it
3. **Hit record on your phone**
4. **Answer the question out loud** as if you're in a real interview
5. **Stop recording** when you're done
6. **Watch it back immediately** — score yourself on the rubric below
7. **Write one improvement for next time** — just one

### What to Watch For When Reviewing

- Do you look at the camera or down at your notes?
- Are your sentences complete or do you trail off?
- Did you pause to think or just start talking and hope for the best?
- Did you give an example or just a definition?
- Was your pace comfortable or rushed?

---

## Part 3 — Top 20 Questions to Practice First

Practice these in order. Each builds on the previous.

### Behavioral (Practice First — These Appear in Every Round)

1. Tell me about yourself *(2-minute script — hardest to do naturally)*
2. Why frontend development?
3. Walk me through a project you're proud of
4. What's your biggest weakness?
5. Tell me about a time you failed — what did you learn?

### JavaScript (Most Common Technical Questions)

6. Explain closures with an example you write on the spot
7. What is the event loop? Walk me through this code: `setTimeout(() => console.log('A'), 0); console.log('B');`
8. What's the difference between `==` and `===`? Why does `[] == false` return true?
9. Explain `this` in 4 different contexts
10. What is a Promise? Write a function that wraps `setTimeout` in one

### React (Core to Every Frontend Role)

11. What happens when you call `setState`? Walk through the render cycle
12. Why can't you call hooks inside an `if` statement?
13. When would you use `useCallback`? Write an example that actually needs it
14. What's the difference between `useEffect` and `useLayoutEffect`?
15. Explain reconciliation and why keys matter in lists

### CSS / HTML

16. Explain the CSS box model. What does `box-sizing: border-box` change?
17. What's the difference between `display: flex` and `display: grid`? When do you choose each?
18. What is specificity? Score this selector: `div.container > p#intro span`
19. What does `position: sticky` do? When does it not work?
20. What is semantic HTML? Why does it matter for accessibility?

---

### Practice Order by Week

| Week | Focus Area | Questions |
|---|---|---|
| Week 1 | Behavioral foundation | 1–5 (record all five) |
| Week 2 | JavaScript core | 6–10 (Pramp: JS track) |
| Week 3 | React depth | 11–15 (Pramp: Frontend track) |
| Week 4 | CSS + full mix | 16–20, then random from all |
| Week 5+ | Full mock interviews | Random from all 20, timed |

---

## Part 4 — Self-Scoring Rubric (0–5 Scale)

Use this after every self-recording or Pramp session. Be honest — inflating your scores means you stop improving.

### The 5 Dimensions

---

**1. Clarity (0–5)**
*Did the answer make sense to someone hearing it for the first time?*

| Score | What it looks like |
|---|---|
| 0 | Rambling, no structure, confusing |
| 1 | Some structure but hard to follow |
| 2 | Generally clear, some confusion |
| 3 | Clear throughout, minor gaps |
| 4 | Clear, well-structured, easy to follow |
| 5 | Crystal clear — a stranger would understand |

---

**2. Correctness (0–5)**
*Was the technical content accurate?*

| Score | What it looks like |
|---|---|
| 0 | Factually wrong |
| 1 | Mostly wrong, 1–2 correct points |
| 2 | Partially correct, significant gaps |
| 3 | Mostly correct, minor errors |
| 4 | Correct with one small slip |
| 5 | Fully accurate — no corrections needed |

---

**3. Code Quality (0–5)**
*(For coding questions only — skip for behavioral)*

| Score | What it looks like |
|---|---|
| 0 | Didn't write code or code is broken |
| 1 | Code written but has major bugs |
| 2 | Code works for happy path only |
| 3 | Code works, handles some edge cases |
| 4 | Clean code, good naming, handles edge cases |
| 5 | Production-quality — would pass a PR review |

---

**4. Communication (0–5)**
*Did you think out loud? Did you ask clarifying questions? Did you explain your reasoning?*

| Score | What it looks like |
|---|---|
| 0 | Silent, no explanation |
| 1 | Occasional explanation |
| 2 | Some thinking out loud |
| 3 | Mostly narrated thought process |
| 4 | Consistently explained decisions and tradeoffs |
| 5 | Interviewer always knew where you were going |

---

**5. Confidence (0–5)**
*Did you appear sure of yourself? Did you own your answer even when uncertain?*

| Score | What it looks like |
|---|---|
| 0 | Visibly anxious, kept apologizing |
| 1 | Hesitant throughout |
| 2 | Uncertain on most answers |
| 3 | Confident on familiar topics, shaky on hard ones |
| 4 | Consistently steady — uncertainty was acknowledged, not performed |
| 5 | Calm, direct, owned every answer |

---

### Score Interpretation

| Total (out of 25) | What It Means | Action |
|---|---|---|
| 0–10 | Early stage — keep practicing | Record daily, Pramp twice a week |
| 11–15 | Building — noticeable gaps | Identify weakest dimension, focus there |
| 16–19 | Solid — interview-ready for most roles | Maintain with 2 sessions/week |
| 20–23 | Strong — ready for senior-level screens | Start applying actively |
| 24–25 | You're coaching others now | Go get the job |

---

### Score Tracking Template

Copy this after each session:

```
Date:         ___________
Question(s):  ___________
Format:       Pramp / Self-record

Clarity:       /5
Correctness:   /5
Code Quality:  /5  (or N/A)
Communication: /5
Confidence:    /5
─────────────────
Total:         /25

One thing that went well:
One thing to improve next session:
```

---

## Part 5 — Weekly Mock Interview Schedule

### Active Job Hunt Schedule (Recommended)

| Day | Activity | Time |
|---|---|---|
| Monday | Pramp session — behavioral questions | 1 hour |
| Tuesday | Self-record 2 technical questions | 30 min |
| Wednesday | Pramp session — JavaScript / Frontend | 1 hour |
| Thursday | Self-record 2 more from Top 20 | 30 min |
| Friday | Full mock: 5 behavioral + 5 technical (self-record) | 45 min |
| Saturday | Review all recordings from the week + score | 30 min |
| Sunday | Rest or light review of weak areas | — |

**Minimum schedule (pre-job hunt):**

| Day | Activity | Time |
|---|---|---|
| Tuesday | Self-record 3 questions | 30 min |
| Thursday | Pramp session | 1 hour |
| Sunday | Review + score | 20 min |

---

### Monthly Progress Check

At the end of each month, answer these:

```
Average score this month:          /25
Best session score:                /25
Weakest dimension still:           ___________
Questions I consistently nail:     ___________
Questions that still trip me up:   ___________
Real interviews this month:        ___
Offers / advances to next round:   ___
```

---

*Mock interview guide for Dinesh S — practice is the only preparation that works.*
