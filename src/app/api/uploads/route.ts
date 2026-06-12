import { NextResponse } from "next/server";

import { handleApiError, apiError, formatZodErrors } from "@/lib/api/handle-error";
import { requireAuth, requireOnboarded } from "@/lib/auth/require-auth";
import { requireRateLimit } from "@/lib/rate-limit";
import { uploadRequestSchema } from "@/modules/uploads/schemas/upload-schema";
import { uploadAsset } from "@/modules/uploads/server/upload-service";

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth();
    await requireOnboarded(userId);

    const formData = await request.formData();
    const file = formData.get("file");
    const postType = formData.get("postType");

    if (!(file instanceof File) || typeof postType !== "string") {
      return apiError("VALIDATION_ERROR", "Invalid upload payload.", 400);
    }

    const parsed = uploadRequestSchema.safeParse({ postType });

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    requireRateLimit(`upload:${userId}`, 30, 60 * 60 * 1000);

    const asset = await uploadAsset({
      file,
      postType: parsed.data.postType,
    });

    return NextResponse.json({ data: asset });
  } catch (error) {
    return handleApiError(error);
  }
}
