"use client"

import Image from "next/image"

interface AuthLeftPanelProps {
  mode: "signin" | "signup"
  onToggleMode: () => void
}

export function AuthLeftPanel({ mode, onToggleMode }: AuthLeftPanelProps) {
  return (
    <div className="relative flex-1 hidden md:flex flex-col overflow-hidden rounded-2xl">
      {/* Background image */}
      <Image
        src="/v0/atelier-bg.png"
        alt="Atelier studio"
        fill
        priority
        className="absolute inset-0 object-cover"
      />

      {/* Frosted glass overlay — the transparency effect */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.60) 100%)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      />

      {/* Glass card overlay in the center-left */}
      <div
        className="absolute inset-8 rounded-xl flex flex-col justify-between p-8"
        style={{
          background: "rgba(10, 8, 6, 0.30)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.13)",
        }}
      >
        {/* Top — brand wordmark */}
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[--atelier-gold] font-sans font-medium mb-1">
            Atelier
          </p>
          <div className="w-6 h-px bg-[--atelier-gold] mb-6" />
          <p className="text-sm text-foreground/60 font-sans font-light tracking-wide">
            {mode === "signup" ? "You are" : "Welcome back"}
          </p>
          <h1
            className="text-3xl font-light leading-tight mt-1 text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {mode === "signup"
              ? "Most welcome here."
              : "Glad to see you again."}
          </h1>
          <p className="text-sm text-foreground/55 font-sans font-light leading-relaxed mt-4 max-w-[240px]">
            {mode === "signup"
              ? "Join a structured design community for critique, discussion, showcases, resources, and design help."
              : "Return to your design community and continue the conversations, critiques, and showcases that matter."}
          </p>
        </div>

        {/* Bottom — toggle mode */}
        <div>
          <p className="text-sm text-foreground/50 font-sans font-light mb-1">
            {mode === "signup"
              ? "Already have an account?"
              : "New to Atelier?"}
          </p>
          <button
            onClick={onToggleMode}
            className="text-sm font-sans font-medium tracking-wide text-[--atelier-gold] hover:text-[--atelier-warm] transition-colors underline underline-offset-4"
          >
            {mode === "signup" ? "Sign In" : "Create an Account"}
          </button>
        </div>
      </div>
    </div>
  )
}
