'use client'

interface SettingsSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <div className="mb-10">
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-accent">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground mt-2 font-sans">{description}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  )
}
