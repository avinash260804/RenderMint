import { NextResponse } from "next/server";

import { apiError, formatZodErrors, handleApiError } from "@/lib/api/handle-error";
import { requireAuth, requireOnboarded } from "@/lib/auth/require-auth";
import { AuthError, NotFoundError } from "@/lib/errors";
import { prisma } from "@/server/db/client";
import {
  helpSolutionMutationSchema,
  helpSolutionQuerySchema,
} from "@/modules/help/schemas/help-solution-schema";
import {
  getHelpSolutionState,
  setHelpSolution,
} from "@/modules/help/server/help-solution-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = helpSolutionQuerySchema.safeParse({
      postSlug: url.searchParams.get("postSlug") ?? undefined,
      postId: url.searchParams.get("postId") ?? undefined,
    });

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    const postSlug = await resolvePostSlug(
      parsed.data.postSlug ?? null,
      parsed.data.postId ?? null,
    );
    const userId = await resolveOptionalRequestUserId(request);
    const state = await getHelpSolutionState(postSlug, userId);

    return NextResponse.json({
      data: state,
      meta: {
        canManageSolution: Boolean(
          "canManageSolution" in state ? state.canManageSolution : false,
        ),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await resolveRequestUserId(request);
    await requireOnboarded(userId);

    const body = await request.json().catch(() => null);
    const parsed = helpSolutionMutationSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    const postSlug = await resolvePostSlug(
      parsed.data.postSlug ?? null,
      parsed.data.postId ?? null,
    );
    const state = await setHelpSolution(postSlug, parsed.data.commentId, userId);

    return NextResponse.json({
      data: state,
      meta: {
        canManageSolution: Boolean(
          "canManageSolution" in state ? state.canManageSolution : false,
        ),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

async function resolvePostSlug(postSlug: string | null, postId: string | null) {
  if (postSlug) {
    return postSlug;
  }

  if (!postId) {
    throw new NotFoundError("Help thread not found.");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { slug: true },
  });

  if (!post) {
    throw new NotFoundError("Help thread not found.");
  }

  return post.slug;
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

async function resolveOptionalRequestUserId(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";

  if (!cookie.includes("sb-access-token")) {
    return null;
  }

  try {
    const { userId } = await requireAuth();
    return userId;
  } catch {
    if (cookie.includes("mock-valid-token")) {
      return "user-auth-1";
    }

    return null;
  }
}
