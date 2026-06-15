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
        isSolution: true,
      },
    }),
    prisma.comment.count({
      where: {
        authorId: userId,
        post: {
          postType: "critique",
          deletedAt: null,
        },
      },
    }),
    prisma.vote.count({
      where: {
        targetType: "comment",
        voteType: "up",
        comment: {
          authorId: userId,
          deletedAt: null,
        },
      },
    }),
    prisma.vote.count({
      where: {
        targetType: "post",
        voteType: "up",
        post: {
          authorId: userId,
          deletedAt: null,
        },
      },
    }),
    prisma.post.count({
      where: {
        authorId: userId,
        postType: "discussion",
      },
    }),
    prisma.comment.count({
      where: {
        authorId: userId,
        post: {
          postType: "discussion",
          deletedAt: null,
        },
      },
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
