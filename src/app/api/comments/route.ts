import { NextResponse } from "next/server";

import { apiError, formatZodErrors, handleApiError } from "@/lib/api/handle-error";
import { requireAuth, requireOnboarded } from "@/lib/auth/require-auth";
import { requireRateLimit } from "@/lib/rate-limit";
import {
  commentCreateSchema,
  commentListQuerySchema,
} from "@/modules/comments/schemas/comment-schema";
import { createComment, listCommentsByPostSlug } from "@/modules/comments/server/comment-service";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = commentListQuerySchema.safeParse({
      postSlug: url.searchParams.get("postSlug"),
    });

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    const comments = await listCommentsByPostSlug(parsed.data.postSlug);
    return NextResponse.json({ data: comments });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth();
    await requireOnboarded(userId);
    const body = await request.json().catch(() => null);
    const parsed = commentCreateSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    requireRateLimit(`comment-create:${userId}`, 20, 60 * 60 * 1000);

    const comment = await createComment({
      ...parsed.data,
      authorId: userId,
    });

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
