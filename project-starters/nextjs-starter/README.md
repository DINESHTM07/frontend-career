# Next.js 14 Starter

A stubbed-out Next.js 14 starter. All config is working — your job is to fill in the components and pages.

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in your keys when needed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see placeholder pages with TODO markers.

## What's already wired up

| File | Status | Notes |
|---|---|---|
| `next.config.js` | Done | Image domains, server packages |
| `tailwind.config.ts` | Done | Shadcn/UI CSS variables |
| `app/globals.css` | Done | Light + dark CSS variables |
| `app/layout.tsx` | Done | Providers, Navbar, Footer, Toaster |
| `middleware.ts` | Done | Auth protection for /dashboard |
| `lib/auth.ts` | Done | NextAuth Google provider config |
| `lib/supabase.ts` | Done | Browser + server clients |
| `lib/utils.ts` | Done | cn(), slugify(), formatRelativeTime() |
| `types/index.ts` | Done | Post, Author types |
| `components/ui/*` | Done | All Shadcn/UI components |
| `components/providers.tsx` | Done | ThemeProvider + SessionProvider |
| `app/api/auth/[...nextauth]/route.ts` | Done | NextAuth route handler |

## What you'll build (with TODO comments)

| File | Day | What to build |
|---|---|---|
| `lib/data.ts` | 1 | Mock post data + query functions |
| `components/layout/Navbar.tsx` | 1 | Nav links, auth button, mobile sheet |
| `components/layout/Footer.tsx` | 1 | Link groups, copyright |
| `components/home/HeroSection.tsx` | 1 | Badge, headline, CTAs, copy button |
| `components/home/FeaturesGrid.tsx` | 1 | Icon + title + description cards |
| `app/page.tsx` | 1 | Hero + features + latest posts |
| `app/about/page.tsx` | 1 | Tech stack + team cards |
| `components/blog/BlogList.tsx` | 1 | Post card grid with next/image |
| `components/blog/BlogSearch.tsx` | 1 | URL-driven search + category pills |
| `app/blog/page.tsx` | 1 | Wire BlogSearch + BlogList |
| `app/blog/[slug]/page.tsx` | 1 | Post detail with cover image |
| `components/blog/PostActions.tsx` | 1 | Like + save + share dropdown |
| `components/theme/ThemeToggle.tsx` | 6 | Cycle light/dark/system |
| `app/dashboard/page.tsx` | 2 | Session, stats, table |
| `components/dashboard/PostsTable.tsx` | 4 | Table with optimistic delete |
| `components/dashboard/CreatePostDialog.tsx` | 4 | Form → POST /api/posts |
| `app/api/posts/route.ts` | 4 | GET + POST handlers |
| `app/api/posts/[id]/route.ts` | 4 | GET + PATCH + DELETE handlers |

## Project Structure

```
app/
├── layout.tsx              # Root layout (DONE — wires everything together)
├── page.tsx                # Home page (STUB)
├── loading.tsx / error.tsx # Suspense + error boundary (minimal stubs)
├── not-found.tsx           # 404 page (STUB)
├── about/                  # Static about page (STUB)
├── blog/                   # Blog index + [slug] post page (STUBS)
├── dashboard/              # Protected dashboard (STUB)
└── api/
    ├── auth/[...nextauth]/ # NextAuth (DONE)
    └── posts/              # REST API (STUBS)

components/
├── ui/          # Shadcn/UI components — Button, Card, Dialog, etc. (DONE)
├── layout/      # Navbar, Footer (STUBS)
├── home/        # HeroSection, FeaturesGrid (STUBS)
├── blog/        # BlogList, BlogSearch, PostActions (STUBS)
├── dashboard/   # PostsTable, CreatePostDialog (STUBS)
├── theme/       # ThemeToggle (STUB)
└── providers.tsx # ThemeProvider + SessionProvider (DONE)

lib/
├── auth.ts      # NextAuth options (DONE — fill in env vars)
├── supabase.ts  # Supabase clients (DONE — fill in env vars)
├── data.ts      # Data functions (STUB — implement first!)
└── utils.ts     # cn(), slugify(), etc. (DONE)
```

## Environment Variables

```bash
cp .env.example .env.local
```

Required to unlock authentication (Day 2):
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000`
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

Required to unlock the database (Day 3):
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — [Supabase Dashboard](https://supabase.com)

## Day 1 Starting Point

The app runs but shows placeholder boxes. Start here:

1. Open `lib/data.ts` — implement `getAllPosts()` with mock data
2. Open `app/page.tsx` — import `getLatestPosts` and render the posts
3. Build `components/layout/Navbar.tsx` so navigation works
4. Build `components/blog/BlogList.tsx` and wire it up to `/blog`

Check the `nextjs-complete` folder if you need a reference implementation.
