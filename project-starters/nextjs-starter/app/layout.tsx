/**
 * app/layout.tsx — Root Layout (Server Component)
 *
 * This file is COMPLETE — it already wires up Providers, Navbar, Footer,
 * and the Toaster. You don't need to change it unless you want to add
 * additional global providers or change the base metadata.
 *
 * What you WILL build:
 *  - Navbar (components/layout/Navbar.tsx) — currently a stub
 *  - Footer (components/layout/Footer.tsx) — currently a stub
 *  - All the page files in app/
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// TODO (Day 5): Flesh out OpenGraph and Twitter metadata
export const metadata: Metadata = {
  title: {
    default: "NextJS App",
    template: "%s | NextJS App",
  },
  description: "My Next.js 14 application.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
