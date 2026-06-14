import { NextResponse } from "next/server";

import { prisma } from "@/server/db/client";
import { listTags } from "@/modules/tags/tag-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tags = await listTags(prisma, { query: url.searchParams.get("q") ?? "" });
  return NextResponse.json(tags);
}
