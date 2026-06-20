"use client";

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  error?: string;
}

export function SettingsRow({ label, description, children, error }: SettingsRowProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-5 last:border-b-0 last:pb-0 md:flex-row md:items-start">
      <div className="shrink-0 md:w-48">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground">{label}</h3>
        {description ? <p className="mt-1.5 text-xs text-muted-foreground">{description}</p> : null}
        {error ? (
          <p className="mt-1.5 text-xs text-accent" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
