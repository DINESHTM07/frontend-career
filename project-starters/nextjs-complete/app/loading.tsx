/**
 * app/loading.tsx — Root Loading UI (Server Component)
 *
 * Next.js automatically shows this component while the root page is loading.
 * It wraps the page in a React Suspense boundary under the hood.
 *
 * This is a skeleton loader — it mimics the shape of the actual page so the
 * user doesn't see a blank screen during data fetching.
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero skeleton */}
      <div className="container flex flex-col items-center gap-6 py-24 text-center">
        <Skeleton className="h-8 w-48 rounded-full" />
        <Skeleton className="h-14 w-full max-w-2xl" />
        <Skeleton className="h-6 w-full max-w-xl" />
        <div className="flex gap-4">
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-32" />
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="container">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
