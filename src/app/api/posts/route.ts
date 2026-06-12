import { NextResponse } from "next/server";

import { apiError, formatZodErrors, handleApiError } from "@/lib/api/handle-error";
import { requireAuth, requireOnboarded } from "@/lib/auth/require-auth";
import { requireRateLimit } from "@/lib/rate-limit";
import { postCreationSchema } from "@/modules/posts/schemas/post-creation-schema";
import { postListQuerySchema } from "@/modules/posts/schemas/post-api-schema";
import { createPost, listPosts } from "@/modules/posts/server/post-service";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = postListQuerySchema.safeParse({
      discipline: url.searchParams.get("discipline") ?? undefined,
      postType: url.searchParams.get("postType") ?? undefined,
      software: url.searchParams.get("software") ?? undefined,
      sortBy: url.searchParams.get("sortBy") ?? undefined,
      cursor: url.searchParams.get("cursor") ?? undefined,
      pageSize: url.searchParams.get("pageSize") ?? undefined,
    });

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    const result = await listPosts(parsed.data);
    return NextResponse.json({
      data: result.items,
      meta: result.meta,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth();
    await requireOnboarded(userId);

    const body = await request.json().catch(() => null);
    const parsed = postCreationSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    requireRateLimit(`post-create:${userId}`, 5, 60 * 60 * 1000);

    const post = await createPost(userId, parsed.data);
    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
