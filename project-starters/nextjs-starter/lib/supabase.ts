/**
 * lib/supabase.ts — Supabase Client Configuration
 *
 * Two client types:
 *
 * 1. Browser client (`createBrowserClient`) — used in Client Components ("use client")
 *    - Uses the ANON key (safe for public exposure)
 *    - Respects Row Level Security (RLS) policies
 *    - Singleton: created once per page load
 *
 * 2. Server client (`createServerClient`) — used in Server Components, Route Handlers, middleware
 *    - Can use SERVICE_ROLE key to bypass RLS (use sparingly, only for admin operations)
 *    - Must NOT be imported in client-side code
 *
 * Row Level Security (RLS):
 *   Set up RLS policies in the Supabase Dashboard so the anon key
 *   can only read/write rows the user owns. Example:
 *
 *   CREATE POLICY "Users can only see their own posts" ON posts
 *   FOR SELECT USING (auth.uid() = author_id);
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// ─── Environment variable validation ──────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // In production, throw an error. In development, warn so the app still boots.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  } else {
    console.warn(
      "⚠️  Supabase env vars not set. Copy .env.example to .env.local and fill in your values."
    );
  }
}

// ─── Browser / Client Component client ────────────────────────────────────────

/**
 * Use this in Client Components ("use client").
 * The ANON key is public — it's safe to expose in the browser.
 * RLS policies control what data each user can access.
 *
 * Example usage:
 *   import { supabase } from "@/lib/supabase";
 *   const { data, error } = await supabase.from("posts").select("*");
 */
export const supabase = createClient<Database>(
  supabaseUrl ?? "",
  supabaseAnonKey ?? ""
);

// ─── Server-side client (Service Role — bypasses RLS) ─────────────────────────

/**
 * Use this in Server Components, API routes, and server actions ONLY.
 * NEVER import this in client components — the service role key has full DB access.
 *
 * Example usage in a server component or API route:
 *   import { supabaseAdmin } from "@/lib/supabase";
 *   const { data } = await supabaseAdmin.from("users").select("*");
 */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey ?? "",
  {
    auth: {
      // Don't persist session on the server — each request is independent
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// ─── Type helper ──────────────────────────────────────────────────────────────

/**
 * Generate TypeScript types from your Supabase schema:
 *
 *   npx supabase gen types typescript --project-id <your-project-ref> > types/database.ts
 *
 * Then the Database generic above will give you full autocomplete on
 * table names, column names, and return types.
 */
