'use client'

import { useState, useMemo } from 'react'
import { SettingsSection } from '@/components/settings/SettingsSection'
import { ToggleRow } from '@/components/settings/ToggleRow'
import { SaveBar } from '@/components/settings/SaveBar'
import { useToast } from '@/lib/toast'
import { NotificationSettings } from '@/lib/types'
import { NOTIFICATION_CATEGORIES } from '@/lib/constants'

const INITIAL_STATE: NotificationSettings = {
  'activity-on-work': true,
  'comments-replies': true,
  'follows-appreciations': true,
  messages: true,
  opportunities: true,
  'updates-followed': true,
  digests: false,
  email: true,
  'email-frequency': 'daily',
}

export default function NotificationsPage() {
  const { addToast } = useToast()
  const [formData, setFormData] = useState<NotificationSettings>(INITIAL_STATE)
  const [isSaving, setIsSaving] = useState(false)

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(INITIAL_STATE)
  }, [formData])

  const handleToggle = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: wire to API — POST /api/settings/notifications
      await new Promise((resolve) => setTimeout(resolve, 800))
      addToast('Notification preferences updated', 'success')
    } catch (error) {
      addToast('Failed to save notification settings', 'error')
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
        title="In-App Notifications"
        description="Choose what notifications you receive in Atelier"
      >
        <ToggleRow
          label="Activity on Your Work"
          description="When someone likes, comments on, or shares your work"
          checked={formData['activity-on-work'] as boolean}
          onChange={() => handleToggle('activity-on-work')}
        />

        <ToggleRow
          label="Comments & Replies"
          description="When someone replies to your comments"
          checked={formData['comments-replies'] as boolean}
          onChange={() => handleToggle('comments-replies')}
        />

        <ToggleRow
          label="Follows & Appreciations"
          description="When someone follows you or appreciates your profile"
          checked={formData['follows-appreciations'] as boolean}
          onChange={() => handleToggle('follows-appreciations')}
        />

        <ToggleRow
          label="Messages"
          description="When you receive a new message"
          checked={formData['messages'] as boolean}
          onChange={() => handleToggle('messages')}
        />

        <ToggleRow
          label="Opportunities"
          description="New opportunities matching your disciplines"
          checked={formData['opportunities'] as boolean}
          onChange={() => handleToggle('opportunities')}
        />

        <ToggleRow
          label="Updates from Followed Users"
          description="When someone you follow posts new work"
          checked={formData['updates-followed'] as boolean}
          onChange={() => handleToggle('updates-followed')}
        />

        <ToggleRow
          label="Weekly Digest"
          description="A summary of activity from the community you follow"
          checked={formData['digests'] as boolean}
          onChange={() => handleToggle('digests')}
        />
      </SettingsSection>

      <SettingsSection
        title="Email Notifications"
        description="Manage how we contact you via email"
      >
        <ToggleRow
          label="Email Notifications"
          description="Receive notifications via email"
          checked={formData['email'] as boolean}
          onChange={() => handleToggle('email')}
        />

        {formData['email'] && (
          <div className="mt-4">
            <label className="block text-sm font-mono tracking-wider text-muted-foreground mb-3 uppercase">
              Email Frequency
            </label>
            <div className="space-y-2">
              {['instant', 'daily', 'weekly'].map((freq) => (
                <label key={freq} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="emailFrequency"
                    value={freq}
                    checked={formData['email-frequency'] === freq}
                    onChange={() =>
                      handleToggle(`email-frequency-${freq}`) ||
                      setFormData((prev) => ({
                        ...prev,
                        'email-frequency': freq,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm capitalize text-foreground">
                    {freq === 'instant' ? 'As it happens' : `${freq}ly`}
                  </span>
                </label>
              ))}
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
