# DESIGNERS HUB — CODEX BUILD SPEC V2

Version: 2.0
Architecture: Community-first + Knowledge-first
Project Type: Structured multidisciplinary designers ecosystem
Target: Production-grade MVP
Audience: OpenAI Codex

---

# 1. CORE PRODUCT DEFINITION

Designers Hub is:

> A structured multidisciplinary community platform for designers to discuss, iterate, improvise, display, critique, and solve.

This is NOT a Q&A-only platform.

It combines:

* community discussions
* critique loops
* showcases
* problem solving
* software-specific knowledge
* interdisciplinary learning

Think:

> Reddit + Stack Overflow + Behance + Design Community

BUT:

Highly structured for design disciplines.

This is NOT:

* social media
* portfolio-only website
* chat app
* productivity suite
* workspace software

The platform exists to:

1. Create belonging among designers
2. Enable critique and iteration
3. Surface design knowledge
4. Build a searchable archive
5. Help designers improve through community

---

# 2. CORE USER ACTIONS

Designers Hub exists around five primary actions.

## DISCUSS

Users discuss:

* workflows
* opinions
* industry trends
* design thinking
* studio culture
* software practices

Example:
"Best workflow for architecture presentations in 2026?"

## ITERATE

Users improve work through feedback.

Example:
"Which massing option works better?"

## IMPROVISE

Users experiment collaboratively.

Example:
"Alternative façade language suggestions?"

## DISPLAY

Users share:

* finished projects
* WIPs
* portfolios
* explorations

## SOLVE

Users solve:

* software issues
* technical workflows
* rendering problems
* modeling bugs

This becomes the SEO engine.

---

# 3. MVP PRINCIPLE

The MVP validates this hypothesis:

> Designers want a structured design community where they can interact meaningfully beyond portfolios and fragmented chats.

MVP success metrics:

* users return regularly
* discussions receive replies
* critiques generate iterations
* help posts get solved
* searches increase
* designers post work

---

# 4. TARGET MARKET

Initial niche:

> Architecture + Design students and professionals in India

Initial disciplines:

* Architecture
* Interior Design
* Urban Design

Initial software:

* Rhino
* Grasshopper
* Revit
* AutoCAD
* SketchUp
* Lumion
* Enscape
* V-Ray

Future expansion:

* UI/UX
* Product Design
* Graphic Design
* Motion Design
* Fashion
* Industrial Design

DO NOT build multi-discipline complexity immediately.

Architecture-first.

---

# 5. COMMUNITY INFORMATION ARCHITECTURE

Primary hierarchy:

Discipline
→ Space Type
→ Content

Example:

Architecture
→ Discussions
→ Thread

Architecture
→ Critique
→ Thread

Architecture
→ Showcase
→ Thread

Architecture
→ Help
→ Thread

Architecture
→ Resources
→ Thread

Software filters exist INSIDE spaces.

Example:

Architecture → Help → Rhino
Architecture → Help → Revit
Architecture → Discussions → Rhino workflows

Mandatory spaces:

1. Discussions
2. Critique
3. Showcase
4. Help
5. Resources

---

# 6. POST SYSTEM (CRITICAL)

Designers Hub is a multi-post-type system.

Mandatory post types:

## DISCUSSION

Purpose:
Community conversation.

Fields:

* title
* body
* discipline
* optional software
* tags
* images optional

## CRITIQUE

Purpose:
Get design feedback.

Fields:

* title
* context
* project description
* challenge statement
* images required
* optional iterations

Special UI:
"What feedback are you looking for?"

## SHOWCASE

Purpose:
Display finished work.

Fields:

* title
* project summary
* media gallery
* tools used
* optional project link

## HELP

Purpose:
Problem solving.

Fields:

* title
* issue description
* software required
* screenshots
* error context

Only HELP posts support:

* accepted answer
* solved state
* SEO priority

## RESOURCE

Purpose:
Knowledge sharing.

Fields:

* title
* links/files
* explanation
* software tags

---

# 7. MVP FEATURE BOUNDARY

## MUST HAVE

1. Authentication
2. Profiles
3. Discipline spaces
4. Post creation
5. Multi-post-type system
6. Image uploads
7. Comments
8. Search
9. Solved system (help only)
10. Basic reputation
11. SEO pages
12. Mobile responsive UI

## MUST NOT BUILD

Forbidden in MVP:

* DMs
* live chat
* realtime collaboration
* whiteboards
* multiplayer editing
* marketplace
* payments
* jobs board
* AI assistant
* recommendation engine
* notifications system (advanced)
* social feed algorithm
* follow system
* mentorship matching
* workspace management
* project rooms

Reject feature creep.

---

# 8. TECH STACK CONTRACT

Frontend:

* Next.js 14+
* App Router
* TypeScript strict
* Tailwind CSS
* shadcn/ui

Forms:

* React Hook Form
* Zod

Backend:

* Supabase PostgreSQL
* Prisma ORM

Authentication:

* Google OAuth
* Magic Link

Storage:

* Cloudflare R2

Search:

* Algolia

Deployment:

* Vercel

Monitoring:

* Sentry

NO REDUX.
NO MICROSERVICES.

---

# 9. PROJECT STRUCTURE

src/
├── app/
│   ├── (marketing)/
│   ├── (community)/
│   ├── auth/
│   ├── api/
│   ├── profile/
│   └── settings/
│
├── modules/
│   ├── auth/
│   ├── posts/
│   ├── critique/
│   ├── showcase/
│   ├── discussions/
│   ├── help/
│   ├── resources/
│   ├── comments/
│   ├── search/
│   ├── uploads/
│   └── reputation/
│
├── components/
│   ├── forum/
│   ├── cards/
│   ├── editor/
│   ├── upload/
│   ├── navigation/
│   └── ui/
│
├── server/
├── lib/
├── hooks/
├── types/
└── utils/

---

# 10. ROUTING ARCHITECTURE

/
/login
/signup
/onboarding
/explore

/[discipline]
/[discipline]/discussions
/[discipline]/critique
/[discipline]/showcase
/[discipline]/help
/[discipline]/resources

/post/new

/thread/[slug]

/profile/[username]

Examples:

/architecture/help
/architecture/showcase
/architecture/critique

Threads remain canonical URLs.

---

# 11. DATABASE ARCHITECTURE

## profiles

id UUID
username UNIQUE
avatar_url
bio
primary_discipline
reputation
created_at

## disciplines

id
name
slug

## softwares

id
name
slug
discipline_id

## posts

id UUID
slug UNIQUE
title
body
post_type ENUM

Allowed values:

* discussion
* critique
* showcase
* help
* resource

author_id
discipline_id
software_id NULLABLE

vote_count
comment_count
view_count
is_solved
created_at
updated_at

## attachments

id
post_id
key
url
mime_type
size

## comments

id
post_id
author_id
body
vote_count
is_solution
created_at

## tags

id
name
slug

## post_tags

post_id
tag_id

---

# 12. REPUTATION MODEL

Simple only.

+5 accepted answer
+3 critique contribution
+2 helpful comment
+2 upvote
+1 discussion participation

Badges:

Rhino Expert
Critique Contributor
Revit Specialist
Design Mentor

No heavy gamification.

---

# 13. SEARCH CONTRACT

Mandatory.

Index:

* title
* body preview
* discipline
* software
* post_type
* solved state
* tags

Filters:

* discipline
* software
* post type
* solved

Ranking:

1. relevance
2. solved help posts
3. engagement
4. freshness

---

# 14. SEO CONTRACT

Only HELP posts receive aggressive SEO optimization.

Why:

Help posts = searchable intent.

Discussion/Critique/Showcase:
community-first.

Mandatory:

* SSR pages
* metadata generation
* OG tags
* sitemap
* robots
* semantic HTML

Thread content must never be client-only rendered.

---

# 15. UI SYSTEM

Design language:

Minimal.
Premium.
Creative-professional.

Feel:

Linear × Stack Overflow × Design Community.

Prioritize:

* readability
* visual hierarchy
* clean navigation
* image-friendly layouts
* whitespace

Dark mode required.

Avoid:

* social media clutter
* excessive animations
* visual noise

---

# 16. IMPLEMENTATION PHASES

PHASE 1
Project bootstrap.

PHASE 2
Database architecture.

PHASE 3
Authentication + onboarding.

PHASE 4
Community structure.

PHASE 5
Post system (all types).

PHASE 6
Image uploads.

PHASE 7
Comments.

PHASE 8
Solved system for help.

PHASE 9
Search.

PHASE 10
Profiles + reputation.

PHASE 11
SEO optimization.

PHASE 12
Performance hardening.

Never skip phases.

---

# 17. ACCEPTANCE CRITERIA

Before phase completion:

* build passes
* lint passes
* typecheck passes
* SSR preserved
* responsive UI
* auth secure
* no console errors
* validations complete

Do not continue if incomplete.

---

# 18. CODEX EXECUTION RULES

For every task:

1. Analyze request
2. Create implementation plan
3. Explain architecture
4. Implement production code
5. Verify
6. Summarize

Never build future-phase features.

Goal:

> Build a real community-first Designers ecosystem MVP that is lean, scalable, and actually shippable.
