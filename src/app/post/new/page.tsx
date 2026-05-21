import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";
import { PostCreationForm } from "@/components/editor/post-creation-form";

export default function NewPostPage() {
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
