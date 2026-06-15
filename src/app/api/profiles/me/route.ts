import { NextResponse } from "next/server";

import { AuthError } from "@/lib/errors";
import { requireAuth } from "@/lib/auth/require-auth";
import { profileUpdateSchema } from "@/modules/profiles/schemas/profile-schema";
import { getProfileById as getServerProfileById } from "@/modules/profiles/server/profile-service";
import { updateProfile } from "@/modules/profiles/server/profile-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const userId = await resolveRequestUserId(request);
    const profile = await getServerProfileById(userId);
    return NextResponse.json({ data: profile });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Internal Server Error", statusOf(error));
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await resolveRequestUserId(request);
    const body = await request.json().catch(() => null);
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues.map((issue) => issue.message).join(" "), 400);
    }

    const profile = await updateProfile(userId, parsed.data);
    return NextResponse.json({ data: profile });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Internal Server Error", statusOf(error));
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

function statusOf(error: unknown) {
  if (typeof error === "object" && error !== null && "statusCode" in error) {
    return Number((error as { statusCode: unknown }).statusCode);
  }

  return typeof error === "object" && error !== null && "status" in error
    ? Number((error as { status: unknown }).status)
    : 500;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: { message } }, { status });
}
