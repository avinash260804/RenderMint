'use client'

import { useState, useMemo } from 'react'
import { SettingsSection } from '@/components/settings/SettingsSection'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { ToggleRow } from '@/components/settings/ToggleRow'
import { SaveBar } from '@/components/settings/SaveBar'
import { useToast } from '@/lib/toast'
import { AppearanceSettings } from '@/lib/types'

const INITIAL_STATE: AppearanceSettings = {
  theme: 'system',
  compact: false,
  fontSize: 'normal',
}

export default function AppearancePage() {
  const { addToast } = useToast()
  const [formData, setFormData] = useState<AppearanceSettings>(INITIAL_STATE)
  const [isSaving, setIsSaving] = useState(false)

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(INITIAL_STATE)
  }, [formData])

  const handleToggle = (field: keyof AppearanceSettings) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: wire to API — POST /api/settings/appearance
      await new Promise((resolve) => setTimeout(resolve, 800))
      addToast('Appearance preferences updated', 'success')
    } catch (error) {
      addToast('Failed to save appearance settings', 'error')
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
        title="Theme"
        description="Customize how Atelier looks for you"
      >
        <SettingsRow label="Color Theme" description="Choose your preferred theme">
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={formData.theme === 'light'}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, theme: 'light' }))
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Light</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={formData.theme === 'dark'}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, theme: 'dark' }))
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Dark</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="system"
                checked={formData.theme === 'system'}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, theme: 'system' }))
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">System</span>
            </label>
          </div>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection
        title="Layout"
        description="Adjust how content is displayed"
      >
        <ToggleRow
          label="Compact Mode"
          description="Use a more compact layout with reduced spacing"
          checked={formData.compact}
          onChange={() => handleToggle('compact')}
        />
      </SettingsSection>

      <SettingsSection
        title="Readability"
        description="Customize text size for better readability"
      >
        <SettingsRow label="Font Size" description="Adjust the base text size">
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="fontSize"
                value="small"
                checked={formData.fontSize === 'small'}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, fontSize: 'small' }))
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Small</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="fontSize"
                value="normal"
                checked={formData.fontSize === 'normal'}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, fontSize: 'normal' }))
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Normal</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="fontSize"
                value="large"
                checked={formData.fontSize === 'large'}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, fontSize: 'large' }))
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Large</span>
            </label>
          </div>
        </SettingsRow>
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
