import { SearchExperience } from "@/components/forum/search-experience";
import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";
import { getDisciplineList } from "@/modules/feed/server/feed-service";

export const revalidate = 300;

export default async function ExplorePage() {
  const disciplines = await getDisciplineList();

  return (
    <AppLayoutShell navLabel="Explore" navTitle="Unified discovery">
      <SearchExperience disciplines={disciplines} />
    </AppLayoutShell>
  );
}
