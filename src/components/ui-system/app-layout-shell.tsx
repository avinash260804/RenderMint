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
    <div className="min-h-screen">
      <AppHeader />
      <div className="container-shell py-6 sm:py-8">
        <div className="grid-12">
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
