"use client";

import { SaveBar } from "@/components/settings/SaveBar";
import { SettingsInput } from "@/components/settings/SettingsInput";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ToggleRow } from "@/components/settings/ToggleRow";
import { useSettingsSection } from "@/app/settings/_components/use-settings-section";
import type { SettingsIdentityForm, SettingsIdentityMeta } from "@/app/settings/_components/settings-types";

const EMPTY_IDENTITY: SettingsIdentityForm = {
  primaryDiscipline: "",
  secondaryDisciplines: [],
  experienceLevel: "student",
  softwareTools: [],
  skills: [],
  acceptCritique: true,
  offerMentorship: false,
};

export default function SettingsIdentityPage() {
  const {
    loading,
    saving,
    formData,
    setFormData,
    isDirty,
    save,
    discard,
    meta,
  } = useSettingsSection<SettingsIdentityForm, SettingsIdentityMeta>({
    section: "identity",
    fallbackData: EMPTY_IDENTITY,
    successMessage: "Identity settings updated.",
  });

  const disciplines = meta?.disciplines ?? [];
  const softwares = meta?.softwares ?? [];
  const experienceLevels = meta?.experienceLevels ?? [];

  function update<K extends keyof SettingsIdentityForm>(key: K, value: SettingsIdentityForm[K]) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  function toggleArrayItem(key: "secondaryDisciplines" | "softwareTools", value: string) {
    setFormData((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((entry) => entry !== value)
        : [...current[key], value],
    }));
  }

  function addSkill(value: string) {
    const next = value.trim();
    if (!next) return;
    if (formData.skills.includes(next)) return;
    update("skills", [...formData.skills, next]);
  }

  function removeSkill(value: string) {
    update(
      "skills",
      formData.skills.filter((skill) => skill !== value),
    );
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading identity settings...</p>;
  }

  return (
    <>
      <SettingsSection
        title="Creative Identity"
        description="Anchor your profile to the disciplines, tools, and working style you want the community to see."
      >
        <SettingsRow label="Primary Discipline" description="Your main discipline in the Atelier community.">
          <select
            value={formData.primaryDiscipline}
            className="w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground"
            onChange={(event) => update("primaryDiscipline", event.target.value)}
          >
            <option value="">Select discipline</option>
            {disciplines.map((discipline) => (
              <option key={discipline.slug} value={discipline.slug}>
                {discipline.name}
              </option>
            ))}
          </select>
        </SettingsRow>

        <SettingsRow label="Experience Level" description="Your current level of practice.">
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <label key={level.value} className="flex items-center gap-3 text-sm text-foreground">
                <input
                  type="radio"
                  name="experience-level"
                  value={level.value}
                  checked={formData.experienceLevel === level.value}
                  onChange={(event) => update("experienceLevel", event.target.value as SettingsIdentityForm["experienceLevel"])}
                />
                <span>{level.label}</span>
              </label>
            ))}
          </div>
        </SettingsRow>

        <SettingsRow label="Secondary Disciplines" description="Optional adjacent practice areas.">
          <div className="grid gap-2 sm:grid-cols-2">
            {disciplines
              .filter((discipline) => discipline.slug !== formData.primaryDiscipline)
              .map((discipline) => (
                <label key={discipline.slug} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.secondaryDisciplines.includes(discipline.slug)}
                    onChange={() => toggleArrayItem("secondaryDisciplines", discipline.slug)}
                  />
                  <span>{discipline.name}</span>
                </label>
              ))}
          </div>
        </SettingsRow>

        <SettingsRow label="Software & Tools" description="Tools that represent your current practice.">
          <div className="grid max-h-72 gap-2 overflow-auto sm:grid-cols-2">
            {softwares.map((software) => (
              <label key={software.slug} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={formData.softwareTools.includes(software.slug)}
                  onChange={() => toggleArrayItem("softwareTools", software.slug)}
                />
                <span>{software.name}</span>
              </label>
            ))}
          </div>
        </SettingsRow>

        <SettingsRow label="Skills" description="Free-form keywords that describe your strengths.">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="rounded-full border border-[oklch(0.7_0.2_45_/_0.32)] bg-[oklch(0.7_0.2_45_/_0.08)] px-3 py-1 text-xs text-[oklch(0.82_0.1_58)]"
                >
                  {skill} x
                </button>
              ))}
            </div>
            <SettingsInput
              id="add-skill"
              placeholder="Type a skill and press Enter"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSkill(event.currentTarget.value);
                  event.currentTarget.value = "";
                }
              }}
            />
          </div>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Community Mode" description="Control how you participate in critique and guidance.">
        <ToggleRow
          label="Accept critique"
          description="Signal that critique on your work is welcome."
          checked={formData.acceptCritique}
          onChange={(checked) => update("acceptCritique", checked)}
        />
        <ToggleRow
          label="Offer mentorship"
          description="Show that you are open to mentoring other practitioners."
          checked={formData.offerMentorship}
          onChange={(checked) => update("offerMentorship", checked)}
        />
      </SettingsSection>

      <SaveBar isDirty={isDirty} isSaving={saving} onSave={save} onDiscard={discard} />
    </>
  );
}
