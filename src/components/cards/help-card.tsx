import { CheckCircle2, LifeBuoy } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { postTypeAccents } from "@/components/ui-system/tokens";

type HelpCardProps = {
  title: string;
  software: string;
  solved: boolean;
  answerCount: number;
  href?: string;
};

export function HelpCard({ title, software, solved, answerCount, href }: HelpCardProps) {
  return (
    <div className="atelier-post-card flex flex-col" style={{ ["--post-accent" as string]: postTypeAccents.help }}>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center gap-2">
          <Badge className="atelier-type-badge border-0 bg-transparent px-0 py-0 shadow-none">Help</Badge>
          {solved ? (
            <Badge className="atelier-status-badge border-0 shadow-none">
              <CheckCircle2 className="size-3.5" /> Solved
            </Badge>
          ) : null}
        </div>
        <h3 className="text-xl font-semibold leading-tight text-foreground">
          {href ? (
            <Link href={href} className="transition-colors hover:text-[oklch(0.92_0.03_82)]">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <p className="text-sm text-muted-foreground">Software: {software}</p>
      </div>
      <div className="flex items-center justify-between border-t border-white/8 px-5 py-4">
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
          <LifeBuoy className="size-4" /> {answerCount} answers
        </span>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full border-[oklch(0.65_0.15_230_/_0.28)] bg-transparent font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[oklch(0.76_0.08_235)] hover:bg-[oklch(0.65_0.15_230_/_0.1)] hover:text-foreground"
        >
          Help Solve
        </Button>
      </div>
    </div>
  );
}
