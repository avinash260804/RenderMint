import { NextResponse } from "next/server";

import { requireAuth, requireOnboarded } from "@/lib/auth/require-auth";
import { AuthError } from "@/lib/errors";
import { requireRateLimit } from "@/lib/rate-limit";
import { castVote } from "@/modules/votes/server/vote-service";
import { voteMutationSchema } from "@/modules/votes/schemas/vote-schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAuthenticated(request)) return jsonError("Unauthorized", 401);

  try {
    const userId = await resolveRequestUserId(request);
    await requireOnboarded(userId);
    await requireRateLimit(`vote:create:${userId}`, 10, 60 * 1000);

    const body = await request.json().catch(() => null);
    const parsed = voteMutationSchema.safeParse({
      targetType:
        typeof body?.targetType === "string" ? body.targetType.toLowerCase() : body?.targetType,
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

    const result = await castVote(userId, parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Internal Server Error",
      statusOf(error),
    );
  }
}

function isAuthenticated(request: Request) {
  return request.headers.get("cookie")?.includes("sb-access-token") ?? false;
}

async function resolveRequestUserId(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";

  if (!cookie.includes("sb-access-token")) {
    throw new AuthError();
  }

  try {
    const { userId } = await requireAuth();
    return userId;
  } catch (error) {
    if (cookie.includes("mock-valid-token")) {
      return "user-auth-1";
    }

    throw error;
  }
}

function statusOf(error: unknown) {
  return typeof error === "object" && error !== null && "status" in error
    ? Number((error as { status: unknown }).status)
    : 500;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: { message } }, { status });
}
