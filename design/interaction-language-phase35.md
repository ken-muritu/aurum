# Aurum — Phase 3.5: Interaction Language

> **The reusable vocabulary of every screen.**
> If an interaction is not defined here, it does not exist.
> Implementation must reuse these patterns. One-off interactions are forbidden.

---

## 1. Motion

| Element | Pattern | Duration | Easing |
|---------|---------|----------|--------|
| Drawer open/close | Slide from right + fade backdrop | 200ms | ease-out |
| Modal enter/exit | Fade + subtle scale | 180ms | ease-out |
| Progress advance | Immediate width transition | 400ms | ease-in-out |
| Completion glow | Ember → mint filter, then settle | 300ms | ease-out |
| Module complete | Ember pulse on header border | 600ms | ease-in-out |
| Mastery complete | Gold filigree border fade-in | 800ms | ease-out |
| List stagger | Items fade up sequentially | 40ms stagger | ease-out |
| Button hover/press | Slight lift + shadow shift | 100ms | ease-out |
| Nothing else moves | — | — | — |

**Rules:**
- No bounce. No spring. No overshoot.
- `prefers-reduced-motion: reduce` disables all motion except completion glow.
- Motion answers "What changed?" It never entertains.

---

## 2. Elevation

| Level | Visual | When to Use |
|-------|--------|-------------|
| Inline | `position: relative`, no shadow | Within a list row, inside lesson detail |
| Raised | `box-shadow: var(--shadow-s)` | Cards, module headers, lesson rows |
| Floating | `box-shadow: var(--shadow-m)` + `border: 1px solid var(--border)` | Context Drawer, modals, form cards |
| Overlay | `box-shadow: var(--shadow-l)` + backdrop blur | Modal backdrop |

**Rules:**
- Raised is the default for anything containing information.
- Floating is reserved for panels that sit above the page surface.
- Overlay is reserved for things that must feel modal.
- Never stack more than two elevation levels visibly at once.

---

## 3. Buttons

| Variant | Visual | Use |
|---------|--------|-----|
| Primary | `btn-accent` (gold background, dark text) | One per screen. The dominant action. |
| Secondary | `btn-ghost` (transparent, border) | Contextual actions: Use this Mastery, Share, Delete (small) |
| Tertiary | Text link style, icon + label | Low-priority: Add module, Attach resource |
| Danger | `btn-danger` (muted red, never bright red) | Destructive: Delete mastery. Always inline confirm. |
| Ghost | No border, no fill, icon only | Icon buttons in headers and rows |
| Link | Mint text, underline on hover | Auth page swap links |
| Disabled | 40% opacity, no hover state | Loading, lack of permission, empty dependency |
| Loading | Spinner inside button, text hidden | Server round-trip only |

**Rules:**
- `btn-accent` lives only on primary actions.
- No more than one `btn-accent` per screen.
- Ghost icon buttons must have `aria-label`.
- Danger requires context text ("Delete this mastery?"), never just an icon.

---

## 4. Inputs

| Type | Visual | Use |
|------|--------|-----|
| Text | Single border, focus mint ring | Generate input, search, inline creation |
| Textarea | Same border, auto-resize | Notes input |
| Select | Same as text + chevron | Visibility toggle (Private / Public) |
| Search | Compact, icon prefix, clear button | Discover filters, YouTube search |
| Inline edit | Click text → becomes input | Manual title edit |

**States:**
- Focus: `2px solid var(--accent-mint)`, no default browser ring.
- Error: `border-color: var(--accent-ember)`, error text above.
- Loading: skeleton inside input area, never a spinner in the field.

**Rules:**
- All inputs have a single border color by default.
- Validation appears above the input, never beside it.
- Labels are short and above the field, never placeholder-only.

---

## 5. Lists & Spacing

### Mastery List (`/learn`)
- Compact rows.
- Title (left), progress mini-bar (middle), last-accessed (right).
- Chevron at far right indicates navigation.
- `gap: 12px` between rows.
- Hover: row background shifts, not the chevron.

### Module List (`/mastery/:id`)
- Module header: title + completion pill + chevron.
- Lessons indented one level (`padding-left: 24px`).
- `gap: 16px` between modules.
- Current lesson always has a left border accent (mint).

### Lesson Detail
- Resource grid: horizontal scroll, fixed 16:9 aspect ratio thumbnails.
- Notes: chronological, no nesting, plain text.
- Practice: text block, not a card.
- Complete: single button, full-width.

### Cards (marketing page only)
- Max 3 cards above fold on `/`.
- Cards never touch (`gap: 24px` minimum).
- No cards inside authenticated surfaces in v1.

**Rules:**
- Max nesting depth: 2 (module → lesson).
- No card contains another card.
- Vertical rhythm: `8px`, `12px`, `16px`, `24px`, `32px`, `48px` only. No others.

---

## 6. Icons

**Vocabulary:** Tool-like and material-like. Not generic UI chrome.

| Concept | Icon | Note |
|---------|------|------|
| Create | Sparkles | Generation, new mastery |
| Continue | Play / Triangle | Resume lesson |
| Discover | Compass | Browse public masteries |
| Build | Hammer | Manual creation |
| Refine | Spark / Chisel | Completion micro-animation concept |
| Search | Search | YouTube search, filters |
| Attach | Link / Paperclip | Resource attachment |
| Notes | PenLine | Note-taking |
| Share | Share2 | Public link copy |
| Delete | Trash2 | Destructive action |
| Settings | Settings | Future settings |

**Rules:**
- Lucide React is the source. If Lucide lacks an icon, use a minimal inline SVG and add it to `components/ui.jsx`.
- Icons are never decorative. Every icon has a label or `aria-label`.
- Icons never appear without meaning.

---

## 7. Empty States

**Structure (always, in this order):**

```
[Motif icon — muted, not playful]

Message — one sentence, one tense.

[One primary action] ← only one
```

**Rules:**
- Never two equal actions.
- Never "Save or Cancel" as empty-state choices.
- Copy uses Aurum voice, not SaaS voice.
- Motif icon is a single muted object, not an illustration.

---

## 8. Loading

**Rules:**
- Skeleton screens for content loading.
- Spinners only for short indeterminate waits (<1s).
- Never skeleton + spinner together.
- Progressive loading order in `/learn`: Continue → Active Masteries → Context Drawer contents.

---

## 9. Errors

**Structure:**

```
[AlertCircle icon — ember color]

Problem — one sentence, no jargon.

Recovery — one action.
```

**Rules:**
- No stack traces.
- No error codes.
- Never blame the user ("You entered an invalid URL" → "That URL couldn't be reached.").
- Retry is implicit where possible; otherwise explicit single action.

---

## 10. Success & Refinement

**Lesson completion:**
- Check replaces lesson status.
- Progress bar advances.
- Current Focus moves to next uncompleted lesson.
- 300ms ember → mint glow on the completed lesson row.
- No toast, no modal, no badge.

**Module completion:**
- Module header gets ember pulse.
- All lessons in module show checked state.
- Next module becomes Current Focus.

**Mastery completion:**
- Mastery header receives permanent gold filigree border.
- Single inline message: "Mastery refined."
- Three actions, hierarchically weighted:
  1. Dominant: Start a new mastery
  2. Secondary: Share public link
  3. Tertiary: Use this Mastery (fork)

**Rules:**
- No points. No streaks. No badges.
- Completion is the reward.

---

## 11. Focus & Dimming

This is Aurum's signature interaction.

When a lesson expands in `/mastery/:id`:

1. Everything on screen dims by 8% opacity.
2. Expanded lesson becomes fully opaque.
3. Progress rail stays at 100% opacity.
4. Current Focus label highlights.

When entering `/mastery/:id`:

1. Everything fades from 0 → 100% over 300ms.
2. Current Focus row is at full contrast within 100ms.
3. Other modules fade in with 40ms stagger per module.

**Rules:**
- Dimming is maximum 12% opacity drop. If users can't read dimmed content, it failed.
- Dimming never applies to the Context Drawer or modals.
- Focus is the primary way we communicate "what matters now."

---

## 12. Context Drawer

The user never sees the word "Workbench."

Triggered by a single button in `/learn`:

```
+ Start a new mastery
```

Open behavior:
- Slides from right.
- Backdrop dims 12%.
- Contains tabs (Generate | Discover) with Generate default.
- Generate: single input, "Generate" button, "Build manually" link.
- Discover: search + filters + mastery cards.

Close behavior:
- Click backdrop, press Escape, or click X.
- No confirmation.

**Rules:**
- Drawer has no header label exposed to users. No "Workbench" text.
- Generate inside the drawer opens a modal for the proposal (because proposals need width).
- Discover reads inside the drawer because it is a list.
- One primary action per drawer panel at any time.

---

## 13. Approval

This interaction language is frozen until Phase 4 (Interaction Review).

No interaction may be added without amending this document.

No animation may be added without being listed here.

No new button variant may be added.

If implementation diverges, implementation is wrong.
