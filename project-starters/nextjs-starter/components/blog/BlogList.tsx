/**
 * components/blog/BlogList.tsx — Blog Post Grid [STUB]
 *
 * Server Component — receives pre-fetched posts from the page as props.
 *
 * TODO (Day 1):
 *  1. Render a responsive grid: grid gap-6 sm:grid-cols-2 lg:grid-cols-3
 *  2. For each post, render a Card with:
 *     - Cover image using next/image (fill, sizes="...", group-hover scale)
 *     - Category badge + reading time
 *     - Title as a Link to /blog/[slug]
 *     - Excerpt (line-clamp-2)
 *     - Author avatar (next/image, 24×24, rounded-full) + author name
 *     - Like count with Heart icon
 *  3. Add hover effects: shadow on card, scale on image, color on title
 *
 * Hint: import Image from "next/image" — use fill for the cover image
 *       wrap the card in className="group" to enable group-hover utilities
 */

import Link from "next/link";
import type { Post } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post.id}>
          {/* TODO: Cover image — next/image with fill */}
          <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center text-xs text-muted-foreground">
            Cover image (TODO: next/image)
          </div>

          <CardHeader>
            {/* TODO: Badge + reading time */}
            <Badge variant="secondary" className="w-fit mb-1">{post.category}</Badge>

            <CardTitle className="line-clamp-2">
              {/* TODO: Wrap in Link to /blog/[post.slug] */}
              {post.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
          </CardHeader>

          <CardContent>
            {/* TODO: Author avatar + name + like count */}
            <p className="text-sm text-muted-foreground">{post.author.name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
