import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${new URL(request.url).origin}/auth/callback?next=/onboarding`,
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
