from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import LessonProgress, Note
from .serializers import LessonProgressSerializer, NoteSerializer
from masteries.models import Lesson


class LessonProgressView(APIView):
    def post(self, request, pk):
        lesson = Lesson.objects.get(pk=pk)
        progress, _ = LessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
        if "status" in request.data:
            progress.status = request.data["status"]
        if "watched_seconds" in request.data:
            progress.watched_seconds = request.data["watched_seconds"]
        from django.utils import timezone
        if progress.status == "watched" and not progress.completed_at:
            progress.completed_at = timezone.now()
        progress.save()
        return Response(LessonProgressSerializer(progress).data)


class LessonNotesView(APIView):
    def get(self, request, pk):
        lesson = Lesson.objects.get(pk=pk)
        notes = Note.objects.filter(user=request.user, lesson=lesson)
        return Response(NoteSerializer(notes, many=True).data)

    def post(self, request, pk):
        lesson = Lesson.objects.get(pk=pk)
        note = Note.objects.create(
            user=request.user,
            lesson=lesson,
            body=request.data.get("body", ""),
            timestamp_seconds=request.data.get("timestamp_seconds"),
        )
        return Response(NoteSerializer(note).data, status=status.HTTP_201_CREATED)
