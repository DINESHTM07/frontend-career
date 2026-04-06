# 7-Day Build Guide — Next.js 14 Complete Starter

Work through these tasks in order. Each day builds on the previous one.
Check off tasks as you complete them.

---

## Day 1 — Setup & Understand the Codebase

**Goal:** Get the app running locally and understand the file structure.

- [ ] Run `npm install` and `npm run dev`
- [ ] Copy `.env.example` to `.env.local` (app starts without real values)
- [ ] Open the app at http://localhost:3000 — browse Home, Blog, About
- [ ] Open `app/layout.tsx` — trace how Providers, Navbar, Footer connect
- [ ] Open `app/page.tsx` — notice it's `async`, no `"use client"` → Server Component
- [ ] Open `components/home/HeroSection.tsx` — notice `"use client"` → Client Component
- [ ] Find where `useSession()` is called — understand why that file needs `"use client"`
- [ ] Toggle dark mode with the icon in the navbar — trace it to `ThemeToggle.tsx`
- [ ] Read `lib/data.ts` — understand the mock data structure
- [ ] **Mini-challenge:** Add a 7th mock post to `lib/data.ts` and see it appear on the blog

**Key concepts:** Server Components, Client Components, `"use client"`, `async/await` in pages

---

## Day 2 — Authentication

**Goal:** Wire up real Google OAuth so you can sign in.

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- [ ] Create an OAuth 2.0 Client ID (Web application type)
- [ ] Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- [ ] Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` to `.env.local`
- [ ] Restart the dev server — click "Sign in" in the navbar
- [ ] After sign-in, visit `/dashboard` — you should see your Google profile
- [ ] Read `lib/auth.ts` — trace the `jwt` and `session` callbacks
- [ ] Read `middleware.ts` — understand how `/dashboard` is protected
- [ ] **Challenge:** Add a GitHub provider (install `next-auth` already includes it — just configure)
- [ ] **Stretch:** Create `app/auth/signin/page.tsx` — a custom sign-in page with a Google button

**Key concepts:** NextAuth.js, OAuth 2.0, JWT sessions, middleware protection

---

## Day 3 — Connect Supabase

**Goal:** Replace mock data with real database queries.

- [ ] Create a Supabase project at https://supabase.com (free tier)
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
- [ ] In the Supabase SQL editor, create the `posts` table:
  ```sql
  create table posts (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text not null unique,
    excerpt text,
    content text,
    category text,
    tags text[] default '{}',
    cover_image text,
    author_id uuid references auth.users(id),
    published boolean default false,
    published_at timestamptz,
    reading_time int default 5,
    likes int default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );
  ```
- [ ] Insert the 6 mock posts as real rows via the Supabase table editor
- [ ] Generate types: `npx supabase gen types typescript --project-id <ref> > types/database.ts`
- [ ] Replace `getAllPosts()` in `lib/data.ts` with a real Supabase query (see TODO comment)
- [ ] **Challenge:** Enable Row Level Security (RLS) — add a policy: "anyone can read published posts"
- [ ] **Stretch:** Replace `getPostBySlug()` with Supabase too

**Key concepts:** Supabase, PostgreSQL, Row Level Security, type generation

---

## Day 4 — API Routes & Forms

**Goal:** Make the Create Post form actually persist to the database.

- [ ] Sign in and go to `/dashboard`
- [ ] Click "New Post" — fill in the form and submit
- [ ] Open Network tab — watch the `POST /api/posts` request
- [ ] Read `app/api/posts/route.ts` — understand the Zod validation
- [ ] Update the `POST` handler to insert into Supabase (see TODO comment)
- [ ] Test creating a post — verify it appears in the Supabase table editor
- [ ] Implement the `PATCH /api/posts/:id` handler with a real Supabase update
- [ ] Implement the `DELETE /api/posts/:id` handler — test with the trash icon in the table
- [ ] **Challenge:** Add a `published` toggle — only published posts appear on the blog
- [ ] **Stretch:** Add optimistic UI to the table (it already has optimistic delete — extend it)

**Key concepts:** Route Handlers, Zod validation, REST API, optimistic UI

---

## Day 5 — SEO & Performance

**Goal:** Understand and improve how the app handles SEO and performance.

- [ ] Open `app/blog/[slug]/page.tsx` — read `generateMetadata()`
- [ ] Visit a blog post and inspect the `<head>` — verify title, description, OG tags
- [ ] Test a URL in [opengraph.xyz](https://opengraph.xyz) (use ngrok to expose localhost)
- [ ] Add `generateStaticParams()` to pre-render all blog posts at build time (already there — read it)
- [ ] Run `npm run build` — observe the output (S = static, SSG, ISR, λ = server)
- [ ] Find all `next/image` usages — understand `fill`, `priority`, `sizes` props
- [ ] Add `export const revalidate = 3600;` to the blog index page — understand ISR
- [ ] Open Chrome DevTools → Lighthouse → run an audit on the home page
- [ ] Fix any Lighthouse warnings (image sizing, color contrast, etc.)
- [ ] **Challenge:** Create a `/sitemap.xml` route: `app/sitemap.ts` using Next.js Metadata API
- [ ] **Stretch:** Add `app/robots.ts` for a programmatic robots.txt

**Key concepts:** Metadata API, generateMetadata, ISR, next/image, Core Web Vitals

---

## Day 6 — Dark Mode & Polish

**Goal:** Deep-dive dark mode, make the UI pixel-perfect.

- [ ] Read `app/globals.css` — understand the CSS variable system (`:root` vs `.dark`)
- [ ] Read `tailwind.config.ts` — trace how CSS vars map to Tailwind tokens
- [ ] Open `ThemeToggle.tsx` — understand why `mounted` state prevents hydration mismatch
- [ ] Customize the color palette: change `--primary` in `globals.css` (e.g. a blue or green)
- [ ] Verify every page looks correct in both light and dark mode
- [ ] Add a `featured` badge to the most-liked post on the blog page
- [ ] Improve the blog post page typography (Tailwind typography plugin: `prose` classes)
- [ ] Add smooth hover transitions to all interactive elements
- [ ] Add a "Back to top" button that appears when scrolled down (Client Component)
- [ ] **Challenge:** Build an `app/tags/[tag]/page.tsx` page that filters posts by tag
- [ ] **Stretch:** Add animated page transitions using `framer-motion`

**Key concepts:** CSS custom properties, Tailwind dark mode, hydration, animations

---

## Day 7 — Ship It

**Goal:** Deploy to production and monitor it.

- [ ] Push your code to GitHub (make sure `.env.local` is in `.gitignore`)
- [ ] Deploy to Vercel: `vercel deploy` or connect via the Vercel dashboard
- [ ] Set all environment variables in Vercel Project Settings → Environment Variables
- [ ] Update `NEXTAUTH_URL` to your production URL (e.g. `https://myapp.vercel.app`)
- [ ] Update Google OAuth redirect URI to production URL
- [ ] Run `npm run build` locally — fix any TypeScript or lint errors
- [ ] Test sign-in in production
- [ ] Enable Vercel Analytics in the dashboard (automatic Core Web Vitals)
- [ ] Test `/api/posts` in production with a REST client (Insomnia, HTTPie, etc.)
- [ ] Set up a Supabase production database (or use the same one with prod env vars)
- [ ] **Challenge:** Set up [Sentry](https://sentry.io) for error monitoring — add it to `app/error.tsx`
- [ ] **Stretch:** Add a CI/CD pipeline with GitHub Actions that runs `type-check` and `lint` on PRs

**Key concepts:** Vercel deployment, environment variables, production builds, monitoring

---

## Bonus Challenges

Once you've completed the 7-day plan, try these:

- **Comments:** Add a comments system to blog posts (Supabase table + real-time subscription)
- **Search:** Add full-text search using Supabase's `text_search` or Algolia
- **Image Upload:** Let users upload cover images to Supabase Storage
- **Email:** Send a welcome email on sign-up using Resend or Nodemailer
- **Admin:** Add an admin-only route that shows all users (check `session.user.role`)
- **i18n:** Add internationalization with `next-intl`
- **Tests:** Add Playwright end-to-end tests for sign-in flow and post creation
