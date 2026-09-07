### Pipeline Step 1: Primary Framework Research

> _"research code dependencies and frameworks for the primary skeletal structure (open source codes)"_

With the sub-strategy from the raw notes:

> _"define primary identifier ideas which are core of working of the site (example: discord's servers, reddit's threads)"_  
> _"research already existing structures"_  
> _"contemplate building something new or improve upon what's already there"_

**Primary:** Product & Vision Lead — they define _what the primary identifiers are_, because that's a product identity decision. Discord chose servers, Reddit chose threads — choosing Atelier's equivalent is a vision call, not a technical one.

**Primary Consult:** Architecture Lead — they evaluate _whether_ the existing structures found are technically sound, what their limitations are, and whether building new is feasible.

**General Consult:** Systems & Behavior Designer, Integration & Verification Lead — even at the skeleton level, some structural choices create or foreclose trust/progression possibilities (e.g., if your primary identifier is a flat thread vs. a layered space, that shapes what moderation and progression can look like later).


---

### Pipeline Step 2: User-Side Logic

> _"structurize the logic structures for the idea from a user perspective (pseudo code) {keep logs} (keywords: function definition and innovation)"_

This is the step where the raw notes emphasize the **build strategy** — the back-and-forth between technical and user perspective:

> _"User lead start creating function, structure and working from a user like perspective"_  
> _"Technical lead fits the idea onto the framework understanding and working from their perspective"_  
> _"Technical lead reports onto what's possible to implement"_  
> _"make secondary line of improvements with the same steps again"_  
> _"finalise the structure"_

**Primary:** Product & Vision Lead — they generate the initial function definition from the user perspective.

**Primary Consult:** Architecture Lead — they fit the idea onto the framework and report back on what's implementable. The raw notes describe this as a structured handoff loop, not parallel work.

**General Consult:** Systems & Behavior Designer — they flag behavioral implications early ("this function definition doesn't account for what happens when a new user encounters it" or "this creates a trust gap").

The loop described in the build strategy — user lead defines, technical lead fits, technical lead reports, secondary improvements, finalize — maps cleanly to the Lead & Consultation system's review cycle. Product & Vision proposes, Architecture pressure-tests, they iterate until above the 80% satisfaction threshold, then it moves forward.

---

### Pipeline Step 2a: Individual Steps

> _"split structures into proper individual steps"_

**Primary:** Product & Vision Lead + Architecture Lead (co-owned) — the raw notes don't assign this to a single perspective, and it genuinely requires both. The user-side logic needs to decompose into steps that are both behaviorally meaningful and technically discrete.

**Primary Consult:** Integration & Verification Lead — this is their first entry point. They're reviewing whether the individual steps are defined cleanly enough to be verified later. If a step is vague or bundles multiple state changes, they push back now rather than discovering it in testing.

---

### Pipeline Step 2b: Operator Evaluation

> _"evaluate logic structures from an operator perspective {from: Framework Implementation Strategy phases}"_

**Primary:** Architecture Lead — this is a direct technical evaluation against the framework.

**Primary Consult:** Systems & Behavior Designer — operator perspective isn't purely technical. "Operator" includes platform operations: what does this function look like from the moderation console? What data does it generate? What happens when it's abused? The raw notes reference the Framework Implementation Strategy phases as the evaluation structure, so whoever owns this step needs to apply that lens, but the behavioral designer catches the operational concerns that a purely architectural evaluation misses.

**General Consult:** Product & Vision Lead — sanity check that the operator evaluation hasn't distorted the original intent.

---

### Pipeline Step 3: Action Linking

> _"structurize the logic structure for linking 'actions' (pseudo code) {keep logs} (keywords: cross function coherence and working)"_

**Primary:** Integration & Verification Lead — this is their core territory. The raw notes describe this as defining how functions connect, what triggers what, what state passes between them. That's integration logic, and the person who will later verify cross-function coherence should be the one defining the links in the first place.

**Primary Consult:** Product & Vision Lead — they validate that the action links reflect the intended user journey, not just technical convenience.

**General Consult:** Architecture Lead — feasibility check on the linking structures.

---

### Pipeline Step 3a: Individual Links

> _"split structures into proper individual links"_

**Primary:** Integration & Verification Lead — same logic as above, just at finer granularity.

**Primary Consult:** Architecture Lead — each individual link has technical implications (data flow, state management, dependency chains).

---

### Pipeline Step 3b: Action Operator Evaluation

> _"evaluate action structure from an operator perspective {from: Framework Implementation Strategy phases}"_

**Primary:** Architecture Lead + Systems & Behavior Designer (co-owned) — the Architecture Lead evaluates technical feasibility of the linked actions as a system; the Systems & Behavior Designer evaluates what happens when the linked actions encounter edge cases, abuse, or unexpected user behavior.

**Primary Consult:** Integration & Verification Lead — they defined the links, so they participate in evaluation, but they're not grading their own work alone. This is where the separation from the original Technical Lead role pays off.

---

### Pipeline Step 4: Supporting Framework Research

> _"research code dependencies and frameworks for these individual logical structures (open source codes)"_

**Primary:** Architecture Lead — purely technical research against now-defined logical structures.

**Primary Consult:** Systems & Behavior Designer — some framework choices have behavioral implications (e.g., choosing an off-the-shelf reputation system vs. building custom affects what progression mechanics are possible).

**General Consult:** Product & Vision Lead — ensures framework choices don't compromise product intent.

---

### Pipeline Step 5: AI Workbook Compilation

> _"compile full ideas with structure as a complete workbook for AI"_

**Primary:** Integration & Verification Lead — this is compilation and coherence work. They're assembling everything into a single document that an AI coding system can act on without gaps.

**Primary Consult:** Architecture Lead — technical accuracy of the compiled workbook.

**General Consult:** Product & Vision Lead — final check that the workbook still represents the intended product, not a drift that accumulated through the pipeline.

---

### Pipeline Step 6: Testing Checkpoints

> _"create checkpoints for inspecting AI vibe code output (keywords: testing)"_

**Primary:** Integration & Verification Lead — this is the role's reason for existing. They define what "correct" looks like and create the checkpoints that catch when AI-generated code runs but doesn't match the defined logic.

**Primary Consult:** Architecture Lead — technical validity of the test criteria.

**General Consult:** Systems & Behavior Designer — behavioral test cases (does it handle the edge cases? does the trust model hold up in the implementation?).

---

### Pipeline Step 7: Integration

> _"put all of it together"_

**Primary:** Integration & Verification Lead + Architecture Lead (co-owned) — Integration & Verification leads the assembly and final coherence check; Architecture leads the technical integration.

**Primary Consult:** Product & Vision Lead — final product coherence sign-off.

**General Consult:** Systems & Behavior Designer — final behavioral and trust review.