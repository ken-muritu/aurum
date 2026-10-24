# Aurum — Phase 3: Wireframes

> **Low-fidelity. Grayscale. No color, no gradients, no typography styling.**
> **If a wireframe cannot communicate hierarchy in under 3 seconds, it fails.**
> **Whitespace is structural. Every wireframe answers one question.**

---

## 1. `/learn` — Home

**Question:** What should I learn right now?

**Attention order:** Continue card → Active masteries → Context Drawer

```
┌──────────────────────────────────────────────────────────────────┐
│ Aurum                                        [avatar]            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ LEARN ─────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  React Mastery                                           │   │
│  │  Module 2: Hooks · Lesson 3 of 12                        │   │
│  │  ████████████████░░░░░░░░░░░░░  25%                      │   │
│  │                                                          │   │
│  │  [ Resume ] ← dominant, full-width, btn-accent            │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ACTIVE MASTERIES                                                │
│                                                                  │
│  ▸ Rust             30% ▸   Updated 2h ago                     │
│  ▸ Linear Algebra    5% ▸   Updated yesterday                  │
│  ▸ TypeScript      100% ▸   Completed                          │
│                                                                  │
│  + Start a new mastery                                           │
│                                                                  │
│                                                                  │
│                                          [Workbench] →          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

CONTEXT DRAWER (Workbench) — dismissed by default
┌──────────────────────────────────────────────────────────────────┐
│ Workbench                                           [close]      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  What do you want to master?                                     │
│  [__________________________________________] [Generate]        │
│                                                                  │
│  or [Build manually]                                             │
│                                                                  │
│  ─ Browse ──────────────────────────────────────────────────   │
│                                                                  │
│  public masteries, search, filters                               │
│  cards: cover | title | time | level | fork count               │
│                                                                  │
│  [Use this Mastery] ← primary per card                          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Rules:**
- `/learn` is one column. No persistent right rail.
- Continue card is full-width and dominant. It answers the core question immediately.
- Active masteries are a compact list, not cards.
- `+ Start a new mastery` is secondary — leads to the Workbench.
- Workbench is a tabbed, dismissible drawer. It contains Generate, Discover, and future tools.

---

## 2. `/mastery/:id` — Workshop

**Question:** What should I do right now to make progress on this mastery?

**Attention order:** Current Focus → Modules → Progress rail

```
┌──────────────────────────────────────────────────────────────────┐
│ ← Back to Learn               React Mastery            75%      │
│                              [Fork] [Delete]                    │
├─────────────────────────────────────────┬────────────────────────┤
│                                         │                        │
│ ┌─ CURRENT FOCUS ─────────────────────┐ │   MODULES              │
│ │ useEffect Deep Dive            ▶    │ │   ▸ Module 1 ✓          │
│ │ 13 min · YouTube                     │ │   ▸ Module 2           │
│ │                         [Watch]      │ │     ▸ Lesson 2.1 ✓      │
│ └─────────────────────────────────────┘ │     ▸ Lesson 2.2 ▸      │
│                                         │         ↑ focus         │
│ ── Modules ───────────────────────────── │     ▸ Lesson 2.3        │
│                                         │   ▸ Module 3             │
│ ▸ Module 1: Fundamentals          ✓     │   ▸ Module 4             │
│ ▸ Module 2: Hooks                           │                        │
│   ▸ Lesson 2.1: useState           ✓      │                        │
│   ▸ Lesson 2.2: useEffect          ▸       │                        │
│   ▸ Lesson 2.3: useReducer         ▸       │                        │
│ ▸ Module 3: State                     ▸     │                        │
│ ▸ Module 4: Performance               ▸     │                        │
│                                         │                        │
│ [_Add module_]                    [Add lesson]                  │
│                                         │                        │
└─────────────────────────────────────────┴────────────────────────┘
```

**Expanded lesson (inline, not a new route):**
```
When "Lesson 2.2" is clicked:

┌──────────────────────────────────────────────────────────────────┐
│ useEffect Deep Dive ↓                                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  RESOURCES                                                        │
│                                                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐                                    │
│  │ [img] │ │ [img] │ │ [doc] │                                  │
│  │ YouTube│ │ YouTube│ │  blog │                                      │
│  │ 10:24 │ │ 08:15 │ │  8 min│                                  │
│  └──────┘ └──────┘ └──────┘                                    │
│                                                                  │
│  Resource: [Attach video or link]                                │
│                                                                  │
│  ── NOTES ──────────────────────────────────────────────────   │
│                                                                  │
│  Just now                                                        │
│  useEffect cleanup runs before unmount...                        │
│                                                                  │
│  [__________________________________________] [Save]             │
│                                                                  │
│  ── PRACTICE ──────────────────────────────────────────────    │
│                                                                  │
│  Build a counter with cleanup.                                   │
│                                                                  │
│  ── COMPLETE ──────────────────────────────────────────────    │
│                                                                  │
│  [Mark complete] ← single action                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Rules:**
- Mastery header is a compact bar, not a hero.
- Current Focus is a highlighted row at the top — no more than one lesson gets this treatment.
- Modules are a vertical list. Lessons are indented one level.
- Progress rail is on the right, sticky, shows vertical completion.
- Lesson detail expands inline below the clicked lesson. It follows the rhythm: Resource → Notes → Practice → Complete.
- Completion is a single click with refinement animation. No confirmation dialog.

---

## 3. Auth Pages — `/login` / `/signup`

**Question:** How do I get in?

**Attention order:** Form fields → Primary button

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   ┌───────────────────┐   ┌───────────────────────────────┐     │
│   │                   │   │                               │     │
│   │                   │   │  Aurum                         │     │
│   │                   │   │  Refine knowledge into mastery  │     │
│   │                   │   │                               │     │
│   │  motif / muted    │   │  [form]                        │     │
│   │  hero SVG         │   │                               │     │
│   │  no text          │   │  [primary button]             │     │
│   │                   │   │                               │     │
│   │                   │   │  [secondary link]             │     │
│   │                   │   │                               │     │
│   └───────────────────┘   └───────────────────────────────┘     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Rules:**
- Split layout: left muted motif, right form card.
- One form. One primary button. No navigation within the form.
- Error states: icon + text, not color-only.
- Auth pages are the only surfaces where a split layout exists.

---

## 4. `/` — Marketing Surface

**Question:** What is this, and should I care?

**Attention order:** Value prop → CTA → Proof

```
┌──────────────────────────────────────────────────────────────────┐
│ Aurum                                                    [Log in]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│  Turn scattered knowledge into                                            │
│  completed mastery.                                               │
│                                                                  │
│  [Start learning]  [Browse public masteries]                     │
│                                                                  │
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │ [cover]     │ │ [cover]     │ │ [cover]     │              │
│  │ React       │ │ Rust        │ │ TypeScript  │              │
│  │ 12 lessons  │ │ 8 lessons   │ │ 6 lessons   │              │
│  │ by @ken     │ │ by @alex    │ │ by @sam     │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│                                                                  │
│                                                                  │
│  Generate → Structure → Complete                                 │
│                                                                  │
│  [Footer: Product | Resources | Company]                         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Rules:**
- No hero illustration in the old sense. The "illustration" is the product.
- Featured masteries show cover, title, lesson count, creator.
- CTA is singular. No navigation menu for unauth users.

---

## 5. Focus Modes (Not Routes)

Aurum thinks in focus modes, not pages. Every route supports one or more modes.

| Route | Mode | Lens |
|-------|------|------|
| `/` | Browse | External validation |
| `/learn` | Browse | What should I learn next? |
| `/learn` | Build | Creating or importing a mastery |
| `/mastery/:id` | Focus | The current lesson and its resources |
| `/mastery/:id` | Reflect | Notes, practice, completion |
| Auth | Enter | Authentication only |

**Rule:** A focus mode is a mental frame, not a UI state. The same `/mastery/:id` route supports both Focus (current lesson prominent) and Reflect (notes section expanded) without routing changes.

---

## 6. Wireframe Ranking (Hierarchy Checklist)

Every wireframe must satisfy:

```
1. Dominant focal point visible within 1 second?
   ✓ Yes
2. Primary action obvious without reading copy?
   ✓ Yes
3. Secondary actions visually subordinate?
   ✓ Yes
4. User knows where they are (breadcrumb/title)?
   ✓ Yes
5. User knows what to do next (Continue / Watch / Mark complete)?
   ✓ Yes
6. No competing focal points?
   ✓ Yes
7. No more than one visible modal/prompt?
   ✓ Yes
8. No decorative elements remaining?
   ✓ Yes
```

---

## 7. What Dies in Wireframes

| Element | Reason |
|---------|--------|
| Global nav in authenticated experience | `/learn` is the home; drawers replace nav |
| Footer on `/learn` | Breaks immersion; footer on `/` only |
| Hero section on `/learn` | The product is the hero; use Continue card instead |
| Sidebar on `/mastery/:id` | Progress rail is sufficient; no nav sidebar needed |
| Cards grid for masteries | Compact list is faster to scan and less intrusive |
| Module cards with nested children | Vertical list with one-level indent; cards inside cards violate max nesting 2 |
| Recent section in `/learn` | Competes with Continue + Active; remove from v1 |

---

## 8. Next Steps

- Validate hierarchy with 2–3 learner personas before implementation.
- Test: "Given this wireframe, can the user identify the primary action and next step without explanation?"
- If any wireframe requires copy to explain itself, it fails.
- Proceed to Phase 4 (Interaction Review) once wireframes are ratified.
