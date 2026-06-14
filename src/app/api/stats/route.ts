import { NextResponse } from "next/server";

import { canAttemptDatabaseQuery } from "@/lib/db/availability";
import { prisma } from "@/server/db/client";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await canAttemptDatabaseQuery())) {
    return NextResponse.json({ members: 0, posts: 0, disciplines: 0 });
  }

  try {
    const [members, posts, disciplines] = await Promise.all([
      prisma.profile.count(),
      prisma.post.count({ where: { deletedAt: null } as never }),
      prisma.discipline.count(),
    ]);

    return NextResponse.json({ members, posts, disciplines });
  } catch {
    return NextResponse.json({ members: 0, posts: 0, disciplines: 0 });
  }
}
