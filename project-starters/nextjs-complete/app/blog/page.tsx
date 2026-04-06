/**
 * app/blog/page.tsx — Blog Index Page (Server Component)
 *
 * Fetches all posts server-side. In production this would query Supabase;
 * here it uses the mock data function from lib/data.ts.
 *
 * The page is dynamically rendered (no revalidate) so every request
 * fetches fresh data.
 */

import type { Metadata } from "next";
import { getAllPosts } from "@/lib/data";
import { BlogList } from "@/components/blog/BlogList";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles about Next.js, React, TypeScript, and modern web development.",
  openGraph: {
    title: "Blog | NextJS App",
    description: "Articles about Next.js, React, TypeScript, and modern web development.",
  },
};

// searchParams is automatically passed by Next.js from the URL query string
// e.g. /blog?category=react&q=hooks
interface BlogPageProps {
  searchParams: {
    category?: string;
    q?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Server-side data fetch — searchParams lets us filter without client JS
  const posts = await getAllPosts({
    category: searchParams.category,
    query: searchParams.q,
  });

  const categories = ["All", "React", "Next.js", "TypeScript", "CSS", "Tools"];

  return (
    <div className="container py-12">
      {/* Page header */}
      <div className="mb-10">
        <Badge variant="outline" className="mb-4">Blog</Badge>
        <h1 className="text-4xl font-bold tracking-tight">All Posts</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {posts.length} article{posts.length !== 1 ? "s" : ""} on Next.js, React, and modern web dev.
        </p>
      </div>

      {/* Search + filter — Client Component for interactivity */}
      <BlogSearch categories={categories} />

      {/* Post list — Server Component, receives pre-fetched data */}
      <div className="mt-8">
        {posts.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            No posts found. Try a different search or category.
          </div>
        ) : (
          <BlogList posts={posts} />
        )}
      </div>
    </div>
  );
}
