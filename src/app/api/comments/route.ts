import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  commentCreateSchema,
  commentListQuerySchema,
} from "@/modules/comments/schemas/comment-schema";
import { createComment, listCommentsByPostSlug } from "@/modules/comments/server/comment-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = commentListQuerySchema.safeParse({
    postSlug: url.searchParams.get("postSlug"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid comments query." }, { status: 400 });
  }

  const comments = await listCommentsByPostSlug(parsed.data.postSlug);
  return NextResponse.json({ comments });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = commentCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid comment payload." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const authorName =
    user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Community member";

  const comment = await createComment({
    ...parsed.data,
    authorId: user.id,
    authorName,
  });

  return NextResponse.json({ comment }, { status: 201 });
}
