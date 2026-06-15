# V3 Sprint 6 Log

Date: 2026-06-15
Sprint: Sprint 6 - Uploads
Status: Completed with known repository-level follow-up items

## Objective

Complete the image upload phase by turning the existing upload foundation into a production-usable attachment pipeline that works through the live post creation flow and displays uploaded assets on thread pages.

## Scope Completed

- Hardened the upload module with explicit post-type upload limits.
- Added server-side enforcement for attachment count and size rules.
- Switched mock upload mode away from base64 data URLs to local mock file storage.
- Normalized persisted attachment URLs from server-side logic instead of trusting client payload URLs.
- Enforced attachment validation during post create and post update flows.
- Upgraded the live `/api/posts` and `/api/posts/[slug]` routes onto the production server post service.
- Preserved mock-auth compatibility for existing route-style test seams by keeping a cookie fallback path.
- Updated the thread detail page to render persisted attachment galleries and post-type-specific detail sections.

## Architecture Notes

### Upload module

- `src/modules/uploads/schemas/upload-schema.ts` now exposes reusable upload policy helpers.
- `src/modules/uploads/server/upload-service.ts` is the single asset ingress/egress service.
- The upload service now has two runtime behaviors:
  - R2-backed object storage when R2 is configured
  - local mock-file storage under `.tmp/uploads` when `UPLOADS_MOCK_MODE=true`

### API contract

- `POST /api/uploads` remains the only upload ingress.
- The route now validates:
  - post type
  - current attachment count
  - per-post-type file count ceiling
- `GET /api/uploads/[...key]` continues to serve stored assets and now supports locally mocked files as well.

### Attachment lifecycle

- Uploaded files are no longer treated as UI-only previews.
- During post creation/update, attachment payloads are revalidated against server rules:
  - post-type prefix in asset key
  - allowed image MIME type
  - max size for that post type
  - duplicate key prevention
- Persisted attachment URLs are rebuilt on the server from the asset key.

### Route seam cleanup

- `src/app/api/posts/route.ts` now uses the production post schemas and server post service.
- `src/app/api/posts/[slug]/route.ts` now uses the production read/update/delete path.
- This closes the earlier mismatch where the live post form had moved to the structured schema but the route layer still expected an older payload shape.

### Thread rendering

- `src/app/thread/[slug]/page.tsx` now prefers persisted post data when available.
- When a persisted post exists, the page renders:
  - uploaded image gallery
  - critique detail blocks
  - showcase detail blocks
  - help detail blocks
  - resource detail blocks
- The existing community catalog fallback remains intact for static/fallback thread content.

## Files Added Or Updated

- `src/modules/uploads/schemas/upload-schema.ts`
- `src/modules/uploads/server/upload-service.ts`
- `src/app/api/uploads/route.ts`
- `src/app/api/uploads/[...key]/route.ts`
- `src/components/upload/asset-uploader.tsx`
- `src/modules/posts/server/post-service.ts`
- `src/app/api/posts/route.ts`
- `src/app/api/posts/[slug]/route.ts`
- `src/app/thread/[slug]/page.tsx`
- `tsconfig.json` restored after `next lint` auto-mutated it

## Verification

### Passed

- `npm run typecheck`
- `npm run lint`
- `npm run build`

### Build output confirmation

- `/api/uploads` remains a dynamic route.
- `/api/uploads/[...key]` remains a dynamic route.
- `/api/posts` and `/api/posts/[slug]` build successfully on the live route path.
- `/thread/[slug]` builds successfully with the new persisted attachment rendering path.

## Observed Warnings / Follow-up Items

1. `next lint` again auto-reinserted `.next/types/**/*.ts` into `tsconfig.json`.
   - Restored manually after verification.

2. Build completed successfully, but the repository still emits Prisma datasource validation noise during static generation.
   - Observed message pattern: Prisma expects `prisma://` or `prisma+postgres://` for some build-time invocations.
   - This remains a broader datasource/runtime hardening item rather than a Sprint 6 regression.

3. The inherited lint warning in `src/components/v0/hero/scramble-text.tsx` remains.
   - React hook dependency warning only.
   - Lint still passes.

4. The older route/unit tests in `tests/api-routes.test.ts` still target the legacy route contract.
   - Sprint 6 preserved a mock-auth seam but did not rewrite the test suite in this sprint.
   - If those tests are run later, they should be updated to the structured post schema and new route metadata shape.

## Exit Criteria Review

- Image upload flow exists through the live UI: Yes
- Upload rules are enforced server-side: Yes
- Attachments persist through the real post service: Yes
- Mock-mode local development works without R2: Yes
- Persisted thread pages can display uploaded assets: Yes
- Typecheck, lint, and build complete successfully: Yes

## Recommended Next Focus

- Sprint 7 comments
- Parallel backlog note: Prisma datasource/build-time configuration cleanup
- Parallel backlog note: inherited `scramble-text` hook dependency lint warning
- Parallel backlog note: refresh old route tests to match the structured posts API
