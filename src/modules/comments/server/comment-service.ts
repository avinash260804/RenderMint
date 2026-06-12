import { Prisma } from "@prisma/client";

import { canAttemptDatabaseQuery } from "@/lib/db/availability";
import { NotFoundError } from "@/lib/errors";
import { sanitizeText } from "@/lib/sanitize";
import type { CommentCreateInput, CommentRecord } from "@/modules/comments/schemas/comment-schema";
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
      orderBy: {
        createdAt: "asc",
      },
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
function mapCommentRecord(comment: PersistedComment, postSlug: string) {
  return {
    id: comment.id,
    postSlug,
    body: comment.body,
    authorId: comment.authorId,
    authorName: comment.author.username,
    createdAt: comment.createdAt.toISOString(),
  } satisfies CommentRecord;
}
