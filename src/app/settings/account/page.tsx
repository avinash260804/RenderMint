"use client";

import { useState } from "react";

import { PillButton } from "@/components/settings/PillButton";
import { SaveBar } from "@/components/settings/SaveBar";
import { SettingsInput } from "@/components/settings/SettingsInput";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ToggleRow } from "@/components/settings/ToggleRow";
import { useSettingsSection } from "@/app/settings/_components/use-settings-section";
import type { SettingsAccountForm } from "@/app/settings/_components/settings-types";

const EMPTY_ACCOUNT: SettingsAccountForm = {
  email: "",
  twoFactorEnabled: false,
  activeSessions: [],
  connectedAccounts: [],
  password: "",
  revokeSessionIds: [],
};

export default function SettingsAccountPage() {
  const { loading, saving, formData, setFormData, isDirty, save, discard } = useSettingsSection({
    section: "account",
    fallbackData: EMPTY_ACCOUNT,
    successMessage: "Account settings updated.",
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordMismatch =
    showPasswordFields && Boolean(formData.password) && Boolean(confirmPassword) && formData.password !== confirmPassword;

  const canSave = !passwordMismatch;

  function update<K extends keyof SettingsAccountForm>(key: K, value: SettingsAccountForm[K]) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  async function handleSave() {
    if (!canSave) return;
    await save();
    setShowPasswordFields(false);
    setConfirmPassword("");
  }

  function toggleSessionRevoke(sessionId: string) {
    setFormData((current) => ({
      ...current,
      revokeSessionIds: current.revokeSessionIds?.includes(sessionId)
        ? current.revokeSessionIds.filter((id) => id !== sessionId)
        : [...(current.revokeSessionIds ?? []), sessionId],
    }));
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading account settings...</p>;
  }

  return (
    <>
      <SettingsSection
        title="Email & Security"
        description="Authentication and account-access controls for the current signed-in user."
      >
        <SettingsRow label="Email" description="Email is managed through your authenticated account.">
          <SettingsInput id="account-email" value={formData.email} disabled />
        </SettingsRow>

        <SettingsRow label="Password" description="Change your password using your current authenticated session.">
          <div className="space-y-3">
            {!showPasswordFields ? (
              <PillButton variant="secondary" size="sm" onClick={() => setShowPasswordFields(true)}>
                Change password
              </PillButton>
            ) : (
              <>
                <SettingsInput
                  id="new-password"
                  type="password"
                  value={formData.password ?? ""}
                  placeholder="Enter new password"
                  onChange={(event) => update("password", event.target.value)}
                />
                <SettingsInput
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  placeholder="Confirm new password"
                  error={passwordMismatch ? "Passwords do not match." : undefined}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <PillButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowPasswordFields(false);
                    setConfirmPassword("");
                    update("password", "");
                  }}
                >
                  Cancel password change
                </PillButton>
              </>
            )}
          </div>
        </SettingsRow>

        <ToggleRow
          label="Two-factor preference"
          description="Stored in Atelier settings. A full second-factor challenge flow is not implemented in this repository."
          checked={formData.twoFactorEnabled}
          onChange={(checked) => update("twoFactorEnabled", checked)}
        />
      </SettingsSection>

      <SettingsSection title="Active Sessions" description="Review sessions known to the current account view.">
        {formData.activeSessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No session inventory is currently exposed by the backend.</p>
        ) : (
          <div className="space-y-3">
            {formData.activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{session.device}</p>
                  <p className="text-xs text-muted-foreground">{session.lastActive ?? "Unknown activity time"}</p>
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={formData.revokeSessionIds?.includes(session.id) ?? false}
                    onChange={() => toggleSessionRevoke(session.id)}
                  />
                  Revoke
                </label>
              </div>
            ))}
          </div>
        )}
      </SettingsSection>

      <SettingsSection title="Connected Accounts" description="Read-only view of linked external identities in this build.">
        <div className="space-y-3">
          {formData.connectedAccounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No connected accounts recorded.</p>
          ) : (
            formData.connectedAccounts.map((account) => (
              <div key={account.provider} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{account.provider}</p>
                  <p className="text-xs text-muted-foreground">{account.username || "No linked username stored"}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {account.connected ? "Connected" : "Not connected"}
                </span>
              </div>
            ))
          )}
        </div>
      </SettingsSection>

      <SaveBar isDirty={isDirty} isSaving={saving} onSave={handleSave} onDiscard={discard} />
    </>
  );
}
