import { Skeleton } from "@/components/ui/skeleton";

export function FeedSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="border-border/70 bg-card/70 space-y-3 rounded-xl border p-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      ))}
    </div>
  );
}
