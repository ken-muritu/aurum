from django.contrib.auth.models import User
from django.db import models
import uuid


class LessonProgress(models.Model):
    STATUS_CHOICES = [
        ("not_started", "Not Started"),
        ("watched", "Watched"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lesson_progress")
    lesson = models.ForeignKey("masteries.Lesson", on_delete=models.CASCADE, related_name="progress_records")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="not_started")
    watched_seconds = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "lesson")
        indexes = [models.Index(fields=["user", "status"])]


class Note(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    lesson = models.ForeignKey("masteries.Lesson", on_delete=models.CASCADE, related_name="notes")
    body = models.TextField()
    timestamp_seconds = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
