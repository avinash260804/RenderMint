"use client";

import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, Flame, MessageCircle, Search, TrendingUp, UserRound, Wrench } from "lucide-react";
import { useMemo } from "react";

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

type HeatmapRow = {
  abbr: string;
  label: string;
  values: number[];
};

const MENTORS = [
  {
    name: "Rafael Andrade",
    initials: "RA",
    title: "Principal Architect",
    level: "Mentor",
    availability: "Open",
    availabilityColor: "oklch(0.7 0.16 145)",
    focus: "Structural Narrative",
    bio: "15 years in practice. Believes the best architecture explains itself.",
  },
  {
    name: "Soren Larsen",
    initials: "SL",
    title: "Design Director",
    level: "Mentor",
    availability: "Busy",
    availabilityColor: "oklch(0.7 0.18 45)",
    focus: "Adaptive Reuse",
    bio: "Specialises in transformation of industrial heritage sites.",
  },
  {
    name: "Yasmin Tahir",
    initials: "YT",
    title: "Urban Designer",
    level: "Contributor",
    availability: "Open",
    availabilityColor: "oklch(0.7 0.16 145)",
    focus: "Public Space",
    bio: "Research background. Writes extensively on density ethics.",
  },
] as const;

function formatJoinedDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDisplayDate() {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

function formatTypeLabel(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function getInitials(username: string) {
  return (
    username
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "AT"
  );
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getHeatmapTone(level: number) {
  const colors = [
    "oklch(0.84 0.01 45 / 0.24)",
    "oklch(0.72 0.08 45 / 0.42)",
    "oklch(0.7 0.16 45 / 0.66)",
    "oklch(0.64 0.2 42 / 0.82)",
    "oklch(0.57 0.23 38 / 0.95)",
  ];

  return colors[clamp(level, 0, colors.length - 1)];
}

function createHeatmapRows(
  profile: ProfilePageProfile,
  recentPosts: ProfilePost[],
  contributionBreakdown: ProfilePageProps["contributionBreakdown"],
) {
  const showcasePost = showcasePostsOrRecent(recentPosts);
  const seed = hashString(`${profile.id}:${profile.username}:${profile.createdAt}`);
  const craftBase = contributionBreakdown.showcases + contributionBreakdown.resources + profile.softwares.length;
  const critiqueBase = contributionBreakdown.critiques + profile.stats.acceptedAnswerCount;
  const communityBase = contributionBreakdown.discussions + profile.stats.commentCount;
  const learningBase = Math.max(1, profile.skills.length + contributionBreakdown.help);

  const rows: HeatmapRow[] = [
    { abbr: "CRF", label: "Craft", values: [] },
    { abbr: "CRQ", label: "Critique", values: [] },
    { abbr: "COM", label: "Community", values: [] },
    { abbr: "LRN", label: "Learning", values: [] },
  ];

  const bases = [craftBase, critiqueBase, communityBase, learningBase];

  rows.forEach((row, rowIndex) => {
    row.values = Array.from({ length: 4 }, (_, columnIndex) => {
      const variance = ((seed >> ((rowIndex + columnIndex) % 12)) & 3) - 1;
      const score = Math.round((bases[rowIndex] + columnIndex + variance) % 5);
      return clamp(score, 0, 4);
    });
  });

  const totals = rows.map((row) => row.values.reduce((sum, value) => sum + value, 0));
  const totalPoints = totals.reduce((sum, value) => sum + value, 0);
  const maxPoints = rows.length * 4 * 4;
  const activityPercentage = Math.round((totalPoints / maxPoints) * 100);

  return {
    rows,
    totals,
    totalPoints,
    activityPercentage,
    latestProjectTitle: showcasePost?.title ?? "Design archive in progress",
  };
}

function showcasePostsOrRecent(posts: ProfilePost[]) {
  return posts[0] ?? null;
}

function resolveRole(reputation: number) {
  if (reputation >= 90) return { label: "Mentor", progress: 92 };
  if (reputation >= 45) return { label: "Contributor", progress: 74 };
  if (reputation >= 15) return { label: "Practitioner", progress: 58 };
  return { label: "Student", progress: 24 };
}

function getTopTags(recentPosts: ProfilePost[]) {
  const counts = new Map<string, number>();

  for (const post of recentPosts) {
    for (const tag of post.tags.slice(0, 3)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([tag]) => tag);
}

export function AtelierProfilePage({
  profile,
  showcasePosts,
  recentPosts,
  contributionBreakdown,
  isOwner = false,
}: ProfilePageProps) {
  const accent = "oklch(0.70 0.20 45)";
  const initials = useMemo(() => getInitials(profile.username), [profile.username]);
  const disciplineName = profile.discipline?.name ?? profile.primaryDiscipline ?? "Discipline pending";
  const joinedLabel = formatJoinedDate(profile.createdAt);
  const activity = useMemo(
    () => createHeatmapRows(profile, recentPosts, contributionBreakdown),
    [profile, recentPosts, contributionBreakdown],
  );
  const growthRole = resolveRole(profile.stats.reputation);
  const featuredProject = showcasePosts[0] ?? recentPosts[0] ?? null;
  const critiquePosts = recentPosts.filter((post) => post.type === "critique").slice(0, 2);
  const discussionPost = recentPosts.find((post) => post.type === "discussion") ?? recentPosts[0] ?? null;
  const topTags = getTopTags(recentPosts);
  const softwareHighlights = profile.softwares.slice(0, 4);

  return (
    <div className="v0-preview-theme v0-surface v0-surface--profile min-h-screen bg-background text-foreground">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="dashboard-grid-overlay" aria-hidden="true" />
      <ProfileNav
        userName={profile.username}
        userInitials={initials}
        disciplineName={disciplineName}
        experienceLevel={profile.experienceLevel ?? growthRole.label}
        statusLine={
          featuredProject
            ? `Working on ${featuredProject.title.toLowerCase()}`
            : `${profile.stats.postCount} posts, ${profile.stats.commentCount} comments`
        }
      />

      <main className="relative z-10 pb-20 pt-16">
        <div className="mx-auto grid max-w-[96rem] grid-cols-12 gap-6 px-5 lg:px-6">
          <section className="col-span-12 xl:col-span-9 space-y-6">
            <div className="flex items-center gap-3 pt-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Studio State
              </span>
              <div className="h-px flex-1 bg-border/80" />
              <span className="font-mono text-[10px] text-muted-foreground">{formatDisplayDate()}</span>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <section className="atelier-panel p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Craft Momentum
                  </span>
                  <Flame size={14} className="text-[oklch(0.7_0.2_45)]" />
                </div>

                <div className="mb-5 flex gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                    <span className="font-display text-2xl tracking-[0.08em] text-[oklch(0.78_0.12_75)]">
                      {featuredProject?.title.slice(0, 2).toUpperCase() ?? initials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-muted-foreground">Last worked on</p>
                    <p className="mt-1 text-sm font-semibold leading-snug text-foreground">
                      {featuredProject?.title ?? "Profile archive in progress"}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                      {featuredProject?.software ?? disciplineName}
                    </p>
                  </div>
                </div>

                <div className="mb-5">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Skills practiced this week
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(softwareHighlights.length > 0 ? softwareHighlights.map((software) => software.name) : profile.skills.slice(0, 4)).map((label) => (
                      <span
                        key={label}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/80"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Craft streak
                    </span>
                    <span className="font-mono text-[11px] text-[oklch(0.7_0.2_45)]">
                      {Math.max(2, Math.min(6, profile.stats.postCount + profile.stats.commentCount))} days
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {Array.from({ length: 7 }, (_, index) => {
                      const active = index < Math.max(2, Math.min(6, profile.stats.postCount + 1));
                      return (
                        <div
                          key={index}
                          className="h-1.5 rounded-full"
                          style={{
                            background: active ? (index === 6 ? accent : "oklch(0.52 0.15 42)") : "oklch(0.18 0 0)",
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-1.5">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                      <span key={day} className="text-center font-mono text-[9px] text-muted-foreground">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={featuredProject ? `/thread/${featuredProject.slug}` : "/dashboard"}
                  className="flex items-center justify-between rounded-xl bg-[oklch(0.7_0.2_45)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[oklch(0.08_0_0)] transition-opacity hover:opacity-90"
                >
                  <span>{featuredProject ? "Continue project" : "Open dashboard"}</span>
                  <ArrowRight size={12} />
                </Link>
              </section>

              <section className="atelier-panel p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Community Pulse
                  </span>
                  <MessageCircle size={14} className="text-foreground/40" />
                </div>

                <div className="mb-5">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Pending critique requests
                  </p>
                  <div className="space-y-2">
                    {(critiquePosts.length > 0 ? critiquePosts : recentPosts.slice(0, 2)).map((post) => (
                      <Link
                        key={post.id}
                        href={`/thread/${post.slug}`}
                        className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3 transition-colors hover:bg-white/[0.04]"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.65_0.1_200)] font-mono text-[10px] font-semibold text-background">
                          {post.title.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-medium text-foreground">{post.title}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            {formatTypeLabel(post.type)} · {post.software ?? disciplineName}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mb-5 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={14} className="mt-0.5 text-[oklch(0.7_0.2_45)]" />
                    <div>
                      <p className="text-[12px] font-medium text-foreground">Latest contribution signal</p>
                      <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
                        {profile.stats.commentCount > 0
                          ? `You have ${profile.stats.commentCount} active critique or comment contributions in circulation.`
                          : "No contribution signals yet. Start with one critique reply or discussion comment."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Discussion of the day
                  </p>
                  {discussionPost ? (
                    <Link
                      href={`/thread/${discussionPost.slug}`}
                      className="block rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3 transition-colors hover:bg-white/[0.04]"
                    >
                      <p className="text-[12px] font-medium leading-relaxed text-foreground">
                        {discussionPost.title}
                      </p>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                        {discussionPost.discipline.name} · {discussionPost.commentCount} replies
                      </p>
                    </Link>
                  ) : (
                    <div className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3 font-mono text-[10px] text-muted-foreground">
                      No discussion thread yet.
                    </div>
                  )}
                </div>

                <Link
                  href="/post/new"
                  className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-white/[0.04]"
                >
                  <span>Give critique</span>
                  <ArrowRight size={12} />
                </Link>
              </section>

              <section className="atelier-panel p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Growth Signal
                  </span>
                  <TrendingUp size={14} className="text-foreground/40" />
                </div>

                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Discipline arc
                    </span>
                    <span className="rounded-full border border-[oklch(0.65_0.12_200_/_0.3)] bg-[oklch(0.65_0.12_200_/_0.1)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[oklch(0.7_0.08_220)]">
                      {growthRole.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {["Student", "Practitioner", "Contributor", "Mentor"].map((level, index) => {
                      const activeIndex = ["Student", "Practitioner", "Contributor", "Mentor"].indexOf(growthRole.label);
                      const filled = index <= activeIndex;
                      const active = index === activeIndex;
                      return (
                        <div key={level} className="space-y-1">
                          <div
                            className="h-1 rounded-full"
                            style={{
                              background: active ? accent : filled ? "oklch(0.42 0.04 42)" : "oklch(0.18 0 0)",
                            }}
                          />
                          <span
                            className="block truncate font-mono text-[8px]"
                            style={{ color: active ? accent : "oklch(0.42 0 0)" }}
                          >
                            {level}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-5">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">To next milestone</span>
                    <span className="font-mono text-[10px] text-foreground/80">{growthRole.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-[oklch(0.7_0.2_45)]" style={{ width: `${growthRole.progress}%` }} />
                  </div>
                </div>

                <div className="mb-4 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[oklch(0.7_0.2_45)] text-[10px] text-[oklch(0.08_0_0)]">
                      +
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-foreground">
                        Skill unlocked: {topTags[0] ? formatTypeLabel(topTags[0]) : "Community signal"}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {profile.skills.length > 0
                          ? `${profile.skills.length} tagged skills are now visible across this profile.`
                          : "Add skills on your edit page to strengthen practice visibility."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6 rounded-xl border border-[oklch(0.7_0.2_45_/_0.2)] bg-[oklch(0.7_0.2_45_/_0.06)] px-3 py-3">
                  <p className="text-[12px] leading-relaxed text-foreground/80">
                    {profile.stats.acceptedAnswerCount > 0
                      ? `You have ${profile.stats.acceptedAnswerCount} accepted solution${profile.stats.acceptedAnswerCount === 1 ? "" : "s"} in the archive.`
                      : "You have not received an accepted solution yet — help threads are a strong growth lever."}
                  </p>
                </div>

                <Link
                  href="/post/new"
                  className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-white/[0.04]"
                >
                  <span>Post for critique</span>
                  <ArrowRight size={12} />
                </Link>
              </section>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <section className="atelier-panel p-5 sm:p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Activity Overview</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    4-week contribution heatmap across critique, discussion, and practice signals.
                  </p>
                </div>

                <div className="space-y-3">
                  {activity.rows.map((row, rowIndex) => (
                    <div key={row.abbr} className="flex items-center gap-3">
                      <div className="w-10 shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {row.abbr}
                      </div>
                      <div className="grid flex-1 grid-cols-4 gap-2">
                        {row.values.map((level, columnIndex) => (
                          <div
                            key={`${row.abbr}-${columnIndex}`}
                            className="h-7 rounded-md border border-white/8"
                            style={{ background: getHeatmapTone(level) }}
                            title={`${row.label} · week ${columnIndex + 1}`}
                          />
                        ))}
                      </div>
                      <div className="w-8 shrink-0 text-right font-mono text-[11px] text-muted-foreground">
                        {activity.totals[rowIndex]}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">Activity:</span>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className="h-3 w-3 rounded-[4px] border border-white/8"
                          style={{ background: getHeatmapTone(level) }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground">
                    Total points: <span className="text-foreground">{activity.totalPoints}</span> ({activity.activityPercentage}%)
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="atelier-panel p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Search size={14} className="text-[oklch(0.7_0.2_45)]" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[oklch(0.72_0.08_55)]">
                      Practice archive
                    </span>
                  </div>
                  <div className="space-y-3">
                    {recentPosts.slice(0, 3).map((post) => (
                      <Link
                        key={post.id}
                        href={`/thread/${post.slug}`}
                        className="block rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3 transition-colors hover:bg-white/[0.04]"
                      >
                        <p className="text-[12px] font-medium leading-snug text-foreground">{post.title}</p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                          {formatTypeLabel(post.type)}
                          {post.software ? ` · ${post.software}` : ""}
                        </p>
                      </Link>
                    ))}
                    {recentPosts.length === 0 ? (
                      <div className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3 font-mono text-[10px] text-muted-foreground">
                        No profile activity yet.
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="atelier-panel p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Wrench size={14} className="text-[oklch(0.7_0.2_45)]" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[oklch(0.72_0.08_55)]">
                      Practice stack
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(profile.softwares.length > 0 ? profile.softwares.map((software) => software.name) : profile.skills).slice(0, 6).map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/80"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
                    {profile.bio ?? "This profile is still building out its public practice statement."}
                  </p>
                </div>
              </section>
            </div>
          </section>

          <aside className="col-span-12 xl:col-span-3 space-y-4 pt-5">
            <section className="atelier-panel p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Mentorship Lane
                </span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                  {disciplineName}
                </span>
              </div>

              <p className="mb-4 font-mono text-[10px] leading-relaxed text-muted-foreground/80">
                Reputation-earned. Community-moderated. No marketplace.
              </p>

              <div className="space-y-3">
                {MENTORS.map((mentor) => (
                  <div key={mentor.name} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.65_0.1_200)] font-mono text-[11px] font-semibold text-background">
                        {mentor.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[12px] font-semibold text-foreground">{mentor.name}</p>
                          <span className="flex items-center gap-1 font-mono text-[9px]" style={{ color: mentor.availabilityColor }}>
                            <span className="size-1.5 rounded-full" style={{ background: mentor.availabilityColor }} />
                            {mentor.availability}
                          </span>
                        </div>
                        <p className="font-mono text-[10px] text-muted-foreground">{mentor.title}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                        {mentor.level}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground">Focus: {mentor.focus}</span>
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{mentor.bio}</p>
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[oklch(0.7_0.2_45)] transition-opacity hover:opacity-80"
                    >
                      Request a session <ArrowRight size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="atelier-panel p-5">
              <div className="mb-4 flex items-center gap-2">
                <Award size={14} className="text-[oklch(0.7_0.2_45)]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[oklch(0.72_0.08_55)]">
                  Recognition
                </span>
              </div>

              <div className="rounded-xl border border-[oklch(0.7_0.2_45_/_0.2)] bg-[oklch(0.7_0.2_45_/_0.06)] p-4">
                <p className="text-[12px] font-semibold text-foreground">
                  {profile.stats.acceptedAnswerCount > 0 ? "Critique and help contributor" : "Early archive builder"}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  {profile.stats.acceptedAnswerCount > 0
                    ? `${profile.username} has ${profile.stats.acceptedAnswerCount} accepted solution${profile.stats.acceptedAnswerCount === 1 ? "" : "s"} and a visible critique footprint in the Atelier archive.`
                    : `${profile.username} is building a public discipline record through posts, comments, and critique-ready work.`}
                </p>
              </div>
            </section>

            <section className="atelier-panel p-5">
              <div className="mb-4 flex items-center gap-2">
                <UserRound size={14} className="text-[oklch(0.7_0.2_45)]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[oklch(0.72_0.08_55)]">
                  Profile contract
                </span>
              </div>

              <div className="space-y-3 text-[11px] leading-relaxed text-muted-foreground">
                <p>Public profiles stay community-first: no follower counts, no messaging, and no social vanity metrics.</p>
                <p>Joined {joinedLabel} · {disciplineName}</p>
                <p>{profile.stats.postCount} posts · {profile.stats.commentCount} comments · {profile.stats.acceptedAnswerCount} accepted answers</p>
              </div>

              <div className="mt-5 space-y-3">
                {isOwner ? (
                  <>
                    <Link
                      href="/profile/me/edit"
                      className="flex items-center justify-between rounded-xl border border-[oklch(0.7_0.2_45_/_0.32)] bg-[oklch(0.7_0.2_45_/_0.08)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[oklch(0.82_0.1_58)] transition-colors hover:bg-[oklch(0.7_0.2_45_/_0.14)]"
                    >
                      <span>Edit profile</span>
                      <ArrowRight size={12} />
                    </Link>
                    <Link
                      href="/settings/profile"
                      className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-white/[0.04]"
                    >
                      <span>Open settings</span>
                      <ArrowRight size={12} />
                    </Link>
                  </>
                ) : null}
                <Link
                  href="/dashboard"
                  className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-white/[0.04]"
                >
                  <span>Back to dashboard</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
