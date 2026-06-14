import { SearchExperience } from "@/components/forum/search-experience";
import { Badge } from "@/components/ui/badge";
import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";
import { getDisciplineList } from "@/modules/feed/server/feed-service";
import Link from "next/link";

export const revalidate = 300;

export default async function ExplorePage() {
  const disciplines = await getDisciplineList();

  return (
    <AppLayoutShell navLabel="Explore" navTitle="Unified discovery">
      <div className="space-y-8">
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

        <SearchExperience disciplines={disciplines} />
      </div>
    </AppLayoutShell>
  );
}
