"use client";

import { SaveBar } from "@/components/settings/SaveBar";
import { SettingsInput } from "@/components/settings/SettingsInput";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ToggleRow } from "@/components/settings/ToggleRow";
import { useSettingsSection } from "@/app/settings/_components/use-settings-section";
import type { SettingsConnectionsForm } from "@/app/settings/_components/settings-types";

const EMPTY_CONNECTIONS: SettingsConnectionsForm = {
  connections: [
    { service: "dribbble", connected: false, username: "", syncEnabled: false },
    { service: "behance", connected: false, username: "", syncEnabled: false },
    { service: "github", connected: false, username: "", syncEnabled: false },
    { service: "portfolio", connected: false, username: "", syncEnabled: false },
  ],
};

export default function SettingsConnectionsPage() {
  const { loading, saving, formData, setFormData, isDirty, save, discard } = useSettingsSection({
    section: "connections",
    fallbackData: EMPTY_CONNECTIONS,
    successMessage: "Connection settings updated.",
  });

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading connection settings...</p>;
  }

  return (
    <>
      <SettingsSection title="Connections" description="Store external creative account handles and sync preferences.">
        <div className="space-y-5">
          {formData.connections.map((connection, index) => (
            <div key={connection.service} className="rounded-xl border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-foreground">{connection.service}</h3>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={connection.connected}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        connections: current.connections.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, connected: event.target.checked } : entry,
                        ),
                      }))
                    }
                  />
                  Connected
                </label>
              </div>
              <div className="space-y-4">
                <SettingsInput
                  id={`connection-${connection.service}`}
                  label="Username / Handle"
                  value={connection.username ?? ""}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      connections: current.connections.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, username: event.target.value } : entry,
                      ),
                    }))
                  }
                />
                <ToggleRow
                  label="Enable sync"
                  description="Store whether this connection should be considered sync-ready."
                  checked={connection.syncEnabled}
                  onChange={(checked) =>
                    setFormData((current) => ({
                      ...current,
                      connections: current.connections.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, syncEnabled: checked } : entry,
                      ),
                    }))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>

      <SaveBar isDirty={isDirty} isSaving={saving} onSave={save} onDiscard={discard} />
    </>
  );
}

