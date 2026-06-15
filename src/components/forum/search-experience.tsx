"use client";

import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { PostGrid } from "@/components/forum/post-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CommunityPost, CommunityPostType, DisciplineData } from "@/lib/community/catalog";
import type { SearchQuery } from "@/modules/search/schemas/search-schema";
import type { SearchPayload } from "@/modules/search/server/search-service";

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
    pageCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

const postTypes: CommunityPostType[] = ["discussion", "critique", "showcase", "help", "resource"];

type SearchExperienceProps = {
  disciplines: DisciplineData[];
  initialQuery: SearchQuery;
  initialResult: SearchPayload;
};

export function SearchExperience({
  disciplines,
  initialQuery,
  initialResult,
}: SearchExperienceProps) {
  const [q, setQ] = useState(initialQuery.q ?? "");
  const [discipline, setDiscipline] = useState(initialQuery.discipline ?? "");
  const [software, setSoftware] = useState(initialQuery.software ?? "");
  const [postType, setPostType] = useState<"" | CommunityPostType>(initialQuery.postType ?? "");
  const [solved, setSolved] = useState<"" | "true" | "false">(initialQuery.solved ?? "");
  const [page, setPage] = useState(initialQuery.page);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchApiResponse>({
    data: initialResult.items,
    meta: {
      total: initialResult.total,
      page: initialResult.page,
      pageSize: initialResult.pageSize,
      pageCount: initialResult.pageCount,
      hasNextPage: initialResult.hasNextPage,
      hasPrevPage: initialResult.hasPrevPage,
    },
  });
  const deferredQuery = useDeferredValue(q);
  const hasMountedRef = useRef(false);

  const softwareOptions = useMemo(() => {
    if (!discipline) {
      return Array.from(new Set(disciplines.flatMap((item) => item.softwares)));
    }

    return disciplines.find((item) => item.slug === discipline)?.softwares ?? [];
  }, [discipline, disciplines]);

  useEffect(() => {
    if (software && !softwareOptions.includes(software)) {
      setSoftware("");
    }
  }, [software, softwareOptions]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    setPage(1);
  }, [deferredQuery, discipline, software, postType, solved]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      const params = buildParams({
        q: deferredQuery.trim(),
        discipline,
        software,
        postType,
        solved,
        page,
      });

      window.history.replaceState(null, "", params.toString() ? `/search?${params}` : "/search");

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
  }, [deferredQuery, discipline, software, postType, solved, page]);

  const posts: CommunityPost[] = useMemo(
    () =>
      result.data.map((item) => ({
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
      })),
    [result.data],
  );

  const activeFilters = [
    discipline ? `Discipline: ${discipline.replace(/-/g, " ")}` : null,
    software ? `Software: ${software}` : null,
    postType ? `Type: ${postType}` : null,
    solved === "true" ? "Solved only" : null,
    solved === "false" ? "Unsolved or other" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <section className="atelier-panel p-5 sm:p-6">
        <div className="atelier-community-grid" aria-hidden="true" />
        <div className="relative z-10">
          <p className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[oklch(0.72_0.08_55)]">
            Search
          </p>
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <p className="text-base font-semibold text-foreground">Search & filters</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <div className="relative md:col-span-2 xl:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search"
                data-testid="search-input"
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Search title, body preview, software, tags..."
                className="atelier-search-input rounded-2xl pl-9"
              />
            </div>

            <select
              aria-label="Discipline filter"
              className="atelier-select px-3 outline-none"
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
              className="atelier-select px-3 outline-none"
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
              className="atelier-select px-3 outline-none"
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
              className="atelier-select px-3 outline-none"
              value={solved}
              onChange={(event) => setSolved((event.target.value as "true" | "false") || "")}
            >
              <option value="">All solved states</option>
              <option value="true">Solved only</option>
              <option value="false">Unsolved or other</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="atelier-chip" data-active="true">
              Ranking: relevance
            </span>
            <span className="atelier-chip">Solved help boost</span>
            <span className="atelier-chip">Engagement</span>
            <span className="atelier-chip">Freshness</span>
            {activeFilters.map((item) => (
              <span key={item} className="atelier-chip" data-active="true">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[oklch(0.72_0.08_55)]">
              Archive
            </p>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Search results</h3>
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted-foreground">
              {loading
                ? "Refreshing results..."
                : `${result.meta.total} matches · page ${result.meta.page} of ${result.meta.pageCount}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.03] font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={loading || !result.meta.hasPrevPage}
            >
              <ChevronLeft className="size-4" /> Previous
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.03] font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
              onClick={() => setPage((current) => current + 1)}
              disabled={loading || !result.meta.hasNextPage}
            >
              Next <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-28 animate-pulse rounded-2xl border border-white/8 bg-white/[0.04]" />
            <div className="h-28 animate-pulse rounded-2xl border border-white/8 bg-white/[0.04]" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
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

function buildParams(input: {
  q: string;
  discipline: string;
  software: string;
  postType: "" | CommunityPostType;
  solved: "" | "true" | "false";
  page: number;
}) {
  const params = new URLSearchParams();
  if (input.q) params.set("q", input.q);
  if (input.discipline) params.set("discipline", input.discipline);
  if (input.software) params.set("software", input.software);
  if (input.postType) params.set("postType", input.postType);
  if (input.solved) params.set("solved", input.solved);
  params.set("page", String(input.page));
  params.set("pageSize", "24");
  return params;
}
