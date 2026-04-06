/**
 * middleware.ts — Next.js Middleware
 *
 * Runs on the EDGE runtime (lightweight V8 isolate, not full Node.js)
 * BEFORE the request reaches any page or API route.
 *
 * Use cases:
 *  - Auth protection: redirect unauthenticated users
 *  - Redirects / rewrites
 *  - A/B testing: rewrite to different pages
 *  - Internationalization: detect locale and redirect
 *  - Rate limiting (with an external store like Upstash Redis)
 *
 * NextAuth exports a `withAuth` middleware wrapper that reads the session
 * JWT cookie. The `authorized` callback decides whether to allow or redirect.
 */

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  // This function runs AFTER the `authorized` callback returns true
  function middleware(req: NextRequest) {
    // You can add custom logic here for authenticated requests
    // e.g., add a custom header, log the request, etc.

    const response = NextResponse.next();

    // Example: add a custom header visible to the page/API route
    response.headers.set("x-middleware-ran", "true");

    return response;
  },
  {
    callbacks: {
      /**
       * authorized({ token }) — return true to allow, false to redirect to signin
       * `token` is the decoded JWT from the session cookie (null if not signed in)
       */
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        // Allow everyone on public routes (middleware still runs but passes through)
        // These are handled in the `matcher` config below, but this is a safety net
        if (pathname.startsWith("/api/auth")) return true;

        // Dashboard requires authentication
        if (pathname.startsWith("/dashboard")) {
          return !!token; // redirect to /api/auth/signin if no token
        }

        // All other matched routes: allow
        return true;
      },
    },
    pages: {
      // Custom sign-in page (if you build one at app/auth/signin/page.tsx)
      // signIn: "/auth/signin",
      signIn: "/api/auth/signin", // default NextAuth sign-in page
    },
  }
);

/**
 * matcher — which routes this middleware runs on.
 *
 * Exclude:
 *  - _next/static (bundled JS/CSS)
 *  - _next/image (optimized images)
 *  - favicon.ico
 *  - Public files in /public
 *
 * The matcher uses path-to-regexp syntax.
 * This config runs middleware on every route EXCEPT the above exclusions.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Files with extensions (e.g. .png, .svg, .jpg)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
