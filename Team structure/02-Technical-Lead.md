---
tags: [atelier, technical, role-note]
created: 2026-08-29
---

# Technical Lead — Head of Engineering & Architecture

← back to [[00-Atelier-Team-Structure-MOC]] · takes behavior specs from [[01-RnD-Lead]] · takes moderation/quality requirements from [[03-Support-Moderation-Lead]]

## Mission

Own the question *"can we build this, and will it hold up?"* — turn behavioral and product decisions into a space-aware architecture, then into working screens, without silently reintroducing "generic posts + comments" because it's the path of least resistance.

## Primary phase ownership

**Phase 0 — Framework Integration (Secondary, but do the technical prep work now)**
- Refactor route logic, data logic, and content logic to be space-aware from the start — the exit criterion is explicit: *"the system no longer depends on generic content assumptions as its primary model."* This is the phase where the temptation to build one generic `Post` schema is strongest; resist it per the framework's own warning.

**Phase 1 — Space Behavior Implementation (Primary, with R&D)**
- Build Discussion end-to-end first (per the recommended order: Discussion → Critique → Resource → Showcase → Odyssey), working directly from R&D's behavioral spec.
- Implement the reference-edge data model (`source_type`, `source_id`, `target_type`, `target_id`, `relation`) before building individual cross-space features — this is what stops every new connection type from becoming its own schema migration later.

**Phase 5 — Pre-UI Translation (Primary)**
- Produce the screen inventory, state inventory (first visit / empty / active / resolved / promoted / archived / blocked / guided), and interaction inventory per space.
- This phase exists specifically so UI work in Phase 6 is *translating* stable decisions, not inventing structure live — don't let Phase 6 start until this is genuinely stable.

**Phase 6 — UI Implementation (Primary)**
- Build from the Phase 5 inventories. Preserve progressive disclosure and beginner-first patterns at the component level, not just the page level.

## Secondary / consulted

- **Phase 2:** build onboarding, profile, dashboard, creation flow, moderation checkpoints — working from Management's UX purpose statements and Support & Moderation's checkpoint logic.
- **Phase 3:** implement the transition mechanics (conversion buttons, backlinks, promotion states) R&D designs.
- **Phase 4:** implement the scoring/threshold engine (Honor breakdown, progressive disclosure gates) once Management and Support & Moderation define the rules.

## Whiteboard research question owned

**"Security concerns & hosting?"** — own this alongside every other technical decision from Phase 0 onward, not as an afterthought before launch. Loop in Support & Moderation on anything touching user data or trust (auth, moderation-action logging, report handling).

## Immediate next actions

1. Set up the space-aware architecture skeleton (Phase 0) — even a minimal version prevents the biggest structural risk named across every prior document: Discussion and Critique quietly collapsing into one schema.
2. Stand up the reference-edge table now, even before most cross-space features exist — it's cheap to add early and expensive to retrofit.
3. Start a `Hosting & Security` note capturing decisions as they're made (auth approach, data retention, moderation-action audit trail) so it isn't reconstructed from memory later.

## Obsidian tags to use

`#technical` + phase tag on every note this role produces.
