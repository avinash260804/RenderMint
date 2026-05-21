import { z } from "zod";

export const allowedUploadMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const uploadRequestSchema = z.object({
  postType: z.enum(["discussion", "critique", "showcase", "help", "resource"]),
});

export const uploadedAssetSchema = z.object({
  key: z.string().min(1),
  url: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int().positive(),
  name: z.string().min(1),
});

export type UploadedAsset = z.infer<typeof uploadedAssetSchema>;

export const uploadLimitsByPostType = {
  discussion: { maxFiles: 4, maxSizeBytes: 5 * 1024 * 1024 },
  critique: { maxFiles: 8, maxSizeBytes: 8 * 1024 * 1024 },
  showcase: { maxFiles: 12, maxSizeBytes: 10 * 1024 * 1024 },
  help: { maxFiles: 6, maxSizeBytes: 6 * 1024 * 1024 },
  resource: { maxFiles: 6, maxSizeBytes: 8 * 1024 * 1024 },
} as const;
