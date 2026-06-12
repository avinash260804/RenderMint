import { NextResponse } from "next/server";

import { apiError, formatZodErrors, handleApiError } from "@/lib/api/handle-error";
import { requireAuth, requireOnboarded } from "@/lib/auth/require-auth";
import { requireRateLimit } from "@/lib/rate-limit";
import { voteMutationSchema, voteQuerySchema } from "@/modules/votes/schemas/vote-schema";
import { castVote, getUserVotes } from "@/modules/votes/server/vote-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { userId } = await requireAuth();
    const url = new URL(request.url);
    const parsed = voteQuerySchema.safeParse({
      postIds: url.searchParams.get("postIds") ?? undefined,
      commentIds: url.searchParams.get("commentIds") ?? undefined,
    });

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    const votes = await getUserVotes(userId, parsed.data);
    return NextResponse.json({ data: votes });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth();
    await requireOnboarded(userId);

    const body = await request.json().catch(() => null);
    const parsed = voteMutationSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    requireRateLimit(`vote:${userId}`, 120, 60 * 60 * 1000);

    const vote = await castVote(userId, parsed.data);
    return NextResponse.json({ data: vote });
  } catch (error) {
    return handleApiError(error);
  }
}
