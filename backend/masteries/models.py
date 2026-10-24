import uuid

from django.db import models


class Mastery(models.Model):
    VISIBILITY_CHOICES = [
        ("private", "Private"),
        ("unlisted", "Unlisted"),
        ("public", "Public"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey("auth.User", on_delete=models.CASCADE, related_name="masteries")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    goal_statement = models.CharField(max_length=300, blank=True)
    cover_image_url = models.URLField(blank=True)
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default="private")

    forked_from = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.SET_NULL, related_name="forks"
    )
    version = models.CharField(max_length=20, default="1.0")
    is_signature = models.BooleanField(default=False)
    generated_by_ai = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=["visibility", "-created_at"])]

    def __str__(self):
        return self.title


class Module(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mastery = models.ForeignKey(Mastery, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ["order"]
        constraints = [
            models.UniqueConstraint(fields=["mastery", "order"], name="uniq_module_order")
        ]


class Lesson(models.Model):
    """Atomic learning unit. Decoupled from YouTube via Resource (see Resource model)
    so Phase 3 multi-source ingestion is additive, not a schema rewrite."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField()

    project_prompt = models.TextField(blank=True, null=True)
    quiz_json = models.JSONField(blank=True, null=True)

    class Meta:
        ordering = ["order"]
        constraints = [
            models.UniqueConstraint(fields=["module", "order"], name="uniq_lesson_order")
        ]


class Resource(models.Model):
    """A single piece of source content attached to a Lesson. Phase 1 only creates
    type='youtube'; type system exists from day one for Phase 3 additive ingestion."""
    TYPE_CHOICES = [
        ("youtube", "YouTube Video"),
        ("doc", "Documentation"),
        ("pdf", "PDF"),
        ("book", "Book Reference"),
        ("blog", "Blog Post"),
        ("podcast", "Podcast Episode"),
        ("paper", "Research Paper"),
        ("github", "GitHub Repository"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="resources")
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="youtube")
    order = models.PositiveIntegerField(default=0)

    external_url = models.URLField(blank=True, null=True)
    title = models.CharField(max_length=300, blank=True)
    thumbnail_url = models.URLField(blank=True)
    duration_seconds = models.PositiveIntegerField(default=0, null=True, blank=True)

    youtube_video_id = models.CharField(max_length=20, blank=True, null=True)
    channel_name = models.CharField(max_length=200, blank=True)
    channel_id = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = ["order"]
