import { Skeleton } from "@/components/ui/skeleton";

export default function PostLoading() {
  return (
    <div className="container max-w-3xl py-12 space-y-6">
      <Skeleton className="h-9 w-28" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-6 w-2/3" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 4 === 3 ? "w-3/4" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}
