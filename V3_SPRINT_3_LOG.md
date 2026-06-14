# V3 Sprint 3 Log

Date: 2026-06-15
Sprint: Sprint 3 - Hero Page Wiring
Status: Completed with known repository-level follow-up items

## Objective

Wire the imported v0 Hero page to real discipline data, real platform stats, and real CTAs so the landing page communicates the product clearly and becomes the live `/` route.

## Scope Completed

- Replaced the old homepage implementation at `/` with the imported v0 landing page shell.
- Wired hero stats to `getPlatformStats()` via the new stats service.
- Wired discipline pills and join-section discipline breakdown to real discipline data.
- Rewired primary CTA paths to `/login` and secondary CTA paths to `/explore`.
- Adjusted landing copy to architecture-first positioning instead of generic multi-discipline marketing.
- Kept deeper editorial showcase/critique/principles sections visually imported as planned, without jumping ahead into later sprint wiring.
- Preserved a preview route for the wired hero via `/v0-preview/hero`.

## Architecture Notes

### Data flow

- `src/app/page.tsx` is now a thin server entrypoint.
- `src/modules/stats/server/stats-service.ts` remains the single source for platform stat aggregation.
- `src/components/v0/hero/landing-page.tsx` composes the imported hero experience.
- `HeroSection` and `JoinSection` now receive typed props instead of reading hardcoded numbers.

### Fallback behavior

- `getPlatformStats()` still falls back to catalog-backed values when the database is not reachable.
- This keeps preview routes and test environments usable without introducing mock stores into production flows.

## Files Added Or Updated

- `src/app/page.tsx`
- `src/app/api/stats/route.ts`
- `src/app/(v0-import)/v0-preview/hero/page.tsx`
- `src/modules/stats/server/stats-service.ts`
- `src/components/v0/hero/types.ts`
- `src/components/v0/hero/landing-page.tsx`
- `src/components/v0/hero/hero-preview-page.tsx`
- `src/components/v0/hero/hero-section.tsx`
- `src/components/v0/hero/join-section.tsx`
- `src/components/v0/hero/atelier-nav.tsx`
- `tsconfig.json` restored after `next lint` auto-mutated it

## Verification

### Passed

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `GET /api/stats` existing API coverage passed within `npm run test:api`

### Observed warnings / follow-up items

1. `next lint` auto-reinserted `.next/types/**/*.ts` into `tsconfig.json`.
   - Restored manually after lint to keep standalone `tsc --noEmit` working in this workspace.

2. `npm run build` completed, but Prisma emitted existing build-time connection pressure warnings during static generation:
   - `EMAXCONNSESSION max clients reached in session mode`
   - These warnings are not introduced by Sprint 3 specifically and remain a repository-level production hardening item.

3. `npm run test:api` has one unrelated failing test outside Sprint 3 scope:
   - `A-28 GET /api/search ?q=xyznotreal`
   - Current behavior returns fallback search results instead of an empty result set.
   - Sprint 3 stats coverage passed; the failure belongs to search behavior.

4. Existing lint warning remains in imported UI code:
   - `src/components/v0/hero/scramble-text.tsx`
   - React hook dependency warning only; lint still passes.

## Exit Criteria Review

- `/` is the imported Hero and renders real stat + discipline data: Yes
- Hero CTAs route to working destinations: Yes
- `/api/stats` returns platform counts and remains test-covered: Yes
- Sprint scope limited without jumping ahead: Yes

## Recommended Next Focus

- Sprint 4 dashboard wiring
- Parallel backlog note: production hardening for Prisma build-time connection usage
- Parallel backlog note: search empty-query regression in API test A-28
