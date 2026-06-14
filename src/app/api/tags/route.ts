import { NextResponse } from "next/server";

import { listTags } from "@/modules/tags/server/tag-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tags = await listTags({
    q: url.searchParams.get("q") ?? undefined,
    discipline: url.searchParams.get("discipline") ?? undefined,
    popular: url.searchParams.get("popular") === "true",
    limit: url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : undefined,
  });
  return NextResponse.json(tags);
}
