/**
 * app/api/posts/route.ts — Posts Collection API [STUB]
 *
 * In App Router, API routes are "Route Handlers".
 * Each HTTP verb is its own exported async function.
 * Use NextRequest / NextResponse from "next/server".
 *
 * TODO (Day 4) — GET handler:
 *  1. Read query params: searchParams.get("category"), searchParams.get("q")
 *  2. Call getAllPosts({ category, query }) from "@/lib/data"
 *  3. Return NextResponse.json({ posts, count: posts.length })
 *  4. Wrap in try/catch and return 500 on error
 *
 * TODO (Day 4) — POST handler:
 *  1. Check auth: const session = await getServerSession(authOptions)
 *     Return 401 if no session
 *  2. Parse body: const body = await request.json()
 *  3. Validate with Zod (see complete version for the schema)
 *  4. Insert into Supabase: supabase.from("posts").insert({...}).select().single()
 *  5. Return NextResponse.json({ post }, { status: 201 })
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: implement
  return NextResponse.json({ posts: [], count: 0 });
}

export async function POST(request: NextRequest) {
  // TODO: check auth, validate body, insert to Supabase
  return NextResponse.json(
    { error: "Not implemented yet" },
    { status: 501 }
  );
}
