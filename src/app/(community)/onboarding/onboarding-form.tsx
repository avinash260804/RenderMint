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
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? "Unable to complete onboarding.");
      setSubmitting(false);
      return;
    }

    router.push("/");
  }

  return (
    <form className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6" onSubmit={onSubmit}>
      <h1 className="text-2xl font-semibold">Complete onboarding</h1>

      <label className="flex flex-col gap-2">
        <span className="text-sm">Username</span>
        <input
          className="rounded-md border bg-transparent px-3 py-2"
          name="username"
          placeholder="your_username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          minLength={3}
          maxLength={32}
          pattern="[a-z0-9_]+"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm">Primary discipline</span>
        <select
          className="rounded-md border bg-transparent px-3 py-2"
          value={disciplineSlug}
          onChange={(event) => {
            setDisciplineSlug(event.target.value);
            setSoftwareIds([]);
          }}
        >
          {disciplines.map((discipline) => (
            <option key={discipline.id} value={discipline.slug}>
              {discipline.name}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm">Select softwares (at least one)</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {selectedDiscipline?.softwares.map((software) => (
            <label
              key={software.id}
              className="flex items-center gap-2 rounded-md border px-3 py-2"
            >
              <input
                type="checkbox"
                checked={softwareIds.includes(software.id)}
                onChange={() => toggleSoftware(software.id)}
              />
              <span>{software.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <button
        className="rounded-md bg-foreground px-4 py-2 text-background"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Saving..." : "Finish onboarding"}
      </button>
    </form>
  );
}
