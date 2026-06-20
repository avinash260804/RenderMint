'use client'

import { PillButton } from './PillButton'

interface SaveBarProps {
  isDirty: boolean
  isSaving: boolean
  onSave: () => void | Promise<void>
  onDiscard: () => void
}

export function SaveBar({
  isDirty,
  isSaving,
  onSave,
  onDiscard,
}: SaveBarProps) {
  if (!isDirty) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/98 backdrop-blur-md p-4 md:p-6 flex items-center justify-between z-40 animate-in slide-in-from-bottom-3 duration-300">
      <p className="text-sm font-mono text-muted-foreground uppercase tracking-wide">
        ⚠ Unsaved Changes
      </p>
      <div className="flex gap-3">
        <PillButton
          variant="secondary"
          size="sm"
          onClick={onDiscard}
          disabled={isSaving}
        >
          Discard
        </PillButton>
        <PillButton
          variant="primary"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </PillButton>
      </div>
    </div>
  )
}
