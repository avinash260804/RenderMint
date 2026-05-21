import { SearchExperience } from "@/components/forum/search-experience";
import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";

export const revalidate = 300;

export default function ExplorePage() {
  return (
    <AppLayoutShell navLabel="Explore" navTitle="Unified discovery">
      <SearchExperience />
    </AppLayoutShell>
  );
}
