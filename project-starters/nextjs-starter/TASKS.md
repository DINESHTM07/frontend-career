# 7-Day Build Guide — Next.js 14 Starter

Build the app from scratch, one feature at a time. Each TODO in the code maps to a task here.
Check off tasks as you complete them. Peek at `project-starters/nextjs-complete/` only if you're stuck.

---

## Day 1 — Pages, Layout & Data

**Goal:** Get real content rendering on every route.

### Step 1 — Implement mock data (start here)
- [ ] Open `lib/data.ts`
- [ ] Define a `mockPosts` array with 4–6 posts — each needs: id, title, slug, excerpt, content, category, tags, coverImage, author, publishedAt, readingTime, likes
- [ ] Implement `getAllPosts({ category?, query?, limit? })` — filter + sort the array
- [ ] Implement `getLatestPosts(count)` — calls getAllPosts with { limit: count }
- [ ] Implement `getPostBySlug(slug)` — finds by slug, returns null if not found
- [ ] Implement `getPostById(id)` — finds by id

### Step 2 — Navbar & Footer
- [ ] Open `components/layout/Navbar.tsx`
- [ ] Add `usePathname()` — highlight the active link with a different text color
- [ ] Add `useSession()` — show a "Sign in" button when logged out
- [ ] Add `<ThemeToggle />` in the right side
- [ ] (Stretch) Add a Sheet mobile menu with the same links

- [ ] Open `components/layout/Footer.tsx`
- [ ] Add a logo + tagline column
- [ ] Add two link groups: "Product" (Home, Blog, About, Dashboard) and "Resources" (Next.js docs, Shadcn/UI, Supabase)
- [ ] Add a bottom bar with `© {new Date().getFullYear()} NextJS App`

### Step 3 — Home Page
- [ ] Open `components/home/HeroSection.tsx`
- [ ] Add `useState` for `copied` (boolean)
- [ ] On the monospace command div: add `onClick` that calls `navigator.clipboard.writeText(...)` then `toast.success("Copied!")`
- [ ] Toggle between Copy and Check icon using the `copied` state (reset after 2s)
- [ ] Replace the placeholder h1 with a real headline that describes your app

- [ ] Open `components/home/FeaturesGrid.tsx`
- [ ] Replace the stub features array with 8 real features (one per key tech: Next.js, NextAuth, Supabase, Shadcn/UI, Dark Mode, SEO, TypeScript, Middleware)
- [ ] Each feature needs a unique Lucide icon

- [ ] Open `app/page.tsx`
- [ ] Make it `async`, import `getLatestPosts`
- [ ] Call `const latestPosts = await getLatestPosts(3)`
- [ ] Replace the placeholder divs with `<HeroSection />`, `<FeaturesGrid />`, and a posts grid

### Step 4 — Blog Pages
- [ ] Open `components/blog/BlogList.tsx`
- [ ] Add `import Image from "next/image"` — use `fill` for the cover image (parent needs `relative` + `aspect-video overflow-hidden`)
- [ ] Wrap each card title in a `<Link href={/blog/${post.slug}}>` 
- [ ] Add author avatar with `<Image width={24} height={24} className="rounded-full" />`
- [ ] Add like count with `<Heart className="h-3 w-3" />`

- [ ] Open `components/blog/BlogSearch.tsx`
- [ ] Add `useRouter`, `useSearchParams`, `useTransition`
- [ ] Implement `updateURL(category, query)` using `URLSearchParams` + `router.push()`
- [ ] Make the search form actually submit (call `updateURL` on submit)
- [ ] Make category pills clickable (call `updateURL` with selected category)
- [ ] Highlight the active category pill

- [ ] Open `app/blog/page.tsx`
- [ ] Import and call `getAllPosts({ category: searchParams.category, query: searchParams.q })`
- [ ] Replace the placeholders with `<BlogSearch />` and `<BlogList posts={posts} />`
- [ ] Add an empty state: "No posts found. Try a different search."

- [ ] Open `app/blog/[slug]/page.tsx`
- [ ] Import `getPostBySlug`, call it with `params.slug`, call `notFound()` if null
- [ ] Build the post layout: back button, category badge, title, excerpt, author + date + read time
- [ ] Add the cover image with `next/image` — `fill`, `priority`, `sizes` prop
- [ ] Add `dangerouslySetInnerHTML={{ __html: post.content }}` for the content
- [ ] Add `<PostActions post={post} />` at the bottom

### Step 5 — PostActions
- [ ] Open `components/blog/PostActions.tsx`
- [ ] Add `useState` for `liked`, `likeCount`, `saved`
- [ ] Like button: toggle state, update count ±1, `toast.success(...)`
- [ ] Save button: toggle state, `toast.success(...)`
- [ ] Share dropdown: "Copy link" + "Share on Twitter" (twitter intent URL)

**Check:** Visit `/` `/blog` `/blog/[any-slug]` `/about` — all should show real content now.

---

## Day 2 — Authentication

**Goal:** Sign in with Google and protect the dashboard.

- [ ] Get credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- [ ] Add redirect URI: `http://localhost:3000/api/auth/callback/google`
- [ ] Fill in `.env.local`: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL
- [ ] Restart dev server — click "Sign in" in the Navbar
- [ ] After sign-in, visit `/dashboard` — middleware should let you through
- [ ] Open `app/dashboard/page.tsx` — add `getServerSession(authOptions)` + redirect if null
- [ ] Show the user's name (from `session.user.name`) and avatar (`next/image` with `session.user.image`)

- [ ] Open `components/layout/Navbar.tsx`
- [ ] After sign-in: show the user avatar in a `<DropdownMenu>` with Dashboard link + Sign out option
- [ ] `signOut({ callbackUrl: "/" })` on sign-out click
- [ ] While loading (`status === "loading"`): show a skeleton div instead of the button

- [ ] **Stretch:** Create `app/auth/signin/page.tsx` — a custom sign-in page with a "Sign in with Google" button that calls `signIn("google")`

**Check:** Sign in → avatar appears in navbar. Visit `/dashboard` while signed out → redirects to sign-in.

---

## Day 3 — Connect Supabase

**Goal:** Real database instead of mock data.

- [ ] Create a Supabase project at [supabase.com](https://supabase.com)
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
- [ ] Create the `posts` table in Supabase SQL editor:
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
    author_id uuid,
    published boolean default true,
    published_at timestamptz default now(),
    reading_time int default 5,
    likes int default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );
  ```
- [ ] Insert your mock posts as real rows via the table editor
- [ ] Generate types: `npx supabase gen types typescript --project-id <your-ref> > types/database.ts`
- [ ] Replace `getAllPosts()` in `lib/data.ts` with a Supabase query:
  ```ts
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });
  ```
- [ ] Replace `getPostBySlug()` with: `.from("posts").select("*").eq("slug", slug).single()`
- [ ] Enable Row Level Security (RLS) — add a policy: "anyone can read published posts"

**Check:** Delete the mock array — the blog should still show posts from Supabase.

---

## Day 4 — API Routes & Forms

**Goal:** Create and delete posts through the UI.

- [ ] Open `app/api/posts/route.ts`
- [ ] Implement `GET`: read searchParams, call `getAllPosts`, return JSON
- [ ] Implement `POST`:
  - [ ] Check auth with `getServerSession(authOptions)` — return 401 if null
  - [ ] Parse + validate body (add zod schema for title, slug, excerpt, content, category)
  - [ ] Insert into Supabase — return 201 with the new post
  - [ ] Wrap in try/catch — return 500 on error

- [ ] Open `app/api/posts/[id]/route.ts`
- [ ] Implement `GET`: call `getPostById`, return 404 if null
- [ ] Implement `DELETE`: check auth, delete from Supabase, return 204
- [ ] Implement `PATCH`: check auth, update in Supabase, return updated post

- [ ] Open `components/dashboard/CreatePostDialog.tsx`
- [ ] Add state for `open`, `loading`, form fields
- [ ] Auto-generate slug with `slugify(title)` from `@/lib/utils`
- [ ] Implement `handleSubmit`: POST to `/api/posts`, show toast, close dialog on success
- [ ] Build the form: Input for title + slug + category, Textarea for excerpt + content
- [ ] Add `<Loader2 className="animate-spin" />` to the submit button while loading

- [ ] Open `components/dashboard/PostsTable.tsx`
- [ ] Switch from `initialPosts` prop to `useState` so deletes update the UI
- [ ] Implement `handleDelete(id, title)`:
  - [ ] Optimistic remove: `setPosts(prev => prev.filter(p => p.id !== id))`
  - [ ] `await fetch(\`/api/posts/${id}\`, { method: "DELETE" })`
  - [ ] Rollback on error + `toast.error(...)`

**Check:** Create a post from the dashboard → appears in Supabase. Delete one → gone from UI immediately.

---

## Day 5 — SEO & Performance

**Goal:** Every page has proper metadata and images are optimized.

- [ ] Open `app/blog/[slug]/page.tsx`
- [ ] Replace the static `metadata` with `generateMetadata({ params })`:
  ```ts
  export async function generateMetadata({ params }): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
    if (!post) return { title: "Post Not Found" };
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: { title: post.title, images: [{ url: post.coverImage }] },
    };
  }
  ```
- [ ] Add `generateStaticParams()` to pre-render all posts at build time

- [ ] Add `export const metadata: Metadata` with full OpenGraph to: home, blog index, about pages
- [ ] Check all `next/image` usages — make sure `sizes` prop is correct on fill images
- [ ] Add `priority` to the LCP image on the home page (hero image or first post cover)
- [ ] Add `export const revalidate = 60;` to the blog index page (ISR)
- [ ] Run `npm run build` — check the output symbols (○ static, ƒ dynamic, ◐ ISR)
- [ ] **Challenge:** Add `app/sitemap.ts`:
  ```ts
  export default async function sitemap() {
    const posts = await getAllPosts({});
    return posts.map(p => ({
      url: `https://your-domain.com/blog/${p.slug}`,
      lastModified: p.publishedAt,
    }));
  }
  ```

**Check:** Open a blog post URL in [opengraph.xyz](https://opengraph.xyz) — preview should show the post title + image.

---

## Day 6 — Dark Mode & Polish

**Goal:** Dark mode works perfectly, UI is polished.

- [ ] Open `components/theme/ThemeToggle.tsx`
- [ ] Import `useTheme` from `"next-themes"` and `useState`, `useEffect` from `"react"`
- [ ] Add `mounted` state to prevent hydration mismatch
- [ ] Cycle through light → dark → system on click
- [ ] Show Sun / Moon / Monitor icon based on current theme

- [ ] Read `app/globals.css` — understand the CSS variable system
- [ ] Customize the `--primary` color in `:root` and `.dark` — try a different hue
- [ ] Check every page in both light and dark mode — fix any contrast issues

- [ ] Polish the blog post page: add `prose prose-neutral dark:prose-invert` to the content div
- [ ] Add hover transitions to all cards: `hover:shadow-md transition-shadow`
- [ ] **Challenge:** Add a "Back to top" button — appears after scrolling 200px, smooth scrolls to top
  ```ts
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);
  ```
- [ ] **Stretch:** Add `app/tags/[tag]/page.tsx` — filters posts by tag using getAllPosts

**Check:** Toggle theme — no flash, no layout shift. Icons update correctly.

---

## Day 7 — Deploy to Production

**Goal:** Live URL with a working sign-in and database.

- [ ] Ensure `.env.local` is in `.gitignore` (it should be — never commit secrets)
- [ ] Run `npm run build` locally — fix any TypeScript errors: `npm run type-check`
- [ ] Fix any ESLint warnings: `npm run lint`
- [ ] Push to GitHub
- [ ] Deploy to Vercel: connect the repo in [vercel.com](https://vercel.com) or run `vercel deploy`
- [ ] Add all env vars in Vercel → Project Settings → Environment Variables
- [ ] Update `NEXTAUTH_URL` to your production URL
- [ ] Update Google OAuth authorized redirect URI to: `https://your-domain.vercel.app/api/auth/callback/google`
- [ ] Test sign-in in production
- [ ] Test `/api/posts` in production with a browser or REST client
- [ ] Enable Vercel Analytics in the dashboard

- [ ] **Challenge:** Add error monitoring with Sentry:
  - `npm install @sentry/nextjs`
  - Add to `app/error.tsx`: `Sentry.captureException(error)`
- [ ] **Stretch:** Add a GitHub Actions CI workflow that runs `type-check` + `lint` on every PR

**Congratulations — you've shipped a production Next.js 14 app!**

---

## Bonus Challenges

- **Comments:** Real-time comments on blog posts with Supabase subscriptions
- **Image Upload:** Let users upload cover images to Supabase Storage
- **Email:** Welcome email on sign-up using Resend
- **Full-text Search:** Supabase `text_search` or Algolia integration
- **i18n:** Add `next-intl` for multi-language support
- **Tests:** Playwright end-to-end tests for sign-in + post creation flow
