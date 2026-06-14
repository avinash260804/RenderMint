import { CritiqueCard } from "@/components/cards/critique-card";
import { DiscussionCard } from "@/components/cards/discussion-card";
import { HelpCard } from "@/components/cards/help-card";
import { ResourceCard } from "@/components/cards/resource-card";
import { ShowcaseCard } from "@/components/cards/showcase-card";
import { EmptyState } from "@/components/forum/empty-state";
import type { CommunityPost } from "@/lib/community/catalog";
import type { ReactNode } from "react";

type PostGridProps = {
  posts: CommunityPost[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export function PostGrid({ posts, emptyTitle, emptyDescription }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? "No posts available"}
        description={
          emptyDescription ??
          "There are no posts in this section yet. Check back soon for fresh threads."
        }
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {posts.map((post) => {
        const wrapper = (children: ReactNode) => (
          <article
            key={post.id}
            data-testid="post-card"
            data-post-type={post.type}
            data-discipline={post.discipline}
            className="h-full"
          >
            <span data-testid="post-type-badge" className="sr-only">
              {post.type}
            </span>
            <span data-testid="discipline-label" className="sr-only">
              {post.discipline}
            </span>
            {children}
          </article>
        );

        if (post.type === "discussion") {
          return wrapper(
            <DiscussionCard
              title={post.title}
              author={post.author}
              tags={post.tags ?? []}
              replyCount={post.replyCount ?? 0}
              engagement={post.engagement ?? "Active"}
              href={`/thread/${post.slug}`}
            />,
          );
        }

        if (post.type === "critique") {
          return wrapper(
            <CritiqueCard
              title={post.title}
              feedbackRequested={post.feedbackRequested ?? "General design direction"}
              iterationCount={post.iterationCount ?? 0}
              href={`/thread/${post.slug}`}
            />,
          );
        }

        if (post.type === "showcase") {
          return wrapper(
            <ShowcaseCard
              title={post.title}
              creator={post.creator ?? post.author}
              tools={post.tools ?? []}
              href={`/thread/${post.slug}`}
            />,
          );
        }

        if (post.type === "help") {
          return wrapper(
            <HelpCard
              title={post.title}
              software={post.software ?? "General"}
              solved={post.solved ?? false}
              answerCount={post.answerCount ?? 0}
              href={`/thread/${post.slug}`}
            />,
          );
        }

        return wrapper(
          <ResourceCard
            title={post.title}
            type={post.resourceType ?? "Reference"}
            software={post.software ?? "General"}
            href={`/thread/${post.slug}`}
          />,
        );
      })}
    </div>
  );
}
