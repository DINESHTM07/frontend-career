// ============================================
// INTRO: Next.js Rendering Strategies — The Big 4
// ============================================
// Next.js gives you 4 ways to render a page. Choosing the wrong one
// means slow pages, stale content, or wasted server load. Each strategy
// answers a different question:
//
//   SSG  (Static Site Generation):
//     "Does this content change rarely? Pre-build it."
//     Rendered at BUILD TIME. Fastest possible — pure HTML served from CDN.
//     → Marketing pages, blog posts, docs, portfolios
//
//   SSR  (Server-Side Rendering):
//     "Does this content change per-request? Render on the server."
//     Rendered at REQUEST TIME on server. Fresh every request.
//     → Personalized dashboards, trending/live data, auth-gated pages
//
//   CSR  (Client-Side Rendering):
//     "Does this content depend on user interaction? Render in the browser."
//     HTML shell served, JS fetches data after load. No SEO for this content.
//     → Comments, likes, shopping cart, user settings
//
//   ISR  (Incremental Static Regeneration):
//     "Best of SSG + SSR: pre-build, but refresh on a schedule."
//     Rendered at build time, re-generated after revalidate seconds.
//     → Blog posts that update, product pages, news articles
//
// MENTAL MODEL:
//   SSG:  Bake all bread before the bakery opens (fast, but fixed)
//   SSR:  Bake bread fresh for every customer (fresh, but slower)
//   CSR:  Give customer raw ingredients + recipe (browser does the work)
//   ISR:  Bake bread, put a timer — re-bake every 10 mins (best of both)
// ============================================

// ============================================
// PATTERN: Rendering Strategies
// ============================================
// Next.js (App Router) signals which strategy via fetch() options and
// segment configs. The key is: what data does this page need, and how fresh?
// ============================================

// ============================================
// FILE 1: app/page.jsx — SSG Homepage
// Blog homepage: list of posts. Changes only when a new post is published.
// Pre-build at deploy time. Zero runtime cost.
// ============================================

// app/page.jsx
export default async function HomePage() {
  // No fetch options = static by default in App Router
  // This runs ONCE at build time, result is baked into static HTML
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=6");
  const posts = await res.json();

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1>The Dev Blog</h1>
      <p style={{ color: "#666" }}>
        Rendered at build time (SSG) — fastest possible delivery
      </p>

      <div style={{ display: "grid", gap: "1.5rem", marginTop: "2rem" }}>
        {posts.map((post) => (
          <article
            key={post.id}
            style={{
              padding: "1.5rem",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              <a href={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
                {post.title}
              </a>
            </h2>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              {post.body.slice(0, 100)}...
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "0.75rem",
                fontSize: "0.75rem",
                background: "#e6fffa",
                color: "#234e52",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              SSG — built at deploy
            </span>
          </article>
        ))}
      </div>
    </main>
  );
}

// WHY SSG here:
// - Blog post list rarely changes
// - SEO critical (Google needs to crawl it)
// - Serve from CDN edge — sub-100ms globally
// - Re-deploy when new posts are published

// ============================================
// FILE 2: app/trending/page.jsx — SSR Trending Page
// Trending posts change by the hour. Must be fresh on every request.
// ============================================

// app/trending/page.jsx
export const dynamic = "force-dynamic"; // Tells Next.js: never cache this route

export default async function TrendingPage() {
  // cache: 'no-store' = SSR: fetch fresh on every request
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_sort=id&_order=desc&_limit=5",
    { cache: "no-store" }
  );
  const trending = await res.json();

  const fetchedAt = new Date().toLocaleTimeString();

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1>Trending Now</h1>
      <p style={{ color: "#666" }}>
        Server-rendered at: <strong>{fetchedAt}</strong> — refresh to see updated time
      </p>
      <p style={{ fontSize: "0.85rem", color: "#999" }}>
        (SSR: each page request triggers a fresh server render + data fetch)
      </p>

      <ol style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
        {trending.map((post, index) => (
          <li
            key={post.id}
            style={{
              padding: "1rem",
              background: index === 0 ? "#fffbeb" : "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              listStyle: "none",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: index === 0 ? "#d97706" : "#94a3b8",
                minWidth: "2rem",
              }}
            >
              #{index + 1}
            </span>
            <div>
              <strong>{post.title}</strong>
              <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
                {post.body.slice(0, 80)}...
              </p>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}

// WHY SSR here:
// - "Trending" is meaningless if it's 6 hours stale
// - Data changes frequently (every few minutes)
// - Still needs SEO (trending content gets shared, linked)
// - Trade-off: slightly slower TTFB than SSG, worth it for freshness

// ============================================
// FILE 3: app/posts/[id]/page.jsx — CSR Comments Section
// Post body is SSG. Comments are user-generated, always changing, no SEO needed.
// Hybrid: server renders post, client fetches comments.
// ============================================

// app/posts/[id]/page.jsx
"use client"; // Needed for useState/useEffect in this component

import { useState, useEffect } from "react";

// This would normally be a Server Component fetching the post,
// with CommentsSection as a "use client" child.
// For this exercise, we'll show the CSR pattern in one component.

export default function PostPage({ params }) {
  const postId = params?.id || 1;

  // CSR state — lives entirely in the browser
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // CSR: fetch comments after component mounts in the browser
  useEffect(() => {
    async function loadComments() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
        );
        if (!res.ok) throw new Error("Failed to load comments");
        const data = await res.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadComments();
  }, [postId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      // Optimistic update: add comment immediately before server confirms
      const optimisticComment = {
        id: Date.now(),
        name: "You",
        email: "you@example.com",
        body: newComment,
        postId,
      };
      setComments((prev) => [optimisticComment, ...prev]);
      setNewComment("");

      // Real API call (jsonplaceholder doesn't persist, just simulates)
      await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newComment, name: "You", email: "you@example.com" }),
      });
    } catch (err) {
      setError("Failed to post comment");
      // Roll back optimistic update on error
      setComments((prev) => prev.filter((c) => c.name !== "You"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section style={{ maxWidth: "700px", margin: "2rem auto", padding: "0 1rem" }}>
      <h2 style={{ borderTop: "1px solid #e2e8f0", paddingTop: "2rem" }}>
        Comments
      </h2>
      <p style={{ fontSize: "0.8rem", color: "#999" }}>
        CSR — fetched in browser after page load. No SEO needed for comments.
      </p>

      {/* Add comment form */}
      <form onSubmit={handleSubmit} style={{ margin: "1rem 0" }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1.5rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comments list */}
      {loading && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
          Loading comments...
        </div>
      )}

      {error && (
        <div style={{ padding: "1rem", background: "#fef2f2", color: "#991b1b", borderRadius: "6px" }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: "grid", gap: "1rem" }}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                padding: "1rem",
                background: "#f8fafc",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <strong style={{ fontSize: "0.9rem" }}>{comment.name}</strong>
                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{comment.email}</span>
              </div>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#475569" }}>{comment.body}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// WHY CSR for comments:
// - Comments are user-specific and always changing → stale cache is bad
// - Comments don't need SEO — search engines don't need to index them
// - Loading state is acceptable UX (spinner while comments load)
// - Enables optimistic updates for better perceived performance

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. What is the key difference between SSR and SSG in Next.js App Router?
//    Hint: Think about WHEN the HTML is generated.
//
// 2. Why would you use CSR for comments but SSG for the post body?
//    What would break if you tried to SSG comments?
//
// 3. What is the problem with using SSR for a page with 10,000 daily visitors?
//    When would SSR be worth that cost anyway?
//
// 4. In the CSR component, what is "optimistic update" and why use it?
//    What is the risk and how do we handle failure?
// ============================================

// ============================================
// YOUR TURN: Add ISR (Incremental Static Regeneration) Page
// ============================================
// Build: app/posts/[id]/page.jsx as a SERVER COMPONENT using ISR
//
// Requirements:
//   1. Fetch the post at BUILD TIME (static), but revalidate every 60 seconds
//      Hint: fetch(url, { next: { revalidate: 60 } })
//
//   2. Generate static params for posts 1–10 at build time
//      Hint: export async function generateStaticParams() { ... }
//
//   3. Show the post title, body, and a "Last updated:" timestamp
//      The timestamp should update every 60 seconds (proving ISR works)
//
//   4. Add a "Related Posts" section that's also ISR (same revalidation)
//
//   5. BONUS: Add on-demand revalidation
//      Create app/api/revalidate/route.js that calls revalidatePath()
//      when triggered with a secret token
//      Hint: import { revalidatePath } from 'next/cache'
//
// Structure to build:
//
// app/posts/[id]/page.jsx (Server Component — ISR)
// export async function generateStaticParams() { ... }
// export default async function PostPage({ params }) { ... }
//
// app/api/revalidate/route.js (on-demand revalidation endpoint)
// export async function POST(request) { ... }
//
// Test it:
//   npm run build → check .next/server/app/posts/ for pre-rendered HTML
//   npm start → visit /posts/1, note timestamp
//   Wait 60 seconds, visit again → timestamp updates (ISR fired)
//   Or: POST to /api/revalidate with secret → instant update

// YOUR CODE BELOW:
// app/posts/[id]/page.jsx — ISR version

export async function generateStaticParams() {
  // YOUR CODE HERE
  // Fetch first 10 posts and return their IDs as params
  // Return format: [{ id: '1' }, { id: '2' }, ...]
}

export default async function PostPageISR({ params }) {
  // YOUR CODE HERE
  // 1. Fetch post with { next: { revalidate: 60 } }
  // 2. Fetch related posts (same user) with same revalidation
  // 3. Show post content + timestamp + related posts
  // 4. Add ISR badge showing revalidation interval
}

// app/api/revalidate/route.js — on-demand revalidation
// export async function POST(request) {
//   YOUR CODE HERE
//   1. Check request body for { secret: '...', path: '/posts/1' }
//   2. Validate secret matches process.env.REVALIDATE_SECRET
//   3. Call revalidatePath(path)
//   4. Return { revalidated: true, now: Date.now() }
// }

// ============================================
// PATTERN LEARNED: Rendering Strategies
// ============================================
// DECISION TREE:
//
//   Does content change?
//   └─ No (or rarely) → Does SEO matter?
//      ├─ Yes → SSG (pre-build, CDN delivery, fastest TTFB)
//      └─ No  → SSG still (same benefit, but lower priority)
//
//   └─ Yes (frequently) → Does SEO matter?
//      ├─ Yes → SSR (fresh on every request) or ISR (fresh every N seconds)
//      │        SSR: user-specific, real-time (stock prices, live feeds)
//      │        ISR: content-specific, scheduled updates (news, products)
//      └─ No  → CSR (fetch in browser, skip server overhead)
//               Comments, preferences, cart, anything behind auth
//
// NEXT.JS APP ROUTER SIGNALS:
//   SSG:  fetch(url)                           → cached forever
//   SSG:  fetch(url, { cache: 'force-cache' }) → same, explicit
//   ISR:  fetch(url, { next: { revalidate: 60 } }) → re-cache every 60s
//   SSR:  fetch(url, { cache: 'no-store' })    → fresh every request
//   SSR:  export const dynamic = 'force-dynamic' → whole route is SSR
//   CSR:  'use client' + useEffect + fetch     → browser-side only
// ============================================
