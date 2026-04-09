# Day 80 — First Mock Interview on Pramp

**Status:** 📋 READY TO START
**Week:** 12 | **Theme:** Interview Preparation

---

## Today's Goal

Do your first real mock interview with a stranger on Pramp.com. Not a practice run. Not a simulation. A real mock interview where you don't know the question in advance and someone is watching you think. This is the day you find out where you actually stand.

By end of today:
- 1 Pramp mock interview completed
- Honest written debrief done immediately after
- Weak areas identified
- 2 DSA problems solved

---

## What to Do

### Step 1 — Set Up Pramp (if not already done)

Go to pramp.com. Create an account. Select "Frontend" as your focus area. Schedule a session for this morning — pick the earliest available slot.

Pramp is peer-to-peer: you interview someone, they interview you, then you swap. Both sides get practice.

---

## Morning (8:00 – 9:30 AM) — Prepare for the Interview

### Before the mock interview, review:

**Your 60-second intro (say this when they ask "tell me about yourself"):**
> "I'm a frontend developer. I've built 3 projects over the past few months — an e-commerce app with React and Zustand, an analytics dashboard in TypeScript, and a Next.js app with server components. I've been doing structured interview prep this week. I'm looking for a junior frontend role."

**Your problem-solving process (say this out loud BEFORE starting any coding problem):**
> "Before I start coding, let me make sure I understand the problem. [Restate the problem in your own words.] Can I clarify a few things? [Ask about edge cases: empty input, negative numbers, large inputs.] Let me think through the approach before writing any code. [Explain your approach out loud.] I'll code it up now."

**Things that kill your score in mock interviews:**
- Jumping straight into code without stating your approach
- Going silent for more than 30 seconds without narrating your thinking
- Saying "I don't know" and stopping — instead say "I'm not sure of the optimal solution yet, let me think through a brute-force approach first"
- Forgetting to handle edge cases
- Not testing your solution with an example after writing it

---

## The Mock Interview (whenever your session is scheduled)

### During the interview — follow this protocol:

**When you get the problem:**
1. Read it slowly — read it twice
2. Restate it: "So what I'm understanding is..."
3. Ask about edge cases: "What should I return if the input is empty? Can there be negative numbers?"
4. State your approach: "I'm thinking of using a hash map to track... this would give me O(n) time"
5. Code it up — narrate as you go
6. Test with the example from the problem, then with an edge case you identified
7. State time and space complexity: "This is O(n) time and O(n) space because..."

**If you get stuck:**
- Don't go silent. Say "Let me think through this differently..."
- Start with brute force: "The naive approach would be... which is O(n²). I want to see if I can do better."
- Draw it out or write comments in the code before writing actual code
- If truly stuck after 2-3 minutes, it's okay to ask for a small hint

**When you're interviewing them:**
- Use the Pramp question they give you
- Be a good interviewer — give hints when they're stuck, don't just watch them struggle
- Take notes on what they did well and what they could improve

---

## Immediately After (within 15 minutes of finishing) — Write Your Debrief

Open `interview-vault/mock-interview-log.md` and write:

```
## Mock Interview 1 — [Date]

### The Problem
[What was the problem? Describe it in 2-3 sentences.]

### My Approach
[What approach did I take? Did I explain it before coding?]

### What I Did Well
- 
- 

### What I Struggled With
- 
- 

### Specific Things to Improve
- 
- 

### Their Feedback (if they gave any)
- 

### My Score (self-rated 1-5): ___
```

Be honest. The debrief is only valuable if it's accurate.

---

## Afternoon (1:30 – 3:30 PM) — Review Weak Areas + DSA

### Review what you struggled with

If you got stuck on the coding problem: solve it again now, without looking at a solution. Write it clean from scratch.

If you struggled to explain your approach out loud: pick 2 problems from this week's DSA and practice explaining your approach before coding — out loud, as if in an interview.

If you froze on a behavioral question: practice that story again using the STAR method.

### DSA (2 Problems)

Create `day-80-dsa.js`. Focus on whatever pattern showed up in your mock interview.

---

## End of Day Checklist

- [ ] Pramp account set up — interview scheduled
- [ ] "Tell me about yourself" practiced without notes
- [ ] Problem-solving process reviewed
- [ ] Mock interview completed on Pramp
- [ ] Debrief written in `interview-vault/mock-interview-log.md` within 15 minutes
- [ ] Weak areas from debrief identified
- [ ] Struggled with the coding problem? Solved it again from scratch
- [ ] 2 DSA problems solved in `day-80-dsa.js`

---

*The mock interview will be uncomfortable. That discomfort is the whole point. You will not get better at interviews by thinking about interviews. You get better by doing them.*
