"use client";

import { SaveBar } from "@/components/settings/SaveBar";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ToggleRow } from "@/components/settings/ToggleRow";
import { useSettingsSection } from "@/app/settings/_components/use-settings-section";
import type { SettingsPrivacyForm } from "@/app/settings/_components/settings-types";

const EMPTY_PRIVACY: SettingsPrivacyForm = {
  profileVisibility: "public",
  onlineStatusVisible: true,
  activityVisible: true,
  messagePermissions: "none",
  searchVisible: true,
};

export default function SettingsPrivacyPage() {
  const { loading, saving, formData, setFormData, isDirty, save, discard } = useSettingsSection({
    section: "privacy",
    fallbackData: EMPTY_PRIVACY,
    successMessage: "Privacy settings updated.",
  });

  function update<K extends keyof SettingsPrivacyForm>(key: K, value: SettingsPrivacyForm[K]) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading privacy settings...</p>;
  }

  return (
    <>
      <SettingsSection
        title="Privacy & Visibility"
        description="Control how visible your presence and profile are across the community."
      >
        <SettingsRow label="Profile Visibility" description="Choose who can access your profile page.">
          <div className="space-y-2">
            {(["public", "unlisted", "private"] as const).map((value) => (
              <label key={value} className="flex items-center gap-3 text-sm text-foreground">
                <input
                  type="radio"
                  name="profile-visibility"
                  checked={formData.profileVisibility === value}
                  onChange={() => update("profileVisibility", value)}
                />
                <span className="capitalize">{value}</span>
              </label>
            ))}
          </div>
        </SettingsRow>

        <ToggleRow
          label="Show online status"
          description="Expose whether you are currently active."
          checked={formData.onlineStatusVisible}
          onChange={(checked) => update("onlineStatusVisible", checked)}
        />
        <ToggleRow
          label="Show activity"
          description="Allow your public profile to show activity signals."
          checked={formData.activityVisible}
          onChange={(checked) => update("activityVisible", checked)}
        />
        <ToggleRow
          label="Search visibility"
          description="Allow your profile to appear in search and discovery views."
          checked={formData.searchVisible}
          onChange={(checked) => update("searchVisible", checked)}
        />

        <SettingsRow label="Message Permissions" description="Reserved for future private-contact systems.">
          <div className="space-y-2">
            {(["everyone", "followers", "none"] as const).map((value) => (
              <label key={value} className="flex items-center gap-3 text-sm text-foreground">
                <input
                  type="radio"
                  name="message-permissions"
                  checked={formData.messagePermissions === value}
                  onChange={() => update("messagePermissions", value)}
                />
                <span className="capitalize">{value}</span>
              </label>
            ))}
          </div>
        </SettingsRow>
      </SettingsSection>

      <SaveBar isDirty={isDirty} isSaving={saving} onSave={save} onDiscard={discard} />
    </>
  );
}

