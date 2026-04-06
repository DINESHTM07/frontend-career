"use client"; // Error boundaries MUST be Client Components

/**
 * app/error.tsx — Root Error Boundary [STUB]
 *
 * This is already wired up. It shows when any page throws an error.
 *
 * TODO (Day 1): Style this up — add an icon, better copy, and a nicer layout.
 * Use the AlertCircle icon from lucide-react and the Button component.
 */

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      {/* TODO: Add an icon here */}
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground">{error.message}</p>
      {/* TODO: Style this button */}
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
