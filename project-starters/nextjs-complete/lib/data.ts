/**
 * lib/data.ts — Data Access Layer (Mock / Supabase-ready)
 *
 * These functions are the single source of truth for fetching data.
 * Currently they return mock data; swap them for Supabase queries
 * when your database is set up.
 *
 * Pattern: always export typed async functions — the calling code
 * doesn't need to know whether data comes from a DB, API, or mock.
 */

import type { Post, Author } from "@/types";

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockAuthors: Author[] = [
  {
    id: "author-1",
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    bio: "Senior Next.js engineer at Vercel.",
  },
  {
    id: "author-2",
    name: "Bob Smith",
    email: "bob@example.com",
    avatar: "https://avatars.githubusercontent.com/u/2?v=4",
    bio: "Open source contributor and React enthusiast.",
  },
];

const mockPosts: Post[] = [
  {
    id: "post-1",
    title: "Getting Started with Next.js 14 App Router",
    slug: "getting-started-with-nextjs-14-app-router",
    excerpt:
      "Everything you need to know to start building with Next.js 14's App Router, Server Components, and the new data fetching patterns.",
    content: `
      <p>Next.js 14 introduces a stable App Router built on React Server Components. This guide walks you through the key concepts.</p>
      <h2>Server Components</h2>
      <p>By default, all components in the <code>app/</code> directory are Server Components. They run on the server, can fetch data directly, and send zero JavaScript to the client.</p>
      <h2>Client Components</h2>
      <p>Add <code>"use client"</code> at the top of a file to opt into client-side rendering. Use this for interactivity, browser APIs, and React hooks.</p>
      <h2>Data Fetching</h2>
      <p>Fetch data directly in Server Components using <code>async/await</code>. Next.js extends the native <code>fetch</code> API with caching and revalidation options.</p>
    `,
    category: "Next.js",
    tags: ["nextjs", "react", "server-components"],
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
    author: mockAuthors[0],
    publishedAt: "2024-01-15T10:00:00Z",
    readingTime: 8,
    likes: 142,
  },
  {
    id: "post-2",
    title: "Mastering TypeScript Generics",
    slug: "mastering-typescript-generics",
    excerpt:
      "TypeScript generics are powerful but confusing at first. This post breaks them down with real-world examples from a Next.js codebase.",
    content: `
      <p>Generics allow you to write reusable, type-safe code. Let's explore them with practical examples.</p>
      <h2>Basic Generics</h2>
      <p>A generic function works like a type-safe template. Instead of any, you use a type variable: <code>function identity&lt;T&gt;(arg: T): T</code></p>
      <h2>Constrained Generics</h2>
      <p>Use <code>extends</code> to constrain what types can be passed: <code>function getProperty&lt;T, K extends keyof T&gt;(obj: T, key: K)</code></p>
    `,
    category: "TypeScript",
    tags: ["typescript", "generics", "type-safety"],
    coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&q=80",
    author: mockAuthors[1],
    publishedAt: "2024-01-20T10:00:00Z",
    readingTime: 6,
    likes: 98,
  },
  {
    id: "post-3",
    title: "Tailwind CSS Tips and Tricks for 2024",
    slug: "tailwind-css-tips-tricks-2024",
    excerpt:
      "Advanced Tailwind techniques: arbitrary values, custom plugins, component extraction, and dark mode patterns.",
    content: `
      <p>Tailwind CSS has evolved significantly. Here are the patterns that make the biggest difference in large projects.</p>
      <h2>Arbitrary Values</h2>
      <p>Need a one-off value? Use bracket notation: <code>w-[123px]</code>, <code>text-[#FF5500]</code>.</p>
      <h2>Component Extraction</h2>
      <p>Don't @apply — extract components with JSX instead. The className prop accepts all Tailwind utilities.</p>
    `,
    category: "CSS",
    tags: ["tailwind", "css", "design"],
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    author: mockAuthors[0],
    publishedAt: "2024-02-01T10:00:00Z",
    readingTime: 5,
    likes: 76,
  },
  {
    id: "post-4",
    title: "Authentication with NextAuth.js and Supabase",
    slug: "authentication-nextauth-supabase",
    excerpt:
      "Wire up Google OAuth with NextAuth.js, persist sessions in Supabase, and protect routes with middleware — step by step.",
    content: `
      <p>Authentication is one of the most important (and tricky) parts of any web app. Let's do it right.</p>
      <h2>Setting up NextAuth</h2>
      <p>Install <code>next-auth</code> and configure providers in <code>lib/auth.ts</code>.</p>
      <h2>Supabase Adapter</h2>
      <p>Use <code>@auth/supabase-adapter</code> to store sessions and users in your Supabase database.</p>
    `,
    category: "Next.js",
    tags: ["nextauth", "supabase", "auth"],
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    author: mockAuthors[1],
    publishedAt: "2024-02-10T10:00:00Z",
    readingTime: 10,
    likes: 203,
  },
  {
    id: "post-5",
    title: "React Server Components: A Deep Dive",
    slug: "react-server-components-deep-dive",
    excerpt:
      "How Server Components work under the hood, when to use them vs Client Components, and common pitfalls to avoid.",
    content: `
      <p>React Server Components (RSC) are a paradigm shift in how we think about rendering. Let's explore them deeply.</p>
      <h2>How RSC Works</h2>
      <p>RSC renders on the server and sends a special serialized format (not HTML) to the client, which React reconciles into the DOM.</p>
    `,
    category: "React",
    tags: ["react", "server-components", "performance"],
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80",
    author: mockAuthors[0],
    publishedAt: "2024-02-15T10:00:00Z",
    readingTime: 12,
    likes: 317,
  },
  {
    id: "post-6",
    title: "Building a Design System with Shadcn/UI",
    slug: "design-system-shadcn-ui",
    excerpt:
      "How to use Shadcn/UI as the foundation for a consistent, accessible, and customizable design system.",
    content: `
      <p>Shadcn/UI isn't a traditional component library — you own the code. This makes it perfect for design systems.</p>
      <h2>The Copy-Paste Philosophy</h2>
      <p>Run <code>npx shadcn-ui@latest add button</code> and the component code lands in your repo. No black box.</p>
    `,
    category: "Tools",
    tags: ["shadcn", "design-system", "ui"],
    coverImage: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=1200&q=80",
    author: mockAuthors[1],
    publishedAt: "2024-02-20T10:00:00Z",
    readingTime: 7,
    likes: 154,
  },
];

// ─── Query Functions ────────────────────────────────────────────────────────────

interface GetAllPostsOptions {
  category?: string;
  query?: string;
  limit?: number;
}

/**
 * getAllPosts — fetch all posts with optional filtering.
 *
 * TODO: Replace with Supabase query:
 *   const { data, error } = await supabase
 *     .from("posts")
 *     .select("*, author:authors(*)")
 *     .eq(category ? "category" : undefined, category)
 *     .ilike(query ? "title" : undefined, `%${query}%`)
 *     .order("published_at", { ascending: false });
 */
export async function getAllPosts(options: GetAllPostsOptions): Promise<Post[]> {
  // Simulate network latency in development
  if (process.env.NODE_ENV === "development") {
    await new Promise((r) => setTimeout(r, 100));
  }

  let posts = [...mockPosts];

  if (options.category && options.category !== "All") {
    posts = posts.filter(
      (p) => p.category.toLowerCase() === options.category!.toLowerCase()
    );
  }

  if (options.query) {
    const q = options.query.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }

  if (options.limit) {
    posts = posts.slice(0, options.limit);
  }

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/** Get the N most recent posts */
export async function getLatestPosts(count: number): Promise<Post[]> {
  return getAllPosts({ limit: count });
}

/** Get a single post by slug */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  return mockPosts.find((p) => p.slug === slug) ?? null;
}

/** Get a single post by ID */
export async function getPostById(id: string): Promise<Post | null> {
  return mockPosts.find((p) => p.id === id) ?? null;
}
