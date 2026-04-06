/**
 * app/blog/page.tsx — Blog Index Page (Server Component) [STUB]
 *
 * searchParams are passed automatically by Next.js from the URL query string.
 * e.g. /blog?category=react&q=hooks → searchParams = { category: "react", q: "hooks" }
 *
 * TODO (Day 1):
 *  1. Import getAllPosts from "@/lib/data"
 *  2. Call: const posts = await getAllPosts({ category: searchParams.category, query: searchParams.q })
 *  3. Show a count: "{posts.length} articles"
 *  4. Render <BlogSearch /> so users can filter (create components/blog/BlogSearch.tsx)
 *  5. Render <BlogList posts={posts} /> to show the grid (create components/blog/BlogList.tsx)
 *  6. Handle the empty state: "No posts found."
 *
 * TODO (Day 5): Add metadata with openGraph title/description
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "All blog posts.",
};

interface BlogPageProps {
  searchParams: { category?: string; q?: string };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // TODO: const posts = await getAllPosts({ category: searchParams.category, query: searchParams.q });

  return (
    <div className="container py-12">
      {/* TODO: Page header with Badge + h1 + post count */}
      <h1 className="text-4xl font-bold tracking-tight mb-8">Blog</h1>

      {/* TODO: <BlogSearch categories={["All", "React", "Next.js", "TypeScript", "CSS", "Tools"]} /> */}
      <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-6 text-center text-muted-foreground mb-8">
        BlogSearch goes here (create components/blog/BlogSearch.tsx)
      </div>

      {/* TODO: <BlogList posts={posts} /> or empty state */}
      <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-16 text-center text-muted-foreground">
        BlogList goes here — implement lib/data.ts first so posts load
      </div>
    </div>
  );
}
