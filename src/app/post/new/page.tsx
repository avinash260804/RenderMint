import { redirect } from "next/navigation";

import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";
import { PostCreationForm } from "@/components/editor/post-creation-form";
import { isUserOnboarded } from "@/modules/auth/server/onboarding-service";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/post/new");
  }

  const onboarded = await isUserOnboarded(user.id);
  if (!onboarded) {
    redirect("/onboarding");
  }

  return (
    <AppLayoutShell
      navLabel="Create Post"
      navTitle="Compose a new thread"
      searchPlaceholder="Search references..."
    >
      <PostCreationForm />
    </AppLayoutShell>
  );
}
