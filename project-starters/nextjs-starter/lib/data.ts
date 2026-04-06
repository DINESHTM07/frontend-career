/**
 * lib/data.ts — Data Access Layer (STUB)
 *
 * TODO: Implement these functions.
 *
 * Each function should either:
 *  A) Return mock data (copy the pattern from the -complete version), OR
 *  B) Query Supabase (see TODO comments on each function)
 *
 * The functions are already typed and wired up to every page — once
 * you implement them the whole app lights up.
 */

import type { Post } from "@/types";

interface GetAllPostsOptions {
  category?: string;
  query?: string;
  limit?: number;
}

/**
 * TODO: Return an array of Post objects.
 *
 * Steps:
 * 1. Define a `mockPosts` array with at least 3 posts (see complete version for shape)
 * 2. Filter by category and query if provided
 * 3. Sort by publishedAt descending
 * 4. Later: replace with Supabase query:
 *    const { data } = await supabase.from("posts").select("*, author:authors(*)").order("published_at", { ascending: false });
 */
export async function getAllPosts(options: GetAllPostsOptions): Promise<Post[]> {
  // TODO: implement
  return [];
}

/**
 * TODO: Return the `count` most recently published posts.
 * Hint: call getAllPosts with { limit: count }
 */
export async function getLatestPosts(count: number): Promise<Post[]> {
  // TODO: implement
  return [];
}

/**
 * TODO: Return the Post whose slug matches, or null if not found.
 * Hint: mockPosts.find(p => p.slug === slug) ?? null
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // TODO: implement
  return null;
}

/**
 * TODO: Return the Post whose id matches, or null if not found.
 */
export async function getPostById(id: string): Promise<Post | null> {
  // TODO: implement
  return null;
}
