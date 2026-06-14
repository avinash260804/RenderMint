import { getCommunityPostBySlug } from "@/lib/community/catalog";
import type { HelpSolutionState } from "@/modules/help/schemas/help-solution-schema";

export async function getHelpSolutionState(postSlug: string): Promise<HelpSolutionState> {
  const post = getCommunityPostBySlug(postSlug);

  return {
    postSlug,
    isSolved: Boolean(post?.type === "help" && post.solved),
    acceptedCommentId: post?.type === "help" && post.solved ? `seed-${post.id}` : null,
    updatedAt: new Date().toISOString(),
  };
}

export async function setHelpSolution(postSlug: string, commentId: string | null) {
  return {
    postSlug,
    isSolved: Boolean(commentId),
    acceptedCommentId: commentId,
    updatedAt: new Date().toISOString(),
  };
}
