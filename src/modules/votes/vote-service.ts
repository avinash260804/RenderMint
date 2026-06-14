import { AppError } from "@/lib/handle-error";

type PrismaLike = {
  post: any;
  comment: any;
  vote: any;
};

type VoteInput = {
  voterId?: string;
  postId?: string;
  commentId?: string;
  direction: "UP" | "DOWN";
};

export async function voteOnPost(prisma: PrismaLike, input: VoteInput) {
  if (!input.voterId) throw new AppError("Unauthorized", 401);
  const post = await prisma.post.findUnique({ where: { id: input.postId } });
  if (!post || post.deletedAt) throw new AppError("Post not found", 404);
  if (post.authorId === input.voterId) throw new AppError("Forbidden", 403);

  return applyVote(prisma, {
    voterId: input.voterId,
    targetId: post.id,
    direction: input.direction,
    target: post,
    targetKind: "post",
  });
}

export async function voteOnComment(prisma: PrismaLike, input: VoteInput) {
  if (!input.voterId) throw new AppError("Unauthorized", 401);
  const comment = await prisma.comment.findUnique({ where: { id: input.commentId } });
  if (!comment || comment.deletedAt) throw new AppError("Comment not found", 404);
  if (comment.authorId === input.voterId) throw new AppError("Forbidden", 403);

  return applyVote(prisma, {
    voterId: input.voterId,
    targetId: comment.id,
    direction: input.direction,
    target: comment,
    targetKind: "comment",
  });
}

async function applyVote(
  prisma: PrismaLike,
  input: {
    voterId: string;
    targetId: string;
    direction: "UP" | "DOWN";
    target: any;
    targetKind: "post" | "comment";
  },
) {
  const where =
    input.targetKind === "post"
      ? { authorId_postId: { authorId: input.voterId, postId: input.targetId } }
      : { authorId_commentId: { authorId: input.voterId, commentId: input.targetId } };
  const existing = await prisma.vote.findUnique({ where });
  const nextDirection = input.direction === "UP" ? "up" : "down";
  let delta = nextDirection === "up" ? 1 : -1;

  if (!existing) {
    await prisma.vote.create({
      data: {
        authorId: input.voterId,
        targetType: input.targetKind,
        postId: input.targetKind === "post" ? input.targetId : null,
        commentId: input.targetKind === "comment" ? input.targetId : null,
        voteType: nextDirection,
        direction: input.direction,
      },
    });
  } else if (existing.voteType === nextDirection || existing.direction === input.direction) {
    await prisma.vote.delete({ where: { id: existing.id } });
    delta = nextDirection === "up" ? -1 : 1;
  } else {
    await prisma.vote.update({
      where: { id: existing.id },
      data: { voteType: nextDirection, direction: input.direction },
    });
    delta = nextDirection === "up" ? 2 : -2;
  }

  const model = input.targetKind === "post" ? prisma.post : prisma.comment;
  return model.update({
    where: { id: input.targetId },
    data: { voteCount: { increment: delta } },
  });
}
