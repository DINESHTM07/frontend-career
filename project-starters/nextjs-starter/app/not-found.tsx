/**
 * app/not-found.tsx — 404 Page [STUB]
 *
 * TODO (Day 1): Build a nice 404 page.
 *  - Show a large "404" number in a faded color
 *  - Clear heading and description
 *  - A "Go home" button using <Button asChild><Link href="/">...</Link></Button>
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      {/* TODO: Add a large faded "404" */}
      <h2 className="text-3xl font-bold">Page not found</h2>
      <p className="text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      {/* TODO: Style this properly */}
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
