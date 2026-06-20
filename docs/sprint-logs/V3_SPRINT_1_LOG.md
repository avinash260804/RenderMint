# V3 Sprint 1 Log - Repo Import Prep & v0 UI Audit

Date: 2026-06-15
Branch: `feature/v0-ui-import`
Status: Complete

## Scope

Sprint 1 imported the four v0 source surfaces into isolated preview routes only:

- Hero
- Login
- Dashboard
- Profile

No live production route was replaced in this sprint.

## Source Repositories Audited

- `atelier-dashboard-analysis` branch `v0/batcharurals24-8893-6760e719`
- `v0-interface` branch `atelier-menu-redesign`
- `atelier-profile-page` branch `v0/rurals198-4465-380f2753`
- `login-page-design`

Local staging clones were stored under `.tmp/v0-sources/`.

## Imported Staging Paths

### Preview routes

- `src/app/(v0-import)/v0-preview/page.tsx`
- `src/app/(v0-import)/v0-preview/hero/page.tsx`
- `src/app/(v0-import)/v0-preview/login/page.tsx`
- `src/app/(v0-import)/v0-preview/dashboard/page.tsx`
- `src/app/(v0-import)/v0-preview/profile/page.tsx`

### Route-scoped styles

- `src/app/(v0-import)/v0-preview/layout.tsx`
- `src/app/(v0-import)/v0-preview/v0-preview.css`

### Imported components

- `src/components/v0/hero/*`
- `src/components/v0/login/*`
- `src/components/v0/dashboard/*`
- `src/components/v0/profile/*`

### Preview assets

- `public/v0/showcase-*.png`
- `public/v0/atelier-bg.png`

## Dependency Compatibility Audit

### Added packages

- `gsap`
- `framer-motion`

### Reused existing app primitives

The login import was adapted to reuse the existing shadcn/ui primitives:

- `src/components/ui/button`
- `src/components/ui/input`
- `src/components/ui/label`
- `src/components/ui/checkbox`
- `src/components/ui/separator`

### CSS strategy

The source repos carried separate global CSS files. Instead of importing those globals directly into production routes, Sprint 1 created one isolated preview stylesheet:

- `src/app/(v0-import)/v0-preview/v0-preview.css`

This file provides the imported design tokens and utility classes only for the preview surfaces.

## Page Audit

### Hero

Preview route:

- `/v0-preview/hero`

Mock data still present:

- hardcoded platform stats: `48k`, `6`, `120k`
- fake critique cards
- fake showcase items
- fake discipline counts in join section
- marketing copy references multiple future disciplines beyond the current architecture-first MVP

Route and CTA expectations found:

- top navigation scrolls to in-page anchors
- primary CTA links to `#join`
- secondary CTA links to `#work`

Design and product gaps:

- needs real discipline list and stats service
- needs architecture-first positioning review
- needs real route CTAs for join and explore
- must retain premium editorial feel without generic SaaS language

### Login

Preview route:

- `/v0-preview/login`

Mock data still present:

- no real submit handler
- placeholder email and password fields
- unsupported Facebook and LinkedIn buttons
- static welcome copy

Route and CTA expectations found:

- toggles between sign-up and sign-in in the same surface
- no real auth callback or onboarding routing logic attached

Design and product gaps:

- wire to Supabase Google OAuth and magic link only
- preserve onboarding redirect logic
- map real validation and auth errors into the imported UI
- remove unsupported provider affordances

### Dashboard

Preview route:

- `/v0-preview/dashboard`

Mock data still present:

- fake user identity
- fake discipline switcher list
- fake activity heatmap and growth widgets
- fake critique requests
- fake discussion of the day

Route and CTA expectations found:

- header expects search, notifications, settings, critique, and log-work actions
- dashboard assumes authenticated ownership context

Design and product gaps:

- replace all identity and feed data with real profile and feed service reads
- remove notifications behavior from the MVP surface
- preserve discipline-first framing
- must become an auth-protected route before going live

### Profile

Preview route:

- `/v0-preview/profile`

Mock data still present:

- full `PROFILE` object in `src/components/v0/profile/profile-data.ts`
- fake achievements, projects, reputation tags, joined date, and progress states

Out-of-scope UI found:

- `Follow`
- `Chat`
- social-style share/action treatment

Route and CTA expectations found:

- expects an owner-aware mode
- expects editable status state
- expects public showcase and contribution history

Design and product gaps:

- wire to `/api/profiles/[username]` and `/api/profiles/me`
- remove follower/chat style actions
- ensure creative identity depth: discipline, software, skills, reputation, showcase history
- add owner edit flow without breaking the public profile contract

## Principles Compliance Review

### Discipline-first

- Hero and Dashboard both foreground discipline visually, which is promising.
- Hero copy currently over-expands into many disciplines; this needs MVP alignment in Sprint 3.

### Profile equals creative identity

- Profile is much closer to the product principle than a generic social profile.
- It still includes out-of-scope social actions and needs real backend-backed evidence.

### Community over social metrics

- Profile contains follower/chat style actions that must be removed before live wiring.
- Dashboard includes notification-style affordances that should not become product commitments.

### Clear visual hierarchy

- Hero and Dashboard both have strong top-level structure.
- Live CTA mapping remains unresolved until wiring sprints.

### Distinctive design language

- The imports establish a coherent editorial dark aesthetic that can guide Sprint 6.
- Route-scoped preview styling avoids polluting the live system before design adoption is intentional.

## Verification

Planned gates for sprint completion:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

Results are recorded after implementation completion in this same sprint log update.

## Verification Results

- `npm run lint`: passed
- `npm run build`: passed
- `npm run typecheck`: passed after removing the fragile `.next/types/**/*.ts` include from `tsconfig.json`

### tsconfig nuance

- `next lint` attempted to reinsert `.next/types/**/*.ts` into `tsconfig.json`
- in this workspace that include produces standalone `tsc --noEmit` false-negatives even after a successful build
- the repository was left in the working state with that include removed so `npm run typecheck` remains reliable

### Build notes

- The production build completed successfully and the new preview routes were emitted:
  - `/v0-preview`
  - `/v0-preview/hero`
  - `/v0-preview/login`
  - `/v0-preview/dashboard`
  - `/v0-preview/profile`
- Build output still surfaced pre-existing Prisma connection-pool warnings during static page generation:
  - `EMAXCONNSESSION max clients reached in session mode`
  - these warnings were not introduced by Sprint 1 and align with the existing Supabase pooling concern already tracked in the repository history

### Lint warnings left intentionally for later wiring

- `src/components/v0/hero/scramble-text.tsx`
  - copied animation component carries a hook-dependency warning from the source export
- `src/components/v0/login/auth-left-panel.tsx`
  - copied preview panel still uses `<img>` and should move to `next/image` if retained in the live route during Sprint 2

## Notes

- `ATELIER_PRODUCT_PRINCIPLES.md` was not present in the workspace root during this sprint. The V3 plan and `AGENTS.md` were used as the active product contract inputs.
