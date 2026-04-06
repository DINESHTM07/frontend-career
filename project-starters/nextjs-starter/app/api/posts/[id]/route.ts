/**
 * app/api/posts/[id]/route.ts — Single Post API [STUB]
 *
 * TODO (Day 4) — GET handler:
 *  1. Call getPostById(params.id) from "@/lib/data"
 *  2. Return 404 if not found
 *  3. Return NextResponse.json({ post })
 *
 * TODO (Day 4) — PATCH handler:
 *  1. Check auth (require session)
 *  2. Get the existing post — return 404 if not found
 *  3. Parse updates from request.json()
 *  4. Update in Supabase: .update(updates).eq("id", params.id)
 *  5. Return updated post
 *
 * TODO (Day 4) — DELETE handler:
 *  1. Check auth
 *  2. Return 404 if post doesn't exist
 *  3. Delete from Supabase: .delete().eq("id", params.id)
 *  4. Return new NextResponse(null, { status: 204 })
 */

import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  // TODO: implement
  return NextResponse.json({ error: "Not implemented yet" }, { status: 501 });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  // TODO: check auth, validate, update in Supabase
  return NextResponse.json({ error: "Not implemented yet" }, { status: 501 });
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  // TODO: check auth, delete from Supabase, return 204
  return NextResponse.json({ error: "Not implemented yet" }, { status: 501 });
}
