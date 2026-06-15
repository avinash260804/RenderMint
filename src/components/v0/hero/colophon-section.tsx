"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MagicBento } from "@/components/v0/hero/magic-bento"

gsap.registerPlugin(ScrollTrigger)

export function ColophonSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const bentoRef    = useRef<HTMLDivElement>(null)
  const footerRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          x: -60, opacity: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        })
      }
      if (bentoRef.current) {
        gsap.from(bentoRef.current, {
          y: 48, opacity: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: bentoRef.current, start: "top 88%", toggleActions: "play none none reverse" },
        })
      }
      if (footerRef.current) {
        const cols = footerRef.current.querySelectorAll(":scope > div")
        gsap.from(cols, {
          y: 24, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: footerRef.current, start: "top 92%", toggleActions: "play none none reverse" },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="colophon"
      className="relative border-t border-border/30 px-6 py-24 md:px-16"
    >
      <div className="dashboard-grid-overlay" aria-hidden="true" />
      {/* Section header */}
      <div ref={headerRef} className="relative z-10 mb-10 max-w-3xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          05 / Community
        </span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
          ATELIER
        </h2>
        <p className="mt-3 font-mono text-xs text-muted-foreground max-w-md leading-relaxed">
          A living dashboard of the Atelier community — members, disciplines, showcases, and the daily critique sessions that define our practice.
        </p>
      </div>

      {/* Magic Bento community preview */}
      <div ref={bentoRef} className="relative z-10 -mx-3">
        <MagicBento
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          glowColor="220, 160, 60"
          particleCount={10}
          spotlightRadius={280}
          clickEffect={true}
        />
      </div>

      {/* Footer link columns */}
      <div
        ref={footerRef}
        className="relative z-10 mt-16 grid grid-cols-2 gap-8 border-t border-border/20 pt-12 md:grid-cols-5 md:gap-12"
      >
        {/* Disciplines */}
        <div>
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Disciplines</h4>
          <ul className="space-y-2">
            {["Architecture", "Interior Design", "Urban Design", "Product Design", "Graphic Design"].map((d) => (
              <li key={d}>
                <a href="#work" className="font-mono text-xs text-foreground/70 hover:text-accent transition-colors duration-200">
                  {d}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div>
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Sections</h4>
          <ul className="space-y-2">
            {[
              { label: "Showcase",    href: "#work" },
              { label: "Critique",    href: "#critiques" },
              { label: "Discussions", href: "#critiques" },
              { label: "Help Forum",  href: "#principles" },
              { label: "Resources",   href: "#principles" },
            ].map((item) => (
              <li key={item.label}>
                <a href={item.href} className="font-mono text-xs text-foreground/70 hover:text-accent transition-colors duration-200">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Community */}
        <div>
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Community</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/70">48k Professionals</li>
            <li className="font-mono text-xs text-foreground/70">120k Projects</li>
            <li className="font-mono text-xs text-foreground/70">6 Discipline Hubs</li>
            <li className="font-mono text-xs text-foreground/70">Beta — 2025</li>
          </ul>
        </div>

        {/* Follow */}
        <div>
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Follow</h4>
          <ul className="space-y-2">
            {[
              { label: "Twitter / X", href: "#" },
              { label: "Instagram",   href: "#" },
              { label: "LinkedIn",    href: "#" },
              { label: "Discord",     href: "#" },
            ].map((item) => (
              <li key={item.label}>
                <a href={item.href} className="font-mono text-xs text-foreground/70 hover:text-accent transition-colors duration-200">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Contact</h4>
          <ul className="space-y-2">
            <li>
              <a href="mailto:hello@atelier.co" className="font-mono text-xs text-foreground/70 hover:text-accent transition-colors duration-200">
                hello@atelier.co
              </a>
            </li>
            <li>
              <a href="#join" className="font-mono text-xs text-foreground/70 hover:text-accent transition-colors duration-200">
                Request Early Access
              </a>
            </li>
            <li>
              <a href="#" className="font-mono text-xs text-foreground/70 hover:text-accent transition-colors duration-200">
                Press Kit
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="relative z-10 mt-12 flex flex-col gap-4 border-t border-border/20 pt-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            &copy; 2025 Atelier. All rights reserved.
          </p>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/50">
          Built for creative professionals. Designed with discipline.
        </p>
      </div>
    </section>
  )
}
