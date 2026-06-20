'use client'

import { ToggleSwitch } from './ToggleSwitch'

interface ToggleRowProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: ToggleRowProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 pb-6 border-b border-border last:border-b-0 last:pb-0">
      <div className="flex-1">
        <h3 className="font-sans text-sm font-600 text-foreground">{label}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">
        <ToggleSwitch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          ariaLabel={label}
        />
      </div>
    </div>
  )
}
