import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shown while a lazy route chunk is in flight. Mirrors the page padding used by
 * the real routes so the layout does not jump when the chunk lands.
 */
export function RouteFallback() {
  return (
    <div
      className="container mx-auto px-4 py-8"
      role="status"
      aria-label="Loading page"
    >
      <Skeleton className="h-9 w-64 mb-2 rounded" />
      <Skeleton className="h-4 w-40 mb-8 rounded" />
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}