import { Link2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { postTypeAccents } from "@/components/ui-system/tokens";

type ResourceCardProps = {
  title: string;
  type: string;
  software: string;
  href?: string;
};

export function ResourceCard({ title, type, software, href }: ResourceCardProps) {
  return (
    <div className="atelier-post-card flex flex-col" style={{ ["--post-accent" as string]: postTypeAccents.resource }}>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <Badge className="atelier-type-badge w-fit border-0 bg-transparent px-0 py-0 shadow-none">
          Resource
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
        <p className="text-muted-foreground text-sm">Type: {type}</p>
        <p className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] text-muted-foreground">
          <Link2 className="size-4" /> Relevant for {software}
        </p>
      </div>
    </div>
  );
}
