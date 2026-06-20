import { redirect } from "next/navigation";

import { AppHeader } from "@/components/navigation/app-header";
import { SettingsShell } from "@/app/settings/_components/settings-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUserOnboarded } from "@/modules/auth/server/onboarding-service";

export const dynamic = "force-dynamic";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/settings/profile");
  }

  const onboarded = await isUserOnboarded(user.id);
  if (!onboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="v0-preview-theme v0-surface v0-surface--community min-h-screen bg-background text-foreground">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="dashboard-grid-overlay" aria-hidden="true" />
      <AppHeader />
      <SettingsShell>{children}</SettingsShell>
    </div>
  );
}
