"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, Bell, Compass, Download, Eye, Link as LinkIcon, Lock, Palette, Sun, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { SETTINGS_SECTIONS } from "@/modules/settings/schemas/settings-schema";

const iconMap = {
  profile: User,
  identity: Palette,
  account: Lock,
  notifications: Bell,
  privacy: Eye,
  feed: Compass,
  appearance: Sun,
  credits: Award,
  connections: LinkIcon,
  data: Download,
} as const;

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Settings sections"
      className="atelier-panel atelier-panel-muted hidden md:block md:w-64 md:self-start md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:overflow-auto"
    >
      <div className="atelier-community-grid" aria-hidden="true" />
      <div className="relative z-10 border-b border-white/8 px-5 py-4">
        <h1 className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[oklch(0.72_0.08_55)]">
          Settings
        </h1>
      </div>

      <ul className="relative z-10 space-y-1.5 px-3 py-4 pb-6">
        {SETTINGS_SECTIONS.map((section) => {
          const IconComponent = iconMap[section.id as keyof typeof iconMap] ?? User;
          const isActive = pathname === `/settings/${section.id}` || pathname.startsWith(`/settings/${section.id}/`);

          return (
            <li key={section.id}>
              <Link
                href={`/settings/${section.id}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted-foreground transition-all duration-200 motion-reduce:transition-none",
                  "hover:border-white/8 hover:bg-white/[0.03] hover:text-foreground",
                  isActive && "border-[oklch(0.7_0.2_45_/_0.28)] bg-[oklch(0.7_0.2_45_/_0.1)] text-foreground",
                )}
              >
                <IconComponent className="size-4 shrink-0" />
                <span className="truncate">{section.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
