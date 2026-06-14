"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"

import type { HeroDiscipline } from "@/components/v0/hero/types"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

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

type JoinSectionProps = {
  disciplines: HeroDiscipline[]
  memberCount: number
}

export function JoinSection({ disciplines, memberCount }: JoinSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const disciplinesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }

      if (actionsRef.current) {
        gsap.fromTo(
          actionsRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.2,
            scrollTrigger: {
              trigger: actionsRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }

      if (disciplinesRef.current) {
        gsap.fromTo(
          disciplinesRef.current.querySelectorAll("[data-discipline]"),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: disciplinesRef.current,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="join"
      className="relative border-t border-border/20 px-6 py-32 md:px-16 lg:pl-[calc(52px+4rem)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.03] to-transparent" />

      <div className="relative max-w-3xl">
        <div ref={headlineRef}>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            04 / Join Atelier
          </span>

          <h2 className="mt-4 font-[var(--font-bebas)] text-5xl leading-none tracking-tight md:text-7xl lg:text-8xl">
            JOIN <span className="text-accent">{formatCompactNumber(memberCount)}</span>
            <br />
            DESIGNERS BUILDING BETTER WORK
          </h2>

          <p className="mt-6 max-w-lg font-mono text-sm leading-relaxed text-muted-foreground">
            Start with your discipline, set up your profile, and enter spaces built for critiques, discussions, showcases, help, and resources.
          </p>
        </div>

        <div ref={actionsRef} className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 border border-accent bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-background transition-all duration-200 hover:bg-accent/90"
          >
            Get Started
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 border border-border/50 px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors duration-200 hover:border-foreground/50 hover:text-foreground"
          >
            Explore Spaces
          </Link>
          <p className="w-full font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
            Google OAuth and magic link onboarding are live.
          </p>
        </div>

        <div ref={disciplinesRef} className="mt-16 border-t border-border/20 pt-8">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Active disciplines
          </p>
          <div className="flex flex-wrap gap-6">
            {disciplines.map((discipline) => (
              <Link
                key={discipline.slug}
                href={`/${discipline.slug}`}
                data-discipline
                className="flex min-w-[120px] flex-col gap-1 transition-opacity duration-200 hover:opacity-100"
              >
                <span className="font-[var(--font-bebas)] text-3xl leading-none tracking-tight text-foreground">
                  {formatCompactNumber(discipline.activeThreads)}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {discipline.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
