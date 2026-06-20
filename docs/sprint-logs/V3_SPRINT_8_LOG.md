# V3 Sprint 8 Log

Date: 2026-06-15
Sprint: Sprint 8 - Help / Solved System
Status: Completed with known repository-level follow-up items

## Objective

Complete the help solved-system phase by moving the `/api/help/solution` route onto the production server help service, aligning the route contract with the live UI, and enforcing author-only solution management for help threads.

## Scope Completed

- Replaced the legacy `postId`-only solved route seam with the production slug-based help service path.
- Kept backward compatibility for legacy callers by still accepting `postId` and resolving it to the canonical `postSlug`.
- Upgraded `GET /api/help/solution` to the production help service and structured validation path.
- Upgraded `POST /api/help/solution` to authenticated, onboarded, author-restricted solution mutation.
- Fixed the authorization/fallback behavior in the server help service so `Forbidden` and `NotFound` errors are not swallowed by broad fallback handling.
- Added viewer-level permission metadata for solution management.
- Updated the live comments panel so only the help-thread author sees solution controls.
- Preserved fallback/community help-thread support where database-backed help threads are unavailable.

## Architecture Notes

### Solved-system module

- `src/modules/help/server/help-solution-service.ts` remains the production source of truth for help solved state.
- It now supports viewer-aware reads through an optional `userId` input and returns whether the viewer can manage the accepted solution.
- The service now properly rethrows app-level permission/resource errors instead of treating them like fallback conditions.

### API contract

- `GET /api/help/solution` now accepts:
  - `postSlug` as the canonical live contract
  - `postId` as a compatibility fallback
- `POST /api/help/solution` now accepts:
  - `postSlug` as the canonical live contract
  - `postId` as a compatibility fallback
  - `commentId` as either a selected solution or `null` to clear the solved state
- Route responses now include:
  - `data`: solved state
  - `meta.canManageSolution`: whether the current viewer can manage the solution

### UI behavior

- `src/components/forum/comments-panel.tsx` already used `postSlug`; Sprint 8 brings the route into alignment with that live contract.
- The panel now shows `Mark as solution` / `Unmark solution` only when the viewer is allowed to manage the solved state.
- The general solved badge and thread metadata behavior remain unchanged and continue to read from the server help-solution state.

## Files Added Or Updated

- `src/modules/help/schemas/help-solution-schema.ts`
- `src/modules/help/server/help-solution-service.ts`
- `src/app/api/help/solution/route.ts`
- `src/components/forum/comments-panel.tsx`
- `tsconfig.json` restored after `next lint` auto-mutated it

## Verification

### Passed

- `npm run typecheck`
- `npm run lint`
- `npm run build`

### Build output confirmation

- `/api/help/solution` builds successfully as a dynamic route.
- `/thread/[slug]` builds successfully with the updated author-only solved-controls behavior.

## Observed Warnings / Follow-up Items

1. `next lint` again auto-reinserted `.next/types/**/*.ts` into `tsconfig.json`.
   - Restored manually after verification.

2. Build completed successfully, but the repository still emits Prisma datasource validation noise during static generation.
   - Observed message pattern: Prisma expects `prisma://` or `prisma+postgres://` for some build-time invocations.
   - This remains a broader datasource/runtime hardening item rather than a Sprint 8 regression.

3. The inherited lint warning in `src/components/v0/hero/scramble-text.tsx` remains.
   - React hook dependency warning only.
   - Lint still passes.

4. Older route tests and security fixtures still reference the legacy `postId` mutation shape.
   - Sprint 8 preserved compatibility for that input.
   - If the tests are refreshed later, they should be updated to prefer the canonical `postSlug` contract used by the live UI.

## Exit Criteria Review

- Help solved state is backed by the production server service: Yes
- Live route contract matches the UI's `postSlug` flow: Yes
- Thread author is the only viewer with solution-management controls: Yes
- Unauthorized solved-state fallback swallowing is fixed: Yes
- Typecheck, lint, and build complete successfully: Yes

## Recommended Next Focus

- Sprint 9 search
- Parallel backlog note: Prisma datasource/build-time configuration cleanup
- Parallel backlog note: inherited `scramble-text` hook dependency lint warning
- Parallel backlog note: refresh legacy route tests toward the canonical slug-based solved contract
