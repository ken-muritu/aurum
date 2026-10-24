from rest_framework import serializers
from .models import LessonProgress, Note


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ["id", "status", "watched_seconds", "completed_at", "updated_at"]
        read_only_fields = ["id", "completed_at", "updated_at"]


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "body", "timestamp_seconds", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
