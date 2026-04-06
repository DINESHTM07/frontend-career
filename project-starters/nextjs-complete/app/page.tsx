/**
 * app/page.tsx — Home Page (Server Component)
 *
 * This page runs entirely on the server. There's no "use client" directive,
 * so React renders it to HTML on the server and streams it to the browser.
 *
 * Server Components CAN:
 *  - async/await data fetching at the top level
 *  - access server-only resources (env vars, DB, file system)
 *  - import server-only packages
 *
 * Server Components CANNOT:
 *  - use React hooks (useState, useEffect, etc.)
 *  - attach browser event listeners
 *  - use browser APIs (window, document)
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { getLatestPosts } from "@/lib/data";

// Per-page metadata — overrides the title template from layout.tsx
export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to our Next.js 14 application.",
};

// Revalidate this page every 60 seconds (ISR — Incremental Static Regeneration)
// Remove this line to make it fully dynamic, or set to 0 for no caching.
export const revalidate = 60;

export default async function HomePage() {
  // Server-side data fetch — runs at request time on the server
  // The result is used to pre-render the page HTML
  const latestPosts = await getLatestPosts(3);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section — interactive parts are Client Components inside */}
      <HeroSection />

      {/* Features Grid — pure server-rendered layout */}
      <section className="container">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-4">What's included</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need
          </h2>
          <p className="mt-4 text-muted-foreground">
            A production-ready setup with best practices baked in.
          </p>
        </div>
        <FeaturesGrid />
      </section>

      {/* Latest Blog Posts — data fetched server-side above */}
      <section className="container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Latest Posts</h2>
          <Button variant="outline" asChild>
            <Link href="/blog">View all posts</Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <CardTitle className="line-clamp-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {/* next/image — auto-optimizes: WebP, resizing, lazy load */}
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">{post.author.name}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <div className="rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-4 text-primary-foreground/80">
            Clone this starter, fill in your .env, and ship your next project.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/blog">Read the blog</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link href="/about">About this project</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
