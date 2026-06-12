import { prisma } from "@/server/db/client";

type TagQuery = {
  q?: string;
  discipline?: string;
  popular?: boolean;
  limit?: number;
};

export async function listTags(query: TagQuery) {
  const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);

  if (query.popular) {
    return getPopularTags({
      discipline: query.discipline,
      limit,
    });
  }

  return prisma.tag.findMany({
    where: {
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" } },
              { slug: { contains: normalizeSlug(query.q), mode: "insensitive" } },
            ],
          }
        : {}),
      ...(query.discipline
        ? {
            postTags: {
              some: {
                post: {
                  deletedAt: null,
                  discipline: {
                    slug: query.discipline,
                  },
                },
              },
            },
          }
        : {}),
    } as never,
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          postTags: true,
        },
      },
    },
    orderBy: [{ name: "asc" }],
    take: limit,
  });
}

async function getPopularTags(input: { discipline?: string; limit: number }) {
  const grouped = await prisma.postTag.groupBy({
    by: ["tagId"],
    where: {
      post: {
        deletedAt: null,
        ...(input.discipline
          ? {
              discipline: {
                slug: input.discipline,
              },
            }
          : {}),
      },
    } as never,
    _count: {
      tagId: true,
    },
    orderBy: {
      _count: {
        tagId: "desc",
      },
    },
    take: input.limit,
  });

  const countsByTagId = new Map(grouped.map((entry) => [entry.tagId, entry._count.tagId]));
  const tags = await prisma.tag.findMany({
    where: {
      id: {
        in: Array.from(countsByTagId.keys()),
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return tags
    .map((tag) => ({
      ...tag,
      postCount: countsByTagId.get(tag.id) ?? 0,
    }))
    .sort((a, b) => b.postCount - a.postCount || a.name.localeCompare(b.name));
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
