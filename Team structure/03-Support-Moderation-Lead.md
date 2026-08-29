---
tags: [atelier, moderation, role-note]
created: 2026-08-29
---

# Support & Moderation Lead — Trust & Safety / Platform Operations

← back to [[00-Atelier-Team-Structure-MOC]] · enforces philosophy set by [[01-RnD-Lead]] and [[04-Management-Idea-Lead]] · requests implementation from [[02-Technical-Lead]]

## Mission

Own the question *"what breaks, gets gamed, or hurts a beginner if we ship this?"* — this role is the platform's immune system: guide first, correct second, restrict only when necessary, and never let quality erode quietly while everyone else is focused on growth.

## Primary phase ownership

**Phase 2 — Supporting Systems (Primary, shared with Technical & Management)**
- Own moderation checkpoints specifically: where in onboarding, creation flow, and each space does a low-context or low-effort submission get caught *before* it damages trust — hard blocks (e.g. a critique post with zero images), soft nudges ("similar posts exist"), and rate limiting.
- Define what "guide first" actually looks like in UI copy and flow, not just as a policy statement.

**Phase 4 — Trust, Progression, and Quality Systems (Primary, shared with Management)**
- Own permissions gating — who can pin, promote, curate, moderate, judge — tied to genuine trust, not arbitrary access.
- Own quality signals and anti-gaming: helpful-mark validity, voting-ring detection, endorsement reciprocity dampening, Honor-farming prevention across every cross-space promotion path (Discussion→Resource, Critique→Resource, Critique→Showcase, Showcase reopening).
- This is where the resolved graduation rules live operationally: the three-path Critique→Showcase trigger, the narrower republish rule after "In Revision," and the `platform_config` thresholds that need real tuning data over time.

## Secondary / consulted

- **Phase 0:** flag early where each space's framework contract needs a moderation hook, even before it's built.
- **Phase 1:** define state logic for the moderation-relevant states specifically — `needs_revision`, `flagged`, `archived` — alongside R&D's happier-path states.
- **Phase 3:** review every cross-space transition for gaming risk before it ships (this is the lens that caught the community-threshold Showcase-farming loop and the endorsement-ring risk in prior analysis — keep applying it to every *new* transition, not just the ones already reviewed).
- **Phase 5/6:** make sure blocked/flagged/needs-revision states are actually represented in the screen and state inventories, not bolted on after.

## Whiteboard research question owned (secondary)

**"Security concerns & hosting?"** — secondary to Technical, but own the trust/data-handling half specifically: what moderation actions get logged, what's visible to whom, how reports and appeals flow.

## Immediate next actions

1. Write the moderation-checkpoint spec for onboarding + first-post creation flow — this has to exist before Phase 2 UI gets built, not after.
2. Draft the anti-gaming checklist as a reusable template (self-action exclusion, reciprocity/ring detection, rate limits) that gets applied to *every* new Honor-bearing or promotion-bearing feature going forward, rather than re-derived each time.
3. Start a `Threshold Tuning Log` note tracking every `platform_config` value and the instrumentation event that should justify changing it later.

## Obsidian tags to use

`#moderation` + phase tag on every note this role produces.
