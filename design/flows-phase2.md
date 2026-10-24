# Aurum — Phase 2: User Flows

> **Every major journey, mapped before any UI implementation.**
> No routes here are new — they all live under the IA in `ia-phase1.md`.
> This document defines **sequence, decision points, states, and exits.**

---

## 1. First Visit (Unauthenticated)

```
Land on /
↓
Read value prop + see 2–3 featured public masteries
↓
Decision point:
  ├─ "Start learning" → /signup
  │     ↓
  │   Create account (email, username, password)
  │     ↓
  │   Auto-login → /learn
  │
  └─ "Browse public Masteries" → scroll down to featured section
        ↓
      Click a mastery → /mastery/:id (public view)
        ↓
      Prompt: "Use this Mastery" → /signup
```

**Rules:**
- `/` must work without scrolling past 2 viewport heights.
- Featured masteries must show title, outcome, estimated time, learner count.
- Public mastery view is read-only. Primary action is always "Fork" → prompts signup if unauth.

---

## 2. Returning Learner (Authenticated)

```
Log in
↓
Redirect → /learn
↓
See Continue Learning card (if progress exists)
  OR
See empty state: "What do you want to learn?" + Generate panel prominent
↓
Possible next actions:
  ├─ Click Resume → /mastery/:id (continue focus)
  ├─ Click mastery in Active list → /mastery/:id
  ├─ Type in Generate panel → inline curriculum proposal → Send to Forge → /mastery/:id
  ├─ Click Discover tab → browse → Fork → /mastery/:id
  ├─ Click Import → modal → paste URL → /mastery/:id
  └─ Click Create manually → inline form → /mastery/:id
```

**Rules:**
- No welcome modal. No tutorial overlay. The interface must teach through structure.
- Continue card is always at the top, always visible, always dominant.
- Returning after 2+ weeks: Continue card surfaces the last-accessed mastery with a "Welcome back" micro-line (not gamified).

---

## 3. Generate Entry

```
In /learn right rail:
↓
Type: "What do you want to learn?"
↓
Submit
↓
Loading: skeleton cards for 1–3s
↓
Proposed curriculum appears inline:
  - Title
  - Goal statement
  - 3–6 modules with lesson titles
  - Estimated total duration
  - Source confidence (high/medium/low)
↓
Decision:
  ├─ "Use this Mastery" → creates mastery → /mastery/:id
  ├─ "Edit" → inline title/goal/module/lesson edits → Send to Forge
  └─ "Cancel" → back to /learn panel
```

**Rules:**
- Generate is a panel, never a separate route.
- AI is optional. Manual creation is always one click away.
- If generation fails: "Couldn't generate a curriculum right now. Try again or create manually." — no stack trace, no retry spam.

---

## 4. Import Entry

```
In /learn right rail:
↓
Click "Import"
↓
Modal:
  - Choose type: YouTube playlist | PDF | GitHub repo | Web link
  - Paste URL
  - Optional: title override
↓
Submit
↓
Loading: "Importing..."
↓
Success:
  - Parsed into modules/lessons
  - Redirect → /mastery/:id
  - Show toast: "Imported 12 lessons"
↓
Failure:
  - "Couldn't import from that URL. Check the link and try again."
  - Keep modal open, preserve input
```

**Rules:**
- Import is a modal, never a route.
- Each source type has its own parser. Failure is graceful.
- Import always creates a private mastery by default.

---

## 5. Manual Creation Entry

```
In /learn right rail:
↓
Click "Create manually"
↓
Inline form (no modal):
  - Title (required)
  - Goal statement (optional)
  - Visibility: Private | Public
↓
Submit
↓
Success:
  - Creates empty mastery
  - Redirect → /mastery/:id
  - Empty module state shows "Add your first module"
↓
Cancel:
  - Form collapses
```

**Rules:**
- Manual creation is the simplest path. One field required.
- Visibility default is Private. Public requires explicit choice.

---

## 6. Discover Flow

```
In /learn right rail:
↓
Click "Discover" tab
↓
Panel slides in:
  - Search input (top)
  - Filters: topic, estimated time, skill level, popularity
  - Grid of mastery cards:
      * Cover image (first resource thumbnail or generated)
      * Title, outcome, estimated time, skill level
      * Creator, fork count, completion rate
      * "Use this Mastery" button
↓
Click "Use this Mastery"
↓
Success:
  - Creates forked mastery in user's account
  - Toast: "Forked to your masteries"
  - Panel closes, /learn Active list updates
  - Redirect option: "View now" → /mastery/:id
↓
Click a mastery card (read-only)
  → /mastery/:id (public view)
  → "Use this Mastery" button prominent
```

**Rules:**
- Discover is a panel, never a standalone route.
- Cards must communicate value in under 2 seconds: cover, outcome, time, level.
- "Fork" is the only primary action. No save, no like, no subscribe.

---

## 7. Continue Learning Flow

```
On /learn:
↓
Continue Learning card (dominant, full-width):
  - Mastery title
  - Current module / current lesson
  - Progress bar (percentage + fraction)
  - "Resume" button (btn-accent)
↓
Click Resume
↓
/matery/:id scrolls to and highlights Current Focus
↓
User watches/reads/completes
↓
Lesson marked complete:
  - Refinement animation plays
  - Progress updates
  - Next lesson surfaces as Current Focus
↓
User clicks back or mastery title
  → /learn
  → Continue card updated with new progress
```

**Rules:**
- Resume always goes to the last-accessed lesson, not the mastery top.
- Progress bar updates optimistically (before server confirms) with rollback on failure.
- If mastery complete: Continue card replaced with "Completed" state + gold filigree + "Fork and share" option.

---

## 8. Lesson Completion Flow

```
In /mastery/:id:
↓
User clicks lesson checkbox (or marks complete inline)
↓
Optimistic UI update:
  - Check icon appears
  - Progress bar advances
  - Current Focus advances to next uncompleted lesson
↓
Server confirmation:
  - Success: keep state
  - Failure: rollback checkbox, show error toast "Couldn't save progress"
↓
If module now complete:
  - Module header gets ember pulse animation
  - Collapse module (optional, user preference)
↓
If mastery now complete:
  - Mastery header gets gold filigree fade-in
  - Toast: "Mastery refined. You've completed [title]."
  - Prompt: "Share" / "Fork and improve" / "Start a new mastery"
```

**Rules:**
- Completion is a single click. No confirmation dialog.
- Animation communicates state change, never decoration.
- Progress bar always reflects true server state after confirmation.

---

## 9. Mastery Completion Flow

```
All lessons marked complete
↓
Mastery header: gold filigree border fades in
↓
Inline celebration (subtle):
  - "Mastery refined" message
  - Three actions:
      1. Share (copy public link)
      2. Fork and improve (create editable copy)
      3. Start a new mastery (jump to Generate panel)
↓
No modal. No points. No badge. No streak.
```

**Rules:**
- Completion is an event, not a gamified milestone.
- The metaphor is "refinement," not "achievement unlocked."
- User decides what comes next. No forced onboarding.

---

## 10. Add Resource Flow

```
In /mastery/:id, lesson expanded:
↓
"Attach resource" button
↓
Panel opens:
  - Option A: Search YouTube
      * Query input
      * Results with thumbnail, title, duration
      * Click to attach
  - Option B: Paste link
      * Type selector (YouTube, doc, PDF, blog, book, paper, GitHub, podcast)
      * URL input + title override
      * Attach button
↓
Success:
  - Resource appears in lesson resource grid
  - Thumbnail auto-fetched for YouTube
  - For non-YouTube: generated icon based on type
↓
Failure:
  - "Couldn't attach resource. Check URL and try again."
  - Preserve form input
```

**Rules:**
- YouTube search happens client-side via API. No server round-trip until attach.
- Non-YouTube resources need no thumbnail fetch. Type icon suffices.

---

## 11. Add Note Flow

```
In /mastery/:id, lesson expanded:
↓
"Add note" textarea at bottom of notes list
↓
Type note
↓
Submit
↓
Success:
  - Note prepends to list (newest first)
  - Textarea clears
  - Timestamp: "Just now"
↓
Failure:
  - "Couldn't save note. Try again."
  - Preserve textarea content
```

**Rules:**
- Notes are chronological, not threaded.
- Markdown not supported in v1. Plain text only.
- No character limit in v1. Enforce later if needed.

---

## 12. Failure States (Global)

| Scenario | UI Response | User Path |
|----------|-------------|-----------|
| Network error | "Network error — check connection." + retry button | Retry or wait for reconnect |
| Auth expired | Silent redirect to `/login` with "Session expired" message | Log in again |
| Not found (mastery) | "This mastery doesn't exist or has been removed." + "Go to Learn" button | Back to `/learn` |
| Permission denied | "This mastery is private." + "Fork your own copy" or "Request access" | Fork or leave |
| Generation failed | "Couldn't generate a curriculum. Try again or create manually." | Retry or manual |
| Import failed | "Couldn't import from that URL." + preserve modal/input | Correct URL and retry |
| Save failed (progress/resource/note) | "Couldn't save. Retrying..." → success toast or error | Auto-retry once, then manual |

**Rules:**
- No stack traces in production.
- No raw error codes.
- Every failure state offers exactly one next action.
- Retry is implicit where possible (background retry once).

---

## 13. Empty States (Full Contract)

| Surface | Empty State Message | Primary Prompt | Secondary Prompt |
|---------|---------------------|----------------|-----------------|
| `/learn` (no masteries) | "You don't have any masteries yet." | "What do you want to learn?" → opens Generate panel | "Browse public Masteries" → Discover tab |
| `/learn` (no continue, has masteries) | "Nothing in progress." | "Continue a Mastery" → mastery list | "Generate new" |
| `/mastery/:id` (no modules) | "No modules yet." | "Add your first module" input | — |
| `/mastery/:id` (module, no lessons) | "No lessons yet." | "Add your first lesson" input | — |
| `/mastery/:id` (lesson, no resources) | "No resources attached." | "Attach a video or link" | — |
| Discover panel (no results) | "No public masteries found." | "Try a different search" | "Be the first to publish one!" |
| `/` (featured section, none yet) | "No public masteries yet." | "Start a Mastery" → /signup | — |

**Rules:**
- Every empty state must have exactly one primary prompt.
- Secondary prompts are optional but never compete with primary.
- Empty states are not decorative. They are the onboarding.

---

## 14. Offline States

| Scenario | UI Response | Behavior |
|----------|-------------|----------|
| Offline, viewing cached data | Normal UI, data from last session | Read-only. No mutations allowed. |
| Offline, attempt mutation | "You're offline. Changes will sync when reconnected." | Queue mutation locally (IndexedDB / localStorage) |
| Reconnect | "Back online." toast | Auto-replay queued mutations in order |
| Queue conflict | Last-write-wins, with conflict note | Show "This was updated elsewhere. Your version is saved." |

**Rules:**
- Offline is a first-class state, not an afterthought.
- Never show a browser "You are offline" page.
- Queue mutations as atomic operations with timestamps.

---

## 15. Loading States

| Scenario | Pattern | Details |
|----------|---------|---------|
| `/learn` initial load | Progressive | Continue card first (200ms), then Active list (400ms), then Recent (600ms) |
| `/mastery/:id` initial load | Skeleton | Module headers + lesson count skeleton, then content |
| Generate submit | Skeleton → inline result | Skeleton cards for 1–3s, then proposed curriculum |
| Import submit | Spinner in modal | "Importing..." + source icon |
| Lesson expansion | Instant with lazy notes | Expand immediately; notes load after with skeleton line |
| Mark complete | Instant optimistic | UI updates before server confirms; rollback on failure |

**Rules:**
- Skeleton screens over spinners for content.
- Spinners only for short, indeterminate waits (<1s).
- Progressive loading communicates progress, not just delay.

---

## 16. Flow Diagram Index

For quick reference, the flows map to these user emotions:

| Flow | Entry | Emotional Goal | Exit |
|------|-------|----------------|------|
| First visit | `/` | Calm, curious | Signed up and in `/learn` |
| Returning learner | `/learn` | Welcomed, oriented | Continuing a mastery or starting new |
| Generate | `/learn` panel | Empowered | Curriculum proposal in hand |
| Import | `/learn` modal | Focused | Mastery created |
| Manual creation | `/learn` inline form | Simple, fast | Empty mastery ready |
| Discover | `/learn` panel | Inspired, curious | Forked or browsing |
| Continue learning | `/learn` card | Momentum, clarity | In `/mastery/:id` watching/reading |
| Lesson completion | `/mastery/:id` | Satisfied, rewarded | Progress advanced, next lesson ready |
| Mastery completion | `/mastery/:id` | Proud, shareable | Choosing next action |
| Failure (any) | Anywhere | Calm, supported | Clear next path, no blame |

---

## 17. Approval

These flows are frozen until Phase 4 (Interaction Review).

No flow may be added, removed, or merged without amending this document.

If implementation diverges, implementation is wrong.

---

*This document defines the product's behavioral skeleton. Phase 3 will add wireframes. Phase 4 will strip anything unnecessary.*
