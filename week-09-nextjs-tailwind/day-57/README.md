# Day 57 — Shadcn/UI Setup + Beautiful UI Components

**Status:** 📋 READY TO START
**Week:** 9 | **Theme:** Next.js + Tailwind

---

## Today's Goal

Set up Shadcn/UI and learn to use a professional component library the right way — by copying components into your project, not importing a black-box npm package. By end of today your app has a polished look with proper accessible components.

By end of today:
- Shadcn/UI initialized in your Next.js project
- At least 6 Shadcn components used: Button, Card, Input, Badge, Dialog, Table
- A working page that looks genuinely professional
- You understand: Shadcn is "copy-paste" components you own, not a dependency

---

## Morning (8:00 – 11:00 AM) — Shadcn/UI Setup

### What Shadcn/UI Is (and Isn't)

Shadcn/UI is NOT a component library in the traditional sense. You don't install it as a dependency and import from a package. Instead, you run a CLI that **copies the component source code into your project**. You own the code. You can modify it however you want.

Under the hood, Shadcn components are built on:
- **Radix UI** — accessible, unstyled primitives (handles keyboard navigation, ARIA, focus management)
- **Tailwind CSS** — all styling via utility classes
- **cva** (class-variance-authority) — manages variant styling

### Step 1 — Initialize Shadcn/UI

In your `my-nextjs-app` project:

```bash
npx shadcn@latest init
```

When prompted:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

This creates:
- `src/components/ui/` — where all Shadcn components will be added
- `src/lib/utils.ts` — the `cn()` utility (merges Tailwind classes)
- Updates `tailwind.config.ts` and `globals.css` with CSS variables for theming

### Step 2 — Understand `cn()`

Every Shadcn component uses `cn()` for class merging:

```ts
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

This solves a Tailwind problem: if you write `className="text-red-500 text-blue-500"`, Tailwind doesn't know which wins — both classes are in the output. `twMerge` deduplicates conflicting classes so the last one always wins. Use `cn()` whenever you merge class strings.

### Step 3 — Add Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add table
```

After each command, open the generated file in `src/components/ui/`. Read the source. You OWN this code — understand what it does.

---

## Midday (11:20 AM – 1:30 PM) — Build a Page with Shadcn Components

Build a polished `/components-demo` page that showcases each component you added. This is your proof-of-work for the day.

### Example: Posts Dashboard Page

Create `src/app/components-demo/page.tsx`:

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import AddPostDialog from '@/components/AddPostDialog'

const posts = [
  { id: 1, title: 'Getting Started with Next.js', status: 'published', views: 142 },
  { id: 2, title: 'Understanding Server Components', status: 'draft', views: 0 },
  { id: 3, title: 'App Router vs Pages Router', status: 'published', views: 203 },
]

export default function ComponentsDemoPage() {
  return (
    <main className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Posts Dashboard</h1>
        <AddPostDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Posts</CardDescription>
            <CardTitle className="text-4xl">3</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Views</CardDescription>
            <CardTitle className="text-4xl">345</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Drafts</CardDescription>
            <CardTitle className="text-4xl">1</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <Input placeholder="Search posts..." className="max-w-sm" />
        <Button variant="outline">Search</Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map(post => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{post.views}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
```

### AddPostDialog — Client Component with Dialog

```tsx
// src/components/AddPostDialog.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export default function AddPostDialog() {
  const [title, setTitle] = useState('')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Post</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Enter a title for your new blog post.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Post title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button disabled={!title.trim()}>Create Post</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Button Variants

Shadcn Button comes with built-in variants. Try all of them:

```tsx
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
```

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-57-dsa.js` in this folder.

---

## Key Concepts to Lock In Today

**Shadcn/UI model:**
- Not an npm package — it's code you copy into your project
- You own the components — read and modify them freely
- Built on Radix UI (accessibility) + Tailwind (styling)

**`cn()` utility:**
- Always use it when combining class strings
- `cn('text-red-500', someCondition && 'text-blue-500')` — blue wins if condition is true
- `cn('p-4', props.className)` — lets consumers override styles

**Where to add more components:**
- `npx shadcn@latest add [component-name]`
- Full list at `ui.shadcn.com/components`

---

## End of Day Checklist

- [ ] Ran `npx shadcn@latest init` — `src/components/ui/` created
- [ ] Read `src/lib/utils.ts` — understand what `cn()` does and why
- [ ] Added: Button, Card, Input, Badge, Dialog, Table
- [ ] Read the source of at least 2 added components — understand their structure
- [ ] Built `/components-demo` page using all 6 components
- [ ] Dialog opens and closes correctly (keyboard accessible — Esc closes it)
- [ ] Table renders with header, rows, and Badge status variants
- [ ] Tried multiple Button variants — they all render correctly
- [ ] Completed 3 DSA problems in `day-57-dsa.js`

---

*Shadcn changes how you think about component libraries. You no longer wait for a library to add a feature — you just edit the component yourself.*
