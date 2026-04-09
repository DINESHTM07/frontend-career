# Day 56 — Server Components vs Client Components + API Routes

**Status:** 📋 READY TO START
**Week:** 9 | **Theme:** Next.js + Tailwind

---

## Today's Goal

Master the Server Component / Client Component boundary — the most important concept in Next.js App Router. Then learn API Routes (Route Handlers) to build backend endpoints inside your Next.js app.

By end of today:
- You can explain the Server/Client split without looking anything up
- You know exactly when to use `'use client'` and when NOT to
- You've built at least one Route Handler (`/api/...`)
- You've seen the common mistake: putting `'use client'` on everything

---

## Morning (8:00 – 11:00 AM) — The Server/Client Mental Model

### The Core Rule

**Server Components** (default):
- Run only on the server
- Can be `async` — fetch data, read files, access databases
- Zero JavaScript sent to the browser
- Cannot use: `useState`, `useEffect`, event handlers, browser APIs

**Client Components** (`'use client'` at the top):
- Run on the server first (for initial HTML), then hydrate in the browser
- Can use: `useState`, `useEffect`, event handlers, browser APIs
- Their JavaScript IS sent to the browser

### The Boundary Rule

`'use client'` marks a **boundary**, not an individual component. Everything in the file and everything it imports becomes client-side.

This means:
- A Server Component can import and render a Client Component ✅
- A Client Component CANNOT import a Server Component ❌
- A Client Component CAN receive a Server Component as a `children` prop ✅

### The Decision Tree

Ask yourself in this order:

1. Does this component need `useState`, `useEffect`, or event handlers? → Client Component
2. Does this component need browser APIs (`window`, `localStorage`, `navigator`)? → Client Component
3. Does this component need third-party libraries that require the DOM? → Client Component
4. Everything else → Server Component (keep it server-side, ship less JS)

### The Common Mistake

Beginners add `'use client'` to every file to make errors go away. This defeats the entire purpose — you end up with a React SPA inside Next.js, with none of the server rendering benefits.

**The correct approach:** push `'use client'` as far down the tree as possible. Keep parents as Server Components; make only the interactive leaves Client Components.

### Build the Demo: Server + Client Interleaved

```tsx
// src/app/demo/page.tsx — Server Component (no 'use client')
import CounterButton from '@/components/CounterButton'

// This data fetching runs on the server
async function getServerData() {
  return { message: 'This came from the server', timestamp: new Date().toISOString() }
}

export default async function DemoPage() {
  const data = await getServerData()

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Server + Client Demo</h1>

      {/* Server-rendered content — no JS needed */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="font-medium">From the server:</p>
        <p className="text-gray-600">{data.message}</p>
        <p className="text-sm text-gray-400">{data.timestamp}</p>
      </div>

      {/* Client Component embedded inside Server Component */}
      <CounterButton initialCount={0} />
    </main>
  )
}
```

```tsx
// src/components/CounterButton.tsx — Client Component
'use client'

import { useState } from 'react'

export default function CounterButton({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount)

  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <p className="font-medium">Client Component (has useState):</p>
      <p className="text-2xl font-bold my-2">{count}</p>
      <button
        onClick={() => setCount(c => c + 1)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Increment
      </button>
    </div>
  )
}
```

The page renders server data statically. The button has interactivity. Only the button's JavaScript ships to the browser — not the whole page.

---

## Midday (11:20 AM – 1:30 PM) — Route Handlers (API Routes)

Route Handlers are Next.js's way of building API endpoints. They live inside `src/app/api/` and use a `route.ts` file instead of `page.tsx`.

### Create a Simple GET endpoint

Create `src/app/api/posts/route.ts`:

```ts
import { NextResponse } from 'next/server'

const posts = [
  { id: 1, title: 'Getting Started with Next.js', author: 'Dinesh', views: 142 },
  { id: 2, title: 'Understanding Server Components', author: 'Dinesh', views: 87 },
  { id: 3, title: 'App Router vs Pages Router', author: 'Dinesh', views: 203 },
]

export async function GET() {
  return NextResponse.json(posts)
}
```

Test it: open `http://localhost:3000/api/posts` — you should see JSON.

### Create a POST endpoint

Add a POST handler to the same `route.ts`:

```ts
export async function POST(request: Request) {
  const body = await request.json()

  // Validate the body
  if (!body.title || !body.author) {
    return NextResponse.json(
      { error: 'title and author are required' },
      { status: 400 }
    )
  }

  const newPost = {
    id: posts.length + 1,
    title: body.title,
    author: body.author,
    views: 0,
  }

  posts.push(newPost)

  return NextResponse.json(newPost, { status: 201 })
}
```

Test it in the browser console or a REST client:
```js
fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'New Post', author: 'Test' })
}).then(r => r.json()).then(console.log)
```

### Create a dynamic route: GET by ID

Create `src/app/api/posts/[id]/route.ts`:

```ts
import { NextResponse } from 'next/server'

const posts = [
  { id: 1, title: 'Getting Started with Next.js', author: 'Dinesh', views: 142 },
  { id: 2, title: 'Understanding Server Components', author: 'Dinesh', views: 87 },
]

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = posts.find(p => p.id === parseInt(params.id))

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json(post)
}
```

Test: `http://localhost:3000/api/posts/1` → returns post 1. `http://localhost:3000/api/posts/999` → returns 404.

### Fetch from a Route Handler in a Server Component

```tsx
// src/app/posts/page.tsx — Server Component calling your own API
export default async function PostsPage() {
  // In production: use an absolute URL or call the function directly
  // For dev: calling your own API route works like this:
  const res = await fetch('http://localhost:3000/api/posts')
  const posts = await res.json()

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Posts from API</h1>
      <ul className="space-y-4">
        {posts.map((post: { id: number; title: string; author: string; views: number }) => (
          <li key={post.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500">{post.author} · {post.views} views</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-56-dsa.js` in this folder.

---

## Key Concepts to Lock In Today

| | Server Component | Client Component |
|--|-----------------|-----------------|
| Default? | Yes | No (needs `'use client'`) |
| Can be async? | Yes | No |
| Can use useState? | No | Yes |
| JS sent to browser? | No | Yes |
| Can fetch data? | Yes (directly) | Yes (useEffect/fetch) |

**Route Handler conventions:**
- `src/app/api/[path]/route.ts` — export named functions `GET`, `POST`, `PUT`, `DELETE`
- Dynamic segment: `src/app/api/posts/[id]/route.ts` — `params.id` in the handler
- Return `NextResponse.json(data, { status: 200 })` — never return raw objects

---

## End of Day Checklist

- [ ] Can explain Server vs Client Components without looking anything up
- [ ] Can explain: why you should NOT add `'use client'` to every component
- [ ] Built `/demo` page: Server Component rendering async data + Client Component with useState
- [ ] Confirmed: clicking the counter updates without a page reload
- [ ] Created `src/app/api/posts/route.ts` with GET + POST handlers
- [ ] GET `/api/posts` returns JSON list
- [ ] POST `/api/posts` with body creates a new post (status 201)
- [ ] POST `/api/posts` with missing fields returns 400 with error message
- [ ] Created `src/app/api/posts/[id]/route.ts` — GET by ID works, 404 on missing
- [ ] Created `/posts` page that fetches from the API route
- [ ] Completed 3 DSA problems in `day-56-dsa.js`

---

*Every Next.js bug from here on is either "this should be a Client Component" or "this should be a Server Component." You now know how to decide.*
