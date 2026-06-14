/* eslint-disable @typescript-eslint/no-explicit-any */

type PrismaLike = {
  profile: any;
  post: any;
  comment: any;
};

export async function recalculateReputation(prisma: PrismaLike, userId: string) {
  const posts = await prisma.post.findMany({ where: { authorId: userId, deletedAt: null } });
  const comments = await prisma.comment.findMany({ where: { authorId: userId, deletedAt: null } });
  const allPosts = await prisma.post.findMany({ where: { deletedAt: null } });

  const postScore = posts.reduce((total: number, post: any) => total + (post.voteCount ?? 0) * 2, 0);
  const acceptedScore = comments.filter((comment: any) =>
    allPosts.some((post: any) => post.acceptedCommentId === comment.id),
  ).length * 5;
  const participationScore = posts.length + comments.length;
  const reputation = Math.max(0, postScore + acceptedScore + participationScore);

  await prisma.profile.update({ where: { id: userId }, data: { reputation } });
  return reputation;
}
