import { NextResponse } from "next/server";

import { apiError, formatZodErrors, handleApiError } from "@/lib/api/handle-error";
import { requireAuth } from "@/lib/auth/require-auth";
import { getPostBySlug } from "@/lib/mock/community-data";
import {
  helpSolutionMutationSchema,
  helpSolutionQuerySchema,
} from "@/modules/help/schemas/help-solution-schema";
import { getHelpSolutionState, setHelpSolution } from "@/modules/help/server/help-solution-store";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = helpSolutionQuerySchema.safeParse({
      postSlug: url.searchParams.get("postSlug"),
    });

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    const post = getPostBySlug(parsed.data.postSlug);
    if (!post || post.type !== "help") {
      return apiError("INVALID_POST_TYPE", "Solved state is only available for help threads.", 400);
    }

    const state = await getHelpSolutionState(parsed.data.postSlug);
    return NextResponse.json({ data: state });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json().catch(() => null);
    const parsed = helpSolutionMutationSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    const post = getPostBySlug(parsed.data.postSlug);
    if (!post || post.type !== "help") {
      return apiError("INVALID_POST_TYPE", "Solved state is only available for help threads.", 400);
    }

    const state = await setHelpSolution(parsed.data.postSlug, parsed.data.commentId);
    return NextResponse.json({ data: state });
  } catch (error) {
    return handleApiError(error);
  }
}
