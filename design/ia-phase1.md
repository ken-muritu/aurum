# Aurum — Phase 1: Information Architecture

> **This is the source of truth for routing and page purpose.**
> Implementation must match this document. If a route is not listed here, it does not exist.

---

## 1. The Routing Surface

| Route | Purpose | Audience | Primary Action | Learning Loop Stage |
|-------|---------|----------|----------------|---------------------|
| `/` | Explain Aurum, show social proof, capture signup. Logged-in users redirect to `/learn`. | Unauth + auth (redirect) | Sign up | Capture |
| `/learn` | Home. Answer: "What should I learn right now?" Continue learning + active masteries + generate panel + discover tab. | Auth | Continue learning | Consume → Practice |
| `/mastery/:id` | Workshop. The actual learning experience. Focus on the current lesson. Progress rail always visible. | Auth (owner or public reader) | Continue lesson | Consume → Practice → Apply |
| `/login` | Log in. | Unauth | Log in | — |
| `/signup` | Create account. | Unauth | Create account | Capture |
| `/forgot` | Request password reset. | Unauth | Send reset link | — |
| `/reset` | Set new password via token link. | Unauth (token-holder) | Update password | — |

**Total: 8 routes.**

---

## 2. What Is Gone

| Old Route | Old Purpose | Replacement |
|-----------|-------------|-------------|
| `/learn` | Continue + masteries + activity | Absorbed into `/learn` |
| `/learn` | List of my masteries | Absorbed into `/learn` as "Active Masteries" section |
| `/learn/new` | Create empty mastery | Replaced by Generate flow inside `/learn` |
| `/learn (with generate panel open)` | AI-generated curriculum | Replaced by Generate panel inside `/learn` |
| `/learn` | Public masteries as standalone page | Embedded as tab/panel inside `/learn` |

**These routes no longer exist. Any inbound link should 301 to `/learn` or `/mastery/:id`.**

---

## 3. What Each Route Contains (Text Outline)

### `/`
- Above the fold: one-sentence value prop + primary CTA ("Start learning")
- Secondary CTA: "Browse public Masteries" (links to `/learn` Discover tab, or stays on `/` if unauth)
- Social proof: 2–3 mastery examples with outcome + learner count
- How it works: 3-step visual (Generate / Structure / Complete)
- Footer: Product, Resources, Company links

**No hero illustration in the old sense.** The "illustration" is the product itself, shown through example masteries.

### `/learn` (home)
- **Header**: Aurum wordmark (left), avatar (right). No nav links.
- **Left column**:
  - **Continue Learning** (dominant card): title, module/lesson, progress bar, Resume button.
  - **Active Masteries** (compact list): title, progress mini-bar, last-accessed date, right-chevron.
  - **Empty state** (when no masteries): "What do you want to learn?" → Generate panel.
- **Right column**:
  - **Generate**: single input, "What do you want to learn?" → proposes curriculum inline.
  - **Or choose**: Import | Discover | Create manually.
  - **Recent** (below): 3–5 most recent lessons across all masteries.

**One page. No other routes needed for authenticated work.**

### `/mastery/:id`
- **Header**: back link, title, visibility pill, owner name, Fork / Delete actions (if owner).
- **Progress rail** (right, sticky): mastery title, percent complete, vertical list of modules with completion indicators.
- **Left column**:
  - **Current Focus**: highlighted lesson row — title, resource type, duration, Watch/Read button.
  - **Modules**: compact vertical list. Module header with completion state. Lessons indented one level.
  - **Actions**: "+ Module" at bottom. "Generate lesson" inside each module (if owner).
- **Expanded lesson** (details panel, not a new route):
  - Resources (thumbnails + links)
  - Notes (chronological)
  - Enrichment (project prompt, quiz)
  - Mark complete / incomplete

**No masteries CRUD page.** All mastery-level actions (rename, delete, change visibility) happen on this page.

### `/login`, `/signup`, `/forgot`, `/reset`
- Split layout: left brand panel (muted hero SVG motif), right form card.
- One form. One primary button. No navigation within the form.
- Error states: icon + text, not color-only.

---

## 4. Interactions That Are Not Routes

These are panels, modals, drawers, or inline expansions. They must not become routes.

| Interaction | Trigger | Form | Primary Action |
|-------------|---------|------|----------------|
| Generate curriculum | Input in `/learn` right rail | Inline modal or expandable panel | Send to Forge |
| Import (YouTube/PDF/GitHub) | "Import" link in `/learn` right rail | Modal with URL input + type selector | Import |
| Discover browse | "Discover" tab/panel in `/learn` | Slide-in panel or inline grid | Fork to my masteries |
| Create manually | "Create manually" in `/learn` right rail | Inline form: title, goal, visibility | Create |
| Lesson details | Click lesson in `/mastery/:id` | Inline expansion below lesson row | Watch / Mark complete |
| Add note | Inside lesson details | Inline textarea | Save |
| Add resource | Inside lesson details or `/mastery/:id` actions | Search YouTube or paste URL | Attach |
| Enrich lesson | Inside lesson details | Toggle panel: project prompt, quiz | Save |

**Rule:** If it can be a drawer, it's a drawer. If it can be inline, it's inline. Only routes are routes.

---

## 5. Audience-Based Access

| Audience | Can See | Can Do |
|----------|---------|--------|
| Unauth | `/`, `/login`, `/signup`, `/forgot`, `/reset` | Sign up, log in, browse marketing |
| Auth (owner) | `/learn`, `/mastery/:id` (own), Generate panel, Discover panel | Full CRUD on own masteries, fork, generate, import |
| Auth (reader) | `/learn`, `/mastery/:id` (public) | Continue public mastery, fork, no edit |
| Unauth (public mastery) | `/mastery/:id` (public) | View only, prompt to fork/signup |

---

## 6. Redirect Map

| Old Route | New Route | Type |
|-----------|-----------|------|
| `/learn` | `/learn` | 301 |
| `/learn` | `/learn` | 301 |
| `/learn/new` | `/learn` (with generate panel open) | 301 |
| `/learn (with generate panel open)` | `/learn` (with generate panel open) | 301 |
| `/learn` | `/learn` (Discover tab) | 301 |

**Old masteries IDs stay valid. `/mastery/:id` is unchanged as a path pattern.**

---

## 7. URL Invariants

These never change, regardless of IA iteration:

1. Mastery detail is always `/mastery/:id` (not `/learn/:id`, not `/m/:id`).
2. Auth is always token-based (`Authorization: Token <token>` in localStorage).
3. API routes always live under `/api/`.
4. Public masteries are readable without auth; mutations require auth + ownership.

---

## 8. Information Density by Route

| Route | Max Width | Max Nesting | Visible Actions |
|-------|-----------|-------------|-----------------|
| `/` | `1180px` | 1 level | 1 primary, 1 secondary |
| `/learn` | `1180px` | 2 levels (mastery → module → lesson) | 1 primary (Resume), 2 secondary (Generate, Discover) |
| `/mastery/:id` | `1180px` | 2 levels (module → lesson → resource/note) | 2 primary (Continue, Generate lesson), 1 secondary per block |
| Auth pages | `400px` | 1 level | 1 primary |
| Discover panel | `480px` | 2 levels | 1 primary per card |

---

## 9. Empty State Contract

Every surface must answer "What now?" when empty.

| Route | Empty State | Primary Prompt |
|-------|-------------|----------------|
| `/learn` (no masteries) | "You don't have any masteries yet." | "What do you want to learn?" → Generate |
| `/learn` (no continue) | "Nothing in progress." | "Start a new Mastery" |
| `/mastery/:id` (no modules) | "No modules yet." | "Add your first module" |
| `/mastery/:id` (module, no lessons) | "No lessons yet." | "Add your first lesson" |
| `/mastery/:id` (lesson, no resources) | "No resources attached." | "Attach a video or link" |
| `/learn` (no results) | "No public masteries found." | "Try a different search" or "Be the first to publish" |

---

## 10. Navigation Model

There is no global navigation bar in the authenticated experience.

- `/learn` contains all navigation needs internally.
- `/mastery/:id` contains back-link + context actions.
- Auth pages contain only form navigation (login ↔ signup ↔ forgot).

**Rationale:** A global nav implies the product is a collection of destinations. Aurum is a single surface with contextual panels.

---

## 11. Navigation Model

There is no global navigation bar in the authenticated experience.

- `/learn` is the home and contains all contextual work.
- `/mastery/:id` is a top-level route. It is bookmarkable, shareable, and directly addressable. It is not nested under `/learn`.
- `/learn` contains a Context Drawer for Generate, Discover, and future tools. The drawer is dismissed by default and opened only when needed.
- Auth pages contain only form navigation (login ↔ signup ↔ forgot).

**Rationale:** A global nav implies the product is a collection of destinations. Aurum is a single home (`/learn`) with a workspace (`/mastery/:id`) and contextual tools. `/mastery/:id` survives as a top-level route because it is the primary unit of work, it enables sharing, and it keeps the mental model clean.

## 12. SEO and Sharing

- `/` is the SEO surface. Title, description, Open Graph tags.
- `/mastery/:id` (public) is indexable. Title = mastery title. Description = goal statement + module/lesson count.
- `/learn` is `noindex`. Personal data, not public.
- `/learn` is gone as a route; discoverability happens through public mastery pages and `/`.

---

## 12. Mobile Considerations

Phase 1 IA is desktop-first but mobile-compatible:

- `/learn`: single column. Right rail drops below main column.
- `/mastery/:id`: single column. Progress rail becomes sticky header or inline module completion indicators.
- Auth pages: full-width cards on mobile (no split layout).
- Panels/modals: full-screen on mobile.

Responsive behavior is a Phase 6 concern. The IA must support single-column without redesign.

---

## 13. Approval

This IA is frozen until Phase 4 (Interaction Review).

No routes may be added without amending this document.

No routes may be removed without amending this document.

No panel may become a route without amending this document.

If implementation diverges, implementation is wrong.
