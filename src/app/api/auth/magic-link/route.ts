import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { magicLinkSchema } from "@/modules/auth/schemas/auth-schemas";
import { sanitizeNextPath } from "@/modules/auth/server/auth-redirect";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = magicLinkSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const nextPath = sanitizeNextPath(parsed.data.next) ?? "/";
  const origin = new URL(request.url).origin;

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Magic link sent." });
}
