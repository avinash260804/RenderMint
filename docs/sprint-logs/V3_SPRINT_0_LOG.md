# V3 Sprint 0: Schema Drift Fix & Migration Sync

Date: `2026-06-15`

## Objective

Resolve the Prisma/live-database drift that was surfacing as:

```text
The column tags.usage_count does not exist in the current database.
```

and bring `prisma migrate status` back to a clean state before any V3 UI wiring begins.

## Context Read Before Coding

- `AGENTS.md`
- `C:\Users\aviro\Downloads\IMPLEMENTATION_PLAN_V3.md`
- `docs/plans/ITERATION_BUILD_LOG_TEMPLATE.md`
- `docs/sprint-logs/PRODUCTION_BUILD_VERIFICATION.md`
- `docs/sprint-logs/PRODUCTION_QUALITY_TEST_AUDIT_LOG.md`
- `C:\Users\aviro\Downloads\atelier-design-template.md`

Note:

- `ATELIER_PRODUCT_PRINCIPLES.md` was not present in the repo root or Downloads at implementation time.
- `IMPLEMENTATION_PLAN_V3.md` was not present in the repo root, so the sprint used the user-provided copy from Downloads.

## Scope Completed

- Compared the Prisma schema against the live database with `prisma db pull --print`.
- Confirmed `tags.usage_count` was not the only drifted field.
- Synced the live database to the current Prisma schema contract.
- Applied the previously pending RLS migration plus a new schema-drift sync migration.
- Corrected the production `/api/tags` route to use the real server tag service instead of the legacy test-compat facade.
- Updated seed behavior so the drifted fields stay coherent on future reseeds.

## Drift Findings

`prisma db pull --print` showed the live database was missing these schema fields:

- `profiles.onboarded`
- `profiles.discipline_id`
- `tags.usage_count`
- `tags.discipline_id`
- `votes.direction`

This mattered for two reasons:

1. `tags.usage_count` caused production build/runtime Prisma errors whenever a query loaded full `Tag` records through post/tag relations.
2. Several of the other missing fields are still part of the current schema and are referenced by existing code and test contracts, so leaving them absent would keep the schema and database in an unstable partially-synced state.

## Files Added

- `prisma/migrations/20260615_sprint0_schema_drift_sync/migration.sql`
- `V3_SPRINT_0_LOG.md`

## Files Modified

- `prisma/seed.js`
- `src/app/api/tags/route.ts`
- `src/modules/tags/server/tag-service.ts`

## Database Changes

- migration created: `yes`
- schema changed: `no` (schema already declared the missing fields; the database was behind it)
- seed changed: `yes`
- RLS changed: `indirectly applied` via the already-pending `20260614_rls_policy_hardening` migration

## Migration Details

New migration:

- adds `profiles.onboarded`
- adds `profiles.discipline_id` with FK to `disciplines`
- adds `tags.usage_count`
- adds `tags.discipline_id` with FK to `disciplines`
- adds `votes.direction`
- backfills `profiles.discipline_id` from `primary_discipline`
- backfills `profiles.onboarded` from existing username/discipline/software completion state
- backfills `tags.usage_count` from `post_tags`
- backfills `tags.discipline_id` only when a tag belongs to a single discipline
- backfills `votes.direction` from `vote_type`

## Architecture Notes

- The Sprint 0 fix kept the canonical Prisma schema intact and brought the live database up to it, rather than weakening the schema to match a drifted DB.
- `/api/tags` now resolves through `src/modules/tags/server/tag-service.ts`, which is the real production server layer.
- Tag reads now return real database-backed `usageCount` values through the production API.
- The tag service continues to avoid any `community-data.ts` dependency and computes popularity from persisted `post_tags`.

## Verification Run

Commands executed:

```powershell
npx.cmd prisma validate
npx.cmd prisma db pull --print --schema prisma/schema.prisma
npx.cmd prisma migrate deploy --schema prisma/schema.prisma
npx.cmd prisma generate
npx.cmd prisma migrate status --schema prisma/schema.prisma
npm.cmd run lint
npm.cmd run build
npm.cmd run typecheck
npx.cmd vitest run tests/integration/integration.test.ts
npm.cmd run start -- -p 3002
```

Production API probe:

```text
GET /api/tags?popular=true&limit=5
GET /api/tags?q=pre&limit=5
```

## Verification Result

- `npx prisma validate`: passed
- `npx prisma migrate deploy`: passed
- `npx prisma migrate status`: `Database schema is up to date!`
- `npx prisma generate`: passed
- `npm run lint`: passed
- `npm run build`: passed
- `npm run typecheck`: passed after build
- Production build no longer emitted the previous Prisma `tags.usage_count` runtime errors during static generation
- Production tag API returned real database-backed values:

```text
POPULAR=[{"id":5,"name":"Presentation","slug":"presentation","usageCount":5}, ...]
SEARCH=[{"id":5,"name":"Presentation","slug":"presentation","usageCount":5}]
```

## Relevant Test Follow-up

Targeted integration coverage was run, but three failures remain and appear to be pre-existing test-contract issues rather than Sprint 0 regressions:

- `INT-08` and `INT-09` create `help` posts without the required `issue_description` and `software_id`, which now correctly fail the DB check constraint `chk_posts_help_required_fields`.
- `INT-13` inserts a tag without a required `slug`, which correctly fails the database null constraint on `tags.slug`.

Observed integration result:

```text
17 passed
3 failed
```

These failures should be treated as test-fixture updates for a later test-contract cleanup sprint, not as schema-drift failures.

## Issues Encountered

- `ATELIER_PRODUCT_PRINCIPLES.md` was not available locally, so it could not be reread directly for this sprint.
- `IMPLEMENTATION_PLAN_V3.md` was not present in the repo root and had to be read from Downloads.
- Temporary production probe logs (`next-start-s0.*.log`) remained file-locked by another local process after verification and were left out of the sprint source changes on purpose.

## Resolution

- Live database drift is now resolved for the current schema contract.
- Prisma migrations are fully applied and status is clean.
- Production build is clean with respect to the original `usage_count` runtime error.
- Tag read paths now use the correct production server module.

## Status

`completed with follow-up`

## Follow-up

- Normalize the missing local docs by adding `ATELIER_PRODUCT_PRINCIPLES.md` and `IMPLEMENTATION_PLAN_V3.md` to the repo root.
- Clean up the remaining targeted integration tests so their fixtures respect current DB constraints.
- Next sprint remains `Sprint 1: Repo Import Prep & v0 UI Audit`, but stop here until explicitly requested.
