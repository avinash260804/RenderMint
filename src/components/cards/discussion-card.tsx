import { MessageCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { postTypeAccents } from "@/components/ui-system/tokens";
import { cn } from "@/lib/utils";

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
    <Card
      className={cn(
        "border-border/80 bg-card/90 rounded-xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        postTypeAccents.discussion,
      )}
    >
      <CardHeader className="gap-3">
        <Badge variant="secondary" className="w-fit">
          Discussion
        </Badge>
        <CardTitle className="text-lg leading-tight">
          {href ? (
            <Link href={href} className="hover:text-primary transition-colors">
              {title}
            </Link>
          ) : (
            title
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">by {author}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-lg">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-muted-foreground flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="size-4" /> {replyCount} replies
        </span>
        <span className="inline-flex items-center gap-1">
          <TrendingUp className="size-4" /> {engagement}
        </span>
      </CardFooter>
    </Card>
  );
}
