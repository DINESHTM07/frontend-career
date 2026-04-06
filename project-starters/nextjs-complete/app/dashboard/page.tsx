/**
 * app/dashboard/page.tsx — Protected Dashboard Page (Server Component)
 *
 * This route is protected by middleware.ts — unauthenticated users are
 * redirected to /api/auth/signin before reaching this page.
 *
 * Here we use getServerSession() to access the session on the server.
 * This is safe: the session is read from a server-side cookie, not localStorage.
 */

import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostsTable } from "@/components/dashboard/PostsTable";
import { CreatePostDialog } from "@/components/dashboard/CreatePostDialog";
import { getAllPosts } from "@/lib/data";
import { FileText, Eye, Heart, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your posts and view analytics.",
};

const stats = [
  { label: "Total Posts", value: "12", icon: FileText, change: "+2 this week" },
  { label: "Total Views", value: "4,821", icon: Eye, change: "+18% this month" },
  { label: "Total Likes", value: "391", icon: Heart, change: "+5% this month" },
  { label: "Avg. Read Time", value: "6m", icon: TrendingUp, change: "Stable" },
];

export default async function DashboardPage() {
  // getServerSession reads the JWT cookie from the request headers
  // Returns null if not authenticated
  const session = await getServerSession(authOptions);

  // Double-check auth (middleware handles it first, but this is a safety net)
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  const posts = await getAllPosts({});

  return (
    <div className="container py-8 space-y-8">
      {/* Welcome header with user avatar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User"}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {session.user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">{session.user?.email}</p>
          </div>
        </div>
        {/* CreatePostDialog is a Client Component (opens a modal) */}
        <CreatePostDialog />
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Posts Table — Client Component for sorting/selecting */}
      <Card>
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
          <CardDescription>
            Manage, edit, and delete your published posts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostsTable posts={posts} />
        </CardContent>
      </Card>
    </div>
  );
}
