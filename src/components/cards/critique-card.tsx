import { ArrowRight, Layers3 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { postTypeAccents } from "@/components/ui-system/tokens";
import { cn } from "@/lib/utils";

type CritiqueCardProps = {
  title: string;
  feedbackRequested: string;
  iterationCount: number;
  href?: string;
};

export function CritiqueCard({
  title,
  feedbackRequested,
  iterationCount,
  href,
}: CritiqueCardProps) {
  return (
    <Card
      className={cn(
        "border-border/80 bg-card/90 overflow-hidden rounded-xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        postTypeAccents.critique,
      )}
    >
      <div className="h-40 bg-gradient-to-br from-amber-300/30 via-orange-200/20 to-transparent" />
      <CardHeader>
        <Badge className="w-fit bg-amber-500/15 text-amber-700 dark:text-amber-300">Critique</Badge>
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
        <p className="text-muted-foreground text-sm">Feedback needed: {feedbackRequested}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
          <Layers3 className="size-4" /> {iterationCount} iterations
        </span>
        <Button size="sm" variant="outline">
          Give Feedback <ArrowRight className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
