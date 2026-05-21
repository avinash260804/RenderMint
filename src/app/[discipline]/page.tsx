import { notFound } from "next/navigation";

import { DisciplineTabs } from "@/components/forum/discipline-tabs";
import { PostGrid } from "@/components/forum/post-grid";
import { Badge } from "@/components/ui/badge";
import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";
import {
  disciplines,
  getDisciplineBySlug,
  getPostsByDiscipline,
  type DisciplineSlug,
} from "@/lib/mock/community-data";

export const revalidate = 300;

export function generateStaticParams() {
  return disciplines.map((discipline) => ({ discipline: discipline.slug }));
}

export default function DisciplineHubPage({ params }: { params: { discipline: string } }) {
  const discipline = getDisciplineBySlug(params.discipline);

  if (!discipline) {
    notFound();
  }

  const posts = getPostsByDiscipline(discipline.slug as DisciplineSlug);

  return (
    <AppLayoutShell navLabel="Discipline Hub" navTitle={`${discipline.name} community`}>
      <div className="space-y-6">
        <section className="border-border/70 bg-card/70 space-y-4 rounded-2xl border p-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.12em]">
            {discipline.name}
          </p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">
            {discipline.name} Hub
          </h1>
          <p className="text-muted-foreground text-sm">{discipline.description}</p>
          <div className="flex flex-wrap gap-2">
            {discipline.softwares.map((software) => (
              <Badge key={software} variant="outline" className="rounded-lg">
                {software}
              </Badge>
            ))}
          </div>
          <DisciplineTabs discipline={discipline.slug} />
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Active threads</h2>
          <PostGrid posts={posts.slice(0, 6)} />
        </section>
      </div>
    </AppLayoutShell>
  );
}
