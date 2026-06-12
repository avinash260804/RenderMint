import { prisma } from "@/server/db/client";

export async function recalculateReputation(userId: string) {
  const [
    acceptedAnswers,
    critiqueContributions,
    commentUpvotes,
    postUpvotes,
    discussionPosts,
    discussionComments,
  ] = await Promise.all([
    prisma.comment.count({
      where: {
        authorId: userId,
        deletedAt: null,
        isSolution: true,
      } as never,
    }),
    prisma.comment.count({
      where: {
        authorId: userId,
        deletedAt: null,
        post: {
          postType: "critique",
          deletedAt: null,
        },
      } as never,
    }),
    prisma.vote.count({
      where: {
        targetType: "comment",
        voteType: "up",
        comment: {
          authorId: userId,
          deletedAt: null,
        },
      } as never,
    }),
    prisma.vote.count({
      where: {
        targetType: "post",
        voteType: "up",
        post: {
          authorId: userId,
          deletedAt: null,
        },
      } as never,
    }),
    prisma.post.count({
      where: {
        authorId: userId,
        deletedAt: null,
        postType: "discussion",
      } as never,
    }),
    prisma.comment.count({
      where: {
        authorId: userId,
        deletedAt: null,
        post: {
          postType: "discussion",
          deletedAt: null,
        },
      } as never,
    }),
  ]);

  const reputation =
    acceptedAnswers * 5 +
    critiqueContributions * 3 +
    commentUpvotes * 2 +
    postUpvotes * 2 +
    discussionPosts +
    discussionComments;

  await prisma.profile.updateMany({
    where: { id: userId },
    data: { reputation },
  });

  return reputation;
}
