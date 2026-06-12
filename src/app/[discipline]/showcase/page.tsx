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

type DisciplinePageProps = {
  params: Promise<{ discipline: string }> | { discipline: string };
};

export default async function DisciplineShowcasePage({ params }: DisciplinePageProps) {
  const { discipline: disciplineSlug } = await params;
  const { discipline, posts } = await getDisciplineFeed(disciplineSlug, "showcase");
  if (!discipline) notFound();

  return (
    <AppLayoutShell navLabel="Showcase" navTitle={`${discipline.name} showcase`}>
      <div className="space-y-5">
        <DisciplineTabs discipline={discipline.slug} />
        <PostGrid
          posts={posts}
          emptyTitle="No showcases yet"
          emptyDescription="Publish finished work and visual explorations in this space."
        />
      </div>
    </AppLayoutShell>
  );
}
