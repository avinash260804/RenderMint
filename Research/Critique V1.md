

# Purpose.

User types.
Entry states.
First-time journey.
Core components.
Content types.
Actions and permissions.
Progressive disclosure layers.
Moderation logic.
Success metrics.

this is the framework blueprint.. use this for framework generation.. if content diversifies add it as a sub section.. now according to this prepare a detailed framework for Critique

Here is the complete Critique Space framework, structured exactly against your 10-part blueprint and grounded in Atelier's existing product spec, principles, and prior discussion.

## 1. Purpose

The Critique Space exists to turn feedback into visible, documented improvement — not to host opinions or comments. Its job is to make a beginner feel "I am learning and improving here" by converting a single upload into a traceable arc of decisions, revisions, and community validation that becomes reusable knowledge for future members.[^1]

## 2. User Types

| Type | Honor Range | Role in Critique Space |
| :-- | :-- | :-- |
| Newcomer | 0–24 | Posts first critique request, receives feedback |
| Contributor | 25–99 | Posts iterations, marks feedback helpful |
| Rising | 100–249 | Sees Iteration Depth Score, eligible for Spotlight promotion [^2] |
| Active | 250–499 | Curates Learning Paths, organizes meetup-level events [^2] |
| Established/Mentor | 500–1000+ | Runs critique sessions as Events, judges Challenges, gives Canonical-level critique [^2] |
| Moderator (Chapter/Studio/Global) | Role-based | Marks needs-revision, pins exemplary critiques, resolves reports [^2] |

## 3. Entry States

- **From Studio feed** — browsing critique cards showing image thumbnail, "Feedback Requested" summary, iteration badge (v3)[^2]
- **From Post Creation flow** — selecting the "Critique" card among six content type options[^2]
- **From a stalled thread nudge** — the "Continue Your Work" panel surfacing an open critique needing a revision
- **From Explore/Search** — filtering by content type = Critique, or Studio + Software tag[^2]
- **Empty state** — a Studio with zero critiques shows "Be the first to start a discussion!" with a Create Post CTA[^2]


## 4. First-Time Journey

1. New user selects "Critique" from the six-card post creation menu[^2]
2. Fills minimal required fields: what they're working on, project description, feedback requested, at least one image[^2]
3. Answers one simplified self-analysis prompt (Layer 1 disclosure) instead of the full six-question set[^1]
4. Publishes — post appears in Studio feed tagged "Needs First Look"
5. Receives first reply — unlocks Mark as Helpful and the "post a revised version" button[^2]
6. Uploads v2 with a mandatory change note — this is the moment the improvement loop becomes real[^1]
7. Original critic is notified of the update, closing the feedback loop

## 5. Core Components

- **Critique post form** — type-specific fields per the Post Creation schema[^2]
- **Iteration tracker** — version history (v1 → v2 → v3) with change descriptions and linked attachments, backed by `CritiqueIteration`[^2]
- **Feedback Requested callout** — highlighted box directing critics[^2]
- **Give Feedback CTA** — opens reply box with a structured template (What works / What could improve / Suggestion)[^2]
- **Reactions layer** — Upvote, Inspired, Insightful, Precise, each with distinct Honor value[^2]
- **Iteration Depth Score** — post-level growth meter combining version count, response rate, documentation quality, and re-engagement (introduced at Layer 3)
- **Continue Your Work panel** — quiet, digest-based nudge surface for stalled threads


### Sub-section: Data Model (schema-diversified content)

- `Post.postType = critique`, with `context`, `projectDescription`, `feedbackRequested`, `currentIteration` fields[^2]
- `CritiqueIteration` — `iterationNumber`, `description`, `createdAt`[^2]
- `Attachment` — linked per iteration via `iterationId`[^2]
- `Comment.isHelpful` — author-marked flag distinct from `isSolution`/`isCanonical`[^2]


## 6. Content Types

| Sub-type | Purpose | Distinct Behavior |
| :-- | :-- | :-- |
| Critique Request (standard) | Get feedback on active work-in-progress | Iterative, image-first, tracks versions [^2] |
| Resolved Critique / Case Study | Fully documented, multi-version arc | Auto-promoted to Studio archive, read-only reference for future members |
| Cohort Critique ("Crit Week") | Loosely time-clustered critiques on similar topics | Discoverable grouping, not a separate content type — a feed filter |
| Event-Linked Critique Session | Live critique tied to a Workshop/Critique Session Event | Uses Events Hub scaffolding, submissions gallery [^2] |

## 7. Actions and Permissions

| Action | Who Can Do It | Source |
| :-- | :-- | :-- |
| Create critique post | Any logged-in user, 0 Honor minimum | [^2] |
| Upload new iteration | Post author only | [^2] |
| Mark reply Helpful | Post author only | [^2] |
| React (Inspired/Insightful/Precise) | Any logged-in user, not on own content | [^2] |
| Vote on own content | Blocked — "You can't vote on your own content" | [^2] |
| Pin critique in Chapter/Studio | Chapter Mod and above | [^2] |
| Mark critique reply as Canonical example | Studio Mod and above | [^2] |
| Promote thread to Case Study | Studio Mod, or automatic on threshold (3+ iterations, resolved) | Extension of existing Spotlight promotion logic [^2] |
| Organize a critique session Event | Established (500+ Honor) | [^2] |
| Judge a Challenge critique submission | Honor 500+ or organizer-selected | [^2] |

## 8. Progressive Disclosure Layers

| Layer | Honor | Unlocks |
| :-- | :-- | :-- |
| 1 — Newcomer | 0 | Minimal form, 1 self-analysis question, no score visible |
| 2 — Contributor | 25+ | Full self-analysis set, iteration upload, Mark Helpful [^2][^1] |
| 3 — Rising | 100+ | Iteration Depth Score activates, stats panel, Spotlight eligibility [^2] |
| 4 — Active | 250+ | Learning Path curation, cross-project growth view, Case Study eligibility [^2] |
| 5 — Established+ | 500–1000+ | Critique session Events, Challenge judging, Studio-level aggregate stats [^2] |

## 9. Moderation Logic

Following "Guide first, correct second, restrict only when necessary":[^1]

- **Hard block at submission**: critique post with zero images is blocked with an inline message[^2]
- **Duplicate detection**: 80%+ title similarity in the same Studio surfaces "Similar posts exist" before publishing[^2]
- **Rate limiting**: more than 5 posts/hour or 20 comments/hour triggers a slow-down message[^2]
- **Needs Revision state**: moderators can flag a low-effort critique request for improvement rather than removing it outright[^1]
- **Report flow**: user flags → auto-sanitization/rate-limit checks → moderator review → approve/remove/warn → author appeal to Global Mod → Admin escalation if unresolved[^2]
- **Anti-gaming on Honor**: self-reactions don't count, duplicate comments flagged, voting-ring detection for repeated mutual voting[^2]
- **Deletion rule**: a critique thread with an accepted/canonical reply cannot be deleted without first removing that reply[^2]


## 10. Success Metrics

| Metric | Definition | Target |
| :-- | :-- | :-- |
| Critique iteration rate | % of critique posts where author publishes v2+ | 30% [^2] |
| Time to first critique | How fast a new critique post gets its first reply | Comparable to 4-hour median for Problem posts [^2] |
| Critique-to-Spotlight conversion | % of resolved critique arcs promoted to Spotlight/Case Study | Tracked as a portfolio flywheel signal [^2] |
| Helpful-mark rate | % of critique replies marked Helpful by the author | Signals critique quality, not just volume [^2] |
| Re-engagement rate | % of original critics who return after a new iteration is posted | Core signal for the Iteration Depth Score |
| Feed engagement | % of critique feed views resulting in click/vote/bookmark | 15%, matching platform-wide target [^2] |
| Nudge-to-action rate | % of "Continue Your Work" nudges resulting in a new iteration within 7 days | New metric specific to this framework, validates the anti-passivity design |

<div align="center">⁂</div>

[^1]: Atelier-Principles.md

[^2]: avi1-1.md

