import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { authFlowSchema } from "@/modules/auth/schemas/auth-schemas";
import { sanitizeNextPath } from "@/modules/auth/server/auth-redirect";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = authFlowSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid auth request." }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const nextPath = sanitizeNextPath(parsed.data.next) ?? "/";
  const origin = new URL(request.url).origin;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error || !data.url) {
    return NextResponse.json(
      { error: error?.message ?? "Unable to start OAuth." },
      { status: 400 },
    );
  }

  return NextResponse.json({ url: data.url });
}
