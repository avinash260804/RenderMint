import { AppHeader } from "@/components/navigation/app-header";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopNavigation } from "@/components/navigation/top-navigation";
import { cn } from "@/lib/utils";

type AppLayoutShellProps = {
  children: React.ReactNode;
  className?: string;
  navLabel?: string;
  navTitle: string;
  searchPlaceholder?: string;
};

export function AppLayoutShell({
  children,
  className,
  navLabel,
  navTitle,
  searchPlaceholder,
}: AppLayoutShellProps) {
  return (
    <div className="v0-preview-theme v0-surface v0-surface--community min-h-screen bg-background text-foreground">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="dashboard-grid-overlay" aria-hidden="true" />
      <AppHeader />
      <div className="container-shell relative z-10 py-6 sm:py-8">
        <div className="grid-12 items-start">
          <AppSidebar className="md:col-span-3 xl:col-span-2" />
          <main className={cn("md:col-span-9 xl:col-span-10", className)}>
            <TopNavigation
              label={navLabel}
              title={navTitle}
              searchPlaceholder={searchPlaceholder}
            />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
