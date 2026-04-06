import { Skeleton } from "@/components/ui/skeleton";

export default function PostLoading() {
  return (
    <div className="container max-w-3xl py-12 space-y-6">
      <Skeleton className="h-9 w-28" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-4/5" />
        <Skeleton className="h-6 w-full max-w-lg" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </div>
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? "w-4/5" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}
