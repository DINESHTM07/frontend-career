/**
 * components/layout/Footer.tsx — Footer (Server Component)
 *
 * No interactivity needed — stays a Server Component.
 */

import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Resources: [
    { label: "Next.js Docs", href: "https://nextjs.org/docs" },
    { label: "Shadcn/UI", href: "https://ui.shadcn.com" },
    { label: "Supabase Docs", href: "https://supabase.com/docs" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Zap className="h-5 w-5 text-primary" />
              NextJS App
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              A production-ready Next.js 14 starter with App Router, Shadcn/UI,
              NextAuth, and Supabase.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NextJS App. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with Next.js 14 + Shadcn/UI
          </p>
        </div>
      </div>
    </footer>
  );
}
