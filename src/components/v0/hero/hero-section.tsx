"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { BitmapChevron } from "@/components/v0/hero/bitmap-chevron"
import { GridMotion } from "@/components/v0/hero/grid-motion"
import { ScrambleTextOnHover } from "@/components/v0/hero/scramble-text"
import { SplitFlapAudioProvider, SplitFlapMuteToggle, SplitFlapText } from "@/components/v0/hero/split-flap-text"
import type { HeroDiscipline, HeroStats } from "@/components/v0/hero/types"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const CYCLING_WORDS = ["DESIGN", "CRITIQUE", "IDENTITY", "SHOWCASE", "CRAFT"]
const CYCLE_INTERVAL = 5000

function formatCompactNumber(value: number) {
  if (value === 0) {
    return "0"
  }

  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: value >= 10000 ? 0 : 1,
  })
    .format(value)
    .toLowerCase()
}

type HeroSectionProps = {
  disciplines: HeroDiscipline[]
  stats: HeroStats
}

export function HeroSection({ disciplines, stats }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const [wordIndex, setWordIndex] = useState(0)

  const statItems = [
    { value: formatCompactNumber(stats.members), label: "Designers Joining In" },
    { value: formatCompactNumber(stats.disciplines), label: "Focused Disciplines" },
    { value: formatCompactNumber(stats.posts), label: "Threads And Resources" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % CYCLING_WORDS.length)
    }, CYCLE_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -60,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: 1.2,
        },
      })

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.fromTo(eyebrowRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(headlineRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
        .fromTo(bodyRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.2")
        .fromTo(ctaRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2")

      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.querySelectorAll("[data-stat]"),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.6, ease: "power3.out" },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative overflow-hidden"
      style={{ height: "calc(100dvh - 60px)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          left: "35%",
          right: "-8%",
          top: "-12%",
          bottom: "-12%",
          transform: "skewX(-5deg)",
          transformOrigin: "top left",
        }}
      >
        <GridMotion rows={4} columns={3} speed={16} gap={10} glowColor="220, 160, 60" />
      </div>

      <div
        className="absolute inset-y-0 pointer-events-none z-10"
        style={{
          left: "30%",
          width: "28%",
          background: "linear-gradient(to right, oklch(0.08 0 0) 0%, oklch(0.08 0 0) 25%, transparent 100%)",
        }}
      />

      <div
        ref={contentRef}
        className="relative z-20 flex h-full max-w-[52%] flex-col justify-between px-10 md:px-16 lg:px-20"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-0">
          <div ref={eyebrowRef} className="mb-7 flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Structured feedback. Discipline-first knowledge.
            </span>
          </div>

          <div ref={headlineRef} className="mb-8">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground/50">
              The community for
            </p>
            <SplitFlapAudioProvider>
              <div className="relative inline-block">
                <SplitFlapText text={CYCLING_WORDS[wordIndex]} speed={40} />
                <div className="mt-3">
                  <SplitFlapMuteToggle />
                </div>
              </div>
            </SplitFlapAudioProvider>
          </div>

          <div ref={bodyRef} className="mb-8">
            <h2 className="mb-3 font-[var(--font-bebas)] text-[clamp(1.25rem,2.4vw,2rem)] leading-tight text-foreground">
              Architecture-first community for critique, discussion, showcases, and help
            </h2>
            <p className="font-mono text-xs leading-relaxed text-muted-foreground/70" style={{ maxWidth: "38ch" }}>
              Built for architecture, interior design, and urban design. Share work, get sharper feedback, solve software issues, and grow a searchable archive around real design practice.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {disciplines.map((discipline) => (
                <Link
                  key={discipline.slug}
                  href={`/${discipline.slug}`}
                  className="border border-border/40 bg-background/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-200 hover:border-accent/60 hover:text-foreground"
                >
                  {discipline.name}
                </Link>
              ))}
            </div>
          </div>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-5">
            <Link
              href="/login"
              className="group inline-flex items-center gap-3 border border-foreground bg-foreground/5 px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-foreground transition-all duration-200 hover:bg-foreground hover:text-background"
            >
              <ScrambleTextOnHover text="Join the Community" as="span" duration={0.6} />
              <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
            </Link>
            <Link
              href="/explore"
              className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              Explore Disciplines
            </Link>
          </div>
        </div>

        <div ref={statsRef} className="flex flex-shrink-0 items-end gap-10 border-t border-border/20 pb-5 pt-4">
          {statItems.map((stat) => (
            <div key={stat.label} data-stat className="flex flex-col gap-1.5">
              <span className="font-[var(--font-bebas)] text-[clamp(1.6rem,2.8vw,2.4rem)] leading-none tracking-tight text-foreground">
                {stat.value}
              </span>
              <span className="font-mono text-[9px] uppercase leading-tight tracking-[0.22em] text-muted-foreground/55">
                {stat.label}
              </span>
            </div>
          ))}

          <div className="ml-auto self-center flex-shrink-0">
            <div className="inline-flex items-center gap-2 border border-accent/25 bg-accent/5 px-3.5 py-2">
              <span className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-accent" />
              <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-widest text-accent/75">
                Architecture-first launch
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
