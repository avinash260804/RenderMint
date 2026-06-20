'use client'

import { useState, useMemo, useEffect } from 'react'
import { SettingsSection } from '@/components/settings/SettingsSection'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { ToggleRow } from '@/components/settings/ToggleRow'
import { SettingsInput } from '@/components/settings/SettingsInput'
import { SaveBar } from '@/components/settings/SaveBar'
import { useToast } from '@/lib/toast'
import { useDisciplines, useSoftware } from '@/hooks/useDisciplines'
import { CreativeIdentitySettings } from '@/lib/types'
import {
  DISCIPLINES,
  EXPERIENCE_LEVELS,
  SOFTWARE_TOOLS,
} from '@/lib/constants'

const INITIAL_STATE: CreativeIdentitySettings = {
  primaryDiscipline: 'Product Design',
  secondaryDisciplines: ['UX Design', 'UI Design'],
  experienceLevel: 'senior',
  softwareTools: ['Figma', 'Adobe XD', 'Adobe Illustrator'],
  skills: ['Wireframing', 'User Research', 'Prototyping', 'Design Systems'],
  acceptCritique: true,
  offerMentorship: true,
}

export default function IdentityPage() {
  const { addToast } = useToast()
  const { disciplines, loading: disciplinesLoading } = useDisciplines()
  const { software, loading: softwareLoading } = useSoftware()
  const [formData, setFormData] = useState<CreativeIdentitySettings>(
    INITIAL_STATE
  )
  const [isSaving, setIsSaving] = useState(false)
  const [initialState, setInitialState] = useState<CreativeIdentitySettings>(INITIAL_STATE)

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialState)
  }, [formData, initialState])

  const handleInputChange = (
    field: keyof CreativeIdentitySettings,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleArrayItem = (
    field: 'secondaryDisciplines' | 'softwareTools' | 'skills',
    item: string
  ) => {
    setFormData((prev) => {
      const arr = prev[field]
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item],
      }
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: wire to API — POST /api/settings/identity
      await new Promise((resolve) => setTimeout(resolve, 800))
      addToast('Creative identity updated successfully', 'success')
    } catch (error) {
      addToast('Failed to save creative identity', 'error')
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
        title="Creative Identity"
        description="Tell us about your creative practice and expertise"
      >
        <SettingsRow
          label="Primary Discipline"
          description="Your main area of focus"
        >
          <select
            value={formData.primaryDiscipline}
            onChange={(e) =>
              handleInputChange('primaryDiscipline', e.target.value)
            }
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {DISCIPLINES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </SettingsRow>

        <SettingsRow
          label="Experience Level"
          description="Your professional experience"
        >
          <div className="space-y-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <label
                key={level.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="experienceLevel"
                  value={level.value}
                  checked={formData.experienceLevel === level.value}
                  onChange={(e) =>
                    handleInputChange('experienceLevel', e.target.value)
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">{level.label}</span>
              </label>
            ))}
          </div>
        </SettingsRow>

        <SettingsRow
          label="Secondary Disciplines"
          description="Other areas you work in"
        >
          <div className="space-y-2">
            {DISCIPLINES.map((d) => (
              <label
                key={d}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.secondaryDisciplines.includes(d)}
                  onChange={() => toggleArrayItem('secondaryDisciplines', d)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-foreground">{d}</span>
              </label>
            ))}
          </div>
        </SettingsRow>

        <SettingsRow label="Software & Tools" description="Tools you use regularly">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {SOFTWARE_TOOLS.map((tool) => (
              <label
                key={tool}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.softwareTools.includes(tool)}
                  onChange={() => toggleArrayItem('softwareTools', tool)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-foreground">{tool}</span>
              </label>
            ))}
          </div>
        </SettingsRow>

        <SettingsRow label="Key Skills" description="Type your skills, press Enter to add">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => toggleArrayItem('skills', skill)}
                    className="text-xs hover:opacity-70"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a skill..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  toggleArrayItem('skills', e.currentTarget.value.trim())
                  e.currentTarget.value = ''
                }
              }}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection
        title="Community Engagement"
        description="How you interact with the Atelier community"
      >
        <ToggleRow
          label="Accept Critiques"
          description="Allow community members to provide constructive feedback on your work"
          checked={formData.acceptCritique}
          onChange={(checked) => handleInputChange('acceptCritique', checked)}
        />

        <ToggleRow
          label="Offer Mentorship"
          description="Be available to mentor and help emerging designers"
          checked={formData.offerMentorship}
          onChange={(checked) =>
            handleInputChange('offerMentorship', checked)
          }
        />
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
