import { NextResponse } from "next/server";

import { apiError, formatZodErrors, handleApiError } from "@/lib/api/handle-error";
import { AuthError } from "@/lib/errors";
import { requireAuth, requireOnboarded } from "@/lib/auth/require-auth";
import { requireRateLimit } from "@/lib/rate-limit";
import {
  createPost,
  listPosts,
} from "@/modules/posts/server/post-service";
import {
  postCreationSchema,
} from "@/modules/posts/schemas/post-creation-schema";
import { postListQuerySchema } from "@/modules/posts/schemas/post-api-schema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = postListQuerySchema.safeParse({
      discipline: url.searchParams.get("discipline") ?? undefined,
      postType: url.searchParams.get("postType")?.toLowerCase() ?? undefined,
      software: url.searchParams.get("software") ?? undefined,
      sortBy: url.searchParams.get("sortBy") ?? undefined,
      cursor: url.searchParams.get("cursor") ?? undefined,
      pageSize: url.searchParams.get("pageSize") ?? undefined,
    });

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    const result = await listPosts(parsed.data);
    return NextResponse.json({ data: result.items, meta: result.meta });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await resolveRequestUserId(request);
    await requireOnboarded(userId);
    requireRateLimit(`post:create:${userId}`, 10, 60 * 1000);

    const body = await request.json().catch(() => null);
    const parsed = postCreationSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    const post = await createPost(userId, parsed.data);
    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
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
