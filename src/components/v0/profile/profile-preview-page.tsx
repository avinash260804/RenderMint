"use client";

import { useState } from "react";
import {
  Bookmark,
  MessageCircle,
  MessageSquare,
  Share2,
  Users,
} from "lucide-react";
import { PROFILE } from "@/components/v0/profile/profile-data";
import { ProfileNav } from "@/components/v0/profile/profile-nav";

const isOwner = true;

const stageColor: Record<string, string> = {
  "Case Study": "oklch(0.70 0.20 45)",
  "Process Documented": "oklch(0.58 0.16 160)",
  WIP: "oklch(0.65 0.16 80)",
  "Concept Only": "oklch(0.38 0 0)",
};

const statusOptions = [
  "Open to Collaboration",
  "Seeking Feedback",
  "Available for Hire",
  "Mentoring",
  "In Deep Work",
];

const statusColor: Record<string, string> = {
  "Open to Collaboration": "oklch(0.70 0.20 45)",
  "Seeking Feedback": "oklch(0.60 0.15 230)",
  "Available for Hire": "oklch(0.65 0.18 160)",
  Mentoring: "oklch(0.65 0.12 80)",
  "In Deep Work": "oklch(0.48 0 0)",
};

const arc = ["Student", "Practitioner", "Contributor", "Mentor"];
const arcKeys = ["student", "practitioner", "contributor", "mentor"];

export function ProfilePreviewPage() {
  const [status, setStatus] = useState<string>(PROFILE.status);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "work" | "contributions" | "exploring"
  >("work");
  const [filter] = useState<"featured" | "all">("featured");

  const accent = "oklch(0.70 0.20 45)";
  const currentArcIdx = arcKeys.indexOf(PROFILE.milestone);
  const projects =
    filter === "featured"
      ? PROFILE.projects.filter((project) => project.featured)
      : PROFILE.projects;

  return (
    <div className="v0-preview-theme v0-surface v0-surface--profile min-h-screen bg-background text-foreground">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="dashboard-grid-overlay" aria-hidden="true" />
      <ProfileNav />
      <main className="relative z-10 pb-20 pt-12">
        <div className="mx-auto grid max-w-[92rem] grid-cols-12 gap-6 px-6 lg:gap-8">
          <div className="col-span-12 md:col-span-5 lg:col-span-3">
            <div className="panel-primary sticky top-20 p-6">
              <div className="mb-6 flex flex-col items-center">
                <div
                  className="relative mb-3 flex h-20 w-20 items-center justify-center"
                  style={{
                    background: "oklch(0.13 0.004 60)",
                    border: `2px solid ${accent}`,
                    borderRadius: "12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: "32px",
                      letterSpacing: "0.06em",
                      color: accent,
                      lineHeight: 1,
                    }}
                  >
                    AV
                  </span>
                </div>

                <div
                  className="mb-3 inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider"
                  style={{
                    background: `${accent}15`,
                    color: accent,
                    border: `1px solid ${accent}40`,
                    borderRadius: "4px",
                  }}
                >
                  <span>Trophy</span>
                  {PROFILE.milestone.toUpperCase()}
                </div>

                <h1
                  className="text-balance text-center leading-tight"
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "20px",
                    letterSpacing: "0.02em",
                    color: "oklch(0.92 0 0)",
                    marginBottom: "8px",
                  }}
                >
                  {PROFILE.name}
                </h1>

                <p
                  className="text-center font-mono text-[11px] uppercase tracking-widest"
                  style={{ color: accent }}
                >
                  {PROFILE.discipline}
                </p>
                <p
                  className="mt-1 text-center font-mono text-[9px]"
                  style={{ color: "oklch(0.50 0 0)" }}
                >
                  {PROFILE.level}
                </p>
              </div>

              <div
                className="mb-6 h-px w-full"
                style={{ background: "oklch(0.16 0.003 60)" }}
              />

              <p
                className="mb-6 text-center font-mono text-[10px] leading-relaxed"
                style={{ color: "oklch(0.52 0 0)" }}
              >
                {PROFILE.creativeStatement.substring(0, 100)}...
              </p>

              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="panel-secondary p-3">
                  <p
                    className="font-mono text-[9px] uppercase tracking-wider"
                    style={{ color: accent }}
                  >
                    Critiques
                  </p>
                  <p
                    className="mt-1 font-bebas text-2xl leading-none"
                    style={{ color: "oklch(0.92 0 0)" }}
                  >
                    {PROFILE.contributions.critiquesGiven}
                  </p>
                </div>
                <div className="panel-secondary p-3">
                  <p
                    className="font-mono text-[9px] uppercase tracking-wider"
                    style={{ color: accent }}
                  >
                    Accomplishments
                  </p>
                  <p
                    className="mt-1 font-bebas text-2xl leading-none"
                    style={{ color: "oklch(0.92 0 0)" }}
                  >
                    {PROFILE.contributions.briefsCompleted}
                  </p>
                </div>
              </div>

              <div className="relative mb-6">
                {isOwner ? (
                  <button
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="w-full rounded border px-3 py-2.5 font-mono text-[9px] uppercase tracking-wider transition-all"
                    style={{
                      borderColor: `${statusColor[status] ?? accent}60`,
                      color: statusColor[status] ?? accent,
                      background: `${statusColor[status] ?? accent}08`,
                    }}
                  >
                    {status}
                  </button>
                ) : null}

                {showStatusMenu ? (
                  <div
                    className="absolute left-0 right-0 top-full z-40 mt-2 rounded border"
                    style={{
                      background: "oklch(0.10 0.003 60)",
                      borderColor: "oklch(0.20 0.004 60)",
                    }}
                  >
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        className="w-full border-b px-3 py-2 text-left font-mono text-[9px] uppercase tracking-wider transition-colors last:border-b-0 hover:bg-secondary/50"
                        style={{ color: statusColor[option] ?? accent }}
                        onClick={() => {
                          setStatus(option);
                          setShowStatusMenu(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Users, label: "Follow" },
                  { icon: MessageCircle, label: "Chat" },
                  { icon: Share2, label: "Share" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="flex items-center justify-center gap-1 rounded border px-3 py-2.5 font-mono text-[8px] uppercase tracking-wider transition-all hover:bg-secondary/30"
                    style={{
                      borderColor: "oklch(0.22 0 0)",
                      color: "oklch(0.60 0 0)",
                    }}
                  >
                    <Icon size={12} />
                  </button>
                ))}
              </div>

              {isOwner ? (
                <div>
                  <div
                    className="my-6 h-px w-full"
                    style={{ background: "oklch(0.16 0.003 60)" }}
                  />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-mono text-[9px] uppercase tracking-wider"
                        style={{ color: "oklch(0.50 0 0)" }}
                      >
                        Joined
                      </span>
                      <span
                        className="font-mono text-[9px]"
                        style={{ color: "oklch(0.60 0 0)" }}
                      >
                        Jun 24, 2022
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-mono text-[9px] uppercase tracking-wider"
                        style={{ color: "oklch(0.50 0 0)" }}
                      >
                        Location
                      </span>
                      <span
                        className="font-mono text-[9px]"
                        style={{ color: "oklch(0.60 0 0)" }}
                      >
                        {PROFILE.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-mono text-[9px] uppercase tracking-wider"
                        style={{ color: "oklch(0.50 0 0)" }}
                      >
                        Experience
                      </span>
                      <span
                        className="font-mono text-[9px]"
                        style={{ color: "oklch(0.60 0 0)" }}
                      >
                        {PROFILE.yearsInPractice} years
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 lg:col-span-6">
            <div className="panel-secondary mb-6 flex gap-1 rounded-lg p-1">
              {(["work", "contributions", "exploring"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 rounded px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-all"
                  style={{
                    background: activeTab === tab ? accent : "transparent",
                    color:
                      activeTab === tab ? "oklch(0.08 0 0)" : "oklch(0.50 0 0)",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "work" ? (
              <div>
                {projects.length > 0 ? (
                  <>
                    <div className="panel-primary group mb-6 cursor-pointer overflow-hidden">
                      <div
                        className="relative flex h-48 items-center justify-center overflow-hidden"
                        style={{ background: "oklch(0.08 0 0)" }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-bebas)",
                            fontSize: "72px",
                            color: "oklch(0.16 0 0)",
                            letterSpacing: "0.04em",
                            lineHeight: 1,
                          }}
                        >
                          {projects[0].initials}
                        </span>
                        {projects[0].openForCritique ? (
                          <span
                            className="absolute left-3 top-3 px-2 py-1 font-mono text-[8px] uppercase tracking-wider"
                            style={{
                              background: accent,
                              color: "oklch(0.08 0 0)",
                              borderRadius: "4px",
                            }}
                          >
                            Open
                          </span>
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/20 transition-all group-hover:to-black/40" />
                      </div>

                      <div className="p-5">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h2 className="text-lg font-medium leading-snug text-foreground">
                            {projects[0].title}
                          </h2>
                          <span
                            className="shrink-0 rounded border px-2 py-1 font-mono text-[8px] uppercase tracking-wider"
                            style={{
                              borderColor: `${stageColor[projects[0].stage] ?? "oklch(0.30 0 0)"}60`,
                              color:
                                stageColor[projects[0].stage] ?? "oklch(0.40 0 0)",
                            }}
                          >
                            {projects[0].stage === "Process Documented"
                              ? "Process"
                              : projects[0].stage}
                          </span>
                        </div>
                        <p className="mb-4 text-sm text-muted-foreground">
                          {projects[0].subtitle}
                        </p>
                        <div className="flex items-center gap-4 text-xs">
                          <span
                            className="flex items-center gap-1"
                            style={{ color: "oklch(0.50 0 0)" }}
                          >
                            <MessageSquare size={14} />
                            {projects[0].critiquesReceived}
                          </span>
                          <span
                            className="flex items-center gap-1"
                            style={{ color: "oklch(0.50 0 0)" }}
                          >
                            <Bookmark size={14} />
                            {projects[0].saved}
                          </span>
                          <span
                            className="ml-auto font-mono text-[9px]"
                            style={{ color: "oklch(0.40 0 0)" }}
                          >
                            {projects[0].year}
                          </span>
                        </div>
                      </div>
                    </div>

                    {projects.length > 1 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {projects.slice(1).map((project) => (
                          <div
                            key={project.id}
                            className="panel-secondary group cursor-pointer overflow-hidden"
                          >
                            <div
                              className="relative flex h-32 items-center justify-center"
                              style={{ background: "oklch(0.08 0 0)" }}
                            >
                              <span
                                style={{
                                  fontFamily: "var(--font-bebas)",
                                  fontSize: "48px",
                                  color: "oklch(0.16 0 0)",
                                  letterSpacing: "0.04em",
                                  lineHeight: 1,
                                }}
                              >
                                {project.initials}
                              </span>
                              {project.openForCritique ? (
                                <span
                                  className="absolute left-2 top-2 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-wider"
                                  style={{
                                    background: accent,
                                    color: "oklch(0.08 0 0)",
                                    borderRadius: "3px",
                                  }}
                                >
                                  Open
                                </span>
                              ) : null}
                              <div className="absolute inset-0 bg-background/0 transition-all group-hover:bg-background/20" />
                            </div>

                            <div className="p-4">
                              <h3 className="mb-1 line-clamp-2 text-sm font-medium text-foreground">
                                {project.title}
                              </h3>
                              <p className="mb-3 line-clamp-1 text-xs text-muted-foreground">
                                {project.subtitle}
                              </p>
                              <div className="flex items-center justify-between text-[10px]">
                                <div
                                  className="flex gap-2"
                                  style={{ color: "oklch(0.50 0 0)" }}
                                >
                                  <span className="flex items-center gap-1">
                                    <MessageSquare size={12} />
                                    {project.critiquesReceived}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Bookmark size={12} />
                                    {project.saved}
                                  </span>
                                </div>
                                <span style={{ color: "oklch(0.40 0 0)" }}>
                                  {project.year}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </>
                ) : null}
              </div>
            ) : null}

            {activeTab === "contributions" ? (
              <div
                className="rounded-lg border p-8"
                style={{
                  background: "oklch(0.095 0.003 60)",
                  borderColor: "oklch(0.20 0.004 60)",
                }}
              >
                <div className="space-y-8">
                  {[
                    {
                      n: PROFILE.contributions.critiquesGiven,
                      label: "Critiques Given",
                      note: PROFILE.contributions.critiquesRecognition,
                    },
                    {
                      n: PROFILE.contributions.discussionsContributed,
                      label: "Discussions",
                      note: PROFILE.contributions.discussionsAnchor,
                    },
                    {
                      n: PROFILE.contributions.briefsCompleted,
                      label: "Briefs Completed",
                      note: PROFILE.contributions.briefsFeedback,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="border-b pb-6 last:border-b-0 last:pb-0"
                    >
                      <p
                        className="mb-2 font-bebas text-4xl leading-none"
                        style={{ color: accent }}
                      >
                        {stat.n}
                      </p>
                      <p
                        className="mb-2 font-mono text-[11px] uppercase tracking-wider"
                        style={{ color: "oklch(0.50 0 0)" }}
                      >
                        {stat.label}
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "oklch(0.60 0 0)" }}
                      >
                        {stat.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeTab === "exploring" ? (
              <div
                className="rounded-lg border p-8"
                style={{
                  background: "oklch(0.095 0.003 60)",
                  borderColor: "oklch(0.20 0.004 60)",
                }}
              >
                <div className="space-y-6">
                  {PROFILE.exploring.map(({ type, topic }) => (
                    <div key={type}>
                      <span
                        className="mb-2 block font-mono text-[9px] uppercase tracking-wider"
                        style={{ color: accent }}
                      >
                        {type}
                      </span>
                      <p className="text-sm text-foreground">{topic}</p>
                    </div>
                  ))}
                  <div
                    className="my-6 h-px"
                    style={{ background: "oklch(0.16 0.003 60)" }}
                  />
                  <blockquote
                    className="text-sm italic leading-relaxed"
                    style={{ color: "oklch(0.60 0 0)" }}
                  >
                    &ldquo;{PROFILE.exploringThought}&rdquo;
                  </blockquote>
                </div>
              </div>
            ) : null}
          </div>

          <div className="col-span-12 md:col-span-12 lg:col-span-3">
            <div className="panel-primary mb-6 p-6">
              <p
                className="mb-5 font-mono text-[9px] uppercase tracking-wider"
                style={{ color: accent }}
              >
                Achievements
              </p>
              <div className="space-y-4">
                <div>
                  <p
                    className="mb-1 font-bebas text-3xl leading-none"
                    style={{ color: accent }}
                  >
                    12
                  </p>
                  <p className="text-xs" style={{ color: "oklch(0.50 0 0)" }}>
                    Trophies
                  </p>
                </div>
                <div>
                  <p
                    className="mb-1 font-bebas text-3xl leading-none"
                    style={{ color: accent }}
                  >
                    {PROFILE.contributions.critiquesRecognition.split(" ")[0]}
                  </p>
                  <p className="text-xs" style={{ color: "oklch(0.50 0 0)" }}>
                    Constructive Recognitions
                  </p>
                </div>
              </div>
            </div>

            <div className="panel-primary mb-6 p-6">
              <p
                className="mb-5 font-mono text-[9px] uppercase tracking-wider"
                style={{ color: accent }}
              >
                Growth Path
              </p>
              <div className="space-y-2">
                {arc.map((milestone, idx) => (
                  <div
                    key={milestone}
                    className="rounded px-3 py-2 text-xs font-medium transition-all"
                    style={{
                      background:
                        idx <= currentArcIdx
                          ? `${accent}20`
                          : "oklch(0.10 0.003 60)",
                      color: idx <= currentArcIdx ? accent : "oklch(0.40 0 0)",
                      borderLeft:
                        idx === currentArcIdx
                          ? `2px solid ${accent}`
                          : "2px solid transparent",
                    }}
                  >
                    {milestone}
                  </div>
                ))}
              </div>
              <p
                className="mt-4 text-[10px] leading-relaxed"
                style={{ color: "oklch(0.45 0 0)" }}
              >
                {PROFILE.trainer.nextMilestone.remaining} until{" "}
                {PROFILE.trainer.nextMilestone.target}
              </p>
            </div>

            <div className="panel-primary p-6">
              <p
                className="mb-5 font-mono text-[9px] uppercase tracking-wider"
                style={{ color: accent }}
              >
                Reputation Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {PROFILE.contributions.criticReputation.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider"
                    style={{
                      borderColor: `${accent}60`,
                      color: accent,
                      background: `${accent}08`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p
                className="mt-4 text-[10px] leading-relaxed"
                style={{ color: "oklch(0.45 0 0)" }}
              >
                Known for thoughtful feedback and technical rigor in architecture
                critiques.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
