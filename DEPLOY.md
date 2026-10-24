# Aurum — Deploy (Render backend + Vercel frontend)

Repo: https://github.com/ken-muritu/aurum

## 1) Render backend (Blueprint)
- Render dashboard → New → Blueprint → connect `ken-muritu/aurum` → branch `main` →
  Blueprint file `render.yaml` (now present at repo root).
- Render auto-creates:
  - web service `aurum` (Django + gunicorn, builds `backend/`, runs `migrate` then serves)
  - Postgres `aurum-db` (free tier)
- Env vars set by the Blueprint:
  - `SECRET_KEY` (generated), `DEBUG=False`, `ALLOWED_HOSTS=*` (dynamic)
  - `DATABASE_URL` ← `aurum-db` connection string (dj_database_url reads it)
  - `CORS_ALLOW_ALL=True` + `AURUM_CORS=https://aurum.vercel.app,https://aurum.io`
  - `YOUTUBE_API_KEY` — paste your YouTube Data API v3 key here to go live
    (until then, /api/youtube/* returns a clearly-labeled stub; see backend/youtube/views.py)
- Default URL: https://aurum.onrender.com  (free tier sleeps; upgrade to Starter for always-on)
- Health check: GET /api/discover/  (returns 200 once migrated)

## 2) Vercel frontend (project `aurum`, already created + linked)
- Builds `frontend/` (Next.js 15). `vercel.json` injects
  `NEXT_PUBLIC_API_URL=https://aurum.onrender.com` at build time.
- Live URL: https://aurum.vercel.app  (the `aurum-*.vercel.app` alias).
- Re-deploys on every `git push` to `main` (or `vercel deploy --prod`).

## 3) Custom domain `aurum.io` (manual, paid)
- Buy `aurum.io` (Namesilo / Porkbun / Cloudflare Registrar) — not scriptable.
- Vercel → Project `aurum` → Settings → Domains → Add `aurum.io`.
- Vercel gives DNS records; point the domain there.
- Then add `https://aurum.io` to the Render `AURUM_CORS` env var so the
  frontend (on .io) can call the API (CORS).

## 4) YouTube Data API (optional, Phase 1 real integration)
- Google Cloud Console → enable YouTube Data API v3 → create API key.
- Paste into Render env `YOUTUBE_API_KEY`.
- In `backend/youtube/views.py`, replace the stub in `YouTubeSearchView`
  with a `googleapiclient.discovery.build("youtube","v3")` search().list()
  call, keeping the 6-hour `YouTubeSearchCache` (Part 13 quota mgmt).

## Architecture note (founding doc Part 12)
Frontend (Vercel, serverless) calls the Django API directly from the browser
(CORS). The Django backend lives on Render/Railway/Fly — NOT Vercel —
because Phase 2's Celery workers need a persistent host, which Vercel
serverless can't provide.
