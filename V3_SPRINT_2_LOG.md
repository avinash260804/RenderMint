# V3 Sprint 2 Log - Login & Auth Page Wiring

Date: 2026-06-15
Branch: `feature/v0-ui-import`
Status: Complete

## Scope

Sprint 2 replaced the live login and signup presentation layer with the imported v0 auth surface and wired it to the real Supabase authentication flow.

This sprint stayed within scope:

- Google OAuth
- Magic Link
- onboarding redirect preservation
- authenticated auth-page redirect handling

This sprint did not jump ahead into Dashboard wiring.

## Architecture Decisions

### 1. Live auth routes now use the imported v0 shell

Updated live entry points:

- `src/app/login/page.tsx`
- `src/app/signup/page.tsx`
- `src/app/auth/login/page.tsx`
- `src/app/auth/signup/page.tsx`

These now render the imported v0 auth page through the existing `AuthActions` boundary, rather than the old barebones auth form.

### 2. Redirect logic was centralized server-side

Added:

- `src/modules/auth/server/auth-redirect.ts`

This module now owns:

- `sanitizeNextPath`
- `resolvePostAuthRedirect`

That keeps route pages thin and avoids scattering onboarding-vs-home redirect logic across API routes and page files.

### 3. Callback flow now resolves onboarding state after session exchange

Updated:

- `src/app/auth/callback/route.ts`

Behavior:

- exchange Supabase auth code for session
- if callback fails, redirect to `/login?error=auth_callback_failed`
- if user is not onboarded, redirect to `/onboarding`
- if user is onboarded, redirect to the sanitized `next` path or `/`

### 4. Middleware was narrowed back to anonymous protection

Updated:

- `middleware.ts`

The old middleware forced authenticated users on `/login` and `/signup` to `/onboarding` blindly. That is now removed.

Authenticated auth-page redirects are handled in the server route pages instead, where onboarding state can be resolved safely with the real backend.

## Auth Surface Changes

### Updated v0 login components

- `src/components/v0/login/auth-page.tsx`
- `src/components/v0/login/auth-left-panel.tsx`
- `src/components/v0/login/auth-form.tsx`

### Behavior now implemented

- email field submits real Magic Link requests to `/api/auth/magic-link`
- Google button starts real OAuth flow via `/api/auth/google`
- callback errors are surfaced on the UI
- password field is removed entirely
- unsupported Facebook and LinkedIn buttons are removed
- copy now matches Atelier positioning more closely
- left panel image now uses `next/image`

### Visual note

Mock visual assets were intentionally retained where they help preserve the imported premium look, per the instruction to keep mock data for visualisation where it does not interfere with real auth behavior.

## API Contract Changes

Updated:

- `src/app/api/auth/google/route.ts`
- `src/app/api/auth/magic-link/route.ts`
- `src/modules/auth/schemas/auth-schemas.ts`

### New server-side validation

Both auth start routes now validate:

- `next`
- `intent`

Magic Link continues validating:

- `email`

### Redirect safety

`next` is sanitized server-side before it is embedded into callback redirects.

Unsafe targets are discarded.

## Redirect Outcome

### Authenticated users

If an authenticated user opens:

- `/login`
- `/signup`
- `/auth/login`
- `/auth/signup`

the server page now checks onboarding state and redirects appropriately.

### New users

New users still land on:

- `/onboarding`

after authentication.

### Returning users

The V3 plan says returning users should go to dashboard, but this repository does not yet have a live `/dashboard` route.

To preserve current contracts and avoid jumping into Sprint 4, Sprint 2 uses:

- `/`

as the post-auth destination for onboarded users.

This is intentional and temporary until Sprint 4 promotes the real dashboard route.

## Verification

### Quality gates

- `npm run typecheck`: passed
- `npm run lint`: passed with one existing warning
- `npm run build`: passed

### Build note

Build still reports the pre-existing Prisma connection pool warning during static generation:

- `EMAXCONNSESSION max clients reached in session mode`

This was not introduced by Sprint 2.

### Focused auth verification

Started the built app on:

- `http://127.0.0.1:3001`

Then ran:

- `npx playwright test tests/e2e/auth.setup.ts --project=setup`

Result:

- 2 passed
- 0 failed

That confirms the new live login surface still satisfies the auth setup contract expected by the targeted Playwright auth bootstrap tests.

## Remaining Follow-Up

### Deferred to Sprint 4

- real `/dashboard` destination for returning users

### Deferred to future cleanup

- existing hook dependency lint warning in `src/components/v0/hero/scramble-text.tsx`

### Workspace nuance

- `next lint` re-adds `.next/types/**/*.ts` to `tsconfig.json` in this workspace
- that include causes false-negative standalone `tsc --noEmit` failures here
- the repository was left in the working state with that include removed
