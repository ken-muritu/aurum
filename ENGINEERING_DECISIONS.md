# Aurum — Engineering Decisions

**Design Specification Version: v1.0.0**


> **This is not a design document.**
> It records implementation choices so the codebase can be built consistently.
> It evolves only when implementation requires it.

---

## 1. Folder Structure

```
frontend/
  app/
    layout.jsx
    page.jsx
    login/
    signup/
    forgot/
    reset/
    learn/
      page.jsx
      components/
        ContinueCard.jsx
        MasteryList.jsx
        ContextDrawer.jsx
        GenerateTabs.jsx
        DiscoverPanel.jsx
    mastery/
      [id]/
        page.jsx
        components/
          ProgressRail.jsx
          ModuleList.jsx
          LessonList.jsx
          LessonDetail.jsx
          CurrentFocus.jsx
  components/
    ui.jsx
    Drawer.jsx
    Modal.jsx
    Button.jsx
    Input.jsx
    Textarea.jsx
    Progress.jsx
    MasteryRow.jsx
    ModuleRow.jsx
    LessonRow.jsx
    ContinueCard.jsx
    ResourceCard.jsx
    ErrorState.jsx
    EmptyState.jsx
    Skeleton.jsx
    Tabs.jsx
  lib/
    api.js
    auth.js
    format.js
  styles/
    globals.css
  public/
```

**Rules:**
- Route-specific components live under the route folder.
- Shared components live under `components/`.
- No feature folders. Routes are the feature boundary.

---

## 2. State Ownership

| State | Owner | Rationale |
|-------|-------|-----------|
| Auth token | Client (localStorage) | Server sets it; client reads it on every request |
| Session | Server (Django session) | Auth API validates token and returns user |
| Masteries, modules, lessons | Server (Django ORM) | Source of truth |
| Progress (lesson complete) | Optimistic client → server sync | UI updates immediately; rollback on failure |
| Notes | Server | Append-only; client inserts into list optimistically |
| Resources | Server | Client attaches; fetches metadata optimistically |
| Generate proposal | Client ephemeral | Not persisted until user confirms |
| Context Drawer open/close | Client (URL query optional) | Default: client state. Future: `?drawer=generate` |

**Rules:**
- Server is the source of truth for all persisted data.
- Client may optimistically update UI, but must rollback on failure.
- No derived state stored on the server. Compute on client.

---

## 3. Routing Strategy

- File-based routing in `app/`.
- Route groups: `(auth)` for login/signup/forgot/reset if layout sharing is needed.
- Dynamic route: `mastery/[id]/page.jsx`.
- No route groups for authenticated surfaces. `/learn` and `/mastery/:id` are siblings.

**Rules:**
- Routes match `ia-phase1.md` exactly.
- Legacy routes (`/dashboard`, `/learn`, `/learn`, `/learn`) are removed in this build.
- No client-side routing library. Use Next.js built-in.

---

## 4. Data Fetching

- Server Components by default for initial page render.
- Client Components (`"use client"`) only for:
  - Stateful interactions (drawers, modals, inline expand)
  - Optimistic updates
  - `AuthProvider` context
- API client in `lib/api.js` wraps `fetch` with:
  - `Authorization: Token <token>` header
  - Error normalization
  - Retry once on 5xx

**Rules:**
- No global data cache in v1. Fetch on mount.
- Parallel fetches where independent.
- Sequential fetches only when dependent.

---

## 5. Optimistic Updates

| Action | Optimistic? | Rollback Trigger |
|--------|-------------|------------------|
| Mark lesson complete | Yes | 4xx/5xx on PATCH |
| Mark lesson incomplete | Yes | 4xx/5xx on PATCH |
| Add note | Yes | 4xx/5xx on POST |
| Attach resource | Yes | 4xx/5xx on POST |
| Generate proposal | No (ephemeral) | N/A |
| Create mastery | No (redirect only) | N/A |
| Delete mastery | No (confirm first) | N/A |

**Rules:**
- Optimistic update must show loading state within 100ms.
- Rollback must restore previous state and show `ErrorState`.
- No optimistic update without a recovery action.

---

## 6. Error Boundaries

- Root `error.jsx` catches unexpected render errors.
- Route-level `error.jsx` catches data fetch failures.
- `ErrorState` component catches expected failures (API 4xx/5xx).
- `Skeleton` + `ErrorState` pattern for all async surfaces.

**Rules:**
- No uncaught promise rejections.
- Log errors to a service in Phase 7. Console only in v1.
- Error UI must offer one recovery action.

---

## 7. Form Handling

- Controlled components only.
- Validation runs on submit, not on change.
- Inline validation for API-returned errors (e.g., duplicate title).
- ` Zod` or custom validators acceptable; keep minimal.

**Rules:**
- Forms have one dominant submit button.
- No form wizard in v1.
- No multi-step forms. One screen = one form.

---

## 8. Accessibility Checklist

Every PR must pass this list:

- [ ] All interactive elements are keyboard reachable.
- [ ] Focus order matches visual order.
- [ ] `aria-label` present on every icon-only button.
- [ ] `prefers-reduced-motion: reduce` disables all motion except completion glow.
- [ ] Color is not the only signal (progress, completion, error use icon + color).
- [ ] Form inputs have labels, not placeholder-only.
- [ ] Error messages are announced (`role="alert"`).
- [ ] Heading hierarchy is logical (`h1` → `h2` → `h3`).
- [ ] Links have descriptive text or `aria-label`.
- [ ] No `div` soup for interactive elements.

---

## 9. Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | <1.5s on 4G |
| Time to Interactive | <3s on 4G |
| Largest Contentful Paint | <2.5s |
| Cumulative Layout Shift | <0.1 |
| Bundle size increase per component | <5KB gzipped |
| `/learn` initial bundle | <100KB gzipped |
| `/mastery/:id` initial bundle | <120KB gzipped |

**Rules:**
- No new dependency without size justification.
- Images use `next/image`.
- Fonts load with `font-display: swap`.
- Client Components are lazy-loaded where possible.

---

## 10. Testing Strategy

- Unit tests for pure utility functions (`lib/format.js`).
- Component tests for:
  - Button variants
  - Input states
  - ProgressRail
  - ErrorState / EmptyState
- E2E tests for:
  - `/learn` Continue → Resume → `/mastery/:id`
  - Generate flow: input → modal proposal → create mastery
  - Lesson completion: mark complete → progress advance → focus shift
  - Auth: login → redirect `/learn`; logout → redirect `/login`

**Rules:**
- No test for CSS.
- No snapshot tests.
- Every E2E test must map to a Phase 2 flow.

---

## 11. Definition of Done

A PR is not mergeable until all of these are true:

- Matches Phase 5 tokens only.
- Introduces no new interactions.
- Uses existing component APIs.
- Passes keyboard navigation.
- Passes `prefers-reduced-motion`.
- No hard-coded colors, spacing, shadows, or timings.
- No accessibility regressions.
- No duplicate components.
- No route not in `ia-phase1.md`.
- No component not in `component-system-phase5.md`.

---

## 12. How This Document Changes

This document is updated only when:
- A PR requires a decision not covered here.
- The decision affects more than one component or route.
- The decision cannot be derived from the frozen design docs.

It is not updated for:
- Visual tweaks.
- Copy changes.
- Refactoring.
- Bug fixes.

When updated, the change must be committed with the PR that requires it.

---

## 13. File Ownership & Change Policy

| Directory | Purpose | Change Rule |
|-----------|---------|-------------|
| `/design` | Frozen design contracts | Immutable except through amendment docs |
| `/components` | Implementation of the contract | Must map 1:1 to Phase 5 component inventory |
| `/app` | Page composition only | Composes existing components; no new components |
| `/lib` | Business logic | API client, auth, formatting; no UI |
| `/public` | Static assets | Images, fonts; no logic |

**Rules:**
- A PR that touches `/design` must include an amendment document explaining why the contract changed.
- A PR that introduces a component not in Phase 5 is automatically rejected until the component is added to `component-system-phase5.md`.
- A PR that adds a route not in `ia-phase1.md` is automatically rejected.
- A PR that adds an interaction not in `interaction-language-phase35.md` is automatically rejected.

This policy keeps design drift from entering the codebase through "small implementation changes."


---

## 14. Architectural Decision Records

Significant engineering choices are recorded as ADRs in `docs/adr/`.

| ADR | Title | Status |
|-----|-------|--------|
| 0001 | Project Structure and Routing | Accepted |

ADRs are immutable once accepted. If a decision must change, write a new ADR referencing the old one.
