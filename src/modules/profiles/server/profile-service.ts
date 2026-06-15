import { ConflictError, NotFoundError } from "@/lib/errors";
import { sanitizeText, sanitizeUrl } from "@/lib/sanitize";
import type { ProfileUpdateInput } from "@/modules/profiles/schemas/profile-schema";
import { prisma } from "@/server/db/client";

export async function getProfileByUsername(username: string) {
  const profile = await prisma.profile.findUnique({
    where: { username: username.trim().toLowerCase() },
    select: profileSelect,
  });

  if (!profile) {
    throw new NotFoundError("Profile not found.");
  }

  return mapProfile(profile, await getProfileStats(profile.id));
}

export async function getProfileById(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: profileSelect,
  });

  if (!profile) {
    throw new NotFoundError("Profile not found.");
  }

  return mapProfile(profile, await getProfileStats(profile.id));
}

export async function updateProfile(userId: string, input: ProfileUpdateInput) {
  const existing = await prisma.profile.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      primaryDiscipline: true,
    },
  });

  if (!existing) {
    throw new NotFoundError("Profile not found.");
  }

  if (input.username && input.username !== existing.username) {
    const usernameOwner = await prisma.profile.findUnique({
      where: { username: input.username },
      select: { id: true },
    });

    if (usernameOwner && usernameOwner.id !== userId) {
      throw new ConflictError("Username is already taken.");
    }
  }

  const nextDiscipline = input.primaryDiscipline ?? existing.primaryDiscipline ?? undefined;

  if (input.primaryDiscipline) {
    const discipline = await prisma.discipline.findUnique({
      where: { slug: input.primaryDiscipline },
      select: { id: true },
    });

    if (!discipline) {
      throw new NotFoundError("Selected discipline does not exist.");
    }
  }

  if (input.softwareIds && input.softwareIds.length > 0) {
    const discipline = nextDiscipline
      ? await prisma.discipline.findUnique({
          where: { slug: nextDiscipline },
          select: { id: true },
        })
      : null;

    if (!discipline) {
      throw new NotFoundError("Select a discipline before assigning software.");
    }

    const validSoftwares = await prisma.software.findMany({
      where: {
        id: { in: input.softwareIds },
        disciplineId: discipline.id,
      },
      select: { id: true },
    });

    if (validSoftwares.length !== input.softwareIds.length) {
      throw new NotFoundError("One or more selected softwares are invalid for this discipline.");
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.profile.update({
      where: { id: userId },
      data: {
        username: input.username,
        bio: input.bio !== undefined ? sanitizeText(input.bio) : undefined,
        avatarUrl:
          input.avatarUrl === undefined
            ? undefined
            : input.avatarUrl
              ? sanitizeUrl(input.avatarUrl)
              : null,
        experienceLevel: input.experienceLevel,
        skills: input.skills,
        primaryDiscipline: input.primaryDiscipline,
      },
    });

    if (input.softwareIds) {
      await tx.profileSoftware.deleteMany({
        where: { profileId: userId },
      });

      if (input.softwareIds.length > 0) {
        await tx.profileSoftware.createMany({
          data: input.softwareIds.map((softwareId) => ({
            profileId: userId,
            softwareId,
          })),
          skipDuplicates: true,
        });
      }
    }
  });

  return getProfileById(userId);
}

export async function getProfileStats(userId: string) {
  const [postCount, commentCount, acceptedAnswerCount] = await Promise.all([
    prisma.post.count({
      where: {
        authorId: userId,
      },
    }),
    prisma.comment.count({
      where: {
        authorId: userId,
      },
    }),
    prisma.comment.count({
      where: {
        authorId: userId,
        isSolution: true,
      },
    }),
  ]);

  return {
    postCount,
    commentCount,
    acceptedAnswerCount,
  };
}

export async function getProfilePosts(userId: string) {
  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
      discipline: {
        select: {
          slug: true,
          name: true,
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

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    type: post.postType,
    bodyPreview: post.body ?? "",
    discipline: {
      slug: post.discipline.slug,
      name: post.discipline.name,
    },
    software: post.software?.name ?? null,
    tags: post.postTags.map((entry) => entry.tag.name),
    createdAt: post.createdAt.toISOString(),
    commentCount: post.commentCount,
    voteCount: post.voteCount,
    solved: post.isSolved,
  }));
}

const profileSelect = {
  id: true,
  username: true,
  avatarUrl: true,
  bio: true,
  experienceLevel: true,
  skills: true,
  primaryDiscipline: true,
  reputation: true,
  createdAt: true,
  discipline: {
    select: {
      id: true,
      slug: true,
      name: true,
    },
  },
  profileSoftwares: {
    select: {
      software: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      software: {
        name: "asc",
      },
    },
  },
} as const;

function mapProfile(
  profile: {
    id: string;
    username: string;
    avatarUrl: string | null;
    bio: string | null;
    experienceLevel: string | null;
    skills: string[];
    primaryDiscipline: string | null;
    reputation: number;
    createdAt: Date;
    discipline: {
      id: number;
      slug: string;
      name: string;
    } | null;
    profileSoftwares: Array<{
      software: {
        id: number;
        name: string;
        slug: string;
      };
    }>;
  },
  stats: Awaited<ReturnType<typeof getProfileStats>>,
) {
  return {
    id: profile.id,
    username: profile.username,
    avatarUrl: profile.avatarUrl,
    bio: profile.bio,
    experienceLevel: profile.experienceLevel,
    skills: profile.skills,
    primaryDiscipline: profile.primaryDiscipline,
    discipline: profile.discipline,
    reputation: profile.reputation,
    createdAt: profile.createdAt.toISOString(),
    softwares: profile.profileSoftwares.map((entry) => entry.software),
    stats: {
      ...stats,
      reputation: profile.reputation,
    },
  };
}
