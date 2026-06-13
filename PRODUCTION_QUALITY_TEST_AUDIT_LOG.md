# Production Quality And Build Testing Audit Log

Date: 2026-06-14  
Workspace: `C:\Users\aviro\OneDrive\Documents\New project`  
Goal: Evaluate production quality and build testing after adding the new `Tests/` folder.

## Executive Summary

The application itself was previously building successfully, but the newly added `Tests/` folder is now included by the root TypeScript project because `tsconfig.json` includes `**/*.ts` and `**/*.tsx`.

That means test files are being treated as production TypeScript during `npm run typecheck` and `next build`. As a result, the production build now fails before runtime validation because the test suite is not yet wired to this repository.

Current state:

- `npm run lint` passes.
- `npx prisma validate` passes.
- `npm run typecheck` fails because `Tests/` is included in the root TypeScript compilation.
- `npm run build` fails during Next.js type validation for the same reason.
- `npm run test` does not exist yet.
- The test runner dependencies are not installed.
- Test configs and test file imports assume a different folder structure and older/different API names.

## Prompt File Access

Requested prompt file:

`C:\Users\aviro\Downloads\CODEX_PROMPT.md`

Result:

- Could not read from the Codex sandbox because the file is outside the workspace root.
- The harness rejected explicit escalation in this session.
- This audit therefore uses the repository `Tests/` folder and records the prompt access limitation.

## Test Folder Inventory

Detected folder:

`C:\Users\aviro\OneDrive\Documents\New project\Tests`

Git status:

```text
?? Tests/
```

Files detected:

- 7 SQL files
- 28 TypeScript files
- 3 TSX files
- 3 shell scripts

Main categories:

- Prisma/RLS SQL tests
- Vitest unit and integration tests
- Playwright smoke, user-flow, security, accessibility, visual, and performance tests
- MSW helpers
- Prismock helpers
- Build/static-analysis/schema shell scripts

## Existing Project Scripts

Current `package.json` has:

```json
{
  "build": "next build",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "verify": "npm run typecheck && npm run build",
  "db:validate": "prisma validate",
  "prisma:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:seed": "prisma db seed"
}
```

Missing scripts for the new tests:

- `test`
- `test:unit`
- `test:e2e`
- `test:build`
- `test:schema`
- `test:static`

Command result:

```text
npm run test
=> Missing script: "test"
```

## Dependency Audit

Command:

```bash
npm ls vitest @vitejs/plugin-react vite-tsconfig-paths jsdom @testing-library/react @testing-library/jest-dom @playwright/test @axe-core/playwright msw prismock --depth=0
```

Result:

```text
designers-hub@0.1.0
`-- (empty)
```

Required but missing packages:

- `vitest`
- `vite`
- `@vitejs/plugin-react`
- `vite-tsconfig-paths`
- `jsdom`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `@playwright/test`
- `@axe-core/playwright`
- `msw`
- `prismock`

## Configuration Findings

### Root `tsconfig.json`

Current include:

```json
"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
```

Impact:

- `Tests/**/*.ts` and `Tests/**/*.tsx` are included in the production TypeScript build.
- Missing test-only dependencies now break `npm run typecheck`.
- Next.js build also fails during type validation.

### `Tests/vitest.config.ts`

Key issue:

The config appears written as if it lives at repository root, but it is located inside `Tests/`.

Examples:

```ts
alias: {
  '@': path.resolve(__dirname, './src'),
  '@tests': path.resolve(__dirname, './tests'),
}
```

Because `__dirname` is `...\New project\Tests`, these resolve to:

- `Tests/src`
- `Tests/tests`

Those folders do not match this repo structure.

Additional mismatch:

```ts
globalSetup: ['./tests/setup.global.ts']
setupFiles: ['./tests/setup.ts']
```

Actual files are:

- `Tests/tests.setup.global.ts`
- `Tests/setup.ts`
- `Tests/tests.setup.ts`

### `Tests/playwright.config.ts`

Key issue:

This config also assumes nested lowercase folders:

```ts
testDir: './tests'
testDir: './tests/e2e/security'
testDir: './tests/e2e/flows'
```

Actual files are currently flat in `Tests/`, not under:

- `Tests/tests/e2e/security`
- `Tests/tests/e2e/flows`
- `Tests/tests/e2e/smoke`
- `Tests/tests/visual`

As written, Playwright would not discover the provided specs unless the folder is reorganized or the config is updated.

## Production Gate Results

### Prisma Validation

Command:

```bash
npx prisma validate
```

Result:

```text
The schema at prisma\schema.prisma is valid
```

Status: PASS

### ESLint

Command:

```bash
npm run lint
```

Result:

```text
No ESLint warnings or errors
```

Status: PASS

### TypeScript

Command:

```bash
npm run typecheck
```

Result:

Status: FAIL

Primary cause:

- `Tests/` is included by root TypeScript.
- Test-only packages are missing.
- Test imports do not match current codebase paths or APIs.

Examples:

```text
Tests/a11y-visual-perf.spec.ts: Cannot find module '@playwright/test'
Tests/api-routes.test.ts: Cannot find module 'vitest'
Tests/comment-service.test.ts: Cannot find module 'prismock'
Tests/components.test.tsx: Cannot find module '@testing-library/react'
```

### Production Build

Command:

```bash
npm run build
```

Result:

Status: FAIL

Build compilation passed, but type validation failed:

```text
Creating an optimized production build ...
Compiled successfully
Linting and checking validity of types ...
Failed to compile.

./Tests/auth.setup.ts:19:39
Type error: Cannot find module '@playwright/test' or its corresponding type declarations.
```

Root cause:

- Next.js includes root TypeScript program during build.
- `Tests/` is not isolated from production typecheck.

## Test Compatibility Findings

The test suite appears conceptually useful but not yet adapted to the current project implementation.

### Path Mismatches

Tests import paths such as:

```ts
@/modules/posts/post-service
@/modules/comments/comment-service
@/modules/votes/vote-service
@/modules/search/search-service
@/modules/help/help-solution-service
@/lib/handle-error
@/lib/require-auth
```

Current repo uses paths such as:

```ts
@/modules/posts/server/post-service
@/modules/comments/server/comment-service
@/modules/votes/server/vote-service
@/modules/search/server/search-service
@/modules/help/server/help-solution-service
@/lib/api/handle-error
@/lib/auth/require-auth
```

### API Contract Mismatches

Examples:

- Tests expect `PATCH` from `src/app/api/profiles/[username]/route.ts`, but current route exports only `GET`.
- Tests expect `src/app/api/stats/route`, but no stats API exists.
- Tests use uppercase post types like `DISCUSSION`, `HELP`, `CRITIQUE`, while Prisma schema uses lowercase enum values:
  - `discussion`
  - `critique`
  - `showcase`
  - `help`
  - `resource`

### Schema Mismatches

Several tests expect fields not present in the current schema:

- `Profile.onboarded`
- `Profile.disciplineId`
- `Profile.email`
- `Tag.usageCount`
- `Vote.direction`

Current schema uses:

- `Profile.primaryDiscipline`
- `Profile.profileSoftwares`
- `Vote.voteType`
- `Post.postType`
- tag popularity through `post_tags`, not `usageCount`

### Component Mismatches

Tests import components that do not exist at those paths:

```ts
@/components/HeroPage
@/components/Dashboard
@/components/ThreadPage
@/components/VoteControl
@/components/ProfilePage
@/components/PostCreationForm
@/components/SearchResults
```

Current repo structure uses more specific folders such as:

- `src/components/forum`
- `src/components/cards`
- `src/components/editor`
- `src/components/navigation`
- `src/components/ui-system`

### Service Signature Mismatches

Some tests call services with injected Prisma clients:

```ts
createPost(prismock, userId, input)
createComment(prismock, input)
voteOnPost(prismock, input)
```

Current services generally import the singleton Prisma client directly and expose signatures like:

```ts
createPost(authorId, input)
createComment(input)
castVote(authorId, input)
searchPosts(query)
```

This means many unit tests cannot run without either:

- adapting services for dependency injection, or
- rewriting tests to mock the singleton Prisma module.

## Shell Script Findings

### `Tests/run-static-analysis.sh`

Good intent:

- Runs TypeScript, lint, and architecture grep checks.

Current issues:

- Assumes Bash environment.
- Uses checks that may be too strict for the current repo.
- `SA-03` forbids `community-data` imports anywhere in `src/`, but the repo still intentionally keeps mock fallback data centrally.

### `Tests/run-schema-tests.sh`

Good intent:

- Validates Prisma schema, generate, migration status, and pgTAP.

Current issues:

- Requires database/Supabase CLI for full execution.
- Pattern checks for unique constraints may fail because current Prisma schema includes mapped constraint names:

```prisma
@@unique([authorId, postId], map: "uq_votes_author_post")
```

Script grep expects:

```text
@@unique([authorId, postId])
```

### `Tests/run-build-ci.sh`

Good intent:

- Covers build, missing env warnings, full verify, migrations, seed idempotency, bundle size, dynamic route checks, strict TypeScript.

Current issues:

- Calls `npm run test`, but no `test` script exists.
- Runs `npm run build` multiple times, which can be slow and may trigger `.next` race issues if run concurrently elsewhere.
- Uses Bash heredoc syntax for Prisma DB execute, which may not work in PowerShell.

## Production Quality Assessment

### Strengths

- Core app lint still passes.
- Prisma schema validates.
- The test suite covers the right quality categories conceptually:
  - static analysis
  - schema/RLS
  - service unit tests
  - API route tests
  - integration tests
  - accessibility
  - visual regression
  - performance
  - smoke tests
  - security tests

### Blockers

- Production build is currently broken because `Tests/` is included by root TypeScript.
- Test dependencies are not installed.
- Test config paths are incorrect for the current folder layout.
- Many test imports target a different code architecture.
- Several test expectations do not match current Prisma schema and service signatures.

### Risk Level

Current risk: HIGH for build pipeline.

Reason:

Adding `Tests/` currently turns a previously buildable app into a build failure.

This is not because the app feature code is necessarily broken. It is because the test harness is not isolated or adapted.

## Recommended Remediation Order

### Step 1: Restore Production Build Isolation

Choose one:

Option A:

- Exclude `Tests/` from root `tsconfig.json`.
- Add a separate `Tests/tsconfig.json` for test compilation.

Option B:

- Move tests into lowercase `tests/`.
- Configure root `tsconfig.json` to exclude test folders.
- Configure Vitest and Playwright with explicit test-specific configs.

Recommended: Option A first, because it is the smallest recovery step.

### Step 2: Add Test Dependencies

Install only after deciding the test architecture:

```bash
npm install -D vitest vite @vitejs/plugin-react vite-tsconfig-paths jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test @axe-core/playwright msw prismock
```

Then install browsers:

```bash
npx playwright install
```

### Step 3: Fix Config Paths

If configs remain inside `Tests/`, update aliases:

```ts
'@': path.resolve(__dirname, '../src')
'@tests': path.resolve(__dirname)
```

Update setup references to actual files:

```ts
setupFiles: ['./setup.ts']
```

Or move configs to repo root and keep root-oriented paths.

### Step 4: Split Test Categories

Recommended scripts:

```json
{
  "test": "vitest run --config Tests/vitest.config.ts",
  "test:unit": "vitest run --config Tests/vitest.config.ts Tests/*.test.ts Tests/*.test.tsx",
  "test:e2e": "playwright test --config Tests/playwright.config.ts",
  "test:static": "bash Tests/run-static-analysis.sh",
  "test:schema": "bash Tests/run-schema-tests.sh",
  "test:build": "bash Tests/run-build-ci.sh"
}
```

On Windows, consider PowerShell equivalents or running Bash scripts through Git Bash.

### Step 5: Adapt Tests To Current Architecture

Required changes:

- Update module imports to `server/*` paths.
- Update API expectations to actual route exports.
- Replace uppercase enum values with lowercase enum values.
- Remove references to missing schema fields.
- Replace missing component imports with actual components.
- Decide whether service tests mock singleton Prisma or refactor services for dependency injection.

### Step 6: Re-run Quality Gates

Minimum clean gate:

```bash
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

Then test gates:

```bash
npm run test
npm run test:e2e
npm run test:schema
```

## Immediate Debug Checklist

- `Tests/` must not be compiled by production `tsc`.
- Test dependencies must be installed before running test files.
- Vitest config must point to `../src`, not `Tests/src`.
- Playwright config must discover actual spec file locations.
- API route tests must be updated for current route exports.
- Service tests must align with actual service function signatures.
- Prisma enum casing must match schema.
- RLS tests require Supabase CLI or database SQL execution setup.

## Current Bottom Line

The added test suite is a strong testing ambition, but it is not yet production-ready for this repository.

Before evaluating product quality through the suite, the test harness itself must be integrated. The most urgent fix is to isolate `Tests/` from the production TypeScript/build pipeline so the website can build while the tests are adapted.
