import { Prisma } from "@prisma/client";

import { canAttemptDatabaseQuery } from "@/lib/db/availability";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { sanitizeText } from "@/lib/sanitize";
import type {
  CommentCreateInput,
  CommentRecord,
  CommentUpdateInput,
} from "@/modules/comments/schemas/comment-schema";
import { prisma } from "@/server/db/client";

type PersistedComment = Prisma.CommentGetPayload<{
  include: {
    author: {
      select: {
        username: true;
      };
    };
  };
}>;

export async function listCommentsByPostSlug(postSlug: string) {
  if (!(await canAttemptDatabaseQuery())) {
    return [];
  }

  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: postSlug,
        deletedAt: null,
      } as never,
      select: { id: true },
    });

    if (!post) {
      return [];
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: post.id,
        deletedAt: null,
      } as never,
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
      orderBy: [{ createdAt: "asc" }],
    });

    return comments.map((comment) => mapCommentRecord(comment, postSlug));
  } catch {
    return [];
  }
}

export async function createComment(input: CommentCreateInput & { authorId: string }) {
  const post = await prisma.post.findFirst({
    where: {
      slug: input.postSlug,
      deletedAt: null,
    } as never,
    select: { id: true },
  });

  if (!post) {
    throw new NotFoundError("Thread not found.");
  }

  const created = await prisma.$transaction(async (tx) => {
    const comment = await tx.comment.create({
      data: {
        postId: post.id,
        authorId: input.authorId,
        body: sanitizeText(input.body),
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    await tx.post.update({
      where: { id: post.id },
      data: {
        commentCount: { increment: 1 },
      },
    });

    return comment;
  });

  return mapCommentRecord(created, input.postSlug);
}

export async function updateComment(commentId: string, authorId: string, input: CommentUpdateInput) {
  const existing = await prisma.comment.findFirst({
    where: {
      id: commentId,
      deletedAt: null,
    } as never,
    include: {
      post: {
        select: {
          slug: true,
        },
      },
      author: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!existing) {
    throw new NotFoundError("Comment not found.");
  }

  if (existing.authorId !== authorId) {
    throw new ForbiddenError("You do not have permission to edit this comment.");
  }

  const updated = await prisma.comment.update({
    where: { id: commentId },
    data: {
      body: sanitizeText(input.body),
      editedAt: new Date(),
      updatedAt: new Date(),
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });

  return mapCommentRecord(updated, existing.post.slug);
}

export async function deleteComment(commentId: string, authorId: string) {
  const existing = await prisma.comment.findFirst({
    where: {
      id: commentId,
      deletedAt: null,
    } as never,
    select: {
      id: true,
      authorId: true,
      postId: true,
      isSolution: true,
    },
  });

  if (!existing) {
    throw new NotFoundError("Comment not found.");
  }

  if (existing.authorId !== authorId) {
    throw new ForbiddenError("You do not have permission to delete this comment.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.comment.update({
      where: { id: commentId },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await tx.post.update({
      where: { id: existing.postId },
      data: {
        commentCount: { decrement: 1 },
        ...(existing.isSolution
          ? {
              acceptedCommentId: null,
              isSolved: false,
            }
          : {}),
      },
    });
  });
}

function mapCommentRecord(comment: PersistedComment, postSlug: string) {
  return {
    id: comment.id,
    postSlug,
    body: comment.body,
    authorId: comment.authorId,
    authorName: comment.author.username,
    voteCount: comment.voteCount,
    isSolution: comment.isSolution,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  } satisfies CommentRecord;
}
