import { z } from "zod";

export const voteTargetTypeSchema = z.enum(["post", "comment"]);
export const voteTypeSchema = z.enum(["up", "down"]);

export const voteMutationSchema = z.object({
  targetType: voteTargetTypeSchema,
  targetId: z.string().uuid(),
  voteType: voteTypeSchema,
});

export const voteQuerySchema = z.object({
  postIds: z.string().trim().optional(),
  commentIds: z.string().trim().optional(),
});

export type VoteMutationInput = z.infer<typeof voteMutationSchema>;
export type VoteQueryInput = z.infer<typeof voteQuerySchema>;
export type VoteTargetTypeInput = z.infer<typeof voteTargetTypeSchema>;
export type VoteTypeInput = z.infer<typeof voteTypeSchema>;
