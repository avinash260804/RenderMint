import { Prisma } from "@prisma/client";

import {
  disciplines as mockDisciplines,
  getDisciplineBySlug as getMockDisciplineBySlug,
  getHomeSections,
  getPostBySlug as getMockPostBySlug,
  getPostsByDiscipline as getMockPostsByDiscipline,
  getPostsByType as getMockPostsByType,
  type CommunityPost,
  type CommunityPostType,
  type DisciplineData,
  type DisciplineSlug,
} from "@/lib/mock/community-data";
import { prisma } from "@/server/db/client";
import { getPostBySlug as getPersistedPostBySlug } from "@/modules/posts/server/post-service";

export async function getHomeFeed() {
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
      return getHomeSections();
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
    return getHomeSections();
  }
}

export async function getDisciplineList(): Promise<DisciplineData[]> {
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
      return mockDisciplines;
    }

    return disciplines.map((discipline) => ({
      slug: discipline.slug as DisciplineSlug,
      name: discipline.name,
      description:
        getMockDisciplineBySlug(discipline.slug)?.description ??
        `${discipline.name} discussions, showcases, critique, resources, and help threads.`,
      softwares: discipline.softwares.map((software) => software.name),
      trendingTags: getMockDisciplineBySlug(discipline.slug)?.trendingTags ?? [],
    }));
  } catch {
    return mockDisciplines;
  }
}

export async function getDisciplineFeed(
  slug: string,
  postType?: CommunityPostType,
): Promise<{ discipline: DisciplineData | null; posts: CommunityPost[] }> {
  const fallbackDiscipline = getMockDisciplineBySlug(slug);

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
          ? getMockPostsByType(postType, slug as DisciplineSlug)
          : getMockPostsByDiscipline(slug as DisciplineSlug),
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
          ? getMockPostsByType(postType, slug as DisciplineSlug)
          : getMockPostsByDiscipline(slug as DisciplineSlug);

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
        ? getMockPostsByType(postType, slug as DisciplineSlug)
        : getMockPostsByDiscipline(slug as DisciplineSlug),
    };
  }
}

export async function getThreadBySlug(slug: string) {
  try {
    const persisted = await getPersistedPostBySlug(slug);

    if (persisted) {
      return {
        slug: persisted.slug,
        title: persisted.title,
        type: persisted.postType,
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
    // Fall through to mock content for current static thread pages.
  }

  return getMockPostBySlug(slug) ?? null;
}

export async function getThreadStaticSlugs() {
  const fallback = mockDisciplines.length > 0 ? undefined : undefined;
  void fallback;

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
      return getMockThreadSlugs();
    }

    return posts.map((post) => post.slug);
  } catch {
    return getMockThreadSlugs();
  }
}

function getMockThreadSlugs() {
  return [
    ...new Set(
      [
        ...getHomeSections().trendingDiscussions,
        ...getHomeSections().critiqueRequests,
        ...getHomeSections().featuredShowcases,
        ...getHomeSections().solvedHelp,
        ...getHomeSections().weeklyResources,
      ].map((post) => post.slug),
    ),
  ];
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
      } | true;
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
    tags: post.postTags.map((entry) => entry.tag.slug),
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
