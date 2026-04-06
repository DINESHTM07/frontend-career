"use client"; // Error components MUST be Client Components

/**
 * app/error.tsx — Root Error Boundary (Client Component)
 *
 * Catches errors thrown during rendering of the root page.
 * The `error` prop contains the thrown Error object.
 * The `reset` prop is a function that retries the render.
 *
 * Next.js automatically wraps each page in an error boundary using this file.
 */

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string }; // digest is a hash for server errors
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service (e.g. Sentry)
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="container flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="max-w-md text-muted-foreground">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      {/* digest helps match client errors to server logs */}
      {error.digest && (
        <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
      )}
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
