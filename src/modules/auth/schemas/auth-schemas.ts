import { z } from "zod";

export const magicLinkSchema = z.object({
  email: z.string().trim().email().max(255),
});

export const onboardingSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9_]+$/, "Username must contain lowercase letters, numbers, or underscore."),
  disciplineSlug: z.string().trim().min(1),
  softwareIds: z.array(z.number().int().positive()).min(1).max(8),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
