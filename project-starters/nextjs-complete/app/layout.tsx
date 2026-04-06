/**
 * app/layout.tsx — Root Layout (Server Component)
 *
 * This is the outermost layout that wraps every page in the app.
 * It runs on the SERVER by default (no "use client").
 *
 * Responsibilities:
 *  - Set <html> and <body> attributes
 *  - Load global CSS
 *  - Wrap the app in Providers (ThemeProvider, SessionProvider, Toaster)
 *  - Define root-level metadata (can be overridden per page)
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

// next/font/google: downloads the font at build time — no runtime network request
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // exposes it as a CSS variable
});

/**
 * Root metadata — inherited by all pages unless overridden with their own
 * `export const metadata` or `generateMetadata()`.
 */
export const metadata: Metadata = {
  // %s is replaced by the page-level title (see template below)
  title: {
    default: "NextJS App",
    template: "%s | NextJS App",
  },
  description:
    "A fully featured Next.js 14 application with App Router, Shadcn/UI, NextAuth, and Supabase.",
  keywords: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "Your Name" }],
  // OpenGraph — controls how the link looks when shared on social media
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: "NextJS App",
    title: "NextJS App",
    description:
      "A fully featured Next.js 14 application with App Router, Shadcn/UI, NextAuth, and Supabase.",
    images: [
      {
        url: "https://your-domain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "NextJS App",
      },
    ],
  },
  // Twitter card
  twitter: {
    card: "summary_large_image",
    title: "NextJS App",
    description: "A fully featured Next.js 14 application.",
    images: ["https://your-domain.com/og-image.png"],
  },
  // robots.txt behavior
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: next-themes adds "class" to <html> on the
    // client after hydration, which would cause a mismatch warning without this
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/*
         * Providers wraps the entire app with:
         *  - ThemeProvider (next-themes) for dark mode
         *  - SessionProvider (next-auth) for auth state
         */}
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            {/* flex-1 pushes the footer to the bottom */}
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          {/* Toaster renders toast notifications from anywhere in the app */}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
