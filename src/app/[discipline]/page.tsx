import { notFound } from "next/navigation";

import { DisciplineTabs } from "@/components/forum/discipline-tabs";
import { PostGrid } from "@/components/forum/post-grid";
import { Badge } from "@/components/ui/badge";
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

export default async function DisciplineHubPage({ params }: DisciplinePageProps) {
  const { discipline: disciplineSlug } = await params;
  const { discipline, posts } = await getDisciplineFeed(disciplineSlug);

  if (!discipline) {
    notFound();
  }

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
