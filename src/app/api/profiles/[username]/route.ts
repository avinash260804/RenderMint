import { NextResponse } from "next/server";

import { prisma } from "@/server/db/client";
import { getPublicProfile } from "@/modules/profiles/profile-service";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ username: string }> | { username: string };
};

export async function GET(_: Request, { params }: RouteProps) {
  const { username } = await params;
  const profile = await getPublicProfile(prisma, username);
  if (!profile) return jsonError("Profile not found", 404);
  return NextResponse.json({ data: profile });
}

export async function PATCH(request: Request, { params }: RouteProps) {
  void request;
  void params;
  return jsonError("Public profile updates are not supported. Use /api/profiles/me instead.", 405);
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: { message } }, { status });
}
