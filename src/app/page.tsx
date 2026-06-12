import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PostGrid } from "@/components/forum/post-grid";
import { Badge } from "@/components/ui/badge";
import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";
import { typographyTokens } from "@/components/ui-system/tokens";
import { getDisciplineList, getHomeFeed } from "@/modules/feed/server/feed-service";

export const revalidate = 300;

export default async function HomePage() {
  const [sections, disciplines] = await Promise.all([getHomeFeed(), getDisciplineList()]);

  return (
    <AppLayoutShell navLabel="Home" navTitle="Community-first discovery for designers">
      <div className="space-y-10">
        <section className="border-border/70 bg-card/75 space-y-4 rounded-2xl border p-6 sm:p-8">
          <Badge variant="outline" className="rounded-lg uppercase tracking-[0.12em]">
            Designers Hub
          </Badge>
          <h1 className="text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            The community where designers discuss, critique, improve, and solve together.
          </h1>
          <p className={typographyTokens.body}>
            Structured spaces for architecture-first collaboration with clear navigation and
            readable, image-friendly feeds.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Trending Discussions</h2>
            <Link
              href="/architecture/discussions"
              className="text-primary inline-flex items-center gap-1 text-sm"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          <PostGrid posts={sections.trendingDiscussions.slice(0, 3)} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Recent Critiques</h2>
          <PostGrid posts={sections.critiqueRequests.slice(0, 3)} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Featured Showcases</h2>
          <PostGrid posts={sections.featuredShowcases.slice(0, 3)} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Recently Solved Help</h2>
          <PostGrid posts={sections.solvedHelp.slice(0, 3)} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Explore by Discipline</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {disciplines.map((discipline) => (
              <Link
                key={discipline.slug}
                href={`/${discipline.slug}`}
                className="border-border/70 bg-card/70 hover:bg-card rounded-xl border p-4 transition-colors"
              >
                <p className="text-muted-foreground text-sm uppercase tracking-[0.1em]">
                  Discipline
                </p>
                <p className="mt-1 text-lg font-semibold tracking-tight">{discipline.name}</p>
                <p className="text-muted-foreground mt-2 text-sm">{discipline.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppLayoutShell>
  );
}
