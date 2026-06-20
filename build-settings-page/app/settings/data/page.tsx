'use client'

import { useState, useMemo } from 'react'
import { SettingsSection } from '@/components/settings/SettingsSection'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { SaveBar } from '@/components/settings/SaveBar'
import { PillButton } from '@/components/settings/PillButton'
import { useToast } from '@/lib/toast'
import { DataSettings } from '@/lib/types'
import { Download, Copy } from 'lucide-react'

const INITIAL_STATE: DataSettings = {
  dataExportFormat: 'json',
  downloadData: false,
  deleteAccount: false,
}

export default function DataPage() {
  const { addToast } = useToast()
  const [formData, setFormData] = useState<DataSettings>(INITIAL_STATE)
  const [isSaving, setIsSaving] = useState(false)
  const [apiKey] = useState('sk_live_51234567890abcdef')

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(INITIAL_STATE)
  }, [formData])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: wire to API — POST /api/settings/data
      await new Promise((resolve) => setTimeout(resolve, 800))
      addToast('Data settings updated', 'success')
    } catch (error) {
      addToast('Failed to save data settings', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    setFormData(INITIAL_STATE)
  }

  const handleExportData = async () => {
    try {
      // TODO: wire to API — GET /api/settings/export
      addToast(
        `Starting data export as ${formData.dataExportFormat.toUpperCase()}...`,
        'success'
      )
      // Simulate download delay
      setTimeout(() => {
        addToast('Data export complete', 'success')
      }, 2000)
    } catch (error) {
      addToast('Failed to export data', 'error')
    }
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    addToast('API key copied to clipboard', 'success')
  }

  return (
    <>
      <SettingsSection
        title="Data & Privacy"
        description="Manage your data, exports, and privacy controls"
      >
        <SettingsRow
          label="Download Your Data"
          description="Export all your profile data and settings"
        >
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-mono tracking-wider text-muted-foreground mb-2 uppercase">
                Export Format
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="json"
                    checked={formData.dataExportFormat === 'json'}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dataExportFormat: 'json',
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground">JSON</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="csv"
                    checked={formData.dataExportFormat === 'csv'}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dataExportFormat: 'csv',
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground">CSV</span>
                </label>
              </div>
            </div>
            <PillButton
              variant="secondary"
              size="sm"
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Data
            </PillButton>
          </div>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection
        title="API Access"
        description="Manage API keys for programmatic access"
      >
        <SettingsRow
          label="API Key"
          description="Use this key to access your data via our API"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-md bg-muted border border-border font-mono text-sm text-foreground break-all">
              {apiKey}
              <button
                onClick={handleCopyApiKey}
                className="flex-shrink-0 ml-auto hover:opacity-70 transition-opacity"
                title="Copy API key"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Keep this key secret. Do not share it with anyone.
            </p>
            <PillButton variant="secondary" size="sm">
              Regenerate Key
            </PillButton>
          </div>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection
        title="Danger Zone"
        description="Irreversible actions. Please proceed with caution."
      >
        <div className="space-y-3">
          <div className="p-4 rounded-md border border-destructive/50 bg-destructive/10">
            <h4 className="font-sans text-sm font-600 text-destructive">
              Delete All Data
            </h4>
            <p className="text-xs text-destructive/80 mt-1">
              Permanently delete all your data from Atelier. This action cannot be undone.
            </p>
            <PillButton
              variant="secondary"
              size="sm"
              className="mt-3 border-destructive text-destructive"
            >
              Delete All Data
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
