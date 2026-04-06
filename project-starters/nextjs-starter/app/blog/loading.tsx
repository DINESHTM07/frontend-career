import { Skeleton } from "@/components/ui/skeleton";

// TODO: Match the shape of your blog page layout
export default function BlogLoading() {
  return (
    <div className="container py-12">
      <Skeleton className="h-12 w-24 mb-8" />
      <Skeleton className="h-10 w-full max-w-md mb-8" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-6 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
