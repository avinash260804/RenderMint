import { getCommunityPostBySlug } from "@/lib/community/catalog";
import { canAttemptDatabaseQuery } from "@/lib/db/availability";
import { AppError, ForbiddenError, NotFoundError } from "@/lib/errors";
import type { HelpSolutionState } from "@/modules/help/schemas/help-solution-schema";
import {
  getHelpSolutionState as getFallbackHelpSolutionState,
  setHelpSolution as setFallbackHelpSolution,
} from "@/modules/help/server/help-solution-store";
import { prisma } from "@/server/db/client";

export async function getHelpSolutionState(
  postSlug: string,
  userId?: string | null,
): Promise<HelpSolutionState> {
  if (!(await canAttemptDatabaseQuery())) {
    const catalogPost = getCommunityPostBySlug(postSlug);
    if (catalogPost?.type === "help") {
      return getFallbackHelpSolutionState(postSlug);
    }

    throw new NotFoundError("Help thread not found.");
  }

  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: postSlug,
        postType: "help",
      },
      select: {
        slug: true,
        authorId: true,
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
        canManageSolution: Boolean(userId && post.authorId === userId),
      };
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const catalogPost = getCommunityPostBySlug(postSlug);
    if (catalogPost?.type === "help") {
      return getFallbackHelpSolutionState(postSlug);
    }
  }

  const catalogPost = getCommunityPostBySlug(postSlug);
  if (catalogPost?.type === "help") {
    return getFallbackHelpSolutionState(postSlug);
  }

  throw new NotFoundError("Help thread not found.");
}

export async function setHelpSolution(postSlug: string, commentId: string | null, userId: string) {
  if (!(await canAttemptDatabaseQuery())) {
    const catalogPost = getCommunityPostBySlug(postSlug);
    if (catalogPost?.type === "help") {
      return setFallbackHelpSolution(postSlug, commentId);
    }

    throw new NotFoundError("Help thread not found.");
  }

  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: postSlug,
        postType: "help",
      },
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
            },
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
        canManageSolution: true,
      } satisfies HelpSolutionState;
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const catalogPost = getCommunityPostBySlug(postSlug);
    if (catalogPost?.type === "help") {
      return setFallbackHelpSolution(postSlug, commentId);
    }
  }

  const catalogPost = getCommunityPostBySlug(postSlug);
  if (catalogPost?.type === "help") {
    return setFallbackHelpSolution(postSlug, commentId);
  }

  throw new NotFoundError("Help thread not found.");
}
