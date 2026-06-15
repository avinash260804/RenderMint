"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import gsap from "gsap"

const SECTIONS = [
  { id: "hero", label: "Home", index: "00" },
  { id: "signals", label: "Signals", index: "01" },
  { id: "critiques", label: "Critiques", index: "02" },
  { id: "work", label: "Showcases", index: "03" },
  { id: "principles", label: "Platform", index: "04" },
  { id: "join", label: "Join", index: "05" },
  { id: "colophon", label: "Community", index: "06" },
]

const META_LINKS = [
  { label: "About Atelier", href: "#colophon" },
  { label: "Guidelines", href: "#principles" },
  { label: "FAQ", href: "#colophon" },
  { label: "Contact", href: "#colophon" },
]

export function AtelierNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const linksRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { threshold: [0.2, 0.5] },
    )

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const links = linksRef.current?.querySelectorAll("[data-link]")
    const metas = metaRef.current?.querySelectorAll("[data-meta]")

    if (links) {
      gsap.fromTo(
        links,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.07, delay: 0.35 },
      )
    }

    if (metas) {
      gsap.fromTo(
        metas,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: "power3.out", stagger: 0.05, delay: 0.4 },
      )
    }
  }, [isOpen])

  const openMenu = () => {
    setIsVisible(true)
    document.body.style.overflow = "hidden"

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsOpen(true))
    })
  }

  const closeMenu = () => {
    setIsOpen(false)
    document.body.style.overflow = ""
    setTimeout(() => setIsVisible(false), 600)
  }

  const scrollTo = (id: string) => {
    closeMenu()
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }, 350)
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeMenu()
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen])

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 flex h-[60px] items-center justify-between bg-background/80 px-6 backdrop-blur-md md:px-10"
        style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}
      >
        <button
          onClick={() => scrollTo("hero")}
          className="font-[var(--font-bebas)] text-[22px] tracking-[0.25em] text-foreground transition-colors duration-200 hover:text-accent"
          aria-label="Go to top"
        >
          ATELIER
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={isOpen ? closeMenu : openMenu}
            className={cn(
              "border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] transition-all duration-200",
              isOpen
                ? "border-foreground/60 bg-foreground/10 text-foreground hover:bg-foreground/20"
                : "border-border/40 text-muted-foreground hover:border-foreground/60 hover:text-foreground",
            )}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? "CLOSE" : "MENU"}
          </button>

          <Link
            href="/login"
            onClick={() => isOpen && closeMenu()}
            className="px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-all duration-200"
            style={{
              backgroundColor: "oklch(0.7 0.2 45)",
              color: "oklch(0.08 0 0)",
            }}
          >
            Join Now
          </Link>
        </div>
      </header>

      {isVisible && (
        <div
          className="fixed inset-0 z-40 flex flex-col"
          style={{
            backgroundColor: "oklch(0.06 0 0)",
            transform: isOpen ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation menu"
          aria-hidden={!isOpen}
        >
          <div className="h-[60px] flex-shrink-0 border-b border-border/10" />

          <div className="flex flex-1 overflow-hidden">
            <div
              ref={metaRef}
              className="flex w-[200px] flex-shrink-0 flex-col justify-between border-r border-border/10 p-8 md:w-[260px] md:p-10"
            >
              <div className="flex flex-col gap-8">
                <div>
                  <p className="mb-5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/40" data-meta>
                    INFO
                  </p>
                  <ul className="flex flex-col gap-3" role="list">
                    {META_LINKS.map(({ label, href }) => (
                      <li key={label} data-meta>
                        <a
                          href={href}
                          onClick={() => isOpen && closeMenu()}
                          className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors duration-200 hover:text-foreground"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/25 leading-relaxed" data-meta>
                The community for
                <br />
                architecture-first design practice
              </p>
            </div>

            <div
              ref={linksRef}
              className="flex flex-1 flex-col justify-center gap-0 overflow-hidden px-10 md:px-16 lg:px-24"
            >
              {SECTIONS.map(({ id, label, index }) => (
                <button
                  key={id}
                  data-link
                  onClick={() => scrollTo(id)}
                  className={cn(
                    "group flex items-baseline gap-4 border-b border-border/10 py-2 text-left transition-all duration-200 hover:pl-3 last:border-b-0 md:py-3",
                  )}
                >
                  <span className="w-6 flex-shrink-0 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/30 transition-colors duration-200 group-hover:text-accent">
                    {index}
                  </span>
                  <span
                    className={cn(
                      "font-[var(--font-bebas)] text-[clamp(2rem,5.5vw,5rem)] leading-none tracking-tight transition-colors duration-200",
                      activeSection === id ? "text-accent" : "text-foreground/70 group-hover:text-foreground",
                    )}
                  >
                    {label}
                  </span>
                  <span className="ml-auto self-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/0 transition-colors duration-300 group-hover:text-muted-foreground/50">
                    Go &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex h-12 flex-shrink-0 items-center justify-between border-t border-border/10 px-8 md:px-10">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/25">
              Atelier - The Design Forum
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/25">
              Est. 2025
            </span>
          </div>
        </div>
      )}
    </>
  )
}
