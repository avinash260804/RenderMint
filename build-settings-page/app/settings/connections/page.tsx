'use client'

import { useState, useMemo } from 'react'
import { SettingsSection } from '@/components/settings/SettingsSection'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { ToggleRow } from '@/components/settings/ToggleRow'
import { SaveBar } from '@/components/settings/SaveBar'
import { PillButton } from '@/components/settings/PillButton'
import { useToast } from '@/lib/toast'
import { ConnectionSettings } from '@/lib/types'

const INITIAL_STATE: ConnectionSettings = {
  linkedAccounts: [
    { platform: 'Figma', username: 'janedoe', connected: true },
    { platform: 'GitHub', username: 'janedoe', connected: true },
    { platform: 'Webflow', username: '', connected: false },
    { platform: 'Framer', username: '', connected: false },
  ],
  syncSettings: true,
}

export default function ConnectionsPage() {
  const { addToast } = useToast()
  const [formData, setFormData] = useState<ConnectionSettings>(INITIAL_STATE)
  const [isSaving, setIsSaving] = useState(false)

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(INITIAL_STATE)
  }, [formData])

  const handleToggleSyncSettings = () => {
    setFormData((prev) => ({
      ...prev,
      syncSettings: !prev.syncSettings,
    }))
  }

  const handleToggleConnection = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      linkedAccounts: prev.linkedAccounts.map((acc) =>
        acc.platform === platform
          ? { ...acc, connected: !acc.connected }
          : acc
      ),
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: wire to API — POST /api/settings/connections
      await new Promise((resolve) => setTimeout(resolve, 800))
      addToast('Connections updated', 'success')
    } catch (error) {
      addToast('Failed to save connections', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    setFormData(INITIAL_STATE)
  }

  return (
    <>
      <SettingsSection
        title="Linked Accounts"
        description="Connect your design tools and external accounts"
      >
        <div className="space-y-4">
          {formData.linkedAccounts.map((account) => (
            <div
              key={account.platform}
              className="flex items-center justify-between p-4 rounded-md border border-border"
            >
              <div>
                <h4 className="font-sans text-sm font-600 text-foreground">
                  {account.platform}
                </h4>
                {account.connected && account.username && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Connected as @{account.username}
                  </p>
                )}
                {!account.connected && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Not connected
                  </p>
                )}
              </div>
              <PillButton
                variant="secondary"
                size="sm"
                onClick={() => handleToggleConnection(account.platform)}
              >
                {account.connected ? 'Disconnect' : 'Connect'}
              </PillButton>
            </div>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Sync Settings"
        description="Automatically sync data from connected accounts"
      >
        <ToggleRow
          label="Auto-sync Portfolio"
          description="Automatically import work from connected design tools"
          checked={formData.syncSettings}
          onChange={handleToggleSyncSettings}
        />

        {formData.syncSettings && (
          <div className="mt-4 p-4 rounded-md bg-muted border border-border">
            <h4 className="font-sans text-sm font-600 text-foreground">
              Sync Status
            </h4>
            <div className="mt-3 space-y-2">
              {formData.linkedAccounts
                .filter((acc) => acc.connected)
                .map((acc) => (
                  <div
                    key={acc.platform}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-foreground">{acc.platform}</span>
                    <span className="text-xs text-muted-foreground">
                      Last synced: 2 hours ago
                    </span>
                  </div>
                ))}
              {!formData.linkedAccounts.some((acc) => acc.connected) && (
                <p className="text-xs text-muted-foreground">
                  Connect at least one account to enable syncing
                </p>
              )}
            </div>
          </div>
        )}
      </SettingsSection>

      <SaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </>
  )
}
