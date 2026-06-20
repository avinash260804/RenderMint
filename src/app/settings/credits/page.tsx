"use client";

import { SaveBar } from "@/components/settings/SaveBar";
import { SettingsInput } from "@/components/settings/SettingsInput";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ToggleRow } from "@/components/settings/ToggleRow";
import { useSettingsSection } from "@/app/settings/_components/use-settings-section";
import type { SettingsCreditsForm } from "@/app/settings/_components/settings-types";

const EMPTY_CREDITS: SettingsCreditsForm = {
  displayCredits: true,
  creditsGoal: 100,
  reputationHistoryVisible: true,
  reputationGoal: 500,
};

export default function SettingsCreditsPage() {
  const { loading, saving, formData, setFormData, isDirty, save, discard } = useSettingsSection({
    section: "credits",
    fallbackData: EMPTY_CREDITS,
    successMessage: "Credits settings updated.",
  });

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading credits settings...</p>;
  }

  return (
    <>
      <SettingsSection title="Credits & Reputation" description="Control which reputation-oriented signals are emphasized for you.">
        <ToggleRow
          label="Display credits"
          description="Allow credit-oriented progress indicators to appear in relevant profile surfaces."
          checked={formData.displayCredits}
          onChange={(checked) => setFormData((current) => ({ ...current, displayCredits: checked }))}
        />
        <ToggleRow
          label="Show reputation history"
          description="Allow historical reputation signal charts where supported."
          checked={formData.reputationHistoryVisible}
          onChange={(checked) => setFormData((current) => ({ ...current, reputationHistoryVisible: checked }))}
        />
        <SettingsRow label="Credits Goal" description="Personal credits target for your own tracking.">
          <SettingsInput
            id="credits-goal"
            type="number"
            value={String(formData.creditsGoal)}
            onChange={(event) => setFormData((current) => ({ ...current, creditsGoal: Number(event.target.value || 0) }))}
          />
        </SettingsRow>
        <SettingsRow label="Reputation Goal" description="Personal reputation target for your own tracking.">
          <SettingsInput
            id="reputation-goal"
            type="number"
            value={String(formData.reputationGoal)}
            onChange={(event) => setFormData((current) => ({ ...current, reputationGoal: Number(event.target.value || 0) }))}
          />
        </SettingsRow>
      </SettingsSection>

      <SaveBar isDirty={isDirty} isSaving={saving} onSave={save} onDiscard={discard} />
    </>
  );
}

