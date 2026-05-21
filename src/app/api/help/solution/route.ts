import { NextResponse } from "next/server";

import { getPostBySlug } from "@/lib/mock/community-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  helpSolutionMutationSchema,
  helpSolutionQuerySchema,
} from "@/modules/help/schemas/help-solution-schema";
import { getHelpSolutionState, setHelpSolution } from "@/modules/help/server/help-solution-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = helpSolutionQuerySchema.safeParse({
    postSlug: url.searchParams.get("postSlug"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid solution query." }, { status: 400 });
  }

  const post = getPostBySlug(parsed.data.postSlug);
  if (!post || post.type !== "help") {
    return NextResponse.json(
      { error: "Solved state is only available for help threads." },
      { status: 400 },
    );
  }

  const state = await getHelpSolutionState(parsed.data.postSlug);
  return NextResponse.json({ state });
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = helpSolutionMutationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid solution payload." }, { status: 400 });
  }

  const post = getPostBySlug(parsed.data.postSlug);
  if (!post || post.type !== "help") {
    return NextResponse.json(
      { error: "Solved state is only available for help threads." },
      { status: 400 },
    );
  }

  const state = await setHelpSolution(parsed.data.postSlug, parsed.data.commentId);
  return NextResponse.json({ state });
}
