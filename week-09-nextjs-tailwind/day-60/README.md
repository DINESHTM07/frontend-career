# Day 60 — Project 3: Build Day 2 — Core Features

**Status:** 📋 READY TO START
**Week:** 9 | **Theme:** Next.js + Tailwind

---

## Today's Goal

This is the main build day for Project 3. The shell is done — today you build the features that make it an actual app. Work from your study notes. Refer back to the complete version only when genuinely stuck.

By end of today:
- At least 3 core features of the complete version are implemented
- All data flows correctly (Server Components fetch data, Client Components handle interaction)
- API routes are working if the app has them
- App looks polished with Shadcn components

---

## Before You Start

Look at your notes from yesterday's study session. Prioritize features in this order:

1. **Data layer first** — get the data shapes right (TypeScript interfaces + mock data or API)
2. **Server Component pages** — pages that just display data, no interaction
3. **Interactive features** — search, filters, forms, dialogs (Client Components)
4. **Nice-to-have polish** — loading states, empty states, error states

Do not spend time on polish until the core features work.

---

## Morning (8:00 – 11:00 AM) — Data Layer + Core Pages

### Step 1 — Define Your Types

Before writing any components, define your TypeScript interfaces in `src/types/index.ts`:

```ts
// Example — adapt to your actual project
export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  tags: string[]
  status: 'published' | 'draft'
  viewCount: number
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  avatarUrl?: string
}
```

Get the types right first. TypeScript will catch mismatches as you build.

### Step 2 — Create Your Mock Data or API Routes

If your project uses mock data, create it in `src/data/mockData.ts` with proper types:

```ts
import type { Post } from '@/types'

export const posts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    slug: 'getting-started-nextjs',
    excerpt: 'Learn the fundamentals of Next.js App Router.',
    content: 'Full content here...',
    author: 'Dinesh S',
    publishedAt: '2026-04-01',
    tags: ['nextjs', 'react', 'typescript'],
    status: 'published',
    viewCount: 142,
  },
  // Add more...
]
```

If your project uses API routes, build them now:

```ts
// src/app/api/[resource]/route.ts
import { NextResponse } from 'next/server'
import { posts } from '@/data/mockData'

export async function GET() {
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const body = await request.json()
  // Validate + create
  return NextResponse.json(newItem, { status: 201 })
}
```

### Step 3 — Build the Main Data Pages

Build the most important pages of your project — the ones that display the core data. These should be Server Components:

```tsx
// Example: a content list page
import { posts } from '@/data/mockData'
import PostCard from '@/components/PostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Posts' }

export default async function PostsPage() {
  // In a real app: fetch from your API or database
  const publishedPosts = posts.filter(p => p.status === 'published')

  return (
    <div className="container py-8 px-4 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Posts</h1>
      {publishedPosts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## Midday (11:20 AM – 1:30 PM) — Interactive Features

### Search and Filter (Client Component Pattern)

If your app has search or filtering, the pattern is:

```tsx
// src/components/PostsFilter.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Post } from '@/types'
import PostCard from './PostCard'

interface PostsFilterProps {
  posts: Post[]
}

export default function PostsFilter({ posts }: PostsFilterProps) {
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)))

  const filtered = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchesTag = !selectedTag || post.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedTag === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTag(null)}
        >
          All
        </Button>
        {allTags.map(tag => (
          <Button
            key={tag}
            variant={selectedTag === tag ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {filtered.length} of {posts.length} posts
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
```

The Server Component (`PostsPage`) fetches data and passes it as props to the Client Component (`PostsFilter`). The filter state lives in the Client Component. This is the correct pattern.

### Dynamic Routes

If your project has detail pages (e.g., `/posts/[slug]`):

```tsx
// src/app/posts/[slug]/page.tsx
import { posts } from '@/data/mockData'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = posts.find(p => p.slug === params.slug)
  if (!post) return { title: 'Not Found' }
  return { title: post.title, description: post.excerpt }
}

export default function PostDetailPage({ params }: Props) {
  const post = posts.find(p => p.slug === params.slug)
  if (!post) notFound()

  return (
    <article className="container max-w-3xl py-8 px-4 mx-auto">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-muted-foreground mb-8">{post.publishedAt} · {post.author}</p>
      <div className="prose dark:prose-invert">
        {post.content}
      </div>
    </article>
  )
}
```

### Keep Referring to Your Study Notes

You wrote down the most impressive features yesterday. Build them now. When you hit a design decision, ask yourself: "What did the complete version do here?" — but don't open the file unless you're genuinely stuck.

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-60-dsa.js` in this folder.

---

## End of Day Progress Check

The goal is to be 70–80% done with the complete version's features by end of today. Day 61 is for final 20% + deploy + portfolio.

- [ ] TypeScript interfaces defined in `src/types/index.ts`
- [ ] Mock data or API routes working — data flows into pages
- [ ] Main list/index page renders data correctly
- [ ] Detail/single-item page works (dynamic route)
- [ ] At least one interactive Client Component (search, filter, or form)
- [ ] Dark mode looks correct on all built pages
- [ ] `npm run build` — zero TypeScript errors
- [ ] Completed 3 DSA problems in `day-60-dsa.js`

---

*This is the hardest day of Week 9. The shell is done, the data is set up, and now you're building the actual features. Push through. Tomorrow is deploy day.*
