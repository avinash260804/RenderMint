import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { CommentsPanel } from "@/components/forum/comments-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";
import { env } from "@/lib/env";
import { communityPosts, getPostBySlug } from "@/lib/mock/community-data";
import { getHelpSolutionState } from "@/modules/help/server/help-solution-store";

type ThreadPageProps = {
  params: { slug: string };
};

export const revalidate = 60;

export function generateStaticParams() {
  return communityPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: ThreadPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

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
  const post = getPostBySlug(params.slug);

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
              This is a mock thread body for Sprint 8 comment flow testing. The focus in this sprint
              is comments architecture, interaction, and moderation-ready structure.
            </p>
          </CardContent>
        </Card>

        <section aria-label="Thread comments">
          <CommentsPanel postSlug={post.slug} postType={post.type} />
        </section>
      </article>
    </AppLayoutShell>
  );
}
