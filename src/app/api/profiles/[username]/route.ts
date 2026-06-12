import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/handle-error";
import { getProfileByUsername } from "@/modules/profiles/server/profile-service";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ username: string }> | { username: string };
};

export async function GET(_: Request, { params }: RouteProps) {
  try {
    const { username } = await params;
    const profile = await getProfileByUsername(username);
    return NextResponse.json({ data: profile });
  } catch (error) {
    return handleApiError(error);
  }
}
