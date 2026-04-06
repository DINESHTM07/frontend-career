import { Skeleton } from "@/components/ui/skeleton";

// TODO: Match the shape of your about page layout
export default function AboutLoading() {
  return (
    <div className="container py-12 space-y-10">
      <Skeleton className="h-12 w-48" />
      <Skeleton className="h-6 w-72" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
