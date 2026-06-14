"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { PostGrid } from "@/components/forum/post-grid";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { CommunityPost, CommunityPostType, DisciplineData } from "@/lib/community/catalog";

type SearchApiResponse = {
  data: Array<{
    id: string;
    slug: string;
    title: string;
    discipline: string;
    software?: string;
    postType: CommunityPostType;
    solved: boolean;
    tags: string[];
    bodyPreview: string;
    createdAt: string;
  }>;
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
};

const postTypes: CommunityPostType[] = ["discussion", "critique", "showcase", "help", "resource"];

type SearchExperienceProps = {
  disciplines: DisciplineData[];
};

export function SearchExperience({ disciplines }: SearchExperienceProps) {
  const initialParams =
    typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
  const [q, setQ] = useState(initialParams.get("q") ?? "");
  const [discipline, setDiscipline] = useState(initialParams.get("discipline") ?? "");
  const [software, setSoftware] = useState("");
  const [postType, setPostType] = useState<"" | CommunityPostType>(
    (initialParams.get("postType") as CommunityPostType | null) ?? "",
  );
  const [solved, setSolved] = useState<"" | "true" | "false">(
    (initialParams.get("solved") as "true" | "false" | null) ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchApiResponse | null>(null);
  const deferredQuery = useDeferredValue(q);

  const softwareOptions = useMemo(() => {
    if (!discipline) {
      return Array.from(new Set(disciplines.flatMap((item) => item.softwares)));
    }

    return disciplines.find((item) => item.slug === discipline)?.softwares ?? [];
  }, [discipline, disciplines]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (deferredQuery.trim()) params.set("q", deferredQuery.trim());
      if (discipline) params.set("discipline", discipline);
      if (software) params.set("software", software);
      if (postType) params.set("postType", postType);
      if (solved) params.set("solved", solved);
      params.set("page", "1");
      params.set("pageSize", "24");

      const response = await fetch(`/api/search?${params.toString()}`, {
        signal: controller.signal,
      });

      const payload = (await response.json().catch(() => null)) as
        | SearchApiResponse
        | { error?: { message?: string } }
        | null;

      if (!response.ok) {
        setError(
          (payload as { error?: { message?: string } } | null)?.error?.message ??
            "Search request failed.",
        );
        setLoading(false);
        return;
      }

      setResult(payload as SearchApiResponse);
      setLoading(false);
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [deferredQuery, discipline, software, postType, solved]);

  const posts: CommunityPost[] =
    result?.data.map((item) => ({
      id: item.id,
      slug: item.slug,
      discipline: item.discipline as CommunityPost["discipline"],
      type: item.postType,
      title: item.title,
      author: "Community member",
      bodyPreview: item.bodyPreview,
      createdAt: item.createdAt,
      tags: item.tags,
      software: item.software,
      solved: item.solved,
      answerCount: item.postType === "help" ? (item.solved ? 1 : 0) : undefined,
    })) ?? [];

  return (
    <div className="space-y-6">
      <section className="border-border/70 bg-card/70 rounded-2xl border p-5">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal className="text-muted-foreground size-4" />
          <p className="text-sm font-medium">Search & filters</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative md:col-span-2 xl:col-span-2">
            <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              aria-label="Search"
              data-testid="search-input"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search title, body preview, software, tags..."
              className="pl-9"
            />
          </div>

          <select
            aria-label="Discipline filter"
            className="border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 h-8 rounded-lg border bg-transparent px-2.5 text-sm outline-none"
            value={discipline}
            onChange={(event) => {
              setDiscipline(event.target.value);
              setSoftware("");
            }}
          >
            <option value="">All disciplines</option>
            {disciplines.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Software filter"
            className="border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 h-8 rounded-lg border bg-transparent px-2.5 text-sm outline-none"
            value={software}
            onChange={(event) => setSoftware(event.target.value)}
          >
            <option value="">All software</option>
            {softwareOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            aria-label="Post type filter"
            className="border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 h-8 rounded-lg border bg-transparent px-2.5 text-sm outline-none"
            value={postType}
            onChange={(event) => setPostType((event.target.value as CommunityPostType) || "")}
          >
            <option value="">All post types</option>
            {postTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            aria-label="Solved state filter"
            className="border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 h-8 rounded-lg border bg-transparent px-2.5 text-sm outline-none"
            value={solved}
            onChange={(event) => setSolved((event.target.value as "true" | "false") || "")}
          >
            <option value="">All solved states</option>
            <option value="true">Solved only</option>
            <option value="false">Unsolved/other</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="rounded-lg px-3 py-1">
            Ranking: relevance
          </Badge>
          <Badge variant="outline" className="rounded-lg px-3 py-1">
            solved help boost
          </Badge>
          <Badge variant="outline" className="rounded-lg px-3 py-1">
            engagement
          </Badge>
          <Badge variant="outline" className="rounded-lg px-3 py-1">
            freshness
          </Badge>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold tracking-tight">Search results</h3>
          <p className="text-muted-foreground text-sm">
            {result ? `${result.meta.total} matches` : "Loading..."}
          </p>
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="bg-muted h-16 animate-pulse rounded-xl" />
            <div className="bg-muted h-16 animate-pulse rounded-xl" />
          </div>
        ) : error ? (
          <div className="text-destructive border-destructive/30 bg-destructive/5 rounded-xl border px-4 py-3 text-sm">
            {error}
          </div>
        ) : (
          <div data-testid={posts.length > 0 ? "search-results" : "empty-search"}>
            <PostGrid
              posts={posts}
              emptyTitle="No search matches"
              emptyDescription="Try broadening filters or searching with fewer keywords."
            />
          </div>
        )}
      </section>
    </div>
  );
}
