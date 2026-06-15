"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { DisciplineWithSoftwares } from "@/types/auth";

type OnboardingFormProps = {
  disciplines: DisciplineWithSoftwares[];
};

export function OnboardingForm({ disciplines }: OnboardingFormProps) {
  const router = useRouter();
  const [disciplineSlug, setDisciplineSlug] = useState(disciplines[0]?.slug ?? "");
  const [username, setUsername] = useState("");
  const [softwareIds, setSoftwareIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedDiscipline = useMemo(
    () => disciplines.find((discipline) => discipline.slug === disciplineSlug),
    [disciplineSlug, disciplines],
  );
  const selectedCount = softwareIds.length;

  function toggleSoftware(id: number) {
    setSoftwareIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, disciplineSlug, softwareIds }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      setError(payload?.error?.message ?? "Unable to complete onboarding.");
      setSubmitting(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="v0-preview-theme v0-surface v0-surface--onboarding min-h-screen bg-background text-foreground">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="dashboard-grid-overlay" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[92rem] px-6 pb-16 pt-10 md:px-10 md:pt-14">
        <div className="mb-10 flex items-center justify-between gap-4 border-b border-border/20 pb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              Atelier / Onboarding
            </p>
            <h1 className="mt-4 font-[var(--font-bebas)] text-5xl tracking-tight md:text-6xl">
              Shape Your Practice
            </h1>
            <p className="mt-3 max-w-2xl font-mono text-xs leading-relaxed text-muted-foreground">
              Set the public identity that anchors your dashboard, discipline space, and future critique conversations.
            </p>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="panel-secondary px-4 py-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">Required</p>
              <p className="mt-2 text-sm text-foreground">Username, discipline, and at least one software.</p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="panel-primary space-y-8 p-6 md:p-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Identity
              </p>
              <label className="mt-4 block">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Username
                </span>
                <input
                  className="w-full border border-border/50 bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                  name="username"
                  placeholder="your_username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  minLength={3}
                  maxLength={32}
                  pattern="[a-z0-9_]+"
                />
                <span className="mt-2 block font-mono text-[10px] text-muted-foreground/70">
                  Lowercase letters, numbers, and underscores only.
                </span>
              </label>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Primary Discipline
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {disciplines.map((discipline) => {
                  const active = discipline.slug === disciplineSlug;
                  return (
                    <button
                      key={discipline.id}
                      type="button"
                      onClick={() => {
                        setDisciplineSlug(discipline.slug);
                        setSoftwareIds([]);
                      }}
                      className="text-left transition-all"
                    >
                      <div
                        className="h-full border px-4 py-4"
                        style={{
                          borderColor: active ? "oklch(0.70 0.20 45 / 0.55)" : "oklch(0.22 0 0)",
                          background: active ? "oklch(0.70 0.20 45 / 0.08)" : "oklch(0.11 0.003 60 / 0.65)",
                        }}
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                          Discipline
                        </p>
                        <p className="mt-3 text-lg font-medium tracking-tight text-foreground">
                          {discipline.name}
                        </p>
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                          {discipline.softwares.length} software tracks
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <fieldset className="space-y-4">
              <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Working Stack
              </legend>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-foreground/80">
                  Select the tools you actually use for this discipline.
                </p>
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  {selectedCount} selected
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {selectedDiscipline?.softwares.map((software) => {
                  const active = softwareIds.includes(software.id);
                  return (
                    <button
                      key={software.id}
                      type="button"
                      onClick={() => toggleSoftware(software.id)}
                      className="text-left transition-all"
                    >
                      <div
                        className="flex items-center justify-between gap-4 border px-4 py-3"
                        style={{
                          borderColor: active ? "oklch(0.70 0.20 45 / 0.55)" : "oklch(0.22 0 0)",
                          background: active ? "oklch(0.70 0.20 45 / 0.08)" : "oklch(0.11 0.003 60 / 0.55)",
                        }}
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{software.name}</p>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/65">
                            {selectedDiscipline?.name}
                          </p>
                        </div>
                        <span
                          className="h-3 w-3 rounded-full border"
                          style={{
                            borderColor: active ? "oklch(0.70 0.20 45)" : "oklch(0.40 0 0)",
                            background: active ? "oklch(0.70 0.20 45)" : "transparent",
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </section>

          <aside className="space-y-6">
            <section className="panel-primary p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Preview
              </p>
              <div className="mt-6 space-y-5">
                <div
                  className="flex h-16 w-16 items-center justify-center"
                  style={{
                    background: "oklch(0.13 0.004 60)",
                    border: "1.5px solid oklch(0.70 0.20 45)",
                    borderRadius: "10px",
                    color: "oklch(0.70 0.20 45)",
                    fontFamily: "var(--font-bebas)",
                    fontSize: "30px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {(username || "AT").slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <p className="font-[var(--font-bebas)] text-3xl tracking-tight text-foreground">
                    {username || "your_username"}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                    {selectedDiscipline?.name ?? "Discipline pending"}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Selected software
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDiscipline?.softwares
                      .filter((software) => softwareIds.includes(software.id))
                      .map((software) => (
                        <span
                          key={software.id}
                          className="border px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                          style={{
                            borderColor: "oklch(0.70 0.20 45 / 0.45)",
                            color: "oklch(0.70 0.20 45)",
                            background: "oklch(0.70 0.20 45 / 0.08)",
                          }}
                        >
                          {software.name}
                        </span>
                      ))}
                    {selectedCount === 0 ? (
                      <span className="text-sm text-muted-foreground">Choose at least one tool to continue.</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            <section className="panel-primary p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Completion
              </p>
              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <p>1. Claim your username</p>
                <p>2. Choose your main discipline</p>
                <p>3. Add the software stack you work in</p>
              </div>

              {error ? <p className="mt-5 text-sm text-red-400">{error}</p> : null}

              <button
                className="mt-6 w-full bg-accent px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Saving profile" : "Finish onboarding"}
              </button>
            </section>
          </aside>
        </form>
      </div>
    </div>
  );
}
