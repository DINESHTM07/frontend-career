import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="container py-12">
      <div className="mb-10 space-y-3">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-6 w-64" />
      </div>
      {/* Search bar skeleton */}
      <Skeleton className="h-10 w-full max-w-md" />
      {/* Post cards skeleton */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-6 space-y-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
