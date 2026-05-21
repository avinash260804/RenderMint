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

export default function DisciplineHelpPage({ params }: { params: { discipline: string } }) {
  const discipline = getDisciplineBySlug(params.discipline);
  if (!discipline) notFound();

  const posts = getPostsByType("help", discipline.slug as DisciplineSlug);

  return (
    <AppLayoutShell navLabel="Help" navTitle={`${discipline.name} help desk`}>
      <div className="space-y-5">
        <DisciplineTabs discipline={discipline.slug} />
        <PostGrid
          posts={posts}
          emptyTitle="No help threads yet"
          emptyDescription="Ask software workflow questions and solve technical blockers here."
        />
      </div>
    </AppLayoutShell>
  );
}
