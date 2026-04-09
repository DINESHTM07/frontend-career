# Day 82 — Second Mock Interview + Project Review

**Status:** 📋 READY TO START
**Week:** 12 | **Theme:** Interview Preparation

---

## Today's Goal

Second mock interview on Pramp. Then a full review of all 3 of your projects — because interviewers WILL ask about them, and you need to be able to talk about technical decisions, trade-offs, and what you'd do differently. End the week with the LinkedIn post.

By end of today:
- Second Pramp mock interview completed
- All 3 projects reviewed and talking points prepared
- LinkedIn milestone post published
- 3 DSA problems solved

---

## What to Open

1. pramp.com — schedule your session
2. Your 3 project repositories + live URLs
3. `interview-vault/mock-interview-log.md` — to log this session

---

## Morning (8:00 – 9:30 AM) — Project Review Before the Interview

You will be asked about your projects in almost every interview. "Walk me through this project." "Why did you choose X?" "What would you do differently?" "What was the hardest part?" Prepare real answers now.

### For each of your 3 projects, have answers ready for:

**1. "Walk me through this project."**
> State: what it does (1 sentence), the tech stack, the most interesting technical feature, and the result. Under 2 minutes.

**2. "Why did you choose [Zustand / TanStack Query / TypeScript / Next.js]?"**
> Have a real reason. "Zustand because I wanted minimal boilerplate without a provider wrapper — it's just a hook." "TanStack Query because manual fetch with useEffect is error-prone and doesn't handle caching, deduplication, or background refetching." "TypeScript because it catches bugs at compile time and makes the codebase easier to understand."

**3. "What was the hardest technical challenge?"**
> Pick something real. Be specific. "Getting the debounced search, category filter, and sort to work together correctly without race conditions — I had to understand how TanStack Query's key-based refetching works." Not: "It was challenging overall."

**4. "What would you do differently?"**
> Shows maturity. "I'd add end-to-end tests with Playwright — I only have unit/integration tests now and a bug could slip through at the UI level." "I'd add proper error boundaries instead of just catching errors per-component."

**5. "What does the code quality look like?"**
> "I have [X] unit tests with Vitest and React Testing Library. I used ESLint and Prettier throughout. The component structure follows a feature-based folder structure — not a flat file dump."

---

## The Second Mock Interview (scheduled session)

### Before you start: compare to your first mock interview

Read your debrief from Day 80. Before the session, say out loud: "Last time I struggled with [X]. This time I will [specific improvement]."

### During the interview — focus specifically on improvements:

If you went silent last time → narrate your thinking even when you're not sure
If you jumped to code last time → state the approach before writing a single line
If you blanked on complexity last time → after writing the solution, immediately say "this is O(n) time because..."
If you froze on behavioral questions → use STAR, say "I" not "we", end with the result

### After the interview — debrief immediately:

```
## Mock Interview 2 — [Date]

### The Problem
[Describe the problem.]

### My Approach
[What did I do?]

### Compared to Interview 1
- Better: 
- Still struggling with: 

### Specific improvements for real interviews
- 

### My Score (self-rated 1-5): ___
```

---

## Afternoon (1:30 – 3:00 PM) — DSA + LinkedIn Post

### DSA (3 Problems)

Create `day-82-dsa.js`. Pick 3 problems from your running ❌ list — problems you've marked wrong more than once this week.

### The LinkedIn Post

Post this today. Week 12 milestone — you've done the preparation, say it publicly.

```
Completed interview preparation.

This week:
- 60 JS interview questions — practiced out loud, not just read
- 50 React interview questions — hooks, rendering, performance, patterns
- 30 CSS/HTML questions + 10 system design walkthroughs
- STAR stories prepared and practiced
- 2 mock interviews on Pramp with strangers

200+ questions practiced. Mock interviews done.

3 deployed projects, 100+ DSA problems solved, interview prep complete.

Ready for the real thing.

[portfolio link]
```

Customize the project names and links. Post it — don't draft it, post it.

---

## End of Week 12 Review

Look back at the week. Honest assessment:

**JS questions:** ✅/⚠️/❌
**React questions:** ✅/⚠️/❌
**CSS/HTML questions:** ✅/⚠️/❌
**System design:** ✅/⚠️/❌
**Behavioral stories:** ✅/⚠️/❌
**Mock interview 1 score:** ___
**Mock interview 2 score:** ___
**Improvement between interviews:** ✅/⚠️/❌

If you rated anything ❌, that's the first thing you work on next week.

---

## End of Day Checklist

- [ ] All 3 projects reviewed — walking-through answers prepared for each
- [ ] "Walk me through this project" practiced for each project (out loud, under 2 min)
- [ ] "What would you do differently?" answered honestly for each project
- [ ] Second mock interview completed on Pramp
- [ ] Debrief written in `interview-vault/mock-interview-log.md` immediately after
- [ ] Compared to Interview 1 — named specific improvements
- [ ] 3 DSA problems solved in `day-82-dsa.js`
- [ ] LinkedIn post published (not drafted — published)
- [ ] End of week review completed
- [ ] Run: `git add . && git commit -m "Week 12 complete: interview prep + 2 mock interviews"`

---

*Two weeks ago you hadn't practiced a single answer out loud. Today you've done 200+ questions and two real mock interviews. That is not nothing. Keep applying.*
