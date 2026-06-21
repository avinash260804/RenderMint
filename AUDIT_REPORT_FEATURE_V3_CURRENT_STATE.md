# RenderMint Audit Report

Prepared on June 21, 2026 for branch `feature/v3-current-state`.

## Scope

This report consolidates all findings gathered across Groups A–H during the repository audit. It is based on the previously reviewed project areas and the directly inspected configuration/tooling files in this branch.

## Severity Summary

| Severity | Count |
|---|---:|
| Critical | 13 |
| High | 29 |
| Medium | 33 |
| Low | 12 |
| **Total** | **87** |

## Group Summary

| Group | Critical | High | Medium | Low | Total |
|---|---:|---:|---:|---:|---:|
| A — Infrastructure | 1 | 0 | 5 | 4 | 10 |
| B — API Routes | 3 | 4 | 5 | 0 | 12 |
| C — Services | 2 | 4 | 3 | 2 | 11 |
| D — Schemas | 1 | 4 | 4 | 1 | 10 |
| E — Frontend | 1 | 4 | 4 | 1 | 10 |
| F — Auth & Onboarding | 2 | 5 | 3 | 1 | 11 |
| G — Lib Utilities | 1 | 4 | 4 | 1 | 10 |
| H — Config & Tooling | 2 | 4 | 5 | 2 | 13 |
| **Total** | **13** | **29** | **33** | **12** | **87** |

## Immediate Actions

1. Rotate the exposed Supabase/PostgreSQL database password immediately.
2. Remove the committed database credentials from `.env.example` and replace with placeholders.
3. Fix the CSP in `middleware.ts` by removing insecure `unsafe-inline` / `unsafe-eval` in production.
4. Remove committed binaries and runtime log files from the repository and purge them from history if needed.
5. Consolidate duplicate error handling utilities and standardize canonical imports.

## Critical Findings

### H-01 — `.env.example` exposes live database credentials
- Real PostgreSQL connection strings and plaintext password are committed in `.env.example`.
- Impact: anyone with repo access can attempt direct DB connection.
- Action: rotate credentials immediately and replace values with placeholders.

### H-02 — CSP nullified by `unsafe-inline` and `unsafe-eval`
- `middleware.ts` uses `script-src 'self' 'unsafe-eval' 'unsafe-inline'`.
- Impact: CSP does not meaningfully protect against XSS in production.
- Action: switch to nonce-based CSP or strict production-only policy.

### G-01 — Duplicate `AppError` classes
- `src/lib/handle-error.ts` and `src/lib/errors.ts` define separate `AppError` implementations.
- Impact: `instanceof` checks can silently fail and return incorrect HTTP statuses.
- Action: delete legacy duplicate and migrate all imports to one canonical module.

## High Findings

### G-02 — `sanitizeHtml` does not enforce safe `rel` for external links
- `target="_blank"` links are allowed without forcing `rel="noopener noreferrer"`.
- Impact: reverse-tabnabbing risk.
- Action: add a DOMPurify hook to enforce secure rel attributes.

### G-03 — In-memory rate-limit store leaks entries
- `memoryStore` entries are never evicted.
- Impact: unbounded memory growth on long-lived processes.
- Action: add periodic cleanup or use an LRU cache.

### G-04 — DB availability result cached forever
- `canAttemptDatabaseQuery()` caches one result permanently.
- Impact: transient DB failures can become permanent app-level failures until restart.
- Action: add TTL-based re-check logic.

### G-05 — R2 client recreated on every call
- `getR2Client()` creates a new `S3Client` per invocation.
- Impact: connection pool inefficiency and possible FD exhaustion under load.
- Action: use a singleton/global cached client.

### H-03 — CSP `connect-src` missing external endpoints
- Current `connect-src` only includes Supabase origins.
- Impact: browser may block R2/CDN/Upstash requests.
- Action: add all required outbound origins.

### H-04 — Committed Windows binary
- `cloudflared-windows-amd64.exe` is committed to the repo.
- Impact: history bloat and supply-chain risk.
- Action: remove file and purge from history.

### H-05 — Runtime log files committed
- `debug.log`, `next-start*.log`, `next-dev*.log` are tracked.
- Impact: leaks internal runtime details and creates noisy diffs.
- Action: remove tracked logs and expand `.gitignore`.

### H-06 — Package identity mismatch
- `package.json` name is `designers-hub` while project branding is `RenderMint`.
- Impact: inconsistent project identity across tooling and runtime globals.
- Action: rename package and related global keys.

## Medium Findings

### G-06 — Slug fallback uses timestamp
- After many collisions, slugs fall back to `Date.now()`.
- Impact: ugly, irreversible URLs.
- Action: use a short random suffix instead.

### G-07 — Partial R2 config silently falls back to mock mode
- R2 env vars are optional and production misconfig may go unnoticed.
- Impact: uploads can silently run in mock mode.
- Action: warn or fail in production on partial config.

### G-08 — `window.setTimeout` in toast utility
- Uses `window.setTimeout` directly in client utility.
- Impact: brittle in SSR/test environments.
- Action: use global `setTimeout`.

### G-09 — Mock community catalog shipped from lib
- Hardcoded community posts are in `src/lib/community/catalog.ts`.
- Impact: test/demo data can leak into production experience.
- Action: move fixtures to mocks or tests-only usage.

### H-07 — Missing `images.remotePatterns`
- External image hosts are not configured in Next.js.
- Impact: runtime failures when using `<Image>` with remote sources.
- Action: add remote patterns for Supabase/R2/CDN domains.

### H-08 — Tests excluded from TS checking
- `tsconfig.json` excludes test files.
- Impact: broken test code can pass `typecheck`.
- Action: add dedicated `tsconfig.test.json` and validate in CI.

### H-09 — Mixed `tests/` and `Tests/`
- Vitest includes both lowercase and uppercase test dirs.
- Impact: inconsistent discovery on case-sensitive CI systems.
- Action: standardize casing.

### H-10 — `.env.test` is gitignored
- Playwright loads `.env.test`, but `.gitignore` excludes it.
- Impact: CI lacks a documented test env contract.
- Action: add `.env.test.example` and CI validation.

### H-11 — Tailwind content paths too narrow
- `tailwind.config.ts` omits some possible source locations.
- Impact: utility classes may be purged in production.
- Action: expand content globs to cover all relevant source files.

## Low Findings

### G-10 — Auth + onboarding require sequential round-trips
- `requireAuth()` and `requireOnboarded()` split common auth flow into two sequential checks.
- Impact: mild latency overhead.
- Action: optionally consolidate for hot paths.

### H-12 — Root directory cluttered with planning/debug markdown files
- Multiple internal logs and planning docs are stored at repo root.
- Impact: poor repo hygiene and accidental leakage of internal notes.
- Action: move to `docs/` or remove debug-only files.

### H-13 — Minimal ESLint setup
- ESLint config only extends Next defaults.
- Impact: missed warnings for unused vars and explicit `any`.
- Action: add stricter TypeScript/quality rules.

## Notes

- This file is a consolidated audit summary, not the full verbatim working notes from each intermediate review step.
- If needed, the next step can be a second markdown report organized strictly by priority, owner, and estimated fix effort.
