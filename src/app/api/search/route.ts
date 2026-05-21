import { NextResponse } from "next/server";

import { searchPosts } from "@/modules/search/server/search-service";
import { searchQuerySchema } from "@/modules/search/schemas/search-schema";

export async function GET(request: Request) {
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
    return NextResponse.json({ error: "Invalid search query." }, { status: 400 });
  }

  const result = searchPosts(parsed.data);
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
