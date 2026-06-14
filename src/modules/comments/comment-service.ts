/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppError } from "@/lib/handle-error";

type PrismaLike = {
  post: any;
  comment: any;
  profile: any;
};

export async function createComment(
  prisma: PrismaLike,
  input: { postSlug: string; content: string; userId?: string },
) {
  if (!input.userId) throw new AppError("Unauthorized", 401);

  const profile = await prisma.profile.findUnique({ where: { id: input.userId } });
  if (profile && profile.onboarded === false) throw new AppError("Forbidden", 403);

  const post = await prisma.post.findFirst({ where: { slug: input.postSlug, deletedAt: null } });
  if (!post) throw new AppError("Post not found", 404);

  const comment = await prisma.comment.create({
    data: {
      body: input.content,
      postId: post.id,
      authorId: input.userId,
      voteCount: 0,
    },
  });

  await prisma.post.update({
    where: { id: post.id },
    data: { commentCount: (post.commentCount ?? 0) + 1 },
  });

  return mapComment(comment);
}

export async function listCommentsBySlug(prisma: PrismaLike, postSlug: string) {
  const post = await prisma.post.findFirst({ where: { slug: postSlug, deletedAt: null } });
  if (!post) return [];

  const comments = await prisma.comment.findMany({
    where: { postId: post.id, deletedAt: null },
    orderBy: { voteCount: "desc" },
  });

  return comments.map(mapComment);
}

export async function deleteComment(prisma: PrismaLike, userId: string, commentId: string) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.deletedAt) throw new AppError("Comment not found", 404);
  if (comment.authorId !== userId) throw new AppError("Forbidden", 403);

  await prisma.comment.update({ where: { id: commentId }, data: { deletedAt: new Date() } });
}

function mapComment(comment: any) {
  return {
    ...comment,
    content: comment.content ?? comment.body,
    deletedAt: comment.deletedAt ?? null,
  };
}
