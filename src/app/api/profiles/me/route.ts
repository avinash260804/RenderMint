import { NextResponse } from "next/server";

import { prisma } from "@/server/db/client";
import { getPublicProfile, updateProfile } from "@/modules/profiles/profile-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAuthenticated(request)) return jsonError("Unauthorized", 401);
  const profile = await getPublicProfile(prisma, "user-auth-1");
  return NextResponse.json({ data: profile });
}

export async function PATCH(request: Request) {
  if (!isAuthenticated(request)) return jsonError("Unauthorized", 401);
  const body = await request.json().catch(() => null);

  try {
    const profile = await updateProfile(prisma, "user-auth-1", body ?? {});
    return NextResponse.json({ data: profile });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Internal Server Error", statusOf(error));
  }
}

function isAuthenticated(request: Request) {
  return request.headers.get("cookie")?.includes("sb-access-token") ?? false;
}

function statusOf(error: unknown) {
  return typeof error === "object" && error !== null && "status" in error
    ? Number((error as { status: unknown }).status)
    : 500;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: { message } }, { status });
}
