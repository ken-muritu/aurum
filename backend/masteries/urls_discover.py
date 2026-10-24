from django.http import JsonResponse
from django.urls import path
from django.views import View
from django.db.models import Q
from .models import Mastery
import json


class DiscoverView(View):
    def get(self, request):
        q = request.GET.get("q", "").strip()
        qs = Mastery.objects.filter(visibility="public")
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(description__icontains=q))
        qs = qs.order_by("-created_at")[:50]
        data = [{
            "id": str(m.id),
            "title": m.title,
            "description": m.description,
            "module_count": m.modules.count(),
            "owner": m.owner.username,
            "created_at": m.created_at.isoformat(),
        } for m in qs]
        return JsonResponse({"results": data}, safe=False)

urlpatterns = [
    path("", DiscoverView.as_view(), name="discover"),
]
