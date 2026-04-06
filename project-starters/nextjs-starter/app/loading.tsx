/**
 * app/loading.tsx — Root Loading UI [STUB]
 *
 * TODO (Day 1): Replace the placeholder with skeleton loaders that
 * match the shape of your home page content.
 * Use the <Skeleton /> component from "@/components/ui/skeleton".
 *
 * Example:
 *   <Skeleton className="h-14 w-full max-w-2xl" />
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-16 space-y-6">
      {/* TODO: Add Skeleton shapes that match your home page layout */}
      <Skeleton className="h-12 w-64 mx-auto" />
      <Skeleton className="h-6 w-96 mx-auto" />
      <div className="grid gap-4 sm:grid-cols-3 mt-8">
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
      </div>
    </div>
  );
}
