import { getPostBySlug as getMockPostBySlug } from "@/lib/mock/community-data";
import { canAttemptDatabaseQuery } from "@/lib/db/availability";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import type { HelpSolutionState } from "@/modules/help/schemas/help-solution-schema";
import {
  getHelpSolutionState as getLegacyHelpSolutionState,
  setHelpSolution as setLegacyHelpSolution,
} from "@/modules/help/server/help-solution-store";
import { prisma } from "@/server/db/client";

export async function getHelpSolutionState(postSlug: string): Promise<HelpSolutionState> {
  if (!(await canAttemptDatabaseQuery())) {
    const mockPost = getMockPostBySlug(postSlug);
    if (mockPost?.type === "help") {
      return getLegacyHelpSolutionState(postSlug);
    }

    throw new NotFoundError("Help thread not found.");
  }

  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: postSlug,
        deletedAt: null,
        postType: "help",
      } as never,
      select: {
        slug: true,
        isSolved: true,
        acceptedCommentId: true,
        updatedAt: true,
      },
    });

    if (post) {
      return {
        postSlug: post.slug,
        isSolved: post.isSolved,
        acceptedCommentId: post.acceptedCommentId,
        updatedAt: post.updatedAt.toISOString(),
      };
    }
  } catch {
    const mockPost = getMockPostBySlug(postSlug);
    if (mockPost?.type === "help") {
      return getLegacyHelpSolutionState(postSlug);
    }
  }

  const mockPost = getMockPostBySlug(postSlug);
  if (mockPost?.type === "help") {
    return getLegacyHelpSolutionState(postSlug);
  }

  throw new NotFoundError("Help thread not found.");
}

export async function setHelpSolution(postSlug: string, commentId: string | null, userId: string) {
  if (!(await canAttemptDatabaseQuery())) {
    const mockPost = getMockPostBySlug(postSlug);
    if (mockPost?.type === "help") {
      return setLegacyHelpSolution(postSlug, commentId);
    }

    throw new NotFoundError("Help thread not found.");
  }

  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: postSlug,
        deletedAt: null,
        postType: "help",
      } as never,
      select: {
        id: true,
        slug: true,
        authorId: true,
      },
    });

    if (post) {
      if (post.authorId !== userId) {
        throw new ForbiddenError("Only the thread author can manage the accepted solution.");
      }

      const comment = commentId
        ? await prisma.comment.findFirst({
            where: {
              id: commentId,
              postId: post.id,
              deletedAt: null,
            } as never,
            select: { id: true },
          })
        : null;

      if (commentId && !comment) {
        throw new NotFoundError("Solution comment not found for this thread.");
      }

      const updated = await prisma.$transaction(async (tx) => {
        await tx.comment.updateMany({
          where: {
            postId: post.id,
          },
          data: {
            isSolution: false,
          },
        });

        if (commentId) {
          await tx.comment.update({
            where: { id: commentId },
            data: { isSolution: true },
          });
        }

        return tx.post.update({
          where: { id: post.id },
          data: {
            acceptedCommentId: commentId,
            isSolved: Boolean(commentId),
          },
          select: {
            slug: true,
            isSolved: true,
            acceptedCommentId: true,
            updatedAt: true,
          },
        });
      });

      return {
        postSlug: updated.slug,
        isSolved: updated.isSolved,
        acceptedCommentId: updated.acceptedCommentId,
        updatedAt: updated.updatedAt.toISOString(),
      } satisfies HelpSolutionState;
    }
  } catch {
    const mockPost = getMockPostBySlug(postSlug);
    if (mockPost?.type === "help") {
      return setLegacyHelpSolution(postSlug, commentId);
    }
  }

  const mockPost = getMockPostBySlug(postSlug);
  if (mockPost?.type === "help") {
    return setLegacyHelpSolution(postSlug, commentId);
  }

  throw new NotFoundError("Help thread not found.");
}
