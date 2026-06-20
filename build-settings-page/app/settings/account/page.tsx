'use client'

import { useState, useMemo } from 'react'
import { SettingsSection } from '@/components/settings/SettingsSection'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { ToggleRow } from '@/components/settings/ToggleRow'
import { SettingsInput } from '@/components/settings/SettingsInput'
import { SaveBar } from '@/components/settings/SaveBar'
import { PillButton } from '@/components/settings/PillButton'
import { useToast } from '@/lib/toast'
import { AccountSettings } from '@/lib/types'

const INITIAL_STATE: AccountSettings = {
  email: 'jane@example.com',
  twoFactorEnabled: false,
  activeSessions: [
    {
      id: '1',
      device: 'Chrome on macOS',
      location: 'San Francisco, CA',
      lastActive: '5 minutes ago',
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      lastActive: '2 hours ago',
    },
  ],
  connectedAccounts: [
    { provider: 'Google', connected: true, email: 'jane@gmail.com' },
    { provider: 'GitHub', connected: false },
  ],
}

export default function AccountPage() {
  const { addToast } = useToast()
  const [formData, setFormData] = useState<AccountSettings>(INITIAL_STATE)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(INITIAL_STATE)
  }, [formData])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: wire to API — POST /api/settings/account
      await new Promise((resolve) => setTimeout(resolve, 800))
      addToast('Account settings updated', 'success')
    } catch (error) {
      addToast('Failed to save account settings', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    setFormData(INITIAL_STATE)
  }

  const handleRevokeSession = (sessionId: string) => {
    setFormData((prev) => ({
      ...prev,
      activeSessions: prev.activeSessions.filter((s) => s.id !== sessionId),
    }))
    addToast('Session revoked', 'success')
  }

  const handleToggle2FA = () => {
    setFormData((prev) => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled,
    }))
  }

  return (
    <>
      <SettingsSection
        title="Email & Authentication"
        description="Manage your email and authentication methods"
      >
        <SettingsRow
          label="Email Address"
          description="Your primary email for account recovery"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-muted text-foreground">
              {formData.email}
            </div>
            <PillButton variant="secondary" size="sm">
              Change
            </PillButton>
          </div>
        </SettingsRow>

        <SettingsRow label="Password" description="Update your password regularly">
          <div className="space-y-3">
            {!showPasswordChange ? (
              <PillButton
                variant="secondary"
                size="sm"
                onClick={() => setShowPasswordChange(true)}
              >
                Change Password
              </PillButton>
            ) : (
              <div className="space-y-3">
                <SettingsInput
                  id="currentPassword"
                  type="password"
                  label="Current Password"
                  placeholder="Enter current password"
                />
                <SettingsInput
                  id="newPassword"
                  type="password"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <SettingsInput
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm new password"
                />
                <div className="flex gap-2">
                  <PillButton variant="primary" size="sm">
                    Update Password
                  </PillButton>
                  <PillButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setShowPasswordChange(false)
                      setNewPassword('')
                    }}
                  >
                    Cancel
                  </PillButton>
                </div>
              </div>
            )}
          </div>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
      >
        <ToggleRow
          label="Enable 2FA"
          description="Require an authentication code in addition to your password when logging in"
          checked={formData.twoFactorEnabled}
          onChange={handleToggle2FA}
        />
      </SettingsSection>

      <SettingsSection
        title="Active Sessions"
        description="Manage your active login sessions"
      >
        {formData.activeSessions.length > 0 ? (
          <div className="space-y-3">
            {formData.activeSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-start justify-between p-4 rounded-md border border-border"
              >
                <div>
                  <h4 className="font-sans text-sm font-600 text-foreground">
                    {session.device}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {session.location}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last active: {session.lastActive}
                  </p>
                </div>
                <PillButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRevokeSession(session.id)}
                >
                  Revoke
                </PillButton>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No active sessions</p>
        )}
      </SettingsSection>

      <SettingsSection
        title="Connected Accounts"
        description="Manage your connected social and authentication accounts"
      >
        <div className="space-y-3">
          {formData.connectedAccounts.map((account) => (
            <div
              key={account.provider}
              className="flex items-center justify-between p-4 rounded-md border border-border"
            >
              <div>
                <h4 className="font-sans text-sm font-600 text-foreground">
                  {account.provider}
                </h4>
                {account.email && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {account.email}
                  </p>
                )}
              </div>
              <PillButton variant="secondary" size="sm">
                {account.connected ? 'Disconnect' : 'Connect'}
              </PillButton>
            </div>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Danger Zone"
        description="Irreversible actions. Please proceed with caution."
      >
        <div className="space-y-3">
          <div className="p-4 rounded-md border border-destructive/50 bg-destructive/10">
            <h4 className="font-sans text-sm font-600 text-destructive">
              Deactivate Account
            </h4>
            <p className="text-xs text-destructive/80 mt-1">
              Temporarily disable your account. You can reactivate it anytime.
            </p>
            <PillButton
              variant="secondary"
              size="sm"
              className="mt-3 border-destructive text-destructive"
            >
              Deactivate Account
            </PillButton>
          </div>
          <div className="p-4 rounded-md border border-destructive/50 bg-destructive/10">
            <h4 className="font-sans text-sm font-600 text-destructive">
              Delete Account Permanently
            </h4>
            <p className="text-xs text-destructive/80 mt-1">
              Delete your account and all associated data. This cannot be undone.
            </p>
            <PillButton
              variant="secondary"
              size="sm"
              className="mt-3 border-destructive text-destructive"
            >
              Delete Account
            </PillButton>
          </div>
        </div>
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
