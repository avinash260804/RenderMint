# Atelier Frontend-Only Base UI Implementation Plan

**File purpose:** This file defines how Atelier can adopt **Reshaped** as the base UI system and use **Atlantis by Jobber** as a reference/pattern library after the product structure and framework are ready.

**Project context:** Atelier is a creative-professional community platform with forum discussions, critique posts, discipline hubs, profile surfaces, dashboard surfaces, onboarding, search, uploads, and future settings/admin areas. The aim is to make the interface consistent, premium, structured, and scalable without breaking existing product logic.

**Strict rule:** This plan is **frontend-only**. Do not touch backend systems, database schema, Prisma models, Supabase policies, authentication logic, API behavior, storage logic, or server-side data contracts unless a separate backend task is explicitly created later.

---

## 1. Core Decision

Use the systems in this hierarchy:

```txt
Reshaped = installed base UI system
Atelier = final brand/product layer
Atlantis = reference/pattern inspiration
Tailwind = supporting layout utility only
Custom CSS = rare brand-specific polish only
```

### Why this approach

Reshaped provides the actual foundation: components, layout primitives, theming, color modes, design tokens, spacing, typography, radius, shadows, provider setup, and Next.js integration.

Atlantis is useful, but it should not become a second installed design system unless there is a very specific future reason. It is Jobber's product system and has its own component, design, and hook packages. Using it directly beside Reshaped can create visual inconsistency and dependency complexity.

### Final intended result

After this implementation, Atelier should feel:

- more coherent across all pages;
- less generic and less cluttered;
- more premium and creative-professional;
- easier for Codex to modify safely;
- easier to expand with settings, admin, critique tools, and future notification surfaces;
- more accessible by default through consistent primitives;
- stable because backend contracts are preserved.

---

## 2. Absolute Scope Boundaries

## 2.1 Allowed changes

These changes are allowed:

```txt
/components/**
/src/components/**
/src/ui/**
/app/**/page.tsx
/app/**/layout.tsx
/app/**/loading.tsx
/app/**/error.tsx
/app/**/not-found.tsx
/styles/**
/app/globals.css
/tailwind.config.*
/postcss.config.*
/next.config.* only for Reshaped transpilation/package optimization
/package.json only for frontend UI dependency installation
/docs/**
```

Allowed work includes:

- adding Reshaped provider;
- adding a UI wrapper layer;
- replacing visual primitives;
- improving layout, spacing, typography, cards, empty states, and form presentation;
- creating frontend-only settings/admin placeholders if routes already support them or if they are purely static UI shells;
- adding UI documentation;
- adding visual QA checklists;
- adding Storybook or isolated component previews only if the project already uses it or if it can be added without backend impact.

## 2.2 Forbidden changes

Do **not** change:

```txt
/prisma/schema.prisma
/prisma/migrations/**
/supabase/**
/lib/supabase/** unless it is only imported unchanged
/lib/db/**
/server/**
/api/** backend behavior
/app/api/** backend behavior
/middleware.ts auth/security behavior unless only styling-neutral redirect bugs are documented, not changed
.env files
RLS policies
storage bucket rules
auth callback logic
upload validation logic
vote/comment/post mutation logic
accepted-solution logic
search backend logic
```

Do **not**:

- rename database models;
- alter table fields;
- introduce new server actions for UI alone;
- change data-fetching logic unless the existing UI component only receives the same props differently;
- replace Supabase auth logic;
- modify Prisma client behavior;
- create new RLS policies;
- add new backend notification systems;
- add agent workers, queues, cron jobs, or infrastructure services.

## 2.3 Read-only backend rule

Codex may read backend-related files only to understand existing props, routes, and data contracts.

Codex must not edit them.

If Codex discovers a backend issue, it should document it in:

```txt
docs/BACKEND_ISSUES_DO_NOT_TOUCH.md
```

and continue the frontend-only work.

---

## 3. Implementation Strategy

The system should be introduced in layers:

```txt
Layer 1: Project structure and information architecture
Layer 2: Reshaped provider and theme baseline
Layer 3: Atelier wrapper components
Layer 4: Domain components for forum, critique, profile, dashboard
Layer 5: Page-by-page migration
Layer 6: Atlantis-inspired pattern refinement
Layer 7: Visual QA and documentation
```

Do not migrate random pages first. The structure and framework should be created before adapting Reshaped and Atlantis.

---

# 4. Reshaped Adoption Plan

## 4.1 Role of Reshaped

Reshaped should be the **base UI grammar** for Atelier.

It should control:

- base components;
- spacing rhythm;
- typography primitives;
- color tokens;
- light/dark mode support;
- radius and shadows;
- layout utilities;
- accessible overlays;
- form structure;
- feedback states;
- page density consistency.

It should **not** control:

- Atelier's brand story;
- creative-community identity;
- critique-specific interaction model;
- reputation system meaning;
- visual hierarchy between forum and critique spaces;
- final logo/brand expression;
- editorial landing page art direction.

---

## 4.2 Reshaped setup tasks

### Task R1: Install Reshaped

```bash
npm install reshaped
```

### Task R2: Configure PostCSS

```js
// postcss.config.js
import { config } from "reshaped/config/postcss";

export default config;
```

### Task R3: Configure Next.js package handling

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["reshaped"],
  experimental: {
    optimizePackageImports: ["reshaped"],
  },
};

export default nextConfig;
```

If an existing `next.config.*` already has settings, merge this carefully. Do not delete existing settings.

### Task R4: Add the provider

Create:

```txt
src/components/providers/ReshapedProvider.tsx
```

Example:

```tsx
"use client";

import type { ReactNode } from "react";
import { Reshaped } from "reshaped";
import "reshaped/themes/slate/theme.css";

export function ReshapedProvider({ children }: { children: ReactNode }) {
  return (
    <Reshaped theme="slate" defaultColorMode="dark">
      {children}
    </Reshaped>
  );
}
```

### Task R5: Wrap the existing app without disturbing other providers

In `app/layout.tsx`, keep existing providers and add Reshaped around the frontend tree.

Preferred structure:

```tsx
<html lang="en" data-rs-theme="slate" data-rs-color-mode="dark">
  <body>
    <ExistingProviders>
      <ReshapedProvider>{children}</ReshapedProvider>
    </ExistingProviders>
  </body>
</html>
```

If existing providers depend on theme context, adjust the order carefully and document the decision.

---

## 4.3 Reshaped components to adopt directly

Use these components as raw building blocks inside Atelier wrappers.

## A. Foundation and layout

| Reshaped component | Atelier use | Local wrapper / usage |
|---|---|---|
| `Reshaped` | Global provider for theme, focus, notifications | `ReshapedProvider` |
| `Theme` | Scoped theme or color mode areas | `ThemedSection` |
| `View` | Flex layout, padding, gap, alignment | Used heavily inside wrappers |
| `Container` | Page max-width and responsive content shell | `PageContainer` |
| `Grid` | Feed layouts, dashboard panels, hub cards | `ContentGrid` |
| `Hidden` | Responsive visibility | `ResponsiveOnly` |
| `HiddenVisually` | Accessibility text | Use directly inside accessible components |
| `Divider` | Section separation | `AtelierDivider` |
| `ScrollArea` | Long panels, sidebars, critique comment panels | `PanelScrollArea` |
| `Resizable` | Future critique workspace panels | Later only |

### Atelier application

Use these to standardize:

- page container widths;
- forum feed spacing;
- critique layout columns;
- dashboard cards;
- profile sections;
- admin list shells;
- responsive mobile/desktop switching.

---

## B. Typography and media

| Reshaped component | Atelier use | Local wrapper / usage |
|---|---|---|
| `Text` | All headings/body labels/metadata | `AtelierText`, `PageTitle`, `MetaText` |
| `Image` | Post thumbnails, critique assets, profile imagery | `AtelierImage` |
| `Avatar` | User identity, comments, profile cards | `UserAvatar` |
| `Icon` | Icon rendering normalization | `AtelierIcon` |

### Atelier application

Use these to define:

- editorial home page hierarchy;
- forum title and metadata styles;
- critique post title and requested-feedback areas;
- profile identity blocks;
- dashboard section labels;
- admin status labels.

---

## C. Actions and navigation

| Reshaped component | Atelier use | Local wrapper / usage |
|---|---|---|
| `Button` | Primary, secondary, ghost, destructive actions | `AtelierButton` |
| `Link` | Internal and inline navigation | `AtelierLink` |
| `Actionable` | Custom clickable cards/rows | `ClickableCard`, `ActionRow` |
| `Tabs` | Feed filters, profile tabs, settings tabs | `AtelierTabs` |
| `Breadcrumbs` | Discipline/thread navigation | `AtelierBreadcrumbs` |
| `DropdownMenu` | Post actions, profile menu, filters | `AtelierDropdown` |
| `ContextMenu` | Optional advanced post/editor actions | Later only |
| `MenuItem` | Menu item consistency | Internal to dropdown wrappers |
| `ToggleButton` | View mode, save state, filter chips | `AtelierToggleButton` |
| `ToggleButtonGroup` | Feed display modes, critique filters | `AtelierToggleGroup` |
| `Pagination` | Forum search results, admin lists | `AtelierPagination` |

### Atelier application

Use these to improve:

- post card actions;
- create-post navigation;
- discipline hub tabs;
- thread filtering;
- profile sections;
- settings navigation;
- admin list navigation.

---

## D. Forms and creation flows

| Reshaped component | Atelier use | Local wrapper / usage |
|---|---|---|
| `TextField` | Titles, profile fields, search input | `AtelierTextField` |
| `TextArea` | Post body, critique context, comments | `AtelierTextArea` |
| `Select` | Discipline, post type, filters | `AtelierSelect` |
| `Autocomplete` | Tags, disciplines, users later | `AtelierAutocomplete` |
| `Checkbox` | Preferences, checklist options | `AtelierCheckbox` |
| `Radio` | Post type selection, visibility options | `AtelierRadioGroup` |
| `Switch` | Settings preferences | `AtelierSwitch` |
| `NumberField` | Limited use: numeric settings/admin inputs | Later only |
| `Slider` | Future critique quality/priority filters | Later only |
| `PinField` | Avoid unless OTP flow exists | Not now |
| `FileUpload` | Critique uploads, profile image, attachments | `AtelierFileUpload` |
| `FormControl` | Field label/helper/error standardization | Used inside all form wrappers |
| `HiddenInput` | Custom selection patterns | Use only when needed |

### Atelier application

Use these to rebuild:

- create discussion flow;
- create critique flow;
- comment composer;
- profile editing UI;
- settings forms;
- search/filter bars;
- admin moderation forms.

Important: only replace the frontend presentation. Keep the same form submission handlers, server actions, API calls, and validation contracts.

---

## E. Feedback, status, and loading

| Reshaped component | Atelier use | Local wrapper / usage |
|---|---|---|
| `Alert` | Errors, notices, moderation warnings | `AtelierAlert` |
| `Badge` | Post type, status, discipline, reputation | `AtelierBadge` |
| `Toast` | Save/publish/vote feedback | `AtelierToast` |
| `Loader` | Inline loading | `AtelierLoader` |
| `Skeleton` | Feed loading, profile loading, thread loading | `AtelierSkeleton` |
| `ProgressBar` | Upload progress, completion status | `UploadProgress` |
| `ProgressIndicator` | Create-post step flow | `CreateFlowProgress` |

### Atelier application

Use these for:

- critique status: `Open`, `Needs feedback`, `Revised`, `Resolved`;
- help post status: `Unanswered`, `Answered`, `Solved`;
- admin status: `Reported`, `Hidden`, `Reviewed`;
- dashboard loading states;
- publish feedback;
- upload feedback.

---

## F. Overlay and disclosure components

| Reshaped component | Atelier use | Local wrapper / usage |
|---|---|---|
| `Modal` | Confirm actions, create-post help, edit dialogs | `AtelierModal` |
| `Popover` | Rich filters, quick actions, metadata | `AtelierPopover` |
| `Tooltip` | Icon explanations and low-risk hints | `AtelierTooltip` |
| `Flyout` | Mobile filters, side panels | `AtelierFlyout` |
| `Accordion` | Settings sections, help sections, FAQ | `AtelierAccordion` |
| `Dismissible` | Temporary notices | `DismissibleNotice` |
| `Overlay` | Modal/flyout backgrounds | Internal |
| `TrapFocus` | Custom modal focus if needed | Rare direct use |

### Atelier application

Use these to improve:

- create-post help panels;
- filter popovers;
- moderation confirmation;
- profile edit modals;
- mobile side filters;
- onboarding hints.

---

## G. Data and utility components

| Reshaped component | Atelier use | Local wrapper / usage |
|---|---|---|
| `Table` | Admin lists, user lists, report lists | `AtelierTable` |
| `Calendar` | Avoid unless scheduling exists | Not now |
| `Carousel` | Featured critiques/resources on landing | Later, selective |
| `ProgressIndicator` | Multi-step create flow | `CreateFlowProgress` |
| `classNames` | Safer class merging | Use where needed |
| `useTheme` | Theme toggle/settings if needed | Later |
| `useToggle` | UI state toggles | Use where helpful |
| `useHotkeys` | Future command palette/editor shortcuts | Later only |
| `useKeyboardArrowNavigation` | Custom menus/lists if needed | Later only |
| `useOnClickOutside` | Custom overlays | Rare; prefer provided overlays |
| `useScrollLock` | Custom mobile/flyout scroll lock | Rare; prefer provided overlays |

---

## 4.4 Reshaped wrapper architecture

Create a local design layer so the app does not import raw Reshaped components everywhere.

```txt
src/ui/
  base/
    AtelierButton.tsx
    AtelierCard.tsx
    AtelierText.tsx
    AtelierBadge.tsx
    AtelierAvatar.tsx
    AtelierLink.tsx
    AtelierDivider.tsx
    AtelierIcon.tsx

  forms/
    AtelierTextField.tsx
    AtelierTextArea.tsx
    AtelierSelect.tsx
    AtelierAutocomplete.tsx
    AtelierCheckbox.tsx
    AtelierRadioGroup.tsx
    AtelierSwitch.tsx
    AtelierFileUpload.tsx
    FormSection.tsx
    FieldGroup.tsx

  layout/
    PageShell.tsx
    PageContainer.tsx
    SectionHeader.tsx
    ContentGrid.tsx
    SidebarLayout.tsx
    SplitPane.tsx
    EmptyState.tsx
    LoadingState.tsx
    ErrorState.tsx

  navigation/
    AppHeader.tsx
    AppSidebar.tsx
    MobileNav.tsx
    AtelierTabs.tsx
    AtelierBreadcrumbs.tsx
    FilterBar.tsx
    ActionBar.tsx

  feedback/
    AtelierAlert.tsx
    AtelierToast.tsx
    AtelierModal.tsx
    AtelierPopover.tsx
    AtelierTooltip.tsx
    ConfirmDialog.tsx

  domain/
    ForumPostCard.tsx
    CritiquePostCard.tsx
    ThreadHeader.tsx
    CommentCard.tsx
    CommentComposer.tsx
    DisciplineHubCard.tsx
    CreatorProfileHeader.tsx
    ReputationBadge.tsx
    DashboardPanel.tsx
    SettingsPanel.tsx
    AdminListPanel.tsx
```

### Why wrappers are important

Wrappers protect the app from design-system lock-in. Future app pages should import:

```tsx
import { AtelierButton } from "@/ui/base/AtelierButton";
```

not:

```tsx
import { Button } from "reshaped";
```

Raw Reshaped imports are allowed only inside the wrapper layer and a few highly isolated low-level components.

---

## 4.5 Reshaped token usage rules

### Colors

Use semantic tokens through Reshaped props first.

Avoid:

```tsx
className="bg-[#111111] text-[#f1f1f1] border-[#333333]"
```

Prefer:

```tsx
<Card elevated>
  <Text color="neutral-faded">...</Text>
</Card>
```

### Spacing

Use Reshaped spacing props for internal component rhythm:

```tsx
<View gap={4} padding={5}>
  ...
</View>
```

Avoid arbitrary spacing unless there is a documented brand reason.

### Radius and shadows

Use card/component variants first. Only add custom radius/shadow through theme decisions, not one-off per card.

### Typography

Use a limited number of text roles:

```txt
Hero title
Page title
Section title
Card title
Body
Muted metadata
Form label
Caption
Badge label
```

Map these to Reshaped `Text` variants in `AtelierText.tsx`.

---

# 5. Atlantis Reference Plan

## 5.1 Role of Atlantis

Atlantis should be used as a **reference system**, not as the installed base.

Use it to learn:

- how a mature product system structures docs;
- how it organizes components;
- how it handles dense product surfaces;
- how it treats form-heavy flows;
- how it handles action bars, tables, and page controls;
- how it names components and variants;
- how it maintains consistency across product areas.

Do not visually copy Jobber's product identity.

Do not install Atlantis packages by default.

---

## 5.2 Atlantis components/patterns to adapt separately

Because Atlantis belongs to Jobber's own product ecosystem, convert useful ideas into Atelier components built with Reshaped primitives.

## A. Page/action patterns

| Atlantis-inspired pattern | Atelier adaptation | Build with Reshaped |
|---|---|---|
| Page title + primary action | `PageHeader` with create/action button | `View`, `Text`, `Button`, `Breadcrumbs` |
| Action bar | `ActionBar` for filters, sort, save, report | `View`, `Button`, `DropdownMenu`, `Tabs` |
| Bulk actions | Admin moderation selection bar | `Checkbox`, `Button`, `Alert`, `Table` |
| Contextual row actions | Post/admin row menu | `DropdownMenu`, `MenuItem` |
| Sticky footer actions | Create-post review/publish bar | `View`, `Button`, `ProgressIndicator` |

### Atelier usage

Use on:

- forum feed;
- discipline hubs;
- create-post flow;
- profile edit pages;
- settings pages;
- admin moderation pages.

---

## B. Form and workflow patterns

| Atlantis-inspired pattern | Atelier adaptation | Build with Reshaped |
|---|---|---|
| Structured form sections | `FormSection` | `FormControl`, `View`, `TextField`, `TextArea` |
| Inline helper text | Better prompt guidance in create flow | `FormControl`, `Alert`, `Text` |
| Required/optional clarity | Better critique submission quality | `Text`, `Badge`, `FormControl` |
| Step-based workflow | `CreatePostFlow` | `ProgressIndicator`, `Tabs`, `Button` |
| Review-before-submit | `PublishPreviewPanel` | `Card`, `Alert`, `Button` |
| Error grouping | `FormErrorSummary` | `Alert`, `View`, `Text` |

### Atelier usage

Use on:

- create discussion;
- create critique;
- profile settings;
- account settings;
- admin moderation notes;
- report review forms.

---

## C. Data-heavy product patterns

| Atlantis-inspired pattern | Atelier adaptation | Build with Reshaped |
|---|---|---|
| Table/list density | `AdminListPanel` | `Table`, `Badge`, `DropdownMenu` |
| Row metadata hierarchy | `ModerationRow`, `UserRow` | `View`, `Text`, `Avatar`, `Badge` |
| Empty data states | `EmptyState` | `Card`, `Text`, `Button`, `Icon` |
| Filtered list views | `FilterBar` | `Tabs`, `Select`, `TextField` |
| Pagination | `PaginatedListShell` | `Pagination`, `View` |

### Atelier usage

Use on:

- admin users list;
- admin posts/moderation list;
- reports list;
- saved posts;
- profile activity;
- dashboard activity.

---

## D. Product shell patterns

| Atlantis-inspired pattern | Atelier adaptation | Build with Reshaped |
|---|---|---|
| Consistent app shell | `AppShell` | `View`, `Container`, `Hidden`, `DropdownMenu` |
| Clear nav grouping | `SidebarNavGroup` | `View`, `Text`, `Actionable` |
| Responsive mobile shell | `MobileNav`, `MobileFilterFlyout` | `Flyout`, `Button`, `Hidden` |
| Breadcrumb hierarchy | `ThreadBreadcrumbs` | `Breadcrumbs` |
| Contextual help | `HelpPopover` | `Popover`, `Tooltip`, `Alert` |

### Atelier usage

Use on:

- authenticated app layout;
- dashboard;
- settings;
- admin;
- forum/thread pages;
- critique workspace.

---

## E. Documentation/process patterns

| Atlantis-inspired practice | Atelier adaptation |
|---|---|
| Component docs per component | `docs/ui/components/*.md` |
| Stories/examples | Optional component preview pages or Storybook |
| Component generation standard | Codex template for new components |
| Test/lint discipline | Build/lint after each migration phase |
| Separate design package thinking | Keep `src/ui` isolated from product logic |

---

## 5.3 Atlantis package installation policy

Default policy:

```txt
Do not install @jobber/components.
Do not install @jobber/design.
Do not install @jobber/hooks.
Use Atlantis documentation/source only as reference.
```

Only consider installation later if:

- a specific Atlantis component solves a major UI problem better than Reshaped;
- the component does not force Jobber-specific visual identity;
- bundle impact is acceptable;
- CSS conflict risk is low;
- it does not require Jobber API/OAuth assumptions;
- it is approved as a separate experiment branch.

If tested later, create a branch:

```txt
experiment/atlantis-component-evaluation
```

and document in:

```txt
docs/ATLANTIS_INSTALLATION_EVALUATION.md
```

Do not install Atlantis in the main rework branch.

---

# 6. Page-by-Page UI Application Plan

## 6.1 Public identity zone

Pages:

```txt
/
/about
/disciplines preview
/login
/signup
```

Reshaped components:

- `Container`
- `View`
- `Grid`
- `Text`
- `Button`
- `Card`
- `Badge`
- `Image`
- `Tabs` if needed

Atlantis-inspired patterns:

- page header/action block;
- card grid consistency;
- empty/login prompts;
- structured page sections.

Atelier-specific components:

```txt
LandingHero
DisciplinePreviewGrid
FeaturedCritiqueCard
FeaturedDiscussionCard
PublicCTASection
TrustPrincipleCard
```

Backend restriction:

- Do not change auth provider logic.
- Do not change signup/login callbacks.
- Only change layout/presentation.

---

## 6.2 Community browsing zone

Pages:

```txt
/explore
/posts
/disciplines/[slug]
/search
```

Reshaped components:

- `Tabs`
- `Card`
- `Badge`
- `TextField`
- `Select`
- `DropdownMenu`
- `Skeleton`
- `Pagination`
- `Container`
- `Grid`
- `View`

Atlantis-inspired patterns:

- filter/action bars;
- paginated list structure;
- row/card metadata hierarchy;
- saved search style layout;
- empty states for no posts/search results.

Atelier-specific components:

```txt
ForumPostCard
PostTypeBadge
DisciplineFilterBar
SearchResultCard
TrendingTagList
FeedSkeleton
```

Backend restriction:

- Do not change search logic.
- Do not alter query params except visual filter wiring that already exists.
- Do not change post models.

---

## 6.3 Critique zone

Pages:

```txt
/critique
/critique/[id]
/posts/[id] when post type = critique
```

Reshaped components:

- `Card`
- `Image`
- `Badge`
- `Tabs`
- `TextArea`
- `FileUpload`
- `Popover`
- `Tooltip`
- `ProgressIndicator`
- `ScrollArea`
- `Grid`
- `View`

Atlantis-inspired patterns:

- workflow framing;
- content + metadata side panel;
- review/submit action footer;
- structured empty comments state;
- status badge system;
- contextual help.

Atelier-specific components:

```txt
CritiquePostCard
CritiqueWorkspace
CritiqueAssetViewer
CritiqueRequestPanel
CritiqueCommentComposer
CritiqueStatusBadge
RevisionTimelinePlaceholder
```

Backend restriction:

- Do not change upload handling.
- Do not change storage buckets.
- Do not add revision backend yet.
- Revision timeline should be a placeholder only unless backend already supports it.

---

## 6.4 Creation zone

Pages:

```txt
/create
/create/discussion
/create/critique
/create/help
/create/resource
```

Reshaped components:

- `ProgressIndicator`
- `Radio`
- `TextField`
- `TextArea`
- `Select`
- `Autocomplete`
- `FileUpload`
- `Alert`
- `Button`
- `Card`
- `Modal`
- `Toast`

Atlantis-inspired patterns:

- step-based flow;
- form sections;
- review-before-publish;
- sticky action footer;
- validation summary;
- helper text.

Atelier-specific components:

```txt
CreatePostFlow
PostTypeSelector
CreateFlowProgress
CritiquePromptGuide
PublishPreviewPanel
CreateActionFooter
FormErrorSummary
```

Backend restriction:

- Keep existing submit handlers.
- Keep existing validation behavior.
- Do not add new post types unless backend already supports them.
- Do not change upload mutation logic.

---

## 6.5 User identity/profile zone

Pages:

```txt
/profile/[username]
/me/profile
/me/activity
/me/saved
```

Reshaped components:

- `Avatar`
- `Card`
- `Tabs`
- `Badge`
- `Grid`
- `Image`
- `Button`
- `Skeleton`
- `DropdownMenu`

Atlantis-inspired patterns:

- section headers;
- data cards;
- empty profile states;
- action menus;
- activity list hierarchy.

Atelier-specific components:

```txt
CreatorProfileHeader
ProfileStatCard
ProfileActivityCard
ReputationBadge
SavedPostCard
PortfolioPreviewGrid
```

Backend restriction:

- Do not change user model.
- Do not add portfolio schema.
- Portfolio-style UI can only use existing profile/post data.

---

## 6.6 Dashboard zone

Pages:

```txt
/dashboard
/dashboard/posts
/dashboard/critiques
/dashboard/replies
/dashboard/saved
```

Reshaped components:

- `Card`
- `Grid`
- `Tabs`
- `Badge`
- `Table` where needed
- `Skeleton`
- `Alert`
- `Button`

Atlantis-inspired patterns:

- product dashboard panels;
- compact but calm data cards;
- empty next-action states;
- list + quick action layout;
- dashboard summary blocks.

Atelier-specific components:

```txt
DashboardShell
DashboardPanel
MyPostSummaryCard
MyCritiqueSummaryCard
ReplyActivityCard
SavedItemCard
RecommendedThreadCard
```

Backend restriction:

- Do not create notification backend.
- Do not create drafts backend unless existing.
- Use placeholders only for unavailable future data.

---

## 6.7 Settings zone

Pages:

```txt
/settings
/settings/profile
/settings/account
/settings/notifications
/settings/privacy
/settings/interface
```

Reshaped components:

- `Tabs`
- `TextField`
- `TextArea`
- `Switch`
- `Select`
- `Button`
- `Card`
- `Alert`
- `Modal`

Atlantis-inspired patterns:

- grouped setting sections;
- save/cancel footer;
- dangerous action section;
- preference rows;
- help text below settings.

Atelier-specific components:

```txt
SettingsShell
SettingsPanel
PreferenceRow
DangerZonePanel
InterfaceThemeSelector
NotificationPreferencePlaceholder
```

Backend restriction:

- If settings persistence does not exist, create static UI or disabled placeholders.
- Do not create new settings tables.
- Do not change account/auth settings backend.

---

## 6.8 Admin/moderation zone

Pages:

```txt
/admin
/admin/posts
/admin/users
/admin/reports
/admin/disciplines
```

Reshaped components:

- `Table`
- `Badge`
- `DropdownMenu`
- `Tabs`
- `TextField`
- `Select`
- `Alert`
- `Modal`
- `Button`
- `Pagination`

Atlantis-inspired patterns:

- admin list density;
- bulk action bar;
- report status badges;
- moderation action menu;
- safe confirmation dialog;
- empty state for no reports.

Atelier-specific components:

```txt
AdminShell
AdminListPanel
ModerationStatusBadge
ReportRow
UserAdminRow
AdminActionBar
ModerationConfirmDialog
```

Backend restriction:

- Do not create admin permissions logic.
- Do not alter route protection.
- Do not add moderation mutations unless already available.
- Build admin UI only around existing data/actions or placeholder sections.
- If admin route protection is missing, document it, but do not invent backend authorization in this UI task.

---

# 7. MCP / AI Workflow Plan

## 7.1 What MCP means here

MCP stands for Model Context Protocol. In this project, it should be treated as a way for an AI coding tool to safely access context such as files, docs, browser previews, design references, or GitHub source.

For this UI rework, MCP should be used only to improve frontend context and visual QA.

It should not be used to make backend changes.

---

## 7.2 Recommended MCP/tool usage

Use the safest MCP/tool combination available in your coding environment.

## A. Filesystem / repo MCP

Purpose:

- inspect frontend routes;
- inspect component structure;
- create UI wrappers;
- edit UI files;
- write docs.

Allowed scope:

```txt
Read: whole repo if needed
Write: frontend and docs only
Do not write: backend/database/auth files
```

Suggested instruction:

```txt
Use filesystem tools to inspect the current frontend structure. You may edit only frontend UI files and docs. Do not edit Prisma, Supabase, API routes, auth logic, storage logic, or backend mutation files.
```

---

## B. Docs MCP / Context docs tool

Purpose:

- fetch Reshaped docs for exact component APIs;
- check Next.js integration requirements;
- check theming/token usage;
- check component examples before implementing.

Use for:

```txt
Reshaped provider
Reshaped theme setup
Reshaped layout components
Reshaped form components
Reshaped overlay components
Reshaped token usage
```

Instruction:

```txt
Use docs/context tools to reference the latest Reshaped documentation before implementing component wrappers. Prefer Reshaped APIs over custom CSS when possible.
```

Important:

- If there is no official Reshaped MCP available, use a docs context file generated from the relevant documentation pages.
- Store notes in `docs/vendor/RESHAPED_REFERENCE_NOTES.md`.

---

## C. GitHub MCP

Purpose:

- inspect Atlantis source/docs for inspiration;
- understand package/component organization;
- extract pattern ideas.

Use for:

```txt
Atlantis component naming inspiration
Atlantis form patterns
Atlantis page/action patterns
Atlantis documentation structure
Atlantis admin/product surface ideas
```

Instruction:

```txt
Use GitHub context to inspect GetJobber/atlantis only for reference. Do not install Atlantis packages. Convert useful patterns into Atelier components built with Reshaped.
```

---

## D. Browser / Playwright MCP

Purpose:

- visually inspect the local app;
- catch layout bugs;
- test responsive behavior;
- compare before/after screenshots;
- validate interactions like dropdowns, modals, tabs, and create flows.

Use for:

```txt
home page
forum feed
thread page
critique page
create flow
profile
dashboard
settings placeholder
admin placeholder
mobile layout
```

Instruction:

```txt
Use browser tools to inspect pages visually after each frontend migration phase. Check layout, spacing, dark mode, mobile behavior, focus states, empty states, and obvious interaction bugs.
```

---

## E. Figma MCP, optional

Use only if you have a Figma file or moodboard.

Purpose:

- extract spacing/typography/color direction from approved design references;
- compare visual output with intended brand direction.

Instruction:

```txt
Use Figma only as visual reference. Do not force exact Figma implementation if it breaks responsive or accessible behavior.
```

---

## F. Supabase / database MCP

Do **not** use for this task.

This rework must not modify:

```txt
schema
RLS
auth
storage
queries
server actions
API routes
```

If Codex needs to understand existing data shape, it can read frontend TypeScript types or existing component props. It should not make backend edits.

---

## 7.3 MCP safety prompt

Use this in Codex if MCP tools are available:

```txt
Use MCP/tools only for frontend context, documentation lookup, GitHub reference inspection, and visual QA.

Allowed:
- filesystem read across the repo;
- filesystem write only for frontend UI files and docs;
- Reshaped documentation lookup;
- Atlantis GitHub/reference lookup;
- browser/Playwright visual testing;
- optional Figma reference reading.

Forbidden:
- editing Prisma schema or migrations;
- editing Supabase configuration, RLS, storage policies, or auth logic;
- changing API route behavior;
- changing server actions or backend mutations;
- changing database queries beyond preserving existing props;
- using Supabase/database MCP to modify anything;
- adding new backend services, queues, workers, notifications, or cron tasks.

If a backend issue is found, document it in docs/BACKEND_ISSUES_DO_NOT_TOUCH.md and continue frontend-only work.
```

---

# 8. Build Phases

## Phase 0: Freeze backend contract

Output:

```txt
docs/UI_BACKEND_BOUNDARY.md
```

Tasks:

- list files that must not be edited;
- list frontend-only files allowed;
- identify existing frontend props/data contracts;
- document current page routes;
- document any backend concerns separately.

Definition of done:

- Codex knows exactly what not to touch.

---

## Phase 1: Audit current frontend structure

Output:

```txt
docs/CURRENT_FRONTEND_UI_AUDIT.md
```

Tasks:

- inspect routes;
- inspect layouts;
- inspect components;
- inspect global styles;
- inspect Tailwind usage;
- inspect post/thread/critique/dashboard/profile UI;
- identify duplicate card/button/form patterns;
- identify hardcoded colors/spacing;
- identify responsive issues;
- identify where settings/admin are missing or underdeveloped.

Definition of done:

- No UI migration starts until the audit exists.

---

## Phase 2: Add Reshaped foundation

Output:

```txt
src/components/providers/ReshapedProvider.tsx
src/ui/base/*
src/ui/layout/*
docs/RESHAPED_BASE_SETUP.md
```

Tasks:

- install Reshaped;
- configure PostCSS;
- configure Next.js package transpilation/optimization;
- add provider;
- create first wrapper components;
- verify app runs.

Definition of done:

```bash
npm run lint
npm run typecheck
npm run build
```

Run whichever scripts exist in the project. If a script does not exist, document that it was unavailable.

---

## Phase 3: Build wrapper component layer

Output:

```txt
src/ui/base
src/ui/forms
src/ui/layout
src/ui/navigation
src/ui/feedback
```

Initial components:

```txt
AtelierButton
AtelierCard
AtelierText
AtelierBadge
AtelierAvatar
AtelierTextField
AtelierTextArea
AtelierSelect
AtelierTabs
AtelierModal
AtelierToast
PageShell
PageContainer
SectionHeader
ContentGrid
EmptyState
LoadingState
ErrorState
```

Definition of done:

- wrappers compile;
- wrappers use Reshaped internally;
- no backend files changed;
- at least one sample page/component uses wrappers.

---

## Phase 4: Build domain UI components

Output:

```txt
src/ui/domain
```

Components:

```txt
ForumPostCard
CritiquePostCard
ThreadHeader
CommentCard
CommentComposer
DisciplineHubCard
CreatorProfileHeader
ReputationBadge
DashboardPanel
SettingsPanel
AdminListPanel
```

Definition of done:

- domain components receive existing data props;
- domain components do not fetch data themselves unless the old component already did;
- domain components do not call new backend actions.

---

## Phase 5: Migrate pages in order

Order:

```txt
1. home / landing
2. explore / forum feed
3. discipline hub
4. thread page
5. critique page
6. create post flow
7. profile page
8. dashboard
9. settings UI shell/placeholders
10. admin UI shell/placeholders
```

Definition of done for each page:

- page loads;
- existing data still appears;
- existing actions still work if they worked before;
- no backend file changed;
- mobile layout checked;
- empty state checked;
- loading state checked;
- dark mode checked if supported.

---

## Phase 6: Apply Atlantis-inspired refinements

Output:

```txt
docs/ATLANTIS_PATTERN_REFERENCES.md
```

Tasks:

- review Atlantis action/page/form/list patterns;
- map them to Atelier components;
- refine forms, admin lists, dashboard panels, and page headers;
- do not install Atlantis.

Definition of done:

- every Atlantis-inspired pattern is implemented through Reshaped/Atelier wrappers;
- no Atlantis package dependency added.

---

## Phase 7: Visual QA and documentation

Output:

```txt
docs/ATELIER_UI_SYSTEM.md
docs/UI_QA_CHECKLIST.md
docs/RESHAPED_MIGRATION_LOG.md
```

Tasks:

- document tokens/components;
- document page migration status;
- document visual QA checklist;
- document remaining issues;
- run visual checks on core pages.

Definition of done:

- UI system is documented;
- migration log exists;
- known issues are listed;
- backend untouched.

---

# 9. Component Mapping Summary

## 9.1 Reshaped additions

Add from Reshaped as the actual component foundation:

```txt
Provider/theming:
- Reshaped
- Theme

Layout:
- View
- Container
- Grid
- Hidden
- Divider
- ScrollArea

Typography/media:
- Text
- Image
- Avatar
- Icon

Actions/navigation:
- Button
- Link
- Actionable
- Tabs
- Breadcrumbs
- DropdownMenu
- MenuItem
- ToggleButton
- ToggleButtonGroup
- Pagination

Forms:
- TextField
- TextArea
- Select
- Autocomplete
- Checkbox
- Radio
- Switch
- FileUpload
- FormControl

Feedback/status:
- Alert
- Badge
- Toast
- Loader
- Skeleton
- ProgressBar
- ProgressIndicator

Overlays:
- Modal
- Popover
- Tooltip
- Flyout
- Accordion
- Dismissible

Data/admin:
- Table
```

Use later only if needed:

```txt
Calendar
Carousel
Slider
NumberField
PinField
Resizable
ContextMenu
Hotkeys-related hooks
```

---

## 9.2 Atlantis adaptations

Adapt from Atlantis as patterns, not direct dependencies:

```txt
Page/action patterns:
- PageHeader
- ActionBar
- BulkActionBar
- ContextualRowActions
- StickyActionFooter

Form/workflow patterns:
- FormSection
- FieldGroup
- InlineHelperText
- StepBasedWorkflow
- ReviewBeforeSubmit
- FormErrorSummary

Data-heavy patterns:
- AdminListPanel
- ModerationTable
- UserRow
- ReportRow
- FilterBar
- PaginatedListShell

Shell/navigation patterns:
- AppShell
- SidebarNavGroup
- MobileNav
- MobileFilterFlyout
- Breadcrumb hierarchy
- HelpPopover

Documentation/process patterns:
- Component docs
- Component examples
- Migration logs
- QA checklist
- Naming standards
```

---

# 10. Important Design Rules for Atelier

## 10.1 Forum should not look like a blog feed

Forum cards must show:

```txt
post title
post type
author
discipline
tags
reply/comment count
vote count
status
timestamp
preview
```

## 10.2 Critique should not look like a normal discussion

Critique cards/pages must show:

```txt
work/project title
discipline
creative context
feedback requested
assets/images
critique status
comment/feedback count
revision placeholder if not supported yet
```

## 10.3 Profile should not look like a plain account page

Profile surfaces should feel portfolio-aware:

```txt
identity header
creative discipline
reputation/recognition
submitted critiques
helpful responses
saved/featured work if available
activity timeline
```

## 10.4 Dashboard should be calm and task-focused

Dashboard should show:

```txt
my posts
my critiques
my replies
saved items
recommended discussions
empty states
next actions
```

## 10.5 Admin/settings should be structural, not overbuilt

Settings can include:

```txt
profile settings
account settings
notification placeholder
privacy placeholder
interface/theme placeholder
```

Admin can include:

```txt
user list shell
post moderation shell
reported content placeholder
category/discipline management placeholder
basic platform stats placeholder
```

Do not build complex analytics, enterprise permissions, or advanced moderation workflows in this UI-only phase.

---

# 11. QA Checklist

For every migrated page, check:

```txt
Desktop layout
Tablet layout
Mobile layout
Light/dark mode if supported
Empty state
Loading state
Error state
Keyboard navigation
Focus visibility
Button hierarchy
Form labels
Helper text
Toast/alert behavior
Modal/flyout behavior
Spacing consistency
Typography consistency
No hardcoded random colors
No broken existing actions
No backend file changes
```

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

If the project uses different scripts, run the equivalent scripts and document the result.

---

# 12. Files to Create

```txt
docs/UI_BACKEND_BOUNDARY.md
docs/CURRENT_FRONTEND_UI_AUDIT.md
docs/RESHAPED_BASE_SETUP.md
docs/ATLANTIS_PATTERN_REFERENCES.md
docs/ATELIER_UI_SYSTEM.md
docs/UI_QA_CHECKLIST.md
docs/RESHAPED_MIGRATION_LOG.md
docs/BACKEND_ISSUES_DO_NOT_TOUCH.md
```

Frontend structure:

```txt
src/components/providers/ReshapedProvider.tsx
src/ui/base/*
src/ui/forms/*
src/ui/layout/*
src/ui/navigation/*
src/ui/feedback/*
src/ui/domain/*
```

---

# 13. Codex Prompt

Use this prompt after the structure/framework decision is finalized:

```txt
You are working on my existing Atelier / Designers Hub platform.

Goal:
Adopt Reshaped as the frontend base UI system and use Atlantis by Jobber only as a reference/pattern library. This is a frontend-only UI rework. Do not touch backend systems.

Current project context:
Atelier is a Next.js 14 App Router creative-professional community platform with Supabase auth/onboarding, Prisma + Supabase PostgreSQL, post creation, comments, votes, accepted-solution help flow, search, uploads, SSR thread pages, dashboard/profile surfaces, discipline hubs, and premium UI surfaces. Settings and administration are missing or underdeveloped and should be added only as frontend structural shells/placeholders unless existing backend support already exists.

Strict backend boundary:
Do not edit Prisma schema, migrations, Supabase config, RLS policies, auth logic, storage logic, API route behavior, server actions, database queries, backend mutation logic, upload logic, or environment files. You may read backend-related files only to understand existing frontend props and data contracts. If a backend issue is found, document it in docs/BACKEND_ISSUES_DO_NOT_TOUCH.md and continue frontend-only work.

Implementation hierarchy:
Reshaped = installed base UI system.
Atelier = final product/brand layer.
Atlantis = reference/pattern inspiration only.
Tailwind = supporting layout utility only.
Custom CSS = rare brand polish only.

Tasks:
1. Create docs/UI_BACKEND_BOUNDARY.md listing files allowed to edit and files forbidden to edit.
2. Create docs/CURRENT_FRONTEND_UI_AUDIT.md by inspecting routes, layouts, components, styles, Tailwind usage, post/thread/critique/dashboard/profile UI, settings/admin gaps, hardcoded colors, spacing issues, and responsive issues.
3. Install and configure Reshaped for Next.js without deleting existing config:
   - npm install reshaped
   - add/merge postcss config
   - add/merge next.config transpilePackages and optimizePackageImports
   - create src/components/providers/ReshapedProvider.tsx
   - wrap the app safely without disturbing existing providers.
4. Create the local UI architecture:
   - src/ui/base
   - src/ui/forms
   - src/ui/layout
   - src/ui/navigation
   - src/ui/feedback
   - src/ui/domain
5. Build wrapper components around Reshaped:
   - AtelierButton
   - AtelierCard
   - AtelierText
   - AtelierBadge
   - AtelierAvatar
   - AtelierTextField
   - AtelierTextArea
   - AtelierSelect
   - AtelierTabs
   - AtelierModal
   - AtelierToast
   - PageShell
   - PageContainer
   - SectionHeader
   - ContentGrid
   - EmptyState
   - LoadingState
   - ErrorState
6. Build domain components:
   - ForumPostCard
   - CritiquePostCard
   - ThreadHeader
   - CommentCard
   - CommentComposer
   - DisciplineHubCard
   - CreatorProfileHeader
   - ReputationBadge
   - DashboardPanel
   - SettingsPanel
   - AdminListPanel
7. Migrate pages in this order:
   - home / landing
   - explore / forum feed
   - discipline hub
   - thread page
   - critique page
   - create post flow
   - profile page
   - dashboard
   - settings UI shell/placeholders
   - admin UI shell/placeholders
8. Use Atlantis only as reference for:
   - action bars
   - page headers
   - dense admin lists
   - structured forms
   - workflow layouts
   - empty states
   - responsive product shell patterns
   - documentation style
9. Do not install @jobber/components, @jobber/design, or @jobber/hooks in this phase.
10. After each phase, run available checks:
   - npm run lint
   - npm run typecheck
   - npm run build
   If a script is unavailable, document it.
11. Use MCP/tools only for frontend-safe work:
   - filesystem read/write for frontend/docs only;
   - Reshaped docs lookup;
   - Atlantis GitHub/reference lookup;
   - browser/Playwright visual QA;
   - optional Figma reference if available.
   Do not use database/Supabase MCP to modify anything.
12. Produce these docs at the end:
   - docs/RESHAPED_BASE_SETUP.md
   - docs/ATLANTIS_PATTERN_REFERENCES.md
   - docs/ATELIER_UI_SYSTEM.md
   - docs/UI_QA_CHECKLIST.md
   - docs/RESHAPED_MIGRATION_LOG.md

Acceptance criteria:
- Reshaped is the single installed base UI system.
- Atlantis is used only as pattern reference.
- Atelier wrapper components exist.
- Core pages are migrated incrementally.
- Backend files are untouched.
- Existing functionality is preserved.
- The UI feels more consistent, premium, creative-professional, and less generic.
```

---

# 14. Final Direction

Do the structural framework first. Then adopt Reshaped as the UI base. Then use Atlantis as a reference to refine product patterns.

The correct order is:

```txt
1. Freeze backend boundary
2. Audit current frontend
3. Install/configure Reshaped
4. Build Atelier wrapper UI layer
5. Build domain components
6. Migrate core pages
7. Use Atlantis as inspiration for advanced product patterns
8. QA visually and document the system
```

This keeps the rework powerful without risking the backend or breaking the existing product foundation.

---

# 15. Source Notes

Reference sources used while preparing this plan:

- Reshaped documentation: https://www.reshaped.so/docs/getting-started/overview
- Reshaped Next.js integration: https://www.reshaped.so/docs/getting-started/integrations/next
- Atlantis documentation: https://atlantis.getjobber.com/
- Atlantis GitHub repository: https://github.com/GetJobber/atlantis
- Model Context Protocol introduction: https://modelcontextprotocol.io/docs/getting-started/intro
- Existing Atelier Brand UI Rework Plan context
- Existing Site Tools Review context
