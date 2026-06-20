# DESIGNERS HUB — FINAL CODEX SPEC V3

This document refines V2 into a production-ready implementation brief focused on:

1. Clear UX architecture
2. Community navigation
3. Creative-professional UI direction
4. Feed logic
5. Discovery model
6. Codex implementation quality standards

## NORTH STAR

Designers Hub should feel like:

> A premium, modern, structured creative community.

Emotional feeling:

* professional
* inspiring
* intelligent
* calm
* design-oriented
* community-driven

Avoid:

* Reddit clutter
* Discord chaos
* Dribbble vanity-only feel
* social media addiction mechanics

Think:

Linear + Cosmos + Notion + Behance minimalism.

---

# UX INFORMATION FLOW

Primary navigation:

Home
Explore
Disciplines
Critique
Showcase
Help
Resources
Profile

## HOME

Purpose:
Retention + discovery.

Sections:

1. Trending discussions
2. Recent critiques
3. Featured showcases
4. Recently solved help posts
5. Resources of the week

Cards should be visually differentiated by post type.

## DISCIPLINE HUB

Example:
/architecture

Contains:

* overview
* active discussions
* critique feed
* showcases
* help feed
* top contributors
* trending tags

## EXPLORE

Unified discovery.

Filters:

* discipline
* software
* post type
* trending
* newest
* solved

Search-first experience.

---

# POST TYPE UI SYSTEM

## Discussion Card

Minimal.
Text-first.

Displays:

* title
* author
* tags
* reply count
* engagement

## Critique Card

Image-first.

Displays:

* preview image
* title
* feedback requested
* iteration count

CTA:
"Give Feedback"

## Showcase Card

Gallery-focused.

Displays:

* hero image
* title
* creator
* tools used

## Help Card

Problem-solving focused.

Displays:

* title
* software
* solved badge
* answer count

CTA:
"Help Solve"

## Resource Card

Clean reference style.

Displays:

* title
* type
* software relevance

---

# VISUAL DESIGN SYSTEM

## Theme

Premium minimal creative.

## Layout

Wide whitespace.
Responsive.
12-column grid.

## Corners

Rounded-xl

## Cards

Soft borders.
Subtle elevation.
No harsh shadows.

## Typography

Primary:
Inter

Hierarchy:

* strong headings
* readable body text
* high scanability

## Motion

Minimal microinteractions only.

Allowed:

* hover states
* subtle transitions
* loading skeletons

Avoid:

* flashy animation
* parallax
* excessive motion

## Color System

Neutral-first.
Accent driven.

Base:
Slate / Zinc

Accent:
Warm creative highlight.

Discipline accents later.

Dark mode mandatory.

---

# HOMEPAGE LAYOUT

Hero:

"The community where designers discuss, critique, improve, and solve together."

Sections:

1. Trending Discussions
2. Critique Requests
3. Featured Showcases
4. Solved Help Threads
5. Explore by Discipline
6. Community Metrics
7. CTA

Avoid generic SaaS homepage style.

Must feel community-centric.

---

# CREATE POST UX

Step-based creation.

Step 1:
Choose post type.

Step 2:
Enter details.

Dynamic fields based on type.

Step 3:
Upload visuals.

Step 4:
Preview.

Step 5:
Publish.

Autosave drafts locally.

---

# PROFILE SYSTEM

Profile should prioritize:
Contribution over vanity.

Sections:

* bio
* discipline
* software stack
* critiques given
* showcases
* discussions
* help contributions
* badges

No follower counts.

---

# CODE QUALITY REQUIREMENTS

Codex must generate:

* production-ready TypeScript
* reusable components
* clean architecture
* strict typing
* accessibility
* mobile responsiveness
* loading states
* error states
* empty states

Mandatory libraries:

* shadcn/ui
* framer-motion (minimal)
* lucide-react
* react-hook-form
* zod

---

# IMPLEMENTATION MODE

Codex should:

1. Scaffold architecture first
2. Build one module at a time
3. Generate UI with strong aesthetics
4. Maintain consistent design language
5. Preserve SSR and performance
6. Explain tradeoffs

Never generate the whole application in one step.

Always complete:
Foundation → Module → Verification.

FINAL GOAL:

> A premium, community-first Designers ecosystem that feels creatively inspiring while remaining technically lean and shippable.
