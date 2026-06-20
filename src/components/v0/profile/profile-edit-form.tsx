"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ProfileNav } from "@/components/v0/profile/profile-nav";

type DisciplineOption = {
  id: number;
  name: string;
  slug: string;
  softwares: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
};

type EditableProfile = {
  username: string;
  bio: string | null;
  experienceLevel: string | null;
  skills: string[];
  primaryDiscipline: string | null;
  softwares: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
};

type ProfileEditFormProps = {
  profile: EditableProfile;
  disciplines: DisciplineOption[];
};

const EXPERIENCE_OPTIONS = ["Student", "Practitioner", "Contributor", "Mentor"];

function getInitials(username: string) {
  return username
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "AT";
}

export function ProfileEditForm({ profile, disciplines }: ProfileEditFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [experienceLevel, setExperienceLevel] = useState(profile.experienceLevel ?? "Practitioner");
  const [disciplineSlug, setDisciplineSlug] = useState(profile.primaryDiscipline ?? disciplines[0]?.slug ?? "");
  const [skills, setSkills] = useState(profile.skills.join(", "));
  const [softwareIds, setSoftwareIds] = useState<number[]>(profile.softwares.map((software) => software.id));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedDiscipline = useMemo(
    () => disciplines.find((discipline) => discipline.slug === disciplineSlug),
    [disciplineSlug, disciplines],
  );

  function toggleSoftware(id: number) {
    setSoftwareIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      username,
      bio,
      experienceLevel,
      primaryDiscipline: disciplineSlug,
      skills: skills
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      softwareIds,
    };

    const response = await fetch("/api/profiles/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
      setError(body?.error?.message ?? "Unable to update profile.");
      setSubmitting(false);
      return;
    }

    router.push(`/profile/${username.toLowerCase()}`);
    router.refresh();
  }

  return (
    <div className="v0-preview-theme min-h-screen bg-background text-foreground">
      <ProfileNav
        userName={profile.username}
        userInitials={getInitials(profile.username)}
        disciplineName={selectedDiscipline?.name ?? "Discipline pending"}
        experienceLevel={experienceLevel}
        statusLine="Editing your profile identity"
      />

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 pb-20 pt-20">
        <section className="panel-primary p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Profile edit</p>
          <h1 className="mt-3 font-[var(--font-bebas)] text-5xl leading-none tracking-tight">Shape your public identity</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Keep this page grounded in your actual discipline, working tools, and the kind of critique or collaboration you want to attract.
          </p>
        </section>

        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="panel-primary space-y-6 p-6 md:p-8">
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Username</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full border border-border/50 bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                minLength={3}
                maxLength={32}
                pattern="[a-z0-9_]+"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Bio</span>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className="min-h-[140px] w-full border border-border/50 bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                maxLength={300}
              />
            </label>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Discipline</span>
                <select
                  value={disciplineSlug}
                  onChange={(event) => {
                    setDisciplineSlug(event.target.value);
                    setSoftwareIds([]);
                  }}
                  className="w-full border border-border/50 bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                >
                  {disciplines.map((discipline) => (
                    <option key={discipline.id} value={discipline.slug}>
                      {discipline.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Experience level</span>
                <select
                  value={experienceLevel}
                  onChange={(event) => setExperienceLevel(event.target.value)}
                  className="w-full border border-border/50 bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                >
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Skills</span>
              <input
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="Spatial reasoning, rendering workflows, critique framing"
                className="w-full border border-border/50 bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
              <span className="mt-2 block text-xs text-muted-foreground">Separate each skill with a comma.</span>
            </label>
          </section>

          <section className="panel-primary space-y-6 p-6 md:p-8">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Software proficiency</p>
              <div className="grid gap-3">
                {selectedDiscipline?.softwares.map((software) => (
                  <label
                    key={software.id}
                    className="flex items-center gap-3 border border-border/40 bg-background/30 px-4 py-3 text-sm text-foreground"
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
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Saving profile" : "Save profile"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/settings/profile")}
                className="w-full border border-[oklch(0.7_0.2_45_/_0.32)] bg-[oklch(0.7_0.2_45_/_0.08)] px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-[oklch(0.82_0.1_58)] transition-colors hover:bg-[oklch(0.7_0.2_45_/_0.14)]"
              >
                Open settings
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full border border-border/50 px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}

