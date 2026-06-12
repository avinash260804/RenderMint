import { Prisma } from "@prisma/client";

import { canAttemptDatabaseQuery } from "@/lib/db/availability";
import type { SearchQuery, SearchResultItem } from "@/modules/search/schemas/search-schema";
import { prisma } from "@/server/db/client";

type SearchPayload = {
  total: number;
  page: number;
  pageSize: number;
  items: SearchResultItem[];
};

type SearchPostRecord = Prisma.PostGetPayload<{
  include: {
    discipline: {
      select: {
        slug: true;
      };
    };
    software: {
      select: {
        name: true;
      };
    };
    postTags: {
      include: {
        tag: true;
      };
    };
  };
}>;

const MAX_SEARCH_CANDIDATES = 200;

export async function searchPosts(query: SearchQuery): Promise<SearchPayload> {
  if (!(await canAttemptDatabaseQuery())) {
    return emptySearchPayload(query);
  }

  try {
    return await performDatabaseSearch(query);
  } catch {
    return emptySearchPayload(query);
  }
}

async function performDatabaseSearch(query: SearchQuery): Promise<SearchPayload> {
  const queryText = (query.q ?? "").toLowerCase();
  const tokens = tokenize(queryText);
  const textFilters = buildTextFilters(tokens);

  const posts = await prisma.post.findMany({
    where: {
      deletedAt: null,
      ...(query.discipline ? { discipline: { slug: query.discipline } } : {}),
      ...(query.software
        ? {
            software: {
              OR: [
                { slug: normalizeSlug(query.software) },
                { name: { equals: query.software, mode: "insensitive" } },
              ],
            },
          }
        : {}),
      ...(query.postType ? { postType: query.postType } : {}),
      ...(query.solved === "true" ? { postType: "help", isSolved: true } : {}),
      ...(query.solved === "false" ? { OR: [{ postType: { not: "help" } }, { isSolved: false }] } : {}),
      ...(textFilters.length > 0 ? { OR: textFilters } : {}),
    } as never,
    include: {
      discipline: {
        select: {
          slug: true,
        },
      },
      software: {
        select: {
          name: true,
        },
      },
      postTags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: MAX_SEARCH_CANDIDATES,
  });

  const scored = posts
    .map((post) => mapPostToSearchResult(post, tokens))
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

function buildTextFilters(tokens: string[]): Prisma.PostWhereInput[] {
  if (tokens.length === 0) return [];

  const fields: Array<keyof Prisma.PostWhereInput> = [
    "title",
    "body",
    "context",
    "projectDescription",
    "challengeStatement",
    "feedbackRequested",
    "projectSummary",
    "issueDescription",
    "errorContext",
    "resourceExplanation",
  ];

  return tokens.flatMap((token) => [
    ...fields.map((field) => ({
      [field]: {
        contains: token,
        mode: "insensitive",
      },
    })),
    {
      discipline: {
        OR: [
          { slug: { contains: token, mode: "insensitive" } },
          { name: { contains: token, mode: "insensitive" } },
        ],
      },
    },
    {
      software: {
        OR: [
          { slug: { contains: token, mode: "insensitive" } },
          { name: { contains: token, mode: "insensitive" } },
        ],
      },
    },
    {
      postTags: {
        some: {
          tag: {
            OR: [
              { slug: { contains: token, mode: "insensitive" } },
              { name: { contains: token, mode: "insensitive" } },
            ],
          },
        },
      },
    },
  ]) as Prisma.PostWhereInput[];
}

function mapPostToSearchResult(post: SearchPostRecord, tokens: string[]): SearchResultItem {
  const bodyPreview = createBodyPreview(
    post.body ??
      post.issueDescription ??
      post.projectSummary ??
      post.projectDescription ??
      post.resourceExplanation ??
      post.context,
  );
  const tags = post.postTags.map((entry) => entry.tag.slug);
  const searchable = [
    post.title,
    post.body ?? "",
    post.context ?? "",
    post.projectDescription ?? "",
    post.challengeStatement ?? "",
    post.feedbackRequested ?? "",
    post.projectSummary ?? "",
    post.issueDescription ?? "",
    post.errorContext ?? "",
    post.resourceExplanation ?? "",
    post.discipline.slug,
    post.software?.name ?? "",
    post.postType,
    ...tags,
  ]
    .join(" ")
    .toLowerCase();

  const relevance = scoreRelevance(tokens, searchable, post.title.toLowerCase());
  const solvedBoost = post.postType === "help" && post.isSolved ? 20 : 0;
  const engagementBoost = post.commentCount + post.voteCount + Math.floor(post.viewCount / 10);
  const freshnessBoost = scoreFreshness(post.createdAt);

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    discipline: post.discipline.slug,
    software: post.software?.name ?? undefined,
    postType: post.postType,
    solved: post.isSolved,
    tags,
    bodyPreview,
    score: relevance + solvedBoost + engagementBoost + freshnessBoost,
    createdAt: post.createdAt.toISOString(),
  };
}

function emptySearchPayload(query: SearchQuery): SearchPayload {
  return {
    total: 0,
    page: query.page,
    pageSize: query.pageSize,
    items: [],
  };
}

function tokenize(value: string) {
  return value
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
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

function scoreFreshness(createdAt: Date) {
  const now = Date.now();
  const ageDays = Math.max(0, (now - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, 15 - ageDays);
}

function createBodyPreview(value: string | null | undefined) {
  if (!value) return "";
  return value.length > 180 ? `${value.slice(0, 177)}...` : value;
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
