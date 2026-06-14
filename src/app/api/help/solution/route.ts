import { NextResponse } from "next/server";

import { prisma } from "@/server/db/client";
import { clearSolved, getSolvedState, markAsSolved } from "@/modules/help/help-solution-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const postId = url.searchParams.get("postId") ?? "";
  const state = await getSolvedState(prisma, postId);
  return NextResponse.json({ data: state });
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) return jsonError("Unauthorized", 401);
  const body = await request.json().catch(() => null);
  if (!body?.postId) return jsonError("Invalid request", 400);

  try {
    const state = body.commentId
      ? await markAsSolved(prisma, "user-auth-1", body.postId, body.commentId)
      : await clearSolved(prisma, "user-auth-1", body.postId);
    return NextResponse.json({ data: state });
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
