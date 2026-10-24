# ADR 0001: Project Structure and Routing

## Context
Aurum frontend is built with Next.js App Router. We need a stable folder structure that enforces the IA defined in `design/ia-phase1.md`.

## Decision
- File-based routing under `app/`.
- Route-scoped components live under `app/learn/` and `app/mastery/[id]/`.
- Shared components live under `components/`.
- Business logic lives under `lib/`.
- No feature folders; routes are the boundary.

## Consequences
- Easy to locate components by route.
- Shared components are clearly separated.
- Route changes require IA amendment, not just moving files.

## Status
Accepted.
