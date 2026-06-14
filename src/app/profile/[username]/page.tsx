import { redirect, notFound } from "next/navigation";

import { NotFoundError } from "@/lib/errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AtelierProfilePage } from "@/components/v0/profile/profile-page";
import { getPublicProfilePageData } from "@/modules/profiles/server/profile-page-service";
import { getProfileById } from "@/modules/profiles/server/profile-service";

type ProfileRouteProps = {
  params: Promise<{ username: string }> | { username: string };
};

export const dynamic = "force-dynamic";

export default async function PublicProfileRoute({ params }: ProfileRouteProps) {
  const { username } = await params;
  const normalizedUsername = username.trim().toLowerCase();

  if (normalizedUsername === "me") {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login?next=/profile/me");
    }

    const ownProfile = await getProfileById(user.id);
    redirect(`/profile/${ownProfile.username}`);
  }

  try {
    const profileData = await getPublicProfilePageData(normalizedUsername);

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return (
      <AtelierProfilePage
        {...profileData}
        isOwner={Boolean(user && user.id === profileData.profile.id)}
      />
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }

    throw error;
  }
}

