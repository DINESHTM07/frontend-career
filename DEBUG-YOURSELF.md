# My Code Doesn't Work — What To Do (Before Panicking)

> Follow these steps in order. Don't skip to Step 8 first. The answer is almost always in Steps 1-4.

---

## Step 1: READ THE ERROR MESSAGE

I know. It looks like a wall of red text written in an alien language. Read it anyway.

The important parts are always at the **bottom** — the last 2-3 lines. Look for:
- A **file name** (usually ends in `.js`, `.tsx`, `.css`)
- A **line number** (e.g. `at App.jsx:47`)
- The **actual error text** (e.g. `TypeError: Cannot read properties of undefined`)

The file and line number tell you exactly where to look. Go there first.

```
// Error says: TypeError: Cannot read properties of undefined (reading 'map')
// at ProductList.jsx:23
// That means: line 23 of ProductList.jsx. Go there.
```

---

## Step 2: DID YOU SAVE THE FILE?

Hit **Ctrl+S** right now.

Laugh if you want — but this fixes approximately 20% of all "bugs" that are not bugs. Your code is fine. You just haven't saved the new version yet.

In Cursor/VS Code: look at the tab at the top. If there's a dot (•) next to the filename, it's unsaved. Save it. Check if the error is gone.

---

## Step 3: DID YOU SPELL EVERYTHING CORRECTLY?

JavaScript is violently case-sensitive.

- `useState` is NOT the same as `usestate` or `UseState`
- `onClick` is NOT the same as `onclick`
- `className` is NOT the same as `classname` or `class`

Check:
- Import names match what you exported
- Component names start with a capital letter (`Button`, not `button`)
- Variable names match exactly between where you defined them and where you used them

```js
// This will break:
const [Count, setCount] = useState(0)  // capital C
return <p>{count}</p>                   // lowercase c — undefined!

// This works:
const [count, setCount] = useState(0)
return <p>{count}</p>
```

---

## Step 4: OPEN BROWSER DEVTOOLS

Press **F12**. Click the **Console** tab.

Is there a red error? READ IT. It is more specific than the terminal error.

Also check the **Network** tab if you're fetching data:
- Red entries = failed requests
- Click a red entry → look at the Response tab → that's why your API call failed

The Console tab is your friend. Developers keep it open at all times. Leave it open.

---

## Step 5: GOOGLE THE EXACT ERROR

Copy the red error text. Paste it into Google. Don't paraphrase — copy it exactly.

Add "React" or "JavaScript" to narrow results.

The first Stack Overflow result usually has your answer. Look for green checkmarks and high upvotes. Read the top answer. If it doesn't apply, read the second one.

---

## Step 6: ADD console.log EVERYWHERE

This is called "printf debugging" and senior developers use it constantly. Don't let anyone tell you it's not real debugging.

```js
function fetchProducts(category) {
  console.log('fetchProducts called with:', category)     // What came in?

  const result = products.filter(p => p.category === category)
  console.log('filtered result:', result)                  // What came out?

  return result
}
```

Look at the console. Ask: **Is the value what I expected?**

- Expected an array, got `undefined`? The data isn't there yet.
- Expected a string, got `[object Object]`? Use `JSON.stringify(thing)` in the log.
- Expected a number, got `NaN`? Something upstream isn't a number.

The log will point directly at where reality diverged from your expectations.

---

## Step 7: COMMENT OUT YOUR NEW CODE

Find the code you added since things last worked. Comment all of it out:

```js
// const newThing = doSomethingClever(data)
// return <NewComponent data={newThing} />
```

Does the app work now? If yes: the bug is definitely in what you commented out. Un-comment one line at a time, refreshing after each. The moment it breaks again — that line is your bug.

---

## Step 8: ASK CURSOR AI

Highlight the broken code. Press **Ctrl+K** (or Ctrl+L for chat). Type:

> "This code is giving me the error: [paste error here]. Why isn't it working? What should I change?"

Paste the relevant code (20-50 lines around the problem, not the whole file). Cursor is usually right on the first try. If not, paste the new error and ask again.

---

## Step 9: TAKE A 10-MINUTE BREAK

Step away. Make tea. Walk around. Do something that is not looking at the code.

Your brain continues processing problems in the background during rest. This is not a metaphor — it is how the brain actually works. A bug that stumped you for 40 minutes often becomes obvious after 10 minutes away.

Come back and read the code like a stranger reading it for the first time. Look at what it *actually* says, not what you *think* it says.

---

## Step 10: OPEN A NEW CLAUDE CHAT

If you have genuinely tried Steps 1-9 and are still stuck after 30 minutes:

Open Claude (claude.ai) and send:
1. The full error message
2. The relevant code (the function or file where the error is)
3. What you've already tried

This is not weakness. This is efficiency. Senior developers ask for help. They just ask more precisely because they've done Steps 1-9 first. You've done the same.

---

## Common Errors Dictionary

| Error | What it actually means | How to fix it |
|-------|----------------------|---------------|
| `X is not defined` | You used a variable or function that doesn't exist at that point | Check spelling, check if you imported it, check if it's in scope |
| `X is not a function` | You called `X()` but X is not a function | `console.log(X)` — it's probably `undefined` or an object |
| `Cannot read properties of undefined (reading 'X')` | You did `thing.X` but `thing` is `undefined` | Add optional chaining: `thing?.X` or check if data is loaded |
| `Objects are not valid as a React child` | You're rendering `{someObject}` directly in JSX | Access a property: `{someObject.name}` or `{JSON.stringify(obj)}` |
| `Too many re-renders` | You're calling setState during render (not in an event or effect) | Move setState into `useEffect` or a click handler |
| `Each child in a list should have a unique "key" prop` | Your `.map()` items need a key | Add `key={item.id}` to the element inside `.map()` |
| `Module not found: Can't resolve './X'` | Import path is wrong or package not installed | Check the file exists; if a package: run `npm install package-name` |
| `Unexpected token` | Syntax error — something is missing or wrong | Look at the line number: missing `}`, `)`, `,`, or a keyword typo |
| CORS error in Network tab | Browser blocked your API request for security | Backend config issue — cannot be fixed from the frontend |

---

*Most bugs are solved by Steps 1-4. The rest by Steps 5-7. You almost never need Step 10. But it's there when you do.*
