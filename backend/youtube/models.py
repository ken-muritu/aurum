import hashlib

from django.db import models


def make_query_hash(text):
    return hashlib.sha256(text.strip().lower().encode()).hexdigest()[:64]


class YouTubeSearchCache(models.Model):
    query_hash = models.CharField(max_length=64, unique=True, db_index=True)
    query_text = models.CharField(max_length=300)
    results_json = models.JSONField()
    fetched_at = models.DateTimeField(auto_now_add=True)


class YouTubeVideoCache(models.Model):
    youtube_video_id = models.CharField(max_length=20, unique=True, db_index=True)
    title = models.CharField(max_length=300)
    channel_name = models.CharField(max_length=200)
    channel_id = models.CharField(max_length=50)
    duration_seconds = models.PositiveIntegerField()
    thumbnail_url = models.URLField()
    fetched_at = models.DateTimeField(auto_now_add=True)
