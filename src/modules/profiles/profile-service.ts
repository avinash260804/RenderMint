/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppError } from "@/lib/handle-error";

type PrismaLike = {
  profile: any;
  discipline: any;
  post: any;
  comment?: any;
  software?: any;
  profileSoftware?: any;
  $transaction?: any;
};

export async function getPublicProfile(prisma: PrismaLike, username: string) {
  const profile = await prisma.profile.findUnique({ where: { username } });
  if (!profile) return null;

  const discipline = profile.disciplineId
    ? await prisma.discipline.findUnique({ where: { id: profile.disciplineId } })
    : null;
  const [postCount, commentCount, acceptedAnswerCount, profileSoftwares] = await Promise.all([
    prisma.post.count({
      where: { authorId: profile.id, deletedAt: null },
    }),
    prisma.comment?.count
      ? prisma.comment.count({
          where: { authorId: profile.id, deletedAt: null },
        })
      : Promise.resolve(0),
    prisma.comment?.count
      ? prisma.comment.count({
          where: { authorId: profile.id, deletedAt: null, isSolution: true },
        })
      : Promise.resolve(0),
    prisma.profileSoftware?.findMany
      ? prisma.profileSoftware.findMany({
          where: { profileId: profile.id },
          include: { software: true },
        })
      : Promise.resolve([]),
  ]);

  return {
    ...profile,
    discipline,
    skills: profile.skills ?? [],
    experienceLevel: profile.experienceLevel ?? null,
    softwares: profileSoftwares.map((entry: { software: { name: string } }) => entry.software.name),
    _count: {
      posts: postCount,
      comments: commentCount,
      acceptedAnswers: acceptedAnswerCount,
    },
  };
}

export async function updateProfile(
  prisma: PrismaLike,
  userId: string,
  input: {
    username?: string;
    bio?: string;
    avatarUrl?: string | null;
    experienceLevel?: string;
    skills?: string[];
    primaryDiscipline?: string;
    softwareIds?: number[];
  },
) {
  if (input.username) {
    const owner = await prisma.profile.findUnique({ where: { username: input.username } });
    if (owner && owner.id !== userId) throw new AppError("Username is already taken", 409);
  }

  const discipline =
    input.primaryDiscipline && prisma.discipline?.findUnique
      ? await prisma.discipline.findUnique({ where: { slug: input.primaryDiscipline } })
      : null;

  const data = {
    username: input.username,
    bio: input.bio,
    avatarUrl: input.avatarUrl,
    experienceLevel: input.experienceLevel,
    skills: input.skills,
    primaryDiscipline: input.primaryDiscipline,
    disciplineId: discipline?.id,
  };

  if (input.softwareIds && prisma.profileSoftware && prisma.software) {
    const runUpdate = async (client: PrismaLike) => {
      const updated = await client.profile.update({ where: { id: userId }, data });
      await client.profileSoftware.deleteMany({ where: { profileId: userId } });
      if (input.softwareIds && input.softwareIds.length > 0) {
        await client.profileSoftware.createMany({
          data: input.softwareIds.map((softwareId) => ({
            profileId: userId,
            softwareId,
          })),
          skipDuplicates: true,
        });
      }
      return updated;
    };

    if (typeof prisma.$transaction === "function") {
      return prisma.$transaction((tx: PrismaLike) => runUpdate(tx));
    }

    return runUpdate(prisma);
  }

  return prisma.profile.update({ where: { id: userId }, data });
}
