# Environment Debug Issues

Date: `2026-06-14`  
Scope: Execution-environment issues and runtime/deployment mismatches observed during build and test verification.

## Current High-Priority Issues

### 1. Database schema drift against live/runtime database

Status: `Open`

Observed in:

- `npm run build`
- `npm run start -- -p 3001`

Error:

```text
The column `tags.usage_count` does not exist in the current database.
```

Impact:

- Prisma read queries log runtime errors during static generation and production requests.
- The app still serves pages because fallback/catalog logic catches failures in key read paths.
- This is a release-quality problem even though the build exits successfully.

Likely cause:

- Prisma schema and deployed database are out of sync.

Recommended later fix:

1. Apply the pending schema changes to the target database.
2. Confirm that the `tags` table includes the expected `usage_count` column.
3. Re-run `prisma migrate status`, `npm run build`, and production probes.

### 2. Pending Prisma migration

Status: `Open`

Observed command:

```powershell
npx.cmd prisma migrate status --schema prisma/schema.prisma
```

Result:

- Pending migration detected:
  - `20260614_rls_policy_hardening`

Impact:

- Database state is not aligned with repository migration history.
- Production verification is incomplete from a deployment perspective until migrations are reconciled.

Recommended later fix:

1. Decide whether this target environment should use `migrate deploy` or a controlled `db push`.
2. Apply the migration to the correct database.
3. Re-run migration status and build verification.

### 3. Pre-build TypeScript false negatives from stale `.next/types`

Status: `Open`

Observed behavior:

- `npm run typecheck` failed before the fresh build because `tsconfig.json` includes `.next/types/**/*.ts`.
- Missing route type files inside `.next/types` caused `TS6053` file-not-found errors.
- After a fresh `npm run build`, `npm run typecheck` passed.

Impact:

- Standalone `typecheck` is order-sensitive.
- CI or local verification can report false failures if `.next` is stale or partially generated.

Recommended later fix:

1. Decide whether `typecheck` should depend on a prior Next type-generation step.
2. Either document the required order or adjust the config/scripts so `tsc --noEmit` does not depend on stale `.next/types`.

### 4. Port collision on `3000`

Status: `Open`

Observed behavior:

- `next start` on port `3000` failed with `EADDRINUSE`.
- Another Node listener was already bound to `3000`.

Impact:

- Local production verification can accidentally probe the wrong process.
- This can create false confidence if route checks hit an already-running dev server instead of the fresh production build.

Workaround used:

- Verified the built artifact on port `3001` instead.

Recommended later fix:

1. Stop leftover dev/Next processes before verification.
2. Or standardize production verification on an isolated port such as `3001`.

## Historical Environment Issues Seen During Test Execution

### 5. Windows shell mismatch for bash-based scripts

Status: `Known`

Observed behavior:

- `npm run test:static` initially failed because `bash` was not available in the Windows environment.

Impact:

- Shell-based scripts are not portable as-is.

Recommended later fix:

- Prefer Node/PowerShell wrappers for repository verification scripts on Windows.

### 6. Local Supabase / Docker dependency

Status: `Known`

Observed behavior:

- Local Supabase-backed flows could not start when Docker Desktop was unavailable.

Impact:

- Some local DB-dependent tests and migrations cannot run in Docker-less environments.

Recommended later fix:

- Keep a documented remote-db fallback path or provide a non-Docker local database workflow.

### 7. OneDrive file-lock sensitivity around Prisma client generation

Status: `Known`

Observed behavior:

- A successful Prisma sync previously emitted an `EPERM unlink` warning against `.prisma/client`.

Impact:

- Prisma generation inside OneDrive-backed folders can be noisy or flaky.

Recommended later fix:

- Prefer running heavy Prisma generation outside synchronized directories when possible, or repeat generation after background file locks release.

## Repository Hygiene Notes

### 8. Mixed `tests/` and `Tests/` paths

Status: `Known`

Observed behavior:

- The workspace currently exposes both `tests` and `Tests` path variants in command output.
- On Windows this is especially easy to misread during Playwright/Vitest execution and file targeting.

Impact:

- Can confuse command targeting and report interpretation.

Recommended later fix:

1. Normalize to a single canonical test directory casing.
2. Remove or reconcile duplicate path references in scripts and documentation.

## Current Summary

Environment-only issues are no longer blocking a basic standalone production proof.

The remaining meaningful blockers are deployment/data alignment issues:

- unapplied Prisma migration
- live database schema drift
- order-sensitive pre-build typecheck behavior
