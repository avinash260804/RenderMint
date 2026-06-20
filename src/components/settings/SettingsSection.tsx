"use client";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  const id = `settings-section-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <section className="mb-10" aria-labelledby={id}>
      <div className="mb-6 border-b border-border pb-4">
        <h2 id={id} className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-[oklch(0.72_0.08_55)]">
          {title}
        </h2>
        {description ? <p className="mt-2 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
