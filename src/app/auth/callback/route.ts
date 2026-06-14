import { NextResponse, type NextRequest } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { resolvePostAuthRedirect, sanitizeNextPath } from "@/modules/auth/server/auth-redirect";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = sanitizeNextPath(request.nextUrl.searchParams.get("next")) ?? "/";

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "auth_callback_failed");
    return NextResponse.redirect(loginUrl);
  }

  const redirectPath = await resolvePostAuthRedirect(data.user.id, next);
  return NextResponse.redirect(new URL(redirectPath, request.url));
}
