import { z } from "zod";

import { postTypeSchema } from "@/modules/posts/schemas/post-creation-schema";
import { uploadedAssetSchema } from "@/modules/uploads/schemas/upload-schema";

export const postListQuerySchema = z.object({
  discipline: z.string().trim().optional(),
  postType: postTypeSchema.optional(),
  software: z.string().trim().optional(),
  sortBy: z.enum(["newest", "top"]).default("newest"),
  cursor: z.string().trim().optional(),
  pageSize: z.coerce.number().int().min(1).max(24).default(12),
});

export const postUpdateSchema = z.object({
  title: z.string().trim().min(8).max(180).optional(),
  body: z.string().trim().optional(),
  context: z.string().trim().optional(),
  projectDescription: z.string().trim().optional(),
  challengeStatement: z.string().trim().optional(),
  feedbackRequested: z.string().trim().optional(),
  projectSummary: z.string().trim().optional(),
  toolsUsed: z.string().trim().optional(),
  projectLink: z.string().trim().optional(),
  issueDescription: z.string().trim().optional(),
  errorContext: z.string().trim().optional(),
  resourceExplanation: z.string().trim().optional(),
  resourceLinks: z.string().trim().optional(),
  attachments: z.array(uploadedAssetSchema).max(12).optional(),
  tags: z.string().trim().optional(),
  software: z.string().trim().optional(),
});

export type PostListQueryInput = z.infer<typeof postListQuerySchema>;
export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
