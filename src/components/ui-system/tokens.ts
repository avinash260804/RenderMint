export const spacingTokens = {
  "2xs": "0.25rem",
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
} as const;

export const typographyTokens = {
  hero: "text-4xl font-semibold tracking-tight sm:text-5xl",
  h1: "text-3xl font-semibold tracking-tight sm:text-4xl",
  h2: "text-2xl font-semibold tracking-tight sm:text-3xl",
  h3: "text-xl font-semibold tracking-tight",
  body: "text-sm leading-6 text-muted-foreground sm:text-base",
  label: "font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground",
} as const;

export const postTypeAccents = {
  discussion: "oklch(0.65 0.12 80)",
  critique: "oklch(0.7 0.2 45)",
  showcase: "oklch(0.65 0.18 150)",
  help: "oklch(0.65 0.15 230)",
  resource: "oklch(0.65 0.15 270)",
} as const;
