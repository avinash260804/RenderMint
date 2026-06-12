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

export default async function DisciplineCritiquePage({ params }: { params: { discipline: string } }) {
  const { discipline, posts } = await getDisciplineFeed(params.discipline, "critique");
  if (!discipline) notFound();

  return (
    <AppLayoutShell navLabel="Critique" navTitle={`${discipline.name} critique requests`}>
      <div className="space-y-5">
        <DisciplineTabs discipline={discipline.slug} />
        <PostGrid
          posts={posts}
          emptyTitle="No critique requests yet"
          emptyDescription="Share a work-in-progress to get focused design feedback."
        />
      </div>
    </AppLayoutShell>
  );
}
