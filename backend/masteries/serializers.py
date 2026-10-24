from rest_framework import serializers
from .models import Mastery, Module, Lesson, Resource


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ["id", "type", "order", "external_url", "title",
                  "thumbnail_url", "duration_seconds",
                  "youtube_video_id", "channel_name", "channel_id"]


class LessonSerializer(serializers.ModelSerializer):
    resources = ResourceSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ["id", "title", "order", "project_prompt", "quiz_json", "resources"]


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ["id", "title", "order", "lessons"]


class MasteryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mastery
        fields = ["id", "title", "description", "goal_statement",
                  "visibility", "version", "created_at"]


class MasteryDetailSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    owner_username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = Mastery
        fields = ["id", "title", "description", "goal_statement", "visibility",
                  "version", "is_signature", "generated_by_ai",
                  "created_at", "updated_at", "owner_username", "modules"]
