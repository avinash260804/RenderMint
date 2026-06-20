"use client";

import Link from "next/link";

import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { ToastContainer } from "@/components/settings/ToastContainer";
import { ToastProvider } from "@/lib/toast";

export function SettingsShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="container-shell relative z-10 py-6 sm:py-8">
        <div className="grid gap-6 md:grid-cols-[16rem_minmax(0,1fr)]">
          <SettingsSidebar />
          <main className="min-w-0">
            <section className="atelier-toolbar relative mb-6 overflow-hidden px-5 py-4 sm:px-6">
              <div className="atelier-community-grid" aria-hidden="true" />
              <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[oklch(0.72_0.08_55)]">
                    Settings
                  </p>
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    Account, identity, and visibility controls
                  </h1>
                </div>
                <div className="flex flex-wrap gap-3 text-[0.72rem] font-mono uppercase tracking-[0.14em]">
                  <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/dashboard">
                    Dashboard
                  </Link>
                  <Link
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    href="/profile/me/edit"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </section>
            <div className="atelier-panel relative overflow-hidden px-5 py-6 sm:px-6">{children}</div>
          </main>
        </div>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
