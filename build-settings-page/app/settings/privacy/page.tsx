'use client'

import { useState, useMemo } from 'react'
import { SettingsSection } from '@/components/settings/SettingsSection'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { ToggleRow } from '@/components/settings/ToggleRow'
import { SaveBar } from '@/components/settings/SaveBar'
import { useToast } from '@/lib/toast'
import { PrivacySettings } from '@/lib/types'

const INITIAL_STATE: PrivacySettings = {
  profileVisible: true,
  showOnlineStatus: true,
  workVisible: true,
  showActivity: true,
  allowMessages: true,
  messageSettings: 'followers',
}

export default function PrivacyPage() {
  const { addToast } = useToast()
  const [formData, setFormData] = useState<PrivacySettings>(INITIAL_STATE)
  const [isSaving, setIsSaving] = useState(false)

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(INITIAL_STATE)
  }, [formData])

  const handleToggle = (field: keyof PrivacySettings) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleMessageSettingChange = (
    value: 'everyone' | 'followers' | 'following'
  ) => {
    setFormData((prev) => ({
      ...prev,
      messageSettings: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: wire to API — POST /api/settings/privacy
      await new Promise((resolve) => setTimeout(resolve, 800))
      addToast('Privacy settings updated', 'success')
    } catch (error) {
      addToast('Failed to save privacy settings', 'error')
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
        title="Profile Visibility"
        description="Control who can see your profile and work"
      >
        <ToggleRow
          label="Make Profile Public"
          description="Allow anyone to visit your profile"
          checked={formData.profileVisible}
          onChange={() => handleToggle('profileVisible')}
        />

        <ToggleRow
          label="Show Online Status"
          description="Let others see when you&apos;re active"
          checked={formData.showOnlineStatus}
          onChange={() => handleToggle('showOnlineStatus')}
        />

        <ToggleRow
          label="Make Work Visible"
          description="Allow others to view your portfolio and uploaded work"
          checked={formData.workVisible}
          onChange={() => handleToggle('workVisible')}
        />

        <ToggleRow
          label="Show Activity"
          description="Display your recent activity on your profile"
          checked={formData.showActivity}
          onChange={() => handleToggle('showActivity')}
        />
      </SettingsSection>

      <SettingsSection
        title="Messaging"
        description="Control who can message you"
      >
        <ToggleRow
          label="Allow Direct Messages"
          description="Receive messages from other community members"
          checked={formData.allowMessages}
          onChange={() => handleToggle('allowMessages')}
        />

        {formData.allowMessages && (
          <SettingsRow
            label="Message Permissions"
            description="Who can send you messages"
          >
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="messageSettings"
                  value="everyone"
                  checked={formData.messageSettings === 'everyone'}
                  onChange={() => handleMessageSettingChange('everyone')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">Everyone</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="messageSettings"
                  value="followers"
                  checked={formData.messageSettings === 'followers'}
                  onChange={() => handleMessageSettingChange('followers')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">People I follow</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="messageSettings"
                  value="following"
                  checked={formData.messageSettings === 'following'}
                  onChange={() => handleMessageSettingChange('following')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">My followers only</span>
              </label>
            </div>
          </SettingsRow>
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
