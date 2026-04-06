# Next.js 14 Complete Starter

A fully-featured, production-ready Next.js 14 application with everything wired up and commented.

## What's included

| Feature | Tech | Status |
|---|---|---|
| App Router + Server Components | Next.js 14 | Ready |
| Component Library | Shadcn/UI | Ready |
| Authentication | NextAuth.js + Google OAuth | Config ready |
| Database | Supabase (PostgreSQL) | Config ready |
| Dark Mode | next-themes | Ready |
| Toast Notifications | Sonner | Ready |
| SEO + OpenGraph | Next.js Metadata API | Ready |
| Image Optimization | next/image | Ready |
| Protected Routes | Edge Middleware | Ready |
| API Routes | Route Handlers | Ready |
| TypeScript | Strict mode | Ready |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your values
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Where to get it |
|---|---|
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` in dev |
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | Same as above |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same as above |
| `SUPABASE_SERVICE_ROLE_KEY` | Same as above (keep secret!) |

### Google OAuth Setup
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret to `.env.local`

### Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy the Project URL and anon key to `.env.local`

## Project Structure

```
app/
├── layout.tsx              # Root layout (providers, navbar, footer)
├── page.tsx                # Home page (Server Component)
├── loading.tsx             # Root loading UI (Suspense boundary)
├── error.tsx               # Root error boundary (Client Component)
├── not-found.tsx           # 404 page
├── about/                  # Static about page
├── blog/                   # Blog index (SSR with searchParams)
│   └── [slug]/             # Dynamic blog post page (SSG + ISR)
├── dashboard/              # Protected dashboard (auth required)
└── api/
    ├── auth/[...nextauth]/ # NextAuth route handler
    └── posts/              # REST API: GET, POST, PATCH, DELETE
        └── [id]/

components/
├── ui/                     # Shadcn/UI components (Button, Card, Dialog...)
├── layout/                 # Navbar, Footer
├── home/                   # HeroSection, FeaturesGrid
├── blog/                   # BlogList, BlogSearch, PostActions
├── dashboard/              # PostsTable, CreatePostDialog
├── theme/                  # ThemeToggle
└── providers.tsx           # ThemeProvider + SessionProvider wrapper

lib/
├── auth.ts                 # NextAuth options (Google provider config)
├── supabase.ts             # Supabase browser + server clients
├── data.ts                 # Data access layer (mock → swap with Supabase)
└── utils.ts                # cn(), slugify(), formatRelativeTime()

types/
├── index.ts                # Domain types (Post, Author, etc.)
└── database.ts             # Supabase generated types (placeholder)

middleware.ts               # Edge middleware (auth protection)
```

## Key Patterns

### Server vs Client Components

```tsx
// Server Component (default) — runs on server, can fetch data
export default async function Page() {
  const data = await fetchData(); // direct async/await, no useEffect
  return <div>{data.title}</div>;
}

// Client Component — add "use client" at the top
"use client";
export default function Interactive() {
  const [count, setCount] = useState(0); // can use hooks
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Data Fetching

```tsx
// In a Server Component — fetch at the top level
export default async function BlogPage() {
  const posts = await getAllPosts({}); // runs server-side
  return <BlogList posts={posts} />;   // pre-rendered HTML
}

// In a Client Component — use SWR or React Query
"use client";
const { data } = useSWR("/api/posts", fetcher);
```

### Protected Routes

Routes under `/dashboard` are protected by `middleware.ts`.
Unauthenticated users are redirected to the NextAuth sign-in page.

```ts
// middleware.ts
export default withAuth(fn, {
  callbacks: {
    authorized({ token }) {
      return !!token; // require JWT
    }
  }
});
```

### Toast Notifications

```tsx
import { toast } from "sonner";

toast.success("Saved!");
toast.error("Failed to save");
toast.promise(save(), {
  loading: "Saving...",
  success: "Saved!",
  error: "Failed",
});
```

## Replacing Mock Data with Supabase

1. Run `npm install @supabase/supabase-js`
2. Set Supabase env vars in `.env.local`
3. Create tables in Supabase Dashboard (posts, authors)
4. Generate types: `npx supabase gen types typescript --project-id <ref> > types/database.ts`
5. Replace functions in `lib/data.ts` with Supabase queries (see TODO comments)

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run type-check   # TypeScript type checking (no emit)
```
