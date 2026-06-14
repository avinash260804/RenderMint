import { redirect } from "next/navigation";

import { AuthActions } from "../auth-actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { resolvePostAuthRedirect } from "@/modules/auth/server/auth-redirect";

type LoginPageProps = {
  searchParams?: {
    next?: string;
    error?: string;
  };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(await resolvePostAuthRedirect(user.id, searchParams?.next));
  }

  return (
    <AuthActions
      mode="login"
      nextPath={searchParams?.next}
      errorCode={searchParams?.error}
    />
  );
}
