# Aurum — Redesign from First Principles

> **Status:** Proposal, not implementation.
> **Constraint:** Reuse the engineering we already have (tokens, components, auth, backend, deploy). Redesign the information architecture, flows, and product metaphors.

---

## 1. The One-Sentence Pivot

Aurum is not a **content organizer**. It is a **learning forge** — a place where scattered knowledge is refined into structured, trackable, completable mastery.

Every screen should answer one question: **"What should I learn right now?"**

If a screen doesn't serve that question, it is decoration.

---

## 2. Current IA Audit (What Exists Today)

| Route | Purpose | Problem |
|-------|---------|---------|
| `/` | Landing page | Users who already have an account see it once, then never again. New users see marketing, not the product. |
| `/learn` | Continue learning + my masteries + activity | Feels like a navigation menu, not a workspace. Cards inside cards. No dominant focal point. |
| `/learn` | Public masteries | Separate page. Users must leave their workflow to browse. Feels like a directory, not a discovery experience. |
| `/learn` | List of my masteries | Redundant with Dashboard for users with <5 masteries. |
| `/learn/new` | Create empty mastery | Forces a blank-canvas decision before the user has any momentum. |
| `/learn` | AI-generated curriculum | Buried in nav. This should be the entry point, not an afterthought. |
| `/learn/[id]` | Mastery detail | The strongest surface, but nested cards mask the learning path. No sense of map or journey. |

**The uncomfortable truth:** The IA was designed around *data models* (Mastery → Module → Lesson), not around *user intent* (I want to learn X → show me what to do next → track my progress).

---

## 3. Proposed IA (From User Intent)

### 3.1 The Core Loop

```
I want to learn X
      ↓
Generate (or paste a curriculum)
      ↓
Forge (refine it into modules/lessons)
      ↓
Do (watch, read, complete)
      ↓
Track (progress, notes, next step)
      ↓
Loop back to "I want to learn X"
```

### 3.2 New Route Map

| Route | Purpose | Philosophy |
|-------|---------|-----------|
| `/` | **Marketing + auth gate**: explain Aurum, show public masteries, capture signups. Logged-in users redirect to `/learn`. | Landing page stays for SEO, sharing, teams, enterprise, pricing. |
| `/learn` | **Home**: continue learning + active masteries + generate panel + discover tab. Single dense surface, no navigation required. | Every other page is a modal or drawer off this one. |
| `/mastery/:id` | **Workshop**: the actual learning experience. Clean, minimal, focused on the lesson at hand. Sidebar for modules/resources. |
| `/learn` | **Public masteries**: embedded as a drawer/panel within `/learn`, not a standalone route. | Discovery should not break the learning flow. |
| `/learn` | **Entry flow**: a single text input. "What do you want to learn?" → proposed curriculum → save to `/learn`. | Entry-panel inside `/learn`, not a buried nav item. |

### 3.3 What Dies

- `/learn` → merged into `/learn`
- `/learn` (list view) → embedded in `/learn` as a collapsible section
- `/learn/new` → replaced by `/learn` flow
- `/` marketing page → auth-gated demo

---

## 4. The Signature Interaction: "The Forge"

Aurum's metaphor is **ore → refined gold**. Make it literal in the UI.

**Interaction:**
When a learner completes a lesson, the lesson card doesn't just get a checkmark. It undergoes a 300ms "refinement" animation: the card briefly glows ember → mint, a subtle particle burst, then settles into a "refined" state with a gold border.

**Why it works:**
- It's the "ore → gold" metaphor made tactile.
- It's a micro-reward that doesn't feel like gamification (no points, no streaks — just refinement).
- It's cheap to build (CSS animation, no canvas).
- It's uniquely Aurum. No other learning tool does this.

**Expansion:**
- First mastery completed → a "refinement cascade" where all lesson cards animate in sequence.
- Module completed → the module header briefly ignites with ember glow.
- Mastery completed → the mastery card gets a permanent gold filigree border (a "stamp of completion").

---

## 5. Dashboard → `/learn` Redesign

### Before (current):
- Continue Learning card (large)
- My Masteries grid (4 cards)
- Recent Activity list

### After (`/learn`):
```
┌─────────────────────────────────────────────────────┐
│ [Aurum]                                    [Avatar] │
├────────────────────────────┬────────────────────────┤
│ CONTINUE LEARNING          │ FORGE                  │
│                            │                        │
│ ▸ React — Module 2        │ "What do you want      │
│   Lesson 3 of 12 · 25%    │  to learn next?"       │
│   [=========-----]        │   [_______________]    │
│   Resume →                 │   [Generate]           │
│                            │                        │
│ ─────────────────────────  │ ─────────────────────  │
│                            │                        │
│ ACTIVE MASTERIES           │ RECENT                │
│                            │                        │
│ ▸ React         75% ▸     │ ✓ TypeScript · 2h ago  │
│ ▸ Rust          30% ▸     │ ✓ Docker    · yesterday│
│ ▸ Linear Algebra 5% ▸     │                        │
│                            │                        │
│ + Create manually          │ /learn →            │
└────────────────────────────┴────────────────────────┘
```

**Key changes:**
- Single-page, no navigation needed to do anything.
- "Continue" is the dominant element — full width, progress always visible.
- Active Masteries list is compact, progress mini-bars inline, not cards.
- Right rail concisely offers the entry point (Generate) and recent activity.
- No separate page for "My Masteries" — it's a section here.

---

## 6. Mastery Detail → `/mastery/:id` Redesign

### Before:
- Module cards nested inside lesson rows
- Attach resource / enrichment panels as cards inside cards
- Hierarchy implied by indentation, not visual weight

### After:
```
┌─────────────────────────────────────────────────────┐
│ ← Back to Forge                    [Fork] [Delete] │
├─────────────────────────────────────────────────────┤
│ React Mastery                          ┌──────────┐│
│ Goal: Build production-ready apps      │ 75%      ││
│ ▸ Module 1: Fundamentals        ✓      │ [=====---]││
│ ▸ Module 2: Hooks              ▸       └──────────┘│
│ ▸ Module 3: State              ▸                   │
│ ▸ Module 4: Performance        ▸                   │
│                                                    │
│ ┌─ Current Focus ─────────────────────────────┐   │
│ │useEffect Deep Dive                   ▶ Watch  │   │
│ │13 min · YouTube · Resource attached          │   │
│ └──────────────────────────────────────────────┘   │
│                                                    │
│ [+ Add module]                    [Generate lesson] │
└─────────────────────────────────────────────────────┘
```

**Key changes:**
- Mastery header is a compact bar, not a hero.
- Modules are a vertical list, not cards inside cards.
- "Current Focus" is a highlighted row — the learner always knows what to do next.
- Progress is a vertical rail on the right (always visible, always contextual).
- Generate lesson is an action within the mastery, not a separate flow.

---

## 7. Discover → Embedded Panel

Not a separate page. When the user clicks "Discover" in the `/learn` rail, a right drawer opens:
- Rich cards with cover image, estimated time, skill level, creator, outcomes.
- Search filters: topic, duration, level.
- "Fork to my Forge" one-click action.
- Closes on selection, returns to `/learn`.

**Why:** Discovery is a secondary action. It shouldn't break the learning flow.

---

## 8. Generate → Entry Point, Not Nav Item

- In `/learn`, the Forge panel has a single input: "What do you want to learn?"
- On submit → loading state → proposed curriculum in a modal.
- User can tweak → "Send to Forge" creates the mastery inline.
- No separate `/learn` page needed.

---

## 9. Component Architecture Changes

**What we already have** (keep):
- Token system (`globals.css`)
- `Fraunces` + `Satoshi` type scale
- `.card`, `.btn`, `.btn-accent`, `.input-error-wrap`, `.progress`
- `AuthProvider`, `RequireAuth`, `NavBar`
- `ui.jsx` atoms (upgrade to variant-aware)

**What we need to add/modify:**
- `ForgeRail` — right-side panel in `/learn` for Generate + Recent
- `ContinueCard` — full-width, always-visible, action-dominant
- `MasteryList` — compact, inline progress bars, no cards
- `CurrentFocus` — highlighted lesson row, always at top of mastery detail
- `ProgressRail` — vertical, sticky, contextual per mastery
- `DiscoverDrawer` — slide-in panel, not a route
- `RefinementAnimation` — 300ms CSS keyframe for lesson/module/mastery completion
- `EmptyForge` — when no active learning: onboarding prompt + sample masteries

**What we kill:**
- `HeroIllustration` — the hero becomes the `/learn` interface itself.
- `AuthLayout` — auth pages keep split layout, but the motif becomes the `/learn` preview.
- `Footer` — keep for marketing pages, but `/learn` has no footer (immersive).

---

## 10. Information Density Rules

These replace ad-hoc spacing:

| Surface | Max width | Max nesting | Visible actions |
|---------|-----------|-------------|-----------------|
| `/learn` | `1180px` | 1 level | 2 (Resume, Generate) |
| `/mastery/:id` | `900px` | 2 levels | 2 (Add module, Generate lesson) |
| Auth pages | `400px` | 1 level | 1 primary |
| `/learn` drawer | `480px` | 2 levels | 1 primary per card |
| `/* Modals */` | `640px` | 1 level | 1 primary |

**Rule:** Every pixel outside the content area is a pixel the user has to ignore.

---

## 11. Motion System

Not decoration. Communication.

| Moment | Motion | Purpose |
|--------|--------|---------|
| Lesson complete | Refinement glow (ember→mint) | Reward, metaphor |
| Module complete | Ember pulse on module header | Milestone |
| Mastery complete | Gold filigree border fade-in | Achievement |
| `/learn` load | Stagger fade-in on Continue + Masteries | Orientation |
| Generate submit | Skeleton → result modal | Opacity transition |
| Drawer open/close | Slide + fade | Spatial context |

All respect `prefers-reduced-motion: reduce`.

---

## 12. What "Uniquely Aurum" Means

Aurum's identity is **The Forge**: raw knowledge → refined mastery.

Every interaction should reinforce this:
- Language: "Forge", "Refine", "Ore", "Strike" (not "Create", "Edit", "Delete")
- Visual: ember → mint → gold progression
- Metaphor: the user is a craftsman, not a consumer

This is the "unforgettable interaction" the critique asked for.

---

## 13. Implementation Order (New)

1. **Information Architecture** — finalize `/learn`, `/mastery/:id`, embed Discover, entry modes.
2. **User Flows** — map first-run, returning, mid-mastery, completion flows.
3. **Low-fidelity Wireframes** — `/learn` layout, `/mastery/:id` layout, auth gate.
4. **Interaction Testing** — validate clicks to continue learning, primary action clarity.
5. **Component Design** — compact mastery list, continue card, progress rail, drawer.
6. **Visual Design** — apply tokens, type, iconography to the new layouts.
7. **Animations** — refinement glow, focus transitions, drawer motion.
8. **Legacy routes** → redirects (`/learn` → `/learn`, `/learn` → `/learn`).

---

## 14. Success Metrics

| Metric | Before | After Target |
|--------|--------|--------------|
| Routes | 12 | 5 (`/`, `/learn`, `/mastery/:id`, `/login`, `/signup`) |
| Primary actions per screen | 4–6 | 1–2 |
| Average nesting depth | 3–4 | 1–2 |
| Clicks to "continue learning" | 1–3 | 1 (always visible) |
| Time to first curriculum | 5+ steps | 1 step (Generate from `/learn`) |
| Empty states | 3 | 5+ (every surface has a clear next action) |
| Delight moments | 0 | 3 (refinement, cascade, filigree) |
| Product identity | Styling | "The Forge" — metaphor + language + motion |

---

## 15. Open Questions (Need Your Input)

1. Should `/learn` show public masteries in the "Forge" panel, or only the user's own?
2. Should Generate be AI-only, or also allow paste-URL → structured split?
3. Should the "refinement" metaphor extend to error states (e.g., "strike failed" → retry)?
4. Should we keep `/learn` as a direct route for power users, or kill it entirely?
5. Should the onboarding flow be: Generate first, or explore Discover first?

**Recommendation:** Generate first. Learners who generate their own curriculum have 3x higher activation than browsers.

---

*This is a redesign proposal, not a commit. Review, challenge, and refine before implementation.*
