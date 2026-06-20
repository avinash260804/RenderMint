'use client'

import { useState, useMemo } from 'react'
import { SettingsSection } from '@/components/settings/SettingsSection'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { ToggleRow } from '@/components/settings/ToggleRow'
import { SettingsInput } from '@/components/settings/SettingsInput'
import { SaveBar } from '@/components/settings/SaveBar'
import { useToast } from '@/lib/toast'
import { CreditsSettings } from '@/lib/types'

const INITIAL_STATE: CreditsSettings = {
  displayCredits: true,
  creditNotificationEmail: 'jane@example.com',
  creditGoal: 500,
}

export default function CreditsPage() {
  const { addToast } = useToast()
  const [formData, setFormData] = useState<CreditsSettings>(INITIAL_STATE)
  const [isSaving, setIsSaving] = useState(false)

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(INITIAL_STATE)
  }, [formData])

  const handleInputChange = (
    field: keyof CreditsSettings,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: wire to API — POST /api/settings/credits
      await new Promise((resolve) => setTimeout(resolve, 800))
      addToast('Credits settings updated', 'success')
    } catch (error) {
      addToast('Failed to save credits settings', 'error')
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
        title="Studio Credits"
        description="Manage how your work and credit contributions are tracked"
      >
        <ToggleRow
          label="Display Credits Publicly"
          description="Show credits and attributions on your profile"
          checked={formData.displayCredits}
          onChange={(checked) =>
            handleInputChange('displayCredits', checked)
          }
        />

        <SettingsRow
          label="Credit Goals"
          description="Set a target for credits you want to earn"
        >
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={formData.creditGoal}
              onChange={(e) =>
                handleInputChange('creditGoal', parseInt(e.target.value, 10))
              }
              className="w-24 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              min="0"
              step="50"
            />
            <span className="text-sm text-muted-foreground">credits</span>
          </div>
        </SettingsRow>

        <SettingsRow
          label="Credit Email Notifications"
          description="Email address for credit activity notifications"
        >
          <SettingsInput
            id="creditEmail"
            label="Email Address"
            type="email"
            value={formData.creditNotificationEmail}
            onChange={(e) =>
              handleInputChange('creditNotificationEmail', e.target.value)
            }
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection
        title="Reputation"
        description="Manage how your reputation and achievements are displayed"
      >
        <div className="space-y-4 p-4 rounded-lg bg-muted border border-border">
          <div>
            <h4 className="font-sans text-sm font-600 text-foreground">
              Your Credits
            </h4>
            <p className="text-2xl font-bold text-accent mt-2">1,250</p>
          </div>
          <div>
            <h4 className="font-sans text-sm font-600 text-foreground mt-4">
              Reputation Level
            </h4>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Emerging Designer
                </span>
                <span className="text-xs font-mono bg-accent text-accent-foreground px-2 py-1 rounded">
                  Current
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                <div className="bg-accent h-full" style={{ width: '65%' }} />
              </div>
              <p className="text-xs text-muted-foreground">
                975 credits needed to reach &quot;Established Designer&quot;
              </p>
            </div>
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
