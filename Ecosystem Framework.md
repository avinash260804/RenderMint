# Designers Hub — Cross-Space Ecosystem Architecture
### A Product Systems Research Document

**Scope:** How Discussion, Critique, Resource, Showcase, Odyssey, Profile, and Honor operate as one connected creative ecosystem, rather than five independent sections.

**Labeling key used throughout:**
- **[SOURCE]** — explicitly stated in the provided framework documents (Critique.md, Profile.md, Resources.md, Showcase.md, the Framework Catch-Up summary, the Discussion/Critique screenshot)
- **[INFERENCE]** — a logical extension derived from those documents
- **[RESEARCH]** — a pattern drawn from comparable external platforms
- **[RECOMMENDATION]** — a proposed product decision, offered for validation, not a settled fact

---

## 1. Executive Summary

Designers Hub is currently well-specified at the level of **individual spaces** — Critique, Resource, and Showcase all have mature, detailed frameworks; Profile has a strong identity model; Discussion and Odyssey are comparatively underspecified **[SOURCE, per Framework Catch-Up §14]**. What is missing is not another space definition — it is the **connective tissue**: the rules that govern when content, credibility, and attention move from one space to another.

The core finding of this research is that Designers Hub does not need five independently excellent sections. It needs **one coherent loop** that a beginner can feel even if they never think about it explicitly:

```
ask → discuss → do the work → get feedback → iterate → finish → show it →
be seen → be trusted → help someone else → repeat
```

Every space in the product is a station on that loop. The system succeeds when moving from one station to the next feels like *continuing the same project*, not *starting over in a different app*.

The smallest version of this loop that still feels different from a generic forum is:

**Discussion ↔ Critique, Critique → Showcase, Discussion ↔ Resource, everything → Profile, all genuine contribution → Honor.**

That is the MVP boundary developed in §23. Everything else (Odyssey as a true discovery graph, automated resource extraction, endorsement-driven mentorship discovery) is real product value, but it is **Phase 2+**, not launch-critical.

---

## 2. Current Framework Interpretation

**[SOURCE]** Designers Hub is explicitly *not* "Reddit/Discord/Behance for designers." It is a structured creative ecosystem where different kinds of participation have different purposes, behaviors, outcomes, and progression paths (Framework Catch-Up §1).

The five spaces map to distinct jobs:

| Space | Job | Fundamental unit |
|---|---|---|
| Discussion | Ask, discuss, exchange knowledge, form community | A thread |
| Critique | Improve actual work through structured feedback | An improvement cycle (v1 → v2 → v3 → resolved) |
| Resource | Preserve reusable knowledge | A contextualized reference |
| Showcase | Present finished work, build credibility | A graduated project |
| Odyssey | Discover and navigate the ecosystem | Not yet concretely defined — see §10 |
| Profile | Record identity, contribution, growth, credibility | A trust-then-proof narrative |
| Honor | Convert contribution into trust and permission | A weighted, source-attributed score |

**[INFERENCE]** The one architectural decision that everything else depends on: Discussion and Critique must never collapse into "posts + comments" with a category filter. The screenshot distinction (Discussion = "how do I approach this?", Critique = "review this specific work through defined stages") has to be enforced at the *data model* level (different schemas, different lifecycle states), not just the UI label level, or the differentiation erodes the first time someone builds a generic post composer for both.

---

## 3. Ecosystem Relationship Map

A qualitative map of which pairs are strong, weak, or intentionally absent.

| | Discussion | Critique | Resource | Showcase | Odyssey | Profile | Honor |
|---|---|---|---|---|---|---|---|
| **Discussion** | — | Strong (promotion) | Strong (extraction) | Weak (indirect only) | Strong (surfacing) | Medium (contribution log) | Medium |
| **Critique** | Strong (backlink) | — | Medium (suggested reading) | Strong (graduation) | Medium (surfacing) | Strong (growth narrative) | Strong |
| **Resource** | Strong (contextual suggestion) | Medium | — | Weak (rare) | Strong (recommendation) | Medium (saved/contributed) | Medium |
| **Showcase** | Weak (should not become a comment feed) | Strong (iteration history) | Weak | — | Strong (inspiration surfacing) | Strong (portfolio) | Medium |
| **Odyssey** | Consumes | Consumes | Consumes | Consumes | — | Consumes | Consumes (as a signal) |
| **Profile** | Aggregates | Aggregates | Aggregates | Aggregates | Surfaces from | — | Displays |
| **Honor** | Awards | Awards (heaviest weight) | Awards | Awards | Weighting signal | Displayed on | — |

**[RECOMMENDATION]** Two pairs deserve explicit "do not force" treatment:
- **Showcase ↔ Discussion**: Showcase should not grow comment threads that duplicate Discussion. Reactions, yes; open-ended debate, no. If a Showcase piece provokes real discussion, that should spin out as a *linked* Discussion thread, not inline comments competing with Critique's structured feedback model.
- **Resource ↔ Showcase**: a finished project is not itself a resource, and pulling Resource content directly into Showcase pages risks turning the portfolio gallery into a link dump. The two should connect through Odyssey ("built using this technique") rather than a direct embed.

---

## 4. Cross-Space Connection Matrix

For each pair below: **why connect, what flows, trigger, connection type, what user sees, backend effect.**

### Discussion → Critique
- **Why:** A discussion that turns into "please look at my actual work" is really a critique request wearing a discussion's clothes. **[SOURCE]** the screenshot already names this: *"Move to Critique."*
- **Trigger:** Author posts an image/attachment mid-thread and asks for feedback, OR the system detects feedback-seeking language plus an attachment. **[INFERENCE]**
- **Type:** Suggested, author-confirmed — never automatic. A false positive here (converting a casual "what do you think of this sketch" into a formal structured critique) would feel heavy-handed. **[RECOMMENDATION]**
- **What transfers:** Original post text → pre-filled `projectDescription`; attachments → `iteration v1`; the asking user is set as author; **[RECOMMENDATION]** existing replies are *not* migrated as critique feedback (different schema — a casual reply is not a structured "What works / What could improve / Suggestion" response). Instead, the original Discussion thread is preserved and gets a "Continued in Critique →" banner, and the new Critique post gets a "Started from this discussion" backlink.
- **User sees:** A "Turn this into a Critique" CTA appearing once an attachment + feedback-seeking signal exist; after conversion, both threads show a linking banner rather than one replacing the other.
- **Backend:** New `Post.postType = critique` created with `sourceDiscussionId`; original discussion gets `linkedCritiqueId`; no data deleted.

### Discussion → Resource
- **Why:** **[SOURCE]** This is the explicit "knowledge flywheel" — a good answer becoming a reusable Resource (Framework Catch-Up §7).
- **Trigger:** A reply is marked as the accepted/canonical answer, or accumulates a high helpful-mark ratio. **[INFERENCE, extending the Critique space's `isHelpful`/`isCanonical` pattern from Critique.md §5]**
- **Type:** Suggested to the answer's author or to moderators/mentors — "Convert to Resource." Optional, not automatic, because a good answer to a narrow question is not automatically well-formed as a standalone reference. **[RECOMMENDATION]**
- **What transfers:** Answer text becomes the resource body; asker's original question becomes context ("what problem does this solve"); tags and Studio carry over.
- **User sees:** A "Save as Resource" action on high-quality replies (visible once helpful threshold is hit); the resulting Resource shows "Originated from this discussion →."
- **Backend:** New `Resource` entity with `sourceCommentId`; discussion thread gets a `relatedResourceIds[]` badge.

### Discussion → Showcase
- **Why:** Weak, indirect. Discussion should not have a direct "publish to Showcase" path — that would let unfinished, undocumented work skip the improvement loop that makes Showcase credible. **[RECOMMENDATION]**
- **What should happen instead:** Discussion → Critique → Showcase (see below). If someone posts finished work directly in Discussion, the system should nudge "Looking to showcase this? Publish it →" rather than silently allowing Discussion to become a second Showcase feed.

### Discussion → Odyssey
- **Why:** Discussion is a primary discovery input — "what's being talked about in this Studio right now."
- **Type:** Automatic, algorithmic surfacing (Odyssey consumes, does not need permission from Discussion). **[INFERENCE]**
- **What flows:** Thread velocity, tag co-occurrence, cross-Studio topic drift.

### Critique → Discussion
- **Why:** A critique thread can spark a broader conceptual debate that doesn't belong inside the structured iteration record. **[SOURCE — image annotation: "Critique threads can surface a lightweight discussion link-back... so insights don't get siloed, but the critique record itself stays clean and immutable as documentation."]**
- **Type:** Optional, user-initiated ("Discuss this further").
- **What transfers:** A link back, not a fork of the critique thread itself. The critique record must stay immutable/clean. **[SOURCE]**

### Critique → Resource
- **Why:** **[SOURCE, Framework Catch-Up §7]** Recurring critique feedback patterns are a strong signal of a missing Resource ("everyone tells beginners the same three things about contrast — that should be a Resource, not a repeated comment").
- **Trigger:** A specific piece of structured feedback is marked Helpful across multiple, unrelated critique threads. **[RECOMMENDATION]**
- **Type:** Suggested to mentors/moderators, not automatic — pattern detection surfaces a candidate, a human decides it's worth generalizing.
- **What transfers:** The feedback text becomes a draft Resource body; the moderator/mentor adds the "who is this for / how to use it" context Resources require **[SOURCE, Resources.md — every resource must explicitly answer what/who/when/how]**.

### Critique → Showcase
- **Why:** **[SOURCE]** This is the single most important transition in the product — it's the literal definition of "Critique = becoming, Showcase = arrived" (Framework Catch-Up §6).
- **Trigger candidates [open question, see §25]:** resolved status set by author, minimum iteration count (Critique.md's own Case-Study auto-promotion logic references "3+ iterations, resolved" **[SOURCE, Critique.md §7]**), or moderator promotion.
- **Type:** User-initiated publish action, gated by a **quality gate, not an Honor gate** — **[SOURCE, Showcase.md §7]** *"Publish a project — Any user who completed a Critique cycle — Quality gate, not an Honor gate."*
- **What transfers:** Final iteration image(s) become the Showcase hero image; the full iteration history transfers as linked "Iteration History" **[SOURCE, Showcase.md §6]**, viewable via a before/after toggle **[SOURCE, Showcase.md §5]**; original critics are notified and can be credited/tagged.
- **User sees:** After a critique is marked resolved, a "Publish to Showcase" CTA appears; on the Showcase project page, an iteration/before-after toggle exposes the critique history to interested viewers without cluttering the primary gallery view **[SOURCE, Showcase.md §7 progressive disclosure]**.
- **Backend:** `ShowcaseProject` created with `sourceCritiqueId`; critique thread gets `promotedToShowcaseId`; Honor event fires for both author and top contributing critics.

### Critique → Profile
- **Why:** **[SOURCE]** This is explicitly one of Profile's differentiators — the "Critique Iteration Preview" showing before/after thumbnails (Profile.md §Layout Hierarchy #10).
- **Type:** Automatic aggregation.

### Resource → Discussion / Critique
- **Why:** **[SOURCE, Resources.md — Entry States]** "From a discussion or critique thread (side panel suggestions: 'Resources related to this topic')."
- **Type:** Suggested, tag/stage-based, surfaced contextually — **[SOURCE, Resources.md First-Time Journey]** "the post-creation flow suggests 1–3 relevant resources based on tags and stage."

### Resource → Showcase
- **Why:** Weak by default (§3), but there is one legitimate non-obvious version: a Showcase project's detail page could cite "resources used" if the creator opts to attach them, giving Resources a discovery credit without Showcase becoming resource-cluttered. **[RECOMMENDATION, see §17 idea #2]**

### Resource → Odyssey
- **Why:** Resources are a natural graph node — "people who used this resource," "projects built after reading this."
- **Type:** Automatic, algorithmic.

### Showcase → Critique
- **Why:** A published project can still invite *new* critique on a next iteration (a v4 after "resolved") — but this should require deliberate reopening, not silent mutation of a graduated piece. **[RECOMMENDATION]**

### Showcase → Resource
- **Why:** Weak/rare — see §3. The one legitimate case is a moderator/mentor converting an exceptional project's process write-up into a Case Study Resource (distinct from the Showcase's own Case Study content type in Critique.md §6 — these are two different "Case Study" concepts that need disambiguating; see §25 open question).

### Showcase → Discussion
- **Why:** Weak/intentionally limited (§3) — reactions only by default; a "Discuss this" spin-out link is the escape valve for real conversation.

### Showcase → Profile
- **Why:** **[SOURCE]** Every Showcase piece feeds directly back into the creator's Profile (Showcase.md §Purpose).
- **Type:** Automatic.

### Odyssey → all spaces
- **Why:** Odyssey is a **consumer**, not a producer, of the other four spaces' structured relationships — see full treatment in §10.

### Profile → all spaces
- **Why:** Profile is where a viewer decides whether to trust content from any space; it is also the entry point back into "continue this work" across spaces (the Critique framework's "Continue Your Work" panel **[SOURCE, Critique.md §5]** is effectively a Profile-adjacent surface).

---

## 5. Content Lifecycle Models

**[RECOMMENDATION]** Three lifecycle models are worth formalizing; a fourth (Showcase → Inspiration → Discussion) should be rejected as unnecessary complexity.

### Model A — Knowledge Lifecycle (valuable)
```
Question → Discussion Answer → marked Helpful/Canonical → Resource → discovered via Odyssey → better question
```
States: `Draft → Published → Active → Resolved → Promoted (linked, not migrated) → Archived`

### Model B — Work Lifecycle (valuable, already the strongest part of the product)
```
Work v1 → Feedback Requested → Iteration → ... → Resolved → Showcase → Profile
```
States: `In Progress → Needs Revision → Resolved → Promoted → Canonical (if used as a teaching example)`

### Model C — Insight Lifecycle (valuable, lighter-weight than A)
```
Recurring critique feedback pattern → flagged by mentor/moderator → generalized into Resource
```

### Model D — Showcase → Inspiration → Discussion (reject as default, keep as manual escape valve only)
Automatically spawning Discussion threads from Showcase reactions would flood Discussion with low-context "nice work!" chatter and undermine the "town square for real conversation" positioning. **[RECOMMENDATION]** Keep this possible only via an explicit "Discuss this" action, never automatic.

**On promotion semantics:** Across all models, **[RECOMMENDATION]** promotion between spaces should default to **linking + light transformation**, not migration or duplication. The Critique → Showcase transition is the exception, where genuine transformation (structured critique data → gallery-optimized presentation) is appropriate because the two spaces render fundamentally different views of the same underlying work. Discussion → Resource similarly transforms (a conversational answer becomes a structured reference) but always keeps the backlink. Nothing should be *deleted* from its origin space when it is promoted — history is a feature, not clutter, consistent with the "documented improvement" principle **[SOURCE, Critique.md §1]**.

---

## 6–9. Space-by-Space Integration Summary

*(Full internal frameworks already exist in Critique.md, Resources.md, Showcase.md, Profile.md. This section adds only the cross-space contract for each.)*

**Discussion Integration [INFERENCE — Discussion has no dedicated framework doc yet; this is the biggest documentation gap alongside Odyssey]:** Discussion's contract with the rest of the system is: (1) it must offer a low-friction path *out* toward Critique when actual work appears, (2) it must offer a low-friction path *out* toward Resource when a reusable answer appears, (3) it must resist becoming a landing zone for content that belongs elsewhere. Recommend a companion `DISCUSSION_FRAMEWORK.md` using the same 10-part blueprint before further build-out.

**Critique Integration:** Already the strongest-specified space **[SOURCE, Framework Catch-Up §5]**. Its external contract is well defined: receives from Discussion, sends to Showcase and Resource, feeds Profile's growth narrative directly.

**Resource Integration:** Positioned correctly as "platform memory," not a bookmark manager **[SOURCE, Resources.md Purpose]**. Its external contract: receive from Discussion and Critique (with human curation as the gate), surface into Discussion/Critique creation flows contextually, feed Odyssey as a graph node.

**Showcase Integration:** Positioned correctly as "arrived" work **[SOURCE, Showcase.md Purpose]**. Its external contract: receive only from completed Critique cycles (quality gate, not Honor gate), feed Profile automatically, feed Odyssey as inspiration, and deliberately resist becoming a second comment surface.

---

## 10. Odyssey — Definition and Integration

**[SOURCE]** Odyssey is explicitly the least concretely defined space in the current documentation (Framework Catch-Up §14, and the research prompt itself flags this).

**[RESEARCH → RECOMMENDATION]** Of the candidate interpretations (discovery engine, recommendation feed, content graph, learning-journey layer, people-discovery), the one that best fits the existing framework is: **Odyssey is a relationship-graph-driven discovery layer, not a content repository.** It should hold no primary content of its own — every node it surfaces (a discussion, a critique, a resource, a showcase project, a person) is owned by another space. Odyssey's job is exposing *paths between* nodes that the other spaces' owners never had to think about.

**Example (from the research prompt, validated as the right model):** viewing an architecture Showcase project, Odyssey can surface: the critique history behind it → resources the creator referenced → similar projects in adjacent Studios → people who solved similar structural problems → a relevant Learning Path. This is a **graph traversal**, not a "users who liked this also liked" feed. **[RECOMMENDATION]**

**Minimum viable Odyssey (see §23):** direct discovery only — same Studio, same tags, "from this discussion/critique/resource" backlinks already generated by the transitions in §4. Adjacent and "unexpected" discovery (the three-tier model Showcase already references — Direct → Adjacent → Unexpected, **[SOURCE, Showcase.md §Progressive Disclosure]**) is Phase 2 once enough cross-space edges exist to make the graph meaningful.

---

## 11. Profile Integration — System Memory

**[SOURCE]** Profile already has a well-designed "trust-then-proof" hierarchy (Profile.md). Its cross-space job is aggregation without becoming a cluttered activity log **[SOURCE, Framework Catch-Up §8, "How can Profile avoid becoming a cluttered activity log?"]**.

**[RECOMMENDATION]** Resolve this by two rules:
1. **Chronological vs. summarized split** — raw activity (every comment, every reaction given) stays chronological and low-visual-weight in Content Tabs; *meaningful* activity (resolved critiques, published Showcase pieces, canonical answers, curated resources) gets promoted to permanent, visually prioritized evidence blocks (Achievements, Critique Iteration Preview, Spotlight Link — all already specified in Profile.md).
2. **Private vs. public** — saved-but-not-contributed items (personal Resource library, bookmarked threads) stay private by default; anything that involved public contribution is public.

---

## 12. Honor / Progression Integration

**[SOURCE]** Honor already has the right philosophy stated: *value created for the community → credibility → increased responsibility → greater visibility*, not *activity → points → leaderboard* **[SOURCE, Framework Catch-Up §9]**.

**[INFERENCE]** Cross-space Honor sourcing, consistent with each space's own success metrics:

| Space | Honor-worthy action | Honor should NOT reward |
|---|---|---|
| Discussion | Answer marked helpful/canonical | Raw post/comment volume |
| Critique | Feedback marked Helpful; iteration completed; thread resolved | Giving lots of low-effort reactions |
| Resource | Resource published and later marked helpful by others | Submitting resources nobody uses |
| Showcase | Project published (small); high-quality reaction ratio (Inspired/Insightful/Precise) **[SOURCE, Showcase.md §Success Metrics]** | Raw view/like counts — explicitly rejected as a headline KPI **[SOURCE, Showcase.md §Success Metrics: "Knowledge over Virality"]** |
| Cross-space | Endorsements from higher-Honor members; mentorship actions | Mutual/reciprocal voting rings — already flagged as an anti-gaming concern in Critique.md §9 |

**[SOURCE]** The Member → Contributor → Critic → Expert → Mentor progression **[SOURCE, Profile.md Progressive Disclosure Ladder]** already implies each space contributes differently at each tier — Critique's own Honor-range table **[SOURCE, Critique.md §2]** is the most granular existing model and should become the template the other spaces' user-type tables are normalized against.

---

## 13. Global Progressive Disclosure Model

**[SOURCE]** Progressive disclosure already recurs independently across Critique, Resource, Showcase, and Profile **[SOURCE, Framework Catch-Up §10]**. The research confirms this should become one shared global ladder rather than four independently invented ones.

**[RECOMMENDATION]** A single Honor-keyed disclosure table, referenced by every space instead of redefined:

| Tier | Honor | Global unlocks |
|---|---|---|
| Newcomer | 0–24 | Minimal creation forms, browsing, reactions everywhere, Discussion posting |
| Contributor | 25–99 | Full self-analysis forms, Resource submission, iteration uploads, Mark Helpful |
| Rising/Critic | 100–249 | Score/metrics visibility (Iteration Depth Score, Honor Breakdown detail), Case Study eligibility |
| Active/Expert | 250–499 | Curation powers (Learning Paths, Resource collections), Showcase Featured eligibility signals |
| Established/Mentor | 500–1000+ | Events, Challenge judging, endorsement powers, cross-Studio moderation-adjacent trust actions |

Each space's existing table (Critique.md §8, Resources.md's three-layer model, Showcase.md's three-layer discovery model, Profile.md's ladder) should map onto this shared spine rather than each maintaining independent Honor thresholds that can drift out of sync.

---

## 14. Cross-Space User Journeys

**A. First-time student:** Studio join → Beginner Starter Resources block **[SOURCE, Resources.md]** → browses Discussion town square → asks a first question → Odyssey/contextual suggestion surfaces a relevant Resource → next action: post first Critique request.

**B. Student seeking critique:** Creation menu → selects Critique **[SOURCE, Critique.md §4]** → minimal form + one self-analysis question → publishes → gets first reply → uploads v2 → re-engagement loop → resolved → prompted to publish to Showcase.

**C. Experienced designer contributing knowledge:** Answers a Discussion question well → answer marked Canonical → prompted "Save as Resource" → Resource published → later surfaces contextually to new users → Honor accrues from downstream helpful-marks, not from the original answer alone.

**D. Designer publishing finished work:** Critique thread resolved → "Publish to Showcase" CTA → minimal first-publish friction (image + one-line intent, no forced case-study **[SOURCE, Showcase.md §First-Time Journey]**) → Profile auto-updates → Odyssey begins surfacing the piece to relevant adjacent Studios.

**E. Mentor helping others:** Notified of a stalled critique via "Continue Your Work"-adjacent mentor surfacing → gives structured feedback → marked Helpful → later organizes a critique-session Event **[SOURCE, Critique.md §2, 500+ Honor]** → Profile Mentor badge visible **[SOURCE, Profile.md ladder]**.

**F. User exploring a new discipline:** Enters via Odyssey → sees direct (same-Studio) then adjacent (cross-Studio) content → follows a new Studio → onboarding-lite repeats for that Studio only, not the whole platform again.

**G. User returning after weeks:** Lands on a digest surfacing "Continue Your Work" nudges **[SOURCE, Critique.md §5]** and Profile-relevant updates (new endorsement, reply to an old thread) rather than a generic activity feed.

**H. Beginner → trusted contributor:** Newcomer (0 Honor, minimal forms) → Contributor (25+, full forms, resource submission) → Rising (100+, sees own growth metrics) → publishes first Showcase piece → Active (250+, curation powers) → Established/Mentor (500+, judges, organizes, endorses) — this arc is the entire point of the Progressive Disclosure ladder in §13, made concrete.

---

## 15. Event-Driven Connections

| Event | Automatic | Suggested/user-facing | Notification | Honor impact |
|---|---|---|---|---|
| Post receives several high-quality answers | Flag as candidate for Resource extraction | "Save as Resource" CTA to author/mods | Author notified of milestone | Small, per canonical answer |
| Critique receives first response | Unlock Mark Helpful + revision upload **[SOURCE, Critique.md §4]** | — | Author notified | None yet (Honor on Helpful mark, not first reply) |
| Critique receives new iteration | Notify original critics **[SOURCE, Critique.md §4]** | Re-engagement nudge | Critics notified | Small re-engagement bonus |
| Project becomes resolved | — | "Publish to Showcase" CTA | Author notified | Moderate, on publish |
| Resource becomes highly useful | Surface more prominently in contextual suggestions | Mentor "endorse" prompt | Contributor notified | Small, ongoing per helpful-mark |
| User earns new Honor level | Unlock next disclosure tier (§13) | Profile badge appears | User notified | — |
| Project receives strong Precise/Insightful reactions | Weight into Featured-rotation eligibility | — | Author notified at threshold | Small |
| User follows a new discipline | Odyssey begins surfacing that Studio | — | — | — |
| Discussion becomes inactive | Archive state after inactivity window | — | No notification (avoid nagging) | — |
| Resource becomes outdated | Flag for review (age + declining helpful ratio) | Moderator "Needs revision" prompt **[SOURCE, Resources.md §Moderation]** | Contributor notified | None (protective, not punitive) |

---

## 16. Data / Information Architecture

**[INFERENCE, consolidating entities named across all four documents]**

Core entities: `User`, `Profile`, `Studio`, `Post` (parent of `Discussion`, `Critique`), `CritiqueIteration` **[SOURCE, Critique.md §5]**, `Comment` (with `isHelpful`/`isSolution`/`isCanonical` flags **[SOURCE, Critique.md §5]**), `Resource`, `ResourceCollection`, `ShowcaseProject`, `ProjectIteration`, `Tag`, `Software`, `Reaction`, `Endorsement`, `HonorEvent`, `Achievement`, `Event`, `LearningPath`, `Notification`, `ModerationAction`.

**Key relationship design principle [RECOMMENDATION]:** `Post` should be a shared parent type for Discussion and Critique content (both are "something a user published"), but they must **not** share a body schema — Critique needs `projectDescription`, `feedbackRequested`, `currentIteration` fields that Discussion has no use for **[SOURCE, Critique.md §5 Data Model]**. This is a single-table-inheritance-with-divergent-required-fields situation, not a shared form.

Cross-space linking should use a consistent **reference-edge table** (`source_type`, `source_id`, `target_type`, `target_id`, `relation` — e.g. `promoted_from`, `derived_from`, `linked_to`) rather than adding a new nullable foreign key to every entity every time a new connection type is invented. This is what makes §17's "generate new connections" exercise cheap to prototype rather than a schema migration each time.

**Avoid duplication:** a project, person, tag, or Studio referenced from Discussion, Critique, and Showcase must be the *same row*, joined via the edge table above — never re-entered per space. This directly serves the "cross-space coherence" principle already named in the roadmap **[SOURCE, Framework Catch-Up §3]**.

---

## 17. Content Graph Model

**[RESEARCH → RECOMMENDATION]** Designers Hub is well-suited to being understood as a graph, but only a **partial** one at MVP — a small set of explicit, high-value edges, with algorithmic inference layered on top only once real data exists.

**Explicit edges (should be first-class, stored):** `created`, `critiqued`, `revised`, `promoted_from`, `derived_from`, `endorsed_by`, `belongs_to` (Studio), `follows`.

**Inferred edges (computed, not stored as ground truth):** `related_to` (tag/embedding similarity), `inspired` (co-viewed/co-saved patterns), `curated_by` (aggregated from explicit curation actions).

This split matters because explicit edges are cheap to reason about and safe to expose ("built from this critique →"), while inferred edges are where most of the moderation and quality risk lives (§18) and should be treated as recommendations, never presented with the same certainty as an explicit, human-created link.

---

## 18. UX Interaction Patterns

**[SOURCE + RECOMMENDATION]** Contextual, not persistent — these patterns should appear only when the triggering condition is met, never as permanent chrome:

- **"Move to Critique"** — Discussion post detail, when attachment + feedback intent detected **[SOURCE, screenshot]**
- **"Save as Resource"** — on a Comment once Helpful/Canonical, and on a resolved Critique thread with recurring feedback
- **"Related Resources"** — side panel on Discussion and Critique creation/detail, tag-driven **[SOURCE, Resources.md]**
- **"Continue this work"** — Critique detail + digest surface, for stalled iterations **[SOURCE, Critique.md]**
- **"View iteration history"** — Showcase project detail, before/after toggle **[SOURCE, Showcase.md]**
- **"See where this came from"** — any promoted content, linking back to its origin space
- **"Explore similar work"** / **"From this discussion..."** / **"Built from this critique..."** — Odyssey-generated, appearing on Showcase/Resource detail pages
- **"Add to learning path"** — Resource and Critique detail, Active+ Honor
- **"View contributor"** — links into Profile from anywhere content is attributed

**[RECOMMENDATION]** Discipline: no page should show more than 2–3 of these contextual actions at once. If a page qualifies for five, that's a sign the space boundaries are blurring, not a sign the user needs five buttons.

---

## 19. Moderation and Quality Implications

**[SOURCE]** The moderation philosophy is consistent across every existing framework doc: *guide first, correct second, restrict when necessary* **[SOURCE, Critique.md §9, Resources.md §Moderation, Showcase.md §Moderation]**.

Cross-space-specific risks and safeguards **[INFERENCE]**:

| Risk | Where it emerges | Safeguard |
|---|---|---|
| Honor farming via cross-space promotion | Convert-to-Resource / promote-to-Showcase actions | Promotion triggers a moderator/mentor review gate for Honor-bearing actions, not just author self-declaration |
| Low-quality automatic promotion | Any "automatic" edge in §4/§15 | Keep every space-to-space content transition **suggested**, never silently automatic, except pure discovery surfacing (Odyssey) |
| Duplicate/near-duplicate Resources from repeated extraction | Discussion→Resource, Critique→Resource | Reuse Critique's existing 80%+ title-similarity duplicate check **[SOURCE, Critique.md §9]**, applied at Resource creation too |
| Vote/reaction manipulation propagating Honor across spaces | Any Honor-bearing action | Reuse Critique's existing anti-gaming logic (self-reactions don't count, voting-ring detection) **[SOURCE, Critique.md §9]** platform-wide, not Critique-only |
| Unwanted/creepy recommendations | Odyssey | "Unexpected" discovery tier should be opt-in-feeling, not aggressive; no dark patterns nudging toward engagement-maximizing content |

---

## 20. Competitive Pattern Analysis

**[RESEARCH]**

| Platform | Observed pattern | Interpretation | Designers Hub adaptation |
|---|---|---|---|
| Stack Overflow | Canonical answers, duplicate detection, reputation gated privileges | Reputation as *earned trust*, not vanity | Already the model Honor is following; extend the canonical-answer pattern into Discussion→Resource conversion |
| GitHub | Commit history as permanent, visible proof of work | History as credibility, not clutter | Directly mirrored in Critique's iteration history and Showcase's before/after toggle |
| Behance/Dribbble | Portfolio disconnected from process | Finished work with no visible growth story | Explicitly the gap Designers Hub is designed to close — Showcase's iteration-history link is the differentiator **[SOURCE, Showcase.md §Content Types]** |
| Are.na | Loosely-structured connections between saved content (channels, blocks) | Curation as a creative act, not just filing | Applicable to Resource Collections and Odyssey's graph model — connections can be user-curated, not only algorithmic |
| Duolingo/Khan Academy | Visible, gamified progression ladders | Motivating, but risks becoming shallow if disconnected from real skill | Honor's progression ladder should stay anchored to genuine contribution quality, not streaks/volume, to avoid this failure mode |
| Discord | Real-time community energy, but poor content permanence | Great for "town square," terrible for knowledge retention | Confirms Discussion should stay lightweight/fast, while explicitly funneling durable value out to Resource rather than trying to make Discussion itself permanent |
| LinkedIn | Endorsements as lightweight social proof | Low-effort trust signal, prone to reciprocity abuse | Adopt the lightweight endorsement UX, but gate it by requiring a named skill/context (already specified in Profile.md) to avoid LinkedIn's "click to endorse everyone" shallowness |
| Notion/Figma Community | Templates/resources with clear "who this is for" framing | Context-rich sharing outperforms raw link dumps | Directly validates Resources.md's requirement that every resource answer what/who/when/how |

---

## 21. Non-Obvious Connection Opportunities

**[RECOMMENDATION — generated per prompt §17, scored in §22]**

1. **Critique → personalized Resource recommendation** — surface resources based on *specific feedback received*, not just tags. Value: high. Complexity: medium. Risk: low. MVP: yes (simple version).
2. **Resource → "designers who used this"** — reveal Showcase/Critique projects that cited a resource. Value: high (validates resource usefulness). Complexity: medium. MVP: Phase 2.
3. **Showcase project → teaching artifact** — mentor flags an exceptional iteration history as a Learning Path entry. Value: high. Risk: needs consent from original author. MVP: Phase 2.
4. **Discussion answer → Learning Path node** — same mechanism as Resource extraction, one layer up. Value: medium. Complexity: low once Resource extraction exists. Phase 2.
5. **Honor reflecting cross-space help, not single-space activity** — weight Honor by *breadth* of helpfulness (helped in 3 spaces > spammed one space). Value: high, prevents Honor silos. Complexity: medium (needs the Honor Breakdown sub-scores already specified in Profile.md). MVP: yes, using existing 4-part breakdown.
6. **Odyssey dynamically constructing journeys from graph relationships** — "3 stops to go from curious to capable" paths. Value: high long-term. Complexity: high. Phase 2+.
7. **Profile auto-constructing a "growth story"** from critique iterations — narrative summary, not just a thumbnail grid. Value: high, directly serves the professional-identity goal. Complexity: medium. Phase 2.
8. **Repeated questions revealing missing Resources** — frequency analysis on unanswered/duplicate Discussion questions. Value: high (product-informing, not just user-facing). Complexity: low-medium. MVP-adjacent (internal tool, not user-facing).
9. **Repeated critique problems generating new Resource categories** — same idea, Critique side. Value: medium-high. Complexity: medium. Phase 2.
10. **Discovering mentors through problems solved, not profile search** — "who has resolved critiques like mine." Value: high for beginners. Complexity: medium (needs tag-level critique outcome data). Phase 2.
11. **Cross-Studio critique bridging** — a UI/UX critique surfacing a relevant Architecture critique on a shared problem (spacing, hierarchy). Value: medium, differentiator. Complexity: high. Phase 3/experimental.
12. **Resource "staleness" detection from declining helpful-mark rate** — already partly covered in §15/§19. Value: medium (quality maintenance). Complexity: low. MVP.
13. **Showcase Featured rotation informed by Odyssey's discovery graph**, not just raw reactions — surfaces underexposed but high-quality work. Value: medium-high (fairness). Complexity: medium. Phase 2.
14. **Endorsement chains visible on Profile** ("endorsed by X, who was endorsed by Y") — social proof depth. Value: low-medium, risk of feeling cliquish. Complexity: low. Phase 3/experimental — validate demand first.
15. **Event-linked Critique sessions feeding directly into a cohort Showcase drop** — a Workshop Event's submissions gallery **[SOURCE, Critique.md §6, Event-Linked Critique Session]** graduating together. Value: medium, strong community moment. Complexity: medium. Phase 2.
16. **"Continue Your Work" panel expanded platform-wide** beyond Critique — stalled Discussion questions, unfinished Resource drafts. Value: medium. Complexity: low (reuse existing digest mechanism). MVP-adjacent.
17. **AI-assisted resource-extraction suggestions** (flagging likely-canonical answers for human review) — value: medium, speeds up Model A in §5. Risk: false positives create moderation burden. Complexity: medium-high. Phase 2, human-in-the-loop only.
18. **Honor Card export reflecting cross-space breadth** (already partly specified in Profile.md) — extend to explicitly show "contributed across Discussion, Critique, and Resource," not just a single number. Value: medium (recruiter-facing signal). Complexity: low. MVP-friendly, cheap add-on to existing Honor Card.

---

## 22. Prioritization Matrix

Scored qualitatively against user value, differentiation, beginner usefulness, complexity, moderation risk, and ecosystem value.

**P0 — essential to the ecosystem**
- Discussion → Critique conversion (§4)
- Critique → Showcase promotion with iteration history (§4)
- Discussion ↔ Resource contextual suggestion + canonical-answer extraction (§4)
- All spaces → Profile aggregation (§11)
- All genuine contribution → Honor, using the existing 4-part breakdown (§12, idea #5 in §21)
- Global progressive disclosure spine (§13)
- Reference-edge data model (§16)

**P1 — strong addition**
- Critique → Resource pattern extraction (§4)
- Odyssey minimum-viable direct discovery (backlinks only) (§10)
- Repeated-question / missing-resource internal signal (§21 #8)
- Resource staleness detection (§21 #12)
- Honor Card cross-space breadth display (§21 #18)

**P2 — later enhancement**
- Odyssey adjacent/unexpected discovery tiers (§10)
- Profile auto-constructed growth narrative (§21 #7)
- Mentor-discovery-by-problem-solved (§21 #10)
- Showcase teaching-artifact flagging (§21 #3)
- Event-linked cohort Showcase drops (§21 #15)

**P3 — experimental / avoid for now**
- Cross-Studio critique bridging (§21 #11)
- Endorsement chains (§21 #14)
- AI-assisted extraction suggestions (§21 #17) — worth prototyping but not trusting unsupervised

---

## 23. MVP Integration Architecture

**[RECOMMENDATION]** The minimum coherent ecosystem — the smallest set of relationships that makes the product feel fundamentally different from a generic forum on day one:

```
Discussion ↔ Critique     (conversion + backlink)
Critique   → Showcase     (quality-gated promotion, iteration history preserved)
Discussion ↔ Resource     (contextual suggestion + canonical-answer extraction)
All spaces → Profile      (aggregation, chronological + promoted-evidence split)
All contribution → Honor  (4-part breakdown, anti-gaming reused from Critique.md)
```

Everything else — full Odyssey graph, Resource→Showcase citation, cross-Studio bridging, AI-assisted extraction, endorsement chains — can wait without the product feeling incomplete, because these five relationships already deliver the core loop described in §1.

**What Odyssey needs at MVP specifically:** nothing more than surfacing the explicit backlinks the other four relationships already generate ("from this discussion," "built from this critique"). A full recommendation/discovery graph is Phase 2.

---

## 24. Phase 2 / Future Integration Opportunities

- Odyssey's adjacent/unexpected discovery tiers, built on the reference-edge graph (§17, §10)
- Critique → Resource pattern generalization at scale, moving from manual mentor-flagged to semi-automated candidate surfacing (§21 #17, human-in-the-loop)
- Profile growth-narrative generation (§21 #7)
- Cross-Studio bridging and mentor-discovery-by-problem (§21 #10, #11)
- Event-linked cohort graduation into Showcase (§21 #15)
- Deeper Honor-weighted Featured rotation fairness mechanics (§21 #13)

---

## 25. Open Questions / Decisions Required

**[EXPLICITLY UNRESOLVED — do not assume answers to these]**

1. **Critique → Showcase trigger:** resolved status, minimum iteration count, author choice, or moderator promotion — the source documents give pieces of each but no single deciding rule **[SOURCE, Framework Catch-Up §14]**.
2. **"Case Study" naming collision:** Critique.md defines a "Resolved Critique / Case Study" content type **[SOURCE, Critique.md §6]**; this document's §21/#3 and the Resources.md content types also reference "Case Study / Field Note" as a Resource type. These are two different objects sharing one name — needs disambiguation before implementation (e.g., rename one).
3. **Discussion's formal framework** does not yet exist as a standalone document in the same 10-part structure as Critique/Resource/Showcase — this is a documentation gap, not just an integration gap.
4. **Odyssey's concrete data model** is undefined; §10's "relationship-graph, not repository" framing is a recommendation, not a resolved decision.
5. **Automatic vs. suggested threshold tuning** — exact numeric thresholds (helpful-mark counts, iteration counts, inactivity windows) are placeholders pending real usage data; none should be hardcoded pre-launch without a way to tune them.
6. **Endorsement reciprocity risk** — whether endorsements need a cooldown or mutual-endorsement dampening (LinkedIn's known failure mode, §20) is unresolved.
7. **Showcase reopening** — whether a graduated project can return to "in progress" for a new critique round, and what that does to its existing Showcase listing, is unresolved (§4, Showcase → Critique).

---

## 26. Recommended Next Steps

1. **Write the missing Discussion framework document**, using the same 10-part blueprint as Critique/Resource/Showcase, explicitly scoped around its role as the lightweight "town square" that funnels durable value outward (per the image annotation already captured).
2. **Resolve the Case Study naming collision** (§25 #2) before either the Critique or Resource schemas are finalized in code.
3. **Decide the Critique → Showcase trigger rule** (§25 #1) — this is the single highest-leverage undecided question, since it's the core of the "improvement flywheel."
4. **Build the reference-edge data model** (§16) before implementing any individual cross-space feature, so P0 connections (§23) don't each require separate schema work.
5. **Prototype Odyssey's MVP form** (pure backlink surfacing, §23) rather than starting with a discovery algorithm — validate the graph has enough real edges before investing in ranking/recommendation logic.
6. **Normalize the four spaces' independent Honor/disclosure tables against the single global spine proposed in §13**, so future space frameworks don't reinvent their own thresholds.
7. Only after 1–6: proceed to the `DESIGNERS_HUB_MASTER_FRAMEWORK.md` consolidation already proposed in the Framework Catch-Up document, now informed by this cross-space research rather than preceding it.
