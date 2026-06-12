import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError, formatZodErrors, handleApiError } from "@/lib/api/handle-error";
import { listTags } from "@/modules/tags/server/tag-service";

export const dynamic = "force-dynamic";

const tagListQuerySchema = z.object({
  q: z.string().trim().optional(),
  discipline: z.string().trim().optional(),
  popular: z.enum(["true", "false"]).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = tagListQuerySchema.safeParse({
      q: url.searchParams.get("q") ?? undefined,
      discipline: url.searchParams.get("discipline") ?? undefined,
      popular: url.searchParams.get("popular") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    const tags = await listTags({
      q: parsed.data.q,
      discipline: parsed.data.discipline,
      popular: parsed.data.popular === "true",
      limit: parsed.data.limit,
    });

    return NextResponse.json({ data: tags });
  } catch (error) {
    return handleApiError(error);
  }
}
