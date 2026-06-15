"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  HelpCircle,
  Home,
  Layers,
  MessageSquare,
  Presentation,
  Shapes,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Discipline Hub", href: "/architecture", icon: Layers },
  { name: "Discussions", href: "/architecture/discussions", icon: MessageSquare },
  { name: "Critique", href: "/architecture/critique", icon: Shapes },
  { name: "Showcase", href: "/architecture/showcase", icon: Presentation },
  { name: "Help", href: "/architecture/help", icon: HelpCircle },
  { name: "Resources", href: "/architecture/resources", icon: Compass },
] as const;

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "atelier-panel atelier-panel-muted sticky top-24 overflow-hidden p-4 text-sidebar-foreground",
        className,
      )}
    >
      <div className="atelier-community-grid" aria-hidden="true" />
      <p className="relative z-10 px-2 pb-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
        Navigation
      </p>
      <nav className="relative z-10 space-y-1.5">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted-foreground transition-all hover:border-white/8 hover:bg-white/[0.03] hover:text-foreground",
              pathname === item.href &&
                "border-[oklch(0.7_0.2_45_/_0.28)] bg-[oklch(0.7_0.2_45_/_0.1)] text-foreground",
            )}
          >
            <item.icon className="size-4 text-muted-foreground transition-colors group-hover:text-current" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
