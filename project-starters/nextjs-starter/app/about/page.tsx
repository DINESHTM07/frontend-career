/**
 * app/about/page.tsx — About Page (Server Component) [STUB]
 *
 * This is a static page — no data fetching. Next.js will pre-render it
 * at build time (SSG) because there are no dynamic inputs.
 *
 * TODO (Day 1):
 *  1. Add `export const metadata: Metadata` with title, description, openGraph
 *  2. Build two sections:
 *     a) Tech Stack — a grid of Card components listing each technology
 *     b) Team — a list of team members with name, role, avatar (use next/image), bio
 *  3. Use the Badge component for the "About this project" eyebrow label
 *
 * Tip: Import Card, CardContent from "@/components/ui/card"
 *      Import Image from "next/image" — width={64} height={64} className="rounded-full"
 */

import type { Metadata } from "next";

// TODO: Add metadata
export const metadata: Metadata = {
  title: "About",
  description: "About this project.",
};

// TODO: Define a techStack array and a team array

export default function AboutPage() {
  return (
    <div className="container py-12 space-y-16">
      {/* TODO: Page header with Badge + h1 + description */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">About</h1>
        <p className="mt-4 text-muted-foreground">TODO: Add description</p>
      </div>

      {/* TODO: Tech Stack section — grid of Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Tech Stack</h2>
        <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-12 text-center text-muted-foreground">
          Tech stack cards go here
        </div>
      </section>

      {/* TODO: Team section — Cards with next/image avatars */}
      <section>
        <h2 className="text-2xl font-bold mb-6">The Team</h2>
        <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-12 text-center text-muted-foreground">
          Team member cards go here
        </div>
      </section>
    </div>
  );
}
