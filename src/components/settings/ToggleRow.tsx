"use client";

import { ToggleSwitch } from "./ToggleSwitch";

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function ToggleRow({ label, description, checked, onChange, disabled }: ToggleRowProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 last:border-b-0 last:pb-0 md:flex-row md:items-center">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-foreground">{label}</h3>
        {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <div className="shrink-0">
        <ToggleSwitch checked={checked} onChange={onChange} disabled={disabled} ariaLabel={label} />
      </div>
    </div>
  );
}
