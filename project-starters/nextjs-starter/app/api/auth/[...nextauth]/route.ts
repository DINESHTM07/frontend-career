/**
 * app/api/auth/[...nextauth]/route.ts — NextAuth Route Handler
 *
 * This file is COMPLETE — no changes needed.
 * The configuration lives in lib/auth.ts.
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
