# Day 58 Tasks — SEO with Metadata API + Image Optimization + Dark Mode

## Morning Block (8:00 – 11:00 AM) — Metadata API + Images

### Metadata API
- [ ] Update `src/app/layout.tsx` — add `title` with `template: '%s | My Next.js App'` and `default`
- [ ] Update `src/app/page.tsx` — export `metadata` with `title: 'Home'` and `description`
- [ ] Update `src/app/about/page.tsx` — export `metadata` with `title: 'About'` and `description`
- [ ] Update `src/app/blog/page.tsx` — export `metadata` with `title: 'Blog'` and `description`
- [ ] Create `src/app/blog/[slug]/page.tsx` — dynamic route with `generateMetadata` function
- [ ] `generateMetadata` returns title that includes the slug: `'${slug} | Blog'`
- [ ] View page source on `/about` in browser — confirm `<title>About | My Next.js App</title>` in HTML
- [ ] View page source on `/` — confirm `<meta name="description" ...>` is present

### next/image
- [ ] Download any image (from Unsplash or any public domain source) — save to `public/hero.jpg`
- [ ] Add `next/image` hero section to home page
  - [ ] Use `fill` layout inside a `relative h-64 w-full` container
  - [ ] Add `className="object-cover"` to the Image
  - [ ] Add meaningful `alt` text
- [ ] Confirm: image loads, no console errors
- [ ] Open DevTools → Network → filter Images — confirm `.webp` format served
- [ ] (Optional) Add a remote image — add its hostname to `next.config.ts` `remotePatterns`

## Midday Block (11:20 AM – 1:30 PM) — Dark Mode with next-themes
- [ ] Run: `npm install next-themes`
- [ ] Create `src/components/ThemeProvider.tsx` — `'use client'`, wraps `NextThemesProvider` with `attribute="class"`
- [ ] Update `src/app/layout.tsx` — wrap `{children}` with `<ThemeProvider>`
- [ ] Add `suppressHydrationWarning` to `<html>` tag — write down why this is needed
- [ ] Create `src/components/ThemeToggle.tsx` — `'use client'`, uses `useTheme` hook
- [ ] `ThemeToggle` has `mounted` state check — renders nothing until client-side mounted
- [ ] `ThemeToggle` shows sun icon in dark mode, moon icon in light mode
- [ ] Add `<ThemeToggle />` to the layout header
- [ ] Test: click toggle — dark/light mode switches
- [ ] Test: refresh page — theme persists
- [ ] Test: change OS to dark mode — app respects it on first load
- [ ] Open DevTools → Elements — confirm `<html class="dark">` appears when dark mode is active
- [ ] Confirm: zero hydration mismatch warnings in console
- [ ] Confirm: all Shadcn components look correct in dark mode

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-58-dsa.js` in `week-09-nextjs-tailwind/day-58/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Run: `git add . && git commit -m "Day 58: Metadata API + next/image + next-themes dark mode + DSA"`
