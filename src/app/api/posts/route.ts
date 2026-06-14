import { NextResponse } from "next/server";

import { prisma } from "@/server/db/client";
import { createPost, listPosts } from "@/modules/posts/post-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const postType = url.searchParams.get("postType") ?? undefined;
  const posts = await listPosts(prisma, {
    disciplineSlug: url.searchParams.get("discipline") ?? undefined,
    postType,
  });

  return NextResponse.json({ data: posts, meta: { total: posts.length } });
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) return jsonError("Unauthorized", 401);

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.content || !body?.postType || !body?.disciplineId) {
    return jsonError("Invalid request", 400);
  }

  try {
    const post = await createPost(prisma, "user-auth-1", body);
    return NextResponse.json({ data: post }, { status: 201 });
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
