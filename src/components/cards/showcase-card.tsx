import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { postTypeAccents } from "@/components/ui-system/tokens";

type ShowcaseCardProps = {
  title: string;
  creator: string;
  tools: string[];
  href?: string;
};

export function ShowcaseCard({ title, creator, tools, href }: ShowcaseCardProps) {
  return (
    <div className="atelier-post-card flex flex-col" style={{ ["--post-accent" as string]: postTypeAccents.showcase }}>
      <div className="atelier-post-media bg-gradient-to-tr from-[oklch(0.65_0.18_150_/_0.24)] via-[oklch(0.46_0.09_165_/_0.12)] to-transparent" />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <Badge className="atelier-type-badge w-fit border-0 bg-transparent px-0 py-0 shadow-none">
          Showcase
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
        <p className="text-sm text-muted-foreground">by {creator}</p>
        <div className="flex flex-wrap gap-1.5">
          {tools.map((tool) => (
            <Badge
              key={tool}
              variant="secondary"
              className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted-foreground"
            >
              {tool}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
