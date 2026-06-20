# Atelier Settings Page - Integration Guide

This document describes how to integrate the Settings page with the real Atelier backend based on the architecture provided in `ARCHITECTURE.md`, `AI_HANDOFF.md`, and `PROJECT_STATE.md`.

## Current Architecture

The Settings page is built as a **standalone, self-contained UI layer** following Atelier's patterns:
- Client components with form state management
- Integration hooks for data fetching (`useProfile`, `useDisciplines`, `useSoftware`)
- Mock API client (`lib/api-client.ts`) with documented integration points
- Matching the dark theme and typography of the main Atelier platform

## Integration Steps

### 1. Connect Authentication Session

**Location:** All settings pages require user authentication.

**Integration point:** Middleware and auth helpers should protect `/settings/*` routes.

```typescript
// In middleware.ts or auth.ts, ensure:
- Session is verified for all /settings/* routes
- User ID is available in request context
- Redirect to /auth/login if not authenticated
```

**Reference from project:**
- `src/lib/auth/require-auth.ts` - Auth requirement helpers
- `middleware.ts` - Route protection patterns

### 2. Fetch Real Profile Data

**Current mock location:** `hooks/useProfile.ts`

**Replace with:**

```typescript
// Connect to existing profile-service
import { getProfile } from '@/modules/profiles/server/profile-service'

// In useProfile hook:
useEffect(() => {
  async function fetchProfile() {
    const profile = await getProfile(userId) // from session
    setProfile(profile)
  }
  fetchProfile()
}, [userId])
```

**Reference from project:**
- `src/modules/profiles/server/profile-service.ts` - Profile queries
- `src/modules/profiles/server/profile-page-service.ts` - Page-specific shaping
- `src/app/profile/[username]/page.tsx` - Server component pattern

### 3. Fetch Real Disciplines and Software

**Current mock location:** `hooks/useDisciplines.ts`

**Replace with:**

```typescript
// Connect to database queries
import { prisma } from '@/server/db/client'

// In useDisciplines hook:
useEffect(() => {
  async function fetchDisciplines() {
    const disciplines = await prisma.discipline.findMany({
      select: { id: true, name: true, slug: true }
    })
    setDisciplines(disciplines)
  }
  fetchDisciplines()
}, [])
```

**Database references:**
- `Discipline` model stores available disciplines
- `Software` model stores available tools
- `ProfileSoftware` junction table links profiles to their tools

**Reference from project:**
- `src/modules/posts/server/post-service.ts` - Example of fetching related data
- `prisma/schema.prisma` - Database relationships

### 4. Integrate Profile Update APIs

**Current mock location:** `lib/api-client.ts`

**Replace implementations with real API routes:**

```typescript
// settingsApi.updateProfile() should call:
// POST /api/profiles/me with PATCH body

// In src/app/api/profiles/me/route.ts:
export async function PATCH(request: Request) {
  const session = await getSession()
  const body = await request.json()
  
  const updated = await updateProfile(session.user.id, body)
  return Response.json({ success: true, data: updated })
}
```

**Reference from project:**
- `src/app/api/profiles/[username]/route.ts` - Profile endpoint patterns
- `src/modules/profiles/server/profile-service.ts` - Update operations
- `src/modules/auth/server/require-auth.ts` - Session validation

### 5. Create Settings-Specific API Routes

**Needed routes (following domain-service pattern):**

```
/api/settings/notifications  - POST (update notification preferences)
/api/settings/privacy        - POST (update privacy settings)
/api/settings/appearance     - POST (update theme/display)
/api/settings/feed           - POST (update feed filters)
/api/settings/connections    - POST (manage connected accounts)
/api/account/password        - POST (change password)
/api/account/2fa/enable      - POST (enable two-factor)
/api/account/2fa/disable     - POST (disable two-factor)
/api/data/export             - POST (export user data)
/api/account/delete          - POST (delete account)
```

**Implementation template:**

```typescript
// src/app/api/settings/[section]/route.ts
import { getSession } from '@/lib/auth/session'
import { settingsService } from '@/modules/settings/server/settings-service'
import { settingsUpdateSchema } from '@/modules/settings/schemas/settings-schema'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await request.json()
  const validated = settingsUpdateSchema.parse(body)
  
  const result = await settingsService.updateSettings(session.user.id, validated)
  return Response.json({ success: true, data: result })
}
```

**Reference from project:**
- `src/app/api/posts/route.ts` - Route handler patterns
- `src/modules/posts/schemas/post-creation-schema.ts` - Schema patterns
- `src/lib/api/handle-error.ts` - Error handling

### 6. Create Settings Service Module

**Location:** `src/modules/settings/server/settings-service.ts`

**Template:**

```typescript
import { prisma } from '@/server/db/client'
import type { Profile } from '@prisma/client'

export async function updateNotifications(
  userId: string,
  data: NotificationSettings
): Promise<Profile> {
  return prisma.profile.update({
    where: { id: userId },
    data: {
      notifications_email_enabled: data.emailEnabled,
      notifications_inapp_enabled: data.inAppEnabled,
      // ... other fields
    }
  })
}

export async function enable2FA(userId: string): Promise<string> {
  // Generate and return secret for TOTP setup
  // Follow Supabase MFA integration patterns
}
```

**Reference from project:**
- `src/modules/profiles/server/profile-service.ts` - Update pattern
- `src/modules/comments/server/comment-service.ts` - Nested operations
- `src/modules/votes/server/vote-service.ts` - Reputation calculations

### 7. Update Database Schema

**Needed Profile table additions:**

```prisma
model Profile {
  // ... existing fields
  
  // Notification preferences
  notifications_email_enabled     Boolean @default(true)
  notifications_inapp_enabled     Boolean @default(true)
  notifications_email_frequency   String  @default("daily")
  
  // Privacy settings
  profile_visibility              String  @default("public")
  online_status_visible           Boolean @default(false)
  activity_visible                Boolean @default(true)
  
  // Appearance settings
  theme_preference                 String  @default("dark")
  compact_mode                     Boolean @default(false)
  font_size                        String  @default("normal")
  
  // Reputation/Credits
  credits_displayed                Boolean @default(true)
  reputation_goal                  Int?
  
  // Account settings
  two_factor_enabled               Boolean @default(false)
  two_factor_secret_encrypted      String?
  
  updated_at                       DateTime @updatedAt
}
```

**Reference from project:**
- `prisma/schema.prisma` - Current schema
- `supabase/migrations/` - RLS policy patterns

### 8. Wire Toast Notifications

**Current:** Already using custom toast context from `lib/toast.tsx`

**Connection:** Routes should return consistent success/error payloads for UI to handle:

```typescript
// API response format
{
  success: true,
  data: { /* updated fields */ },
  message?: "Profile updated successfully"
}
```

### 9. Add Tests

**Test structure (following project pattern):**

```
src/modules/settings/__tests__/
├── settings-service.test.ts
├── settings-schema.test.ts
└── settings-routes.test.ts

src/app/settings/__tests__/
└── settings-pages.test.ts
```

**Reference from project:**
- `src/__tests__/` - Component test patterns
- `src/modules/**/__tests__/` - Service test patterns
- `Tests/` - Integration test scripts

### 10. Update Middleware

**Add route protection for settings:**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const isSettings = request.nextUrl.pathname.startsWith('/settings')
  const hasSession = request.cookies.has('sb-auth-token')
  
  if (isSettings && !hasSession) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: ['/settings/:path*', '/dashboard', '/onboarding']
}
```

**Reference from project:**
- `middleware.ts` - Current patterns
- `src/lib/auth/require-auth.ts` - Helpers

## Feature-by-Feature Integration Map

| Setting Page | Service | API Route | Database |
|---|---|---|---|
| Profile | profile-service | PATCH /api/profiles/me | Profile |
| Creative Identity | profile-service | PATCH /api/profiles/me | Profile, ProfileSoftware |
| Account & Security | auth-service | POST /api/account/* | Profile, Auth session |
| Notifications | settings-service | POST /api/settings/notifications | Profile |
| Privacy | settings-service | POST /api/settings/privacy | Profile |
| Feed | feed-service | POST /api/settings/feed | Profile preferences |
| Appearance | settings-service | POST /api/settings/appearance | Profile |
| Credits | reputation-service | GET + POST | Profile, Post, Comment, Vote |
| Connections | auth-service | POST /api/settings/connections | Profile, OAuth tokens |
| Data & Export | export-service | POST /api/data/* | All user tables |

## Deployment Checklist

- [ ] Database migrations applied for new Profile fields
- [ ] All API routes implemented and tested
- [ ] Service modules created for each settings domain
- [ ] Authentication middleware protects /settings/* routes
- [ ] Toast notifications properly connected to API responses
- [ ] Error handling follows project patterns
- [ ] Rate limiting applied to sensitive endpoints
- [ ] Input validation with Zod schemas
- [ ] Soft-delete patterns applied where needed
- [ ] RLS policies defined in Supabase (see prisma/RLS.md)
- [ ] Tests written and passing
- [ ] Environment variables documented

## Notes

1. **Fallback Layer:** The Atelier project uses a hybrid DB + catalog fallback. Settings should NOT use the fallback layer—they are user-specific and require real authentication.

2. **Soft Deletes:** If implementing account deletion, follow the soft-delete extension pattern from `src/server/db/soft-delete.ts`.

3. **Rate Limiting:** Sensitive operations (password change, account deletion) should use rate limiting from `@upstash/ratelimit`.

4. **Sanitization:** Profile text fields should be sanitized with `isomorphic-dompurify` before saving.

5. **Session Management:** Use the Supabase SSR pattern already established in the project—don't create a new session system.

6. **Testing:** Follow the test patterns in `Tests/` and `src/__tests__/` rather than creating new test approaches.
