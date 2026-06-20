'use client'

import { useState, useMemo, useEffect } from 'react'
import { SettingsSection } from '@/components/settings/SettingsSection'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { ToggleRow } from '@/components/settings/ToggleRow'
import { SettingsInput } from '@/components/settings/SettingsInput'
import { SaveBar } from '@/components/settings/SaveBar'
import { useToast } from '@/lib/toast'
import { useProfile } from '@/hooks/useProfile'
import { ProfileSettings } from '@/lib/types'

const INITIAL_STATE: ProfileSettings = {
  displayName: 'Jane Doe',
  username: 'janedoe',
  bio: 'Product designer and creative thinker exploring the intersection of design and technology.',
  avatarUrl: '',
  coverImageUrl: '',
  portfolioUrl: 'https://janedoe.design',
  location: 'San Francisco, CA',
  locationVisible: true,
  socialLinks: {
    twitter: 'janedoe',
    instagram: 'janedoe.design',
    behance: '',
    linkedin: 'janedoe',
    dribbble: '',
  },
}

export default function ProfilePage() {
  const { addToast } = useToast()
  const { profile, loading } = useProfile()
  const [formData, setFormData] = useState<ProfileSettings>(INITIAL_STATE)
  const [isSaving, setIsSaving] = useState(false)
  const [initialState, setInitialState] = useState<ProfileSettings>(INITIAL_STATE)

  // Load real profile data when hook provides it
  useEffect(() => {
    if (profile && !loading) {
      const newState: ProfileSettings = {
        displayName: profile.username || '',
        username: profile.username || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatar_url || '',
        coverImageUrl: '',
        portfolioUrl: '',
        location: '',
        locationVisible: true,
        socialLinks: {
          twitter: '',
          instagram: '',
          behance: '',
          linkedin: '',
          dribbble: '',
        },
      }
      setFormData(newState)
      setInitialState(newState)
    }
  }, [profile, loading])

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialState)
  }, [formData, initialState])

  const handleInputChange = (
    field: keyof ProfileSettings,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // In production, this would call:
      // const response = await fetch('/api/profiles/me', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })
      // if (!response.ok) throw new Error('Failed to save profile')

      await new Promise((resolve) => setTimeout(resolve, 800))
      setInitialState(formData)
      addToast('Profile updated successfully', 'success')
    } catch (error) {
      addToast('Failed to save profile', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    setFormData(initialState)
  }

  return (
    <>
      <SettingsSection
        title="Profile"
        description="Manage your public profile information and how others see you on Atelier."
      >
        <SettingsRow label="Display Name" description="Your full name">
          <SettingsInput
            id="displayName"
            label="Display Name"
            value={formData.displayName}
            onChange={(e) =>
              handleInputChange('displayName', e.target.value)
            }
            counter={{
              current: formData.displayName.length,
              max: 50,
            }}
            maxLength={50}
          />
        </SettingsRow>

        <SettingsRow label="Username" description="Unique handle for your profile">
          <SettingsInput
            id="username"
            label="Username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            helper="Only letters, numbers, and underscores allowed"
            maxLength={30}
          />
        </SettingsRow>

        <SettingsRow label="Bio" description="Tell the community about yourself">
          <textarea
            id="bio"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
            maxLength={500}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {formData.bio.length} / 500
          </p>
        </SettingsRow>

        <SettingsRow label="Portfolio URL" description="Link to your work">
          <SettingsInput
            id="portfolioUrl"
            label="Portfolio URL"
            type="url"
            value={formData.portfolioUrl}
            onChange={(e) =>
              handleInputChange('portfolioUrl', e.target.value)
            }
            placeholder="https://yourportfolio.com"
          />
        </SettingsRow>

        <SettingsRow label="Location" description="Where you&apos;re based">
          <div className="flex flex-col gap-3">
            <SettingsInput
              id="location"
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, Country"
            />
          </div>
        </SettingsRow>

        <ToggleRow
          label="Show Location"
          description="Display your location on your profile"
          checked={formData.locationVisible}
          onChange={(checked) =>
            handleInputChange('locationVisible', checked)
          }
        />
      </SettingsSection>

      <SettingsSection
        title="Social Links"
        description="Connect your social profiles"
      >
        <SettingsRow label="Twitter" description="Your Twitter handle">
          <SettingsInput
            id="twitter"
            label="Twitter Handle"
            value={formData.socialLinks.twitter || ''}
            onChange={(e) =>
              handleSocialLinkChange('twitter', e.target.value)
            }
            placeholder="@username"
          />
        </SettingsRow>

        <SettingsRow label="Instagram" description="Your Instagram handle">
          <SettingsInput
            id="instagram"
            label="Instagram Handle"
            value={formData.socialLinks.instagram || ''}
            onChange={(e) =>
              handleSocialLinkChange('instagram', e.target.value)
            }
            placeholder="username"
          />
        </SettingsRow>

        <SettingsRow label="LinkedIn" description="Your LinkedIn profile">
          <SettingsInput
            id="linkedin"
            label="LinkedIn Handle"
            value={formData.socialLinks.linkedin || ''}
            onChange={(e) =>
              handleSocialLinkChange('linkedin', e.target.value)
            }
            placeholder="username"
          />
        </SettingsRow>

        <SettingsRow label="Behance" description="Your Behance profile">
          <SettingsInput
            id="behance"
            label="Behance Handle"
            value={formData.socialLinks.behance || ''}
            onChange={(e) =>
              handleSocialLinkChange('behance', e.target.value)
            }
            placeholder="username"
          />
        </SettingsRow>

        <SettingsRow label="Dribbble" description="Your Dribbble profile">
          <SettingsInput
            id="dribbble"
            label="Dribbble Handle"
            value={formData.socialLinks.dribbble || ''}
            onChange={(e) =>
              handleSocialLinkChange('dribbble', e.target.value)
            }
            placeholder="username"
          />
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
