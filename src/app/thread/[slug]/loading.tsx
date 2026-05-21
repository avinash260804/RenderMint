import { FeedSkeleton } from "@/components/forum/feed-skeleton";
import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";

export default function ThreadLoading() {
  return (
    <AppLayoutShell navLabel="Thread" navTitle="Loading thread...">
      <div className="space-y-4">
        <div className="bg-muted h-44 animate-pulse rounded-2xl" />
        <FeedSkeleton />
      </div>
    </AppLayoutShell>
  );
}
