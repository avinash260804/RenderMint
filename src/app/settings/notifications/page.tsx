"use client";

import { SaveBar } from "@/components/settings/SaveBar";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ToggleRow } from "@/components/settings/ToggleRow";
import { useSettingsSection } from "@/app/settings/_components/use-settings-section";
import type { SettingsNotificationsForm } from "@/app/settings/_components/settings-types";

const EMPTY_NOTIFICATIONS: SettingsNotificationsForm = {
  emailNotifications: true,
  inAppNotifications: true,
  emailFrequency: "daily",
  commentNotifications: true,
  newFollowerNotifications: false,
  newsAndFeatures: true,
};

export default function SettingsNotificationsPage() {
  const { loading, saving, formData, setFormData, isDirty, save, discard } = useSettingsSection({
    section: "notifications",
    fallbackData: EMPTY_NOTIFICATIONS,
    successMessage: "Notification preferences updated.",
  });

  function update<K extends keyof SettingsNotificationsForm>(
    key: K,
    value: SettingsNotificationsForm[K],
  ) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading notification settings...</p>;
  }

  return (
    <>
      <SettingsSection
        title="Notifications"
        description="Control how the platform reaches you about comments, activity, and product updates."
      >
        <ToggleRow
          label="Email notifications"
          description="Receive community activity by email."
          checked={formData.emailNotifications}
          onChange={(checked) => update("emailNotifications", checked)}
        />
        <ToggleRow
          label="In-app notifications"
          description="Enable notification surfaces inside the product shell as they become available."
          checked={formData.inAppNotifications}
          onChange={(checked) => update("inAppNotifications", checked)}
        />
        <ToggleRow
          label="Comment notifications"
          description="Alert me when someone comments on my threads or replies to me."
          checked={formData.commentNotifications}
          onChange={(checked) => update("commentNotifications", checked)}
        />
        <ToggleRow
          label="Follower notifications"
          description="Stored for compatibility, even though follower systems are not implemented in this build."
          checked={formData.newFollowerNotifications}
          onChange={(checked) => update("newFollowerNotifications", checked)}
        />
        <ToggleRow
          label="News and features"
          description="Receive Atelier product updates and release notes."
          checked={formData.newsAndFeatures}
          onChange={(checked) => update("newsAndFeatures", checked)}
        />

        <SettingsRow label="Email Frequency" description="How often email digests should be sent.">
          <div className="space-y-2">
            {(["realtime", "daily", "weekly"] as const).map((value) => (
              <label key={value} className="flex items-center gap-3 text-sm text-foreground">
                <input
                  type="radio"
                  name="email-frequency"
                  checked={formData.emailFrequency === value}
                  onChange={() => update("emailFrequency", value)}
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
