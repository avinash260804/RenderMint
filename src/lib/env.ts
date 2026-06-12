import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_PUBLIC_BASE_URL: z.string().url().optional(),
  UPLOADS_MOCK_MODE: z.enum(["true", "false"]).default("true"),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  R2_ACCOUNT_ID: normalizeOptionalEnv(process.env.R2_ACCOUNT_ID),
  R2_ACCESS_KEY_ID: normalizeOptionalEnv(process.env.R2_ACCESS_KEY_ID),
  R2_SECRET_ACCESS_KEY: normalizeOptionalEnv(process.env.R2_SECRET_ACCESS_KEY),
  R2_BUCKET_NAME: normalizeOptionalEnv(process.env.R2_BUCKET_NAME),
  R2_PUBLIC_BASE_URL: normalizeOptionalEnv(process.env.R2_PUBLIC_BASE_URL),
  UPLOADS_MOCK_MODE: process.env.UPLOADS_MOCK_MODE ?? inferUploadsMockMode(),
});

function normalizeOptionalEnv(value: string | undefined) {
  if (typeof value !== "string") return undefined;

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function inferUploadsMockMode() {
  const requiredR2Values = [
    process.env.R2_ACCOUNT_ID,
    process.env.R2_ACCESS_KEY_ID,
    process.env.R2_SECRET_ACCESS_KEY,
    process.env.R2_BUCKET_NAME,
  ];

  return requiredR2Values.every((value) => typeof value === "string" && value.trim().length > 0)
    ? "false"
    : "true";
}
