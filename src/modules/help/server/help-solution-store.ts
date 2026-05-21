import { randomUUID } from "crypto";

import { communityPosts } from "@/lib/mock/community-data";
import type { HelpSolutionState } from "@/modules/help/schemas/help-solution-schema";

const globalHelpStore = globalThis as unknown as {
  helpStateBySlug?: Map<string, HelpSolutionState>;
};

const helpStateBySlug = globalHelpStore.helpStateBySlug ?? new Map<string, HelpSolutionState>();

if (!globalHelpStore.helpStateBySlug) {
  const now = new Date().toISOString();

  for (const post of communityPosts) {
    if (post.type !== "help") continue;

    helpStateBySlug.set(post.slug, {
      postSlug: post.slug,
      isSolved: Boolean(post.solved),
      acceptedCommentId: post.solved ? `seed-${randomUUID()}` : null,
      updatedAt: now,
    });
  }

  globalHelpStore.helpStateBySlug = helpStateBySlug;
}

export async function getHelpSolutionState(postSlug: string): Promise<HelpSolutionState> {
  const existing = helpStateBySlug.get(postSlug);
  if (existing) return existing;

  const created: HelpSolutionState = {
    postSlug,
    isSolved: false,
    acceptedCommentId: null,
    updatedAt: new Date().toISOString(),
  };

  helpStateBySlug.set(postSlug, created);
  return created;
}

export async function setHelpSolution(postSlug: string, commentId: string | null) {
  const next: HelpSolutionState = {
    postSlug,
    isSolved: Boolean(commentId),
    acceptedCommentId: commentId,
    updatedAt: new Date().toISOString(),
  };

  helpStateBySlug.set(postSlug, next);
  return next;
}
