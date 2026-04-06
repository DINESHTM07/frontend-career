/**
 * components/blog/BlogList.tsx — Blog Post Grid (Server Component)
 *
 * Receives pre-fetched posts as props from the page (Server Component).
 * Renders a responsive grid of blog cards.
 * No interactivity — stays server-side.
 */

import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart } from "lucide-react";

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="group flex flex-col overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Cover image */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          <CardHeader className="flex-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Badge variant="secondary">{post.category}</Badge>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime}m read
              </span>
            </div>
            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </CardTitle>
            <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
                <span className="text-xs font-medium">{post.author.name}</span>
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Heart className="h-3 w-3" />
                {post.likes}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
