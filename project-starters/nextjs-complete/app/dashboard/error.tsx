"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-bold">Dashboard failed to load</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Retry</Button>
    </div>
  );
}
