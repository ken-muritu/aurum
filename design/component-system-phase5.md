# Aurum — Phase 5: Component System

> **The implementation contract for the interaction language.**
> Every token, component, and rule below is executable.
> If it is not here, it does not exist.

---

## 1. Design Tokens

### 1.1 Color

All colors are semantic. Raw hex values are never used directly.

| Token | Value | Use |
|-------|-------|-----|
| `--color-bg` | `#0f0f11` | Page background |
| `--color-surface` | `#18181b` | Card, row, raised surface |
| `--color-surface-raised` | `#222326` | Hovered raised surface |
| `--color-border` | `#2e2e33` | Default border |
| `--color-border-subtle` | `#252528` | Secondary border |
| `--color-text` | `#ededed` | Primary text |
| `--color-text-muted` | `#a1a1aa` | Secondary text |
| `--color-text-faint` | `#71717a` | Tertiary text, placeholders |
| `--color-accent-gold` | `#d4a54a` | Brand, primary action, mastery complete |
| `--color-accent-gold-hover` | `#b8913d` | Gold hover state |
| `--color-accent-gold-muted` | `rgba(212, 165, 74, 0.18)` | Gold glow, tinted backgrounds |
| `--color-accent-mint` | `#5eead4` | Progress, focus, success states |
| `--color-accent-mint-muted` | `rgba(94, 234, 212, 0.18)` | Mint tinted backgrounds |
| `--color-accent-ember` | `#f87171` | Error, danger, destructive |
| `--color-accent-ember-muted` | `rgba(248, 113, 113, 0.18)` | Ember tinted backgrounds |
| `--color-overlay` | `rgba(0, 0, 0, 0.55)` | Modal backdrop |

**Rules:**
- No raw hex in components.
- No color outside this table.
- `--color-accent-gold` is the only brand accent. `mint` is progress/success. `ember` is error/danger. They never appear together on the same component.

### 1.2 Typography

| Token | Value | Use |
|-------|-------|-----|
| `--font-display` | `Fraunces` | Headings, mastery titles, logo |
| `--font-body` | `Satoshi` or `General Sans` fallback | All other text |
| `--text-xs` | `12px` | Captions, timestamps |
| `--text-sm` | `14px` | Secondary text, labels |
| `--text-base` | `16px` | Body, inputs, buttons |
| `--text-lg` | `18px` | Module headers |
| `--text-xl` | `22px` | Section titles |
| `--text-2xl` | `28px` | Mastery title, page headings |
| `--text-3xl` | `36px` | Marketing headlines only |
| `--font-normal` | `400` | Body |
| `--font-medium` | `500` | Buttons, labels |
| `--font-semibold` | `600` | Headings |
| `--font-bold` | `700` | Display only |

**Rules:**
- `Fraunces` is display only. Never body copy.
- Line height: `1.5` for body, `1.2` for headings.
- Max width: `1180px` for `/learn` and `/`. `900px` for `/mastery/:id`.

### 1.3 Spacing

| Token | Value | Use |
|-------|-------|-----|
| `--space-1` | `4px` | Micro gaps, icon padding |
| `--space-2` | `8px` | Compact spacing |
| `--space-3` | `12px` | List row gaps, tight spacing |
| `--space-4` | `16px` | Default spacing |
| `--space-5` | `24px` | Card padding, section gaps |
| `--space-6` | `32px` | Section breathing room |
| `--space-7` | `48px` | Page-level section gaps |

**Rules:**
- Only these values. No arbitrary spacing.
- Vertical rhythm must align to `--space-2` increments.

### 1.4 Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | `4px` | Small elements, badges |
| `--radius-md` | `8px` | Cards, inputs, buttons, rows |
| `--radius-lg` | `12px` | Modals, drawer, large cards |
| `--radius-full` | `9999px` | Pills, avatars |

**Rules:**
- No other radii.

### 1.5 Shadows

| Token | Value | Use |
|-------|-------|-----|
| `--shadow-s` | `0 1px 2px rgba(0,0,0,0.4)` | Raised surfaces |
| `--shadow-m` | `0 4px 12px rgba(0,0,0,0.5)` | Floating panels |
| `--shadow-l` | `0 12px 32px rgba(0,0,0,0.6)` | Overlay elements |

**Rules:**
- No custom shadows.

### 1.6 Motion

| Token | Value | Use |
|-------|-------|-----|
| `--duration-fast` | `100ms` | Button hover/press |
| `--duration-normal` | `200ms` | Drawer open/close |
| `--duration-slow` | `400ms` | Progress advance |
| `--duration-slower` | `600ms` | Module complete pulse |
| `--duration-slowest` | `800ms` | Mastery complete filigree |
| `--easing-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Enter, open |
| `--easing-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Progress, neutral |
| `--stagger` | `40ms` | List item intervals |

**Rules:**
- No inline timing values.
- All motion maps to these tokens.

### 1.7 Z-Index

| Token | Value | Use |
|-------|-------|-----|
| `--z-base` | `0` | Page content |
| `--z-raised` | `10` | Drawer, dropdowns |
| `--z-overlay` | `20` | Modal backdrop |
| `--z-modal` | `30` | Modal content |
| `--z-toast` | `40` | Toasts (reserved) |

**Rules:**
- No z-index above 50.

---

## 2. Component Inventory

### 2.1 Core
- Button
- Input
- Textarea
- Select
- EmptyState
- ErrorState
- Skeleton
- Toast (reserved for later, not in v1 spec)

### 2.2 Layout
- Drawer
- Modal
- Tabs
- Progress (horizontal bar)
- ProgressRail (vertical)

### 2.3 Data Display
- MasteryRow
- ModuleRow
- LessonRow
- ContinueCard
- ResourceCard
- Note
- CompletionPill

### 2.4 Feedback
- RefinementGlow (lesson complete)
- EmberPulse (module complete)
- FiligreeBorder (mastery complete)
- FocusDim (contextual dimming)

---

## 3. Component API

### 3.1 Button

| Prop | Type | Default | Use |
|------|------|---------|-----|
| `variant` | `primary` / `secondary` / `tertiary` / `danger` / `ghost` / `link` | `primary` | Visual variant |
| `loading` | `boolean` | `false` | Show spinner, hide text |
| `disabled` | `boolean` | `false` | 40% opacity, no hover |
| `icon` | `ReactNode` | `null` | Optional leading icon |
| `iconOnly` | `boolean` | `false` | Requires `aria-label` |
| `onClick` | `function` | — | Click handler |
| `children` | `ReactNode` | — | Label text |

**Rules:**
- `variant="primary"` renders `btn-accent`.
- `iconOnly` without `aria-label` is a lint error.
- `loading` and `disabled` are mutually exclusive; `loading` wins.

### 3.2 Input

| Prop | Type | Default | Use |
|------|------|---------|-----|
| `label` | `string` | `null` | Short label above input |
| `error` | `string` | `null` | Error text above input |
| `loading` | `boolean` | `false` | Skeleton inside input area |
| `icon` | `ReactNode` | `null` | Optional prefix icon |
| `clearable` | `boolean` | `false` | Show clear button |
| `onChange` | `function` | — | Value change |
| `value` | `string` | — | Controlled value |

**Rules:**
- `error` is always above the input.
- `loading` never shows a spinner inside the field.

### 3.3 Drawer

| Prop | Type | Default | Use |
|------|------|---------|-----|
| `open` | `boolean` | `false` | Visibility |
| `onClose` | `function` | — | Close handler |
| `children` | `ReactNode` | — | Drawer content |
| `width` | `string` | `480px` | Drawer width |

**Rules:**
- Backdrop dims 12%.
- Escape closes.
- No header label exposed to users.

### 3.4 Modal

| Prop | Type | Default | Use |
|------|------|---------|-----|
| `open` | `boolean` | `false` | Visibility |
| `onClose` | `function` | — | Close handler |
| `title` | `string` | `null` | Accessible label |
| `children` | `ReactNode` | — | Modal content |
| `width` | `string` | `640px` | Max width |

**Rules:**
- Fade + scale enter/exit.
- Backdrop click closes.
- Escape closes.
- Title is required for accessibility.

### 3.5 Progress

| Prop | Type | Default | Use |
|------|------|---------|-----|
| `value` | `number` | `0` | 0-100 |
| `done` | `boolean` | `false` | 100% glow state |
| `label` | `string` | `null` | Screen reader label |

**Rules:**
- Width transition 400ms ease-in-out.
- `done` adds gold filigree glow.

### 3.6 ProgressRail

| Prop | Type | Default | Use |
|------|------|---------|-----|
| `modules` | `Array` | `[]` | Module completion data |
| `activeId` | `string` | `null` | Current module highlight |

**Rules:**
- Sticky on desktop.
- Collapses to inline indicators on mobile.

### 3.7 MasteryRow

| Prop | Type | Default | Use |
|------|------|---------|-----|
| `title` | `string` | — | Mastery title |
| `progress` | `number` | `0` | 0-100 |
| `lastAccessed` | `string` | `null` | Relative time string |
| `onClick` | `function` | — | Navigate to `/mastery/:id` |

**Rules:**
- Compact row.
- Chevron on far right.

### 3.8 ContinueCard

| Prop | Type | Default | Use |
|------|------|---------|-----|
| `mastery` | `object` | — | Mastery data |
| `moduleTitle` | `string` | — | Current module |
| `lessonTitle` | `string` | — | Current lesson |
| `progress` | `number` | `0` | 0-100 |
| `onResume` | `function` | — | Resume handler |

**Rules:**
- Full-width.
- Dominant `btn-accent` Resume button.
- Progress bar always visible.

### 3.9 ErrorState

| Prop | Type | Default | Use |
|------|------|---------|-----|
| `icon` | `ReactNode` | `AlertCircle` | Ember icon |
| `title` | `string` | — | Problem sentence |
| `action` | `ReactNode` | `null` | Single recovery action |

**Rules:**
- Always: icon, title, action.
- No stack traces.

### 3.10 EmptyState

| Prop | Type | Default | Use |
|------|------|---------|-----|
| `icon` | `ReactNode` | — | Muted motif icon |
| `message` | `string` | — | One sentence |
| `action` | `ReactNode` | `null` | Single primary action |

**Rules:**
- Always: icon, message, action.
- Never two equal actions.

### 3.11 Skeleton

| Prop | Type | Default | Use |
|------|------|---------|-----|
| `width` | `string` | `100%` | Element width |
| `height` | `string` | `16px` | Element height |
| `radius` | `string` | `var(--radius-md)` | Corner radius |

**Rules:**
- Never skeleton + spinner together.

---

## 4. Composition Rules

### 4.1 Which Components May Contain Others

| Parent | May Contain | Forbidden |
|--------|-------------|-----------|
| `/learn` | ContinueCard, MasteryRow list, Drawer trigger | Cards, footer, global nav |
| `/mastery/:id` | ModuleRow, LessonRow, ProgressRail, LessonDetail | Card inside card, sidebar nav |
| Drawer | Tabs, Generate Modal, MasteryRow cards | Forms that belong in modals |
| Modal | Form, proposal content | Nested modals |
| LessonDetail | ResourceCard, Note, Practice, Complete button | Module headers |
| ContinueCard | Progress, title, Resume button | Secondary actions |
| EmptyState | Icon, message, action | Multiple actions |

### 4.2 Forbidden Nesting

- No card contains another card.
- No modal contains another modal.
- No drawer contains a drawer.
- Max depth: module, lesson, resource/note/practice.

### 4.3 Responsive Collapse

| Desktop (>1024px) | Tablet (768px-1024px) | Mobile (<768px) |
|-------------------|-----------------------|-----------------|
| `/learn` two-column | Single column, Drawer full-width | Single column, Drawer full-screen |
| `/mastery/:id` side rail | Rail becomes sticky header | Rail becomes inline indicators |
| Context Drawer 480px | Drawer 100% width | Drawer 100% width, full-screen |
| Modal 640px | Modal 90% width | Modal 100% width |
| Auth split layout | Full-width card | Full-width card |

**Rules:**
- Mobile breakpoint: `768px`.
- Tablet breakpoint: `1024px`.
- No device-specific components; only responsive collapse.

---

## 5. Visual Tokens

### 5.1 Surface Hierarchy

| Layer | Token | Use |
|-------|-------|-----|
| Page | `--color-bg` | Background |
| Raised | `--color-surface` | Cards, rows |
| Hovered | `--color-surface-raised` | Hover state |
| Border | `--color-border` | Default border |
| Subtle | `--color-border-subtle` | Secondary border |

### 5.2 Border System

| Token | Value | Use |
|-------|-------|-----|
| `--border-default` | `1px solid var(--color-border)` | Default |
| `--border-subtle` | `1px solid var(--color-border-subtle)` | Secondary |
| `--border-focus` | `2px solid var(--color-accent-mint)` | Focus ring |
| `--border-complete` | `2px solid var(--color-accent-gold)` | Completion state |

**Rules:**
- No border width other than `1px` or `2px`.
- Border color always uses a token.

### 5.3 Text Hierarchy

| Level | Token | Weight | Use |
|-------|-------|--------|-----|
| Display | `--text-3xl` | `700` | Marketing only |
| Heading | `--text-2xl` | `600` | Mastery title, page heading |
| Section | `--text-xl` | `600` | Section titles |
| Subsection | `--text-lg` | `500` | Module headers |
| Body | `--text-base` | `400` | Default |
| Secondary | `--text-sm` | `400` | Labels, metadata |
| Caption | `--text-xs` | `400` | Timestamps, faint text |

---

## 6. Interaction Contracts

### 6.1 Focus
- Focus ring: `2px solid var(--color-accent-mint)`, offset `2px`.
- Focus never removed; only hidden with `:focus-visible`.
- Dimming does not remove elements from focus order.

### 6.2 Hover
- Raised surfaces: background shifts to `--color-surface-raised`.
- Buttons: lift `1px` + shadow shift.
- Rows: background shift, no chevron movement.

### 6.3 Active
- Buttons: slight scale down (`0.98`) + shadow reduce.
- Duration: `100ms`.

### 6.4 Disabled
- `opacity: 0.4`.
- No hover, no active, no cursor pointer.

### 6.5 Loading
- Skeleton for content.
- Spinner only for `<1s` indeterminate.
- Button loading: spinner inside, text hidden.

### 6.6 Success
- Check icon for lesson completion.
- Progress advance with 400ms transition.
- Focus glow for current lesson.

### 6.7 Failure
- `--color-accent-ember` border.
- ErrorState component.
- One recovery action.

---

## 7. Animation Tokens

### 7.1 Presets

| Preset | Duration | Easing | Use |
|--------|----------|--------|-----|
| `drawer` | 200ms | ease-out | Drawer open/close |
| `modal` | 180ms | ease-out | Modal enter/exit |
| `progress` | 400ms | ease-in-out | Progress advance |
| `refinement` | 300ms | ease-out | Lesson complete glow |
| `emberPulse` | 600ms | ease-in-out | Module complete |
| `filigree` | 800ms | ease-out | Mastery complete border |
| `fadeUp` | 300ms | ease-out | List stagger / entrance |
| `buttonHover` | 100ms | ease-out | Button hover/press |
| `focusDim` | 300ms | ease-in-out | Contextual dimming |

### 7.2 Reduced Motion

- All durations become `0ms` except `refinement` (`300ms`).
- All easing becomes `linear`.
- No spring or overshoot.

### 7.3 Stagger

- List items: `40ms` between each.
- Max stagger: `8` items. Beyond that, batch.

**Rules:**
- No inline timing values.
- No custom easings outside presets.

---

## 8. Implementation Mapping

### 8.1 React Components

| Component | File | Maps To |
|-----------|------|---------|
| `Button` | `components/ui.jsx` | Variants, states |
| `Input` | `components/ui.jsx` | Types, states |
| `Textarea` | `components/ui.jsx` | Auto-resize |
| `Drawer` | `components/Drawer.jsx` | Slide panel |
| `Modal` | `components/Modal.jsx` | Centered overlay |
| `Progress` | `components/ui.jsx` | Horizontal bar |
| `ProgressRail` | `components/ProgressRail.jsx` | Vertical rail |
| `MasteryRow` | `components/MasteryRow.jsx` | Compact list row |
| `ModuleRow` | `components/ModuleRow.jsx` | Module header + chevron |
| `LessonRow` | `components/LessonRow.jsx` | Expandable lesson row |
| `ContinueCard` | `components/ContinueCard.jsx` | Dominant home card |
| `ResourceCard` | `components/ResourceCard.jsx` | Thumbnail + metadata |
| `ErrorState` | `components/ErrorState.jsx` | Icon + problem + recovery |
| `EmptyState` | `components/EmptyState.jsx` | Motif + message + action |
| `Skeleton` | `components/Skeleton.jsx` | Placeholder shape |
| `Tabs` | `components/Tabs.jsx` | Tab switcher |
| `CompletionPill` | `components/CompletionPill.jsx` | Check / count label |

### 8.2 CSS Variables

| Category | Root |
|----------|------|
| Color | `:root { --color-* }` |
| Typography | `:root { --text-*, --font-* }` |
| Spacing | `:root { --space-* }` |
| Radius | `:root { --radius-* }` |
| Shadows | `:root { --shadow-* }` |
| Motion | `:root { --duration-*, --easing-*, --stagger }` |
| Z-index | `:root { --z-* }` |

**Rules:**
- No hard-coded values in components.
- Every design decision lives in a token or component preset.

### 8.3 Icons

| Source | Rule |
|--------|------|
| `lucide-react` | Primary source |
| Missing icons | Minimal inline SVG in `components/ui.jsx` |
| Decorative icons | Forbidden |
| Icon without label | Requires `aria-label` |

### 8.4 Motion

| Source | Rule |
|--------|------|
| All animation | Framer Motion presets in this document |
| CSS fallback | Keyframes only for `prefers-reduced-motion` |
| JS animation outside presets | Forbidden |

---

## 9. Never Section

These are permanent prohibitions for the component system.

- **No custom shadows.** Use `--shadow-s`, `--shadow-m`, `--shadow-l`.
- **No arbitrary spacing values.** Use `--space-*` only.
- **No hard-coded colors.** Use `--color-*` only.
- **No inline animation timings.** Use `--duration-*` and `--easing-*` presets.
- **No components introducing new interaction patterns.** All patterns live in `interaction-language-phase35.md`.
- **No duplicate components.**
- **No components with more than one primary responsibility.**
- **No card inside a card.**
- **No modal inside a modal.**
- **No drawer inside a drawer.**
- **No raw hex values in JSX.**
- **No inline styles for layout.** Use classes mapped to tokens.
- **No decorative CSS.** Every border, shadow, and animation must serve hierarchy or behavior.

---

## 10. Approval

This component system is frozen until Phase 6 (Responsive Rules).

No token may be added without amending this document.

No component may be added without amending this document.

No variant may be added without amending this document.

If implementation diverges, implementation is wrong.
