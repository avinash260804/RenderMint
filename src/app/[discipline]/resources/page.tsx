import { notFound } from "next/navigation";

import { DisciplineTabs } from "@/components/forum/discipline-tabs";
import { PostGrid } from "@/components/forum/post-grid";
import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";
import { getDisciplineFeed, getDisciplineList } from "@/modules/feed/server/feed-service";

export const revalidate = 300;

export async function generateStaticParams() {
  const disciplines = await getDisciplineList();
  return disciplines.map((discipline) => ({ discipline: discipline.slug }));
}

export default async function DisciplineResourcesPage({
  params,
}: {
  params: { discipline: string };
}) {
  const { discipline, posts } = await getDisciplineFeed(params.discipline, "resource");
  if (!discipline) notFound();

  return (
    <AppLayoutShell navLabel="Resources" navTitle={`${discipline.name} resources`}>
      <div className="space-y-5">
        <DisciplineTabs discipline={discipline.slug} />
        <PostGrid
          posts={posts}
          emptyTitle="No resources yet"
          emptyDescription="Share templates, links, and references relevant to this discipline."
        />
      </div>
    </AppLayoutShell>
  );
}
