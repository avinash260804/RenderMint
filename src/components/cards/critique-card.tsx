import { ArrowRight, Layers3 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { postTypeAccents } from "@/components/ui-system/tokens";

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
    <div className="atelier-post-card flex flex-col" style={{ ["--post-accent" as string]: postTypeAccents.critique }}>
      <div className="atelier-post-media bg-gradient-to-br from-[oklch(0.7_0.2_45_/_0.26)] via-[oklch(0.52_0.12_38_/_0.12)] to-transparent" />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <Badge className="atelier-type-badge w-fit border-0 bg-transparent px-0 py-0 shadow-none">Critique</Badge>
        <h3 className="text-xl font-semibold leading-tight text-foreground">
          {href ? (
            <Link href={href} className="transition-colors hover:text-[oklch(0.92_0.03_82)]">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <p className="text-sm text-muted-foreground">Feedback needed: {feedbackRequested}</p>
      </div>
      <div className="flex items-center justify-between border-t border-white/8 px-5 py-4">
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
          <Layers3 className="size-4" /> {iterationCount} iterations
        </span>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full border-[oklch(0.7_0.2_45_/_0.26)] bg-transparent font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[oklch(0.82_0.09_58)] hover:bg-[oklch(0.7_0.2_45_/_0.1)] hover:text-foreground"
        >
          Give Feedback <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
