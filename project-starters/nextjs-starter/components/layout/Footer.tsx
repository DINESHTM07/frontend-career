/**
 * components/layout/Footer.tsx — Footer [STUB]
 *
 * Server Component (no hooks needed).
 *
 * TODO (Day 1):
 *  1. Add a logo + tagline in the first column
 *  2. Add two link groups: "Product" and "Resources" (with external links)
 *  3. Add a bottom bar with copyright text
 *  4. External links need target="_blank" rel="noopener noreferrer"
 *
 * Hint: Use the same layout pattern as the navbar — "container" class,
 * a grid, and Link from "next/link" for internal links.
 */

import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        {/* TODO: Replace this placeholder with the real footer layout */}
        <div className="flex items-center gap-2 font-bold text-lg mb-4">
          <Zap className="h-5 w-5 text-primary" />
          NextJS App
        </div>

        {/* TODO: Add two link group columns */}
        <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-8 mb-8 text-center text-muted-foreground">
          Footer link groups go here (Product + Resources)
        </div>

        {/* TODO: Bottom bar with copyright */}
        <div className="border-t pt-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} NextJS App
        </div>
      </div>
    </footer>
  );
}
