"use client";

/**
 * components/providers.tsx — App-Level Providers (Client Component)
 *
 * This is the pattern for wrapping your app with context providers when
 * using the App Router. Since providers typically require "use client"
 * (they use React context), we extract them into this thin wrapper and
 * import it in the Server Component layout.tsx.
 *
 * This way, the layout stays a Server Component while still having access
 * to client-side context for its children.
 */

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    /**
     * SessionProvider — makes useSession() available to all Client Components.
     * It reads the session from a cookie set by NextAuth's API routes.
     */
    <SessionProvider>
      {/**
       * ThemeProvider (next-themes) — manages dark/light/system theme.
       * attribute="class" — adds "dark" class to <html> for Tailwind dark mode.
       * defaultTheme="system" — respects OS preference on first visit.
       * enableSystem — syncs with prefers-color-scheme media query.
       */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
