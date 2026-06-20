# Atelier V3 Build - Complete Structural Framework with Settings System

You are working on the existing Designers Hub / Atelier V3 build.

This is a Next.js 14 App Router community platform for creative/design professionals. The project already has a working backend, Supabase auth, onboarding, Prisma/Supabase persistence, hybrid static catalog fallback, dashboard, profile pages, search, explore, discipline hubs, post creation, uploads, comments, votes, accepted solution flow for help posts, and SSR thread pages.

**NEW: Comprehensive Settings system is now part of the foundation.**

Do not rebuild the app from scratch.
Do not import Forem, Discourse, NodeBB, or any large external forum framework.
Use Forem and Discourse only as conceptual references:

* Forem reference: creator profiles, posts, tags, discovery, community identity.
* Discourse reference: categories/spaces, threads, replies, solved/help flow, moderation boundaries.
  Apply only the minimum useful structure to the existing build.

Current important architecture to preserve:

* Next.js 14 App Router under `src/app`
* SSR-first pages with client-side islands
* business logic in `src/modules/*/server`
* thin API routes under `src/app/api`
* Prisma schema uses a single `Post` model for multiple post types
* Supabase auth and onboarding flow
* hybrid DB + static catalog fallback pattern
* canonical content route is `/thread/[slug]`
* post creation route is `/post/new`
* profile route is `/profile/[username]`
* edit profile route is `/profile/me/edit`
* dashboard route is `/dashboard`
* discovery routes are `/explore` and `/search`
* discipline routes are `/[discipline]`, `/[discipline]/discussions`, `/[discipline]/critique`, `/[discipline]/showcase`, `/[discipline]/help`, and `/[discipline]/resources`
* premium visual system in `src/app/v0-surfaces.css` and `src/components/v0/*`
* existing animations, theme, layout, and visual language
* **NEW: Settings system at `/settings/*` with profile-linked data persistence**

---

## NEW: Settings System Architecture

The Settings page system is fully designed and ready for integration into the existing Atelier backend.

### Settings Data Model

User settings are organized across 10 core sections with the following data structure:

```typescript
// Complete Settings Schema
interface UserSettings {
  // Profile Settings
  profile: {
    displayName: string;
    username: string;
    bio: string;
    avatarUrl: string;
    coverImageUrl: string;
    portfolioUrl: string;
    location: string;
    locationVisible: boolean;
    socialLinks: {
      twitter?: string;
      instagram?: string;
      behance?: string;
      linkedin?: string;
      dribbble?: string;
    };
  };

  // Creative Identity Settings
  identity: {
    primaryDiscipline: string; // From disciplines catalog
    secondaryDisciplines: string[]; // Multiple selections
    experienceLevel: 'student' | 'emerging' | 'intermediate' | 'advanced' | 'senior';
    softwareTools: string[]; // From software tools catalog
    skills: string[]; // Free-form tags
    acceptCritique: boolean;
    offerMentorship: boolean;
  };

  // Account & Security Settings
  account: {
    email: string; // Read-only in settings, managed separately
    password: string; // Write-only, change endpoint only
    twoFactorEnabled: boolean;
    activeSessions: Array<{
      id: string;
      device: string;
      lastActive: Date;
      ipAddress: string;
    }>;
    connectedAccounts: Array<{
      provider: 'github' | 'dribbble' | 'behance';
      connected: boolean;
      username?: string;
    }>;
  };

  // Notification Settings
  notifications: {
    emailNotifications: boolean;
    inAppNotifications: boolean;
    emailFrequency: 'realtime' | 'daily' | 'weekly';
    commentNotifications: boolean;
    newFollowerNotifications: boolean;
    newsAndFeatures: boolean;
  };

  // Privacy & Visibility Settings
  privacy: {
    profileVisibility: 'public' | 'unlisted' | 'private';
    onlineStatusVisible: boolean;
    activityVisible: boolean;
    messagePermissions: 'everyone' | 'followers' | 'none';
    searchVisible: boolean;
  };

  // Feed & Discovery Settings
  feed: {
    contentTypeFilters: Array<'critique' | 'showcase' | 'help' | 'discussion'>;
    disciplineFilters: string[];
    sortingPreference: 'recent' | 'trending' | 'most-helpful';
  };

  // Appearance Settings
  appearance: {
    theme: 'dark' | 'light' | 'auto';
    compactMode: boolean;
    fontSize: 'small' | 'normal' | 'large';
  };

  // Credits & Reputation Settings
  credits: {
    displayCredits: boolean;
    creditsGoal: number;
    reputationHistoryVisible: boolean;
    reputationGoal: number;
  };

  // Connections Settings
  connections: Array<{
    service: 'dribbble' | 'behance' | 'github' | 'portfolio';
    connected: boolean;
    username?: string;
    syncEnabled: boolean;
  }>;

  // Data & Export Settings
  data: {
    exportFrequency: 'manual' | 'monthly' | 'quarterly';
    exportFormat: 'json' | 'csv';
    lastExportDate?: Date;
    apiKeys: Array<{
      id: string;
      name: string;
      createdAt: Date;
      lastUsed?: Date;
    }>;
    accountDeletionRequested: boolean;
    accountDeletionDate?: Date; // 30-day recovery window
  };
}
```

### Settings Route Structure

```
/settings/                          # Settings shell with sidebar
├── layout.tsx                       # Shared layout with SettingsSidebar + SaveBar
├── page.tsx                         # Redirect to /settings/profile
├── profile/page.tsx                 # Profile display, bio, social links
├── identity/page.tsx                # Disciplines, experience, software, skills
├── account/page.tsx                 # Email, password, 2FA, sessions, connections
├── notifications/page.tsx           # Email/in-app notification preferences
├── privacy/page.tsx                 # Profile visibility, activity, search settings
├── feed/page.tsx                    # Content filters, discipline filters, sorting
├── appearance/page.tsx              # Theme, compact mode, font size
├── credits/page.tsx                 # Credits display, goals, reputation tracking
├── connections/page.tsx             # OAuth integrations, sync settings
└── data/page.tsx                    # Export, API keys, account deletion
```

### Disciplines & Software Taxonomy (From Atelier Catalog)

All dropdowns and multi-select fields pull from the existing Atelier taxonomy:

**Disciplines (Primary & Secondary):**
- Product Design
- UX/UI Design
- Illustration
- Branding
- Motion Design
- Photography
- 3D Design
- Web Design
- Interior Design
- Architecture
- Graphic Design
- Animation
- Interaction Design
- Design Systems
- Concept Art

**Software/Tools:**
- Figma
- Adobe XD
- Sketch
- Framer
- Webflow
- Adobe Photoshop
- Adobe Illustrator
- Adobe After Effects
- Blender
- Cinema 4D
- Spline
- Unreal Engine
- Unity
- InVision
- Protopie

**Experience Levels:**
- Student (Just starting)
- Emerging (0-2 years)
- Intermediate (2-5 years)
- Advanced (5-10 years)
- Senior (10+ years)

### API Endpoints Required

Add these endpoints to `src/app/api/settings/`:

```typescript
// GET /api/settings/profile
// Returns current user profile settings
// Protected by Supabase auth

// POST /api/settings/profile
// Updates profile settings (display name, bio, socials, portfolio, location)
// Payload: ProfileSettings
// Protected by Supabase auth

// POST /api/settings/identity
// Updates creative identity (disciplines, experience, software, skills)
// Payload: CreativeIdentitySettings
// Protected by Supabase auth

// POST /api/settings/account
// Only accepts: password change, 2FA toggle, session revoke
// Other account fields are read-only
// Protected by Supabase auth

// POST /api/settings/notifications
// Updates notification preferences
// Payload: NotificationSettings
// Protected by Supabase auth

// POST /api/settings/privacy
// Updates privacy and visibility settings
// Payload: PrivacySettings
// Protected by Supabase auth

// POST /api/settings/feed
// Updates feed preferences
// Payload: FeedSettings
// Protected by Supabase auth

// POST /api/settings/appearance
// Updates appearance preferences
// Payload: AppearanceSettings
// Protected by Supabase auth

// POST /api/settings/credits
// Updates credits and reputation display settings
// Payload: CreditsSettings
// Protected by Supabase auth

// POST /api/settings/connections
// Manages OAuth connections and sync settings
// Payload: ConnectionsSettings
// Protected by Supabase auth

// POST /api/settings/data
// Handles exports, API key management, account deletion
// Payload: DataSettings
// Protected by Supabase auth
```

### Service Layer (Preserve Existing Pattern)

Create `src/modules/settings/server/settings-service.ts`:

```typescript
// Apply all business logic here, not in route handlers
export async function getUserSettings(userId: string): Promise<UserSettings>;
export async function updateProfileSettings(userId: string, data: Partial<ProfileSettings>): Promise<void>;
export async function updateCreativeIdentity(userId: string, data: Partial<CreativeIdentitySettings>): Promise<void>;
export async function updateNotifications(userId: string, data: Partial<NotificationSettings>): Promise<void>;
export async function updatePrivacy(userId: string, data: Partial<PrivacySettings>): Promise<void>;
export async function updateFeedPreferences(userId: string, data: Partial<FeedSettings>): Promise<void>;
export async function updateAppearance(userId: string, data: Partial<AppearanceSettings>): Promise<void>;
export async function updateCreditsSettings(userId: string, data: Partial<CreditsSettings>): Promise<void>;
export async function updateConnections(userId: string, data: Partial<ConnectionsSettings>): Promise<void>;
export async function exportUserData(userId: string, format: 'json' | 'csv'): Promise<Buffer>;
export async function requestAccountDeletion(userId: string): Promise<{ deletionDate: Date }>;
export async function cancelAccountDeletion(userId: string): Promise<void>;
```

### Prisma Schema Extensions

Extend the existing Prisma schema with Settings data:

```prisma
model UserSettings {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Profile
  displayName     String?
  bio             String?
  avatarUrl       String?
  coverImageUrl   String?
  portfolioUrl    String?
  location        String?
  locationVisible Boolean  @default(true)
  socialLinks     Json     @default("{}")

  // Creative Identity
  primaryDiscipline        String?
  secondaryDisciplines     String[]  @default([])
  experienceLevel          String?
  softwareTools            String[]  @default([])
  skills                   String[]  @default([])
  acceptCritique           Boolean   @default(true)
  offerMentorship          Boolean   @default(false)

  // Notifications
  emailNotifications       Boolean   @default(true)
  inAppNotifications       Boolean   @default(true)
  emailFrequency           String    @default("daily")
  commentNotifications     Boolean   @default(true)
  newFollowerNotifications Boolean   @default(true)
  newsAndFeatures          Boolean   @default(true)

  // Privacy
  profileVisibility        String    @default("public")
  onlineStatusVisible      Boolean   @default(true)
  activityVisible          Boolean   @default(true)
  messagePermissions       String    @default("everyone")
  searchVisible            Boolean   @default(true)

  // Feed
  contentTypeFilters       String[]  @default([])
  disciplineFilters        String[]  @default([])
  sortingPreference        String    @default("recent")

  // Appearance
  theme                    String    @default("dark")
  compactMode              Boolean   @default(false)
  fontSize                 String    @default("normal")

  // Credits
  displayCredits           Boolean   @default(true)
  creditsGoal              Int       @default(100)
  reputationHistoryVisible Boolean   @default(true)
  reputationGoal           Int       @default(500)

  // Connections
  connections              Json      @default("[]")

  // Data & Export
  exportFrequency          String    @default("manual")
  exportFormat             String    @default("json")
  lastExportDate           DateTime?
  apiKeys                  Json      @default("[]")
  accountDeletionRequested Boolean   @default(false)
  accountDeletionDate      DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### UI Components (Ready to Use)

The following reusable components are built and styled for the Settings system:

```
src/components/settings/
├── SettingsSidebar.tsx          # Navigation sidebar with active state (200ms transition)
├── SaveBar.tsx                  # Persistent unsaved changes indicator (300ms slide-up)
├── SettingsSection.tsx          # Section heading with orange divider
├── SettingsRow.tsx              # Label + control layout with descriptions
├── SettingsInput.tsx            # Text input with counter, validation (150ms focus transition)
├── ToggleRow.tsx                # Toggle with description
├── ToggleSwitch.tsx             # Accessible toggle control (200ms slide + color)
├── PillButton.tsx               # Primary/secondary/ghost button variants (150ms hover, 100ms active)
└── ToastContainer.tsx           # Toast notifications (150ms fade + 200ms icon zoom)
```

All components:
- Follow existing Atelier design language (dark theme, orange accents)
- Use Tailwind CSS v4 with semantic design tokens
- Implement full accessibility (WCAG AA)
- Include animations per Atelier motion language (CSS transitions, respect prefers-reduced-motion)
- Are ready for integration with existing services

### Animations Applied

Per Atelier animation guidelines:

1. **Input Focus** (150ms) - Border color transition on focus
2. **Toggle Switch** (200ms) - Smooth slide + color change
3. **Button States** (150ms hover, 100ms active) - Opacity and scale feedback
4. **SaveBar** (300ms slide-up) - Entrance when changes detected
5. **Toast** (150ms fade + 200ms icon zoom) - Notification display
6. **Sidebar** (200ms) - Navigation highlight transition

All respect `prefers-reduced-motion` via Tailwind's automatic handling.

### Form State Management Pattern

Settings pages use React hooks for form state (no external form library):

```typescript
const [formData, setFormData] = useState<SettingsType>(initialData);
const [initialState, setInitialState] = useState<SettingsType>(initialData);
const isDirty = JSON.stringify(formData) !== JSON.stringify(initialState);

// On save, update initialState
// On discard, revert formData to initialState
// SaveBar only renders when isDirty === true
```

### Auth & Protected Routes

All `/settings/*` routes are protected:

```typescript
export const metadata = {
  title: 'Settings',
};

// Use existing Supabase middleware to redirect logged-out users to /login
// Verify user session before rendering page content
// Use same auth patterns as `/dashboard` and `/profile/me/edit`
```

### Navigation Integration

Add Settings link to main navigation:

- In `src/components/navigation/app-header.tsx`: Add gear icon link to `/settings`
- In `src/components/navigation/app-sidebar.tsx`: Add "Settings" link (discipline-aware if applicable)
- In user dropdown: Link to `/settings` or `/settings/profile`
- In `/profile/me/edit`: Add link to `/settings` for additional options

### Integration Checklist

- [ ] Extend Prisma schema with UserSettings model
- [ ] Create `src/modules/settings/server/settings-service.ts` with all 11 business logic functions
- [ ] Create API routes under `src/app/api/settings/` (11 endpoints)
- [ ] Add settings middleware to auth check
- [ ] Add Settings component files to `src/components/settings/`
- [ ] Add Settings pages to `src/app/settings/`
- [ ] Wire hooks to real service calls (currently use mock data)
- [ ] Test all form interactions and SaveBar behavior
- [ ] Verify toast notifications display on save/error
- [ ] Test sidebar navigation between sections
- [ ] Verify animations are smooth and accessible
- [ ] Test with `prefers-reduced-motion` enabled
- [ ] Add Settings links to main navigation
- [ ] Verify protected route redirects to login
- [ ] Test profile data sync (settings ↔ profile page)
- [ ] Run TypeScript checks
- [ ] Run lint
- [ ] Manual navigation testing (logged in and logged out)

---

## Original Build Tasks (Preserve These)

Main goal:
Complete the base structural framework and frontend accessibility of the platform without breaking existing backend logic or overbuilding unnecessary features.

Tasks:

1. Route and navigation audit
   Inspect the current `src/app` route tree and compare it with the navigation components:

* `src/components/navigation/app-header.tsx`
* `src/components/navigation/app-sidebar.tsx`
* `src/components/navigation/top-navigation.tsx`
* `src/components/ui-system/app-layout-shell.tsx`

Identify which implemented routes are not exposed clearly in the frontend navigation.

2. Fix primary navigation
   Update the app header/top navigation so users can reach the core product areas:

* Home `/`
* Explore `/explore`
* Search `/search`
* Create Post `/post/new`
* Dashboard `/dashboard`
* My Profile, resolved from the authenticated user where possible
* Edit Profile `/profile/me/edit`
* **Settings `/settings`** (NEW)
* Sign out `/auth/signout`

For logged-out users, expose:

* Login `/login` or `/auth/login`
* Signup `/signup` or `/auth/signup`
* Explore `/explore`
* Search `/search`

Do not add DMs, followers, marketplace, jobs, courses, or social-feed navigation.

3. Improve sidebar structure
   Update `app-sidebar.tsx` so it is community/product focused instead of architecture-biased.

The sidebar should expose existing implemented areas:

* Explore
* Search
* Create Post
* Dashboard
* **Settings** (NEW)
* Discipline spaces where available
* Discussions
* Critique
* Showcase
* Help
* Resources

If the current discipline context is known, make sidebar links discipline-aware.
If not known, link to general discovery/search pages or safe existing routes.
Do not break existing discipline pages.

4. Add only minimal route aliases if useful
   Do not create duplicate canonical content systems.

Allowed aliases:

* `/create` may redirect to `/post/new`
* `/me` may redirect to `/dashboard`
* `/settings` renders the Settings shell with sidebar navigation

Do not create `/topics/[id]` if `/thread/[slug]` already exists.
Do not create a separate forum thread system.
Do not replace `/thread/[slug]`.

5. Protected route behavior
   Verify that authenticated-only areas remain protected:

* `/dashboard`
* `/post/new`
* `/profile/me/edit`
* `/settings/*` (NEW)
* `/onboarding`

Use existing Supabase auth helpers and middleware patterns.
Do not invent a second auth system.

6. Preserve service-layer architecture
   If data changes are needed, start in the relevant service:

* posts: `src/modules/posts/server/post-service.ts`
* comments: `src/modules/comments/server/comment-service.ts`
* search: `src/modules/search/server/search-service.ts`
* profiles: `src/modules/profiles/server/profile-service.ts`
* **settings: `src/modules/settings/server/settings-service.ts`** (NEW)
* dashboard: `src/modules/dashboard/server/dashboard-service.ts`
* feed: `src/modules/feed/server/feed-service.ts`

Do not place business logic directly into route pages or visual components unless it is only presentation logic.

7. Preserve fallback behavior
   The app intentionally supports DB + static catalog fallback.
   Before changing feed, search, stats, comments, thread, or help-solution behavior, verify whether the path uses:

* Prisma/Supabase only
* static catalog only
* hybrid DB plus fallback

Do not remove fallback behavior unless explicitly required.

8. Do not implement these features now
   Do not add:

* direct messaging
* follower/following system
* notification backend
* admin dashboard
* moderation queue
* marketplace
* job board
* courses
* paid memberships
* realtime collaboration
* badges/achievements
* external search provider
* new database models unless strictly necessary

The current goal is base structure and access, not feature expansion.

9. Improve empty states and route affordances
   Where pages already exist but feel disconnected, add clear CTAs:

* from dashboard to create post
* from profile to edit profile
* from profile/edit to settings
* from explore/search to open threads
* from discipline hubs to create relevant post type
* from empty result states to search or create post
* from settings to profile editing

Use existing components from:

* `src/components/ui`
* `src/components/forum`
* `src/components/v0`
* `src/components/ui-system`
* `src/components/settings` (NEW)

Preserve the existing premium dark/editorial design language.

10. Testing and validation
    After changes:

* run TypeScript checks
* run lint if configured
* run relevant unit tests if available
* manually verify route navigation does not 404
* manually verify all Settings page sections load
* manually verify Settings form interactions and SaveBar behavior
* verified logged-out and logged-in navigation states
* verify canonical thread links still point to `/thread/[slug]`
* verify post creation still uses `/post/new`
* verify dashboard/profile routes still load
* verify fallback rendering still works where applicable
* verify animations are smooth and accessible
* test with `prefers-reduced-motion` enabled

11. Final Codex output required
    After implementation, provide:

* changed files list
* route map before/after
* navigation links added or changed
* any redirects/aliases added
* protected route behavior confirmed
* Settings integration status (full/partial)
* tests/checks run
* remaining TODOs
* risks or areas intentionally not touched

Important:
Keep this as a structural cleanup sprint.
Do not overdeliver.
Do not redesign the product.
Do not replace existing architecture.
Do not remove premium v0 surfaces.
Do not convert SSR pages into full client-rendered pages unless absolutely necessary.
Integrate Settings without breaking existing profile/auth flows.
