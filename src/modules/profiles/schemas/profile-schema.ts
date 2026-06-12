import { z } from "zod";

export const profileUpdateSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9_]+$/, "Username must contain lowercase letters, numbers, or underscore.")
    .optional(),
  bio: z.string().trim().max(300).optional(),
  avatarUrl: z.string().trim().url().max(500).nullable().optional(),
  primaryDiscipline: z.string().trim().min(1).max(64).optional(),
  softwareIds: z.array(z.number().int().positive()).max(8).optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
