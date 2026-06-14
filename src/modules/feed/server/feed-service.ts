import { Prisma } from "@prisma/client";

import {
  communityCatalogDisciplines,
  getCommunityDisciplineBySlug,
  getCommunityHomeSections,
  getCommunityPostBySlug,
  getCommunityPostsByDiscipline,
  getCommunityPostsByType,
  type CommunityPost,
  type CommunityPostType,
  type DisciplineData,
  type DisciplineSlug,
} from "@/lib/community/catalog";
import { canAttemptDatabaseQuery } from "@/lib/db/availability";
import { prisma } from "@/server/db/client";
import { getPostBySlug as getPersistedPostBySlug } from "@/modules/posts/server/post-service";

export async function getHomeFeed() {
  if (!(await canAttemptDatabaseQuery())) {
    return getCommunityHomeSections();
  }

  try {
    const posts = await prisma.post.findMany({
      where: { deletedAt: null } as never,
      include: {
        author: {
          select: {
            username: true,
          },
        },
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
      orderBy: {
        createdAt: "desc",
      },
      take: 24,
    });

    if (posts.length === 0) {
      return getCommunityHomeSections();
    }

    const mapped = posts.map(mapPersistedPostToCommunityPost);

    return {
      trendingDiscussions: mapped.filter((post) => post.type === "discussion"),
      critiqueRequests: mapped.filter((post) => post.type === "critique"),
      featuredShowcases: mapped.filter((post) => post.type === "showcase"),
      solvedHelp: mapped.filter((post) => post.type === "help" && post.solved),
      weeklyResources: mapped.filter((post) => post.type === "resource"),
    };
  } catch {
    return getCommunityHomeSections();
  }
}

export async function getDisciplineList(): Promise<DisciplineData[]> {
  if (!(await canAttemptDatabaseQuery())) {
    return communityCatalogDisciplines;
  }

  try {
    const disciplines = await prisma.discipline.findMany({
      orderBy: { name: "asc" },
      include: {
        softwares: {
          select: {
            name: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    if (disciplines.length === 0) {
      return communityCatalogDisciplines;
    }

    return disciplines.map((discipline) => ({
      slug: discipline.slug as DisciplineSlug,
      name: discipline.name,
      description:
        getCommunityDisciplineBySlug(discipline.slug)?.description ??
        `${discipline.name} discussions, showcases, critique, resources, and help threads.`,
      softwares: discipline.softwares.map((software) => software.name),
      trendingTags: getCommunityDisciplineBySlug(discipline.slug)?.trendingTags ?? [],
    }));
  } catch {
    return communityCatalogDisciplines;
  }
}

export async function getDisciplineFeed(
  slug: string,
  postType?: CommunityPostType,
): Promise<{ discipline: DisciplineData | null; posts: CommunityPost[] }> {
  const fallbackDiscipline = getCommunityDisciplineBySlug(slug);

  if (!(await canAttemptDatabaseQuery())) {
    if (!fallbackDiscipline) return { discipline: null, posts: [] };

    return {
      discipline: fallbackDiscipline,
      posts: postType
        ? getCommunityPostsByType(postType, slug as DisciplineSlug)
        : getCommunityPostsByDiscipline(slug as DisciplineSlug),
    };
  }

  try {
    const discipline = await prisma.discipline.findUnique({
      where: { slug },
      include: {
        softwares: {
          select: {
            name: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    if (!discipline) {
      if (!fallbackDiscipline) return { discipline: null, posts: [] };

      return {
        discipline: fallbackDiscipline,
        posts: postType
          ? getCommunityPostsByType(postType, slug as DisciplineSlug)
          : getCommunityPostsByDiscipline(slug as DisciplineSlug),
      };
    }

    const posts = await prisma.post.findMany({
      where: {
        discipline: { slug },
        deletedAt: null,
        ...(postType ? { postType } : {}),
      } as never,
      include: {
        author: {
          select: {
            username: true,
          },
        },
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
      orderBy: {
        createdAt: "desc",
      },
      take: 24,
    });

    const mappedPosts =
      posts.length > 0
        ? posts.map(mapPersistedPostToCommunityPost)
        : postType
          ? getCommunityPostsByType(postType, slug as DisciplineSlug)
          : getCommunityPostsByDiscipline(slug as DisciplineSlug);

    return {
      discipline: {
        slug: discipline.slug as DisciplineSlug,
        name: discipline.name,
        description:
          fallbackDiscipline?.description ??
          `${discipline.name} discussions, showcases, critique, resources, and help threads.`,
        softwares: discipline.softwares.map((software) => software.name),
        trendingTags: fallbackDiscipline?.trendingTags ?? [],
      },
      posts: mappedPosts,
    };
  } catch {
    if (!fallbackDiscipline) {
      return { discipline: null, posts: [] };
    }

    return {
      discipline: fallbackDiscipline,
      posts: postType
        ? getCommunityPostsByType(postType, slug as DisciplineSlug)
        : getCommunityPostsByDiscipline(slug as DisciplineSlug),
    };
  }
}

export async function getThreadBySlug(slug: string) {
  if (!(await canAttemptDatabaseQuery())) {
    return getCommunityPostBySlug(slug) ?? null;
  }

  try {
    const persisted = await getPersistedPostBySlug(slug);

    if (persisted) {
      return {
        id: persisted.id,
        slug: persisted.slug,
        title: persisted.title,
        type: persisted.postType as CommunityPostType,
        discipline: persisted.discipline.slug as DisciplineSlug,
        software: persisted.software?.name ?? undefined,
        author: persisted.author.username,
        bodyPreview: persisted.body ?? undefined,
        createdAt: persisted.createdAt,
        solved: persisted.isSolved,
        answerCount: persisted.commentCount,
      } satisfies CommunityPost;
    }
  } catch {
    // Fall through to catalog content for current static thread pages.
  }

  return getCommunityPostBySlug(slug) ?? null;
}

export async function getThreadStaticSlugs() {
  if (!(await canAttemptDatabaseQuery())) {
    return getCommunityThreadSlugs();
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        deletedAt: null,
      } as never,
      select: {
        slug: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    if (posts.length === 0) {
      return getCommunityThreadSlugs();
    }

    return posts.map((post) => post.slug);
  } catch {
    return getCommunityThreadSlugs();
  }
}

function getCommunityThreadSlugs() {
  return Array.from(
    new Set(
      [
        ...getCommunityHomeSections().trendingDiscussions,
        ...getCommunityHomeSections().critiqueRequests,
        ...getCommunityHomeSections().featuredShowcases,
        ...getCommunityHomeSections().solvedHelp,
        ...getCommunityHomeSections().weeklyResources,
      ].map((post) => post.slug),
    ),
  );
}

function mapPersistedPostToCommunityPost(
  post: Prisma.PostGetPayload<{
    include: {
      author: {
        select: {
          username: true;
        };
      };
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
  }>,
): CommunityPost {
  return {
    id: post.id,
    slug: post.slug,
    discipline: post.discipline.slug as DisciplineSlug,
    type: post.postType as CommunityPostType,
    title: post.title,
    author: post.author.username,
    bodyPreview: post.body ?? undefined,
    createdAt: post.createdAt.toISOString(),
    tags: post.postTags.flatMap((entry) => (entry.tag.slug ? [entry.tag.slug] : [])),
    replyCount: post.commentCount,
    engagement: post.voteCount > 10 ? "High engagement" : "Active",
    feedbackRequested: post.feedbackRequested ?? undefined,
    iterationCount: post.postType === "critique" ? post.commentCount : undefined,
    creator: post.author.username,
    tools: Array.isArray(post.toolsUsed) ? post.toolsUsed.map(String) : [],
    software: post.software?.name ?? undefined,
    solved: post.isSolved,
    answerCount: post.postType === "help" ? post.commentCount : undefined,
    resourceType: post.postType === "resource" ? "Resource" : undefined,
  };
}
