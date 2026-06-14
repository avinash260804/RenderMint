import { redirect } from "next/navigation";

import { AuthActions } from "../auth-actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { resolvePostAuthRedirect } from "@/modules/auth/server/auth-redirect";

type SignupPageProps = {
  searchParams?: {
    next?: string;
    error?: string;
  };
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(await resolvePostAuthRedirect(user.id, searchParams?.next));
  }

  return (
    <AuthActions
      mode="signup"
      nextPath={searchParams?.next}
      errorCode={searchParams?.error}
    />
  );
}
