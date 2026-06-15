import Link from "next/link";

import type { CommunityPost, DisciplineData } from "@/lib/community/catalog";
import { StudioHeader } from "@/components/v0/dashboard/studio-header";

type DashboardProfile = {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  primaryDiscipline: string | null;
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

type DashboardPageProps = {
  profile: DashboardProfile;
  disciplines: DisciplineData[];
  activeDiscipline: DisciplineData | null;
  activeDisciplineSlug: string | null;
  sections: {
    critiques: CommunityPost[];
    discussions: CommunityPost[];
    showcases: CommunityPost[];
    help: CommunityPost[];
    resources: CommunityPost[];
  };
  totalPosts: number;
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

function formatPostTypeLabel(type: CommunityPost["type"]) {
  switch (type) {
    case "critique":
      return "Critique";
    case "discussion":
      return "Discussion";
    case "showcase":
      return "Showcase";
    case "help":
      return "Help";
    case "resource":
      return "Resource";
    default:
      return "Post";
  }
}

function DashboardFeedColumn({
  title,
  subtitle,
  posts,
  href,
  emptyTitle,
}: {
  title: string;
  subtitle: string;
  posts: CommunityPost[];
  href: string;
  emptyTitle: string;
}) {
  return (
    <section className="flex flex-col gap-4 p-6" style={{ background: "var(--card)" }}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {title}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/70">{subtitle}</p>
        </div>
        <Link
          href={href}
          className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="border border-border/40 bg-background/30 px-4 py-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Empty state</p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{emptyTitle}</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/thread/${post.slug}`}
              className="group -mx-2 flex items-start gap-4 px-2 py-4 transition-colors hover:bg-muted/20"
              style={{ borderBottom: index < posts.length - 1 ? "0.5px solid oklch(0.18 0 0)" : "none" }}
            >
              <div className="w-20 flex-shrink-0">
                <span className="inline-flex border border-border/50 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  {formatPostTypeLabel(post.type)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium leading-snug text-foreground group-hover:text-foreground/90">
                  {post.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">
                  {post.bodyPreview ?? "Open the thread to continue the conversation."}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">
                  <span>{post.author}</span>
                  {post.software ? <span>{post.software}</span> : null}
                  {post.solved ? <span className="text-accent">Solved</span> : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export function DashboardPage({
  profile,
  disciplines,
  activeDiscipline,
  activeDisciplineSlug,
  sections,
  totalPosts,
}: DashboardPageProps) {
  const displayDiscipline =
    disciplines.find((discipline) => discipline.slug === activeDisciplineSlug) ?? activeDiscipline;
  const currentDisciplineName = displayDiscipline?.name ?? "Design Practice";
  const joinedLabel = formatJoinedDate(profile.createdAt);
  const profileInitials = getInitials(profile.username);
  const critiqueHref = activeDisciplineSlug ? `/${activeDisciplineSlug}/critique` : "/explore";
  const disciplineHref = activeDisciplineSlug ? `/${activeDisciplineSlug}` : "/explore";

  return (
    <main
      className="v0-preview-theme v0-surface v0-surface--dashboard relative min-h-screen overflow-x-hidden bg-background text-foreground"
      style={{ zIndex: 1, background: "transparent" }}
    >
      <div className="noise-overlay" aria-hidden="true" />
      <StudioHeader
        userName={profile.username}
        userInitials={profileInitials}
        currentDisciplineName={currentDisciplineName}
        currentDisciplineSlug={activeDisciplineSlug}
        disciplines={disciplines.map((discipline) => ({ slug: discipline.slug, name: discipline.name }))}
        statusLine={`${profile.stats.postCount} posts, ${profile.stats.commentCount} comments, ${profile.stats.acceptedAnswerCount} accepted answers`}
        createHref="/post/new"
        critiqueHref={critiqueHref}
      />

      <div className="dashboard-grid-overlay" aria-hidden="true" />

      <div className="relative z-10 pt-[60px]">
        <div className="flex min-h-[calc(100vh-60px)]">
          <div className="flex min-w-0 flex-1 flex-col">
            <section className="w-full px-6 py-8 md:px-10" style={{ borderBottom: "0.5px solid oklch(0.18 0 0)" }}>
              <div className="mb-4 flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Dashboard Overview
                </span>
                <div className="h-px flex-1 bg-border" />
                <span className="font-mono text-[10px] text-muted-foreground">Joined {joinedLabel}</span>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr]">
                <div className="flex flex-col gap-4 border border-accent/15 bg-background/35 p-6">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Practice Focus</p>
                    <h1 className="mt-3 font-[var(--font-bebas)] text-4xl leading-none tracking-tight md:text-5xl">
                      {currentDisciplineName}
                    </h1>
                    <p className="mt-3 max-w-xl text-[12px] leading-relaxed text-muted-foreground">
                      {displayDiscipline?.description ?? "Your dashboard is tuned to the discipline spaces you work in most often."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {profile.softwares.length > 0 ? (
                      profile.softwares.map((software) => (
                        <span
                          key={software.id}
                          className="border border-border/50 bg-background/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                        >
                          {software.name}
                        </span>
                      ))
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                        Add your software stack in onboarding
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={disciplineHref}
                      className="inline-flex items-center gap-2 bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-accent-foreground transition-opacity hover:opacity-90"
                    >
                      Enter Discipline Space
                    </Link>
                    <Link
                      href="/post/new"
                      className="inline-flex items-center gap-2 border border-border/50 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                    >
                      Create Post
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border border-border/30 bg-background/30 p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Contribution Signal</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-[var(--font-bebas)] text-4xl leading-none tracking-tight text-foreground">
                        {profile.stats.reputation}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Reputation</p>
                    </div>
                    <div>
                      <p className="font-[var(--font-bebas)] text-4xl leading-none tracking-tight text-foreground">
                        {profile.stats.postCount}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Posts</p>
                    </div>
                    <div>
                      <p className="font-[var(--font-bebas)] text-4xl leading-none tracking-tight text-foreground">
                        {profile.stats.commentCount}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Comments</p>
                    </div>
                    <div>
                      <p className="font-[var(--font-bebas)] text-4xl leading-none tracking-tight text-accent">
                        {profile.stats.acceptedAnswerCount}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Solved Help</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border border-border/30 bg-background/30 p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Current Feed Scope</p>
                  <div>
                    <p className="font-[var(--font-bebas)] text-4xl leading-none tracking-tight text-foreground">{totalPosts}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Visible threads</p>
                  </div>
                  <div className="space-y-2 text-[11px] text-muted-foreground">
                    <p>{sections.critiques.length} critiques open for review</p>
                    <p>{sections.discussions.length} discussions active</p>
                    <p>{sections.help.length} help threads currently visible</p>
                    <p>{sections.resources.length} resource posts in this discipline</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full px-6 py-10 md:px-10" style={{ borderBottom: "0.5px solid oklch(0.18 0 0)" }}>
              <div className="mb-8 flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Studio Floor</span>
                <div
                  className="h-2 w-2 flex-shrink-0"
                  style={{
                    background: "oklch(0.65 0.10 200)",
                    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                  }}
                />
                <span className="font-mono text-[10px] text-muted-foreground">{currentDisciplineName} - filtered view</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 gap-px bg-border xl:grid-cols-3">
                <DashboardFeedColumn
                  title="Critique Requests"
                  subtitle="Work asking for feedback right now"
                  posts={sections.critiques.slice(0, 4)}
                  href={critiqueHref}
                  emptyTitle="No critique requests yet in this discipline. Be the first to post a work-in-progress."
                />
                <DashboardFeedColumn
                  title="Discussion + Help"
                  subtitle="Conversation and problem-solving in one flow"
                  posts={[...sections.discussions, ...sections.help].slice(0, 5)}
                  href={disciplineHref}
                  emptyTitle="No discussion or help threads are visible yet. Explore the wider community spaces to start one."
                />
                <DashboardFeedColumn
                  title="Showcase + Resources"
                  subtitle="Reference work and knowledge worth revisiting"
                  posts={[...sections.showcases, ...sections.resources].slice(0, 5)}
                  href={disciplineHref}
                  emptyTitle="No showcase or resource posts are visible yet for this discipline."
                />
              </div>
            </section>
          </div>

          <aside
            className="sticky top-[60px] hidden h-[calc(100vh-60px)] w-[320px] flex-shrink-0 overflow-y-auto xl:flex xl:flex-col"
            style={{
              borderLeft: "0.5px solid oklch(0.18 0 0)",
              background: "oklch(0.10 0 0 / 0.75)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="flex flex-col gap-6 p-6">
              <section className="flex flex-col gap-3 border border-border/30 bg-background/25 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Practice Stack</p>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {profile.bio ?? "Your profile bio is still empty. Add your working context in the next profile sprint."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.softwares.map((software) => (
                    <span
                      key={software.id}
                      className="border border-border/40 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                    >
                      {software.name}
                    </span>
                  ))}
                </div>
              </section>

              <section className="flex flex-col gap-3 border border-border/30 bg-background/25 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Notifications</p>
                <div className="border border-dashed border-border/40 px-4 py-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Deferred in MVP</p>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    Advanced notifications are intentionally out of scope. Use the discipline spaces and thread pages as the source of truth for now.
                  </p>
                </div>
              </section>

              <section className="flex flex-col gap-3 border border-border/30 bg-background/25 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Quick Routes</p>
                <div className="flex flex-col gap-2">
                  <Link href="/explore" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
                    Explore all disciplines
                  </Link>
                  <Link href="/search" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
                    Search community knowledge
                  </Link>
                  <Link href="/post/new" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
                    Start a new post
                  </Link>
                </div>
              </section>
            </div>
          </aside>
        </div>

        <footer className="flex items-center justify-between gap-4 px-6 py-6 md:px-10" style={{ borderTop: "0.5px solid oklch(0.14 0 0)" }}>
          <span className="font-display text-[16px] font-bold tracking-[0.28em] text-muted-foreground/30">ATELIER</span>
          <span className="hidden font-mono text-[10px] text-muted-foreground/30 sm:block">Every session has a purpose.</span>
          <span className="font-mono text-[10px] text-muted-foreground/25">Sprint 4 - Dashboard</span>
        </footer>
      </div>
    </main>
  );
}
