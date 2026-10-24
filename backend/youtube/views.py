import json
import urllib.parse
import urllib.request
from datetime import timedelta

from django.conf import settings
from django.http import JsonResponse
from django.utils import timezone
from django.views import View

from .models import YouTubeSearchCache, YouTubeVideoCache, make_query_hash

YT_API = "https://www.googleapis.com/youtube/v3"
_TIMEOUT = 8  # seconds


def _api_key():
    return getattr(settings, "YOUTUBE_API_KEY", "") or ""


def _get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Aurum/1.0"})
    with urllib.request.urlopen(req, timeout=_TIMEOUT) as r:
        return json.loads(r.read().decode("utf-8"))


def _parse_iso8601(d):
    """'PT1H2M3S' -> seconds (int)."""
    import re
    m = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", d or "", re.I)
    if not m:
        return 0
    h, mn, s = (int(x) if x else 0 for x in m.groups())
    return h * 3600 + mn * 60 + s


def _thumb(snippet):
    th = snippet.get("thumbnails") or {}
    for k in ("high", "medium", "default"):
        if k in th and th[k].get("url"):
            return th[k]["url"]
    return ""


def _video_from_item(item):
    vid = item["id"]["videoId"]
    sn = item.get("snippet", {})
    return {
        "youtube_video_id": vid,
        "title": sn.get("title", ""),
        "channel_name": sn.get("channelTitle", ""),
        "duration_seconds": 0,  # filled by video details call
        "thumbnail_url": _thumb(sn),
    }


def _fetch_details(ids):
    """Return {videoId: {duration_seconds, channel_id, channel_name, title, thumbnail_url}}."""
    if not ids:
        return {}
    key = _api_key()
    params = urllib.parse.urlencode({
        "part": "contentDetails,snippet",
        "id": ",".join(ids),
        "key": key,
        "maxResults": len(ids),
    })
    data = _get_json(f"{YT_API}/videos?{params}")
    out = {}
    for it in data.get("items", []):
        vid = it["id"]
        sn = it.get("snippet", {})
        cd = it.get("contentDetails", {})
        out[vid] = {
            "duration_seconds": _parse_iso8601(cd.get("duration", "")),
            "channel_id": sn.get("channelId", ""),
            "channel_name": sn.get("channelTitle", ""),
            "title": sn.get("title", ""),
            "thumbnail_url": _thumb(sn),
        }
    return out


class YouTubeSearchView(View):
    def get(self, request):
        q = request.GET.get("q", "").strip()
        if not q:
            return JsonResponse({"error": "missing q"}, status=400)
        key = _api_key()
        if not key:
            # Stub fallback when no API key is configured.
            qh = make_query_hash(q)
            stub = [{
                "youtube_video_id": "dQw4w9WgXcQ",
                "title": f"[STUB] search result for '{q}' (set YOUTUBE_API_KEY to enable live)",
                "channel_name": "Stub Channel",
                "duration_seconds": 213,
                "thumbnail_url": "",
            }]
            YouTubeSearchCache.objects.update_or_create(
                query_hash=qh, defaults={"query_text": q, "results_json": stub})
            return JsonResponse({"cached": False, "results": stub, "note": "stub"})

        qh = make_query_hash(q)
        cached = YouTubeSearchCache.objects.filter(query_hash=qh).first()
        if cached and cached.fetched_at > timezone.now() - timedelta(hours=6):
            return JsonResponse({"cached": True, "results": cached.results_json})

        try:
            sp = urllib.parse.urlencode({
                "part": "snippet", "type": "video", "q": q,
                "maxResults": 12, "key": key,
            })
            sdata = _get_json(f"{YT_API}/search?{sp}")
            ids = [it["id"]["videoId"] for it in sdata.get("items", []) if it.get("id", {}).get("videoId")]
            details = _fetch_details(ids)
            results = []
            for it in sdata.get("items", []):
                vid = it["id"]["videoId"]
                base = _video_from_item(it)
                det = details.get(vid, {})
                base.update({
                    "duration_seconds": det.get("duration_seconds", 0),
                    "channel_id": det.get("channel_id", ""),
                    "channel_name": det.get("channel_name", base["channel_name"]),
                    "title": det.get("title", base["title"]),
                    "thumbnail_url": det.get("thumbnail_url", base["thumbnail_url"]),
                })
                results.append(base)
            YouTubeSearchCache.objects.update_or_create(
                query_hash=qh, defaults={"query_text": q, "results_json": results})
            return JsonResponse({"cached": False, "results": results})
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "ignore")
            try:
                msg = json.loads(body).get("error", {}).get("message", body)
            except Exception:
                msg = body
            return JsonResponse({"error": f"YouTube API error: {msg}"}, status=502)
        except Exception as e:
            return JsonResponse({"error": f"YouTube search failed: {e}"}, status=502)


class YouTubeVideoView(View):
    def get(self, request, youtube_video_id):
        cached = YouTubeVideoCache.objects.filter(youtube_video_id=youtube_video_id).first()
        if cached:
            return JsonResponse({
                "cached": True,
                "youtube_video_id": cached.youtube_video_id,
                "title": cached.title,
                "channel_name": cached.channel_name,
                "channel_id": cached.channel_id,
                "duration_seconds": cached.duration_seconds,
                "thumbnail_url": cached.thumbnail_url,
            })
        key = _api_key()
        if not key:
            stub = {
                "cached": False,
                "youtube_video_id": youtube_video_id,
                "title": f"[STUB] {youtube_video_id} (set YOUTUBE_API_KEY to enable live)",
                "channel_name": "Stub Channel",
                "channel_id": "",
                "duration_seconds": 600,
                "thumbnail_url": "",
                "note": "stub",
            }
            return JsonResponse(stub)

        try:
            details = _fetch_details([youtube_video_id]).get(youtube_video_id)
            if not details:
                return JsonResponse({"error": "video not found"}, status=404)
            obj, _ = YouTubeVideoCache.objects.update_or_create(
                youtube_video_id=youtube_video_id,
                defaults={
                    "title": details["title"],
                    "channel_name": details["channel_name"],
                    "channel_id": details["channel_id"],
                    "duration_seconds": details["duration_seconds"],
                    "thumbnail_url": details["thumbnail_url"],
                },
            )
            return JsonResponse({
                "cached": False,
                "youtube_video_id": obj.youtube_video_id,
                "title": obj.title,
                "channel_name": obj.channel_name,
                "channel_id": obj.channel_id,
                "duration_seconds": obj.duration_seconds,
                "thumbnail_url": obj.thumbnail_url,
            })
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "ignore")
            try:
                msg = json.loads(body).get("error", {}).get("message", body)
            except Exception:
                msg = body
            return JsonResponse({"error": f"YouTube API error: {msg}"}, status=502)
        except Exception as e:
            return JsonResponse({"error": f"YouTube video lookup failed: {e}"}, status=502)
