from django.http import JsonResponse
from django.urls import path
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from masteries.models import Mastery, Module, Lesson
from .models import LessonProgress


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        continue_item = None
        for m in Mastery.objects.filter(owner=user).order_by("-updated_at"):
            total = Lesson.objects.filter(module__mastery=m).count()
            done = LessonProgress.objects.filter(
                user=user, lesson__module__mastery=m, status="watched").count()
            if total == 0:
                continue
            if done < total:
                continue_item = {
                    "mastery_id": str(m.id),
                    "title": m.title,
                    "progress_percent": round(100 * done / total),
                    "lessons_watched": done,
                    "lessons_total": total,
                }
                break
        recent = LessonProgress.objects.filter(user=user).select_related(
            "lesson", "lesson__module", "lesson__module__mastery").order_by("-updated_at")[:10]
        recent_activity = [{
            "lesson": r.lesson.title,
            "mastery": r.lesson.module.mastery.title,
            "status": r.status,
            "updated_at": r.updated_at.isoformat(),
        } for r in recent]
        return JsonResponse({
            "continue_learning": continue_item,
            "recent_activity": recent_activity,
        }, safe=False)


urlpatterns = [
    path("", DashboardView.as_view(), name="dashboard"),
]
