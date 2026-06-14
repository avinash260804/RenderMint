"use client";

import ActivityHeatmap from "@/components/v0/dashboard/activity-heatmap";
import { BriefBoard } from "@/components/v0/dashboard/brief-board";
import { MentorshipLane } from "@/components/v0/dashboard/mentorship-lane";
import { StudioFloor } from "@/components/v0/dashboard/studio-floor";
import { StudioHeader } from "@/components/v0/dashboard/studio-header";
import { StudioStatePanel } from "@/components/v0/dashboard/studio-state-panel";

export function DashboardPreviewPage() {
  return (
    <main
      className="v0-preview-theme relative min-h-screen overflow-x-hidden bg-background text-foreground"
      style={{ zIndex: 1, background: "transparent" }}
    >
      <div className="noise-overlay" aria-hidden="true" />
      <StudioHeader />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-25"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.20 0 0) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.20 0 0) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative z-10 pt-[60px]">
        <div className="flex min-h-[calc(100vh-60px)]">
          <div className="flex-1 min-w-0 flex flex-col">
            <div
              className="w-full px-6 py-8 md:px-10"
              style={{ borderBottom: "0.5px solid oklch(0.18 0 0)" }}
            >
              <StudioStatePanel />
            </div>
            <div
              className="w-full px-6 py-8 md:px-10"
              style={{ borderBottom: "0.5px solid oklch(0.18 0 0)" }}
            >
              <ActivityHeatmap />
            </div>
            <div
              className="w-full px-6 py-10 md:px-10"
              style={{ borderBottom: "0.5px solid oklch(0.18 0 0)" }}
            >
              <div className="mb-8 flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  Studio Floor
                </span>
                <div
                  className="h-2 w-2 flex-shrink-0"
                  style={{
                    background: "oklch(0.65 0.10 200)",
                    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                  }}
                />
                <span className="text-[10px] font-mono text-muted-foreground">
                  Architecture - your discipline
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <StudioFloor />
            </div>
            <div className="w-full px-6 py-10 md:px-10">
              <BriefBoard />
            </div>
          </div>

          <aside
            className="sticky top-[60px] hidden h-[calc(100vh-60px)] w-[300px] flex-shrink-0 overflow-y-auto xl:flex xl:flex-col"
            style={{
              borderLeft: "0.5px solid oklch(0.18 0 0)",
              background: "oklch(0.10 0 0 / 0.75)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="p-6">
              <MentorshipLane />
            </div>
          </aside>
        </div>

        <footer
          className="flex items-center justify-between gap-4 px-6 py-6 md:px-10"
          style={{ borderTop: "0.5px solid oklch(0.14 0 0)" }}
        >
          <span className="font-display text-[16px] font-bold tracking-[0.28em] text-muted-foreground/30">
            ATELIER
          </span>
          <span className="hidden font-mono text-[10px] text-muted-foreground/30 sm:block">
            Every session has a purpose.
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/25">
            v0.1 - Jun 2026
          </span>
        </footer>
      </div>
    </main>
  );
}
