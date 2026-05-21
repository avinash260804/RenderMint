import { randomUUID } from "crypto";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { buildAssetUrl, getR2BucketName, getR2Client, uploadsUseMockMode } from "@/lib/r2/client";
import {
  allowedUploadMimeTypes,
  uploadLimitsByPostType,
  type UploadedAsset,
} from "@/modules/uploads/schemas/upload-schema";

type UploadPostType = keyof typeof uploadLimitsByPostType;

type UploadInput = {
  file: File;
  postType: UploadPostType;
};

export async function uploadAsset({ file, postType }: UploadInput): Promise<UploadedAsset> {
  const limits = uploadLimitsByPostType[postType];

  if (!allowedUploadMimeTypes.includes(file.type as (typeof allowedUploadMimeTypes)[number])) {
    throw new Error("Unsupported file type. Use JPG, PNG, WEBP, or GIF.");
  }

  if (file.size > limits.maxSizeBytes) {
    throw new Error(
      `File exceeds size limit of ${Math.floor(limits.maxSizeBytes / (1024 * 1024))}MB.`,
    );
  }

  const key = `${postType}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${sanitizeName(file.name)}`;
  const arrayBuffer = await file.arrayBuffer();
  const bodyBuffer = Buffer.from(arrayBuffer);

  if (uploadsUseMockMode()) {
    const base64 = bodyBuffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return {
      key,
      url: dataUrl,
      mimeType: file.type,
      size: file.size,
      name: file.name,
    };
  }

  const client = getR2Client();
  const bucket = getR2BucketName();

  if (!client || !bucket) {
    throw new Error("R2 is not configured.");
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: bodyBuffer,
      ContentType: file.type,
      ContentLength: file.size,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    key,
    url: buildAssetUrl(key),
    mimeType: file.type,
    size: file.size,
    name: file.name,
  };
}

export async function getAssetObject(key: string) {
  const client = getR2Client();
  const bucket = getR2BucketName();

  if (!client || !bucket) return null;

  const result = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  if (!result.Body) {
    return null;
  }

  const stream = result.Body.transformToWebStream();

  return {
    stream,
    contentType: result.ContentType ?? "application/octet-stream",
    contentLength: result.ContentLength,
  };
}

function sanitizeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");
}
