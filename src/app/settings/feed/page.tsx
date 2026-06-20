"use client";

import { useEffect, useState } from "react";

import { SaveBar } from "@/components/settings/SaveBar";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { useSettingsSection } from "@/app/settings/_components/use-settings-section";
import type { SettingsFeedForm, SettingsIdentityMeta } from "@/app/settings/_components/settings-types";

const EMPTY_FEED: SettingsFeedForm = {
  contentTypeFilters: ["discussion", "critique", "showcase", "help", "resource"],
  disciplineFilters: [],
  sortingPreference: "recent",
};

export default function SettingsFeedPage() {
  const feedState = useSettingsSection<SettingsFeedForm>({
    section: "feed",
    fallbackData: EMPTY_FEED,
    successMessage: "Feed preferences updated.",
  });
  const [disciplines, setDisciplines] = useState<SettingsIdentityMeta["disciplines"]>([]);

  const contentTypes = ["discussion", "critique", "showcase", "help", "resource"] as const;

  useEffect(() => {
    let active = true;

    void fetch("/api/settings/identity", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load taxonomy.");
        return response.json() as Promise<{ meta?: SettingsIdentityMeta }>;
      })
      .then((payload) => {
        if (active) {
          setDisciplines(payload.meta?.disciplines ?? []);
        }
      })
      .catch(() => {
        if (active) {
          setDisciplines([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  function toggleDiscipline(slug: string) {
    feedState.setFormData((current) => ({
      ...current,
      disciplineFilters: current.disciplineFilters.includes(slug)
        ? current.disciplineFilters.filter((entry) => entry !== slug)
        : [...current.disciplineFilters, slug],
    }));
  }

  function toggleContentType(value: (typeof contentTypes)[number]) {
    feedState.setFormData((current) => ({
      ...current,
      contentTypeFilters: current.contentTypeFilters.includes(value)
        ? current.contentTypeFilters.filter((entry) => entry !== value)
        : [...current.contentTypeFilters, value],
    }));
  }

  if (feedState.loading) {
    return <p className="text-sm text-muted-foreground">Loading feed settings...</p>;
  }

  return (
    <>
      <SettingsSection
        title="Feed & Discovery"
        description="Choose which content types and disciplines are emphasized in your discovery flow."
      >
        <SettingsRow label="Content Types" description="Which post formats should appear most often.">
          <div className="grid gap-2 sm:grid-cols-2">
            {contentTypes.map((value) => (
              <label key={value} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={feedState.formData.contentTypeFilters.includes(value)}
                  onChange={() => toggleContentType(value)}
                />
                <span className="capitalize">{value}</span>
              </label>
            ))}
          </div>
        </SettingsRow>

        <SettingsRow label="Disciplines" description="Optional discipline focus in discovery views.">
          <div className="grid gap-2 sm:grid-cols-2">
            {disciplines.map((discipline) => (
              <label key={discipline.slug} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={feedState.formData.disciplineFilters.includes(discipline.slug)}
                  onChange={() => toggleDiscipline(discipline.slug)}
                />
                <span>{discipline.name}</span>
              </label>
            ))}
          </div>
        </SettingsRow>

        <SettingsRow label="Sorting" description="Preferred default ordering for results and feeds.">
          <div className="space-y-2">
            {(["recent", "trending", "most-helpful"] as const).map((value) => (
              <label key={value} className="flex items-center gap-3 text-sm text-foreground">
                <input
                  type="radio"
                  name="sorting-preference"
                  checked={feedState.formData.sortingPreference === value}
                  onChange={() => feedState.setFormData((current) => ({ ...current, sortingPreference: value }))}
                />
                <span className="capitalize">{value.replace("-", " ")}</span>
              </label>
            ))}
          </div>
        </SettingsRow>
      </SettingsSection>

      <SaveBar isDirty={feedState.isDirty} isSaving={feedState.saving} onSave={feedState.save} onDiscard={feedState.discard} />
    </>
  );
}
