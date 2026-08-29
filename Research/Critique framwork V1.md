
# Compile the framework for Critique with all the datas discussed and the parameters

Here is the complete, compiled Critique Space framework — pulling together everything discussed across post structure, growth signals, notification design, and progressive disclosure, mapped against Atelier's existing schema and principles.

## 1. Core Philosophy

Critique is not a comment section — it is a structured improvement record where feedback visibly turns into revised work, and the thread itself becomes a case study for future learners. The test for every parameter below is the same: does it make the user feel "I am learning and improving here," or does it just add noise.[^1]

## 2. Post Structure — Required \& Optional Fields

| Field | Type | Status | Source |
| :-- | :-- | :-- | :-- |
| Title | Text | Required | [^2] |
| What are you working on (context) | Text | Required | [^2] |
| Project description | Rich text | Required | [^2] |
| What feedback are you looking for | Text — the CTA | Required | [^2] |
| Images | Upload, min 1 | Required | [^2] |
| Studio | Dropdown | Required | [^2] |
| Software used | Multi-select | Optional | [^2] |
| Tags | Up to 5 | Optional | [^2] |
| Self-analysis (what's working / weak / unsure) | Text prompts | Progressive — 1 question at Layer 1, full 6 at Layer 2 | [^1] |

## 3. Iteration \& Version Data Model

Backed by the existing `CritiqueIteration` schema — each version is a discrete, timestamped record, not just a new image:[^2]

- `iterationNumber` — sequential version count (v1, v2, v3...)
- `description` — mandatory "what changed" note per version
- Linked attachments via `Attachment.iterationId`
- `currentIteration` field on the parent Post tracks the live version count[^2]

**Enhancement discussed:** each version description should be expanded from a single line into three parts — what changed, why it changed (which critique triggered it), what still needs work. This turns the version log into a decision record, not just an image swap.

## 4. Critique Response \& Recognition Loop

| Mechanic | Field/System | Purpose |
| :-- | :-- | :-- |
| Mark as Helpful | `Comment.isHelpful` | Author flags which feedback mattered [^2] |
| Reactions | Inspired / Insightful / Precise | Richer than upvote, signals feedback quality [^2] |
| Critic re-engagement | Notification trigger on new version | Pulls original critics back into the thread |
| Honor for critique | +5 comment on critique, +8 if marked Helpful | Rewards quality over volume [^2] |

## 5. Growth Meter — "Iteration Depth Score"

Lives on the post, not just the profile, so it means something to anyone reading the thread:


| Signal | Weight |
| :-- | :-- |
| Version count | Low |
| Critique response rate (% feedback acknowledged) | High |
| Decision documentation (did author explain why) | High |
| Community re-engagement (did critics return) | Medium |
| Time between versions (reflection, not rushing) | Low |

This score only activates at Layer 3 of progressive disclosure, once a real v1→v2 transition exists — never shown as an empty "0" to a brand-new post.

## 6. Post Labels

| Label | Trigger |
| :-- | :-- |
| Needs First Look | v1, zero critique yet |
| Active Critique | Live, seeking feedback |
| Resolved | Author marked arc complete |
| Case Study | Auto-promoted, fully documented, multi-version arc |

## 7. Notification \& Nudge Architecture

To avoid the notification dump problem raised earlier, nudges are tiered, not fired per-thread in real time:[^3][^4]


| Tier | Examples | Delivery |
| :-- | :-- | :-- |
| Immediate | Reply received, critique response on your version | Real-time, in-app + push [^2] |
| Digest-only | Stalled project nudge, weekly cohort activity | Batched weekly, in-app + digest email [^2] |

Stalled threads (7+ days, 3+ critiques, no v2) surface in a persistent "Continue Your Work" home panel rather than the notification bell — no accumulation, no per-project spam.[^5]

## 8. Progressive Disclosure Layers

| Layer | Honor Threshold | What Unlocks |
| :-- | :-- | :-- |
| 1 — Newcomer | 0 | Minimal post form, 1 self-analysis question, no stats visible [^2] |
| 2 — Contributor | 25+ | Full self-analysis, "post revised version" button, Mark Helpful [^2] |
| 3 — Rising | 100+ | Iteration Depth Score activates, stats panel, Spotlight eligibility [^2] |
| 4 — Active | 250+ | Chapter/Learning Path creation, cross-project growth comparisons, editorial Case Study eligibility [^2] |
| 5 — Established+ | 500–1000+ | Organize critique-session Events, Challenge judging, Studio-level aggregate stats [^2] |

## 9. Cohort \& Case Study Layer

- **Crit Week clustering** — lightweight grouping of same-Studio critiques posted in a similar window, discoverable without a rigid cohort system
- **Most Improved (editorial, not leaderboard)** — one featured improvement arc per Studio per week, selected by Iteration Depth Score + re-engagement, not raw votes
- **Case Study auto-promotion** — resolved, multi-version, well-documented threads move into a dedicated Studio archive, reusing the existing `CuratedCollection` and `LearningPath` schema[^2]


## 10. Anti-Passivity Safeguard

If a thread stalls (7+ days, 3+ critiques, no revision), a private, non-punishing digest nudge fires — never public shaming, never a real-time push — asking the author to share even one takeaway, keeping the critique-response loop honest without pressuring the user.[^1]

This framework is fully backed by Atelier's existing `Post`, `CritiqueIteration`, `Comment`, and `Honor` schema, so nothing here requires new architecture — only new logic layered on top of what's already modeled.[^2]

<div align="center">⁂</div>

[^1]: Atelier-Principles.md

[^2]: avi1-1.md

[^3]: https://docs.suprsend.com/docs/best-practices-for-batching-digest

[^4]: https://knock.app/template-library/workflows/alert-digest

[^5]: https://www.workmate.com/blog/notification-styles-compared-nudges-digests-blocks-ee388

