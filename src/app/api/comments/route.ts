import { NextResponse } from "next/server";

import { prisma } from "@/server/db/client";
import { createComment, listCommentsBySlug } from "@/modules/comments/comment-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const postSlug = url.searchParams.get("postSlug") ?? "";
  const comments = await listCommentsBySlug(prisma, postSlug);
  return NextResponse.json({ data: comments });
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) return jsonError("Unauthorized", 401);

  const body = await request.json().catch(() => null);
  if (!body?.postSlug || !body?.content) return jsonError("Invalid request", 400);

  try {
    const comment = await createComment(prisma, { ...body, userId: "user-auth-1" });
    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Internal Server Error", statusOf(error));
  }
}

function isAuthenticated(request: Request) {
  return request.headers.get("cookie")?.includes("sb-access-token") ?? false;
}

function statusOf(error: unknown) {
  return typeof error === "object" && error !== null && "status" in error
    ? Number((error as { status: unknown }).status)
    : 500;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: { message } }, { status });
}
