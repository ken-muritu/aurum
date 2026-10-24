# Aurum — Phase 2 Design Review

> **Be your own reviewer. Critique harder than a senior product designer would.**

---

## What is still weak?

1. **Entry mode sprawl.** Four entry modes (Generate, Import, Discover, Create manually) inside `/learn` creates decision fatigue. A learner opening the app for the first time sees four choices and freezes. Recommendation: reduce to two visible entry modes in v1 — **Generate** and **Create manually**. Import and Discover become secondary oria items.

2. **Import flow is undefined.** We specify four source types (YouTube playlist, PDF, GitHub repo, Web link) but have no parser for PDF or GitHub in the backend. Shipping a broken Import path is worse than not shipping it. Recommendation: In v1, support only **URL + auto-detect type** with a single text input. Defer multi-source until parsers exist.

3. **Offline queue is over-engineered for v1.** IndexedDB, conflict resolution, last-write-wins — this is Phase 7 thinking. The product should first work online. Recommendation: Remove offline queue from v1 flows. Show "You're offline" and block mutations. Period.

4. **Generate panel is a panel, but it needs a modal.** Inline generation in a right rail panel constrains the output to a small width. Curriculum proposals are better read in a centered modal. Recommendation: Generate opens a modal. `/learn` panel is just the input field.

## What feels generic?

1. **Empty state patterns.** Most empty states read like standard SaaS copy: "No masteries yet", "Nothing in progress". This is Notion/Linear/Superhuman language. Recommendation: Rewrite in Aurum's voice — "Your forge is cold. Strike your first mastery." or "No lessons yet. Lay the first brick."

2. **Failure states are undifferentiated.** "Couldn't save. Try again." is the same copy every app uses. Recommendation: Add one Aurum-specific line — "The forge cooled. Try again." or "That didn't strike clean. Retry." — something that ties failure to the metaphor without being annoying.

3. **The `/mastery/:id` layout sounds like every course platform.** Module list + lesson list + progress rail = standard. Recommendation: Push toward the "workshop" metaphor — fewer chrome elements, more focus on the current lesson as the central object.

## What resembles another product too closely?

1. `/learn` right rail with Generate + Discover + Recent = Notion sidebar meets Linear command palette. Recommendation: Differentiate by making the rail feel like a **tool bench**, not a navigation menu. Icons should be tool-like (hammer, compass, flame) not just generic Lucide icons.

2. **Progress bars everywhere.** Every learning tool has progress bars. Recommendation: Make progress a **vertical rail** in `/mastery/:id` and a prominent bar in `/learn`. Don't scatter mini-progress bars across every surface — that's Readwise's approach, not Aurum's.

3. **Fork as a primary interaction.** Fork is GitHub's word. Recommendation: Keep it because the backend already uses it, but in copy call it "Remix" or "Make your own version" until users associate it with Aurum.

## Where are users forced to think?

1. **Four entry modes in `/learn` right rail.** "Which way should I start?" is not a question the user should have to answer. Recommendation: One dominant entry (Generate), one secondary (Create manually), one tertiary (Import/Discover collapsed).

2. **Visibility toggle on manual creation.** Private vs Public is a decision a new user doesn't care about yet. Recommendation: Default to Private. Move Public to a settings toggle after creation. "Create" should be instant.

3. **The flow from `/mastery/:id` completion to "what next?"** After mastery completes, we show three actions with equal weight. Recommendation: One dominant action ("Start a new mastery"), one secondary ("Share"), one tertiary ("Fork and improve"). Hierarchy is missing.

## What can be removed?

1. **Remove the "Recent" section from `/learn` right rail.** It competes with Active Masteries and Generate. Activity history belongs on `/mastery/:id` or in a future Activity panel.

2. **Remove "Import" from primary entry modes.** Defer to a later phase.

3. **Remove offline queue from v1.** Defer to Phase 7.

4. **Remove "estimated total duration" from Generate proposal.** Duration estimation requires parsing video metadata we don't always have. Showing a fake number is worse than omitting it.

5. **Remove "source confidence" from Generate proposal.** High/medium/low is not meaningful to the learner. Either the curriculum is good or it isn't. Generate it, let them edit.

## What assumptions survived from the old Aurum?

1. **Mastery visibility is a first-class concept.** In v0, visibility drove discoverability. In the redesign, Discover is a drawer and public masteries are a secondary concern. Recommendation: Keep visibility for Phase 1 because the backend needs it, but make it a post-creation toggle, not a blocker on creation.

2. **Resource types enum is sacred.** YouTube, doc, PDF, blog, book, paper, GitHub, podcast — eight types. Recommendation: In v1, support only **YouTube** and **link**. Everything else is a link with an icon. Don't parse 8 types until users demand it.

3. **Lesson enrichment (project prompt + quiz) is assumed necessary.** The flows preserve it, but is it core to the learning loop? Recommendation: Keep in Phase 1 because it adds depth cheaply, but make it collapsible. Don't force it on every lesson.

4. **Notes as a primary action.** Notes are in every flow but no flow centers them. Recommendation: Notes remain attached to lessons (≤2 clicks away). No dedicated Notes page in v1.

## If we rebuilt again tomorrow, what would change?

1. **Generate would be the only entry mode.** Manual creation would be a fallback inside Generate ("Don't like this? Write your own."). Import would be a button on an existing mastery, not an entry point.

2. **Discover would be the masteries list.** Public and private would be the same surface, filtered. No separate "Find" vs "Mine" mental model.

3. **Progress would be a rail, not a bar.** Vertical progress in `/mastery/:id`, horizontal only in `/learn` Continue card. Never both in the same view.

4. **Completion would be silent.** Mastery complete → gold filigree → "Start new mastery" prompt. No modal, no toast, no celebration. The visual is enough.

5. **Auth would be invisible.** Log in once, never see auth screens again. No "Welcome back" email. No onboarding tour. The interface teaches itself.

---

## Critical Decision Required

Two architectural questions remain unresolved that affect all flows:

1. **Should `/learn` be the absolute root for all authenticated requests, or should `/mastery/:id` survive as a top-level route?**
   - Recommendation: `/mastery/:id` survives as a top-level route. It's bookmarkable, shareable, and direct. `/learn` is the home, not a cage.

2. **Should the right rail on `/learn` persist globally or collapse into a tab/panel?**
   - Recommendation: Collapse into a tabbed panel (Generate | Discover | Recent) that can be dismissed. Right rail feels cramped at `1180px`.

---

*Phase 2 review complete. If these issues are addressed, proceed to Phase 3 (Wireframes) with the revised constraints.*
