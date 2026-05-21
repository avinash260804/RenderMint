import { S3Client } from "@aws-sdk/client-s3";

import { env } from "@/lib/env";

const hasR2Config =
  Boolean(env.R2_ACCOUNT_ID) &&
  Boolean(env.R2_ACCESS_KEY_ID) &&
  Boolean(env.R2_SECRET_ACCESS_KEY) &&
  Boolean(env.R2_BUCKET_NAME);

export function getR2Client() {
  if (!hasR2Config) return null;

  return new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID!,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export function getR2BucketName() {
  return env.R2_BUCKET_NAME;
}

export function uploadsUseMockMode() {
  return env.UPLOADS_MOCK_MODE === "true" || !hasR2Config;
}

export function buildAssetUrl(key: string) {
  if (uploadsUseMockMode()) {
    return `/api/uploads/${key}`;
  }

  if (env.R2_PUBLIC_BASE_URL) {
    return `${env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
  }

  return `/api/uploads/${key}`;
}
