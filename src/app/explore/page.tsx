import Link from "next/link";

import { SearchExperience } from "@/components/forum/search-experience";
import { Badge } from "@/components/ui/badge";
import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";
import { getDisciplineList } from "@/modules/feed/server/feed-service";
import { searchQuerySchema } from "@/modules/search/schemas/search-schema";
import { searchPosts } from "@/modules/search/server/search-service";

export const revalidate = 300;

type ExplorePageProps = {
  searchParams?: {
    q?: string;
    discipline?: string;
    software?: string;
    postType?: string;
    solved?: string;
    page?: string;
    pageSize?: string;
  };
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const disciplines = await getDisciplineList();

  const parsed = searchQuerySchema.safeParse({
    q: searchParams?.q,
    discipline: searchParams?.discipline,
    software: searchParams?.software,
    postType: searchParams?.postType,
    solved: searchParams?.solved,
    page: searchParams?.page,
    pageSize: searchParams?.pageSize ?? "24",
  });

  const initialQuery = parsed.success ? parsed.data : searchQuerySchema.parse({ pageSize: "24" });
  const initialResult = await searchPosts(initialQuery);

  return (
    <AppLayoutShell navLabel="Explore" navTitle="Unified discovery">
      <div className="space-y-8">
        <section className="atelier-panel overflow-hidden p-6">
          <div className="atelier-community-grid" aria-hidden="true" />
          <div className="relative z-10 space-y-3">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[oklch(0.72_0.08_55)]">
              Community
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Explore design knowledge
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Browse disciplines, filter active threads, and find community knowledge across
              discussions, critique, showcase, help, and resources.
            </p>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {disciplines.map((discipline) => (
            <Link
              key={discipline.slug}
              href={`/${discipline.slug}`}
              data-testid="discipline-card"
              className="atelier-panel block p-4 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Discipline
                </p>
                <Badge
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground"
                >
                  {discipline.softwares.length} tools
                </Badge>
              </div>
              <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">{discipline.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">{discipline.description}</p>
              <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[oklch(0.72_0.08_55)]">
                Active archive route
              </p>
            </Link>
          ))}
        </section>

        <SearchExperience
          disciplines={disciplines}
          initialQuery={initialQuery}
          initialResult={initialResult}
        />
      </div>
    </AppLayoutShell>
  );
}
