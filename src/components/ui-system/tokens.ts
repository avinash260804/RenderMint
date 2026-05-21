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
  label: "text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground",
} as const;

export const postTypeAccents = {
  discussion: "border-l-4 border-l-zinc-400",
  critique: "border-l-4 border-l-amber-500",
  showcase: "border-l-4 border-l-emerald-500",
  help: "border-l-4 border-l-sky-500",
  resource: "border-l-4 border-l-violet-500",
} as const;
