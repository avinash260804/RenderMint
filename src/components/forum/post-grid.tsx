import { CritiqueCard } from "@/components/cards/critique-card";
import { DiscussionCard } from "@/components/cards/discussion-card";
import { HelpCard } from "@/components/cards/help-card";
import { ResourceCard } from "@/components/cards/resource-card";
import { ShowcaseCard } from "@/components/cards/showcase-card";
import { EmptyState } from "@/components/forum/empty-state";
import type { CommunityPost } from "@/lib/mock/community-data";

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
        if (post.type === "discussion") {
          return (
            <DiscussionCard
              key={post.id}
              title={post.title}
              author={post.author}
              tags={post.tags ?? []}
              replyCount={post.replyCount ?? 0}
              engagement={post.engagement ?? "Active"}
              href={`/thread/${post.slug}`}
            />
          );
        }

        if (post.type === "critique") {
          return (
            <CritiqueCard
              key={post.id}
              title={post.title}
              feedbackRequested={post.feedbackRequested ?? "General design direction"}
              iterationCount={post.iterationCount ?? 0}
              href={`/thread/${post.slug}`}
            />
          );
        }

        if (post.type === "showcase") {
          return (
            <ShowcaseCard
              key={post.id}
              title={post.title}
              creator={post.creator ?? post.author}
              tools={post.tools ?? []}
              href={`/thread/${post.slug}`}
            />
          );
        }

        if (post.type === "help") {
          return (
            <HelpCard
              key={post.id}
              title={post.title}
              software={post.software ?? "General"}
              solved={post.solved ?? false}
              answerCount={post.answerCount ?? 0}
              href={`/thread/${post.slug}`}
            />
          );
        }

        return (
          <ResourceCard
            key={post.id}
            title={post.title}
            type={post.resourceType ?? "Reference"}
            software={post.software ?? "General"}
            href={`/thread/${post.slug}`}
          />
        );
      })}
    </div>
  );
}
