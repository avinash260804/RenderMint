import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { randomUUID } from "crypto";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { buildAssetUrl, getR2BucketName, getR2Client, uploadsUseMockMode } from "@/lib/r2/client";
import {
  getUploadLimits,
  isAllowedUploadMimeType,
  type UploadedAsset,
  type UploadPostType,
} from "@/modules/uploads/schemas/upload-schema";

type UploadInput = {
  file: File;
  postType: UploadPostType;
};

export async function uploadAsset({ file, postType }: UploadInput): Promise<UploadedAsset> {
  const limits = getUploadLimits(postType);

  if (!isAllowedUploadMimeType(file.type)) {
    throw new ValidationError("Unsupported file type. Use JPG, PNG, WEBP, or GIF.");
  }

  if (file.size > limits.maxSizeBytes) {
    throw new ValidationError(
      `File exceeds size limit of ${Math.floor(limits.maxSizeBytes / (1024 * 1024))}MB.`,
    );
  }

  const key = `${postType}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${sanitizeName(file.name)}`;
  const bodyBuffer = Buffer.from(await file.arrayBuffer());

  if (uploadsUseMockMode()) {
    await writeMockAsset(key, bodyBuffer);

    return {
      key,
      url: buildAssetUrl(key),
      mimeType: file.type,
      size: file.size,
      name: file.name,
    };
  }

  const client = getR2Client();
  const bucket = getR2BucketName();

  if (!client || !bucket) {
    throw new ValidationError("R2 is not configured.");
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
  if (uploadsUseMockMode()) {
    return getMockAssetObject(key);
  }

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

  return {
    stream: result.Body.transformToWebStream(),
    contentType: result.ContentType ?? "application/octet-stream",
    contentLength: result.ContentLength,
  };
}

function sanitizeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");
}

async function writeMockAsset(key: string, body: Buffer) {
  const filePath = resolveMockAssetPath(key);
  await mkdir(join(process.cwd(), ".tmp", "uploads", ...key.split("/").slice(0, -1)), {
    recursive: true,
  });
  await writeFile(filePath, body);
}

async function getMockAssetObject(key: string) {
  try {
    const buffer = await readFile(resolveMockAssetPath(key));

    return {
      stream: Readable.toWeb(Readable.from(buffer)),
      contentType: inferMimeTypeFromKey(key),
      contentLength: buffer.byteLength,
    };
  } catch (error) {
    if (isMissingFileError(error)) {
      return null;
    }

    throw new NotFoundError("Asset not found.");
  }
}

function resolveMockAssetPath(key: string) {
  return join(process.cwd(), ".tmp", "uploads", ...key.split("/"));
}

function inferMimeTypeFromKey(key: string) {
  const normalized = key.toLowerCase();

  if (normalized.endsWith(".jpg") || normalized.endsWith(".jpeg")) return "image/jpeg";
  if (normalized.endsWith(".png")) return "image/png";
  if (normalized.endsWith(".webp")) return "image/webp";
  if (normalized.endsWith(".gif")) return "image/gif";

  return "application/octet-stream";
}

function isMissingFileError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
