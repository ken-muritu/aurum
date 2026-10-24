# Aurum — Design Compliance Checklist

> **Every PR must satisfy every item.**
> If any item is "No", the PR is not ready.

---

## Routes & Interaction

- [ ] No new routes outside `ia-phase1.md`
- [ ] No new interactions outside `interaction-language-phase35.md`
- [ ] No new component variants outside `component-system-phase5.md`
- [ ] No new components not in the Phase 5 inventory

## Tokens & Styling

- [ ] Uses only approved design tokens
- [ ] No hard-coded colors
- [ ] No hard-coded spacing values
- [ ] No hard-coded radii
- [ ] No custom shadows
- [ ] No inline animation timings
- [ ] No raw hex in JSX
- [ ] No inline styles for layout

## Component Discipline

- [ ] Uses existing component APIs
- [ ] No duplicate components
- [ ] No card inside card
- [ ] No modal inside modal
- [ ] No drawer inside drawer
- [ ] Max nesting depth: 2

## Hierarchy & Behavior

- [ ] One primary action per screen
- [ ] One dominant outcome per screen
- [ ] No competing focal points
- [ ] Empty state has exactly one primary prompt
- [ ] Error state has exactly one recovery action
- [ ] Loading follows skeleton/spinner rules

## Accessibility

- [ ] Keyboard navigation complete
- [ ] Focus order correct
- [ ] `aria-label` on every icon-only control
- [ ] `prefers-reduced-motion: reduce` respected
- [ ] Color is not the only signal
- [ ] Form inputs have labels, not placeholders
- [ ] Error messages announced (`role="alert"`)
- [ ] Heading hierarchy logical
- [ ] Links have descriptive text or `aria-label`

## File Ownership

- [ ] `/design` changes require a design amendment doc
- [ ] `/components` changes implement the Phase 5 contract only
- [ ] `/app` changes compose existing components only
- [ ] `/lib` changes add business logic only
