from django.urls import path
from . import views as pviews
from masteries.views import (
    DeleteLessonView, AttachResourceView, AddLessonView, ReorderLessonsView,
    LessonEnrichView,
)

urlpatterns = [
    path("<uuid:pk>/", DeleteLessonView.as_view()),
    path("<uuid:pk>/resources/", AttachResourceView.as_view()),
    path("<uuid:pk>/progress/", pviews.LessonProgressView.as_view()),
    path("<uuid:pk>/notes/", pviews.LessonNotesView.as_view()),
    path("<uuid:pk>/enrich/", LessonEnrichView.as_view()),
]
