'use client'

interface SettingsRowProps {
  label: string
  description?: string
  children: React.ReactNode
  error?: string
}

export function SettingsRow({
  label,
  description,
  children,
  error,
}: SettingsRowProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-4 pb-5 border-b border-border last:border-b-0 last:pb-0">
      <div className="md:w-48 flex-shrink-0">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wide text-foreground">{label}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-1.5 font-sans">{description}</p>
        )}
        {error && (
          <p className="text-xs text-accent mt-1.5 font-sans" role="alert">
            {error}
          </p>
        )}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
