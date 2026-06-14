/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppError } from "@/lib/handle-error";

type PrismaLike = {
  profile: any;
  discipline: any;
  post: any;
};

export async function getPublicProfile(prisma: PrismaLike, username: string) {
  const profile = await prisma.profile.findUnique({ where: { username } });
  if (!profile) return null;

  const discipline = profile.disciplineId
    ? await prisma.discipline.findUnique({ where: { id: profile.disciplineId } })
    : null;
  const postCount = await prisma.post.count({
    where: { authorId: profile.id, deletedAt: null },
  });

  return {
    ...profile,
    discipline,
    _count: {
      posts: postCount,
    },
  };
}

export async function updateProfile(
  prisma: PrismaLike,
  userId: string,
  input: { username?: string; bio?: string },
) {
  if (input.username) {
    const owner = await prisma.profile.findUnique({ where: { username: input.username } });
    if (owner && owner.id !== userId) throw new AppError("Username is already taken", 409);
  }

  return prisma.profile.update({ where: { id: userId }, data: input });
}
