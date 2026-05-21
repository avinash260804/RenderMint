import { communityPosts } from "@/lib/mock/community-data";
import {
  type SearchQuery,
  type SearchResultItem,
  validDisciplines,
} from "@/modules/search/schemas/search-schema";

const globalSearchCache = globalThis as unknown as {
  sprintSearchCache?: Map<string, { expiresAt: number; payload: ReturnType<typeof performSearch> }>;
};

const searchCache = globalSearchCache.sprintSearchCache ?? new Map();
if (!globalSearchCache.sprintSearchCache) {
  globalSearchCache.sprintSearchCache = searchCache;
}

const SEARCH_TTL_MS = 60 * 1000;

export function searchPosts(query: SearchQuery) {
  const cacheKey = JSON.stringify(query);
  const now = Date.now();
  const cached = searchCache.get(cacheKey);

  if (cached && cached.expiresAt > now) {
    return cached.payload;
  }

  const payload = performSearch(query);
  searchCache.set(cacheKey, {
    expiresAt: now + SEARCH_TTL_MS,
    payload,
  });

  return payload;
}

function performSearch(query: SearchQuery) {
  const queryText = (query.q ?? "").toLowerCase();
  const tokens = queryText
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  const filtered = communityPosts.filter((post) => {
    if (
      query.discipline &&
      validDisciplines.has(query.discipline) &&
      post.discipline !== query.discipline
    ) {
      return false;
    }

    if (query.software && (post.software ?? "").toLowerCase() !== query.software.toLowerCase()) {
      return false;
    }

    if (query.postType && post.type !== query.postType) {
      return false;
    }

    if (query.solved === "true" && !(post.type === "help" && post.solved)) {
      return false;
    }

    if (query.solved === "false" && post.type === "help" && post.solved) {
      return false;
    }

    return true;
  });

  const scored: SearchResultItem[] = filtered
    .map((post) => {
      const bodyPreview = post.bodyPreview ?? "";
      const searchable = [
        post.title,
        bodyPreview,
        post.discipline,
        post.software ?? "",
        post.type,
        ...(post.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      const relevance = scoreRelevance(tokens, searchable, post.title.toLowerCase());
      const solvedBoost = post.type === "help" && post.solved ? 20 : 0;
      const engagementBoost =
        (post.replyCount ?? 0) + (post.answerCount ?? 0) + (post.iterationCount ?? 0);
      const freshnessBoost = scoreFreshness(post.createdAt);
      const score = relevance + solvedBoost + engagementBoost + freshnessBoost;

      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        discipline: post.discipline,
        software: post.software,
        postType: post.type,
        solved: Boolean(post.solved),
        tags: post.tags ?? [],
        bodyPreview,
        score,
        createdAt: post.createdAt,
      };
    })
    .filter((post) => (tokens.length === 0 ? true : post.score > 0));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.createdAt.localeCompare(a.createdAt);
  });

  const total = scored.length;
  const start = (query.page - 1) * query.pageSize;
  const end = start + query.pageSize;

  return {
    total,
    page: query.page,
    pageSize: query.pageSize,
    items: scored.slice(start, end),
  };
}

function scoreRelevance(tokens: string[], searchable: string, title: string) {
  if (tokens.length === 0) return 0;

  let score = 0;
  for (const token of tokens) {
    if (searchable.includes(token)) score += 12;
    if (title.includes(token)) score += 20;
  }

  return score;
}

function scoreFreshness(createdAt: string) {
  const now = Date.now();
  const createdAtMs = Date.parse(createdAt);

  if (Number.isNaN(createdAtMs)) return 0;

  const ageDays = Math.max(0, (now - createdAtMs) / (1000 * 60 * 60 * 24));
  return Math.max(0, 15 - ageDays);
}
