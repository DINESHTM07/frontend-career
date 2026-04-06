/**
 * app/api/posts/[id]/route.ts — Single Post API
 *
 * GET    /api/posts/:id  → fetch one post by ID
 * PATCH  /api/posts/:id  → update a post (auth required)
 * DELETE /api/posts/:id  → delete a post (auth required)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPostById } from "@/lib/data";

interface RouteContext {
  params: { id: string };
}

// ─── GET /api/posts/:id ────────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const post = await getPostById(params.id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error(`[GET /api/posts/${params.id}]`, error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/posts/:id ──────────────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await getPostById(params.id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const updates = await request.json();

    /**
     * TODO: Replace with Supabase update:
     *
     * const { data, error } = await supabase
     *   .from("posts")
     *   .update(updates)
     *   .eq("id", params.id)
     *   .eq("author_id", session.user.id) // only own posts
     *   .select()
     *   .single();
     */
    const updatedPost = { ...post, ...updates, updatedAt: new Date().toISOString() };

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error(`[PATCH /api/posts/${params.id}]`, error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/posts/:id ─────────────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await getPostById(params.id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    /**
     * TODO: Replace with Supabase delete:
     *
     * const { error } = await supabase
     *   .from("posts")
     *   .delete()
     *   .eq("id", params.id)
     *   .eq("author_id", session.user.id);
     */

    // Return 204 No Content on successful delete
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE /api/posts/${params.id}]`, error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
