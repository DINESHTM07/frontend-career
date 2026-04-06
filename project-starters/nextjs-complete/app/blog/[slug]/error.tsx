"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container max-w-3xl flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-bold">Failed to load post</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/blog">Back to blog</Link>
        </Button>
      </div>
    </div>
  );
}
