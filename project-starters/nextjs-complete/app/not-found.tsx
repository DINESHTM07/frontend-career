/**
 * app/not-found.tsx — 404 Page (Server Component)
 *
 * Shown whenever notFound() is called in a page/layout, or when no route matches.
 * You can also trigger it programmatically: import { notFound } from 'next/navigation'
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-8xl font-black text-muted-foreground/30">404</p>
      <h2 className="text-3xl font-bold">Page not found</h2>
      <p className="max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
