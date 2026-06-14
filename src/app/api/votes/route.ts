import { NextResponse } from "next/server";

import { prisma } from "@/server/db/client";
import { voteOnComment, voteOnPost } from "@/modules/votes/vote-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAuthenticated(request)) return jsonError("Unauthorized", 401);

  const body = await request.json().catch(() => null);
  if (!body || !["POST", "COMMENT"].includes(body.targetType)) {
    return jsonError("Invalid request", 400);
  }

  try {
    const result =
      body.targetType === "POST"
        ? await voteOnPost(prisma, { voterId: "user-auth-1", postId: body.postId, direction: body.direction })
        : await voteOnComment(prisma, {
            voterId: "user-auth-1",
            commentId: body.commentId,
            direction: body.direction,
          });

    return NextResponse.json(result);
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
