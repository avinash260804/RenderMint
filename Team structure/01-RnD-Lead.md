---
tags: [atelier, rnd, role-note]
created: 2026-08-29
---

# R&D Lead — Head of Research & Behavioral Design

← back to [[00-Atelier-Team-Structure-MOC]] · hands off to [[04-Management-Idea-Lead]] for product framing, to [[02-Technical-Lead]] for buildability

## Mission

Own the question *"is this true to what Atelier is supposed to be?"* — protect the ideology (structured creative ecosystem, Beginner First, Progressive Disclosure, Knowledge over Virality) from quietly eroding into generic-forum behavior as the product gets built. This is the role most directly descended from your whiteboard note under Phase 1: *"Find & Debug behaviour → Iterate on behaviour towards ideology."*

## Primary phase ownership

**Phase 1 — Space Behavior Implementation (Primary)**
- Define entry/action/response/outcome/state logic for each space, in the order Discussion → Critique → Resource → Showcase → Odyssey.
- For each space, write the behavioral spec *before* Technical starts building — this is the "Find & Debug behaviour" loop: propose behavior, stress-test it against edge cases (what does a beginner do wrong here? what does an experienced user try to game?), revise, then hand to Technical.
- Own the 10-part framework blueprint documents (Critique.md / Resources.md / Showcase.md already exist — you own writing the missing `DISCUSSION_FRAMEWORK.md` and formalizing Odyssey's definition).

**Phase 3 — Cross-Space Coherence (Primary, shared with Management)**
- Design the actual transition logic behind every "Move to Critique" / "Save as Resource" / "Publish to Showcase" moment — trigger conditions, what data transfers, what stays linked vs. duplicated.
- Own the resolved graduation and reopening models (three-path Critique→Showcase trigger; three-state Showcase reopening) as living rules — you're the one who revises them when real usage data contradicts the current thresholds.

## Secondary / consulted

- **Phase 0:** sanity-check that each space's framework contract actually encodes distinct behavior, not just a distinct label.
- **Phase 2:** review onboarding content so it teaches the platform's actual behavioral model, not a generic "here's how to post" tour.
- **Phase 4:** define the *philosophy* behind reputation ("value created for others, not raw volume") — Support & Moderation then turns that into enforceable rules.

## Whiteboard research question owned

**"Community sourcing?"** — how does Atelier get its first real critiques, resources, and showcased work without the classic empty-community cold-start problem? This sits with you because it's a behavioral-design question (what's the smallest loop that feels alive with 20 users?) before it's a marketing question.

## Immediate next actions

1. Write `DISCUSSION_FRAMEWORK.md` using the existing 10-part blueprint — this is the single most-cited documentation gap across every prior analysis.
2. Draft the state-machine spec (entry → action → response → outcome → state) for **Discussion only**, since it's first in the recommended build order — hand to Technical as soon as it's stable enough to stop changing weekly.
3. Start a `Community Sourcing` note answering: what's the first 10 pieces of seed content, who creates them, and what behavior are you trying to prove works before opening to real users?

## Obsidian tags to use

`#rnd` + phase tag (`#phase1`, `#phase3`, etc.) on every note this role produces.
