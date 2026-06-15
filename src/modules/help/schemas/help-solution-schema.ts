import { z } from "zod";

export const helpSolutionQuerySchema = z.object({
  postSlug: z.string().trim().min(1).optional(),
  postId: z.string().trim().min(1).optional(),
});

export const helpSolutionMutationSchema = z.object({
  postSlug: z.string().trim().min(1).optional(),
  postId: z.string().trim().min(1).optional(),
  commentId: z.string().trim().min(1).nullable(),
});

export type HelpSolutionState = {
  postSlug: string;
  isSolved: boolean;
  acceptedCommentId: string | null;
  updatedAt: string;
  canManageSolution?: boolean;
};
