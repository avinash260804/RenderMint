import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type TopNavigationProps = {
  label?: string;
  title: string;
  searchPlaceholder?: string;
};

export function TopNavigation({
  label = "Explore",
  title,
  searchPlaceholder = "Search discussions, critique, help...",
}: TopNavigationProps) {
  return (
    <div className="atelier-toolbar relative mb-6 overflow-hidden px-5 py-4 sm:px-6">
      <div className="atelier-community-grid" aria-hidden="true" />
      <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[oklch(0.72_0.08_55)]">
            {label}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
        </div>
        <form action="/search" className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder={searchPlaceholder}
            className="atelier-search-input w-full rounded-2xl pl-9"
          />
        </form>
      </div>
    </div>
  );
}
