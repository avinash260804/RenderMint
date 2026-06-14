"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { gsap } from "gsap"

/* ─── Types ─────────────────────────────────────────────────── */
interface CardData {
  id: string
  label: string
  title: string
  description: string
  icon?: string
  variant?: "default" | "stat" | "wide" | "featured"
  stat?: string
  statLabel?: string
  tags?: string[]
  className?: string
}

/* ─── Community-themed card data ────────────────────────────── */
const COMMUNITY_CARDS: CardData[] = [
  {
    id: "members",
    label: "Community",
    title: "",
    description: "Creative professionals across all disciplines",
    variant: "stat",
    stat: "48K",
    statLabel: "Members",
    className: "",
  },
  {
    id: "disciplines",
    label: "Categories",
    title: "6 Disciplines",
    description: "Architecture · Interior · Urban · Product · Graphic · Industrial",
    variant: "default",
    className: "",
  },
  {
    id: "showcase",
    label: "Showcase",
    title: "Portfolio Hub",
    description: "120K projects shared and peer-reviewed",
    variant: "stat",
    stat: "120K",
    statLabel: "Projects",
    className: "magic-bento-card--tall",
  },
  {
    id: "critique",
    label: "Live · Daily",
    title: "Critique Sessions",
    description: "Structured, expert-moderated design feedback",
    variant: "default",
    className: "magic-bento-card--wide",
    tags: ["Architecture", "Interior", "Product"],
  },
  {
    id: "discussions",
    label: "Discussions",
    title: "Forum Threads",
    description: "Ask, answer, debate — across every design discipline",
    variant: "default",
    className: "",
  },
  {
    id: "join",
    label: "Beta · 2025",
    title: "Early Access",
    description: "Join the waitlist and shape Atelier from day one",
    variant: "featured",
    className: "",
    tags: ["Limited Spots"],
  },
]

const DEFAULT_GLOW_COLOR = "220, 160, 60"
const DEFAULT_PARTICLE_COUNT = 6
const DEFAULT_SPOTLIGHT_RADIUS = 180
const MOBILE_BREAKPOINT = 768

/* ─── Helpers ───────────────────────────────────────────────── */
const createParticleElement = (x: number, y: number, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement("div")
  el.style.cssText = `
    position: absolute;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: rgba(${color}, 0.7);
    box-shadow: 0 0 3px rgba(${color}, 0.3);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `
  return el
}

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number,
) => {
  const rect = card.getBoundingClientRect()
  const relativeX = ((mouseX - rect.left) / rect.width) * 100
  const relativeY = ((mouseY - rect.top) / rect.height) * 100
  card.style.setProperty("--glow-x", `${relativeX}%`)
  card.style.setProperty("--glow-y", `${relativeY}%`)
  card.style.setProperty("--glow-intensity", glow.toString())
  card.style.setProperty("--glow-radius", `${radius}px`)
}

/* ─── ParticleCard ──────────────────────────────────────────── */
const ParticleCard = ({
  children,
  className = "",
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  disableAnimations = false,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  particleCount?: number
  glowColor?: string
  clickEffect?: boolean
  disableAnimations?: boolean
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLElement[]>([])
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const isHoveredRef = useRef(false)
  const memoizedParticles = useRef<HTMLElement[]>([])
  const particlesInitialized = useRef(false)

  const initParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return
    const { width, height } = cardRef.current.getBoundingClientRect()
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor),
    )
    particlesInitialized.current = true
  }, [particleCount, glowColor])

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    particlesRef.current.forEach((p) => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => p.parentNode?.removeChild(p),
      })
    })
    particlesRef.current = []
  }, [])

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return
    if (!particlesInitialized.current) initParticles()

    memoizedParticles.current.forEach((particle, i) => {
      const id = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return
        const clone = particle.cloneNode(true) as HTMLElement
        cardRef.current.appendChild(clone)
        particlesRef.current.push(clone)

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" })
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 90,
          y: (Math.random() - 0.5) * 90,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        })
        gsap.to(clone, { opacity: 0.25, duration: 1.5, ease: "power2.inOut", repeat: -1, yoyo: true })
      }, i * 100)
      timeoutsRef.current.push(id)
    })
  }, [initParticles])

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return
    const el = cardRef.current

    const onEnter = () => { isHoveredRef.current = true; animateParticles() }
    const onLeave = () => { isHoveredRef.current = false; clearParticles() }
    const onClick = (e: MouseEvent) => {
      if (!clickEffect) return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const maxDist = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height))
      const ripple = document.createElement("div")
      ripple.style.cssText = `position:absolute;width:${maxDist * 2}px;height:${maxDist * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(${glowColor},0.35) 0%,rgba(${glowColor},0.15) 30%,transparent 70%);left:${x - maxDist}px;top:${y - maxDist}px;pointer-events:none;z-index:1000;`
      el.appendChild(ripple)
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.7, ease: "power2.out", onComplete: () => ripple.remove() })
    }

    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)
    el.addEventListener("click", onClick)
    return () => {
      isHoveredRef.current = false
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
      el.removeEventListener("click", onClick)
      clearParticles()
    }
  }, [animateParticles, clearParticles, disableAnimations, clickEffect, glowColor])

  return (
    <div ref={cardRef} className={`${className} particle-container`} style={{ ...style, position: "relative", overflow: "hidden" }}>
      {children}
    </div>
  )
}

/* ─── GlobalSpotlight ───────────────────────────────────────── */
const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}: {
  gridRef: React.RefObject<HTMLDivElement | null>
  disableAnimations?: boolean
  enabled?: boolean
  spotlightRadius?: number
  glowColor?: string
}) => {
  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return
    const spotlight = document.createElement("div")
    spotlight.style.cssText = `position:fixed;width:500px;height:500px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(${glowColor},0.08) 0%,rgba(${glowColor},0.03) 25%,rgba(${glowColor},0.01) 50%,transparent 70%);z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;`
    document.body.appendChild(spotlight)

    const proximity = spotlightRadius * 0.5
    const fadeDistance = spotlightRadius * 0.75

    const onMove = (e: MouseEvent) => {
      if (!gridRef.current) return
      const section = gridRef.current.closest(".bento-section")
      const rect = section?.getBoundingClientRect()
      const inside = rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom

      const cards = gridRef.current.querySelectorAll<HTMLElement>(".magic-bento-card")
      if (!inside) {
        gsap.to(spotlight, { opacity: 0, duration: 0.3 })
        cards.forEach((c) => c.style.setProperty("--glow-intensity", "0"))
        return
      }

      let minDist = Infinity
      cards.forEach((card) => {
        const cr = card.getBoundingClientRect()
        const cx = cr.left + cr.width / 2
        const cy = cr.top + cr.height / 2
        const dist = Math.max(0, Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(cr.width, cr.height) / 2)
        minDist = Math.min(minDist, dist)
        const intensity = dist <= proximity ? 1 : dist <= fadeDistance ? (fadeDistance - dist) / (fadeDistance - proximity) : 0
        updateCardGlowProperties(card, e.clientX, e.clientY, intensity, spotlightRadius)
      })

      gsap.to(spotlight, { left: e.clientX, top: e.clientY, duration: 0.1 })
      const targetOp = minDist <= proximity ? 0.4 : minDist <= fadeDistance ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.4 : 0
      gsap.to(spotlight, { opacity: targetOp, duration: targetOp > 0 ? 0.2 : 0.5 })
    }

    const onLeave = () => {
      gridRef.current?.querySelectorAll<HTMLElement>(".magic-bento-card").forEach((c) => c.style.setProperty("--glow-intensity", "0"))
      gsap.to(spotlight, { opacity: 0, duration: 0.3 })
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      spotlight.parentNode?.removeChild(spotlight)
    }
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor])

  return null
}

/* ─── Card content renderers ────────────────────────────────── */
const CardContent = ({ card }: { card: CardData }) => {
  if (card.variant === "stat") {
    return (
      <>
        <div className="magic-bento-card__header">
          <div className="magic-bento-card__label">{card.label}</div>
          <div className="magic-bento-card__dot" />
        </div>
        <div className="magic-bento-card__content">
          <div className="magic-bento-card__stat">{card.stat}</div>
          <div className="magic-bento-card__stat-label">{card.statLabel}</div>
          <p className="magic-bento-card__description" style={{ marginTop: "0.6em" }}>{card.description}</p>
        </div>
      </>
    )
  }

  if (card.variant === "featured") {
    return (
      <>
        <div className="magic-bento-card__header">
          <div className="magic-bento-card__label">{card.label}</div>
          {card.tags?.map((t) => (
            <div key={t} className="magic-bento-card__tag">
              <span className="magic-bento-card__dot" />
              {t}
            </div>
          ))}
        </div>
        <div className="magic-bento-card__content">
          <h3 className="magic-bento-card__title">{card.title}</h3>
          <p className="magic-bento-card__description">{card.description}</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="magic-bento-card__header">
        <div className="magic-bento-card__label">{card.label}</div>
        {card.tags && (
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {card.tags.map((t) => (
              <div key={t} className="magic-bento-card__tag">{t}</div>
            ))}
          </div>
        )}
      </div>
      <div className="magic-bento-card__content">
        <h3 className="magic-bento-card__title">{card.title}</h3>
        <p className="magic-bento-card__description">{card.description}</p>
      </div>
    </>
  )
}

/* ─── Main MagicBento ───────────────────────────────────────── */
export const MagicBento = ({
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
}: {
  enableStars?: boolean
  enableSpotlight?: boolean
  enableBorderGlow?: boolean
  spotlightRadius?: number
  particleCount?: number
  glowColor?: string
  clickEffect?: boolean
}) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const shouldDisable = isMobile

  return (
    <>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisable}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div className="card-grid bento-section" ref={gridRef}>
        {COMMUNITY_CARDS.map((card) => {
          const baseClass = `magic-bento-card ${card.className ?? ""} ${enableBorderGlow ? "magic-bento-card--border-glow" : ""}`.trim()
          const cardStyle: React.CSSProperties = { "--glow-color": glowColor } as React.CSSProperties

          if (enableStars && !shouldDisable) {
            return (
              <ParticleCard
                key={card.id}
                className={baseClass}
                style={cardStyle}
                disableAnimations={shouldDisable}
                particleCount={particleCount}
                glowColor={glowColor}
                clickEffect={clickEffect}
              >
                <CardContent card={card} />
              </ParticleCard>
            )
          }

          return (
            <div key={card.id} className={baseClass} style={cardStyle}>
              <CardContent card={card} />
            </div>
          )
        })}
      </div>
    </>
  )
}
