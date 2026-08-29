# §25 Open Questions — Resolutions & Debug Notes

### Companion document to `Ecosystem_Framework.md`

This resolves all seven items originally listed in §25 ("Open Questions / Decisions Required"). Two were already worked through in prior discussion (Critique→Showcase trigger, Showcase reopening) and are restated here in final form. The remaining five are resolved for the first time below.

**Format per item:** the original question → **debug** (what actually breaks or gets exploited if it stays unresolved, surfaced by walking through edge cases) → **resolution** (the rule) → data model deltas → anything still deliberately left open.

**Status legend:** 🟢 Resolved · 🟡 Resolved with a scoped open sub-question · 🔵 Action plan defined (not resolvable as a single rule)

---

## Summary

| # | Question | Status |
|---|---|---|
| 1 | Critique → Showcase trigger | 🟢 Resolved |
| 2 | "Case Study" naming collision | 🟢 Resolved |
| 3 | Discussion's missing framework doc | 🔵 Action plan defined |
| 4 | Odyssey's concrete data model | 🟡 Resolved with open sub-question |
| 5 | Threshold tuning | 🟢 Resolved |
| 6 | Endorsement reciprocity risk | 🟡 Resolved with open sub-question |
| 7 | Showcase reopening | 🟢 Resolved |

---

## 25.1 — Critique → Showcase Trigger

**Original question:** Resolved status, minimum iteration count, author choice, or moderator promotion — the source docs give pieces of each but no single deciding rule.

**Debug — what breaks unresolved:** Without a committed rule, three different builders would each guess differently (one ships author-only, one ships auto-promotion on iteration count, one ships mod-only) and the graduation experience becomes inconsistent across Studios. The sharpest failure mode if done naively: a pure community-vote trigger (e.g. "3 helpful marks = auto-publish") lets a small group of friends mark each other's work helpful and force a low-quality graduation before the author is ready — this is the same voting-ring risk already flagged for Critique's Honor system, just pointed at a new target.

**Resolution — three-path graduation model:**

| Path | Trigger | Executes immediately? |
|---|---|---|
| Author-declared | Marks critique resolved + ≥2 uploaded iterations | Yes |
| Community threshold | ≥3 "Most Helpful" marks (self-marks and voting-ring activity excluded, reusing Critique's existing anti-gaming detector) | **No — sets `graduation_suggested`, author must confirm** |
| Moderator promotion | Any Studio mod, any time | Yes, bypasses the floor below |

**Shared quality floor (all paths except mod override):** ≥1 image/attachment on the final iteration; thread not in `Needs Revision` moderation state.

**Suggestion visibility:** `graduation_suggested` is visible only to the author (never public) — it's an invitation, not a public flag. If unconfirmed after a config-tunable window (see §25.5), it quietly reverts to `active`. No nagging, no auto-execution.

**Data model deltas:** `Critique.status` enum extended with `graduation_suggested`; `platform_config.graduation_helpful_mark_threshold` (default 3); `platform_config.graduation_suggestion_timeout_days` (default 14).

---

## 25.2 — "Case Study" Naming Collision

**Original question:** Critique.md defines a "Resolved Critique / Case Study" content type; Resources.md separately defines a "Case Study / Field Note" resource type. Same name, two different objects.

**Debug — what breaks unresolved:** Search and filtering break first — a user typing "case study" into search has no way to know which system they'll land in. Worse, it hides a real pipeline: Critique's "Resolved Critique / Case Study" is actually an **internal, read-only archive entry** scoped to a Studio (a teaching reference for future critiquers), while Resources' "Case Study / Field Note" is a **deliberately authored, contextualized narrative** in the Resource library. These are two different maturity stages of the same idea, not two unrelated features — and the naming collision was masking that relationship rather than just being a cosmetic clash.

**Resolution:**
1. **Rename the Critique-space type** from "Resolved Critique / Case Study" → **"Critique Archive Entry."** It keeps its existing behavior (auto-promoted, read-only, Studio-scoped teaching reference) — only the label changes, avoiding any migration of existing logic.
2. **Keep Resources' "Case Study / Field Note"** as the externally-facing narrative content type — no change.
3. **Formalize the pipeline between them:** a Critique Archive Entry can be converted into a Resource Case Study/Field Note by a mentor or moderator, who adds the required context fields (what/who/when/how) that Resources.md mandates for every resource. This is the same mechanism already defined as "Critique → Resource pattern extraction" — the naming fix makes that existing connection legible instead of accidentally ambiguous.

**Data model deltas:** Rename `Post.contentSubtype` value `case_study` → `critique_archive_entry` on the Critique side (Resource side untouched); add `Resource.sourceCritiqueArchiveEntryId` nullable field to record provenance when a mentor promotes one into the other.

---

## 25.3 — Discussion's Missing Framework Document

**Original question:** Discussion has no standalone 10-part framework document, unlike Critique/Resource/Showcase.

**Debug:** This isn't a rule to resolve in this document — it's a documentation gap that needs its own authoring pass, and pretending to resolve it with a paragraph here would just produce a fifth ad-hoc definition of Discussion, which is exactly the inconsistency this whole exercise is trying to prevent. The real risk of leaving it as a vague "TODO" is that Discussion quietly gets built to match whatever the Critique composer already has lying around (same schema, same form, category dropdown) — which is precisely the "posts + comments with a filter" outcome flagged as the single biggest risk in §2 of the main document.

**Resolution — action plan, not a rule:**
1. Write `DISCUSSION_FRAMEWORK.md` using the same 10-part blueprint (Purpose → Success Metrics), scoped explicitly around the contract already established for Discussion in this document's §6: lightweight, fast, funnels durable value outward via the Discussion→Critique and Discussion→Resource transitions rather than holding it.
2. Lock these inputs before writing it, since they materially change the framework's shape:
   - Content sub-types (the image annotation already implies: quick questions / troubleshooting / career / opinion-debate / knowledge threads / casual show-and-tell — confirm this is the intended set, not five categories with equal weight).
   - Whether Discussion needs its own Honor-range user-type table, or should inherit the global spine from §13 without a Discussion-specific variant.
   - Whether "Move to Critique" is the *only* outbound transition surfaced in the composer, or whether "Save as Resource" affordances belong in the initial spec too.
3. Do not let anyone build the Discussion composer UI ahead of step 1 — the naming collision in §25.2 exists because a content type got implemented before its cross-space relationship was made explicit; the same failure mode is the real risk here.

**Status:** deliberately left as an authoring task, not a settled rule.

---

## 25.4 — Odyssey's Concrete Data Model

**Original question:** §10's "relationship-graph, not repository" framing is a recommendation, not a resolved schema.

**Debug:** The instinct to give Odyssey its own novel schema is what makes it feel unresolved — but walking through it, Odyssey doesn't own any content, so it shouldn't need a bespoke data model at all. The actual risk is different: if "discovery" is computed live at request time by joining across five spaces' tables, it becomes a performance bottleneck the moment usage grows, and if the "unexpected discovery" tier ships without any user control, it risks surfacing content that feels random or mildly invasive rather than delightful (a known failure mode in recommendation systems generally).

**Resolution:**
1. **Odyssey has no primary schema of its own.** It is a query/traversal layer over the same reference-edge table (`source_type`, `source_id`, `target_type`, `target_id`, `relation`) already required for cross-space linking (main doc §16). Every explicit edge Odyssey needs (backlinks, `promoted_from`, `belongs_to`) already exists because another transition created it.
2. **Add exactly one new supporting structure:** an `inferred_edges` materialized table (same shape as the reference-edge table, plus a `computed_at` timestamp and a `score`), refreshed on a schedule rather than computed live per request. This is the only genuinely new piece of infrastructure Odyssey requires.
3. **Bound traversal depth at launch.** Direct discovery = 1-hop (explicit edges only). Adjacent = 2-hop, mixing explicit and inferred edges. "Unexpected" (3-hop+, inferred-only) is explicitly Phase 2 and ships only with an opt-out control ("show me more / less unexpected content") from day one of that phase — not retrofitted later.
4. **Reuse, don't reinvent, moderation:** any content surfaced by an inferred edge inherits the moderation state of its source content — if the source is `Needs Revision` or removed, it silently drops out of Odyssey's results rather than requiring separate moderation logic.

**Remaining open sub-question 🟡:** the scoring function behind `inferred_edges.score` (what mix of tag overlap, co-view, co-save, recency should feed it) is a data-science decision that depends on real usage volume — correctly deferred until there's enough traffic to tune against, per the same discipline as §25.5.

---

## 25.5 — Threshold Tuning

**Original question:** Exact numeric thresholds (helpful-mark counts, iteration counts, inactivity windows) are placeholders pending real usage data.

**Debug:** The risk here isn't picking the wrong number — every number in this document is explicitly a placeholder — it's *where the numbers live*. If thresholds get hardcoded into application logic (as they would by default under time pressure), "tune post-launch" becomes a code deploy for every adjustment, which in practice means it never happens. The second risk is the opposite failure: exposing every threshold as an independently configurable knob creates a control panel nobody understands or maintains.

**Resolution:**
1. **Every tunable number lives in a single `platform_config` table**, keyed by name, with a platform-wide default and an optional per-Studio override (some Studios are small enough that a 3-helpful-mark threshold may never be realistically reachable).
2. **Start with a fixed, named set — do not let this table grow ad hoc.** The launch set, consolidating every threshold named across this document and its companion:

   | Config key | Default | Governs |
   |---|---|---|
   | `graduation_helpful_mark_threshold` | 3 | §25.1 |
   | `graduation_suggestion_timeout_days` | 14 | §25.1 |
   | `graduation_min_iterations` | 2 | §25.1 |
   | `max_free_revision_cycles` | 3 | §25.7 |
   | `revision_republish_requires_new_iteration` | true | §25.7 |
   | `resource_extraction_helpful_mark_threshold` | 3 | Discussion→Resource |
   | `endorsement_cooldown_days` | 90 | §25.6 |
   | `stalled_critique_nudge_days` | 7 | "Continue Your Work" |

3. **Every threshold-gated action fires an instrumentation event** (suggested / confirmed / timed-out / mod-overridden), so each config value has a concrete signal to tune against rather than being adjusted on intuition. The three metrics named earlier for graduation specifically (confirm-vs-timeout rate, time-to-confirm, mod-promotions that never would've hit the community path) should be the template applied to every row in this table, not a one-off for graduation alone.
4. **New thresholds require a named row in this table before shipping**, not an inline constant — this is a process rule, not a technical one, and it's the actual mechanism that prevents the table from becoming unmanageable: the discipline is in the review step, not the schema.

---

## 25.6 — Endorsement Reciprocity Risk

**Original question:** Whether endorsements need a cooldown or mutual-endorsement dampening (LinkedIn's known one-click reciprocity failure).

**Debug:** Profile.md already avoids LinkedIn's core mistake by requiring a named skill per endorsement rather than a single generic action — that friction alone filters out the most casual reciprocity loops. The remaining risk is narrower than "reciprocity in general": it's *repeated* endorsement stacking between the same pair with no underlying interaction to justify it — two accounts endorsing each other across many skills, back to back, with no critique/discussion history between them. Flagging *all* mutual endorsement would create false positives against genuine, frequent collaborators in a small Studio who legitimately endorse each other because they actually work together often.

**Resolution:**
1. **Cooldown, not a block:** a user cannot endorse the same person for the same named skill again within `endorsement_cooldown_days` (default 90) — prevents noisy stacking without preventing genuine repeat recognition over time.
2. **Reciprocity-ring detector, private and non-blocking:** extend the existing critique voting-ring detector (already specified for Honor anti-gaming) to also watch endorsement pairs. Flag only when a mutual endorsement pair has **no corresponding Critique or Discussion interaction** between the same two users in the same window — i.e., endorsement-only relationships, not endorsement-plus-real-collaboration. This is the same underlying fraud-detection logic, pointed at a new edge type, rather than new logic invented for this case alone.
3. **Flag is moderator-visible only**, never public and never auto-removing the endorsement — consistent with "guide first, correct second, restrict when necessary."

**Remaining open sub-question 🟡:** the exact interaction-window size for the "no corresponding activity" check (7 days? 30? lifetime?) is a tuning decision — add `endorsement_ring_detection_window_days` to the `platform_config` table in §25.5 rather than deciding it here without data.

---

## 25.7 — Showcase Reopening

**Original question:** Whether a graduated project can return to "in progress" for a new critique round, and what that does to its existing Showcase listing.

**Debug:** The sharpest failure mode, walked through in detail: if republishing reused the *same* three-path graduation model as first-time graduation, the community-threshold path becomes a cheap repeatable Honor loop — get Featured once, reopen, farm 3 friendly helpful-marks on a token new iteration, republish, repeat, each cycle cheaper than the last because the reputational bar was already cleared. A second, quieter failure mode: if the new critique round mutates the *original* resolved thread in place, it violates the platform's own "critique record stays clean and immutable as documentation" principle and destroys the growth story Showcase's before/after toggle depends on.

**Resolution — three explicit Showcase states, with a narrower republish path:**

| State | Meaning | Listing behavior |
|---|---|---|
| Published | Default graduated state | Visible in Showcase/Spotlight |
| In Revision | Author reopened for a new critique round | Stays visible, gains "In Revision" badge; original archive untouched |
| Archived | Retired by author or mod | Hidden from active Showcase, reachable via direct link |

**Key rules:**
- The new critique round is a **new `Critique` entity** with `parentCritiqueId` pointing at the original — never a mutation of the resolved thread. Showcase's before/after view renders both cycles as one continuous timeline by walking the parent chain; the underlying records stay separate.
- **Republishing uses a narrower rule than first graduation:** author-declared (resolved + ≥1 *new* iteration, so a no-op reopen/close can't count) or moderator promotion — **the community-threshold path is removed for republish**, closing the farming loop described above.
- Honor, Achievements, and Endorsements from the original graduation are untouched on entering In Revision.
- Active Featured/Spotlight rotation is preserved for its current window if already running, but the project becomes ineligible for *future* Featured selection while In Revision — re-entering eligibility on republish.
- **Cycle cap:** `Published → In Revision` increments `revisionCycleCount`; at `max_free_revision_cycles` (default 3, see §25.5) a further reopen requires moderator review rather than being author-initiated.
- No forced auto-archive for a project that sits In Revision indefinitely — reuse the existing private "Continue Your Work" nudge mechanic instead, consistent with the platform's no-nagging-on-inactivity convention.

**Data model deltas:** `ShowcaseProject.status` enum {`published`, `in_revision`, `archived`}; `ShowcaseProject.revisionCycleCount` (int, default 0); `ShowcaseProject.activeCritiqueId` (nullable); `Critique.parentCritiqueId` (nullable, self-referential); `Critique.parentShowcaseId` (nullable).

---

## What this changes in the master document

If folding this back into `Ecosystem_Framework.md`, the mechanical updates are:
- §25 items 1 and 7 move from "unresolved" to resolved, with the tables above replacing the current one-line statements.
- §16 (Data / Information Architecture) gains the new fields listed under each resolution's "Data model deltas."
- §26 (Recommended Next Steps) item 3 ("Decide the Critique → Showcase trigger rule") is now complete and should be struck or marked done; item 1 (Discussion framework doc) gets the concrete input checklist from §25.3 above attached to it.
- A new `platform_config` reference table (§25.5) is worth promoting into its own numbered section rather than living only inside this companion document, since five separate resolutions now depend on it.
