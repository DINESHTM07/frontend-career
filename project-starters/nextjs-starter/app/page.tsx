/**
 * app/page.tsx — Home Page (Server Component) [STUB]
 *
 * This is a Server Component: no "use client", can use async/await at top level,
 * can fetch data directly without useEffect.
 *
 * TODO (Day 1):
 *  1. Import getLatestPosts from "@/lib/data"
 *  2. Make the function async and call: const posts = await getLatestPosts(3)
 *  3. Replace the placeholder div below with:
 *     - <HeroSection /> (create components/home/HeroSection.tsx)
 *     - A features section using <FeaturesGrid /> (create components/home/FeaturesGrid.tsx)
 *     - A "Latest Posts" section that maps over `posts` and renders a Card per post
 *     - A CTA (call-to-action) section at the bottom
 *
 * Reference: see the complete version at project-starters/nextjs-complete/app/page.tsx
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to my Next.js app.",
};

// TODO: Add `export const revalidate = 60;` for ISR (Day 5)

export default async function HomePage() {
  // TODO: const latestPosts = await getLatestPosts(3);

  return (
    <div className="container py-16 text-center">
      <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
        Starter — Day 1
      </p>
      <h1 className="text-5xl font-black tracking-tight">Home Page</h1>
      <p className="mt-4 text-muted-foreground">
        Open <code className="text-sm bg-muted px-1.5 py-0.5 rounded">app/page.tsx</code> and
        start building.
      </p>

      {/* TODO: Replace this section with HeroSection */}
      <div className="mt-12 rounded-xl border-2 border-dashed border-muted-foreground/20 p-12 text-muted-foreground">
        HeroSection goes here
      </div>

      {/* TODO: Replace this section with FeaturesGrid */}
      <div className="mt-6 rounded-xl border-2 border-dashed border-muted-foreground/20 p-12 text-muted-foreground">
        FeaturesGrid goes here
      </div>

      {/* TODO: Replace this section with latest blog posts */}
      <div className="mt-6 rounded-xl border-2 border-dashed border-muted-foreground/20 p-12 text-muted-foreground">
        Latest Posts (3 cards) go here
      </div>
    </div>
  );
}
