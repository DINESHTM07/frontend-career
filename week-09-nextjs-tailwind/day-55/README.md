# Day 55 — Next.js Setup + App Router Basics

**Status:** 📋 READY TO START
**Week:** 9 | **Theme:** Next.js + Tailwind

---

## Today's Goal

Get off the ground with Next.js App Router. Understand the mental shift from React SPA to file-based routing with server-first rendering. By end of today you have a running multi-page Next.js app and you understand what every generated file does.

By end of today:
- Next.js app running locally at `http://localhost:3000`
- 3 pages built: `/`, `/about`, `/blog`
- You understand: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- Exercise 28 completed — SSR vs SSG vs CSR is no longer abstract

---

## What to Open

1. `cheatsheets/advanced/01-nextjs.md`

---

## Morning (8:00 – 11:00 AM) — Read Cheatsheet + Create Project

### Step 1 — Read the Cheatsheet

Open `cheatsheets/advanced/01-nextjs.md` and read it fully before touching code.

The single most important mental shift from React SPA to Next.js:

> **In React SPA:** one HTML file, JavaScript runs in the browser, routes are JavaScript state.
> **In Next.js App Router:** every folder with a `page.tsx` is a real URL. The server handles the route. The HTML can be generated on the server before any JS runs.

### Step 2 — Create the Project

```bash
npx create-next-app@latest my-nextjs-app
```

When prompted, select:
- TypeScript: **Yes**
- ESLint: Yes
- Tailwind CSS: **Yes**
- `src/` directory: **Yes**
- App Router: **Yes**
- Import alias: Yes (default `@/*`)

```bash
cd my-nextjs-app
npm run dev
```

Open `http://localhost:3000`. You should see the Next.js welcome page.

### Step 3 — Understand Every Generated File

Before writing any code, read what was generated:

```
my-nextjs-app/
  src/
    app/
      layout.tsx       ← Root layout — wraps EVERY page
      page.tsx         ← The / route
      globals.css      ← Global styles + Tailwind directives
  public/              ← Static files (images, fonts, favicons)
  next.config.ts       ← Next.js configuration
  tailwind.config.ts   ← Tailwind configuration
  tsconfig.json        ← TypeScript configuration
```

Open each file and read it. Nothing is magic — it's just files.

### Step 4 — Understand the Special File Names

Next.js App Router uses **reserved filenames** inside route folders:

| File | Purpose |
|------|---------|
| `page.tsx` | The page component — makes the folder a URL |
| `layout.tsx` | Wraps all pages in this folder and below |
| `loading.tsx` | Shown while the page is loading (Suspense boundary) |
| `error.tsx` | Shown when the page throws (must be a Client Component) |
| `not-found.tsx` | Shown when `notFound()` is called |

---

## Midday (11:20 AM – 1:30 PM) — Build 3 Pages + Special Files

### Step 1 — Clear the Default Home Page

Replace `src/app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-900">Welcome</h1>
      <p className="mt-4 text-gray-600">This is the home page.</p>
      <nav className="mt-8 flex gap-4">
        <a href="/about" className="text-blue-600 hover:underline">About</a>
        <a href="/blog" className="text-blue-600 hover:underline">Blog</a>
      </nav>
    </main>
  )
}
```

### Step 2 — Update the Root Layout

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'Learning Next.js App Router',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <header className="border-b border-gray-200 px-8 py-4">
          <nav className="flex gap-6 text-sm font-medium">
            <a href="/" className="hover:text-blue-600">Home</a>
            <a href="/about" className="hover:text-blue-600">About</a>
            <a href="/blog" className="hover:text-blue-600">Blog</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
```

**Key fact:** `layout.tsx` does NOT re-render between page navigations. Only `{children}` changes. That is why layouts are ideal for headers and navigation.

### Step 3 — Create the About Page

Create `src/app/about/page.tsx`:

```tsx
export default function AboutPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">About</h1>
      <p className="mt-4 text-gray-600 max-w-prose">
        This page was rendered on the server. Every React component in Next.js
        App Router is a Server Component by default — no JavaScript is sent to
        the browser for this page unless you add 'use client'.
      </p>
    </main>
  )
}
```

### Step 4 — Create the Blog Page with Loading + Error States

Create `src/app/blog/page.tsx`, `loading.tsx`, and `error.tsx`.

**page.tsx** — async Server Component with simulated delay:
```tsx
async function getPosts() {
  await new Promise(resolve => setTimeout(resolve, 1500))
  return [
    { id: 1, title: 'Getting Started with Next.js', date: '2026-04-01' },
    { id: 2, title: 'Understanding Server Components', date: '2026-04-05' },
    { id: 3, title: 'App Router vs Pages Router', date: '2026-04-09' },
  ]
}

export default async function BlogPage() {
  const posts = await getPosts()
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id} className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{post.date}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

**loading.tsx** — skeleton shown while the async page resolves:
```tsx
export default function BlogLoading() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
          </div>
        ))}
      </div>
    </main>
  )
}
```

**error.tsx** — must be `'use client'`:
```tsx
'use client'

export default function BlogError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
      <p className="mt-2 text-gray-600">{error.message}</p>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Try again
      </button>
    </main>
  )
}
```

Navigate to `/blog`. You should see the loading skeleton for ~1.5 seconds, then the posts appear. `loading.tsx` automatically wraps the page in a `<Suspense>` boundary — Next.js streams the loading UI first while the async component resolves on the server.

### Step 5 — Exercise 28

Open `exercises/28-blog-rendering.jsx` and work through it. This exercise shows SSR, SSG, and CSR side by side so the difference stops being abstract.

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-55-dsa.js` in this folder.

---

## Key Concepts to Lock In Today

| Concept | What it means |
|---------|--------------|
| `page.tsx` | Makes the folder a real URL |
| `layout.tsx` | Wraps pages — does NOT re-render on navigation |
| `loading.tsx` | Auto Suspense boundary — streams while page resolves |
| `error.tsx` | Auto error boundary — must be `'use client'` |
| Server Component | Default in App Router — runs on server, zero JS in browser |
| `async` page | Allowed on Server Components — await data directly |

**The URL = the folder:**
- `src/app/page.tsx` → `/`
- `src/app/about/page.tsx` → `/about`
- `src/app/blog/[slug]/page.tsx` → `/blog/anything`

---

## End of Day Checklist

- [ ] Read `cheatsheets/advanced/01-nextjs.md` fully
- [ ] Created Next.js project: TypeScript YES, Tailwind YES, App Router YES, src directory YES
- [ ] `npm run dev` — site loads at `localhost:3000`
- [ ] Read all generated files — understand what each does
- [ ] Home page (`/`) renders with nav links to /about and /blog
- [ ] About page (`/about`) renders
- [ ] Blog page (`/blog`): loading skeleton appears ~1.5 seconds, then posts render
- [ ] `error.tsx` created — understand why it requires `'use client'`
- [ ] Completed exercise `28-blog-rendering.jsx`
- [ ] Completed 3 DSA problems in `day-55-dsa.js`

---

*The mental shift from SPA to Next.js is the biggest jump of this curriculum. Everything else builds on today's foundation.*
