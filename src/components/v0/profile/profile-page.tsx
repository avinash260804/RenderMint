"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ProfileNav } from "@/components/v0/profile/profile-nav";

type ProfilePageProfile = {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  experienceLevel: string | null;
  skills: string[];
  primaryDiscipline: string | null;
  discipline: {
    id: number;
    slug: string;
    name: string;
  } | null;
  reputation: number;
  createdAt: string;
  softwares: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  stats: {
    postCount: number;
    commentCount: number;
    acceptedAnswerCount: number;
    reputation: number;
  };
};

type ProfilePost = {
  id: string;
  slug: string;
  title: string;
  type: string;
  bodyPreview: string;
  discipline: {
    slug: string;
    name: string;
  };
  software: string | null;
  tags: string[];
  createdAt: string;
  commentCount: number;
  voteCount: number;
  solved: boolean;
};

type ProfilePageProps = {
  profile: ProfilePageProfile;
  showcasePosts: ProfilePost[];
  recentPosts: ProfilePost[];
  contributionBreakdown: {
    discussions: number;
    critiques: number;
    showcases: number;
    help: number;
    resources: number;
  };
  isOwner?: boolean;
};

function formatJoinedDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getInitials(username: string) {
  return username
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "AT";
}

function formatTypeLabel(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function AtelierProfilePage({
  profile,
  showcasePosts,
  recentPosts,
  contributionBreakdown,
  isOwner = false,
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<"showcase" | "contributions" | "identity">("showcase");
  const accent = "oklch(0.70 0.20 45)";
  const initials = useMemo(() => getInitials(profile.username), [profile.username]);
  const disciplineName = profile.discipline?.name ?? profile.primaryDiscipline ?? "Discipline pending";
  const joinedLabel = formatJoinedDate(profile.createdAt);

  return (
    <div className="v0-preview-theme v0-surface v0-surface--profile min-h-screen bg-background text-foreground">
      <div className="noise-overlay" aria-hidden="true" />
      <ProfileNav
        userName={profile.username}
        userInitials={initials}
        disciplineName={disciplineName}
        experienceLevel={profile.experienceLevel ?? "Practitioner"}
        statusLine={`${profile.stats.postCount} posts · ${profile.stats.commentCount} comments · ${profile.stats.acceptedAnswerCount} solved`}
      />

      <main className="pb-20 pt-16">
        <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-6 lg:gap-8">
          <div className="col-span-12 md:col-span-5 lg:col-span-3">
            <div className="panel-primary sticky top-24 p-6">
              <div className="mb-6 flex flex-col items-center">
                <div
                  className="relative mb-3 flex h-20 w-20 items-center justify-center"
                  style={{
                    background: "oklch(0.13 0.004 60)",
                    border: `2px solid ${accent}`,
                    borderRadius: "12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: "32px",
                      letterSpacing: "0.06em",
                      color: accent,
                      lineHeight: 1,
                    }}
                  >
                    {initials}
                  </span>
                </div>

                <div
                  className="mb-3 inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider"
                  style={{
                    background: `${accent}15`,
                    color: accent,
                    border: `1px solid ${accent}40`,
                    borderRadius: "4px",
                  }}
                >
                  {profile.experienceLevel ?? "Practitioner"}
                </div>

                <h1
                  className="text-balance text-center leading-tight"
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "20px",
                    letterSpacing: "0.02em",
                    color: "oklch(0.92 0 0)",
                    marginBottom: "8px",
                  }}
                >
                  {profile.username}
                </h1>

                <p className="text-center font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>
                  {disciplineName}
                </p>
                <p className="mt-1 text-center font-mono text-[9px]" style={{ color: "oklch(0.50 0 0)" }}>
                  Joined {joinedLabel}
                </p>
              </div>

              <div className="mb-6 h-px w-full" style={{ background: "oklch(0.16 0.003 60)" }} />

              <p className="mb-6 text-center font-mono text-[10px] leading-relaxed" style={{ color: "oklch(0.52 0 0)" }}>
                {profile.bio ?? "This designer has not added a bio yet."}
              </p>

              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="panel-secondary p-3">
                  <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: accent }}>
                    Reputation
                  </p>
                  <p className="mt-1 font-bebas text-2xl leading-none" style={{ color: "oklch(0.92 0 0)" }}>
                    {profile.stats.reputation}
                  </p>
                </div>
                <div className="panel-secondary p-3">
                  <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: accent }}>
                    Posts
                  </p>
                  <p className="mt-1 font-bebas text-2xl leading-none" style={{ color: "oklch(0.92 0 0)" }}>
                    {profile.stats.postCount}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {isOwner ? (
                  <Link
                    href="/profile/me/edit"
                    className="block w-full rounded border px-3 py-2.5 text-center font-mono text-[10px] uppercase tracking-wider transition-all"
                    style={{
                      borderColor: `${accent}60`,
                      color: accent,
                      background: `${accent}08`,
                    }}
                  >
                    Edit Profile
                  </Link>
                ) : null}
                <Link
                  href="/dashboard"
                  className="block w-full rounded border px-3 py-2.5 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-all hover:text-foreground"
                  style={{ borderColor: "oklch(0.22 0 0)" }}
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 lg:col-span-6">
            <div className="panel-secondary mb-6 flex gap-1 rounded-lg p-1">
              {([
                ["showcase", "Showcase"],
                ["contributions", "Contributions"],
                ["identity", "Identity"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className="flex-1 rounded px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-all"
                  style={{
                    background: activeTab === value ? accent : "transparent",
                    color: activeTab === value ? "oklch(0.08 0 0)" : "oklch(0.50 0 0)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "showcase" ? (
              <div className="space-y-4">
                {showcasePosts.length === 0 ? (
                  <div className="panel-primary p-8">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">No showcase work yet</p>
                    <p className="mt-2 text-sm text-muted-foreground">This profile does not have any showcase posts published yet.</p>
                  </div>
                ) : (
                  showcasePosts.map((post) => (
                    <Link key={post.id} href={`/thread/${post.slug}`} className="panel-primary block overflow-hidden">
                      <div className="p-5">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h2 className="text-lg font-medium leading-snug text-foreground">{post.title}</h2>
                          <span
                            className="shrink-0 rounded border px-2 py-1 font-mono text-[8px] uppercase tracking-wider"
                            style={{ borderColor: `${accent}60`, color: accent }}
                          >
                            Showcase
                          </span>
                        </div>
                        <p className="mb-4 text-sm text-muted-foreground">{post.bodyPreview || "Open the post to view the full showcase."}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>{post.software ?? disciplineName}</span>
                          <span>{post.commentCount} comments</span>
                          <span>{post.voteCount} votes</span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            ) : null}

            {activeTab === "contributions" ? (
              <div className="rounded-lg border p-8" style={{ background: "oklch(0.095 0.003 60)", borderColor: "oklch(0.20 0.004 60)" }}>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                  {Object.entries(contributionBreakdown).map(([label, value]) => (
                    <div key={label}>
                      <p className="mb-2 font-bebas text-4xl leading-none" style={{ color: accent }}>{value}</p>
                      <p className="font-mono text-[11px] uppercase tracking-wider" style={{ color: "oklch(0.50 0 0)" }}>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Recent activity</p>
                  {recentPosts.slice(0, 5).map((post) => (
                    <Link
                      key={post.id}
                      href={`/thread/${post.slug}`}
                      className="flex items-start justify-between gap-4 border-b border-border/20 py-3 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm text-foreground">{post.title}</p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {formatTypeLabel(post.type)}
                          {post.software ? ` · ${post.software}` : ""}
                        </p>
                      </div>
                      {post.solved ? (
                        <span className="font-mono text-[9px] uppercase tracking-widest text-accent">Solved</span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {activeTab === "identity" ? (
              <div className="rounded-lg border p-8" style={{ background: "oklch(0.095 0.003 60)", borderColor: "oklch(0.20 0.004 60)" }}>
                <div className="space-y-8">
                  <div>
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Creative Identity</p>
                    <p className="text-sm leading-relaxed text-foreground/85">{profile.bio ?? "No profile statement added yet."}</p>
                  </div>

                  <div>
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.length > 0 ? (
                        profile.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider"
                            style={{ borderColor: `${accent}60`, color: accent, background: `${accent}08` }}
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No skills added yet.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Software Proficiency</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.softwares.length > 0 ? (
                        profile.softwares.map((software) => (
                          <span
                            key={software.id}
                            className="rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground"
                            style={{ borderColor: "oklch(0.22 0 0)", background: "oklch(0.12 0.003 60)" }}
                          >
                            {software.name}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No softwares linked yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="col-span-12 md:col-span-12 lg:col-span-3">
            <div className="panel-primary mb-6 p-6">
              <p className="mb-5 font-mono text-[9px] uppercase tracking-wider" style={{ color: accent }}>
                Reputation
              </p>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 font-bebas text-3xl leading-none" style={{ color: accent }}>
                    {profile.stats.reputation}
                  </p>
                  <p className="text-xs" style={{ color: "oklch(0.50 0 0)" }}>
                    Community reputation
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-bebas text-3xl leading-none" style={{ color: accent }}>
                    {profile.stats.acceptedAnswerCount}
                  </p>
                  <p className="text-xs" style={{ color: "oklch(0.50 0 0)" }}>
                    Accepted answers
                  </p>
                </div>
              </div>
            </div>

            <div className="panel-primary mb-6 p-6">
              <p className="mb-5 font-mono text-[9px] uppercase tracking-wider" style={{ color: accent }}>
                Practice Summary
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>{profile.stats.postCount} published posts</p>
                <p>{profile.stats.commentCount} contribution comments</p>
                <p>{showcasePosts.length} showcase entries</p>
                <p>{disciplineName}</p>
              </div>
            </div>

            <div className="panel-primary p-6">
              <p className="mb-5 font-mono text-[9px] uppercase tracking-wider" style={{ color: accent }}>
                Page Contract
              </p>
              <div className="space-y-3 text-[11px] leading-relaxed text-muted-foreground">
                <p>Public profiles stay community-first: no follower counts, no messaging, no social vanity metrics.</p>
                <p>Own-profile editing is handled separately at <code>/profile/me/edit</code>.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

