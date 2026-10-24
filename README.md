# Aurum — Mastery, refined

Aurum is a personal learning app. It turns a pile of good YouTube videos, docs, papers and blog posts into a structured **Mastery** that you can actually finish: modules → lessons → resources, with progress tracking, notes, YouTube-grounded generation and forking.

| | |
|---|---|
| Frontend | [aurumio.vercel.app](https://aurumio.vercel.app) (Next.js on Vercel) |
| Backend | Django REST API on Render's free tier |
| Status | Phase 1 MVP. The frontend is online. On 24 Oct 2026 the free-tier backend did not respond, so sign-in and saved data are unavailable on the live site until it is redeployed. |

## Features

- **Accounts:** sign up (email required), log in, log out, password reset by email (Brevo)
- **Masteries:** create and edit modules and lessons, reorder them, attach resources (YouTube, doc, PDF, blog, book, paper, GitHub, podcast)
- **Generate:** enter a topic, and Aurum searches YouTube and proposes a module with lessons and video resources that you can save as a Mastery. An optional OpenAI key adds an AI-written learning goal.
- **Learning:** mark lessons watched, keep notes per lesson, see progress, add a project prompt and quiz to a lesson
- **Discover and fork:** browse public Masteries and deep-copy one into your own private copy
- **YouTube Data API v3:** live search and video metadata, cached for 6 hours. It falls back to stub data when no key is set.

Every change is checked against the object's owner on the server.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15.5 (App Router), React 19, Lucide icons, Fraunces display font |
| Backend | Django 5, Django REST Framework (token auth), django-cors-headers |
| Database | Postgres in production (`dj-database-url`), SQLite locally |
| Email | Brevo transactional API (`backend/accounts/brevo_email.py`) |
| Hosting | Vercel (frontend, root directory `frontend`), Render Blueprint (`render.yaml`: web service + Postgres) |

## Repository layout

```
backend/                 Django project
  aurum/                 settings (all env-driven), urls, wsgi
  accounts/              signup/login, password reset, Brevo email, management commands
  masteries/             Mastery, Module, Lesson, Resource; fork; generate
  progress/              lesson progress, notes, dashboard
  youtube/               YouTube Data API v3 search + video metadata (cached)
frontend/                Next.js app
  app/                   /, /login, /signup, /forgot, /reset, /learn, /mastery/[id]
  components/ lib/       shared UI, API client, auth context
design/                  IA, flows, wireframes, interaction and component specs
docs/adr/                architecture decisions
AURUM_PRODUCT_CONSTITUTION.md   product principles
DEPLOY.md                deploy runbook (Render + Vercel)
render.yaml              Render Blueprint
```

The old routes (`/dashboard`, `/masteries`, `/generate`, `/discover`) redirect to `/learn` (see `frontend/next.config.mjs`).

## API

```
Auth        POST /api/auth/signup/  login/  logout/     GET /api/auth/me/
            POST /api/auth/password/forgot/             POST /api/auth/password/reset/
Masteries   GET|POST /api/masteries/                    GET|PATCH|DELETE /api/masteries/<id>/
            POST /api/masteries/<id>/fork/              POST /api/masteries/generate/
Modules     POST /api/masteries/<id>/modules/           PATCH /api/masteries/<id>/reorder/
            DELETE /api/modules/<id>/
Lessons     POST /api/modules/<id>/lessons/             PATCH /api/modules/<id>/reorder/
            DELETE /api/lessons/<id>/                   PATCH /api/lessons/<id>/enrich/
            POST /api/lessons/<id>/resources/           POST /api/lessons/<id>/progress/
            GET|POST /api/lessons/<id>/notes/
Discover    GET /api/discover/?q=                       GET /api/dashboard/
YouTube     GET /api/youtube/search/?q=                 GET /api/youtube/video/<id>/
```

## Run it locally

Backend:

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
python manage.py test           # includes the password-reset security tests
```

Frontend:

```bash
cd frontend
npm install
npm run dev                     # http://localhost:3000
```

The browser calls the Django API directly over CORS. Point the frontend at your local API with `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`.

## Environment variables

| Variable | Notes |
|---|---|
| `DEBUG` | **Set to `False` in production.** It defaults to `True` for local development. In debug mode the password-reset endpoint returns the reset link in its response so you can test without email. Production never does. |
| `SECRET_KEY` | Required in production (Render generates one) |
| `ALLOWED_HOSTS` | Comma-separated hosts |
| `DATABASE_URL` | Postgres connection string. SQLite is used when unset. |
| `CORS_ALLOW_ALL`, `AURUM_CORS` | CORS policy. `AURUM_CORS` lists allowed origins. |
| `FRONTEND_URL` | Used to build password-reset links |
| `YOUTUBE_API_KEY` | Optional: live YouTube search |
| `BREVO_API_KEY`, `BREVO_FROM` | Optional: password-reset email. `BREVO_FROM` is `"Name <address>"` for a sender verified in Brevo. |
| `OPENAI_API_KEY` | Optional: AI learning-goal summary in Generate |
| `NEXT_PUBLIC_API_URL` | Frontend: base URL of the API, inlined at build time |

## Deployment notes

- **Vercel:** set the project's Root Directory to `frontend`. `NEXT_PUBLIC_*` variables must exist at build time.
- **Render:** `render.yaml` creates the web service and a Postgres database. Keys marked `sync: false` (`YOUTUBE_API_KEY`, `BREVO_API_KEY`, `BREVO_FROM`, `OPENAI_API_KEY`) have to be entered once in the Render dashboard. The free tier sleeps when idle, and free Postgres databases expire.

More detail is in [DEPLOY.md](DEPLOY.md) and [ENGINEERING_DECISIONS.md](ENGINEERING_DECISIONS.md).

## Licence

Copyright © 2026 Kennedy Muritu. All rights reserved. The code is public to read, not to reuse. See [LICENSE](LICENSE).
