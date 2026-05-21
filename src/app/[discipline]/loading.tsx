import { FeedSkeleton } from "@/components/forum/feed-skeleton";
import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";

export default function DisciplineLoading() {
  return (
    <AppLayoutShell navLabel="Discipline" navTitle="Loading discipline hub...">
      <div className="space-y-4">
        <div className="bg-muted h-28 animate-pulse rounded-2xl" />
        <FeedSkeleton />
      </div>
    </AppLayoutShell>
  );
}
