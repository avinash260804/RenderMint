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
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-[0.12em]">{label}</p>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="relative w-full sm:max-w-sm">
        <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          placeholder={searchPlaceholder}
          className="border-border/80 bg-card rounded-xl pl-9"
        />
      </div>
    </div>
  );
}
