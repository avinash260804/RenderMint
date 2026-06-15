import { NextResponse } from "next/server";

import { NotFoundError } from "@/lib/errors";
import { getProfileByUsername } from "@/modules/profiles/server/profile-service";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ username: string }> | { username: string };
};

export async function GET(_: Request, { params }: RouteProps) {
  const { username } = await params;
  try {
    const profile = await getProfileByUsername(username.trim().toLowerCase());
    return NextResponse.json({ data: profile });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return jsonError("Profile not found", 404);
    }

    return jsonError(error instanceof Error ? error.message : "Internal Server Error", 500);
  }
}

export async function PATCH(request: Request, { params }: RouteProps) {
  void request;
  void params;
  return jsonError("Public profile updates are not supported. Use /api/profiles/me instead.", 405);
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: { message } }, { status });
}
