/**
 * app/api/auth/[...nextauth]/route.ts — NextAuth.js Route Handler
 *
 * The [...nextauth] catch-all segment handles ALL NextAuth endpoints:
 *   GET  /api/auth/signin
 *   GET  /api/auth/signout
 *   GET  /api/auth/callback/google
 *   GET  /api/auth/session
 *   GET  /api/auth/csrf
 *   GET  /api/auth/providers
 *
 * We import `authOptions` from lib/auth.ts to keep config separate and
 * reusable (e.g., getServerSession(authOptions) in server components).
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Next.js App Router: export named GET and POST handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
