### The Core Problem

The four current roles split along two axes that don't cleanly separate at a 4-person team size:

**R&D Lead** and **Management & Idea Lead** are both asking variations of the same question: "Is this the right thing to build?" One frames it as fidelity to Atelier's identity, the other as product coherence. In practice, those are the same conversation happening twice. Looking at the Phase × Role Map, they're co-primary in Phases 1, 3, and appear together in almost every row — which is a strong signal that the org chart is splitting a single function across two seats.

**Support & Moderation Lead** is defined around a question — "what breaks or gets gamed?" — that matters deeply but doesn't generate enough primary ownership to justify a full lead role at the sandbox stage. In the phase map, this role is primary only in Phase 4 (Trust, Progression, Quality) and otherwise sits in consultation. That's a lot of meeting time relative to decision authority. It's also a reactive framing for what should be a proactive design function — trust and safety should be _designed into_ the system logic, not evaluated after the fact.

**Technical Lead** is the cleanest role. The question it asks ("can we build this, and will it hold up?") is distinct from the others and maps to clear ownership in the workflow.

### What's Actually Missing

The current structure also has a gap: nobody explicitly owns **cross-function integration and quality assurance** as their primary concern. The workbook compilation (Section 5), testing checkpoints (Section 6), and integration sequencing (Section 7) are assigned to Technical Lead, but those are coordination and verification tasks, not architecture tasks. Bundling them with architecture means the same person is both building the blueprint and grading it — which undermines the review logic in Section 8.

### Proposed Structure

Here's a restructured set of four roles that reduces overlap and covers the gap:

---

**1. Product & Vision Lead**  
_Merges: Management & Idea Lead + the "identity fidelity" half of R&D Lead_

Core question: **"What are we building, for whom, and does it hold together as one product?"**

This person owns the product definition end-to-end — what Atelier is supposed to be, what the user experience should feel like, and whether new ideas cohere into a single understandable system. They drive user-side logic (Section 2.2), set the behavioral intent that everything else is measured against, and are the tiebreaker on scope and priority.

Primary in: Framework Integration (Phase 0), User-Side Logic, Action Linking, Workbook vision sign-off.

---

**2. Systems & Behavior Designer**  
_Merges: the "behavioral design" half of R&D Lead + Support & Moderation Lead_

Core question: **"How should this system behave — and what happens when people push against it?"**

This is the role that was artificially split across R&D and Support & Moderation. Trust design, progression mechanics, moderation flows, edge cases, abuse vectors, and onboarding fragility are all _behavioral design_ problems, not afterthought safety checks. This person designs the rules of engagement: how trust is earned, how critique is structured, how curation scales, what a lurker's experience looks like, and what happens when someone acts in bad faith. They should be proactive, not reactive.

Primary in: Trust, Progression, Quality (Phase 4), Behavioral system specs, Cross-space coherence review.

---

**3. Architecture Lead**  
_Refined from: Technical Lead (narrowed scope)_

Core question: **"Can this be built soundly, and what's the right technical structure?"**

Owns the technical skeleton — primary framework research (Section 2.1), operator evaluation (Section 2.3), supporting framework research (Section 4), and the translation from verified logic into implementable structure (Phase 5–6). This person decides adopt/modify/replace for open-source dependencies and ensures the architecture can support the behavioral specs without accruing invisible technical debt. They no longer own testing and integration sign-off, which removes the conflict of grading their own work.

Primary in: Framework Research, Operator Evaluation, Pre-UI Translation, UI Implementation.

---

**4. Integration & Verification Lead**  
_New role — fills the structural gap_

Core question: **"Do the pieces actually fit together, and does the output match the intent?"**

This is the role the current structure doesn't have. Owns cross-function evaluation (Section 3.2), the complete workbook compilation (Section 5), testing checkpoints (Section 6), and the integration sequence (Section 7). This person is the one who catches when Function A and Function B both work individually but break each other, when the AI workbook has gaps that would produce vibe code, and when an implementation drifts from the defined logic. They're the quality gate between "it runs" and "it's right."

Primary in: Cross-Function Evaluation, Workbook Compilation, Testing Checkpoints, Integration sign-off.

---

### How the Sub-Roles Map

The Lead & Consultation system from Section 8 still applies. Here's how Leader / Agent / Primary Consult / General Consult maps to the new structure:

| Phase                           | Primary (Leader)                              | Primary Consult            | General Consult                                | Agent (choice of Leader to assign) |
| ------------------------------- | --------------------------------------------- | -------------------------- | ---------------------------------------------- | ---------------------------------- |
| 0 — Framework Integration       | Product & Vision                              | Architecture               | Systems & Behavior, Integration & Verification |                                    |
| 1 — Space Behavior              | Systems & Behavior + Architecture             | Product & Vision           | Integration & Verification                     |                                    |
| 2 — Supporting Systems          | Architecture + Systems & Behavior             | Integration & Verification | Product & Vision                               |                                    |
| 3 — Cross-Space Coherence       | Integration & Verification + Product & Vision | Systems & Behavior         | Architecture                                   |                                    |
| 4 — Trust, Progression, Quality | Systems & Behavior + Product & Vision         | Integration & Verification | Architecture                                   |                                    |
| 5 — Pre-UI Translation          | Architecture                                  | Integration & Verification | Product & Vision, Systems & Behavior           |                                    |
| 6 — UI Implementation           | Architecture                                  | Product & Vision           | Systems & Behavior, Integration & Verification |                                    |
| 7 — Final Integration           | Integration & Verification                    | Architecture               | Product & Vision, Systems & Behavior           |                                    |

The key difference from the original: no role appears in both Primary and Consult for the same phase, and Integration & Verification now has clear ownership rather than being scattered across everyone.

### What This Fixes

The original structure had four seats but really only three distinct functions (vision, architecture, safety) with vision split in two and no one owning integration. The new structure has four seats with four distinct functions, each with a clear core question that doesn't overlap with the others. It also shifts trust and moderation from a reactive checkpoint role into a proactive design role, which aligns better with your earlier insight that cold-start fragility and curation scaling need to be designed in from the start rather than evaluated after the fact.