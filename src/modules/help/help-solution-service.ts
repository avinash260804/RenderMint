/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppError } from "@/lib/handle-error";

type PrismaLike = {
  post: any;
  comment: any;
};

export async function markAsSolved(
  prisma: PrismaLike,
  userId: string,
  postId: string,
  commentId: string,
) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.deletedAt) throw new AppError("Post not found", 404);
  if (post.authorId !== userId) throw new AppError("Forbidden", 403);
  if (!isHelpPost(post)) throw new AppError("Only help posts can be solved", 400);

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.postId !== postId) throw new AppError("Invalid solution comment", 400);

  return prisma.post.update({
    where: { id: postId },
    data: { acceptedCommentId: commentId, isSolved: true },
  });
}

export async function clearSolved(prisma: PrismaLike, userId: string, postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.deletedAt) throw new AppError("Post not found", 404);
  if (post.authorId !== userId) throw new AppError("Forbidden", 403);

  return prisma.post.update({
    where: { id: postId },
    data: { acceptedCommentId: null, isSolved: false },
  });
}

export async function getSolvedState(prisma: PrismaLike, postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  return { solved: Boolean(post?.acceptedCommentId ?? post?.isSolved) };
}

function isHelpPost(post: any) {
  return (post.postType ?? post.type)?.toLowerCase() === "help";
}
