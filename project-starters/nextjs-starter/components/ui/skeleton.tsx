import { cn } from "@/lib/utils";

/**
 * Skeleton — animated loading placeholder.
 * Uses a pulse animation to indicate content is loading.
 * Match the dimensions and shape to the content you're loading.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
