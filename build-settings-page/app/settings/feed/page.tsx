'use client'

import { useState, useMemo } from 'react'
import { SettingsSection } from '@/components/settings/SettingsSection'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { ToggleRow } from '@/components/settings/ToggleRow'
import { SaveBar } from '@/components/settings/SaveBar'
import { useToast } from '@/lib/toast'
import { FeedSettings } from '@/lib/types'

const INITIAL_STATE: FeedSettings = {
  showFollowing: true,
  showTrending: true,
  showCollaborations: true,
  showOpportunities: true,
  contentFilter: 'all',
}

export default function FeedPage() {
  const { addToast } = useToast()
  const [formData, setFormData] = useState<FeedSettings>(INITIAL_STATE)
  const [isSaving, setIsSaving] = useState(false)

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(INITIAL_STATE)
  }, [formData])

  const handleToggle = (field: keyof FeedSettings) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: wire to API — POST /api/settings/feed
      await new Promise((resolve) => setTimeout(resolve, 800))
      addToast('Feed preferences updated', 'success')
    } catch (error) {
      addToast('Failed to save feed settings', 'error')
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
        title="Feed Content"
        description="Customize what appears in your personalized feed"
      >
        <ToggleRow
          label="Show Following"
          description="Display posts from people you follow"
          checked={formData.showFollowing}
          onChange={() => handleToggle('showFollowing')}
        />

        <ToggleRow
          label="Show Trending"
          description="Show trending work and topics in your feed"
          checked={formData.showTrending}
          onChange={() => handleToggle('showTrending')}
        />

        <ToggleRow
          label="Show Collaborations"
          description="See collaboration requests and opportunities"
          checked={formData.showCollaborations}
          onChange={() => handleToggle('showCollaborations')}
        />

        <ToggleRow
          label="Show Opportunities"
          description="Display relevant job and project opportunities"
          checked={formData.showOpportunities}
          onChange={() => handleToggle('showOpportunities')}
        />
      </SettingsSection>

      <SettingsSection
        title="Content Filtering"
        description="Filter feed content by type"
      >
        <SettingsRow
          label="Content Filter"
          description="Choose how to filter your feed content"
        >
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="contentFilter"
                value="all"
                checked={formData.contentFilter === 'all'}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, contentFilter: 'all' }))
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Show all content</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="contentFilter"
                value="disciplines"
                checked={formData.contentFilter === 'disciplines'}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    contentFilter: 'disciplines',
                  }))
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">
                Your disciplines only
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="contentFilter"
                value="following"
                checked={formData.contentFilter === 'following'}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    contentFilter: 'following',
                  }))
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">
                People I follow only
              </span>
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
