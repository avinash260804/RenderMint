import { AuthError, ForbiddenError } from "@/lib/errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prisma } from "@/server/db/client";

export async function requireAuth() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AuthError();
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    user,
  };
}

export async function requireOnboarded(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      primaryDiscipline: true,
      profileSoftwares: {
        select: { softwareId: true },
        take: 1,
      },
    },
  });

  if (!profile?.username || !profile.primaryDiscipline || profile.profileSoftwares.length === 0) {
    throw new ForbiddenError("Complete onboarding before performing this action.");
  }

  return profile;
}
