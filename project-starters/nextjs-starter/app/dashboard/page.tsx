/**
 * app/dashboard/page.tsx — Protected Dashboard Page (Server Component) [STUB]
 *
 * This route is protected by middleware.ts — unauthenticated users are
 * redirected before they ever reach this page.
 *
 * TODO (Day 2):
 *  1. Import getServerSession from "next-auth" and authOptions from "@/lib/auth"
 *  2. Call: const session = await getServerSession(authOptions)
 *  3. Add a redirect fallback: if (!session) redirect("/api/auth/signin?callbackUrl=/dashboard")
 *  4. Show the user's name + avatar (session.user.name, session.user.image)
 *  5. Add a stats grid (4 cards: Total Posts, Views, Likes, Avg Read Time)
 *  6. Render <PostsTable posts={posts} /> (create components/dashboard/PostsTable.tsx)
 *  7. Render <CreatePostDialog /> (create components/dashboard/CreatePostDialog.tsx)
 *
 * TODO (Day 3): Replace the mock posts with real Supabase data
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your posts.",
};

export default async function DashboardPage() {
  // TODO: const session = await getServerSession(authOptions);
  // TODO: if (!session) redirect("/api/auth/signin?callbackUrl=/dashboard");
  // TODO: const posts = await getAllPosts({});

  return (
    <div className="container py-8 space-y-8">
      {/* TODO: Welcome header with user avatar (next/image) + name + email */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">TODO: Show session.user.name and email</p>
        </div>
        {/* TODO: <CreatePostDialog /> */}
        <div className="rounded border-2 border-dashed border-muted-foreground/20 px-4 py-2 text-sm text-muted-foreground">
          CreatePostDialog goes here
        </div>
      </div>

      {/* TODO: Stats grid — 4 cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Total Posts", "Total Views", "Total Likes", "Avg. Read Time"].map((label) => (
          <div
            key={label}
            className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-6 text-center text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>

      {/* TODO: <PostsTable posts={posts} /> */}
      <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-12 text-center text-muted-foreground">
        PostsTable goes here (create components/dashboard/PostsTable.tsx)
      </div>
    </div>
  );
}
