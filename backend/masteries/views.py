from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Mastery, Module, Lesson, Resource
from .serializers import (
    MasteryListSerializer, MasteryDetailSerializer,
    ModuleSerializer, LessonSerializer, ResourceSerializer,
)


def _ownership(request, mastery):
    return mastery.owner_id == request.user.id


VALID_RESOURCE_TYPES = {t[0] for t in Resource.TYPE_CHOICES}


class MasteryViewSet(generics.GenericAPIView):
    """list/create/retrieve/update/delete with object-level ownership."""
    queryset = Mastery.objects.all()

    def get_serializer_class(self):
        if self.request.method == "GET" and self.kwargs.get("pk"):
            return MasteryDetailSerializer
        return MasteryListSerializer

    def get_queryset(self):
        return Mastery.objects.filter(owner=self.request.user)

    def get_object(self):
        obj = Mastery.objects.get(pk=self.kwargs["pk"])
        if not _ownership(self.request, obj):
            from django.http import Http404
            raise Http404
        return obj

    def get(self, request, pk=None):
        if pk:
            return Response(MasteryDetailSerializer(self.get_object()).data)
        qs = self.get_queryset().order_by("-created_at")
        page = self.paginate_queryset(qs)
        return self.get_paginated_response(MasteryListSerializer(page, many=True).data)

    def post(self, request):
        ser = MasteryListSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        mastery = Mastery(owner=request.user, **ser.validated_data)
        mastery.save()
        return Response(MasteryDetailSerializer(mastery).data, status=status.HTTP_201_CREATED)

    def patch(self, request, pk):
        mastery = self.get_object()
        ser = MasteryListSerializer(mastery, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(MasteryDetailSerializer(mastery).data)

    def delete(self, request, pk):
        mastery = self.get_object()
        mastery.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AddModuleView(APIView):
    def post(self, request, pk):
        mastery = Mastery.objects.get(pk=pk)
        if not _ownership(request, mastery):
            return Response({"detail": "forbidden"}, status=403)
        order = mastery.modules.count() + 1
        mod = Module.objects.create(
            mastery=mastery, title=request.data.get("title", "Untitled Module"), order=order)
        return Response(ModuleSerializer(mod).data, status=201)


class ReorderModulesView(APIView):
    def patch(self, request, pk):
        mastery = Mastery.objects.get(pk=pk)
        if not _ownership(request, mastery):
            return Response({"detail": "forbidden"}, status=403)
        for item in request.data.get("order", []):
            Module.objects.filter(pk=item["id"], mastery=mastery).update(order=item["order"])
        return Response({"detail": "ok"})


class AddLessonView(APIView):
    def post(self, request, pk):
        module = Module.objects.get(pk=pk)
        if not _ownership(request, module.mastery):
            return Response({"detail": "forbidden"}, status=403)
        order = module.lessons.count() + 1
        lesson = Lesson.objects.create(
            module=module, title=request.data.get("title", "Untitled Lesson"), order=order)
        return Response(LessonSerializer(lesson).data, status=201)


class ReorderLessonsView(APIView):
    def patch(self, request, pk):
        module = Module.objects.get(pk=pk)
        if not _ownership(request, module.mastery):
            return Response({"detail": "forbidden"}, status=403)
        for item in request.data.get("order", []):
            Lesson.objects.filter(pk=item["id"], module=module).update(order=item["order"])
        return Response({"detail": "ok"})


class DeleteModuleView(APIView):
    def delete(self, request, pk):
        module = Module.objects.get(pk=pk)
        if not _ownership(request, module.mastery):
            return Response({"detail": "forbidden"}, status=403)
        module.delete()
        return Response(status=204)


class DeleteLessonView(APIView):
    def delete(self, request, pk):
        lesson = Lesson.objects.get(pk=pk)
        if not _ownership(request, lesson.module.mastery):
            return Response({"detail": "forbidden"}, status=403)
        lesson.delete()
        return Response(status=204)


class AttachResourceView(APIView):
    def post(self, request, pk):
        lesson = Lesson.objects.get(pk=pk)
        if not _ownership(request, lesson.module.mastery):
            return Response({"detail": "forbidden"}, status=403)
        rtype = (request.data.get("type") or "youtube").strip().lower()
        if rtype not in VALID_RESOURCE_TYPES:
            return Response(
                {"detail": f"invalid type '{rtype}'. allowed: {sorted(VALID_RESOURCE_TYPES)}"},
                status=400,
            )
        data = {
            "lesson": lesson,
            "type": rtype,
            "order": lesson.resources.count() + 1,
            "external_url": request.data.get("external_url", ""),
            "title": request.data.get("title", ""),
            "thumbnail_url": request.data.get("thumbnail_url", ""),
            "duration_seconds": request.data.get("duration_seconds") or 0,
            "youtube_video_id": request.data.get("youtube_video_id", ""),
            "channel_name": request.data.get("channel_name", ""),
            "channel_id": request.data.get("channel_id", ""),
        }
        res = Resource.objects.create(**data)
        return Response(ResourceSerializer(res).data, status=201)


class LessonEnrichView(APIView):
    """PATCH a Lesson's project_prompt and/or quiz_json (Phase 3 enrichment)."""

    def patch(self, request, pk):
        lesson = Lesson.objects.get(pk=pk)
        if not _ownership(request, lesson.module.mastery):
            return Response({"detail": "forbidden"}, status=403)
        if "project_prompt" in request.data:
            lesson.project_prompt = request.data["project_prompt"]
        if "quiz_json" in request.data:
            quiz = request.data["quiz_json"]
            if quiz is not None and not isinstance(quiz, (list, dict)):
                return Response({"detail": "quiz_json must be an object or array"}, status=400)
            lesson.quiz_json = quiz
        lesson.save()
        return Response(LessonSerializer(lesson).data)


class ForkMasteryView(APIView):
    """Deep-copy a public/unlisted Mastery (modules/lessons/resources) to the
    requesting user as a new private Mastery (Phase 4 social/fork)."""

    def post(self, request, pk):
        source = Mastery.objects.filter(pk=pk).first()
        if not source:
            return Response({"detail": "not found"}, status=404)
        if source.visibility == "private" and source.owner_id != request.user.id:
            return Response({"detail": "forbidden"}, status=403)
        new = Mastery.objects.create(
            owner=request.user,
            title=source.title,
            description=source.description,
            goal_statement=source.goal_statement,
            cover_image_url=source.cover_image_url,
            visibility="private",
            forked_from=source,
        )
        for mod in source.modules.all():
            nm = Module.objects.create(mastery=new, title=mod.title, order=mod.order)
            for les in mod.lessons.all():
                nl = Lesson.objects.create(
                    module=nm, title=les.title, order=les.order,
                    project_prompt=les.project_prompt, quiz_json=les.quiz_json,
                )
                for r in les.resources.all():
                    Resource.objects.create(
                        lesson=nl, type=r.type, order=r.order,
                        external_url=r.external_url, title=r.title,
                        thumbnail_url=r.thumbnail_url, duration_seconds=r.duration_seconds,
                        youtube_video_id=r.youtube_video_id, channel_name=r.channel_name,
                        channel_id=r.channel_id,
                    )
        return Response(MasteryDetailSerializer(new).data, status=201)
