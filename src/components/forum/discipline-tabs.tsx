"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import type { DisciplineSlug } from "@/lib/mock/community-data";
import { cn } from "@/lib/utils";

type DisciplineTabsProps = {
  discipline: DisciplineSlug;
};

const tabs = [
  { label: "Overview", segment: "" },
  { label: "Discussions", segment: "discussions" },
  { label: "Critique", segment: "critique" },
  { label: "Showcase", segment: "showcase" },
  { label: "Help", segment: "help" },
  { label: "Resources", segment: "resources" },
] as const;

export function DisciplineTabs({ discipline }: DisciplineTabsProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const href = tab.segment ? `/${discipline}/${tab.segment}` : `/${discipline}`;
        const isActive = pathname === href;
        return (
          <Link key={tab.label} href={href}>
            <Badge
              variant="outline"
              className={cn(
                "hover:bg-accent rounded-xl px-3 py-1.5 text-xs uppercase tracking-[0.08em] transition",
                isActive && "border-primary/50 bg-primary/10 text-primary",
              )}
            >
              {tab.label}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
