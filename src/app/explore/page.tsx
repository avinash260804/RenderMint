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
        <section className="space-y-2">
          <h1 className="font-serif text-3xl font-semibold tracking-tight">
            Explore design knowledge
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-6">
            Browse disciplines, filter active threads, and find community knowledge across
            discussions, critique, showcase, help, and resources.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {disciplines.map((discipline) => (
            <Link
              key={discipline.slug}
              href={`/${discipline.slug}`}
              data-testid="discipline-card"
              className="border-border/70 bg-card/70 hover:bg-card rounded-xl border p-4 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-muted-foreground text-xs uppercase tracking-[0.1em]">
                  Discipline
                </p>
                <Badge variant="outline">{discipline.softwares.length} tools</Badge>
              </div>
              <p className="mt-2 text-lg font-semibold tracking-tight">{discipline.name}</p>
              <p className="text-muted-foreground mt-2 text-sm">{discipline.description}</p>
              <p className="text-muted-foreground mt-3 text-xs">0+ active threads</p>
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
