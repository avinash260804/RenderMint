import { NextResponse } from "next/server";

import { getPlatformStats } from "@/modules/stats/server/stats-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getPlatformStats();
  return NextResponse.json(stats);
}
