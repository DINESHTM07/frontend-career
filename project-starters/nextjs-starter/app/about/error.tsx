"use client";

import { Button } from "@/components/ui/button";

export default function AboutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-bold">Failed to load about page</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
