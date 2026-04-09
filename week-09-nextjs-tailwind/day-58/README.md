# Day 58 — SEO with Metadata API + Image Optimization + Dark Mode with next-themes

**Status:** 📋 READY TO START
**Week:** 9 | **Theme:** Next.js + Tailwind

---

## Today's Goal

Polish the app with three production-ready features: proper SEO metadata, optimized images, and dark mode. By end of today your app is recruiter-ready — fast, accessible, and properly configured for search engines.

By end of today:
- Every page has proper `<title>` and `<meta description>`
- Dynamic pages generate metadata from their data
- `next/image` used correctly — images are optimized automatically
- Dark mode works via `next-themes` and Shadcn's CSS variables

---

## Morning (8:00 – 11:00 AM) — Metadata API + Image Optimization

### Part 1 — The Metadata API

Next.js App Router provides a typed `Metadata` API. You export a `metadata` object or a `generateMetadata` function from any `page.tsx` or `layout.tsx`.

**Static metadata — export an object:**
```tsx
// src/app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about our team and mission.',
  openGraph: {
    title: 'About Us',
    description: 'Learn about our team and mission.',
    type: 'website',
  },
}

export default function AboutPage() {
  return <main>...</main>
}
```

**Dynamic metadata — export a function:**

For pages where the title depends on data (like a blog post page), use `generateMetadata`:

```tsx
// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

// This runs on the server before the page renders
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In a real app: fetch post data by slug
  const post = { title: 'My Blog Post', description: 'A great post about things.' }

  return {
    title: `${post.title} | My Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  return (
    <main className="p-8">
      <h1>Post: {params.slug}</h1>
    </main>
  )
}
```

**Template titles with the root layout:**

Instead of repeating your site name in every page title, use a template:

```tsx
// src/app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: '%s | My Next.js App',   // %s = the page's title
    default: 'My Next.js App',          // fallback when no page title
  },
  description: 'Learning Next.js App Router',
}
```

Now each page only needs to set `title: 'About'` — the root layout automatically appends `| My Next.js App`.

**Add metadata to all 3 of your pages now.**

### Part 2 — next/image

Never use a plain `<img>` tag in Next.js. Use `next/image` instead:

```tsx
import Image from 'next/image'

// Local image — TypeScript import gives you width/height automatically
import heroImage from '@/public/hero.jpg'
<Image src={heroImage} alt="Hero image" />

// Remote image — must specify width + height
<Image
  src="https://images.unsplash.com/photo-xxx"
  alt="A photo"
  width={800}
  height={600}
  className="rounded-xl"
/>

// Fill container — parent must have position: relative and explicit size
<div className="relative h-64 w-full">
  <Image
    src="/hero.jpg"
    alt="Hero"
    fill
    className="object-cover rounded-xl"
  />
</div>
```

**What `next/image` does automatically:**
- Converts images to WebP (30-80% smaller than JPEG/PNG)
- Generates responsive `srcset` for different screen sizes
- Lazy loads by default (`loading="lazy"`)
- Prevents layout shift (reserves space before image loads)

**To use remote images**, add the domain to `next.config.ts`:
```ts
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}
```

**Exercise:** Add a hero image to the home page using `next/image`. Download any image from Unsplash, save it to `public/`, and use it with the `fill` variant inside a positioned container.

---

## Midday (11:20 AM – 1:30 PM) — Dark Mode with next-themes

### Step 1 — Install next-themes

```bash
npm install next-themes
```

### Step 2 — Wrap the App in ThemeProvider

The `ThemeProvider` must be a Client Component. Create a wrapper:

```tsx
// src/components/ThemeProvider.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"      // adds 'dark' class to <html>
      defaultTheme="system"  // respects OS preference
      enableSystem
    >
      {children}
    </NextThemesProvider>
  )
}
```

Wrap the app in `src/app/layout.tsx`:
```tsx
import { ThemeProvider } from '@/components/ThemeProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Important:** `suppressHydrationWarning` on `<html>` prevents a React warning when `next-themes` adds the `dark` class — the server doesn't know the user's theme preference yet.

### Step 3 — Build a Theme Toggle Button

```tsx
// src/components/ThemeToggle.tsx
'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — only render after client mount
  useEffect(() => setMounted(true), [])

  if (!mounted) return <Button variant="ghost" size="icon" disabled>...</Button>

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </Button>
  )
}
```

**Why the `mounted` check?** The server renders with one theme, the client may have a different theme stored in localStorage. Without this guard, you get a hydration mismatch error.

### Step 4 — Add ThemeToggle to the Layout Header

```tsx
// In layout.tsx header:
import { ThemeToggle } from '@/components/ThemeToggle'

<header className="border-b px-8 py-4 flex items-center justify-between">
  <nav className="flex gap-6 text-sm font-medium">...</nav>
  <ThemeToggle />
</header>
```

### Step 5 — Why Dark Mode Works Automatically with Shadcn

Shadcn/UI uses CSS variables that are defined in `globals.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ...more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ...inverted variables */
}
```

When `next-themes` adds `class="dark"` to `<html>`, the `.dark` CSS variables activate, and all Shadcn components switch colors automatically — no conditional classes needed.

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-58-dsa.js` in this folder.

---

## End of Day Checklist

**Metadata:**
- [ ] Root layout has `title` with `template` and `default`
- [ ] Home, About, and Blog pages all have static `metadata` exports
- [ ] Blog post page has `generateMetadata` that generates dynamic title
- [ ] View page source on `/about` — `<title>` tag shows in HTML

**Images:**
- [ ] Hero image added to home page using `next/image`
- [ ] Image uses `fill` layout inside a positioned container
- [ ] Remote image domain added to `next.config.ts` (if using remote)

**Dark Mode:**
- [ ] `next-themes` installed
- [ ] `ThemeProvider` created as Client Component
- [ ] Root layout wrapped in `ThemeProvider`
- [ ] `ThemeToggle` button added to header
- [ ] Clicking toggle switches light/dark mode
- [ ] Theme persists on page refresh
- [ ] System preference respected on first visit (try changing OS dark mode)
- [ ] No hydration mismatch errors in console
- [ ] Shadcn components look correct in both light and dark mode

**DSA:**
- [ ] Completed 3 DSA problems in `day-58-dsa.js`

---

*Metadata + images + dark mode are the three things that separate "I built an app" from "I built a production app."*
