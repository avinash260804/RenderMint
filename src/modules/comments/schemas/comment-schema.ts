import { z } from "zod";

export const commentListQuerySchema = z.object({
  postSlug: z.string().trim().min(1),
});

export const commentCreateSchema = z.object({
  postSlug: z.string().trim().min(1),
  body: z
    .string()
    .trim()
    .min(3, "Comment must be at least 3 characters.")
    .max(2000, "Comment must be under 2000 characters."),
});

export type CommentCreateInput = z.infer<typeof commentCreateSchema>;

export type CommentRecord = {
  id: string;
  postSlug: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: string;
};
