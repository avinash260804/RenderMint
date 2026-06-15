import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { CommentsPanel } from "@/components/forum/comments-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";
import { env } from "@/lib/env";
import { getPostBySlug as getPersistedPostBySlug } from "@/modules/posts/server/post-service";
import { getThreadBySlug, getThreadStaticSlugs } from "@/modules/feed/server/feed-service";
import { getHelpSolutionState } from "@/modules/help/server/help-solution-service";

type ThreadPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getThreadStaticSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ThreadPageProps): Promise<Metadata> {
  const { slug } = await params;
  const thread = await loadThread(slug);
  const post = thread?.summary ?? null;

  if (!post) {
    return {
      title: "Thread Not Found",
      description: "This thread does not exist.",
    };
  }

  const canonical = `${env.NEXT_PUBLIC_APP_URL}/thread/${post.slug}`;
  const baseDescription =
    post.bodyPreview ??
    "Design thread on Designers Hub with discussion, critique, showcase, resources, and help.";

  if (post.type === "help") {
    const helpDescription = post.software
      ? `${post.title} — ${post.software} help thread with practical troubleshooting context and community solution flow.`
      : `${post.title} — help thread with practical troubleshooting context and community solution flow.`;

    return {
      title: `${post.title} (Help Thread)`,
      description: helpDescription,
      keywords: [
        "design software help",
        "architecture troubleshooting",
        "design workflow fix",
        post.software ?? "design software",
        post.discipline,
      ],
      alternates: { canonical },
      openGraph: {
        type: "article",
        url: canonical,
        title: `${post.title} | Help | Designers Hub`,
        description: helpDescription,
      },
      twitter: {
        card: "summary_large_image",
        title: `${post.title} | Help`,
        description: helpDescription,
      },
    };
  }

  return {
    title: post.title,
    description: baseDescription,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: `${post.title} | Designers Hub`,
      description: baseDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Designers Hub`,
      description: baseDescription,
    },
  };
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { slug } = await params;
  const thread = await loadThread(slug);
  const post = thread?.summary ?? null;

  if (!post) {
    notFound();
  }

  const helpState = post.type === "help" ? await getHelpSolutionState(post.slug) : null;
  const helpJsonLd =
    post.type === "help"
      ? {
          "@context": "https://schema.org",
          "@type": "QAPage",
          mainEntity: {
            "@type": "Question",
            name: post.title,
            text:
              post.bodyPreview ??
              "Help thread for software workflow troubleshooting in architecture and design.",
            answerCount: post.answerCount ?? 0,
            dateCreated: post.createdAt,
            author: {
              "@type": "Person",
              name: post.author,
            },
            acceptedAnswer: helpState?.isSolved
              ? {
                  "@type": "Answer",
                  text: "A community comment has been marked as the accepted solution.",
                }
              : undefined,
          },
        }
      : null;

  return (
    <AppLayoutShell
      navLabel="Thread"
      navTitle="Thread details"
      searchPlaceholder="Search related threads..."
    >
      <article className="space-y-6" itemScope itemType="https://schema.org/DiscussionForumPosting">
        {helpJsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(helpJsonLd) }}
          />
        ) : null}
        <Card className="border-border/70 bg-card/80 rounded-2xl">
          <CardContent className="space-y-4 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="capitalize">{post.type}</Badge>
              <Badge variant="outline" className="capitalize">
                {post.discipline}
              </Badge>
              {post.software ? <Badge variant="secondary">{post.software}</Badge> : null}
              {helpState?.isSolved ? (
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="mr-1 size-3.5" /> Solved
                </Badge>
              ) : null}
            </div>
            <h1
              className="text-balance font-serif text-3xl font-semibold tracking-tight"
              itemProp="headline"
            >
              {post.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              Posted by <span itemProp="author">{post.author}</span>
            </p>
            <p className="text-sm leading-6" itemProp="articleBody">
              {thread?.kind === "persisted"
                ? getPrimaryBody(thread.post)
                : post.bodyPreview ??
                  "This thread is part of the active Designers Hub community feed and is rendered through the current thread read path."}
            </p>
            {thread?.kind === "persisted" ? <PersistedThreadSections post={thread.post} /> : null}
          </CardContent>
        </Card>

        <section aria-label="Thread comments">
          <CommentsPanel postSlug={post.slug} postType={post.type} />
        </section>
      </article>
    </AppLayoutShell>
  );
}

function PersistedThreadSections({
  post,
}: {
  post: Awaited<ReturnType<typeof getPersistedPostBySlug>> extends infer T
    ? Exclude<T, null>
    : never;
}) {
  return (
    <div className="space-y-5">
      {post.attachments.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {post.attachments.map((asset) => (
            <div
              key={asset.id}
              className="border-border/70 overflow-hidden rounded-xl border bg-black/5"
            >
              <div className="relative aspect-[4/3]">
                <Image src={asset.url} alt={post.title} fill className="object-cover" unoptimized />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {post.postType === "critique" ? (
        <ThreadFieldGrid
          fields={[
            ["Context", post.context],
            ["Project description", post.projectDescription],
            ["Challenge statement", post.challengeStatement],
            ["Feedback requested", post.feedbackRequested],
          ]}
        />
      ) : null}

      {post.postType === "showcase" ? (
        <ThreadFieldGrid
          fields={[
            ["Project summary", post.projectSummary],
            ["Tools used", post.toolsUsed.join(", ")],
            ["Project link", post.projectLink],
          ]}
        />
      ) : null}

      {post.postType === "help" ? (
        <ThreadFieldGrid
          fields={[
            ["Issue description", post.issueDescription],
            ["Error context", post.errorContext],
          ]}
        />
      ) : null}

      {post.postType === "resource" ? (
        <ThreadFieldGrid
          fields={[
            ["Explanation", post.resourceExplanation],
            ["Links", post.resourceLinks.join(", ")],
          ]}
        />
      ) : null}
    </div>
  );
}

function ThreadFieldGrid({ fields }: { fields: Array<[string, string | null | undefined]> }) {
  const visibleFields = fields.filter(([, value]) => Boolean(value));
  if (visibleFields.length === 0) return null;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {visibleFields.map(([label, value]) => (
        <div key={label} className="border-border/60 rounded-xl border bg-muted/20 p-3">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">{label}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{value}</p>
        </div>
      ))}
    </div>
  );
}

function getPrimaryBody(post: Exclude<Awaited<ReturnType<typeof getPersistedPostBySlug>>, null>) {
  return (
    post.body ??
    post.projectSummary ??
    post.issueDescription ??
    post.resourceExplanation ??
    post.projectDescription ??
    "This thread is part of the active Designers Hub community feed and is rendered through the current thread read path."
  );
}

async function loadThread(slug: string) {
  try {
    const persisted = await getPersistedPostBySlug(slug);
    if (persisted) {
      return {
        kind: "persisted" as const,
        post: persisted,
        summary: {
          slug: persisted.slug,
          title: persisted.title,
          type: persisted.postType,
          discipline: persisted.discipline.slug,
          software: persisted.software?.name,
          author: persisted.author.username,
          bodyPreview: getPrimaryBody(persisted),
          createdAt: persisted.createdAt,
          answerCount: persisted.commentCount,
        },
      };
    }
  } catch {
    // Fall through to the existing catalog-backed thread loader.
  }

  const summary = await getThreadBySlug(slug);
  return summary ? { kind: "community" as const, summary } : null;
}
