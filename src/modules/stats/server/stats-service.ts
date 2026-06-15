import { communityCatalogDisciplines, communityCatalogPosts } from "@/lib/community/catalog";
import { canAttemptDatabaseQuery } from "@/lib/db/availability";
import { prisma } from "@/server/db/client";

export type PlatformDisciplineStat = {
  slug: string;
  name: string;
  activeThreads: number;
};

export type PlatformStats = {
  members: number;
  posts: number;
  disciplines: number;
  disciplineBreakdown: PlatformDisciplineStat[];
};

export async function getPlatformStats(): Promise<PlatformStats> {
  if (!(await canAttemptDatabaseQuery())) {
    return getFallbackPlatformStats();
  }

  try {
    const [members, posts, disciplines, groupedPosts] = await Promise.all([
      prisma.profile.count(),
      prisma.post.count({ where: {} }),
      prisma.discipline.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          slug: true,
          name: true,
        },
      }),
      prisma.post.groupBy({
        by: ["disciplineId"],
        where: {},
        _count: {
          _all: true,
        },
      }),
    ]);

    const countByDisciplineId = new Map(
      groupedPosts.map((entry) => [entry.disciplineId, entry._count._all]),
    );

    return {
      members,
      posts,
      disciplines: disciplines.length,
      disciplineBreakdown: disciplines.map((discipline) => ({
        slug: discipline.slug,
        name: discipline.name,
        activeThreads: countByDisciplineId.get(discipline.id) ?? 0,
      })),
    };
  } catch {
    return getFallbackPlatformStats();
  }
}

function getFallbackPlatformStats(): PlatformStats {
  const countByDiscipline = new Map<string, number>();

  for (const post of communityCatalogPosts) {
    countByDiscipline.set(post.discipline, (countByDiscipline.get(post.discipline) ?? 0) + 1);
  }

  return {
    members: 0,
    posts: communityCatalogPosts.length,
    disciplines: communityCatalogDisciplines.length,
    disciplineBreakdown: communityCatalogDisciplines.map((discipline) => ({
      slug: discipline.slug,
      name: discipline.name,
      activeThreads: countByDiscipline.get(discipline.slug) ?? 0,
    })),
  };
}
