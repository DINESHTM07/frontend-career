# Next.js 14+ App Router Cheatsheet

---

## CONCEPT

Next.js 14+ uses the **App Router** — a file-system-based routing architecture where folders define URL segments. Every file with a special name (`page.tsx`, `layout.tsx`, etc.) plays a specific role. The App Router is built on React Server Components (RSC), meaning components run on the server by default and only ship to the client when you opt-in.

**Key mental model:** The folder = the route. The special files = the behavior of that route.

---

## WHY IT MATTERS

- **Performance by default**: Server Components reduce JS bundle size — zero JS sent for server-only components.
- **SEO**: Server-rendered HTML is immediately indexable.
- **Colocation**: Layouts, loading states, and error boundaries live next to the routes they apply to.
- **Full-stack in one repo**: API routes (Route Handlers) sit alongside your UI code.
- Industry standard for React in 2024+. Almost every job posting mentions Next.js.

---

## EXAMPLES

### 1. File-system routing structure

```
app/
├── page.tsx              → /
├── layout.tsx            → Root layout (wraps everything)
├── loading.tsx           → Shown while page.tsx streams
├── error.tsx             → Shown when page throws
├── not-found.tsx         → Shown when notFound() is called
├── about/
│   └── page.tsx          → /about
├── blog/
│   ├── page.tsx          → /blog
│   └── [slug]/
│       ├── page.tsx      → /blog/anything
│       └── loading.tsx   → Loading UI for this segment only
└── dashboard/
    ├── layout.tsx        → Persistent layout for /dashboard/*
    └── settings/
        └── page.tsx      → /dashboard/settings
```

### 2. Root layout (required)

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

### 3. Server Component (default) — data fetching

```tsx
// app/blog/page.tsx — Server Component, no 'use client' needed
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  })
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export default async function BlogPage() {
  const posts = await getPosts() // Direct async/await — no useEffect

  return (
    <ul>
      {posts.map((post: { id: number; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### 4. Client Component — interactive UI

```tsx
// app/components/Counter.tsx
'use client' // Opts into client-side rendering

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

```tsx
// app/blog/page.tsx — Server Component can import Client Components
import Counter from '@/components/Counter'

export default async function BlogPage() {
  const posts = await getPosts()
  return (
    <div>
      <Counter /> {/* Client Component embedded in Server Component */}
      <ul>{/* posts list */}</ul>
    </div>
  )
}
```

### 5. Dynamic routes with generateStaticParams (SSG)

```tsx
// app/blog/[slug]/page.tsx
interface Props {
  params: { slug: string }
}

// Pre-generate these routes at build time (SSG)
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return posts.map((post: { slug: string }) => ({ slug: post.slug }))
}

export default async function BlogPost({ params }: Props) {
  const post = await fetch(`https://api.example.com/posts/${params.slug}`).then(r => r.json())
  return <article><h1>{post.title}</h1><p>{post.body}</p></article>
}
```

### 6. loading.tsx — Streaming UI

```tsx
// app/blog/loading.tsx — automatically shown while page.tsx suspends
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-8 bg-gray-200 rounded" />
      ))}
    </div>
  )
}
```

### 7. error.tsx — Error boundary

```tsx
// app/blog/error.tsx
'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### 8. not-found.tsx + notFound()

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug)
  if (!post) notFound() // Renders not-found.tsx for this segment
  return <article>{post.title}</article>
}

// app/blog/not-found.tsx
export default function NotFound() {
  return <h2>Post not found</h2>
}
```

### 9. Route Handlers (API routes)

```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const posts = await db.post.findMany()
  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const post = await db.post.create({ data: body })
  return NextResponse.json(post, { status: 201 })
}

// app/api/posts/[id]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await db.post.delete({ where: { id: params.id } })
  return new NextResponse(null, { status: 204 })
}
```

### 10. Middleware for auth

```tsx
// middleware.ts (root of project, NOT in /app)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
}
```

### 11. next/image

```tsx
import Image from 'next/image'

// Always use width + height for static images
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // Load eagerly (above the fold)
/>

// Fill mode for responsive containers
<div className="relative h-64 w-full">
  <Image
    src={post.coverUrl}
    alt={post.title}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>
```

### 12. Metadata API for SEO

```tsx
// Static metadata
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read my posts',
  openGraph: {
    title: 'Blog',
    images: ['/og-image.jpg'],
  },
}

// Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPost(params.slug)
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [post.coverImage],
    },
  }
}
```

### 13. Navigation: Link, useRouter, redirect

```tsx
// Link — for client-side navigation
import Link from 'next/link'
<Link href="/about">About</Link>
<Link href={`/blog/${post.slug}`} prefetch={false}>Post</Link>

// useRouter — for programmatic navigation in Client Components
'use client'
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/dashboard')     // Navigate
router.replace('/login')      // Replace history entry
router.back()                 // Go back
router.refresh()              // Re-fetch server data

// redirect — in Server Components / Route Handlers
import { redirect, permanentRedirect } from 'next/navigation'
redirect('/login')             // 307 Temporary redirect
permanentRedirect('/new-url')  // 308 Permanent redirect
```

---

## COMMON MISTAKES

1. **Using `useState`/`useEffect` in a Server Component** — You'll get an error. Add `'use client'` at the top or extract the interactive part.

2. **Forgetting `'use client'` on event handlers** — `onClick`, `onChange`, etc. don't work in Server Components.

3. **Passing non-serializable props from Server → Client** — Functions, class instances, and Dates can't cross the server/client boundary as props. Serialize first.

4. **Importing a Client Component that imports a Server-only module** — Server-only imports (db, fs) must stay in Server Components. Use `server-only` package to guard them.

5. **Using `useRouter` from `next/router`** — That's Pages Router. App Router uses `next/navigation`.

6. **Forgetting `async` on Server Component** — If you need to `await` data, the component function must be `async`.

7. **Not adding `sizes` to `<Image fill>`** — Without `sizes`, Next.js can't optimize image delivery by viewport.

8. **Putting `middleware.ts` inside `/app`** — Middleware must be at the project root (same level as `/app`).

---

## INTERVIEW TIP

> "What's the difference between Server Components and Client Components?"

**Answer framework:**
- **Server Components** (default): Run on server, no JS in bundle, can `await` directly, can access databases/env vars, NO hooks or browser APIs.
- **Client Components** (`'use client'`): Run in browser, can use hooks and browser APIs, interactive, add JS to bundle.
- **Key insight**: Server Components can _import_ Client Components, but Client Components cannot import Server Components. You compose by nesting.
- **Mention**: The boundary is opt-in — you only pay the client bundle cost for interactive parts.

Bonus: mention "the donut pattern" — Server Component wrapping a Client Component that wraps Server Component children via `children` prop.
