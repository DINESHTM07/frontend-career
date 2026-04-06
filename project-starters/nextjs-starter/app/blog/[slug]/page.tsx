/**
 * app/blog/[slug]/page.tsx — Blog Post Detail Page (Server Component) [STUB]
 *
 * [slug] is a URL parameter: /blog/my-post-slug → params.slug = "my-post-slug"
 *
 * TODO (Day 1):
 *  1. Import getPostBySlug and getAllPosts from "@/lib/data"
 *  2. Call getPostBySlug(params.slug) — if null, call notFound()
 *  3. Build the post layout:
 *     - Back button: <Button variant="ghost" asChild><Link href="/blog">← All posts</Link></Button>
 *     - Post header: category badge, title, excerpt, author avatar + name, publish date, read time
 *     - Cover image: <Image src={post.coverImage} fill priority ... />
 *     - Content: <div dangerouslySetInnerHTML={{ __html: post.content }} />
 *     - <PostActions post={post} /> (create components/blog/PostActions.tsx)
 *
 * TODO (Day 5): Add generateMetadata() for per-post SEO + OpenGraph
 * TODO (Day 5): Add generateStaticParams() to pre-render all posts at build time
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PostPageProps {
  params: { slug: string };
}

// TODO (Day 5): Replace this with generateMetadata()
export const metadata: Metadata = {
  title: "Post",
};

// TODO (Day 5): Add generateStaticParams() here
// export async function generateStaticParams() { ... }

export default async function PostPage({ params }: PostPageProps) {
  // TODO: const post = await getPostBySlug(params.slug);
  // TODO: if (!post) notFound();

  return (
    <article className="container max-w-3xl py-12">
      {/* TODO: Back button */}

      {/* TODO: Post header (badge, title, excerpt, author, date, reading time) */}
      <h1 className="text-4xl font-bold mb-4">
        Post: <code className="text-primary">{params.slug}</code>
      </h1>

      {/* TODO: Cover image using next/image fill + priority */}
      <div className="aspect-video rounded-xl bg-muted flex items-center justify-center text-muted-foreground mb-8">
        Cover image goes here (next/image fill)
      </div>

      {/* TODO: Post content */}
      <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-8 text-center text-muted-foreground">
        Post content goes here — implement getPostBySlug() in lib/data.ts first
      </div>

      {/* TODO: <PostActions post={post} /> */}
      <div className="mt-8 rounded-xl border-2 border-dashed border-muted-foreground/20 p-6 text-center text-muted-foreground">
        PostActions (like, share) goes here
      </div>
    </article>
  );
}
