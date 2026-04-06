/**
 * lib/auth.ts — NextAuth.js Configuration
 *
 * `authOptions` is exported and used in two places:
 *  1. app/api/auth/[...nextauth]/route.ts — handles auth API routes
 *  2. Any Server Component/API route that calls getServerSession(authOptions)
 *
 * Providers configured:
 *  - GoogleProvider: OAuth 2.0 via Google (requires GOOGLE_CLIENT_ID + SECRET)
 *
 * To add more providers, install their packages and add them to `providers`.
 * Full list: https://next-auth.js.org/providers/
 */

import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { SupabaseAdapter } from "@auth/supabase-adapter"; // persist sessions to Supabase

export const authOptions: NextAuthOptions = {
  // ─── Providers ─────────────────────────────────────────────────────────────
  providers: [
    GoogleProvider({
      // These MUST be set in .env.local (never committed to git)
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // Request additional Google scopes if needed
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),

    // ── GitHub (uncomment to enable) ──────────────────────────────────────
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID ?? "",
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    // }),

    // ── Email/Password (uncomment to enable) ──────────────────────────────
    // CredentialsProvider({
    //   name: "credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     // Verify against your database here
    //     // Return user object or null
    //     const user = await verifyUser(credentials?.email, credentials?.password);
    //     return user ?? null;
    //   },
    // }),
  ],

  // ─── Database Adapter (optional) ───────────────────────────────────────────
  // Without an adapter, sessions are stored as JWTs in cookies (stateless).
  // With an adapter, sessions are stored in your database (more secure, revocable).
  //
  // adapter: SupabaseAdapter({
  //   url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  // }),

  // ─── Session Strategy ──────────────────────────────────────────────────────
  session: {
    strategy: "jwt", // "jwt" (default, stateless) or "database" (requires adapter)
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ─── JWT Configuration ─────────────────────────────────────────────────────
  jwt: {
    // Secret for signing JWTs — use NEXTAUTH_SECRET env var in production
    // maxAge defaults to session.maxAge
  },

  // ─── Callbacks ─────────────────────────────────────────────────────────────
  callbacks: {
    /**
     * jwt() — called when a JWT is created or updated.
     * Add custom fields to the token here (e.g., user role from your DB).
     * The token is stored in an encrypted cookie.
     */
    async jwt({ token, user, account }) {
      // `user` is only available on the first sign-in
      if (user) {
        token.id = user.id;
      }
      // `account` is available on first sign-in (has provider access token)
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    /**
     * session() — shapes the session object returned to the client.
     * Only include what the client needs — don't expose sensitive data.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },

    /**
     * signIn() — control whether a sign-in is allowed.
     * Return true to allow, false to deny, or a URL string to redirect.
     */
    async signIn({ user, account, profile }) {
      // Example: only allow users from a specific email domain
      // if (!user.email?.endsWith("@yourcompany.com")) return false;
      return true;
    },
  },

  // ─── Pages ─────────────────────────────────────────────────────────────────
  // Override default NextAuth pages with your own
  // pages: {
  //   signIn: "/auth/signin",   // app/auth/signin/page.tsx
  //   signOut: "/auth/signout",
  //   error: "/auth/error",
  //   verifyRequest: "/auth/verify-request",
  // },

  // ─── Events ────────────────────────────────────────────────────────────────
  events: {
    // Log sign-ins for auditing
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
    },
  },

  // NEXTAUTH_SECRET is required in production
  secret: process.env.NEXTAUTH_SECRET,

  // Enable debug logs in development
  debug: process.env.NODE_ENV === "development",
};
