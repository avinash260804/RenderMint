import { notFound } from "next/navigation";

import { DisciplineTabs } from "@/components/forum/discipline-tabs";
import { PostGrid } from "@/components/forum/post-grid";
import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";
import {
  disciplines,
  getDisciplineBySlug,
  getPostsByType,
  type DisciplineSlug,
} from "@/lib/mock/community-data";

export const revalidate = 300;

export function generateStaticParams() {
  return disciplines.map((discipline) => ({ discipline: discipline.slug }));
}

export default function DisciplineShowcasePage({ params }: { params: { discipline: string } }) {
  const discipline = getDisciplineBySlug(params.discipline);
  if (!discipline) notFound();

  const posts = getPostsByType("showcase", discipline.slug as DisciplineSlug);

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
