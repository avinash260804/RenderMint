"use client";

import { useState } from "react";

import { PillButton } from "@/components/settings/PillButton";
import { SaveBar } from "@/components/settings/SaveBar";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { useSettingsSection } from "@/app/settings/_components/use-settings-section";
import type { SettingsDataForm } from "@/app/settings/_components/settings-types";
import { useToast } from "@/lib/toast";

const EMPTY_DATA: SettingsDataForm = {
  exportFrequency: "manual",
  exportFormat: "json",
  lastExportDate: null,
  apiKeys: [],
  accountDeletionRequested: false,
  accountDeletionDate: null,
};

export default function SettingsDataPage() {
  const { addToast } = useToast();
  const { loading, saving, formData, setFormData, isDirty, save, discard } = useSettingsSection({
    section: "data",
    fallbackData: EMPTY_DATA,
    successMessage: "Data settings updated.",
  });
  const [busyAction, setBusyAction] = useState<"export" | "delete" | "cancel" | null>(null);

  async function runAction(body: Partial<SettingsDataForm>) {
    setBusyAction(body.requestExport ? "export" : body.requestAccountDeletion ? "delete" : "cancel");
    try {
      const response = await fetch("/api/settings/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, ...body }),
      });

      if (!response.ok) {
        throw new Error("Unable to complete data action.");
      }

      if (body.requestExport) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `atelier-export.${formData.exportFormat}`;
        anchor.click();
        URL.revokeObjectURL(url);
        addToast("Export generated.", "success");
      } else {
        const payload = (await response.json()) as { data?: { deletionDate?: string } };
        if (body.requestAccountDeletion) {
          setFormData((current) => ({
            ...current,
            accountDeletionRequested: true,
            accountDeletionDate: payload.data?.deletionDate ?? current.accountDeletionDate,
          }));
          addToast("Account deletion request recorded.", "success");
        } else {
          setFormData((current) => ({
            ...current,
            accountDeletionRequested: false,
            accountDeletionDate: null,
          }));
          addToast("Account deletion request cancelled.", "success");
        }
      }
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Unable to complete data action.", "error");
    } finally {
      setBusyAction(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading data settings...</p>;
  }

  return (
    <>
      <SettingsSection title="Export" description="Choose how personal exports should be generated.">
        <SettingsRow label="Export Format">
          <div className="space-y-2">
            {(["json", "csv"] as const).map((value) => (
              <label key={value} className="flex items-center gap-3 text-sm text-foreground">
                <input
                  type="radio"
                  checked={formData.exportFormat === value}
                  onChange={() => setFormData((current) => ({ ...current, exportFormat: value }))}
                />
                <span className="uppercase">{value}</span>
              </label>
            ))}
          </div>
        </SettingsRow>

        <SettingsRow label="Export Frequency">
          <div className="space-y-2">
            {(["manual", "monthly", "quarterly"] as const).map((value) => (
              <label key={value} className="flex items-center gap-3 text-sm text-foreground">
                <input
                  type="radio"
                  checked={formData.exportFrequency === value}
                  onChange={() => setFormData((current) => ({ ...current, exportFrequency: value }))}
                />
                <span className="capitalize">{value}</span>
              </label>
            ))}
          </div>
        </SettingsRow>

        <SettingsRow label="Run Export" description="Generate an export from current profile, settings, posts, and comments.">
          <PillButton variant="primary" size="sm" onClick={() => void runAction({ requestExport: true })} disabled={busyAction === "export"}>
            {busyAction === "export" ? "Preparing..." : "Download export"}
          </PillButton>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="API Keys" description="Stored API key metadata in the current repository build.">
        {formData.apiKeys.length === 0 ? (
          <p className="text-sm text-muted-foreground">No API keys are recorded.</p>
        ) : (
          <div className="space-y-3">
            {formData.apiKeys.map((key) => (
              <div key={key.id} className="rounded-xl border border-border px-4 py-3">
                <p className="text-sm font-medium text-foreground">{key.name}</p>
                <p className="text-xs text-muted-foreground">Created {key.createdAt}</p>
              </div>
            ))}
          </div>
        )}
      </SettingsSection>

      <SettingsSection title="Account Deletion" description="Request or cancel the current scheduled deletion state.">
        {formData.accountDeletionRequested ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Deletion requested{formData.accountDeletionDate ? ` until ${formData.accountDeletionDate}` : ""}.
            </p>
            <PillButton variant="secondary" size="sm" onClick={() => void runAction({ cancelAccountDeletion: true })} disabled={busyAction === "cancel"}>
              Cancel deletion request
            </PillButton>
          </div>
        ) : (
          <PillButton variant="secondary" size="sm" onClick={() => void runAction({ requestAccountDeletion: true })} disabled={busyAction === "delete"}>
            Request account deletion
          </PillButton>
        )}
      </SettingsSection>

      <SaveBar isDirty={isDirty} isSaving={saving} onSave={save} onDiscard={discard} />
    </>
  );
}
