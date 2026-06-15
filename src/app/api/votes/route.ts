import { NextResponse } from "next/server";

import { castVote } from "@/modules/votes/server/vote-service";
import { voteMutationSchema } from "@/modules/votes/schemas/vote-schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAuthenticated(request)) return jsonError("Unauthorized", 401);

  const body = await request.json().catch(() => null);
  const parsed = voteMutationSchema.safeParse({
    targetType: typeof body?.targetType === "string" ? body.targetType.toLowerCase() : body?.targetType,
    targetId:
      body?.targetType === "POST" || body?.targetType === "post"
        ? body?.postId
        : body?.targetType === "COMMENT" || body?.targetType === "comment"
          ? body?.commentId
          : body?.targetId,
    voteType: typeof body?.direction === "string" ? body.direction.toLowerCase() : body?.voteType,
  });

  if (!parsed.success) {
    return jsonError("Invalid request", 400);
  }

  try {
    const result = await castVote("user-auth-1", parsed.data);
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
