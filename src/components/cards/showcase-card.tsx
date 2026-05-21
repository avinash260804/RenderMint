import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { postTypeAccents } from "@/components/ui-system/tokens";
import { cn } from "@/lib/utils";

type ShowcaseCardProps = {
  title: string;
  creator: string;
  tools: string[];
  href?: string;
};

export function ShowcaseCard({ title, creator, tools, href }: ShowcaseCardProps) {
  return (
    <Card
      className={cn(
        "border-border/80 bg-card/90 overflow-hidden rounded-xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        postTypeAccents.showcase,
      )}
    >
      <div className="h-44 bg-gradient-to-tr from-emerald-400/30 via-teal-200/15 to-transparent" />
      <CardHeader>
        <Badge className="w-fit bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
          Showcase
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
        <p className="text-muted-foreground text-sm">by {creator}</p>
        <div className="flex flex-wrap gap-1.5">
          {tools.map((tool) => (
            <Badge key={tool} variant="secondary" className="rounded-lg">
              {tool}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
