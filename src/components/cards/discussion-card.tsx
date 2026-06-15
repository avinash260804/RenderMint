import { MessageCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { postTypeAccents } from "@/components/ui-system/tokens";

type DiscussionCardProps = {
  title: string;
  author: string;
  tags: string[];
  replyCount: number;
  engagement: string;
  href?: string;
};

export function DiscussionCard({
  title,
  author,
  tags,
  replyCount,
  engagement,
  href,
}: DiscussionCardProps) {
  return (
    <div className="atelier-post-card flex flex-col" style={{ ["--post-accent" as string]: postTypeAccents.discussion }}>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <Badge className="atelier-type-badge w-fit border-0 bg-transparent px-0 py-0 shadow-none">
          Discussion
        </Badge>
        <h3 className="text-xl font-semibold leading-tight text-foreground">
          {href ? (
            <Link href={href} className="transition-colors hover:text-[oklch(0.92_0.03_82)]">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <p className="font-mono text-[0.76rem] text-muted-foreground">by {author}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.02] px-2.5 py-1 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted-foreground"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/8 px-5 py-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="size-4" /> {replyCount} replies
        </span>
        <span className="inline-flex items-center gap-1.5">
          <TrendingUp className="size-4" /> {engagement}
        </span>
      </div>
    </div>
  );
}
