import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DashboardPage } from "@/components/v0/dashboard/dashboard-page";
import { getDashboardState } from "@/modules/dashboard/server/dashboard-service";
import { isUserOnboarded } from "@/modules/auth/server/onboarding-service";

export const dynamic = "force-dynamic";

type DashboardRouteProps = {
  searchParams?: {
    discipline?: string;
  };
};

export default async function DashboardRoute({ searchParams }: DashboardRouteProps) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const onboarded = await isUserOnboarded(user.id);
  if (!onboarded) {
    redirect("/onboarding");
  }

  const dashboardState = await getDashboardState(user.id, searchParams?.discipline);

  return <DashboardPage {...dashboardState} />;
}
