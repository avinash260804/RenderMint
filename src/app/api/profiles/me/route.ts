import { NextResponse } from "next/server";

import { apiError, formatZodErrors, handleApiError } from "@/lib/api/handle-error";
import { requireAuth } from "@/lib/auth/require-auth";
import { profileUpdateSchema } from "@/modules/profiles/schemas/profile-schema";
import { getProfileById, updateProfile } from "@/modules/profiles/server/profile-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await requireAuth();
    const profile = await getProfileById(userId);
    return NextResponse.json({ data: profile });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await requireAuth();
    const body = await request.json().catch(() => null);
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    const profile = await updateProfile(userId, parsed.data);
    return NextResponse.json({ data: profile });
  } catch (error) {
    return handleApiError(error);
  }
}
