import { Skeleton } from "@/components/ui/skeleton";

export function MenuCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="flex justify-between gap-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-14" />
        </div>
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="mt-2 h-10 w-full" />
      </div>
    </div>
  );
}

export function MenuGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Loading menu">
      {Array.from({ length: count }, (_, i) => (
        <MenuCardSkeleton key={i} />
      ))}
    </div>
  );
}
