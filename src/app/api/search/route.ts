import { NextResponse } from "next/server";

import { apiError, formatZodErrors, handleApiError } from "@/lib/api/handle-error";
import { searchPosts } from "@/modules/search/server/search-service";
import { searchQuerySchema } from "@/modules/search/schemas/search-schema";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const parsed = searchQuerySchema.safeParse({
      q: url.searchParams.get("q") ?? undefined,
      discipline: url.searchParams.get("discipline") ?? undefined,
      software: url.searchParams.get("software") ?? undefined,
      postType: url.searchParams.get("postType") ?? undefined,
      solved: url.searchParams.get("solved") ?? undefined,
      page: url.searchParams.get("page") ?? undefined,
      pageSize: url.searchParams.get("pageSize") ?? undefined,
    });

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", formatZodErrors(parsed.error), 400);
    }

    const result = searchPosts(parsed.data);
    return NextResponse.json(
      { data: result.items, meta: { total: result.total, page: result.page, pageSize: result.pageSize } },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
