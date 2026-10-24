# Aurum — Product Constitution

> **This is not a style guide. This is not a component library.**
> This is the product's operating system: the enduring decisions that outlive any implementation, any redesign, and any platform.

---

## 1. Why Aurum Exists

The internet has infinite learning content. What it lacks is a system that turns consumption into completion.

People bookmark videos. They save articles. They buy courses. Then they forget. Not because they lack discipline — because they lack a system that respects how learning actually works.

Aurum exists to solve that.

Aurum is not a bookmark manager. It is not a note-taking app. It is not a course platform.

It is a place where scattered knowledge is refined into structured, trackable, completable mastery. We call this place **the Forge** — a metaphor that lives in motion, copy, and completion states, not in navigation.

---

## 2. What Makes Aurum Different

| Competitor | Category | Why Aurum Wins |
|------------|----------|----------------|
| YouTube | Infinite content, little structure |
| Notion | Flexible workspace, no learning model |
| Readwise | Reading and highlights, no active path |
| Coursera / Udemy | Pre-packaged courses, not personal |
| Obsidian / Logseq | Bottom-up notes, no curriculum |
| Anki | Spaced repetition, memorization not skill-building |

Aurum's primary distinction: **structured personal curriculum with measurable progress, AI-assisted generation, and social leverage (fork + discover).**

---

## 3. The User Aurum Is Built For

**Primary:** Self-directed learners who consume scattered content (YouTube, docs, papers, podcasts) and want to convert it into finished mastery.

**Archetypes:**
- The Explorer: "I want to learn X. Show me how."
- The Curator: "I have 50 saved videos. Help me turn them into a path."
- The Finisher: "I started learning X three times. Help me cross the finish line."
- The Scholar: "I want deep notes, practice prompts, and long-term retention."

**Secondary:** Teams and organizations who want shared learning paths (future).

---

## 4. The Learning Philosophy

Aurum believes learning is a loop, not an event.

```
Capture → Structure → Consume → Practice → Apply → Reflect → Master
```

| Phase | What the User Does | What Aurum Does |
|-------|-------------------|-----------------|
| **Capture** | Paste a link, search YouTube, upload a PDF, write a note | Ingests any source type; normalizes intoLesson |
| **Structure** | Organize into modules; set goal; add project prompt | Provides hierarchy, scaffolding, and progress visibility |
| **Consume** | Watch, read, listen | Tracks completion; surfaces "what's next" |
| **Practice** | Do the project prompt; answer the quiz | Validates learning; stores outcome |
| **Apply** | Build something real; teach someone else | Turns knowledge into skill |
| **Reflect** | Write notes; review highlights | Surfaces spaced reminders; connects to future lessons |
| **Master** | Fork and remix; teach others | Certifies completion; enables social leverage |

This is the **real product**. The UI is just the interface to this loop.

---

## 5. The User Feeling (Emotional Arc)

Aurum should feel different at each stage of the journey:

| Stage | Feeling | Metaphor |
|-------|---------|----------|
| First open | Calm, purposeful | Walking into a workshop |
| Creating a mastery | Empowered, focused | Striking the first blow |
| Mid-mastery | Momentum, clarity | Forging — heat, progress |
| Completing a lesson | Satisfied, rewarded | Refinement — ore → gold |
| Completing a module | Accomplished, motivated | Strike complete |
| Completing a mastery | Proud, shareable | Masterwork stamped |
| Returning after absence | Welcomed, oriented | "Here's where you left off" |
| Discovering others' work | Inspired, curious | Walking through a gallery of finished work |
| Teaching / sharing | Generous, confident | Passing the craft forward |

---

## 6. Design Non-Negotiables

These are permanent. Every future pull request is judged against them.

1. **The learner always knows what to do next.** No screen should present ambiguity.
2. **One dominant outcome per screen.** Multiple actions are allowed if they serve the same outcome (e.g., Watch, Take Notes, Ask AI all serve Learn this lesson).
3. **Progress is always visible.** The user should never have to ask "how far have I come?"
4. **The interface teaches.** New users should understand the product without a tutorial.
5. **AI never blocks manual workflows.** Generate is optional, not mandatory.
6. **The product feels calm.** No flash, no noise, no decorative overwhelm.
7. **Learning compounds.** Every action should connect to the next. Nothing is isolated.
8. **Nothing decorative without purpose.** If it doesn't serve the loop, it doesn't ship.

---

## 7. Things Aurum Will Never Do

These are explicit anti-patterns. They protect the product from feature creep and visual noise.

- **No gamification for its own sake.** No streaks, points, badges, leaderboards. Progress is the reward. Mastery is the badge.
- **No stock photography or generic illustrations.** The brand lives in the interface, not in marketing assets.
- **No glassmorphism, blobs, floating shapes, or oversized gradients.** Visual hierarchy comes from type, spacing, and motion — not decoration.
- **No dashboards that are just card grids.** If we can't reduce it to a single focal point, we're doing it wrong.
- **No "features" that don't serve the learning loop.** Everything maps to Capture, Structure, Consume, Practice, Reflect, or Master.
- **No emoji as UI.** No decorative glyphs. No icon fonts. Lucide icons only.
- **No more than two accent colors on any screen.** Gold = brand. Mint = progress. Ember = action. Never mix them.
- **No social features that don't serve learning.** No chat, no feeds, no notifications. Fork and discover only.
- **No dark patterns.** No fake urgency, no engagement traps, no manipulative notifications, no streak anxiety.

---

## 8. AI Philosophy

AI accelerates learning. It never replaces thinking.

- It **suggests** structure, not answers.
- It **explains** concepts when asked.
- It **quizzes** to reinforce, not to grade.
- It **recommends** next steps, not destinations.
- It **never** claims mastery on behalf of the learner.

Generate is optional. Manual creation is always available. AI is a forge assistant; the learner is the smith.

## 9. Permanent Language Decisions

Aurum speaks like a craftsman, not a SaaS dashboard.

| Term | Avoid | Use |
|------|-------|-----|
| Home | Dashboard, Workspace | Forge |
| Create | New Mastery | Start a Mastery |
| Complete | Finish, Done | Refine |
| Progress | Stats, Analytics | How far you've come |
| AI | AI Assistant, Bot | Generate |
| Notes | Commentary, Insights | Notes |
| Fork | Copy, Clone | Fork |
| Lesson | Item, Step | Lesson |
| Module | Section, Unit | Module |

**Rule:** If a word feels like it belongs in a CRM, it doesn't belong in Aurum.

---

## 9. Platform Philosophy

Aurum is platform-agnostic at the data layer. The UI may change (desktop, mobile, web, extension), but the loop does not.

**Supported now:**
- Web (Vercel)
- Backend (Django + DRF on Render)

**Supported later (no redesign needed):**
- Mobile (responsive / native wrapper)
- Desktop (Electron or Tauri)
- Browser extension (capture from any page)
- VS Code extension (learn while you code)
- API / SDK (third-party integrations)

**Requirement:** The data model and API must remain stable enough that any frontend can consume it. No frontend-specific logic in the backend.

---

## 10. Versioning and Evolution

Aurum evolves in layers, not rewrites.

| Layer | Stability | Example |
|-------|-----------|---------|
| Constitution | Permanent | Why we exist, what we never do |
| Learning loop | Permanent | Capture → Structure → Consume → Practice → Reflect → Master |
| Data model | Stable | Mastery → Module → Lesson → Resource → Progress → Note |
| API | Stable | Token auth, nested CRUD, discover, generate |
| UI components | Mutable | Tokens, components, pages, motion |
| Visual identity | Mutable | Type, color, spacing, metaphor expression |

When in doubt, change the mutable layer. Never touch the permanent layer.

---

## 11. Success Criteria

Aurum is successful when:

1. A learner can go from "I want to learn X" to "I'm actively learning X" in under 60 seconds.
2. A learner returns at least 3 times to the same mastery.
3. A learner completes at least one full mastery (all lessons done).
4. A learner forks at least one public mastery.
5. A learner describes Aurum as "calm" or "focused" — never "overwhelming" or "complex."
6. A learner can leave Aurum for two weeks, return, and immediately know what to do next.

If we hit these, everything else is noise.

---

---

## 12. Principles of Simplicity

These are the design team's north star. They are not negotiable.

- Every screen answers one question.
- Every click has a purpose.
- Every component earns its place.
- Every feature strengthens the learning loop.
- Every interaction reduces uncertainty.
- Complexity belongs in the knowledge, never in the interface.
- The best metaphors are invisible.

## 13. Open Strategic Questions

These are deferred to later phases but noted here so they don't get forgotten:

1. **Teams / Classrooms:** How do masteries become shared objects? Ownership, permissions, collaboration.
2. **Certification:** What does "mastered" mean beyond internal completion? External validation?
3. **Mentors:** Can a mastery have a teacher who reviews progress, answers questions, adds notes?
4. **Mobile:** Is mobile a consumption layer (watch lessons), a planning layer (add notes), or both?
5. **Plugin system:** Can third parties add new resource types, enrichment tools, or AI providers?
6. **Pricing:** Free for individuals. Paid for teams. Enterprise for orgs. Where is the line?
7. **AI tutor:** Is there a conversational layer on top of the curriculum? When does it activate?

**Rule:** None of these are v0 concerns. But none of them require rearchitecting the core if the core is built right.

---

*This document was created to answer: "What is Aurum, really?" It is meant to outlast any UI, any codebase, and any team. If a decision can't be traced back to this constitution, it doesn't ship.*
