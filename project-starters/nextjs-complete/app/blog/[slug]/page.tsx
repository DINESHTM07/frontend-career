/**
 * app/blog/[slug]/page.tsx — Blog Post Detail Page (Server Component)
 *
 * Dynamic route: [slug] is the URL parameter.
 * e.g. /blog/getting-started-with-nextjs → slug = "getting-started-with-nextjs"
 *
 * generateStaticParams: tells Next.js which slugs to pre-render at build time.
 * Any slug NOT returned here is fetched on-demand and cached.
 *
 * generateMetadata: async function that returns per-post SEO metadata,
 * including OpenGraph and Twitter cards with the post's real title/image.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getPostBySlug, getAllPosts } from "@/lib/data";
import { PostActions } from "@/components/blog/PostActions";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

interface PostPageProps {
  params: { slug: string };
}

/**
 * generateStaticParams — runs at BUILD time.
 * Returns an array of { slug } objects to pre-render.
 * This makes popular posts available as static files (fastest possible serving).
 */
export async function generateStaticParams() {
  const posts = await getAllPosts({});
  return posts.map((post) => ({ slug: post.slug }));
}

/**
 * generateMetadata — async function for per-page metadata.
 * Runs on the server, can fetch data, has access to params.
 */
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  // If the post doesn't exist, metadata fallback
  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  // notFound() triggers the nearest not-found.tsx boundary
  if (!post) notFound();

  return (
    <article className="container max-w-3xl py-12">
      {/* Back link */}
      <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All posts
        </Link>
      </Button>

      {/* Post header */}
      <header className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{post.category}</Badge>
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-4xl font-bold tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-muted-foreground">{post.excerpt}</p>

        {/* Author + meta row */}
        <div className="flex items-center gap-4">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{post.author.name}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTime} min read
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image — next/image handles optimization */}
      <div className="relative mb-8 aspect-video overflow-hidden rounded-xl">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill // fill the parent container
          className="object-cover"
          priority // LCP image — load eagerly, not lazily
          sizes="(max-width: 768px) 100vw, 768px" // responsive hints for the browser
        />
      </div>

      <Separator className="mb-8" />

      {/* Post content — in production this would be MDX or rich text */}
      <div
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <Separator className="my-8" />

      {/* Client Component for interactive post actions (like, share, etc.) */}
      <PostActions post={post} />
    </article>
  );
}
