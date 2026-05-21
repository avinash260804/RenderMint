import { FeedSkeleton } from "@/components/forum/feed-skeleton";
import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";

export default function ExploreLoading() {
  return (
    <AppLayoutShell navLabel="Explore" navTitle="Unified discovery">
      <div className="space-y-4">
        <div className="bg-muted h-24 animate-pulse rounded-2xl" />
        <FeedSkeleton />
      </div>
    </AppLayoutShell>
  );
}
