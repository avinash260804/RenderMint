import { Link2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { postTypeAccents } from "@/components/ui-system/tokens";
import { cn } from "@/lib/utils";

type ResourceCardProps = {
  title: string;
  type: string;
  software: string;
  href?: string;
};

export function ResourceCard({ title, type, software, href }: ResourceCardProps) {
  return (
    <Card
      className={cn(
        "border-border/80 bg-card/90 rounded-xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        postTypeAccents.resource,
      )}
    >
      <CardHeader>
        <Badge className="w-fit bg-violet-500/15 text-violet-700 dark:text-violet-300">
          Resource
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
      <CardContent className="space-y-2">
        <p className="text-muted-foreground text-sm">Type: {type}</p>
        <p className="text-muted-foreground inline-flex items-center gap-1 text-sm">
          <Link2 className="size-4" /> Relevant for {software}
        </p>
      </CardContent>
    </Card>
  );
}
