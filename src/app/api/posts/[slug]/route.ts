import { NextResponse } from "next/server";

import { apiError, formatZodErrors, handleApiError } from "@/lib/api/handle-error";
import { requireAuth } from "@/lib/auth/require-auth";
import { postUpdateSchema } from "@/modules/posts/schemas/post-api-schema";
import { deletePost, getPostBySlug, updatePost } from "@/modules/posts/server/post-service";

type RouteProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function GET(_: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
      return apiError("NOT_FOUND", "Post not found.", 404);
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const { userId } = await requireAuth();
    const { slug } = await params;
    const existing = await getPostBySlug(slug);

    if (!existing) {
      return apiError("NOT_FOUND", "Post not found.", 404);
    }

    const body = await request.json().catch(() => null);
    const parsed = postUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    const post = await updatePost(existing.id, userId, parsed.data);
    return NextResponse.json({ data: post });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: Request, { params }: RouteProps) {
  try {
    const { userId } = await requireAuth();
    const { slug } = await params;
    const existing = await getPostBySlug(slug);

    if (!existing) {
      return apiError("NOT_FOUND", "Post not found.", 404);
    }

    await deletePost(existing.id, userId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
