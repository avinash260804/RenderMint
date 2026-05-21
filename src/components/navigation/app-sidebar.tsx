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
        "border-sidebar-border bg-sidebar text-sidebar-foreground rounded-2xl border p-4 shadow-sm",
        className,
      )}
    >
      <p className="text-muted-foreground px-2 pb-3 text-xs font-medium uppercase tracking-[0.14em]">
        Navigation
      </p>
      <nav className="space-y-1.5">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
              pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="text-muted-foreground size-4 group-hover:text-current" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
