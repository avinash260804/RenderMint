# ATELIER SETTINGS PAGE - AI HANDOFF PROMPT

## Project Context

You are implementing the **Settings Page** for Atelier, a design-community platform built on Next.js 14 App Router. This is NOT a standalone project—it integrates into an existing Atelier backend with:

- Supabase auth and persistence
- Prisma domain-service architecture
- Hybrid DB + static catalog fallback pattern
- Premium visual system via v0-surfaces.css and imported components
- GSAP-driven hero/premium motion + lighter community page interactions

**Critical:** Do NOT rebuild from scratch. Integrate into existing patterns.

---

## Settings Page Architecture

### Route Structure
```
/settings - Settings shell (authenticated only)
├── /settings/profile - Profile & social information
├── /settings/identity - Creative discipline & skills  
├── /settings/account - Account security & sessions
├── /settings/notifications - Email/in-app notification prefs
├── /settings/privacy - Profile visibility & permissions
├── /settings/feed - Content filtering & curation
├── /settings/appearance - Theme, compact mode, font size
├── /settings/credits - Credit/reputation tracking
├── /settings/connections - OAuth integrations
└── /settings/data - Export & account deletion
```

### Data Model Integration Points

#### Profile Settings (Section 1)
- **Source:** `src/modules/profiles/server/profile-service.ts`
- **Fields:**
  - `displayName` (string, max 50 chars, with counter)
  - `username` (string, lowercase, alphanumeric + underscore)
  - `bio` (string, max 300 chars, with counter)
  - `avatarUrl` (upload widget to R2)
  - `coverImageUrl` (upload widget to R2)
  - `portfolioUrl` (validated URL)
  - `location` (string, max 50 chars)
  - `locationVisible` (boolean toggle)
  - `socialLinks` object:
    - `twitter` (username, no @)
    - `instagram` (username)
    - `behance` (username)
    - `linkedin` (username)
    - `dribbble` (username)

**API Endpoint:** `PATCH /api/settings/profile`
**Payload:** `{ displayName, username, bio, portfolioUrl, location, locationVisible, socialLinks }`

---

#### Creative Identity (Section 2)
- **Source:** `src/modules/profiles/server/profile-service.ts` + discipline taxonomy
- **Fields:**
  - `primaryDiscipline` (enum from `src/lib/community/catalog.ts` DISCIPLINE_LIST)
  - `secondaryDisciplines` (array of discipline strings, max 3)
  - `experienceLevel` (enum: "student", "junior", "mid", "senior", "director", "partner")
  - `softwareTools` (array of software names from SOFTWARE_CATALOG, max 10)
  - `skills` (array of skill tags, user-entered, max 10)
  - `acceptCritique` (boolean toggle)
  - `offerMentorship` (boolean toggle)

**Real Discipline List** (from catalog):
```
Architecture, Branding, Illustration, Industrial Design, Interior Design,
Landscape Architecture, Motion Graphics, Product Design, Typography,
UI Design, UX Design, Web Design, 3D Rendering, Photography, ...
```

**Real Software Tools** (sample):
```
Figma, Adobe XD, Sketch, Adobe Illustrator, Adobe Photoshop, Cinema 4D,
Blender, 3ds Max, V-Ray, Lumion, Enscape, Twinmotion, Unreal Engine,
Blender, After Effects, Premiere, ...
```

**API Endpoint:** `PATCH /api/settings/identity`
**Payload:** `{ primaryDiscipline, secondaryDisciplines, experienceLevel, softwareTools, skills, acceptCritique, offerMentorship }`

---

#### Account & Security (Section 3)
- **Source:** `src/modules/auth/server/auth-service.ts`
- **Fields:**
  - `email` (read-only display, with "Change" button)
  - `password` (button to open modal for change)
  - `twoFactorEnabled` (boolean toggle with setup/disable flow)
  - `activeSessions` (array of sessions with device info, revoke button)
  - `connectedAccounts` (OAuth apps: Google, GitHub, Discord - with disconnect)
  - `accountDeletion` (button with 30-day recovery warning)

**Sub-flows:**
- Change password: modal form with current + new password fields
- Enable 2FA: modal with TOTP QR code display + backup codes
- Active sessions: list loaded from service, revoke endpoint
- Connected accounts: read list from auth provider links
- Delete account: requires password confirmation, soft-delete with 30-day recovery window

**API Endpoints:**
- `POST /api/settings/password-change` - Change password
- `POST /api/settings/2fa-enable` - Request 2FA setup (returns QR + backup codes)
- `POST /api/settings/2fa-disable` - Disable 2FA
- `POST /api/settings/sessions/revoke` - Revoke a session by ID
- `POST /api/settings/account-delete` - Soft-delete user account

---

#### Notifications (Section 4)
- **Source:** `src/modules/profiles/server/profile-service.ts` (new notification_preferences field)
- **Fields:**
  - `emailNotificationsEnabled` (boolean toggle)
  - `inAppNotificationsEnabled` (boolean toggle)
  - `emailFrequency` (enum: "realtime", "daily", "weekly")
  - `commentNotifications` (boolean)
  - `followerNotifications` (boolean)
  - `newsAndFeatures` (boolean)

**API Endpoint:** `PATCH /api/settings/notifications`
**Payload:** `{ emailNotificationsEnabled, inAppNotificationsEnabled, emailFrequency, commentNotifications, followerNotifications, newsAndFeatures }`

---

#### Privacy & Visibility (Section 5)
- **Source:** `src/modules/profiles/server/profile-service.ts`
- **Fields:**
  - `profileVisibility` (enum: "public", "unlisted", "private")
  - `onlineStatusVisible` (boolean toggle)
  - `activityVisible` (boolean toggle)
  - `messagePermission` (enum: "anyone", "followers", "nobody")
  - `searchIndexable` (boolean toggle)

**API Endpoint:** `PATCH /api/settings/privacy`
**Payload:** `{ profileVisibility, onlineStatusVisible, activityVisible, messagePermission, searchIndexable }`

---

#### Feed & Discovery (Section 6)
- **Source:** `src/modules/feed/server/feed-service.ts`
- **Fields:**
  - `contentTypeFilters` (array of post types: "critique", "showcase", "help", "discussion", "resource")
  - `disciplineFilters` (array of selected disciplines)
  - `feedSort` (enum: "recent", "trending", "popular")
  - `customFeed` (boolean - personalized vs. community)

**API Endpoint:** `PATCH /api/settings/feed-preferences`
**Payload:** `{ contentTypeFilters, disciplineFilters, feedSort, customFeed }`

---

#### Appearance (Section 7)
- **Source:** `src/modules/profiles/server/profile-service.ts`
- **Fields:**
  - `theme` (enum: "dark", "light", "auto")
  - `compactMode` (boolean toggle)
  - `fontSize` (enum: "small", "normal", "large")
  - `reduceMotion` (boolean toggle - respects OS `prefers-reduced-motion`)

**API Endpoint:** `PATCH /api/settings/appearance`
**Payload:** `{ theme, compactMode, fontSize, reduceMotion }`

**Motion Implementation:**
When `reduceMotion` is enabled:
- Add `data-reduce-motion="true"` to `<html>` element
- Apply CSS rule:
```css
[data-reduce-motion="true"] * {
  transition-duration: 0.01ms !important;
  animation-duration: 0.01ms !important;
}
```
- Respect OS `prefers-reduced-motion` media query by default

---

#### Credits & Reputation (Section 8)
- **Source:** `src/modules/reputation/server/reputation-service.ts`
- **Fields:**
  - `creditsEarned` (read-only number)
  - `creditsGoal` (number input with slider)
  - `reputationLevel` (read-only display with badge)
  - `reputationGoal` (number input with slider)
  - `achievementBadges` (array display - locked/unlocked)

**API Endpoint:** `PATCH /api/settings/reputation-goals`
**Payload:** `{ creditsGoal, reputationGoal }`

---

#### Connections (Section 9)
- **Source:** `src/modules/auth/server/auth-service.ts`
- **Fields:**
  - `dribbbleConnected` (boolean with connect/disconnect buttons)
  - `behanceConnected` (boolean with connect/disconnect buttons)
  - `githubConnected` (boolean with connect/disconnect buttons)
  - `portfolioUrl` (string field for portfolio link)
  - `autoSyncEnabled` (boolean toggle)

**API Endpoints:**
- `POST /api/settings/connections/dribbble-connect` - Initiate OAuth flow
- `POST /api/settings/connections/dribbble-disconnect` - Remove connection
- `POST /api/settings/connections/sync` - Manual sync trigger
- Similar for behance, github

---

#### Data & Export (Section 10)
- **Source:** `src/modules/profiles/server/profile-service.ts`
- **Fields:**
  - `exportAllData` (button - triggers JSON export download)
  - `exportFormat` (enum: "json", "csv")
  - `apiKeys` (array with revoke/regenerate buttons)
  - `activityLogDownload` (button)
  - `accountDeletion` (button - 30 day recovery)

**API Endpoints:**
- `GET /api/settings/export` - Initiate export
- `POST /api/settings/api-key/generate` - Create new API key
- `POST /api/settings/api-key/revoke` - Revoke key by ID
- `GET /api/settings/activity-log/export` - Download activity CSV

---

## UI Components Required

### Reusable Component Library

1. **SettingSection** (container with orange title + border)
   - `title` (required, string - uppercase mono)
   - `description` (optional, string)
   - `children` (ReactNode)

2. **SettingRow** (label + control layout)
   - `label` (required, string - uppercase mono, ~48px column)
   - `description` (optional, string - help text)
   - `error` (optional, string - error state)
   - `children` (required, ReactNode - control)

3. **ToggleSwitch** (accessible switch)
   - `checked` (boolean)
   - `onChange` (callback)
   - `aria-label` (required)
   - Fully keyboard accessible with `role="switch"` and `aria-checked`

4. **SettingsInput** (text input with optional counter)
   - `label` (required)
   - `value` (string)
   - `onChange` (callback)
   - `maxLength` (optional)
   - `type` (optional: "text", "email", "url", "password")
   - `error` (optional string)
   - Character counter if `maxLength` provided

5. **PillButton** (primary/secondary/ghost button)
   - `variant` (enum: "primary", "secondary", "ghost")
   - `size` (enum: "sm", "md", "lg")
   - `onClick` (callback)
   - `disabled` (optional boolean)
   - Mono uppercase text

6. **SettingsSidebar** (vertical navigation)
   - List of 10 sections with icons
   - Active section highlighted with orange accent
   - Desktop-only (hidden on mobile)

7. **SaveBar** (persistent bottom bar)
   - Shows when form has unsaved changes
   - "⚠ UNSAVED CHANGES" label
   - "DISCARD" and "SAVE" buttons
   - Only renders when `isDirty === true`
   - `z-index: 40` to stay above content

8. **ToastContainer** (notification toasts)
   - Auto-dismiss after 3 seconds
   - Success (green) and error (orange) variants
   - Bottom-right corner placement

---

## Design System & Animations

### Colors (Atelier Dark Theme)
```
--background: #0a0a0a       (near-black)
--foreground: #f5f5f5       (light gray)
--card: #1a1a1a             (dark gray)
--accent: #ff6b35           (Atelier orange)
--border: #2a2a2a           (subtle gray)
--muted: #404040            (medium gray)
--muted-foreground: #999999 (muted text)
```

### Typography
- **Headings:** `font-mono` uppercase, bold, tracking-wider
- **Labels:** `font-mono` text-xs uppercase
- **Body:** `font-sans` regular weight
- **Emphasis:** Orange `--accent` color

### Layout
- **Desktop:** 220px sidebar + main content (flexbox)
- **Mobile:** Full-width, horizontal tab navigation
- **Spacing:** Generous (gap-6 between sections)
- **Inputs:** Border-radius 4px, subtle gray borders

### Animation & Motion

#### Light Motion Language (Community Pages)
These are the standard transitions for settings form interactions:

1. **Form Input Interaction**
   - `transition: border-color 0.15s ease`
   - `transition-all duration-150` (Tailwind)
   - Fast focus/blur response

2. **Toggle/Button Interaction**
   - `transition-all duration-200`
   - Smooth scale on active state
   - Hover state: opacity fade

3. **SaveBar Appearance**
   - Slide up from bottom
   - Duration: 300ms
   - Easing: `ease-out`
   - Backdrop blur effect on background

4. **Toast Notification**
   - Fade in: 150ms
   - Fade out (after 3s): 300ms
   - Slide in from bottom-right: 200ms
   - Easing: `ease-out`

#### Respect Reduce Motion Setting
When `data-reduce-motion="true"`:
- ALL transitions/animations reduced to `0.01ms`
- Instant state changes (no smoothing)
- GSAP or Framer Motion should check `window.matchMedia('(prefers-reduced-motion: reduce)')`
- User preference overrides all motion

#### Motion NOT Required
- Hero animations (those are landing/premium surfaces)
- Complex Framer Motion choreography
- Stagger/sequence animations
- Heavy GSAP scene transitions

**Only implement:** Form interactions, button/toggle feedback, SaveBar slide, toast fade.

---

## Form State Management

### Dirty State Detection
```typescript
const isDirty = useMemo(() => {
  return JSON.stringify(formData) !== JSON.stringify(initialState)
}, [formData, initialState])
```

### Save/Discard Pattern
- **Save:** POST/PATCH to API endpoint → on success, update `initialState` + show toast
- **Discard:** Reset `formData` to `initialState`, hide SaveBar
- **Error:** Show error toast, keep SaveBar visible for retry

### Validation
- Character counters (live, no submit blocking)
- Email/URL validation via regex or native `<input type="email">`
- Required fields: mark with red border on submit attempt
- Error messages displayed below field in orange

---

## Protected Routes & Auth

### Settings Shell Protection
- Route `/settings` requires authenticated user
- Use existing Supabase auth helpers: `requireAuth` middleware
- Redirect to `/auth/login` if unauthenticated
- All API endpoints require valid session

### File Structure Pattern
```
src/app/settings/
├── layout.tsx                    (authenticated shell)
├── page.tsx                      (redirect to /profile)
├── profile/
│   └── page.tsx                  (ProfileSettings component)
├── identity/
│   └── page.tsx                  (IdentitySettings component)
├── account/
│   └── page.tsx                  (AccountSettings component)
... (8 more sections)
```

### Service Layer Integration
```
src/modules/settings/
├── server/
│   ├── settings-service.ts       (all business logic)
│   ├── settings-schema.ts        (Zod schemas for validation)
│   └── settings-queries.ts       (read-only helpers)
└── index.ts
```

---

## API Route Pattern

Each endpoint should follow the Atelier service pattern:

```typescript
// src/app/api/settings/[section]/route.ts
import { requireAuth } from '@/lib/auth'
import { settingsService } from '@/modules/settings/server'
import { settingSchema } from '@/modules/settings/server/settings-schema'

export async function PATCH(req: Request) {
  const session = await requireAuth(req)
  const body = await req.json()
  
  const parsed = settingSchema.parse(body)
  const result = await settingsService.updateSettings(session.userId, parsed)
  
  return Response.json({ success: true, data: result })
}
```

---

## Testing Checklist

After implementation, verify:

- [ ] All 10 settings pages load without errors
- [ ] Form inputs update state correctly
- [ ] SaveBar appears/disappears based on `isDirty`
- [ ] Save button calls correct API endpoint
- [ ] Discard button resets form to initial state
- [ ] Toast notifications appear on success/error
- [ ] Character counters work and enforce max length
- [ ] Toggle switches are keyboard accessible
- [ ] Sidebar navigation highlights active section
- [ ] Mobile responsive (sidebar hidden, full-width content)
- [ ] `reduceMotion` setting disables all animations
- [ ] Protected routes redirect unauthenticated users
- [ ] All API endpoints return correct data shape
- [ ] Error states display properly
- [ ] TypeScript strict mode passes
- [ ] No console errors in browser

---

## Known Constraints

1. **Do NOT break existing:**
   - Profile pages at `/profile/[username]` and `/profile/me/edit`
   - Auth flow at `/auth/login` and `/auth/signup`
   - Dashboard at `/dashboard`
   - Any existing route under `/[discipline]`

2. **Use existing services where possible:**
   - Don't duplicate logic from `src/modules/profiles/server`
   - Reuse auth helpers from `src/lib/auth`
   - Follow soft-delete pattern if removing settings data

3. **Preserve premium visual system:**
   - Do NOT rewrite `src/app/v0-surfaces.css`
   - Settings pages should use imported v0 components where applicable
   - Keep editorial/dark design language consistent

4. **Respect fallback patterns:**
   - If settings service needs to read static data (disciplines, software), use `src/lib/community/catalog.ts`

---

## File Deliverables

After implementation, provide:

1. **Changed/Created Files List**
   - New route files in `src/app/settings/*`
   - New service files in `src/modules/settings/`
   - New component files in `src/components/settings/`

2. **API Routes Created**
   - List all new `POST`, `PATCH`, `GET` endpoints
   - Input/output schemas for each

3. **Component Inventory**
   - All reusable components with props interface
   - Import paths

4. **Database Schema Changes**
   - New Prisma model fields (if any)
   - Migration file (if any)

5. **Protected Routes Confirmed**
   - Verify auth middleware applied
   - Test redirect flow

6. **Test Results**
   - All checklist items verified
   - Screenshots of each settings section
   - Mobile/desktop responsive verification

---

## Summary

You are implementing a complete **Settings** interface that:

- ✓ Integrates with existing Atelier backend services
- ✓ Uses domain-service architecture pattern
- ✓ Respects auth, fallback, and SSR patterns
- ✓ Follows Atelier dark theme with orange accents
- ✓ Implements light motion language (form interactions only)
- ✓ Supports reduce-motion accessibility setting
- ✓ Includes 10 distinct sections, 8 UI components, 11 API routes
- ✓ Maintains existing navigation, auth, and product structure

Do NOT overdeliver. Do NOT redesign Atelier. Do NOT add features beyond the 10 sections listed.

This is a structural completion sprint, not a feature expansion.

---

**Ready to implement. Submit codex when complete.**
