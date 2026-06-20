"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  FilePlus2,
  HelpCircle,
  Home,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Presentation,
  Search,
  Settings,
  Shapes,
} from "lucide-react";

import { cn } from "@/lib/utils";

const reservedSegments = new Set([
  "",
  "explore",
  "search",
  "post",
  "profile",
  "settings",
  "auth",
  "dashboard",
  "login",
  "signup",
  "thread",
  "onboarding",
  "v0-preview",
  "create",
  "me",
]);

function resolveCurrentDiscipline(pathname: string) {
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  return reservedSegments.has(segment) ? null : segment;
}

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const discipline = resolveCurrentDiscipline(pathname);
  const disciplineBase = discipline ? `/${discipline}` : "/explore";

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Search", href: "/search", icon: Search },
    { name: "Create Post", href: "/post/new", icon: FilePlus2 },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Settings", href: "/settings/profile", icon: Settings },
    { name: "Discipline Hub", href: discipline ? disciplineBase : "/explore", icon: Layers },
    { name: "Discussions", href: discipline ? `${disciplineBase}/discussions` : "/explore?postType=discussion", icon: MessageSquare },
    { name: "Critique", href: discipline ? `${disciplineBase}/critique` : "/explore?postType=critique", icon: Shapes },
    { name: "Showcase", href: discipline ? `${disciplineBase}/showcase` : "/explore?postType=showcase", icon: Presentation },
    { name: "Help", href: discipline ? `${disciplineBase}/help` : "/explore?postType=help", icon: HelpCircle },
    { name: "Resources", href: discipline ? `${disciplineBase}/resources` : "/explore?postType=resource", icon: Compass },
  ] as const;

  return (
    <aside
      className={cn(
        "atelier-panel atelier-panel-muted sticky top-24 overflow-hidden p-4 text-sidebar-foreground",
        className,
      )}
    >
      <div className="atelier-community-grid" aria-hidden="true" />
      <div className="relative z-10 px-2 pb-3">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
          Navigation
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {discipline ? `Context: ${discipline}` : "General discovery routes"}
        </p>
      </div>
      <nav className="relative z-10 space-y-1.5" aria-label="Community navigation">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href.split("?")[0]));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted-foreground transition-all hover:border-white/8 hover:bg-white/[0.03] hover:text-foreground",
                active && "border-[oklch(0.7_0.2_45_/_0.28)] bg-[oklch(0.7_0.2_45_/_0.1)] text-foreground",
              )}
            >
              <item.icon className="size-4 text-muted-foreground transition-colors group-hover:text-current" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
