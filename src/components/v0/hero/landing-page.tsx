"use client";

import { AtelierNav } from "@/components/v0/hero/atelier-nav";
import { ColophonSection } from "@/components/v0/hero/colophon-section";
import { CritiquesSection } from "@/components/v0/hero/critiques-section";
import { HeroSection } from "@/components/v0/hero/hero-section";
import { JoinSection } from "@/components/v0/hero/join-section";
import { PrinciplesSection } from "@/components/v0/hero/principles-section";
import type { HeroDiscipline, HeroStats } from "@/components/v0/hero/types";
import { WorkSection } from "@/components/v0/hero/work-section";

type LandingPageProps = {
  disciplines: HeroDiscipline[];
  stats: HeroStats;
};

export function LandingPage({ disciplines, stats }: LandingPageProps) {
  return (
    <main className="v0-preview-theme relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AtelierNav />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />
      <div className="relative z-10 pt-[60px]">
        <HeroSection disciplines={disciplines} stats={stats} />
        <CritiquesSection />
        <WorkSection />
        <PrinciplesSection />
        <JoinSection disciplines={disciplines} memberCount={stats.members} />
        <ColophonSection />
      </div>
    </main>
  );
}
