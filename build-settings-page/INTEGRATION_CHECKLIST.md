# Atelier Settings - Integration Checklist

Use this checklist to track the steps needed to integrate the Settings page with the real Atelier backend.

## Phase 1: Database Setup

- [ ] Read `prisma/schema.prisma` to understand Profile model
- [ ] Create migration files for new Profile fields (see `INTEGRATION_GUIDE.md` for schema)
- [ ] Apply migrations: `npx prisma migrate dev --name add_settings_fields`
- [ ] Update Prisma client: `npx prisma generate`
- [ ] Verify RLS policies in `supabase/migrations/` for new fields
- [ ] Test database read/write with new fields

## Phase 2: API Infrastructure

- [ ] Create `/src/app/api/settings/` directory structure
- [ ] Create `/src/app/api/account/` directory structure
- [ ] Create `/src/app/api/data/` directory structure
- [ ] Implement error handling in each route (use `src/lib/api/handle-error.ts` pattern)
- [ ] Add rate limiting to sensitive endpoints (use `@upstash/ratelimit`)
- [ ] Add input validation with Zod schemas
- [ ] Test each endpoint with `curl` or Postman

## Phase 3: Service Layer

- [ ] Create `src/modules/settings/server/settings-service.ts`
- [ ] Create `src/modules/settings/schemas/settings-schema.ts`
- [ ] Create `src/modules/settings/__tests__/settings-service.test.ts`
- [ ] Implement all settings update functions (notifications, privacy, appearance, feed, connections)
- [ ] Implement account functions (password, 2FA, email, delete)
- [ ] Implement data export function
- [ ] Ensure all functions include soft-delete logic where needed
- [ ] Run tests: `npm test -- settings-service`

## Phase 4: Authentication & Authorization

- [ ] Review middleware.ts to ensure `/settings/*` routes are protected
- [ ] Test that non-authenticated users are redirected to `/auth/login`
- [ ] Test that only own profile can be modified (no cross-user modification)
- [ ] Verify session tokens are properly validated on all sensitive endpoints
- [ ] Test logout behavior (sessions cleared from cache)

## Phase 5: Real Data Integration

### Update `hooks/useProfile.ts`

- [ ] Replace mock profile data fetch with real API call to `/api/profiles/me`
- [ ] Add error handling for profile fetch failures
- [ ] Add loading skeleton state while fetching
- [ ] Cache profile data with SWR or React Query
- [ ] Handle session expiration gracefully

### Update `hooks/useDisciplines.ts`

- [ ] Replace mock disciplines fetch with real API call
- [ ] Replace mock software fetch with real API call
- [ ] Filter disciplines/software based on user preferences if available
- [ ] Add loading states

### Update `lib/api-client.ts`

- [ ] Replace all mock API calls with real fetch implementations
- [ ] Use correct HTTP methods (GET, POST, PATCH, DELETE)
- [ ] Add proper headers (Content-Type, authorization if needed)
- [ ] Parse and type response payloads
- [ ] Handle errors with consistent error format
- [ ] Add retry logic for failed requests

## Phase 6: Component Integration

### Profile Page (`app/settings/profile/page.tsx`)

- [ ] Verify form populates with real user data
- [ ] Test form submission calls correct API endpoint
- [ ] Verify success toast appears after save
- [ ] Test error handling with invalid data
- [ ] Test character counters with real limits
- [ ] Test avatar URL field with real image URLs

### Creative Identity Page (`app/settings/identity/page.tsx`)

- [ ] Verify disciplines dropdown shows real options
- [ ] Verify software checkboxes show real options
- [ ] Test form with real user profile data
- [ ] Test multi-select for secondary disciplines
- [ ] Test saving skill tags
- [ ] Verify soft-delete of removed skills

### Account & Security Page (`app/settings/account/page.tsx`)

- [ ] Test password change flow (redirect after)
- [ ] Test 2FA enable/disable with real Supabase MFA
- [ ] Test active sessions display
- [ ] Test session revocation
- [ ] Test email change flow (verification email)

### Other Pages

- [ ] Notifications: Verify email preferences save
- [ ] Privacy: Verify visibility settings persist
- [ ] Feed: Verify filter preferences apply to actual feed
- [ ] Appearance: Verify theme saves and persists
- [ ] Credits: Verify reputation display is accurate
- [ ] Connections: Verify OAuth connections work
- [ ] Data: Verify export generates correct file

## Phase 7: Testing

### Unit Tests

- [ ] Settings service tests pass
- [ ] Settings schema validation tests pass
- [ ] Settings API route tests pass

### Integration Tests

- [ ] Profile fetch → update → verify cycle works end-to-end
- [ ] Settings changes reflected on dashboard/profile pages
- [ ] Cross-tab updates sync (if using SWR)
- [ ] Session expiration handled gracefully
- [ ] Rate limiting triggers correctly on sensitive endpoints

### E2E Tests

- [ ] User can login and navigate to settings
- [ ] User can update each settings section
- [ ] Changes persist across page reloads
- [ ] User can logout from settings
- [ ] Mobile responsive layout works
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility

## Phase 8: Performance

- [ ] Profile data loads in < 500ms
- [ ] Settings pages render in < 1000ms
- [ ] Form interactions respond instantly (< 100ms)
- [ ] API responses < 500ms average
- [ ] No layout shifts (CLS < 0.1)
- [ ] Core Web Vitals all green

## Phase 9: Security

- [ ] No sensitive data in console logs
- [ ] CSRF protection on state-changing endpoints
- [ ] Input sanitization on all fields (use `isomorphic-dompurify`)
- [ ] Password fields never logged or stored in localStorage
- [ ] 2FA secret encrypted at rest
- [ ] Rate limiting prevents brute force attacks
- [ ] Soft-delete prevents hard deletion of user data
- [ ] Account deletion is reversible in first 30 days

## Phase 10: Documentation & Deployment

- [ ] API documentation updated with new endpoints
- [ ] Developer README updated with new flows
- [ ] Settings service added to architecture docs
- [ ] Data schema diagram updated
- [ ] Environment variables documented (if any new ones added)
- [ ] Deployment checklist reviewed
- [ ] Staging environment tested
- [ ] Production rollout plan created
- [ ] Monitoring/logging configured
- [ ] Support documentation written

## Phase 11: User Feedback

- [ ] Internal testing with team
- [ ] Beta testing with select users
- [ ] Gather feedback on UX/flows
- [ ] Fix critical issues
- [ ] Update documentation based on feedback
- [ ] Plan next iteration based on usage data

## Testing Commands Reference

```bash
# Run all tests
npm test

# Run specific test file
npm test -- settings-service

# Run e2e tests (if using Playwright)
npm run test:e2e

# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Start production build locally
npm start

# Database commands
npx prisma migrate dev          # Create and apply migration
npx prisma migrate reset        # Reset to seed (dev only)
npx prisma studio              # Open database GUI
```

## Rollback Plan

If integration fails or causes issues:

1. Revert database migrations: `npx prisma migrate resolve --rolled-back [migration_name]`
2. Revert API routes: Delete `/src/app/api/settings/`, `/src/app/api/account/`, `/src/app/api/data/`
3. Revert settings pages: Delete `/src/app/settings/` (keep reference in docs)
4. Revert profile page to previous `/profile/me/edit`
5. Clear cache and restart services

## Success Criteria

✓ All settings pages load and display user data
✓ All CRUD operations work end-to-end
✓ No errors in console or server logs
✓ Performance meets targets
✓ Security checklist passed
✓ Tests passing at >80% coverage
✓ User feedback is positive
✓ Analytics show settings are being used

## Contacts & Resources

- **Team**: [Your team slack channel]
- **Docs**: See `INTEGRATION_GUIDE.md` and `PROJECT_REFERENCE.md`
- **Architecture**: Review provided `ARCHITECTURE.md`, `AI_HANDOFF.md`, `PROJECT_STATE.md`
- **Database**: See `prisma/schema.prisma` and `supabase/migrations/`
- **Tests**: See `Tests/` and `src/__tests__/` directories

## Timeline Estimate

- Phase 1-2 (Database & API): 2-3 days
- Phase 3 (Services): 1-2 days
- Phase 4-5 (Auth & Data): 2-3 days
- Phase 6 (Component Integration): 2-3 days
- Phase 7-8 (Testing & Performance): 2-3 days
- Phase 9-10 (Security & Deployment): 1-2 days
- Phase 11 (User Feedback): Ongoing

**Total: 12-18 days** (assuming parallel work on multiple phases)
