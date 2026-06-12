import { NextResponse } from "next/server";

import { apiError, formatZodErrors, handleApiError } from "@/lib/api/handle-error";
import { requireAuth } from "@/lib/auth/require-auth";
import { onboardingSchema } from "@/modules/auth/schemas/auth-schemas";
import { completeOnboarding } from "@/modules/auth/server/onboarding-service";

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth();
    const body = await request.json().catch(() => null);
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    await completeOnboarding(userId, parsed.data);
    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    return handleApiError(error);
  }
}
