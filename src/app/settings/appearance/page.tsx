"use client";

import { useTheme } from "next-themes";

import { SaveBar } from "@/components/settings/SaveBar";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { ToggleRow } from "@/components/settings/ToggleRow";
import { useSettingsSection } from "@/app/settings/_components/use-settings-section";
import type { SettingsAppearanceForm } from "@/app/settings/_components/settings-types";

const EMPTY_APPEARANCE: SettingsAppearanceForm = {
  theme: "dark",
  compactMode: false,
  fontSize: "normal",
};

export default function SettingsAppearancePage() {
  const { setTheme } = useTheme();
  const { loading, saving, formData, setFormData, isDirty, save, discard } = useSettingsSection({
    section: "appearance",
    fallbackData: EMPTY_APPEARANCE,
    successMessage: "Appearance settings updated.",
  });

  async function handleSave() {
    await save();
    setTheme(formData.theme === "auto" ? "system" : formData.theme);
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading appearance settings...</p>;
  }

  return (
    <>
      <SettingsSection title="Appearance" description="Theme and density controls for your local interface experience.">
        <SettingsRow label="Theme" description="Choose how Atelier should appear in this browser.">
          <div className="space-y-2">
            {(["dark", "light", "auto"] as const).map((value) => (
              <label key={value} className="flex items-center gap-3 text-sm text-foreground">
                <input
                  type="radio"
                  name="theme"
                  checked={formData.theme === value}
                  onChange={() => setFormData((current) => ({ ...current, theme: value }))}
                />
                <span className="capitalize">{value}</span>
              </label>
            ))}
          </div>
        </SettingsRow>

        <ToggleRow
          label="Compact mode"
          description="Tighten vertical spacing in settings and utility surfaces."
          checked={formData.compactMode}
          onChange={(checked) => setFormData((current) => ({ ...current, compactMode: checked }))}
        />

        <SettingsRow label="Font Size" description="Adjust base text density for utility pages.">
          <div className="space-y-2">
            {(["small", "normal", "large"] as const).map((value) => (
              <label key={value} className="flex items-center gap-3 text-sm text-foreground">
                <input
                  type="radio"
                  name="font-size"
                  checked={formData.fontSize === value}
                  onChange={() => setFormData((current) => ({ ...current, fontSize: value }))}
                />
                <span className="capitalize">{value}</span>
              </label>
            ))}
          </div>
        </SettingsRow>
      </SettingsSection>

      <SaveBar isDirty={isDirty} isSaving={saving} onSave={handleSave} onDiscard={discard} />
    </>
  );
}

