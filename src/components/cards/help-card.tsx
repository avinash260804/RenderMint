import { CheckCircle2, LifeBuoy } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { postTypeAccents } from "@/components/ui-system/tokens";
import { cn } from "@/lib/utils";

type HelpCardProps = {
  title: string;
  software: string;
  solved: boolean;
  answerCount: number;
  href?: string;
};

export function HelpCard({ title, software, solved, answerCount, href }: HelpCardProps) {
  return (
    <Card
      className={cn(
        "border-border/80 bg-card/90 rounded-xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        postTypeAccents.help,
      )}
    >
      <CardHeader className="gap-3">
        <div className="flex items-center gap-2">
          <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300">Help</Badge>
          {solved ? (
            <Badge variant="secondary" className="inline-flex items-center gap-1">
              <CheckCircle2 className="size-3.5" /> Solved
            </Badge>
          ) : null}
        </div>
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
      <CardContent>
        <p className="text-muted-foreground text-sm">Software: {software}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
          <LifeBuoy className="size-4" /> {answerCount} answers
        </span>
        <Button size="sm" variant="outline">
          Help Solve
        </Button>
      </CardFooter>
    </Card>
  );
}
