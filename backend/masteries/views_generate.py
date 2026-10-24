import json
import urllib.parse
import urllib.request
from datetime import timedelta

from django.conf import settings
from django.http import JsonResponse
from django.utils import timezone
from django.views import View

from .models import Mastery, Module, Lesson


def _yt_search(q, max_results=8):
    key = getattr(settings, "YOUTUBE_API_KEY", "")
    if not key:
        return []
    sp = urllib.parse.urlencode({
        "part": "snippet", "type": "video", "q": q,
        "maxResults": max_results, "key": key,
    })
    try:
        req = urllib.request.Request(
            "https://www.googleapis.com/youtube/v3/search?" + sp,
            headers={"User-Agent": "Aurum/1.0"},
        )
        with urllib.request.urlopen(req, timeout=8) as r:
            data = json.loads(r.read().decode("utf-8"))
    except Exception:
        return []
    out = []
    for it in data.get("items", []):
        vid = it.get("id", {}).get("videoId")
        sn = it.get("snippet", {})
        if not vid:
            continue
        th = sn.get("thumbnails", {})
        thumb = (th.get("medium") or th.get("default") or {}).get("url", "")
        out.append({
            "youtube_video_id": vid,
            "title": sn.get("title", ""),
            "channel_name": sn.get("channelTitle", ""),
            "thumbnail_url": thumb,
            "external_url": f"https://youtube.com/watch?v={vid}",
        })
    return out


def _build_structure(topic, videos):
    """Deterministic structure: 1 module 'Core', one lesson per video (capped)."""
    lessons = []
    for v in videos[:8]:
        lessons.append({
            "title": v["title"],
            "resource": {
                "type": "youtube",
                "youtube_video_id": v["youtube_video_id"],
                "title": v["title"],
                "external_url": v["external_url"],
                "thumbnail_url": v["thumbnail_url"],
                "channel_name": v["channel_name"],
            },
        })
    return {
        "title": f"Master {topic}",
        "goal_statement": f"Go from zero to confident with {topic} using curated video lessons.",
        "description": f"An auto-generated learning path for {topic}, built from the best free videos.",
        "modules": [
            {"title": "Core Lessons", "lessons": lessons}
        ],
    }


class GenerateView(View):
    """POST {topic} -> proposed Mastery structure (Phase 2 AI-assisted).
    YouTube-grounded and deterministic. If the user saves, it becomes a real
    private Mastery via the normal create flow client-side.
    Optionally returns an LLM 'summary' if OPENAI_API_KEY is configured."""

    def post(self, request):
        try:
            body = json.loads(request.body or "{}")
        except Exception:
            body = {}
        topic = (body.get("topic") or "").strip()
        if not topic:
            return JsonResponse({"error": "missing topic"}, status=400)
        videos = _yt_search(topic)
        structure = _build_structure(topic, videos)
        # Optional LLM enrichment (graceful no-op if no key / unavailable).
        summary = ""
        key = getattr(settings, "OPENAI_API_KEY", "")
        if key:
            try:
                prompt = (
                    f"Write a 2-sentence learning goal for someone starting to learn '{topic}'. "
                    "Be specific and encouraging."
                )
                pr = urllib.parse.urlencode({
                    "model": "gpt-4o-mini",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 80,
                })
                req = urllib.request.Request(
                    "https://api.openai.com/v1/chat/completions?" + pr,
                    headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                )
                # For simplicity we send a minimal POST; if it fails, skip.
                with urllib.request.urlopen(req, timeout=8) as r:
                    d = json.loads(r.read().decode("utf-8"))
                    summary = d["choices"][0]["message"]["content"].strip()
            except Exception:
                summary = ""
        structure["summary"] = summary
        return JsonResponse(structure)
