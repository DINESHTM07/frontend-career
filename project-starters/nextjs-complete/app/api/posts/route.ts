/**
 * app/api/posts/route.ts — Posts Collection API
 *
 * GET  /api/posts           → list all posts (supports ?category= and ?q=)
 * POST /api/posts           → create a new post (auth required)
 *
 * In App Router, API routes are called "Route Handlers".
 * Each HTTP method gets its own exported async function.
 * Use NextRequest/NextResponse from "next/server" (NOT express types).
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllPosts } from "@/lib/data";
import { z } from "zod";

// ─── GET /api/posts ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    // Read query params from the URL
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const query = searchParams.get("q") ?? undefined;

    const posts = await getAllPosts({ category, query });

    // NextResponse.json() sets Content-Type: application/json automatically
    return NextResponse.json({ posts, count: posts.length });
  } catch (error) {
    console.error("[GET /api/posts]", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// ─── POST /api/posts ───────────────────────────────────────────────────────────

// Zod schema for request body validation
const CreatePostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  coverImage: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication — returns null if not signed in
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse + validate request body
    const body = await request.json();
    const validation = CreatePostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    /**
     * TODO: Replace this mock with a real Supabase insert:
     *
     * import { createClient } from "@/lib/supabase-server";
     * const supabase = createClient();
     * const { data: post, error } = await supabase
     *   .from("posts")
     *   .insert({ ...data, author_id: session.user.id })
     *   .select()
     *   .single();
     * if (error) throw error;
     */
    const newPost = {
      id: crypto.randomUUID(),
      ...data,
      author: { name: session.user?.name, email: session.user?.email },
      publishedAt: new Date().toISOString(),
      readingTime: Math.ceil(data.content.split(" ").length / 200),
    };

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/posts]", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
