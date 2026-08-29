---
tags: [atelier, team-structure, moc]
created: 2026-08-29
---

# Atelier — Team Structure MOC

> Map of Content. Start here. Links to the four role notes: [[01-RnD-Lead]] · [[02-Technical-Lead]] · [[03-Support-Moderation-Lead]] · [[04-Management-Idea-Lead]]

---

## The split decision: task/domain, not sequential phase

Your whiteboard note under Phase 3–4 asks the right question directly: *"Split according to the process or task?"*

**Answer: task/domain, not process/phase.**

Here's the debug on why a phase-sequential split (Person A owns Phase 0, Person B owns Phase 1, etc.) would fail for this specific project: the Phased Implementation Strategy itself states that *"behavioral logic is defined before UI polish"* and that each phase is a **validation gate**, not a handoff. That only works if every phase gets checked against research/ideology, technical feasibility, safety/moderation, and product coherence **simultaneously** — not in a relay where each phase closes before the next domain even looks at it. A phase-split team would produce exactly the "polished but structurally generic platform" the strategy doc explicitly warns against, because nobody would be checking new work against ideology once their phase was "done."

So instead: **four people, four permanent lenses, all four active in every phase**, at different intensities. This also directly matches how you're already thinking on the board — "Find & Debug behaviour" and "Iterate on behaviour towards ideology" aren't one-time Phase 1 tasks, they're a posture that has to keep running underneath every later phase.

**Working solo right now?** Treat this as four hats, not four people. Each work session, declare which hat you're wearing (tag the Obsidian note accordingly), and hold a weekly "round-table" note (template at the bottom of this file) where you force yourself to check new work against all four lenses before moving on — that's the substitute for the cross-checking four real people would do in a room.

---

## The four roles

| Designation | Core question they own | Note |
|---|---|---|
| **R&D Lead** — *Head of Research & Behavioral Design* | "Is this true to what Atelier is supposed to be?" | [[01-RnD-Lead]] |
| **Technical Lead** — *Head of Engineering & Architecture* | "Can we build this, and will it hold up?" | [[02-Technical-Lead]] |
| **Support & Moderation Lead** — *Trust & Safety / Platform Operations* | "What breaks, gets gamed, or hurts a beginner if we ship this?" | [[03-Support-Moderation-Lead]] |
| **Management & Idea Lead** — *Product & Vision Lead* | "Does this cohere into one product a newcomer can understand?" | [[04-Management-Idea-Lead]] |

---

## Phase × Role responsibility matrix

**P** = Primary owner (drives the work) · **S** = Secondary (executes/contributes directly) · **C** = Consulted (reviews at the gate, doesn't drive)

| Phase | R&D | Technical | Support & Moderation | Management & Idea |
|---|---|---|---|---|
| 0 — Framework Integration | S | S | C | **P** |
| 1 — Space Behavior Implementation | **P** | **P** | S | C |
| 2 — Supporting Systems | S | **P** | **P** | **P** |
| 3 — Cross-Space Coherence | **P** | S | C | **P** |
| 4 — Trust, Progression, Quality | S | S | **P** | **P** |
| 5 — Pre-UI Translation | C | **P** | C | S |
| 6 — UI Implementation | C | **P** | C | S |

Read the columns, not just the rows, at every phase gate — a phase isn't done when the Primary owner finishes, it's done when every role with a letter in that row has actually weighed in.

---

## Whiteboard's three open research questions — assigned

From the top-right of the "Atelier Phases" board:

| Question | Owner |
|---|---|
| i) Community sourcing? | [[01-RnD-Lead]] — primary |
| ii) How to structure UI/UX according to the idea? | [[04-Management-Idea-Lead]] — primary, with [[02-Technical-Lead]] on feasibility |
| iii) Security concerns & hosting? | [[02-Technical-Lead]] — primary, with [[03-Support-Moderation-Lead]] on data/trust implications |

---

## Obsidian conventions for this vault

- **Tag every note** with the role that produced it (`#rnd`, `#technical`, `#moderation`, `#management`) **and** the phase it belongs to (`#phase0` … `#phase6`). A note can and often should carry more than one role tag — that's the point of the matrix above.
- **Daily/session notes:** prefix with the hat you're wearing, e.g. `2026-08-29 — [Technical] Discussion schema draft`.
- **Weekly round-table note** (even solo): create `Round-table — [date]`, and answer four questions in it before closing the week:
  1. *R&D:* What did we build this week that isn't backed by a stated principle yet?
  2. *Technical:* What did we build that we don't yet know how to secure, scale, or maintain?
  3. *Moderation:* What did we build that could be gamed, or that fails silently for a beginner?
  4. *Management:* Does this week's work still read as one coherent product, or has it started to fragment?
- **Decision log:** keep a single `Decisions.md` note that every role appends to — one line per resolved question, dated, with which role raised it. This is what prevents re-litigating the same open question (like the Critique→Showcase trigger) in three different notes six weeks apart.
