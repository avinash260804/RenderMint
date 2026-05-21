import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getDisciplinesWithSoftwares,
  isUserOnboarded,
} from "@/modules/auth/server/onboarding-service";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/onboarding");
  }

  const onboarded = await isUserOnboarded(user.id);
  if (onboarded) {
    redirect("/");
  }

  const disciplines = await getDisciplinesWithSoftwares();

  return <OnboardingForm disciplines={disciplines} />;
}
