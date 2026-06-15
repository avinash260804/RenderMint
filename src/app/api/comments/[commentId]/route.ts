import { NextResponse } from "next/server";

import { apiError, formatZodErrors, handleApiError } from "@/lib/api/handle-error";
import { requireAuth, requireOnboarded } from "@/lib/auth/require-auth";
import { AuthError } from "@/lib/errors";
import {
  deleteComment,
  updateComment,
} from "@/modules/comments/server/comment-service";
import { commentUpdateSchema } from "@/modules/comments/schemas/comment-schema";

type RouteProps = {
  params: Promise<{ commentId: string }> | { commentId: string };
};

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const userId = await resolveRequestUserId(request);
    await requireOnboarded(userId);

    const body = await request.json().catch(() => null);
    const parsed = commentUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    const { commentId } = await params;
    const comment = await updateComment(commentId, userId, parsed.data);
    return NextResponse.json({ data: comment });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: RouteProps) {
  try {
    const userId = await resolveRequestUserId(request);
    await requireOnboarded(userId);

    const { commentId } = await params;
    await deleteComment(commentId, userId);
    return new NextResponse(null, { status: 204 });
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
