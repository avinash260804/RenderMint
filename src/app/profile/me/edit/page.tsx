import { redirect } from "next/navigation";

import { isUserOnboarded } from "@/modules/auth/server/onboarding-service";
import { ProfileEditForm } from "@/components/v0/profile/profile-edit-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getEditableProfilePageData } from "@/modules/profiles/server/profile-page-service";

export const dynamic = "force-dynamic";

export default async function EditProfileRoute() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/profile/me/edit");
  }

  const onboarded = await isUserOnboarded(user.id);
  if (!onboarded) {
    redirect("/onboarding");
  }

  const profileData = await getEditableProfilePageData(user.id);

  return <ProfileEditForm profile={profileData.profile} disciplines={profileData.disciplines} />;
}

